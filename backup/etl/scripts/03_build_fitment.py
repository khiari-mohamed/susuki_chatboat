import argparse
import yaml
import psycopg2

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
                cur.execute("TRUNCATE rel.item_vehicle_fitment;")

            # Rule 1: items with explicit model
            cur.execute(
                """
                INSERT INTO rel.item_vehicle_fitment
                (item_id, vehicle_id, make_code, model_code_norm, type_vehicule, version_raw,
                 match_rule, confidence, source_batch_id)
                SELECT
                  i.item_id,
                  NULL,
                  i.make_code,
                  i.model_code_norm,
                  NULL,
                  i.version_raw,
                  'item_model',
                  'HIGH',
                  i.source_batch_id
                FROM core.items i
                WHERE i.model_code_norm IS NOT NULL
                ON CONFLICT DO NOTHING;
                """
            )

            # Rule 2: items with no model (unknown fitment)
            cur.execute(
                """
                INSERT INTO rel.item_vehicle_fitment
                (item_id, vehicle_id, make_code, model_code_norm, type_vehicule, version_raw,
                 match_rule, confidence, source_batch_id)
                SELECT
                  i.item_id,
                  NULL,
                  i.make_code,
                  NULL,
                  NULL,
                  i.version_raw,
                  'unknown_model',
                  'LOW',
                  i.source_batch_id
                FROM core.items i
                WHERE i.model_code_norm IS NULL
                ON CONFLICT DO NOTHING;
                """
            )

    conn.close()
    print("Fitment build complete")

if __name__ == "__main__":
    main()
