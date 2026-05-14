# Plan: Visual overhaul v1 — projection-grade integration

Apply the revised `DESIGN.md` (projection principles, tighter rhythm, figure
integration via `mix-blend-mode: multiply`, per-slide overrides in `styles.css`).
Refine each slide for a conference-projection setting.

Two sequential phases:

1. **Phase A (serial, 1 worker):** rewrite `styles.css` to apply the new global
   visual layer.
2. **Phase B (parallel, 7 workers):** each worker takes 2 slides (last takes 1),
   refines per-slide layout in `styles.css` (slide-class-scoped) and slide-module
   markup.

Manager (Claude) verifies and merges per `~/.claude/skills/delegate/SKILL.md`.

---

## Phase A — global styles overhaul (serial, 1 worker)

### Subtask A1 — `styles.css`: apply DESIGN.md v2

**Files touched:** `styles.css` only.

**Required changes:**

1. **Add the new spatial-rhythm tokens** to `:root`:
   `--pad-top: 56px; --pad-side: 140px; --pad-bottom: 64px;
    --title-rule-gap: 20px; --figure-gap: 24px;`
2. **Replace `.slide` padding** to use the new tokens:
   `padding: var(--pad-top) var(--pad-side) var(--pad-bottom);`
3. **Replace `.slide > h1::after` margin-top** with `var(--title-rule-gap)`.
4. **Add `isolation: isolate` to `.slide`** so blend modes don't leak to the
   footer or sibling slides during transitions.
5. **Add the global figure-blending rule:**
   ```css
   .slide figure img,
   .slide figure svg,
   .slide figure { mix-blend-mode: multiply; }
   ```
   Captions inside `<figure>` must NOT blend — exempt them:
   ```css
   .slide figure figcaption { mix-blend-mode: normal; }
   ```
6. **Update existing per-slide figure rules** (slides 1–5) to use the new
   `--figure-gap` token in place of hardcoded `margin-top: 38px`.
7. **Add per-slide layout rules for slides 06–13** — for each new slide
   (`nsd-schematic`, `nsd-result`, `things-schematic`, `things-result`,
   `things-model-comparison`, `pc-scatter`, `takeaway` already styled,
   `thanks` already styled), add:
   ```css
   .<name>-slide {
     display: grid;
     grid-template-rows: auto 1fr;
   }
   .<name>-slide .<name>-figure {
     align-self: center;
     justify-self: center;
     margin-top: var(--figure-gap);
   }
   .<name>-slide .<name>-figure img {
     display: block;
     width: 100%;
     height: auto;
   }
   ```
   Pick a width per asset by aspect ratio (1000–1320 px range; see DESIGN.md
   §"Picking figure widths per slide"). For now use **1180px** as a default for
   schematic-style PNGs and **1240px** for results SVGs; per-slide workers in
   Phase B may refine.
8. **Do not change** the title-slide, takeaway-slide, or thanks-slide bespoke
   rules in this subtask — they are already custom and Phase-B workers will
   refine them.
9. **Do not change** color tokens, font tokens, or any chart accent values.

**Acceptance:**
- The browser at `http://localhost:8000` loads without console errors.
- Slides 1–5 still render; figures now sit closer to the title and have no
  visible white bounding box (white SVG bg blends into paper).
- Slides 6–11 render with their assets correctly sized (no overflow, no crop).
- Footer strip is unaffected (no blending leak).

---

## Phase B — per-slide refinement (parallel, 7 workers)

Each worker takes a slide pair (or single, for W7) and refines:

- The slide module's HTML to use `<section class="slide <name>-slide">` and
  `<figure class="<name>-figure"><img …><figcaption …/></figure>`.
- **Remove all `style="..."` attributes from the slide module.** Any sizing/layout
  goes into `styles.css` under the slide-specific class.
- Add or tighten per-slide layout in `styles.css` ONLY for the slides the worker
  owns (do not touch other slides' rules). If Phase A already added a rule for
  the worker's slide, the worker may refine it (figure width, grid arrangement,
  caption position) but must not delete other slides' rules.
- Add a one-line caption that *describes the figure* in the audience's terms
  (not a placeholder like "Figure 1"). Captions are short and concrete.

**Parallelism note:** all 7 workers touch `styles.css`. To avoid merge conflicts,
each worker only edits CSS rules whose selector starts with `.<their-slide>-slide`
(or `.<their-slide>-figure`). They must not touch the `:root` block, the global
`.slide` block, or any other slide's rules. Manager will merge sequentially and
fall back to manual conflict resolution if any worker oversteps.

### Pair assignments

| Worker | Slides                                   |
|--------|------------------------------------------|
| W1     | `01-title.js`, `02-imagenet.js`          |
| W2     | `03-classification.js`, `04-pca-method.js` |
| W3     | `05-representations.js`, `06-nsd-schematic.js` |
| W4     | `07-nsd-result.js`, `08-things-schematic.js` |
| W5     | `09-things-result.js`, `10-things-model-comparison.js` |
| W6     | `11-pc-scatter.js`, `12-takeaway.js`     |
| W7     | `13-thanks.js`                           |

### Per-pair acceptance

For each worker:
- Both slide modules render in the browser without errors.
- Both slides' figures sit in the new tighter spatial rhythm (titles high,
  figures close to title).
- White bg from SVG/PNG assets is no longer visible.
- No inline `style=""` attributes remain in the slide modules.
- Captions are descriptive one-liners, not placeholders.

---

## Out of scope

- Changes to `shell.js`, `index.html`, font choice, color tokens.
- Animations beyond the existing step-reveal and slide-transition machinery.
- Edits to image assets (no SVG editing — rely on `mix-blend-mode`).
- Changes to slide content/text beyond captions and the title placeholder strings
  (user will rewrite final copy later).

---

## Verification (manager runs after Phase B merges)

```
node --check shell.js
for f in slides/*.js; do node --check "$f"; done
```

Then load `http://localhost:8000`, step through 1→13, confirm:
- titles all sit at the same y-coordinate (top of slide, not floating mid-page)
- no white panels around figures
- no horizontal/vertical overflow
- footer + slide number visible on every slide
