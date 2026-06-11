/**
 * siteXclusive – Portfolio Carousel
 * 3D browser showcase with real mini-website mockups.
 * Center card in focus, side cards rotated/behind, arrow + dot navigation,
 * clickable side cards. Fully responsive.
 */

(function () {
  'use strict';

  const stage = document.querySelector('[data-portfolio]');
  if (!stage) return;

  /* ------------------------------------------------------------------------
     Project data – each renders a real micro-layout inside a browser frame
     ------------------------------------------------------------------------ */
  const PROJECTS = [
    {
      url: 'salon-belle.wien', theme: 'beauty',
      industry: 'Friseur · Beauty Salon', title: 'Salon Belle',
      desc: 'Eleganter Auftritt mit Online-Terminbuchung für einen Premium-Friseursalon in Wien.',
      brand: 'SALON BELLE', sub: null, eyebrow: 'Friseur · Wien',
      headline: 'Ihr Look. Perfekt inszeniert.',
      lead: 'Schnitt, Farbe & Pflege auf Top-Niveau – mitten in Wien.',
      btns: ['Termin buchen', 'Galerie'], cta: 'Termin buchen',
      links: ['Start', 'Team'],
      feats: [['Online buchen', '24/7'], ['★ 4,9', '320 Bewertungen']]
    },
    {
      url: 'trattoria-nona.at', theme: 'food',
      industry: 'Restaurant · Gastronomie', title: 'Trattoria Nona',
      desc: 'Stimmungsvolle Website mit digitaler Speisekarte und Tischreservierung.',
      brand: 'TRATTORIA NONA', sub: null, eyebrow: 'Restaurant · Wien',
      headline: 'Echte italienische Küche.',
      lead: 'Hausgemachte Pasta & Wein – täglich frisch serviert.',
      btns: ['Tisch reservieren', 'Menü'], cta: 'Reservieren',
      links: ['Start', 'Menü'],
      feats: [['Reservierung', 'Online'], ['Mo–So', '11–23 Uhr']]
    },
    {
      url: 'kfz-strasser.at', theme: 'auto',
      industry: 'KFZ · Werkstatt', title: 'KFZ Strasser',
      desc: 'Klare, vertrauensvolle Website mit Online-Serviceanfrage für eine Meisterwerkstatt.',
      brand: 'KFZ STRASSER', sub: null, eyebrow: 'Meisterwerkstatt · Wien',
      headline: 'Ihre Werkstatt. Stark & ehrlich.',
      lead: 'Service, Reparatur & Pickerl – Meisterbetrieb in Wien.',
      btns: ['Termin anfragen', '§57a'], cta: '01 234 56',
      links: ['Start', 'Service'],
      feats: [['Alle Marken', 'Service'], ['§57a', 'Pickerl']]
    },
    {
      url: 'praxis-dr-haas.at', theme: 'med',
      industry: 'Arztpraxis · Gesundheit', title: 'Praxis Dr. Haas',
      desc: 'Ruhige, barrierearme Website mit Online-Terminvergabe für eine Wahlarztpraxis.',
      brand: 'DR. HAAS', sub: null, eyebrow: 'Arztpraxis · Wien',
      headline: 'Ihre Gesundheit in besten Händen.',
      lead: 'Moderne Allgemeinmedizin mit Zeit für jeden Patienten.',
      btns: ['Online-Termin', 'Team'], cta: 'Online-Termin',
      links: ['Start', 'Team'],
      feats: [['Online-Termin', '24/7'], ['Wahlarzt', 'Alle Kassen']]
    },
    {
      url: 'wien-immobilien.at', theme: 'realty',
      industry: 'Immobilien · Makler', title: 'Wien Immobilien',
      desc: 'Hochwertige Maklerseite mit Objektsuche und Premium-Branding für Top-Lagen.',
      brand: 'WIEN IMMO', sub: null, eyebrow: 'Immobilien · Wien',
      headline: 'Wohnen in bester Lage.',
      lead: 'Exklusive Immobilien in Wien – diskret & persönlich vermittelt.',
      btns: ['Objekte ansehen', 'Verkaufen'], cta: 'Objekte',
      links: ['Kaufen', 'Mieten'],
      feats: [['1.200+', 'vermittelt'], ['Seit 2008', 'Erfahren']]
    },
    {
      url: 'powerhouse-gym.at', theme: 'gym',
      industry: 'Fitnessstudio · Sport', title: 'Powerhouse Gym',
      desc: 'Energiegeladene Website mit Mitgliedschafts-Tarifen und Kursplan-Integration.',
      brand: 'POWERHOUSE', sub: null, eyebrow: 'Fitnessstudio · Wien',
      headline: 'Stärker. Jeden Tag.',
      lead: 'Modernes Training, Kurse & Coaching – 24/7 geöffnet in Wien.',
      btns: ['Gratis testen', 'Tarife'], cta: 'Gratis testen',
      links: ['Kurse', 'Tarife'],
      feats: [['24/7', 'geöffnet'], ['60+', 'Kurse']]
    }
  ];

  /* Render a realistic mini-website inside a themed browser frame */
  function renderScreen(p) {
    const links = p.links.map((l) => `<span>${l}</span>`).join('');
    const feats = p.feats.map((f) => `<div class="sb-feat"><span class="sb-feat__ic"></span><div><b>${f[0]}</b><i>${f[1]}</i></div></div>`).join('');
    const brand = p.sub
      ? `<span class="sb-brand__mark"></span>${p.brand}<small>${p.sub}</small>`
      : `<span class="sb-brand__mark"></span>${p.brand}`;
    return `
      <div class="sb-bar"><span class="sb-dots"><i></i><i></i><i></i></span><span class="sb-url">${p.url}</span></div>
      <div class="sb-screen">
        <div class="sb-nav">
          <div class="sb-brand">${brand}</div>
          <div class="sb-links">${links}<span class="sb-cta">${p.cta}</span></div>
        </div>
        <div class="sb-hero">
          <div class="sb-hero__text">
            <div class="sb-eyebrow">${p.eyebrow}</div>
            <div class="sb-title">${p.headline}</div>
            <div class="sb-sub">${p.lead}</div>
            <div class="sb-btns"><span class="sb-btn sb-btn--solid">${p.btns[0]}</span><span class="sb-btn sb-btn--ghost">${p.btns[1]}</span></div>
          </div>
          <div class="sb-hero__media"></div>
        </div>
        <div class="sb-feats">${feats}</div>
      </div>`;
  }

  /* ------------------------------------------------------------------------
     Build DOM
     ------------------------------------------------------------------------ */
  const cards = [];
  PROJECTS.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = `pf-card sb sb--${p.theme}`;
    card.dataset.index = i;
    card.innerHTML = renderScreen(p);
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index, 10);
      if (idx !== current) goTo(idx);
    });
    stage.appendChild(card);
    cards.push(card);
  });

  // Caption + controls (sibling containers, optional in markup)
  const caption = document.querySelector('[data-portfolio-caption]');
  const dotsWrap = document.querySelector('[data-portfolio-dots]');

  if (dotsWrap) {
    PROJECTS.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'pf-dot';
      dot.setAttribute('aria-label', `Projekt ${i + 1} anzeigen`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  /* ------------------------------------------------------------------------
     State + positioning
     ------------------------------------------------------------------------ */
  let current = 0;
  const total = PROJECTS.length;

  function positionFor(i) {
    if (i === current) return 'center';
    if (i === (current - 1 + total) % total) return 'left';
    if (i === (current + 1) % total) return 'right';
    return 'hidden';
  }

  function update() {
    cards.forEach((card, i) => {
      card.dataset.pos = positionFor(i);
    });

    if (caption) {
      const p = PROJECTS[current];
      caption.innerHTML = `
        <p class="pf-caption__industry"><span class="eyebrow__dot"></span>${p.industry}</p>
        <h3 class="pf-caption__title">${p.title}</h3>
        <p class="pf-caption__desc">${p.desc}</p>`;
    }

    if (dotsWrap) {
      dotsWrap.querySelectorAll('.pf-dot').forEach((d, i) => {
        d.classList.toggle('is-active', i === current);
      });
    }
  }

  function goTo(i) {
    current = (i + total) % total;
    update();
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* ------------------------------------------------------------------------
     Controls
     ------------------------------------------------------------------------ */
  const nextBtn = document.querySelector('[data-portfolio-next]');
  const prevBtn = document.querySelector('[data-portfolio-prev]');
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Touch swipe
  let startX = 0;
  stage.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
  }, { passive: true });

  update();
})();
