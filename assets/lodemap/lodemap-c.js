/* Lodemap · landing nova. Histórias guiadas pela rolagem sobre o campo imersivo (lodemap-c-campo.js), mais pequenos acabamentos.
   Dados: window.LODEMAP_MAPA (lodemap-c-dados.js). Sem dados ou sem canvas, a página continua legível como texto. */
(function () {
  "use strict";
  var D = window.LODEMAP_MAPA, Campo = window.LodemapCampo;
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- histórias: painéis guiados pela rolagem ---------- */
  var stories = [];
  var rv = document.getElementById("rv"), rc = document.getElementById("rc");

  function Historia(root) {
    var cv = root.querySelector("canvas.map"), pns = [].slice.call(root.querySelectorAll(".pn")), runs = [].slice.call(root.querySelectorAll(".run")), act = -1;
    var mapa = new Campo(cv, { entrada: root.id === "story-1" });
    function go(i) {
      if (i === act) return; act = i;
      pns.forEach(function (p, k) {
        var on = k === i; p.classList.toggle("on", on);
        [].forEach.call(p.querySelectorAll("a,button"), function (a) { a.tabIndex = on ? 0 : -1; });
      });
      var p = pns[i]; mapa.set(parseInt(p.dataset.i, 10));
      if (rv && p.dataset.v) { rv.textContent = p.dataset.v; rc.textContent = p.dataset.c; }
    }
    this.update = function () {
      var m = innerHeight, k = 0; // o painel i entra quando a pista i chega à base da tela
      for (var i = 0; i < runs.length; i++) if (runs[i].getBoundingClientRect().top <= m) k = i;
      if (root.getBoundingClientRect().bottom < innerHeight * 0.6) k = runs.length - 1;
      go(Math.min(k, pns.length - 1));
    };
    this.visible = function () { var r = root.getBoundingClientRect(); return r.bottom > -200 && r.top < innerHeight + 200; };
    pns.forEach(function (p, k) { [].forEach.call(p.querySelectorAll("a,button"), function (a) { a.tabIndex = k === 0 ? 0 : -1; }); });
  }

  /* ---------- tema (botão), rolagem e rebuild ---------- */
  if (D && Campo) {
    [].forEach.call(document.querySelectorAll(".story"), function (r) { stories.push(new Historia(r)); });
    var tk = false;
    function tick() { stories.forEach(function (s) { if (s.visible()) s.update(); }); }
    addEventListener("scroll", function () { if (!tk) { tk = true; requestAnimationFrame(function () { tick(); tk = false; }); } }, { passive: true });
    var rz; addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(tick, 150); });
    tick();
  }

  /* ---------- letras que se embaralham ao passar o mouse (só com hover e sem reduzir movimento) ---------- */
  if (!RM && matchMedia("(hover:hover)").matches) {
    var G = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    [].forEach.call(document.querySelectorAll("[data-scr]"), function (a) {
      var tn = [].filter.call(a.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); })[0];
      if (!tn) return;
      var orig = tn.textContent, busy = false;
      if (!a.hasAttribute("aria-label")) a.setAttribute("aria-label", a.textContent.replace(/\s+/g, " ").trim());
      a.addEventListener("mouseenter", function () {
        if (busy) return; busy = true;
        var f = 0, N = orig.length, t = setInterval(function () {
          f++; var s = "";
          for (var i = 0; i < N; i++) { var c = orig[i]; s += (c === " " || i < f / 1.5) ? c : G[Math.floor(Math.random() * G.length)]; }
          tn.textContent = s;
          if (f > N * 1.5) { clearInterval(t); tn.textContent = orig; busy = false; }
        }, 28);
      });
    });
  }
})();
