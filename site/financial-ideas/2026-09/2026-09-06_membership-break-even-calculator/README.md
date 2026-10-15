# Membership Break-Even Calculator

> Enter what you actually spend at Costco, Sam's Club, BJ's, or Amazon, and see whether the upgraded membership tier earns back its extra fee — or whether the cheaper card in your wallet was right all along.

**Date**: 2026-09-06
**Theme**: Discounts
**Status**: Prototype

## What it is

A single-page calculator that runs the real math behind a question most people guess at: is the $65 Costco Executive upgrade, the $60 Sam's Club Plus upgrade, or the $60 BJ's Club+ upgrade worth it for how you actually shop? You type in one number per retailer — your annual spend there — and the app computes the 2% reward each upgrade tier would earn, nets it against the extra fee, and tells you the exact spend threshold where the upgrade starts paying for itself.

## Who it serves

Someone standing at the warehouse-club kiosk being asked "Gold Star or Executive?" who doesn't want to do the arithmetic on the spot, or someone renewing four memberships a year and wondering if they're all still worth carrying.

## The money problem it addresses

Warehouse clubs sell the upgrade tier with a flat pitch — "2% back on everything" — and let the shopper's imagination fill in the rest. The real breakeven is a fixed number: divide the fee difference by the reward rate. For Costco that's $3,250 a year at Executive's 2% rate; for Sam's Club and BJ's it's $3,000. Below that spend, the upgrade is a straight loss no matter how good the early-hours access feels. Above it, and only above it, the math turns around. Nobody hands you that number at checkout, and it changes per retailer because the reward caps differ too — Costco tops out at $1,250 a year, Sam's Club at $750, BJ's at $500 — so a big spender can hit a ceiling where more shopping stops earning more back.

## How it works

Four panels, one per retailer (Costco, Sam's Club, BJ's Wholesale, Amazon). Each warehouse-club panel takes a single annual-spend number and shows both tiers' fee and reward terms side by side. Amazon Prime works differently since there's no purchase-based reward — you enter what free shipping and Prime Video are worth to you, and the app checks that against the $139 annual fee.

A "load a demo profile" dropdown fills in three ready-made shopping patterns — a family doing weekly warehouse runs, a single professional making occasional bulk trips, and a small-business owner buying supplies at two clubs — so the tool is usable before you've pulled up your own numbers. Every field stays editable after loading.

Hit calculate and each panel shows a bar comparing the two tiers' net annual cost, a plain verdict on which one wins at your spend, and the exact break-even spend for the upgrade. A summary at the top totals your recommended tiers into one net annual cost and a monthly equivalent, skipping any retailer you left at zero.

## What's in this folder

- `requirements.md` — functional and technical requirements for the app
- `index.html` — the app itself, opens directly in a browser
- `style.css` — styling
- `script.js` — the reward math (integer-cent arithmetic), input validation, and result rendering, all client-side
- `sample-data.json` — the four retailers' membership tiers (fees, reward rates, reward caps) plus three demo shopping profiles
- `cover.jpg` — cover art for the library listing
- `metadata.md` — generation metadata

## How to run / read it

Open `index.html` in any modern browser. No build step, no server, no account. Pick a demo profile from the dropdown to see it populated, or type in your own spend numbers directly.

## Estimated impact

Run the numbers on Costco: someone spending $1,500 a year there pays $35 more for Executive than Gold Star, since a 2% reward on $1,500 is only $30 against the $65 upgrade fee. Someone spending $4,800 a year clears the $3,250 break-even with room to spare and comes out $31 ahead after the upgrade fee. The swing between those two outcomes is $66 on the same yes-or-no decision, and the only thing that changed is whether the shopper knew their own number before the kiosk asked.

## Good to know

This is an arithmetic tool, not a recommendation to join, cancel, or upgrade a specific membership — it reports what the fee and reward terms mean for the spend you enter, and you decide what to do with that. It doesn't model gas-station discounts, travel-booking credits, or other perks that vary too much by location to estimate responsibly, and it doesn't account for first-year promotional pricing, which several of these retailers were running at the time this was built. Membership fees and reward caps change — Sam's Club raised its Plus cap from $500 to $750 in May 2026, and BJ's raised its base fees in January 2026 — so check the current terms on the retailer's own site before deciding.

## Sources

- `https://customerservice.costco.com/app/answers/answer_view/a_id/1008254/~/executive-2%25-reward-faqs` — Costco Executive 2% reward rate and $1,250 annual cap
- `https://www.fool.com/investing/2026/01/16/costco-gold-star-members-upgrade-executive-3-perks/` — Costco Gold Star ($65) and Executive ($130) annual fees
- `https://www.cnbc.com/2026/04/01/sam.html` — Sam's Club standard membership fee increase to $60/yr, effective 2026-05-01
- `https://thekrazycouponlady.com/tips/money/sams-club-membership-cost` — Sam's Club Plus fee ($120/yr) and Sam's Cash cap raised to $750/yr
- `https://www.foxbusiness.com/lifestyle/bjs-wholesale-hike-membership-fees-first-time-7-years` — BJ's Club Card fee increase to $60/yr, effective 2026-01-01
- `https://www.rivo.io/blog/bjs-wholesale-club-membership-program` — BJ's Club+ fee ($120/yr), 2% reward rate, and $500 annual cap
- `https://www.itechguides.com/amazon-prime-membership-plans-and-prices-u-s-2026-explained/` — Amazon Prime standard pricing ($14.99/mo or $139/yr)
