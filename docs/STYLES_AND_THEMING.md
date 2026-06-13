# Styles & Theming Reference

## Theme System

Angular Material dark theme via `@angular/material` with cyan-orange palette.

### global.scss Theme Configuration
```scss
@use '@angular/material' as mat;
@use '@angular/material/prebuilt-themes/cyan-orange.css';

html {
  @include mat.theme((
    color: (theme-type: dark, primary: mat.$cyan-palette),
    typography: Roboto,
    density: 0
  ));
}
```

### CSS Custom Properties (`:root`)
| Variable | Value | Usage |
|---|---|---|
| `--layout-padding` | `0.625rem` | General layout padding |
| `--mat-sys-background` | `rgb(0 0 0 / 19%)` | Root background (semi-transparent) |
| `--border-radius` | `0.5rem` | Card border radius |
| `--mat-sys-analogous` | `#00fb7e` | Echo/status accent |
| `--mat-sys-warning` | `#ffbb00` | Warning color |
| `--mat-sys-error` | `#db4437` | Error color |

### Background
- Dark asphalt texture: `url(assets/asfalt-light.png)`
- Semi-transparent background overlay
- Color scheme: `dark`

### Typography
- Primary: `'Share Tech Mono', 'Consolas', 'Menlo', 'Monaco', monospace`
- Headings: `'Inter Tight', sans-serif`
- Font size: `11px` (mobile), `16px` (≥992px)
- Loaded via Google Fonts: Roboto, Press Start 2P, Audiowide

## Fonts & Assets

| Font/Asset | Source | Usage |
|---|---|---|
| Roboto | Google Fonts | Material typography base |
| Press Start 2P | Google Fonts | Main menu title style |
| Audiowide | Google Fonts | Main menu game title |
| Share Tech Mono | Google Fonts | Primary app font (global.scss) |
| kiwi_font | `src/assets/Kiwi_Fruit.otf` | Core sphere display / accents |
| Material Icons | Google Fonts | Icons throughout |
| asfalt-light.png | `src/assets/` | Repeating background texture |

## Component-Specific Styles

### Coin Component (`shared/components/coin/`)
- 3D coin via `transform-style: preserve-3d`, `heads`/`tails` pseudo-faces
- Entry coins: gold radial gradient (`#ffd700`)
- Border coins: dark radial gradient (`#52595d`)
- Selected state: enhanced glow + `scale(1.05)` + `spin` animation
- Hidden state: `visibility: hidden` (value 0)
- Hover: `spin` animation (2s linear infinite)
- Coin number: absolute-centered, `rotate(5deg)`, serif font, glow text-shadow

### Main Menu (`main-menu/`)
- Full-viewport centered layout, black semi-transparent background
- Game title: `AudioWide`, 4rem, gold, bordered
- Menu items: `Press Start 2P`, 2rem, white → yellow on hover
- Dev link: fixed bottom-right, `.65rem`, semi-transparent

### Home Page (`home/home.page.component`)
- CSS Grid: `grid-template-columns: 1fr 4fr`
- Responsive: mobile ≤600px collapses to single column
- Echo section: `--mat-sys-analogous` accent color with transparent mix
- Next multiples: first element (closest multiple) blinks gold
- Break overlay: "BREAK!" text centered on grid via `::after`

### Game Grid (`home/grid/`)
- 4×4 CSS grid
- CSS `order` positions coins (see Layout section in CONTEXT.md)
- Entry coins (nth-child 1-4) manually ordered to positions 6, 7, 10, 11
- Border coins (nth-child 5-16) ordered to fill remaining grid cells
- Core sphere: absolute centered, `transform: translate(-50%, -50%)`

### Core Sphere (`home/core-sphere/`)
- 5.5rem circle, `#00bfff` bg, matching glow, white border
- Value text: `kiwi_font`, 4.5rem, pale green (`rgba(152, 251, 152, 0.9)`), rotated 5deg

### Card Component (`.card`)
- `var(--game-surface)` background
- `var(--mat-sys-primary)` border
- `backdrop-filter: blur(10px)`
- Top gradient border line (`::after`)
- `.left-side` / `.right-side` modifiers for flexbox alignment

### Future Grid Background (`app.component.html`)
- Decorative background with CSS perspective + mask-image gradient
- Two panels (left/right): 3×3 grid of bordered items
- Left panel: `rotateY(10deg)`, mask fades left edge
- Right panel: `rotateY(-10deg)`, mask fades right edge
- Hover: scale + glow + background color shift
- SVG smiley folder icon in bottom-right grid cell

## Theme Variations (Coin Prototype)

The `coin-prototype` route showcases 6 coin visual themes:

| Theme | Border Base | Glow Color | Description |
|---|---|---|---|
| Current | `#52595d` | `#00bfff` (blue) | Original flat color |
| Azure | `#2a4a6a` → `#0f1f2f` | `#00bfff` (cyan) | Dark navy gradient |
| Violet | `#3a2a5a` → `#1a0a2a` | `#b43cff` (magenta) | Dark purple gradient |
| Teal | `#1a4a4a` → `#0a2a2a` | `#00c8b4` (teal) | Dark teal gradient |
| Obsidian | `#2a2a3a` → `#080810` | `#64b4ff` (blue-white) | Near-black, high contrast |
| Ruby | `#4a1a1a` → `#200808` | `#ff5050` (red) | Dark crimson gradient |

All themes share the same entry coin (gold/amber) and 3D coin structure.

## Responsive Breakpoints

| Breakpoint | Target | Changes |
|---|---|---|
| ≤600px | Phones | Font-size 11px, single-column layout, break overlay |
| 600px+ | Tablets portrait | — |
| 768px+ | Tablets landscape | — |
| 992px+ | Desktop | Font-size 16px, full layout |
| 1200px+ | Large desktop | — |

## Shadow Utility Classes

| Class | Elevation |
|---|---|
| `.z-shadow-1` | Low (cards, buttons) |
| `.z-shadow-2` | Medium (menus) |
| `.z-shadow-3` | High (modals) |
| `.z-shadow-4` | Very high (tabs) |
| `.z-shadow-5` | Maximum (fab) |
