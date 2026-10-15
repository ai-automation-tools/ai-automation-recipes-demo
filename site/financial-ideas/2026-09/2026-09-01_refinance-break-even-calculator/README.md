# Refinance Break-Even Calculator

> Enter your current loan and a refinance offer, and see the month your savings actually catch up to the closing costs — not just the back-of-envelope version.

**Date**: 2026-09-01
**Type**: App
**Theme**: Debt
**Status**: Idea

## What it is

A single-page browser app that compares a current loan (mortgage, auto, personal, or student) against a refinance offer and calculates two different break-even points: the standard "closing costs ÷ monthly savings" rule of thumb, and a month-by-month simulation that also accounts for how the new interest rate changes the amortization schedule itself. The two numbers often don't match, and the gap is the whole point.

## Who it serves

Someone who got a refinance offer with a lower rate and wants to know if it's actually worth the closing costs before their next move, sale, or payoff. Not a generic "refinancing 101" explainer, a calculator that uses their real balance, rate, and term.

## The money problem it addresses

Most refinance calculators divide closing costs by monthly savings and call it a day. That number is a reasonable first pass, but it breaks down the moment the new loan's term differs from the current loan's remaining term, which is common since many refinances reset a 25-year-remaining mortgage back to a fresh 30-year term. Stretching the term lowers the monthly payment even without much of a rate improvement. That makes the simple break-even look great while quietly leaving a larger balance owed at any given month than if the original loan had just kept running. This tool runs both loans forward month by month and compares total cost, payments made plus what's still owed, so a "savings" number that's really just deferred debt gets flagged instead of celebrated.

## How it works

The user fills in the current loan (balance, APR, remaining term) and the refinance offer (new APR, new term, closing costs), plus how long they plan to keep the loan. A "load sample scenario" dropdown swaps in one of ten preset situations, including a mortgage where the new term resets longer and the refinance actually loses money over a short stay. On calculate, the app shows the new monthly payment, the payment difference, and both break-even numbers side by side, then plots cumulative true cost for both loans on a line chart so the crossover point is visible. A verdict banner states which loan is cheaper at the planned stay length and flags it explicitly when a "win" is coming from a longer term rather than a better rate.

## What's in this folder

- `requirements.md` — functional and technical requirements for the app
- `index.html` — the app itself, opens directly in a browser
- `style.css` — styling
- `script.js` — amortization math, month-by-month simulation, and chart rendering (all client-side, integer-cent arithmetic)
- `sample-data.json` — ten synthetic refinance scenarios spanning mortgage, auto, personal loan, and student loan refinances
- `cover.jpg` — cover art for the library listing
- `metadata.md` — generation metadata

## How to run / read it

Open `index.html` in any modern browser. No build step, no server, no account. Pick a sample scenario from the dropdown to see it populated, or type in your own numbers.

## Estimated impact

On the sample mortgage scenario ($320,000 balance, 7.25% → 6.71%, $9,600 closing costs, same term), the simple rule of thumb says break-even at 85 months; the term-adjusted simulation puts it at 67 months, an 18-month gap because the lower rate pays down principal faster than the flat monthly-savings math accounts for. On the "term reset trap" scenario, a rate drop from 6.10% to 5.90% paired with resetting a 300-month remaining term back to 360 months costs $6,375 more than keeping the current loan over a 36-month stay — a refinance the simple rule of thumb would have approved.

## Good to know

This is a rate-and-term comparison, not a substitute for a lender's actual loan estimate — it doesn't model PMI changes, escrow, tax deductibility of mortgage interest, or cash-out refinancing. Sample rates and closing-cost ranges are grounded in the sources below as of September 2026; check current numbers before deciding. Not personalized financial or tax advice.

## Sources

- `https://www.bankrate.com/mortgages/when-to-refinance/` — closing cost range (2%–5% of loan amount), break-even formula, and the 0.75–1.0 percentage point rate-drop rule of thumb
- `https://www.nerdwallet.com/mortgages/mortgage-rates` — current average refinance rates referenced for realistic sample scenarios (30-year 6.71%, 15-year 6.21%, as of September 1, 2026)
