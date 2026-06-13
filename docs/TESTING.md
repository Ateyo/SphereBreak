# Testing Reference

## Test Framework

- **Test runner:** Karma 6.4.0 with Jasmine 5.1.0
- **Browser:** Chrome (via `karma-chrome-launcher`)
- **Coverage:** `karma-coverage` (HTML + text-summary reporters)
- **Entry point:** `src/test.ts` (uses `BrowserDynamicTestingModule`)

## Running Tests

```sh
npm test         # ng test (single run with watch)
```

## Test Inventory

### Service Tests

#### `turn-engine.service.spec.ts` (10 tests)

| Test | What it verifies |
|---|---|
| `evaluateSelection computes total and nextMultiples` | Sum, multiple computation |
| `detects break when total is a multiple of coreSphere` | Break detection (pass) |
| `does NOT detect break when total is 0` | No false break on empty selection |
| `does NOT detect break when total is not a multiple` | No false break on non-multiple |
| `calculates score on break: 10pts per coin + 50pts per multiple` | Score formula |
| `echo increments when same number of coins in consecutive breaks` | Echo mechanic |
| `advanceTurn increments turn` | Turn counting |
| `advanceTurn resets total and clears break flag` | State reset on turn advance |
| `advanceTurn past turnLimit ends the game` | Game end condition |
| `loadLevel sets turn and quota limits, resets state` | Level loading |
| `resetGame clears gameEnded flag` | Game reset |

#### `grid-engine.service.spec.ts` (13 tests)

| Test | What it verifies |
|---|---|
| `addEntryCoin adds a coin to entryCoinsArray` | Entry coin addition |
| `removeEntryCoin removes the coin with matching id` | Entry coin removal |
| `selectCoin adds an entry coin to selection when allowed` | Selection (entry allowed) |
| `selectCoin rejects border coin when no entry coin selected` | **CRITICAL:** border coin guard |
| `selectCoin allows border coin after entry coin selected` | Selection (border after entry) |
| `selectCoin rejects duplicate selection` | No double-select |
| `confirmBreak increments levelQuota by border coins used` | Quota tracking |
| `reset clears quota, selection, and game state` | Full reset |
| `isValidSelection returns false for non-existent coin` | Non-existent ID guard |
| `isValidSelection returns true for selectable entry coin` | Valid entry |
| `isValidSelection returns false for border coin without entry coin selected` | Border reject guard |
| `isValidSelection returns true for border coin after entry coin selected` | Border after entry |
| `isValidSelection returns false for already selected coin` | No re-select |
| `startNewTurn clears selection` | Selection reset |
| `regenerates zeroed border coins after 3 turns` | Regen mechanic |

### Component Smoke Tests (9 tests)

| Spec | Dependencies |
|---|---|
| `app.component.spec.ts` | `provideRouter([])` |
| `main-menu.component.spec.ts` | `RouterTestingModule` |
| `coin-select-page.spec.ts` | `RouterTestingModule` |
| `coin-form.component.spec.ts` | `RouterTestingModule` (standalone) |
| `home.page.component.spec.ts` | `HttpClientTestingModule`, `IonicModule.forRoot()` |
| `grid.component.spec.ts` | `IonicModule.forRoot()` |
| `core-sphere.component.spec.ts` | `IonicModule.forRoot()` |
| `coin.component.spec.ts` | `IonicModule.forRoot()` |
| `highscore.component.spec.ts` | `HttpClientTestingModule`, `RouterTestingModule` |

### Empty Spec Files (placeholders)
- `shared.module.spec.ts`
- `dialog.component.spec.ts`
- `home.module.spec.ts`
- `home-routing.module.spec.ts`

## Coverage Reporter

```js
coverageReporter: {
  dir: './coverage/app',
  subdir: '.',
  reporters: [
    { type: 'html' },         // Human-readable HTML report
    { type: 'text-summary' }  // Console summary
  ]
}
```

## Potential Test Gaps

- **HighscoreEntryComponent** — no dialog interaction or save-score tests
- **WinDialogComponent** — no dialog outcome tests
- **LossDialogComponent** — no dialog outcome tests
- **DialogComponent** — generic dialog not tested
- **PlayerService** — no localStorage mock tests
- **CoinPrototypeComponent** — prototype, not tested (likely intentional)
- **HomePageComponent** — only smoke test, no game-loop integration tests (e.g., break → confirm → advance chain)
- **No end-to-end tests** — no Protractor/Playwright/Cypress
- **No component-level async tests** — no `fakeAsync`/`tick` usage found
