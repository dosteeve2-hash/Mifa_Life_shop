# 🛍️ MIFA Life

> Le marketplace qui met les trésors de l'Afrique dans les mains du monde entier.

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge&color=0A1628)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

---

## 🎯 Problème résolu

Les artisans, producteurs et créateurs africains peinent à vendre au-delà de leur marché local. Leur visibilité est nulle en ligne, les plateformes internationales ignorent leurs réalités (paiement mobile, livraison locale, langues), et leurs produits authentiques restent invisibles face aux contrefaçons.

## 💡 Solution

MIFA Life est un marketplace e-commerce spécialisé dans les produits locaux africains authentiques — artisanat, alimentation, mode, cosmétiques naturels. La plateforme offre aux vendeurs africains une vitrine digitale professionnelle et aux acheteurs du monde entier une expérience d'achat fluide, avec suivi de commande en temps réel.

**Cible :** Artisans et producteurs africains (vendeurs) · Diaspora africaine et consommateurs du monde entier cherchant des produits authentiques (acheteurs).

---

## 🖥️ Pages & Fonctionnalités

| Page | Description |
|------|-------------|
| `/` — Landing | Page d'accueil : héros animé, collections vedettes, produits tendances |
| `/produit/[id]` | Fiche produit détaillée : galerie, description, avis, vendeur, produits similaires |
| `/collections` | Navigation par collection : Artisanat, Mode, Alimentation, Cosmétiques... |
| `/panier` | Panier d'achat dynamique avec récapitulatif et codes promo |
| `/checkout` | Tunnel de paiement sécurisé — adresse, livraison, paiement |
| `/compte` | Espace personnel : profil, historique commandes, adresses, préférences |
| `/suivi-commandes` | Tracking temps réel de chaque commande avec étapes et estimations |
| `/wishlist` | Liste de souhaits personnelle et partage social |
| `/avis` | Système d'avis vérifiés — notation produits et vendeurs |

---

## 🛠️ Stack Technique

| Couche | Technologie |
|--------|------------|
| Framework | Next.js 15 (App Router) |
| Langage | TypeScript |
| Styles | Tailwind CSS |
| Animations | Framer Motion |
| Base de données | Supabase (PostgreSQL + Auth + Storage) |
| Déploiement | Vercel |
| UI Components | shadcn/ui |

**Charte graphique :** Navy `#0A1628` · Gold `#D4AF37` · Cyan `#00BCD4`

---

## 🚀 Installation

```bash
git clone https://github.com/dosteeve2-hash/Mifa_Life_shop.git
cd Mifa_Life_shop
npm install
cp .env.example .env.local
```

Configure les variables dans `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

```bash
npm run dev
# → http://localhost:3000
```

---

## 📁 Structure du Projet

```
Mifa_Life_shop/
├── app/
│   ├── produit/
│   │   └── [id]/
│   ├── collections/
│   ├── panier/
│   ├── checkout/
│   ├── compte/
│   ├── suivi-commandes/
│   ├── wishlist/
│   ├── avis/
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── shop/
│   ├── product/
│   └── shared/
├── lib/
│   ├── supabase/
│   └── utils/
├── public/
└── types/
```

---

## 🌍 Partie de l'écosystème FORGE Afrika

MIFA Life est un produit de **[FORGE Afrika](https://github.com/dosteeve2-hash/forge-afrika)** — la forge technologique panafricaine qui construit les outils numériques de la prochaine génération d'entrepreneurs africains.

> *Forger l'Afrique de demain, un produit à la fois.*

**Autres produits de l'écosystème :**
- 🏭 [TAAMA](https://github.com/dosteeve2-hash/taama) — ERP industriel pour PMEs de transformation
- 🌱 [FORJA](https://github.com/dosteeve2-hash/forja) — Plateforme SaaS d'exportation de café burkinabè
- 📊 [CompTrack](https://github.com/dosteeve2-hash/comptrack) — Comptabilité B2B pour PMEs africaines

---

## 📬 Contact

**Steve Donald Compaore** — Fondateur, FORGE Afrika

📧 [docompaore2@gmail.com](mailto:docompaore2@gmail.com)
🐙 [github.com/dosteeve2-hash](https://github.com/dosteeve2-hash)

---

<div align="center">
  <sub>Construit avec ❤️ au Burkina Faso · FORGE Afrika © 2025</sub>
</div>
