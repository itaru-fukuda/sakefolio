-- Add sakenowa_id to breweries
ALTER TABLE breweries ADD COLUMN sakenowa_id INTEGER UNIQUE;

-- Add sakenowa_id to brands
ALTER TABLE brands ADD COLUMN sakenowa_id INTEGER UNIQUE;

-- Create index for faster lookups (Optional if UNIQUE creates usage index, but good for explicitness/performance if not unique, but here it is unique)
-- CREATE INDEX idx_breweries_sakenowa_id ON breweries(sakenowa_id); 
-- CREATE INDEX idx_brands_sakenowa_id ON brands(sakenowa_id);
