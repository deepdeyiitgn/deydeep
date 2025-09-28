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
    document.addEventListener('keydown', function(e) {
        const blockedKeys = ['a', 'c', 'v', 'x', 'u']; // keys to block with Ctrl
        if (e.ctrlKey && blockedKeys.includes(e.key.toLowerCase())) {
            e.preventDefault();

            // Create alert div
            const alertDiv = document.createElement('div');
            alertDiv.textContent = `🚫 Ctrl+${e.key.toUpperCase()} is blocked!`;
            alertDiv.style.position = 'fixed';
            alertDiv.style.top = '20px';
            alertDiv.style.right = '20px';
            alertDiv.style.background = 'rgba(255,0,0,0.9)';
            alertDiv.style.color = '#fff';
            alertDiv.style.padding = '10px 15px';
            alertDiv.style.borderRadius = '5px';
            alertDiv.style.fontFamily = 'Arial, sans-serif';
            alertDiv.style.zIndex = 9999;
            alertDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
            alertDiv.style.transition = 'opacity 0.5s';
            document.body.appendChild(alertDiv);

            // Fade out after 1.5 seconds
            setTimeout(() => {
                alertDiv.style.opacity = '0';
                setTimeout(() => alertDiv.remove(), 500);
            }, 1500);
        }
    });
});

// =======================
// Blocker: Block Right Click Only
// =======================

  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

// =======================
// Favicon Setup for All Pages
// Author: Deep
// Date: 28 Sep 2025
// Purpose: Set default favicon for all pages
// =======================

// =======================
// Favicon Setup
// =======================
(function() {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    document.head.appendChild(link);
  }
  link.href = "https://www.deepdeyiitk.com/web/image/website/1/favicon?unique=e5fe8cd";
})();

// =======================
// Back to Top Button
// =======================
const backTop = document.createElement('button');
backTop.textContent = '↑';
backTop.id = 'backTop';
Object.assign(backTop.style, {
  position:'fixed', bottom:'20px', right:'20px', padding:'10px 15px',
  border:'none', borderRadius:'5px', background:'#3a0ca3', color:'#ffd60a',
  cursor:'pointer', display:'none'
});
document.body.appendChild(backTop);
backTop.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));
window.addEventListener('scroll', ()=>{ backTop.style.display = window.scrollY > 400 ? 'block':'none'; });

// =======================
// Typed Text Animation
// =======================
const typedText = ["JEE Aspirant 2027","Creator","Web Developer","Loyal"];
let index = 0, charIndex = 0;
const typedEl = document.querySelector('.typed');
function type() {
  if(!typedEl) return;
  typedEl.textContent = typedText[index].slice(0,charIndex++);
  if(charIndex>typedText[index].length){ charIndex=0; index=(index+1)%typedText.length; setTimeout(type,1000);}
  else setTimeout(type,150);
}
type();

// =======================
// Animated Counters
// =======================
document.querySelectorAll('.counter').forEach(counter=>{
  const updateCount=()=>{
    const target=+counter.dataset.target;
    const count=+counter.innerText;
    const increment=target/200;
    if(count<target){ counter.innerText=Math.ceil(count+increment); setTimeout(updateCount,20); }
    else counter.innerText=target;
  };
  updateCount();
});

// =======================
// Live Date & Clock in Navbar
// =======================
(function(){
  const navbar = document.querySelector('.navbar');
  if(!navbar) return;
  const clockEl = document.createElement('div');
  clockEl.id = 'navbarClock';
  Object.assign(clockEl.style,{
    fontSize:'0.9rem', color:'#ffd60a', marginLeft:'auto', padding:'0 15px',
    fontFamily:'monospace', whiteSpace:'nowrap'
  });
  navbar.appendChild(clockEl);

  function updateClock(){
    const now=new Date();
    const year=now.getFullYear();
    const month=String(now.getMonth()+1).padStart(2,'0');
    const date=String(now.getDate()).padStart(2,'0');
    const dayNames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const day=dayNames[now.getDay()];
    let hours=now.getHours();
    const minutes=String(now.getMinutes()).padStart(2,'0');
    const seconds=String(now.getSeconds()).padStart(2,'0');
    const ampm=hours>=12?'PM':'AM';
    hours=hours%12||12;
    hours=String(hours).padStart(2,'0');
    clockEl.textContent=`${year}/${month}/${date} ${day} || ${hours}:${minutes}:${seconds} ${ampm}`;
  }
  updateClock();
  setInterval(updateClock,1000);
})();

// =======================
// Dark / Light Mode Toggle
// =======================
const toggleBtn = document.createElement('button');
toggleBtn.textContent = '🌓 Beta';
toggleBtn.id = 'themeToggle';
Object.assign(toggleBtn.style,{
  position:'fixed', bottom:'20px', left:'20px', padding:'10px 16px',
  background:'#3a0ca3', color:'#ffd60a', border:'none', borderRadius:'8px',
  fontSize:'0.95rem', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 12px rgba(0,0,0,0.3)',
  transition:'all 0.3s ease'
});
toggleBtn.addEventListener('mouseenter', ()=>{ toggleBtn.style.transform='scale(1.05)'; toggleBtn.style.boxShadow='0 6px 16px rgba(0,0,0,0.4)'; });
toggleBtn.addEventListener('mouseleave', ()=>{ toggleBtn.style.transform='scale(1)'; toggleBtn.style.boxShadow='0 4px 12px rgba(0,0,0,0.3)'; });
document.body.appendChild(toggleBtn);

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});


// =======================
// Navbar Update: Center Logo & Favicon (Updated)
// =======================
(function() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Remove existing logo text/container
  const oldLogo = navbar.querySelector('.logo, .logo-container');
  if (oldLogo) oldLogo.remove();

  // Create new logo container
  const logoContainer = document.createElement('div');
  logoContainer.className = 'logo-container';
  logoContainer.style.display = 'flex';
  logoContainer.style.alignItems = 'center';
  logoContainer.style.justifyContent = 'center';
  logoContainer.style.gap = '12px';
  logoContainer.style.margin = '0 auto'; // center

  // -----------------------
  // Logo image with www link
  // -----------------------
  const logoLinkImg = document.createElement('a');
  logoLinkImg.href = "https://www.deepdeyiitk.com/"; // www subdomain
  logoLinkImg.style.display = 'inline-flex';
  logoLinkImg.style.alignItems = 'center';

  const logoImg = document.createElement('img');
  logoImg.src = "https://www.deepdeyiitk.com/web/image/website/1/favicon?unique=e5fe8cd";
  logoImg.alt = "Deep Dey Logo";
  logoImg.style.width = '36px';
  logoImg.style.height = '36px';

  logoLinkImg.appendChild(logoImg);
  logoContainer.appendChild(logoLinkImg);

  // -----------------------
  // Text link with apps subdomain
  // -----------------------
  const logoLinkText = document.createElement('a');
  logoLinkText.href = "https://apps.deepdeyiitk.com/"; // apps subdomain
  logoLinkText.textContent = "Deep Dey";
  logoLinkText.style.textDecoration = 'none';
  logoLinkText.style.color = '#3a0ca3';
  logoLinkText.style.fontWeight = '700';
  logoLinkText.style.fontSize = '1.8rem';
  logoLinkText.style.display = 'flex';
  logoLinkText.style.alignItems = 'center';

  logoContainer.appendChild(logoLinkText);

  // Insert in navbar at the start
  navbar.insertBefore(logoContainer, navbar.firstChild);
