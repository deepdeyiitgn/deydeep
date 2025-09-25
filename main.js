// main.js - Page Controller for Human Verification
// Author: Deep Dey
// Purpose: Load challenge modules, check token, handle verification and redirect

const statusEl = document.getElementById('status');
const area = document.getElementById('challengeArea');

/* ---------------- Status Helpers ---------------- */
function showStatus(txt) {
  statusEl.textContent = txt;
}

/* ---------------- Redirect ---------------- */
function goToRedirect() {
  // Open dd.html in same tab
  location.href = 'dd.html';
}

/* ---------------- Challenge Flow ---------------- */
function init() {
  // If already verified, redirect immediately
  if (isVerified()) {
    showStatus('Verified — Redirecting…');
    setTimeout(goToRedirect, 600);
    return;
  }

  showStatus('Not verified');
  renderChooser();
}

// Randomly select a challenge type
function renderChooser() {
  const types = ['text', 'math', 'dot', 'slider', 'puzzle']; // <--- puzzle add kiya
  const t = types[Math.floor(Math.random() * types.length)];
  area.innerHTML = ''; // clear previous

  switch (t) {
    case 'text':
      textChallenge(area, onSuccess);
      break;
    case 'math':
      mathChallenge(area, onSuccess);
      break;
    case 'dot':
      dotChallenge(area, onSuccess);
      break;
    case 'slider':
      sliderChallenge(area, onSuccess);
      break;
   case 'puzzle':        // <--- new case
     puzzleChallenge(area, onSuccess);
    break;
    default:
      console.error('Unknown challenge type');
      break;
  }
}

// Called when user successfully completes challenge
function onSuccess() {
  saveVerified();
  showStatus('Verified ✓ Redirecting…');
  setTimeout(goToRedirect, 350);
}

/* ---------------- Initialize ---------------- */
init();

/* ---------------- Optional Debug ---------------- */
logTokenDebug();
