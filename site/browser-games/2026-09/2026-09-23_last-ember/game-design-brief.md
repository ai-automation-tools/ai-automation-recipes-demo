# Last Ember

> Steer a dying torch through branching corridors toward a glowing exit while your fuel burns down and shadow wisps close in once they sense you.

**Date**: 2026-09-23
**Genre**: maze
**Status**: Playable build

## Concept

Last Ember is a top-down maze run where your torch is a countdown, not just a light source. Fuel drains the moment you start moving, and your vision radius shrinks with it, so the corridors you can see are always a step behind the ones you're in. Starting at level three, shadow wisps patrol the dark and hunt you the moment you wander into their range, visible only once your torch catches them.

## How to play

Reach the glowing exit tile before your fuel hits zero. Move with WASD or the arrow keys; on touch, swipe or use the on-screen D-pad. Movement is one cell at a time along open corridors; you can't cut through walls. Oil flasks scattered through the maze top off your fuel if you detour for them. Getting caught by a wisp or running the torch dry both end the run immediately. Press R, or tap the button on the game-over screen, to start again.

## Core mechanics

- Fuel drains continuously and your vision radius scales directly with it, so a low torch means committing to turns you can barely see the end of.
- Mazes are generated fresh each level with a randomized backtracker, and the exit is always placed at the farthest reachable cell from the start.
- Oil flasks refuel you but sit off the direct path, so every pickup costs a detour you pay for in fuel.
- From level 3 on, wisps patrol the maze and give chase once you're within five tiles. A low pulsing tone gets faster as one closes in from outside your light, so you get a warning before you ever see it.
- Reaching the exit banks a level bonus scaled to your remaining fuel, rewarding a tight, efficient route over a meandering one.

## Progression & scoring

The maze grows one row and column per level, from a 7×7 start up to a 16×16 cap, and fuel drain speeds up alongside it (1.0/sec at level 1, capping near 2.2/sec). Wisps join at level 3, adding one more (up to five) every couple of levels, and they get a little faster as you go. Score comes from two places: 100 × level plus double your leftover fuel on every exit reached, and a flat 15 points per flask collected. There's no reward for just surviving. The only way to add to your score is to keep clearing mazes, so standing still costs you nothing but time you don't have.

## Look & feel

The palette stays close to black outside your torchlight: warm amber for the ember and the walls it touches, cold violet-eyed wisps that only resolve into view at the edge of your vision, teal for the flasks. A radial vignette sits over the whole scene so the light feels like it's running out rather than just a number on a bar. All of it is canvas draws: circles, gradients, line strokes. No sprites. Sound is a handful of WebAudio tones: a dull thud on wall bumps, a rising chime on pickups, a short arpeggio on exit, and that low proximity pulse that's the only warning you get for a wisp you can't see yet.

## What makes it fun

- Tying vision radius to fuel turns a resource meter into something you feel every second. You're never just watching a number; you're watching the edges of the world close in.
- The proximity pulse means you can lose to a wisp you never saw, but you'll know it's exactly the moment you should have turned around, not a cheap shot.
- Fuel pickups are a genuine risk-reward call: every flask is a detour, so the greedy line and the safe line are rarely the same path.
- The maze regenerates from scratch each level, so there's no map to memorize. Just the same set of pressures, bigger and faster than the level before.