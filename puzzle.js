// puzzle.js - Puzzle Piece Challenge (hard for bots, easy for humans)
// Author: Deep Dey (adapted)
// Usage: puzzleChallenge(container, onSuccess, options)
// options: { width, height, tolerance, imageUrl }
// returns { verify, reset, destroy }

function puzzleChallenge(container, onSuccess, options = {}) {
  const width = options.width || 300;
  const height = options.height || 150;
  const tolerance = options.tolerance || 8;
  const imageUrl = options.imageUrl || null; // optional background image

  // Create wrapper and canvases
  const wrapper = document.createElement('div');
  wrapper.className = 'puzzle-wrapper';
  wrapper.style.position = 'relative';
  wrapper.style.width = width + 'px';
  wrapper.style.userSelect = 'none';

  const mainCanvas = document.createElement('canvas');
  mainCanvas.width = width;
  mainCanvas.height = height;
  mainCanvas.style.display = 'block';
  mainCanvas.style.width = width + 'px';
  mainCanvas.style.height = height + 'px';
  mainCanvas.style.borderRadius = '6px';
  mainCanvas.style.boxSizing = 'border-box';
  mainCanvas.style.background = '#eee';

  const pieceCanvas = document.createElement('canvas');
  pieceCanvas.width = width;
  pieceCanvas.height = height;
  pieceCanvas.style.position = 'absolute';
  pieceCanvas.style.left = '0px';
  pieceCanvas.style.top = '0px';
  pieceCanvas.style.pointerEvents = 'auto';
  pieceCanvas.style.touchAction = 'none';
  pieceCanvas.style.userSelect = 'none';

  // Controls / label
  const label = document.createElement('div');
  label.className = 'puzzle-label';
  label.textContent = 'Slide the piece into the hole';
  label.style.marginTop = '8px';
  label.style.fontFamily = 'sans-serif';
  label.style.fontSize = '13px';

  wrapper.appendChild(mainCanvas);
  wrapper.appendChild(pieceCanvas);
  wrapper.appendChild(label);
  container.appendChild(wrapper);

  const mainCtx = mainCanvas.getContext('2d');
  const pieceCtx = pieceCanvas.getContext('2d');

  // Puzzle piece metrics
  const pieceSize = Math.round(Math.min(width, height) / 4); // e.g., ~75 for 300x150
  const pieceRadius = Math.max(6, Math.round(pieceSize / 6));

  // Randomize target location (leave margin)
  const margin = 12 + pieceSize;
  const targetX = Math.floor(margin + Math.random() * (width - 2 * margin));
  const targetY = Math.floor((height - pieceSize) / 2); // vertical center

  // Starting x for movable piece (left side)
  let startPieceX = 6;
  const pieceY = targetY;

  // state
  let dragging = false;
  let dragStartClientX = 0;
  let pieceOffsetX = startPieceX; // current left of piece image
  let verified = false;

  // Helper: create a classic puzzle piece path offset at (x,y)
  function createPiecePath(ctx, x, y) {
    const s = pieceSize;
    const r = pieceRadius;
    ctx.beginPath();
    // Start top-left
    ctx.moveTo(x, y + r);
    // top edge
    ctx.lineTo(x + s / 3, y + r);
    // top bump
    ctx.arc(x + s / 2, y + r, r, Math.PI, 0, true);
    ctx.lineTo(x + (2 * s) / 3, y + r);
    ctx.lineTo(x + s, y + r);
    // right edge
    ctx.lineTo(x + s, y + s / 3);
    // right bump
    ctx.arc(x + s, y + s / 2, r, -Math.PI / 2, Math.PI / 2, true);
    ctx.lineTo(x + s, y + (2 * s) / 3);
    ctx.lineTo(x + s, y + s);
    // bottom edge
    ctx.lineTo(x + (2 * s) / 3, y + s);
    ctx.arc(x + s / 2, y + s, r, 0, Math.PI, true);
    ctx.lineTo(x + s / 3, y + s);
    ctx.lineTo(x, y + s);
    // left edge
    ctx.lineTo(x, y + (2 * s) / 3);
    ctx.arc(x, y + s / 2, r, Math.PI / 2, -Math.PI / 2, true);
    ctx.lineTo(x, y + s / 3);
    ctx.closePath();
  }

  // Render background (image or generated pattern)
  function renderBackground(image) {
    // simple gradient background if no image
    if (!image) {
      const g = mainCtx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, '#f6f8fa');
      g.addColorStop(1, '#e9eef7');
      mainCtx.fillStyle = g;
      mainCtx.fillRect(0, 0, width, height);

      // add subtle noise-ish rectangles to make it less uniform
      mainCtx.globalAlpha = 0.06;
      for (let i = 0; i < 8; i++) {
        mainCtx.fillStyle = i % 2 === 0 ? '#cfe1ff' : '#fff';
        mainCtx.fillRect(
          Math.random() * width,
          Math.random() * height,
          Math.random() * (width / 3),
          Math.random() * (height / 3)
        );
      }
      mainCtx.globalAlpha = 1;
    } else {
      mainCtx.drawImage(image, 0, 0, width, height);
    }

    // Draw the soft hole shape
    mainCtx.save();
    mainCtx.globalCompositeOperation = 'destination-out';
    mainCtx.fillStyle = 'rgba(0,0,0,1)';
    createPiecePath(mainCtx, targetX, targetY);
    mainCtx.fill();
    mainCtx.restore();

    // Draw a subtle stroke around the hole so human notices it
    mainCtx.save();
    mainCtx.lineWidth = 2;
    mainCtx.strokeStyle = 'rgba(0,0,0,0.12)';
    createPiecePath(mainCtx, targetX, targetY);
    mainCtx.stroke();
    mainCtx.restore();
  }

  // Render the movable piece onto pieceCanvas at pieceOffsetX
  function renderPiece(image) {
    // clear piece canvas
    pieceCtx.clearRect(0, 0, width, height);

    // clip to piece shape
    pieceCtx.save();
    createPiecePath(pieceCtx, targetX, pieceY); // create path in same coordinates
    pieceCtx.clip();

    // draw the source image or pattern shifted so piece shows correct content
    if (!image) {
      // draw gradient pattern matching main (so piece appears to come from the same source)
      const g = pieceCtx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, '#f6f8fa');
      g.addColorStop(1, '#e9eef7');
      pieceCtx.fillStyle = g;
      pieceCtx.fillRect(0, 0, width, height);
      // same subtle rectangles
      pieceCtx.globalAlpha = 0.06;
      for (let i = 0; i < 8; i++) {
        pieceCtx.fillStyle = i % 2 === 0 ? '#cfe1ff' : '#fff';
        pieceCtx.fillRect(
          Math.random() * width,
          Math.random() * height,
          Math.random() * (width / 3),
          Math.random() * (height / 3)
        );
      }
      pieceCtx.globalAlpha = 1;
    } else {
      // draw the image normally
      pieceCtx.drawImage(image, 0, 0, width, height);
    }
    pieceCtx.restore();

    // Now copy the clipped piece image to a temporary canvas to reposition it
    const temp = document.createElement('canvas');
    temp.width = pieceSize;
    temp.height = pieceSize;
    const tctx = temp.getContext('2d');

    // extract piece image by drawing clipped region onto temp (translate so targetX,targetY maps to 0,0)
    tctx.drawImage(
      pieceCanvas,
      targetX, pieceY, pieceSize, pieceSize,
      0, 0, pieceSize, pieceSize
    );

    // Clear pieceCanvas and redraw just the piece at pieceOffsetX
    pieceCtx.clearRect(0, 0, width, height);

    // draw a faint shadow to indicate moveable piece
    pieceCtx.save();
    pieceCtx.globalCompositeOperation = 'source-over';
    pieceCtx.filter = 'drop-shadow(0px 2px 6px rgba(0,0,0,0.25))';
    pieceCtx.drawImage(temp, pieceOffsetX, pieceY);
    pieceCtx.restore();

    // draw border around piece
    pieceCtx.save();
    pieceCtx.lineWidth = 2;
    pieceCtx.strokeStyle = 'rgba(0,0,0,0.15)';
    // recreate shape at the current left position by translating path
    pieceCtx.translate(pieceOffsetX - targetX, 0);
    createPiecePath(pieceCtx, targetX, pieceY);
    pieceCtx.stroke();
    pieceCtx.setTransform(1,0,0,1,0,0);
    pieceCtx.restore();
  }

  // Load optional image and initialize drawing
  function start() {
    if (!imageUrl) {
      renderBackground(null);
      // Need to render piece as well: trick—draw background into pieceCanvas for extraction
      pieceCtx.clearRect(0, 0, width, height);
      // draw same pattern, then extract piece
      renderPiece(null);
      renderPiece(null); // second call ensures extraction consistent
    } else {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        renderBackground(img);
        // draw background into pieceCanvas for extraction
        pieceCtx.clearRect(0, 0, width, height);
        renderPiece(img);
      };
      img.onerror = () => {
        // fallback to pattern if image fails
        renderBackground(null);
        renderPiece(null);
      };
      img.src = imageUrl;
    }
  }

  // Pointer events for dragging piece horizontally
  function onPointerDown(e) {
    if (verified) return;
    // only left button or touch
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true;
    dragStartClientX = e.clientX;
    pieceCanvas.setPointerCapture && pieceCanvas.setPointerCapture(e.pointerId);
    label.textContent = 'Keep sliding...';
    e.preventDefault && e.preventDefault();
  }

  function onPointerMove(e) {
    if (!dragging || verified) return;
    const dx = e.clientX - dragStartClientX;
    let newX = pieceOffsetX + dx;
    // clamp
    newX = Math.max(0, Math.min(newX, width - pieceSize));
    // update state
    pieceOffsetX = newX;
    // update start point for next move
    dragStartClientX = e.clientX;
    renderPiece(imageUrl ? null : null); // piece drawing uses global state; background image already baked into canvases
    renderPiece(null); // ensure piece is rendered fresh (works for both cases)
    // check for success
    if (Math.abs(pieceOffsetX - targetX) <= tolerance) {
      // align
      pieceOffsetX = targetX;
      renderPiece(null);
      succeed();
    }
    e.preventDefault && e.preventDefault();
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    try { pieceCanvas.releasePointerCapture && pieceCanvas.releasePointerCapture(e.pointerId); } catch (_) {}
    if (!verified) {
      // snap back if far from target
      if (Math.abs(pieceOffsetX - targetX) > tolerance) {
        // animate back to start (simple)
        const from = pieceOffsetX;
        const to = startPieceX;
        const duration = 220;
        const startTime = performance.now();
        function anim(t) {
          const p = Math.min(1, (t - startTime) / duration);
          const ease = 1 - Math.pow(1 - p, 3);
          pieceOffsetX = from + (to - from) * ease;
          renderPiece(null);
          if (p < 1) requestAnimationFrame(anim);
          else pieceOffsetX = to;
        }
        requestAnimationFrame(anim);
      }
    }
  }

  function succeed() {
    if (verified) return;
    verified = true;
    label.textContent = 'Verified ✓';
    // small success animation: fade out hole stroke
    mainCtx.save();
    mainCtx.globalAlpha = 0.95;
    mainCtx.fillStyle = 'rgba(255,255,255,0.0)';
    mainCtx.restore();
    // call onSuccess safely
    try {
      if (typeof onSuccess === 'function') onSuccess();
    } catch (err) {
      console.error('onSuccess error', err);
    }
  }

  // Keyboard support: left/right arrows to nudge, enter/space to try verifying if close
  pieceCanvas.tabIndex = 0;
  pieceCanvas.style.outline = 'none';
  pieceCanvas.addEventListener('keydown', (e) => {
    if (verified) return;
    const step = Math.max(6, Math.round(pieceSize / 6));
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      pieceOffsetX = Math.min(width - pieceSize, pieceOffsetX + step);
      renderPiece(null);
      if (Math.abs(pieceOffsetX - targetX) <= tolerance) succeed();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      pieceOffsetX = Math.max(0, pieceOffsetX - step);
      renderPiece(null);
      e.preventDefault();
    } else if (e.key === ' ' || e.key === 'Enter') {
      if (Math.abs(pieceOffsetX - targetX) <= tolerance) succeed();
      else {
        pieceOffsetX = Math.min(width - pieceSize, pieceOffsetX + step);
        renderPiece(null);
      }
      e.preventDefault();
    } else if (e.key === 'Escape') {
      pieceOffsetX = startPieceX;
      renderPiece(null);
      e.preventDefault();
    }
  });

  // Attach pointer listeners
  pieceCanvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  // init offsets and render
  pieceOffsetX = startPieceX;
  start();

  // Public API
  return {
    verify: () => {
      pieceOffsetX = targetX;
      renderPiece(null);
      succeed();
    },
    reset: () => {
      verified = false;
      pieceOffsetX = startPieceX;
      renderPiece(null);
      label.textContent = 'Slide the piece into the hole';
    },
    destroy: () => {
      pieceCanvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
    },
  };
}