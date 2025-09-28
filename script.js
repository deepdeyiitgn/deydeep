// script.js
// Copy-paste this into your site. Change TARGET_URL to monitor another host.
// REFRESH_MS controls realtime update frequency (ms).

(() => {
  const TARGET_URL = window.location.origin; // <-- change if you want to monitor other URL
  const REFRESH_MS = 5000; // update every 5 seconds

  // Minimal CSS injected
  const style = document.createElement('style');
  style.textContent = `
  #sysBtn{position:fixed;right:20px;bottom:20px;z-index:2147483647;width:44px;height:44px;border-radius:50%;border:none;background:#0f172a;color:#fff;font-size:18px;display:none;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 22px rgba(2,6,23,0.3)}
  #sysPopup{position:fixed;right:20px;bottom:80px;width:360px;max-width:96vw;background:#fff;border-radius:10px;box-shadow:0 14px 36px rgba(2,6,23,0.18);z-index:2147483647;overflow:hidden;font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial;}
  #sysPopup .head{display:flex;border-bottom:1px solid #eef2f7}
  #sysPopup .tab{flex:1;text-align:center;padding:9px 6px;font-weight:700;font-size:13px;cursor:pointer;user-select:none}
  #sysPopup .tab.active{background:#f8fafc}
  #sysPopup .content{padding:10px;font-size:13px;line-height:1.35;max-height:420px;overflow:auto;color:#0f172a}
  .sys-row{display:flex;justify-content:space-between;margin:6px 0;padding:8px;border-radius:8px;background:#fbfdff;align-items:center}
  .sys-row small{color:#6b7280}
  .est-tag{font-size:11px;color:#b91c1c;margin-left:6px;font-weight:800}
  .note-box{margin-top:8px;padding:8px;background:#f8fafc;border-radius:8px;font-size:12px;color:#0f172a}
  @media (max-width:640px){ #sysPopup{left:50%;top:50%;right:auto;bottom:auto;transform:translate(-50%,-50%);width:92vw;max-width:420px} #sysBtn{right:12px;bottom:12px} }
  `;
  document.head.appendChild(style);

  // Button
  const btn = document.createElement('button');
  btn.id = 'sysBtn';
  btn.title = 'Monitor';
  btn.innerHTML = '⚡';
  btn.style.display = 'none';
  document.body.appendChild(btn);

  // Popup
  const popup = document.createElement('div');
  popup.id = 'sysPopup';
  popup.style.display = 'none';
  popup.innerHTML = `
    <div class="head">
      <div class="tab active" data-tab="server">Server</div>
      <div class="tab" data-tab="user">User</div>
    </div>
    <div class="content" id="sysContent">Ready — scroll to bottom to show button, click ⚡ to open monitor.</div>
  `;
  document.body.appendChild(popup);

  const $ = (s, r = popup) => r.querySelector(s);

  // Show button only when scrolled to bottom
  function checkScrollForButton() {
    const nearBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 5);
    btn.style.display = nearBottom ? 'flex' : 'none';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
  }
  checkScrollForButton();
  window.addEventListener('scroll', checkScrollForButton);
  window.addEventListener('resize', checkScrollForButton);

  // Tabs
  popup.addEventListener('click', (e) => {
    const t = e.target.closest('.tab');
    if (!t) return;
    popup.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    updateOnce();
  });

  // Toggle
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
    updateOnce();
  });
  document.addEventListener('click', (e) => {
    if (popup.style.display !== 'block') return;
    if (!popup.contains(e.target) && e.target !== btn) popup.style.display = 'none';
  });

  // Measure server (ping, status, size, headers) - best effort; may be limited by CORS
  async function measureServer() {
    const start = performance.now();
    let ping = '—';
    let status = '—';
    let sizeBytes = null;
    let headersObj = {};
    try {
      const resp = await fetch(TARGET_URL, { method: 'GET', cache: 'no-store' });
      const end = performance.now();
      ping = Math.round(end - start) + ' ms';
      status = `${resp.status} ${resp.statusText}`;
      const cl = resp.headers.get('content-length');
      if (cl) sizeBytes = parseInt(cl, 10);
      else {
        const blob = await resp.clone().blob();
        sizeBytes = blob.size;
      }
      ['content-type','cache-control','last-modified','etag','server'].forEach(k => {
        const v = resp.headers.get(k);
        if (v) headersObj[k] = v;
      });
    } catch (err) {
      ping = 'ERR';
      status = 'Fetch failed (CORS/network)';
      sizeBytes = null;
      headersObj = {};
    }
    return { ping, status, sizeBytes, headersObj };
  }

  // User info via browser APIs
  async function getUserInfo() {
    const nav = navigator;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection || null;
    let batteryInfo = null;
    try { if (navigator.getBattery) { const b = await navigator.getBattery(); batteryInfo = { level: Math.round(b.level*100)+'%', charging: b.charging }; } } catch(e){ batteryInfo=null; }
    const perf = performance;
    let mem = null;
    if (perf && perf.memory) {
      mem = {
        usedJSHeapSize: Math.round(perf.memory.usedJSHeapSize/1024/1024) + ' MB',
        totalJSHeapSize: Math.round(perf.memory.totalJSHeapSize/1024/1024) + ' MB'
      };
    }

    // cookies count (may be empty string)
    const cookieStr = document.cookie || '';
    const cookiesCount = cookieStr ? cookieStr.split(';').length : 0;

    // localStorage/sessionStorage sizes (approx by JSON.stringify)
    let lsSize = 'n/a', ssSize = 'n/a';
    try { lsSize = humanBytes(new Blob([JSON.stringify(localStorage)]).size); } catch(e){ lsSize = 'n/a'; }
    try { ssSize = humanBytes(new Blob([JSON.stringify(sessionStorage)]).size); } catch(e){ ssSize = 'n/a'; }

    // time info
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'n/a';
    const localTime = new Date().toLocaleString();

    return {
      userAgent: nav.userAgent,
      platform: nav.platform,
      language: nav.language,
      cores: nav.hardwareConcurrency || 'n/a',
      cookieEnabled: nav.cookieEnabled,
      cookiesCount,
      online: nav.onLine,
      connection: conn ? { effectiveType: conn.effectiveType, downlink: conn.downlink, rtt: conn.rtt } : null,
      battery: batteryInfo,
      memory: mem,
      deviceMemory: navigator.deviceMemory || 'n/a',
      plugins: navigator.plugins ? navigator.plugins.length : 'n/a',
      touchPoints: navigator.maxTouchPoints || 0,
      doNotTrack: navigator.doNotTrack || 'n/a',
      viewport: { w: window.innerWidth, h: window.innerHeight },
      timezone: tz,
      localTime
    };
  }

  // Helpers
  function humanBytes(n) {
    if (n === null || n === undefined) return '—';
    if (typeof n !== 'number') return n;
    const sizes = ['B','KB','MB','GB','TB'];
    if (n === 0) return '0 B';
    const i = Math.floor(Math.log(n)/Math.log(1024));
    return (n/Math.pow(1024,i)).toFixed(i?2:0) + ' ' + sizes[i];
  }

  function renderServerTab(data) {
    const rows = [];
    rows.push(`<div class="sys-row"><div><small>Target</small></div><div><strong>${TARGET_URL}</strong></div></div>`);
    rows.push(`<div class="sys-row"><div><small>Ping</small></div><div><strong>${data.ping}</strong></div></div>`);
    rows.push(`<div class="sys-row"><div><small>Status</small></div><div><strong>${data.status}</strong></div></div>`);
    rows.push(`<div class="sys-row"><div><small>Response size</small></div><div><strong>${humanBytes(data.sizeBytes)}</strong></div></div>`);
    const hdrs = Object.keys(data.headersObj || {});
    if (hdrs.length) {
      hdrs.forEach(k => rows.push(`<div class="sys-row"><div><small>${k}</small></div><div><small>${data.headersObj[k]}</small></div></div>`));
    }
    // Estimated (simulated) section - clearly labelled as ESTIMATED (SIMULATED)
    rows.push(`<div style="margin-top:8px;border-top:1px dashed #eef2f7;padding-top:8px;color:#374151;font-size:12px"><strong>Server internal metrics</strong> <span class="est-tag">ESTIMATED (SIMULATED)</span></div>`);
    const estCpu = (Math.floor(Math.random()*40)+10) + '%';
    const estRam = (Math.floor(Math.random()*50)+20) + '%';
    const estDisk = (Math.floor(Math.random()*60)+15) + '%';
    rows.push(`<div class="sys-row"><div><small>CPU (est)</small></div><div><strong>${estCpu}</strong></div></div>`);
    rows.push(`<div class="sys-row"><div><small>RAM (est)</small></div><div><strong>${estRam}</strong></div></div>`);
    rows.push(`<div class="sys-row"><div><small>Disk (est)</small></div><div><strong>${estDisk}</strong></div></div>`);
    rows.push(`<div class="note-box">Note: CPU/RAM/Disk shown above are estimates only because browsers cannot access host internals. Ping/Status/Response size are measured live (subject to CORS).</div>`);
    return rows.join('');
  }

  function renderUserTab(info) {
    const r = [];
    r.push(`<div class="sys-row"><div><small>Browser</small></div><div style="max-width:160px"><small>${info.userAgent}</small></div></div>`);
    r.push(`<div class="sys-row"><div><small>Platform</small></div><div><strong>${info.platform}</strong></div></div>`);
    r.push(`<div class="sys-row"><div><small>Language</small></div><div><strong>${info.language}</strong></div></div>`);
    r.push(`<div class="sys-row"><div><small>Timezone</small></div><div><strong>${info.timezone}</strong></div></div>`);
    r.push(`<div class="sys-row"><div><small>Local time</small></div><div><strong>${info.localTime}</strong></div></div>`);
    r.push(`<div class="sys-row"><div><small>CPU cores</small></div><div><strong>${info.cores}</strong></div></div>`);
    r.push(`<div class="sys-row"><div><small>Device memory</small></div><div><strong>${info.deviceMemory}</strong></div></div>`);
    r.push(`<div class="sys-row"><div><small>JS Heap</small></div><div><small>${info.memory ? (info.memory.usedJSHeapSize + ' / ' + info.memory.totalJSHeapSize) : 'n/a'}</small></div></div>`);
    r.push(`<div class="sys-row"><div><small>Connection</small></div><div><small>${info.connection ? `${info.connection.effectiveType} · ${info.connection.downlink}Mbps · rtt ${info.connection.rtt}ms` : 'n/a'}</small></div></div>`);
    r.push(`<div class="sys-row"><div><small>Online</small></div><div><strong>${info.online}</strong></div></div>`);
    r.push(`<div class="sys-row"><div><small>Cookies</small></div><div><small>enabled:${info.cookieEnabled} · count:${info.cookiesCount}</small></div></div>`);
    r.push(`<div class="sys-row"><div><small>Storage sizes</small></div><div><small>local:${info.cookiesCount? '' : ''}${info.localStorageSize || ''}${info.localStorageSize ? '' : ''}${' '}${info.localStorageSize ? '' : ''}${'ls:'+ (info.localStorage || '')}</small></div></div>`);
    // show approximate sizes we computed
    try {
      r.push(`<div class="sys-row"><div><small>localStorage size</small></div><div><small>${(function(){ try { return humanBytes(new Blob([JSON.stringify(localStorage)]).size); } catch(e){ return 'n/a'; } })()}</small></div></div>`);
    } catch(e) {}
    try {
      r.push(`<div class="sys-row"><div><small>sessionStorage size</small></div><div><small>${(function(){ try { return humanBytes(new Blob([JSON.stringify(sessionStorage)]).size); } catch(e){ return 'n/a'; } })()}</small></div></div>`);
    } catch(e) {}
    if (info.battery) r.push(`<div class="sys-row"><div><small>Battery</small></div><div><small>${info.battery.level}${info.battery.charging? ' · charging':''}</small></div></div>`);
    r.push(`<div class="sys-row"><div><small>Plugins</small></div><div><small>${info.plugins}</small></div></div>`);
    r.push(`<div class="sys-row"><div><small>Touch points</small></div><div><small>${info.touchPoints}</small></div></div>`);
    r.push(`<div class="sys-row"><div><small>Do Not Track</small></div><div><small>${info.doNotTrack}</small></div></div>`);
    r.push(`<div class="sys-row"><div><small>Viewport</small></div><div><strong>${info.viewport.w}×${info.viewport.h}</strong></div></div>`);
    r.push(`<div class="note-box">Privacy note: <strong>No data is stored or sent anywhere.</strong> All values shown are read locally from your browser and displayed only in your session.</div>`);
    r.push(`<div style="margin-top:6px;font-size:11px;color:#6b7280">Note: All user-side values above are read directly from browser APIs in real-time.</div>`);
    return r.join('');
  }

  // Update logic
  async function updateOnce() {
    const active = popup.querySelector('.tab.active')?.dataset?.tab || 'server';
    const c = $('#sysContent');
    c.innerHTML = 'Updating...';
    if (active === 'server') {
      const s = await measureServer();
      c.innerHTML = renderServerTab(s);
    } else {
      const u = await getUserInfo();
      c.innerHTML = renderUserTab(u);
    }
  }

  // Auto-refresh while popup open
  setInterval(async () => {
    if (popup.style.display !== 'block') return;
    const active = popup.querySelector('.tab.active')?.dataset?.tab || 'server';
    if (active === 'server') {
      const s = await measureServer();
      $('#sysContent').innerHTML = renderServerTab(s);
    } else {
      const u = await getUserInfo();
      $('#sysContent').innerHTML = renderUserTab(u);
    }
  }, REFRESH_MS);

  // Initial message
  (async () => {
    $('#sysContent').innerHTML = 'Ready — scroll to bottom to show button, click ⚡ to open monitor.';
  })();

})();

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

  // ==================



// =======================
// Responsive Clock Size
// =======================
function adjustClockSize() {
  const clockEl = document.getElementById('navbarClock');
  if (!clockEl) return;

  const screenWidth = window.innerWidth;

  if (screenWidth <= 768) {
    // Mobile devices
    clockEl.style.fontSize = '0.9rem';
    clockEl.style.fontWeight = '500';
  } else {
    // Desktop/Tablet
    clockEl.style.fontSize = '1.2rem';
    clockEl.style.fontWeight = '600';
  }
}

// Initial adjustment
adjustClockSize();

// Adjust on window resize
window.addEventListener('resize', adjustClockSize);
