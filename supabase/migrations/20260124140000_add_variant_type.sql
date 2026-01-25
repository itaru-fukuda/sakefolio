-- Add type column to variants for specific designation (e.g. Junmai Ginjo)
alter table public.variants 
add column if not exists type text;
