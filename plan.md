# Plan: Talk-sequence v2 — extend with NSD, THINGS, PC scatter

Extend the deck with the empirical-results arc. Slides 1–5 stay as-is. Add
NSD (schematic + result), THINGS (schematic + result + model comparison),
PC scatter, and renumber the takeaway/thanks bookends.

Manager (Claude) verifies and merges per `~/.claude/skills/delegate/SKILL.md`.

---

## Goal

Add 6 new slides (NSD x2, THINGS x3, PC scatter) and renumber takeaway/thanks
so the final deck is 13 slides.

---

## Final slide sequence (the contract)

| #  | File                              | Content                                          | Image                          | Steps |
|----|-----------------------------------|--------------------------------------------------|--------------------------------|-------|
| 1  | `slides/01-title.js`              | Title — **unchanged**                            | —                              | —     |
| 2  | `slides/02-imagenet.js`           | ImageNet 1000-class scatter — **unchanged**      | `imagenet_1000.svg`            | —     |
| 3  | `slides/03-classification.js`     | Deep net classifier — **unchanged**              | `deep-neural-network-classification.png` | — |
| 4  | `slides/04-pca-method.js`         | PCA-based coarse signal — **unchanged**          | `pca_method.svg`               | —     |
| 5  | `slides/05-representations.js`    | Coarse → categorical reps — **unchanged**        | `representations.svg`          | —     |
| 6  | `slides/06-nsd-schematic.js`      | **NEW** — NSD methods schematic                  | `nsd_description.png`          | 1     |
| 7  | `slides/07-nsd-result.js`         | **NEW** — NSD RSA results across granularity     | `nsd_results.svg`              | 1     |
| 8  | `slides/08-things-schematic.js`   | **NEW** — THINGS database overview               | `things-schematic.png`         | 1     |
| 9  | `slides/09-things-result.js`      | **NEW** — THINGS coarse alignment results        | `things_coarse_results.svg`    | 1     |
| 10 | `slides/10-things-model-comparison.js` | **NEW** — vs. pretrained models             | `things_model_comparison.svg`  | 1     |
| 11 | `slides/11-pc-scatter.js`         | **NEW** — PC scatter = internal reps of coarse-grain models | `pc_scatter.svg`    | 1     |
| 12 | `slides/12-takeaway.js`           | Takeaway — **renamed** from `06-takeaway.js`     | —                              | —     |
| 13 | `slides/13-thanks.js`             | Thanks — **renamed** from `07-thanks.js`         | —                              | —     |

After all worker merges, manager updates `shell.js` `SLIDES` array to:

```js
const SLIDES = [
  '01-title', '02-imagenet', '03-classification', '04-pca-method',
  '05-representations', '06-nsd-schematic', '07-nsd-result',
  '08-things-schematic', '09-things-result', '10-things-model-comparison',
  '11-pc-scatter', '12-takeaway', '13-thanks',
];
```

---

## Slide content conventions for the 6 new slides

User has explicitly said: **don't worry about polish or final body text** — this
pass is structural. Each new slide should follow the existing pattern (look at
`02-imagenet.js`, `03-classification.js`, `05-representations.js` for reference):

- `h1` = a short placeholder title derived from the slide name
  (e.g. "NSD" / "NSD: results" / "THINGS" / "THINGS: results" /
  "THINGS: model comparison" / "Internal representations").
  Copilot should keep titles short and neutral — the user will rewrite later.
- Optional small caption under the figure.
- Figure: `<img src="images/<asset>" alt="" style="width: <px>px; height: auto;">`
  sized in the 900–1300 px range at 1920×1080 logical scale.
- 1 step (caption fade-in is fine; figure can be visible from step 0).
- **No hardcoded colors / fonts / font sizes.** Use only existing tokens and
  utility classes from `styles.css`. If a new layout class is genuinely needed,
  add it to `styles.css`; do not inline it.
- Module shape: `export default { html, steps: 1, notes: '' }` — same as siblings.

---

## Subtasks (parallel)

Three workers, all touching disjoint files.

### Subtask 1 — NSD slides
- Create `slides/06-nsd-schematic.js` using `images/nsd_description.png`.
- Create `slides/07-nsd-result.js` using `images/nsd_results.svg`.
- Acceptance: `node --check slides/06-nsd-schematic.js slides/07-nsd-result.js`
  passes; both modules `export default` with `html` string and `steps: 1`.

### Subtask 2 — THINGS slides
- Create `slides/08-things-schematic.js` using `images/things-schematic.png`.
- Create `slides/09-things-result.js` using `images/things_coarse_results.svg`.
- Create `slides/10-things-model-comparison.js` using `images/things_model_comparison.svg`.
- Acceptance: `node --check` passes for all three; same module shape as above.

### Subtask 3 — PC scatter + renames
- Create `slides/11-pc-scatter.js` using `images/pc_scatter.svg`. Title can be
  "Internal representations" or similar — caption may say "PC scatter of the
  coarse-grain model's internal representations".
- `git mv slides/06-takeaway.js slides/12-takeaway.js`
- `git mv slides/07-thanks.js slides/13-thanks.js`
- **Do not edit** the contents of takeaway/thanks — pure rename.
- **Do not edit** `shell.js` — manager will do that after merge to avoid
  three-way conflicts on the `SLIDES` array.
- Acceptance: `node --check slides/11-pc-scatter.js slides/12-takeaway.js slides/13-thanks.js`
  passes; `git log --diff-filter=R --follow slides/12-takeaway.js` shows the rename.

---

## Verification (manager runs after each merge)

```
node --check shell.js
for f in slides/*.js; do node --check "$f"; done
```

Then start `python -m http.server 8000` and step through slides 1→13 in the
browser to confirm no slide errors and all images either resolve or render as
labeled placeholders (if the image is missing).

---

## Out of scope

- Real body text on the new slides (user will write later).
- Visual polish, color/font tuning (user explicitly said: not now).
- Step-by-step reveal animations on individual chart elements.
- Inlining any of the SVGs (all are referenced via `<img>`).
- Any changes to slides 1–5.
- Any changes to `styles.css` beyond what's strictly needed for layout.
