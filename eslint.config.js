import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "*.config.js", "*.config.ts"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // Enable unused vars detection with reasonable exceptions
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }],
      // Enforce consistent imports
      "@typescript-eslint/consistent-type-imports": ["warn", {
        prefer: "type-imports",
        fixStyle: "inline-type-imports"
      }],
      // Prevent common mistakes
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "no-var": "error",
      // React specific
      "react-hooks/exhaustive-deps": "warn",
    },
  },
);

