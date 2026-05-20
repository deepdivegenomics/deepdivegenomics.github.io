/* ============================================================
   Deep Dive Genomics — Main Script
   Vanilla JS • No dependencies (except optional AOS)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ──────────────────────────────────────────────────────────
     1. Mobile Hamburger Toggle
     ────────────────────────────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    // Toggle menu open / close
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  /* ──────────────────────────────────────────────────────────
     2. Active Nav Link Highlighting
     ────────────────────────────────────────────────────────── */
  (() => {
    const currentPath = window.location.pathname;
    // Extract the filename, defaulting to 'index.html' for '/'
    const currentFile =
      currentPath === '/' || currentPath.endsWith('/')
        ? 'index.html'
        : currentPath.split('/').pop();

    const links = document.querySelectorAll('.nav-links a');

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkFile = href.split('/').pop() || 'index.html';

      // Match exact file or treat '#' / '' as index
      if (
        linkFile === currentFile ||
        (currentFile === 'index.html' && (linkFile === '' || linkFile === '#'))
      ) {
        link.classList.add('active');
      }
    });
  })();

  /* ──────────────────────────────────────────────────────────
     3. Navbar Scroll Effect
     ────────────────────────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    const SCROLL_THRESHOLD = 30; // px

    const updateNavbar = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    // Initial check (page may already be scrolled on load)
    updateNavbar();

    // Throttle scroll handler for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateNavbar();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  /* ──────────────────────────────────────────────────────────
     4. (AOS removed — no scroll-reveal animations)
     ────────────────────────────────────────────────────────── */


  /* ──────────────────────────────────────────────────────────
     5. Smooth Scroll for Anchor Links
     Handles both same-page anchors and href="#section" links.
     ────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // Account for sticky navbar height
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const targetPosition =
        targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      // Update URL hash without jumping
      history.pushState(null, '', targetId);
    });
  });

  /* ──────────────────────────────────────────────────────────
     6. Parallax Effect on Hero Section
     Subtle mouse-tracking parallax for the DNA background.
     ────────────────────────────────────────────────────────── */
  const hero  = document.querySelector('.hero');
  const dnaBg = document.querySelector('.hero-bg-animation');

  if (hero && dnaBg) {
    // Only enable on devices that likely have a mouse (no touch primary)
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!prefersReducedMotion) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        // Normalise cursor position to -1…1 from center
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        // Subtle parallax shift (max ~15px)
        const shiftX = x * 15;
        const shiftY = y * 10;

        requestAnimationFrame(() => {
          dnaBg.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
        });
      });

      hero.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
          dnaBg.style.transition = 'transform 0.6s ease-out';
          dnaBg.style.transform = 'translate(0, 0)';
          // Remove inline transition after it completes so mousemove stays snappy
          setTimeout(() => {
            dnaBg.style.transition = '';
          }, 600);
        });
      });
    }
  }
});
