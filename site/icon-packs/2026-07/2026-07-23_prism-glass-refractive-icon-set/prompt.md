# Generation Prompts

> **Historical.** These are the prompts that produced the pack's *original*
> diffusion renders, which are archived outside this repo. The icons the pack
> ships today were redrawn as vector geometry and did not come from an image
> model — see `metadata.md` for what generated them.

- **System Model**: Gemini 3.5 Flash (concept + icon list)
- **Format**: PNG — .png (raster)
- **Icon Engine**: Antigravity CLI (`agy`) OAuth image tool (free); `google-genai` `gemini-3.1-flash-image` SDK fallback

## Pack Prompt
> You are an expert icon designer and creative director.
Your task is to conceptualize a cohesive icon pack based on the theme: Prism Glass Refractive Icon Set.

The pack should contain 12 distinct icons that would be useful for web design, app interfaces, or OS customization.

Return a JSON object with:
- "title": A catchy name for the icon pack.
- "slug": A kebab-case slug for the pack.
- "description": A 2-3 sentence description of the pack's style and use case.
- "introduction": A short introductory text for the pack's documentation.
- "metadata": {
    "style": "The overall visual style (e.g., Glassmorphism, Pixel Art)",
    "keywords": ["list", "of", "5", "keywords"]
  }
- "icons": A list of 12 objects, each with:
    - "name": Name of the icon (e.g., "Home", "Settings", "User").
    - "concept": A brief description of what the icon represents.
    - "image_prompt": A highly detailed, professional prompt for an image generation model to create a single, high-quality icon. The prompt should specify a transparent or solid background (e.g., "on a solid white background"), centered composition, and consistent style.
- "caption": A short notification caption (e.g., "A set of 12 glassmorphic web icons for modern UI.")

Ensure the "image_prompt" for each icon is consistent with the overall style.


## Individual Icon Prompts
### Prism Home
> 3D icon of a minimalist house crafted from ultra-pure refractive prism glass. High-index optical glass with subtle chromatic aberration, internal rainbow spectrum dispersion, and realistic glass caustics. Centered composition, studio lighting, resting on a dark charcoal minimalist studio background, 8k resolution, ray-traced rendering.

### Spectral Search
> 3D icon of a magnifying glass crafted from ultra-pure refractive prism glass. Highly detailed crystal lens casting a focused rainbow light beam, subtle chromatic aberration. Centered composition, studio lighting, resting on a dark charcoal minimalist studio background, 8k resolution, ray-traced rendering.

### Refractive Gear
> 3D icon of a mechanical gear crafted from ultra-pure refractive prism glass. Sharp interlocking teeth refracting light, intense internal rainbow dispersion, realistic caustics. Centered composition, studio lighting, resting on a dark charcoal minimalist studio background, 8k resolution, ray-traced rendering.

### Chroma Bell
> 3D icon of a notification bell crafted from ultra-pure refractive prism glass. Smooth glossy surface, internal light splitting into soft pastel spectrums, delicate crystal clapper. Centered composition, studio lighting, resting on a dark charcoal minimalist studio background, 8k resolution, ray-traced rendering.

### Prismatic User
> 3D icon of a minimalist human bust silhouette crafted from ultra-pure refractive prism glass. Curved glass edges catching brilliant rainbow highlights, sharp internal reflections. Centered composition, studio lighting, resting on a dark charcoal minimalist studio background, 8k resolution, ray-traced rendering.

### Crystalline Chart
> 3D icon of an ascending bar chart crafted from ultra-pure refractive prism glass. Three glass columns of increasing height, refracting light, casting colorful caustic patterns downward. Centered composition, studio lighting, resting on a dark charcoal minimalist studio background, 8k resolution, ray-traced rendering.

### Refractive Shield
> 3D icon of a protective shield crafted from ultra-pure refractive prism glass. Thick, secure geometry bending the light passing through it, vivid chromatic aberration along the edges. Centered composition, studio lighting, resting on a dark charcoal minimalist studio background, 8k resolution, ray-traced rendering.

### Spectrum Mail
> 3D icon of an envelope crafted from ultra-pure refractive prism glass. Geometric folds refracting light inside, rainbow light leaks emanating from the seams. Centered composition, studio lighting, resting on a dark charcoal minimalist studio background, 8k resolution, ray-traced rendering.

### Nebula Cloud
> 3D icon of a stylized cloud crafted from ultra-pure refractive prism glass. Soft rounded contours reflecting brilliant rainbow spectrums, internal cloud-like caustics. Centered composition, studio lighting, resting on a dark charcoal minimalist studio background, 8k resolution, ray-traced rendering.

### Optical Camera
> 3D icon of a camera body with a prominent camera lens crafted from ultra-pure refractive prism glass. Multiple concentric glass elements showing extreme optical refraction and rainbow flares. Centered composition, studio lighting, resting on a dark charcoal minimalist studio background, 8k resolution, ray-traced rendering.

### Prism Globe
> 3D icon of a terrestrial globe sphere crafted from ultra-pure refractive prism glass. Delicate engraved grid lines glowing with split spectrum colors, casting beautiful spherical caustics. Centered composition, studio lighting, resting on a dark charcoal minimalist studio background, 8k resolution, ray-traced rendering.

### Chroma Compass
> 3D icon of a navigation compass crafted from ultra-pure refractive prism glass. A crystal housing holding a sharp, floating glass needle reflecting vibrant spectral colors. Centered composition, studio lighting, resting on a dark charcoal minimalist studio background, 8k resolution, ray-traced rendering.

