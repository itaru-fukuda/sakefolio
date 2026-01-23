-- View: User Variant Counts
create or replace view public.view_user_variant_counts as
select
  user_id,
  variant_id,
  count(*) as count
from public.drink_logs
group by user_id, variant_id;

-- View: User Brand Counts
create or replace view public.view_user_brand_counts as
select
  l.user_id,
  v.brand_id,
  count(*) as count
from public.drink_logs l
join public.variants v on l.variant_id = v.id
group by l.user_id, v.brand_id;

-- View: User Variant Rating Avg
create or replace view public.view_user_variant_rating_avg as
select
  user_id,
  variant_id,
  avg(rating)::numeric(10,2) as avg_rating
from public.drink_logs
group by user_id, variant_id;

-- View: Public Variant Counts
create or replace view public.view_public_variant_counts as
select
  variant_id,
  count(*) as count
from public.drink_logs
where is_public = true
group by variant_id;
