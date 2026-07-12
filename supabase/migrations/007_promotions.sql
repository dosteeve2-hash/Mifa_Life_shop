create table if not exists promotions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text not null,
  type_reduction text not null check (type_reduction in ('pourcentage','montant_fixe','livraison_gratuite')),
  valeur numeric not null,
  min_commande numeric default 0,
  nb_utilisations_max integer,
  nb_utilisations_actuelles integer default 0,
  date_debut timestamptz not null,
  date_fin timestamptz,
  actif boolean default true,
  created_at timestamptz default now()
);

alter table promotions enable row level security;

create policy "public_read_promotions" on promotions for select using (actif = true);
