# Data Readiness Plan (BC -> PostgreSQL -> Chatbot)

## 1) Goal
Build a reliable data pipeline that preserves all available information from the 4 source files, creates clean relational tables for chatbot use, and keeps full raw history for audit/debug.

This plan prepares data first. Code adaptation happens after data quality gates pass.

---

## 2) Source Files and Roles
Use all 4 files, but with strict roles.

1. `prod.csv`
- Primary item export (already narrowed to needed item columns).
- Main source for parts import.

2. `item_prod.csv`
- Field dictionary/metadata (Business Central field map).
- Not business data rows.

3. `Liste des articles CARPRO.xlsx`
- Secondary item source for reconciliation, missing fields, and sanity checks.
- Keep full raw import for traceability.

4. `Liste de vehicules CARPRO.xlsx`
- Primary vehicle source for VIN/immatriculation workflows.

---

## 3) Keep or Delete Existing PostgreSQL Data?
Do NOT delete current data now.

Use a controlled migration pattern:
1. Keep current tables as legacy snapshot.
2. Build new pipeline tables (`raw_*`, `core_*`, `fitment_*`).
3. Compare old vs new results.
4. Cut over only after validation.
5. Archive old tables after successful cutover.

Recommended:
- Keep legacy for at least 30 days after go-live.
- Add `source_batch_id` and timestamps to all new tables.

---

## 4) Database Choice
Keep PostgreSQL.

Reason:
- You need strong relations (item <-> vehicle <-> model fitment).
- You already run backend + Prisma on PostgreSQL.
- PostgreSQL + JSONB gives relational + flexible raw storage.

Do NOT switch to MongoDB for this phase.

---

## 5) Target Architecture (ASCII)

```text
+-----------------------+      +------------------------+
|  Source Files         |      |  Field Dictionary      |
|  prod.csv             |      |  item_prod.csv         |
|  articles.xlsx        |      +-----------+------------+
|  vehicles.xlsx        |                  |
+-----------+-----------+                  v
            |                    +------------------------+
            | parse/normalize    |  metadata.field_map    |
            v                    +------------------------+
+---------------------------+
|  RAW LAYER (no data loss) |
|  raw.items_prod_csv       |
|  raw.items_articles_xlsx  |
|  raw.vehicles_xlsx        |
|  raw.ingest_batch         |
+-------------+-------------+
              |
              | standardize + dedupe + enrich
              v
+---------------------------+
|  CORE LAYER               |
|  core.items               |
|  core.vehicles            |
|  core.model_alias         |
+-------------+-------------+
              |
              | relation scoring
              v
+---------------------------+
|  RELATION LAYER           |
|  rel.item_vehicle_fitment |
|  rel.fitment_confidence   |
+-------------+-------------+
              |
              | publish
              v
+---------------------------+
|  CHATBOT READ LAYER       |
|  mart.chatbot_parts       |
|  mart.chatbot_vehicles    |
+---------------------------+
```

---

## 6) Data Model (Recommended)

## 6.1 Ingestion/Audit
1. `raw.ingest_batch`
- `batch_id` (uuid, pk)
- `source_name` (prod_csv, articles_xlsx, vehicles_xlsx, item_dict_csv)
- `source_file`
- `file_hash`
- `row_count`
- `loaded_at`
- `status`
- `notes`

2. `raw.ingest_rejects`
- `batch_id`
- `source_name`
- `row_number`
- `raw_payload` (jsonb)
- `reject_reason`
- `created_at`

## 6.2 Raw tables (store full row)
1. `raw.items_prod_csv`
- `batch_id`
- `row_number`
- `reference_raw`
- `designation_raw`
- `unit_price_raw`
- `make_code_raw`
- `model_code_raw`
- `version_raw`
- `stock_raw`
- `raw_payload` (jsonb)

2. `raw.items_articles_xlsx`
- `batch_id`
- `row_number`
- key raw columns (`No`, `Description`, `Description2`, `Code marque`, `Prix unitaire`, `Stocks`, `Stock consolide`, ...)
- `raw_payload` (jsonb)

3. `raw.vehicles_xlsx`
- `batch_id`
- `row_number`
- `vin_raw`
- `serial_no_raw`
- `make_code_raw`
- `model_code_raw`
- `immat_raw`
- `type_vehicule_raw`
- `type_mine_raw`
- `status_raw`
- `raw_payload` (jsonb)

## 6.3 Core normalized tables
1. `core.items`
- `item_id` (bigserial pk)
- `reference` (text, unique)
- `reference_norm`
- `designation`
- `designation2`
- `search_designation`
- `make_code`
- `model_code_raw`
- `model_code_norm`
- `version_raw`
- `unit_price` (numeric)
- `stock_consolide` (numeric)
- `stock` (numeric)
- `effective_stock` (numeric)
- `blocked` (boolean)
- `last_modified_date`
- `source_priority`
- `source_batch_id`
- `created_at`
- `updated_at`

2. `core.vehicles`
- `vehicle_id` (bigserial pk)
- `vin` (text, unique when not null)
- `vin_norm`
- `serial_no`
- `immatriculation`
- `immat_norm`
- `make_code`
- `model_code_raw`
- `model_code_norm`
- `type_vehicule`
- `type_mine`
- `status_code`
- `available_for_sale` (boolean)
- `delivery_date`
- `source_batch_id`
- `created_at`
- `updated_at`

3. `core.model_alias`
- `alias` (pk)
- `normalized_model`
- `brand`

Example aliases:
- `NEW CIAZ` -> `CIAZ`
- `NEW CELERIO POP 6AB` -> `CELERIO`
- `SWIFT IV` -> `SWIFT`
- `JIMNY 5D AT` -> `JIMNY`
- `FRONX` -> `FRONX`

## 6.4 Relation table
1. `rel.item_vehicle_fitment`
- `fitment_id` (bigserial pk)
- `item_id`
- `vehicle_id` (nullable for model-level links)
- `make_code`
- `model_code_norm`
- `type_vehicule`
- `version_raw`
- `match_rule` (exact_model, exact_type_vehicule, alias_match, text_inference, manual)
- `confidence` (HIGH, MEDIUM, LOW)
- `is_active`
- `source_batch_id`
- `created_at`

---

## 7) Conversion Rules (XLSX -> CSV -> PostgreSQL)

1. Convert XLSX to UTF-8 CSV with explicit delimiter and quotes.
2. Preserve original values exactly in raw payload.
3. Normalize into typed core fields.

Critical normalization:
- Trim spaces.
- Normalize separators (comma decimal -> numeric).
- Keep both original and normalized values.
- Preserve special chars in designation; use a normalized helper column for search.

---

## 8) Duplicate Handling Strategy

## 8.1 Items dedupe key
Primary key: `reference_norm`.

Merge preference order:
1. Row with non-null designation.
2. Row with non-null unit_price.
3. Row with higher information completeness score.
4. Most recent `last_modified_date`.
5. Preferred source order: `prod.csv` > `articles.xlsx`.

Keep dropped duplicates in `audit.items_dedup_log`.

## 8.2 Vehicles dedupe key
Primary key priority:
1. `vin_norm` if present.
2. Else `immat_norm`.

If conflict:
- Keep most complete row.
- Log all conflicts in `audit.vehicles_conflict_log`.

---

## 9) Stock Logic
Because `Stock consolide` may be unreliable/zero-heavy:

`effective_stock =`
1. `stock_consolide` when > 0
2. else `stock` when > 0
3. else `0` and set `stock_quality_flag = 'LOW_CONFIDENCE'`

Never drop rows only because stock is zero.

---

## 10) ETL Implementation
Use local Python scripts (not Colab) for reproducible pipeline.

Suggested structure:

```text
scripts/etl/
  01_profile_sources.py
  02_load_raw.py
  03_normalize_core.py
  04_build_fitment.py
  05_publish_mart.py
  06_quality_checks.py
  config.yaml
```

Libraries:
- `pandas`
- `openpyxl`
- `sqlalchemy`
- `psycopg2-binary`
- optional `rapidfuzz`

---

## 11) Quality Gates (must pass before code adaptation)

1. Row counts
- raw imported counts match source file counts.

2. Null checks
- `core.items.reference` null rate = 0.
- `core.vehicles` has VIN or immat for most records.

3. Price checks
- `% items with unit_price > 0` tracked and accepted.

4. Stock checks
- Distribution of `stock_consolide`, `stock`, `effective_stock` reviewed.

5. Relation checks
- `% items with model mapping`
- `% vehicles with normalized model`
- `% fitments HIGH confidence`

6. Search sanity sample
- 30 representative part queries return expected results.

---

## 12) Cutover Plan

1. Keep current chatbot tables untouched.
2. Build new mart tables in parallel.
3. Validate with QA queries.
4. Switch backend to new mart using feature flag.
5. Monitor 48-72h.
6. Archive old tables, do not hard-delete immediately.

---

## 13) Decision Summary

1. Use all 4 files: YES.
2. Convert XLSX to CSV for ETL: YES.
3. Keep PostgreSQL (no Mongo switch): YES.
4. Build local Python ETL for full pipeline: YES.
5. Keep existing DB data during migration: YES.
6. Delete old data immediately: NO.

---

## 14) Immediate Next Actions

1. Freeze current DB state (backup + table counts).
2. Create `raw/core/rel/mart/audit` schemas.
3. Implement `01_profile_sources.py` and validate file quality.
4. Load all 4 sources into raw layer.
5. Build normalized core tables and dedupe logs.
6. Build fitment relations with confidence scoring.
7. Run quality gates and sign-off.
8. Start backend code adaptation only after gate pass.
