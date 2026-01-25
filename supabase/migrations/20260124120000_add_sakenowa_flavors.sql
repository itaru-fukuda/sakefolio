-- Sakenowa Flavor Tags
create table public.sakenowa_flavor_tags (
  id integer primary key, -- sakenowa tagId
  tag text not null,
  created_at timestamptz default now()
);

-- Link Brands to Sakenowa Flavor Tags
create table public.sakenowa_brand_flavor_tags (
  brand_id uuid references public.brands(id) on delete cascade,
  sakenowa_tag_id integer references public.sakenowa_flavor_tags(id) on delete cascade,
  primary key (brand_id, sakenowa_tag_id)
);

-- Add unique constraint to brands.sakenowa_id if not exists (for upsert reliability)
-- Note: It was originally just int, assuming unique but not constrained in DB (except by index maybe?)
-- Let's enable unique explicitly if we rely on it for UPSERT.
-- But standard "upsert" in Supabase client might work if index exists.
-- Adding a unique index is safer.
create unique index if not exists idx_brands_sakenowa_id_unique on public.brands(sakenowa_id);
