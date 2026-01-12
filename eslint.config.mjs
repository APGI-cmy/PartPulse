import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

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
    // Utility scripts use CommonJS require() pattern
    "scripts/**/*.js",
    "qa/**/*.js",
    "jest.*.js",
    "proxy.ts", // Proxy script (not part of Next.js app)
    // Test files may use require() for dynamic imports
    "__tests__/**",
  ]),
  // Deprecation Detection Gate (BL-026)
  // Policy: governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md
  {
    files: ["**/*.ts", "**/*.tsx"],
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
    rules: {
      // CRITICAL: Must be 'error' not 'warn' per BL-026 constitutional requirement
      // Any weakening of this rule is a governance violation
      // This rule detects usage of @deprecated APIs from TypeScript definitions
      "@typescript-eslint/no-deprecated": "error",
    },
  },
]);

export default eslintConfig;
