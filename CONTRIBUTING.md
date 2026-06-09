# Guide de contribution — Mifa Life Shop

Merci de votre intérêt pour le projet ! Voici comment contribuer efficacement.

## Prérequis

- Node.js 18+
- Git
- Compte Supabase (pour le développement local)

## Processus de contribution

### 1. Fork & Clone

```bash
git clone https://github.com/votre-username/mifa_life_shop.git
cd mifa_life_shop
npm install
```

### 2. Créer une branche

Utilisez la convention de nommage suivante :

```
feat/nom-de-la-fonctionnalite
fix/description-du-bug
docs/mise-a-jour-documentation
refactor/nom-du-module
```

### 3. Convention de commits

Suivez les [Conventional Commits](https://www.conventionalcommits.org) :

```
feat: ajouter le filtre par prix
fix: corriger l'affichage du panier sur mobile
docs: mettre à jour le guide d'installation
style: corriger l'indentation dans ProductCard
refactor: extraire la logique de paiement
test: ajouter les tests du checkout
```

### 4. Code style

- TypeScript strict activé — typage explicite obligatoire
- Tailwind CSS pour tous les styles
- Composants fonctionnels React uniquement
- Server Actions pour les mutations de données
- Zod pour la validation des entrées utilisateur

### 5. Pull Request

Avant d'ouvrir une PR :

```bash
npm run lint    # Vérifier le linting
npm run build   # Vérifier que le build passe
```

Décrivez dans votre PR :
- Ce que vous avez fait
- Pourquoi (contexte du problème)
- Comment tester le changement

## Structure du projet

```
src/
├── app/          # Routes (App Router Next.js)
├── components/   # Composants UI réutilisables
├── actions/      # Server Actions (mutations)
├── hooks/        # Hooks React personnalisés
└── lib/          # Utilitaires et configuration
```

## Variables d'environnement

Copiez `.env.example` en `.env.local` et remplissez vos valeurs Supabase.

## Questions ?

Ouvrez une [issue](https://github.com/dosteeve2-hash/mifa_life_shop/issues) pour toute question.
