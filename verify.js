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

document.addEventListener('keydown', function(event) {
    // Check if Ctrl key is pressed and the 'U' key (keyCode 85) is pressed
    if (event.ctrlKey && event.keyCode === 85) {
        event.preventDefault(); // Prevent the default action (view source)
    }
});
