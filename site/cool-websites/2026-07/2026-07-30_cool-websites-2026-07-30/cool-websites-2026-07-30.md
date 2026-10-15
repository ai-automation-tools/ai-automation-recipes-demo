---
title: "Cool Websites — July 30, 2026"
date: 2026-07-30
type: cool-websites
site_count: 32
categories: [Security & Privacy, OSINT & Investigation, IT & Sysadmin Tools, AI Tools, Developer Tools, Open Source Software, Money & Finance, Travel, Learning & Reference, Games, Fun & Weird Internet]
tags: [cool-websites, web, tools, security, privacy]
model: claude (claude --print, built-in WebSearch)
cover_image_model: gemini-3.1-flash-image
cover_image_prompt: "Abstract digital collage evoking hidden corners of the internet: a low-angle wireframe globe made of glowing thin lines sits off-center to the left, threads of light arcing from it to a scattered cluster of translucent floating glass panels and hexagonal nodes drifting across the right two-thirds of the frame, faint circuit-like traces and dotted connection paths threading between them. Sleek modern tech-collage illustration style, digitally rendered with soft volumetric glow and fine grain texture. Palette strictly near-black background, neon green glow, cyan glow, and off-white highlights only. Wide landscape composition, globe motif anchored low-left with negative space upper-right, panels and nodes receding into soft blur at the edges, dramatic rim lighting from the glowing lines themselves. Mood: quietly futuristic, exploratory, a little clandestine. STRICT: no text, letters, words, numbers, captions, titles, logos, browser windows, UI chrome, tabs, address bars, icons, watermarks, signatures, or borders anywhere in the image."
---

# Cool Websites — July 30, 2026

> 32 corners of the internet worth bookmarking this week, from a status page you can spin up in one Docker command to a website that will tell you exactly how far your passport gets you.

## 🔐 Security & Privacy

### [Cryptee](https://crypt.ee)
Notes, documents, and photos get encrypted on your device before any of it reaches Cryptee's servers, so the Estonian team behind it says even they can't read your journal entries. Free tier included; paid plans start at $3/month for more storage.

### [Rentry](https://rentry.co)
A markdown paste site with no login and no tracking by default. You can hide the view counter, keep a page out of search results, and style it with custom themes, all useful when you just need to share formatted notes without creating yet another account.

### [Tails](https://tails.net)
Boot this from a USB stick on any computer and every connection routes through Tor; shut it down and it forgets you were ever there. Free, open source, built on Debian, and the same tool Edward Snowden used to talk to journalists.

## 🕵️ OSINT & Investigation

### [GeoSeer](https://geoseeer.com)
Feed it a photo with no location data and a multi-agent AI pipeline reasons out where it was shot from landmarks, vegetation, and signage instead of relying on EXIF, which most geolocation tools need and this one doesn't. One free search a day, no signup.

### [Stolen Camera Finder](https://www.stolencamerafinder.com)
Drag in a photo and it pulls the camera's serial number straight from the EXIF data, then checks it against millions of crawled images to see if your stolen gear has turned up online somewhere. Only works if the thief posted photos and didn't strip the metadata first.

### [Archive.today](https://archive.ph)
Paste a URL and it saves a permanent snapshot, live links intact, that survives even after the original page gets edited or deleted. OSINT researchers favor it over louder scraping tools precisely because it's a quiet, on-demand capture.

## 🖧 IT & Sysadmin Tools

### [CIDR.xyz](https://cidr.xyz)
Type in an IP and CIDR block and it draws the netmask, broadcast address, and usable host range as an actual visual bitmap instead of a wall of numbers. Open source, no signup, built for the exact moment subnetting math stops making sense in your head.

### [HackerTarget](https://hackertarget.com)
A grab bag of roughly 17 free network and recon tools: port scans, reverse DNS, whois, traceroute, HTTP header checks. No account needed for the basics, and it's been running since 2007.

### [LibreSpeed](https://librespeed.org)
Point this at your own server instead of handing your ISP name and IP to yet another third party. No Flash, no Java, no WebSockets, just a page that measures download, upload, ping, and jitter and gets out of your way.

## 🤖 AI Tools

### [Wispr Flow](https://wisprflow.ai)
Dictation that actually formats what you say instead of dumping a wall of filler words onto the page. It learns your vocabulary and works inside any text field on Mac, Windows, iOS, or Android. Free plan available; the full version runs $15/month.

### [Laxis](https://www.laxis.com)
Records meeting audio without a bot joining the call, so nobody sees "Laxis Notetaker has joined." It transcribes, strips the "ums," and syncs summaries to Slack or Salesforce, with a usable free tier.

### [MyLens](https://www.mylens.ai)
Drop in a PDF, a link, or a pile of data and it turns the content into an interactive, narrated presentation with clickable diagrams instead of static slides. Free tier available, and the company says it won't train on what you upload.

## 🛠️ Developer Tools

### [Diffchecker](https://www.diffchecker.com)
Compares two blocks of text, images, PDFs, or entire folders and highlights exactly what changed between them. The desktop app keeps your diffs off their servers entirely, for anyone who needs that.

### [DevBench](https://devbench.site)
Over 90 developer utilities, JSON formatters, JWT decoders, regex testers, password generators, that all run client-side, so nothing you paste ever reaches a server. No account, no limits.

### [Extract.pics](https://extract.pics)
Give it any webpage URL and it pulls every image on the page, lazy-loaded and background images included, into a browsable grid you can bulk-download. No install, no account.

## 📦 Open Source Software

### [Kener](https://kener.ing)
Deploy this status page with one Docker command and you're monitoring API, ping, TCP, DNS, and SSL checks within minutes, complete with automatic incident tracking. MIT licensed, built with Svelte.

### [ExpenseOwl](https://github.com/tanq16/expenseowl)
Logging an expense here takes three fields: date, amount, category. That's the entire pitch, plus a monthly pie chart and a PWA you can pin to your phone's home screen. One Docker command gets it running on your own server.

### [KitchenOwl](https://github.com/TomBursch/kitchenowl)
This one's built for households that argue about the grocery list: it syncs in real time across everyone's phone and splits shared costs automatically. Still labeled public alpha, but already usable day to day.

## 💰 Money & Finance

### [Firenum](https://firenum.com)
A FIRE retirement calculator that runs Monte Carlo simulations against 153 years of market data entirely in your browser. Your numbers sit in local storage, not on a server, and there's no account or email required to use any of it.

### [WorldCostOfLiving](https://www.worldcostofliving.com/compare)
Pick up to three cities and see rent, groceries, and transport costs broken down side by side across more than 160 cities, using a Big Mac-style anchor index instead of vague national averages. Free, no signup.

## ✈️ Travel

### [Passport Index](https://www.passportindex.org)
Ranks and compares passports by how much visa-free travel they unlock, and lets you check exactly what you'd need for any destination on the passport you actually hold. Built by Arton Capital, free to browse.

### [AeroLOPA](https://aerolopa.com)
Built by the founder of the original SeatGuru, this maps individual seats on specific flights with row pitch, recline, and a color-coded avoid rating, instead of a generic cabin diagram. Covers 200-plus airlines.

### [FlightList](https://www.flightlist.io)
Searches a date range or an entire region instead of one fixed itinerary, so you can spot the cheapest week to fly without checking twenty single dates by hand. Free, no account required.

## 📚 Learning & Reference

### [Untools](https://untools.co)
A curated shelf of decision-making frameworks, the Eisenhower Matrix, the Six Thinking Hats, and dozens more, each with a plain-language explanation of when to actually reach for it. The core collection is free; there's an optional paid template pack.

### [YouGlish](https://youglish.com)
Type any word or phrase and it cues up real YouTube clips of people saying it, so you can hear the pronunciation in context instead of trusting a dictionary's phonetic spelling. Filter by word class, accent, or speaker.

### [Algorithm Visualizer](https://algorithm-visualizer.seancoughlin.me)
Watch sorting, searching, and graph algorithms execute one step at a time, with the relevant code highlighted as it runs. Free and open source, and further along than most of the "coming soon" competitors in this space.

## 🎮 Games

### [PolyTrack](https://kodub.itch.io/polytrack)
A low-poly racing game built like a browser-native TrackMania, loops, jumps, and a track editor so you can build and share your own courses. Pay what you want, including nothing.

### [ZType](https://zty.pe)
A Space Invaders riff where you kill enemy ships by typing the word printed on their hull before they reach you. It's been around since 2011 and is still one of the better ways to make typing practice feel like a game instead of homework.

## 🎉 Fun & Weird Internet

### [Killed by Google](https://killedbygoogle.com)
A running tombstone list of 307-plus Google products, services, and hardware the company has shut down, from Google Reader to whatever got axed last month. Oddly comforting to browse when you're mourning the latest casualty.

### [Reveddit](https://www.reveddit.com)
Swap "reddit" for "reveddit" in any URL and see which comments got removed by moderators, something Reddit's own interface hides from you. It only surfaces mod-removed content, not anything you deleted yourself.

### [MapCrunch](https://www.mapcrunch.com)
Drops you into a random Google Street View somewhere on Earth with zero context about where you are. The invented "Airport Game," navigate using Street View alone until you find an airport, has kept people occupied since 2010.

### [Where's George](https://www.wheresgeorge.com)
Stamp a dollar bill, enter its serial number, and watch strangers report it as it travels the country for years afterward. Running since 1998 and still one of the stranger ways the internet has found to track a physical object.

---

*32 sites this week. Found something broken or have a site to suggest? Reply to the email.*
