# SphereBreak — Project TODO

> Consolidation of all known technical debt, pending features, and improvement opportunities noted during codebase audit.

## Priority: High

- [ ] **Implement timer** — `timeLimit` defined in `levels.json` (60s→15s) but no countdown exists in frontend. Core gameplay mechanic missing entirely.
- [ ] **Extract API key from env vars** — `environment.ts` and `environment.prod.ts` have hardcoded 128-char API keys. Should use Angular CLI `fileReplacements` with `.env` or build-time injection. Also `.gitignore`s `src/environments/*.ts` which would break CI builds.
- [ ] **WinDialog buttons need spacing** — "Replay Level" / "Next Level" / "Quit & Save Score" have no gap between them. Noted in `todolist.txt`.
- [ ] **Portrait layout on mobile** — 4×4 grid + HUD doesn't fit well in portrait on small screens. `todolist.txt` item.

## Priority: Medium

- [ ] **`PlayerService.playerInitials`** is a public `WritableSignal` — breaks the `$` readonly convention used everywhere else (`TurnEngine`, `GridEngine`). Convert to `private _playerInitials` + `readonly playerInitials$`.
- [ ] **`CoinComponent` missing `OnPush`** — other presentational components (`GridComponent`, `CoreSphereComponent`) use `ChangeDetectionStrategy.OnPush` but `CoinComponent` doesn't. Inconsistent.
- [ ] **`LossDialogComponent` uses inline template/styles** — inconsistent with every other component. Extract to separate `.html`/`.scss` files.
- [ ] **Delete empty `home.page.ts`** — 0-line leftover file at `src/app/home/home.page.ts`.
- [ ] **Delete `PortfolioItem` interface** — unused leftover from portfolio template at `shared/interfaces/portfolio-item.ts`.
- [ ] **Fill empty spec files** — `shared.module.spec.ts`, `dialog.component.spec.ts`, `home.module.spec.ts`, `home-routing.module.spec.ts` are all empty placeholders.
- [ ] **Clean up commented-out Ionic CSS** — `global.scss` has ~20 lines of commented-out Ionic CSS imports (`@import '@ionic/angular/css/...'`). Remove if not needed.
- [ ] **Revert component style budgets** — raised from 2kb/4kb to 8kb/16kb (noted "for coin prototype; revisit after deleting prototype"). Budgets are lax.
- [ ] **Add `Highscore` to barrel export** — `shared/interfaces/index.ts` only exports `Coin` + `CoinArray` but not `Highscore`. Inconsistent importing.

## Priority: Low

- [ ] **Add `computed()` signals** — no `computed()` used anywhere. Several derived values could benefit (e.g., `isValidSelection` recomputation, score-per-turn stats).
- [ ] **Replace RxJS `take(1)` with Angular `toSignal()`** — `HomePageComponent` and `HighscoreEntryComponent` use `.pipe(take(1)).subscribe()`. Could use `toSignal` or `lastValueFrom` for cleaner API interaction.
- [ ] **HomePage shouldn't load highscores on every win** — `handleGameEnd` calls `loadHighscores()` on every win to check if score qualifies for top 10. Cache or defer.
- [ ] **Remove `console.log` statements** — `TurnEngine`, `GridEngine`, and `HomePageComponent` have extensive `console.log` debugging. Clean up for production.
- [ ] **HomePageComponent is NgModule-based** — inconsistent with standalone-first convention. Convert to standalone.
- [ ] **`CoreSphereComponent` is NgModule-based** — same as above. Convert to standalone.
- [ ] **`HighscoreComponent` is NgModule-based** — same as above. Convert to standalone.
- [ ] **`MainMenuComponent` is NgModule-based** — same as above. Convert to standalone.
- [ ] **`highscore.module.ts` has unused `data.title`** — route definition has `data: { title: 'Highscores' }` but nothing reads it.
- [ ] **`home-routing.module.ts` has unused `title: 'Sphere Break'`** — route title set but no title service reads it.
- [ ] **Add `ChangeDetectionStrategy.OnPush` to `CoinComponent`** — noted above but worth its own item.
- [ ] **`get-scores.php` uses `!==` (not `hash_equals`)** for API key comparison — inconsistent with `save-score.php` which uses `hash_equals`. Timing attack vector (low risk).
- [ ] **`LossDialogComponent` passes `{ score: this.score }` to `HighscoreEntryComponent`** — missing `level` field in `openHighscoreEntry()`. Won't fail (API accepts it optionally) but inconsistent.
- [ ] **E2E tests missing** — no Playwright, Cypress, or Protractor setup. All testing is unit/smoke-level.

## Stretch / Future

- [ ] **Capacitor native features** — Splash screen configured in `capacitor.config.ts` but StatusBar only initialized. No haptics, keyboard, or other native plugin usage.
- [ ] **PWA manifest** — `src/index.html` has PWA meta tags (`mobile-web-app-capable`) but no `manifest.json` or service worker registered.
- [ ] **Shrink `www/` build size** — no bundle analysis done. Could benefit from lazy loading optimization or removing unused Material modules.
- [ ] **Add animations** — `@angular/animations` imported but no component animations used (apart from CSS `spin` on coins).
- [ ] **Internationalization** — all strings hardcoded in English. No i18n setup.
- [ ] **Accessibility audit** — `CoinComponent` has `role="button"` + `aria-label` but other interactive elements may lack a11y attributes.
