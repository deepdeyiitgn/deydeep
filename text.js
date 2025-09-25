// text.js - Canvas/Text CAPTCHA Module
// Author: Deep Dey
// Purpose: Display a dynamic text challenge to verify human

function textChallenge(container, onSuccess) {
  // Canvas setup
  const canvas = document.createElement('canvas');
  canvas.width = 360;
  canvas.height = 80;
  const ctx = canvas.getContext('2d');

  // Input and button
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Type characters';
  const btn = document.createElement('button');
  btn.textContent = 'Verify';
  const controls = document.createElement('div');
  controls.className = 'controls';
  controls.appendChild(input);
  controls.appendChild(btn);

  container.appendChild(canvas);
  container.appendChild(controls);

  // Generate random code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const code = Array.from({ length: 5 }).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');

  // Draw characters
  ctx.fillStyle = '#f6fafc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < code.length; i++) {
    ctx.save();
    const ch = code[i];
    const x = 24 + i * 60 + (Math.random() * 12 - 6);
    const y = 44 + (Math.random() * 14 - 7);
    const a = (Math.random() * 60 - 30) * Math.PI / 180;
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.font = (26 + Math.floor(Math.random() * 6)) + 'px Georgia';
    ctx.fillStyle = '#0b1220';
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  }

  // Button click
  btn.onclick = () => {
    if (input.value.trim().toUpperCase() === code) {
      onSuccess();
    } else {
      alert('Incorrect — try again.');
      container.innerHTML = '';
      textChallenge(container, onSuccess);
    }
  };

  // Enter key submits
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btn.click();
  });
}
