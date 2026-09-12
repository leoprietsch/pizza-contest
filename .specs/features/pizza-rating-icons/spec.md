# Pizza Rating Icons

## Problem Statement

The review form currently uses star icons (from lucide-react) as the rating widget. This contest is about pizza, so replacing the star symbols with pizza icons makes the UI more thematic and fun without altering any underlying rating logic or data structures.

## Overview

Replace the star rating widget in the review form with 5 pizza icons. The rating scale, value range, and all existing behavior (half-unit selection, own-duo lock, form validation, API payload) stay unchanged — only the visual symbol changes from ⭐ to 🍕.

## User Stories

- As a reviewer, when I open the app, I see 5 pizza icons instead of 5 stars in each rating bar so that the UI matches the pizza contest theme.
- As a reviewer, when I tap the left half of a pizza icon, I select a half-pizza rating, so I can give fractional scores as before.
- As a reviewer, when I tap the right half of a pizza icon, I select a whole-number rating, so full scores still work.

## Requirements

### R-01 — Pizza icons replace stars in the rating widget

WHEN a reviewer opens the app and views any rateable duo,
THEN each of the three rating bars (CRIATIVIDADE, APARÊNCIA, SABOR) displays 5 pizza icons instead of 5 star icons.

**Acceptance Criteria:**

- AC-01.1: Each rating bar renders exactly 5 pizza-shaped icons per category.
- AC-01.2: No `Star` (lucide-react) icon appears inside any rating bar.
- AC-01.3: The pizza icon is rendered as an inline SVG (no new npm dependency required).

### R-02 — Fill behavior mirrors the former star fill behavior

WHEN a reviewer clicks or taps a pizza icon position,
THEN the selected pizza (and all to its left) appear filled/highlighted, and unselected pizzas to the right appear as unfilled outlines — identical visual semantics to the former star rating.

**Acceptance Criteria:**

- AC-02.1: Selecting a full value (1–5) fills the corresponding pizza icon completely.
- AC-02.2: Selecting a half value (0.5–4.5) fills the left half of the corresponding pizza icon and leaves the right half unfilled.
- AC-02.3: All pizza icons to the left of the selected position are fully filled.
- AC-02.4: All pizza icons to the right of the selected position are unfilled outlines.
- AC-02.5: The left-half / right-half click zones remain functional (left click = half value, right click = whole value).

### R-03 — Rating values and downstream behavior are unchanged

WHEN a reviewer submits the form after rating with pizza icons,
THEN the payload sent to `POST /api/reviews` contains the same numeric rating values (integers and halves) as before, and the server accepts and stores them without modification.

**Acceptance Criteria:**

- AC-03.1: `handleRate` stores a numeric value in `ratings[pair][category]` identical to the value produced by the former star widget for the same click position.
- AC-03.2: The submitted JSON payload shape `{ reviewer, reviews: Record<string, CategoryRating> }` is unchanged.
- AC-03.3: Form validation (`isFormInvalid`) continues to block submission when any category of any rateable duo is still at `0`.

### R-04 — Color and visual style are consistent with the app's theme

WHEN the pizza icons are rendered,
THEN their filled state uses the app's existing accent color (`#E26F56`) and their outline state uses the existing dark token (`#2B100D`), matching the former star color scheme.

**Acceptance Criteria:**

- AC-04.1: Filled pizza icons use fill color `#E26F56`.
- AC-04.2: Unfilled pizza icons render as outlines in color `#2B100D` with no fill.

## Out of Scope

- Changes to `store.ts`, API routes (`/api/reviews`, `/api/admin`), or the admin dashboard (`/admin`).
- Replacing the `⭐` emoji text in the admin standings table — that is a text character, not the lucide Star component.
- Adding persistence or changing the data model.
- Any new npm packages or icon libraries.

## Assumptions & Open Questions

- **Assumed:** Half-pizza ratings are preserved. The split click-zone mechanism (left half = `starIndex - 0.5`, right half = `starIndex`) is kept with only the icon changed.
- **Assumed:** A custom inline SVG pizza icon is acceptable — no new npm package is needed.
- **Assumed:** The icon size matches the existing star sizes (`w-7 h-7` / `w-8 h-8` responsive classes).
- **Assumed:** The `Star` lucide-react import in `page.tsx` can be removed once the rating widget no longer uses it (other icons like `CheckCircle2`, `User`, `Lock` from lucide-react remain).

## Requirement Traceability

| Requirement | Acceptance Criteria | Implemented In |
|---|---|---|
| R-01 | AC-01.1, AC-01.2, AC-01.3 | `src/app/page.tsx` — rating bar render block |
| R-02 | AC-02.1–AC-02.5 | `src/app/page.tsx` — fill logic + click zones |
| R-03 | AC-03.1–AC-03.3 | `src/app/page.tsx` — `handleRate`, `handleSubmit`, `isFormInvalid` |
| R-04 | AC-04.1, AC-04.2 | `src/app/page.tsx` — SVG fill/stroke color props |
