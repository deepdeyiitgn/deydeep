// dot.js - Click the Moving Dot Challenge
// Author: Deep Dey
// Purpose: Human verification by clicking on moving dot

function dotChallenge(container, onSuccess) {
  // Canvas setup
  const canvas = document.createElement('canvas');
  canvas.width = 360;
  canvas.height = 80;
  canvas.style.border = '1px solid #ccc';
  const ctx = canvas.getContext('2d');

  container.appendChild(canvas);

  // Dot properties
  let dot = {
    x: Math.random() * 320 + 20,
    y: Math.random() * 60 + 10,
    r: 10,
    vx: (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1),
    vy: (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1)
  };

  // Draw function
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0b1220';
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Update dot position
  function update() {
    dot.x += dot.vx;
    dot.y += dot.vy;
    if (dot.x < dot.r || dot.x > canvas.width - dot.r) dot.vx *= -1;
    if (dot.y < dot.r || dot.y > canvas.height - dot.r) dot.vy *= -1;
  }

  // Animation loop
  let anim = setInterval(() => {
    update();
    draw();
  }, 16);

  // Click detection
  canvas.addEventListener('click', function (e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const dist = Math.sqrt((mx - dot.x) ** 2 + (my - dot.y) ** 2);
    if (dist <= dot.r) {
      clearInterval(anim);
      onSuccess();
    }
  });
}
