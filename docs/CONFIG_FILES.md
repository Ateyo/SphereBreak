# Configuration Files Reference

## Project Build & Config

### `angular.json`
- Builder: `@angular/build:application` (application builder, not module-based)
- Output: `www/` (not default `dist/`)
- Base href: `/spherebreak/`
- Styles: `src/global.scss`, `src/theme/variables.scss`
- Polyfills: `src/polyfills.ts`
- Coverage/commented budgets comment
- Ionic schematics: standalone pages by default

### `tsconfig.json` (base)
- Target: `ES2022`
- Module: `ES2020` with bundler resolution
- Strict mode: ALL flags enabled
- `useDefineForClassFields: false` (Angular compatibility)

### `tsconfig.app.json`
- Extends base, includes `src/main.ts`, `src/polyfills.ts`
- No additional types

### `tsconfig.spec.json`
- Extends base, Jasmine types
- Includes all `*.spec.ts` and `*.d.ts`

### `package.json`
- Angular 20.0, Ionic 8, Capacitor 7, Tailwind 4.1
- RxJS 7.8, zone.js 0.15
- Dev: Jasmine 5.1, Karma 6.4, ESLint 9, Prettier 3.5
- Commands: `ng`, `start`, `build`, `watch`, `test`, `lint`, `lint:fix`

### `capacitor.config.ts`
- App ID: `io.ionic.starter`
- App Name: `SphereBreak`
- Web Dir: `www`
- Splash screen: 3s duration, dark bg (#121316), centered, no spinner

### `ionic.config.json`
- Name: `SphereBreak`
- Integration: Capacitor
- Type: `angular-standalone`

### `.browserslistrc`
- Chrome ≥79, ChromeAndroid ≥79, Firefox ≥70, Edge ≥79, Safari ≥14, iOS ≥14

### `.postcssrc.json`
- Only plugin: `@tailwindcss/postcss` (Tailwind v4)

## Code Quality

### `eslint.config.js`
- **Flat config** (ESLint 9+)
- Configurations:
  - `typescript-eslint` for TS files
  - `angular-eslint` (recommended + accessibility for HTML)
  - Prettier plugin (single quotes, no trailing comma, 80 print width, 2-space indent)
  - `simple-import-sort` (imports + exports)
  - `no-unused-vars: error`
- Angular selectors: directive `app`+camelCase, component `app`+kebab-case
- Spec files: jasmine globals, relaxed rules

### `.prettierrc`
```json
{
  "semi": true,
  "trailingComma": "none",
  "singleQuote": true,
  "printWidth": 80,
  "htmlWhitespaceSensitivity": "ignore",
  "bracketSameLine": true
}
```

### `.editorconfig`
- UTF-8, spaces, 2-space indent
- Final newlines, trim trailing whitespace (except `.md`)
- Single quotes for `.ts` files

## Environment

### `src/environments/environment.ts` (dev)
```ts
{ production: false, url: 'http://localhost:8000/api/', apiKey: '<128-char-key>' }
```

### `src/environments/environment.prod.ts` (prod)
```ts
{ production: true, url: 'https://www.tom-gonzalez.com/api/', apiKey: '<SAME-128-char-key>' }
```

### `.env` (backend)
```
API_KEY=<same-key>
APP_ENV=development
CORS_ORIGIN=http://localhost:4200
```

### `.gitignore`
Git-ignores: `node_modules/`, `www/`, `dist/`, `.angular/cache`, `vendor/`, `*.db`, `src/environments/*.ts`, `.env`, `coverage/`, IDE folders
