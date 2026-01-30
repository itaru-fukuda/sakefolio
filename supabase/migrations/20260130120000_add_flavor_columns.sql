-- Add new columns for extended flavor tags
ALTER TABLE drink_logs
ADD COLUMN IF NOT EXISTS feature text, -- その他特徴
ADD COLUMN IF NOT EXISTS texture text, -- 質感・余韻
ADD COLUMN IF NOT EXISTS temperature text; -- 温度帯

-- Comment on columns
COMMENT ON COLUMN drink_logs.feature IS 'Other features (comma separated)';
COMMENT ON COLUMN drink_logs.texture IS 'Texture and Finish (comma separated)';
COMMENT ON COLUMN drink_logs.temperature IS 'Temperature zone (comma separated)';
