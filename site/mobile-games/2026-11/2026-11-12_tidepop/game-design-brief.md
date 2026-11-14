# Tidepop

> A bubble shooter where every miss pushes the ceiling closer, and the way out is to cut whole clusters loose rather than nibble at the edges.

**Date**: 2026-11-12
**Genre**: bubble shooter
**Platform**: Mobile (portrait, touch-first)
**Status**: Playable build

## Concept

You fire colored bubbles up into a hanging cluster under the sea. Matching three pops them, but the real pressure is a meter by the shooter: each shot that pops nothing fills a pip, and a full meter drops the ceiling one row. The board is endless, so the question each shot is whether to take the safe small pop or aim at the one bubble holding a big mass up.

## How to play

Drag anywhere on the screen to aim (a dotted guide shows one wall bounce) and lift your finger to fire. Tap the small NEXT bubble at bottom right to swap it with the loaded one. The speaker button at bottom left mutes. You lose when a bubble crosses the dashed line near the shooter.

Desktop: mouse drag and release works the same. Left/Right arrows aim, Space or Up fires, S or Down swaps, R restarts, P pauses, M mutes.

## Core mechanics

- Hex-packed grid, 9 and 8 columns alternating. Three or more touching bubbles of one color pop.
- Anything no longer connected to the ceiling falls, and falling is worth far more than popping.
- Pressure meter: a miss adds a pip; popping exactly three removes one pip; popping four or more, or dropping anything, empties it. A full meter (6 pips at the start) lowers the ceiling.
- Shell stones are grey and never match. A neighboring pop cracks one, a second pop breaks it.
- Three scoring shots in a row earns a tide bomb as the next bubble. It clears everything within about two bubbles of where it lands, stones included.
- Shot colors are drawn only from colors still on the board, so you are never stuck with a color that cannot match.

## Progression & scoring

Level rises every 14 shots, up to level 8, and each step changes a different kind of pressure. Level 2 adds a fifth color. Level 3 brings shell stones into new rows. Level 5 adds a sixth color. Level 6 shrinks the meter to 4 pips, so misses cost more.

A pop scores 10 per bubble plus a bonus that grows with group size (4 bubbles: 45, 6 bubbles: 105). Dropped bubbles score 20 each plus 5 times the count squared, so dropping 8 is worth 480 before multipliers. A consecutive-scoring-shot streak multiplies everything by up to x5, and one missed shot ends it. Clearing the board gives 500 and four fresh rows. The best score is saved on the device.

## Look & feel

Deep-sea navy with soft light shafts and drifting ambient bubbles. Bubbles are glossy sprites drawn at runtime on canvas, each color carrying its own small glyph (ring, diamond, triangle, square, plus, cross) so colors stay readable without relying on hue. The picture sits in a portrait phone frame on a muted backdrop, and fills the whole screen on a real phone. Sound is synthesized with WebAudio: pops climb in pitch down the cluster and rise with the streak, drops thud low, bombs rumble. Drops and bombs shake the screen briefly.

## What makes it fun

- The greedy shot is the strong one. A tidy three-pop barely relieves the meter, while a cut through a thin stem can drop twenty bubbles, empty the meter, and start a multiplier.
- You can see the loss coming: pips fill, the ceiling lurches, and the red line pulses when the stack gets low, so a loss usually traces back to one shot you took too safely.
- Swapping costs nothing but forces a decision about whether to spend the bubble you hold or the one you were saving for a bank shot off the wall.
- Stones turn some clean shots into setups: you pop beside them first, then cut them loose.
