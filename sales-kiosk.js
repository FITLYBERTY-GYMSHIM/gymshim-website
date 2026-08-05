gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   Lenis smooth scroll
   ================================================================ */
window.lenis = new Lenis();
function raf(time) {
  window.lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* ================================================================
   Scroll progress bar
   ================================================================ */
const skxProgressBar = document.getElementById('skxProgressBar');
function updateProgress() {
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const max = h.scrollHeight - h.clientHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;
  if (skxProgressBar) skxProgressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* ================================================================
   Custom cursor ring
   ================================================================ */
const cursorRing = document.getElementById('skxCursorRing');
let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;
if (cursorRing) {
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorRing.classList.add('visible');
  });
  function ringLoop() {
    ringX += (mouseX - ringX) * 0.35;
    ringY += (mouseY - ringY) * 0.35;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(ringLoop);
  }
  ringLoop();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });
}

/* ================================================================
   Magnetic buttons
   ================================================================ */
document.querySelectorAll('.skx-magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0, 0)'; });
});

/* ================================================================
   Ripple buttons
   ================================================================ */
document.querySelectorAll('.skx-ripple').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.6;
    const dot = document.createElement('span');
    dot.className = 'skx-ripple-dot';
    dot.style.width = dot.style.height = size + 'px';
    dot.style.left = (e.clientX - rect.left - size / 2) + 'px';
    dot.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(dot);
    setTimeout(() => dot.remove(), 700);
  });
});

/* ================================================================
   3D tilt cards
   ================================================================ */
document.querySelectorAll('.skx-tilt').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--rx', `${px * 8}deg`);
    card.style.setProperty('--ry', `${-py * 8}deg`);
  });
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });
});

/* ================================================================
   GSAP scroll reveal for feature / product / why cards
   ================================================================ */
gsap.utils.toArray('.skx-feature-card, .skx-product-card, .skx-why-item, .skx-testi-card-inner, .skx-faq-item').forEach((el, i) => {
  gsap.set(el, { opacity: 0, y: 34, filter: 'blur(6px)' });
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () => {
      gsap.to(el, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, delay: (i % 4) * 0.06, ease: 'power3.out' });
    }
  });
});

/* ================================================================
   Floating particles (hero)
   ================================================================ */
const particlesContainer = document.getElementById('skxParticles');
if (particlesContainer) {
  const colors = ['#c9a15a', '#d97a4a', '#e8cd94'];
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('div');
    p.className = 'skx-particle';
    p.style.left = `${Math.random() * 100}%`;
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = `${9 + Math.random() * 8}s`;
    p.style.animationDelay = `${Math.random() * 8}s`;
    particlesContainer.appendChild(p);
  }
}

/* ================================================================
   Floating glass-card objects (hero ambient icons)
   ================================================================ */
const objectIcons = ['💳', '✅', '📊', '🔔', '📱', '🎫'];
const objectsContainer = document.getElementById('skxObjects');
if (objectsContainer) {
  objectIcons.forEach((icon, i) => {
    const el = document.createElement('div');
    el.className = 'skx-object';
    el.textContent = icon;
    el.style.left = `${10 + Math.random() * 75}%`;
    el.style.top = `${10 + Math.random() * 70}%`;
    el.style.setProperty('--dx', `${(Math.random() - 0.5) * 100}px`);
    el.style.setProperty('--dy', `${(Math.random() - 0.5) * 100}px`);
    el.style.animationDuration = `${10 + Math.random() * 6}s`;
    el.style.animationDelay = `${i * 0.6}s`;
    objectsContainer.appendChild(el);
  });
}

/* ================================================================
   Cursor spotlight (hero)
   ================================================================ */
const skxHeroEl = document.querySelector('.skx-hero');
const spotlight = document.getElementById('skxSpotlight');
if (skxHeroEl && spotlight) {
  skxHeroEl.addEventListener('mousemove', (e) => {
    const rect = skxHeroEl.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    spotlight.style.setProperty('--sx', `${xPct}%`);
    spotlight.style.setProperty('--sy', `${yPct}%`);
  });
}

/* ================================================================
   Mouse parallax on the hero device mockup
   ================================================================ */
const heroVisual = document.getElementById('skxHeroVisual');
if (skxHeroEl && heroVisual) {
  skxHeroEl.addEventListener('mousemove', (e) => {
    const rect = skxHeroEl.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    heroVisual.style.transform = `translate(${px * 18}px, ${py * 14}px)`;
  });
}

/* ================================================================
   Hamburger menu
   ================================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

/* ================================================================
   Generic scroll-reveal for .reveal-up
   ================================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

/* ================================================================
   Device "flow" animation — the kiosk screen inside the hero
   cycles through a real front-desk signup sequence.
   ================================================================ */
const flowSteps = document.querySelectorAll('#skxFlow .skx-flow-step');
const counterEl = document.getElementById('skxCounter');
let counterValue = 128;
if (counterEl) counterEl.textContent = counterValue;

function runFlow() {
  if (!flowSteps.length) return;
  let i = 0;
  flowSteps.forEach(s => s.classList.remove('active', 'done'));

  function step() {
    if (i > 0) flowSteps[i - 1].classList.remove('active');
    if (i > 0) flowSteps[i - 1].classList.add('done');
    if (i >= flowSteps.length) {
      counterValue++;
      if (counterEl) counterEl.textContent = counterValue;
      setTimeout(() => { flowSteps.forEach(s => s.classList.remove('done')); runFlow(); }, 1600);
      return;
    }
    flowSteps[i].classList.add('active');
    i++;
    setTimeout(step, 850);
  }
  step();
}
runFlow();

/* ================================================================
   Animated counters (stats section)
   ================================================================ */
const counterEls = document.querySelectorAll('[data-count-target]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCount(el) {
  const target = parseFloat(el.dataset.countTarget);
  const suffix = el.dataset.countSuffix || '';
  const duration = 1400;
  if (prefersReducedMotion) { el.textContent = target + suffix; return; }
  const start = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(target * eased);
    el.textContent = val + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
if (counterEls.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counterEls.forEach(el => counterObserver.observe(el));
}

/* ================================================================
   Testimonial slider
   ================================================================ */
const testiTrack = document.getElementById('skxTestiTrack');
const testiCards = testiTrack ? testiTrack.querySelectorAll('.skx-testi-card') : [];
const testiDotsWrap = document.getElementById('skxTestiDots');
let testiIndex = 0;
let testiPerView = window.innerWidth >= 760 ? 2 : 1;
let testiTimer = null;

function testiSlidesCount() {
  return Math.max(1, testiCards.length - testiPerView + 1);
}
function renderTestiDots() {
  if (!testiDotsWrap) return;
  testiDotsWrap.innerHTML = '';
  for (let i = 0; i < testiSlidesCount(); i++) {
    const dot = document.createElement('span');
    dot.className = 'skx-testi-dot' + (i === testiIndex ? ' active' : '');
    dot.addEventListener('click', () => goToTesti(i));
    testiDotsWrap.appendChild(dot);
  }
}
function goToTesti(i) {
  const max = testiSlidesCount() - 1;
  testiIndex = Math.max(0, Math.min(i, max));
  const pct = (100 / testiPerView) * testiIndex;
  if (testiTrack) testiTrack.style.transform = `translateX(-${pct}%)`;
  if (testiDotsWrap) {
    testiDotsWrap.querySelectorAll('.skx-testi-dot').forEach((d, idx) => d.classList.toggle('active', idx === testiIndex));
  }
}
function nextTesti() { goToTesti((testiIndex + 1) % testiSlidesCount()); }
function prevTesti() { goToTesti((testiIndex - 1 + testiSlidesCount()) % testiSlidesCount()); }

if (testiTrack && testiCards.length) {
  renderTestiDots();
  document.getElementById('skxTestiNext')?.addEventListener('click', () => { nextTesti(); resetTestiAutoplay(); });
  document.getElementById('skxTestiPrev')?.addEventListener('click', () => { prevTesti(); resetTestiAutoplay(); });

  function resetTestiAutoplay() {
    clearInterval(testiTimer);
    if (!prefersReducedMotion) testiTimer = setInterval(nextTesti, 5000);
  }
  resetTestiAutoplay();

  window.addEventListener('resize', () => {
    const newPerView = window.innerWidth >= 760 ? 2 : 1;
    if (newPerView !== testiPerView) {
      testiPerView = newPerView;
      testiIndex = 0;
      renderTestiDots();
      goToTesti(0);
    }
  });
}

/* ================================================================
   FAQ accordion
   ================================================================ */
document.querySelectorAll('.skx-faq-item').forEach(item => {
  const q = item.querySelector('.skx-faq-q');
  const a = item.querySelector('.skx-faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.skx-faq-item.open').forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.skx-faq-a').style.maxHeight = null;
      }
    });
    item.classList.toggle('open', !isOpen);
    a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
  });
});

/* ================================================================
   Product lightbox
   ================================================================ */
const lightbox = document.getElementById('skxLightbox');
const lightboxTitle = document.getElementById('skxLightboxTitle');
const lightboxDesc = document.getElementById('skxLightboxDesc');
document.querySelectorAll('[data-lightbox-title]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    if (!lightbox) return;
    lightboxTitle.textContent = trigger.dataset.lightboxTitle;
    lightboxDesc.textContent = trigger.dataset.lightboxDesc;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('skxLightboxClose')?.addEventListener('click', closeLightbox);
document.getElementById('skxLightboxBackdrop')?.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

/* ================================================================
   CTA form (front-end only — swap for a real endpoint later)
   ================================================================ */
const ctaForm = document.getElementById('skxCtaForm');
if (ctaForm) {
  ctaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('skxCtaFormCard')?.classList.add('submitted');
    document.getElementById('skxCtaSuccess')?.classList.add('show');
  });
}

/* ================================================================
   Newsletter mini-form (front-end only)
   ================================================================ */
const newsletterForm = document.getElementById('skxNewsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = document.getElementById('skxNewsletterNote');
    if (note) note.textContent = "You're on the list — thanks!";
  });
}

/* ================================================================
   Services overlay (unchanged behaviour)
   ================================================================ */
const servicesToggle = document.getElementById('servicesToggle');
const servicesOverlay = document.getElementById('servicesOverlay');
const servicesOverlayBackdrop = document.getElementById('servicesOverlayBackdrop');
const servicesOverlayClose = document.getElementById('servicesOverlayClose');

function openServicesOverlay() {
  servicesOverlay.classList.add('open');
  servicesOverlay.setAttribute('aria-hidden', 'false');
  servicesToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeServicesOverlay() {
  servicesOverlay.classList.remove('open');
  servicesOverlay.setAttribute('aria-hidden', 'true');
  servicesToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
if (servicesToggle && servicesOverlay) {
  servicesToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = servicesOverlay.classList.contains('open');
    isOpen ? closeServicesOverlay() : openServicesOverlay();
  });
  servicesOverlayBackdrop.addEventListener('click', closeServicesOverlay);
  servicesOverlayClose.addEventListener('click', closeServicesOverlay);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && servicesOverlay.classList.contains('open')) closeServicesOverlay();
  });
}