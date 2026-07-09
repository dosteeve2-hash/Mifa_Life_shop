-- Migration 008 : table profils utilisateur
-- Créée le 2026-07-09

create table if not exists public.profils (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique not null,
  prenom text,
  nom text,
  telephone text,
  adresse_ligne1 text,
  adresse_ligne2 text,
  ville text,
  pays text default 'Côte d''Ivoire',
  code_postal text,
  avatar_url text,
  preferences jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profils enable row level security;

create policy "profils_user" on public.profils
  for all
  using (auth.uid() = user_id);
