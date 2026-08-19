

// Scroll-reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

// Stagger the team cards so they animate one after another
document.querySelectorAll('.team-grid').forEach(grid => {
  [...grid.children].forEach((card, i) => {
    card.style.setProperty('--reveal-delay', `${i * 0.1}s`);
  });
});


