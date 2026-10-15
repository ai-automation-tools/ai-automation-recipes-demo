# Merge Bloom

> Drop flowers into a garden grid and chain merges to bloom your way to legendary bouquets.

**Date**: 2026-07-09
**Genre**: merge puzzle
**Platform**: Mobile (portrait, touch-first)
**Status**: Playable build

## Concept

Merge Bloom is a column-drop merge puzzle where the player drops a single flower tile into one of five columns, and any two or more adjacent matching flowers instantly merge into the next flower in a botanical chain — from seedling to legendary bouquet. The fantasy is a meditative gardening session that suddenly avalanches into a cascading bloom chain, rewarding patience and column management with a satisfying visual pop.

## How to play

A flower tile is queued (shown above the grid). Tap any column (or press keys 1–5 on desktop) to drop the tile into the lowest open cell of that column. Any touching tiles of the same type merge into the next tier and apply gravity, potentially triggering further chain merges. The game ends when any tile reaches the top row. Press R or tap "Play Again" to restart.

## Core mechanics

- **Column-drop placement** — one tile drops per turn into the lowest empty cell of the chosen column.
- **Adjacency merge** — 2+ horizontally or vertically adjacent tiles of the same tier merge into one tile one tier higher, placed at the topmost / leftmost cell of the cluster.
- **Cascade gravity** — after each merge, tiles above fall to fill gaps, potentially triggering further merges automatically.
- **Tier progression** — 8 tiers (🌱→🌼→🌷→🌺→🌸→🌻→🪷→💐); the max tier (💐) cannot merge further and locks that cell.
- **Adaptive spawn rate** — higher-tier tiles appear in the queue as the score grows, keeping late-game interesting.

## Progression & scoring

Points are awarded on each merge equal to the new tile's tier points multiplied by the cluster size (e.g. a 3-way merge into 🌺 = 130 × 3 = 390 points). Cascading chain merges from a single drop multiply rapidly. Higher spawn tiers unlock above 500 / 1000 / 1500 points, slowly filling the board with more valuable — and harder to manage — tiles.

## Look & feel

Deep purple night-garden palette: dark violet background with radial glow from each flower tile in the tile's accent color (green sprout glow, gold daisy glow, pink rose glow, etc.). Animated floating petals drift across the backdrop. The game lives inside a sleek phone bezel on a dark radial backdrop. All art is emoji + CSS/canvas — no external image assets. Score floats up from merged cells in mint green; merge animations pop the tile to 1.28× scale. No audio (WebAudio would add complexity without benefit for this meditative genre).

## What makes it fun

- **Chain cascade dopamine** — a well-placed tile can trigger 4+ merges in rapid succession, with each merge visually popping and score numbers floating up.
- **Genuine strategy** — choosing which column to drop into matters immediately; filling the wrong column blocks future merges and ends the game.
- **Instant readability** — emoji tiers are instantly distinguishable at a glance with no color-blindness issues; the botanical progression feels intuitive.
- **No timer pressure** — the puzzle is spatial and deliberate, contrasting with most arcade mobile games and lending itself to one-more-turn play.
