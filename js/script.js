/* ================================================
   ZEROTH GAMING — JavaScript
   Particles · Counters · Scroll Animations
   ================================================ */

'use strict';

/* Background Particle System removed */

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

/* Fiery Embers removed */

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
      background: linear-gradient(135deg, #7c3aed, #ec4899);
      display:flex; align-items:center; justify-content:center;
      font-size:2.8rem; font-weight:900; color:#fff;
      position:relative; z-index:2;
      box-shadow: 0 8px 24px rgba(124, 58, 237, 0.3);
      border: 3px solid rgba(255, 255, 255, 0.2);
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

/* Cursor glow removed */


/* ---- Order Modal & Bulletproof Submission ---- */
(function initOrderProcess() {
  const modal = document.getElementById('orderModal');
  const closeBtn = document.getElementById('orderModalClose');
  const orderForm = document.getElementById('orderForm');
  const formView = document.getElementById('orderFormView');
  const confirmView = document.getElementById('orderConfirmView');
  const submitBtn = document.getElementById('orderSubmitBtn');
  
  const serviceBadge = document.getElementById('orderServiceBadge');
  const serviceNameText = document.getElementById('orderServiceName');
  const servicePriceText = document.getElementById('orderServicePrice');
  
  const ADMIN_EMAIL = 'sauravniroula54@gmail.com';

  document.querySelectorAll('.shop-card-btn-premium').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.shop-card-premium-v2');
      const title = card.querySelector('.card-title').textContent;
      const isPC = title.includes('PC');
      const priceText = card.querySelector('.curr-price').textContent;
      
      serviceNameText.textContent = title;
      if (servicePriceText) servicePriceText.textContent = priceText;
      serviceBadge.className = `order-service-badge ${isPC ? 'pc' : 'edit'}`;
      
      orderForm.reset();
      formView.hidden = false;
      confirmView.hidden = true;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeModal);
  document.getElementById('orderDoneBtn')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  orderForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validation
    const inputs = orderForm.querySelectorAll('input[required]');
    let isValid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) { input.classList.add('input-error'); isValid = false; } 
      else { input.classList.remove('input-error'); }
    });
    if (!isValid) return;

    // Loading State
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Dispatching Order...';

    const formData = new FormData(orderForm);
    const orderId = 'ZE' + "123456789ABCDEF".charAt(Math.floor(Math.random() * 15));
    const timestamp = new Date().toLocaleString();

    // Prepare FormSubmit Data
    const data = {
      "Order ID": orderId,
      "Service": serviceNameText.textContent,
      "Amount": servicePriceText.textContent,
      "Client Name": formData.get('name'),
      "Email": formData.get('email'),
      "WhatsApp": formData.get('phone'),
      "Details": formData.get('notes') || 'None',
      "Time": timestamp,
      "_subject": `Order Received: ${orderId} - ${formData.get('name')}`,
      "_template": "table",
      "_captcha": "false"
    };

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        document.getElementById('confirmOrderId').textContent = orderId;
        document.getElementById('confirmName').textContent = data["Client Name"];
        document.getElementById('confirmEmail').textContent = data["Email"];
        document.getElementById('confirmService').textContent = data["Service"];
        document.getElementById('confirmTime').textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        const confirmPrice = document.getElementById('confirmServicePrice');
        if (confirmPrice) confirmPrice.textContent = data["Service Price"] || data["Amount"] || servicePriceText.textContent;

        formView.hidden = true;
        confirmView.hidden = false;
      } else {
        throw new Error("Dispatch failed.");
      }
    } catch (error) {
      console.error('System error:', error);
      alert('Network Error. Please try again or contact via Instagram.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
})();
