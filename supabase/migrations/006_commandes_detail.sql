-- Migration 006 : Table commandes_items pour le détail des lignes commande
-- Branche : feat/commandes

create table if not exists commandes_items (
  id uuid primary key default gen_random_uuid(),
  commande_id uuid references commandes(id) on delete cascade,
  produit_nom text not null,
  produit_image text,
  quantite integer not null,
  prix_unitaire numeric not null,
  created_at timestamptz default now()
);

alter table commandes_items enable row level security;

create policy "user_commandes_items" on commandes_items for select
  using (
    exists (
      select 1 from commandes c
      where c.id = commande_id
        and c.user_id = auth.uid()
    )
  );
