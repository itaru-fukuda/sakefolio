-- Add is_active column to breweries table for soft delete
alter table public.breweries
add column is_active boolean default true not null;

-- Index for performance since we will filter by this often
create index idx_breweries_is_active on public.breweries(is_active);
