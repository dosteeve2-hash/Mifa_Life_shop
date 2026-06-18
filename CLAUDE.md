# CLAUDE.md — Source de Vérité Vivante

> Ce document est maintenu automatiquement par Claude en tant que Chief of Staff IA.
> Il évolue à chaque interaction pertinente. Dernière mise à jour : 2026-06-11.

---

## 1. Identité & Vision

### Qui je suis
- Fondateur malien / burkinabé, étudiant à Tokat (Turquie), bâtisseur de solutions tech pour l'Afrique de l'Ouest.
- Contact : docompaore2@gmail.com

### Vision à long terme
Construire un écosystème technologique qui démocratise l'accès au commerce, à l'entrepreneuriat et à la création de valeur en Afrique francophone — en partant des réalités locales (paiements, connectivité, contraintes) plutôt que de les ignorer.

### Philosophie fondatrice
- **Réalité d'abord** : la technologie sert le terrain, pas l'inverse.
- **Impact local mesurable** : chaque produit doit améliorer la vie de vraies personnes.
- **Ambition sans complexe** : construire des produits mondialement compétitifs, ancrés localement.
- **Vivez mieux, ensemble** — tagline de Mifa Life.

---

## 2. Écosystème de Projets

### 2.1 Mifa Life Shop (projet actuel)
- **Type** : Marketplace e-commerce / dropshipping
- **Marché cible** : Mali (Bamako + national), expansion Afrique de l'Ouest
- **Mission** : Connecter les consommateurs maliens à des produits de qualité (Chine, Turquie)
- **Domaine** : mifa.life
- **Statut** : Phase 1 (Mali) — déploiement en cours
- **Repo** : dosteeve2-hash/mifa_life_shop

### 2.2 Problem to Project Africa (projet frère)
- **Type** : Plateforme IA de matching talent → projet
- **Marché cible** : Étudiants et builders africains (diaspora + continent)
- **Mission** : Aider les talents africains à transformer compétences et problèmes locaux en projets concrets et exécutables
- **Tagline** : "From local problems to concrete projects for Africa"
- **v1 country** : Burkina Faso
- **Statut** : Blueprint finalisé, architecture technique définie
- **Lien** : `/docs/problem-to-project-africa-blueprint.md`

### Interdépendances prévues
- Phase 3 de Mifa Life intègre Problem to Project Africa comme module partenaire
- Les deux projets partagent la même stack technique (Next.js + Supabase + Vercel)
- API publique Mifa prévue pour s'interfacer avec l'écosystème

---

## 3. Stack Technique Standard

### Framework & Langage
- **Next.js 16+** (App Router — pas Pages Router)
- **TypeScript strict**
- **React 19+** (Server Components par défaut, Client Components explicitement marqués)

### Styling
- **Tailwind CSS 4+**
- Variables CSS custom dans `globals.css` (voir section Identité Visuelle)
- Animations via **Framer Motion**
- Icônes via **Lucide React**

### Backend & Data
- **Supabase** (PostgreSQL, Auth SSR, Storage)
- Server Actions dans `/src/actions/`
- Validation entrées avec **Zod**
- Middleware auth : `middleware.ts` à la racine

### Déploiement
- **Vercel** (principal) + Netlify (secondaire)
- Node.js 22+
- Variables d'env : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`

### Structure de dossiers (Mifa Life)
```
src/
├── app/           # Routes App Router (35+ pages)
├── components/    # Composants React réutilisables
├── actions/       # Server Actions
├── context/       # Contextes React (CartContext, etc.)
├── hooks/         # Hooks personnalisés
└── lib/           # Utilitaires (supabase/, auth/, types/, data/)
```

---

## 4. Identité Visuelle

### Palette Mifa Life
| Variable CSS | Valeur | Usage |
|---|---|---|
| `--em` | `#00897B` | Émeraude Tropical — couleur principale, CTA, accents |
| `--em-d` | `#00695C` | Émeraude sombre — hover states |
| `--or` | `#B85C38` | Orange Tangerine — accents secondaires, badges |
| `--sl` | `#2C3A3F` | Gris Ardoise — textes sombres, backgrounds sombres |
| `--mu` | `#C9A84C` | Jaune Moutarde — highlights, badges promo |
| `--bg` | `#F6F4F0` | Fond principal — chaud, non blanc |
| `--bg2` | `#EEE9E1` | Fond secondaire |
| `--t1` | `#1A2422` | Texte principal |
| `--t3` | `#5a7566` | Texte secondaire |

### Couleurs identité Mali
- Vert : `#009A00` (`--mg`)
- Jaune : `#FFD700` (`--my`)
- Rouge : `#CE1126` (`--mr`)
- Utilisées dans les accents décoratifs (bande Mali en header)

### Typographie
- **Display / Logo** : Playfair Display (serif, weight 700) — titres, logo
- **Corps** : Nunito Sans (sans-serif, weights 400/500/600/700)
- **Fallback** : system-ui, -apple-system, Segoe UI

### Tokens de design
- **Border radius standard** : `10px` (`--r`), `14px` (`--rl`)
- **Max width** : `1280px` (`--max`)
- **Transition** : `0.22s cubic-bezier(.25,.46,.45,.94)` (`--tr`)
- **Shadows** : `--sh-s` (subtle), `--sh-m` (medium), `--sh-l` (large)
- **Spacing** : `clamp()` pour responsive natif

### Principes de design
- Chaleureux, pas froid — fond beige/chaud plutôt que blanc pur
- Africain sans stéréotype — identité visuelle moderne et professionnelle avec touches locales subtiles
- Mobile-first — responsive via media queries et `clamp()`
- Accessibilité : focus visible sur tous les éléments interactifs (outline 2px `--em`)

---

## 5. Conventions de Code

### TypeScript
- Types explicites sur toutes les fonctions et composants
- Interfaces nommées `XxxProps` pour les props de composants
- Pas de `any` sauf cas impossibles à typer
- `export const dynamic = 'force-dynamic'` sur les pages avec fetch Supabase

### Composants React
- Server Components par défaut (pas de `'use client'` sauf nécessité)
- `'use client'` uniquement pour : interactivité, hooks, événements browser
- Nommage PascalCase pour composants, camelCase pour utilitaires
- Import `@/` pour tous les imports internes (pas de chemins relatifs complexes)

### Supabase
- Client serveur : `createServerSupabaseClient()` depuis `@/lib/supabase/server`
- Client browser : `createBrowserSupabaseClient()` depuis `@/lib/supabase/client`
- Toujours vérifier les erreurs Supabase avant d'utiliser les données
- RLS (Row Level Security) activé sur toutes les tables sensibles

### CSS / Styles
- Variables CSS custom en priorité sur les valeurs hardcodées
- Classes utilitaires Tailwind pour les ajustements ponctuels
- CSS global pour les composants récurrents (navbar, footer, boutons standards)
- Pas de CSS-in-JS — Tailwind + CSS variables uniquement

### Git
- Convention de commits : `type: description` en français ou anglais
  - `feat:` nouvelle fonctionnalité
  - `fix:` correction de bug
  - `chore:` maintenance, dépendances
  - `docs:` documentation
  - `refactor:` refactoring sans changement fonctionnel
- Branches de feature : `feature/nom-kebab-case`
- Branche Claude : `claude/description-courte-idcode`

---

## 6. Philosophie Produit

### Principes universels (tous projets)
1. **Construire pour l'utilisateur final réel** — pas pour un utilisateur imaginaire occidental
2. **Sobriété fonctionnelle** — chaque feature justifiée par un besoin réel, pas une mode
3. **Performance sur connexions lentes** — les utilisateurs cibles ont des connexions limitées
4. **Paiements locaux natifs** — Orange Money, Wave, Moov Money sont aussi importants que Visa
5. **Contenu en français** — langue principale de toute l'interface

### Anti-patterns à éviter
- Features qui ne fonctionnent que sur fibre optique
- UX calquée sur des produits US sans adaptation locale
- Jargon technique dans l'interface utilisateur
- Dépendances inutiles qui alourdissent le bundle
- Surengineering pour des cas hypothétiques

### Monétisation saine
- Valeur créée d'abord, monétisation ensuite
- Modèles adaptés au pouvoir d'achat local (micro-transactions, commissions, freemium)
- Pas de dark patterns

---

## 7. Philosophie Business

### Positionnement
- **Catégorie** : Tech africaine premium — ni "pour les pauvres" ni déconnectée des réalités
- **Différenciateur** : Ancrage local profond + standard tech mondial
- **Ton de marque** : Confiant, accessible, moderne, chaleureux

### Priorités stratégiques
1. Traction au Mali d'abord avant expansion régionale
2. Qualité des produits et fiabilité de la livraison > volume
3. Construire la confiance (paiements sécurisés, retours clairs, SAV réactif)
4. SEO local fort (contenu en français, mots-clés Mali/Bamako)

### Roadmap Mifa Life
- **Phase 1** (en cours) : Mali — architecture complète, paiements locaux, fournisseurs Chine/Turquie
- **Phase 2** : Afrique de l'Ouest — Sénégal, Côte d'Ivoire, Burkina Faso + mobile React Native
- **Phase 3** : Écosystème — marketplace multi-vendeurs + intégration Problem to Project Africa

---

## 8. Workflows Standards

### Nouveau composant
1. Créer dans `src/components/NomComposant.tsx`
2. Server Component par défaut
3. Typer toutes les props avec une interface
4. Utiliser les variables CSS du design system

### Nouvelle page
1. Créer `src/app/route/page.tsx`
2. Ajouter `export const dynamic = 'force-dynamic'` si fetch Supabase
3. Métadonnées SEO via `export const metadata`
4. Vérifier cohérence avec le menu de navigation

### Nouvelle action serveur
1. Créer dans `src/actions/nom-domaine.ts`
2. Marquer avec `'use server'`
3. Valider les entrées avec Zod
4. Retourner `{ success: boolean, data?: T, error?: string }`

### Schéma base de données
- Tables préfixées `mifa_` pour les données métier
- Utiliser `supabase_setup.sql` comme source de vérité
- Toujours écrire les migrations en SQL commenté

---

## 9. Standards IA (pour projets LLM)

- Privilégier les réponses déterministes (temperature basse, règles métier explicites)
- Définir des system prompts structurés avec contraintes métier claires
- Créer des templates de réponse réutilisables plutôt que générer librement
- Valider les sorties LLM avant de les afficher à l'utilisateur
- La cohérence business > la créativité non contrainte
- Pour Problem to Project Africa : chaque recommandation doit passer par une grille d'évaluation (pertinence locale, faisabilité, coût, niveau requis)

---

## 10. Checklist de Cohérence Inter-Projets

Avant tout nouveau projet ou feature majeure, vérifier :
- [ ] Respecte la palette de couleurs définie
- [ ] Utilise la même stack technique (Next.js + Supabase + Vercel)
- [ ] Conventions de commits alignées
- [ ] Contenu en français
- [ ] Compatible mobile-first
- [ ] Paiements locaux pris en compte
- [ ] SEO localisé (Mali/Afrique de l'Ouest)
- [ ] Pas de dépendances qui alourdissent inutilement

---

## 11. Opportunités Identifiées

### Mifa Life — Quick wins
- [ ] Internationalisation (i18n) : Bambara pour les utilisateurs non-francophones
- [ ] PWA (Progressive Web App) : installation sur mobile sans app store
- [ ] Système de fidélité points : rétention utilisateurs
- [ ] Wishlist persistante : récupération de paniers abandonnés
- [ ] Reviews produits : confiance sociale locale

### Problem to Project Africa — Prochaines étapes
- [ ] MVP Next.js avec intake form adaptatif (3 modes)
- [ ] Système de prompts structurés pour recommandations contextualisées Burkina Faso
- [ ] Base de connaissances locale (agriculture, éducation, santé, commerce, énergie)
- [ ] Landing page avec CTA vers les 3 modes utilisateurs

### Intégration inter-projets
- [ ] API Mifa Life pour afficher des opportunités e-commerce dans Problem to Project Africa
- [ ] Profil utilisateur partagé entre les deux plateformes

---

## 12. Règle Chief of Staff

Ce fichier est mis à jour automatiquement par Claude à chaque interaction qui révèle :
- une préférence durable
- une décision technique ou business
- une convention établie
- une philosophie produit
- une règle de design
- une opportunité identifiée

Les validations ne sont demandées que pour : dépenses, changements irréversibles, pivots stratégiques majeurs.
