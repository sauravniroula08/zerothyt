/* ================================================
   ZEROTH GAMING — JavaScript
   Particles · Counters · Scroll Animations
   ================================================ */

'use strict';

/* ---- Particle System ---- */
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const PARTICLE_COUNT = 60;
  const COLORS = ['rgba(124,58,237,', 'rgba(236,72,153,', 'rgba(167,139,250,', 'rgba(196,181,253,'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });

    // Draw lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${0.05 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
})();

/* ---- Intersection Observer — Fade in items ---- */
(function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in-item').forEach(el => observer.observe(el));
})();

/* ---- Counter Animation ---- */
(function initCounters() {
  const counterCards = document.querySelectorAll('.counter-card');
  let triggered = false;

  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function animateCounter(el, target, suffix, duration = 2000) {
    const numEl = el.querySelector('.counter-number');
    if (!numEl) return;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = target * eased;

      // Format the number
      let display;
      if (suffix === 'M') {
        display = current.toFixed(current < 10 ? 1 : 0) + 'M';
      } else if (suffix === 'K') {
        display = Math.round(current) + 'K';
      } else {
        display = Math.round(current).toLocaleString();
      }
      numEl.textContent = display;

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterConfig = [
    { id: 'counterYT',    target: 4.7,  suffix: 'M' },
    { id: 'counterIG',    target: 1.2,  suffix: 'M' },
    { id: 'counterViews', target: 45,   suffix: 'M' },
    { id: 'counterTT',    target: 250,  suffix: 'K' },
  ];

  const observer = new IntersectionObserver((entries) => {
    if (triggered) return;
    const ent = entries[0];
    if (ent.isIntersecting) {
      triggered = true;
      counterConfig.forEach(c => {
        const el = document.getElementById(c.id);
        if (el) animateCounter(el, c.target, c.suffix);
      });
      // Start live sub tick
      setTimeout(initLiveSubTick, 2500);
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  function initLiveSubTick() {
    const ytEl = document.getElementById('counterYT')?.querySelector('.counter-number');
    if (!ytEl) return;
    setInterval(() => {
      let current = parseFloat(ytEl.textContent);
      if (isNaN(current)) return;
      // Random sub increase
      if (Math.random() > 0.8) {
        current += 0.1;
        ytEl.textContent = current.toFixed(1) + 'M';
      }
    }, 4000);
  }

  const analyticsSection = document.getElementById('analytics');
  if (analyticsSection) observer.observe(analyticsSection);
})();

/* ---- Mobile Nav Active State ---- */
(function initMobileNav() {
  const sections = [
    { navId: 'navProfile',  sectionId: 'sidebar' },
    { navId: 'navSocial',   sectionId: 'socialHub' },
    { navId: 'navShop',     sectionId: 'officialShop' },
    { navId: 'navStats',    sectionId: 'analytics' },
    { navId: 'navConnect',  sectionId: 'collaborate' },
  ];

  // Smooth scroll for mobile nav links
  sections.forEach(({ navId, sectionId }) => {
    const navEl = document.getElementById(navId);
    if (!navEl) return;
    navEl.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(navId);
      }
    });
  });

  function setActive(id) {
    document.querySelectorAll('.mobile-nav-item').forEach(el => el.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  // Update active on scroll
  const sectionEls = sections.map(s => ({
    navId: s.navId,
    el: document.getElementById(s.sectionId),
  })).filter(s => s.el);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY + window.innerHeight / 3;
      let activeId = sections[0].navId;
      sectionEls.forEach(({ navId, el }) => {
        if (el.offsetTop <= scrollY) activeId = navId;
      });
      setActive(activeId);
      ticking = false;
    });
  });
})();

/* ---- Fiery Embers Generator ---- */
(function initEmbers() {
  const container = document.getElementById('emberArea');
  if (!container) return;
  
  function createEmber() {
    const ember = document.createElement('div');
    ember.className = 'ember-particle';
    
    // Randomize
    const size = Math.random() * 4 + 2;
    const startX = Math.random() * 100;
    const duration = Math.random() * 3 + 4;
    const delay = Math.random() * 5;
    
    ember.style.width = `${size}px`;
    ember.style.height = `${size}px`;
    ember.style.left = `${startX}%`;
    ember.style.animationDuration = `${duration}s`;
    ember.style.animationDelay = `-${delay}s`; // Negative delay for immediate start
    
    container.appendChild(ember);
    
    // Cleanup
    setTimeout(() => {
      ember.remove();
      createEmber(); // Replace
    }, (duration + delay) * 1000);
  }
  
  // Initial spawn
  for (let i = 0; i < 30; i++) {
    createEmber();
  }
})();

/* ---- Shake Keyframe (inject via JS) ---- */
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ---- Button Ripple Effect ---- */
(function initRipple() {
  document.querySelectorAll('.social-btn, .cta-primary-btn, .cta-secondary-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        background:rgba(255,255,255,0.12);
        transform:scale(0); animation:rippleAnim 0.6s ease forwards;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

/* ---- Profile image fallback ---- */
(function initProfileFallback() {
  const img = document.getElementById('profileImg');
  if (!img) return;
  img.addEventListener('error', () => {
    img.style.display = 'none';
    const wrapper = img.parentElement;
    const fallback = document.createElement('div');
    fallback.style.cssText = `
      width:110px; height:110px; border-radius:50%;
      background: linear-gradient(135deg, #7c3aed, #3b82f6);
      display:flex; align-items:center; justify-content:center;
      font-size:2.5rem; font-weight:800; color:#fff;
      position:relative; z-index:2;
    `;
    fallback.textContent = 'Z';
    wrapper.insertBefore(fallback, img);
  });
})();

/* ---- Stagger section appear on load ---- */
(function initLoadAnimations() {
  const sections = document.querySelectorAll('.section');
  sections.forEach((section, i) => {
    section.style.animationDelay = `${i * 0.1}s`;
  });
})();

/* ---- Tilt effect on counter & project cards ---- */
(function initTilt() {
  const cards = document.querySelectorAll('.counter-card, .project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ---- Back to Top & Scroll Down Logic ---- */
(function initNavigationHelpers() {
  // Back to Top
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
      }
    });
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll Down Arrow
  const scrollDownBtn = document.getElementById('scrollDown');
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('socialHub');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
})();

/* ---- Cursor glow (desktop only) ---- */
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; width:300px; height:300px; border-radius:50%;
    background:radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%);
    pointer-events:none; z-index:0; transition:transform 0.1s ease;
    transform:translate(-50%, -50%);
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

/* ---- Order Form Modal ---- */
(function initOrderModal() {
  const overlay    = document.getElementById('orderModal');
  const closeBtn   = document.getElementById('orderModalClose');
  const doneBtn    = document.getElementById('orderDoneBtn');
  const form       = document.getElementById('orderForm');
  const formView   = document.getElementById('orderFormView');
  const confirmView= document.getElementById('orderConfirmView');
  const serviceNameEl = document.getElementById('orderServiceName');
  const serviceBadgeIcon = document.querySelector('#orderServiceBadge i');

  if (!overlay) return;

  const serviceMap = {
    'pc-btn':  { name: 'PC OPTIMIZATION MAX',    icon: 'fas fa-microchip' },
    'luxury':  { name: 'YT SHORTS EDITING TIPS', icon: 'fas fa-film' },
  };

  let currentService = 'PC OPTIMIZATION MAX';

  function openModal(serviceKey) {
    const svc = serviceMap[serviceKey] || serviceMap['pc-btn'];
    currentService = svc.name;
    if (serviceNameEl) serviceNameEl.textContent = svc.name;
    if (serviceBadgeIcon) serviceBadgeIcon.className = svc.icon;

    form.reset();
    form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('input-error'));
    formView.hidden = false;
    confirmView.hidden = true;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Hook BUY NOW buttons
  document.querySelectorAll('.shop-card-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const key = [...btn.classList].find(c => c !== 'shop-card-btn') || 'pc-btn';
      openModal(key);
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  doneBtn?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const nameEl  = document.getElementById('orderName');
    const emailEl = document.getElementById('orderEmail');
    const phoneEl = document.getElementById('orderPhone');

    let valid = true;
    [nameEl, emailEl, phoneEl].forEach(field => {
      field.classList.remove('input-error');
      if (!field.value.trim()) { field.classList.add('input-error'); valid = false; }
    });
    if (!valid) { form.querySelector('.input-error')?.focus(); return; }

    // Build confirmation
    const orderId = 'ZG-' + Date.now().toString(36).toUpperCase().slice(-6);
    const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

    document.getElementById('confirmOrderId').textContent  = orderId;
    document.getElementById('confirmName').textContent     = nameEl.value.trim();
    document.getElementById('confirmEmail').textContent    = emailEl.value.trim();
    document.getElementById('confirmPhone').textContent    = phoneEl.value.trim();
    document.getElementById('confirmService').textContent  = currentService;
    document.getElementById('confirmTime').textContent     = now;

    formView.hidden = true;
    confirmView.hidden = false;
    overlay.querySelector('.order-modal').scrollTop = 0;
  });
})();

