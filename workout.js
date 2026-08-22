// Scroll-reveal for feature cards, section headers, CTA
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

// Stagger the feature card grids so they animate one after another
document.querySelectorAll('.workout-features-grid').forEach(grid => {
  [...grid.children].forEach((card, i) => {
    card.style.setProperty('--reveal-delay', `${i * 0.1}s`);
  });
});

// Screens slider — auto-playing portrait carousel
(function () {
  const slider = document.getElementById('screensSlider');
  if (!slider) return;

  const track = document.getElementById('sliderTrack');
  const slides = [...track.children];
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsWrap = document.getElementById('sliderDots');
  const AUTOPLAY_MS = 4500;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let index = 0;
  let timer = null;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to screen ${i + 1}`);
    dot.addEventListener('click', () => goTo(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = [...dotsWrap.children];

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(i, userInitiated) {
    index = (i + slides.length) % slides.length;
    render();
    if (userInitiated) restartAutoplay();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startAutoplay() {
    if (prefersReducedMotion) return;
    stopAutoplay();
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  nextBtn.addEventListener('click', () => goTo(index + 1, true));
  prevBtn.addEventListener('click', () => goTo(index - 1, true));

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('focusin', stopAutoplay);
  slider.addEventListener('focusout', startAutoplay);

  // Touch / drag swipe
  let startX = 0;
  let deltaX = 0;
  let dragging = false;

  track.addEventListener('touchstart', (e) => {
    dragging = true;
    startX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    deltaX = e.touches[0].clientX - startX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    if (Math.abs(deltaX) > 40) {
      deltaX < 0 ? goTo(index + 1, true) : goTo(index - 1, true);
    } else {
      startAutoplay();
    }
    deltaX = 0;
  });

  // Keyboard navigation when the slider is focused
  slider.setAttribute('tabindex', '0');
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(index + 1, true);
    if (e.key === 'ArrowLeft') goTo(index - 1, true);
  });

  render();
  startAutoplay();
})();

// Product showcase view toggle (Side View / Top View)
const showcaseLabel = document.getElementById('showcaseLabel');
const showcaseVideo = document.getElementById('showcaseVideo');
const showcasePlaceholder = document.getElementById('showcasePlaceholder');

document.querySelectorAll('.showcase-thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    document.querySelectorAll('.showcase-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');

    if (thumb.dataset.view === 'Side View') {
      showcaseVideo.style.display = 'block';
      showcasePlaceholder.style.display = 'none';
    } else {
      showcaseVideo.style.display = 'none';
      showcasePlaceholder.style.display = 'flex';
      showcaseLabel.textContent = thumb.dataset.view;
    }
  });
});

