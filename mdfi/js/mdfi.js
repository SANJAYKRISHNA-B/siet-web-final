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
  const mobileMenuButton = document.querySelector('.institution-mobile-toggle');
  const institutionMenu = document.querySelector('.institution-menu');
  if (mobileMenuButton && institutionMenu) {
    mobileMenuButton.addEventListener('click', () => {
      const open = mobileMenuButton.getAttribute('aria-expanded') !== 'true';
      mobileMenuButton.setAttribute('aria-expanded', String(open));
      institutionMenu.classList.toggle('is-open', open);
    });
    institutionMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        institutionMenu.classList.remove('is-open');
      });
    });
  }

  const resultsModal = document.getElementById('mdi-celebration');
  const resultsDialog = resultsModal?.querySelector('.mdi-celebration-dialog');
  let resultsTrigger = null;
  let resultsTimer = null;
  let resultsUrl = '/downloads/Essay%20Final%20Result%2004.11.2026.pdf';

  const closeResults = () => {
    if (!resultsModal || resultsModal.hidden) return;
    window.clearTimeout(resultsTimer);
    resultsTimer = null;
    resultsModal.hidden = true;
    document.body.classList.remove('mdi-results-open');
    resultsTrigger?.focus();
  };

  const openResults = trigger => {
    if (!resultsModal) return;
    resultsTrigger = trigger;
    resultsUrl = trigger.href;
    window.clearTimeout(resultsTimer);
    resultsModal.hidden = false;
    document.body.classList.add('mdi-results-open');
    window.setTimeout(() => resultsDialog?.focus(), 40);
    resultsTimer = window.setTimeout(() => {
      resultsTimer = null;
      resultsModal.hidden = true;
      document.body.classList.remove('mdi-results-open');
      resultsTrigger?.focus();
      window.open(resultsUrl, '_blank', 'noopener,noreferrer');
    }, 2300);
  };

  document.querySelectorAll('[data-mdi-results-trigger]').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      openResults(trigger);
    });
  });

  resultsModal?.querySelectorAll('[data-mdi-results-close]').forEach(control => control.addEventListener('click', closeResults));
  document.addEventListener('keydown', event => {
    if (!resultsModal || resultsModal.hidden) return;
    if (event.key === 'Escape') closeResults();
    if (event.key === 'Tab') {
      const focusable = [...resultsModal.querySelectorAll('button, a[href]')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

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
