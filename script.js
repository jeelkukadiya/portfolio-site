"use strict";
// script.js - Interactivity for Jeel Kukadiya Portfolio

// === Theme Toggle Logic ===
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('theme-toggle-sun');
const moonIcon = document.getElementById('theme-toggle-moon');

function updateThemeIcons() {
    if (document.documentElement.classList.contains('dark')) {
        sunIcon.classList.add('scale-0');
        sunIcon.classList.remove('scale-100', 'rotate-0');
        moonIcon.classList.remove('scale-0');
        moonIcon.classList.add('scale-100');
    } else {
        sunIcon.classList.remove('scale-0');
        sunIcon.classList.add('scale-100');
        moonIcon.classList.add('scale-0');
        moonIcon.classList.remove('scale-100');
    }
}

// Set initial theme based on localStorage or system preference
if (localStorage.getItem('color-theme') === 'dark' || (!localStorage.getItem('color-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}
updateThemeIcons();

// Toggle theme and update icons/localStorage on button click
themeToggle.addEventListener('click', function() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
    }
    updateThemeIcons();
});

// === Navbar Highlight & Smooth Scroll ===
const sectionIds = ['about', 'education', 'skills', 'projects', 'coding', 'contact'];
const navLinks = sectionIds.map(id => document.getElementById('nav-' + id));
const sections = sectionIds.map(id => document.getElementById(id));

// IntersectionObserver options for section visibility
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5 // 50% of section visible
};

let currentActive = null;

// Set the active nav link by section id
function setActiveNav(id) {
  navLinks.forEach(link => link.classList.remove('active-nav'));
  const activeLink = document.getElementById('nav-' + id);
  if (activeLink) activeLink.classList.add('active-nav');
}

// Observe section visibility and update nav highlight
const observer = new IntersectionObserver((entries) => {
  let maxRatio = 0;
  let visibleId = null;
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
      maxRatio = entry.intersectionRatio;
      visibleId = entry.target.id;
    }
  });
  if (visibleId && visibleId !== currentActive) {
    setActiveNav(visibleId);
    currentActive = visibleId;
  }
}, observerOptions);

sections.forEach(section => {
  if (section) observer.observe(section);
});

// Smooth scroll for desktop nav links
navLinks.forEach((link, i) => {
  if (link && sections[i]) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      sections[i].scrollIntoView({ behavior: 'smooth' });
    });
  }
});

// === Mobile Menu Logic ===
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');

// Open the mobile menu and animate icon transition
function openMobileMenu() {
  mobileMenu.style.opacity = '1';
  mobileMenu.style.pointerEvents = 'auto';
  mobileMenu.style.height = 'auto';
  // Animate hamburger to cross
  menuIcon.classList.add('scale-0', 'rotate-45');
  setTimeout(() => {
    menuIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
    closeIcon.classList.remove('scale-0', '-rotate-45');
    closeIcon.classList.add('scale-100', 'rotate-0');
  }, 120);
}
// Close the mobile menu and animate icon transition
function closeMobileMenu() {
  mobileMenu.style.opacity = '0';
  mobileMenu.style.pointerEvents = 'none';
  mobileMenu.style.height = '0';
  // Animate cross to hamburger
  closeIcon.classList.add('scale-0', '-rotate-45');
  closeIcon.classList.remove('scale-100', 'rotate-0');
  setTimeout(() => {
    closeIcon.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    menuIcon.classList.remove('scale-0', 'rotate-45');
    menuIcon.classList.add('scale-100', 'rotate-0');
  }, 120);
}

// Toggle mobile menu on menu button click
menuToggle.addEventListener('click', function(e) {
  e.stopPropagation();
  if (mobileMenu.style.opacity === '1') {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

// Smooth scroll for mobile menu buttons
mobileMenu.querySelectorAll('button[data-section]').forEach(btn => {
  btn.addEventListener('click', function() {
    const section = document.getElementById(this.dataset.section);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    closeMobileMenu();
  });
});

// Close mobile menu when clicking outside the menu
window.addEventListener('click', function(e) {
  if (mobileMenu.style.opacity === '1' && !mobileMenu.contains(e.target) && e.target !== menuToggle) {
    closeMobileMenu();
  }
});

// === Contact Form Email Sending ===
// Uses EmailJS (https://www.emailjs.com/) for client-side email sending
const contactForm = document.getElementById('form-status');
const statusElem = document.getElementById('form-status-message');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation
    if (!name || !email || !message) {
      statusElem.textContent = 'All fields are required.';
      statusElem.style.color = 'red';
      return;
    }
    if (!emailRegex.test(email)) {
      statusElem.textContent = 'Please enter a valid email address.';
      statusElem.style.color = 'red';
      return;
    }

    statusElem.textContent = 'Sending...';
    statusElem.style.color = '';

    const serviceID = 'service_8vwc5ih';
    const templateID = 'template_0z817gr';
    const userID = 'PGP4JSNQQTlyhofU5';
    const formData = {
      name,
      email,
      message,
      time: new Date().toLocaleString()
    };

    // Make sure EmailJS is loaded
    if (typeof emailjs === 'undefined') {
      statusElem.textContent = 'Email service not available. Please try again later.';
      statusElem.style.color = 'red';
      return;
    }

    emailjs.send(serviceID, templateID, formData, userID)
      .then(() => {
        statusElem.textContent = 'Message sent successfully!';
        statusElem.style.color = 'green';
        contactForm.reset();
      }, (err) => {
        statusElem.textContent = 'Failed to send message. Please try again later.';
        statusElem.style.color = 'red';
      });
  });
} 

