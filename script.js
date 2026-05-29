/* ═══════════════════════════════════════
   DR. B.R. KUNDAL CLINIC — script.js
═══════════════════════════════════════ */

// ─── SPA NAVIGATION ─────────────────────────────────────────────
function navigate(pageId) {
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-link');

  pages.forEach(p => p.classList.remove('active'));
  navLinks.forEach(l => l.classList.remove('active'));

  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navLinks.forEach(l => {
    if (l.dataset.nav === pageId) l.classList.add('active');
  });

  // Close mobile nav
  const nav = document.getElementById('mainNav');
  const hamburger = document.getElementById('hamburger');
  nav.classList.remove('open');
  hamburger.classList.remove('open');
}

// ─── NAV LINK CLICKS ────────────────────────────────────────────
document.querySelectorAll('.nav-link[data-nav]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navigate(link.dataset.nav);
  });
});

// ─── HAMBURGER MENU ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('mainNav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mainNav.classList.toggle('open');
});

// ─── HEADER SCROLL SHADOW ───────────────────────────────────────
const siteHeader = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('scrolled', window.scrollY > 10);
});

// ─── TESTIMONIAL SLIDER ─────────────────────────────────────────
let currentT = 0;
let tTimer;

function showTestimonial(index) {
  const cards = document.querySelectorAll('.t-card');
  const dots  = document.querySelectorAll('.t-dot');
  if (!cards.length) return;

  cards.forEach(c => c.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  currentT = (index + cards.length) % cards.length;
  cards[currentT].classList.add('active');
  dots[currentT].classList.add('active');
}

function startTestimonialTimer() {
  clearInterval(tTimer);
  tTimer = setInterval(() => showTestimonial(currentT + 1), 5000);
}

document.querySelectorAll('.t-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const idx = parseInt(dot.dataset.dot);
    showTestimonial(idx);
    startTestimonialTimer();
  });
});

startTestimonialTimer();

// ─── CONTACT FORM SUBMIT ────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('formMsg');
    msg.textContent = '✓ Thank you! We\'ll get back to you within 24 hours.';
    msg.style.color = 'var(--teal)';
    contactForm.reset();
    setTimeout(() => { msg.textContent = ''; }, 6000);
  });
}

// ─── APPOINTMENT FORM SUBMIT ────────────────────────────────────
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
  appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple validation feedback
    const inputs = appointmentForm.querySelectorAll('[required]');
    let allFilled = true;
    inputs.forEach(inp => {
      if (!inp.value.trim()) { allFilled = false; inp.style.borderColor = '#e05050'; }
      else inp.style.borderColor = '';
    });

    const msg = document.getElementById('apptMsg');
    if (!allFilled) {
      msg.textContent = 'Please fill in all required fields.';
      msg.style.color = '#e05050';
      return;
    }

    msg.textContent = '✓ Appointment request received! Our team will call you shortly to confirm your slot.';
    msg.style.color = 'var(--teal)';
    appointmentForm.reset();
    setTimeout(() => { msg.textContent = ''; }, 8000);
  });
}

// ─── SET MIN DATE FOR APPOINTMENT ───────────────────────────────
const dateInput = document.querySelector('#appointment input[type="date"]');
if (dateInput) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split('T')[0];
}

// ─── GALLERY ITEM HOVER ENHANCEMENT ────────────────────────────
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transform = 'scale(1.01)';
    item.style.zIndex = '2';
    item.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
    item.style.zIndex = '';
  });
});

// ─── ANIMATE ELEMENTS ON PAGE SHOW ──────────────────────────────
function animateChildren(pageId) {
  const page = document.getElementById(pageId);
  if (!page) return;
  const els = page.querySelectorAll('.feature-card, .service-item, .gallery-item, .milestone, .appt-step, .ci-block');
  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 50);
  });
}

// Override navigate to also animate
const _navOriginal = navigate;
window.navigate = function(pageId) {
  _navOriginal(pageId);
  setTimeout(() => animateChildren(pageId), 50);
};

// Handle initial hash / deep links
(function init() {
  const hash = window.location.hash.replace('#', '');
  const validPages = ['home', 'services', 'about', 'gallery', 'contact', 'appointment'];
  const start = validPages.includes(hash) ? hash : 'home';
  navigate(start);
})();
