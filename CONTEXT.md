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
1. Player picks 4 entry coins (values 1-9) → stored in `CoinsService`
2. Game generates 12 random border coins → 4×4 grid (4 entry + 12 border)
3. Each turn: `MathsService` generates core sphere (1-9) → player selects coins → sum checked vs multiples
4. Break detected → score added, quota incremented, border coins consumed → regenerated after 3 turns
5. Turn limit reached → check quota vs target → win/loss dialog

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
| `MathsService` | `shared/services/maths.service.ts` | Break logic, scoring, turn management, core sphere generation | `coreSphere`, `currentScore`, `turn`, `echo`, `break`, `turnLimit`, `gameEnded` |
| `CoinsService` | `shared/services/coins.service.ts` | Grid management, entry/border coins, selection, quota, coin regeneration | `entryCoinsArray`, `quota`, `levelQuota`, `coinsArray`, `selectedCoins`, `gameWon` |
| `HighscoreService` | `shared/services/highscore.service.ts` | HTTP client for PHP backend (get/save scores) | — |
| `PlayerService` | `shared/services/player.service.ts` | Player initials persistence (localStorage) | `playerInitials` |

---

## Module Structure

```
src/app/
├── main-menu/             # Landing screen ("Start Game" / "Highscores")
├── coin-select/           # Entry coin selection form (4 coins, values 1-9)
│   └── components/form/   # CoinFormComponent
├── home/                  # Core game screen
│   ├── core-sphere/       # CoreSphereComponent (current value display)
│   ├── grid/              # GridComponent (4×4 coin layout)
│   ├── win-dialog/        # WinDialogComponent
│   ├── loss-dialog/       # LossDialogComponent
│   └── highscore-entry/   # HighscoreEntryComponent (3-letter initials)
├── highscore/             # Leaderboard (fetches from API)
└── shared/
    ├── interfaces/        # Coin, CoinArray, Highscore, PortfolioItem
    ├── services/          # MathsService, CoinsService, HighscoreService, PlayerService
    └── components/
        ├── coin/          # CoinComponent (individual coin display/click)
        └── dialog/        # DialogComponent (reusable confirmation)

src/assets/levels.json     # 15 level definitions (turns, quota, time limit)
```

---

## Key Conventions

- **Standalone components** — no NgModules for routing; `loadChildren` with dynamic imports
- **`inject()` DI** — no constructor-based dependency injection
- **OnPush change detection** — on game grid and home page
- **Signals** — `WritableSignal` internally, exposed as `asReadonly()` with `$` suffix (e.g., `turn$()`)
- **Private members** — prefixed with `_`
- **Formatting** — single quotes, 80 printWidth, 2-space indent (Prettier)
- **Imports** — sorted via `eslint-plugin-simple-import-sort` (external first, then internal)
- **Material over Ionic** — prefer Angular Material components where applicable
- **TypeScript strict** — `strict: true` with all strict flags enabled

---

## Levels

15 levels defined in `src/assets/levels.json`. Progressive difficulty:

| Level | Turns | Quota | Time (s) |
|---|---|---|---|
| 1 | 15 | 20 | 60 |
| 5 | 25 | 80 | 40 |
| 10 | 35 | 240 | 25 |
| 15 | 50 | 480 | 15 |

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
| `npx cap open androi`d | Open Android Studio |

---

## Backend API

PHP/SQLite API in `api/` directory for highscore persistence.

- `GET /api/get-scores.php` — top 10 highscores
- `POST /api/save-score.php` — save a score (requires `X-API-Key` header)
- Run locally: `php -S localhost:8000 -t api/`
- Angular env points to `http://localhost:8000/api/`

---

## Testing

- **Framework:** Jasmine 5.1 + Karma 6.4
- **15 spec files** co-located with components/services
- Coverage via `karma-coverage` (HTML + text-summary reporters)
- Most specs are smoke tests; `coins.service.spec.ts` and `maths.service.spec.ts` have substantive unit tests
