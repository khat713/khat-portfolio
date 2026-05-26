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
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initNavbar();
  initSeasonalBackground();

  const typeEl = document.querySelector('.typewriter-text');
  if (typeEl) {
    initTypewriter(
      typeEl,
      ['Instructional Designer', 'EdTech Innovator', 'Curriculum Developer', 'Graduate Researcher @ UNC', 'Educational Technologist'],
      75, 2400, 40
    );
  }
});
