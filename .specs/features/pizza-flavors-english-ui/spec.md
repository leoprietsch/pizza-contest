# Pizza Flavors + English UI Specification

## Problem Statement

The app is currently designed for a fixed set of 10 named individuals organised into 5 duos. The
contest has evolved: the unit being judged is now a **pizza flavor** (4 flavors), not a duo. Each
person who prepared a flavor selects their own flavor to identify themselves, then rates the other
three. In addition, all UI text is in Brazilian Portuguese and must be translated to English.

## Goals

- [ ] Replace the hard-coded reviewers/duos model with 4 pizza flavors: Pepperoni, Margherita, Bacon, Vegetarian.
- [ ] User selects which pizza flavor they prepared instead of selecting their name.
- [ ] The selected flavor is blocked from self-rating (same pattern as own-duo block today).
- [ ] All visible UI text — labels, buttons, headings, error messages, and descriptions — is in English.

## Out of Scope

| Feature | Reason |
| --- | --- |
| Persistence across server restarts | Existing in-memory model kept as-is |
| Authentication / admin password | Not requested |
| Adding or removing pizza flavors dynamically | Hard-coded list is sufficient for this contest |
| Changing the rating criteria (creativity, appearance, taste) | Criteria labels change language only |
| Changing the 0–5 half-pizza rating widget | Visual behavior unchanged |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --- | --- | --- | --- |
| One submission per flavor (not per person) | Each flavor can only be submitted once, matching current one-per-name rule | The flavor represents the cook(s) who prepared it; one vote per flavor is the fairest equivalent | n |
| "QUEM É VOCÊ?" modal becomes "WHO ARE YOU?" / flavor selector | Modal header updated; prompt becomes "Select the pizza flavor you prepared" | Direct equivalent of the name selection flow | n |
| Flavor names used verbatim as identifiers | Pepperoni, Margherita, Bacon, Vegetarian are both display name and key | Simplest approach; no slug mapping needed | n |
| Admin page language also translated to English | Yes — "all UI" includes /admin | Feature 2 explicitly says "all UI" | n |
| Admin page references "Flavor" not "Duo"/"Pair" | Leaderboard columns and copy updated to say "Flavor" | Consistent with the domain change | n |
| layout.tsx metadata description updated to English | Yes | Small, natural scope of the UI translation task | n |

**Open questions:** none — all resolved or logged above.

---

## User Stories

### P1: Replace reviewers/duos with pizza flavors ⭐ MVP

**User Story**: As a contest participant, I want to select the pizza flavor I prepared so that I can submit ratings for the other three flavors without rating my own.

**Why P1**: Core domain change — the app is non-functional for the new contest format without it.

**Acceptance Criteria**:

1. The system SHALL expose exactly four selectable options: Pepperoni, Margherita, Bacon, Vegetarian.
2. WHEN a user opens the app THEN the system SHALL display a flavor-selection modal listing the four pizza flavors.
3. WHEN a user selects a flavor that has already been submitted THEN the system SHALL disable that option and display a lock icon next to it.
4. WHEN a user selects their flavor and proceeds THEN the system SHALL display rating sections for the other three flavors only.
5. WHILE a user's own flavor section would appear THEN the system SHALL hide/dim it and label it as blocked from rating.
6. WHEN a review is submitted with `flavor` set to a value already in `completedFlavorsStore` THEN the system SHALL return HTTP 403 and an English error message.
7. IF a POST /api/reviews body includes a rating for the submitter's own flavor THEN the system SHALL strip that entry server-side before saving.
8. WHEN a review is successfully submitted THEN the system SHALL add the flavor to `completedFlavorsStore` and return HTTP 200.
9. The system SHALL compute the leaderboard across the four flavors (not duos/pairs) using the existing average-calculation logic.

**Independent Test**: Select "Bacon", verify only Pepperoni/Margherita/Vegetarian are rateable, submit, verify Bacon is now locked for future visitors.

---

### P2: Translate all UI text to English ⭐ MVP

**User Story**: As a contest participant or admin, I want to see all interface text in English so that the app is understandable to everyone at the contest.

**Why P2**: Explicitly requested; treated as MVP alongside P1.

**Acceptance Criteria**:

1. The system SHALL display all headings, labels, buttons, and status messages on `/` in English.
2. The system SHALL display all headings, labels, buttons, and status messages on `/admin` in English.
3. WHEN a flavor has already been submitted and an attempt is made to submit again THEN the system SHALL display the duplicate-submission error message in English.
4. WHEN a review is successfully submitted THEN the system SHALL show the thank-you message in English.
5. WHEN the admin page is loading THEN the system SHALL show the loading indicator text in English.
6. The system SHALL update `layout.tsx` metadata description to English.

**Independent Test**: Load `/` and `/admin`; all visible text is in English; no Portuguese strings remain.

---

## Edge Cases

- IF a POST /api/reviews arrives with an unrecognised `flavor` value (not one of the four) THEN the system SHALL return HTTP 400.
- IF a POST /api/reviews body is missing the `flavor` field THEN the system SHALL return HTTP 400 with an English error message.
- WHEN all four flavors have submitted THEN the system SHALL unlock the "Reveal Champion" button on `/admin`.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| PIZZA-01 | P1: Flavors — four options exposed | Execute | Verified |
| PIZZA-02 | P1: Flavors — modal lists four flavors | Execute | Verified |
| PIZZA-03 | P1: Flavors — already-submitted flavor locked | Execute | Verified |
| PIZZA-04 | P1: Flavors — own flavor blocked from rating | Execute | Verified |
| PIZZA-05 | P1: Flavors — own flavor stripped server-side | Execute | Verified |
| PIZZA-06 | P1: Flavors — 403 on duplicate submission | Execute | Verified |
| PIZZA-07 | P1: Flavors — flavor added to store on success | Execute | Verified |
| PIZZA-08 | P1: Flavors — leaderboard computed over four flavors | Execute | Verified |
| PIZZA-09 | P2: English — all `/` UI text in English | Execute | Verified |
| PIZZA-10 | P2: English — all `/admin` UI text in English | Execute | Verified |
| PIZZA-11 | P2: English — error messages in English | Execute | Verified |
| PIZZA-12 | P2: English — metadata description in English | Execute | Verified |
| PIZZA-13 | Edge — unknown flavor → 400 | Execute | Verified |
| PIZZA-14 | Edge — missing flavor field → 400 | Execute | Verified |
| PIZZA-15 | Edge — all four submitted → Reveal Champion unlocked | Execute | Verified |

---

## Success Criteria

- [ ] Selecting a flavor and rating the other three works end-to-end; own flavor is blocked.
- [ ] A duplicate submission returns a 403 with an English error message visible in the UI.
- [ ] Admin leaderboard shows four flavor rows with correct averages.
- [ ] Zero Portuguese strings remain in any page, component, or server error response visible to a user.
