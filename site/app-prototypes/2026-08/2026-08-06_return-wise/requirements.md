# ReturnWise — Requirements

## Goals

- Show a shopper the refund they'd actually receive for a given retailer, price, and return method, before they commit to buying or mailing something back.
- Track purchases against each retailer's return window and surface urgency so a deadline doesn't pass unnoticed.
- Let a shopper compare retailers on return cost alone, independent of the item's price.

## Primary user

An online shopper who buys from several retailers with different, unposted return policies. They've been surprised by a return fee before and want a quick check before checkout or before a return window closes, not a full research project.

## Functional requirements

- FR1: The calculator must let a user select a retailer, enter an item price, toggle opened/unopened, and choose mail or in-store return.
- FR2: The calculator must recompute the refund amount immediately when any input changes, with no submit button required.
- FR3: The refund breakdown must itemize each fee applied (mail label fee, restocking fee) with its dollar amount.
- FR4: In-store returns must always compute as fee-free, matching the sample data's retailer policies.
- FR5: The calculator must flag when a return costs the user nothing versus when it costs a visible share of the refund.
- FR6: The tracker must list all tracked purchases sorted by return deadline, soonest first.
- FR7: Each tracked purchase must show its days-remaining count and a color-coded urgency state (urgent, soon, ok).
- FR8: A user must be able to add a new tracked purchase (retailer, item name, price, purchase date, opened state) through a form.
- FR9: A user must be able to remove a tracked purchase from the list.
- FR10: The deadline for a tracked purchase must be computed from its purchase date plus the retailer's return window in days.
- FR11: The compare view must rank all sample retailers by the fee charged on an identical reference item (opened, mailed), worst first.
- FR12: The compare view must visually distinguish retailers with a $0 fee from those with a nonzero fee.
- FR13: All retailer, tracked-purchase, and fee data must load from `sample-data.json` at page load via `fetch`.

## User stories

- As a shopper about to buy something online, I want to see the real refund I'd get if I returned it, so that I can factor that into my purchase decision.
- As a shopper who just bought something, I want to log the purchase and see a countdown to its return deadline, so that I don't miss the window.
- As a shopper with several open returns, I want the most urgent ones sorted to the top, so that I address the one about to expire first.
- As a shopper choosing between two retailers that sell the same item, I want to compare their return costs directly, so that the cheaper listing isn't a false economy.
- As a shopper returning something in person, I want the calculator to reflect that in-store returns are free, so that I know mailing isn't my only option.
- As a shopper who decided not to return something, I want to remove it from my tracked list, so that my list only shows what's still relevant.

## Non-functional requirements

- The app must run entirely client-side from `index.html` with no build step and no server dependency beyond serving static files.
- All computation must happen in the browser; no user data leaves the page.
- The UI must remain usable on a mobile-width viewport (single-column layout below 720px).
- Color-coded urgency states must be paired with text labels, not color alone, for accessibility.
- Added and removed tracked purchases persist only for the current page session; there is no backend or local storage layer in this prototype.

## Out of scope (for the prototype)

- Live retailer policy data or an API integration; the dataset is a hand-curated snapshot.
- User accounts, authentication, or cross-device sync.
- Browser extension packaging or checkout-page detection.
- Push, email, or SMS deadline reminders.
- Persisting tracked purchases across browser sessions.

## Open questions

- Would shoppers actually check a return-cost tool before buying, or only after a return has already gone wrong?
- Is the more valuable product the pre-purchase calculator, the post-purchase deadline tracker, or the retailer comparison, and should the roadmap prioritize one over the others?
- How often do retailers change return fees, and what would it take to keep a real dataset current without manual upkeep?
