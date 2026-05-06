-- Enable pg_trgm extension for trigram-based text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add GIN trigram indexes for ILIKE/contains queries on designation and reference
-- These indexes dramatically improve performance for case-insensitive partial text searches
CREATE INDEX IF NOT EXISTS parts_designation_trgm_idx ON parts USING gin (designation gin_trgm_ops);
CREATE INDEX IF NOT EXISTS parts_reference_trgm_idx ON parts USING gin (reference gin_trgm_ops);
