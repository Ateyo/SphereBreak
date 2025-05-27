import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.js"],
    plugins: {
      js,
      "simple-import-sort": simpleImportSort,
      prettier: prettierPlugin,
    },
    extends: ["js/recommended"],
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "no-unused-vars": "error",
      "no-trailing-spaces": "error",
    },
  },
]);
