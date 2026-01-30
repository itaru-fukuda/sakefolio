-- Create follows table
create table public.follows (
  follower_id uuid references auth.users(id) on delete cascade not null,
  following_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (follower_id, following_id),
  check (follower_id != following_id)
);

-- Enable RLS
alter table public.follows enable row level security;

-- Policies
create policy "Public follows are viewable by everyone"
  on public.follows for select
  using ( true );

create policy "Users can follow others"
  on public.follows for insert
  with check ( auth.uid() = follower_id );

create policy "Users can unfollow"
  on public.follows for delete
  using ( auth.uid() = follower_id );
