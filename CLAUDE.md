# CLAUDE.md — MIFA Life Shop

## Projet

**Mifa Life Shop** — marketplace e-commerce malien, produits africains premium.

- **URL prod** : https://mifa-life-shop-9k55.vercel.app
- **Stack** : Next.js 16 + Supabase + TypeScript + Framer Motion + GSAP + Tailwind v4
- **Repo** : `C:\Users\pc\Documents\GitHub\Mifa_Life_shop`

## Architecture

```
src/
  app/           — routes Next.js (App Router)
  components/    — composants React réutilisables
  actions/       — Server Actions (auth, products, checkout, admin)
  lib/
    supabase/    — client & server Supabase
    sanitize.ts  — utilitaires nettoyage inputs (obligatoire partout)
    auth/        — helpers admin access
    data/        — requêtes DB
  context/       — CartContext (panier client)
  hooks/         — hooks React custom
```

## Charte graphique Mali Premium

Fond bogolan-inspired, identité Mali (vert 🟩 or 🟨 rouge 🟥).

```css
--bg:         #0a0f08   /* vert très sombre */
--bg2:        #0f1a0d   /* vert nuit */
--bg3:        #152010   /* cartes, modals */
--bg4:        #1c2b16   /* hover */
--text:       #f5ede0   /* ivoire */
--text2:      #b8a98c   /* beige-doré */
--gold:       #f0a832   /* CTAs, prix */
--mali-green: #14a050   /* vert drapeau Mali */
--mali-red:   #c8102e   /* rouge drapeau Mali */
--border:     #1a2e14
--border2:    #243d1c
```

Typographie : **Playfair Display** (titres) · **Outfit** (body) · **JetBrains Mono** (prix, codes)

## Sécurité — 4 règles non négociables

1. **Clés API jamais côté client** — `SERVICE_ROLE_KEY`, `RESEND_API_KEY` → Server Actions uniquement, jamais dans des composants `'use client'`
2. **Validation des champs** — `.trim()` + longueur max sur tous les inputs avant DB → utiliser `src/lib/sanitize.ts`
3. **Auth Supabase** — `getUser()` dans Server Actions, **jamais** `getSession()` (non fiable côté serveur)
4. **Rate limiting** — login, inscription, ajout panier : 5 tentatives / 15 min par IP ou userId

## Méthode de travail — Le Loop

Protocole par tour : **PLAN → FAIRE → VÉRIFIER (1-10 par critère) → DÉCIDER**

- **TERMINÉ** si tout ≥ 8
- **JE CONTINUE** sinon — corriger le point le plus faible
- Limite : 8 tours max puis rapport

Critères à noter :
- Design Mali premium et cohérent : /10
- 4 règles sécurité appliquées : /10
- Build 0 erreur TypeScript : /10
- Tests / vérifications manuelles : /10
- Code committé sur main : /10

## Commandes utiles

```bash
npm run dev      # dev local
npm run build    # build production (0 erreur obligatoire)
npm run lint     # ESLint
git push origin main  # deploy via Vercel CI
```

## Variables d'environnement requises

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # SERVER ONLY — jamais côté client
```
