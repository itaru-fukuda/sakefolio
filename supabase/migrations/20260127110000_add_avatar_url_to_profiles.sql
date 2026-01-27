-- Add avatar_url to profiles table
alter table public.profiles
add column avatar_url text;

-- Comment
comment on column public.profiles.avatar_url is 'URL of the selected avatar icon';
