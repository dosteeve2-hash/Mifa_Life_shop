# PRD — MIFA Life

## Résumé exécutif
MIFA Life est un marketplace e-commerce multi-vendeurs pour la mode, l'artisanat et les produits africains premium. Il connecte créateurs et artisans africains à des acheteurs en Afrique et dans la diaspora, avec un espace vendeur complet (inscription, dashboard, gestion produits), un panel admin, et des fonctionnalités e-commerce avancées (assistant, comparateur, ventes flash, cartes cadeaux).

## Motivation originale
> "Marketplace de mode africaine. E-commerce pour la mode, l'artisanat, les créateurs africains. Montrer que l'Afrique produit de belles choses. Connecter les créateurs africains aux acheteurs."
> — Steeve Donald Compaoré

## Vision et ambition
MIFA Life est le produit "E-commerce" de l'écosystème FORGE Afrika (statut "Actif", `forge-afrika/lib/constants.ts`), avec les métriques consolidées les plus élevées de l'écosystème à ce jour (3 400 utilisateurs, 12 000 transactions, 78M FCFA de CA selon les données de démonstration du dashboard groupe). Sa mission dépasse la simple vente en ligne : donner une vitrine professionnelle mondiale aux créateurs africains pour prouver, produit après produit, que l'Afrique transforme et produit de la valeur — le même combat que celui documenté dans `forge-afrika/VISION.md` contre l'exportation de matières premières brutes, appliqué ici à l'artisanat et à la mode.

## Problème résolu
Les artisans, producteurs et créateurs africains peinent à vendre au-delà de leur marché local. Leur visibilité en ligne est nulle, les plateformes internationales ignorent leurs réalités (paiement mobile, livraison locale, langues), et leurs produits authentiques restent invisibles face aux contrefaçons.

## Utilisateurs cibles
- **Vendeurs** — artisans, créateurs et producteurs africains (parcours dédié : `seller-register` → `seller-dashboard`).
- **Acheteurs** — diaspora africaine et consommateurs du monde entier cherchant des produits authentiques.
- **Administrateurs FORGE Afrika** — modération et pilotage de la marketplace (`admin/commandes`, `admin/produits`, `admin/stats`).

## Fonctionnalités clés (MVP)
Construites (routes réelles dans `src/app/`) :
- **Découverte & catalogue** — `shop`, `shop/[id]`, `catalogue`, `categories`, `[slug]`, `essentials`, `promo`/`promotions`, `flash` (ventes flash).
- **Fiche produit & achat** — `produit`, `cart`, `checkout`, `gift-cards`, `sizing-guide`, `comparateur`.
- **Compte acheteur** — `login`, `account`, `profil`, `orders`, `track` (suivi de commande), `wishlist`, `returns`, `notifications`.
- **Espace vendeur** — `seller-register`, `seller-dashboard`, `add-product`.
- **Panel admin** — `admin/commandes`, `admin/produits`, `admin/stats`.
- **Assistant** — `assistant` (aide à l'achat, potentiellement IA).
- **Contenu & support** — `blog`, `about`, `contact`, `faq`, `privacy`.
- **Auth** — `auth/callback` (Supabase Auth), `dashboard`.
- **Server Actions** (`src/actions/`) — `auth.ts`, `products.ts`, `checkout.ts`, `admin.ts`.
- **Panier client** — `CartContext` (`src/context/`).

## Stack technique
```
Frontend     Next.js 16 (App Router) + TypeScript strict
Styling      Tailwind CSS v4
Animations   Framer Motion + GSAP
Auth/DB      Supabase (client & server, src/lib/supabase/)
Monitoring   Sentry (client/server/edge configs)
Tests        Vitest
Déploiement  Vercel (mifa-life-shop-9k55.vercel.app)
```
Charte graphique FORGE Afrika v3 — Navy `#0A1628` / Gold `#D4AF37` / Cyan `#00BCD4`, typographie Outfit (body) + JetBrains Mono (prix, codes).

## Intégration écosystème FORGE Afrika
MIFA Life est un des quatre produits "Actifs" de la Phase 1 FORGE Afrika, avec TAAMA, CompTrack et FORJA. Objectif Phase 2 de la roadmap groupe : suite intégrée TAAMA + CompTrack + MIFA Life, où les ventes MIFA Life peuvent alimenter directement la comptabilité CompTrack des vendeurs formalisés.

## Feuille de route
### Phase 1 — MVP (actuel)
Marketplace multi-vendeurs fonctionnelle : catalogue, panier, checkout, comptes acheteur et vendeur, panel admin, ventes flash, cartes cadeaux, comparateur, assistant d'achat.

### Phase 2 — Croissance
Renforcement des 4 règles de sécurité non négociables (voir ci-dessous) sur l'ensemble des Server Actions ; intégration paiement mobile africain réel ; connexion des ventes vendeurs vers CompTrack.

### Phase 3 — Scale
Extension de la base vendeurs à l'échelle CEDEAO ; programme de vérification/authentification des produits (lutte anti-contrefaçon) ; internationalisation de l'expérience d'achat pour la diaspora.

## Métriques de succès
- Nombre de vendeurs actifs inscrits (`seller-register` → `seller-dashboard` complété).
- Volume de transactions et CA (déjà suivis dans `forge-afrika/lib/constants.ts` : 3 400 utilisateurs, 12 000 transactions, 78M FCFA).
- Taux de conversion catalogue → checkout.
- Taux de retour/litige (`returns`) comme indicateur de confiance qualité.

## Contraintes et décisions clés
- **4 règles de sécurité non négociables** (CLAUDE.md) : (1) clés API (`SERVICE_ROLE_KEY`, `RESEND_API_KEY`) jamais côté client — Server Actions uniquement ; (2) validation systématique des inputs via `src/lib/sanitize.ts` (`.trim()` + longueur max) avant toute écriture DB ; (3) `getUser()` dans les Server Actions, jamais `getSession()` ; (4) rate limiting 5 tentatives/15 min par IP ou userId sur login, inscription, ajout panier.
- **Méthode de travail "Le Loop"** — protocole PLAN → FAIRE → VÉRIFIER (notation 1-10 par critère : design premium cohérent, sécurité, build 0 erreur, tests, commit sur main) → DÉCIDER, limité à 8 tours avant rapport.
- **God File anti-pattern proscrit** — 1 fichier = 1 responsabilité, découpage au-delà de 250 lignes.
- **`npm run build` zéro erreur avant tout push**, déploiement via `git push origin main` (CI Vercel).

---
*PRD rédigé par Claude (COO) sur instruction de Steve Donald Compaore (PDG FORGE Afrika)*
*Dernière mise à jour : 2026-07-25*
