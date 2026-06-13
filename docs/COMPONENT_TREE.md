# Component Tree & Communication

## Full Component Hierarchy

```
AppComponent
├── RouterOutlet
│   ├── MainMenuComponent (path: '')
│   │   └── RouterLink → /coin-select, /highscores, /coin-prototype
│   │
│   ├── CoinSelectPageComponent (path: 'coin-select')
│   │   └── CoinFormComponent
│   │       ├── MatFormField, MatInput (coin value 1-9)
│   │       ├── CoinComponent (entry coins preview)
│   │       └── Remove button (MatIconButton)
│   │
│   ├── HomePageComponent (path: 'home')
│   │   ├── Turns/Score/Quota display (inline)
│   │   ├── Sum/Next Multiples display (inline)
│   │   ├── Echo/Coin Counter display (inline)
│   │   ├── GridComponent (app-grid)
│   │   │   ├── CoinComponent × 4 (entry coins, IDs 1-4)
│   │   │   ├── CoinComponent × 12 (border coins, IDs 101-112)
│   │   │   └── CoreSphereComponent (centered overlay)
│   │   ├── WinDialogComponent (via MatDialog)
│   │   │   └── HighscoreEntryComponent (nested via MatDialog)
│   │   ├── LossDialogComponent (via MatDialog)
│   │   │   └── HighscoreEntryComponent (nested via MatDialog)
│   │   └── IonToast (break notification)
│   │
│   ├── HighscoreComponent (path: 'highscores')
│   │   └── HTML table of Highscore[]
│   │
│   └── CoinPrototypeComponent (path: 'coin-prototype')
│       └── Static grid (6 themes, interactive)
```

## Component Details

### Presentational Components

| Component | Selector | Standalone | CD | Inputs | Outputs |
|---|---|---|---|---|---|
| `CoinComponent` | `app-coin` | Yes | Default | `coinId`, `coinValue`, `entryCoin` | None (calls service method) |
| `GridComponent` | `app-grid` | Yes | **OnPush** | None (reads service signals) | None |
| `CoreSphereComponent` | `app-core-sphere` | No | **OnPush** | None (reads service signal) | None |
| `CoinPrototypeComponent` | `app-coin-prototype` | Yes | Default | None (local state) | None |

### Dialog Components

| Component | Selector | Standalone | Opened By | Data | Closes With |
|---|---|---|---|---|---|
| `DialogComponent` | `app-dialog` | Yes | Any (generic) | `DialogData` | `true`/`false` |
| `WinDialogComponent` | `app-win-dialog` | Yes | HomePage | `{score, level, isHighscore}` | `true`/`false`/`'quit'` |
| `LossDialogComponent` | `app-loss-dialog` | Yes | HomePage | `{score, level}` | `true`/`false` |
| `HighscoreEntryComponent` | `app-highscore-entry` | Yes | Win/LossDialog | `{score, level}` | None (saves & closes) |

### Page Components

| Component | NgModule | CD | Services Injected | Signal Consumption |
|---|---|---|---|---|
| `MainMenuComponent` | MainMenuModule | Default | Router | None |
| `CoinSelectPageComponent` | CoinSelectModule (standalone) | Default | None | None |
| `CoinFormComponent` | Standalone | Default | GridEngine, Router | `entryCoinsArray$()` via getter |
| `HomePageComponent` | HomePageModule | **OnPush** | TurnEngine, GridEngine, ToastController, MatDialog, HighscoreService, PlayerService, Router | 11 readonly signals, 2 effects |
| `HighscoreComponent` | HighscoreModule | Default | HighscoreService | None (RxJS subscription) |
| `CoinPrototypeComponent` | Standalone | Default | None | Own `signal('current')` |

## Service Injection Map

```
AppModule
  ├── TurnEngine (providedIn: 'root')
  │   ├── HomePageComponent (inject)
  │   ├── CoreSphereComponent (inject)
  │   └── GridEngine (inject)
  │
  ├── GridEngine (providedIn: 'root')
  │   ├── CoinFormComponent (inject)
  │   ├── HomePageComponent (inject)
  │   ├── GridComponent (inject)
  │   └── CoinComponent (inject)
  │
  ├── HighscoreService (providedIn: 'root')
  │   ├── HomePageComponent (inject)
  │   ├── HighscoreComponent (inject)
  │   └── PlayerService (inject)
  │
  └── PlayerService (providedIn: 'root')
      ├── HomePageComponent (inject) [via Win/LossDialog]
      └── HighscoreService (inject)
```

## Router Map

```
app.routes.ts (provideRouter, PreloadAllModules)
│
├── '' → loadChildren → MainMenuModule
│   └── MainMenuModule: '' → MainMenuComponent
│
├── 'home' → loadChildren → HomePageModule
│   └── HomePageModule: '' → HomePageComponent (title: 'Sphere Break')
│
├── 'coin-select' → loadChildren → CoinSelectModule
│   └── CoinSelectModule: '' → CoinSelectPageComponent
│
├── 'highscores' → loadChildren → HighscoreModule
│   └── HighscoreModule: '' → HighscoreComponent (data.title: 'Highscores')
│
└── 'coin-prototype' → loadComponent → CoinPrototypeComponent
```

## Signal Flow Diagram

```
GridEngine (state)
├── entryCoinsArray$ → CoinFormComponent.get entryCoinsArray()
│                   → GridComponent.entryCoinsArray$
│                   → CoinComponent.selected (via effect)
├── coinsArray$ → GridComponent.coinsArray$
├── selectedCoins$ → CoinComponent (effect sync)
├── levelQuota$ → HomePageComponent.levelQuota$
└── isCoinsSet$ → HomePageComponent.isCoinsSet$

TurnEngine (state)
├── currentTotal$ → HomePageComponent.total$
├── nextMultiples$ → HomePageComponent.nextMultiples$
├── break$ → HomePageComponent (effect trigger)
├── currentScore$ → HomePageComponent.score$
├── echo$ → HomePageComponent.echo$
├── coinCounter$ → HomePageComponent.coinCounter$
├── turn$ → HomePageComponent.turn$
├── turnLimit$ → HomePageComponent.turnLimit$
├── quotaLimit$ → HomePageComponent.quotaLimit$
├── gameEnded$ → HomePageComponent (effect trigger)
└── coreSphere$ → CoreSphereComponent.coreSphere$
```

## CSS Class Hierarchy

```
global.scss
├── :root variables (--mat-sys-*, --layout-padding, --border-radius)
├── Material theme (dark, cyan-orange)
├── Tailwind CSS v4
├── Fonts (Share Tech Mono, kiwi_font, Press Start 2P, Audiowide)
├── Responsive font-size (11px mobile, 16px desktop)
├── .card component
├── .z-shadow-1..5 utility classes
├── .future-grid (decorative background with perspective/masking)
└── app-root/body layout (flexbox centered)

Components use scoped SCSS with BEM-like or nested selectors.
```

## Standalone vs NgModule Inventory

**Standalone components** (`imports` array in component decorator):
- AppComponent
- CoinSelectPageComponent
- CoinFormComponent
- GridComponent
- WinDialogComponent
- LossDialogComponent
- HighscoreEntryComponent
- CoinPrototypeComponent
- DialogComponent
- CoinComponent

**NgModule-based components** (declared/imported via NgModule):
- MainMenuComponent (in MainMenuModule)
- HomePageComponent (in HomePageModule)
- CoreSphereComponent (in HomePageModule — likely should be standalone)
- HighscoreComponent (in HighscoreModule)

**NgModules used for routing only** (no declarations):
- MainMenuModule (imports MainMenuComponent)
- CoinSelectModule (no declarations)
- HomePageModule (no declarations, imports components)
- HighscoreModule (imports HighscoreComponent)
- SharedModule (re-exports Material)
