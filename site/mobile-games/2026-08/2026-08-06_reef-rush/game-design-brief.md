# Reef Rush

> Swap adjacent reef gems to line up three or more before the tide runs out. Bigger matches leave behind gems worth saving for a bigger detonation later.

**Date**: 2026-08-06
**Genre**: match-3
**Platform**: Mobile (portrait, touch-first)
**Status**: Playable build

## Concept

A six-by-eight grid of coral, teal, gold, violet, and sunset gems sits inside a glowing reef. The player swaps neighbors to build runs of three, and every clear buys back a few seconds on a draining tide meter, which is the actual clock the run lives or dies by. Four-in-a-row and five-in-a-row matches leave a Pearl or a Current gem sitting on the board instead of clearing outright, which turns the usual "clear the biggest match you can find" instinct into a real choice: cash in now, or wait and see what it can do combined with a second special.

## How to play

Drag from a gem toward a neighbor to swap them, or tap one gem and then an adjacent one — both work. On desktop, arrow keys move a cursor and Enter/Space swaps. A swap that lines up three or more of a color clears them and adds time to the tide bar at the top; a swap that doesn't line anything up slides back into place. The tide bar drains continuously — when it hits zero, the run ends. R restarts, and there's a Play Again button on the game-over screen.

## Core mechanics

- **Swap-to-match** — any adjacent pair can trade places; the swap only holds if it creates a run of three or more in that gem's row or column.
- **Tide meter, not a countdown**: the clock only moves one way, down, unless matches feed it, so playing passively is a losing strategy.
- **Pearl and Current gems**: a four-match leaves behind a Pearl (clears a 3×3 block when triggered); a five-match or an L/T-shaped match leaves a Current (clears its whole row or column). Neither triggers on creation. They sit on the board as a small reward and detonate later when matched into a same-color run or swapped directly into another special.
- **Kelp** — after 300 points, patches of kelp start filling in empty slots. They can't be swapped, but any match that touches one destroys it, so clearing near kelp is worth more than clearing away from it.
- **Cascades** — gems fall to fill gaps after every clear, and a fall that lines up a new match keeps going without the player doing anything, with each link in the chain worth progressively more time and score.

## Progression & scoring

Each cleared gem is worth 10 points times a cascade multiplier that climbs from 1× to a cap of 3× the longer a chain runs. Tide refills scale the same way — a single three-match is worth a modest sip of time, but a five-gem cascade chain buys several seconds back. The tide drains faster in four steps (at 300, 900, 1,800, and 3,000 points), and kelp starts appearing at 300 and gets denser at 900, so the board gets harder to read at the same time the clock gets less forgiving.

## Look & feel

Deep-water teal and near-black backgrounds frame a bright five-color gem palette rendered as glossy canvas circles with a soft highlight, so the board reads clearly even as kelp clutters it. Pearls glow white at their center; Currents carry a bright line pointing the direction they'll clear. Matches trigger a screen shake and a rising square-wave chime, with a bigger freeze-frame and a sawtooth sweep on any special detonation. The whole board sits inside an on-screen phone bezel with a notch and home indicator, on a dark radial backdrop.

## What makes it fun

- **The hold-or-cash-in decision**: a Pearl sitting on the board is safe value. Leaving it there while the tide keeps draining is a real bet that a second special, or a matching same-color run, shows up before time runs out.
- **Detonation chains** — swap two specials into each other and both go off at once, and if either one's blast catches a third special, that one detonates too, so a lucky board can clear a third of the grid in one move.
- **Kelp turns "any match" into "which match"** — once it's on the board, the correct play often isn't the biggest run available but the one that also clips a kelp patch.
- **The clock is the opponent, not a wall** — because the tide only goes up when you're actively finding matches, every idle second is a step toward losing, which keeps the swap-scan-swap rhythm constant instead of front-loaded.
