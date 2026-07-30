# MIFA Life — Lovable Protocol

## Vision
MIFA Life est le marketplace e-commerce qui connecte les artisans, producteurs et créateurs africains aux acheteurs du monde entier. Chaque produit raconte une histoire authentique — artisanat burkinabè, mode africaine, cosmétiques naturels, alimentation locale — avec une expérience d'achat moderne et une logistique adaptée au contexte africain.

## Utilisateurs cibles
- **Persona 1 — Adja, Artisane tisserande (Ouagadougou)** : Fabrique des pagnes bogolan. N'a aucune présence en ligne. Besoin : vitrine digitale professionnelle, gestion commandes simple, paiements Mobile Money.
- **Persona 2 — Miriam, Diaspora africaine (Paris)** : Cherche des produits authentiques africains pour offrir. Besoin : expérience d'achat fluide, confiance vendeur vérifié, livraison internationale fiable.
- **Persona 3 — Jean-Pierre, Acheteur lifestyle (Berlin)** : Découvre l'artisanat africain via les réseaux sociaux. Besoin : navigation par collection, avis vérifiés, tracking commande.

## Fonctionnalités core
### P0 (MVP live)
- Landing animée (héros GSAP/Framer Motion, collections vedettes, produits tendances)
- Fiche produit complète (galerie images, description, avis, vendeur, produits similaires)
- Navigation par collections (Artisanat, Mode, Alimentation, Cosmétiques)
- Panier dynamique avec codes promo
- Tunnel de paiement (adresse, livraison, paiement)
- Espace compte (profil, historique commandes, adresses)
- Suivi commandes temps réel (étapes + estimations)
- Wishlist avec partage social
- Avis vérifiés (notation produits et vendeurs)

### P1 (prochaine itération)
- Auth Supabase multi-rôles (Acheteur / Vendeur / Admin)
- Espace vendeur : dashboard ventes, gestion catalogue, gestion stock
- Intégration paiement (Stripe + Mobile Money Orange/Wave/Moov)
- Recherche produits avec filtres (catégorie, prix, pays d'origine, certifications)
- Système de notifications commandes (email Resend + in-app)

### P2 (roadmap)
- App mobile acheteur (React Native) avec notifications push
- Programme fidélité (points MIFA, réductions)
- Live shopping (vendeurs en direct)
- Intégration Instagram Shopping pour vendeurs
- Expansion B2B (commandes grossistes pour boutiques internationales)

## Design System
- **Couleurs** : Navy `#0A1628` (fond principal), Gold `#D4AF37` (accents, prix, CTA), Cyan `#00BCD4` (badges, statuts)
- **Typographie** : Inter (corps), Geist (prix/chiffres)
- **Animations** : Framer Motion v12 (fadeInUp produits, hoverScale cards), GSAP v3 (hero), Lenis (smooth scroll)
- **Icônes** : Lucide React
- **Validation** : Zod (formulaires checkout)

## Stack Technique
- **Frontend** : Next.js 16 (App Router), React 19, TypeScript
- **Styles** : Tailwind CSS v4, LightningCSS
- **Animations** : Framer Motion v12, GSAP v3, Lenis
- **Backend** : Supabase (PostgreSQL, Auth, Storage)
- **Validation** : Zod
- **Tests** : Vitest + Testing Library
- **Monitoring** : Sentry
- **Déploiement** : Vercel

## Modèle de données

### Table `products`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| seller_id | uuid | FK users |
| name | text | Nom produit |
| description | text | Description |
| price | numeric | Prix FCFA |
| category | text | artisanat / mode / alimentation / cosmetique |
| country_origin | text | Pays d'origine |
| images | text[] | URLs Supabase Storage |
| stock_qty | int | Quantité en stock |
| certifications | text[] | Bio / Fairtrade... |

### Table `orders`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| buyer_id | uuid | FK users |
| status | enum | en_attente / confirmee / expedie / livre / annulee |
| total_amount | numeric | Total FCFA |
| shipping_address | jsonb | Adresse livraison |
| tracking_steps | jsonb[] | Historique étapes livraison |

### Table `reviews`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| product_id | uuid | FK products |
| buyer_id | uuid | FK users |
| rating | int | 1-5 étoiles |
| comment | text | Avis texte |
| verified_purchase | boolean | Achat vérifié |

## Flux utilisateur clé — Achat d'un pagne bogolan

1. Miriam arrive sur la landing → voit "Collections" → clique "Mode africaine"
2. Parcourt les pagnes → clique produit → fiche détaillée (galerie, avis, vendeur Adja)
3. Sélectionne taille → clique "Ajouter au panier"
4. Consulte panier → entre code promo → "Passer commande"
5. Saisit adresse Paris → choisit livraison internationale (DHL 7-10j)
6. Paiement Stripe CB → confirmation email Resend
7. Suit commande via `/suivi-commandes` (étapes : Préparation → Expédition → En transit → Livré)
8. Reçoit colis → laisse avis 5 étoiles sur le produit

## Critères de succès
- Landing charge en < 2 secondes (Vercel Edge + Next.js 16)
- Tunnel checkout < 5 clics de la fiche produit au paiement
- Taux d'abandon panier < 60% (benchmark e-commerce)
- Score Lighthouse Performance > 90
- Zéro erreur `npm run build`
- Compatible mobile-first (80% du trafic africain = mobile)

---
*Lovable Protocol v1.0 — FORGE Afrika © 2025 — Steeve Donald Compaore*
