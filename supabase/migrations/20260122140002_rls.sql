-- Helper function for admin check
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Enable RLS on all tables
alter table public.prefectures enable row level security;
alter table public.breweries enable row level security;
alter table public.brands enable row level security;
alter table public.variants enable row level security;
alter table public.tags enable row level security;
alter table public.brand_tags enable row level security;
alter table public.variant_tags enable row level security;
alter table public.drink_logs enable row level security;
alter table public.rating_sources enable row level security;
alter table public.pro_ratings enable row level security;
alter table public.profiles enable row level security;

-- Public Read Tables (Master Data)
create policy "Public read prefectures" on public.prefectures for select using (true);
create policy "Public read breweries" on public.breweries for select using (true);
create policy "Public read brands" on public.brands for select using (true);
create policy "Public read variants" on public.variants for select using (true);
create policy "Public read tags" on public.tags for select using (true);
create policy "Public read brand_tags" on public.brand_tags for select using (true);
create policy "Public read variant_tags" on public.variant_tags for select using (true);
create policy "Public read rating_sources" on public.rating_sources for select using (true);

-- Pro Ratings (Public Read, Admin Write)
create policy "Public read pro_ratings" on public.pro_ratings for select using (true);
create policy "Admin all pro_ratings" on public.pro_ratings for all using (public.is_admin());

-- Drink Logs (Owner CRUD, Public Read if Shared)
create policy "Users can view own or public logs" on public.drink_logs for select
  using (auth.uid() = user_id or is_public = true);

create policy "Users can insert own logs" on public.drink_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own logs" on public.drink_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own logs" on public.drink_logs for delete
  using (auth.uid() = user_id);

-- Profiles (Public Read, Owner Update)
create policy "Public read profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = user_id);
-- Note: Insert is handled by trigger, which is server-side (bypass RLS) or security definer
