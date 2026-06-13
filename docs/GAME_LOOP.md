# Game Loop Reference

## Turn Lifecycle

### 1. Level Initialization (`HomePageComponent.loadLevel(level)`)
```
loadLevel(level)
  → TurnEngine.loadLevel(turns, quota)
    - Sets turnLimit$, quotaLimit$
    - Resets score, turn, break, echo, total
    - Generates new coreSphere$ (random 1-9)
    - Computes initial nextMultiples$ (next 5 multiples of coreSphere)
  → GridEngine.reset()
    - Clears levelQuota$ (0)
    - Resets selectedCoins$ ([])
    - Resets _turnsSinceRegen (0)
  → HomePageComponent._setupGrid()
    - Reads entry coins from GridEngine
    - Generates 12 random border coins (1-9) via makeGrid()
```

### 2. Player Turn

#### Coin Selection (`GridEngine.selectCoin(coinId)`)
```
selectCoin(coinId)
  → isValidSelection(coinId)
    - Returns false if: coin doesn't exist, already selected, or border coin selected before any entry coin
  → Adds coin to selectedCoins$
  → Computes values array from selected coins
  → TurnEngine.evaluateSelection(values)
```

#### Break Evaluation (`TurnEngine.evaluateSelection(values)`)
```
evaluateSelection(values)
  → total = sum(values)
  → set currentTotal$ = total
  → computeNextMultiples(total)
    - Finds next 5 numbers > total that are divisible by coreSphere
  → checkForBreak(total)
    - If total > 0 AND total % coreSphere === 0 AND NOT already broken:
      ◦ Set break$ = true
      ◦ Set coinCounter$ = number of coins used
      ◦ multiplesFound = total / coreSphere
      ◦ Calculate score: coinsUsed * 10 + multiplesFound * 50
      ◦ Increment echo$ if lastBreakCoinCount === current coin count
```

### 3. Break Effect (`HomePageComponent effect`)
```
effect() watching break$
  → If break$:
    - Wait 1 second (setTimeout)
    - Present Ionic toast "Break! You matched a multiple!"
    - GridEngine.confirmBreak()
      ◦ Calculate border coins used from selectedCoins$
      ◦ Increment levelQuota$ by the count
      ◦ Set consumed border coin values to 0
    - GridEngine.startNewTurn()
      ◦ Clear selectedCoins$ to []
      ◦ Increment all non-9 border coins by 1 (9s → 0, 0s stay 0)
      ◦ Every 3 turns: regenerate zeroed border coins with random(1-9)
    - TurnEngine.advanceTurn()
      ◦ Set break$ = false
      ◦ Set currentTotal$ = 0
      ◦ Store last coin count for echo comparison
      ◦ Increment turn$
      ◦ If turn > turnLimit → set gameEnded$ = true
      ◦ Else → generate new coreSphere$ (random 1-9)
```

### 4. Game End (`HomePageComponent effect`)
```
effect() watching gameEnded$
  → handleGameEnd()
    - If levelQuota$ >= quotaLimit$ (WIN):
      ◦ Load highscores from API
      ◦ If top-10-worthy → open WinDialog with isHighscore=true
      ◦ Else → open WinDialog with isHighscore=false
    - If levelQuota$ < quotaLimit$ (LOSS):
      ◦ Open LossDialog
```

### 5. Dialog Outcomes

| Dialog | Result | Action |
|---|---|---|
| WinDialog | `true` | `replay()` → reloads same level |
| WinDialog | `false` | `nextLevel()` → level++, loads next |
| WinDialog | `'quit'` | `router.navigate(['/'])` → main menu |
| LossDialog | `true` | `replay()` → reloads same level |
| LossDialog | `false` | `nextLevel()` → level++, loads next |

---

## Score Mechanics

### Formula
```
score += coinsUsed * 10 + multiplesFound * 50
```

Where `multiplesFound = total / coreSphere`

### Examples (core sphere = 5):
| Selected | Total | Coins Used | Multiples Found | Score Added |
|---|---|---|---|---|
| [5] | 5 | 1 | 1 | 10 + 50 = 60 |
| [2, 3] | 5 | 2 | 1 | 20 + 50 = 70 |
| [2, 3, 5] | 10 | 3 | 2 | 30 + 100 = 130 |
| [5, 5, 5, 5] | 20 | 4 | 4 | 40 + 200 = 240 |

---

## Echo Mechanic

When consecutive breaks use the **same number of coins**, `echo$` increments.
- Tracks via `_lastCoinCount` (set after each advanceTurn)
- Compared against `_numberOfCoinsAdded` in the current break
- No cap — can chain indefinitely

---

## Border Coin Evolution

Each `startNewTurn()` call transforms border coins:

| Current Value | After startNewTurn |
|---|---|
| 0 (consumed/regenerated) | 0 (stays 0 until regen tick) |
| 1-8 | value + 1 |
| 9 | → 0 (consumed at edge) |

Every 3rd `startNewTurn()` call:
- All border coins with value 0 regenerate to `random(1, 9)`

This means a coin consumed via `confirmBreak()` (set to 0) can stay 0 for up to 3 turns before regenerating.

---

## Score Breakdown Per Level

Assuming optimal play (always 4 coins, max multiples):

| Level | Turns | Quota | Min Turns to Win | Est. Score |
|---|---|---|---|---|
| 1 | 15 | 20 | 5 (quota=20, 4 border coins/break) | 5×(40+var) ≈ 600+ |
| 5 | 25 | 95 | 24 (quota=95, 4 border coins/break) | 24×(40+var) ≈ 2900+ |
| 15 | 50 | 480 | 50 (every turn, 4 coins) | 50×(40+var) ≈ 6000+ |

---

## Time Limit

Levels.json defines `timeLimit` (60s → 15s) but **no timer implementation exists** in the frontend. This is noted technical debt.
