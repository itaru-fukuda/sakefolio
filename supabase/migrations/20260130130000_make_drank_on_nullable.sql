-- Make drank_on nullable to support unknown dates
ALTER TABLE drink_logs
ALTER COLUMN drank_on DROP NOT NULL;
