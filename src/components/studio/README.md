# FORGE UI — kit d'interface animé

Vitrine sur `/studio` (`/studio/dashboard`, `/studio/auth`).
Pensé pour être **repris tel quel dans un autre projet** : chaque primitive est un
fichier autonome, sans import interne autre que `@/lib/motion/presets`.

## Contenu

| Fichier | Ce qu'il fait |
|---|---|
| `primitives/AuroraBackground.tsx` | Trois halos qui dérivent sous un flou, + trame de points |
| `primitives/BorderBeam.tsx` | Faisceau qui tourne le long du bord (dégradé conique masqué) |
| `primitives/SpotlightCard.tsx` | Halo qui suit le curseur + inclinaison 3D |
| `primitives/MagneticButton.tsx` | Bouton attiré par le curseur + reflet qui balaie |
| `primitives/Dock.tsx` | Loupe façon macOS, taille dérivée de la distance au curseur |
| `primitives/CardStack.tsx` | Pile de cartes, la première se jette et repart au fond |
| `primitives/AnimatedTabs.tsx` | Pastille active qui glisse (`layoutId`) |
| `primitives/NumberTicker.tsx` | Compteur en ressort, démarre à l'entrée à l'écran |
| `primitives/Marquee.tsx` | Bandeau défilant sans couture, pause au survol |
| `primitives/GradientText.tsx` | Reflet Gold × Cyan, animé en CSS pur |
| `primitives/RevealText.tsx` | Titre dévoilé mot par mot derrière un masque |
| `primitives/ScrollProgress.tsx` | Barre de progression de lecture |
| `dashboard/*` | KPI, courbe Recharts, fil d'activité, classement, barre latérale |
| `auth/*` | Carte connexion / inscription, champs flottants, saisie OTP |

## Reprise dans un autre projet

1. Copier `src/lib/motion/presets.ts`, puis les fichiers voulus de `src/components/studio/`.
2. Copier la section `FORGE UI` à la fin de `src/app/globals.css` — elle porte les
   animations CSS de `GradientText` et `Marquee`.
3. Dépendances : `framer-motion`, `lucide-react`, `tailwindcss` v4 (+ `recharts` pour le dashboard).
   Rien d'autre n'a été ajouté au projet.
4. Les couleurs viennent des tokens `@theme` de `globals.css` (`--color-gold`, `--color-navy`,
   `--color-cyan`…). Changer ces valeurs suffit à rhabiller tout le kit.

## Points d'attention

### Les couches CSS

`globals.css` place tout le CSS maison dans `@layer base`, et le bloc d'animations
FORGE UI dans `@layer components`. C'est ce qui permet aux utilitaires Tailwind
(`px-*`, `py-*`, `mx-auto`, `bg-*`) de s'appliquer : la couche `utilities` passe après.

En reprenant ces composants ailleurs, vérifiez ce point — du CSS écrit **hors de toute
`@layer`** l'emporte sur *tous* les utilitaires Tailwind, et un simple reset
`* { margin: 0; padding: 0 }` suffit à rendre `px-*` et `py-*` silencieusement inopérants.
Seules les déclarations `!important` des couches basses continuent de gagner (pour
`!important`, l'ordre des couches s'inverse).

### Mouvement réduit

Toutes les primitives lisent `useReducedMotion()` de `framer-motion` et coupent leur
animation ; les animations CSS sont neutralisées par le bloc
`@media (prefers-reduced-motion: reduce)` de `globals.css`.

### Auth

`auth/AuthCard.tsx` est une **maquette** : elle ne crée aucune session. Les appels
Better Auth sont marqués en commentaire aux endroits exacts où les brancher
(`authClient.signIn.email`, `authClient.signUp.email`, `authClient.emailOtp.verifyEmail`).
La validation faite ici est celle du confort ; celle qui fait foi — et le rate limiting
5 tentatives / 15 min — restent côté serveur.

### Données du dashboard

`dashboard/data.ts` ne contient que des valeurs de démonstration, sans aucune requête.
