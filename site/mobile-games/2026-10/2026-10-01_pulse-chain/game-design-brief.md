# Pulse Chain

> Tap the lane the instant its glow crosses the line, and keep the chain alive as the beat speeds up and the patterns thicken.

**Date**: 2026-10-01
**Genre**: Rhythm tap
**Platform**: Mobile (portrait, touch-first)
**Status**: Playable build

## Concept

Three lanes run down a neon phone screen, and glowing markers fall toward a line near the bottom in time with a synthesized beat. The game wants the same thing a drummer wants: land on the click, not near it. There's no song file to learn. The beat itself is generated live and gets faster and busier the longer you survive, so every run plays a little differently.

## How to play

Tap a lane the moment its marker reaches the hit line. Early or late by more than about a sixth of a second and it's a miss; land within 70 milliseconds and it's a Perfect. Some markers stretch into bars, and those need a hold instead of a tap: press and keep the lane down for the whole bar. Miss five or six beats in a row and your health runs out.

Touch: tap the lower third of a lane column (left, center, right) to hit it, hold your finger down through a bar note. Desktop: D / F / J, or the arrow keys (Left / Down / Right), held the same way. R restarts from either screen, and tapping or clicking anywhere on the title or game-over screen also starts a run.

## Core mechanics

- Three lanes, one glowing marker per lane, timed to a beat clock instead of a fixed scroll speed
- Three-tier judgment (Perfect, Good, Miss) read against the hit line, not against a hidden score formula
- Bar notes that require holding the lane instead of tapping it, introduced once the player has the basic timing down
- Occasional two-lane chords that demand a near-simultaneous double tap
- A combo multiplier that climbs every eight hits in a row and resets the instant you miss

## Progression & scoring

The run is built from five tempo steps rather than one speed dial. It opens at 98 BPM with single notes and a forgiving rest gap between them, then every 20 to 35 seconds the track adds one new kind of pressure (faster tempo, denser chords, bar notes, fewer rests) until it plateaus around 142 BPM. Perfects are worth more than Goods, bar notes pay out a flat bonus for finishing the hold, and the combo multiplier (capped at 4x) means the same Perfect is worth four times as much once you're sixty-plus beats deep into a clean run. A Perfect also nudges your health back up a little, so playing tight is its own safety net against the next mistake.

## Look & feel

A synthwave palette: cyan, magenta, and gold lanes glowing against a deep indigo gradient, with faint horizontal scanlines drifting down behind the track. Every tap throws a ripple at the hit line regardless of outcome, and every judgment throws a bigger colored burst, so the screen is never silent about what just happened. The beat, the hit and miss cues, and the combo stinger are all synthesized oscillator tones, no audio files, just the WebAudio API reacting live to the same clock driving the notes. It all sits inside an on-screen phone frame with a notch and home-indicator bar, so it reads as a handheld device even when it's floating inside a browser tab.

## What makes it fun

- The chain is the whole game: watching a clean streak build is satisfying, and the moment it snaps feels like your own fault, not the game's
- Because the beat itself speeds up rather than just the fall speed, the pressure changes in kind as you go: first it's reaction time, then it's remembering to hold instead of tap, then it's catching two lanes at once
- The multiplier rewards staying in the pocket under pressure instead of playing it safe. The biggest scores come from the stretch where the track is hardest, not the easy opening
