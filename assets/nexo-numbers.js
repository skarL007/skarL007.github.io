/* Nexo Assist: the numbers that still change.
 *
 * ============ EDIT HERE ============
 * One place for the volatile numbers of the Nexo Assist card (index pages)
 * and the case study (nexo-assist/ pages), in both languages. Every element
 * with data-n="<key>" is filled from this block when the page loads; the text
 * already in the HTML is only the fallback for visitors without JavaScript.
 * Sources (nexo-assist, origin/main): README.md ("Como garanti a qualidade"),
 * docs/validacao/README.md, docs/validacao/SIMULACAO.md, docs/validacao/RED-TEAM.md,
 * and `git rev-list --count origin/main` for the commits.
 */
window.NEXO_NUMBERS = {
  asOf: '2026-10-30',        // date of the round the numbers come from (YYYY-MM-DD)
  commits: 148,              // git rev-list --count origin/main at 1d0e0c5 (also sets the 3D module height)
  unitTests: 457,            // npm test (Vitest, 65 files)
  e2eTests: 39,              // npm run test:e2e (Playwright)
  evalsPassed: 36,           // npm run eval, full suite (8 attacks, 6 simulation findings, 2 diagnostic checks)
  evalsTotal: 36,            // 30 Oct, with openrouter/openai/gpt-6-luna (the production model since that day)
  attacksPassed: 8,          // attack scenarios inside that suite
  attacksTotal: 8,
  redTeamPassed: 21,         // npm run eval -- ataque --repeat=3
  redTeamTotal: 21,
  simPass1: 0.93,            // npm run eval:sim, pass^1, round 3 with the one persona re-run after its fix (round 2 also 0.93)
  simPassed: 28,             // conversations that passed ...
  simRuns: 30,               // ... out of this many (personas x k)
  simPass3: 0.80,            // pass^3, same round (round 2 also 0.80)
  simPersonasAll: 8,         // personas that passed all k runs ...
  simPersonas: 10,           // ... out of this many
  simPass1Before: 0.72,      // first round, before the fixes (6 personas x 3)
  simPass3Before: 0.50
};
/* ============ END OF THE EDITABLE BLOCK ============ */

(function () {
  var N = window.NEXO_NUMBERS;
  var lang = /^en/i.test(document.documentElement.lang || '') ? 'en' : 'pt';
  var loc = lang === 'en' ? 'en-US' : 'pt-BR';
  var MONTHS = {
    pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }[lang];
  var int = function (v) { return Number(v).toLocaleString(loc); };
  var dec = function (v) { return Number(v).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var d = N.asOf.split('-');
  var FMT = {
    commits: function () { return int(N.commits); },
    unitTests: function () { return int(N.unitTests); },
    e2eTests: function () { return int(N.e2eTests); },
    evals: function () { return N.evalsPassed + '/' + N.evalsTotal; },
    attacks: function () { return N.attacksPassed + '/' + N.attacksTotal; },
    redTeam: function () { return N.redTeamPassed + '/' + N.redTeamTotal; },
    simPass1: function () { return dec(N.simPass1); },
    simPass3: function () { return dec(N.simPass3); },
    simPass1Before: function () { return dec(N.simPass1Before); },
    simPass3Before: function () { return dec(N.simPass3Before); },
    simRuns: function () { return N.simPassed + '/' + N.simRuns; },
    simPersonas: function () { return N.simPersonasAll + '/' + N.simPersonas; },
    asOf: function () { return d[2] + ' ' + MONTHS[+d[1] - 1] + ' ' + d[0]; }
  };
  function fill() {
    var els = document.querySelectorAll('[data-n]');
    for (var i = 0; i < els.length; i++) {
      var f = FMT[els[i].getAttribute('data-n')];
      if (f) els[i].textContent = f();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill);
  else fill();
})();
