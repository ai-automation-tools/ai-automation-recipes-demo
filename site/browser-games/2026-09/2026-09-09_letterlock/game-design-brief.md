# Letterlock

> Swap tiles into place to crack a scrambled word before the fuse burns out, and each crack shortens the fuse and adds a letter.

**Date**: 2026-09-09
**Genre**: word scramble
**Status**: Playable build

## Concept

Letterlock is a heist-themed word scramble: every round is a lock made of jumbled letters, and you're the one cracking it under a ticking fuse. There's no typing. You tap two tiles to swap them, watching letters lock green the moment they land in the right slot, until the whole row reads clean.

## How to play

Tap (or click) any two letter tiles to swap their positions. A tile turns green the instant it's in the right spot for the target word. Decoy letters start showing up from round 5 on; they can never turn green, so you have to swap them out to the far end of the row. Solve the word before the fuse bar empties. Press H, or tap Hint, to force one letter into place, but it costs 5 seconds off the fuse and resets your combo. Arrow keys plus Space or Enter play the whole game without a mouse. Press R any time to restart.

## Core mechanics

- **Swap-to-solve**: the only verb in the game is picking two tiles and swapping them. Depth comes from which two, not from more buttons.
- **The fuse**: a shrinking countdown bar that is the sole threat; run it out and the round, and the run, ends.
- **Decoy letters**: extra tiles that don't belong in the word, mixed into the row from round 5 on, that eat swaps if you can't tell them from the real thing at a glance.
- **Combo multiplier**: consecutive rounds cracked without a hint raise your score multiplier up to 3x; one hint use resets it to 1x.

## Progression & scoring

Word length climbs from 4 letters to 8 across roughly a dozen rounds, decoy tiles start appearing at round 5 and stack up to 3 by round 14, and the fuse itself gets shorter every round: 40 seconds on round 1 down to a 16-second floor. Each cracked word pays out length times 20 points times your current combo multiplier, plus 3 points for every second still left on the fuse when you land the last swap. A fast, hint-free solve on a long word is worth far more than a slow one.

## Look & feel

Dark navy and gold vault styling. Tiles look like dial-lock keys, and the fuse bar shifts from teal to amber to a pulsing red as it burns down. A canvas-drawn shower of gold sparks fires off every solved word, and the board shakes red when the fuse hits zero. All sound is synthesized on the fly with WebAudio: a soft click on every swap, a three-note chime on a solve, a low sawtooth thud on game over. Nothing is pre-recorded.

## What makes it fun

- The green-tile feedback turns a blind scramble into a readable puzzle. You always know how close you are, which is what makes "just one more swap" so hard to put down.
- Decoys create a real decision: swap fast and risk locking a wrong letter into place, or check twice and burn fuse time doing it.
- The hint is a genuine trade. It saves a round you're about to lose, but wipes the combo you've been building, so using it stings a little even when it's the right call.
