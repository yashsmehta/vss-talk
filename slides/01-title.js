const TILE_SIZE = 145;
const TILE_GAP = 28;

function dotCluster(rows, cols) {
  const pad = 16;
  const inner = TILE_SIZE - 2 * pad;
  const cellW = inner / cols;
  const cellH = inner / rows;
  const cellMin = Math.min(cellW, cellH);
  const r = Math.max(3, cellMin * 0.36);
  const dots = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const cx = pad + cellW * (i + 0.5);
      const cy = pad + cellH * (j + 0.5);
      dots.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}"/>`);
    }
  }
  return dots.join('');
}

const HERO_LAYOUT = [
  { rows: 8, cols: 8, col: 0, row: 0 },
  { rows: 4, cols: 4, col: 1, row: 0 },
  { rows: 2, cols: 2, col: 1, row: 1 },
  { rows: 1, cols: 2, col: 1, row: 2 },
];

const HERO_W = TILE_SIZE * 2 + TILE_GAP;
const HERO_H = TILE_SIZE * 3 + TILE_GAP * 2;

const heroMotif = `
  <svg class="hero-motif"
       viewBox="0 0 ${HERO_W} ${HERO_H}"
       xmlns="http://www.w3.org/2000/svg"
       aria-hidden="true">
    ${HERO_LAYOUT.map(({ rows, cols, col, row }) => `
      <g transform="translate(${col * (TILE_SIZE + TILE_GAP)}, ${row * (TILE_SIZE + TILE_GAP)})">
        <g class="hero-dots">${dotCluster(rows, cols)}</g>
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
            <span class="hero-num">64</span>
            <span class="hero-sep">·</span>
            <span class="hero-num">16</span>
            <span class="hero-sep">·</span>
            <span class="hero-num">4</span>
            <span class="hero-sep">·</span>
            <span class="hero-num">2</span>
          </p>
        </aside>
      </div>

      <footer class="title-meta">
        <div class="author-block">
          <p class="author-name">Yash S. Mehta</p>
          <p class="author-affil">coarse categorization</p>
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
