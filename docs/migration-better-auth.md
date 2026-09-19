# Migration Supabase Auth → Better Auth

## Ce qui change

L'identité ne vient plus de Supabase Auth mais de Better Auth (`better-auth@1.7.5`),
avec le plugin `emailOTP` — le même parcours qu'avant : code à 6 chiffres par e-mail.

| Avant | Après |
|---|---|
| `supabase.auth.getUser()` (Server Components/Actions) | `getCurrentUser()` — `src/lib/auth/session.ts` |
| `sb.auth.getUser()` (composants client) | `authClient.getSession()` — `src/lib/auth/client.ts` |
| `supabase.auth.signInWithOtp()` | `authClient.emailOtp.sendVerificationOtp()` |
| `supabase.auth.verifyOtp()` | `authClient.signIn.emailOtp()` |
| `supabase.auth.signOut()` | `authClient.signOut()` |
| `/auth/callback` (PKCE Supabase) | `/api/auth/*` (supprimée) |

13 appels réécrits : 8 côté serveur, 5 côté client.

## ⚠️ RLS retiré — l'autorisation est désormais votre responsabilité

`auth.uid()` est une fonction Supabase qui lit le JWT émis par Supabase. Better Auth
n'en émet pas, donc `auth.uid()` renvoie `NULL` et **toute politique RLS qui s'appuie
dessus refuserait tout**. Les 4 politiques concernées ont été supprimées, et les
3 clés étrangères vers `auth.users` repointées vers la table `user` de Better Auth
(migration `supabase/migrations/010_better_auth.sql`).

Conséquence : **il n'y a plus de filet de sécurité au niveau de la base.** Toute
requête touchant des données personnelles doit filtrer explicitement sur l'id
renvoyé par `getCurrentUser()` / `requireUser()`. Une requête qui oublierait sa
vérification exposerait les données d'autrui sans que rien ne l'en empêche.

La politique `public_read_avis` est conservée : elle ne dépendait pas de `auth.uid()`.

## Mise en service — 3 étapes

1. **Variables d'environnement** (Vercel + `.env.local`), voir `.env.example` :
   - `DATABASE_URL` — Supabase → Project Settings → Database → Connection string (URI).
     Contient le mot de passe de la base : serveur uniquement.
   - `BETTER_AUTH_SECRET` — `openssl rand -base64 32`
   - `RESEND_API_KEY` — **requis en production**. Sans lui, les codes ne partent pas :
     l'auth échoue explicitement plutôt que de faire croire qu'un e-mail est parti.

2. **Migration SQL** — appliquer `supabase/migrations/010_better_auth.sql`.
   Elle crée les tables `user`, `session`, `account`, `verification`, supprime les
   4 politiques RLS et repointe les 3 clés étrangères. Elle est enveloppée dans une
   transaction. **Elle n'a pas été appliquée** : à lancer sciemment.

3. **Vérifier** le parcours sur `/login` : saisie de l'e-mail → code reçu →
   session ouverte → `/shop`.

## Ce qui n'a pas été testé au runtime

Le build, les types, le lint et les 90 tests passent, mais le parcours de connexion
n'a **pas** pu être exercé de bout en bout : il faut un `DATABASE_URL` réel et un
fournisseur d'e-mail, dont ni l'un ni l'autre n'était disponible ici. À faire avant
de merger.

## Rate limiting

Règle sécurité #4 appliquée dans `src/lib/auth/server.ts` : 5 tentatives / 15 min sur
`/sign-in/email`, `/sign-up/email`, `/email-otp/send-verification-otp` et
`/sign-in/email-otp`. 100 req / 15 min sur le reste des routes d'auth.

## Supabase reste utilisé

Uniquement pour les **données** (produits, commandes, panier, avis…). Seule
l'authentification a changé de fournisseur.
