# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio and educational website (GitHub Pages) for Itay Klein, a teacher. Contains student showcase pages and educational browser games. **No build system** — pure vanilla HTML, CSS, and JavaScript.

## Running Locally

No build step. Serve files with any static HTTP server:

```bash
python3 -m http.server 8000
# or
npx serve .
```

## Architecture

### Site Structure

- `index.html` — Landing page linking to student pages
- `students/` — Individual student portfolio pages (self-contained HTML)
- `games/` — Canvas-based browser games

### Game Architecture

Both games under `games/` follow the same OOP pattern with a canvas element and a main game controller class:

**`games/luachKefel/`** — Multiplication table learning game (spaceship shooter)
- Class hierarchy: `GameElement` → `Spaceship`, `Cannon`, `Missile`, `Life`
- `GameStage` manages difficulty progression (20 stages to win)
- `TheBigGame` is the main controller; player must answer math problems correctly to fire

**`games/spacships/`** — Simple spaceship shooter
- Similar structure but no math mechanic — pure shooting game
- Multiple simultaneous ships; endless play

Both games use `requestAnimationFrame` loops, keyboard event listeners, and `canvas` 2D context rendering. No external libraries or dependencies.
