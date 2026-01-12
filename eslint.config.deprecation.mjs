// ESLint configuration for deprecation detection ONLY
// Used by CI workflows and pre-commit hooks
// Policy: governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md

import tseslint from "typescript-eslint";

const deprecationConfig = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
    ],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      // Ignore unused eslint-disable directives since we only check deprecations
      reportUnusedDisableDirectives: false,
    },
    rules: {
      // ONLY check for deprecations - no other rules
      "@typescript-eslint/no-deprecated": "error",
    },
  },
];

export default deprecationConfig;
