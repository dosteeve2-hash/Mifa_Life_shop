create table if not exists wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  produit_id text not null,
  nom text not null,
  prix numeric not null,
  image_url text,
  created_at timestamptz default now(),
  unique(user_id, produit_id)
);
alter table wishlist enable row level security;
create policy "user_wishlist" on wishlist for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
