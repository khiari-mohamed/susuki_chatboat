import argparse
import csv
import hashlib
import re
import unicodedata
import uuid

import yaml
import psycopg2
from psycopg2.extras import execute_batch, Json

def file_hash(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def norm_header(s):
    if s is None:
        return ""
    s = s.replace("\ufeff", "").replace("\u00a0", " ")
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = s.lower()
    s = re.sub(r"[^a-z0-9 ]+", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

def clean(v):
    if v is None:
        return None
    v = v.strip()
    return v if v != "" else None

def insert_reject(cur, batch_id, source_name, row_number, row, reason):
    payload = {"row": row, "reason": reason}
    cur.execute(
        "INSERT INTO raw.ingest_rejects (batch_id, source_name, row_number, raw_payload, reject_reason) "
        "VALUES (%s, %s, %s, %s, %s)",
        (batch_id, source_name, row_number, Json(payload), reason),
    )

def load_prod(cur, batch_id, path):
    cols = ["reference", "designation", "unit_price", "make_code", "model_code", "version", "a_scanner_cb"]
    sql = """
    INSERT INTO raw.items_prod_csv
    (batch_id, row_number, reference_raw, designation_raw, unit_price_raw,
     make_code_raw, model_code_raw, version_raw, a_scanner_cb_raw, raw_payload)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """
    rows = []
    row_count = 0

    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.reader(f, delimiter=";")
        for i, row in enumerate(reader, start=1):
            if len(row) != len(cols):
                insert_reject(cur, batch_id, "prod_csv", i, row, "column_count_mismatch")
                continue
            payload = dict(zip(cols, row))
            rows.append((
                batch_id, i,
                clean(row[0]), clean(row[1]), clean(row[2]),
                clean(row[3]), clean(row[4]), clean(row[5]), clean(row[6]),
                Json(payload)
            ))
            row_count += 1
            if len(rows) >= 1000:
                execute_batch(cur, sql, rows, page_size=1000)
                rows = []
    if rows:
        execute_batch(cur, sql, rows, page_size=1000)
    return row_count

def load_articles(cur, batch_id, path):
    sql = """
    INSERT INTO raw.items_articles_xlsx
    (batch_id, row_number, no_raw, description_raw, description2_raw, make_code_raw,
     unit_price_raw, stock_raw, stock_consolide_raw, last_modified_raw, blocked_raw, raw_payload)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """
    rows = []
    row_count = 0

    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.reader(f, delimiter=";")
        header = next(reader, [])
        hmap = {norm_header(h): idx for idx, h in enumerate(header)}

        def get(row, key):
            idx = hmap.get(key)
            return clean(row[idx]) if idx is not None and idx < len(row) else None

        for i, row in enumerate(reader, start=1):
            if len(row) < len(header):
                row = row + [""] * (len(header) - len(row))
            payload = {header[idx]: row[idx] for idx in range(len(header))}

            rows.append((
                batch_id, i,
                get(row, "n"),
                get(row, "designation"),
                get(row, "designation 2"),
                get(row, "code marque"),
                get(row, "prix unitaire"),
                get(row, "stocks"),
                get(row, "stock consolide"),
                get(row, "date dern modification"),
                get(row, "bloque"),
                Json(payload)
            ))
            row_count += 1
            if len(rows) >= 1000:
                execute_batch(cur, sql, rows, page_size=1000)
                rows = []
    if rows:
        execute_batch(cur, sql, rows, page_size=1000)
    return row_count

def load_vehicles(cur, batch_id, path):
    sql = """
    INSERT INTO raw.vehicles_xlsx
    (batch_id, row_number, vin_raw, serial_no_raw, make_code_raw, model_code_raw,
     immat_raw, type_vehicule_raw, type_mine_raw, status_raw, delivery_date_raw, raw_payload)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """
    rows = []
    row_count = 0

    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.reader(f, delimiter=";")
        header = next(reader, [])
        hmap = {norm_header(h): idx for idx, h in enumerate(header)}

        def get(row, key):
            idx = hmap.get(key)
            return clean(row[idx]) if idx is not None and idx < len(row) else None

        for i, row in enumerate(reader, start=1):
            if len(row) < len(header):
                row = row + [""] * (len(header) - len(row))
            payload = {header[idx]: row[idx] for idx in range(len(header))}

            rows.append((
                batch_id, i,
                get(row, "vin"),
                get(row, "n de serie"),
                get(row, "code marque"),
                get(row, "code modele"),
                get(row, "n immatriculation"),
                get(row, "type vehicule"),
                get(row, "type mine"),
                get(row, "code statut"),
                get(row, "date de livraison"),
                Json(payload)
            ))
            row_count += 1
            if len(rows) >= 1000:
                execute_batch(cur, sql, rows, page_size=1000)
                rows = []
    if rows:
        execute_batch(cur, sql, rows, page_size=1000)
    return row_count

def load_field_map(cur, path):
    sql = """
    INSERT INTO metadata.field_map
    (enabled, field_no, field_name, caption, data_type, length, description, field_class, option_string)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """
    rows = []

    with open(path, newline="", encoding="latin-1") as f:
        reader = csv.reader(f, delimiter=";")
        next(reader, None)  # header
        for row in reader:
            if len(row) < 9:
                row = row + [""] * (9 - len(row))
            rows.append((
                clean(row[0]), clean(row[1]), clean(row[2]), clean(row[3]),
                clean(row[4]), clean(row[5]), clean(row[6]), clean(row[7]), clean(row[8]),
            ))
            if len(rows) >= 1000:
                execute_batch(cur, sql, rows, page_size=1000)
                rows = []
    if rows:
        execute_batch(cur, sql, rows, page_size=1000)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True)
    args = ap.parse_args()

    cfg = yaml.safe_load(open(args.config, "r", encoding="utf-8"))
    db = cfg["db"]
    paths = cfg["paths"]

    conn = psycopg2.connect(
        host=db["host"], port=db["port"], dbname=db["name"], user=db["user"], password=db["password"]
    )
    conn.autocommit = False

    with conn:
        with conn.cursor() as cur:
            # prod.csv
            batch_id = str(uuid.uuid4())
            cur.execute(
                "INSERT INTO raw.ingest_batch (batch_id, source_name, source_file, file_hash, status) "
                "VALUES (%s,%s,%s,%s,%s)",
                (batch_id, "prod_csv", paths["prod_csv"], file_hash(paths["prod_csv"]), "STARTED"),
            )
            count = load_prod(cur, batch_id, paths["prod_csv"])
            cur.execute(
                "UPDATE raw.ingest_batch SET row_count=%s, status=%s WHERE batch_id=%s",
                (count, "LOADED", batch_id),
            )

            # articles.csv
            batch_id = str(uuid.uuid4())
            cur.execute(
                "INSERT INTO raw.ingest_batch (batch_id, source_name, source_file, file_hash, status) "
                "VALUES (%s,%s,%s,%s,%s)",
                (batch_id, "articles_csv", paths["articles_csv"], file_hash(paths["articles_csv"]), "STARTED"),
            )
            count = load_articles(cur, batch_id, paths["articles_csv"])
            cur.execute(
                "UPDATE raw.ingest_batch SET row_count=%s, status=%s WHERE batch_id=%s",
                (count, "LOADED", batch_id),
            )

            # vehicles.csv
            batch_id = str(uuid.uuid4())
            cur.execute(
                "INSERT INTO raw.ingest_batch (batch_id, source_name, source_file, file_hash, status) "
                "VALUES (%s,%s,%s,%s,%s)",
                (batch_id, "vehicles_csv", paths["vehicles_csv"], file_hash(paths["vehicles_csv"]), "STARTED"),
            )
            count = load_vehicles(cur, batch_id, paths["vehicles_csv"])
            cur.execute(
                "UPDATE raw.ingest_batch SET row_count=%s, status=%s WHERE batch_id=%s",
                (count, "LOADED", batch_id),
            )

            # item_prod.csv
            load_field_map(cur, paths["item_prod_csv"])

    conn.close()

if __name__ == "__main__":
    main()
