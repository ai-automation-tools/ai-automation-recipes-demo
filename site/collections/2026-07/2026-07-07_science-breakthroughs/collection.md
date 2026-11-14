<h1 align="center">🔬 Science Breakthroughs Collection</h1>

<p align="center">
  <em>Year-by-year illustrated science-magazine montages capturing medicine, physics, biology, genetics, energy, archaeology, materials science, and the year's Nobel-worthy discoveries.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Type-Image%20Collection-0078D4?style=for-the-badge" alt="Type">
  <img src="https://img.shields.io/badge/Range-2000%E2%80%93Present-2ea44f?style=for-the-badge" alt="Range">
  <img src="https://img.shields.io/badge/Cadence-One%20Year%20Per%20Run-8B5CF6?style=for-the-badge" alt="Cadence">
  <img src="https://img.shields.io/badge/Status-In%20Progress-F97316?style=for-the-badge" alt="Status">
</p>

---

## 📌 Overview

A year-by-year illustrated collection covering **2000 through the current year** (a rolling range — a new year becomes eligible every January). Each image is a single unified science-magazine montage showing the medicine, physics, biology, genetics, energy, archaeology, materials-science, and Nobel-worthy discoveries that defined science that year.

The goal is a fun, searchable, and visually distinct record of how science advanced — from the Human Genome era through gravitational waves, CRISPR, mRNA vaccines, fusion milestones, ancient-DNA finds, and whatever we discover next.

> [!NOTE]
> The collection is **in progress**. The weekend automation adds one new year at a time, starting with the first missing `Science-Breakthroughs_<YYYY>.png` in the range.

---

## 🗂️ Folder Structure

```
Science-Breakthroughs/
├── README.md
├── Prompts/
│   └── generate-science-breakthroughs-collection.md   # workflow prompt + master image prompt
├── Images/
│   └── Science-Breakthroughs_<YYYY>.png               # one per year, 2000 → current year
└── Metadata/
    └── Science-Breakthroughs_<YYYY>.md                # same stem as the image
```

---

## 🏷️ File Naming

| Pattern | Example |
|:--------|:--------|
| `Science-Breakthroughs_<YYYY>.png` | `Science-Breakthroughs_2000.jpg` |

The 4-digit year is required so files sort chronologically and match the workflow prompt's expectations.

---

## ⚙️ How an Image Is Produced

1. The workflow agent reads [`Prompts/generate-science-breakthroughs-collection.md`](Prompts/generate-science-breakthroughs-collection.md), compares the 2000 → current-year range with existing `Images/Science-Breakthroughs_<YYYY>.png` files, and picks the earliest missing year.
2. The agent researches **8-12 visually distinct science breakthroughs** from that year — across medicine, physics/astronomy, biology, genetics/biotech, energy/climate, archaeology/paleontology, materials science, and the year's Nobel Prizes — using web search.
3. Sources are credible science and news references (Nature, Science, Scientific American, New Scientist, Quanta, nobelprize.org, NASA/ESA/CERN/NIH/NOAA, AP/Reuters/BBC), cited in the metadata sidecar.
4. The master image prompt is filled in for that year and sent to the image model.
5. The output PNG saves to `Images/Science-Breakthroughs_<YYYY>.png` and its metadata to `Metadata/Science-Breakthroughs_<YYYY>.md`.

---

## 🎨 Visual Style

- **Laboratory-and-discovery editorial montage** with stylized microscopes, telescopes, molecule/DNA models, particle-collider rings, fossil digs, clean-energy prototypes, hospital research rooms, star charts, and readable short field labels.
- **One unified scene** per year, never a rigid grid or disconnected sticker collage.
- **Readable embedded year text** (e.g. "2003") and optional short title text like "BREAKTHROUGHS OF 2003".
- **Stylized equipment references** — no official logos, exact institutional branding, or trademark-accurate designs.
- **Short labeled props** only (1-5 words on chalkboards, screens, specimen tags, wall charts, posters). No long captions or fake article blocks.
- **Wide landscape composition** with foreground researchers/instruments, midground lab benches/specimen tables, and background observatory, collider, and hospital-research context.

---

## ✅ QA Checklist (per image)

- The year is readable at a glance.
- The image depicts a balanced set of breakthroughs across multiple fields, not only one.
- The biggest 2-3 breakthroughs are visually prominent.
- Equipment and institutional references are stylized, not logo/branding replicas.
- Labels are short, readable, and spelled correctly.
- No official logos, exact branding, or photorealistic real-person likenesses.
- Medical and sensitive topics are depicted symbolically, not graphically.
- Filename matches `Science-Breakthroughs_<YYYY>.png`.

---

<p align="center">
</p>
