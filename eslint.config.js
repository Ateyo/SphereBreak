import js from '@eslint/js';
import angular from 'angular-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase'
        }
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case'
        }
      ]
    }
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility
    ],
    rules: {}
  },
  {
    files: ['**/*.spec.ts'],
    languageOptions: {
      globals: {
        ...globals.jasmine
      }
    },
    rules: {
      // your overrides
    }
  },
  {
    files: ['**/*.js', '**/*.ts'],
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSortPlugin
    },
    rules: {
      ...eslintConfigPrettier.rules,
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
  }
);
