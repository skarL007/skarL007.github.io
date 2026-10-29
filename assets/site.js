const CONTRIB = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,3,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,7,0],[0,2,0,1,1,0,0],[0,0,4,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[3,0,1,1,0,0,0],[0,4,0,0,1,12,3],[0,61,15,14,0,0,0],[16,7,0,2,0,0,0],[3,0,0,0,0,0,17],[2,14,12,24,58,10,6],[79,94,42,13,114,3,30],[8,36,4,4,7,5,4],[4,6,29,18,15,1,28],[20,0,8,28,3,5,12],[4,15,9,1,6,2,2],[4,0,12,49,87,43,6],[46,60,132,106,159,95,38],[110,24,51,6,5,55,11],[13,80,62,19,139,30,12],[73,83,42,26,81,2,96],[25,48,14,11,71,52,36],[119,63,44,3,7,0,0],[70,72,0,0,0,36,6],[58,19,5,6,79,158,72],[38,114,17,50,123,127,11],[119,79,35,51,5,7,56],[15,55,147,59,101,6,6],[7,5,117,1,1,3,0],[0,13,0,0,5,2,0],[13,156,70,65,26,12,3],[34,0,1,0,0,0,1],[2,79,15,31,1,0,0],[0,0,1,0,0,0,0],[1,0,0,0,1,0,0],[0,26,24,57,50,158,68],[9,0,0,25,48,31,1],[24,2,0,0,0,1,0],[0,12,5,12,0,0,0],[0,6,104,40,24,91,10],[0,83,87]];
/* ---------- base, data, DOM-only features (work without WebGL) ---------- */
const root = document.documentElement;

/* ---------- language: every string the script writes comes from here ---------- */
const LANG = /^en/i.test(root.lang || '') ? 'en' : 'pt';
const TX = {
  pt: {
    locale: 'pt-BR',
    months: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
    chaps: ['Planta geral', 'Método', 'Projetos', 'Atividade', 'Trajetória', 'Contato'],
    no3d: '3D indisponível neste navegador',
    steps: ['01 · Desenho', '02 · Delego', '03 · Verifico', '04 · Meço'],
    lMeasure: 'Meço → LumenAI · custo por cliente',
    lDelegate: 'Delego → SynapseEngine · memória dos agentes',
    lMethod: 'Método · 4 etapas',
    lWeeks: '53 semanas · 26 out 2025 → 27 out 2026',
    lDays: '7 dias',
    lMods: '7 módulos · altura ∝ log(commits)',
    lZoneAct: 'A-04 · Atividade',
    lZoneTraj: 'A-05 · Da medicina para a IA',
    miles: [[4, 5, '05 mai', 'lumen-ai-core no PyPI'], [4, 25, '25 mai', 'Axon Voice local'], [6, 22, '22 jul', 'VoiceLaunch 1.3'], [8, 13, '13 set', 'SynapseEngine começa'], [9, 5, '05 out', 'Sublinhe MVP'], [9, 27, '27 out', 'LumenAI revisão']],
    lOrigin: '<b>origem</b><i>medicina · fora de escala</i>',
    lNext: '<b>próximo</b><i>faculdade + 1ª oportunidade</i>',
    commitsLog: ' commits · altura ∝ log',
    seeSheet: ' · ver folha ↓',
    contrib1: ' contribuição', contribN: ' contribuições',
  },
  en: {
    locale: 'en-US',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    chaps: ['General plan', 'Method', 'Projects', 'Activity', 'Path', 'Contact'],
    no3d: '3D is not available in this browser',
    steps: ['01 · Design', '02 · Delegate', '03 · Verify', '04 · Measure'],
    lMeasure: 'Measure → LumenAI · cost per customer',
    lDelegate: 'Delegate → SynapseEngine · agent memory',
    lMethod: 'Method · 4 steps',
    lWeeks: '53 weeks · 26 Oct 2025 → 27 Oct 2026',
    lDays: '7 days',
    lMods: '7 modules · height ∝ log(commits)',
    lZoneAct: 'A-04 · Activity',
    lZoneTraj: 'A-05 · From medicine to AI',
    miles: [[4, 5, '05 May', 'lumen-ai-core on PyPI'], [4, 25, '25 May', 'Axon Voice, local'], [6, 22, '22 Jul', 'VoiceLaunch 1.3'], [8, 13, '13 Sep', 'SynapseEngine starts'], [9, 5, '05 Oct', 'Sublinhe MVP'], [9, 27, '27 Oct', 'LumenAI review']],
    lOrigin: '<b>origin</b><i>medicine · not to scale</i>',
    lNext: '<b>next</b><i>degree + first opportunity</i>',
    commitsLog: ' commits · height ∝ log',
    seeSheet: ' · see sheet ↓',
    contrib1: ' contribution', contribN: ' contributions',
  }
}[LANG];
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const mq = q => (window.matchMedia ? window.matchMedia(q).matches : false);
const RM = mq('(prefers-reduced-motion: reduce)');
const FINE = mq('(hover: hover) and (pointer: fine)');
const SMALL = window.innerWidth < 760;
const LOW = SMALL || (navigator.hardwareConcurrency || 8) <= 4;
const HAS_GSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const MOTION = HAS_GSAP && !RM;
if (HAS_GSAP) { gsap.registerPlugin(ScrollTrigger); ScrollTrigger.config({ ignoreMobileResize: true }); }
if (MOTION) root.classList.add('motion');
const KEY = 'planta-viva:modo';
const pref = {
  get() { try { return window.localStorage.getItem(KEY); } catch (e) { return null; } },
  set(v) { try { window.localStorage.setItem(KEY, v); } catch (e) { /* storage blocked */ } }
};
const is2D = () => root.classList.contains('mode-2d');
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const pad4 = n => (n < -0.5 ? '−' : '') + String(Math.min(9999, Math.round(Math.abs(n)))).padStart(4, '0');
const MESES = TX.months;
const DAY0 = Date.UTC(2025, 9, 26);
const dayText = (w, d) => { const t = new Date(DAY0 + (w * 7 + d) * 864e5); return String(t.getUTCDate()).padStart(2, '0') + ' ' + MESES[t.getUTCMonth()] + ' ' + t.getUTCFullYear(); };
const CHAPS = TX.chaps;

let pmx = window.innerWidth / 2, pmy = window.innerHeight / 2, pIn = false, overUI = false;
let GL = null, glLoading = false, glFailed = false, lenis = null, introRan = false;
const pendingBuilds = new Set();

/* key plan: the real calendar as a DOM grid (also the 2D fallback) */
(function keyplan() {
  const kp = $('#keyplan'); if (!kp) return;
  const f = document.createDocumentFragment();
  CONTRIB.forEach((wk, w) => wk.forEach((c, d) => {
    const i = document.createElement('i');
    i.className = 'k' + (c === 0 ? 0 : c < 10 ? 1 : c < 40 ? 2 : c < 100 ? 3 : 4);
    i.title = dayText(w, d) + ' · ' + c;
    f.appendChild(i);
  }));
  kp.appendChild(f);
})();

/* split the name into letters for the kinetic reveal (screen readers get the h1 label) */
(function splitName() {
  const h = $('.name'); if (!h || !MOTION) return;
  h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
  $$('.ln', h).forEach(ln => {
    const t = ln.textContent; ln.textContent = ''; ln.setAttribute('aria-hidden', 'true');
    for (const ch of t) { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; ln.appendChild(s); }
  });
})();

/* ---------- mode toggle (Modo 2D) ---------- */
const btn2d = $('#mode2d');
btn2d.setAttribute('aria-pressed', String(is2D()));
function setMode(two, persist) {
  root.classList.toggle('mode-2d', two);
  btn2d.setAttribute('aria-pressed', String(two));
  if (persist) pref.set(two ? '2d' : '3d');
  if (two) { stopLenis(); if (GL) GL.stop(); }
  else { startLenis(); if (GL) GL.start(); else initGL(); }
  if (HAS_GSAP) window.requestAnimationFrame(() => ScrollTrigger.refresh());
  kickRain(); tbQueue();
}
btn2d.addEventListener('click', () => { if (!glFailed) setMode(!is2D(), true); });

/* ---------- Lenis, driven by the single gsap ticker ---------- */
function startLenis() {
  if (!MOTION || lenis || typeof window.Lenis === 'undefined' || is2D()) return;
  try { lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true }); lenis.on('scroll', ScrollTrigger.update); } catch (e) { lenis = null; }
}
function stopLenis() { if (lenis) { lenis.destroy(); lenis = null; } }

/* ---------- custom drafting cursor ---------- */
const CURSOR = FINE && !RM;
const cur = $('#cursor'), curLab = $('#cursorLab'), curBox = $('.cx-box', cur), curH = $('.cx-h', cur), curV = $('.cx-v', cur);
if (CURSOR) root.classList.add('has-cursor');
let snapEl = null, bx = -40, by = -40, boxW = 18, boxH = 18, lastLab = '', labW = 120;
window.addEventListener('pointermove', e => {
  pmx = e.clientX; pmy = e.clientY; pIn = true;
  overUI = !!(e.target && e.target.closest && e.target.closest('.sheet,a,button,.hdr,.hero-copy'));
}, { passive: true });
document.addEventListener('mouseover', e => { snapEl = e.target && e.target.closest ? e.target.closest('a,button') : null; });
root.addEventListener('mouseleave', () => { pIn = false; snapEl = null; });
root.addEventListener('mouseenter', () => { pIn = true; });
function cursorFrame() {
  if (!CURSOR || is2D()) return;
  cur.classList.toggle('out', !pIn);
  curH.style.transform = 'translate3d(0,' + pmy + 'px,0)';
  curV.style.transform = 'translate3d(' + pmx + 'px,0,0)';
  let lab, tw = 18, th = 18, tx = pmx - 9, ty = pmy - 9;
  if (snapEl && snapEl.isConnected) {
    const r = snapEl.getBoundingClientRect();
    tw = Math.round(r.width + 12); th = Math.round(r.height + 12); tx = r.left - 6; ty = r.top - 6;
    lab = 'SNAP · ' + (snapEl.dataset.cursor || snapEl.textContent).trim().replace(/\s+/g, ' ').slice(0, 30).toUpperCase();
    cur.classList.add('snap');
  } else {
    cur.classList.remove('snap');
    lab = GL && GL.running ? GL.cursorText() : 'x ' + pad4(pmx) + ' · y ' + pad4(pmy);
  }
  if (tw !== boxW || th !== boxH) { boxW = tw; boxH = th; curBox.style.width = tw + 'px'; curBox.style.height = th + 'px'; }
  bx += (tx - bx) * 0.4; by += (ty - by) * 0.4;
  curBox.style.transform = 'translate3d(' + bx.toFixed(1) + 'px,' + by.toFixed(1) + 'px,0)';
  if (lab !== lastLab) { curLab.textContent = lab; lastLab = lab; labW = curLab.offsetWidth; }
  const lx = pmx + 16 + labW > window.innerWidth - 8 ? pmx - 16 - labW : pmx + 16;
  curLab.style.transform = 'translate3d(' + lx + 'px,' + (pmy + 16) + 'px,0)';
}

/* ---------- one loop: gsap.ticker drives Lenis, WebGL and the cursor ---------- */
function tick(time, deltaMs) {
  if (lenis) lenis.raf(time * 1000);
  if (GL) GL.frame((deltaMs || 16.7) / 1000);
  cursorFrame();
}
if (HAS_GSAP) { gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0); }
else { let last = performance.now(); const loop = now => { tick(now / 1000, now - last); last = now; window.requestAnimationFrame(loop); }; window.requestAnimationFrame(loop); }

/* ---------- navigation ---------- */
const menuBtn = $('#menuBtn');
function closeMenu() { root.classList.remove('nav-open'); menuBtn.setAttribute('aria-expanded', 'false'); }
menuBtn.addEventListener('click', () => { const o = !root.classList.contains('nav-open'); root.classList.toggle('nav-open', o); menuBtn.setAttribute('aria-expanded', String(o)); });
window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
function goTo(t) {
  const isSec = t.tagName === 'SECTION';
  const off = isSec ? 0 : -Math.max(84, (window.innerHeight - t.offsetHeight) / 2);
  if (lenis) lenis.scrollTo(t, { offset: off, duration: 1.6 });
  else t.scrollIntoView({ behavior: MOTION && !is2D() ? 'smooth' : 'auto', block: isSec ? 'start' : 'center' });
}
document.addEventListener('click', e => {
  const a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
  if (!a) return;
  const id = a.getAttribute('href'); if (id.length < 2) return;
  const t = document.getElementById(id.slice(1)); if (!t) return;
  e.preventDefault(); closeMenu(); goTo(t);
  try { window.history.replaceState(null, '', id); } catch (err) { /* file:// */ }
  const f = t.querySelector('h1,h2,h3') || t;
  if (!f.hasAttribute('tabindex')) f.setAttribute('tabindex', '-1');
  f.focus({ preventScroll: true });
});
/* click on a 3D module jumps to its sheet */
window.addEventListener('click', e => {
  if (!GL || !GL.running || (e.target.closest && e.target.closest('a,button,.sheet,.hero-copy,.hdr'))) return;
  const id = GL.hoverTarget(); const t = id && document.getElementById(id);
  if (t) goTo(t);
});
$$('[data-mod]').forEach(el => {
  el.addEventListener('pointerenter', () => { if (GL) GL.highlight(+el.dataset.mod); });
  el.addEventListener('pointerleave', () => { if (GL) GL.highlight(-1); });
});

/* ---------- chapters (title block, nav, ruler) ---------- */
const sections = $$('main > section[data-chap]');
const navLinks = $$('#nav a'), rulerItems = $$('.ruler li');
const tbNum = $('#tbNum'), tbName = $('#tbName');
let chapter = -1;
function setChapter(i) {
  if (i === chapter || !sections[i]) return;
  chapter = i;
  tbNum.textContent = String(i + 1).padStart(2, '0');
  tbName.textContent = CHAPS[i];
  navLinks.forEach(a => { if (a.getAttribute('href') === '#' + sections[i].id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  rulerItems.forEach((li, k) => li.classList.toggle('on', k === i));
  if (GL) GL.setChapter(i);
}
setChapter(0);

/* ---------- title block: folds to one line, then steps aside, when a content panel reaches it ---------- */
const tblock = $('.tblock');
const tbPanels = $$('.sheet:not(.ghost), .hero-copy, .foot');
let tbRaf = 0, tbFull = 0, tbMini = 0;
function tbCheck() {
  tbRaf = 0;
  if (!tblock || is2D() || window.innerWidth < 1024) return;
  if (!tbFull) { tbFull = tblock.offsetHeight; tbMini = tblock.firstElementChild.offsetHeight + 2; }
  const W = window.innerWidth, H = window.innerHeight, left = W - 24 - tblock.offsetWidth - 16, bottom = H - 8;
  const hit = h => tbPanels.some(el => { const r = el.getBoundingClientRect(); return r.right > left && r.left < W && r.bottom > H - 24 - h - 16 && r.top < bottom; });
  const off = hit(tbMini), mini = !off && hit(tbFull);
  root.classList.toggle('tb-off', off); root.classList.toggle('tb-mini', mini);
}
function tbQueue() { if (!tbRaf) tbRaf = window.requestAnimationFrame(tbCheck); }
window.addEventListener('scroll', tbQueue, { passive: true });
window.addEventListener('resize', () => { tbFull = 0; tbQueue(); });
tbQueue();

/* ---------- tema matrix: a faint code rain behind the hero (never with reduced motion or in 2D) ---------- */
const rainHero = $('.hero');
let rainCv = null, rainCx = null, rainCols = [], rainW = 0, rainH = 0, rainSeen = true, rainRaf = 0, rainLast = 0;
const RAIN_G = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789:=<>*';
function rainOn() { return !RM && rainSeen && root.getAttribute('data-tema') === 'matrix' && !is2D(); }
function rainSize() {
  rainW = rainCv.width = Math.round(rainHero.offsetWidth); rainH = rainCv.height = Math.round(rainHero.offsetHeight);
  rainCols = Array.from({ length: Math.ceil(rainW / 16) }, () => (Math.random() < 0.45 ? Math.random() * -rainH / 16 : -1e9));
}
function rainStep(now) {
  rainRaf = 0;
  if (!rainOn()) { rainCv.classList.remove('on'); return; }
  if (!rainCv.classList.contains('on')) { rainCv.classList.add('on'); rainSize(); }
  if (now - rainLast > 70) {
    rainLast = now;
    rainCx.globalCompositeOperation = 'destination-out'; rainCx.fillStyle = 'rgba(0,0,0,.14)'; rainCx.fillRect(0, 0, rainW, rainH);
    rainCx.globalCompositeOperation = 'source-over'; rainCx.font = '14px ' + 'ui-monospace,monospace'; rainCx.fillStyle = 'rgba(0,255,65,.7)';
    for (let i = 0; i < rainCols.length; i++) {
      const y = rainCols[i];
      if (y > -1e8) {
        if (y >= 0) rainCx.fillText(RAIN_G[(Math.random() * RAIN_G.length) | 0], i * 16, y * 16);
        rainCols[i] = y * 16 > rainH && Math.random() > 0.96 ? Math.random() * -20 : y + 1;
      } else if (Math.random() > 0.998) rainCols[i] = Math.random() * -20;
    }
  }
  rainRaf = window.requestAnimationFrame(rainStep);
}
function kickRain() { if (rainCv && !rainRaf) rainRaf = window.requestAnimationFrame(rainStep); }
if (rainHero && !RM) {
  rainCv = document.createElement('canvas'); rainCv.id = 'rain'; rainCv.setAttribute('aria-hidden', 'true');
  rainHero.prepend(rainCv); rainCx = rainCv.getContext('2d');
  if (!rainCx) rainCv = null;
  else {
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { rainSeen = es[0].isIntersecting; kickRain(); }).observe(rainHero);
    window.addEventListener('resize', () => { if (rainCv.classList.contains('on')) rainSize(); });
    if (window.PLANTA_TEMA) window.PLANTA_TEMA.on(kickRain);
    kickRain();
  }
}

function requestBuild(k) { if (GL) GL.build(k); else pendingBuilds.add(k); }

const GLY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·-';
function scramble(el) {
  const txt = el.textContent, o = { p: 0 };
  gsap.to(o, { p: 1, duration: 0.7, ease: 'none',
    onUpdate() { const n = Math.floor(o.p * txt.length); let s = txt.slice(0, n); for (let i = n; i < txt.length; i++) s += txt[i] === ' ' ? ' ' : GLY[(Math.random() * GLY.length) | 0]; el.textContent = s; },
    onComplete() { el.textContent = txt; } });
}

if (HAS_GSAP) {
  sections.forEach((s, i) => ScrollTrigger.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onToggle: self => { if (self.isActive) setChapter(i); } }));
  $$('[data-build]').forEach(el => {
    const keys = el.dataset.build.split(',');
    ScrollTrigger.create({ trigger: el, start: 'top 82%', once: true, onEnter: () => keys.forEach(requestBuild) });
  });
  $$('[data-method]').forEach(el => {
    const k = +el.dataset.method;
    ScrollTrigger.create({ trigger: el, start: 'top 70%', end: 'bottom 30%', onToggle: self => { if (GL) GL.setMethod(self.isActive ? k : -1, k); } });
  });
} else if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    if (el.dataset.chapIdx) setChapter(+el.dataset.chapIdx);
    if (el.dataset.build) el.dataset.build.split(',').forEach(requestBuild);
  }), { rootMargin: '-40% 0px -40% 0px' });
  sections.forEach((s, i) => { s.dataset.chapIdx = String(i); io.observe(s); });
  $$('[data-build]').forEach(el => io.observe(el));
}

/* reveals start from a readable state (opacity >= .3) */
if (MOTION) {
  gsap.utils.toArray('.rv').forEach(el => gsap.fromTo(el, { opacity: 0.35, y: 32 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
  $$('.sheet').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 86%', once: true, onEnter: () => el.classList.add('is-in') }));
  $$('.callout .ct').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 94%', once: true, onEnter: () => scramble(el) }));
  gsap.fromTo('.name .ch', { opacity: 0.4, yPercent: 30 }, { opacity: 1, yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.035, delay: 0.1 });
  gsap.fromTo('.hero .hv', { opacity: 0.35, y: 18 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.3 });
} else {
  $$('.sheet').forEach(el => el.classList.add('is-in'));
}

/* ---------- WebGL bootstrap (progressive enhancement) ---------- */
function hasWebGL2() {
  try {
    const c = document.createElement('canvas'); const g = c.getContext('webgl2');
    if (!g) return false;
    const ext = g.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext();
    return true;
  } catch (e) { return false; }
}
function failGL() {
  glFailed = true; glLoading = false; GL = null;
  root.classList.remove('gl-on'); root.classList.add('no-gl', 'mode-2d');
  stopLenis();
  btn2d.setAttribute('aria-pressed', 'true'); btn2d.disabled = true; btn2d.title = TX.no3d;
  if (HAS_GSAP) ScrollTrigger.refresh();
}
async function initGL() {
  if (GL || glLoading || glFailed) return;
  if (!hasWebGL2()) { failGL(); return; }
  glLoading = true;
  let mods;
  try {
    mods = await Promise.all([
      import('three'),
      import('three/addons/postprocessing/EffectComposer.js'),
      import('three/addons/postprocessing/RenderPass.js'),
      import('three/addons/postprocessing/UnrealBloomPass.js'),
      import('three/addons/postprocessing/ShaderPass.js'),
      import('three/addons/postprocessing/OutputPass.js')
    ]);
  } catch (e) { failGL(); return; }
  try { GL = createWorld(mods); } catch (e) { failGL(); return; }
  glLoading = false;
  pendingBuilds.forEach(k => GL.build(k, true)); pendingBuilds.clear();
  GL.setChapter(Math.max(0, chapter));
  if (is2D()) { GL.stop(); return; }
  GL.start();
  runIntro();
}
function runIntro() {
  if (introRan || !GL) return;
  introRan = true;
  if (!MOTION || window.scrollY > 40) { GL.setDraw(1); return; }
  const num = $('#introNum'), skip = $('#introSkip'), o = { v: 0 };
  const evs = ['wheel', 'keydown', 'pointerdown', 'touchstart'];
  root.classList.add('intro-on');
  const tw = gsap.to(o, { v: 1, duration: 1.15, ease: 'power2.inOut',
    onUpdate() { num.textContent = String(Math.round(o.v * 100)).padStart(3, '0'); GL.setDraw(o.v); },
    onComplete: done });
  function skipIt() { tw.progress(1); }
  function done() { num.textContent = '100'; GL.setDraw(1); root.classList.remove('intro-on'); evs.forEach(ev => window.removeEventListener(ev, skipIt)); }
  evs.forEach(ev => window.addEventListener(ev, skipIt, { passive: true }));
  skip.addEventListener('click', skipIt, { once: true });
}

/* ================= the living blueprint (three.js) ================= */
const LINE_VS = `attribute float aProg; attribute float aDist; attribute float aGroup;
varying float vProg; varying float vDist; varying float vGroup; varying float vDepth;
void main(){ vProg = aProg; vDist = aDist; vGroup = aGroup; vec4 mv = modelViewMatrix * vec4(position, 1.0); vDepth = -mv.z; gl_Position = projectionMatrix * mv; }`;
const LINE_FS = `uniform vec3 uColor; uniform float uDraw; uniform float uOpacity; uniform float uDash; uniform float uFlow; uniform float uTime; uniform vec4 uBoost;
varying float vProg; varying float vDist; varying float vGroup; varying float vDepth;
void main(){
  if (vProg > uDraw) discard;
  if (uDash > 0.0 && fract((vDist - uTime * uFlow) / uDash) > 0.5) discard;
  float b = vGroup < 0.5 ? uBoost.x : (vGroup < 1.5 ? uBoost.y : (vGroup < 2.5 ? uBoost.z : uBoost.w));
  float head = smoothstep(uDraw - 0.025, uDraw, vProg) * step(uDraw, 0.999);
  float fog = 1.0 - smoothstep(240.0, 560.0, vDepth);
  vec3 col = uColor * (1.0 + b * 1.5 + head * 2.5);
  gl_FragColor = vec4(col, min(1.0, uOpacity * (1.0 + b * 0.6 + head)) * fog);
}`;
const EDGE_VS = `varying float vY; varying float vDepth;
void main(){ vY = position.y; vec4 mv = modelViewMatrix * vec4(position, 1.0); vDepth = -mv.z; gl_Position = projectionMatrix * mv; }`;
const EDGE_FS = `uniform vec3 uColor; uniform vec3 uHot; uniform float uH; uniform float uHotAmt; uniform float uGlow; uniform float uOpacity;
varying float vY; varying float vDepth;
void main(){
  if (vY > uH + 0.002) discard;
  float front = 1.0 - smoothstep(0.0, 1.6, uH - vY);
  vec3 c = uColor * (0.8 + uGlow);
  c = mix(c, uHot * 1.5, front * uHotAmt);
  float fog = 1.0 - smoothstep(240.0, 560.0, vDepth);
  gl_FragColor = vec4(c, uOpacity * fog);
}`;
const GLASS_VS = `varying float vY; varying vec3 vN; varying vec3 vV;
void main(){ vY = position.y; vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`;
const GLASS_FS = `uniform vec3 uColor; uniform float uH; uniform float uOpacity; uniform float uGlow;
varying float vY; varying vec3 vN; varying vec3 vV;
void main(){
  if (vY > uH) discard;
  float fr = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0);
  float s = abs(fract(vY / 1.6 + 0.5) - 0.5) * 1.6;
  float fl = 1.0 - smoothstep(0.0, max(fwidth(vY) * 1.5, 0.02), s);
  gl_FragColor = vec4(uColor, uOpacity * (0.05 + 0.3 * fr + 0.2 * fl) * (1.0 + uGlow * 1.5));
}`;
const GRID_VS = `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const GRID_FS = `uniform vec3 uColor; uniform vec3 uCam; varying vec3 vW;
float gl1(vec2 p, float s){ vec2 c = p / s; vec2 f = max(fwidth(c), vec2(1e-4)); vec2 g = abs(fract(c - 0.5) - 0.5) / f; float l = 1.0 - min(min(g.x, g.y), 1.0); return l * (1.0 - smoothstep(0.06, 0.22, max(f.x, f.y))); }
void main(){
  float d = length(vW.xz - uCam.xz);
  float a = (gl1(vW.xz, 1.0) * 0.08 + gl1(vW.xz, 10.0) * 0.26) * (1.0 - smoothstep(90.0, 340.0, d));
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor, a);
}`;
const GRAIN = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uGrain: { value: 1 }, uVig: { value: 0.3 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime; uniform float uGrain; uniform float uVig; varying vec2 vUv;
float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
void main(){
  vec4 c = texture2D(tDiffuse, vUv);
  float v = 1.0 - smoothstep(0.3, 0.85, length((vUv - 0.5) * vec2(1.1, 1.0)));
  c.rgb *= mix(1.0 - uVig, 1.0, v);
  float n = hash(gl_FragCoord.xy + floor(uTime * 24.0) * 17.0) - 0.5;
  c.rgb = max(c.rgb + n * uGrain * (0.003 + c.rgb * 0.06), vec3(0.0));
  gl_FragColor = c;
}`
};

/* camera stops: one per [data-stop] element, in DOM order. p = position, t = target,
   s = horizontal lens shift as a fraction of the width (negative: panel on the left, subject drawn to the right) */
const STOPS = [
  [[-24, 74, 70], [6, 0, -8], -0.2],       // A-01 hero, planta em 3/4 por cima
  [[-58, 40, -2], [-4, 0, -34], -0.17],    // A-02 método
  [[-42, 12, -17], [-35, 1.5, -36], -0.19],// 01 desenho
  [[-18, 11, -17], [-11, 2, -36], -0.19],  // 02 delego
  [[6, 10, -18], [13, 2.6, -36], -0.19],   // 03 verifico
  [[30, 12, -17], [37, 1.5, -36], -0.19],  // 04 meço
  [[-8, 70, 62], [0, 0, 4], 0.19],         // A-03 projetos (visão geral)
  [[-48, 15, 16], [-25, 3.5, -6], -0.24],  // M-01 lumen
  [[26, 20, 24], [2, 5.5, -4], 0.24],      // M-02 sublinhe
  [[62, 22, 14], [27, 3.5, 2], -0.19],     // M-03 + M-04
  [[-18, 22, 58], [-19, 3, 19], 0.19],     // M-05 + M-06
  [[34, 17, 44], [9, 3.5, 15], -0.22],     // M-07 nexo
  [[-36, 22, 72], [3, 1.5, 40], -0.24],    // A-04 atividade
  [[0, 30, 140], [0, 3.5, 54], 0.24],      // A-05 trajetória
  [[0, 165, 70], [0, 0, 6], -0.2]          // A-06 contato
];
const MODS = [
  { id: 'p-lumen', code: 'M-01', name: 'LumenAI SDK', x: -27, z: -6, w: 18, d: 14, commits: 56 },
  { id: 'p-sub', code: 'M-02', name: 'Sublinhe', x: 3, z: -4, w: 20, d: 16, commits: 1140 },
  { id: 'p-syn', code: 'M-03', name: 'SynapseEngine', x: 29, z: -10, w: 12, d: 12, commits: 758 },
  { id: 'p-task', code: 'M-04', name: 'Task Dashboard', x: 27, z: 15, w: 12, d: 8, commits: 3 },
  { id: 'p-axon', code: 'M-05', name: 'Axon Voice', x: -31, z: 18, w: 12, d: 12, commits: 257 },
  { id: 'p-voice', code: 'M-06', name: 'VoiceLaunch TTS', x: -9, z: 20, w: 12, d: 10, commits: 94 },
  { id: 'p-nexo', code: 'M-07', name: 'Nexo Assist', x: 10, z: 17, w: 12, d: 10, commits: (window.NEXO_NUMBERS && window.NEXO_NUMBERS.commits) || 121 } // the count lives in assets/nexo-numbers.js
];

function createWorld([THREE, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { ShaderPass }, { OutputPass }]) {
  const canvas = $('#gl');
  const DPR = Math.min(window.devicePixelRatio || 1, LOW ? 1.3 : 1.75);
  let W = window.innerWidth, H = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(DPR); renderer.setSize(W, H, false);
  const PAL = () => (window.PLANTA_TEMA ? window.PLANTA_TEMA.pal() : { ink: '#050B16', plan: '#6A9FCC', dim: '#41709A', bright: '#D8EEFF', glass: '#5EA8F0', accent: '#FF6A2B', grid: '#4F7FAD', bloom: 1 });
  /* every colour in the scene is registered here, so a theme change repaints it in place */
  const tints = [];
  const tint = (key, mul = 1, c = new THREE.Color()) => { tints.push([c, key, mul]); return c.set(PAL()[key]).multiplyScalar(mul); };
  renderer.setClearColor(PAL().ink, 1);
  renderer.toneMapping = THREE.NoToneMapping;
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); failGL(); }, false);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PAL().ink); // RenderPass clears with autoClear off: a scene background keeps the clear colour linear
  const camera = new THREE.PerspectiveCamera(40, W / H, 0.5, 1400);
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  scene.add(new THREE.AmbientLight(0xffffff, 1.3));
  const sun = new THREE.DirectionalLight(0xffffff, 3.2); sun.position.set(-0.6, 1, 0.45); scene.add(sun);

  /* infinite drafting floor */
  const gridMat = new THREE.ShaderMaterial({ vertexShader: GRID_VS, fragmentShader: GRID_FS, transparent: true, depthWrite: false, uniforms: { uColor: { value: tint('grid') }, uCam: { value: V3(0, 0, 0) } } });
  const grid = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), gridMat);
  grid.rotation.x = -Math.PI / 2; grid.renderOrder = -2; grid.frustumCulled = false; scene.add(grid);

  /* self-drawing hairlines: every vertex carries its draw time (aProg) */
  const lineMat = (key, opacity, dash = 0, flow = 0) => new THREE.ShaderMaterial({
    vertexShader: LINE_VS, fragmentShader: LINE_FS, transparent: true, depthWrite: false,
    uniforms: { uColor: { value: tint(key) }, uDraw: { value: 0 }, uOpacity: { value: opacity }, uDash: { value: dash }, uFlow: { value: flow }, uTime: { value: 0 }, uBoost: { value: new THREE.Vector4() } }
  });
  const lb = () => ({ p: [], a: [], d: [], g: [] });
  function seg(L, x1, y1, z1, x2, y2, z2, t0, t1, g = 0, d0 = 0) {
    const len = Math.hypot(x2 - x1, y2 - y1, z2 - z1);
    L.p.push(x1, y1, z1, x2, y2, z2); L.a.push(t0, t1); L.d.push(d0, d0 + len); L.g.push(g, g);
  }
  function poly(L, pts, t0, t1, g = 0, closed = false) {
    const P = closed ? pts.concat([pts[0]]) : pts;
    let tot = 0;
    for (let i = 1; i < P.length; i++) tot += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1], P[i][2] - P[i - 1][2]);
    let acc = 0;
    for (let i = 1; i < P.length; i++) {
      const a = P[i - 1], b = P[i], l = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      seg(L, a[0], a[1], a[2], b[0], b[1], b[2], t0 + (t1 - t0) * acc / tot, t0 + (t1 - t0) * (acc + l) / tot, g, acc);
      acc += l;
    }
  }
  const rect = (L, cx, cz, w, d, y, t0, t1, g = 0) => poly(L, [[cx - w / 2, y, cz - d / 2], [cx + w / 2, y, cz - d / 2], [cx + w / 2, y, cz + d / 2], [cx - w / 2, y, cz + d / 2]], t0, t1, g, true);
  function arc(L, cx, cz, r, a0, a1, y, n, t0, t1, g = 0) {
    const pts = [];
    for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]); }
    poly(L, pts, t0, t1, g);
  }
  function arrow(L, H2, pts, t0, t1) {
    poly(L, pts, t0, t1);
    const a = pts[pts.length - 2], b = pts[pts.length - 1];
    const dx = b[0] - a[0], dz = b[2] - a[2], l = Math.hypot(dx, dz) || 1, ux = dx / l, uz = dz / l, s = 1.1;
    seg(H2, b[0], b[1], b[2], b[0] - ux * s - uz * s * 0.6, b[1], b[2] - uz * s + ux * s * 0.6, t1 - 0.02, t1);
    seg(H2, b[0], b[1], b[2], b[0] - ux * s + uz * s * 0.6, b[1], b[2] - uz * s - ux * s * 0.6, t1 - 0.02, t1);
  }
  function dimH(L, x1, x2, z, y, t0, t1) {
    seg(L, x1, y, z, x2, y, z, t0, t1);
    for (const x of [x1, x2]) { seg(L, x, y, z - 1.4, x, y, z + 1.4, t0, t0 + 0.05); seg(L, x - 0.7, y, z + 0.7, x + 0.7, y, z - 0.7, t1 - 0.04, t1); }
  }
  function dimV(L, z1, z2, x, y, t0, t1) {
    seg(L, x, y, z1, x, y, z2, t0, t1);
    for (const z of [z1, z2]) { seg(L, x - 1.4, y, z, x + 1.4, y, z, t0, t0 + 0.05); seg(L, x - 0.7, y, z + 0.7, x + 0.7, y, z - 0.7, t1 - 0.04, t1); }
  }
  function addLines(L, mat) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(L.p, 3));
    g.setAttribute('aProg', new THREE.Float32BufferAttribute(L.a, 1));
    g.setAttribute('aDist', new THREE.Float32BufferAttribute(L.d, 1));
    g.setAttribute('aGroup', new THREE.Float32BufferAttribute(L.g, 1));
    const m = new THREE.LineSegments(g, mat); m.frustumCulled = false; scene.add(m); return m;
  }

  /* ---- the plan ---- */
  const Y = 0.03, MX = [-36, -12, 12, 36], MZ = -36, MS = 9, MH = 0.9, LANES = [-2.1, -0.7, 0.7, 2.1];
  const AX = [-40, -20, 0, 20, 40], AZ = [-36, -6, 18, 40, 54];
  const P = 1.15, FX0 = -26 * P, FZ0 = 40 - 3 * P;
  const cx0 = FX0 - P / 2, cx1 = FX0 + 52.5 * P, cz0 = FZ0 - P / 2, cz1 = FZ0 + 6.5 * P;
  const TZ = 54, D0 = Date.UTC(2026, 4, 1);
  const dX = (m, d) => -20 + ((Date.UTC(2026, m, d) - D0) / 864e5) / 184 * 40;
  const planL = lb(), dimL = lb(), dashL = lb(), flowL = lb(), glyL = lb(), timeL = lb();

  rect(planL, 0, 3, 116, 126, Y, 0, 0.22); rect(planL, 0, 3, 113.6, 123.6, Y, 0.04, 0.26);
  AX.forEach((x, i) => { seg(dashL, x, Y, -49.8, x, Y, 62, 0.02 + i * 0.03, 0.3 + i * 0.03); arc(planL, x, -52, 2.2, 0, Math.PI * 2, Y, 28, 0.02 + i * 0.03, 0.12 + i * 0.03); });
  AZ.forEach((z, i) => { seg(dashL, -49.8, Y, z, 50, Y, z, 0.05 + i * 0.03, 0.33 + i * 0.03); arc(planL, -52, z, 2.2, 0, Math.PI * 2, Y, 28, 0.05 + i * 0.03, 0.15 + i * 0.03); });
  MX.forEach((x, k) => { const t0 = 0.18 + k * 0.07; rect(glyL, x, MZ, MS, MS, Y, t0, t0 + 0.12, k); });
  { // 01 desenho: esquadro + compasso
    const x = MX[0], y = MH + 0.03, t = 0.34;
    poly(glyL, [[x - 3, y, MZ + 3], [x + 3, y, MZ + 3], [x - 3, y, MZ - 3]], t, t + 0.12, 0, true);
    poly(glyL, [[x - 2, y, MZ + 2], [x + 1.1, y, MZ + 2], [x - 2, y, MZ - 1.1]], t + 0.06, t + 0.16, 0, true);
    arc(glyL, x - 3, MZ + 3, 4.4, -Math.PI / 2, 0, y, 16, t + 0.1, t + 0.2, 0);
    seg(glyL, x - 3.8, y, MZ - 3.6, x + 3.8, y, MZ - 3.6, t + 0.12, t + 0.2, 0);
  }
  { // 02 delego: hub + quatro faixas (os quatro agentes)
    const x = MX[1], y = MH + 0.03, t = 0.4;
    arc(glyL, x, MZ, 1.5, 0, Math.PI * 2, y, 24, t, t + 0.08, 1); arc(glyL, x, MZ, 0.7, 0, Math.PI * 2, y, 16, t + 0.04, t + 0.1, 1);
    seg(glyL, x - 4.5, y, MZ, x - 1.5, y, MZ, t, t + 0.06, 1);
    LANES.forEach((l, j) => { const a = Math.atan2(l, 4.5); seg(glyL, x + Math.cos(a) * 1.5, y, MZ + Math.sin(a) * 1.5, x + 4.5, y, MZ + l, t + 0.06 + j * 0.02, t + 0.14 + j * 0.02, 1); });
  }
  { // 03 verifico: portão
    const x = MX[2], y0 = MH + 0.03, t = 0.46, top = 6;
    for (const dx of [-0.6, 0.6]) {
      seg(glyL, x + dx, y0, MZ - 3.2, x + dx, top, MZ - 3.2, t, t + 0.1, 2); seg(glyL, x + dx, y0, MZ + 3.2, x + dx, top, MZ + 3.2, t, t + 0.1, 2);
      seg(glyL, x + dx, top, MZ - 3.2, x + dx, top, MZ + 3.2, t + 0.1, t + 0.16, 2);
    }
    [2.2, 3.4, 4.6].forEach((h, j) => seg(glyL, x, h, MZ - 3.2, x, h, MZ + 3.2, t + 0.12 + j * 0.02, t + 0.18 + j * 0.02, 2));
    seg(glyL, x - 0.6, top, MZ - 3.2, x + 0.6, top, MZ - 3.2, t + 0.16, t + 0.18, 2); seg(glyL, x - 0.6, top, MZ + 3.2, x + 0.6, top, MZ + 3.2, t + 0.16, t + 0.18, 2);
  }
  { // 04 meço: mostrador
    const x = MX[3], y = MH + 0.03, t = 0.52, cz = MZ + 1.2;
    arc(glyL, x, cz, 3.2, Math.PI, Math.PI * 2, y, 24, t, t + 0.1, 3); arc(glyL, x, cz, 2.3, Math.PI, Math.PI * 2, y, 18, t + 0.04, t + 0.12, 3);
    for (let i = 0; i <= 8; i++) { const a = Math.PI + Math.PI * i / 8; seg(glyL, x + Math.cos(a) * 3.3, y, cz + Math.sin(a) * 3.3, x + Math.cos(a) * 3.8, y, cz + Math.sin(a) * 3.8, t + 0.08 + i * 0.006, t + 0.1 + i * 0.006, 3); }
    seg(glyL, x - 3.9, y, cz, x + 3.9, y, cz, t + 0.1, t + 0.15, 3);
    const na = Math.PI * 1.68; seg(glyL, x, y, cz, x + Math.cos(na) * 2.9, y, cz + Math.sin(na) * 2.9, t + 0.14, t + 0.18, 3);
  }
  arrow(flowL, planL, [[-31.2, Y, MZ], [-16.8, Y, MZ]], 0.3, 0.4);
  LANES.forEach((l, j) => arrow(flowL, planL, [[-7.5, Y, MZ + l], [7.2, Y, MZ + l]], 0.36 + j * 0.02, 0.48 + j * 0.02));
  arrow(flowL, planL, [[16.8, Y, MZ], [31.2, Y, MZ]], 0.44, 0.54);
  arrow(flowL, planL, [[36, Y, -31.2], [36, Y, -21], [-27, Y, -21], [-27, Y, -13.4]], 0.5, 0.74);
  arrow(flowL, planL, [[-12, Y, -31.2], [-12, Y, -25], [29, Y, -25], [29, Y, -16.4]], 0.52, 0.76);
  MODS.forEach((m, i) => {
    const t0 = 0.3 + i * 0.05;
    rect(planL, m.x, m.z, m.w, m.d, Y, t0, t0 + 0.16);
    seg(dimL, m.x - m.w / 2, Y, m.z - m.d / 2, m.x + m.w / 2, Y, m.z + m.d / 2, t0 + 0.12, t0 + 0.2);
    seg(dimL, m.x + m.w / 2, Y, m.z - m.d / 2, m.x - m.w / 2, Y, m.z + m.d / 2, t0 + 0.14, t0 + 0.22);
  });
  rect(planL, (cx0 + cx1) / 2, (cz0 + cz1) / 2, cx1 - cx0, cz1 - cz0, Y, 0.5, 0.66);
  for (let i = 1; i < 53; i++) { const x = cx0 + i * P, t = 0.56 + i / 53 * 0.3; seg(dimL, x, Y, cz0, x, Y, cz1, t, t + 0.05); }
  for (let j = 1; j < 7; j++) { const z = cz0 + j * P; seg(dimL, cx0, Y, z, cx1, Y, z, 0.6 + j * 0.02, 0.86 + j * 0.02); }
  // linha do tempo: eixo em escala (mai → out 2026), origem fora de escala, próximo tracejado
  seg(planL, -21, Y, TZ, 21, Y, TZ, 0.62, 0.86);
  for (let k = 0; k <= 6; k++) { const x = dX(4 + k, 1); seg(planL, x, Y, TZ - 0.8, x, Y, TZ + 0.8, 0.66 + k * 0.03, 0.7 + k * 0.03); }
  poly(planL, [[-26, Y, TZ], [-23.6, Y, TZ], [-23.1, Y, TZ - 1], [-22.4, Y, TZ + 1], [-21.9, Y, TZ], [-21, Y, TZ]], 0.6, 0.66);
  for (let k = 0; k < 4; k++) seg(dimL, 21.4 + k * 0.95, Y, TZ, 21.9 + k * 0.95, Y, TZ, 0.84 + k * 0.02, 0.86 + k * 0.02);
  dimH(dimL, -40.5, 40.5, -45, Y, 0.7, 0.85);
  dimH(dimL, cx0, cx1, 47, Y, 0.74, 0.9);
  dimV(dimL, cz0, cz1, 33.4, Y, 0.78, 0.88);
  dimV(dimL, -16, 25, -45, Y, 0.72, 0.86);
  dimH(dimL, dX(4, 5), dX(9, 27), 59, Y, 0.8, 0.95);
  const MILE = TX.miles;
  const POSTS = MILE.map(([m, d], i) => [dX(m, d), i % 2 ? 6.2 : 3]);
  POSTS.forEach(([x, h], i) => {
    const t = 0.12 + i * 0.11;
    seg(timeL, x, Y, TZ, x, h, TZ, t, t + 0.1); seg(timeL, x - 0.9, h, TZ, x + 0.9, h, TZ, t + 0.08, t + 0.12);
    arc(timeL, x, TZ, 0.7, 0, Math.PI * 2, Y, 16, t, t + 0.06);
  });
  seg(timeL, -26, Y, TZ, -26, 4.6, TZ, 0, 0.1); seg(timeL, -26.9, 4.6, TZ, -25.1, 4.6, TZ, 0.08, 0.12); arc(timeL, -26, TZ, 0.7, 0, Math.PI * 2, Y, 16, 0, 0.06);
  for (let k = 0; k < 6; k++) seg(timeL, 25.5, k * 0.75, TZ, 25.5, k * 0.75 + 0.4, TZ, 0.86 + k * 0.02, 0.88 + k * 0.02);
  seg(timeL, 24.6, 4.4, TZ, 26.4, 4.4, TZ, 0.97, 1);

  const matPlan = lineMat('plan', 0.78), matDim = lineMat('dim', 0.7), matDash = lineMat('dim', 0.55, 1.4, 0);
  const matFlow = lineMat('plan', 0.85, 1.1, 2.4), matGly = lineMat('bright', 0.62), matTime = lineMat('bright', 0.85);
  const drawMats = [matPlan, matDim, matDash, matFlow, matGly];
  addLines(planL, matPlan); addLines(dimL, matDim); addLines(dashL, matDash); addLines(flowL, matFlow); addLines(glyL, matGly); addLines(timeL, matTime);

  /* ---- volumes: wire edges + glass, clipped at the current build height ---- */
  function volume(x, z, w, d, h) {
    const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
    const pos = [], hw = w / 2, hd = d / 2;
    const ringAt = y => pos.push(-hw, y, -hd, hw, y, -hd, hw, y, -hd, hw, y, hd, hw, y, hd, -hw, y, hd, -hw, y, hd, -hw, y, -hd);
    ringAt(0.02); ringAt(h);
    for (let y = 1.6; y < h - 0.4; y += 1.6) ringAt(y);
    for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) pos.push(sx * hw, 0, sz * hd, sx * hw, h, sz * hd);
    const eg = new THREE.BufferGeometry(); eg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const em = new THREE.ShaderMaterial({ vertexShader: EDGE_VS, fragmentShader: EDGE_FS, transparent: true, depthWrite: false,
      uniforms: { uColor: { value: tint('bright') }, uHot: { value: tint('accent') }, uH: { value: -1 }, uHotAmt: { value: 0 }, uGlow: { value: 0 }, uOpacity: { value: 0.9 } } });
    const edges = new THREE.LineSegments(eg, em); edges.frustumCulled = false; g.add(edges);
    const gg = new THREE.BoxGeometry(w, h, d); gg.translate(0, h / 2, 0);
    const gm = new THREE.ShaderMaterial({ vertexShader: GLASS_VS, fragmentShader: GLASS_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: tint('glass') }, uH: { value: -1 }, uOpacity: { value: 0.42 }, uGlow: { value: 0 } } });
    g.add(new THREE.Mesh(gg, gm));
    return { g, em, gm, x, z, w, d, h, b: 0, hot: 0, glow: 0, state: 0, squad: [] };
  }
  const mods = MODS.map((m, i) => {
    const V = volume(m.x, m.z, m.w, m.d, Math.max(1.6, 4 * Math.log10(m.commits)));
    V.i = i;
    const wg = new THREE.BufferGeometry().setFromPoints([V3(-m.w / 2, 0, -m.d / 2), V3(m.w / 2, 0, -m.d / 2), V3(m.w / 2, 0, m.d / 2), V3(-m.w / 2, 0, m.d / 2)]);
    V.weld = new THREE.LineLoop(wg, new THREE.LineBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    tint('accent', 1.6, V.weld.material.color);
    V.weld.visible = false; V.g.add(V.weld);
    V.proxy = new THREE.Mesh(new THREE.BoxGeometry(m.w, 1, m.d).translate(0, 0.5, 0), new THREE.MeshBasicMaterial());
    V.proxy.visible = false; V.proxy.scale.y = 0.01; V.proxy.userData.mod = i; V.g.add(V.proxy);
    return V;
  });
  const mvols = MX.map(x => { const V = volume(x, MZ, MS, MS, MH); V.em.uniforms.uOpacity.value = 0.7; V.gm.uniforms.uOpacity.value = 0.5; return V; });

  /* ---- agents: one InstancedMesh of orange cubes, spring-driven ---- */
  const N = LOW ? 240 : 520, NF = LOW ? 36 : 72;
  const cube = new THREE.BoxGeometry(1, 1, 1);
  const agents = new THREE.InstancedMesh(cube, new THREE.MeshLambertMaterial({ emissiveIntensity: 0.6 }), N);
  tint('accent', 1, agents.material.color); tint('accent', 1, agents.material.emissive);
  agents.frustumCulled = false; agents.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(agents);
  const AP = new Float32Array(N * 3), AV = new Float32Array(N * 3), PH = new Float32Array(N), RR = new Float32Array(N), ROLE = new Int16Array(N);
  for (let i = 0; i < N; i++) {
    PH[i] = Math.random(); RR[i] = Math.random(); ROLE[i] = i < NF ? -2 : -1;
    const a = Math.random() * Math.PI * 2, r = 150 + Math.random() * 60;
    AP[i * 3] = Math.cos(a) * r; AP[i * 3 + 1] = 30 + Math.random() * 30; AP[i * 3 + 2] = Math.sin(a) * r;
  }
  const flowCurve = new THREE.CatmullRomCurve3([V3(-48, 1.7, MZ), V3(-36, 1.9, MZ), V3(-24, 1.7, MZ), V3(-12, 1.9, MZ), V3(0, 1.7, MZ), V3(12, 2.4, MZ), V3(24, 1.7, MZ), V3(36, 1.9, MZ), V3(48, 2.2, MZ), V3(56, 7, MZ - 6), V3(40, 13, MZ - 14), V3(0, 16, MZ - 17), V3(-40, 13, MZ - 14), V3(-56, 7, MZ - 6)], true, 'centripetal');
  const FL = flowCurve.getSpacedPoints(720), FLN = FL.length - 1;

  /* ---- the real calendar as bricks the agents stack (1 bloco = até 5 contribuições) ---- */
  const BH = 0.28, UNIT = 5, bl = [];
  CONTRIB.forEach((wk, w) => wk.forEach((c, d) => { for (let l = 0; l < Math.ceil(c / UNIT); l++) bl.push([w, d, l]); }));
  const NB = bl.length;
  const bricks = new THREE.InstancedMesh(new THREE.BoxGeometry(0.86, BH * 0.86, 0.86), new THREE.MeshLambertMaterial({ color: 0xffffff, emissiveIntensity: 0.22 }), NB);
  tint('accent', 1, bricks.material.emissive);
  bricks.count = 0; bricks.frustumCulled = false; bricks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const BF = new Float32Array(NB * 3), BS = new Float32Array(NB * 3), BT = new Float32Array(NB), BD = new Float32Array(NB), tc = new THREE.Color();
  bl.forEach(([w, d, l], k) => {
    BF[k * 3] = FX0 + w * P; BF[k * 3 + 1] = BH * (l + 0.5); BF[k * 3 + 2] = FZ0 + d * P;
    const a = Math.random() * Math.PI * 2; BS[k * 3] = Math.cos(a) * 74; BS[k * 3 + 1] = 27 + Math.random() * 6; BS[k * 3 + 2] = 4 + Math.sin(a) * 60;
    BT[k] = 0.2 + (w / 52) * 1.8 + l * 0.028 + Math.random() * 0.25; BD[k] = 0.8 + Math.random() * 0.35;
  });
  function paintBricks() { const a = new THREE.Color(PAL().accent); bl.forEach(([, , l], k) => bricks.setColorAt(k, tc.copy(a).multiplyScalar(0.55 + 0.75 * Math.min(1, l / 24)))); bricks.instanceColor.needsUpdate = true; }
  paintBricks(); scene.add(bricks);
  const ND = CONTRIB.reduce((s, wk) => s + wk.length, 0), dayIdx = [], dm = new THREE.Matrix4();
  const calProxy = new THREE.InstancedMesh(new THREE.BoxGeometry(P, 1, P).translate(0, 0.5, 0), new THREE.MeshBasicMaterial(), ND);
  CONTRIB.forEach((wk, w) => wk.forEach((c, d) => { dm.makeScale(1, Math.max(0.25, Math.ceil(c / UNIT) * BH), 1).setPosition(FX0 + w * P, 0, FZ0 + d * P); calProxy.setMatrixAt(dayIdx.length, dm); dayIdx.push([w, d, c]); }));
  calProxy.visible = false; calProxy.computeBoundingSphere(); scene.add(calProxy); calProxy.updateMatrixWorld(true);
  const hoverMark = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([V3(-0.62, 0, -0.62), V3(0.62, 0, -0.62), V3(0.62, 0, 0.62), V3(-0.62, 0, 0.62)]), new THREE.LineBasicMaterial());
  tint('bright', 1.4, hoverMark.material.color);
  hoverMark.visible = false; scene.add(hoverMark);

  /* ---- HTML labels projected from 3D anchors ---- */
  let drawT = 0, timeT = 0, timeStarted = false, chapterNow = 0, methodOn = -1, sheetMod = -1, hoverMod = -1;
  const labelsEl = $('#labels'); labelsEl.textContent = '';
  const LBL = [];
  // ch = bitmask of chapters (0 hero … 5 contato) in which a label may show; s = smoothed alpha
  function label(html, cls, x, y, z, opt = {}) {
    const el = document.createElement('div'); el.className = 'lbl ' + cls; el.innerHTML = '<span>' + html + '</span>'; labelsEl.appendChild(el);
    const L = { el, p: V3(x, y, z), a: -1, s: 0, gate: opt.gate || null, max: opt.max || 420, ch: opt.ch === undefined ? 63 : opt.ch }; LBL.push(L); return L;
  }
  const gDraw = () => clamp((drawT - 0.25) / 0.5, 0, 1);
  const gHigh = () => gDraw() * clamp((camera.position.y - 55) / 25, 0, 1);
  const C_HERO = 1, C_MET = 2, C_PRJ = 4, C_ATV = 8, C_TRJ = 16, C_CTT = 32;
  AX.forEach((x, i) => label(String(i + 1), 'lbl-ax', x, Y, -52, { gate: gHigh }));
  AZ.forEach((z, i) => label('ABCDE'[i], 'lbl-ax', -52, Y, z, { gate: gHigh }));
  TX.steps.forEach((n, k) => label(n, 'lbl-m', MX[k] - MS / 2, MH, MZ + MS / 2, { gate: gDraw, ch: C_HERO | C_MET | C_PRJ | C_CTT }));
  ['Claude Code', 'Codex', 'Gemini', 'Cursor Agent'].forEach((n, j) => label(n, 'lbl-lane', -4.5 + j * 3, Y, MZ + LANES[j], { gate: gDraw, max: 75, ch: C_MET }));
  label(TX.lMeasure, 'lbl-c', -14, Y, -21, { gate: gDraw, max: 210, ch: C_HERO | C_MET | C_PRJ });
  label(TX.lDelegate, 'lbl-c', 12, Y, -25, { gate: gDraw, max: 210, ch: C_HERO | C_MET | C_PRJ });
  label(TX.lMethod, 'lbl-c', 0, Y, -45, { gate: gDraw, max: 230, ch: C_HERO | C_MET });
  label(TX.lWeeks, 'lbl-c', 0, Y, 47, { gate: gDraw, max: 230, ch: C_HERO | C_ATV });
  label(TX.lDays, 'lbl-c', 33.4, Y, 40, { gate: gDraw, max: 160, ch: C_HERO | C_ATV });
  label(TX.lMods, 'lbl-c', -45, Y, 4.5, { gate: gDraw, max: 230, ch: C_PRJ });
  label(TX.lZoneAct, 'lbl-z', cx0, Y, cz0 - 0.6, { gate: gDraw, ch: C_HERO | C_ATV | C_CTT });
  label(TX.lZoneTraj, 'lbl-z', -26, Y, TZ - 1.4, { gate: gDraw, ch: C_HERO | C_TRJ | C_CTT });
  MESES.slice(4, 10).forEach((m, k) => label(m, 'lbl-mo', (dX(4 + k, 1) + dX(5 + k, 1)) / 2, Y, TZ + 1.6, { gate: gDraw, max: 170, ch: C_TRJ }));
  POSTS.forEach(([x, h], i) => label('<b>' + MILE[i][2] + '</b><i>' + MILE[i][3] + '</i>', 'lbl-t', x, h, TZ, { gate: () => clamp((timeT - 0.12 - i * 0.11) * 6, 0, 1), max: 240, ch: C_TRJ }));
  label(TX.lOrigin, 'lbl-t', -26, 4.6, TZ, { gate: () => clamp(timeT * 6, 0, 1), max: 240, ch: C_TRJ });
  label(TX.lNext, 'lbl-t', 25.5, 4.4, TZ, { gate: () => clamp((timeT - 0.9) * 10, 0, 1), max: 240, ch: C_TRJ });
  const modLabels = mods.map((V, i) => label('<b>' + MODS[i].code + '</b>' + MODS[i].name + '<em>' + MODS[i].commits.toLocaleString(TX.locale) + TX.commitsLog + '</em>', 'lbl-mod', V.x - V.w / 2, 0.05, V.z + V.d / 2, { gate: gDraw, ch: C_HERO | C_PRJ | C_CTT }));
  const pv = V3(0, 0, 0);
  /* text that sits on the drawing without a panel: labels fade instead of running across it */
  const shieldEls = $$('.hero-copy, .sheet.ghost');
  let shields = [];
  function updateLabels(still) {
    const bit = 1 << clamp(chapterNow, 0, 5);
    shields = shieldEls.map(e => e.getBoundingClientRect()).filter(r => r.bottom > 0 && r.top < H);
    for (let i = 0; i < LBL.length; i++) {
      const L = LBL[i];
      const want = (L.ch & bit) ? (L.gate ? L.gate() : 1) : 0;
      L.s = still ? want : L.s + (want - L.s) * 0.12;
      let a = L.s;
      if (a > 0.001) {
        pv.copy(L.p);
        const dist = pv.distanceTo(camera.position);
        a *= 1 - clamp((dist - L.max * 0.8) / (L.max * 0.2), 0, 1);
        pv.project(camera);
        if (pv.z > 1 || pv.x < -1.02 || pv.x > 1.02 || pv.y < -1.1 || pv.y > 1.1) a = 0;
        else {
          const sx = Math.round((pv.x * 0.5 + 0.5) * W);
          // fade labels that would run under the ruler or off either edge
          if (L.w === undefined) { L.w = L.el.firstChild.offsetWidth; L.left = /\blbl-(mod|m|z)\b/.test(L.el.className); }
          const x0 = L.left ? sx : sx - L.w / 2, x1 = L.left ? sx + 8 + L.w : sx + L.w / 2;
          a *= clamp((W - (W >= 1024 ? 80 : 12) - x1) / 32, 0, 1) * clamp((x0 - 12) / 32, 0, 1);
          const sy = Math.round((-pv.y * 0.5 + 0.5) * H);
          for (let k = 0; k < shields.length; k++) { const r = shields[k]; if (x1 > r.left - 16 && x0 < r.right + 16 && sy > r.top - 20 && sy - 32 < r.bottom + 8) { a = 0; break; } }
          L.el.style.transform = 'translate3d(' + sx + 'px,' + sy + 'px,0)';
        }
      } else a = 0;
      if (Math.abs(a - L.a) > 0.015 || (a === 0 && L.a !== 0)) { L.el.style.opacity = a.toFixed(3); L.a = a; }
    }
  }

  /* ---- camera along CatmullRom curves, scrubbed by ScrollTrigger ---- */
  const NS = STOPS.length;
  const posCurve = new THREE.CatmullRomCurve3(STOPS.map(s => V3(s[0][0], s[0][1], s[0][2])), false, 'centripetal');
  const tgtCurve = new THREE.CatmullRomCurve3(STOPS.map(s => V3(s[1][0], s[1][1], s[1][2])), false, 'centripetal');
  const stopEls = $$('[data-stop]'), rulerLis = $$('.ruler li');
  const sp = { p: 0 };
  let anchors = [], maxS = 1, distMul = 1, ptrX = 0, ptrY = 0;
  function measure() {
    const vh = window.innerHeight;
    maxS = Math.max(1, HAS_GSAP ? ScrollTrigger.maxScroll(window) : root.scrollHeight - vh);
    anchors = [];
    const n = Math.min(NS, stopEls.length);
    for (let i = 0; i < n; i++) {
      const r = stopEls[i].getBoundingClientRect();
      let a = i === 0 ? 0 : clamp(r.top + window.scrollY + r.height / 2 - vh / 2, 0, maxS);
      if (i > 0) a = Math.max(a, anchors[i - 1] + 1);
      anchors.push(a);
    }
    sections.forEach((s, i) => { if (rulerLis[i]) rulerLis[i].style.top = (clamp((s.getBoundingClientRect().top + window.scrollY) / maxS, 0, 1) * 100).toFixed(2) + '%'; });
  }
  function stopAt(s) {
    const n = anchors.length;
    if (n < 2 || s <= anchors[0]) return 0;
    for (let i = 0; i < n - 1; i++) {
      if (s < anchors[i + 1]) { let t = (s - anchors[i]) / (anchors[i + 1] - anchors[i]); t = t * t * (3 - 2 * t) * 0.6 + t * 0.4; return i + t; }
    }
    return n - 1;
  }
  function sideAt(f) {
    const i = Math.min(Math.floor(f), NS - 1), t = f - i, a = STOPS[i][2], b = STOPS[Math.min(i + 1, NS - 1)][2];
    return a + (b - a) * t * t * (3 - 2 * t);
  }
  if (MOTION) {
    gsap.to(sp, { p: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 1.2 } });
    ScrollTrigger.addEventListener('refresh', measure);
  }
  const cp = V3(0, 0, 0), ct = V3(0, 0, 0), tmp = V3(0, 0, 0);
  function lens() {
    const a = W / H;
    camera.aspect = a;
    camera.fov = a >= 1 ? 40 : Math.min(68, 2 * Math.atan(Math.tan(20 * Math.PI / 180) / Math.pow(a, 0.75)) * 180 / Math.PI);
    distMul = a >= 1 ? 1 : 1 + (1 - a) * 1.0;
    camera.updateProjectionMatrix();
  }
  function updateCamera(dt) {
    if (!HAS_GSAP) sp.p += (clamp(window.scrollY / maxS, 0, 1) - sp.p) * Math.min(1, dt * 3);
    const f = stopAt(sp.p * maxS), u = clamp(f / (NS - 1), 0, 1);
    posCurve.getPoint(u, cp); tgtCurve.getPoint(u, ct);
    tmp.subVectors(cp, ct).multiplyScalar(distMul); cp.copy(ct).add(tmp);
    const k = Math.min(1, dt * 3);
    ptrX += ((pIn && FINE ? pmx / W - 0.5 : 0) - ptrX) * k; ptrY += ((pIn && FINE ? pmy / H - 0.5 : 0) - ptrY) * k;
    cp.x += ptrX * 2.4 + Math.sin(T * 0.13) * 0.8; cp.y -= ptrY * 1.6;
    camera.position.copy(cp); camera.lookAt(ct);
    const wide = W >= 900;
    camera.setViewOffset(W, H, wide ? sideAt(f) * W : 0, wide ? 0 : 0.2 * H, W, H);
  }

  /* ---- agent behaviours: ring (holding orbit), flow (method pipeline), field (calendar), squad (module) ---- */
  const m4 = agents.instanceMatrix.array, TC = Math.cos(0.6), TS = Math.sin(0.6), pp = [0, 0];
  const ringP = V3(0, 0, 0);
  let ringS = 1, rot = 0, snap = false, ringOK = false, T = 0;
  let calState = 0, calT0 = 0, fieldSquad = [];
  function perim(V, u, out) {
    const w = V.w, d = V.d; let s = (u % 1) * 2 * (w + d);
    if (s < w) { out[0] = -w / 2 + s; out[1] = -d / 2; return; } s -= w;
    if (s < d) { out[0] = w / 2; out[1] = -d / 2 + s; return; } s -= d;
    if (s < w) { out[0] = w / 2 - s; out[1] = d / 2; return; } s -= w;
    out[0] = -w / 2; out[1] = d / 2 - s;
  }
  function updateAgents(dt) {
    ringS += ((chapterNow === 5 ? 0.82 : 1) - ringS) * Math.min(1, dt * 0.8);
    const wave = FX0 + clamp((T - calT0 - 0.2) / 1.8, 0, 1) * 52 * P, rep = ringOK && !overUI;
    for (let i = 0; i < N; i++) {
      const o = i * 3, ph = PH[i], rr = RR[i], r = ROLE[i];
      let tx, ty, tz, k, sc;
      if (r === -1) {
        const a = ph * 6.2832 + T * 0.05 * (0.6 + rr * 0.7), R = ringS * (0.92 + rr * 0.16);
        tx = Math.cos(a) * 74 * R; tz = 4 + Math.sin(a) * 60 * R; ty = 30 + (rr - 0.5) * 9 + Math.sin(T * 0.7 + ph * 40) * 1.6;
        if (rep) {
          const dx = AP[o] - ringP.x, dz = AP[o + 2] - ringP.z, d2 = dx * dx + dz * dz;
          if (d2 < 196) { const dd = Math.sqrt(d2) + 0.001, f = (14 - dd) * 1.1; tx += dx / dd * f; tz += dz / dd * f; ty += f * 0.35; }
        }
        k = 1.5; sc = 0.5;
      } else if (r === -2) {
        const u = (ph + T * 0.03 * (0.85 + rr * 0.3)) % 1, fi = u * FLN, i0 = fi | 0, fr = fi - i0, A = FL[i0], B = FL[Math.min(i0 + 1, FLN)];
        tx = A.x + (B.x - A.x) * fr; ty = A.y + (B.y - A.y) * fr + Math.sin(T * 4 + ph * 30) * 0.12; tz = A.z + (B.z - A.z) * fr;
        if (ty < 4) tz += LANES[i & 3] * (1 - smooth(6, 11, Math.abs(tx)));
        k = 16; sc = 0.42;
      } else if (r === -3) {
        tx = wave + (rr - 0.5) * 16; ty = 8 + rr * 4 + Math.sin(T * 3 + ph * 20) * 1.2; tz = FZ0 + 3 * P + (ph - 0.5) * 12;
        k = 4; sc = 0.5;
      } else {
        const V = mods[r], y = Math.max(0, V.b * V.h);
        if (rr < 0.7) { perim(V, ph + T * 0.06, pp); tx = V.x + pp[0]; tz = V.z + pp[1]; ty = y + 0.3 + Math.sin(T * 7 + ph * 50) * 0.1; }
        else { const a = ph * 6.2832 + T * 0.9; tx = V.x + Math.cos(a) * V.w * 0.3; tz = V.z + Math.sin(a) * V.d * 0.3; ty = y + 2 + Math.sin(T * 2 + ph * 9) * 0.7; }
        k = 6; sc = 0.46;
      }
      let px = AP[o], py = AP[o + 1], pz = AP[o + 2];
      if (snap) { px = tx; py = ty; pz = tz; AV[o] = AV[o + 1] = AV[o + 2] = 0; }
      else {
        const dx = tx - px, dy = ty - py, dz = tz - pz, dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist > 3) { const amp = Math.min(dist * 0.2, 7); tx += Math.sin(T * 1.3 + ph * 17) * amp; ty += Math.cos(T * 1.1 + ph * 11) * amp * 0.5; tz += Math.cos(T * 1.5 + ph * 23) * amp; }
        const c = 1.7 * Math.sqrt(k);
        AV[o] += ((tx - px) * k - AV[o] * c) * dt; AV[o + 1] += ((ty - py) * k - AV[o + 1] * c) * dt; AV[o + 2] += ((tz - pz) * k - AV[o + 2] * c) * dt;
        px += AV[o] * dt; py += AV[o + 1] * dt; pz += AV[o + 2] * dt;
      }
      AP[o] = px; AP[o + 1] = py; AP[o + 2] = pz;
      const ex = px - camera.position.x, ey = py - camera.position.y, ez = pz - camera.position.z;
      sc *= clamp((Math.sqrt(ex * ex + ey * ey + ez * ez) - 6) / 24, 0, 1); // no giant cubes in front of the lens
      const ang = T * (0.7 + ph * 1.8) + ph * 10, ca = Math.cos(ang) * sc, sa = Math.sin(ang) * sc, q = i * 16;
      m4[q] = ca; m4[q + 1] = 0; m4[q + 2] = -sa; m4[q + 3] = 0;
      m4[q + 4] = sa * TS; m4[q + 5] = TC * sc; m4[q + 6] = ca * TS; m4[q + 7] = 0;
      m4[q + 8] = sa * TC; m4[q + 9] = -TS * sc; m4[q + 10] = ca * TC; m4[q + 11] = 0;
      m4[q + 12] = px; m4[q + 13] = py; m4[q + 14] = pz; m4[q + 15] = 1;
    }
    agents.instanceMatrix.needsUpdate = true;
  }
  function takeAgents(n) {
    const out = [], M = N - NF;
    for (let i = 0; i < M && out.length < n; i++) { const j = NF + ((i + rot) % M); if (ROLE[j] === -1) out.push(j); }
    rot = (rot + 97) % M; return out;
  }
  function updateBricks() {
    if (calState !== 1) return;
    const t = T - calT0, m = bricks.instanceMatrix.array, s0 = 0.55 / 0.86, s1 = 0.55 / (BH * 0.86);
    let done = true;
    for (let k = 0; k < NB; k++) {
      let u = (t - BT[k]) / BD[k]; const o = k * 16;
      if (u < 1) done = false;
      if (u <= 0) { for (let q = 0; q < 16; q++) m[o + q] = 0; continue; }
      if (u > 1) u = 1;
      const e = 1 - Math.pow(1 - u, 3), a = 1 - e, k3 = k * 3;
      const sx = BS[k3], sy = BS[k3 + 1], sz = BS[k3 + 2], fx = BF[k3], fy = BF[k3 + 1], fz = BF[k3 + 2];
      const cx = (sx + fx) * 0.5, cy = Math.max(sy, fy) + 9, cz = (sz + fz) * 0.5;
      const r = a * 7, c = Math.cos(r), s = Math.sin(r), sxz = s0 * a + e, syy = s1 * a + e;
      m[o] = c * sxz; m[o + 1] = 0; m[o + 2] = -s * sxz; m[o + 3] = 0;
      m[o + 4] = 0; m[o + 5] = syy; m[o + 6] = 0; m[o + 7] = 0;
      m[o + 8] = s * sxz; m[o + 9] = 0; m[o + 10] = c * sxz; m[o + 11] = 0;
      m[o + 12] = a * a * sx + 2 * a * e * cx + e * e * fx; m[o + 13] = a * a * sy + 2 * a * e * cy + e * e * fy; m[o + 14] = a * a * sz + 2 * a * e * cz + e * e * fz; m[o + 15] = 1;
    }
    bricks.instanceMatrix.needsUpdate = true;
    if (done) { calState = 2; fieldSquad.forEach(j => { if (ROLE[j] === -3) ROLE[j] = -1; }); fieldSquad = []; refreshPick(); }
  }
  function updateMods(dt) {
    const k = Math.min(1, dt * 5);
    mods.forEach((V, i) => {
      const uH = V.b <= 0.0001 ? -1 : V.b * V.h;
      V.em.uniforms.uH.value = uH; V.gm.uniforms.uH.value = uH; V.em.uniforms.uHotAmt.value = V.hot;
      V.glow += ((hoverMod === i || sheetMod === i ? 1 : chapterNow === 5 ? 0.45 : 0) - V.glow) * k;
      V.em.uniforms.uGlow.value = V.glow * 1.2; V.gm.uniforms.uGlow.value = V.glow;
      const wa = V.state === 1 ? 1 : V.hot;
      V.weld.material.opacity = wa; V.weld.visible = wa > 0.01 && uH > 0; V.weld.position.y = Math.max(0.05, uH);
      V.proxy.scale.y = Math.max(0.01, uH);
      modLabels[i].p.y = Math.max(0.05, uH) + 0.1;
    });
    const md = clamp((drawT - 0.2) / 0.35, 0, 1);
    mvols.forEach((V, j) => {
      const uH = md <= 0 ? -1 : md * V.h; V.em.uniforms.uH.value = uH; V.gm.uniforms.uH.value = uH;
      V.glow += ((methodOn === j ? 1 : 0) - V.glow) * k; V.em.uniforms.uGlow.value = V.glow * 1.5; V.gm.uniforms.uGlow.value = V.glow * 1.5;
    });
    matGly.uniforms.uBoost.value.set(mvols[0].glow, mvols[1].glow, mvols[2].glow, mvols[3].glow);
  }

  /* ---- builds (one-way: once built, stays built) ---- */
  function build(key, instant) {
    instant = instant || !MOTION || !running;
    if (key === 'cal') {
      if (calState) return;
      bricks.count = NB; calState = 1;
      if (instant) { calT0 = T - 999; updateBricks(); return; }
      calT0 = T; fieldSquad = takeAgents(LOW ? 30 : 80); fieldSquad.forEach(j => { ROLE[j] = -3; });
      return;
    }
    if (key === 'time') {
      if (timeStarted) return; timeStarted = true;
      if (instant) { timeT = 1; matTime.uniforms.uDraw.value = 1; return; }
      const o = { v: 0 };
      gsap.to(o, { v: 1, duration: 1.9, ease: 'power2.inOut', onUpdate() { timeT = o.v; matTime.uniforms.uDraw.value = o.v; } });
      return;
    }
    const V = mods[+key]; if (!V || V.state) return;
    if (instant) { V.b = 1; V.state = 2; refreshPick(); return; }
    V.state = 1; V.hot = 1;
    V.squad = takeAgents(Math.round((V.w * V.d > 200 ? 64 : 42) * (LOW ? 0.55 : 1)));
    V.squad.forEach(j => { ROLE[j] = V.i; });
    gsap.to(V, { b: 1, duration: 3, delay: 0.6, ease: 'power1.inOut', onComplete() {
      V.state = 2; refreshPick();
      gsap.to(V, { hot: 0, duration: 1.4, delay: 0.3 });
      gsap.delayedCall(0.9, () => { V.squad.forEach(j => { if (ROLE[j] === V.i) ROLE[j] = -1; }); V.squad = []; });
    } });
  }

  /* ---- picking: modules, calendar days, floor coordinates ---- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), hitP = V3(0, 0, 0);
  const floorPl = new THREE.Plane(V3(0, 1, 0), 0), ringPl = new THREE.Plane(V3(0, 1, 0), -30);
  let pickables = [], hover = null, floorOK = false;
  function refreshPick() { pickables = mods.filter(V => V.state === 2).map(V => V.proxy); if (calState === 2) pickables.push(calProxy); }
  function pick() {
    hover = null; hoverMark.visible = false; hoverMod = -1;
    if (!FINE || !pIn) { floorOK = ringOK = false; return; }
    ndc.set(pmx / W * 2 - 1, -(pmy / H) * 2 + 1); ray.setFromCamera(ndc, camera);
    floorOK = !!ray.ray.intersectPlane(floorPl, hitP); ringOK = !!ray.ray.intersectPlane(ringPl, ringP);
    if (overUI || !pickables.length) return;
    const hits = ray.intersectObjects(pickables, false);
    if (!hits.length) return;
    const h = hits[0];
    if (h.object === calProxy) {
      const d = dayIdx[h.instanceId]; if (!d) return;
      hover = { t: 'day', w: d[0], d: d[1], c: d[2] };
      hoverMark.position.set(FX0 + d[0] * P, Math.max(0.06, Math.ceil(d[2] / UNIT) * BH) + 0.02, FZ0 + d[1] * P); hoverMark.visible = true;
    } else { hover = { t: 'mod', i: h.object.userData.mod }; hoverMod = hover.i; }
  }
  function cursorText() {
    if (hover && hover.t === 'mod') { const m = MODS[hover.i]; return m.code + ' · ' + m.name.toUpperCase() + TX.seeSheet; }
    if (hover) return dayText(hover.w, hover.d) + ' · ' + hover.c + (hover.c === 1 ? TX.contrib1 : TX.contribN);
    if (floorOK) return 'x ' + pad4(hitP.x * 10) + ' · y ' + pad4(-hitP.z * 10);
    return 'x ' + pad4(pmx) + ' · y ' + pad4(pmy);
  }

  /* ---- post: bloom on hairlines + grain/vignette + output ---- */
  const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: LOW ? 0 : 4 });
  const composer = new EffectComposer(renderer, rt);
  composer.setPixelRatio(DPR); composer.setSize(W, H);
  composer.addPass(new RenderPass(scene, camera));
  const BLOOM = LOW ? 0.38 : 0.46;
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), BLOOM * PAL().bloom, 0.32, 0.3); composer.addPass(bloom);
  const grainPass = new ShaderPass(GRAIN); composer.addPass(grainPass);
  composer.addPass(new OutputPass());

  /* ---- loop ---- */
  let running = false, frameN = 0;
  const camRead = $('#tbCam'), rulerMark = $('#rulerMark');
  function setDraw(v) { drawT = v; drawMats.forEach(m => { m.uniforms.uDraw.value = v; }); }
  function frame(dt) {
    if (!running || document.hidden) return;
    dt = Math.min(Math.max(dt, 0.001), 0.05); T += dt; frameN++;
    updateCamera(dt);
    if (frameN % 2 === 0) pick();
    updateAgents(dt); updateBricks(); updateMods(dt);
    gridMat.uniforms.uCam.value.copy(camera.position);
    matFlow.uniforms.uTime.value = T; grainPass.uniforms.uTime.value = T;
    updateLabels();
    if (frameN % 6 === 0) {
      camRead.textContent = 'x ' + pad4(camera.position.x * 10) + ' · y ' + pad4(-camera.position.z * 10) + ' · z ' + pad4(camera.position.y * 10);
      rulerMark.style.top = (sp.p * 100).toFixed(2) + '%';
    }
    composer.render(dt);
  }
  function renderStill() {
    setDraw(1); timeStarted = true; timeT = 1; matTime.uniforms.uDraw.value = 1;
    mods.forEach(V => { V.b = 1; V.state = 2; });
    if (calState !== 2) { bricks.count = NB; calState = 1; calT0 = T - 999; updateBricks(); }
    updateMods(1);
    ct.set(6, 0, 10); cp.set(-6, 96, 104); tmp.subVectors(cp, ct).multiplyScalar(distMul); cp.copy(ct).add(tmp);
    camera.position.copy(cp); camera.lookAt(ct);
    snap = true; updateAgents(0.016); snap = false;
    camera.setViewOffset(W, H, W >= 900 ? (chapterNow === 4 ? 0.2 : -0.2) * W : 0, W >= 900 ? 0 : 0.2 * H, W, H); // keep the still frame clear of the panel side
    gridMat.uniforms.uCam.value.copy(camera.position);
    updateLabels(true); composer.render(0.016);
    camRead.textContent = "x " + pad4(camera.position.x * 10) + " · y " + pad4(-camera.position.z * 10) + " · z " + pad4(camera.position.y * 10);
  }
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    renderer.setSize(W, H, false); composer.setSize(W, H); lens();
    LBL.forEach(l => { l.w = undefined; });
    measure();
    if (!MOTION && root.classList.contains('gl-on') && !is2D()) renderStill();
  }
  let rz = 0;
  window.addEventListener('resize', () => { window.cancelAnimationFrame(rz); rz = window.requestAnimationFrame(resize); });
  lens(); measure(); setDraw(0); refreshPick();
  function start() {
    root.classList.add('gl-on');
    resize();
    if (!MOTION) { running = false; renderStill(); return; }
    running = true;
    if (HAS_GSAP) ScrollTrigger.refresh();
  }
  function stop() { running = false; root.classList.remove('gl-on'); }
  function retheme() {
    const P = PAL();
    tints.forEach(([c, key, mul]) => c.set(P[key]).multiplyScalar(mul));
    renderer.setClearColor(P.ink, 1); scene.background.set(P.ink);
    paintBricks(); bloom.strength = BLOOM * P.bloom;
    if (!running && root.classList.contains('gl-on') && !is2D()) renderStill();
  }
  if (window.PLANTA_TEMA) window.PLANTA_TEMA.on(retheme);
  return {
    frame, start, stop, build, setDraw, cursorText,
    setChapter(i) { chapterNow = i; if (!MOTION && root.classList.contains("gl-on") && !is2D()) renderStill(); },
    setMethod(k, who) { if (k >= 0) methodOn = k; else if (methodOn === who) methodOn = -1; },
    highlight(i) { sheetMod = i; },
    hoverTarget() { return hover && hover.t === 'mod' ? MODS[hover.i].id : null; },
    get running() { return running; }
  };
}

/* ---------- boot ---------- */
if (!is2D()) { startLenis(); initGL(); }
