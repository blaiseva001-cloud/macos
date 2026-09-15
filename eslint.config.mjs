import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,

  /* ── Ignore files we didn't author ──────────────────────────────── */
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "components/ui/**",       // shadcn-generated primitives
      "hooks/use-mobile.ts",    // shadcn-generated hook
    ],
  },

  /* ── Project-wide tuning for a single-file demo OS ──────────────── */
  {
    rules: {
      // ts-nocheck on purpose for this large single-file demo
      "@typescript-eslint/ban-ts-comment": ["warn", { "ts-nocheck": "allow-with-description" }],
      // any is used for the internal Win/FSItem/OSApi shapes
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // quotes / apostrophes inside terminal output & storytelling text
      "react/no-unescaped-entities": "off",
      // raw <img> used for pixel-perfect icon assets
      "@next/next/no-img-element": "off",
      // React 19 compiler heuristics — informational only
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/immutability": "warn",
      // style
      "prefer-const": "warn",
      "import/no-anonymous-default-export": "off",
    },
  },
];

export default eslintConfig;
