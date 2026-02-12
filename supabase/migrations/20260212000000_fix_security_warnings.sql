-- Fix function_search_path_mutable warning for handle_new_user
-- Explicitly set search_path to public to prevent search path hijacking
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'full_name',
      'User ' || substring(new.id::text from 1 for 4) -- Fallback
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (user_id) DO UPDATE
  SET 
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix function_search_path_mutable warning for is_admin
-- Explicitly set search_path to public
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;
