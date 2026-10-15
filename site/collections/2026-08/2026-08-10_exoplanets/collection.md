<h1 align="center">🪐 Exoplanets Collection</h1>

<p align="center">
  <em>Scientifically plausible alien life imagined for 25 real exoplanets — each creature shaped by its world's gravity, star, atmosphere, and climate, rendered as a natural-history field guide.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Type-Image%20Collection-0078D4?style=for-the-badge" alt="Type">
  <img src="https://img.shields.io/badge/Worlds-25-2ea44f?style=for-the-badge" alt="Worlds">
  <img src="https://img.shields.io/badge/Cadence-One%20Planet%20Per%20Run-8B5CF6?style=for-the-badge" alt="Cadence">
  <img src="https://img.shields.io/badge/Status-In%20Progress-F97316?style=for-the-badge" alt="Status">
</p>

---

## 📌 Overview

A speculative-astrobiology collection covering **25 real exoplanets** — from nearby red-dwarf worlds like Proxima Centauri b and the TRAPPIST-1 planets to Hycean K2-18 b, the lava world 55 Cancri e, and the deep-ocean candidate TOI-1452 b. For each world, one image imagines a **scientifically plausible alien organism** whose anatomy is dictated by that planet's measured and inferred environment — gravity shapes the body, the host star shapes the eyes and color, the atmosphere shapes breathing and skin, and temperature shapes metabolism.

The style is **"NASA meets National Geographic meets speculative astrobiology"** — realistic natural-history field-guide illustration, not fantasy aliens. Every creature is tied to real published data for its world (provided in the workflow prompt, so this collection needs no web research).

> [!NOTE]
> The collection is **in progress**. The weekend automation adds one new planet at a time, in the plan order (01 → 25), starting with the first missing `Exoplanets_<NN>-<Planet-Slug>.png`.

---

## 🗂️ Folder Structure

```
Exoplanets/
├── README.md
├── Prompts/
│   └── generate-exoplanets-collection.md    # workflow prompt: rules + 25-planet plan + per-planet data + master prompt
├── Images/
│   └── Exoplanets_<NN>-<Planet-Slug>.png    # one per planet, plan order 01 → 25
└── Metadata/
    └── Exoplanets_<NN>-<Planet-Slug>.md     # same stem as the image
```

---

## 🏷️ File Naming

| Pattern | Example |
|:--------|:--------|
| `Exoplanets_<NN>-<Planet-Slug>.png` | `Exoplanets_01-LHS-1140-b.jpg` |

`<NN>` is the zero-padded plan sequence number (01–25) and `<Planet-Slug>` is the planet designation in kebab-case (hyphens only). The leading number keeps the collection in curated plan order on disk and in the gallery — the slug-indexed analog of the year used by the year-indexed collections.

---

## ⚙️ How an Image Is Produced

1. The shared **weekend-yearly-collections** Codex job reads [`Prompts/generate-exoplanets-collection.md`](Prompts/generate-exoplanets-collection.md), lists the existing `Images/` files, and picks the first plan row not yet on disk.
2. It builds the image from that planet's **Image Prompt Seed** and the collection rules (gravity/star/atmosphere/temperature → body plan), and renders a 3:2 landscape PNG via the built-in image tool (Gemini fallback if it doesn't persist).
3. The PNG saves to `Images/Exoplanets_<NN>-<Planet-Slug>.png` and its metadata sidecar to `Metadata/Exoplanets_<NN>-<Planet-Slug>.md`.
4. **No web research** — all 25 planets' data + prompts live in the workflow prompt, so the run is fully self-contained.

---

## 🎨 Visual Style

- **Natural-history field-guide / realistic scientific illustration** — documentary lighting, believable anatomy, one unified scene per planet.
- The creature is always shown **in its habitat** (alien ocean, ice, lava crust, twilight terminator, forest, tundra, cliffs, burrow…).
- **Environment-driven design** — high gravity = squat and muscular; low gravity = tall and gliding; red-dwarf light = big low-light eyes and dark pigments; hydrogen atmospheres = buoyant gas-sac bodies; cold = insulation; hot = reflective armor and radiators.
- **No baked-in text or labels** (unlike the year-indexed collections), no logos, no real-person likenesses.
- **Wide 3:2 landscape** (1536×1024).

---

## ✅ QA Checklist (per image)

- Body plan reflects gravity; eyes/senses reflect the star's light; skin/insulation reflect climate; locomotion fits the terrain.
- Field-guide realism, not cartoon or fantasy.
- Creature shown in the planet's environment.
- No humanoid anatomy unless justified; no text, logos, or real-person likenesses.
- Filename matches `Exoplanets_<NN>-<Planet-Slug>.png`; metadata shares the stem.

---

<p align="center">
</p>
