// utils.js - Token & Storage Helpers
// Author: Deep Dey
// Purpose: Client-side human verification (6hr localStorage token)

const STORAGE_KEY = 'gh_verify_token_v1';
const TOKEN_HOURS = 6; // Token validity in hours
const REDIRECT_FILE = 'dd.html';
const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdqcVijtxP2qtiwFtuS-NFBL9_Pnbf6WwiydLnzh4nbxQWy1Q/viewform';

/* ---------------- Utility Functions ---------------- */
function nowMs() { return Date.now(); }

// Generate a simple obfuscated token
function makeTokenObj() {
  return {
    ts: nowMs(),
    exp: nowMs() + TOKEN_HOURS * 3600_000, // 6hr expiry
    note: 'verified_local'
  };
}

// Save token in localStorage
function saveVerified() {
  const obj = makeTokenObj();
  localStorage.setItem(STORAGE_KEY, btoa(JSON.stringify(obj)));
}

// Clear token
function clearVerified() {
  localStorage.removeItem(STORAGE_KEY);
}

// Check if token is valid
function isVerified() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const obj = JSON.parse(atob(raw));
    if (!obj.exp || nowMs() > obj.exp) { clearVerified(); return false; }
    return true;
  } catch (e) {
    clearVerified();
    return false;
  }
}

// Redirect helper
function navigateToRedirect() {
  location.href = REDIRECT_FILE;
}

// Optional: get token object (decoded)
function getTokenObj() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(atob(raw));
  } catch (e) {
    return null;
  }
}

// Debug: log token info (for repo impress)
function logTokenDebug() {
  const token = getTokenObj();
  console.log('Token Debug:', token ? token : 'No token found');
}
