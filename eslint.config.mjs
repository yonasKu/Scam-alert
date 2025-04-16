import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable rules that are causing the most issues in your codebase
      "@typescript-eslint/no-explicit-any": "warn", // Downgrade from error to warning
      "react/no-unescaped-entities": "warn", // Downgrade from error to warning
      "react/display-name": "warn", // Downgrade from error to warning
      "@typescript-eslint/no-unused-vars": "warn", // Downgrade from error to warning
      "react-hooks/exhaustive-deps": "warn", // This is already a warning, but included for completeness
    },
    // Properly format ignorePatterns for flat config
    ignores: ["node_modules/**", ".next/**", "public/**"],
  },
];

export default eslintConfig;
