
// =======================
// Device Detection & Vibe
// =======================
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

document.body.classList.add(isMobile() ? 'mobile-vibe' : 'desktop-vibe');

// =======================
// Mobile Navbar Toggle
// =======================
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.navbar ul');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// =======================
// Smooth Scroll for Navigation (with device-specific effect)
// =======================
const links = document.querySelectorAll('.navbar ul li a');
links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if(targetElement) {
      if (isMobile()) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      window.location.href = targetId; // fallback for different pages
    }
    // Close mobile menu after click
    if(navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
    }
  });
});

// =======================
// Button Hover & Tap Animation (device-specific)
// =======================
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
  if (isMobile()) {
    button.addEventListener('touchstart', () => {
      button.style.transform = 'scale(0.97)';
      button.style.boxShadow = '0 2px 12px #ffd60a';
    });
    button.addEventListener('touchend', () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '';
    });
  } else {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.07)';
      button.style.boxShadow = '0 8px 32px #3a0ca3';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '';
    });
  }
});

// =======================
// Section Fade-in Animation (Intersection Observer)
// =======================
const sections = document.querySelectorAll('.section, .hero, .about-hero, .blog-hero, .contact-hero, .portfolio-hero');
const fadeInOptions = {
  threshold: 0.15
};
const fadeInOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, fadeInOptions);
sections.forEach(section => {
  section.classList.add('pre-fade');
  fadeInOnScroll.observe(section);
});

// =======================
// Device-specific Vibe: Mobile vs Desktop
// =======================
if (isMobile()) {
  // Mobile: Add a subtle bounce to buttons and cards
  document.body.classList.add('mobile-vibe');
} else {
  // Desktop: Add a subtle parallax effect to blobs
  const blobs = document.querySelectorAll('.bg-blob');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    blobs.forEach((blob, i) => {
      blob.style.transform = `translate(${x * (i+1)}px, ${y * (i+1)}px)`;
    });
  });
}

// =======================
// Smooth Page Load Animation
// =======================
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-loaded');
});

// =======================
// Performance Optimizations & Lag-Free Animations
// =======================

// Throttle function for scroll/resize/mousemove
function throttle(fn, wait) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// Debounce function for resize
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Use requestAnimationFrame for parallax (desktop only)
if (!isMobile()) {
  const blobs = document.querySelectorAll('.bg-blob');
  let mouseX = 0, mouseY = 0;
  let animating = false;
  window.addEventListener('mousemove', throttle((e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
    if (!animating) {
      animating = true;
      requestAnimationFrame(updateBlobs);
    }
  }, 16)); // ~60fps
  function updateBlobs() {
    blobs.forEach((blob, i) => {
      blob.style.transform = `translate(${mouseX * (i+1)}px, ${mouseY * (i+1)}px)`;
    });
    animating = false;
  }
}

// Reduce animation for low-end devices or prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('reduced-motion');
  // Remove transitions/animations
  const style = document.createElement('style');
  style.innerHTML = '* { transition: none !important; animation: none !important; }';
  document.head.appendChild(style);
}

// Lazy load images (if any)
document.addEventListener('DOMContentLoaded', () => {
  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  lazyImgs.forEach(img => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
  });
});

// =======================
// Utility: Throttle for performance
// =======================
function throttle(fn, wait) {
  let time = Date.now();
  return function(...args) {
    if ((time + wait - Date.now()) < 0) {
      fn.apply(this, args);
      time = Date.now();
    }
  };
}

// =======================
// Blocker:
// =======================
document.addEventListener('DOMContentLoaded', function() {
    // ==========================
    // Config
    // ==========================
    const blockedCtrlKeys = ['a', 'c', 'v', 'x', 'u']; // Ctrl shortcuts to block

    // ==========================
    // Common function: show error overlay
    // ==========================
    function showErrorOverlay(message) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0.85)';
        overlay.style.color = '#fff';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.fontSize = '2em';
        overlay.style.fontFamily = 'Arial, sans-serif';
        overlay.style.zIndex = 99999;
        overlay.textContent = message || '🚫 Action is blocked!';
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 2000);
    }

    // ==========================
    // Ctrl key blocking
    // ==========================
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && blockedCtrlKeys.includes(e.key.toLowerCase())) {
            e.preventDefault();
            showErrorOverlay(`🚫 Ctrl+${e.key.toUpperCase()} is blocked!`);
        }

        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            showErrorOverlay('🚫 F12 is blocked!');
        }

        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') {
            e.preventDefault();
            showErrorOverlay('🚫 Dev Tools are blocked!');
        }
    });

    // ==========================
    // Right-click disable
    // ==========================
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showErrorOverlay('🚫 Right-click is blocked!');
    });

    // ==========================
    // Text selection disable
    // ==========================
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        showErrorOverlay('🚫 Text selection is blocked!');
    });
});


// =========================
// Drag Protection Module
// =========================
const dragProtection = {
    enabled: true, // true = block drag, false = allow drag
    init: function() {
        if (!this.enabled) return;

        // Detect drag start
        document.addEventListener('mousedown', this.handleMouseDown);
    },
    handleMouseDown: function(e) {
        if (e.button === 0) { // Left mouse button
            e.preventDefault();

            // Show error overlay
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.background = 'rgba(0,0,0,0.85)';
            overlay.style.color = '#fff';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.fontSize = '2em';
            overlay.style.fontFamily = 'Arial, sans-serif';
            overlay.style.zIndex = 99999;
            overlay.textContent = '🚫 Dragging is disabled!';
            document.body.appendChild(overlay);

            // Remove overlay after 2 seconds
            setTimeout(() => {
                overlay.remove();
            }, 2000);
        }
    },
    toggle: function(state) {
        this.enabled = state;
    }
};

// Initialize the drag protection
dragProtection.init();


