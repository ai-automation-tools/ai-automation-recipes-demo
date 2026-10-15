# Neon Labyrinth

> Navigate glowing corridors, collect energy gems, and escape through the pulsing exit portal before time runs out.

**Date**: 2026-07-15
**Genre**: maze
**Status**: Playable build

## Concept

Neon Labyrinth drops the player into a procedurally generated synthwave maze rendered in glowing cyan on deep midnight-blue. Every session generates a unique labyrinth via an iterative depth-first-search backtracker, ensuring a solvable, perfect maze each time. The fantasy is that of a glowing energy orb threading its way through a circuitboard city — urgent, spatial, and satisfying.

## How to play

Navigate the green orb from the top-left start (0, 0) to the magenta ★ exit portal at the bottom-right. Yellow diamond gems scattered through the maze award 50 points each. Reaching the exit awards a time bonus (10 × seconds remaining). A countdown timer runs continuously — hit zero and it's game over. The game advances through levels, each with a larger maze and a tighter effective clock.

**Keyboard**: WASD or Arrow Keys to move · R to restart after game-over or level clear  
**Mobile**: Swipe on the canvas in any direction, or tap the on-screen D-pad  

## Core mechanics

- **Maze navigation** — walls are toggled on/off per cell; the player can only move into adjacent cells where the shared wall has been removed
- **Procedural generation** — iterative DFS backtracker builds a perfect maze (exactly one path between any two cells) on each level start
- **Gem collection** — picking up a gold diamond gem adds 50 points and increments the gems counter in the HUD
- **Timer pressure** — a 1-second interval countdown; collecting gems and moving fast extends the effective value of remaining time
- **Level progression** — COLS and ROWS grow by 2 each level (capped at 22 × 16); time budget grows with maze area but shrinks with level penalty

## Progression & scoring

Level 1 starts with a 10 × 8 maze and roughly 60 seconds. Each level adds 2 columns and 2 rows, giving a larger search space, but the per-level penalty (−4 seconds) squeezes the effective time. From level 7 onward the maze is at its maximum 22 × 16 size and time is at its tightest. Score accumulates across levels: 50 pts per gem + 10 × time-remaining bonus on exit. There is no level cap — the game continues as long as the player can clear each maze.

## Look & feel

Dark midnight-blue-black background (#060618) contrasts sharply with neon cyan walls rendered with canvas shadow blur for a glow effect. The green player orb, magenta exit portal (with a slow rotating dashed ring), and gold diamond gems all pulse with sinusoidal animations driven by a shared phase counter. A live minimap in the top-right corner of the canvas shows uncollected gems (yellow), the exit (magenta), and the player (green) at reduced scale. Audio is absent by design — the pacing and visual feedback are primary.

## What makes it fun

- **Always a new maze** — the DFS backtracker produces a different perfect maze every time, keeping replays fresh and the spatial exploration genuine
- **Minimap tension** — seeing gems and the exit on the minimap but not knowing the exact route to them creates goal-directed urgency
- **Escalating maze size** — early levels fit comfortably on screen with large cells; later levels fill the viewport and require careful reading of the minimap
- **Time-bonus scoring** — speed-running to the exit rewards skill beyond pure collection, encouraging players to weigh gem detours against clock pressure
