
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

// Contact form submit — sends to Google Sheets
const CONTACT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzk7IOqYCAUyG3ocaE8lBJxfgzNGT6I_fUA9VlK1ksJJx1Noqu3tQ7XdUOHBSl5FkSe/exec";

const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    type: "Contact",
    name: document.getElementById('contactName').value.trim(),
    email: document.getElementById('contactEmail').value.trim(),
    phone: document.getElementById('contactPhone').value.trim(),
    gymName: document.getElementById('contactGymName').value.trim(),
    message: document.getElementById('contactMessage').value.trim()
  };

  contactSubmitBtn.disabled = true;
  
  try {
    await fetch(CONTACT_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.error("Contact form submission failed:", err);
  } 

  contactSuccess.classList.add('visible');
  contactForm.reset();  
  contactSubmitBtn.disabled = false;
});




