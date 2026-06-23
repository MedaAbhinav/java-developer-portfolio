
/* ===================================================
   ABHINAV MEDA PORTFOLIO - script.js
   Premium Personal Portfolio | JavaScript
   =================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── LOADING SCREEN ── */
  const loader = document.getElementById('loader');
  setTimeout(() => { loader.classList.add('hidden'); }, 2400);

  /* ── CUSTOM CURSOR ── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function lerp() {
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(lerp);
    })();
    document.querySelectorAll('a,button,.btn,.tilt-card,.project-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
  }

  /* ── SCROLL PROGRESS BAR ── */
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const st = window.scrollY;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (dh > 0 ? (st / dh) * 100 : 0) + '%';
  }, { passive: true });

  /* ── NAVBAR SCROLL STYLE ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  /* ── HAMBURGER MENU ── */
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ── THEME TOGGLE ── */
  const themeBtn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(saved);
  themeBtn.addEventListener('click', () => {
    const next = document.body.classList.contains('light-theme') ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('portfolio-theme', next);
  });
  function applyTheme(t) {
    document.body.classList.toggle('light-theme', t === 'light');
    document.body.setAttribute('data-theme', t);
  }

  /* ── TYPEWRITER ── */
  const tw    = document.getElementById('typewriter');
  const roles = ['Java Developer', 'Spring Boot Developer', 'Backend Developer', 'Java Engineer'];
  let ri = 0, ci = 0, deleting = false;
  function typeWriter() {
    const current = roles[ri];
    if (deleting) {
      ci--;
    } else {
      ci++;
    }
    tw.textContent = current.substring(0, ci);
    let delay = deleting ? 60 : 110;
    if (!deleting && ci === current.length) { delay = 2000; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 300; }
    setTimeout(typeWriter, delay);
  }
  setTimeout(typeWriter, 2600);

  /* ── PARTICLE CANVAS ── */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.r  = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.a  = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${this.a})`; ctx.fill();
      }
    }
    for (let i = 0; i < 70; i++) particles.push(new Particle());
    (function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    })();
  }

  /* ── INTERSECTION OBSERVER: SCROLL REVEALS ── */
  const revealEls = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.zoom-in');
  const observer  = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));

  /* ── ACTIVE NAV HIGHLIGHT ── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');
  const secObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinkEls.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[data-section="${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => secObserver.observe(s));

  /* ── ANIMATED COUNTERS ── */
  const counters = document.querySelectorAll('.counter');
  const ctrObs   = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        ctrObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => ctrObs.observe(c));
  function animateCounter(el) {
    const target = +el.dataset.target, duration = 1600;
    const start  = performance.now();
    (function update(now) {
      const elapsed = now - start;
      const prog    = Math.min(elapsed / duration, 1);
      const ease    = 1 - Math.pow(1 - prog, 3);
      el.textContent = Math.round(ease * target);
      if (prog < 1) requestAnimationFrame(update);
    })(start);
  }

  /* ── SKILL BAR ANIMATIONS ── */
  const bars    = document.querySelectorAll('.skill-bar-fill');
  const barObs  = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width + '%';
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => barObs.observe(b));

  /* ── PROJECT CARD TILT ── */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x  = e.clientX - rect.left - rect.width  / 2;
      const y  = e.clientY - rect.top  - rect.height / 2;
      const rx = -(y / rect.height) * 10;
      const ry =  (x / rect.width)  * 10;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── MAGNETIC BUTTONS ── */
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx   = e.clientX - (rect.left + rect.width  / 2);
      const dy   = e.clientY - (rect.top  + rect.height / 2);
      btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ── CURSOR GLOW ON HERO ── */
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      hero.style.setProperty('--glow-x', x + 'px');
      hero.style.setProperty('--glow-y', y + 'px');
    });
  }

  /* ── BACK TO TOP ── */
  const btt = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── SMOOTH SCROLL FOR NAV LINKS ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── BUTTON RIPPLE ── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const circle = document.createElement('span');
      const d = Math.max(this.clientWidth, this.clientHeight);
      const rect = this.getBoundingClientRect();
      circle.style.cssText = `
        position:absolute; width:${d}px; height:${d}px; border-radius:50%;
        background:rgba(255,255,255,0.3); pointer-events:none; z-index:10;
        left:${e.clientX - rect.left - d/2}px; top:${e.clientY - rect.top - d/2}px;
        transform:scale(0); animation:ripple 0.5s linear;
      `;
      if (!this.style.position) this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 500);
    });
  });

  /* ── RING FILL ANIMATION for Language SVGs ── */
  const ringObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fills = e.target.querySelectorAll('.ring-fill');
        fills.forEach(f => {
          const target = +f.dataset.pct;
          f.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)';
          const initial = 314;
          const offset  = initial - target;
          f.setAttribute('stroke-dashoffset', offset);
        });
        ringObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.lang-card').forEach(c => {
    /* set initial dashoffset high so animation plays forward */
    c.querySelectorAll('.ring-fill').forEach(f => {
      f.setAttribute('stroke-dashoffset', '314');
    });
    ringObs.observe(c);
  });

}); /* end DOMContentLoaded */

/* ── CSS RIPPLE KEYFRAME (injected once) ── */
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes ripple { to { transform: scale(2); opacity: 0; } }';
document.head.appendChild(rippleStyle);

