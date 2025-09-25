// slider.js - Slider Challenge Module (improved)
// Author: Deep Dey (adapted by Copilot assistant)
// Purpose: Human verification via draggable slider (pointer-event based, accessible)

function sliderChallenge(container, onSuccess) {
  // Create elements
  const wrapper = document.createElement('div');
  wrapper.className = 'slider-wrapper';
  wrapper.setAttribute('role', 'group');
  wrapper.style.userSelect = 'none';

  const track = document.createElement('div');
  track.className = 'slider-track';
  // ensure track is a positioned container
  track.style.position = 'relative';
  track.style.width = track.style.width || '100%';
  track.style.height = track.style.height || '44px';

  const handle = document.createElement('div');
  handle.className = 'slider-handle';
  handle.setAttribute('tabindex', '0');
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');
  handle.setAttribute('aria-valuenow', '0');
  handle.style.position = 'absolute';
  handle.style.top = '50%';
  handle.style.transform = 'translateY(-50%) translateX(0px)';
  handle.style.touchAction = 'none'; // prevent default gestures
  // give a sensible default size if none provided via CSS
  handle.style.width = handle.style.width || '44px';
  handle.style.height = handle.style.height || '44px';
  handle.style.cursor = 'grab';

  const label = document.createElement('div');
  label.className = 'slider-label';
  label.textContent = 'Slide to verify';
  label.style.userSelect = 'none';
  label.style.marginTop = '8px';

  // structure: wrapper > track > handle + label
  track.appendChild(handle);
  wrapper.appendChild(track);
  wrapper.appendChild(label);
  container.appendChild(wrapper);

  // Slider state
  let isDragging = false;
  let startOffset = 0; // pointer X offset at start
  let currentX = 0; // current translate X
  let isVerified = false;

  // compute maxX based on layout
  const maxX = () => Math.max(0, track.clientWidth - handle.offsetWidth);

  // update aria and label
  const setProgress = (px) => {
    currentX = px;
    handle.style.transform = `translateY(-50%) translateX(${px}px)`;
    const percent = Math.round((px / Math.max(1, maxX())) * 100);
    handle.setAttribute('aria-valuenow', String(percent));
    label.textContent = isVerified ? 'Verified ✓' : (percent > 0 ? `Sliding… ${percent}%` : 'Slide to verify');
  };

  const verifySuccess = () => {
    if (isVerified) return;
    isVerified = true;
    setProgress(maxX());
    handle.style.cursor = 'default';
    label.textContent = 'Verified ✓';
    try {
      if (typeof onSuccess === 'function') onSuccess();
    } catch (err) {
      // swallow callback errors to avoid breaking UI
      console.error('onSuccess callback threw:', err);
    }
  };

  const resetSlider = (animate = true) => {
    if (isVerified) return;
    if (animate) {
      handle.style.transition = 'transform 220ms ease';
      requestAnimationFrame(() => setProgress(0));
      const onTransEnd = () => {
        handle.style.transition = '';
        handle.removeEventListener('transitionend', onTransEnd);
      };
      handle.addEventListener('transitionend', onTransEnd);
    } else {
      handle.style.transition = '';
      setProgress(0);
    }
  };

  // Pointer handling (unifies mouse/touch)
  const onPointerDown = (e) => {
    if (isVerified) return;
    // only left mouse button or touch
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    isDragging = true;
    handle.setPointerCapture(e.pointerId);
    handle.style.cursor = 'grabbing';
    // compute offset: pointer clientX minus currentX minus track left
    const trackRect = track.getBoundingClientRect();
    startOffset = e.clientX - trackRect.left - currentX;
    label.textContent = 'Sliding…';
    // prevent page scroll on touch devices
    e.preventDefault && e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!isDragging || isVerified) return;
    const trackRect = track.getBoundingClientRect();
    let x = e.clientX - trackRect.left - startOffset;
    x = Math.max(0, Math.min(x, maxX()));
    setProgress(x);
    if (x >= maxX()) verifySuccess();
    e.preventDefault && e.preventDefault();
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    try { handle.releasePointerCapture && handle.releasePointerCapture(e.pointerId); } catch (_) {}
    handle.style.cursor = 'grab';
    if (!isVerified) resetSlider();
  };

  handle.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  // also catch pointercancel
  window.addEventListener('pointercancel', onPointerUp);

  // keyboard accessibility: arrow keys move, space/enter verify if at end
  handle.addEventListener('keydown', (e) => {
    if (isVerified) return;
    const step = Math.max(8, Math.round(maxX() / 20));
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      setProgress(Math.min(maxX(), currentX + step));
      if (currentX >= maxX()) verifySuccess();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      setProgress(Math.max(0, currentX - step));
      e.preventDefault();
    } else if (e.key === ' ' || e.key === 'Enter') {
      // if near the end, verify; otherwise nudge forward
      if (currentX >= maxX() - 8) verifySuccess();
      else setProgress(Math.min(maxX(), currentX + step));
      e.preventDefault();
    } else if (e.key === 'Escape') {
      resetSlider();
      e.preventDefault();
    }
  });

  // Recompute on resize
  const onResize = () => {
    // clamp currentX to new max
    const m = maxX();
    if (currentX > m) {
      setProgress(m);
      if (m === 0) verifySuccess();
    }
  };
  window.addEventListener('resize', onResize);

  // init
  setProgress(0);

  // Return a small API so callers can programmatically verify/reset if needed
  return {
    verify: verifySuccess,
    reset: () => resetSlider(false),
    destroy: () => {
      handle.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      handle.removeEventListener('keydown', this);
      window.removeEventListener('resize', onResize);
      if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
    },
  };
}
