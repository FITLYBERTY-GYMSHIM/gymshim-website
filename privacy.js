// privacy.js — lightweight script for privacy-policy.html
// Only handles: smooth scroll, mobile nav toggle, and the Products & Services overlay.
// (script.js has homepage-only code — hero video, plan cards, GSAP pinning, booking form —
// that runs unconditionally and throws on pages without those elements, which stops the
// rest of that file from running. This file avoids that by only touching things that exist here.)

// Lenis smooth scroll
if (typeof Lenis !== 'undefined') {
  window.lenis = new Lenis();

  function raf(time) {
    window.lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

