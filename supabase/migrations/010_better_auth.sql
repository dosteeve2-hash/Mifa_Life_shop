-- 010_better_auth.sql
-- Migration de Supabase Auth vers Better Auth.
--
-- Contexte : l'identité ne vient plus de `auth.users`, donc `auth.uid()` renvoie
-- NULL et toute politique RLS qui s'appuie dessus refuserait tout. L'autorisation
-- passe désormais côté serveur (voir src/lib/auth/session.ts) : chaque requête
-- touchant des données personnelles filtre explicitement sur l'id de session.
--
-- ⚠️ Cette migration retire le filet de sécurité au niveau base. Toute requête
-- qui oublierait sa vérification exposerait les données d'autrui.

begin;

-- ── 1. Tables Better Auth ────────────────────────────────────────────────────

create table if not exists "user" (
  id             text primary key,
  name           text,
  email          text not null unique,
  "emailVerified" boolean not null default false,
  image          text,
  "createdAt"    timestamptz not null default now(),
  "updatedAt"    timestamptz not null default now()
);

create table if not exists session (
  id          text primary key,
  "userId"    text not null references "user"(id) on delete cascade,
  token       text not null unique,
  "expiresAt" timestamptz not null,
  "ipAddress" text,
  "userAgent" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create index if not exists session_user_id_idx on session ("userId");
create index if not exists session_token_idx   on session (token);

create table if not exists account (
  id                      text primary key,
  "userId"                text not null references "user"(id) on delete cascade,
  "accountId"             text not null,
  "providerId"            text not null,
  "accessToken"           text,
  "refreshToken"          text,
  "accessTokenExpiresAt"  timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  scope                   text,
  "idToken"               text,
  password                text,
  "createdAt"             timestamptz not null default now(),
  "updatedAt"             timestamptz not null default now()
);
create index if not exists account_user_id_idx on account ("userId");

create table if not exists verification (
  id          text primary key,
  identifier  text not null,
  value       text not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create index if not exists verification_identifier_idx on verification (identifier);

-- ── 2. Retrait des politiques RLS adossées à auth.uid() ──────────────────────
-- Elles refuseraient tout accès puisque auth.uid() est désormais NULL.

-- `public_read_avis` est conservée : elle ne dépend pas de auth.uid().
drop policy if exists "user_insert_avis"      on public.avis;
drop policy if exists "user_delete_avis"      on public.avis;
drop policy if exists "profils_user"          on public.profils;
drop policy if exists "Users manage own prefs" on public.user_preferences;

-- ── 3. Repointage des clés étrangères de auth.users vers "user" ──────────────
-- Les trois tables référençaient auth.users(id) (uuid). Better Auth utilise des
-- id text : on convertit la colonne avant de recréer la contrainte.
-- Sûr ici : ces tables sont vides au moment de la migration.

alter table public.avis             drop constraint if exists avis_user_id_fkey;
alter table public.profils          drop constraint if exists profils_user_id_fkey;
alter table public.user_preferences drop constraint if exists user_preferences_user_id_fkey;

alter table public.avis             alter column user_id type text using user_id::text;
alter table public.profils          alter column user_id type text using user_id::text;
alter table public.user_preferences alter column user_id type text using user_id::text;

alter table public.avis
  add constraint avis_user_id_fkey
  foreign key (user_id) references "user"(id) on delete set null;

alter table public.profils
  add constraint profils_user_id_fkey
  foreign key (user_id) references "user"(id) on delete cascade;

alter table public.user_preferences
  add constraint user_preferences_user_id_fkey
  foreign key (user_id) references "user"(id) on delete cascade;

commit;
