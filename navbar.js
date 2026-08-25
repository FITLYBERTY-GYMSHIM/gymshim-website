/* ============================================================
   NAVBAR — shared header + "Products & Services" mega-menu.
   Include on EVERY page with just ONE line, right after <body>:

     <script src="navbar.js"></script>

   That's it — no navbar markup needed in the page itself anymore.
   This script injects the header, wires up the hamburger toggle
   and the Products & Services overlay, then gets out of the way.

   Requires styles.css to already be linked in <head> (it defines
   .navbar, .services-mega-*, etc). If the page also uses the
   booking modal, link booking.css too and put
   <script src="booking.js"></script> after this one.
   ============================================================ */
(function () {
  const NAV_HTML = `
    <header class="navbar">
  <div class="nav-container">
    <a href="index.html" class="logo">
         <img src="assets/image/gymshim-logo-navbar.png" alt="Gymshim" class="logo-img">
    </a>

    <nav class="nav-links" id="navLinks">
      <a href="index.html#plans">Business Booster</a>
     <div class="nav-dropdown" id="servicesDropdown">
        <button type="button" class="nav-dropdown-toggle" id="servicesToggle" aria-haspopup="true" aria-expanded="false">
         Products &amp; Services <span class="nav-dropdown-caret">&#9662;</span>
        </button>
      </div>
    
      <a href="contact.html">Contact</a>
    </nav>

    <div class="nav-actions">
        
   <a href="booking.html" class="btn-primary">Book a Demo</a>
  <button class="hamburger" id="hamburger" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</div>
</header>

<div class="services-overlay" id="servicesOverlay" aria-hidden="true" data-lenis-prevent>
  <div class="services-overlay-backdrop" id="servicesOverlayBackdrop"></div>

  <div class="services-mega-panel" role="dialog" aria-modal="true" aria-labelledby="servicesOverlayTitle">
    <button type="button" class="services-overlay-close" id="servicesOverlayClose" aria-label="Close">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>

    <div class="services-mega-top">
      <div class="services-mega-head">
        <span class="services-mega-eyebrow" id="servicesOverlayTitle">Our Products</span>
        <h2 class="services-mega-title">Powerful solutions for every part of <span class="services-mega-accent">your gym.</span></h2>
        <p class="services-mega-sub">One ecosystem. Four powerful products.</p>
      </div>
      <div class="services-mega-trust">
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="currentColor"/></svg>
        Trusted by <strong>5000+</strong> gyms across India
      </div>
    </div>

    <div class="services-mega-grid">

      <a href="workout.html" class="services-mega-card" data-glow="pink">
        <span class="services-mega-num">01</span>
        <span class="services-mega-icon-wrap">
          <span class="services-mega-icon-floor"></span>
          <svg class="services-mega-icon" viewBox="0 0 64 64" width="60" height="60">
            <defs>
              <linearGradient id="gradWorkout" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ff8fa3"/><stop offset="100%" stop-color="#d8234a"/>
              </linearGradient>
            </defs>
            <circle cx="12" cy="32" r="9" fill="none" stroke="url(#gradWorkout)" stroke-width="4"/>
            <circle cx="52" cy="32" r="9" fill="none" stroke="url(#gradWorkout)" stroke-width="4"/>
            <rect x="18" y="28" width="28" height="8" rx="4" fill="url(#gradWorkout)"/>
            <rect x="8" y="26" width="6" height="12" rx="2" fill="url(#gradWorkout)"/>
            <rect x="50" y="26" width="6" height="12" rx="2" fill="url(#gradWorkout)"/>
          </svg>
        </span>
        <div class="services-mega-card-headrow">
          <h3>Workout+</h3>
          <span class="services-mega-badge">AI Powered</span>
        </div>
        <p class="services-mega-desc">AI-guided workout experience for every member.</p>
        <ul class="services-mega-features">
          <li>Personalized Workouts</li>
          <li>Exercise Library</li>
          <li>Progress Tracking</li>
          <li>Smart Analytics</li>
        </ul>
        <span class="services-mega-explore">Explore Workout+
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </a>

      <a href="gos.html" class="services-mega-card" data-glow="cyan">
        <span class="services-mega-num">02</span>
        <span class="services-mega-icon-wrap">
          <span class="services-mega-icon-floor"></span>
          <svg class="services-mega-icon" viewBox="0 0 64 64" width="60" height="60">
            <defs>
              <linearGradient id="gradGosTop" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#7ee8f2"/><stop offset="100%" stop-color="#22d3ee"/>
              </linearGradient>
              <linearGradient id="gradGosSide" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0e9aad"/><stop offset="100%" stop-color="#0b7e8e"/>
              </linearGradient>
            </defs>
            <polygon points="32,6 54,18 32,30 10,18" fill="url(#gradGosTop)"/>
            <polygon points="10,18 32,30 32,54 10,42" fill="url(#gradGosSide)"/>
            <polygon points="54,18 32,30 32,54 54,42" fill="#0a6d7a"/>
          </svg>
        </span>
        <div class="services-mega-card-headrow">
          <h3>GOS (Gym Operating System)</h3>
          <span class="services-mega-badge">All-in-One</span>
        </div>
        <p class="services-mega-desc">Complete gym management system for seamless operations.</p>
        <ul class="services-mega-features">
          <li>Member Management</li>
          <li>Attendance Tracking</li>
          <li>Payments &amp; Billing</li>
          <li>Reports &amp; Analytics</li>
        </ul>
        <span class="services-mega-explore">Explore GOS
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </a>

      <a href="sales-kiosk.html" class="services-mega-card" data-glow="purple">
        <span class="services-mega-num">03</span>
        <span class="services-mega-icon-wrap">
          <span class="services-mega-icon-floor"></span>
          <svg class="services-mega-icon" viewBox="0 0 64 64" width="60" height="60">
            <defs>
              <linearGradient id="gradKiosk" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#c9a8ff"/><stop offset="100%" stop-color="#9b5cff"/>
              </linearGradient>
            </defs>
            <rect x="14" y="8" width="36" height="26" rx="4" fill="none" stroke="url(#gradKiosk)" stroke-width="3.5"/>
            <rect x="19" y="13" width="26" height="16" rx="2" fill="url(#gradKiosk)" opacity="0.25"/>
            <rect x="28" y="38" width="8" height="10" fill="url(#gradKiosk)"/>
            <rect x="20" y="48" width="24" height="5" rx="2.5" fill="url(#gradKiosk)" opacity="0.6"/>
          </svg>
        </span>
        <div class="services-mega-card-headrow">
          <h3>Sales Kiosk</h3>
          <span class="services-mega-badge">Self-Service</span>
        </div>
        <p class="services-mega-desc">Self-service touchscreen that closes memberships on the spot.</p>
        <ul class="services-mega-features">
          <li>Instant Signups</li>
          <li>Digital Payments</li>
          <li>Receipt Printing</li>
          <li>Offers &amp; Upsells</li>
        </ul>
        <span class="services-mega-explore">Explore Sales Kiosk
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </a>

      <a href="digital-marketing.html" class="services-mega-card" data-glow="orange">
        <span class="services-mega-num">04</span>
        <span class="services-mega-icon-wrap">
          <span class="services-mega-icon-floor"></span>
          <svg class="services-mega-icon" viewBox="0 0 64 64" width="60" height="60">
            <defs>
              <linearGradient id="gradAd" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ffc38a"/><stop offset="100%" stop-color="#ff8a3d"/>
              </linearGradient>
            </defs>
            <rect x="10" y="26" width="14" height="12" rx="2" fill="url(#gradAd)"/>
            <path d="M24 24 L42 14 V50 L24 40 Z" fill="url(#gradAd)"/>
            <rect x="15" y="38" width="5" height="12" rx="1.5" fill="url(#gradAd)" opacity="0.7"/>
            <path d="M46 22a10 10 0 010 20" fill="none" stroke="url(#gradAd)" stroke-width="3" stroke-linecap="round"/>
            <path d="M50 16a17 17 0 010 32" fill="none" stroke="url(#gradAd)" stroke-width="3" stroke-linecap="round" opacity="0.55"/>
          </svg>
        </span>
        <div class="services-mega-card-headrow">
          <h3>Advertisement</h3>
          <span class="services-mega-badge">Grow Faster</span>
        </div>
        <p class="services-mega-desc">Digital marketing solutions to bring more members to your gym.</p>
        <ul class="services-mega-features">
          <li>Social Media Ads</li>
          <li>WhatsApp Campaigns</li>
          <li>Performance Boost</li>
          <li>Lead Generation</li>
        </ul>
        <span class="services-mega-explore">Explore Advertisement
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </a>

    </div>

    <div class="services-mega-divider"></div>

    <div class="services-mega-footer">
      <div class="services-mega-foot-item">
        <span class="services-mega-foot-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/></svg>
        </span>
        <span class="services-mega-foot-text"><strong>Secure &amp; Reliable</strong>Enterprise-grade security</span>
      </div>
      <div class="services-mega-foot-item">
        <span class="services-mega-foot-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 18a4 4 0 01-1-7.9A5.5 5.5 0 0117 9a4.5 4.5 0 011 8.9"/></svg>
        </span>
        <span class="services-mega-foot-text"><strong>Always Updated</strong>Latest features &amp; updates</span>
      </div>
      <div class="services-mega-foot-item">
        <span class="services-mega-foot-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 15v-3a8 8 0 0116 0v3"/><path d="M4 15a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 15a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2z"/></svg>
        </span>
        <span class="services-mega-foot-text"><strong>24/7 Support</strong>We're here for you</span>
      </div>
      <div class="services-mega-foot-item">
        <span class="services-mega-foot-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="5"/><path d="M8.5 12.5L6 22l6-3 6 3-2.5-9.5"/></svg>
        </span>
        <span class="services-mega-foot-text"><strong>Made in India</strong>For gyms, by gym experts</span>
      </div>
    </div>

  </div>
</div>
`;

  const thisScript = document.currentScript;
  if (!thisScript) {
    console.error('navbar.js: could not find its own <script> tag (currentScript is null) — include it with a plain <script src="navbar.js"></script> tag, not dynamically.');
    return;
  }
  thisScript.insertAdjacentHTML('beforebegin', NAV_HTML);

  /* ---------------- Hamburger menu ---------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  /* ---------------- Products & Services overlay ---------------- */
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
      if (e.key === 'Escape' && servicesOverlay.classList.contains('open')) {
        closeServicesOverlay();
      }
    });
  }

  /* ---------------- Theme toggle (light / dark) ----------------
     NOTE: the click behaviour for #themeToggle (the button injected
     above) is intentionally NOT wired up here. It's handled by
     theme-toggle.js instead — link that file (plus theme-toggle.css)
     in <head> on every page that includes this navbar. Keeping it
     in a separate, page-included file (rather than baked into this
     shared script) means it only runs once per page and there's no
     risk of two click listeners stacking on the same button. */

  /* ---------------- Highlight the current page's nav link ---------------- */
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  navLinks && navLinks.querySelectorAll('a[href]').forEach(link => {
    const linkFile = link.getAttribute('href').split('#')[0];
    if (linkFile && linkFile === currentFile) {
      link.classList.add('active');
    }
  });
})();