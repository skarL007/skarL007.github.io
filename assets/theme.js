/* Colour themes. One table feeds both three.js scenes (site.js, case.js); the CSS side lives in
   site.css as custom properties under :root[data-tema]. The <head> of each page applies the saved
   theme before first paint; this file wires the header button and tells the scenes to repaint. */
(function () {
  var KEY = 'planta-viva:tema';
  var root = document.documentElement;
  /* plan: hairlines · dim: dimension and dashed lines · bright: volume edges · glass: volume fill
     accent: the agents · grid: drafting floor · dash: dashed boxes (case) · flow: pulses (case) */
  var PAL = {
    padrao: { ink: '#050B16', plan: '#6A9FCC', dim: '#41709A', bright: '#D8EEFF', glass: '#5EA8F0', accent: '#FF6A2B', grid: '#4F7FAD', dash: '#BFD2E6', flow: '#A7DBFF', tool: '#FFD2BF', bloom: 1 },
    matrix: { ink: '#010A04', plan: '#00A814', dim: '#008F11', bright: '#C2FFCF', glass: '#00C832', accent: '#00FF41', grid: '#0E8A22', dash: '#5FD879', flow: '#00FF41', tool: '#B8FFC8', bloom: 0.8 }
  };
  var subs = [];
  function get() { return root.getAttribute('data-tema') === 'matrix' ? 'matrix' : 'padrao'; }
  function set(name, persist) {
    name = PAL[name] ? name : 'padrao';
    if (name === 'matrix') root.setAttribute('data-tema', 'matrix'); else root.removeAttribute('data-tema');
    if (persist) { try { window.localStorage.setItem(KEY, name); } catch (e) { /* storage blocked */ } }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', PAL[name].ink);
    var b = document.getElementById('temaBtn');
    if (b) b.setAttribute('aria-pressed', String(name === 'matrix'));
    for (var i = 0; i < subs.length; i++) { try { subs[i](PAL[name], name); } catch (e) { /* a scene that failed keeps the old colours */ } }
  }
  window.PLANTA_TEMA = {
    PAL: PAL,
    get: get,
    pal: function () { return PAL[get()]; },
    set: set,
    on: function (fn) { subs.push(fn); }
  };
  set(get(), false);
  var btn = document.getElementById('temaBtn');
  if (btn) btn.addEventListener('click', function () { set(get() === 'matrix' ? 'padrao' : 'matrix', true); });
})();
