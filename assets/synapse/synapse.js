(function () {
  var root = document.documentElement;
  var KEY = "synapse-tema";
  var q = new URLSearchParams(location.search).get("tema");
  var salvo = null;
  try { salvo = localStorage.getItem(KEY); } catch (e) {}
  var tema = q === "claro" ? "light" : q === "escuro" ? "dark" : salvo;
  if (tema === "light" || tema === "dark") root.setAttribute("data-theme", tema);

  var btn = document.getElementById("temaBtn");
  function rotulo() {
    var atual = root.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    btn.textContent = atual === "light" ? btn.dataset.escuro : btn.dataset.claro;
    btn.setAttribute("aria-pressed", atual === "light" ? "true" : "false");
    return atual;
  }
  if (btn) {
    rotulo();
    btn.addEventListener("click", function () {
      var novo = rotulo() === "light" ? "dark" : "light";
      root.setAttribute("data-theme", novo);
      try { localStorage.setItem(KEY, novo); } catch (e) {}
      rotulo();
    });
  }

  root.classList.add("js");
  var itens = document.querySelectorAll(".rv");
  if (!("IntersectionObserver" in window)) {
    itens.forEach(function (el) { el.classList.add("on"); });
    return;
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  itens.forEach(function (el) { io.observe(el); });
})();
