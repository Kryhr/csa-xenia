const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Prevent the native browser image-drag ghost (a small bordered thumbnail
// that trails the cursor if an <img> gets clicked-and-dragged), most
// noticeable on the auto-rotating hero carousel.
document.querySelectorAll('img').forEach((img) => { img.draggable = false; });

// Sticky header compact-on-scroll
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  document.addEventListener('scroll', onScroll, { passive: true });
}

// Mobile/full nav: a side drawer with a dimmed backdrop, not full-screen
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
const mobileNavClose = document.querySelector('.mobile-nav-close');
function openMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.add('open');
  mobileNavBackdrop?.classList.add('open');
  menuToggle?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  mobileNavClose?.focus();
}
function closeMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.remove('open');
  mobileNavBackdrop?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  menuToggle?.focus();
}
menuToggle?.addEventListener('click', openMobileNav);
mobileNavClose?.addEventListener('click', closeMobileNav);
mobileNavBackdrop?.addEventListener('click', closeMobileNav);
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
    const res = await fetch('/csa-xenia/assets/search-index.json');
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
  // Some browsers delay an IntersectionObserver's first callback until
  // after a scroll/reflow event, even for a target that's already
  // visible when observe() is called -- which read as "the page loads
  // with blank sections that only appear once you scroll." Don't rely on
  // that callback for what's already on screen at load: check directly.
  revealEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('in-view');
    } else {
      observer.observe(el);
    }
  });
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

// Events calendar: real month grid built from assets/calendar-events.json
const calendarEl = document.querySelector('.calendar');
if (calendarEl) {
  const grid = calendarEl.querySelector('#calendar-grid');
  const monthLabel = calendarEl.querySelector('#calendar-month-label');
  const eventList = calendarEl.querySelector('#calendar-event-list');
  const prevBtn = calendarEl.querySelector('#calendar-prev');
  const nextBtn = calendarEl.querySelector('#calendar-next');
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const today = new Date();
  let events = [];
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();

  const upcomingPanel = calendarEl.querySelector('.calendar-upcoming');
  const upcomingList = calendarEl.querySelector('#calendar-upcoming-list');
  const dayDetail = calendarEl.querySelector('#calendar-day-detail');

  fetch('/csa-xenia/assets/calendar-events.json')
    .then((res) => res.json())
    .then((data) => {
      events = data;
      renderCalendar();
    })
    .catch(() => renderCalendar());

  // What's coming up next, independent of whatever month is being
  // browsed, recalculated from the real date on every load. Hidden when
  // it would just repeat the month already on screen (e.g. all 3 next
  // events happen to fall in the month you're currently viewing).
  function renderUpcoming(monthEvents) {
    if (!upcomingPanel || !upcomingList) return;
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const next = events
      .filter((ev) => new Date(ev.date + 'T00:00:00') >= startOfToday)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3);
    const monthDates = new Set(monthEvents.map((ev) => ev.date));
    const redundant = next.length > 0 && next.every((ev) => monthDates.has(ev.date));
    if (!next.length || redundant) {
      upcomingPanel.style.display = 'none';
      return;
    }
    upcomingPanel.style.display = '';
    upcomingList.innerHTML = next.map((ev) => {
      const d = new Date(ev.date + 'T00:00:00');
      const label = `${monthNames[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
      return `<div class="calendar-upcoming-item"><span class="calendar-event-date">${label}</span><span>${ev.title}</span></div>`;
    }).join('');
  }

  function eventsFor(year, month) {
    return events.filter((ev) => {
      const d = new Date(ev.date + 'T00:00:00');
      return d.getFullYear() === year && d.getMonth() === month;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }

  const hint = calendarEl.querySelector('.calendar-hint');

  function renderCalendar() {
    if (!grid || !monthLabel) return;
    monthLabel.textContent = `${monthNames[viewMonth]} ${viewYear}`;
    grid.innerHTML = '';
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((d) => {
      const el = document.createElement('div');
      el.className = 'calendar-weekday';
      el.textContent = d;
      grid.appendChild(el);
    });
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const monthEvents = eventsFor(viewYear, viewMonth);
    renderUpcoming(monthEvents);
    if (dayDetail) dayDetail.hidden = true;
    if (hint) hint.style.display = monthEvents.length ? '' : 'none';
    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div');
      el.className = 'calendar-day empty';
      grid.appendChild(el);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const el = document.createElement('div');
      el.className = 'calendar-day';
      const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = monthEvents.filter((ev) => ev.date === iso);
      const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
      if (isToday) el.classList.add('is-today');
      const num = document.createElement('span');
      num.textContent = String(day);
      el.appendChild(num);
      if (dayEvents.length) {
        el.classList.add('has-event');
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        const summary = dayEvents.map((e) => e.title).join(', ');
        el.setAttribute('aria-label', `${monthNames[viewMonth]} ${day}: ${summary}`);
        el.setAttribute('title', summary);
        const dot = document.createElement('span');
        dot.className = 'calendar-dot';
        el.appendChild(dot);
        const showDetail = () => {
          grid.querySelectorAll('.calendar-day.is-selected').forEach((d) => d.classList.remove('is-selected'));
          el.classList.add('is-selected');
          if (!dayDetail) return;
          const dateLabel = `${monthNames[viewMonth]} ${day}`;
          dayDetail.innerHTML = dayEvents.map((ev) => `<p><strong>${dateLabel}:</strong> ${ev.title}</p>`).join('');
          dayDetail.hidden = false;
        };
        el.addEventListener('click', showDetail);
        el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showDetail(); } });
      }
      grid.appendChild(el);
    }
    if (eventList) {
      if (monthEvents.length === 0) {
        const cursor = new Date(viewYear, viewMonth, 1);
        const next = events
          .map((ev) => new Date(ev.date + 'T00:00:00'))
          .filter((d) => d > cursor)
          .sort((a, b) => a - b)[0];
        if (next) {
          eventList.innerHTML = `<p class="calendar-empty-note">No events scheduled this month. <button type="button" class="calendar-jump-link" data-year="${next.getFullYear()}" data-month="${next.getMonth()}">See ${monthNames[next.getMonth()]} ${next.getFullYear()} &rarr;</button></p>`;
          eventList.querySelector('.calendar-jump-link')?.addEventListener('click', (e) => {
            viewYear = Number(e.target.dataset.year);
            viewMonth = Number(e.target.dataset.month);
            renderCalendar();
          });
        } else {
          eventList.innerHTML = '<p class="calendar-empty-note">No events scheduled this month.</p>';
        }
      } else {
        eventList.innerHTML = monthEvents.map((ev) => {
          const d = new Date(ev.date + 'T00:00:00');
          const label = `${monthNames[viewMonth].slice(0, 3)} ${d.getDate()}`;
          return `<div class="calendar-event-item" data-date="${ev.date}"><span class="calendar-event-date">${label}</span><span>${ev.title}</span></div>`;
        }).join('');
      }
    }
  }

  prevBtn?.addEventListener('click', () => {
    viewMonth -= 1;
    if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
    renderCalendar();
  });
  nextBtn?.addEventListener('click', () => {
    viewMonth += 1;
    if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
    renderCalendar();
  });
}

// Form submission feedback: online submissions aren't live yet, so tell
// the visitor plainly rather than pretending the form was sent.
document.querySelectorAll('form[data-form-name]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = form.querySelector('.form-status');
    if (status) {
      status.textContent = "Thanks for reaching out! Online submissions aren't open yet. Please contact us directly by phone or email in the meantime, and we'll get back to you.";
      status.setAttribute('role', 'status');
    }
  });
});
