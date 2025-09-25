// verify.js
const STORAGE_KEY = 'gh_verify_token_v1';

function nowMs() { return Date.now(); }

function isVerified() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const obj = JSON.parse(atob(raw));
    if (!obj.exp || nowMs() > obj.exp) return false;
    return true;
  } catch { return false; }
}

function protectPage(redirectTo='index.html') {
  if (!isVerified()) {
    alert('Verification required! Redirecting…');
    window.location.href = redirectTo;
  }
}

function preventCtrlU(event) {
  // Check if the Ctrl key is pressed and the key code for 'U' (85)
  if (event.ctrlKey && event.keyCode === 85) {
    event.preventDefault(); // Prevent the default browser action
    console.log("Ctrl + U is disabled."); // Optional: log a message to the console
  }
}

// Add the event listener to the document
document.addEventListener('keydown', preventCtrlU);
