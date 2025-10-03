// Mobile nav toggle
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");
const mobileNavOverlay = document.getElementById("mobileNavOverlay");
if (navToggle && navLinks && mobileNavOverlay) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    navToggle.classList.toggle("open");
    mobileNavOverlay.classList.toggle("open");
  });
}

// Sticky Nav
window.addEventListener('scroll', function() {
  const header = document.querySelector('.site-header');
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
function revealOnScroll() {
  const triggerBottom = window.innerHeight * 1.0;
  reveals.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      el.classList.add("visible");
    }
  });
}

// Footer reveal
const footerFades = document.querySelectorAll(".footer-fade");
const footerContacts = document.querySelectorAll(".footer-contact");

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 1.0;
  reveals.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      el.classList.add("visible");
    }
  });
  footerFades.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      el.classList.add("visible");
    }
  });
    footerContacts.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) el.classList.add("visible");
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
