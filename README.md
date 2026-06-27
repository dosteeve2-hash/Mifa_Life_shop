<div align="center">

# 🛍️ Mifa Life Shop

**Plateforme e-commerce de dropshipping connectant le Mali aux marchés mondiaux**

*Par 11 étudiants maliens à Tokat, Turquie — Vivez mieux, ensemble.*

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**[🌐 Live Demo](https://mifa-life-shop-9k55.vercel.app)** · **[🐛 Report Bug](https://github.com/dosteeve2-hash/Mifa_Life_shop/issues)** · **[✨ Proposer une feature](https://github.com/dosteeve2-hash/Mifa_Life_shop/issues)**

</div>

---

## 📖 À propos du projet

**Mifa Life** est une marketplace de dropshipping nouvelle génération conçue pour connecter les consommateurs maliens à des produits de qualité provenant de Chine et de Turquie. Le projet vise à démocratiser l'accès au commerce en ligne en Afrique de l'Ouest, avec une intégration native des méthodes de paiement locales (Orange Money, Wave, Moov Money).

> "Vivez mieux, ensemble" — notre mission est de rendre le commerce mondial accessible à tous.

### Contexte
Ce projet est né d'une initiative collaborative de **11 étudiants maliens** poursuivant leurs études en Turquie. Il incarne à la fois une ambition entrepreneuriale et une démonstration concrète de compétences en développement full-stack moderne.

---

## ✨ Fonctionnalités principales

### 🛒 E-Commerce
- **Catalogue produits** avec navigation multi-catégories (vêtements, électronique, maison, sport, beauté…)
- **Recherche intelligente** avec auto-complétion en temps réel
- **Panier persistant** avec gestion multi-articles
- **Fiches produits** détaillées avec galerie d'images et variantes

### 💳 Paiements
| Méthode | Région | Statut |
|---------|--------|--------|
| Orange Money | Mali / Afrique de l'Ouest | ✅ Intégré |
| Wave | Sénégal / Mali | ✅ Intégré |
| Moov Money | Mali | ✅ Intégré |
| PayDunya | Afrique francophone | ✅ Intégré |
| Visa / Mastercard | International | ✅ Intégré |

### 📦 Gestion des commandes
- Transmission automatisée aux fournisseurs via API
- Suivi de commande en temps réel
- Notifications multi-canaux : SMS, Email, WhatsApp

### 👤 Comptes utilisateurs
- Authentification sécurisée (Supabase Auth)
- Tableau de bord personnel
- Historique des commandes

### 🔧 Administration
- Dashboard admin complet
- Gestion des produits et du stock
- Gestion des fournisseurs (Chine, Turquie)
- Suivi des commandes et des livraisons

---

## 🏗️ Architecture technique

```
Mifa_Life_shop/
├── src/
│   ├── app/              # Routes Next.js App Router (35+ pages)
│   ├── components/       # Composants React réutilisables
│   ├── actions/          # Server Actions (auth, produits, checkout)
│   ├── hooks/            # Hooks personnalisés
│   └── lib/              # Utilitaires (Supabase, auth, helpers)
├── public/               # Assets statiques
├── supabase_setup.sql    # Schéma de base de données
├── middleware.ts         # Middleware Next.js (auth guard)
└── vercel.json           # Configuration déploiement
```

### Schéma de base de données

```sql
mifa_products     -- Catalogue produits avec variantes
mifa_categories   -- Catégories hiérarchiques
mifa_suppliers    -- Fournisseurs (Chine, Turquie)
auth.users        -- Authentification native Supabase
```

---

## 🚀 Stack technologique

| Catégorie | Technologie | Version |
|-----------|-------------|---------|
| Framework | Next.js | 16.1.6 |
| Language | TypeScript | 5.9.3 |
| UI | React | 19.2.3 |
| Styling | Tailwind CSS | 4.2.1 |
| Animations | Framer Motion | latest |
| Icônes | Lucide React | latest |
| Base de données | Supabase (PostgreSQL) | latest |
| Auth | Supabase Auth SSR | latest |
| Validation | Zod | 4.3.6 |
| Déploiement | Vercel | — |

---

## 🎨 Identité visuelle

| Élément | Valeur |
|---------|--------|
| Couleur principale | Émeraude Tropical `#00A896` |
| Couleur d'accent | Orange Tangerine `#FF6B35` |
| Fond/Texte | Gris Ardoise `#2F3E46` |
| Highlight | Jaune Moutarde `#F5CB5C` |
| Typographie display | Syne |
| Typographie corps | DM Sans |

---

## ⚙️ Installation & Démarrage

### Prérequis
- Node.js 22+
- npm / yarn / pnpm
- Compte Supabase

### 1. Cloner le dépôt

```bash
git clone https://github.com/dosteeve2-hash/mifa_life_shop.git
cd mifa_life_shop
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Initialiser la base de données

Exécutez le script SQL dans votre projet Supabase :

```bash
# Via l'interface Supabase SQL Editor
# Copiez et exécutez le contenu de supabase_setup.sql
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

---

## 📜 Scripts disponibles

```bash
npm run dev      # Serveur de développement (hot-reload)
npm run build    # Build de production
npm run start    # Démarrer le serveur de production
npm run lint     # Vérification ESLint
```

---

## 🗺️ Pages de l'application

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/shop` | Catalogue produits |
| `/shop/[id]` | Fiche produit détaillée |
| `/cart` | Panier |
| `/checkout` | Paiement |
| `/account` | Espace personnel |
| `/dashboard` | Tableau de bord utilisateur |
| `/admin` | Interface d'administration |
| `/categories` | Navigation par catégorie |
| `/about` | À propos |
| `/contact` | Contact |
| `/faq` | Questions fréquentes |

---

## 🌍 Vision & Roadmap

### Phase 1 — Mali (En cours)
- [x] Architecture e-commerce complète
- [x] Intégration paiements locaux (Orange Money, Wave, Moov)
- [x] Gestion fournisseurs Chine & Turquie
- [x] Interface multilingue (FR)
- [ ] Mise en production complète

### Phase 2 — Afrique de l'Ouest
- [ ] Expansion au Sénégal, Côte d'Ivoire, Burkina Faso
- [ ] Application mobile (React Native)
- [ ] Programme de fidélité
- [ ] Livraison express dans les capitales

### Phase 3 — Écosystème
- [ ] Marketplace multi-vendeurs
- [ ] Intégration [Problem to Project Africa](./Problem_to_Project_Africa_Blueprint.md)
- [ ] API publique pour partenaires

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](./CONTRIBUTING.md) pour les guidelines.

```bash
# 1. Forker le projet
# 2. Créer votre branche
git checkout -b feature/ma-fonctionnalite

# 3. Commiter vos changements
git commit -m "feat: ajouter ma fonctionnalité"

# 4. Pousser la branche
git push origin feature/ma-fonctionnalite

# 5. Ouvrir une Pull Request
```

---

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](./LICENSE) pour plus de détails.

---

## 👥 Équipe

Projet réalisé par **11 étudiants maliens** à l'Université de Tokat, Turquie.

> *Ce projet illustre notre vision : mettre la technologie au service du développement économique de l'Afrique.*

---

<div align="center">

**⭐ Si ce projet vous inspire, laissez une étoile !**

Fait avec ❤️ au Mali & en Turquie

</div>
