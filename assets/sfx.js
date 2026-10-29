/* Planta Viva: efeitos sonoros opcionais.
 * Desligados por padrão. Nada é baixado nem tocado antes de a pessoa ligar o botão "Som".
 * Sons do Pixabay, cortados e nivelados (créditos em assets/sfx/CREDITS.md). */
(function () {
  'use strict';
  var KEY = 'planta-viva:som';
  var EN = /^en/i.test(document.documentElement.lang || '');
  var T = EN
    ? { on: 'Turn sound effects off', off: 'Turn sound effects on' }
    : { on: 'Desligar os efeitos sonoros', off: 'Ligar os efeitos sonoros' };
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/sfx\.js(\?.*)?$/, 'sfx/');
  var NAMES = ['hover', 'clique', 'prancha', 'corte', 'ligar'];
  /* Volume relativo de cada som (o hover é o mais discreto). */
  var LEVEL = { hover: 0.5, clique: 0.7, prancha: 0.6, corte: 0.6, ligar: 0.7 };
  var MASTER = 0.6;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ctx = null, gain = null, buffers = {}, loading = null, on = false;

  function stored() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function store(v) { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) { /* sem armazenamento: vale só nesta visita */ } }

  function load() {
    if (loading) return loading;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return (loading = Promise.resolve(false));
    ctx = new AC();
    gain = ctx.createGain();
    gain.gain.value = MASTER;
    gain.connect(ctx.destination);
    loading = Promise.all(NAMES.map(function (n) {
      return fetch(BASE + n + '.mp3')
        .then(function (r) { return r.arrayBuffer(); })
        .then(function (b) { return new Promise(function (ok, fail) { ctx.decodeAudioData(b, ok, fail); }); })
        .then(function (buf) { buffers[n] = buf; })
        .catch(function () { /* um som que falhou só fica mudo */ });
    })).then(function () { return true; });
    return loading;
  }

  var last = {};
  function play(name, gap) {
    if (!on || !ctx || !buffers[name] || document.hidden) return;
    var now = performance.now();
    if (now - (last[name] || 0) < (gap || 60)) return;
    last[name] = now;
    if (ctx.state === 'suspended') ctx.resume();
    var src = ctx.createBufferSource();
    var g = ctx.createGain();
    g.gain.value = LEVEL[name] || 0.6;
    src.buffer = buffers[name];
    src.connect(g);
    g.connect(gain);
    src.start();
  }

  /* Botão no cabeçalho, ao lado de EN e 2D (ou antes do Menu, onde não há ferramentas). */
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'sfxBtn';
  btn.className = 'tgl sfx-btn';
  /* Só o ícone: o cabeçalho do celular não tem espaço para mais um rótulo. O nome vai no aria-label. */
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square">' +
    '<path d="M4 9h4l5-4v14l-5-4H4z"/>' +
    '<g class="sfx-on"><path d="M16 9.5a3.5 3.5 0 0 1 0 5"/><path d="M18.5 7a7 7 0 0 1 0 10"/></g>' +
    '<g class="sfx-off"><path d="M16.5 9.5l5 5M21.5 9.5l-5 5"/></g></svg>';
  var css = document.createElement('style');
  css.textContent =
    '.sfx-btn{width:36px;padding:0;justify-content:center}' +
    '.sfx-btn .sfx-on{display:none}.sfx-btn[aria-pressed="true"] .sfx-on{display:inline}' +
    '.sfx-btn[aria-pressed="true"] .sfx-off{display:none}' +
    '.sfx-btn[aria-pressed="true"]{border-color:var(--fg)}';
  document.head.appendChild(css);
  var anchor = document.getElementById('mode2d') || document.getElementById('menuBtn');
  if (!anchor) return;
  anchor.parentNode.insertBefore(btn, anchor);

  function render() {
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? T.on : T.off);
    btn.title = on ? T.on : T.off;
  }

  function setOn(v, fromClick) {
    on = v;
    store(v);
    render();
    if (!v) return;
    load().then(function () { if (fromClick) play('ligar'); });
  }

  btn.addEventListener('click', function () { setOn(!on, true); });
  render();

  /* Quem já ligou antes: o som volta ligado, mas o navegador só libera o áudio
     depois do primeiro gesto da pessoa na página. */
  if (stored()) {
    on = true;
    render();
    var unlock = function () {
      load();
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('keydown', unlock, true);
    };
    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('keydown', unlock, true);
  }

  var INTERACTIVE = 'a[href], button, [role="button"], summary';

  /* Passar o mouse: só com mouse, uma vez por elemento. */
  var hovered = null;
  document.addEventListener('pointerover', function (e) {
    if (e.pointerType !== 'mouse') return;
    var el = e.target.closest && e.target.closest(INTERACTIVE);
    if (!el || el === hovered || el === btn) { hovered = el; return; }
    hovered = el;
    play('hover', 80);
  }, { passive: true });

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest(INTERACTIVE);
    if (el && el !== btn) play('clique', 40);
  }, true);

  /* Troca de seção: "prancha"; entrar em Projetos ou Atividade é um corte de câmera.
     Com "reduzir movimento", os sons de transição ficam desligados. */
  if (calm || !('IntersectionObserver' in window)) return;
  var CUTS = { projetos: 1, atividade: 1, projects: 1, activity: 1 };
  var current = null, first = true;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting || en.target.id === current) return;
      current = en.target.id;
      if (first) { first = false; return; }
      play(CUTS[current] ? 'corte' : 'prancha', 700);
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { io.observe(s); });
})();
