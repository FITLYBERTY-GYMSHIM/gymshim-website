/* ==============================================================
   GOS DEVICE SHOWCASE — copied as-is from gos.js
   (sections 8-10 of the original file: mouse-parallax tilt, the
   pinned scroll timeline, the screenshot reveal, and the phone
   notification-card loop). Uses the gsap/ScrollTrigger already
   loaded on this page — does not create its own Lenis instance,
   since index.html's script.js already runs one.
   ============================================================== */
(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ---------------------------------------------------------------
     SECTION REVEALS — every .js-reveal element (the Solution section's
     eyebrow, heading, paragraphs, and card) fades/rises in individually
     as it scrolls into view. Without this they'd stay invisible forever,
     since .js-reveal starts at opacity:0 in CSS.
     --------------------------------------------------------------- */
  document.querySelectorAll('.js-reveal').forEach(el => {
    if (reducedMotion) return; // CSS fallback already forces opacity:1
    gsap.set(el, { y: 24 });
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  /* ---------------------------------------------------------------
     DEVICE SHOWCASE — mouse parallax tilt (idle) + the main
     pinned ScrollTrigger timeline (scroll-scrubbed).
     --------------------------------------------------------------- */
  const laptop = document.getElementById('deviceLaptop');
  const phone = document.getElementById('devicePhone');
  const showcasePin = document.getElementById('showcasePin');
  const showcaseGlow = document.querySelector('.showcase-glow');

  // -- Idle mouse-parallax tilt on the laptop (subtle, bounded) --
  if (laptop && showcasePin && !isTouch && !reducedMotion) {
    showcasePin.addEventListener('mousemove', (e) => {
      const r = showcasePin.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(laptop, {
        rotateY: x * 10,
        rotateX: y * -8,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
    showcasePin.addEventListener('mouseleave', () => {
      gsap.to(laptop, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power2.out' });
    });
  }

  // -- Main pinned scroll timeline --
  if (laptop && phone && showcasePin && !reducedMotion) {
    gsap.set(laptop, { scale: 0.7, rotateY: -22, rotateX: 10, opacity: 0, transformPerspective: 1400 });
    gsap.set(phone, { xPercent: 130, opacity: 0, rotateY: 18, transformPerspective: 1400 });
    if (showcaseGlow) gsap.set(showcaseGlow, { opacity: 0.4, scale: 0.9 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.launch-showcase',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        pin: showcasePin,
        anticipatePin: 1
      }
    });

    tl.to(laptop, { scale: 1, rotateY: -6, rotateX: 4, opacity: 1, duration: 1, ease: 'power2.out' }, 0);
    if (showcaseGlow) tl.to(showcaseGlow, { opacity: 0.85, scale: 1.15, duration: 1, ease: 'power2.out' }, 0);
    tl.to(laptop, { rotateY: 0, rotateX: 0, duration: 1, ease: 'power2.inOut' }, 1)
      .to(phone, { xPercent: 0, opacity: 1, rotateY: 0, duration: 1, ease: 'power2.out' }, 1.1)
      .to(laptop, { x: '-6%', duration: 1, ease: 'power1.inOut' }, 1.1)
      // Hold the fully-composed state for a stretch of scroll before
      // the section is allowed to release, so it stays "stuck" on
      // screen for longer once everything is visible.
      .to({}, { duration: 0.5 }, 2.1)
      // Fade the device-only glow before the solution copy scrolls in.
      // Both parts then meet on the same plain GOS background.
      .to(showcaseGlow, { opacity: 0, duration: 0.7, ease: 'power1.out' }, 2.6);

    // Position the phone beside the laptop once JS has real layout
    // sizes to work with (keeps it responsive without hardcoding px).
    function positionDevices() {
      laptop.style.left = `calc(50% - ${laptop.offsetWidth / 2}px)`;
      laptop.style.top = `calc(50% - ${laptop.offsetHeight / 2}px)`;
      phone.style.left = `calc(50% + ${laptop.offsetWidth / 2.4}px)`;
      phone.style.top = `calc(50% - ${phone.offsetHeight / 2}px)`;
    }
    positionDevices();
    window.addEventListener('resize', positionDevices);
  } else if (laptop && phone) {
    // Reduced-motion fallback: show the final composed state statically.
    laptop.style.left = `calc(50% - ${laptop.offsetWidth / 2}px)`;
    laptop.style.top = `calc(50% - ${laptop.offsetHeight / 2}px)`;
    phone.style.left = `calc(50% + ${laptop.offsetWidth / 2.4}px)`;
    phone.style.top = `calc(50% - ${phone.offsetHeight / 2}px)`;
  }

  /* ---------------------------------------------------------------
     LAPTOP SCREENSHOT REVEAL — the real dashboard image sweeps in
     with a brightness/scale settle once the showcase scrolls into
     view (the continuous glass sheen from CSS handles the ongoing
     reflection on top of it).
     --------------------------------------------------------------- */
  const laptopScreen = document.getElementById('laptopScreen');
  const dashScreenshot = laptopScreen ? laptopScreen.querySelector('.dash-screenshot') : null;

  if (dashScreenshot) {
    if (!reducedMotion) {
      gsap.set(dashScreenshot, { scale: 1.08, opacity: 0, filter: 'brightness(1.6)' });
    }
    ScrollTrigger.create({
      trigger: '.launch-showcase',
      start: 'top 70%',
      once: true,
      onEnter: () => {
        if (reducedMotion) return;
        gsap.to(dashScreenshot, {
          scale: 1, opacity: 1, filter: 'brightness(1)',
          duration: 1.3, ease: 'power2.out'
        });
      }
    });
  }

  /* ---------------------------------------------------------------
     PHONE NOTIFICATION CARDS — slide in one at a time once the
     phone itself has entered, then loop by cycling opacity/position.
     --------------------------------------------------------------- */
  const phoneCards = ['phoneCard1', 'phoneCard2', 'phoneCard3']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (phoneCards.length) {
    ScrollTrigger.create({
      trigger: '.launch-showcase',
      start: 'top 40%',
      once: true,
      onEnter: () => {
        gsap.to(phoneCards, {
          x: 0, opacity: 1, duration: 0.7, stagger: 0.25, ease: 'power3.out'
        });
        if (!reducedMotion) startPhoneCardLoop();
      }
    });
  }

  // After the initial entrance, gently cycle the cards' emphasis so
  // the screen never looks static — one card "pulses" at a time.
  function startPhoneCardLoop() {
    let i = 0;
    setInterval(() => {
      phoneCards.forEach((c, ci) => {
        gsap.to(c, { scale: ci === i ? 1.03 : 1, duration: 0.5, ease: 'power2.out' });
      });
      i = (i + 1) % phoneCards.length;
    }, 1800);
  }
})();
