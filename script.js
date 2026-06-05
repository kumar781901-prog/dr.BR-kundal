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
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('formMsg');
    
    // Get form values from input fields
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    const name = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const subject = inputs[3].value.trim();
    const message = inputs[4].value.trim();
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      msg.textContent = 'Please fill in all required fields.';
      msg.style.color = '#e05050';
      return;
    }
    
    try {
      const response = await fetch('https://dr-br-kundal-backend.onrender.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });
      
      if (response.ok) {
        msg.textContent = '✓ Thank you! Your message has been sent successfully.';
        msg.style.color = 'var(--teal)';
        contactForm.reset();
        setTimeout(() => { msg.textContent = ''; }, 6000);
      } else {
        msg.textContent = `Error: ${response.statusText}. Please try again.`;
        msg.style.color = '#e05050';
      }
    } catch (error) {
      msg.textContent = 'An error occurred. Please try again later.';
      msg.style.color = '#e05050';
      console.error('Contact form error:', error);
    }
  });
}

// ─── APPOINTMENT FORM SUBMIT ────────────────────────────────────
const appointmentForm = document.getElementById('appointmentForm');
console.log('appointmentForm count:', document.querySelectorAll('#appointmentForm').length);
console.log('appointmentForm element:', document.getElementById('appointmentForm'));
console.log('appointmentForm innerHTML:', document.getElementById('appointmentForm')?.innerHTML);
if (appointmentForm) {
  appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('apptMsg');
    msg.textContent = '';
    msg.style.color = '';

    const form = e.currentTarget;
    console.log('appointmentForm.elements count at submit:', form.elements ? form.elements.length : 0);
    console.log('appointmentForm children count at submit:', form.querySelectorAll('input, select, textarea').length);

    const formData = new FormData(form);
    const firstName = formData.get('firstName')?.toString().trim() || '';
    const lastName = formData.get('lastName')?.toString().trim() || '';
    const phone = formData.get('phone')?.toString().trim() || '';
    const email = formData.get('email')?.toString().trim() || '';
    const reason = formData.get('reason')?.toString().trim() || '';
    const preferredDate = formData.get('preferredDate')?.toString().trim() || '';
    const preferredTime = formData.get('preferredTime')?.toString().trim() || '';
    const notes = formData.get('notes')?.toString().trim() || '';

    // TEMP DEBUG: show raw FormData entries and individual variables before validation
    console.log([...new FormData(form).entries()]);
    console.log({
      firstName,
      lastName,
      phone,
      email,
      reason,
      preferredDate,
      preferredTime,
      notes
    });

    console.log('appointmentForm element:', form);
    console.log('appointmentForm.elements count:', form.elements ? form.elements.length : 'no elements');
    console.log(Array.from(form.elements || []).map(el => ({ name: el.name || null, type: el.type || el.tagName, disabled: el.disabled || false, value: el.value || '' })));
    console.log('querySelector inputs count:', form.querySelectorAll('input, select, textarea').length, form.querySelectorAll('input, select, textarea'));

    console.log('Appointment field values:', {
      firstName,
      lastName,
      phone,
      email,
      reason,
      preferredDate,
      preferredTime,
      notes,
    });

    const requiredFields = [
      ['First Name', firstName],
      ['Last Name', lastName],
      ['Phone Number', phone],
      ['Reason for Visit', reason],
      ['Preferred Date', preferredDate],
    ];

    const missing = requiredFields.filter(([, value]) => !value).map(([label]) => label);
    if (missing.length) {
      msg.textContent = `Please fill in the required fields: ${missing.join(', ')}.`;
      msg.style.color = '#e05050';
      return;
    }

    const payload = {
      name: `${firstName} ${lastName}`,
      email,
      phone,
      message: `Reason: ${reason}\nPreferred Date: ${preferredDate}\nPreferred Time: ${preferredTime}${notes ? `\nNotes: ${notes}` : ''}`,
    };

    try {
      const response = await fetch('https://dr-br-kundal-backend.onrender.com/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(response.statusText || 'Unable to submit appointment request');
      }

      msg.textContent = '✓ Appointment request received! Our team will call you shortly to confirm your slot.';
      msg.style.color = 'var(--teal)';
      form.reset();
      setTimeout(() => { msg.textContent = ''; }, 8000);
    } catch (error) {
      msg.textContent = `Error: ${error.message || 'Please try again later.'}`;
      msg.style.color = '#e05050';
      console.error('Appointment request error:', error);
    }
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
