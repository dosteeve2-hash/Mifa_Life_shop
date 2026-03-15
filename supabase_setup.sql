-- ============================================================
-- MIFA LIFE — SUPABASE SETUP
-- Copiez-collez ce script dans Supabase > SQL Editor > New query
-- ============================================================

-- 1. FOURNISSEURS
create table if not exists mifa_suppliers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  country text default 'Chine',
  email text,
  phone text,
  notes text,
  active boolean default true,
  created_at timestamptz default now()
);

-- 2. CATÉGORIES
create table if not exists mifa_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  icon text,
  parent_id uuid references mifa_categories(id),
  sort_order int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- 3. PRODUITS
create table if not exists mifa_products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price int not null,
  original_price int,
  category text,
  subcategory text,
  images text[] default '{}',
  stock int default 0,
  supplier_id uuid references mifa_suppliers(id),
  tags text[] default '{}',
  featured boolean default false,
  active boolean default true,
  shipping_days text default '7-14 jours',
  weight text,
  variants jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. RLS (Row Level Security) — activer la lecture publique
alter table mifa_products enable row level security;
alter table mifa_suppliers enable row level security;
alter table mifa_categories enable row level security;

-- Lecture publique sur les produits actifs
create policy "Public read products" on mifa_products
  for select using (active = true);

-- Écriture complète via anon key (admin panel)
-- Note: en production, utiliser une service_role key pour l'admin
create policy "Admin full access products" on mifa_products
  for all using (true) with check (true);

create policy "Admin full access suppliers" on mifa_suppliers
  for all using (true) with check (true);

create policy "Admin full access categories" on mifa_categories
  for all using (true) with check (true);

-- Lecture publique fournisseurs & catégories
create policy "Public read suppliers" on mifa_suppliers
  for select using (active = true);

create policy "Public read categories" on mifa_categories
  for select using (active = true);

-- 5. BUCKET STORAGE pour les images
-- À créer dans Supabase > Storage > New bucket
-- Nom: mifa-products
-- Public: OUI (cocher "Public bucket")

-- 6. DONNÉES DE DÉMONSTRATION (optionnel)
insert into mifa_categories (name, slug, icon, sort_order) values
  ('Électronique', 'electronique', '💻', 1),
  ('Mode & Vêtements', 'mode', '👗', 2),
  ('Maison & Décor', 'maison', '🏠', 3),
  ('Sport & Fitness', 'sport', '⚽', 4),
  ('Beauté & Santé', 'beaute', '💄', 5),
  ('Enfants & Bébés', 'enfants', '🧸', 6),
  ('Auto & Moto', 'auto', '🚗', 7),
  ('Alimentation', 'alimentation', '🛒', 8)
on conflict (slug) do nothing;

-- ============================================================
-- TERMINÉ. Retournez dans admin.html pour gérer vos produits.
-- ============================================================
