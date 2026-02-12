-- Fix security_definer_view warnings
-- Explicitly recreate views. In Postgres 15+, views are SECURITY INVOKER by default.
-- If they were flagged, they might have been created by a role that defaulted to SECURITY DEFINER or altered.
-- We will drop and recreate them to ensure they are standard views (SECURITY INVOKER).

DROP VIEW IF EXISTS public.view_user_variant_counts;
CREATE VIEW public.view_user_variant_counts AS
SELECT
  user_id,
  variant_id,
  count(*) as count
FROM public.drink_logs
GROUP BY user_id, variant_id;

DROP VIEW IF EXISTS public.view_user_brand_counts;
CREATE VIEW public.view_user_brand_counts AS
SELECT
  l.user_id,
  v.brand_id,
  count(*) as count
FROM public.drink_logs l
JOIN public.variants v ON l.variant_id = v.id
GROUP BY l.user_id, v.brand_id;

DROP VIEW IF EXISTS public.view_user_variant_rating_avg;
CREATE VIEW public.view_user_variant_rating_avg AS
SELECT
  user_id,
  variant_id,
  avg(rating)::numeric(10,2) as avg_rating
FROM public.drink_logs
GROUP BY user_id, variant_id;

DROP VIEW IF EXISTS public.view_public_variant_counts;
CREATE VIEW public.view_public_variant_counts AS
SELECT
  variant_id,
  count(*) as count
FROM public.drink_logs
WHERE is_public = true
GROUP BY variant_id;

-- Fix rls_disabled_in_public for Sakenowa tables
ALTER TABLE public.sakenowa_flavor_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sakenowa_brand_flavor_tags ENABLE ROW LEVEL SECURITY;

-- Create Public Read policies for Sakenowa tables
CREATE POLICY "Public read sakenowa_flavor_tags" ON public.sakenowa_flavor_tags FOR SELECT USING (true);
CREATE POLICY "Public read sakenowa_brand_flavor_tags" ON public.sakenowa_brand_flavor_tags FOR SELECT USING (true);
