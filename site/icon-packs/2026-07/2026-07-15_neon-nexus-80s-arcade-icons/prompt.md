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
Your task is to conceptualize a cohesive icon pack based on the theme: 80s Arcade HighSaturation Icons.

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
### Home Cabinet
> A 3D digital icon of a classic 80s arcade game cabinet, retro-futuristic 1980s arcade style. Vibrant neon magenta, electric cyan, and laser yellow colors, high saturation, intense glow effect, glossy chrome accents. Clean isometric view, centered composition, on a solid black background.

### Neon Gear
> A 3D digital icon of a mechanical gear, retro-futuristic 1980s arcade style with neon-lit teeth and a glowing central core. Vibrant neon magenta, electric cyan, and laser yellow colors, high saturation, intense glow effect, glossy chrome accents. Clean isometric view, centered composition, on a solid black background.

### Retro User
> A 3D digital icon of a stylish pair of retro shutter shades, retro-futuristic 1980s arcade style. Vibrant neon magenta, electric cyan, and laser yellow colors, high saturation, intense glow effect, glossy chrome accents. Clean isometric view, centered composition, on a solid black background.

### Pixel Chat
> A 3D digital icon of a pixel-art style speech bubble, retro-futuristic 1980s arcade style. Vibrant neon magenta, electric cyan, and laser yellow colors, high saturation, intense glow effect, glossy chrome accents. Clean isometric view, centered composition, on a solid black background.

### Radar Search
> A 3D digital icon of a magnifying glass with a circular radar grid inside, retro-futuristic 1980s arcade style. Vibrant neon magenta, electric cyan, and laser yellow colors, high saturation, intense glow effect, glossy chrome accents. Clean isometric view, centered composition, on a solid black background.

### Cartridge Cart
> A 3D digital icon of a glowing retro shopping cart containing a pixel-art game cartridge, retro-futuristic 1980s arcade style. Vibrant neon magenta, electric cyan, and laser yellow colors, high saturation, intense glow effect, glossy chrome accents. Clean isometric view, centered composition, on a solid black background.

### Laser Play
> A 3D digital icon of a retro vector spaceship pointing right like a play button, retro-futuristic 1980s arcade style. Vibrant neon magenta, electric cyan, and laser yellow colors, high saturation, intense glow effect, glossy chrome accents. Clean isometric view, centered composition, on a solid black background.

### Grid Chart
> A 3D digital icon of a bar chart made of glowing, stacked pixel blocks, retro-futuristic 1980s arcade style. Vibrant neon magenta, electric cyan, and laser yellow colors, high saturation, intense glow effect, glossy chrome accents. Clean isometric view, centered composition, on a solid black background.

### Floppy Save
> A 3D digital icon of a classic 3.5-inch floppy disk, retro-futuristic 1980s arcade style. Vibrant neon magenta, electric cyan, and laser yellow colors, high saturation, intense glow effect, glossy chrome accents. Clean isometric view, centered composition, on a solid black background.

### Synthwave Bell
> A 3D digital icon of a retro-styled alarm bell with a digital neon aura, retro-futuristic 1980s arcade style. Vibrant neon magenta, electric cyan, and laser yellow colors, high saturation, intense glow effect, glossy chrome accents. Clean isometric view, centered composition, on a solid black background.

### Cyber Lock
> A 3D digital icon of a heavy-duty padlock featuring a glowing keyhole and grid texture, retro-futuristic 1980s arcade style. Vibrant neon magenta, electric cyan, and laser yellow colors, high saturation, intense glow effect, glossy chrome accents. Clean isometric view, centered composition, on a solid black background.

### Grid Cloud
> A 3D digital icon of a stylized digital cloud with a glowing neon arrow pointing down, retro-futuristic 1980s arcade style. Vibrant neon magenta, electric cyan, and laser yellow colors, high saturation, intense glow effect, glossy chrome accents. Clean isometric view, centered composition, on a solid black background.

