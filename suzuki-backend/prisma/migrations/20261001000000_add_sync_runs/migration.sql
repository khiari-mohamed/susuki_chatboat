CREATE TABLE IF NOT EXISTS sync_runs (
  id          TEXT PRIMARY KEY,
  trigger     VARCHAR(10) NOT NULL,
  status      VARCHAR(20) NOT NULL,
  started_at  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at TIMESTAMP(3),
  summary     JSONB,
  error       TEXT
);
CREATE INDEX IF NOT EXISTS sync_runs_started_at_idx ON sync_runs (started_at);
