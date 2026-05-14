# Plan: Responsive figure containment — fix overflow on every slide

Apply the *Responsive figure containment* pattern from DESIGN.md (newly added)
to every slide. Today, fixed-pixel widths in `styles.css` cause figures to
overflow the slide's safe content area (1640 × 827 px) and get clipped by
`overflow: hidden`. The pc-scatter slide is the most affected (~273 px clipped
at the bottom on every projection), but every figure-bearing slide is at risk
at non-standard projector aspect ratios.

Single serial worker — this is a global, uniform refactor of `styles.css` and
selected slide modules. Parallel workers would cause merge conflicts and
inconsistent application of the pattern.

Manager (Claude) verifies and merges per `~/.claude/skills/delegate/SKILL.md`.

---

## Goal

Every figure in the deck must fit inside the slide's safe content area at
every viewport aspect ratio without clipping.

---

## Files to touch

- `styles.css` (per-slide figure rules — all of them)
- `slides/04-pca-method.js` — the inlined SVG has fixed `width=` / `height=`
  attributes that must be removed (only `viewBox` kept) so CSS can govern.
- All other slide modules: read-only verification (no changes expected).

## Out of scope

- `:root` tokens, font system, color palette, motion settings.
- DESIGN.md (already updated).
- `shell.js`, `index.html`.
- Any image asset.
- Any slide-content edits (titles, captions stay as-is).

---

## Subtasks (single worker)

### Subtask 1 — refactor every per-slide figure rule in `styles.css`

For each per-slide block in `styles.css`, replace fixed-pixel `width:` figure
rules with the *Responsive figure containment* pattern from DESIGN.md
§"Responsive figure containment".

Slides to refactor:

| Slide                       | Asset shape (best guess)        | Preferred cap     |
|-----------------------------|----------------------------------|-------------------|
| `02-imagenet`               | scatter, near-square            | 1100 px width     |
| `03-classification`         | wide deep-net diagram (~3:1)    | 1500 px width     |
| `04-pca-method`             | wide 2-panel SVG (~2:1)         | 1500 px width     |
| `05-representations`        | medium chart                    | 1240 px width     |
| `06-nsd-schematic`          | schematic (~2:1)                | 1320 px width     |
| `07-nsd-result`             | bar chart                        | 1240 px width     |
| `08-things-schematic`       | schematic (~2:1)                | 1320 px width     |
| `09-things-result`          | bar chart                        | 1240 px width     |
| `10-things-model-comparison`| bar chart, possibly wider       | 1400 px width     |
| `11-pc-scatter`             | square scatter — **HEIGHT bound** | use `max-height: 800px` instead of width cap; let aspect drive width |

For each, use this pattern (replace `<name>` with the slide's canonical name):

```css
.<name>-slide {
  display: grid;
  grid-template-rows: auto 1fr;
}

.<name>-slide .<name>-figure {
  align-self: stretch;
  justify-self: stretch;
  display: grid;
  place-items: center;
  min-height: 0;
  margin-top: var(--figure-gap);
}

.<name>-slide .<name>-figure img,
.<name>-slide .<name>-figure svg {
  display: block;
  max-width: <cap>px;
  max-height: 100%;
  width: auto;
  height: auto;
}
```

For `pc-scatter` (square asset, height-bound):

```css
.pc-scatter-slide .pc-scatter-figure img {
  display: block;
  max-width: 100%;
  max-height: 800px;
  width: auto;
  height: auto;
}
```

The existing block of slide-1–5 rules in `styles.css` should be reorganized so
each slide has the pattern above; redundancy is fine — readability over
DRY-ness, since these are the contract between slide module and slide layout.

### Subtask 2 — strip fixed `width=` / `height=` from the inlined SVG in `slides/04-pca-method.js`

The SVG opens with:

```html
<svg xmlns:xlink="..." width="708.017187pt" height="373.494687pt" viewBox="0 0 708.017187 373.494687" ...>
```

Remove the `width="..."` and `height="..."` attributes (a previous worker
already did this — verify and re-apply if missing). Keep `viewBox` so the
intrinsic aspect ratio is preserved when CSS sizes it.

### Subtask 3 — bespoke-layout slides (01-title, 12-takeaway, 13-thanks)

Audit each:

- **01-title** — the QR placeholder is `width: 140px; height: 140px;`. Wrap in
  `min-height: 0` parent if not already. Author block, venue, title h1 — these
  are text and naturally responsive; no figure containment needed.
- **12-takeaway** — `place-items: center; .hero-sentence` is text. Add
  `min-height: 0` to `.takeaway-slide` if it doesn't have it. No figure to
  contain.
- **13-thanks** — team-grid placeholders are `200×200`. They sit in a 2×2 grid
  at column 1 with 40 px row gap, ~520 px wide. At maximum height
  `2 * 200 + 1 * 40 = 440 px` which fits comfortably in the slide.
  Confirm `min-height: 0` on the team-grid container so it can shrink in 1fr
  rows. If `.thanks-slide`'s grid template is not grid-row-bounded, no change
  needed.

For all three: when team-card placeholders or QR code are eventually replaced
with `<img>`, the same `max-width: 100%; max-height: 100%; width: auto;
height: auto` pattern applies inside the placeholder container.

---

## Acceptance

After the worker commits and you merge:

1. `styles.css` syntactically valid — equal `{` and `}` counts.
2. Every figure-bearing slide (02–11) uses the *Responsive figure containment*
   pattern with no remaining `.figure { width: <fixed>px; }` declarations.
3. `slides/04-pca-method.js` SVG has no `width=` / `height=` attributes on the
   root `<svg>`.
4. Manager smoke-tests in browser at `http://localhost:8000`:
   - Step through 01 → 13.
   - Resize browser window to a few aspects (16:9, 16:10, 4:3, ultra-wide).
   - Confirm no figure is clipped at any aspect.
   - Confirm pc-scatter (slide 11) is no longer clipped at the bottom.
   - Confirm titles still sit high; spatial rhythm is preserved.

---

## Verification (worker runs before committing)

```bash
python -c "s=open('styles.css').read(); assert s.count('{')==s.count('}'), 'brace mismatch'; print('OK')"
```

Then visually re-read styles.css and confirm:

- Every `.<name>-slide` block uses `grid-template-rows: auto 1fr`.
- Every `.<name>-figure` block has `min-height: 0` and `place-items: center`
  (or `justify-self: stretch; align-self: stretch` and `display: grid`).
- Every `.<name>-figure img` or `svg` has `max-width: <cap>; max-height: 100%`
  with `width: auto; height: auto`. NO declarations of `.figure img { width:
  100%; }` remain.

Worker commit message:

```
Apply responsive figure containment to all slides (DESIGN.md v2.1)
```
