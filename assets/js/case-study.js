/* ################################################# */
/* CASE STUDY INTERACTIVE FEATURES */
/* ################################################# */

document.addEventListener('DOMContentLoaded', function() {
  
  /* ================================================== */
  /* LIGHTBOX FUNCTIONALITY */
  /* ================================================== */
  
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxContent = document.querySelector('.lightbox-media');
  const closeBtn = document.querySelector('.lightbox-close');
  const fullscreenBtn = document.querySelector('.lightbox-fullscreen');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  
  let currentIndex = 0;
  let mediaItems = [];
  
// Build media items array from gallery
galleryItems.forEach((item, index) => {
  const img = item.querySelector('img');
  const video = item.querySelector('video');
  const vimeoContainer = item.querySelector('.vimeo-container iframe');
  
  console.log(`Item ${index}:`, { 
    hasImg: !!img, 
    hasVideo: !!video, 
    hasVimeo: !!vimeoContainer,
    vimeoSrc: vimeoContainer ? vimeoContainer.src : 'none'
  });
  
  if (img) {
    mediaItems.push({
      type: 'image',
      src: img.src,
      alt: img.alt || 'Gallery image'
    });
  } else if (video) {
    const source = video.querySelector('source');
    mediaItems.push({
      type: 'video',
      src: source ? source.src : video.src,
      poster: video.poster || ''
    });
  } else if (vimeoContainer) {
    mediaItems.push({
      type: 'vimeo',
      src: vimeoContainer.src
    });
    console.log('Added Vimeo to mediaItems:', vimeoContainer.src);
  }
  
  // Click handler for gallery items
  item.addEventListener('click', function() {
    currentIndex = index;
    console.log('Clicked item:', index, 'Type:', mediaItems[index]?.type);
    openLightbox(index);
  });
  
  // Keyboard accessibility
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', 'View media in lightbox');
  
  item.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      currentIndex = index;
      openLightbox(index);
    }
  });
});

console.log('Total media items:', mediaItems.length, mediaItems);
  
// Open lightbox
function openLightbox(index) {
  if (!lightbox || !lightboxContent) return;
  
  currentIndex = index;
  const item = mediaItems[index];
  
  // Clear previous content
  lightboxContent.innerHTML = '';
  
  // Create media element
  if (item.type === 'image') {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    lightboxContent.appendChild(img);
  } else if (item.type === 'video') {
    const video = document.createElement('video');
    video.src = item.src;
    video.controls = true;
    video.autoplay = true;
    video.loop = true;
    if (item.poster) video.poster = item.poster;
    lightboxContent.appendChild(video);
  } else if (item.type === 'vimeo') {
  const vimeoWrapper = document.createElement('div');
  vimeoWrapper.className = 'vimeo-container';
  vimeoWrapper.style.maxWidth = '90vw';
  vimeoWrapper.style.maxHeight = '90vh';
  
  const iframe = document.createElement('iframe');
  // Clean the URL and ensure autoplay
  let cleanSrc = item.src.replace(/&autoplay=1&muted=1/g, '');
  if (!cleanSrc.includes('?')) {
    cleanSrc += '?autoplay=1';
  } else {
    cleanSrc += '&autoplay=1';
  }
  
  iframe.src = cleanSrc;
  iframe.frameBorder = '0';
  iframe.allow = 'autoplay; fullscreen; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.style.position = 'absolute';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  
  vimeoWrapper.appendChild(iframe);
  lightboxContent.appendChild(vimeoWrapper);
}
  
  // Show lightbox
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Set focus to close button for keyboard navigation
  if (closeBtn) closeBtn.focus();
}
  
  // Close lightbox
  function closeLightbox() {
    if (!lightbox) return;
    
    // Stop any playing videos
    const video = lightboxContent?.querySelector('video');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Navigate to previous item
  function showPrevious() {
    currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    openLightbox(currentIndex);
  }
  
  // Navigate to next item
  function showNext() {
    currentIndex = (currentIndex + 1) % mediaItems.length;
    openLightbox(currentIndex);
  }
  
  // Toggle fullscreen
  function toggleFullscreen() {
    const mediaElement = lightboxContent?.querySelector('img, video');
    if (!mediaElement) return;
    
    if (!document.fullscreenElement) {
      if (mediaElement.requestFullscreen) {
        mediaElement.requestFullscreen();
      } else if (mediaElement.webkitRequestFullscreen) {
        mediaElement.webkitRequestFullscreen();
      } else if (mediaElement.msRequestFullscreen) {
        mediaElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }
  
  // Event listeners for lightbox controls
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }
  
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Hide fullscreen button if not supported
    if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled) {
      fullscreenBtn.classList.add('hidden');
    }
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', showPrevious);
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', showNext);
  }
  
  // Click outside to close
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrevious();
        break;
      case 'ArrowRight':
        showNext();
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
    }
  });
  
  /* ================================================== */
  /* VIDEO AUTOPLAY ON SCROLL */
  /* ================================================== */
  
  const videoItems = document.querySelectorAll('.gallery-item video');
  
  // Intersection Observer for video autoplay
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      const playOverlay = video.parentElement.querySelector('.play-overlay');
      
      if (entry.isIntersecting) {
        // Video is in viewport
        if (!video.parentElement.classList.contains('playing')) {
          video.muted = true;
          video.play().then(() => {
            if (playOverlay) {
              playOverlay.style.opacity = '0';
            }
            video.parentElement.classList.add('playing');
          }).catch(err => {
            console.log('Autoplay prevented:', err);
          });
        }
      } else {
        // Video is out of viewport
        video.pause();
        video.currentTime = 0;
        if (playOverlay) {
          playOverlay.style.opacity = '1';
        }
        video.parentElement.classList.remove('playing');
      }
    });
  }, {
    threshold: 0.5
  });
  
  // Observe all gallery videos
  videoItems.forEach(video => {
    videoObserver.observe(video);
  });
  
  /* ================================================== */
  /* HERO VIDEO AUTOPLAY */
  /* ================================================== */
  
  const heroVideo = document.querySelector('.case-study-hero-media video');
  
  if (heroVideo) {
    // Ensure hero video autoplays and loops
    heroVideo.muted = true;
    heroVideo.autoplay = true;
    heroVideo.loop = true;
    heroVideo.playsInline = true;
    
    // Try to play on load
    heroVideo.play().catch(err => {
      console.log('Hero video autoplay prevented:', err);
    });
  }

  // Add this with the other video autoplay code
const vimeoIframes = document.querySelectorAll('.vimeo-container iframe');

const vimeoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const iframe = entry.target;
    if (entry.isIntersecting) {
      // Autoplay when in view
      iframe.src = iframe.src + '&autoplay=1&muted=1';
    }
  });
}, { threshold: 0.5 });

vimeoIframes.forEach(iframe => vimeoObserver.observe(iframe));

  
  /* ================================================== */
  /* PROJECT NAVIGATION */
  /* ================================================== */
  
  const projectNav = document.querySelector('.project-nav');
  const prevArrow = document.querySelector('.nav-arrow.arrow-left');
  const nextArrow = document.querySelector('.nav-arrow.arrow-right');
  
  if (projectNav) {
    const prevUrl = projectNav.dataset.prevUrl;
    const nextUrl = projectNav.dataset.nextUrl;
    
    // Set up prev arrow
    if (prevArrow && prevUrl) {
      prevArrow.href = prevUrl;
      prevArrow.classList.remove('hidden');
    } else if (prevArrow) {
      prevArrow.classList.add('hidden');
    }
    
    // Set up next arrow
    if (nextArrow && nextUrl) {
      nextArrow.href = nextUrl;
      nextArrow.classList.remove('hidden');
    } else if (nextArrow) {
      nextArrow.classList.add('hidden');
    }
  }
  
  /* ================================================== */
  /* PREVENT VIDEO CONTEXT MENU (OPTIONAL) */
  /* ================================================== */
  
  // Prevent right-click on videos (optional - protects video sources)
  document.querySelectorAll('video').forEach(video => {
    video.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false;
    });
  });
  
  /* ================================================== */
  /* TOUCH SWIPE FOR LIGHTBOX (MOBILE) */
  /* ================================================== */
  
  let touchStartX = 0;
  let touchEndX = 0;
  
  if (lightbox) {
    lightbox.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }
  
  function handleSwipe() {
    const swipeThreshold = 50;
    
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left - next
      showNext();
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right - previous
      showPrevious();
    }
  }
  
  /* ================================================== */
  /* LAZY LOAD OPTIMIZATION (OPTIONAL) */
  /* ================================================== */
  
  // Lazy load images outside viewport
  const lazyImages = document.querySelectorAll('.gallery-item img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });
  
  /* ================================================== */
  /* PERFORMANCE MONITORING (DEV ONLY) */
  /* ================================================== */
  
  // Log performance metrics (comment out in production)
  if (window.performance && window.performance.timing) {
    window.addEventListener('load', function() {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log('Page load time:', pageLoadTime + 'ms');
    });
  }
  
});

/* ################################################# */
/* UTILITY FUNCTIONS */
/* ################################################# */

// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Get file extension from URL
function getFileExtension(url) {
  return url.split('.').pop().split('?')[0].toLowerCase();
}

// Check if device is mobile
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/* ################################################# */
/* ACCESSIBILITY ENHANCEMENTS */
/* ################################################# */

// Announce lightbox state changes to screen readers
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Add sr-only class to CSS if not already present
if (!document.querySelector('.sr-only')) {
  const style = document.createElement('style');
  style.textContent = `
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `;
  document.head.appendChild(style);
}


