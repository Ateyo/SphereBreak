# SphereBreak — Context

## Project Overview

**SphereBreak** is a puzzle/strategy game — a digital adaptation of the "Sphere Break" mini-game from *Final Fantasy X-2*. Built as a mobile-first web app with native deployment via Capacitor.

**Gameplay loop:** Select coins on a grid to sum to multiples of a randomly generated core sphere value. Each successful "break" scores points and advances a per-level quota. Meet the quota within a turn limit to win. 15 progressively harder levels.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Angular (standalone, Signals) | 20 |
| Mobile UI | Ionic | 8 |
| Native runtime | Capacitor | 7 |
| UI components | Angular Material | 20 |
| Styling | Tailwind CSS | 4 |
| Reactive | RxJS | 7.8 |
| Backend | PHP | 8.0+ |
| Database | SQLite (via PDO) | — |
| Testing | Jasmine / Karma | 5.1 / 6.4 |
| Linting | ESLint + Prettier | 9 / 3.5 |

---

## Architecture & Data Flow

**Screen flow:**
```
MainMenu → CoinSelect → Game (Home) → Win/Loss Dialog → Highscore
```

**State management:** Angular Signals (no NgRx/NgXs). Game services expose `WritableSignal` internally and readonly signals (convention: `$` suffix) to components. `effect()` used for side effects (break detection, game-end).

**Data flow:**
1. Player picks 4 entry coins (values 1-9) → stored in `GridEngine`
2. Game generates 12 random border coins → 4×4 grid (4 entry + 12 border)
3. Each turn: `TurnEngine` generates core sphere (1-9) → player selects coins → sum checked vs multiples
4. Break detected → score added, quota incremented, border coins consumed → regenerated after 3 turns
5. Turn limit reached → check quota vs target → win/loss dialog

---

## File Map — `src/app/`

### Entry Points

| File | Role |
|---|---|
| `src/main.ts` | `bootstrapApplication` with `provideHttpClient`, `provideAnimations`, `provideIonicAngular`, `provideRouter` (PreloadAllModules), `IonicRouteStrategy` |
| `src/app/app.component.ts` | Root standalone component. Initializes Capacitor `StatusBar` (dark style, overlay) on native platforms. Imports `RouterOutlet`. |
| `src/app/app.routes.ts` | 5 routes: `''→MainMenuModule`, `'home'→HomePageModule`, `'coin-select'→CoinSelectModule`, `'highscores'→HighscoreModule`, `'coin-prototype'→CoinPrototypeComponent` (loadComponent) |
| `src/index.html` | Google Fonts (Roboto, Material Icons, Press Start 2P, Audiowide), PWA meta, `<app-root>` |

### Modules & Components

| Path | Type | Standalone | CD | Signals |
|---|---|---|---|---|
| `main-menu/main-menu.component` | Page (landing) | No (NgModule) | Default | None |
| `main-menu/main-menu.module` | NgModule (lazy `''`) | — | — | — |
| `coin-select/coin-select.module` | NgModule (lazy `coin-select`) | — | — | — |
| `coin-select/container/coin-select-page` | Page container | Yes | Default | None |
| `coin-select/components/form/coin-form` | Form (4 entry coins) | Yes | Default | Reads `entryCoinsArray$()` via getter |
| `home/home.module` | NgModule (lazy `home`) | — | — | — |
| `home/home.page.component` | Page (game orchestrator) | No (NgModule) | **OnPush** | 11 service signals, 2 `effect()` |
| `home/grid/grid.component` | Presentational (4×4 grid) | **Yes** | **OnPush** | Re-exports `entryCoinsArray$`, `coinsArray$` |
| `home/core-sphere/core-sphere` | Presentational | No | **OnPush** | Exposes `coreSphere$` |
| `home/win-dialog/win-dialog` | Dialog (win) | **Yes** | **OnPush** | None |
| `home/loss-dialog/loss-dialog` | Dialog (loss) | **Yes** | Default | None |
| `home/highscore-entry/highscore-entry` | Dialog (3-letter initials) | **Yes** | Default | None |
| `highscore/highscore.component` | Page (leaderboard) | No (NgModule) | Default | None (RxJS sub) |
| `coin-prototype/coin-prototype` | Prototype (6 themes) | **Yes** | Default | `signal('current')` for theme |

### Shared

| Path | Type | Role |
|---|---|---|
| `shared/interfaces/coin.ts` | Interface | `Coin { value, entryCoin, id? }` |
| `shared/interfaces/coin-array.ts` | Interface | `CoinArray { id, coin }` |
| `shared/interfaces/highscore.interface.ts` | Interface | `Highscore { initials, score, level }` |
| `shared/interfaces/portfolio-item.ts` | Interface | Leftover from portfolio template (unused) |
| `shared/interfaces/index.ts` | Barrel | Re-exports only `Coin` + `CoinArray` |
| `shared/services/turn-engine.service` | Root service | Turn lifecycle, break detection, scoring, core sphere, game-end |
| `shared/services/grid-engine.service` | Root service | Coin grid, entry/border coins, selection, quota, regen |
| `shared/services/highscore.service` | Root service | HTTP client for PHP backend (get/save scores) |
| `shared/services/player.service` | Root service | Player initials persistence (localStorage) + saveScore delegation |
| `shared/components/coin/coin.component` | Presentational | Single coin display/click, `effect()` syncs selected state |
| `shared/components/dialog/dialog.component` | Reusable | MatDialog with confirm/cancel + optional selected coins display |
| `shared/shared.module` | NgModule | Re-exports Material modules (MatButton, MatCard, MatGridList, MatIcon, MatInput, RouterLink) |

---

## Domain Model

### Key Entities

| Interface | File | Fields | Role |
|---|---|---|---|
| `Coin` | `shared/interfaces/coin.ts` | `value`, `entryCoin`, `id?` | A single coin on the grid |
| `CoinArray` | `shared/interfaces/coin-array.ts` | `id`, `coin` | Coin + grid position ID |
| `Highscore` | `shared/interfaces/highscore.interface.ts` | `initials`, `score`, `level` | Leaderboard record |
| `PortfolioItem` | `shared/interfaces/portfolio-item.ts` | various | Unused / future |

### Core Services

| Service | File | Responsibilities | Key Signals |
|---|---|---|---|
| `TurnEngine` | `shared/services/turn-engine.service.ts` | Turn lifecycle, break detection, scoring, core sphere generation, game-end | `currentTotal$`, `nextMultiples$`, `break$`, `currentScore$`, `echo$`, `coinCounter$`, `turn$`, `turnLimit$`, `quotaLimit$`, `gameEnded$`, `coreSphere$` |
| `GridEngine` | `shared/services/grid-engine.service.ts` | Coin grid, entry/border coins, selection validation, quota, coin regeneration | `entryCoinsArray$`, `coinsArray$`, `selectedCoins$`, `levelQuota$`, `isCoinsSet$` |
| `HighscoreService` | `shared/services/highscore.service.ts` | HTTP client for PHP backend (get/save scores) | — |
| `PlayerService` | `shared/services/player.service.ts` | Player initials persistence (localStorage) | `playerInitials` (public WritableSignal, NOT `$` convention) |

---

## TurnEngine — Signal Reference

| Signal | Type | Description |
|---|---|---|
| `currentTotal$` | `number` | Sum of selected coin values |
| `nextMultiples$` | `number[]` | Next 5 multiples of coreSphere after current total |
| `break$` | `boolean` | Whether current selection is a valid break |
| `currentScore$` | `number` | Accumulated score |
| `echo$` | `number` | Consecutive breaks with same coin count |
| `coinCounter$` | `number` | Number of coins used in last break |
| `turn$` | `number` | Current turn number (1-indexed) |
| `turnLimit$` | `number` | Max turns for current level |
| `quotaLimit$` | `number` | Quota target for current level |
| `gameEnded$` | `boolean` | True when turn > turnLimit |
| `coreSphere$` | `number` | Current core sphere value (1-9) |

### Key Methods

| Method | Effect |
|---|---|
| `evaluateSelection(values)` | Sums values, computes multiples, checks for break |
| `advanceTurn()` | Resets break/total, increments turn, generates new core sphere, checks game end |
| `loadLevel(turns, quota)` | Full state reset, loads new level parameters |
| `resetGame()` | Clears `gameEnded` flag |

### Score Formula
```
score += coinsUsed * 10 + multiplesFound * 50
```

---

## GridEngine — Signal Reference

| Signal | Type | Description |
|---|---|---|
| `entryCoinsArray$` | `CoinArray[]` | Player's 4 entry coins (IDs 1-4) |
| `coinsArray$` | `CoinArray[]` | 12 border coins (IDs 101-112) |
| `selectedCoins$` | `Coin[]` | Currently selected coins this turn |
| `levelQuota$` | `number` | Border coins consumed so far (quota progress) |
| `isCoinsSet$` | `boolean` | True after `makeGrid()` called |

### ID Scheme
- Entry coins: IDs `1` through `N` (sequential)
- Border coins: IDs `101` through `112`

### Selection Rules
1. First selection MUST be an entry coin (`entryCoin === true`)
2. Border coins can only be selected after at least one entry coin is selected
3. Already-selected coins cannot be re-selected
4. Non-existent coin IDs return false

### Border Coin Evolution (per `startNewTurn`)
- Coins with value 9 become 0 (consumed)
- Coins with value 0 stay 0
- All other border coins increment by 1
- Every 3 turns: zero-value coins regenerate with `random(1, 9)`

---

## Grid Layout

The 4×4 grid uses CSS `order` to position elements:

```
Index | ID Scheme  | CSS Order | Position
 1    | Entry ID 1 | 6         | Row 2, Col 1 (top-left inner)
 2    | Entry ID 2 | 7         | Row 2, Col 2 (top-right inner)
 3    | Entry ID 3 | 10        | Row 3, Col 1 (bottom-left inner)
 4    | Entry ID 4 | 11        | Row 3, Col 2 (bottom-right inner)
 5    | Border 101 | 1         | Row 1, Col 1 (border)
 6    | Border 102 | 2         | Row 1, Col 2 (border)
 7    | Border 103 | 3         | Row 1, Col 3 (border)
 8    | Border 104 | 4         | Row 1, Col 4 (border)
 9    | Border 105 | 5         | Row 2, Col 3 (border)
10    | Border 106 | 8         | Row 2, Col 4 (border)
11    | Border 107 | 9         | Row 3, Col 3 (border)
12    | Border 108 | 12        | Row 3, Col 4 (border)
13    | Border 109 | 13        | Row 4, Col 1 (border)
14    | Border 110 | 14        | Row 4, Col 2 (border)
15    | Border 111 | 15        | Row 4, Col 3 (border)
16    | Border 112 | 16        | Row 4, Col 4 (border)
```

`CoreSphereComponent` is absolutely positioned at center of `.app-grid`.

---

## Game Loop Sequence

```
1. HomePageComponent.ngOnInit() → loadLevel(0)
2. loadLevel() → TurnEngine.loadLevel(turns, quota) → GridEngine.reset() → _setupGrid()
3. _setupGrid() → reads entryCoins from GridEngine, generates 12 random border coins → makeGrid()
4. Player clicks coins → GridEngine.selectCoin(id) → TurnEngine.evaluateSelection(values)
5. evaluateSelection() → sums values, computes nextMultiples, checks % coreSphere
6. If break detected → break$ = true → effect fires → 1s timeout → GridEngine.confirmBreak() → GridEngine.startNewTurn() → TurnEngine.advanceTurn()
7. advanceTurn() → generates new core sphere, increments turn, checks gameEnded
8. When gameEnded → handleGameEnd() → checks levelQuota >= quotaLimit → opens WinDialog or LossDialog
```

---

## Levels

15 levels defined in `src/assets/levels.json`. Progressive difficulty:

| Level | Turns | Quota | Time (s) |
|---|---|---|---|
| 1 | 15 | 20 | 60 |
| 2 | 15 | 30 | 60 |
| 3 | 20 | 50 | 45 |
| 4 | 20 | 70 | 45 |
| 5 | 25 | 95 | 40 |
| 6 | 25 | 120 | 40 |
| 7 | 30 | 150 | 35 |
| 8 | 30 | 180 | 35 |
| 9 | 35 | 215 | 30 |
| 10 | 35 | 250 | 30 |
| 11 | 40 | 290 | 25 |
| 12 | 40 | 330 | 25 |
| 13 | 45 | 380 | 20 |
| 14 | 45 | 430 | 20 |
| 15 | 50 | 480 | 15 |

---

## Dialog Communication Pattern

```
HomePageComponent
  → dialog.open(WinDialogComponent, { data: { score, level, isHighscore } })
    → dialogRef.afterClosed() emits:
      → true  → replay (loadLevel same level)
      → false → nextLevel (level++)
      → 'quit' → router.navigate(['/'])
    → WinDialog can open HighscoreEntryComponent (nested dialog)
      → HighscoreEntryComponent saves via PlayerService.saveScore()
  → dialog.open(LossDialogComponent, { data: { score, level } })
    → dialogRef.afterClosed() emits:
      → true  → replay
      → false → nextLevel
```

---

## Conventions

- **Standalone components** — new components are standalone; older pages still use NgModules
- **`inject()` DI** — no constructor-based dependency injection
- **OnPush change detection** — on game grid, home page, core sphere, win dialog
- **Signals** — `WritableSignal` internally, exposed as `asReadonly()` with `$` suffix
- **Exception:** `PlayerService.playerInitials` is a public `WritableSignal` (not `$` convention)
- **Private members** — prefixed with `_`
- **Formatting** — single quotes, 80 printWidth, 2-space indent (Prettier)
- **Imports** — sorted via `eslint-plugin-simple-import-sort` (external first, then internal)
- **Material over Ionic** — prefer Angular Material components where applicable
- **TypeScript strict** — `strict: true` with all strict flags enabled
- **Component selectors** — `app-*` kebab-case (element)
- **Directive selectors** — `app*` camelCase (attribute)

---

## Known Technical Debt / Quirks

1. **`playerInitials`** in `PlayerService` is a public `WritableSignal` — inconsistent with readonly `$` convention
2. **`home.page.ts`** — empty file, likely leftover
3. **Empty spec files** — `shared.module.spec.ts`, `dialog.component.spec.ts`, `home.module.spec.ts`, `home-routing.module.spec.ts`
4. **`CoinComponent`** — missing explicit `ChangeDetectionStrategy.OnPush` (though conventions suggest it)
5. **Most Ionic CSS imports are commented out** in `global.scss`
6. **Component style budgets were raised** from 2kb/4kb to 8kb/16kb for coin prototype
7. **`LossDialogComponent`** has inline template/styles — inconsistent with other components
8. **`PortfolioItem`** interface is unused (leftover from template)
9. **Time limit** is defined in levels.json but the timer is never implemented in the frontend
10. **API key** is hardcoded in both `environment.ts` and `environment.prod.ts` (should use env vars)

---

## Git Flow

- **`dev`** — integration branch. All feature branches merge here.
- **`feature/*`** — branches for new features / refactors. Branch from `dev`, merge back to `dev`.
- **`main`** — production. Only `release/*` or `hotfix/*` branches merge here.
- **`release/*`** — release candidates branched from `dev`, merged to `main` + back to `dev`.
- **`hotfix/*`** — urgent fixes branched from `main`, merged to `main` + `dev`.

### Process
1. `git checkout dev && git pull`
2. `git checkout -b feature/my-feature`
3. Work, commit, push
4. Create PR on GitHub: `feature/my-feature` → `dev`
5. Merge via PR (no direct pushes to `dev` or `main`)

---

## Backend API

PHP/SQLite API in `api/` directory for highscore persistence.

- `GET /api/get-scores.php` — top 10 highscores. Seeds dummy score (`TOM`, 1500, level 2) if table empty.
- `POST /api/save-score.php` — save a score (requires `X-API-Key` header). Prunes to top 10 after insert.
- Run locally: `php -S localhost:8000 -t api/`
- Angular env points to `http://localhost:8000/api/`

### API Validation
- `initials`: 3 uppercase letters (regex `/^[A-Z]{3}$/`)
- `score`/`level`: non-negative integers
- Auth: `X-API-Key` header matching `.env` `API_KEY`
- CORS: configured via `CORS_ORIGIN` env var (dev: `http://localhost:4200`)

---

## Testing

- **Framework:** Jasmine 5.1 + Karma 6.4
- **Spec files** co-located with components/services
- Coverage via `karma-coverage` (HTML + text-summary reporters)
- **Service tests:** `turn-engine.service.spec.ts` (10 tests), `grid-engine.service.spec.ts` (13 tests)
- **Smoke tests:** AppComponent, MainMenuComponent, CoinSelectPageComponent, CoinFormComponent, HomePageComponent, GridComponent, CoreSphereComponent, CoinComponent, HighscoreComponent
- **Empty spec files** (placeholders): SharedModule, DialogComponent, HomeModule, HomeRoutingModule
- **Test runner:** Chrome via Karma, `npm test` or `ng test`

---

## Commands

| Command | Description |
|---|---|
| `npm start` | Dev server (`ng serve`) |
| `ionic serve` | Dev server with live reload |
| `npm test` | Run unit tests (Karma) |
| `npm run lint` | Lint TS + HTML |
| `npm run lint:fix` | Lint and auto-fix |
| `ionic build --prod` | Production build → `www/` |
| `ionic capacitor build android` | Build Android native |
| `npx cap open android` | Open Android Studio |
| `git checkout dev && git checkout -b feature/<name>` | Start new feature branch (gitflow) |

---

## Environment

| Variable | Dev | Prod |
|---|---|---|
| `url` | `http://localhost:8000/api/` | `https://www.tom-gonzalez.com/api/` |
| `apiKey` | Hardcoded (same) | Hardcoded (same) |
| `.env APP_ENV` | `development` | — |
| `.env CORS_ORIGIN` | `http://localhost:4200` | — |

---

## `todolist.txt` (Known Pending Work)

```
Win when quota is met
Dialog next level space between buttons
Try to get a better fit in portrait
Add padding in top for dropbar
Add save highscore
Reset grid for new game
Add random for bordercoins
Add main menu
```

Most items are now implemented except portrait layout improvements and button spacing.
