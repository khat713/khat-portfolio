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
// STACKED SCROLL — project cards fan (portfolio)
// ============================================

function initStackedScroll() {
  const section = document.getElementById('stackedShowcase');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('.stack-card'));
  const n     = cards.length;

  // Earlier cards shrink more; last card never shrinks
  const targetScales = cards.map((_, i) =>
    Math.max(0.60, 1 - (n - i - 1) * 0.08)
  );

  function update() {
    const rect      = section.getBoundingClientRect();
    const scrolled  = -rect.top;
    const scrollable = rect.height - window.innerHeight;
    if (scrollable <= 0) return;

    const progress = Math.max(0, Math.min(1, scrolled / scrollable));

    cards.forEach((card, i) => {
      const start  = i / n;
      const cardP  = Math.max(0, Math.min(1, (progress - start) / (1 - start)));
      const scale  = 1 - cardP * (1 - targetScales[i]);
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
