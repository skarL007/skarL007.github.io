/* Case study: Nexo Assist. The architecture drawn as a 3D blueprint (three.js), with a 2D plan
   built from the same model for the 2D mode, browsers without WebGL and the reduced-motion case. */
const root = document.documentElement;

/* ---------- language: every string the script writes comes from here ---------- */
const LANG = /^en/i.test(root.lang || '') ? 'en' : 'pt';
const TX = {
  pt: {
    no3d: '3D indisponível neste navegador',
    hud: 'Planta N-02 · ',
    hudDrag: ' · arraste para girar',
    planAria: 'Planta 2D da arquitetura do Nexo Assist',
    p2: {
      domain: ['domain/', 'regras puras'], application: ['application/', ''], app: ['app/ · server/', 'rotas · sessão'],
      agent: ['agent/', 'Mastra · 10 tools'], infra: ['infrastructure/', 'Drizzle · portas'], gemini: ['Gemini 3.5 Flash', ''],
      lite: ['Flash Lite', 'reserva'], db: ['libSQL · Turso', ''], legacy: ['legado simulado', ''], chat: ['Chat do funcionário', 'NDJSON · SSE'],
      console: ['Console do analista', 'SSE · RTK Query'], otel: ['OTel · Langfuse', ''], sso: ['SSO OIDC', ''], git: ['git · main', ''],
      vercel: ['Vercel + Turso', 'produção'], circle: ['CircleCI', ''], hub: ['Docker Hub', ''], komodo: ['Komodo', ''],
    },
    n: {
      domain: ['domain/', 'regras puras do service desk'],
      application: ['application/', 'casos de uso + portas'],
      app: ['app/ · server/', 'rotas, sessão JWT, proxy.ts'],
      agent: ['agent/', 'Mastra · 10 tools'],
      infra: ['infrastructure/', 'Drizzle, repositórios, telemetria'],
      gemini: ['Gemini 3.5 Flash', 'modelo principal'],
      lite: ['Gemini 3.5 Flash Lite', 'reserva'],
      db: ['libSQL', 'SQLite local · Turso no deploy'],
      legacy: ['legado simulado', 'falha 15% · retry'],
      chat: ['Chat do funcionário', 'Redux · stream NDJSON'],
      console: ['Console do analista', 'RTK Query · SSE'],
      otel: ['OpenTelemetry · Langfuse', 'opcional'],
      sso: ['SSO OpenID Connect', 'opcional'],
      git: ['git · main', ''],
      vercel: ['Vercel + Turso', 'produção, no ar'],
      circle: ['CircleCI', 'checks · e2e · imagem'],
      hub: ['Docker Hub', 'latest + sha'],
      komodo: ['Komodo', 'auto_update'],
    },
    e: {
      chat: 'NDJSON · SSE', console: 'SSE · polling reserva', model: 'passo 0 forçado',
      fallback: '503 → reserva', emb: 'embeddings', ports: 'implementa as portas',
      deploy: 'git archive', notRun: 'rodando · pull a cada 10 min', otel: 'spans GenAI', sso: 'PKCE · JWKS'
    }
  },
  en: {
    no3d: '3D is not available in this browser',
    hud: 'Sheet N-02 · ',
    hudDrag: ' · drag to rotate',
    planAria: '2D plan of the Nexo Assist architecture',
    p2: {
      domain: ['domain/', 'pure rules'], application: ['application/', ''], app: ['app/ · server/', 'routes · session'],
      agent: ['agent/', 'Mastra · 10 tools'], infra: ['infrastructure/', 'Drizzle · ports'], gemini: ['Gemini 3.5 Flash', ''],
      lite: ['Flash Lite', 'fallback'], db: ['libSQL · Turso', ''], legacy: ['simulated legacy', ''], chat: ['Employee chat', 'NDJSON · SSE'],
      console: ['Analyst console', 'SSE · RTK Query'], otel: ['OTel · Langfuse', ''], sso: ['OIDC SSO', ''], git: ['git · main', ''],
      vercel: ['Vercel + Turso', 'production'], circle: ['CircleCI', ''], hub: ['Docker Hub', ''], komodo: ['Komodo', ''],
    },
    n: {
      domain: ['domain/', 'pure service-desk rules'],
      application: ['application/', 'use cases + ports'],
      app: ['app/ · server/', 'routes, JWT session, proxy.ts'],
      agent: ['agent/', 'Mastra · 10 tools'],
      infra: ['infrastructure/', 'Drizzle, repositories, telemetry'],
      gemini: ['Gemini 3.5 Flash', 'main model'],
      lite: ['Gemini 3.5 Flash Lite', 'fallback'],
      db: ['libSQL', 'local SQLite · Turso when deployed'],
      legacy: ['simulated legacy', 'fails 15% · retry'],
      chat: ['Employee chat', 'Redux · NDJSON stream'],
      console: ['Analyst console', 'RTK Query · SSE'],
      otel: ['OpenTelemetry · Langfuse', 'optional'],
      sso: ['OpenID Connect SSO', 'optional'],
      git: ['git · main', ''],
      vercel: ['Vercel + Turso', 'production, live'],
      circle: ['CircleCI', 'checks · e2e · image'],
      hub: ['Docker Hub', 'latest + sha'],
      komodo: ['Komodo', 'auto_update'],
    },
    e: {
      chat: 'NDJSON · SSE', console: 'SSE · polling fallback', model: 'step 0 forced',
      fallback: '503 → fallback', emb: 'embeddings', ports: 'implements the ports',
      deploy: 'git archive', notRun: 'running · pulls every 10 min', otel: 'GenAI spans', sso: 'PKCE · JWKS'
    }
  }
}[LANG];

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const mq = q => (window.matchMedia ? window.matchMedia(q).matches : false);
const RM = mq('(prefers-reduced-motion: reduce)');
if (RM) root.classList.add('rm');
const KEY = 'planta-viva:modo';
const pref = {
  get() { try { return window.localStorage.getItem(KEY); } catch (e) { return null; } },
  set(v) { try { window.localStorage.setItem(KEY, v); } catch (e) { /* storage blocked */ } }
};
const is2D = () => root.classList.contains('mode-2d');
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/* ---------- the model: one source for the 3D view and the 2D plan ----------
   x to the right, z towards the viewer, y up. g = the steps (1..6) that focus the node.
   tone: plan | bright | accent | dash (optional). tier: 1 always labelled,
   2 labelled in the overview on wide screens, 3 only when its step is open. */
const TOOLS = ['recordUnderstanding', 'searchHelpCenter', 'listMyTickets', 'getTicket', 'draftNewTicket', 'draftTicketUpdate', 'confirmDraft', 'cancelDraft', 'offerQuickReplies', 'transferToAnalyst'];
const NODES = [
  { id: 'application', x: 0, z: 0, w: 26, d: 16, y: 1.2, h: 1.2, tone: 'plan', g: [1, 3], tier: 1 },
  { id: 'domain', x: 0, z: 0, w: 14, d: 8, y: 2.4, h: 1.4, tone: 'bright', g: [1], tier: 1 },
  { id: 'app', x: -25, z: 0, w: 14, d: 16, y: 0, h: 1.2, tone: 'plan', g: [1, 4, 6], tier: 1 },
  { id: 'agent', x: 0, z: -17, w: 26, d: 10, y: 0, h: 1.2, tone: 'accent', g: [1, 2], tier: 1 },
  { id: 'infra', x: 25, z: 0, w: 14, d: 16, y: 0, h: 1.2, tone: 'plan', g: [1, 3, 6], tier: 1 },
  { id: 'gemini', x: 4, z: -35, w: 14, d: 8, y: 0, h: 3.2, tone: 'accent', g: [2, 3], tier: 1 },
  { id: 'lite', x: -16, z: -35, w: 12, d: 7, y: 0, h: 2.2, tone: 'accent', g: [2], tier: 2 },
  { id: 'db', x: 47, z: 2, r: 6, y: 0, h: 5, tone: 'plan', g: [3], tier: 1, cyl: true },
  { id: 'legacy', x: 41, z: -14, w: 10, d: 6, y: 0, h: 1.2, tone: 'plan', g: [3], tier: 2 },
  { id: 'chat', x: -52, z: -8, w: 14, d: 8, y: 0, h: 2, tone: 'plan', g: [4], tier: 1 },
  { id: 'console', x: -52, z: 9, w: 14, d: 8, y: 0, h: 2, tone: 'plan', g: [4], tier: 1 },
  { id: 'otel', x: 45, z: 19, w: 16, d: 7, y: 0, h: 1.2, tone: 'dash', g: [6], tier: 2 },
  { id: 'sso', x: -25, z: 20, w: 14, d: 7, y: 0, h: 1.2, tone: 'dash', g: [6], tier: 2 },
  { id: 'git', x: -52, z: 40, w: 12, d: 7, y: 0, h: 1, tone: 'plan', g: [5], tier: 2 },
  { id: 'vercel', x: -30, z: 53, w: 16, d: 8, y: 0, h: 2.4, tone: 'bright', g: [5], tier: 1 },
  { id: 'circle', x: -28, z: 40, w: 12, d: 7, y: 0, h: 1.2, tone: 'plan', g: [5], tier: 2 },
  { id: 'hub', x: -4, z: 40, w: 12, d: 7, y: 0, h: 1.2, tone: 'plan', g: [5], tier: 2 },
  { id: 'komodo', x: 20, z: 40, w: 12, d: 7, y: 0, h: 1.2, tone: 'plan', g: [5], tier: 2 },
];
TOOLS.forEach((t, i) => NODES.push({ id: 'tool' + i, tool: t, x: -10.4 + (i % 5) * 5.2, z: i < 5 ? -19.6 : -14.4, w: 4, d: 3.4, y: 1.2, h: 0.7, tone: 'accent', g: [2], tier: 3 }));
const NODE = Object.fromEntries(NODES.map(n => [n.id, n]));
/* edges: points on the floor plan [x, z] at height y; kind: dep (dependency, arrow inwards), flow, dash; label = TX.e key */
const EDGES = [
  { p: [[-18, 0], [-13, 0]], y: 0.6, kind: 'dep', g: [1] },
  { p: [[0, -12], [0, -8]], y: 0.6, kind: 'dep', g: [1, 2] },
  { p: [[18, 0], [13, 0]], y: 0.6, kind: 'dep', g: [1, 3], label: 'ports', lx: 15.5, lz: 3.2 },
  { p: [[-11, -4], [-7, -2.2]], y: 2.45, kind: 'dep', g: [1] },
  { p: [[11, 4], [7, 2.2]], y: 2.45, kind: 'dep', g: [1] },
  { p: [[-45, -8], [-32, -4]], y: 1, kind: 'flow', g: [4], label: 'chat', both: true },
  { p: [[-45, 9], [-32, 4]], y: 1, kind: 'flow', g: [4], label: 'console', both: true },
  { p: [[2, -22], [2, -31]], y: 0.6, kind: 'flow', tone: 'accent', g: [2], label: 'model', both: true },
  { p: [[-3, -35], [-10, -35]], y: 1.1, kind: 'dash', tone: 'accent', g: [2], label: 'fallback' },
  { p: [[25, -8], [25, -35], [11, -35]], y: 0.6, kind: 'flow', g: [3], label: 'emb', lx: 25, lz: -26 },
  { p: [[32, -4], [36, -10]], y: 0.6, kind: 'flow', g: [3] },
  { p: [[46, -11], [47, -4]], y: 0.6, kind: 'flow', g: [3] },
  { p: [[32, 3], [41, 3]], y: 0.6, kind: 'flow', g: [3] },
  { p: [[30, 8], [40, 15.5]], y: 0.6, kind: 'dash', g: [6], label: 'otel' },
  { p: [[-25, 16.5], [-25, 8]], y: 0.6, kind: 'dash', g: [6], label: 'sso' },
  { p: [[-52, 43.5], [-52, 53], [-38, 53]], y: 0.5, kind: 'flow', g: [5], label: 'deploy', lx: -52, lz: 48.5 },
  { p: [[-46, 40], [-34, 40]], y: 0.6, kind: 'flow', g: [5] },
  { p: [[-22, 40], [-10, 40]], y: 0.6, kind: 'flow', g: [5] },
  { p: [[2, 40], [14, 40]], y: 0.6, kind: 'flow', g: [5] },
];
const NOTES = [{ key: 'notRun', x: -4, z: 46, g: [5] }];
const STEP_N = 7;
const ALL = [0, 1, 2, 3, 4, 5, 6];
const inStep = (g, s) => s === 0 || g.indexOf(s) >= 0;

/* ---------- steps (the list next to the drawing) ---------- */
const archEl = $('#arch');
const items = $$('#archSteps li');
let step = 0;
const listeners = [];
function setStep(k) {
  if (k === step || k < 0 || k >= STEP_N) return;
  step = k;
  items.forEach((li, i) => { li.classList.toggle('on', i === k); $('button', li).setAttribute('aria-pressed', String(i === k)); });
  listeners.forEach(f => f(k));
}
items.forEach((li, i) => {
  li.classList.toggle('on', i === 0);
  $('button', li).addEventListener('click', () => setStep(i));
});
/* on narrow screens the drawing sticks to the top and the steps scroll under it */
if (items.length && 'IntersectionObserver' in window && mq('(max-width: 860px)')) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setStep(items.indexOf(e.target)); }), { rootMargin: '-62% 0px -26% 0px' });
  items.forEach(li => io.observe(li));
}

/* ---------- header: menu and the 2D toggle (shared with the home page) ---------- */
const menuBtn = $('#menuBtn');
function closeMenu() { root.classList.remove('nav-open'); menuBtn.setAttribute('aria-expanded', 'false'); }
menuBtn.addEventListener('click', () => { const o = !root.classList.contains('nav-open'); root.classList.toggle('nav-open', o); menuBtn.setAttribute('aria-expanded', String(o)); });
window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
$$('#nav a').forEach(a => a.addEventListener('click', closeMenu));
const btn2d = $('#mode2d');
btn2d.setAttribute('aria-pressed', String(is2D()));
let GL = null, glLoading = false, glFailed = false;
function setMode(two, persist) {
  root.classList.toggle('mode-2d', two);
  btn2d.setAttribute('aria-pressed', String(two));
  if (persist) pref.set(two ? '2d' : '3d');
  if (two) { buildPlan(); if (GL) GL.stop(); }
  else if (GL) GL.start(); else initGL();
}
btn2d.addEventListener('click', () => { if (!glFailed) setMode(!is2D(), true); });

/* ---------- video chapters: jump to a time ---------- */
const video = $('#demo');
$$('[data-t]').forEach(b => b.addEventListener('click', () => {
  if (!video) return;
  video.preload = 'auto';
  const go = () => { try { video.currentTime = +b.dataset.t; } catch (e) { /* not seekable yet */ } video.play().catch(() => {}); };
  if (video.readyState >= 1) go(); else { video.addEventListener('loadedmetadata', go, { once: true }); video.load(); }
  video.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' });
}));

/* ---------- 2D plan (SVG): the same nodes and steps, laid out flat so every name stays readable ---------- */
/* [cx, cy, w, h] on a 160 × 122 sheet; db is a circle [cx, cy, r] */
const P2 = {
  gemini: [101, 8, 30, 9], lite: [51, 8, 28, 9], agent: [101, 25, 38, 11],
  application: [101, 52, 42, 27], domain: [101, 57, 26, 11], app: [60, 52, 24, 27], infra: [142, 52, 30, 27],
  chat: [20, 42, 34, 11], console: [20, 62, 34, 11], sso: [60, 77, 24, 8], otel: [104, 81, 30, 8],
  legacy: [142, 78, 30, 9], db: [142, 99, 8], vercel: [20, 92, 32, 10],
  git: [14, 111, 20, 8], circle: [44, 111, 22, 8], hub: [72, 111, 24, 8], komodo: [101, 111, 24, 8],
};
/* [from, to, kind, label, both, points]: points override the straight line between the two boxes */
const E2 = [
  ['chat', 'app', 'flow', null, true], ['console', 'app', 'flow', null, true],
  ['app', 'application', 'dep'], ['agent', 'application', 'dep'], ['infra', 'application', 'dep'],
  ['agent', 'gemini', 'accent', null, true], ['gemini', 'lite', 'dash-a', 'fallback'],
  ['infra', 'legacy', 'flow'], ['legacy', 'db', 'flow'],
  ['infra', 'gemini', 'flow', 'emb', false, [[150, 38.5], [150, 8], [116, 8]]],
  ['infra', 'otel', 'dash', null, false, [[134, 65.5], [134, 81], [119, 81]]],
  ['sso', 'app', 'dash', 'sso'], ['git', 'vercel', 'flow', 'deploy'],
  ['git', 'circle', 'flow'], ['circle', 'hub', 'flow'], ['hub', 'komodo', 'flow'],
];
let planBuilt = false;
const SVGNS = 'http://www.w3.org/2000/svg';
function buildPlan() {
  const host = $('#archPlan');
  if (planBuilt || !host) return;
  planBuilt = true;
  const el = (tag, at, parent) => { const n = document.createElementNS(SVGNS, tag); for (const k in at) n.setAttribute(k, at[k]); if (parent) parent.appendChild(n); return n; };
  const svg = el('svg', { viewBox: '-2 -1 164 124', role: 'img', 'aria-label': TX.planAria, preserveAspectRatio: 'xMidYMid meet' });
  const defs = el('defs', {}, svg);
  [['ar', '--bright'], ['ar-a', '--accent'], ['ar-p', '--plan'], ['ar-d', '--fg-2']].forEach(([id, c]) => {
    const m = el('marker', { id, viewBox: '0 0 6 6', refX: 5, refY: 3, markerWidth: 4, markerHeight: 4, orient: 'auto-start-reverse' }, defs);
    el('path', { d: 'M0,0 L6,3 L0,6 z', style: 'fill:var(' + c + ')' }, m);
  });
  const groups = [];
  const G = gs => { const g = el('g', {}, svg); groups.push([g, gs]); return g; };
  /* where the line from a box's centre towards (tx, ty) leaves the box */
  const exit = (id, tx, ty) => {
    const b = P2[id], dx = tx - b[0], dy = ty - b[1];
    if (b.length === 3) { const l = Math.hypot(dx, dy) || 1; return [b[0] + dx / l * b[2], b[1] + dy / l * b[2]]; }
    const s = Math.min(Math.abs(b[2] / 2 / (dx || 1e-9)), Math.abs(b[3] / 2 / (dy || 1e-9)));
    return [b[0] + dx * s, b[1] + dy * s];
  };
  E2.forEach(([a, b, kind, lab, both, pts]) => {
    const shared = NODE[a].g.filter(s => NODE[b].g.indexOf(s) >= 0);
    const g = G(kind === 'dep' ? [1] : shared.length ? shared : NODE[b].g);
    let P = pts;
    if (!P) { const A = P2[a], B = P2[b]; P = [exit(a, B[0], B[1]), exit(b, A[0], A[1])]; }
    const tone = kind === 'dep' ? 't-dep' : kind === 'dash' ? 't-dash' : kind === 'accent' ? 't-accent' : kind === 'dash-a' ? 't-dash t-accent' : '';
    const mk = kind === 'dep' ? 'ar' : kind === 'accent' || kind === 'dash-a' ? 'ar-a' : kind === 'dash' ? 'ar-d' : 'ar-p';
    const at = { class: 'pl-edge ' + tone, points: P.map(p => p.map(n => n.toFixed(2)).join(',')).join(' '), 'marker-end': 'url(#' + mk + ')' };
    if (both) at['marker-start'] = 'url(#' + mk + ')';
    el('polyline', at, g);
    if (lab) {
      const m = P.length > 2 ? P[1] : [(P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2];
      const vertical = P.length === 2 && Math.abs(P[0][0] - P[1][0]) < 0.5;
      const t = el('text', { class: 'pl-etxt', x: m[0] + (vertical ? 1.2 : 0), y: m[1] + (vertical ? 0.6 : -1), 'text-anchor': vertical ? 'start' : 'middle' }, g);
      t.textContent = TX.e[lab];
    }
  });
  NODES.forEach(n => {
    const b = P2[n.id]; if (!b) return;
    const g = G(n.g);
    const cls = 'pl-box t-' + n.tone;
    if (b.length === 3) el('circle', { class: cls, cx: b[0], cy: b[1], r: b[2] }, g);
    else el('rect', { class: cls, x: b[0] - b[2] / 2, y: b[1] - b[3] / 2, width: b[2], height: b[3] }, g);
    const [name, sub] = TX.p2[n.id];
    let y = n.id === 'application' ? b[1] - b[3] / 2 + 3.6 : b[1] + (sub ? -0.4 : 0.9);
    if (b.length === 3) y = b[1] + b[2] + 3.2;
    const t = el('text', { class: 'pl-txt', x: b[0], y, 'text-anchor': 'middle' }, g); t.textContent = name;
    if (sub) { const s = el('text', { class: 'pl-sub', x: b[0], y: y + 2.7, 'text-anchor': 'middle' }, g); s.textContent = sub; }
  });
  const ng = G([5]);
  const nt = el('text', { class: 'pl-etxt', x: 58, y: 119.8, 'text-anchor': 'middle' }, ng); nt.textContent = TX.e.notRun;
  host.appendChild(svg);
  const paint = k => groups.forEach(([g, gs]) => g.classList.toggle('dim', !inStep(gs, k)));
  paint(step); listeners.push(paint);
}

/* ---------- WebGL (progressive enhancement) ---------- */
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
  root.classList.add('no-gl', 'mode-2d');
  btn2d.setAttribute('aria-pressed', 'true'); btn2d.disabled = true; btn2d.title = TX.no3d;
  buildPlan();
}
async function initGL() {
  if (GL || glLoading || glFailed || !archEl) return;
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
  try { GL = createView(mods); } catch (e) { console.warn(e); failGL(); return; }
  glLoading = false;
  if (is2D()) GL.stop(); else GL.start();
}

/* film grain + vignette, the same pass the home page uses */
const GRAIN = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uGrain: { value: 1 }, uVig: { value: 0.32 } },
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

function createView([THREE, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { ShaderPass }, { OutputPass }]) {
  const view = $('#archView'), canvas = $('#archGl'), labelsEl = $('#archLabels'), hud = $('#archHud');
  let W = view.clientWidth, H = view.clientHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H, false);
  /* the plan's colours (the CSS side holds the same values as custom properties in site.css) */
  const PAL = { ink: '#050B16', plan: '#6A9FCC', bright: '#D8EEFF', accent: '#FF6A2B', dash: '#BFD2E6', grid: '#4F7FAD', flow: '#A7DBFF' };
  const tint = (key, c) => c.set(PAL[key]);
  renderer.setClearColor(PAL.ink, 1);
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); stop(); failGL(); }, false);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(PAL.ink, 260, 520); // far enough that the plan keeps its full contrast
  scene.background = new THREE.Color(PAL.ink); // the composer's render target needs the clear colour as a scene background, or it comes out washed
  const camera = new THREE.PerspectiveCamera(36, W / H, 0.5, 900);
  /* post: a soft bloom on the lit hairlines, then grain and vignette */
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 }));
  composer.setPixelRatio(DPR); composer.setSize(W, H);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.32, 0.25, 0.62); composer.addPass(bloom);
  const grainPass = new ShaderPass(GRAIN); composer.addPass(grainPass);
  composer.addPass(new OutputPass());

  /* drafting floor (one material colour instead of GridHelper's vertex colours, so it can be repainted) */
  const g1 = new THREE.GridHelper(240, 48);
  g1.material.vertexColors = false; tint('grid', g1.material.color);
  g1.material.transparent = true; g1.material.opacity = 0.16; g1.position.y = -0.02; scene.add(g1);
  const g2 = new THREE.GridHelper(240, 240);
  g2.material.vertexColors = false; tint('grid', g2.material.color);
  g2.material.transparent = true; g2.material.opacity = 0.05; g2.position.y = -0.03; scene.add(g2);

  const parts = []; // { obj, mats: [mat, baseOpacity], g, node }
  function track(obj, mats, g, extra) { const p = Object.assign({ obj, mats, g, k: 1 }, extra || {}); parts.push(p); return p; }
  function lineMat(key, opacity, dashed) {
    const m = dashed ? new THREE.LineDashedMaterial({ transparent: true, opacity, dashSize: 0.9, gapSize: 0.7, depthWrite: false })
      : new THREE.LineBasicMaterial({ transparent: true, opacity, depthWrite: false });
    tint(key, m.color); return m;
  }

  /* nodes: hairline edges + a faint glass fill. A box is assembled like the home's blocks: the floor outline
     is traced, the corner posts rise, the roof drops into place with a small settle, then the glass fades in */
  const rectPts = (hw, hd, y) => [-hw, y, -hd, hw, y, -hd, hw, y, -hd, hw, y, hd, hw, y, hd, -hw, y, hd, -hw, y, hd, -hw, y, -hd];
  const segGeo = pts => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); return g; };
  NODES.forEach((n, i) => {
    const col = n.tone;
    const geo = n.cyl ? new THREE.CylinderGeometry(n.r, n.r, n.h, 40, 1, true) : new THREE.BoxGeometry(n.w, n.h, n.d);
    const grp = new THREE.Group();
    const em = lineMat(col, n.tone === 'dash' ? 0.9 : 1, n.tone === 'dash');
    const fm = new THREE.MeshBasicMaterial({ transparent: true, opacity: n.tone === 'dash' ? 0.04 : n.tool ? 0.2 : 0.11, depthWrite: false, side: THREE.DoubleSide });
    tint(col, fm.color);
    const fill = new THREE.Mesh(geo, fm);
    const dist = Math.hypot(n.x, n.z), extra = { node: n, fill, delay: n.tool ? 0.55 + i * 0.012 : dist / 90 };
    if (n.cyl) {
      const lines = new THREE.LineSegments(cylEdges(n.r, n.h), em);
      grp.add(fill, lines); extra.lines = lines;
    } else {
      const hw = n.w / 2, hd = n.d / 2, hh = n.h / 2;
      const floor = new THREE.LineSegments(segGeo(rectPts(hw, hd, -hh)), em);
      const posts = new THREE.LineSegments(segGeo([-hw, 0, -hd, -hw, n.h, -hd, hw, 0, -hd, hw, n.h, -hd, hw, 0, hd, hw, n.h, hd, -hw, 0, hd, -hw, n.h, hd]), em);
      const roof = new THREE.LineSegments(segGeo(rectPts(hw, hd, 0)), em);
      posts.position.y = -hh; roof.position.y = hh;
      [floor, posts, roof].forEach(l => { if (n.tone === 'dash') l.computeLineDistances(); grp.add(l); });
      grp.add(fill);
      Object.assign(extra, { floor, posts, roof });
    }
    grp.position.set(n.x, n.y + n.h / 2, n.z);
    scene.add(grp);
    track(grp, [[em, em.opacity], [fm, fm.opacity]], n.g, extra);
  });
  const settle = t => { const c1 = 1.70158, x = t - 1; return 1 + (c1 + 1) * x * x * x + c1 * x * x; };
  /* one box at build progress u (0 → 1 over about 1.2 s) */
  function assemble(p, u) {
    const n = p.node;
    if (!p.floor) { const g = ease(u / 0.8); p.obj.scale.y = Math.max(0.001, g); p.obj.position.y = n.y + n.h * g / 2; return clamp((u - 0.6) / 0.4, 0, 1); }
    const tr = clamp(u / 0.28, 0, 1);
    p.floor.geometry.setDrawRange(0, tr >= 1 ? Infinity : Math.ceil(4 * tr) * 2);
    p.floor.visible = tr > 0;
    const pu = ease(clamp((u - 0.22) / 0.3, 0, 1));
    p.posts.scale.y = Math.max(0.001, pu); p.posts.visible = pu > 0;
    const ru = clamp((u - 0.5) / 0.3, 0, 1);
    p.roof.visible = ru > 0; p.roof.position.y = n.h / 2 + (1 - settle(ru)) * Math.min(4, 1.2 + n.h * 0.4);
    return clamp((u - 0.72) / 0.28, 0, 1);
  }
  function cylEdges(r, h) {
    const pts = [], N = 40;
    for (const y of [-h / 2, h / 2, h / 2 - 0.9]) for (let i = 0; i < N; i++) {
      const a = i / N * Math.PI * 2, b = (i + 1) / N * Math.PI * 2;
      pts.push(Math.cos(a) * r, y, Math.sin(a) * r, Math.cos(b) * r, y, Math.sin(b) * r);
    }
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; pts.push(Math.cos(a) * r, -h / 2, Math.sin(a) * r, Math.cos(a) * r, h / 2, Math.sin(a) * r); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); return g;
  }

  /* edges with arrowheads; flows also carry a travelling pulse */
  const pulses = [];
  EDGES.forEach(e => {
    const col = e.kind === 'dep' ? 'bright' : e.tone === 'accent' ? 'accent' : e.kind === 'dash' ? 'dash' : 'plan';
    const pts = [];
    const P = e.p.map(([x, z]) => new THREE.Vector3(x, e.y, z));
    for (let i = 1; i < P.length; i++) pts.push(P[i - 1], P[i]);
    const head = (a, b) => {
      const d = new THREE.Vector3().subVectors(b, a).setY(0).normalize(), s = 1.3;
      const side = new THREE.Vector3(-d.z, 0, d.x);
      pts.push(b, b.clone().addScaledVector(d, -s).addScaledVector(side, s * 0.55));
      pts.push(b, b.clone().addScaledVector(d, -s).addScaledVector(side, -s * 0.55));
    };
    head(P[P.length - 2], P[P.length - 1]);
    if (e.both) head(P[1], P[0]);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const m = lineMat(col, e.kind === 'dep' ? 1 : 0.9, e.kind === 'dash');
    const ls = new THREE.LineSegments(geo, m);
    if (e.kind === 'dash') ls.computeLineDistances();
    scene.add(ls);
    track(ls, [[m, m.opacity]], e.g, { lines: ls, delay: 0.6 });
    if (e.kind === 'flow' && !RM) {
      let len = 0; const segs = [];
      for (let i = 1; i < P.length; i++) { const l = P[i].distanceTo(P[i - 1]); segs.push([P[i - 1], P[i], len, l]); len += l; }
      pulses.push({ segs, len, both: !!e.both, g: e.g, off: Math.random() });
    }
  });
  const pulseGeo = new THREE.BufferGeometry();
  const pulsePos = new Float32Array(Math.max(1, pulses.length * 2) * 3);
  pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));
  const pulseMat = new THREE.PointsMaterial({ size: 4.5, sizeAttenuation: false, transparent: true, opacity: 0.95, depthWrite: false });
  tint('flow', pulseMat.color);
  const pulsePts = new THREE.Points(pulseGeo, pulseMat); pulsePts.frustumCulled = false;
  if (pulses.length) scene.add(pulsePts);
  const at = (pl, t) => {
    const s = (t % 1) * pl.len;
    for (const [a, b, l0, l] of pl.segs) if (s <= l0 + l) return new THREE.Vector3().lerpVectors(a, b, (s - l0) / l);
    return pl.segs[pl.segs.length - 1][1];
  };

  /* labels (HTML over the canvas), hidden when they would collide */
  const labels = [];
  function label(text, sub, pos, cls, g, tier, pri) {
    const el = document.createElement('div');
    el.className = 'al ' + cls;
    const sp = document.createElement('span');
    sp.textContent = text;
    if (sub) { const em = document.createElement('em'); em.textContent = sub; sp.appendChild(em); }
    el.appendChild(sp); labelsEl.appendChild(el);
    labels.push({ el, sp, pos, g, tier, pri, w: 0, h: 0, a: 0, cls });
  }
  NODES.forEach(n => {
    // labels sit on the centre of the roof; application's is on its front rim (domain covers the centre), agent's on its back rim (the tools cover it)
    const az = n.id === 'application' ? n.z + n.d / 2 - 1.4 : n.id === 'agent' ? n.z - n.d / 2 : n.z;
    const top = new THREE.Vector3(n.x, n.y + n.h, az);
    if (n.tool) { label(n.tool, '', top, 't-tool', n.g, 3, 5); return; }
    const [name, sub] = TX.n[n.id];
    label(name, sub, top, 't-' + n.tone, n.g, n.tier, n.tier);
  });
  EDGES.forEach(e => {
    if (!e.label) return;
    const a = e.p[0], b = e.p[e.p.length - 1];
    label(TX.e[e.label], '', new THREE.Vector3(e.lx !== undefined ? e.lx : (a[0] + b[0]) / 2, e.y, e.lz !== undefined ? e.lz : (a[1] + b[1]) / 2), 't-edge', e.g, 3, 4);
  });
  NOTES.forEach(o => label(TX.e[o.key], '', new THREE.Vector3(o.x, 0.2, o.z), 't-note', o.g, 2, 3));
  labels.sort((p, q) => p.pri - q.pri);

  /* camera: frame the nodes of the current step */
  const DIR = { az: 0.42, el: 0.9 };
  const cam = { tx: 0, ty: 0, tz: 8, dist: 160 }, goal = { tx: 0, ty: 0, tz: 8, dist: 160 };
  let dragAz = 0, dragEl = 0, sway = 0;
  /* fit: project the corners of the step's nodes and correct target and distance a few times,
     leaving room above for the labels and below for the HUD line */
  const probe = new THREE.PerspectiveCamera();
  function frame(k) {
    const pts = [];
    NODES.forEach(n => {
      if (!inStep(n.g, k)) return;
      const hw = n.cyl ? n.r : n.w / 2, hd = n.cyl ? n.r : n.d / 2;
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) for (const y of [n.y, n.y + n.h + 2.5]) pts.push(new THREE.Vector3(n.x + sx * hw, y, n.z + sz * hd));
    });
    const box = new THREE.Box3().setFromPoints(pts), c = box.getCenter(new THREE.Vector3());
    const g = { tx: c.x, ty: 0, tz: c.z, dist: 160 };
    probe.fov = camera.fov; probe.aspect = camera.aspect; probe.near = camera.near; probe.far = camera.far; probe.updateProjectionMatrix();
    const vf = THREE.MathUtils.degToRad(camera.fov), hf = 2 * Math.atan(Math.tan(vf / 2) * camera.aspect);
    const az = DIR.az, el = DIR.el, right = new THREE.Vector3(Math.cos(az), 0, -Math.sin(az)), fwd = new THREE.Vector3(-Math.sin(az), 0, -Math.cos(az));
    const M = { x: 0.98, top: 0.88, bot: -0.9 }, v = new THREE.Vector3();
    for (let it = 0; it < 6; it++) {
      probe.position.set(g.tx + Math.sin(az) * Math.cos(el) * g.dist, Math.sin(el) * g.dist, g.tz + Math.cos(az) * Math.cos(el) * g.dist);
      probe.lookAt(g.tx, 0, g.tz); probe.updateMatrixWorld();
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      pts.forEach(p => { v.copy(p).project(probe); x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y); });
      const s = Math.max((x1 - x0) / (2 * M.x), (y1 - y0) / (M.top - M.bot));
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 - (M.top + M.bot) / 2;
      const hw = g.dist * Math.tan(hf / 2), hh = g.dist * Math.tan(vf / 2) / Math.sin(el);
      g.tx += right.x * cx * hw + fwd.x * cy * hh; g.tz += right.z * cx * hw + fwd.z * cy * hh;
      g.dist = clamp(g.dist * s, 24, 320);
    }
    Object.assign(goal, g);
  }
  function place() {
    const az = DIR.az + dragAz + sway, el = clamp(DIR.el + dragEl, 0.35, 1.35);
    camera.position.set(cam.tx + Math.sin(az) * Math.cos(el) * cam.dist, cam.ty + Math.sin(el) * cam.dist, cam.tz + Math.cos(az) * Math.cos(el) * cam.dist);
    camera.lookAt(cam.tx, cam.ty, cam.tz);
  }
  frame(0); Object.assign(cam, goal); place();
  listeners.push(k => { frame(k); if (RM) { Object.assign(cam, goal); requestDraw(); } hudText(); });
  function hudText() { hud.innerHTML = ''; const b = document.createElement('b'); b.textContent = items[step] ? $('button', items[step]).textContent.replace(/^\d+\s*/, '') : ''; hud.append(TX.hud, b, mq('(hover: hover) and (pointer: fine)') ? TX.hudDrag : ''); }
  hudText();

  /* mouse drag rotates a little; touch keeps scrolling the page */
  let drag = null;
  canvas.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; drag = { x: e.clientX, y: e.clientY, az: dragAz, el: dragEl }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => { if (!drag) return; dragAz = clamp(drag.az - (e.clientX - drag.x) * 0.006, -1.1, 1.1); dragEl = clamp(drag.el + (e.clientY - drag.y) * 0.004, -0.45, 0.5); requestDraw(); });
  const endDrag = () => { drag = null; };
  canvas.addEventListener('pointerup', endDrag); canvas.addEventListener('pointercancel', endDrag);

  /* build-up: inside out, the same direction the dependencies point */
  let born = RM ? 1e9 : -1, visible = false, running = false, raf = 0, last = 0, t = 0, dirty = true;
  const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && born < 0) born = 0; if (visible) loop(); }, { threshold: 0.05 });
  io.observe(view);
  function requestDraw() { dirty = true; loop(); }
  function loop() { if (!raf && running && visible) { last = performance.now(); raf = requestAnimationFrame(tick); } }
  const ease = x => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
  function tick(now) {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    if (born >= 0 && born < 1e9) born += dt;
    let moving = false;
    if (!RM) {
      for (const k of ['tx', 'ty', 'tz', 'dist']) { const d = goal[k] - cam[k]; if (Math.abs(d) > 0.01) { cam[k] += d * Math.min(1, dt * 3.2); moving = true; } }
      if (!drag) sway = Math.sin(t * 0.18) * 0.07;
    }
    place();
    parts.forEach(p => {
      const target = inStep(p.g, step) ? 1 : 0.2;
      p.k += RM ? target - p.k : (target - p.k) * Math.min(1, dt * 5);
      const fillK = p.node ? (RM ? 1 : assemble(p, clamp((born - p.delay) / 1.2, 0, 1))) : 1;
      const vis = p.node ? 1 : (RM ? 1 : ease((born - p.delay) / 0.7));
      p.mats.forEach(([m, base]) => { m.opacity = base * p.k * vis; });
      if (p.fill) p.fill.material.opacity *= fillK;
      // the connections are traced segment by segment (about 0.7 s)
      const tr = p.node ? 1 : RM ? 1 : ease((born - p.delay) / 0.75);
      if (p.lines && !p.node && p.tr !== tr) { p.tr = tr; const n = p.lines.geometry.attributes.position.count; p.lines.geometry.setDrawRange(0, tr >= 1 ? Infinity : Math.ceil(n * tr / 2) * 2); }
      if (Math.abs(target - p.k) > 0.01) moving = true;
    });
    if (!RM && born < 3.2) moving = true;
    if (pulses.length) {
      pulses.forEach((pl, i) => {
        const on = inStep(pl.g, step) && born > 1.2;
        const ph = t * 0.32 + pl.off;
        const a = on ? at(pl, ph) : new THREE.Vector3(0, -50, 0);
        pulsePos.set([a.x, a.y + 0.15, a.z], i * 6);
        const b = on && pl.both ? at(pl, 1 - ((ph + 0.5) % 1)) : new THREE.Vector3(0, -50, 0);
        pulsePos.set([b.x, b.y + 0.15, b.z], i * 6 + 3);
      });
      pulseGeo.attributes.position.needsUpdate = true;
      moving = true;
    }
    grainPass.uniforms.uTime.value = t;
    composer.render(dt);
    drawLabels(born);
    dirty = false;
    if (running && visible && (moving || !RM || drag)) { raf = requestAnimationFrame(tick); }
  }
  const v = new THREE.Vector3();
  function drawLabels(b) {
    const wide = W >= 640;
    const placed = [];
    labels.forEach(L => {
      // overview: tier 1 (and tier 2 when wide); an open step: everything in it
      let want = inStep(L.g, step) && (step !== 0 || L.tier === 1 || (wide && L.tier === 2));
      if (b < 0.9 && !RM) want = false;
      v.copy(L.pos).project(camera);
      if (v.z > 1) want = false;
      const ax = (v.x * 0.5 + 0.5) * W, y = (-v.y * 0.5 + 0.5) * H; let x = ax;
      if (want) {
        if (!L.w) { L.w = L.sp.offsetWidth; L.h = L.sp.offsetHeight; }
        const centered = L.cls === 't-edge' || L.cls === 't-note';
        // keep a label that runs past a side edge inside the frame, as long as its anchor is on screen
        if (x > 0 && x < W) x = clamp(x, L.w / 2 + 8, W - L.w / 2 - 8);
        const r = { x0: x - L.w / 2 - 2, x1: x + L.w / 2 + 2, y0: centered ? y - L.h / 2 - 1 : y - L.h - 17, y1: centered ? y + L.h / 2 + 1 : y + 3 };
        if (r.x0 < 4 || r.x1 > W - 4 || r.y0 < 4 || r.y1 > H - 22) want = false;
        else if (placed.some(q => r.x0 < q.x1 && r.x1 > q.x0 && r.y0 < q.y1 && r.y1 > q.y0)) want = false;
        else placed.push(r);
      }
      const a = want ? 1 : 0;
      if (a !== L.a) { L.a = a; L.el.style.opacity = String(a); }
      if (want) {
        // the box stays on its anchor (dot + leader line); only the text slides when it was kept inside the frame
        const centered = L.cls === 't-edge' || L.cls === 't-note', dx = centered ? 0 : Math.round(x - ax);
        L.el.style.transform = 'translate3d(' + Math.round(centered ? x : ax) + 'px,' + Math.round(y) + 'px,0)';
        if (dx !== L.dx) { L.dx = dx; L.sp.style.setProperty('--dx', dx + 'px'); }
      }
    });
  }
  function resize() {
    const w = view.clientWidth, h = view.clientHeight;
    if (!w || !h || (w === W && h === H)) return;
    W = w; H = h; renderer.setSize(W, H, false); composer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix();
    labels.forEach(L => { L.w = 0; });
    frame(step); Object.assign(cam, goal); requestDraw();
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(view); else window.addEventListener('resize', resize);
  camera.aspect = W / H; camera.updateProjectionMatrix(); frame(step); Object.assign(cam, goal);
  function start() { running = true; requestDraw(); }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
  return { start, stop };
}

/* ---------- boot ---------- */
if (archEl) {
  if (is2D()) buildPlan(); else initGL();
}
