// Botões "Copiar" dos blocos de comando: copia só os comandos, sem os comentários.
(function () {
  document.querySelectorAll("[data-copiar]").forEach(function (btn) {
    var alvo = document.getElementById(btn.getAttribute("data-copiar"));
    if (!alvo || !navigator.clipboard) { btn.hidden = true; return; }
    var rotulo = btn.textContent;
    btn.addEventListener("click", function () {
      var texto = alvo.innerText.split("\n")
        .map(function (l) { return l.replace(/\s+#.*$/, "").replace(/^#.*$/, ""); })
        .filter(function (l) { return l.trim(); })
        .join("\n");
      navigator.clipboard.writeText(texto).then(function () {
        btn.textContent = btn.getAttribute("data-ok") || "OK";
        btn.classList.add("copied");
        setTimeout(function () { btn.textContent = rotulo; btn.classList.remove("copied"); }, 1600);
      });
    });
  });
})();
