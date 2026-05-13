const SLIDES = [
  '01-title',
  '02-alignment',
  '03-takeaway',
  '04-thanks',
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
    setTimeout(() => old.remove(), 480);
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

  setTimeout(() => { transitioning = false; }, 480);
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
  const currentSlide = String(slideIndex + 1).padStart(2, '0');
  const totalSlides = String(SLIDES.length).padStart(2, '0');
  progress.textContent = `${currentSlide} / ${totalSlides}`;
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
