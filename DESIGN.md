# VSS26 Deck — Design Brief

This is the visual contract for the deck. It overrides the example `styles.css` in
`deck-spec.md`. The deck-spec's *architecture* (module contract, step reveals, fullscreen,
arrow-key advance) is kept verbatim. Only the visual layer changes.

## Aesthetic direction

**Refined academic editorial.** Think *Quanta Magazine*, *Nautilus*, *Stripe Press* — a
modern, considered, print-inspired feel. Generous whitespace, strong typographic hierarchy,
quiet motion. The PDF source already has this character; the HTML deck should feel like a
natural extension of it.

The audience is a Vision Sciences conference. Projector legibility and visual restraint
matter more than flashiness.

### Conference-projection design principles

This deck is projected onto a 4–8 m screen in a partially darkened room, viewed from up
to 25 m back. Every visual choice on every slide must respect the following:

1. **No floating panels.** Figures must read as *part of the page*, not as opaque PNGs
   pasted onto it. White backgrounds in SVG/PNG assets must be removed visually
   (see [Figure integration](#figure-integration)). The paper background is the slide;
   ink is the only mark on it.
2. **No frames, borders, drop shadows, gradients, rounded card chrome on figures.** A
   figure's silhouette is the figure itself. The eye finds it because it is the only
   marked region in a sea of paper.
3. **Top of slide is prime real estate.** From the back of the room, the bottom 15% is
   often blocked by a head row. Compress top padding so the title sits high and the
   figure begins as close to the title as the typographic rhythm allows.
4. **One idea, one anchor.** Each slide has exactly one figure (or one hero phrase) and
   one short title. The title labels the slide; the figure carries the argument.
5. **Read in two seconds.** A viewer scanning the slide should be able to identify the
   title and the figure's point in under two seconds. No multi-clause titles, no busy
   captions, no decorative typography.
6. **Spatial rhythm is identical across slides.** Title baseline, hairline rule, figure
   top edge — all sit at the same y-coordinate from slide to slide. The eye should never
   re-search for the title position when the deck advances.
7. **Color discipline.** The accent palette
   (`--orange / --teal / --blue / --red / --purple`) is for *chart marks only*. Slide
   chrome (footer, rule, captions, slide number) uses ink + muted ink + rule grey only.
   No accent colors in titles, headers, footers, or decorative dividers.
8. **Motion is invisible.** A presenter clicking forward should feel a soft re-anchor,
   not an animation. If the audience notices the transition, it is too loud.

## Tokens

```css
:root {
  /* Paper-toned light theme — echoes the PDF's warm off-white feel */
  --paper:        #FAF8F3;   /* page background */
  --paper-2:      #F2EFE7;   /* secondary surfaces (footer strip, captions) */
  --ink:          #1A1A17;   /* primary text */
  --ink-muted:    #5C5C57;   /* axis labels, captions, slide numbers */
  --rule:         #D9D5C8;   /* hairline rules */

  /* Chart accents lifted from the source PDF */
  --orange:       #E8943D;   /* primary highlight, "Standard labels" bar */
  --teal:         #4FA08B;   /* class-1 green from PCA scatters */
  --blue:         #3B6EAA;   /* "Coarse labels" point */
  --red:          #C44545;   /* class-4 red */
  --purple:       #8C6AB7;   /* clothing / vehicle accent */

  /* Typography */
  --font-display: 'Fraunces', 'Iowan Old Style', Georgia, serif;
  --font-sans:    'Geist', 'Söhne', -apple-system, system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', ui-monospace, monospace;

  /* Logical slide size; everything inside slides uses px at this scale */
  --slide-w: 1920px;
  --slide-h: 1080px;

  /* Spatial rhythm — tuned for projection legibility from the back of the room */
  --pad-top:        56px;     /* was 96 — title raised so it sits high on screen */
  --pad-side:      140px;
  --pad-bottom:     64px;     /* was 80 — footer is only 36px tall, no need for more */
  --title-rule-gap: 20px;     /* was 28 — tighter rhythm between title and rule */
  --figure-gap:     24px;     /* was 38 — figure begins close under the title rule */

  /* Motion */
  --ease:    cubic-bezier(.2, .7, .2, 1);
  --t-slide: 480ms;
  --t-step:  380ms;
}
```

## Fonts

Load via Google Fonts in `index.html` (one `<link>` for performance):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Geist:wght@300;400;500;600&display=swap" rel="stylesheet">
```

- **Fraunces** is used for slide titles only. Use the *opsz 144* high optical size at
  large display sizes for the soft, distinctive look.
- **Geist** is the workhorse: body, captions, axes, slide numbers, footer.
- Do **not** use Inter, Roboto, Arial, or system-ui as primary faces.

## Type scale (at 1920×1080 logical px)

| Role | Family | Size | Weight | Tracking | Notes |
|---|---|---|---|---|---|
| h1 (slide title) | Fraunces 144opsz | 88px | 400 | -0.02em | Italic optional axis available; default upright |
| h2 (subtitle) | Geist | 36px | 400 | -0.01em | Used under h1 on title slide and section dividers |
| Body / bullet | Geist | 30px | 400 | normal | Line-height 1.45, max-width 28em |
| Caption (figure label) | Geist | 22px | 400 | 0.02em | Color `--ink-muted` |
| Chart axis label | Geist | 18px | 500 | 0.04em | Small caps (`font-feature-settings: 'smcp'`) where supported |
| Slide number | Geist Mono fallback | 14px | 500 | 0.08em | Uppercase, in footer |
| Footer strip | Geist | 14px | 400 | 0.06em | `--ink-muted`, uppercase, very small caps |

## Layout

- **Outer padding inside the section:**
  `padding: var(--pad-top) var(--pad-side) var(--pad-bottom);` (56 / 140 / 64 px).
  Top padding is intentionally tight — see *Conference-projection design principles*
  point 3.
- **Title anchor:** top-left, on its own line; followed by an optional `<p class="kicker">`
  subtitle in muted ink. Title baseline sits at the same y-coordinate on every slide
  (point 6 in the projection principles).
- **Hairline rule** (`--rule`, 1px) under the title block with
  `margin-top: var(--title-rule-gap)` (20px) — echoes the editorial print feel without
  shouting. On the title, takeaway, and thanks slides, the rule is suppressed (those
  are bespoke layouts).
- **Figure area:** the rest of the slide, beginning `var(--figure-gap)` (24px) below the
  rule. Centered or two-column layouts via simple flex / grid. Never use viewport units
  inside the section.
- **Footer strip:** a fixed band at the bottom, 36px tall, `--paper-2` background, with
  three slots:
  - left: talk short title — `"COARSE FEEDBACK · VSS 2026"`
  - center: empty (kept for breathing room)
  - right: slide number `"03 / 13"` (replaces the spec's `#progress` div)
- The shell's `#progress` element should be styled as that right-side slide number.

## Figure integration

Figures must feel embedded in the paper, not pasted onto it.

### The white-background problem

Most assets in `images/` are matplotlib SVG exports or screenshots with a hard
`#FFFFFF` background. Dropped onto the `--paper #FAF8F3` slide, they read as
opaque rectangles floating above the page. This violates the
*"no floating panels"* principle.

### Solution: multiply blending

Apply `mix-blend-mode: multiply` to every figure (`<img>`, `<svg>`,
inline `<svg>`) inside a slide. White areas in the asset multiply with the paper
color (`#FFFFFF × #FAF8F3 = #FAF8F3`) and disappear into the page. Anything
darker than paper (axis lines, marks, text) is unchanged.

```css
.slide { isolation: isolate; }              /* contain blend; don't leak to footer */
.slide figure img,
.slide figure svg,
.slide > figure { mix-blend-mode: multiply; }
```

The `isolation: isolate` is required so the blend doesn't bleed into the footer
strip or the next slide during transitions.

### What multiply does *not* solve

- Assets where the chart fill area uses **off-white** (e.g. `#FCFCFC`) — those
  multiply to a slightly darker paper. Visible only on careful inspection;
  acceptable for v1. If a specific asset looks wrong, edit the SVG to either
  remove the background `<rect>` or recolor it to `var(--paper)`.
- Assets where chart marks are pure **white-on-color** (uncommon in this deck) —
  those would disappear. None of the current `images/` exhibit this.
- Raster PNGs where the background is anti-aliased — fine in practice, paper
  edges around the figure may show a 1-px halo at very high zoom; invisible
  from the audience.

### Figure containers

Use `<figure>` for every figure region. Inside it:

```html
<figure class="<slide-name>-figure">
  <img src="images/<asset>" alt="">
  <figcaption class="caption step step-1">Short descriptive label.</figcaption>
</figure>
```

- No border, no `box-shadow`, no `border-radius`, no background on the `<figure>`
  itself — the figure's silhouette is the figure.
- The `<img>` inherits the slide-class layout for sizing (do not inline pixel
  widths if a slide-class rule covers it; see *Per-slide overrides* below).
- Caption sits 18px below the figure, in `--ink-muted`, at the caption type size.

### Responsive figure containment (mandatory)

The slide is authored at 1920×1080 logical px and scaled by CSS to fit the
viewport (see `shell.js` and the `.slide-wrapper > section { transform: scale(...) }`
rule). The scaling is uniform — never anisotropic — so aspect ratio is preserved.

**Inside a slide, however, figures must constrain themselves to the slide's safe
content area or they will overflow and be hidden by `overflow: hidden`.** The
safe content area is:

```
content_w = 1920 - 2 * 140       = 1640 px
content_h = 1080 - 56 - 109 - 24 - 64 = 827 px
            ^slide ^pad-top ^title-block ^figure-gap ^pad-bottom
```

(The 109 px title block = 88 px h1 + 20 px title-rule-gap + 1 px hairline rule.
Bespoke layouts without a title block — title slide, takeaway, thanks — get
roughly 920 px of vertical space.)

**A fixed pixel `width:` on a figure is wrong.** A 1240 px-wide figure with a
square asset is 1240 px tall, which overflows the 827 px vertical budget and is
clipped at the bottom. Specifically `pc-scatter` at the previous `width: 1100 px`
was clipped by ~273 px on every projection.

**The pattern that works**, per slide:

```css
.<name>-slide {
  display: grid;
  grid-template-rows: auto 1fr;     /* title block, figure cell */
}

.<name>-slide .<name>-figure {
  align-self: stretch;
  justify-self: stretch;
  display: grid;
  place-items: center;
  min-height: 0;                     /* essential — see below */
  margin-top: var(--figure-gap);
}

.<name>-slide .<name>-figure img,
.<name>-slide .<name>-figure svg {
  display: block;
  max-width: <preferred-cap>px;      /* cap when there's room (e.g. 1240) */
  max-height: 100%;                  /* never exceed the figure cell */
  width: auto;
  height: auto;
}
```

Why this works:

- `grid-template-rows: auto 1fr` gives the figure cell whatever vertical space
  remains after the title block.
- `min-height: 0` on the figure overrides CSS Grid's default min-content
  behavior, which would otherwise expand the row to fit the img's intrinsic
  height (defeating the 1fr cap).
- `display: grid; place-items: center` on the figure centers the img both axes.
- `max-width: <cap>px; max-height: 100%; width: auto; height: auto` makes the
  img fit the smaller of (preferred width, available height-preserving-aspect),
  preserving aspect ratio in either case. No `object-fit` needed because the
  img is intrinsically sized.

Per-slide `<preferred-cap>px` should be set such that the figure looks
intentional at large viewports and gracefully shrinks at small ones:

| Asset shape          | Preferred cap |
|----------------------|---------------|
| Wide chart (4:1+)    | 1500          |
| Standard chart (3:2) | 1240          |
| Schematic (2:1)      | 1320          |
| Near-square (1:1)    | 800–900       |
| Tall asset           | use `max-height: <preferred>px` instead of width cap |

For inlined SVGs (e.g. the PCA method on slide 04), the same pattern applies
to the `<svg>` element: drop fixed `width=`/`height=` attributes from the SVG
markup, keep `viewBox`, and let CSS govern via `max-width`/`max-height`.

### Bespoke-layout slides

Title (01), takeaway (12), thanks (13) do not have the title-then-figure
two-row pattern — they have specific custom layouts. They still must:

- Use `min-height: 0` on any grid cell that holds an image
- Cap any image with `max-width` AND `max-height` so it never overflows the
  slide
- Avoid intrinsic `width: <px>` on `<img>` without a corresponding `max-height`

### Footer clearance

The `#footer-strip` is `position: fixed; bottom: 0; height: 36px` on the
viewport. Because the slide section is scaled, the footer overlays the
bottom 36 viewport-px of the screen — which corresponds to a variable amount
of slide-px depending on viewport size. The 64 px `--pad-bottom` provides
clearance for slide content from the footer band at typical projection
aspect ratios. Do not put figures or text below the bottom padding.

## Per-slide overrides

Every slide gets a unique class on its root `<section>` (e.g.
`.nsd-schematic-slide`, `.things-result-slide`). The slide module's HTML must
include this class. Per-slide layout rules live in **`styles.css`**, scoped to
that class, not in the slide module.

```css
/* in styles.css */
.nsd-schematic-slide {
  display: grid;
  grid-template-rows: auto 1fr;
}

.nsd-schematic-slide .nsd-schematic-figure {
  width: 1180px;
  align-self: center;
  justify-self: center;
}

.nsd-schematic-slide .nsd-schematic-figure img {
  display: block;
  width: 100%;
  height: auto;
}
```

Slide modules **must not** contain inline `style="..."` attributes for sizing
or color. The only acceptable inline style on a slide module is for things the
shell genuinely cannot reach (vanishingly rare). Picking the right figure
width per asset is a styles.css responsibility, not a slide-module one.

### Picking figure widths per slide

Aim widths in the **1000–1320 px** range at 1920×1080 logical scale. Decide by
asset aspect ratio, not by a default:

- **Square or near-square** assets → 1000–1100 px
- **Wide** charts (e.g. RSA bar charts spanning many conditions) → 1200–1320 px
- **Schematic diagrams** (NSD methods, deep-net diagram) → 1180–1280 px
- **Tall** assets → set `height` (700–820 px) and let `width` follow

A figure must never overflow the slide's content area
(`1920 - 2*140 = 1640 px wide`, `1080 - 56 - 64 - 36 = 924 px` tall minus title
block).



The user will drop real PNGs into `assets/` later. Every `<img>` placeholder slot should
render as a labelled empty box so the layout looks correct in advance:

```css
.placeholder {
  display: grid;
  place-items: center;
  background: var(--paper-2);
  border: 1px dashed var(--rule);
  color: var(--ink-muted);
  font-family: var(--font-sans);
  font-size: 18px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 4px;
}
.placeholder::after { content: attr(data-name); }
```

Slides reference like:

```html
<div class="placeholder" data-name="imagenet-tsne-1000.png"
     style="width: 880px; height: 720px;"></div>
```

The user replaces a `.placeholder` div with an `<img src="assets/imagenet-tsne-1000.png">`
of the same size when ready.

## Motion

- **Slide transitions:** horizontal slide + fade, 480ms, `--ease`. Forward = new slide
  slides in from +40px; old slides out to -40px. (Spec uses 60px / 400ms — soften.)
- **Step reveals:** the default `.step` → `.revealed` transition stays opacity + 8px Y
  translate, 380ms `--ease`. Avoid scaling, rotation, or bounce.
- **No** parallax, no scroll effects, no animated backgrounds, no hover micro-interactions
  on slides (this is a presentation, not a webpage).

## Title slide (specific)

- Background: `--paper` with an extremely subtle paper-grain SVG overlay (data-URI noise,
  opacity 0.04, mix-blend-mode: multiply). Only on the title slide and the thanks slide.
- Title in Fraunces at the upper-left, very large (88px is the default; title slide can go
  to 104px).
- Author + lab in Geist, bottom-left, in two lines (name bold, lab muted).
- Date + venue, bottom-right, in Geist, uppercase, tracked.
- The PDF's QR code is rendered as a small `.placeholder` box, ~140×140px, bottom-left
  under the author.

## What workers must inherit

Workers **must** use these classes/tokens:

- Slide root: `<section class="slide <slide-name>-slide">` — both the global `.slide`
  class AND the slide-specific class (e.g. `nsd-schematic-slide`). The shell wraps
  the section; the global class applies the padding and title hierarchy; the
  slide-specific class is the hook for per-slide layout in `styles.css`.
- Title: `<h1>`. Always present, always at the top of the slide. Bespoke layouts
  (title, takeaway, thanks) may suppress the rule via the `.no-rule` modifier.
- Subtitle/kicker: `<p class="kicker">`.
- Body bullet: `<p class="step step-N">` for reveal text.
- Figure container: `<figure class="<slide-name>-figure">` — see
  [Figure integration](#figure-integration) for the contents.
- Figure during placeholder phase:
  `<div class="placeholder" data-name="…" style="width:…; height:…;"></div>`
  (only until a real asset replaces it).
- Captions: `<figcaption class="caption">…</figcaption>`.

**Worker rules:**

1. **No colors, fonts, font sizes** in slide modules. Tokens only, via classes
   already defined in `styles.css`.
2. **No inline `style="..."` attributes for sizing.** Per-slide widths/heights live
   in `styles.css`, scoped to the slide-specific class. (See
   [Per-slide overrides](#per-slide-overrides).)
3. **No `box-shadow`, `border`, `border-radius`, or `background-color` on figures.**
   Figures are silhouettes on paper.
4. **Every `<img>` and `<svg>` figure** inherits the global `mix-blend-mode: multiply`
   rule. Workers do not need to add the rule per slide; they only need to ensure the
   asset sits inside `<figure>`.
