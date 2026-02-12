-- Fix security_definer_view warnings by explicitly setting security_invoker = true
-- Postgres default is security_invoker = false (which acts like SECURITY DEFINER).
-- We need to enable security_invoker to ensure RLS policies on underlying tables are enforced for the querying user.

CREATE OR REPLACE VIEW public.view_user_variant_counts WITH (security_invoker = true) AS
SELECT
  user_id,
  variant_id,
  count(*) as count
FROM public.drink_logs
GROUP BY user_id, variant_id;

CREATE OR REPLACE VIEW public.view_user_brand_counts WITH (security_invoker = true) AS
SELECT
  l.user_id,
  v.brand_id,
  count(*) as count
FROM public.drink_logs l
JOIN public.variants v ON l.variant_id = v.id
GROUP BY l.user_id, v.brand_id;

CREATE OR REPLACE VIEW public.view_user_variant_rating_avg WITH (security_invoker = true) AS
SELECT
  user_id,
  variant_id,
  avg(rating)::numeric(10,2) as avg_rating
FROM public.drink_logs
GROUP BY user_id, variant_id;

CREATE OR REPLACE VIEW public.view_public_variant_counts WITH (security_invoker = true) AS
SELECT
  variant_id,
  count(*) as count
FROM public.drink_logs
WHERE is_public = true
GROUP BY variant_id;
