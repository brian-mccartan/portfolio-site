// Mobile nav toggle
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");
const mobileNavOverlay = document.getElementById("mobileNavOverlay");
if (navToggle && navLinks && mobileNavOverlay) {
  let scrollPosition = 0;

  navToggle.addEventListener("click", () => {
    const isOpen = mobileNavOverlay.classList.toggle("open");
    navLinks.classList.toggle("open", isOpen);
    navToggle.classList.toggle("open", isOpen);

    if (isOpen) {
    scrollPosition = window.scrollY;
    document.body.style.top = `-${scrollPosition}px`;
    document.body.classList.add("no-scroll");
    document.documentElement.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
    document.documentElement.classList.remove("no-scroll");
    document.body.style.top = "";
    window.scrollTo(0, scrollPosition);
  }
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

// Scroll-to-top button logic
const scrollBtn = document.getElementById("scrollToTop");
let scrollTimeout;

window.addEventListener("scroll", () => {
  // Show button when scrolled down
  if (window.scrollY > 200) {
    scrollBtn.classList.add("visible");
  } else {
    scrollBtn.classList.remove("visible");
  }

  // Hide after inactivity
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    scrollBtn.classList.remove("visible");
  }, 2000); // hides after 2s of no scrolling
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// LinkedIn deep-link with reliable mobile fallback
(function () {
  const linkEl = document.querySelector('.bottom-nav .nav-item.linkedin');
  if (!linkEl) return;

  linkEl.addEventListener('click', function (ev) {
    // Only intercept on mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const webUrl = linkEl.href || 'https://www.linkedin.com/in/brianmccartan/';
    if (!isMobile) {
      // Let desktop follow the normal href (no custom scheme attempt)
      return; // do nothing; browser will follow the <a href>
    }

    ev.preventDefault(); // we'll handle navigation

    const appUrl = 'linkedin://in/brianmccartan'; // try app scheme first
    let fallbackDone = false;

    // Fallback: if app doesn't open within this many ms, navigate to web URL.
    // Use location.href (same-tab) to avoid popup blockers.
    const FALLBACK_MS = 1000;
    const fallbackTimer = setTimeout(() => {
      if (!fallbackDone) {
        fallbackDone = true;
        window.location.href = webUrl;
      }
    }, FALLBACK_MS);

    // If the page becomes hidden (user likely switched to the app), cancel fallback.
    function onVisibilityChange() {
      if (document.hidden) {
        fallbackDone = true;
        clearTimeout(fallbackTimer);
        cleanup();
      }
    }

    // If page unloads/pagehide, app likely opened — cancel fallback.
    function onPageHide() {
      fallbackDone = true;
      clearTimeout(fallbackTimer);
      cleanup();
    }

    function cleanup() {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
    }

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);

    // Try to open the LinkedIn app by changing location (this will produce console
    // messages on desktop/devtools but is fine on real devices).
    window.location = appUrl;
  }, { passive: false });
})();


// Position the external nav toggle so it visually aligns with the .container's right edge
function positionNavToggle() {
  const btn = document.getElementById('nav-toggle');
  // Prefer header-specific container, fall back to generic .container
  const container = document.querySelector('.container.header-inner') || document.querySelector('.container');

  if (!btn || !container) return;

  const rect = container.getBoundingClientRect();
  const containerStyle = window.getComputedStyle(container);
  const paddingRight = parseFloat(containerStyle.paddingRight) || 0;

  // X coordinate (from left) of the container's inner right edge
  const innerRightX = rect.left + rect.width - paddingRight;

  // Compute pixels between viewport right edge and that inner right edge
  let rightPx = Math.round(window.innerWidth - innerRightX);

  // Minimum gutter so button never hugs the edge
  const MIN_GUTTER = 8; // px
  if (rightPx < MIN_GUTTER) rightPx = MIN_GUTTER;

  // Apply as inline style (overrides CSS fallback)
  btn.style.right = rightPx + 'px';

  // Ensure button sits above overlay (defensive)
  btn.style.zIndex = 3000;
}

// Run initially and on resize/orientation changes
window.addEventListener('load', positionNavToggle);
window.addEventListener('resize', positionNavToggle);
window.addEventListener('orientationchange', positionNavToggle);

// Also call after any code that might toggle classes that change layout (optional):
// positionNavToggle();
