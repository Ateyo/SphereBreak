import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.js', '**/*.ts'],
    plugins: {
      js,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'none',
          printWidth: 80,
          tabWidth: 2,
          endOfLine: 'auto'
        }
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-unused-vars': 'error'
    }
  },
  eslintConfigPrettier // This disables ESLint rules that conflict with Prettier
]);
