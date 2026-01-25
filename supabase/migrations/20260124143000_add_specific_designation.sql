-- Add specific_designation column for strict legal classification
alter table public.variants 
add column if not exists specific_designation text;

-- existing 'type' column will be used for 'Variety/Method' (e.g. Nama, Nigori)
