/* ################################################# */
/* MOBILE NAVIGATION */
/* ################################################# */

// Mobile nav toggle
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
const mobileNavOverlay = document.getElementById("mobileNavOverlay");

if (navToggle && navClose && mobileNavOverlay) {
  let scrollPosition = 0;

  // --- OPEN MENU ---
  navToggle.addEventListener("click", () => {
    mobileNavOverlay.classList.add("open");
    navToggle.style.display = "none";
    navClose.style.display = "block";

    // Scroll lock
    scrollPosition = window.scrollY;
    document.body.style.top = `-${scrollPosition}px`;
    document.body.classList.add("no-scroll");
    document.documentElement.classList.add("no-scroll");
  });

  // --- CLOSE MENU ---
  navClose.addEventListener("click", () => {
    mobileNavOverlay.classList.remove("open");
    navClose.style.display = "none";
    navToggle.style.display = "block";

    // Release scroll lock
    document.body.classList.remove("no-scroll");
    document.documentElement.classList.remove("no-scroll");
    document.body.style.top = "";
    window.scrollTo(0, scrollPosition);
  });
}

/* ################################################# */
/* MAKING THE HEADER STICKY TO TOP OF SCREEN */
/* ################################################# */

window.addEventListener('scroll', function() {
  const headerWrap = document.querySelector('.sticky-header-wrap');
  if (window.scrollY > 10) {
    headerWrap.classList.add('scrolled');
  } else {
    headerWrap.classList.remove('scrolled');
  }
});

/* ################################################# */
/* MAKING ELEMENTS REVEAL AS THE SCROLL INTO VIEW */
/* ################################################# */

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

/* ################################################# */
/* HAVING THE FOOTER FADE IN AS SCROLLED INTO VIEW */
/* ################################################# */

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


/* ################################################# */
/* SCROLL TO TOP BUTTON LOGIC */
/* ################################################# */

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


/* ################################################# */
/* DEEP LINK TO OPEN LINKEDIN APP ON MOBILE */
/* ################################################# */

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


/* ################################################# */
/* NAVIGATION TOGGLE ALIGNMENT */
/* ################################################# */

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


/* ################################################# */
/* SCROLL BEHAVIOURS */
/* ################################################# */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    const offset = 100; // To account for sticky header height
    const targetPosition = target.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});


/* ################################################# */
/* BULLET POINT FADE IN ANIMATION */
/* ################################################# */

// Bullet item fade-in animation on scroll
document.addEventListener("DOMContentLoaded", function () {
  const bulletItems = document.querySelectorAll('.bullet-item');

  const bulletObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        bulletObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  bulletItems.forEach(item => {
    bulletObserver.observe(item);
  });
});


/* ################################################# */
/* MAKING THE COPYRIGHT YEAR VALUE AVAILABLE IN FOOTER */
/* ################################################# */

document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('copyright-year');
  if (el && window.COPYRIGHT_YEAR !== undefined) el.textContent = window.COPYRIGHT_YEAR;
});


/* ################################################# */
/* YOUTUBE VIDEO PLAYER SWITCHER */
/* ################################################# */

document.addEventListener('DOMContentLoaded', () => {
  const mainVideo = document.getElementById('mainVideo');
  const thumbnails = document.querySelectorAll('.thumbnail-item');
  const thumbnailsContainer = document.querySelector('.video-thumbnails');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  
  if (!mainVideo || thumbnails.length === 0) return;
  
  const isMobile = () => window.innerWidth <= 768;
  
  // Helper function to stop all playing videos on mobile
  function stopAllVideos() {
    thumbnails.forEach(thumb => {
      if (thumb.classList.contains('playing')) {
        const iframe = thumb.querySelector('iframe');
        if (iframe) {
          // Remove the iframe to stop playback
          iframe.remove();
        }
        
        // Show the thumbnail image and play overlay again
        const img = thumb.querySelector('img');
        const overlay = thumb.querySelector('.play-overlay');
        if (img) img.style.display = 'block';
        if (overlay) overlay.style.display = 'flex';
        
        // Reset thumbnail styling
        thumb.style.position = '';
        thumb.style.paddingBottom = '';
        thumb.style.height = '';
        
        thumb.classList.remove('playing');
      }
    });
  }
  
  // Desktop/Tablet: Click on thumbnails to update main player
  // Mobile: Click on thumbnails to replace with video player
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function(e) {
      const videoId = this.getAttribute('data-video-id');
      const index = parseInt(this.getAttribute('data-index'));
      
      if (isMobile()) {
        // Mobile: Replace thumbnail with embedded video player
        if (!this.classList.contains('playing')) {
          // Stop any currently playing videos first
          stopAllVideos();
          
          // Create iframe
          const iframe = document.createElement('iframe');
          iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
          iframe.width = '100%';
          iframe.height = '100%';
          iframe.frameBorder = '0';
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          iframe.allowFullscreen = true;
          iframe.style.position = 'absolute';
          iframe.style.top = '0';
          iframe.style.left = '0';
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.borderRadius = '8px';
          
          // Hide the thumbnail image and play overlay
          const img = this.querySelector('img');
          const overlay = this.querySelector('.play-overlay');
          if (img) img.style.display = 'none';
          if (overlay) overlay.style.display = 'none';
          
          // Make thumbnail container relative for iframe positioning
          this.style.position = 'relative';
          this.style.paddingBottom = '56.25%'; // 16:9 aspect ratio
          this.style.height = '0';
          
          // Add iframe to thumbnail
          this.appendChild(iframe);
          this.classList.add('playing');
        }
      } else {
        // Desktop: Update main video player
        mainVideo.src = `https://www.youtube.com/embed/${videoId}`;
        
        // Remove active class from all thumbnails
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        // Add active class to clicked thumbnail
        this.classList.add('active');
        
        // Update dots
        updateDots(index);
      }
    });
  });
  
  // Mobile: Detect scroll position and update dots + stop videos
  if (thumbnailsContainer) {
    let scrollTimeout;
    let lastActiveIndex = 0;
    
    thumbnailsContainer.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        if (!isMobile()) return; // Only run on mobile
        
        const scrollLeft = thumbnailsContainer.scrollLeft;
        const itemWidth = thumbnailsContainer.scrollWidth / thumbnails.length;
        const currentIndex = Math.round(scrollLeft / itemWidth);
        
        // If the index changed (user swiped to a different video)
        if (currentIndex !== lastActiveIndex) {
          // Stop all playing videos
          stopAllVideos();
          lastActiveIndex = currentIndex;
        }
        
        // Update active thumbnail
        thumbnails.forEach((thumb, index) => {
          if (index === currentIndex) {
            thumb.classList.add('active');
          } else {
            thumb.classList.remove('active');
          }
        });
        
        // Update dots
        updateDots(currentIndex);
      }, 150);
    });
  }
  
  // Click on dots to navigate
  dots.forEach(dot => {
    dot.addEventListener('click', function() {
      if (!isMobile()) return; // Only work on mobile
      
      const index = parseInt(this.getAttribute('data-index'));
      const itemWidth = thumbnailsContainer.scrollWidth / thumbnails.length;
      
      // Stop all playing videos before navigating
      stopAllVideos();
      
      // Scroll to the corresponding thumbnail
      thumbnailsContainer.scrollTo({
        left: itemWidth * index,
        behavior: 'smooth'
      });
    });
  });
  
  // Helper function to update dots
  function updateDots(activeIndex) {
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
});