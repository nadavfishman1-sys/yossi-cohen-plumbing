(() => {
  'use strict';

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('site-header');
  let lastScrollY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 12);

    const hideThreshold = window.innerHeight / 3;
    const scrollingDown = y > lastScrollY;
    if (y > hideThreshold && scrollingDown) {
      header.classList.add('header-hidden');
    } else if (!scrollingDown || y <= hideThreshold) {
      header.classList.remove('header-hidden');
    }
    lastScrollY = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const backdrop = document.getElementById('mobile-nav-backdrop');

  const openMenu = () => {
    mobileNav.classList.add('open');
    backdrop.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    mobileNav.classList.remove('open');
    backdrop.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', () => {
    mobileNav.classList.contains('open') ? closeMenu() : openMenu();
  });
  backdrop.addEventListener('click', closeMenu);
  mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMenu();
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .services-grid, .why-grid');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = ['hero', 'services', 'why-us', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = document.querySelectorAll('.nav-link');

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const navIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => navIo.observe(s));
  }

  /* ---------- Contact form (no backend — client-side only) ---------- */
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      note.textContent = 'נא למלא את כל השדות הנדרשים.';
      note.className = 'form-note error';
      return;
    }

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();

    note.textContent = `תודה ${name || ''}! הבקשה נקלטה ונחזור אליכם בהקדם. לתגובה מיידית ניתן גם להתקשר ל-050-235-3225.`;
    note.className = 'form-note success';
    form.reset();
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
