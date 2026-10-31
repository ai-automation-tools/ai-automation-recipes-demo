# Wrack

> You don't command a squad — you are a single tidal colony-creature, and every limb a hunter tears off stays on the grid as wreckage blocking your own ground until the next cycle regrows it.

**Date**: 2026-10-26
**Genre**: tactical RPG
**Platform**: PC (Windows; keyboard & mouse, controller)
**Status**: Concept

## Target player

Someone who finished Into the Breach and Demonschool and wants the next game to change what a "unit" even is, not just reskin the squad. They remember Shadow of Mordor's Nemesis system more fondly than anything else in that game and have wondered since why no tactics game has tried it. They're fine playing the monster — Carrion and Maneater scratched that itch for an afternoon — but they want the depth of a real tactics grid under it instead of a timer and a health bar. They read patch notes. They will reload an encounter six times to find the positioning that makes a combo work, and they'll be annoyed if the game lets them win without finding it.

## Core loop

**30-second loop**: on your turn, move and act each limb once — a Claw closes distance and hits hard, a Frond whips a target from two tiles out, an Eye-stalk marks a target so the next hit against it lands a Rend, a Maw can swallow a severed limb (yours or a hunter's) to bank Vitality, an Anchor roots in place and shields whoever stands next to it. Confirm the turn and the hunters respond. If a limb's local Integrity hits zero, it severs immediately — it stops acting, drops into the grid as inert wreckage that blocks the tile and gives cover to anything standing behind it, and the creature's shared Vitality pool takes a cauterization hit. Lose enough Vitality and the fight ends in a forced retreat.

**30-minute loop**: a Tide Season runs eight Cycles. Each Cycle you pick a feeding ground from the coastal map, fight a 2–4 encounter string of Culling Crew hunters timed against that ground's tide window, and bank Biomass from what you kill and what you eat. Back at the Shallows between Cycles, you spend Biomass regrowing any severed limbs — choosing a Mutation for each one, which is really a build choice — and decide whether to push back out a limb short or burn a Cycle waiting to come back whole. One hunter, the Flenser, survives every encounter you don't finish them in, and comes back next Cycle wearing whatever beat you last time.

## Systems

- **Shared Vitality, local Integrity** — the creature has one pool (60 at Season start) that everything draws from once a limb's own Integrity (8–18 depending on type) runs out. Severing a limb spikes the shared pool for half that limb's max Integrity, rounded up. A creature that loses limbs carelessly bleeds out from the inside even while every individual fight looks winnable.
- **Wreckage as self-made terrain** — a severed limb doesn't vanish. It sits on its tile as a wreck: impassable, and it gives +20% damage reduction to anything standing behind it from the hunters' side of the grid. Your own past mistakes (or sacrifices) reshape the map for the rest of the encounter, and sometimes for the rest of the Cycle if you can't retake the ground to clear it.
- **Mark-and-Rend combos** — an Eye-stalk's Mark isn't damage, it's a setup: the first hit against a Marked target from any other limb triggers Rend, which adds knockback. Knock a hunter into your own wreckage and they take an Impale tick on top. The puzzle is sequencing which limb marks, which limb follows, and whether the geometry lines up before the hunters get a turn to scatter.
- **Tide windows** — every feeding ground runs a visible countdown (4 turns at Low Water in early Cycles, down to 2 by Cycle 5) between low and high tide. At Low Water your whole body surfaces and every limb can reach the fight, but hunters can approach freely across open mudflat. At High Water you're half-submerged — only limbs with Reach 3+ can act, but hunters have to wade to close distance, which costs them a turn. Timing when to force the tide to turn against you is a weapon as much as any limb.
- **Culling Crew roster** — Flensing Spearmen (basic, high Integrity damage, low reach), Net-Casters (root an Anchor in place for two turns), Surveyors (reveal your exact Vitality and Integrity numbers to the whole crew and call focus fire on whichever limb is lowest), and Harpoon Gunners (long reach, single-target burst introduced Cycle 5). None of them scale by getting a flat stat buff over the Season — each new type demands a different read.
- **The Flenser** — a named rival hunter who is never permanently dead. Beat them and they retreat, remember which limb type last put them on the ground, and return next Cycle with gear that specifically counters it (fire-oil against Fronds, a boarding hook against Anchors). Ignore them for two Cycles running and they show up leading a full crew instead of fighting alongside one.
- **Biomass and regrowth** — Biomass pays for two things: regrowing a severed limb (15 Biomass for the first regrowth in a Cycle, +10 for each additional one that Cycle) and choosing that limb's Mutation on the way back. Regrowth takes the whole next Cycle — the slot is empty, not weaker — so returning a limb short is sometimes the correct call and sometimes isn't.

## Progression

A Season is eight Cycles on a coastal map of feeding grounds, each with its own tide schedule and its own Culling Crew presence. Difficulty doesn't just scale a number: Cycle 1–2 introduces the base Spearman and Net-Caster at a crew size of three; Cycle 3 adds the Surveyor and grows crews to four, forcing a choice between killing the Surveyor fast or accepting that the crew now sees your Vitality pool; Cycle 4 is the first time Surveyor and Net-Caster show up together, so a rooted Anchor is also a revealed one; Cycle 5 adds the Harpoon Gunner and narrows tide windows to two turns; by Cycle 6 crews cap at six hunters and the ramp holds there, because past that point more hunters just makes the fight a coin flip instead of a puzzle. Limb Mutations are the build layer — a Claw can become a Pincer (grip instead of damage, drags a hunter into your wreckage) or a Barb (trades reach for a bleed effect) — chosen fresh at every regrowth, so your creature's loadout drifts over the Season based on what you actually lost.

The Season ends at a Flood Tide finale: every feeding ground's tide turns at once, the Flenser arrives with every counter they've learned across the Season, and the fight runs across a map built from wreckage you may have left behind in earlier Cycles if you never went back to clear it.

## World & setting

A drowned coastline of tidal flats, drowned church spires, and rusted harvesting platforms, somewhere between a flooded industrial coast and a tide pool blown up to the scale of a battlefield. Your creature is translucent, bioluminescent, more coral colony than monster — it doesn't roar, it pulses, and its limbs glow faintly along the nerve-lines that connect them to the shared root. The Culling Crews aren't an army; they're specialists in waders and oilskins who sell what they cut from you to alchemists upriver, which is why they keep coming back no matter how many Cycles you win. The palette leans drowned teal and rust-orange at low tide, deep bruise-purple and cold white bioluminescence at high tide — the two tide states are supposed to read as different places to be in, not just a timer.

## Differentiators

- **You play the monster's limbs, not a squad** — one shared Vitality pool underlies every independently-acting Claw, Frond, Eye-stalk, and Maw, so losing a limb is a systemic cost to the whole creature, not a character death with a replacement waiting in the barracks
- **Your own wreckage becomes the map** — a severed limb stays on the grid as cover and a chokepoint for the rest of the fight, so the battlefield is partly built from damage you already took, and clearing old wreckage is its own reason to return to a feeding ground
- **A single hunter persists across the whole Season and counters your last fight, not a bigger number** — the Flenser remembers which limb beat them and brings specific gear against it next time, so the campaign's difficulty ramp is one person learning you rather than stat inflation
- **Tide state decides who has the advantage, not turn order** — Low Water gives you every limb but strips your cover; High Water hides you but only your long-reach limbs can act, so timing the tide is a tactical decision with real tradeoffs on both sides

## Monetization notes

Premium release, Early Access at $19.99, full release at $24.99 — in line with where 2026's terrain- and build-forward tactics titles have landed (Blightstone's Early Access launch at $15.99, Forsworn's co-op roguelite pricing in the same band). Early Access ships three feeding grounds and a full first Season; full release adds two more grounds, the Flood Tide finale, and a second Flenser-equivalent rival for a New Game Plus run. "Play as the monster" has market precedent in Kaiju Inc. and Kaiju Wars, but both are real-time or city-scale — there's room for a grid-tactics entry that keeps the monster-as-protagonist hook while playing like Into the Breach instead of an RTS, and nothing currently on Steam is doing that combination.

## Accessibility notes

- Fully remappable keyboard/mouse and controller bindings, with a controller preset tuned for limb selection on a small grid
- Colorblind-safe Vitality/Integrity bars using a shape language (dot, stripe, solid) layered under color, not color alone
- Tide-state readability doesn't depend on color either — a tide icon plus a turn-count readout is always visible
- Adjustable UI scale (80–200%) and a high-contrast HUD mode
- Turn-timer-free by default; combo-sequencing is the challenge, not the clock
- Full subtitles for all hunter barks and a persistent log, since the creature itself has no dialogue to caption
- Animation speed toggles (0.5x, 1x, 2x, instant-resolve) for both limb actions and tide transitions
- A Combo Assist toggle that highlights the limb order needed to land a Mark-and-Rend, for players who want the tactics without the mental math
- An assist tier that widens tide windows by one turn without changing hunter stats, for players who want more planning room

## Risks

- **A shared-pool "monster with many units" idea reads as a reskinned squad once you're in the weeds.** Mitigation: the first encounter is built specifically to teach the identity, with a scripted moment where severing your own Claw visibly blocks the exact tile you needed to cross.
- **A persistent rival who counters your last fight is expensive to write believably.** Mitigation: the Flenser's counters come from a fixed matrix of gear-tags against limb-types, not bespoke writing per permutation, capped at a handful of counter-gear pieces total.
- **Shared Vitality math could make the game either too forgiving (severing never matters) or too swingy (one bad turn ends the Season).** Mitigation: early Cycles cap simultaneous severs per encounter at two while the player learns the pool's weight, and cauterization values are the first thing tuned against the Week 6 playtest.
- **Playing a monster against human hunters risks reading as grim or alienating for a tactics audience used to heroic squads.** Mitigation: the creature is rendered impressionistically — bioluminescent, more coral than carcass — and the tone sits closer to a nature documentary's quiet tension than to horror.
- **The hook is unusual enough to be a hard sell from a store page screenshot alone.** Mitigation: the pitch leads with the Flenser rivalry, since a persistent nemesis is a familiar hook, and lets that carry players into the less familiar limb-identity mechanic.

## 6-week prototype plan

- **Week 1**: Grid and three limb types (Claw, Frond, Eye-stalk), shared Vitality pool, severing-to-wreckage conversion; deliverable: one test encounter where severing a limb visibly blocks a tile the player needed.
- **Week 2**: Mark-and-Rend combo, Anchor and Maw limb types, consume-severed-limb healing; deliverable: a full five-limb creature executing one scripted combo end to end.
- **Week 3**: Culling Crew AI — Flensing Spearman and Net-Caster, basic enemy turn logic, tide countdown UI; deliverable: one complete win/lose encounter against a three-hunter crew.
- **Week 4**: Tide window state change (Low/High Water reach and exposure rules), Surveyor unit revealing creature stats; deliverable: one encounter where the tide shift mid-fight changes the optimal plan.
- **Week 5**: Shallows hub, Biomass economy, limb regrowth and Mutation choice, Cycle structure connecting two encounters; deliverable: two connected Cycles with a real regrow-or-rush decision between them.
- **Week 6**: Flenser vertical slice — the rival persists across two encounters and re-equips based on which limb beat them in the first; playtest with 8–10 external players and tune cauterization-spike and tide-window numbers against where runs actually fail.

## Genre references

- Demonschool review, Game8 — https://game8.co/articles/reviews/demonschool-review — detail on the plan-then-execute positioning puzzle (push, pull, rewind before committing); informed Wrack's Mark-and-Rend sequencing and the decision to let players freely reorder limb actions before confirming a turn
- Forsworn on Steam, Resummon Studios — https://store.steampowered.com/app/3560360/Forsworn/ — a 2026 co-op roguelite built on branching subclasses and per-run build variety; informed the Mutation system, where each limb regrowth is a fresh build choice rather than a fixed upgrade path
- Star Wars Zero Company review, WCCFTech — https://wccftech.com/review/star-wars-zero-company-review-the-last-tactical-hope/ — on the feedback loop between base management and mission outcomes, and injury-over-permadeath as a way to keep roster stakes without erasing progress; informed the Shallows hub and the choice to make severed limbs recoverable rather than permanent losses
- Blightstone on Steam — https://store.steampowered.com/app/2832280/Blightstone/ — a tactical roguelite whose 1.0 update simplified its resource systems in favor of clearer combat combinations and distinct starting setups; informed keeping Wrack's Mutation list short and legible rather than sprawling, and confirmed the $15.99–19.99 Early Access band for terrain- and build-forward tactics titles
- Kaiju Inc. on Steam — https://store.steampowered.com/app/4276390/Kaiju_Inc/ — a real-time "play as the monster" roguelite with full-body mutation and control; confirmed market appetite for monster-as-protagonist framing while clarifying the gap Wrack fills, since Kaiju Inc. and similar titles are real-time and city-scale rather than grid tactics at a limb level
