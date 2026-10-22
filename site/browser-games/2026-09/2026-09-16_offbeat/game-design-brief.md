# Offbeat

> Click the pulsing core the instant its ring collapses into it, and don't flinch at the fake ones.

**Date**: 2026-09-16
**Genre**: rhythm clicker
**Status**: Playable build

## Concept

A glowing core sits at the center of the screen, and a ring closes in on it once per beat. Offbeat is built around one decision repeated at increasing speed: click now, or wait a beat longer for a bigger payout. It goes for the feeling of locking into a groove, and the small jolt of catching yourself about to click on a beat that was never real.

## How to play

Click, tap, or press space the moment the ring reaches the core. Land it early and you get a safe "good" hit; hold out until the ring is nearly on top of the core for a "perfect" and a bigger multiplier. Miss the window, or click on nothing, and you lose a heart. Three hearts, then it's over. Once orange decoy rings start showing up, a second rule kicks in: don't click during their window at all. They're not on the beat, and clicking one costs a heart just like a miss.

## Core mechanics

- One real ring per beat, timed against the core: the whole game is built on how close you cut it.
- A perfect/good/miss timing window that gets tighter as your hit count climbs, so the same reflex that worked a minute ago starts costing you hearts.
- Tempo steps upward in stages rather than creeping continuously, so each jump is a felt change, not a slow drift.
- Decoy rings that join the real one mid-stage: a second, faster-arriving ring in a different color that punishes reflexive clicking.
- A combo multiplier that resets on any miss, so a long run is worth defending, not just extending.

## Progression & scoring

Six stages track total successful hits (0, 8, 20, 35, 55, 80). Each stage bumps the tempo (88 BPM up to 172 BPM), tightens the perfect window (70ms down to 36ms) and the good window (170ms down to 98ms), and raises the odds a decoy ring shows up alongside the real one (0% up to 45%). A perfect hit scores 100 points, a good hit 45, both multiplied by a combo multiplier that climbs by 0.5x every 6-hit streak and caps at 5x. Any miss (a late click, an early click outside the window, or falling for a decoy) zeroes the combo and costs one of three hearts. Best score is saved locally and shown next to the live score.

## Look & feel

A dark near-black backdrop with a single glowing teal core and a soft radial halo around it. The real ring is teal, the decoy ring is orange, and both render as clean stroked circles collapsing toward the center: no sprites, just canvas gradients and arcs. Hits and misses trigger a burst of colored particles and a floating "PERFECT" / "GOOD" / "MISS" / "FAKE!" callout, plus a short screen shake on misses. All sound is synthesized on the fly with the WebAudio API: a soft tick on every beat, a bright triangle-wave chime on perfect and good hits, and a low sawtooth thud on a miss or a decoy catch.

## What makes it fun

- The perfect window keeps shrinking, so the timing that felt generous at 88 BPM turns unforgiving by 172. The game gets harder without ever changing what you're doing.
- Decoys punish exactly the instinct the early game trained: click on anything that pulses. Telling real from fake becomes its own skill.
- Waiting for a perfect instead of banking a safe good is a real gamble: cut it too close and a decoy sneaking in right before the real ring can catch you off guard.
- The combo multiplier makes a long streak worth protecting, so every late-stage click carries the weight of everything you'd lose by flinching.
