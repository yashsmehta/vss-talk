# VSS26 HTML Slide Deck — Delegation Plan (Showcase v1)

## Goal

Stand up the deck architecture per `deck-spec.md` with a polished visual system per
`DESIGN.md`, demonstrated by 4 representative slides drawn from `VSS26 Talk.pdf`.
Real figure PNGs will be added by the user afterward; all images are rendered as
labelled placeholder boxes that the user swaps for `assets/<name>.png` later.

This is intentionally a **showcase / vertical slice**, not the full 16-slide deck.
The aim is to nail the look-and-feel on a few slides; remaining slides can be added
later by dropping new files in `slides/` and registering them in `shell.js`.

## Showcase slides (4)

| # | File | Source | Purpose | Steps |
|---|---|---|---|---|
| 01 | `slides/01-title.js` | PDF p.1 | Anchors the aesthetic: large Fraunces title, author, lab, date, venue, QR placeholder | 0 |
| 02 | `slides/02-alignment.js` | PDF p.9–12 | Demonstrates the step-reveal system: 4 reveals on a single chart (untrained → 1000-class → 2-class coarse → all coarse) | 4 |
| 03 | `slides/03-takeaway.js` | PDF p.18 | Single hero sentence; demonstrates pure typographic minimalism | 0 |
| 04 | `slides/04-thanks.js` | PDF p.19 | Team grid (photo placeholders) + bonnerlab.org + "Thank you" treatment | 0 |

## Files to touch (one worker, one worktree)

- `index.html` — deck-spec shell, plus the Google Fonts `<link>` for Fraunces + Geist
  (see DESIGN.md "Fonts" section).
- `shell.js` — deck-spec shell logic verbatim. `SLIDES` array contains exactly the 4
  filenames above. Style the existing `#progress` element per DESIGN.md (slide number
  in the footer strip).
- `styles.css` — implements **DESIGN.md** tokens, type scale, layout, motion, and the
  `.placeholder` system. Overrides the example styles in deck-spec.
- `slides/01-title.js` … `slides/04-thanks.js` — content per the table above, using
  the classes and tokens defined by DESIGN.md (no per-slide colors or fonts).
- `assets/.gitkeep` — empty file so the folder exists for the user to drop PNGs into.

## Single subtask (one Copilot, no parallelism)

The scope is small enough that splitting across workers buys nothing and risks visual
incoherence (different workers might interpret DESIGN.md differently). One worker.

**Acceptance criteria:**

1. `node --check` succeeds on `shell.js` and every file in `slides/`.
2. Loading `index.html` via `python -m http.server` (manual manager check) shows:
   - Slide 1 with Fraunces title, author block, footer strip, slide number "01 / 04".
   - Right-arrow advances to slide 2.
   - On slide 2, right-arrow reveals each of the 4 alignment steps one at a time
     before advancing to slide 3.
   - Slides 3 and 4 render with consistent type and footer.
   - `F` toggles fullscreen.
3. No slide hard-codes colors, fonts, or font-sizes; everything comes from the
   tokens / utility classes defined in `styles.css`.
4. All figure regions are `.placeholder` boxes with `data-name` attributes —
   no real chart fabrication.

## Out of scope (deferred until user signs off on aesthetic)

- The other 12 slides from the PDF.
- Real chart data, inline SVG plots, or D3.
- Speaker notes, presenter view, two-screen mode.
- Accessibility audit beyond semantic `<section>` / `<h1>`.

## Verification

No test framework exists. Worker runs:

```bash
node --check shell.js && for f in slides/*.js; do node --check "$f"; done
```

Manager additionally:
- Reads the full diff against `master`.
- Serves the deck locally and walks through the 4 slides + steps to confirm the
  visual treatment matches DESIGN.md.
