-- Migration 005: Table avis produits avec RLS
create table if not exists avis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  produit_id text not null,
  nom_auteur text not null,
  note integer not null check (note between 1 and 5),
  commentaire text not null,
  created_at timestamptz default now()
);

alter table avis enable row level security;

create policy "public_read_avis" on avis
  for select using (true);

create policy "user_insert_avis" on avis
  for insert with check (auth.uid() = user_id);

create policy "user_delete_avis" on avis
  for delete using (auth.uid() = user_id);
