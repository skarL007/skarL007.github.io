/* Small motion layer shared by the home and the case-study pages:
   numbers count up from 0 the first time they enter the screen, looping clips play only while
   they are on screen, and the main buttons lean a little towards a mouse pointer. Nothing runs
   with reduced motion (the clips then keep their poster), counters and buttons stay still in the
   2D mode, and the magnetic pull only exists for a fine pointer (never on touch). */
(function () {
  var root = document.documentElement;
  var mq = function (q) { return window.matchMedia ? window.matchMedia(q).matches : false; };
  if (mq('(prefers-reduced-motion: reduce)')) return;
  var flat = function () { return root.classList.contains('mode-2d'); };

  /* ---------- counters ---------- */
  var NUM = /\d+(?:[.,]\d+)*/g;
  var SEL = '.ev dd, .stats dd, .live dd.n, .cs-meta dd [data-n]';
  function texts(el) {
    var out = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) if (/\d/.test(n.nodeValue)) out.push(n);
    return out;
  }
  /* "1.140" (pt) / "1,140" (en) are thousands, "0,93" / "0.93" are decimals: read them the way the page writes them */
  var EN = /^en/i.test(root.lang || '');
  function parse(tok) {
    var dec = EN ? '.' : ',', tho = EN ? ',' : '.';
    var parts = tok.split(tho).join('').split(dec);
    var places = parts.length > 1 ? parts[1].length : 0;
    return { v: parseFloat(parts.join('.')), places: places };
  }
  var fmt = new Intl.NumberFormat(EN ? 'en-US' : 'pt-BR');
  function show(v, p) {
    return p ? v.toLocaleString(EN ? 'en-US' : 'pt-BR', { minimumFractionDigits: p, maximumFractionDigits: p }) : fmt.format(Math.round(v));
  }
  function count(el) {
    if (el.dataset.counted || flat()) return;
    el.dataset.counted = '1';
    var nodes = texts(el).map(function (n) {
      var src = n.nodeValue, toks = [];
      src.replace(NUM, function (m, at) { if (src.charAt(at - 1) !== '^') toks.push({ at: at, len: m.length, num: parse(m) }); return m; }); // pass^1 is a name, not a value
      // years and dates stay as they are (a date counting up reads as a glitch)
      if (/\b(19|20)\d\d\b/.test(src) || /\d\s*(jan|fev|feb|mar|abr|apr|mai|may|jun|jul|ago|aug|set|sep|out|oct|nov|dez|dec)\b/i.test(src)) return null;
      return { n: n, src: src, toks: toks };
    }).filter(Boolean);
    if (!nodes.length) return;
    var t0 = performance.now(), D = 1100;
    function frame(now) {
      var t = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - t, 4);
      nodes.forEach(function (o) {
        if (t >= 1) { o.n.nodeValue = o.src; return; }
        var s = '', last = 0;
        o.toks.forEach(function (k) { s += o.src.slice(last, k.at) + show(k.num.v * e, k.num.places); last = k.at + k.len; });
        o.n.nodeValue = s + o.src.slice(last);
      });
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  function startCounters() {
    var els = document.querySelectorAll(SEL);
    if (!('IntersectionObserver' in window) || !els.length) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); count(e.target); } });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(els, function (el) {
      // already on screen at load: no count (the numbers are the first thing read)
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) return;
      io.observe(el);
    });
  }
  // after nexo-numbers.js has written the current values
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(startCounters, 0); });
  else setTimeout(startCounters, 0);

  /* ---------- looping clips (the M-01 card): play while 30% of the clip is on screen and the tab is visible ---------- */
  function startClips() {
    var figs = Array.prototype.filter.call(document.querySelectorAll('.shot'), function (f) { return f.querySelector('video.shot-video'); });
    if (!('IntersectionObserver' in window) || !figs.length) return;
    function sync(f) {
      var v = f.querySelector('video');
      if (f.dataset.seen && !document.hidden) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.dataset.seen = e.isIntersecting && e.intersectionRatio >= 0.3 ? '1' : ''; sync(e.target); });
    }, { threshold: [0, 0.3] });
    figs.forEach(function (f) { io.observe(f); });
    document.addEventListener('visibilitychange', function () { figs.forEach(sync); });
  }
  startClips();

  /* ---------- magnetic buttons (mouse only) ---------- */
  if (!mq('(hover: hover) and (pointer: fine)')) return;
  var MAG = '.btn, .lnk, .cs-back a, .hdr-tools .tgl, .hdr-tools .lang';
  var cur = null;
  function reset(el) { el.style.transform = ''; el.dataset.mx = el.dataset.my = 0; }
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var el = e.target.closest ? e.target.closest(MAG) : null;
    if (cur && cur !== el) { reset(cur); cur = null; }
    if (!el || flat()) return;
    cur = el;
    var r = el.getBoundingClientRect();
    // measure from the untransformed box so the pull does not feed back on itself
    var tx = parseFloat(el.dataset.mx || 0), ty = parseFloat(el.dataset.my || 0);
    var cx = r.left - tx + r.width / 2, cy = r.top - ty + r.height / 2;
    var k = el.classList.contains('btn') ? 0.28 : 0.18;
    var mx = Math.max(-8, Math.min(8, (e.clientX - cx) * k)), my = Math.max(-6, Math.min(6, (e.clientY - cy) * k * 1.2));
    el.dataset.mx = mx; el.dataset.my = my;
    el.style.transform = 'translate(' + mx.toFixed(1) + 'px,' + my.toFixed(1) + 'px)';
  }, { passive: true });
  document.addEventListener('pointerleave', function () { if (cur) { reset(cur); cur = null; } }, true);
  var css = document.createElement('style');
  css.textContent = '.btn,.lnk,.cs-back a,.hdr-tools .tgl,.hdr-tools .lang{transition:transform .35s cubic-bezier(.2,.8,.2,1),background .2s,color .2s,border-color .2s}';
  document.head.appendChild(css);
})();
