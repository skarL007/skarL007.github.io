/* Lodemap · landing nova. Mapa real do axios guiado pela rolagem, mais pequenos acabamentos.
   Dados: window.LODEMAP_MAPA (lodemap-c-dados.js). Sem dados, a página continua legível como texto. */
(function () {
  "use strict";
  var D = window.LODEMAP_MAPA;
  var NS = "http://www.w3.org/2000/svg";
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FLOW = [0, 4, 8, 5, 7, 10, 15, 9]; // ciclo de vida da requisição (Node.js), na ordem da demo
  var FLOWE = [[0, 4], [4, 8], [4, 5], [4, 7], [7, 10], [7, 15], [15, 9]];

  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function key(a, b) { return a + "-" + b; }
  var flowSet = {}; FLOWE.forEach(function (p) { flowSet[key(p[0], p[1])] = 1; });

  /* ---------- mapa ---------- */
  function Mapa(svg) {
    var self = this, port = false, nodes = [], edges = [], labs = [], bads = [], area = [];
    var state = -1, vb = [0, 0, 1, 1], raf = 0;
    this.svg = svg;

    function pos() { return port ? D.P : D.L; }
    function size() { return port ? D.PW : D.W; }

    this.build = function () {
      var ti = svg.querySelector("title");
      svg.innerHTML = ""; if (ti) svg.appendChild(ti);
      port = innerWidth <= 900;
      var P = pos(), W = size(), g = el("g", {}, svg), x, y;
      for (x = 100; x < W[0]; x += 100) for (y = 50; y < W[1]; y += 100) {
        el("line", { x1: x - 5, y1: y, x2: x + 5, y2: y, class: "cross" }, g);
        el("line", { x1: x, y1: y - 5, x2: x, y2: y + 5, class: "cross" }, g);
      }
      area = D.areas.map(function () { return { x: 0, y: 0, n: 0, t: 1e9 }; });
      D.nodes.forEach(function (n, i) { var a = area[n[1]]; a.x += P[i][0]; a.y += P[i][1]; a.n++; a.t = Math.min(a.t, P[i][1]); });
      if (!port) area.forEach(function (a, i) {
        var tx = el("text", { x: a.x / a.n, y: a.t - 18, "text-anchor": "middle", class: "ar" }, svg);
        tx.textContent = D.areas[i] + " · " + a.n;
      });
      edges = D.edges.map(function (e) {
        var a = P[e[0]], b = P[e[1]];
        return { el: el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: "e" }, svg), a: e[0], b: e[1], v: e[2] };
      });
      nodes = D.nodes.map(function (n, i) {
        var c = el("circle", { cx: P[i][0], cy: P[i][1], r: port ? 9 : 8, class: "n" }, svg);
        el("title", {}, c).textContent = n[0];
        return { el: c, first: n[2], i: i };
      });
      labs = D.nodes.map(function (n, i) { var t = el("text", { class: "nl", opacity: 0 }, svg); t.textContent = n[0]; return t; });
      bads = FLOW.map(function (i, k) { var t = el("text", { class: "nb", opacity: 0, x: P[i][0], y: P[i][1] }, svg); t.textContent = (k < 9 ? "0" : "") + (k + 1); return t; });
      vb = this.box(state); this.apply(vb);
      this.set(state);
    };

    /* quadro (viewBox) do estado: inteiro no desktop; no celular, recorte e zoom no que mudou */
    this.box = function (v) {
      var W = size(), P = pos(), full = [0, 0, W[0], W[1]];
      if (!port || v < 1) return full;
      var S = [], count = {};
      D.nodes.forEach(function (n, i) { if (n[2] === v) S.push(i); });
      D.edges.forEach(function (e) { if (e[2] === v) { S.push(e[0]); S.push(e[1]); } });
      if (!S.length) S = (D.changed[v] || []).slice();
      if (!S.length) return full;
      function bb(list) {
        var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
        list.forEach(function (i) { x0 = Math.min(x0, P[i][0]); x1 = Math.max(x1, P[i][0]); y0 = Math.min(y0, P[i][1]); y1 = Math.max(y1, P[i][1]); });
        return [x0, y0, x1 - x0, y1 - y0];
      }
      var b = bb(S);
      if (b[2] > W[0] * 0.62 || b[3] > W[1] * 0.62) { // espalhado demais: foca na área com mais mudanças
        S.forEach(function (i) { var a = D.nodes[i][1]; count[a] = (count[a] || 0) + 1; });
        var top = 0, best = -1; for (var a in count) if (count[a] > best) { best = count[a]; top = +a; }
        var inA = []; D.nodes.forEach(function (n, i) { if (n[1] === top && n[2] <= v) inA.push(i); });
        b = bb(inA);
      }
      return self.fit(b);
    };

    /* ajusta ao formato do elemento, com margem */
    this.fit = function (b) {
      var r = svg.getBoundingClientRect(), asp = (r.width || 375) / (r.height || 380), pad = 70;
      var w = Math.max(b[2] + pad * 2, 230), h = Math.max(b[3] + pad * 2, 200);
      if (w / h < asp) w = h * asp; else h = w / asp;
      var W = size(), cx = b[0] + b[2] / 2, cy = b[1] + b[3] / 2;
      var x = Math.min(Math.max(cx - w / 2, Math.min(0, W[0] - w)), Math.max(W[0] - w, 0));
      var y = Math.min(Math.max(cy - h / 2, Math.min(0, W[1] - h)), Math.max(W[1] - h, 0));
      return [x, y, w, h];
    };

    this.apply = function (b) {
      vb = b; svg.setAttribute("viewBox", b.map(function (n) { return Math.round(n * 10) / 10; }).join(" "));
      var r = svg.getBoundingClientRect(), sc = Math.min((r.width || 375) / b[2], (r.height || 380) / b[3]) || 1;
      svg.style.setProperty("--fs", (12.5 / sc).toFixed(2) + "px");
      svg.style.setProperty("--fw", (4 / sc).toFixed(2) + "px");
      nodes.forEach(function (n) { n.el.setAttribute("r", port ? (6.5 / sc).toFixed(2) : 8); });
      svg.style.setProperty("--cs", (1.5 / sc).toFixed(2) + "px");
    };

    this.tween = function (to) {
      cancelAnimationFrame(raf);
      if (RM) { this.apply(to); return; }
      var from = vb.slice(), t0 = performance.now(), dur = 800;
      (function step(t) {
        var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        self.apply(from.map(function (f, i) { return f + (to[i] - f) * e; }));
        if (k < 1) raf = requestAnimationFrame(step);
      })(t0);
    };

    /* quebra o nome em linhas curtas (só no celular), para o rótulo caber ao lado do ponto */
    function fill(t, name, x, y, maxc) {
      var words = name.split(" "), lines = [], cur = "";
      words.forEach(function (w) { if (cur && (cur + " " + w).length > maxc) { lines.push(cur); cur = w; } else cur = cur ? cur + " " + w : w; });
      lines.push(cur); t.textContent = "";
      lines.forEach(function (l, k) { el("tspan", { x: x, dy: k ? "1.15em" : (0.35 - (lines.length - 1) * 0.575) + "em" }, t).textContent = l; });
      t.setAttribute("y", y);
    }

    /* rótulos: nomes reais dos componentes novos; no celular, também os alterados que couberem no quadro */
    this.labels = function (b) {
      var v = state, P = pos(), flow = v === -2, show = {}, news = [], chg = [];
      nodes.forEach(function (n) {
        if (v >= 1 && n.first === v) news.push(n.i);
        else if (v >= 1 && port && b[2] < D.PW[0] * 0.75 && (D.changed[v] || []).indexOf(n.i) > -1 && n.first <= v && P[n.i][0] > b[0] + 30 && P[n.i][0] < b[0] + b[2] - 30 && P[n.i][1] > b[1] + 20 && P[n.i][1] < b[1] + b[3] - 20) chg.push(n.i);
      });
      news.forEach(function (i) { show[i] = 1; });
      if (news.length && news.length + chg.length <= 5) chg.forEach(function (i) { show[i] = 1; });
      nodes.forEach(function (n) {
        var i = n.i, t = labs[i];
        if (show[i]) {
          var end = P[i][0] - b[0] > b[2] * 0.5, x = P[i][0] + (end ? -1 : 1) * 12;
          t.setAttribute("text-anchor", end ? "end" : "start"); t.setAttribute("x", x);
          if (port) fill(t, D.nodes[i][0], x, P[i][1], 20); else { t.textContent = D.nodes[i][0]; t.setAttribute("y", P[i][1] + 4); }
        }
        t.setAttribute("opacity", show[i] ? 1 : 0);
        t.setAttribute("class", "nl" + (n.first === v && v >= 1 ? " nw" : ""));
      });
      bads.forEach(function (t, k) {
        var i = FLOW[k]; t.setAttribute("opacity", flow ? 1 : 0);
        t.setAttribute("x", P[i][0] + 11); t.setAttribute("y", P[i][1] - 9);
      });
    };

    this.set = function (v) {
      state = v;
      var ch = v >= 1 ? (D.changed[v] || []) : [], flow = v === -2;
      nodes.forEach(function (n) {
        var on = v < 0 || n.first <= v, nw = v >= 1 && n.first === v, f = flow && FLOW.indexOf(n.i) > -1;
        n.el.setAttribute("class", "n" + (on ? "" : " off") + (nw ? " new" : "") + (v >= 1 && !nw && ch.indexOf(n.i) > -1 ? " chg" : "") + (f ? " flo" : "") + (flow && !f ? " dim" : ""));
      });
      edges.forEach(function (e) {
        var f = flow && flowSet[key(e.a, e.b)];
        e.el.setAttribute("class", "e" + ((v < 0 || e.v <= v) ? "" : " off") + (v >= 1 && e.v === v ? " new" : "") + (f ? " flo" : "") + (flow && !f ? " dim" : ""));
      });
      var to = this.box(v);
      this.labels(to);
      if (port) this.tween(to); else this.apply(to);
    };
    this.state = function () { return state; };
    this.mode = function () { return port ? "p" : "l"; };
    this.build();
  }

  /* ---------- histórias: painéis guiados pela rolagem ---------- */
  var stories = [];
  var rv = document.getElementById("rv"), rc = document.getElementById("rc");

  function Historia(root) {
    var svg = root.querySelector("svg.map"), pns = [].slice.call(root.querySelectorAll(".pn")), runs = [].slice.call(root.querySelectorAll(".run")), act = -1;
    var mapa = new Mapa(svg);
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
    this.rebuild = function () { if ((innerWidth <= 900 ? "p" : "l") !== mapa.mode()) { var s = mapa.state(); mapa.build(); mapa.set(s); } else mapa.set(mapa.state()); };
    this.visible = function () { var r = root.getBoundingClientRect(); return r.bottom > -200 && r.top < innerHeight + 200; };
    pns.forEach(function (p, k) { [].forEach.call(p.querySelectorAll("a,button"), function (a) { a.tabIndex = k === 0 ? 0 : -1; }); });
  }

  /* ---------- tema (botão), rolagem e rebuild ---------- */
  if (D) {
    [].forEach.call(document.querySelectorAll(".story"), function (r) { stories.push(new Historia(r)); });
    var tk = false;
    function tick() { stories.forEach(function (s) { if (s.visible()) s.update(); }); }
    addEventListener("scroll", function () { if (!tk) { tk = true; requestAnimationFrame(function () { tick(); tk = false; }); } }, { passive: true });
    var rz; addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(function () { stories.forEach(function (s) { s.rebuild(); }); tick(); }, 150); });
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
