// My Dream India (MDFI) State-Level Essay Competition Controller
// Manages page loader dismiss and navigation group accessibility.

(() => {
  const loader = document.getElementById('mdi-page-loader');
  if (!loader) return;

  const dismissLoader = () => {
    loader.classList.add('is-exiting');
    document.body.classList.remove('mdi-loading');
    window.setTimeout(() => loader.remove(), 450);
  };

  // Give the logo animation enough time to be visible, even on cached refreshes.
  const startedAt = performance.now();
  window.addEventListener('load', () => {
    window.setTimeout(dismissLoader, Math.max(0, 700 - (performance.now() - startedAt)));
  }, { once: true });

  // Safety fallback so a failed third-party asset can never leave the page blocked.
  window.setTimeout(dismissLoader, 3000);
})();

document.addEventListener('DOMContentLoaded', () => {
  // Navigation hover and click handlers for standalone page
  document.querySelectorAll('.institution-nav-group').forEach(group => {
    let timer = null;
    group.addEventListener('mouseenter', () => {
      if (timer) clearTimeout(timer);
      group.classList.add('open');
      group.querySelector('button')?.setAttribute('aria-expanded', 'true');
    });
    group.addEventListener('mouseleave', () => {
      timer = setTimeout(() => {
        group.classList.remove('open');
        group.querySelector('button')?.setAttribute('aria-expanded', 'false');
      }, 120);
    });
  });
});
