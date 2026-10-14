# Plumb Line

> Swing cargo off a dockside crane onto a narrow pier and stack it as high as the wind will let you, landing each piece dead level to keep a bonus chain going.

**Date**: 2026-10-14
**Genre**: Physics stacking
**Core loop**: Slide the crane, pick the moment to let go, and land each piece square on the pile, while the pieces get odder, the hook starts to swing and gusts push from the sea.

## How to play

A piece of cargo hangs from a crane above a concrete pier. Aim the crane left or right and drop the piece onto the pier or onto whatever is already stacked there. Everything is simulated as rigid boxes, so a piece that lands off-centre or on a slope will tip, slide or knock others loose.

Any piece that falls into the water costs one of your three lives. Lose all three and the run ends. Your score is your peak tower height (10 points per metre) plus level bonuses.

- **Mouse:** move to aim, click to drop.
- **Touch:** drag to aim, lift your finger to drop.
- **Keyboard:** Left/Right or A/D to aim, Space, Down or S to drop, P or Esc to pause.

A drop pressed during the short reload is queued and fires as soon as the next piece is on the hook. Tap or press Space to restart after a game over.

## Core mechanics

- The physics is a Box2D-Lite port: box-versus-box contacts, friction, and warm-started impulses that let a stack settle and stay up.
- Each released piece keeps the rope's angle and swing speed. Let go at the bottom of the swing and it lands flat but sliding sideways. Let go at the end of the swing and it barely moves, but it comes down tilted.
- When a piece comes to rest within 2° of square, you get "LEVEL" and the chain counter goes up. A crooked landing or a splash resets it.
- A NEXT preview shows the following piece, so you can leave a flat spot for a plank or keep the centre clear for a pillar.
- Pieces buried more than 7 m below the top freeze in place. That keeps a tall tower stable and the simulation cheap.

## Progression & scoring

Pressure changes in kind, announced by a banner at fixed drop counts:

- **Drops 1–3:** plain crates (1.3 × 1.0 m). The hook hangs still, so this is where you learn the drop height and the bounce.
- **Drop 4+:** mixed shapes. Long planks (2.6 × 0.42), thin pillars (0.6 × 1.7), small cubes and wide slabs.
- **Drop 8+:** the hook swings. Amplitude starts at 0.06 rad and grows by 0.014 per drop, up to 0.34 rad.
- **Drop 12+:** gusts. A blinking GUST arrow and wind streaks warn you 1.6 s ahead, then the wind blows for 3 s. Its force starts at 3 and rises by 0.3 per drop to a cap of 9, and the gaps between gusts shrink from about 6 s toward 2.5 s. The wind hits the falling piece at full strength and the tower at under half.
- **Drop 16+:** iron (3.2× density, sinks into the pile) and ice (friction 0.06, slides off anything that isn't flat).

Score is `floor(peak height × 10) + bonus`. Each level landing in a chain pays 5 × the chain length, so the fifth level landing in a row is worth 25. Best score and best height are saved locally. The best height is drawn as a dashed gold line across the sky.

## Look & feel

The palette is a harbour at sunset: violet-to-coral sky, an indigo sea, amber wooden crates, a yellow crane girder. Night closes in and stars come out as the camera climbs. Everything is drawn on canvas at runtime, including the parallax skyline, the hazard stripe on the pier and a metre ruler down the left edge.

All sound is synthesised with WebAudio. Landings make a filtered-noise thud with a low sine kick, scaled by impact speed, plus dust and a screen shake. A level landing plays a two-note chime that rises in pitch as the chain grows. A splash is a bandpassed noise burst with a red screen flash. Gusts come with a rising whoosh.

## What makes it fun

- The swing forces a choice on every drop. A release at the bottom gives a flat landing but slides the piece, and a release at the end lands it nearly still but crooked. The chain bonus only pays for flat, so you keep betting that the slide will stop in time.
- The NEXT preview turns the stack into a planning problem. With a 2.6 m plank coming you want a wide, flat top, and a pillar after that will fall straight off it.
- Gusts give you a 1.6-second warning. You can drop early and race the wind, or hold the piece swinging on the hook until the gust passes.
- Ice on a slightly tilted top slides off slowly, and the tower that looked safe a second ago starts losing pieces.
