// math.js - Math Challenge Module
// Author: Deep Dey
// Purpose: Simple arithmetic challenge to verify human

function mathChallenge(container, onSuccess) {
  // Generate random numbers
  const a = Math.floor(Math.random() * 15) + 3;
  const b = Math.floor(Math.random() * 10) + 2;
  const op = Math.random() > 0.5 ? '+' : '-';
  const ans = op === '+' ? a + b : a - b;

  // Question display
  const q = document.createElement('div');
  q.style.marginTop = '12px';
  q.style.fontSize = '20px';
  q.style.fontWeight = '700';
  q.textContent = `${a} ${op} ${b} = ?`;

  // Input and button
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Answer';
  const btn = document.createElement('button');
  btn.textContent = 'Verify';

  const row = document.createElement('div');
  row.className = 'controls';
  row.appendChild(input);
  row.appendChild(btn);

  container.appendChild(q);
  container.appendChild(row);

  // Verification
  btn.onclick = () => {
    if (input.value.trim() === String(ans)) {
      onSuccess();
    } else {
      alert('Wrong — try carefully.');
      container.innerHTML = '';
      mathChallenge(container, onSuccess);
    }
  };

  // Enter key triggers
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btn.click();
  });
}
