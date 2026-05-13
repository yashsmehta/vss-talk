# Plan: Talk-sequence v1 (slides 1–7)

Replace the showcase v1 deck with the real talk sequence. First pass covers the
opening narrative arc (ImageNet → fine-grained classification → coarse signal
→ representations) plus title/takeaway/thanks bookends.

This plan is the contract for one delegation cycle to Copilot. Manager (Claude)
verifies and merges per `~/.claude/skills/delegate/SKILL.md`.

---

## Slide sequence (the contract)

| # | File | Content (1-line gist) | Image | Steps |
|---|---|---|---|---|
| 1 | `slides/01-title.js` | Title slide — keep as-is | — | existing |
| 2 | `slides/02-imagenet.js` | "Deep learning has moved toward finer feedback signals" — each dot is one of 1000 ImageNet classes | `imagenet_1000.svg` | 1 |
| 3 | `slides/03-classification.js` | The fine-grained feedback signal: 1000-way classification via a deep net | `deep-neural-network-classification.png` | 1 |
| 4 | `slides/04-pca-method.js` | "What if the signal is coarse?" — 2-way panel reveals first, then 4-way panel | `pca_method.svg` (inlined) | 2 |
| 5 | `slides/05-representations.js` | 1000-way vs 4-way trained CNN — 4-way model's internal representations are more categorical | `representations.svg` | 1 |
| 6 | `slides/06-takeaway.js` | Takeaway — port content from existing `03-takeaway.js`, renumbered | — | existing |
| 7 | `slides/07-thanks.js` | Thanks — port content from existing `04-thanks.js`, renumbered | — | existing |

**Files removed:** `slides/02-alignment.js`, `slides/03-takeaway.js`,
`slides/04-thanks.js` (the latter two are renamed/renumbered, not deleted in spirit).

**`shell.js` `SLIDES` array** must end up as:

```js
const SLIDES = [
  '01-title',
  '02-imagenet',
  '03-classification',
  '04-pca-method',
  '05-representations',
  '06-takeaway',
  '07-thanks',
];
```

---

## Per-slide notes

### Slide 2 — `02-imagenet.js`
- Title (h1): something like *"Deep learning trends toward finer feedback signals"*
  (Copilot may refine wording but stay close to this framing).
- Body: short subtitle/caption noting "each point = one of 1000 ImageNet classes".
- Figure: `<img src="images/imagenet_1000.svg">`, large, right/centre of slide.
- 1 step (subtitle fade-in is fine).

### Slide 3 — `03-classification.js`
- Title (h1): something like *"…trained with a fine-grained feedback signal"*
  (continuation of slide 2's framing — feel free to bridge).
- Figure: `<img src="images/deep-neural-network-classification.png">` — large,
  prominent.
- 1 step.

### Slide 4 — `04-pca-method.js` ⚠ inlined SVG required
- Title (h1): something like *"What if the feedback signal were coarser?"*
- Figure: **inline** the contents of `images/pca_method.svg` directly into the
  module's `html` string (per CLAUDE.md "Working with images" and animation
  pattern #2). Do not use `<img>`.
- The SVG is a matplotlib export with two axes groups — likely `axes_1` (2-way)
  and `axes_2` (4-way). Copilot must inspect the SVG and tag the appropriate
  groups with `class="step step-1"` (2-way panel) and `class="step step-2"`
  (4-way panel) so they reveal in order.
- Add CSS so step elements start at `opacity: 0` and transition to `1` on
  `.revealed`. Keep transitions consistent with `--ease` and `--motion-step` from
  `styles.css` / DESIGN.md.
- 2 steps.

### Slide 5 — `05-representations.js`
- Title (h1): something like *"Coarse training yields more categorical representations"*
- Figure: `<img src="images/representations.svg">`.
- Body caption (small): "1000-way vs 4-way CNN — 4-way model's internal
  representations become more categorical."
- 1 step.

### Slides 6 & 7
- Pure rename + renumber of the existing `03-takeaway.js` → `06-takeaway.js` and
  `04-thanks.js` → `07-thanks.js`. No content changes. Use `git mv`.

---

## Visual / aesthetic acceptance criteria

Per CLAUDE.md and DESIGN.md:

1. **No hardcoded colors, fonts, or font sizes in slide files.** Use only CSS
   variables and existing utility classes. Add new classes to `styles.css` if
   needed; do not inline `style="color: …"` or `font-family: …`.
2. **Fonts:** Fraunces for `h1`, Geist for body. Already in `index.html` font
   chain — slides should not override.
3. **Layout:** authored at logical 1920×1080. Standard slide padding
   `96px 140px 80px`. Title block top-left with hairline rule below it (already
   handled by base `.slide` styles). Figure region below.
4. **Figures:** sized in px at the 1920×1080 scale. No `vw`/`vh`. Image regions
   should feel generous — let the image breathe; don't crop or stretch. Aim for
   figure widths in the 900–1300px range unless the asset's natural aspect
   demands otherwise.
5. **Step reveals:** must use the shell's `step step-N` / `.revealed` pattern.
   Set `steps:` on the module export. Transitions must use `--motion-step` and
   `--ease`.
6. **Footer strip + slide counter:** must continue to render correctly across
   the new sequence (the shell handles this automatically — just verify).
7. **No new dependencies.** No bundler, no npm, no inline `<script>` tags
   beyond what's already in `shell.js`.
8. **Smoke test:** `node --check shell.js && for f in slides/*.js; do node --check "$f"; done` must pass.
9. **Browser smoke:** when served via `python -m http.server 8000`, deck loads,
   →/← navigate cleanly through all 7 slides, step reveals on slide 4 fire in
   the right order (2-way, then 4-way), no console errors.

---

## Files Copilot will touch

- **Create:** `slides/02-imagenet.js`, `slides/03-classification.js`,
  `slides/04-pca-method.js`, `slides/05-representations.js`.
- **Rename (`git mv`):** `slides/03-takeaway.js` → `slides/06-takeaway.js`,
  `slides/04-thanks.js` → `slides/07-thanks.js`.
- **Delete:** `slides/02-alignment.js`.
- **Edit:** `shell.js` (update `SLIDES` array).
- **Edit:** `styles.css` (add slide-specific layout classes only — no token
  changes).
- **Do not touch:** `index.html`, `CLAUDE.md`, `DESIGN.md`, `images/*`,
  `01-title.js`.

---

## Out of scope for this iteration

- Slides beyond #7 (NSD results, RSA schematics, THINGS results, model
  comparison, trained-vs-untrained, QR slide). User will dictate those next.
- Image-level edits (cropping, recolouring, re-exporting).
- Speaker notes (`notes:` field on modules) — leave for later.

---

## Manager verification checklist (post-merge)

- [ ] `node --check` passes on shell + every slide file.
- [ ] `git status` clean; worktree removed; `delegate/task-N` branch deleted.
- [ ] Browser smoke: 7 slides navigate cleanly, slide 4 step reveals correct.
- [ ] No hardcoded colors/fonts/sizes introduced in slide files (grep slides/
      for `font-family`, `color:`, `#` hex codes).
- [ ] Footer strip + counter render correctly on all 7 slides.
- [ ] Aesthetic pass: titles read well, figures are well-sized and balanced,
      no awkward whitespace.
