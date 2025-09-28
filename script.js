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
// Smooth Scroll for Navigation
// =======================
document.querySelectorAll('.navbar ul li a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if(targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: isMobile() ? 'start' : 'center' });
    } else {
      window.location.href = targetId;
    }
    if(navLinks.classList.contains('active')) navLinks.classList.remove('active');
  });
});

// =======================
// Button Hover & Tap Animation
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
// Section Fade-in Animation
// =======================
const sections = document.querySelectorAll('.section, .hero, .about-hero, .blog-hero, .contact-hero, .portfolio-hero');
const fadeInOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

sections.forEach(section => {
  section.classList.add('pre-fade');
  fadeInOnScroll.observe(section);
});

// =======================
// Desktop Parallax Blobs
// =======================
if (!isMobile()) {
  const blobs = document.querySelectorAll('.bg-blob');
  let mouseX = 0, mouseY = 0, animating = false;
  window.addEventListener('mousemove', throttle((e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
    if (!animating) {
      animating = true;
      requestAnimationFrame(() => {
        blobs.forEach((blob, i) => {
          blob.style.transform = `translate(${mouseX*(i+1)}px, ${mouseY*(i+1)}px)`;
        });
        animating = false;
      });
    }
  }, 16));
}

// =======================
// Reduce motion for accessibility
// =======================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('reduced-motion');
  const style = document.createElement('style');
  style.innerHTML = '* { transition: none !important; animation: none !important; }';
  document.head.appendChild(style);
}

// =======================
// Lazy load images
// =======================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if(img.dataset.src) img.src = img.dataset.src;
  });
});

// =======================
// Throttle & Debounce Utilities
// =======================
function throttle(fn, wait) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if(now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// =======================
// Blockers
// =======================
document.addEventListener('keydown', (e) => {
  const blockedKeys = ['a','c','v','x','u'];
  if(e.ctrlKey && blockedKeys.includes(e.key.toLowerCase())) {
    e.preventDefault();
    const alertDiv = document.createElement('div');
    alertDiv.textContent = `🚫 Ctrl+${e.key.toUpperCase()} is blocked!`;
    Object.assign(alertDiv.style, {
      position: 'fixed', top: '20px', right: '20px', background: 'rgba(255,0,0,0.9)',
      color: '#fff', padding: '10px 15px', borderRadius: '5px', fontFamily: 'Arial, sans-serif',
      zIndex: 9999, boxShadow: '0 0 10px rgba(0,0,0,0.5)', transition: 'opacity 0.5s'
    });
    document.body.appendChild(alertDiv);
    setTimeout(() => { alertDiv.style.opacity = '0'; setTimeout(()=>alertDiv.remove(),500); }, 1500);
  }
});

document.addEventListener('contextmenu', e => e.preventDefault());

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
// Navbar & Clock Responsive
// =======================
(function() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Remove old logo if exists
  const oldLogo = navbar.querySelector('.logo');
  if (oldLogo) oldLogo.remove();

  // Create logo container
  const logoContainer = document.createElement('div');
  logoContainer.className = 'logo-container';
  logoContainer.style.display = 'flex';
  logoContainer.style.alignItems = 'center';
  logoContainer.style.justifyContent = 'center';
  logoContainer.style.gap = '12px';
  logoContainer.style.margin = '0 auto'; // center

  // Logo image
  const logoImg = document.createElement('img');
  logoImg.src = "https://www.deepdeyiitk.com/web/image/website/1/favicon?unique=e5fe8cd";
  logoImg.alt = "Deep Dey Logo";
  logoImg.style.width = '36px';
  logoImg.style.height = '36px';

  // Logo text link
  const logoLink = document.createElement('a');
  logoLink.href = "https://apps.deepdeyiitk.com/";
  logoLink.textContent = "Deep Dey";
  logoLink.style.textDecoration = 'none';
  logoLink.style.color = '#3a0ca3';
  logoLink.style.fontWeight = '700';
  logoLink.style.fontSize = '1.8rem';

  // Append to container
  logoContainer.appendChild(logoImg);
  logoContainer.appendChild(logoLink);

  // Insert at start of navbar
  navbar.insertBefore(logoContainer, navbar.firstChild);

  // =======================
  // Clock Setup
  // =======================
  const clockDesktop = document.getElementById('navbarClock');
  const clockFooter = document.getElementById('footerClock');

  function updateClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2,'0');
    const date = String(now.getDate()).padStart(2,'0');
    const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const day = dayNames[now.getDay()];

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2,'0');
    const seconds = String(now.getSeconds()).padStart(2,'0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = String(hours).padStart(2,'0');

    const clockStr = `${year}/${month}/${date} ${day} || ${hours}:${minutes}:${seconds} ${ampm}`;

    // Show clock on desktop navbar only
    if (clockDesktop) clockDesktop.textContent = clockStr;

    // Show clock in footer for mobile
    if (clockFooter) clockFooter.textContent = clockStr;
  }

  function adjustClockDisplay() {
    if (window.innerWidth <= 768) {
      if(clockDesktop) clockDesktop.style.display = 'none';
      if(clockFooter) clockFooter.style.display = 'block';
    } else {
      if(clockDesktop) clockDesktop.style.display = 'block';
      if(clockFooter) clockFooter.style.display = 'none';
    }
  }

  updateClock();
  adjustClockDisplay();
  setInterval(updateClock, 1000);
  window.addEventListener('resize', adjustClockDisplay);

  // Styling
  if(clockDesktop) {
    clockDesktop.style.fontSize = '1.3rem';
    clockDesktop.style.fontWeight = '600';
    clockDesktop.style.color = '#ffd60a';
    clockDesktop.style.fontFamily = 'monospace';
    clockDesktop.style.marginLeft = 'auto';
    clockDesktop.style.whiteSpace = 'nowrap';
  }
  if(clockFooter) {
    clockFooter.style.fontSize = '1.2rem';
    clockFooter.style.fontWeight = '500';
    clockFooter.style.color = '#ffd60a';
    clockFooter.style.fontFamily = 'monospace';
    clockFooter.style.textAlign = 'center';
    clockFooter.style.marginTop = '12px';
  }
})();




