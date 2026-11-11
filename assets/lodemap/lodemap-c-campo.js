/* Lodemap · campo imersivo (Canvas 2D, sem biblioteca).
   Desenha o mapa real do axios (window.LODEMAP_MAPA): 72 componentes, 188 relações, 8 áreas.
   Deriva suave e profundidade, pulsos nas relações reais (fluxo "ciclo de vida da requisição" em loop),
   cursor magnético, entrada única e recorte por versão no celular.
   Só há dado onde há dado: a poeira e as cruzes do fundo são textura e não representam componente. */
(function () {
  "use strict";
  var D = window.LODEMAP_MAPA;
  if (!D) return;
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FLOW = [0, 4, 8, 5, 7, 10, 15, 9];                                     // 8 componentes do fluxo, na ordem da demo
  var FLOWE = [[0, 4], [4, 8], [4, 5], [4, 7], [7, 10], [7, 15], [15, 9]];   // 7 relações reais do fluxo
  var Z = [0.35, 0.8, 0.55, 1, 0.25, 0.7, 0.45, 0.9];                        // camada (profundidade) de cada área
  var STEP = 0.62, HOLD = 1.5, LOOP = FLOWE.length * STEP + HOLD + 0.9;      // segundos: por relação, parada e volta
  var TAU = 6.2832;
  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function ease(k) { return 1 - Math.pow(1 - k, 3); }
  function wrap(name, maxc) {
    var lines = [], cur = "";
    name.split(" ").forEach(function (w) { if (cur && (cur + " " + w).length > maxc) { lines.push(cur); cur = w; } else cur = cur ? cur + " " + w : w; });
    lines.push(cur); return lines;
  }
  var flowKey = {}; FLOWE.forEach(function (p, k) { flowKey[p[0] + "-" + p[1]] = k; });
  var arrive = {}; FLOWE.forEach(function (p, k) { arrive[p[1]] = (k + 1) * STEP; }); arrive[FLOW[0]] = 0;

  function Campo(cv, opt) {
    var ctx = cv.getContext("2d"), stage = cv.parentNode, band = stage.querySelector(".band");
    var W = 0, H = 0, dpr = 1, R = { x: 0, y: 56, w: 1, h: 1 }, port = false, v = -1;
    var cam = [0, 0, 1, 1], camFrom = null, camTo = null, camT = 0;
    var r = rng(7), dust = [], col = {}, pm = { x: 0, y: 0, on: false, type: "mouse" };
    var par = { x: 0, y: 0 }, hov = -1, sel = -1, shown = false, raf = 0, t0 = 0, last = 0, flowT = 0;
    var entry = !!opt.entrada && !RM, pulses = [], X = [], Y = [];

    var nodes = D.nodes.map(function (n, i) {
      return { i: i, first: n[2], area: n[1], z: Z[n[1]], vis: 1, pr: 0, born: -1e9, blink: -1e9, d: r(), s0x: r(), s0y: r(),
        w1: 0.25 + r() * 0.35, w2: 0.15 + r() * 0.3, p1: r() * TAU, p2: r() * TAU, hx: 0, hy: 0 };
    });
    var edges = D.edges.map(function (e) { return { a: e[0], b: e[1], v: e[2], vis: 1, f: flowKey[e[0] + "-" + e[1]] }; });
    for (var k = 0; k < 70; k++) dust.push({ x: r(), y: r(), z: r(), rad: 0.6 + r() * 1.3, a: 0.1 + r() * 0.2, p: r() * TAU, w: 0.1 + r() * 0.2 });

    function colors() {
      var cs = getComputedStyle(document.documentElement);
      ["bg", "ink", "hi", "mute"].forEach(function (n) { col[n] = cs.getPropertyValue("--" + n).trim() || "#888"; });
    }

    /* ---------- geometria ---------- */
    function layout() {
      var cr = cv.getBoundingClientRect(); W = cr.width; H = cr.height; if (!W || !H) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      var top = 56, bh = band ? band.getBoundingClientRect().height : H * 0.42;
      R = { x: 0, y: top, w: W, h: Math.max(H - bh - top + (innerWidth > 900 ? 56 : 0), 120) };   // o campo entra sob o topo esmaecido da faixa de texto
      var was = port; port = innerWidth <= 900;
      var P = port ? D.P : D.L;
      nodes.forEach(function (n) { n.hx = P[n.i][0]; n.hy = P[n.i][1]; });
      var to = box(v);
      if (!camTo || was !== port || !camFrom) cam = to.slice();
      if (was !== port) camFrom = null;
      camTo = to; kick();
    }
    function bbox(list) {
      var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      list.forEach(function (n) { x0 = Math.min(x0, n.hx); x1 = Math.max(x1, n.hx); y0 = Math.min(y0, n.hy); y1 = Math.max(y1, n.hy); });
      return [x0, y0, x1 - x0, y1 - y0];
    }
    /* quadro em unidades do layout: inteiro no desktop; no celular, recorte que contém todos os componentes novos */
    function box(ver) {
      var S = port ? D.PW : D.W, asp = R.w / R.h;
      if (!port) return [0, -4, S[0], S[1] + 8];
      var b, pad = 80, L = nodes.filter(function (n) { return n.first === ver; }), hasNew = L.length > 0;
      if (ver >= 1 && !hasNew) edges.forEach(function (e) { if (e.v === ver) { L.push(nodes[e.a]); L.push(nodes[e.b]); } });
      if (ver >= 1 && !L.length) L = (D.changed[ver] || []).map(function (i) { return nodes[i]; });
      if (ver < 1 || !L.length) { var w0 = S[0], h0 = S[1]; if (w0 / h0 < asp) w0 = h0 * asp; else h0 = w0 / asp; return [S[0] / 2 - w0 / 2, S[1] / 2 - h0 / 2, w0, h0]; }
      b = bbox(L);
      if (!hasNew && (b[2] > S[0] * 0.62 || b[3] > S[1] * 0.62)) {   // espalhado: foca na área com mais mudanças
        var cnt = {}, ta = 0, best = -1; L.forEach(function (n) { cnt[n.area] = (cnt[n.area] || 0) + 1; });
        for (var a in cnt) if (cnt[a] > best) { best = cnt[a]; ta = +a; }
        b = bbox(nodes.filter(function (n) { return n.area === ta && n.first <= ver; }));
      }
      var w = Math.max(b[2] + pad * 2, 230), h = Math.max(b[3] + pad * 2, 200);
      if (w / h < asp) w = h * asp; else h = w / asp;
      var cx = b[0] + b[2] / 2, cy = b[1] + b[3] / 2;
      return [clamp(cx - w / 2, Math.min(0, S[0] - w), Math.max(S[0] - w, 0)), clamp(cy - h / 2, Math.min(0, S[1] - h), Math.max(S[1] - h, 0)), w, h];
    }

    /* ---------- estado (versão em foco) ---------- */
    function set(ver) {
      var prev = v, t = performance.now(); v = ver;
      nodes.forEach(function (n) {
        if (ver >= 1 && prev !== ver && n.first === ver) n.born = t;
        if (ver >= 1 && prev !== ver && n.first < ver && (D.changed[ver] || []).indexOf(n.i) > -1) n.blink = t;
      });
      pulses.length = 0; flowT = t;
      var to = box(ver);
      if (port && !RM && camTo) { camFrom = cam.slice(); camT = t; } else { cam = to.slice(); camFrom = null; }
      camTo = to;
      kick();
    }
    function wantNode(n) { return v < 0 || n.first <= v ? 1 : 0; }
    function wantEdge(e) { return v < 0 || e.v <= v ? 1 : 0; }

    /* ---------- desenho ---------- */
    function seg(e) { ctx.beginPath(); ctx.moveTo(X[e.a], Y[e.a]); ctx.lineTo(X[e.b], Y[e.b]); ctx.stroke(); }
    function ring(x, y, rr, a) {
      ctx.globalAlpha = a; ctx.lineWidth = 4; ctx.strokeStyle = col.hi; ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.stroke();
      ctx.lineWidth = 1.2; ctx.strokeStyle = col.ink; ctx.stroke();
    }
    function trail(a, b, u, al) {
      for (var s = 4; s >= 0; s--) {
        var uu = clamp(u - s * 0.035, 0, 1), x = X[a] + (X[b] - X[a]) * uu, y = Y[a] + (Y[b] - Y[a]) * uu;
        ctx.globalAlpha = al * (s ? 0.16 + (4 - s) * 0.1 : 1); ctx.fillStyle = col.hi; ctx.beginPath(); ctx.arc(x, y, s ? 1.4 + (4 - s) * 0.35 : 3.4, 0, TAU); ctx.fill();
        if (!s) { ctx.lineWidth = 1.2; ctx.strokeStyle = col.ink; ctx.stroke(); }
      }
    }
    function pick(px, py, thr) {
      var hit = -1, hd = 1e9;
      nodes.forEach(function (n) { if (n.vis < 0.5) return; var d = Math.hypot(X[n.i] - px, Y[n.i] - py); if (d < hd && d < thr) { hd = d; hit = n.i; } });
      return hit;
    }

    function draw(now) {
      var sec = now / 1000, dt = Math.min(now - (last || now), 60); last = now;
      if (!t0) t0 = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, R.y + R.h + (port ? 6 : 0)); ctx.clip();   // no celular nada invade o texto da faixa
      if (camFrom) { var kc = clamp((now - camT) / 800, 0, 1), ke = ease(kc); cam = camFrom.map(function (f, i) { return f + (camTo[i] - f) * ke; }); if (kc >= 1) camFrom = null; }
      var mx = pm.on && pm.type === "mouse" && !RM;
      par.x += ((mx ? (pm.x / W - 0.5) * 2 : 0) - par.x) * 0.06; par.y += ((mx ? (pm.y / H - 0.5) * 2 : 0) - par.y) * 0.06;
      var sx = R.w / cam[2], sy = R.h / cam[3], amp = port ? 1.6 : 3.4, ek = entry ? now - t0 : 1e9, ink = col.ink;
      var ea = entry ? clamp((ek - 500) / 700, 0, 1) : 1, na = entry ? clamp(ek / 350, 0, 1) : 1, ent = entry && ek < 1300;
      if (entry) flowT = now;                       // o fluxo só começa depois que os pontos chegaram
      var flowOn = v === -2 || (v === -1 && !RM), tf = ((now - flowT) / 1000) % LOOP;

      // textura: cruzes da grade e poeira (sem dado)
      ctx.fillStyle = ink; ctx.globalAlpha = 0.26 * ea;
      for (var gx = 60; gx < W; gx += 120) for (var gy = 56; gy < H; gy += 120) { ctx.fillRect(gx - 4, gy, 9, 1); ctx.fillRect(gx, gy - 4, 1, 9); }
      dust.forEach(function (d) {
        var dx = d.x * W + par.x * (d.z * 2 - 1) * 18, dy = d.y * H + par.y * (d.z * 2 - 1) * 10;
        if (!RM) { dx += Math.sin(sec * d.w + d.p) * 6; dy += Math.cos(sec * d.w + d.p) * 6; }
        ctx.globalAlpha = d.a * (entry ? clamp(ek / 1200, 0, 1) : 1); ctx.beginPath(); ctx.arc(dx, dy, d.rad, 0, TAU); ctx.fill();
      });

      // posições na tela: layout + deriva + paralaxe + entrada
      nodes.forEach(function (n) {
        n.vis = RM ? wantNode(n) : n.vis + (wantNode(n) - n.vis) * clamp(dt / 240, 0, 1);
        var bx = R.x + (n.hx - cam[0]) * sx, by = R.y + (n.hy - cam[1]) * sy, a = amp * (0.5 + n.z);
        if (!RM) { bx += Math.sin(sec * n.w1 + n.p1) * a + Math.sin(sec * n.w2 + n.p2) * a * 0.6; by += Math.cos(sec * n.w1 + n.p2) * a + Math.cos(sec * n.w2 + n.p1) * a * 0.6; }
        if (!port) { bx += par.x * (n.z * 2 - 1) * 14; by += par.y * (n.z * 2 - 1) * 9; }
        if (ent) { var k2 = ease(clamp((ek - n.d * 250) / 950, 0, 1)), ox = n.s0x * W, oy = n.s0y * H; bx = ox + (bx - ox) * k2; by = oy + (by - oy) * k2; }
        X[n.i] = bx; Y[n.i] = by;
      });
      if (pm.type === "mouse") hov = pm.on ? pick(pm.x, pm.y, 30) : -1;
      nodes.forEach(function (n) {
        var t = 0; if (pm.on && pm.type === "mouse" && n.vis > 0.5) t = clamp(1 - Math.hypot(X[n.i] - pm.x, Y[n.i] - pm.y) / 120, 0, 1);
        n.pr += (t - n.pr) * (RM ? 1 : 0.18);
      });
      var act = hov >= 0 ? hov : sel, dim = act >= 0 ? 0.3 : 1;
      cv.style.cursor = hov >= 0 ? "pointer" : "";

      // rótulos das 8 áreas (só no desktop)
      if (!port) {
        ctx.font = "500 11px 'Hanken Grotesk',system-ui,sans-serif"; ctx.fillStyle = col.mute; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        if ("letterSpacing" in ctx) ctx.letterSpacing = "2px";
        D.areas.forEach(function (name, ai) {
          var cx = 0, ty = 1e9, c = 0; nodes.forEach(function (n) { if (n.area === ai) { cx += X[n.i]; ty = Math.min(ty, Y[n.i]); c++; } });
          ctx.globalAlpha = (0.55 + 0.4 * Z[ai]) * ea * dim; ctx.fillText((name + " · " + c).toUpperCase(), cx / c, ty - 24);
        });
        if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
      }

      // relações reais: todas finas; por cima, as novas da versão, as do fluxo já percorrido e as do nó sob o cursor
      ctx.lineCap = "round"; ctx.strokeStyle = ink; ctx.lineWidth = port ? 0.6 : 0.9; ctx.globalAlpha = (port ? 0.09 : 0.2) * dim * ea; ctx.beginPath();
      edges.forEach(function (e) {
        e.vis = RM ? wantEdge(e) : e.vis + (wantEdge(e) - e.vis) * clamp(dt / 300, 0, 1);
        if (e.vis > 0.5) { ctx.moveTo(X[e.a], Y[e.a]); ctx.lineTo(X[e.b], Y[e.b]); }
      });
      ctx.stroke();
      var fadeAt = FLOWE.length * STEP + HOLD;
      edges.forEach(function (e) {
        var lit = 0;
        if (e.f !== undefined && flowOn) lit = RM ? 1 : (tf >= e.f * STEP ? clamp(1 - Math.max(0, tf - fadeAt) / 0.9, 0, 1) : 0);
        if (v >= 1 && e.v === v && e.vis > 0.5) { ctx.globalAlpha = dim * ea; ctx.lineWidth = 2; seg(e); }
        else if (lit > 0) { ctx.globalAlpha = lit * e.vis * dim * ea; ctx.lineWidth = 2.4; seg(e); }
      });
      if (flowOn && !RM && !ent) FLOWE.forEach(function (p, k) { var u = (tf - k * STEP) / STEP; if (u >= 0 && u < 1) trail(p[0], p[1], ease(u), dim); });
      if (!RM && !ent) ambient(now, dim);
      if (act >= 0) edges.forEach(function (e) {
        if (e.vis < 0.5 || (e.a !== act && e.b !== act)) return;
        ctx.globalAlpha = 1; ctx.strokeStyle = ink; ctx.lineWidth = 3.6; seg(e); ctx.strokeStyle = col.hi; ctx.lineWidth = 1.8; seg(e); ctx.strokeStyle = ink;
      });

      // nós
      var neigh = {}; if (act >= 0) edges.forEach(function (e) { if (e.a === act) neigh[e.b] = 1; if (e.b === act) neigh[e.a] = 1; });
      nodes.forEach(function (n) {
        if (n.vis < 0.02) return;
        var i = n.i, nw = v >= 1 && n.first === v, chg = v >= 1 && !nw && (D.changed[v] || []).indexOf(i) > -1, fl = FLOW.indexOf(i), reached = false;
        if (fl > -1 && flowOn) reached = RM || (tf >= arrive[i] && tf < fadeAt + 0.9);
        var rad = ((port ? 4.4 : 4.6) + 2.2 * n.z) * n.vis * (1 + n.pr * 1.2) * (i === act ? 1.3 : 1) + (reached ? 1.2 : 0);
        ctx.globalAlpha = (0.6 + 0.4 * n.z) * n.vis * na * (act >= 0 && i !== act && !neigh[i] ? 0.4 : 1) * (v === -2 && fl < 0 ? 0.35 : 1);
        ctx.beginPath(); ctx.arc(X[i], Y[i], rad, 0, TAU);
        ctx.fillStyle = (nw || reached || i === act) ? col.hi : col.bg; ctx.fill();
        ctx.lineWidth = chg ? 3 : nw ? 2.4 : 1.5; ctx.strokeStyle = ink; ctx.stroke();
        if (nw) {
          var age = now - n.born; if (RM) ring(X[i], Y[i], rad + 12, 0.5);
          else if (age >= 0) { var ph = (age % 4200) / 1000; if (ph < 1.1) ring(X[i], Y[i], rad + 3 + ph * 30, (1 - ph / 1.1) * (age < 1200 ? 0.95 : 0.4)); }
        }
        var ba = now - n.blink;
        if (chg && !RM && ba >= 0 && ba < 900) { var bs = Math.sin(ba / 900 * Math.PI); ctx.globalAlpha = 0.7 * bs; ctx.fillStyle = col.hi; ctx.beginPath(); ctx.arc(X[i], Y[i], rad * 2.6, 0, TAU); ctx.fill(); ctx.globalAlpha = bs; ctx.lineWidth = 2; ctx.stroke(); }
      });
      ctx.globalAlpha = 1; labels(act);
      ctx.restore();
      if (entry && ek > 1400) entry = false;
      return !RM;
    }

    /* pulsos de luz soltos, só em relações reais já visíveis (nas versões, de preferência as da própria versão) */
    function ambient(now, dim) {
      if (v !== -2 && pulses.length < (port ? 3 : 5) && Math.random() < 0.05) {
        var pool = edges.filter(function (e) { return e.vis > 0.9 && (v < 1 || e.v === v || Math.random() < 0.15); });
        if (pool.length) pulses.push({ e: pool[Math.floor(Math.random() * pool.length)], t: now, d: 1500 + Math.random() * 900 });
      }
      pulses = pulses.filter(function (p) { return now - p.t < p.d; });
      pulses.forEach(function (p) { trail(p.e.a, p.e.b, (now - p.t) / p.d, 0.85 * dim); });
    }

    /* rótulos: componentes novos, os mais próximos do cursor e o nó ativo; no celular, também os alterados que couberem */
    function labels(act) {
      var L = {}, news = [], chg = [];
      nodes.forEach(function (n) {
        if (n.vis < 0.5) return;
        if (v >= 1 && n.first === v) news.push(n.i);
        else if (v >= 1 && port && cam[2] < D.PW[0] * 0.75 && (D.changed[v] || []).indexOf(n.i) > -1 && X[n.i] > 30 && X[n.i] < W - 30 && Y[n.i] > R.y + 20 && Y[n.i] < R.y + R.h - 20) chg.push(n.i);
      });
      news.forEach(function (i) { L[i] = 1; });
      if (news.length && news.length + chg.length <= 5) chg.forEach(function (i) { L[i] = 1; });
      if (!port) nodes.filter(function (n) { return n.pr > 0.55 && n.vis > 0.5; }).sort(function (a, b) { return b.pr - a.pr; }).slice(0, 2).forEach(function (n) { L[n.i] = 1; });
      if (act >= 0) L[act] = 2;
      var ids = Object.keys(L).map(Number).sort(function (a, b) { return Y[a] - Y[b]; }), lastY = -1e9;
      ctx.textBaseline = "middle"; ctx.lineJoin = "round";
      ids.forEach(function (i) {
        var big = L[i] === 2, fs = big ? 13.5 : 12.5, lines = port ? wrap(D.nodes[i][0], 20) : [D.nodes[i][0]], lh = fs * 1.25, h = lines.length * lh;
        var right = X[i] > W * 0.55, x = X[i] + (right ? -1 : 1) * (12 + (big ? 6 : 0)), y = Math.max(Y[i], lastY + h / 2 + 1);
        lastY = y + h / 2;
        ctx.font = (big ? 700 : 600) + " " + fs + "px 'Hanken Grotesk',system-ui,sans-serif"; ctx.textAlign = right ? "right" : "left"; ctx.globalAlpha = 1;
        lines.forEach(function (ln, k) {
          var ly = y - h / 2 + lh / 2 + k * lh;
          if (big) { var tw = ctx.measureText(ln).width; ctx.fillStyle = col.hi; ctx.fillRect(right ? x - tw - 4 : x - 4, ly - lh / 2, tw + 8, lh); ctx.fillStyle = "#000"; ctx.fillText(ln, x, ly); }
          else { ctx.strokeStyle = col.bg; ctx.lineWidth = 4; ctx.strokeText(ln, x, ly); ctx.fillStyle = col.ink; ctx.fillText(ln, x, ly); }
        });
      });
      if (v === -2) {
        ctx.font = "800 12px 'Bricolage Grotesque',system-ui,sans-serif"; ctx.textAlign = "left";
        FLOW.forEach(function (i, k) { var t = (k < 9 ? "0" : "") + (k + 1); ctx.strokeStyle = col.bg; ctx.lineWidth = 4; ctx.strokeText(t, X[i] + 9, Y[i] - 10); ctx.fillStyle = col.ink; ctx.fillText(t, X[i] + 9, Y[i] - 10); });
      }
    }

    /* ---------- laço, visibilidade e eventos ---------- */
    function frame(t) { raf = 0; if (!shown || document.hidden || !W) return; if (draw(t)) raf = requestAnimationFrame(frame); }
    function kick() { if (!raf && shown && !document.hidden) raf = requestAnimationFrame(frame); }
    new IntersectionObserver(function (en) { shown = en[0].isIntersecting; if (shown) { last = 0; kick(); } }).observe(stage);
    document.addEventListener("visibilitychange", function () { last = 0; kick(); });
    new ResizeObserver(layout).observe(cv);
    function where(e) { var cr = cv.getBoundingClientRect(); pm.x = e.clientX - cr.left; pm.y = e.clientY - cr.top; }
    stage.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      pm.type = "mouse"; where(e); pm.on = !e.target.closest(".band"); kick();
    });
    stage.addEventListener("pointerleave", function () { if (pm.type === "mouse") { pm.on = false; hov = -1; kick(); } });
    stage.addEventListener("pointerdown", function (e) { pm.type = e.pointerType === "mouse" ? "mouse" : "touch"; });
    stage.addEventListener("click", function (e) {
      if (e.target.closest("a,button,.band")) return;
      where(e);
      var i = pick(pm.x, pm.y, pm.type === "mouse" ? 30 : 34);
      if (i < 0) { sel = -1; kick(); return; }
      if (pm.type === "mouse" || sel === i) { location.href = "demo/explorador/#" + encodeURIComponent(D.ids[i]); return; }
      sel = i; kick();                                                   // toque: o primeiro mostra o nome, o segundo abre
    });
    colors();
    if (document.fonts) document.fonts.ready.then(function () { kick(); });
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { colors(); kick(); });
    new MutationObserver(function () { colors(); kick(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    this.set = set;
    this.mode = function () { return port ? "p" : "l"; };
    this.state = function () { return v; };
    layout();
  }
  window.LodemapCampo = Campo;
})();
