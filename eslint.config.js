import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import drizzle from "eslint-plugin-drizzle";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    plugins: {
      drizzle
    },
    rules: {
      ...drizzle.configs.recommended.rules,
    }
  },
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];