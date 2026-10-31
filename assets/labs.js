// SIET Specialized Research Facilities - Interactive Controller
// Manages image fallbacks, thumbnail switching, lightbox previews, and category filtering.

// 1. Resilience fallback: automatically retry with /assets/images/site/
window.addEventListener('error', function(event) {
  if (event.target && event.target.tagName === 'IMG') {
    const img = event.target;
    if (img.dataset.hasFallenBack) return;
    img.dataset.hasFallenBack = 'true';
    const currentSrc = img.src || '';
    if (currentSrc.includes('/assets/images/site/')) {
      img.src = currentSrc.replace('/assets/images/site/', '/assets/images/site/');
    }
  }
}, true);

document.addEventListener('DOMContentLoaded', () => {
  // 2. Thumbnail click switcher
  document.querySelectorAll('.lab-feature-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const card = thumb.closest('.lab-feature-card');
      const mainImgWrap = card.querySelector('.lab-feature-main-img-wrap');
      const mainImg = mainImgWrap.querySelector('.lab-feature-main-img');

      const newSrc = thumb.dataset.src;
      const newTitle = thumb.dataset.title;
      const newDesc = thumb.dataset.desc;

      mainImg.src = newSrc;
      mainImgWrap.dataset.img = newSrc;
      mainImgWrap.dataset.title = newTitle;
      mainImgWrap.dataset.desc = newDesc;

      card.querySelectorAll('.lab-feature-thumb').forEach(t => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
    });
  });

  // 3. Lightbox Modal
  const lightbox = document.getElementById('labs-page-lightbox');
  if (lightbox) {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = lightbox.querySelector('.siet-lab-lightbox-close');

    function openLightbox(src, title, desc) {
      if (lightboxImg) lightboxImg.src = src;
      if (lightboxTitle) lightboxTitle.textContent = title || 'Specialized Research Facility';
      if (lightboxDesc) lightboxDesc.textContent = desc || 'Sri Shakthi Institute of Engineering and Technology';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.lab-feature-main-img-wrap').forEach(wrap => {
      wrap.addEventListener('click', () => {
        openLightbox(wrap.dataset.img, wrap.dataset.title, wrap.dataset.desc);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // 4. Category Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const labCards = document.querySelectorAll('.lab-feature-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      labCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'grid';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});
