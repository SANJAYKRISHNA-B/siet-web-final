// Sri Shakthi Space Mission & Space Whiz 2026 Interactive Controller
document.addEventListener('DOMContentLoaded', () => {
  // Space Quiz results celebration modal.
  const resultsModal = document.getElementById('results-celebration');
  const resultsDialog = resultsModal?.querySelector('.results-celebration-dialog');
  let resultsTrigger = null;
  let resultsTimer = null;
  let resultsUrl = '/downloads/Quiz%20Final%20Result%202026.pdf';

  const closeResultsModal = () => {
    if (!resultsModal || resultsModal.hidden) return;
    window.clearTimeout(resultsTimer);
    resultsTimer = null;
    resultsModal.hidden = true;
    document.body.classList.remove('results-modal-open');
    resultsTrigger?.focus();
  };

  const openResultsModal = trigger => {
    if (!resultsModal) return;
    resultsTrigger = trigger;
    resultsUrl = trigger.href;
    window.clearTimeout(resultsTimer);
    resultsModal.hidden = false;
    document.body.classList.add('results-modal-open');
    // Restart every launch animation when the modal is opened again.
    resultsModal.classList.remove('is-open');
    void resultsModal.offsetWidth;
    resultsModal.classList.add('is-open');
    window.setTimeout(() => resultsDialog?.focus(), 40);
    // Match the MDFI results flow: finish the celebration, close the modal,
    // then open the selected results PDF in a new tab.
    resultsTimer = window.setTimeout(() => {
      resultsTimer = null;
      resultsModal.hidden = true;
      document.body.classList.remove('results-modal-open');
      resultsTrigger?.focus();
      window.open(resultsUrl, '_blank', 'noopener,noreferrer');
    }, 2300);
  };

  document.querySelectorAll('[data-results-trigger]').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      openResultsModal(trigger);
    });
  });

  resultsModal?.querySelectorAll('[data-results-close]').forEach(control => {
    control.addEventListener('click', closeResultsModal);
  });

  document.addEventListener('keydown', event => {
    if (!resultsModal || resultsModal.hidden) return;
    if (event.key === 'Escape') closeResultsModal();
    if (event.key === 'Tab') {
      const focusable = [...resultsModal.querySelectorAll('button, a[href]')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  // Homepage header navigation on this standalone portal.
  const menuBtn = document.querySelector('.institution-mobile-toggle');
  const nav = document.querySelector('.institution-menu');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') !== 'true';
      menuBtn.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      });
    });
  }

  document.querySelectorAll('.institution-nav-group').forEach(group => {
    const button = group.querySelector('button');
    let timer = null;
    group.addEventListener('mouseenter', () => {
      window.clearTimeout(timer);
      group.classList.add('open');
      button?.setAttribute('aria-expanded', 'true');
    });
    group.addEventListener('mouseleave', () => {
      timer = window.setTimeout(() => {
        group.classList.remove('open');
        button?.setAttribute('aria-expanded', 'false');
      }, 120);
    });
    button?.addEventListener('click', () => {
      const open = !group.classList.contains('open');
      document.querySelectorAll('.institution-nav-group.open').forEach(item => item.classList.remove('open'));
      group.classList.toggle('open', open);
      button.setAttribute('aria-expanded', String(open));
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
