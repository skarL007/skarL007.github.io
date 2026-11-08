// Página do Lodemap: copiar comandos, barra que ganha fundo ao rolar, seção atual na navegação,
// brilho que segue o ponteiro nos cartões e contagem dos números (o valor final já está no HTML).
(function () {
  var reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Copiar: só os comandos, sem comentários nem o prompt.
  document.querySelectorAll("[data-copiar]").forEach(function (btn) {
    var alvo = document.getElementById(btn.getAttribute("data-copiar"));
    if (!alvo || !navigator.clipboard) { btn.hidden = true; return; }
    var rotulo = btn.textContent;
    btn.addEventListener("click", function () {
      var texto = alvo.innerText.split("\n")
        .map(function (l) { return l.replace(/^\s*\$\s?/, "").replace(/\s+#.*$/, "").replace(/^#.*$/, ""); })
        .filter(function (l) { return l.trim(); })
        .join("\n");
      navigator.clipboard.writeText(texto).then(function () {
        btn.textContent = btn.getAttribute("data-ok") || "OK";
        btn.classList.add("copied");
        setTimeout(function () { btn.textContent = rotulo; btn.classList.remove("copied"); }, 1600);
      });
    });
  });

  // Barra com fundo depois do topo.
  var barra = document.querySelector(".top");
  function rolou() { if (barra) barra.classList.toggle("scrolled", scrollY > 8); }
  addEventListener("scroll", rolou, { passive: true });
  rolou();

  if (!("IntersectionObserver" in window)) return;

  // Seção atual na navegação.
  var links = {};
  document.querySelectorAll(".nav a[href^='#']").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var a = links[e.target.id];
      if (a && e.isIntersecting) {
        Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
        a.setAttribute("aria-current", "true");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });

  if (reduz) return;

  // Brilho que segue o ponteiro.
  document.querySelectorAll(".cell").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX - r.left) + "px");
      c.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  // Contagem: data-to (número), data-dec (casas), texto ao redor preservado em data-pre/data-pos.
  var nums = document.querySelectorAll("[data-to]");
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      var el = e.target, alvo = parseFloat(el.dataset.to), dec = parseInt(el.dataset.dec || "0", 10);
      var pre = el.dataset.pre || "", pos = el.dataset.pos || "", t0 = null, final = el.innerHTML;
      function passo(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / 1200, 1), v = alvo * (1 - Math.pow(1 - p, 3));
        el.textContent = pre + v.toFixed(dec).replace(".", el.dataset.sep || ",") + pos;
        if (p < 1) requestAnimationFrame(passo); else el.innerHTML = final;
      }
      requestAnimationFrame(passo);
    });
  }, { rootMargin: "0px 0px -15% 0px" });
  nums.forEach(function (n) { cio.observe(n); });
})();
