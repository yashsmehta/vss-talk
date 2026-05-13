# HTML Slide Deck: Architecture Spec for Claude Code

## Goal

Build a self-contained, browser-based slide deck for a roughly 20-slide talk. It must support:

1. **One shell HTML file** that loads slides on demand. Each slide lives in its own small file so that any one slide can be edited, animated, or rewritten without touching the others.
2. **Smooth slide-to-slide transitions** (CSS-driven, no flash).
3. **Step-based build-ups within a slide** (e.g. bars in a chart appearing one at a time, paragraphs revealing sequentially, image overlays fading in). Right-arrow advances steps first, then moves to the next slide once all steps are revealed.
4. **Fullscreen presenting** via a keyboard toggle.
5. **A clean module contract** so that future slides can be added by writing a single new file and registering it in one list.

This document is the contract. Implementations should follow it unless there is a good reason to deviate, in which case note the deviation in a comment.

---

## Architecture Decisions

These were considered and rejected:

- **One HTML per slide with `window.location.href` navigation.** Rejected because every transition is a full page reload, which flashes and loses animation state.
- **Single monolithic HTML with all 20 slides inline.** Rejected because the file becomes too long to edit comfortably, and an LLM editing one slide has to load the whole thing.
- **A bundler (Vite, etc.).** Rejected as overkill. The deck should run with nothing more than a static file server.

What we use instead:

- **Static shell + ES module slides.** `index.html` is the shell. Each slide is an ES module (`slides/NN-name.js`) that default-exports an object describing its content and behavior. The shell imports them with `import()` and renders them into a stage div.
- **No build step.** Native ES modules in modern browsers handle everything. The only requirement is serving over HTTP (not `file://`) because of module CORS rules.

---

## Project Structure

```
deck/
  index.html              # shell: stage, keyboard, fullscreen, transitions
  shell.js                # all shell logic
  styles.css              # shared styles, slide base, transition classes
  slides/
    01-title.js
    02-motivation.js
    03-method.js
    ...
    20-thanks.js
  assets/
    (user's images: .svg preferred, .png/.jpg fine for photos)
```

`assets/` is where the user's existing images live. Slides reference them by relative path: `assets/fig1.svg`, `assets/brain-render.png`, etc.

---

## The Slide Module Contract

Every slide file default-exports an object with this shape:

```js
// slides/03-method.js
export default {
  // Required: the slide's HTML, as a string. Use a <section> root.
  html: `
    <section class="slide-method">
      <h1>Method</h1>
      <svg id="partition-tree" viewBox="0 0 800 400">
        <!-- inline SVG so we can animate parts -->
      </svg>
      <p class="step step-1">First, we coarse-grain ImageNet.</p>
      <p class="step step-2">Then we train on the coarse labels.</p>
      <p class="step step-3">Finally, we compare to neural data.</p>
    </section>
  `,

  // Optional: number of build-up steps within this slide.
  // If omitted, the slide has 0 steps and right-arrow always advances to the next slide.
  steps: 3,

  // Optional: notes shown only in presenter mode (future).
  notes: `Emphasize that 8 categories is enough.`,

  // Optional: called once after the slide's HTML is in the DOM, before any step.
  // Use this to set up animations, attach listeners, kick off D3, etc.
  // `root` is the slide's root element (the <section>).
  onEnter(root) {
    // e.g. start an idle animation, pre-position elements offscreen
  },

  // Optional: called when a step is advanced. `step` is 1-indexed.
  // Use this for anything more complex than what CSS classes can express.
  onStep(root, step) {
    // e.g. trigger a D3 transition, play a sound
  },

  // Optional: called when leaving the slide. Use this to clean up timers,
  // observers, WebGL contexts, etc.
  onLeave(root) {}
};
```

**Default step convention (no JS needed):** if a slide just wants paragraphs or shapes to appear one at a time, give them class `step step-N`. The shell automatically reveals `.step-1` after the first right-arrow, `.step-2` after the second, and so on. This means **most slides will not need `onStep` at all**. Only reach for `onStep` when CSS classes are not expressive enough.

Slides are registered in one place, in order:

```js
// shell.js
const SLIDES = [
  '01-title',
  '02-motivation',
  '03-method',
  // ...
  '20-thanks'
];
```

To add a slide: drop a new file in `slides/`, add its name to this list. That is the whole workflow.

---

## Shell Implementation

This is the starter code. It is intentionally short and complete.

### `index.html`

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Talk</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main id="stage"></main>
  <div id="progress"></div>
  <script type="module" src="shell.js"></script>
</body>
</html>
```

### `shell.js`

```js
const SLIDES = [
  '01-title',
  // ... add as you build
];

const stage = document.getElementById('stage');
const progress = document.getElementById('progress');

let slideIndex = 0;
let stepIndex = 0;        // 0 = no steps revealed; 1..N = steps revealed
let current = null;       // { module, root }
let transitioning = false;

async function loadSlide(i, direction = 'forward') {
  if (i < 0 || i >= SLIDES.length || transitioning) return;
  transitioning = true;

  // Leave current
  if (current) {
    current.module.onLeave?.(current.root);
    const old = current.root;
    old.classList.add(direction === 'forward' ? 'leaving-left' : 'leaving-right');
    setTimeout(() => old.remove(), 400);
  }

  // Load next
  const name = SLIDES[i];
  const mod = (await import(`./slides/${name}.js`)).default;
  const wrapper = document.createElement('div');
  wrapper.className = 'slide-wrapper entering-' + (direction === 'forward' ? 'right' : 'left');
  wrapper.innerHTML = mod.html;
  stage.appendChild(wrapper);

  // Force reflow so the transition triggers
  void wrapper.offsetWidth;
  wrapper.classList.remove('entering-right', 'entering-left');

  current = { module: mod, root: wrapper };
  slideIndex = i;
  stepIndex = 0;
  mod.onEnter?.(wrapper);
  updateProgress();

  setTimeout(() => { transitioning = false; }, 400);
}

function advance() {
  const totalSteps = current?.module.steps ?? 0;
  if (stepIndex < totalSteps) {
    stepIndex++;
    const root = current.root;
    root.classList.add(`reveal-${stepIndex}`);
    // Apply default CSS-class reveal
    root.querySelectorAll(`.step-${stepIndex}`).forEach(el => el.classList.add('revealed'));
    current.module.onStep?.(root, stepIndex);
  } else {
    loadSlide(slideIndex + 1, 'forward');
  }
}

function retreat() {
  const totalSteps = current?.module.steps ?? 0;
  if (stepIndex > 0) {
    const root = current.root;
    root.querySelectorAll(`.step-${stepIndex}`).forEach(el => el.classList.remove('revealed'));
    root.classList.remove(`reveal-${stepIndex}`);
    stepIndex--;
  } else {
    loadSlide(slideIndex - 1, 'backward');
  }
}

function updateProgress() {
  progress.textContent = `${slideIndex + 1} / ${SLIDES.length}`;
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowRight':
    case ' ':
    case 'PageDown':
      advance(); break;
    case 'ArrowLeft':
    case 'PageUp':
      retreat(); break;
    case 'Home':
      loadSlide(0); break;
    case 'End':
      loadSlide(SLIDES.length - 1); break;
    case 'f':
    case 'F':
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
      break;
    case 'b':
    case 'B':
      document.body.classList.toggle('blackout');
      break;
  }
});

// Cursor auto-hide
let cursorTimer;
document.addEventListener('mousemove', () => {
  document.body.classList.remove('cursor-hidden');
  clearTimeout(cursorTimer);
  cursorTimer = setTimeout(() => document.body.classList.add('cursor-hidden'), 2000);
});

loadSlide(0);
```

### `styles.css`

```css
:root {
  --bg: #0e0e10;
  --fg: #f3f3f5;
  --accent: #6aa9ff;
  --muted: #8a8a93;
  --font-sans: 'Inter', -apple-system, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --slide-w: 1920px;
  --slide-h: 1080px;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans);
  overflow: hidden;
}

body.cursor-hidden { cursor: none; }
body.blackout #stage { opacity: 0; }

#stage {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
  transition: opacity 200ms ease;
}

.slide-wrapper {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  opacity: 1;
  transform: translateX(0);
  transition: opacity 400ms ease, transform 400ms ease;
}

.slide-wrapper.entering-right { opacity: 0; transform: translateX(60px); }
.slide-wrapper.entering-left  { opacity: 0; transform: translateX(-60px); }
.slide-wrapper.leaving-left   { opacity: 0; transform: translateX(-60px); }
.slide-wrapper.leaving-right  { opacity: 0; transform: translateX(60px); }

/* Scale slides to fit any screen while preserving 16:9 layout.
   Slides are designed at 1920x1080 logical pixels and scaled. */
.slide-wrapper > section {
  width: var(--slide-w);
  height: var(--slide-h);
  transform: scale(min(calc(100vw / 1920), calc(100vh / 1080)));
  transform-origin: center;
  padding: 80px 120px;
  box-sizing: border-box;
}

/* Default step animation: hidden until .revealed is added */
.step {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 350ms ease, transform 350ms ease;
}
.step.revealed {
  opacity: 1;
  transform: translateY(0);
}

#progress {
  position: fixed;
  bottom: 16px;
  right: 24px;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--muted);
  pointer-events: none;
}

/* Typography defaults */
h1 { font-size: 64px; font-weight: 600; letter-spacing: -0.02em; margin: 0 0 0.6em; }
h2 { font-size: 44px; font-weight: 500; margin: 0 0 0.5em; }
p  { font-size: 28px; line-height: 1.5; max-width: 24em; }
```

---

## Keyboard Controls

| Key | Action |
|---|---|
| Right arrow / Space / PageDown | Next step, or next slide if no more steps |
| Left arrow / PageUp | Previous step, or previous slide if at step 0 |
| Home | Jump to first slide |
| End | Jump to last slide |
| F | Toggle fullscreen |
| B | Blackout (hide slides temporarily) |
| Esc | Exit fullscreen (browser default) |

---

## Animation Recipes

The patterns below cover roughly 90% of what a scientific talk needs.

### 1. Reveal text or shapes one by one (no JS)

Add `class="step step-N"` to anything that should appear at step N. The shell adds `.revealed` automatically.

```html
<p class="step step-1">First claim.</p>
<p class="step step-2">Second claim.</p>
```

### 2. Animate bars in an SVG chart one at a time

Make sure the chart is **inline SVG** (paste the `<svg>...</svg>` markup directly into the slide's `html` string). PNG or rasterized PDF will not work for this.

```html
<svg viewBox="0 0 600 400">
  <rect class="bar step step-1" x="50"  y="200" width="80" height="180" fill="var(--accent)"/>
  <rect class="bar step step-2" x="160" y="120" width="80" height="260" fill="var(--accent)"/>
  <rect class="bar step step-3" x="270" y="80"  width="80" height="300" fill="var(--accent)"/>
</svg>

<style>
  .bar { transform-origin: bottom; transform: scaleY(0); }
  .bar.revealed { transform: scaleY(1); transition: transform 600ms cubic-bezier(.2,.8,.2,1); }
</style>
```

Each bar grows from its baseline as its step is revealed.

### 3. Convert matplotlib output to animatable SVG

When exporting from matplotlib:

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
bars = ax.bar(['A', 'B', 'C'], [3, 7, 5])
for i, bar in enumerate(bars):
    bar.set_gid(f'bar-{i+1}')   # gives each bar a clean SVG id
plt.savefig('fig.svg')
```

In the output SVG, search for `id="bar-1"`, add `class="step step-1"`, repeat. Now each bar animates independently.

### 4. Crossfading between two images on a slide

```html
<div class="overlay-stack">
  <img src="assets/before.png" class="layer">
  <img src="assets/after.png" class="layer step step-1">
</div>

<style>
  .overlay-stack { position: relative; }
  .layer { position: absolute; inset: 0; }
</style>
```

The "after" image fades in on top of "before" at step 1.

### 5. Custom JS animations (D3, anime.js, etc.)

Use `onEnter` to set up and `onStep` to drive frames. Slides remain self-contained because the JS lives in the slide module itself.

```js
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export default {
  html: `<section><svg id="my-viz" viewBox="0 0 800 400"></svg></section>`,
  steps: 2,
  onEnter(root) {
    const svg = d3.select(root).select('#my-viz');
    // build the viz, initial state
  },
  onStep(root, step) {
    const svg = d3.select(root).select('#my-viz');
    if (step === 1) { /* transition to state 1 */ }
    if (step === 2) { /* transition to state 2 */ }
  }
};
```

---

## Asset Handling

The user has a folder of images. Guidance for how to use each format:

- **SVG (preferred for plots, diagrams, schematics).** Inline the SVG directly into the slide's `html` string when you need to animate parts of it. Reference via `<img src="assets/foo.svg">` when it is static.
- **PNG/JPG.** Reference via `<img>`. Fine for photos, brain renders, screenshots, anything not being animated piecewise.
- **PDF.** Convert to SVG (e.g. `pdftocairo -svg foo.pdf foo.svg` or `inkscape foo.pdf --export-type=svg`) before using, especially if any part needs to animate. A PDF embedded via `<embed>` or `<iframe>` will work for static display but cannot be animated and looks inconsistent.

If a slide needs an animated chart and the source is a PNG, the chart needs to be rebuilt as inline SVG or in HTML/CSS. There is no shortcut around this.

---

## Running Locally

Modules require an HTTP server. From the deck folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in Chrome or Firefox. Press `F` to enter fullscreen for presenting.

For presenting:

- Disable system display sleep and screensaver beforehand (macOS: `caffeinate -d` in a terminal; or use Amphetamine).
- Test on the actual projector resolution if possible. The CSS scales slides designed at 1920x1080 to fit any aspect ratio, but verifying once is cheap insurance.
- Close other apps and notifications.

---

## Build Order (Suggested First Tasks for Claude Code)

1. Create the project structure above.
2. Drop in the `index.html`, `shell.js`, and `styles.css` starter code verbatim.
3. Create `slides/01-title.js` with a minimal title slide (no steps) to verify the shell works.
4. Create `slides/02-example.js` with three `.step` paragraphs to verify the step reveal works.
5. Create a third example slide with an inline SVG bar chart animating bars one at a time, to verify the SVG animation pattern works.
6. Once those three render correctly and arrow-key navigation feels smooth, start porting actual content slides one at a time.

Each subsequent slide is just a new file in `slides/` plus one line in the `SLIDES` array.

---

## Things to Keep in Mind

- Slides are designed at logical 1920x1080 and scaled. Do not use viewport units (`vw`, `vh`) inside slide markup; use pixels at the 1920x1080 scale.
- Never reload the page during presenting. All state lives in memory and a refresh resets to slide 1.
- If you add npm-style dependencies, prefer ESM CDN imports (`https://cdn.jsdelivr.net/npm/PACKAGE/+esm`) so the no-build-step constraint holds.
- For accessibility during the talk itself: nothing is required, but if you want the deck to be navigable later, add `aria-current` and slide titles to the `<section>` elements.
- Keep slide files short. If one slide's module exceeds ~150 lines, consider whether the animation logic should be factored into a helper file in a new `lib/` directory.

---

## What Not to Do

- Do not put `<html>`, `<head>`, or `<body>` tags inside slide files. Slides are HTML fragments, not full documents.
- Do not use `<form>` elements for slide interactions (they intercept Enter keypresses in confusing ways).
- Do not load slides ahead of time. The dynamic `import()` approach means each slide is fetched lazily, which keeps the initial load instant.
- Do not animate by setting `style.left` or similar. Use CSS class toggles and let the transition handle the rest. This stays performant and is easy to debug.
