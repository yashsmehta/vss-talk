# VSS26 Talk Deck — Project Guide

A self-contained HTML slide deck for Yash Mehta's VSS 2026 talk
*"An extremely coarse feedback signal for learning human-aligned visual representations"*
(Bonner Lab · Cognitive Science · 18 May 2026).

This file is the single source of truth for any future session working on this deck.
The visual system is detailed in `DESIGN.md`; everything else lives here. `plan.md` is
a historical artifact of the showcase-v1 build and can be ignored.

---

## How to work in this repo

- Treat this file as the repo guide for future Codex/Codex/Copilot sessions.
- **Never invent slide content.** The user dictates which slides exist, in what order,
  with what text and which images. See `## Slide sequence` below.
- Keep edits scoped. The deck has many generated/inline SVG blocks; avoid formatting
  churn inside those blocks unless the chart itself is being changed.
- The git remote should be:
  `origin https://github.com/yashsmehta/vss-talk`

---

## Layout

```
vss26/
├── AGENTS.md                  # this file — project guide for any session (auto-detected by Copilot CLI and Codex)
├── DESIGN.md                  # visual system (tokens, type scale, motion)
├── plan.md                    # historical: original showcase-v1 delegation plan
├── index.html                 # shell: stage + footer strip + font links
├── shell.js                   # shell logic: keyboard, transitions, step reveals
├── styles.css                 # implements DESIGN.md tokens and layouts
├── slides/                    # one ES module per slide
│   ├── 01-title.js
│   ├── 02-brain-predictivity.js   # available but not wired into shell.js
│   ├── 03-imagenet.js
│   ├── ...
│   └── 14-thanks.js
├── images/                    # user-supplied figure assets (PNG / SVG)
└── assets/                    # legacy/unused placeholder folder
```

---

## Architecture

- Static HTML shell, no bundler, no build step.
- Each slide is an ES module at `slides/NN-name.js` that default-exports
  `{ html, steps?, onEnter?, onStep?, onLeave? }`.
- The shell imports them via dynamic `import()` and renders the `html` string into a
  `<section>` wrapper. No slide pre-loading.
- Slides are authored at logical 1920×1080 px. `shell.js` computes a uniform scale
  + centering offsets (`--slide-scale`, `--slide-offset-x/y`) from the viewport on
  load and `resize`. Aspect ratio is preserved on any monitor.
- **Adding a slide:** drop a new file in `slides/`, then add its name (without `.js`)
  to the `SLIDES` array in `shell.js`. That's the entire workflow.
- **Figure slides** (any "title + figure" slide — most of the deck): use
  `<section class="slide figure-slide" style="--fig-max-w: NNNpx">` with a single
  `<figure>` containing one `<img>`, `<svg>`, or `<div class="svg-wrap">…</div>`.
  The shared `.figure-slide` rule handles layout, centering, and capping the figure
  width. Default `--fig-max-w` is `1500px`. Add `--fig-w: 100%` for a full-bleed
  figure. Anything more bespoke (overlay labels, multi-panel grids) goes in its own
  scoped rule keyed off a slide-specific class.
- **Step reveals:** mark elements with `class="step step-N"`. The shell automatically
  applies `.revealed` to all `.step-N` elements when the user advances to step N.
  Set `steps: <count>` on the module to enable.
- **Controls:** → / Space / PageDown = advance step or slide; ← / PageUp = back;
  Home / End = jump; F = fullscreen; B = blackout; Esc = exit fullscreen.

---

## Visual system (summary; full spec in `DESIGN.md`)

- **Theme:** light "paper" — `--paper #FAF8F3` background, `--ink #1A1A17` text.
- **Typography:** Fraunces (display serif) for `h1`; Geist (sans) for body. No Inter,
  Roboto, or system fonts in the primary chain. Loaded via Google Fonts in
  `index.html`.
- **Chart accent palette:** `--orange #E8943D`, `--teal #4FA08B`, `--blue #3B6EAA`,
  `--red #C44545`, `--purple #8C6AB7` — lifted from the original PDF.
- **Motion:** 480ms slide transitions, 380ms step reveals, eased with
  `cubic-bezier(.2, .7, .2, 1)`. Subtle horizontal translate + opacity. No bounce,
  no scale, no parallax.
- **Layout:** slides authored at logical 1920×1080 px, scaled by CSS to fit any
  viewport. Standard slide padding comes from CSS variables:
  `--pad-top: 56px`, `--pad-side: 140px`, `--pad-bottom: 64px`. Title block
  top-left, hairline rule under it (`--rule`), figure area below. Bottom footer strip
  (`#footer-strip`) has `"COARSE FEEDBACK · VSS 2026"` left and slide counter right.
- **All style decisions live in `styles.css` via CSS variables.** Slide modules must
  not define their own colors, fonts, or px-precise font sizes — only layout-specific
  rules (grid columns, figure positioning).

---

## Working with images

The user maintains figure assets in `images/` and may use any format.

- **PNG:** photos, brain renders, dataset thumbnails, the QR code. Reference via
  `<img src="images/foo.png">`. One line, done.
- **SVG (as `<img>`):** crisp, scalable, but treated as a single opaque image.
  Reference via `<img src="images/foo.svg">`.
- **SVG (inlined):** paste the `<svg>…</svg>` markup directly into the slide's `html`
  string. Required for **step-by-step reveals on individual chart elements** (e.g.
  bars appearing one at a time). Add `class="step step-N"` to the `<rect>`, `<g>`,
  `<circle>`, etc. that should appear at step N. The shell handles the rest.
- **PDF:** never use as a slide asset. Convert to SVG first (`inkscape foo.pdf
  --export-type=svg` or `pdftocairo -svg foo.pdf`).

### Image inventory

Files currently in `images/`. Some are active in the current slide sequence, while
others are retained as source/alternate assets.

| File | Format | Likely use |
|---|---|---|
| `qr-code.svg` | SVG | QR linking to author website |
| `arxiv-qr.svg` | SVG | QR linking to arXiv preprint |
| `imagenet_1000.svg` | SVG | ImageNet 1000-class scatter |
| `pca_method.svg` | SVG | PCA-based binary split schematic |
| `pc_scatter.svg` | SVG | PC-coloured scatter source/alternate |
| `pc_scatter_panel_1.svg` | SVG | PC scatter panel: behavior |
| `pc_scatter_panel_2.svg` | SVG | PC scatter panel: AlexNet |
| `pc_scatter_panel_3.svg` | SVG | PC scatter panel: coarse/CLIP CNN |
| `deep-neural-network-classification.png` | PNG | ANN architecture diagram |
| `representations.svg` | SVG | Internal-representation visualisation |
| `nsd_description.png` | PNG | NSD methods schematic |
| `nsd_results.svg` | SVG | NSD RSA results across granularity |
| `things-schematic.png` | PNG | THINGS database overview |
| `rsa_schematic_behavioral.svg` | SVG | Behavioural RSA pipeline |
| `rsa_schematic_model.svg` | SVG | Model RSA pipeline |
| `things_coarse_results.svg` | SVG | THINGS alignment results (likely build-up) |
| `things_model_comparison.svg` | SVG | Comparison vs. pretrained models |
| `jhu-wordmark.svg` | SVG | Title-slide institutional mark |
| `images/team/*` | JPG | Thanks-slide team portraits |

Do not add an image to a slide unless the user asks for that content or the image is
already clearly part of the slide's existing design.

---

## Slide sequence

| # | File | Content | Images |
|---|---|---|---|
| 1 | `01-title.js` | Title, author, QR, JHU wordmark | `qr-code.svg`, `jhu-wordmark.svg` |
| 2 | `03-imagenet.js` | Fine-grained ImageNet feedback | `imagenet_1000.svg` |
| 3 | `04-pca-method.js` | Coarsening feedback via PCA splits | inline SVG |
| 4 | `05-representations.js` | Coarse training yields categorical representations | `representations.svg` |
| 5 | `06-nsd-schematic.js` | Natural Scenes Dataset overview | `nsd_description.png` |
| 6 | `08-nsd-result.js` | Neural alignment results | inline SVG |
| 7 | `09-things-schematic.js` | THINGS database overview | `things-schematic.png` |
| 8 | `10-things-result.js` | Human behavioral alignment | inline SVG |
| 9 | `11-things-model-comparison.js` | Comparison with pretrained models | inline SVG |
| 10 | `12-pc-scatter.js` | Internal representations, three panels | `pc_scatter_panel_*.svg` |
| 11 | `13-takeaway.js` | Takeaway sentence | — |
| 12 | `14-thanks.js` | Thanks, team portraits, preprint QR | `images/team/*`, `arxiv-qr.svg` |

`slides/02-brain-predictivity.js` exists as an available slide module but is not in
the active `SLIDES` array in `shell.js`.

---

## Current state

- **Built:** 12 active slides are wired in `shell.js`; all use real assets or inline
  SVG charts.
- **Live:** `python3 -m http.server 8000` in the repo root, then
  `http://localhost:8000`.
- Most slides use the shared `.figure-slide` pattern. Bespoke per-slide CSS exists
  for title, NSD schematic, RSA, NSD result, THINGS result, model comparison, PC
  scatter, takeaway, and thanks.

---

## Animation patterns

Use these when a slide needs stepped reveals beyond plain text fade-in.

**1. Plain text/shape reveal (no JS).** Add `class="step step-N"` to anything that
should appear at step N. The shell adds `.revealed` automatically.

```html
<p class="step step-1">First claim.</p>
<p class="step step-2">Second claim.</p>
```

**2. SVG chart bars one at a time.** Paste the chart's `<svg>` markup directly into
the slide's `html`. Tag each bar:

```html
<svg viewBox="0 0 600 400">
  <rect class="bar step step-1" x="50"  y="200" width="80" height="180" fill="var(--orange)"/>
  <rect class="bar step step-2" x="160" y="120" width="80" height="260" fill="var(--orange)"/>
</svg>
<style>
  .bar { transform-origin: bottom; transform: scaleY(0); }
  .bar.revealed { transform: scaleY(1); transition: transform 600ms var(--ease); }
</style>
```

**3. matplotlib → animatable SVG.** When generating charts:

```python
fig, ax = plt.subplots()
bars = ax.bar(['A', 'B', 'C'], [3, 7, 5])
for i, bar in enumerate(bars):
    bar.set_gid(f'bar-{i+1}')   # clean SVG id per bar
plt.savefig('fig.svg')
```

Then in the output SVG, find `id="bar-1"`, add `class="step step-1"`, repeat.

**4. Crossfading two images.**

```html
<div class="overlay-stack">
  <img src="images/before.png" class="layer">
  <img src="images/after.png"  class="layer step step-1">
</div>
<style>
  .overlay-stack { position: relative; }
  .layer { position: absolute; inset: 0; }
</style>
```

**5. Custom JS (D3, anime.js, etc.).** Use the module's `onEnter(root)` to set up and
`onStep(root, step)` to drive frames. Import ESM CDN deps inline so no build step is
needed:

```js
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
```

---

## Don'ts

- Don't put `<html>`, `<head>`, or `<body>` tags inside slide files. Slides are
  HTML fragments.
- Don't use `<form>` elements in slides — they intercept Enter keypresses.
- Don't preload slides. The lazy `import()` is intentional.
- Don't animate via `style.left` or similar. Toggle CSS classes; let transitions
  handle it.
- Don't use viewport units (`vw`, `vh`) inside slide markup. Use px at the 1920×1080
  logical scale.
- Don't reload the page during presenting — all state is in memory.
- Don't hardcode colors, fonts, or font sizes in slide files. Use tokens from
  `styles.css`.

---

## How to delegate the next iteration

1. User dictates the slide sequence in `## Slide sequence`.
2. Manager (Codex) writes a fresh `plan.md` listing files to touch and acceptance
   criteria. Get user approval per `delegate` skill §3.
3. Commit base state, create a worktree
   (`git worktree add -b delegate/task-N .worktrees/task-N master`),
   write `TASK.md` inside it referencing AGENTS.md and DESIGN.md.
4. Spawn Copilot: `copilot -p "<prompt>" --model gpt-5.5 --allow-all --log-dir .copilot-logs`.
   Copilot CLI auto-loads `AGENTS.md` from the repo root — no extra config needed.
5. Manager verifies — re-run
   `node --check shell.js && for f in slides/*.js; do node --check "$f"; done`,
   read the diff, smoke-test in browser — then `git merge --ff-only`.
6. Force-clean the worktree (Copilot leaves `TASK.md` and `.copilot-logs/` behind):
   `git worktree remove --force .worktrees/task-N && git branch -d delegate/task-N`.

---

## Running locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

ES modules require HTTP — `file://` will not work. Press `F` for fullscreen when
presenting.
