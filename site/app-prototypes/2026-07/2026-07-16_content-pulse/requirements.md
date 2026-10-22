# Content Pulse — Requirements

## Goals

- Give solo creators a single dashboard that replaces 5+ platform-native analytics pages.
- Reduce the daily analytics ritual from 30–60 minutes to under 5 minutes.
- Surface actionable insights (top post types, best-performing platform, engagement trends) without requiring spreadsheets or SQL.
- Provide a compelling free demo that converts to a $19/month subscription.

## Primary user

**Persona**: Alex, 29, solo personal-finance creator with 250k combined followers across YouTube, Instagram, and TikTok. Posts 4–6 times per week across platforms. Makes $6k–$12k/month from AdSense, brand deals, and affiliate links. Spends 45 minutes every morning checking each platform individually. Has tried spreadsheets but can't keep them current.

## Functional requirements

- FR1: Display a summary bar showing total followers, total monthly views, average engagement rate, and total monthly revenue across all connected platforms.
- FR2: Render a multi-series line chart showing weekly follower counts for each platform over a rolling 12-week window.
- FR3: Support a platform filter that narrows every widget (chart, stat cards, posts table) to the selected platform or shows all simultaneously.
- FR4: Show per-platform stat cards with: follower count, net follower change (current week vs. prior week), engagement rate, and revenue.
- FR5: Display a top-posts leaderboard (up to 10 posts) with columns for platform, title, date, views, likes, comments, engagement rate, and revenue.
- FR6: Allow the leaderboard to be sorted ascending/descending by any column via a single click.
- FR7: Visualize revenue distribution per platform as proportional horizontal bars with dollar amounts.
- FR8: Load all data from `sample-data.json` via `fetch()` so the demo requires no back-end.
- FR9: Highlight the current active platform filter visually (button state).
- FR10: Render correctly on viewports from 375px (iPhone SE) to 2560px (ultrawide).
- FR11: Show platform-color-coded indicators on the follower growth chart legend and the stat cards.
- FR12: Display a "Connect your platforms" CTA button that would trigger the OAuth flow in the live product.

## User stories

- As a solo creator, I want to see all my follower counts in one view, so I don't have to open five browser tabs every morning.
- As a creator, I want to filter analytics by platform, so I can deep-dive into my TikTok performance without noise from other channels.
- As a creator, I want to see which posts made the most money, so I can decide what type of content to prioritize.
- As a creator, I want to track follower growth over 12 weeks, so I can spot whether a posting change helped or hurt.
- As a creator running a content business, I want to see revenue by platform at a glance, so I can rebalance effort toward the most profitable channels.
- As a creator, I want the dashboard to load fast with no login required for the demo, so I can evaluate it before buying.
- As a creator on mobile, I want the dashboard to be usable on my phone, so I can check metrics while commuting.

## Non-functional requirements

- Performance: page must fully render within 2 seconds on a standard broadband connection.
- Accessibility: color contrast must meet WCAG 2.1 AA; platform filters must be keyboard-navigable.
- Privacy: the prototype loads no tracking pixels, sends no analytics, and makes no network requests beyond loading Chart.js from CDN and `sample-data.json`.
- Portability: no build step required; must work when served from any static file host (GitHub Pages, Netlify, Vercel, local HTTP server).

## Out of scope (for the prototype)

- Real OAuth connections to platform APIs.
- User accounts, authentication, or persistent storage.
- Historical data beyond the 12-week sample window.
- Push notifications or email digests.
- Team / agency multi-seat support.
- AI-generated insights (planned for v2).

## Open questions

- Which platform APIs are most rate-limited for the free tier? (Affects which platforms ship first in v1.)
- Should revenue data require manual entry (privacy-safe) or pull from Stripe/PayPal for sponsorship payouts?
- Is $19/month the right price, or should it be per-platform ($5/platform) to match Buffer's model?
