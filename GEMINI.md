# SphereBreak — AI Context

## Core Game Rules
- Match multiples of the core sphere (1-9) by summing coin values
- 4 entry coins per game, must be selected first each turn
- Border coins can only be selected after an entry coin
- Win: meet/exceed quota before turn limit
- Lose: fail quota by turn limit
- 15 levels (progressive difficulty)

## Key Files

| File | Purpose |
|---|---|
| `CONTEXT.md` | Full project overview, architecture, conventions |
| `docs/GAME_LOOP.md` | Detailed turn lifecycle, scoring, echo, border regen |
| `docs/COMPONENT_TREE.md` | Component hierarchy, signal flow, router map |
| `docs/STYLES_AND_THEMING.md` | Theme system, CSS variables, font/asset inventory |
| `docs/TESTING.md` | Test inventory, gaps, Karma/Jasmine config |
| `docs/API.md` | PHP backend endpoints, validation, errors |
| `docs/CONFIG_FILES.md` | All config files (angular, ts, eslint, prettier, etc.) |
| `src/shared/services/turn-engine.service.ts` | Turn logic, break detection, scoring |
| `src/shared/services/grid-engine.service.ts` | Grid state, selection rules, border evolution |
| `src/home/home.page.component.ts` | Game orchestrator, break effects, dialog management |

## Key Conventions
- Signals: `WritableSignal` private → `asReadonly()` with `$` suffix
- DI: `inject()` only, no constructor DI
- Standalone components preferred (older pages still use NgModules)
- OnPush: game grid, home page, core sphere, win dialog
- Material over Ionic components

## URLs
- Dev: `http://localhost:4200`
- API: `http://localhost:8000/api/` (run `php -S localhost:8000 -t api/`)
- Prod: `https://www.tom-gonzalez.com/api/`
