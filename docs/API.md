# Backend API Reference

## Overview

PHP/SQLite backend for highscore persistence. Located in `api/` directory.

### Tech
- PHP 8.0+
- SQLite via PDO
- vlucas/phpdotenv for `.env` loading
- CORS headers configured for Angular dev server

### Local Development
```sh
php -S localhost:8000 -t api/
```

## Endpoints

### `GET /api/get-scores.php`

Fetches top 10 highscores.

**Headers:**
```
X-API-Key: <API_KEY>
```

**Response (200):**
```json
[
  { "initials": "TOM", "score": 1500, "level": 2 },
  { "initials": "JDO", "score": 1200, "level": 1 }
]
```

**Edge cases:**
- If `highscores` table is empty, seeds a dummy score (`TOM`, 1500, level 2)
- If table doesn't exist, auto-creates it

### `POST /api/save-score.php`

Saves a new highscore.

**Headers:**
```
Content-Type: application/json
X-API-Key: <API_KEY>
```

**Body:**
```json
{
  "initials": "ABC",
  "score": 2500,
  "level": 3
}
```

**Validation rules:**
| Field | Rule |
|---|---|
| `initials` | Required, must match `/^[A-Z]{3}$/` (3 uppercase letters) |
| `score` | Required, non-negative integer |
| `level` | Required, non-negative integer |

**Response (200):**
```json
{
  "message": "High score added successfully.",
  "highscores": [
    { "initials": "ABC", "score": 2500, "level": 3 },
    ...
  ]
}
```

**Post-insert:** Trims table to top 10 scores.

## Database

### Schema (`highscores.db`)
```sql
CREATE TABLE IF NOT EXISTS highscores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  initials TEXT NOT NULL,
  score INTEGER NOT NULL,
  level INTEGER NOT NULL
);
```

### Location
- Database file: `highscores.db` in project root
- Git-ignored (pattern: `*.db`)

## Authentication

- All requests require `X-API-Key` header
- Key must match `API_KEY` from `.env` file
- Uses `hash_equals()` for timing-safe comparison on POST (but simple `!==` on GET)

## Environment Variables

| Variable | Dev Value | Prod Value |
|---|---|---|
| `API_KEY` | (hardcoded 128-char key) | Same key (should be different) |
| `APP_ENV` | `development` | Should be unset/`production` |
| `CORS_ORIGIN` | `http://localhost:4200` | Should be production domain `https://www.tom-gonzalez.com` |

## Error Codes

| Status | Meaning |
|---|---|
| 400 | Invalid JSON, missing fields, validation failure |
| 401 | Missing/invalid API key |
| 500 | Database errors (Dev: shows details, Prod: generic message) |
