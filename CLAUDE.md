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

## Charte graphique FORGE Afrika — Navy × Gold × Cyan

Design upgrade v3 — palette unifiée sur tout l'écosystème FORGE Afrika.

```css
--bg:    #0A1628   /* Navy — fond principal */
--bg2:   #0c1a30   /* Navy sombre — sections alternées */
--bg3:   #0f2040   /* Navy profond — cartes, modals */
--bg4:   #152545   /* Navy hover */
--text:  #e8edf5   /* Blanc bleuté — texte principal */
--text2: #93aacb   /* Bleu-gris — texte secondaire */
--text3: #4f6d8e   /* Bleu-gris foncé — placeholders */
--gold:  #D4AF37   /* Gold premium — CTAs, prix, accents */
--gold2: #F5D67A   /* Gold clair */
--gold3: #b8962e   /* Gold foncé — hover */
--cyan:  #00BCD4   /* Cyan — accent secondaire */
--cyan2: #26C6DA   /* Cyan clair */
--green: #22c55e   /* Succès */
--red:   #ef4444   /* Erreur */
```

Typographie : **Outfit** (body) · **JetBrains Mono** (prix, codes)

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

---

## Karpathy Guidelines — Comportement Claude Code

Dérivé des observations d'Andrej Karpathy sur les pièges des agents de coding IA.

**Biais : prudence plutôt que vitesse. Pour les tâches triviales, utilise le jugement.**

### 1. Réfléchis avant de coder

**Ne suppose pas. Ne cache pas ta confusion. Expose les compromis.**

Avant d'implémenter :
- Énonce tes hypothèses explicitement. En cas de doute, pose la question.
- Si plusieurs interprétations existent, présente-les — ne choisis pas silencieusement.
- Si une approche plus simple existe, dis-le. Pousse en arrière si nécessaire.
- Si quelque chose n'est pas clair, arrête-toi. Nomme ce qui est confus. Pose la question.

### 2. Simplicité d'abord

**Code minimal qui résout le problème. Rien de spéculatif.**

- Pas de fonctionnalités au-delà de ce qui a été demandé.
- Pas d'abstractions pour du code à usage unique.
- Pas de "flexibilité" ou "configurabilité" non demandées.
- Pas de gestion d'erreurs pour des scénarios impossibles.
- Si tu écris 200 lignes et que 50 suffiraient, réécris-le.

Demande-toi : "Un ingénieur senior dirait-il que c'est trop compliqué ?" Si oui, simplifie.

### 3. Modifications chirurgicales

**Touche seulement ce qui est nécessaire. Nettoie uniquement ton propre désordre.**

En éditant du code existant :
- Ne "améliore" pas le code adjacent, les commentaires, ou le formatage.
- Ne refactorise pas ce qui n'est pas cassé.
- Correspond au style existant, même si tu ferais autrement.
- Si tu remarques du code mort non lié, mentionne-le — ne le supprime pas.

Quand tes changements créent des orphelins :
- Supprime les imports/variables/fonctions que TES changements ont rendus inutilisés.
- Ne supprime pas le code mort préexistant sauf si demandé.

Le test : chaque ligne modifiée doit tracer directement à la demande de l'utilisateur.

### 4. Exécution orientée objectif

**Définis des critères de succès. Boucle jusqu'à vérification.**

Transforme les tâches en objectifs vérifiables :
- "Ajouter une validation" → "Écrire des tests pour les entrées invalides, puis les faire passer"
- "Corriger le bug" → "Écrire un test qui le reproduit, puis le faire passer"
- "Refactoriser X" → "S'assurer que les tests passent avant et après"

Pour les tâches multi-étapes, énonce un plan bref :
```
1. [Étape] → vérifier : [check]
2. [Étape] → vérifier : [check]
3. [Étape] → vérifier : [check]
```

**Ces guidelines fonctionnent si :** moins de changements inutiles dans les diffs, moins de réécritures dues à la surcomplication, et les questions de clarification viennent avant l'implémentation plutôt qu'après les erreurs.

## Règles IA sécurité (CRITIQUE)

- Rate limit sur TOUS les endpoints AI : 20 req/user/heure max
- Ne jamais passer l'input user dans le system prompt — toujours : <user_input>${input}</user_input>
- God File anti-pattern : 1 fichier = 1 responsabilité, découper à 250 lignes
- Ne jamais modifier .env, .env.local, .env.production directement
