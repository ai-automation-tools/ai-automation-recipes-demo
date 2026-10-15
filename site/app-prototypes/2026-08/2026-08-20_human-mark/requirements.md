# HumanMark — Requirements

## Goals

- Let a user paste a draft and get an immediate, itemized breakdown of AI-tell phrasing rather than a single opaque score.
- Make the certify step feel earned — a certificate only issues once flagged patterns are addressed or the score clears a stated threshold.
- Make a certificate checkable by someone other than the person who issued it.
- Demonstrate the full loop (scan → fix → certify → verify) in one sitting, with no login.

## Primary user

A newsletter writer or small brand's content lead who has had a reader or client ask "did you write this or did AI?" and wants a way to check a draft before publishing, and a way to point to something after the fact.

## Functional requirements

- FR1: The scanner accepts pasted or typed text in a textarea with no minimum length enforced below a small floor (20 words) needed for a meaningful score.
- FR2: A "Load a sample draft" control fills the textarea with one of at least three preset drafts of varying AI-tell density, so the flow is demonstrable without a paste.
- FR3: Scanning runs entirely in the browser against a defined pattern library; no text leaves the page.
- FR4: The scanner detects at minimum seven categories: promotional language, vague attribution, rule-of-three padding, inflated significance/legacy language, filler and hedging phrases, negative parallelism ("it's not just X, it's Y"), and em dash overuse (rate per 100 words above a set threshold).
- FR5: Each detected match is shown inline in the draft text (highlighted) and listed in a results panel with its category label and the exact matched phrase.
- FR6: An overall AI-tell score (0–100, lower is more human) is computed from a weighted count of matches per 100 words, and shown with a pass/fail line against a certification threshold (score < 25).
- FR7: When the score passes, an "Issue Human-Made Certificate" control becomes available; when it fails, the control is disabled with a note on how many points/matches stand between the draft and passing.
- FR8: Issuing a certificate generates a certificate record (ID, title, score, issue date, issuer name) and adds it to the in-session certificate registry.
- FR9: A Certificates view lists all certificates (seeded sample data plus any issued this session), sortable by score and by date.
- FR10: A certificate detail shows an embeddable badge snippet (copyable HTML) referencing the certificate ID.
- FR11: A verification lookup accepts a certificate ID and returns the matching record's issuer, score, and issue date, or a clear "not found" state.
- FR12: The pattern library and thresholds are defined in one place in `script.js` so categories/weights are easy to see and adjust.
- FR13: The app runs from `file://` with no build step and no network calls other than loading `sample-data.json`.

## User stories

- As a newsletter writer, I want to paste my draft before I hit send, so that I can catch phrasing that reads as AI-written before a reader does.
- As a small brand's content lead, I want to see exactly which phrases got flagged and why, so that I can fix the draft instead of guessing at a score.
- As a content lead, I want to issue a certificate once a piece passes, so that I have something to point to if a client or reader questions it.
- As a reader or client, I want to look up a certificate ID, so that I can confirm a piece was actually certified and not just claimed to be.
- As an agency account manager, I want to browse past certificates across pieces, so that I can see which clients' content is trending toward more or fewer AI tells over time.

## Non-functional requirements

- No text pasted into the scanner is transmitted anywhere; all matching runs client-side.
- The app is usable on a phone-width viewport (scanner, results, and certificate views all reflow).
- Certificate IDs are generated deterministically enough within a session to be looked up immediately after issuance, but are treated as opaque strings by the UI.
- No external accounts, API keys, or authentication of any kind.

## Out of scope (for the prototype)

- A real machine-learned AI-detection classifier — this prototype uses a transparent pattern library, not a trained model.
- Persistent storage across sessions or across browsers — certificates issued in one session don't survive a reload.
- Real badge hosting or a publicly resolvable verification URL — verification here is a lookup against the local sample data plus session-issued certificates.
- Payment, accounts, or team/seat management.

## Open questions

- Will creators pay for a certificate directly, or does this only work bundled into a tool they already pay for (a CMS, a scheduling tool, an agency platform)?
- Does a pattern-matching scanner catch enough real AI phrasing to be trustworthy, or does it need a trained classifier before anyone would rely on the score?
- Who is the certificate actually for — the audience reading it, or the client paying the agency that issues it?
