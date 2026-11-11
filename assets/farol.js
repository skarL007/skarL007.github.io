/* Farol Desk case study: the few behaviours the page needs. Everything works without this file
   (the "por quê?" panels are native <details>, the menu links are plain anchors); it adds the
   mobile menu, the current section in the header, the video chapters and "open all".
   Every string comes from the HTML (data-* attributes), so there is no language table here. */
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header menu (same contract as the rest of the site: html.nav-open) ---------- */
  var menuBtn = $('#menuBtn');
  function closeMenu() {
    root.classList.remove('nav-open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = !root.classList.contains('nav-open');
      root.classList.toggle('nav-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    $$('#nav a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  }

  /* ---------- current section in the header ---------- */
  var links = $$('#nav a[href^="#"]');
  var sections = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  if ('IntersectionObserver' in window && sections.every(Boolean)) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a, i) {
          if (sections[i] === e.target) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- "por quê?": open or close every panel at once ---------- */
  var all = $('.fd-all');
  var whys = $$('details.fd-why');
  if (all && whys.length) {
    var sync = function () {
      var everyOpen = whys.every(function (d) { return d.open; });
      all.textContent = everyOpen ? all.getAttribute('data-close') : all.getAttribute('data-open');
      all.setAttribute('aria-expanded', String(everyOpen));
    };
    all.hidden = false;
    all.addEventListener('click', function () {
      var open = !whys.every(function (d) { return d.open; });
      whys.forEach(function (d) { d.open = open; });
      sync();
    });
    whys.forEach(function (d) { d.addEventListener('toggle', sync); });
    sync();
  }

  /* ---------- a link straight to a decision opens its panel ---------- */
  function openTarget() {
    var id = decodeURIComponent((location.hash || '').slice(1));
    var el = id && document.getElementById(id);
    var d = el && el.querySelector && el.querySelector('details.fd-why');
    if (d && el.classList.contains('fd-d')) d.open = true;
  }
  window.addEventListener('hashchange', openTarget);
  openTarget();

  /* ---------- a light fade as blocks come into view ----------
     Blocks already on screen are left alone, so nothing flashes on load; nothing is hidden
     without this script, without IntersectionObserver or with reduced motion. */
  if (!calm && 'IntersectionObserver' in window) {
    var blocks = $$('.fd-head, .fd-hero-shot, .fd-keys, .fd-big, .fd-qa, .fd-sheet, .fd-ask, .fd-row, .fd-lit, .fd-feature, .fd-photo, .fd-flow, .fd-arch, .fd-sub, .fd-d, .fd-ledger, .fd-tl, .fd-q, .fd-two, .fd-sec3, .fd-video, .fd-chaps, .fd-open, .fd-end .fd-wrap');
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        seen.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    blocks.forEach(function (el) {
      el.classList.add('fd-rv');
      if (el.getBoundingClientRect().top < vh) el.classList.add('is-in');
      else seen.observe(el);
    });
    root.classList.add('fd-motion');
    /* a link to an anchor inside a block that has not come in yet must not land on an empty space */
    window.addEventListener('hashchange', function () {
      blocks.forEach(function (el) { if (el.getBoundingClientRect().top < vh * 1.5) el.classList.add('is-in'); });
    });
  }

  /* ---------- video chapters: jump to a time ---------- */
  var video = $('#demo');
  $$('[data-t]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!video) return;
      video.preload = 'auto';
      var go = function () {
        try { video.currentTime = +b.getAttribute('data-t'); } catch (e) { /* not seekable yet */ }
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      };
      if (video.readyState >= 1) go();
      else { video.addEventListener('loadedmetadata', go, { once: true }); video.load(); }
      video.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
    });
  });
})();
