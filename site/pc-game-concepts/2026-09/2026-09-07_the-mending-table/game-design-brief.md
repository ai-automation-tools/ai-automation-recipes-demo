# The Mending Table

> Diagnose what's actually wrong with a stranger's broken keepsake, then choose a repair whose speed and materials trade off against how much of its history survives, before the next arrival crowds your bench.

**Date**: 2026-09-07
**Genre**: cozy management sim
**Platform**: PC (Windows; keyboard & mouse primary — inspecting, dragging materials, and the repair timing bar are all pointer-driven; controller support planned for a post-launch pass, not required for 1.0)
**Status**: Concept

## Target player

Someone who finished Discounty or Coffee Talk and liked the shift work but wished the customers were more than a name and a request bubble. They've played Unpacking or PowerWash Simulator for the tactile, hands-on satisfaction of fixing one specific thing well, and they want that feeling stretched across a whole shop instead of one task. They are not looking for Stardew's farm-empire scale or Factorio's optimization depth — they want a small counter, a short queue, and the sense that when they choose how to fix something, that choice actually meant something to the person who brought it in.

## Core loop

**The 30-second loop.** Pick up an object from the intake tray and run the inspect tool over it. This reveals every damage point on the object as a labeled icon — a hairline crack, a missing inlay, tarnish, unraveled stitching — with the technique and material each one needs already shown, so there's never a moment of hunting for what's wrong. Select a technique from the toolbelt, drag the matching material onto the damage point, then hold and release a short timing bar to apply it. A clean release gets full quality; a sloppy one still finishes the repair, just at a lower polish. Do that for every damage point on the object, then make the one real decision: Full Restoration, which uses more time and pulls from the scarcer material stock but keeps the object closest to its original form, or Quick Mend, which is faster and cheaper but visibly newer, less "itself." That choice is supposed to match what the owner actually asked for when they dropped it off, not just whichever nets more coin.

**The 30-minute loop.** Three objects (later more) sit on the bench at once, each with its own deadline shown as a small patience marker that ambers as it gets close. You're triaging: which one gets worked first, which materials from this week's limited peddler stock get spent where, and whether a rushed Quick Mend now is worth disappointing someone who clearly wanted the real thing. Finished pieces go in the Keepsake Log — a running scrapbook of everything you've restored and the note that came with it — and raise trust with whichever part of town brought the object in. Trust unlocks rarer peddler stock and, eventually, the harder objects: the ones with damage that fights itself.

Here's where it gets boring by hour three if it's left alone: once a player has learned "check the want, pick the matching finish," every object becomes the same three clicks and a timing bar, and that's not a shop, it's a chore with a coat of paint. Two things are built specifically to break that. First, compound damage: some objects have damage points that conflict, where the technique that best fixes one point ruins the ideal fix for another (heat-treating a warped frame to fix the crack will scorch the tarnish patina next to it), so the player has to pick which flaw the object gets to keep, and that's not a checklist anymore, it's a call. Second, contested keepsakes: a handful of objects per playthrough arrive with two people who both have a claim on them, and the finish you choose — the polish level, which damage you left as "character" versus erased — is read by the town as taking a side, with the two claimants' later dialogue shifting based on what you did. Nobody's told outright who's right. The bench doesn't stay neutral forever.

## Systems

- **Inspect overlay & damage checklist** — running the inspect tool over an object shows every damage point, the technique it needs, and the material and time cost up front. Nothing about what a repair will cost is ever hidden or discovered mid-repair.
- **Toolbelt & the authenticity/speed dial** — each damage type has two or three techniques that trade time and material cost against how much of the object's original character survives the fix. The dial is the whole skill: knowing which trade a given customer actually wants.
- **Bench slots & the intake tray** — a fixed number of concurrent repair slots (3 at the start) force triage; the intake tray queues arrivals past that limit, and an unclaimed object's deadline shows as a patience marker rather than a hard timer.
- **Peddler cart economy** — a weekly cart with limited, rotating stock; common materials are never fully unavailable, but rarer ones (needed for Full Restoration on higher-value pieces) sell out and only return with a reputation bump or a better week.
- **The Keepsake Log** — a personal record of every finished object, its before/after state, and the note its owner left. This is the collection layer the genre leans on, but it is built from decisions already made in play, not a separate checklist to fill.
- **Trust & town threads** — a reputation value per recurring NPC or family group, raised by matching the finish to the stated want and dropped gently (never zeroed out) by missed deadlines or mismatched finishes. Trust gates which peddler stock and which object types show up next.
- **Compound damage sequencing** — from roughly the game's second act onward, some objects have damage points where one repair technique forecloses the ideal fix for another, turning the checklist into a real trade-off with no clean answer.
- **Contested keepsakes** — four to five hand-authored objects per playthrough with two claimants and no stated correct owner; the finish choice is read by the town and shapes later dialogue with both parties.

## Progression

A playthrough runs one in-game year, split into four seasons of about three in-game weeks each, roughly 12–15 hours for a first clear — shorter than a farm-sim campaign on purpose, closer to Discounty's tighter scope than to Stardew's open-ended one. Bench slots grow from 3 to 6 across four reputation milestones. New damage types are introduced roughly one per season: cracks and missing pieces in the first, tarnish and warped wood in the second, torn stitching and cracked glass in the third — each paired with its own technique pair on the toolbelt. Compound damage objects start appearing partway through the second season, once the player has had a full season to learn single-damage repairs cleanly. Contested keepsakes are capped at one or two per season, hand-placed rather than randomly generated, so they land as events rather than a system to optimize around. The year ends with a town archive exhibit — a capstone day where the Keepsake Log is put on public display and a handful of recurring NPCs react to what got kept, what got modernized, and who the contested pieces ended up favoring.

## World & setting

Salt Hollow is a small coastal town still sorting through what a bad storm three years back scattered out of attics, boat sheds, and the tide itself. You've taken over your grandmother's repair counter, the actual mending table the shop is named for, worn smooth in one spot from decades of the same elbow. The palette is driftwood grey, sea-glass green, and warm lamp amber — salvage and repair rather than anything twee. Damage in this world isn't cute breakage waiting for a coat of paint; it's real loss with a story attached, and the shop's whole premise is that fixing something is also deciding how much of what happened to it gets to stay visible. The tone sits closer to Spiritfarer's gentle melancholy than to a bright farm-sim palette — quiet, a little salt-worn, never grim.

## Differentiators

- The customer's want and the repair technique are the same decision, mechanically. Discounty was praised for its streamlined shop loop but flagged by reviewers for shallow customer storylines that wrap up before they land; here the customer's stated want is the input to an actual system, not flavor text sitting next to the real gameplay.
- Every cost is shown before you commit to it. A same-genre 2026 entrant, Ember Folks, drew criticism specifically for hiding resource-per-second feedback from the player; the inspect overlay here shows time, material, and authenticity cost for every technique before a single click is spent.
- The objects are the town's own disaster history, and craftsmanship choices quietly take sides in it. Contested keepsakes turn a repair decision into a small-town relationship beat without branching into a full dialogue tree — the shop stays the whole game, the stakes just stop being purely material.

## Monetization notes

Premium, one-time purchase, targeting $14.99–$19.99 — in line with Discounty's price band and below full-scope farm-sim pricing, matched to a deliberately tighter ~12–15 hour campaign rather than an open-ended one. Ship as a 1.0 release rather than a long Early Access run; the systems here (inspect overlay, toolbelt trade-offs, trust) are legible enough to tune internally without the live-service-style iteration a bigger sim like Satisfactory needed. The genre's 2026 output leans heavily on stock-and-sell (Discounty, Corner Market) and grow-and-harvest (Cozy Farm Manager) verbs; a craft-and-diagnose verb is a real gap in a crowded field, and the broader trend piece from Bryter Global on cozy gaming's growth backs a real, expanding audience for a new entrant that isn't just another shelf to stock.

## Accessibility notes

Fully remappable keyboard and mouse bindings. Damage-point icons are distinguished by shape as well as color for colorblind players. The repair timing bar has a toggle to auto-complete at a fixed quality, so players who want zero manual-dexterity content can play the whole management layer without it. Scalable UI text up to 150%. No hard fail state anywhere in the game — missed deadlines cost a small, recoverable trust dip, never a game over — so nothing about pacing punishes a player who needs to step away mid-repair. Adjustable game speed, including full pause for planning. Subtitles and captions for all NPC dialogue. Reduced-motion option for camera pans between the bench, the tray, and the peddler cart.

## Risks

- **The repair minigame reads as busywork stacked on top of the real management decisions.** Mitigation: the timing bar is fully optional via the auto-complete toggle, and quality differences from it are minor — the trust-and-trade-off decisions carry the actual weight, not manual dexterity.
- **Too many simultaneous trade-off dials (authenticity vs. speed, which slot to prioritize, what to stock) could push past the genre's low-cognitive-load promise.** Mitigation: each object's stated want pre-selects a suggested finish by default; players who want to just accept the suggestion never have to think about the dial directly.
- **Contested keepsakes and compound damage are hand-authored content, which caps replay variety.** Mitigation: keep the count deliberately small (4–5 contested keepsakes, a dozen or so compound-damage objects per playthrough) and treat them as authored beats, not a system the game promises to keep generating.
- **The genre is crowded going into 2026, with Discounty, Corner Market, and Cozy Farm Manager all recent or current entrants.** Mitigation: lead marketing on the one thing none of them do — the repair-and-diagnosis verb — rather than competing on shop-decoration or crop variety.
- **A material economy with scarcity could tip into anxious optimization, which fights the genre's whole premise.** Mitigation: common materials never fully sell out; only the rare, Full-Restoration-tier materials are scarce, so a planning mistake delays a nice-to-have, never blocks a repair outright.

## 6-week prototype plan

- **Week 1**: Build one bench slot and a single damage type (crack) end to end — inspect, select technique, drag material, timing bar, finished object. Deliverable: one object repaired start to finish, playable.
- **Week 2**: Add the full toolbelt, the authenticity/speed dial, and the Full Restoration vs. Quick Mend finish choice. Deliverable: an object with three damage points and two genuinely different finish outcomes with different trust results.
- **Week 3**: Add the intake tray, three-slot bench queue, and patience-marker deadlines with the soft-fail auto-ship behavior. Deliverable: juggling three objects with staggered deadlines in one sitting.
- **Week 4**: Add the peddler cart material economy, the trust score, and the Keepsake Log. Deliverable: a full in-game week where a material shortfall forces a real stocking decision.
- **Week 5**: Add compound-damage sequencing and one scripted contested-keepsake scenario. Deliverable: an object where repair order genuinely matters, playtested for whether the trade-off reads as real rather than arbitrary.
- **Week 6**: Vertical slice — one full in-game season with every system live, roughly 2–3 hours of content, external playtest. Deliverable question: does matching the finish to the stated want feel like the core skill, or does play settle into "always pick Full Restoration"?

## Genre references

- "Discounty," Wikipedia — https://en.wikipedia.org/wiki/Discounty — its streamlined, no-romance shop loop and the critics' note that its customer storylines are shallow and wrap up too fast shaped Mending Table's decision to make the customer's want a real mechanical input instead of flavor text.
- "Discounty Mobile Launches With Free Expansion That Fixed Abrupt Ending," Tech Times — https://www.techtimes.com/articles/324975/20260819/discounty-mobile-launches-free-expansion-that-fixed-abrupt-ending.htm — Discounty needing a post-launch expansion to fix an ending players found too abrupt informed the choice to build Mending Table's capstone (the town archive exhibit) and its contested-keepsake threads in from the start rather than as a later patch.
- "5 Cozy Strategy Games in 2026," No Time For Reviews — https://www.notimereviews.com/articles/cozy-strategy-games-2026 — its critique of Ember Folks for hiding resource-per-second feedback from the player directly shaped the inspect overlay's commitment to showing every repair's time and material cost before the player commits.
- "Cozy Farm Manager," Steam — https://store.steampowered.com/app/3820590 — its contract-fulfillment structure and its biodiversity-vs-chemical player choice informed both the deadline/trust structure and the authenticity-vs-speed dial as a recurring, meaningful decision rather than a one-off.
- "The Rise of Cozy Gaming," Bryter Global — https://www.bryter-global.com/blog/the-rise-of-cozy-gaming — its read on the genre's growth and its low-stakes, player-paced design philosophy grounded the monetization read and the no-hard-fail-state accessibility commitment.
