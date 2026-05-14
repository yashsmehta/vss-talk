const TILE_SIZE = 160;
const TILE_GAP = 28;

function dotCluster(n) {
  const pad = 16;
  const inner = TILE_SIZE - 2 * pad;
  const cell = inner / n;
  const r = n === 1 ? 46 : cell * 0.32;
  const dots = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const cx = pad + cell * (i + 0.5);
      const cy = pad + cell * (j + 0.5);
      dots.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}"/>`);
    }
  }
  return dots.join('');
}

const HERO_LAYOUT = [
  { n: 1, col: 0, row: 0 },
  { n: 2, col: 1, row: 0 },
  { n: 4, col: 0, row: 1 },
  { n: 8, col: 1, row: 1 },
];

const HERO_TOTAL = TILE_SIZE * 2 + TILE_GAP;

const heroMotif = `
  <svg class="hero-motif"
       viewBox="0 0 ${HERO_TOTAL} ${HERO_TOTAL}"
       xmlns="http://www.w3.org/2000/svg"
       aria-hidden="true">
    ${HERO_LAYOUT.map(({ n, col, row }) => `
      <g transform="translate(${col * (TILE_SIZE + TILE_GAP)}, ${row * (TILE_SIZE + TILE_GAP)})">
        <g class="hero-dots">${dotCluster(n)}</g>
      </g>
    `).join('')}
  </svg>
`;

export default {
  html: `
    <section class="slide title-slide">
      <header class="title-header">
        <p class="eyebrow">Vision Sciences Society <span class="eyebrow-sep">/</span> 2026</p>
      </header>

      <div class="title-stage">
        <span class="title-spine" aria-hidden="true"></span>

        <h1 class="title-h1">
          An extremely coarse<br>
          feedback signal<br>
          <span class="title-quiet">for learning human-aligned<br>
          visual representations</span>
        </h1>

        <aside class="title-hero" aria-hidden="true">
          ${heroMotif}
          <p class="hero-caption">
            <span class="hero-num">1</span>
            <span class="hero-sep">·</span>
            <span class="hero-num">4</span>
            <span class="hero-sep">·</span>
            <span class="hero-num">16</span>
            <span class="hero-sep">·</span>
            <span class="hero-num">64</span>
            <span class="hero-axis">categories</span>
          </p>
        </aside>
      </div>

      <footer class="title-meta">
        <div class="author-block">
          <p class="author-name">Yash Mehta</p>
          <p class="author-affil">Bonner Lab <span class="dim">·</span> Cognitive Science</p>
          <img class="jhu-mark" src="images/jhu-wordmark.svg" alt="Johns Hopkins University">
        </div>

        <figure class="qr">
          <figcaption>yashmehta.com</figcaption>
          <img src="images/qr-code.svg" alt="QR code linking to author website">
        </figure>
      </footer>
    </section>
  `,
};
