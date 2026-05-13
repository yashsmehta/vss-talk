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

- **Outer padding inside the section:** `padding: 96px 140px 80px;`
- **Title anchor:** top-left, on its own line; followed by an optional `<p class="kicker">`
  subtitle in muted ink.
- **Hairline rule** (`--rule`, 1px) under the title block with `margin-top: 28px` —
  echoes the editorial print feel without shouting.
- **Figure area:** the rest of the slide. Centered or two-column layouts via simple flex
  / grid. Never use viewport units inside the section.
- **Footer strip:** a fixed band at the bottom, 36px tall, `--paper-2` background, with
  three slots:
  - left: talk short title — `"COARSE FEEDBACK · VSS 2026"`
  - center: empty (kept for breathing room)
  - right: slide number `"03 / 16"` (replaces the spec's `#progress` div)
- The shell's `#progress` element should be styled as that right-side slide number.

## Image placeholders

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

Workers B and C **must** use these classes/tokens:

- Slide root: `<section class="slide">` (the shell wraps it; this class applies the
  padding and title hierarchy from above).
- Title: `<h1>`.
- Subtitle/kicker: `<p class="kicker">`.
- Body bullet: `<p class="step step-N">` for reveal text.
- Figure box: `<div class="placeholder" data-name="…" style="width:…; height:…;"></div>`.
- Captions: `<figcaption class="caption">…</figcaption>`.

No worker should define their own colors, fonts, or px-precise type sizes. Layout-only
overrides (flex direction, grid columns, figure positioning per slide) are fine.
