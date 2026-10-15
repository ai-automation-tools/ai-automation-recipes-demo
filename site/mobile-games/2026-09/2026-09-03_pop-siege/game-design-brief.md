# Pop Siege

> Bank shots off the walls to chain-pop bubble clusters before the ceiling crushes your shooter.

**Date**: 2026-09-03
**Genre**: Bubble shooter
**Platform**: Mobile (portrait, touch-first)
**Status**: Playable build

## Concept

Pop Siege is a bubble shooter built around one tension: the safe shot keeps you alive, but the risky bank shot is what keeps your score climbing. A wall of colored bubbles hangs over a lone shooter at the bottom of the screen. Every few shots the wall drops another row, and the only way to buy room is to keep matching.

## How to play

Drag from anywhere on the screen to aim, then let go to fire — the bubble launches in the direction you released. It can bounce off the side walls before it lands, so a shot that looks impossible in a straight line is often open around a corner. Land it next to two or more bubbles of the same color and they pop. Miss, and the bubble just sticks there, adding to the wall you're trying to shrink. The run ends when the wall reaches the shooter's line. Desktop players get the same input through mouse drag-and-release, plus arrow keys to nudge the aim and space to fire.

## Core mechanics

- Hold-drag-release aim: one continuous motion, and the release point sets both angle and commitment — there's no way to preview a shot without also having half-fired it.
- Wall banking: bubbles bounce off the sides, so tight clusters behind other bubbles are reachable if you're willing to trust the angle.
- Combo streak: every shot that pops something raises your multiplier by one; any shot that just sticks resets it to 1x. The multiplier is the entire scoring game — chase it, and one bad guess costs you everything you built.
- Ceiling drop: a new row lands every 10 shots at first, and that interval shrinks by one shot with each drop, down to a floor of 6.
- Color creep: the wall starts with four colors and adds a fifth once you cross 800 points, so matches get harder to find right when the ceiling starts dropping faster.
- Cut-loose bonus: pop the bubbles anchoring a cluster to the ceiling and the whole orphaned group falls for a separate bonus.

## Progression & scoring

Each popped bubble is worth 10 points times your current combo multiplier; each bubble that falls loose from a cut cluster is worth 20 points times the multiplier. The multiplier only grows on consecutive pops, so a ten-shot streak without a miss is worth dramatically more than ten scattered pops mixed with misses. Pressure builds on two axes at once — the ceiling drop interval keeps shrinking, and the fifth color (unlocked at 800 points) means fewer of the bubbles on screen actually match what's in your hand.

## Look & feel

Bright, candy-saturated bubbles rendered on canvas with a soft glow and a burst of particles on every pop — the pitch of the pop sound climbs with the combo multiplier, so a long streak sounds like it's building to something. Everything else — the shot, the wall bounce, the ceiling thud, the game-over tone — is synthesized with WebAudio, no sample files. The whole thing sits inside a dark, muted phone frame so the bubble wall reads immediately as the thing you're playing, not background.

## What makes it fun

- The bank shot is a genuine gamble: line it up wrong and you've fed the ceiling instead of shrinking it, but line it up right and you clear a cluster nothing else could reach.
- The combo multiplier turns every shot into a decision about greed — take the guaranteed small pop, or hold out one more shot for the cluster that resets your streak if you're wrong.
- Two kinds of pressure stack instead of one: the wall gets faster *and* the colors get harder to match, so late runs feel qualitatively different from the opening, not just quicker.
