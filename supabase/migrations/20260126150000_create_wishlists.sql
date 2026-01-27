-- Create wishlists table
create table public.wishlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(user_id) on delete cascade not null,
  variant_id uuid references public.variants(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, variant_id)
);

-- Enable RLS
alter table public.wishlists enable row level security;

-- Policies
create policy "Users can view their own wishlist"
  on public.wishlists for select
  using (auth.uid() = user_id);

create policy "Users can insert into their own wishlist"
  on public.wishlists for insert
  with check (auth.uid() = user_id);

create policy "Users can delete from their own wishlist"
  on public.wishlists for delete
  using (auth.uid() = user_id);
