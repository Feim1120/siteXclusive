/**
 * siteXclusive — Core Site Script v2
 * Cursor dot/ring · scroll progress · parallax · scroll reveal
 * 3D tilt · magnetic buttons · counters · smooth scroll · sticky header
 * mobile menu · FAQ accordion · contact form · cookie consent
 */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 900px)').matches;

  /* ========================================================================
     Page Transition
     ======================================================================== */
  function initPageTransition() {
    const overlay = document.getElementById('page-transition');
    if (!overlay) return;
    requestAnimationFrame(() => setTimeout(() => overlay.classList.add('loaded'), 350));
    setTimeout(() => { overlay.style.display = 'none'; }, 1100);
  }

  /* ========================================================================
     Ambient Mouse Glow — a soft ice-blue light that follows the pointer
     across dark background areas. No cursor dot/ring at all.
     ======================================================================== */
  function initCursor() {
    // Remove any legacy cursor visuals
    ['cursor-dot', 'cursor-ring'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
    document.body.classList.remove('cursor-visible');

    if (prefersReduced || isMobile) return;

    const host = document.querySelector('.ambient') || document.body;
    const glow = document.createElement('div');
    glow.id = 'bg-glow';
    glow.setAttribute('aria-hidden', 'true');
    host.appendChild(glow);

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let gx = mx, gy = my, animating = false;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      glow.style.opacity = '1';
      if (!animating) { animating = true; requestAnimationFrame(tick); }
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

    function tick() {
      gx += (mx - gx) * 0.1;
      gy += (my - gy) * 0.1;
      glow.style.setProperty('--gx', gx + 'px');
      glow.style.setProperty('--gy', gy + 'px');
      if (Math.abs(mx - gx) > 0.5 || Math.abs(my - gy) > 0.5) {
        requestAnimationFrame(tick);
      } else {
        animating = false;
      }
    }
  }

  /* ========================================================================
     Scroll Progress
     ======================================================================== */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;
    function update() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ========================================================================
     Parallax
     ======================================================================== */
  function initParallax() {
    if (prefersReduced) return;
    const layers = document.querySelectorAll('[data-parallax]');
    if (!layers.length) return;
    let scrollY = 0, mouseX = 0, mouseY = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
    if (!isMobile) {
      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth  - 0.5;
        mouseY = e.clientY / window.innerHeight - 0.5;
      });
    }
    (function tick() {
      layers.forEach((el) => {
        const s = parseFloat(el.dataset.parallax) || 0.05;
        el.style.transform = `translate(${mouseX*s*80}px, ${scrollY*s + mouseY*s*40}px)`;
      });
      requestAnimationFrame(tick);
    })();
  }

  /* ========================================================================
     Scroll Reveal
     ======================================================================== */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (prefersReduced) {
      reveals.forEach((el) => el.classList.add('is-visible'));
      document.querySelectorAll('.hero__title-line').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    if (reveals.length) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
      reveals.forEach((el) => obs.observe(el));
    }
    document.querySelectorAll('.hero__title-line').forEach((line, i) => {
      setTimeout(() => line.classList.add('is-visible'), 500 + i * 180);
    });
  }

  /* ========================================================================
     3D Card Tilt
     ======================================================================== */
  function initTilt() {
    if (prefersReduced || isMobile) return;
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r  = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -5;
        const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  5;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ========================================================================
     Magnetic Buttons
     ======================================================================== */
  function initMagnetic() {
    if (prefersReduced || isMobile) return;
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', `${(e.clientX - r.left - r.width  / 2) * 0.25}px`);
        btn.style.setProperty('--my', `${(e.clientY - r.top  - r.height / 2) * 0.25}px`);
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--mx', '0px');
        btn.style.setProperty('--my', '0px');
      });
    });
  }

  /* ========================================================================
     Counters
     ======================================================================== */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const animate = (el) => {
      const target   = parseInt(el.dataset.count, 10);
      const suffix   = el.dataset.suffix || '';
      const prefix   = el.dataset.prefix || '';
      const duration = 1800;
      const start    = performance.now();
      (function step(now) {
        const p     = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => obs.observe(el));
  }

  /* ========================================================================
     Smooth Scroll (in-page anchors)
     ======================================================================== */
  function initSmoothScroll() {
    const h = document.getElementById('site-header');
    const offset = h ? h.offsetHeight : 80;
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        history.pushState(null, '', id);
      });
    });
  }

  /* ========================================================================
     Sticky Header + Active Nav
     ======================================================================== */
  function initHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;
    let ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 50);
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    if (sections.length && navLinks.length) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = '#' + entry.target.id;
            navLinks.forEach((link) => {
              if (link.getAttribute('href').startsWith('#')) {
                link.classList.toggle('is-active', link.getAttribute('href') === id);
              }
            });
          }
        });
      }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });
      sections.forEach((s) => obs.observe(s));
    }
  }

  /* ========================================================================
     Mobile Menu
     ======================================================================== */
  function initMobileMenu() {
    const nav     = document.getElementById('site-nav');
    const toggle  = document.getElementById('nav-toggle');
    const overlay = document.getElementById('nav-overlay');
    if (!nav || !toggle) return;

    const open = () => {
      nav.classList.add('is-open');
      toggle.classList.add('is-open');
      if (overlay) overlay.classList.add('is-visible');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Menü schließen');
      document.body.classList.add('nav-open');
    };
    const close = () => {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-visible');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Menü öffnen');
      document.body.classList.remove('nav-open');
    };

    toggle.addEventListener('click', () => nav.classList.contains('is-open') ? close() : open());
    if (overlay) overlay.addEventListener('click', close);
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => { if (window.innerWidth <= 900) close(); });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) close();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && nav.classList.contains('is-open')) close();
    });
  }

  /* ========================================================================
     Nav Dropdown (keyboard + mobile touch support)
     ======================================================================== */
  function initNavDropdown() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item) => {
      const dropdown = item.querySelector('.nav-dropdown');
      if (!dropdown) return;
      const trigger = item.querySelector('.nav-link');

      // Mobile / touch: toggle on click
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          if (window.innerWidth <= 900) {
            e.preventDefault();
            const isOpen = item.classList.contains('dropdown-open');
            navItems.forEach((i) => i.classList.remove('dropdown-open'));
            if (!isOpen) item.classList.add('dropdown-open');
          }
        });
      }

      // Keyboard: Escape closes dropdown
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          item.classList.remove('dropdown-open');
          if (trigger) trigger.focus();
        }
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item')) {
        navItems.forEach((i) => i.classList.remove('dropdown-open'));
      }
    });
  }

  /* ========================================================================
     Services Accordion
     ======================================================================== */
  function initServicesAccordion() {
    const accordion = document.getElementById('svc-accordion');
    if (!accordion) return;
    const items = accordion.querySelectorAll('.svc-item');
    items.forEach((item) => {
      const header = item.querySelector('.svc-header');
      if (!header) return;
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        items.forEach((other) => {
          other.classList.remove('is-open');
          const h = other.querySelector('.svc-header');
          if (h) h.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          header.setAttribute('aria-expanded', 'true');
        }
      });
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); header.click(); }
      });
    });
  }

  /* ========================================================================
     FAQ Accordion
     ======================================================================== */
  function initFaq() {
    const list = document.getElementById('faq-list');
    if (!list) return;
    const items = list.querySelectorAll('.faq-item');
    items.forEach((item) => {
      const btn = item.querySelector('.faq-question');
      if (!btn) return;
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        items.forEach((other) => {
          other.classList.remove('is-open');
          const ob = other.querySelector('.faq-question');
          if (ob) ob.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ========================================================================
     Contact Form
     ======================================================================== */
  function initContactForm() {
    const form     = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = form.querySelector('#name');
      const email   = form.querySelector('#email');
      const message = form.querySelector('#message');
      feedback.className  = 'form-feedback';
      feedback.textContent = '';

      const fail = (msg, el) => {
        feedback.className  = 'form-feedback error';
        feedback.textContent = msg;
        if (el) el.focus();
      };

      if (name    && !name.value.trim())    return fail('Bitte geben Sie Ihren Namen ein.', name);
      if (email   && (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)))
        return fail('Bitte geben Sie eine gültige E-Mail-Adresse ein.', email);
      if (message && !message.value.trim()) return fail('Bitte beschreiben Sie kurz Ihr Projekt.', message);

      feedback.className  = 'form-feedback success';
      feedback.textContent = 'Vielen Dank! Ihre Anfrage wurde erfasst – wir melden uns zeitnah bei Ihnen.';
      form.reset();
    });
  }

  /* ========================================================================
     Cookie Consent
     ======================================================================== */
  function initCookies() {
    const KEY    = 'sitexclusive_cookie_consent';
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;
    const accept  = document.getElementById('cookie-accept');
    const decline = document.getElementById('cookie-decline');

    const get  = ()  => { try { return localStorage.getItem(KEY); } catch { return null; } };
    const set  = (v) => { try { localStorage.setItem(KEY, v); } catch {} };
    const show = ()  => { banner.hidden = false; requestAnimationFrame(() => banner.classList.add('is-visible')); };
    const hide = ()  => { banner.classList.remove('is-visible'); setTimeout(() => { banner.hidden = true; }, 450); };

    if (!get()) setTimeout(show, 1200);
    if (accept)  accept.addEventListener('click',  () => { set('accepted'); hide(); });
    if (decline) decline.addEventListener('click', () => { set('declined'); hide(); });
  }

  /* ========================================================================
     Footer Year
     ======================================================================== */
  function initYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ========================================================================
     Init
     ======================================================================== */
  function init() {
    initPageTransition();
    initCursor();
    initScrollProgress();
    initParallax();
    initScrollReveal();
    initTilt();
    initMagnetic();
    initCounters();
    initSmoothScroll();
    initHeader();
    initMobileMenu();
    initNavDropdown();
    initServicesAccordion();
    initFaq();
    initContactForm();
    initCookies();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
