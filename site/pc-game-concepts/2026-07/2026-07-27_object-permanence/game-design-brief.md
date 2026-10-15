# Object Permanence

> You are dead, invisible, and stuck in one house — so you move people the only way left to you: by moving their things.

**Date**: 2026-07-27
**Genre**: immersive sim
**Platform**: PC (Windows; keyboard & mouse, controller)
**Status**: Concept

## Target player

Someone who has finished Shadows of Doubt twice and started a third file just to see the simulation run. Someone who read Ctrl Alt Ego's pitch — an ego with no fixed body, hopping between machines — and wondered what happens if you take the body away entirely and never give one back. They don't need a gun. Prey's GLOO cannon and Dishonored's Blink were never the point for this player; the point was always the feeling that a level is a machine you can lean on until it does something its designer didn't quite plan for. They also like a slow game: Return of the Obra Dinn for the deduction, Gone Home and Immortality for the idea that a house can be a plot. They're tired of immersive sims that hand you a body just so they can threaten to take it away.

## Core loop

**30-second loop**: possess an object within reach — a lamp, a door hinge, a kettle, a loose floorboard — and spend a sliver of Presence to act on it (flicker, creak, slam, tip, ring). An NPC nearby notices or doesn't, based on where they're looking and how loud the room already is. If they notice, their Belief meter shifts toward one of two poles: Mundane ("the wind," "mice," "this old house") or Uncanny ("something's here"). Traverse to the next object along a physical connection — the same wiring run, the same water main, a draft between two open windows — and chain the next nudge before they finish reacting to the first.

**30-minute loop**: pick a thread for the night. Maybe the night nurse is about to find the ledger that gets a patient sectioned against his will. Maybe a guest is quietly poisoning the tea service. You don't get a quest marker, just a starting rumor and a house full of routines running on their own clocks. You spend the night's Presence budget nudging the chain of cause and effect toward an outcome you want, then the sun comes up, the loop resets, and the house remembers what happened to it last night, whether you were responsible or not.

Here's where it gets hard, three or four nights in: once you've learned which pipe runs where and which maid startles at a dropped spoon, the "puzzle" is solved. You know the eight-object chain that flips a Belief meter from skeptic to terrified in ninety seconds, and doing it again just executes the solution. A haunted-house game where the ghost gets bored of haunting is a genuine failure mode, and the fix has to be structural, not cosmetic — see Differentiators and Risks below, because this is the design's biggest single bet.

## Systems

- **The possession graph** — every interactive object in the house sits on a node connected to others by a real physical medium: shared wiring (lamps, radios, the switchboard), shared plumbing (taps, the boiler, drainpipes), shared air (curtains, candle flames, doors ajar), or mechanical linkage (a gramophone's turntable to its horn, a clock's pendulum to its chime). You can only move to a node your current object is actually connected to. The house's floor plan becomes a wiring diagram you memorize by touch, not a map you read.
- **Belief, not health** — NPCs don't have a fear stat that fills up like a boss bar. Each one carries two independent counters, Mundane and Uncanny, that both rise from unexplained events; whichever crosses its threshold first decides how they act (dismiss it and go back to bed, or go get the groundskeeper and his shotgun). A scientist-coded character's Mundane counter fills fast and resets overnight; a superstitious one's Uncanny counter barely needs two incidents. Same event, different character, different outcome — no scripted dialogue tree involved, just two counters and a personality curve.
- **Presence economy** — every possession, every act, costs Presence, and Presence regenerates slowly at "anchors" (objects tied to your former life — your old writing desk, a photograph, the piano you used to play). Big theatrical acts — a door slamming hard enough to wake the house, a mirror cracking — cost far more than a candle guttering, and overspending in one room in one hour risks a "flare," a brief moment where sensitive NPCs (a medium, a child, the house cat) can actually perceive your shape. Flares are how the game creates a jump scare that runs in the other direction: for once, you're the one who gets caught.
- **Night-loop memory** — the house keeps a diary you don't get to read directly. A maid who fled a flickering lamp on night two arrives on night four already carrying a sprig of rowan and refusing to enter that room alone. A skeptic who investigated three "mundane" incidents in a row starts leaving his door bolted. Your own competence from previous nights becomes next night's obstacle, which is the honest answer to the boredom problem above: the graph doesn't change, but the people standing on it get harder to move the better you get at moving them.
- **Threads** — each night offers two or three concurrent situations in motion (a poisoning, a forced confinement, a theft, a marriage being arranged for money rather than love), each resolvable multiple ways and each pulling on shared NPCs. Solving one cleanly can make a different one harder — the nurse you scared into hiding in her room was the only witness who could've stopped the poisoning down the hall.
- **Anchors and memory fragments** — possessing objects that belonged to you in life triggers short, wordless memory vignettes that piece together how you died and what the house was before it was a convalescent home. This is optional narrative texture, not a gate — you can ignore it for a dozen nights and still play every thread to completion.
- **Sensitive NPCs** — one to two characters per house who can perceive you directly during a flare (not just infer you from evidence). They're rare, dangerous to encounter unprepared, and they're the only characters you can, in a limited and costly way, communicate with directly rather than through inference — a pressure valve for players who've been indirect for six nights straight and need one scene of being seen.

## Progression

The campaign runs across one house, roughly eight to ten nights, each night a full loop from dusk to dawn with a hard reset at sunrise. Progression isn't stat growth — it's access. Early nights, your possession graph covers one wing because half the house's wiring is dead and its plumbing is shut off; repairing (or rather, discovering already-repaired) connections by investigating specific objects extends your reach into the rest of the building. Late-campaign, you unlock a costly, heavily restricted ability to briefly possess a living animal (the house cat, a rat in the walls) for direct short-range movement rather than object-to-object hopping — a capstone ability, not a crutch, gated behind a specific narrative discovery about what you were before you died.

Meta-progression across the full run is the accumulated state of every thread you've resolved or ignored, which locks in which NPCs survive to the final night, what they believe happened, and which of several mosaic endings you get — no single "good" ending, no completion percentage, just a house that remembers what you did to it.

## World & setting

Ashcombe House, a converted manor on the Scottish coast serving as a convalescent home for shell-shocked officers, difficult wives, and the occasional guest whose family paid for discretion rather than treatment, some time in the early 1930s. It's not a horror-movie house — no bleeding walls, no demons. The dread here is closer to a cold morning fog than a scream: class tension between the family that still half-owns the place and the modern medical staff running it, a house too large for the number of people rattling around inside it, and a slow realization that most of the residents are here because someone with money wanted them somewhere else.

Visually the target is muted, overcast coastal light — sea-grey, lamp-oil amber, damp plaster — closer to the restrained dread of a film like The Innocents than any modern horror shooter's palette. No blood, no combat animations, because there's no combat: the tension comes entirely from watching a domino chain you started land exactly where you meant it to, or not.

## Differentiators

- **You are never a person, and the game never gives you one.** Ctrl Alt Ego lets you hop between robot bodies; Dishonored and Prey give you tools and eventually a fully embodied combat kit. Here, agency routes entirely through indirect object manipulation and other people's belief systems — no body to upgrade, no weapon to find, ever. That's the whole bet, and the brief above doesn't pretend it's risk-free.
- **Persuasion is emergent, not authored.** There's no dialogue wheel and no charisma stat. You shift behavior by staging incidents that different people read through their own psychology — the same flickering lamp is "faulty wiring" to the skeptic and "the dead walking" to the superstitious kitchen girl, and you have to know which is which before you act.
- **Your own success is the difficulty curve.** Most immersive sims reward finding the one elegant solution and let you feel clever forever. Here, the house's cross-night memory means the elegant solution you found on night two gets specifically harder to repeat on night four, because the people you fooled once are no longer standing where you left them.

## Monetization notes

Premium, single purchase, no DLC roadmap at launch. Target price $22.99, sitting between Skin Deep ($19.99) and Shadows of Doubt ($24.99) — both recent, well-reviewed indie immersive sims that prove a $20–25 price point clears for the genre's audience without a AAA budget behind it. Early Access isn't recommended here the way it was for Shadows of Doubt: the night-loop structure and cross-night memory only read as a complete idea once several nights are playable back to back, and a partial slice risks reviews that call it "just a haunted-house walking sim" before the systemic hook lands. Ship 1.0 complete, or don't ship at all.

The market read, per the current genre coverage (gamingbible's March 2026 roundup, PC Gamer's 2025 game-of-the-year list): the audience is small but unusually loyal and vocal, and press coverage rewards a clear mechanical hook over production values — Skin Deep and Ctrl Alt Ego both broke through on the strength of one sentence you could say out loud about what makes them different. "You're a ghost who's never seen and never touches anyone" is that sentence for this concept.

## Accessibility notes

- Fully remappable controls for keyboard/mouse and controller, including a radial quick-possess menu as an alternative to precise cursor targeting
- Every diegetic sound cue (creaks, static, distant voices) has an optional on-screen directional indicator, not just an audio subtitle — since sound is a core mechanic, not just flavor, players who are hard of hearing shouldn't lose access to the game's central information channel
- A screen-flicker reduction mode that replaces the default flickering-light visual effect with a steady pulse indicator, since flickering objects are a core mechanic and a photosensitivity trigger
- Colorblind-safe Belief-meter UI: Mundane and Uncanny states use distinct icon shapes and patterns, not color alone
- Adjustable Presence economy: an assist tier that slows Presence drain and removes flare risk entirely, for players who want the story and systems without the resource-management pressure
- Full text descriptions for every memory vignette (they're wordless by design; an optional narration/text-log layer makes them accessible without changing the audio-visual experience for players who don't need it)
- Scalable UI text, 75%–200%

## Risks

- **The learned-solution problem.** Once a player maps the possession graph and a character's Belief thresholds, repeat play could collapse into "run the same eight-step chain every time," which undercuts the entire immersive-sim promise of multiple live solutions. Mitigation: cross-night memory specifically punishes exact repetition (see Systems), and concurrent threads mean optimizing one chain has a real cost somewhere else in the house.
- **Passivity risk.** No weapon, no combat, no dialogue wheel — some of the audience for "immersive sim" specifically wants the embodied power fantasy this game refuses to offer. Mitigation: front-load a tutorial sequence built around one spectacular multi-object chain reaction (a full room going dark, cold, and loud in under ten seconds) so the first ten minutes prove the power fantasy is real, just relocated.
- **Belief-system tuning is a lot of work for a small team.** Twelve to sixteen named NPCs each need a distinct personality curve, or the systemic promise collapses into two or three obviously-recycled character archetypes. Mitigation: build one shared trait-tag architecture (skeptic / superstitious / stubborn / sensitive, in varying weights) feeding a single reaction table, rather than bespoke per-character logic — Shadows of Doubt's simulated-citizen approach is proof this scales on an indie budget.
- **One house risks visual monotony across eight to ten nights.** Mitigation: Ashcombe was renovated across three distinct eras (Georgian original, a Victorian wing, a 1920s medical annex bolted onto the back), each with a different look and a different possession-graph topology, unlocked as the campaign's reach expands.
- **Marketing a "you have no body and no weapon" pitch is genuinely hard in a trailer-driven market.** Mitigation: lead marketing with clip-friendly chain-reaction spectacle (the domino effect, not the ghost), the same way Teardown and Baba Is You built shareable moments out of systems rather than combat.

## 6-week prototype plan

- **Week 1**: Build the possession-graph traversal in one room — six to eight linked objects, a working possess/act/traverse loop. Goal: a three-object chain reaction (lamp flickers → curtain sways from the draft it starts → door creaks shut) that feels good to trigger on purpose.
- **Week 2**: Add one NPC with a two-counter Belief meter (Mundane/Uncanny) reacting to three event types. Validate that a player who's never been told the mechanic can infer "this character reads that event as mundane" from behavior alone.
- **Week 3**: Expand to a full wing — twelve to fifteen objects, two NPCs with distinct trait weights — and build an internal graph-authoring tool so level designers can wire new rooms without touching code.
- **Week 4**: Implement the night-loop reset and cross-night memory for a single thread with two possible outcomes; confirm an NPC visibly "remembers" a prior-night flare-up (arriving with a candle already lit, a door already bolted).
- **Week 5**: Add the Presence economy (cost, regen at anchors, flare risk) and one sensitive NPC who can perceive the player during a flare, to test whether the risk/reward of big theatrical acts lands.
- **Week 6**: Vertical slice — one complete night, three NPCs, one thread with two endings, polished for a blind playtest. Success metric: testers describe their own strategy back to us unprompted, without being told what the mechanic was for.

## Genre references

- Skin Deep review — https://www.pcgamer.com/games/fps/skin-deep-review/ — PC Gamer's 88/100 review and its place on the outlet's 2025 game-of-the-year list; confirms the current market rewards a sharply original mechanical hook (fragile-body stealth comedy) over scale, informing this concept's own single-sentence hook and its price-point comparison.
- Ctrl Alt Ego on Steam — https://store.steampowered.com/app/1571940/Ctrl_Alt_Ego/ — a recent, "Very Positive"-rated immersive sim built entirely around a disembodied player who hops between hosts and never dies as a fixed character; the direct jumping-off point for asking what happens if you remove the host body altogether.
- Shadows of Doubt on Steam — https://store.steampowered.com/app/986130/Shadows_of_Doubt/ — a fully simulated city where every NPC runs an independent daily routine and the player solves cases through inference rather than combat; the reference point for this concept's belief-driven, non-combat NPC simulation and its $24.99 price point.
- Best immersive sim games (GamingBible, March 2026) — https://www.gamingbible.com/features/best-immersive-sim-games-853722-20260316 — a current-state roundup covering Ctrl Alt Ego, Dread Delusion, Shadows of Doubt, Skin Deep, and others, framing the genre as "a type of RPG where the world is a rigid set of systems the player exploits"; used here to confirm the genre is active and to check this concept's differentiators against everything else currently getting attention.
- Nobody can agree what an immersive sim is (PC Gamer, on Tim Cain) — https://www.pcgamer.com/games/sim/nobody-can-agree-what-an-immersive-sim-is-but-og-fallout-lead-tim-cain-has-his-own-definition-the-very-elements-that-make-something-an-immsim-are-the-ones-that-i-also-think-make-good-rpgs/ — genre-definition debate arguing the core of an immersive sim is systemic player agency rather than any fixed setting or camera; grounded the decision to strip away the body and weapon and see if the genre's core promise survives without them.
