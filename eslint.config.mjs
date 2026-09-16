import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Snapshots archivés d'anciennes versions du site : ils ne sont pas
    // construits et ne suivent plus les conventions du projet. Les linter
    // remontait 11 erreurs sur du code qui n'est plus livré.
    "docs/**",
  ]),
  {
    rules: {
      /*
       * Deux règles arrivées avec Next 16 / React Hooks 6. Le code de ce dépôt
       * les précède : 14 sites pour la première, 4 pour la seconde, répartis
       * sur autant de fichiers. Les corriger correctement demande de revoir
       * chaque chargement asynchrone un par un — un chantier à part entière,
       * pas un effet de bord d'une mise en place de CI.
       *
       * Passées en avertissement : elles restent visibles à chaque lint, mais
       * la CI peut déjà bloquer sur tout le reste. À repasser en `error` une
       * fois les sites traités.
       */
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
    },
  },
]);

export default eslintConfig;
