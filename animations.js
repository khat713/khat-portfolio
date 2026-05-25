// ============================================
// PARTICLE NETWORK CANVAS ANIMATION
// ============================================

class ParticleNetwork {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 140 };
    this.animId = null;
    this.resize();
    this.spawnParticles();
    this.bindEvents();
    this.animate();
  }

  particleCount() {
    return window.innerWidth < 600 ? 40 : window.innerWidth < 1024 ? 65 : 100;
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawnParticles() {
    this.particles = [];
    const count = this.particleCount();
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this));
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.spawnParticles();
    });
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  drawConnections() {
    const maxDist = 130;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.35;
          this.ctx.strokeStyle = `rgba(124, 107, 255, ${alpha})`;
          this.ctx.lineWidth = 0.7;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => { p.update(); p.draw(); });
    this.drawConnections();
    this.animId = requestAnimationFrame(() => this.animate());
  }
}

class Particle {
  constructor(network) {
    this.network = network;
    this.reset(true);
  }

  reset(initial) {
    const c = this.network.canvas;
    this.x = Math.random() * c.width;
    this.y = initial ? Math.random() * c.height : (Math.random() < 0.5 ? -5 : c.height + 5);
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = (Math.random() - 0.5) * 0.45;
    this.radius = Math.random() * 1.8 + 0.8;
    this.baseOpacity = Math.random() * 0.45 + 0.25;
    this.opacity = this.baseOpacity;
    const palette = ['124,107,255', '168,85,247', '99,102,241', '139,92,246', '245,158,11'];
    this.color = palette[Math.floor(Math.random() * palette.length)];
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
    this.pulseOffset = Math.random() * Math.PI * 2;
  }

  update() {
    const c = this.network.canvas;
    this.x += this.vx;
    this.y += this.vy;

    this.pulseOffset += this.pulseSpeed;
    this.opacity = this.baseOpacity + Math.sin(this.pulseOffset) * 0.1;

    if (this.x < -10 || this.x > c.width + 10 || this.y < -10 || this.y > c.height + 10) {
      this.reset(false);
    }

    const m = this.network.mouse;
    if (m.x !== null && m.y !== null) {
      const dx = this.x - m.x;
      const dy = this.y - m.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < m.radius) {
        const force = (m.radius - dist) / m.radius;
        this.x += (dx / dist) * force * 1.8;
        this.y += (dy / dist) * force * 1.8;
      }
    }
  }

  draw() {
    const ctx = this.network.ctx;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

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
// ============================================

function initSeasonalBackground() {
  const autumn = document.querySelector('.scene-autumn');
  const spring = document.querySelector('.scene-spring');
  if (!autumn || !spring) return;

  function update() {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    if (total <= 0) return;

    // Transition from fall to spring between 10% and 65% of page scroll
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
  const canvas = document.getElementById('particle-canvas');
  if (canvas) new ParticleNetwork(canvas);

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
