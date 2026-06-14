/* DeepDiveGenomics — small progressive-enhancement script.
   Everything degrades gracefully without JS: the first week panel is
   open by default, the page is fully readable, links all work. */
(function () {
  'use strict';

  /* ---- sticky header shadow ---- */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    if (window.scrollY > 8) header.classList.add('is-stuck');
    else header.classList.remove('is-stuck');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- generic accordion helper ----
     Animates max-height for a smooth open/close, and sets it back to a
     fixed px value on open so nested content can still grow if needed. */
  function wireAccordion(btn, panel, opts) {
    opts = opts || {};
    var setOpen = function (open, instant) {
      btn.setAttribute('aria-expanded', String(open));
      if (open) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        if (instant) panel.style.transition = 'none';
      } else {
        // from auto-ish to 0 needs a current value first
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.offsetHeight; // reflow
        panel.style.maxHeight = '0px';
      }
      if (instant) {
        panel.offsetHeight;
        panel.style.transition = '';
      }
    };

    // initialise from the markup's aria-expanded
    var startOpen = btn.getAttribute('aria-expanded') === 'true';
    setOpen(startOpen, true);

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (opts.exclusive && !isOpen) {
        opts.exclusive.forEach(function (other) {
          if (other.btn !== btn && other.btn.getAttribute('aria-expanded') === 'true') {
            other.set(false);
          }
        });
      }
      setOpen(!isOpen);
    });

    // keep height correct after viewport resizes (text reflow)
    window.addEventListener('resize', function () {
      if (btn.getAttribute('aria-expanded') === 'true') {
        panel.style.transition = 'none';
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.offsetHeight;
        panel.style.transition = '';
      }
    });

    return { btn: btn, set: setOpen };
  }

  /* ---- curriculum weeks (single-open accordion) ---- */
  var weekControls = [];
  document.querySelectorAll('.week-head').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (panel) weekControls.push(wireAccordion(btn, panel, { exclusive: weekControls }));
  });

  /* ---- FAQ (independent open/close) ---- */
  document.querySelectorAll('.qa-q').forEach(function (btn) {
    var panel = btn.nextElementSibling;
    if (panel) wireAccordion(btn, panel);
  });

  /* ---- reveal on scroll ---- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = document.querySelectorAll(
    '.section-head, .card, .person, .plan, .quote, .stat, .terminal, .why-grid > div'
  );
  if (reduce || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---- footer year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
