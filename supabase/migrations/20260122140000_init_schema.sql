-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 5.1 Masters
create table public.prefectures (
  code text primary key,
  name text not null
);

create table public.breweries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  prefecture_code text references public.prefectures(code),
  website_url text,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5.2 Brands & Variants
create table public.brands (
  id uuid primary key default uuid_generate_v4(),
  brewery_id uuid references public.breweries(id) not null,
  name text not null,
  kana text,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.variants (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid references public.brands(id) not null,
  name text not null,
  abv numeric,
  rice_polishing_ratio numeric,
  notes text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5.3 Tags
create table public.tags (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  slug text unique,
  created_at timestamptz default now()
);

create table public.brand_tags (
  brand_id uuid references public.brands(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (brand_id, tag_id)
);

create table public.variant_tags (
  variant_id uuid references public.variants(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (variant_id, tag_id)
);

-- 5.4 Drink Logs
create table public.drink_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  variant_id uuid references public.variants(id) not null,
  drank_on date not null,
  rating int not null check (rating between 1 and 10),
  impression text,
  aroma text,
  taste text,
  photo_url text,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5.5 Pro Ratings
create table public.rating_sources (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  url text,
  created_at timestamptz default now()
);

create table public.pro_ratings (
  id uuid primary key default uuid_generate_v4(),
  variant_id uuid references public.variants(id) not null,
  source_id uuid references public.rating_sources(id) not null,
  score numeric not null,
  score_max numeric,
  published_at date,
  reference_url text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(variant_id, source_id, reference_url)
);

-- Profiles (for admin check)
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup (trigger)
-- Note: Security Definer allows it to insert into public.profiles even if anon might not have write access directly
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
