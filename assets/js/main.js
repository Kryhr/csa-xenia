const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Sticky header compact-on-scroll
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  document.addEventListener('scroll', onScroll, { passive: true });
}

// Mobile nav
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavClose = document.querySelector('.mobile-nav-close');
function openMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.add('open');
  menuToggle?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  mobileNavClose?.focus();
}
function closeMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  menuToggle?.focus();
}
menuToggle?.addEventListener('click', openMobileNav);
mobileNavClose?.addEventListener('click', closeMobileNav);
mobileNav?.addEventListener('click', (e) => { if (e.target === mobileNav) closeMobileNav(); });
mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileNav));

// Search panel: simple client-side search over a small real index
const searchToggle = document.querySelector('.search-toggle');
const searchPanel = document.querySelector('.search-panel');
const searchInput = document.querySelector('.search-input');
const searchResults = document.querySelector('.search-results');
let searchIndex = null;

async function loadSearchIndex() {
  if (searchIndex) return searchIndex;
  try {
    const res = await fetch('assets/search-index.json');
    searchIndex = await res.json();
  } catch (err) {
    searchIndex = [];
  }
  return searchIndex;
}

function renderSearchResults(query) {
  if (!searchResults) return;
  if (!query.trim()) {
    searchResults.innerHTML = '';
    return;
  }
  const q = query.toLowerCase();
  const matches = (searchIndex || []).filter((item) =>
    item.title.toLowerCase().includes(q) || (item.excerpt || '').toLowerCase().includes(q)
  ).slice(0, 8);
  if (matches.length === 0) {
    searchResults.innerHTML = '<p class="search-empty">No pages found.</p>';
    return;
  }
  searchResults.innerHTML = matches
    .map((item) => `<a href="${item.url}">${item.title}</a>`)
    .join('');
}

async function openSearch() {
  if (!searchPanel) return;
  searchPanel.classList.add('open');
  await loadSearchIndex();
  searchInput?.focus();
}
function closeSearch() {
  if (!searchPanel) return;
  searchPanel.classList.remove('open');
  if (searchInput) searchInput.value = '';
  if (searchResults) searchResults.innerHTML = '';
  searchToggle?.focus();
}
searchToggle?.addEventListener('click', openSearch);
searchPanel?.addEventListener('click', (e) => { if (e.target === searchPanel) closeSearch(); });
searchInput?.addEventListener('input', (e) => renderSearchResults(e.target.value));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSearch();
    closeMobileNav();
  }
});

// Hero photo carousel: auto-rotate, dots, pause on hover/focus, reduced-motion safe
const carousel = document.querySelector('.hero-carousel');
if (carousel) {
  const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
  const dotsWrap = carousel.querySelector('.hero-carousel-dots');
  const pauseBtn = carousel.querySelector('.hero-carousel-pause');
  let current = 0;
  let timer = null;
  const interval = 5500;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Show photo ${i + 1} of ${slides.length}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap?.appendChild(dot);
  });
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

  function goTo(index) {
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
  }

  function start() {
    if (reducedMotion || slides.length < 2) return;
    stop();
    timer = setInterval(() => goTo(current + 1), interval);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  let paused = false;
  function setPaused(state) {
    paused = state;
    if (pauseBtn) pauseBtn.setAttribute('aria-pressed', String(state));
    if (state) stop(); else start();
  }
  carousel.addEventListener('mouseenter', () => stop());
  carousel.addEventListener('mouseleave', () => { if (!paused) start(); });
  pauseBtn?.addEventListener('click', () => setPaused(!paused));

  if (slides.length > 0) slides[0].classList.add('active');
  start();
}

// Scroll-triggered reveal (also covers the staggered facts-band count-in)
const revealEls = document.querySelectorAll('.reveal, .facts-grid');
if (revealEls.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in-view'));
}

// Back to top
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  document.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });
}

// Copyright year
document.querySelectorAll('.current-year').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Form submission feedback (no backend yet; confirms the intent honestly)
document.querySelectorAll('form[data-form-name]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.dataset.formName;
    const status = form.querySelector('.form-status');
    if (status) {
      status.textContent = `Thanks. This form isn't wired up to a backend yet, so nothing was actually sent. When it is, this is where your ${name} submission confirmation will appear.`;
      status.setAttribute('role', 'status');
    }
  });
});
