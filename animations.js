// ============================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================

function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-up, .fade-in, .fade-left, .fade-right, .scale-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

// ============================================
// TYPEWRITER EFFECT
// ============================================

function initTypewriter(el, words, typingSpeed, pauseMs, deleteSpeed) {
  if (!el) return;
  let wordIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const word = words[wordIdx];
    if (deleting) {
      el.textContent = word.slice(0, --charIdx);
    } else {
      el.textContent = word.slice(0, ++charIdx);
    }

    let delay = deleting ? deleteSpeed : typingSpeed;
    if (!deleting && charIdx === word.length) {
      delay = pauseMs;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  }
  tick();
}

// ============================================
// SEASONAL BACKGROUND TRANSITION
// Fall -> Spring as user scrolls down
// ============================================

function initSeasonalBackground() {
  const autumn = document.querySelector('.scene-autumn');
  const spring = document.querySelector('.scene-spring');
  if (!autumn || !spring) return;

  function update() {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    if (total <= 0) return;

    const fraction = scrolled / total;
    const progress = Math.max(0, Math.min(1, (fraction - 0.10) / 0.55));

    autumn.style.opacity = String(1 - progress);
    spring.style.opacity = String(progress);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ============================================
// NAVBAR SCROLL BEHAVIOR
// ============================================

function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// ============================================
// IPAD CONTAINER SCROLL — home page "What I Do"
// ============================================

function initContainerScroll() {
  const section = document.getElementById('highlightsSection');
  const frame   = document.getElementById('ipadFrame');
  if (!section || !frame) return;

  function update() {
    const rect = section.getBoundingClientRect();
    const wh   = window.innerHeight;
    // Starts tilted when section enters from below, fully flat when section top hits viewport top
    const raw  = 1 - Math.max(0, rect.top) / wh;
    const p    = Math.max(0, Math.min(1, raw));

    const rotX = 20 * (1 - p);     // 20deg → 0deg
    const sc   = 1.05 - 0.05 * p;  // 1.05 → 1.00
    frame.style.transform = `rotateX(${rotX}deg) scale(${sc})`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ============================================
// STACKED SCROLL — sticky card stack (portfolio)
// Each row is independently sticky; cards scale
// down from top as new cards join behind them.
// ============================================

function initStackedScroll() {
  const section = document.getElementById('stackedShowcase');
  if (!section) return;

  const rows  = Array.from(section.querySelectorAll('.stack-card-row'));
  const cards = rows.map(r => r.querySelector('.stack-card'));
  const n     = cards.length;
  if (n === 0) return;

  // Later rows sit on top
  rows.forEach((row, i) => { row.style.zIndex = String(i + 1); });

  // Vertical offset: each card peeks 15px below the previous
  // (mirrors 21st.dev: top = calc(-5vh + i * 15 + 200px))
  cards.forEach((card, i) => {
    card.style.top = `calc(-5vh + ${i * 15 + 200}px)`;
  });

  function update() {
    const rect      = section.getBoundingClientRect();
    const scrolled  = -rect.top;
    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const progress = Math.max(0, Math.min(1, scrolled / scrollable));

    cards.forEach((card, i) => {
      const rangeStart = i / n;
      const rangeLen   = 1 - rangeStart;
      const localProg  = Math.max(0, Math.min(1, (progress - rangeStart) / rangeLen));

      // Card 0 scales the most; last card never scales
      const targetScale = Math.max(0.6, 1 - (n - i - 1) * 0.08);
      const scale       = 1 - localProg * (1 - targetScale);

      card.style.transform = `scale(${scale})`;
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initNavbar();
  initSeasonalBackground();
  initContainerScroll();
  initStackedScroll();

  const typeEl = document.querySelector('.typewriter-text');
  if (typeEl) {
    initTypewriter(
      typeEl,
      ['Instructional Designer', 'EdTech Innovator', 'Curriculum Developer', 'Graduate Researcher @ UNC', 'Educational Technologist'],
      75, 2400, 40
    );
  }
});
