import argparse
import re
import uuid
from decimal import Decimal, InvalidOperation
from datetime import datetime

import yaml
import psycopg2
from psycopg2.extras import execute_batch

def norm_ref(s):
    if not s:
        return None
    return s.strip().upper()

def norm_model(s, alias_map):
    if not s:
        return None
    m = s.strip().upper()
    return alias_map.get(m, m)

def parse_decimal(s):
    if not s:
        return None
    s = s.strip()
    if s == "":
        return None
    s = s.replace("\u00a0", "").replace(" ", "")
    s = s.replace(",", ".")
    s = re.sub(r"[^0-9.\-]", "", s)
    if s in ("", ".", "-", "-."):
        return None
    try:
        return Decimal(s)
    except InvalidOperation:
        return None

def parse_bool(s):
    if s is None:
        return None
    s = s.strip().lower()
    if s in ("1", "true", "vrai", "yes", "y"):
        return True
    if s in ("0", "false", "faux", "no", "n"):
        return False
    return None

def parse_date(s):
    if not s:
        return None
    s = s.strip()
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%d/%m/%Y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            continue
    try:
        return datetime.fromisoformat(s).date()
    except ValueError:
        return None

def latest_batch(cur, source_name):
    cur.execute(
        """
        SELECT batch_id
        FROM raw.ingest_batch
        WHERE source_name = %s AND status = 'LOADED'
        ORDER BY loaded_at DESC
        LIMIT 1
        """,
        (source_name,),
    )
    row = cur.fetchone()
    return row[0] if row else None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True)
    ap.add_argument("--truncate", action="store_true")
    args = ap.parse_args()

    cfg = yaml.safe_load(open(args.config, "r", encoding="utf-8"))
    db = cfg["db"]

    conn = psycopg2.connect(
        host=db["host"], port=db["port"], dbname=db["name"], user=db["user"], password=db["password"]
    )
    conn.autocommit = False

    with conn:
        with conn.cursor() as cur:
            if args.truncate:
                cur.execute("TRUNCATE core.items, core.vehicles;")

            # alias map
            cur.execute("SELECT alias, normalized_model FROM core.model_alias;")
            alias_map = {a.strip().upper(): n.strip().upper() for a, n in cur.fetchall()}

            prod_batch = latest_batch(cur, "prod_csv")
            art_batch = latest_batch(cur, "articles_csv")
            veh_batch = latest_batch(cur, "vehicles_csv")

            if not prod_batch or not art_batch or not veh_batch:
                raise RuntimeError("Missing batch_id(s). Check raw.ingest_batch.")

            # Load prod items
            cur.execute(
                """
                SELECT reference_raw, designation_raw, unit_price_raw, make_code_raw,
                       model_code_raw, version_raw, a_scanner_cb_raw
                FROM raw.items_prod_csv
                WHERE batch_id = %s
                """,
                (prod_batch,),
            )
            items = {}
            for ref, des, price, make, model, ver, cb in cur.fetchall():
                ref_norm = norm_ref(ref)
                if not ref_norm:
                    continue
                items[ref_norm] = {
                    "reference": ref.strip(),
                    "reference_norm": ref_norm,
                    "designation": des,
                    "designation2": None,
                    "search_designation": des,
                    "make_code": make,
                    "model_code_raw": model,
                    "model_code_norm": norm_model(model, alias_map),
                    "version_raw": ver,
                    "unit_price": parse_decimal(price),
                    "stock": None,
                    "stock_consolide": None,
                    "blocked": None,
                    "last_modified_date": None,
                    "a_scanner_cb": parse_bool(cb),
                    "source_priority": 1,
                    "source_batch_id": prod_batch,
                }

            # Load articles items (augment)
            cur.execute(
                """
                SELECT no_raw, description_raw, description2_raw, make_code_raw,
                       unit_price_raw, stock_raw, stock_consolide_raw,
                       last_modified_raw, blocked_raw
                FROM raw.items_articles_xlsx
                WHERE batch_id = %s
                """,
                (art_batch,),
            )
            for ref, des, des2, make, price, stock, stock_c, last_mod, blocked in cur.fetchall():
                ref_norm = norm_ref(ref)
                if not ref_norm:
                    continue
                it = items.get(ref_norm)
                if not it:
                    it = {
                        "reference": ref.strip(),
                        "reference_norm": ref_norm,
                        "designation": None,
                        "designation2": None,
                        "search_designation": None,
                        "make_code": None,
                        "model_code_raw": None,
                        "model_code_norm": None,
                        "version_raw": None,
                        "unit_price": None,
                        "stock": None,
                        "stock_consolide": None,
                        "blocked": None,
                        "last_modified_date": None,
                        "a_scanner_cb": None,
                        "source_priority": 2,
                        "source_batch_id": art_batch,
                    }
                    items[ref_norm] = it

                if not it["designation"] and des:
                    it["designation"] = des
                    it["search_designation"] = des
                if des2:
                    it["designation2"] = des2
                if not it["make_code"] and make:
                    it["make_code"] = make
                if not it["unit_price"] or it["unit_price"] == 0:
                    it["unit_price"] = parse_decimal(price)

                it["stock"] = parse_decimal(stock)
                it["stock_consolide"] = parse_decimal(stock_c)
                it["blocked"] = parse_bool(blocked)
                it["last_modified_date"] = parse_date(last_mod)

            # Compute effective stock + flag
            for it in items.values():
                sc = it["stock_consolide"] or Decimal("0")
                st = it["stock"] or Decimal("0")
                if sc > 0:
                    it["effective_stock"] = sc
                    it["stock_quality_flag"] = "OK"
                elif st > 0:
                    it["effective_stock"] = st
                    it["stock_quality_flag"] = "OK"
                else:
                    it["effective_stock"] = Decimal("0")
                    it["stock_quality_flag"] = "LOW_CONFIDENCE"

            # Upsert core.items
            sql_items = """
            INSERT INTO core.items
            (reference, reference_norm, designation, designation2, search_designation,
             make_code, model_code_raw, model_code_norm, version_raw, unit_price,
             stock_consolide, stock, effective_stock, stock_quality_flag, blocked,
             last_modified_date, a_scanner_cb, source_priority, source_batch_id,
             created_at, updated_at)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,now(),now())
            ON CONFLICT (reference) DO UPDATE SET
              reference_norm = EXCLUDED.reference_norm,
              designation = EXCLUDED.designation,
              designation2 = EXCLUDED.designation2,
              search_designation = EXCLUDED.search_designation,
              make_code = EXCLUDED.make_code,
              model_code_raw = EXCLUDED.model_code_raw,
              model_code_norm = EXCLUDED.model_code_norm,
              version_raw = EXCLUDED.version_raw,
              unit_price = EXCLUDED.unit_price,
              stock_consolide = EXCLUDED.stock_consolide,
              stock = EXCLUDED.stock,
              effective_stock = EXCLUDED.effective_stock,
              stock_quality_flag = EXCLUDED.stock_quality_flag,
              blocked = EXCLUDED.blocked,
              last_modified_date = EXCLUDED.last_modified_date,
              a_scanner_cb = EXCLUDED.a_scanner_cb,
              source_priority = EXCLUDED.source_priority,
              source_batch_id = EXCLUDED.source_batch_id,
              updated_at = now();
            """

            rows = []
            for it in items.values():
                rows.append((
                    it["reference"], it["reference_norm"], it["designation"], it["designation2"],
                    it["search_designation"], it["make_code"], it["model_code_raw"],
                    it["model_code_norm"], it["version_raw"], it["unit_price"],
                    it["stock_consolide"], it["stock"], it["effective_stock"],
                    it["stock_quality_flag"], it["blocked"], it["last_modified_date"],
                    it["a_scanner_cb"], it["source_priority"], it["source_batch_id"]
                ))
            execute_batch(cur, sql_items, rows, page_size=1000)

            # Load vehicles
            cur.execute(
                """
                SELECT vin_raw, serial_no_raw, make_code_raw, model_code_raw, immat_raw,
                       type_vehicule_raw, type_mine_raw, status_raw, delivery_date_raw
                FROM raw.vehicles_xlsx
                WHERE batch_id = %s
                """,
                (veh_batch,),
            )

            sql_vin = """
            INSERT INTO core.vehicles
            (vin, vin_norm, serial_no, immatriculation, immat_norm, make_code,
             model_code_raw, model_code_norm, type_vehicule, type_mine,
             status_code, delivery_date, source_batch_id, created_at, updated_at)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,now(),now())
            ON CONFLICT (vin_norm) DO UPDATE SET
              serial_no = EXCLUDED.serial_no,
              immatriculation = EXCLUDED.immatriculation,
              immat_norm = EXCLUDED.immat_norm,
              make_code = EXCLUDED.make_code,
              model_code_raw = EXCLUDED.model_code_raw,
              model_code_norm = EXCLUDED.model_code_norm,
              type_vehicule = EXCLUDED.type_vehicule,
              type_mine = EXCLUDED.type_mine,
              status_code = EXCLUDED.status_code,
              delivery_date = EXCLUDED.delivery_date,
              source_batch_id = EXCLUDED.source_batch_id,
              updated_at = now();
            """

            sql_immat = """
            INSERT INTO core.vehicles
            (vin, vin_norm, serial_no, immatriculation, immat_norm, make_code,
             model_code_raw, model_code_norm, type_vehicule, type_mine,
             status_code, delivery_date, source_batch_id, created_at, updated_at)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,now(),now())
            ON CONFLICT (immat_norm) DO UPDATE SET
              serial_no = EXCLUDED.serial_no,
              vin = EXCLUDED.vin,
              vin_norm = EXCLUDED.vin_norm,
              make_code = EXCLUDED.make_code,
              model_code_raw = EXCLUDED.model_code_raw,
              model_code_norm = EXCLUDED.model_code_norm,
              type_vehicule = EXCLUDED.type_vehicule,
              type_mine = EXCLUDED.type_mine,
              status_code = EXCLUDED.status_code,
              delivery_date = EXCLUDED.delivery_date,
              source_batch_id = EXCLUDED.source_batch_id,
              updated_at = now();
            """

            for vin, serial, make, model, immat, type_v, type_m, status, deliv in cur.fetchall():
                vin_norm = norm_ref(vin)
                immat_norm = norm_ref(immat)
                row = (
                    vin, vin_norm, serial, immat, immat_norm, make,
                    model, norm_model(model, alias_map), type_v, type_m,
                    status, parse_date(deliv), veh_batch
                )
                if vin_norm:
                    cur.execute(sql_vin, row)
                elif immat_norm:
                    cur.execute(sql_immat, row)

    conn.close()

if __name__ == "__main__":
    main()
