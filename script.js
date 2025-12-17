/* Why: ensure background video behaves nicely across browsers + respect reduced motion. */
(function () {
  const video = document.getElementById('heroVideo');
  if (!video) return;

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // rely on poster (CSS already hides video); nothing else to do
    return;
  }

  // Autoplay handling (mobile/iOS sometimes blocks even if muted)
  const tryPlay = () => {
    const p = video.play?.();
    if (p && typeof p.then === 'function') {
      p.catch(() => {
        // If autoplay is blocked, try after a user gesture
        const once = () => {
          video.play().finally(() => {
            window.removeEventListener('touchstart', once, { passive: true });
            window.removeEventListener('click', once);
          });
        };
        window.addEventListener('touchstart', once, { passive: true });
        window.addEventListener('click', once);
      });
    }
  };

  // If sources fail, keep poster visible
  video.addEventListener('error', () => {
    video.style.display = 'none';
  });

  // Kick things off
  tryPlay();
})();