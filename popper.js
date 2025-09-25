// popper.js
// Simple confetti (party popper) effect 🎉

function launchConfetti() {
  const duration = 2 * 1000; // 2 seconds
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
      })
    );
  }, 250);
}

// Auto trigger after popup submit
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("popupSubmitted", () => {
    launchConfetti();
  });
});
