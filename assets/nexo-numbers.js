/* Farol Desk (the project was called Nexo Assist until 11 Nov 2026): the numbers that still change.
 *
 * ============ EDIT HERE ============
 * One place for the volatile numbers of the Farol Desk card (index pages)
 * and the case study (farol-desk/ pages), in both languages. Every element
 * with data-n="<key>" is filled from this block when the page loads; the text
 * already in the HTML is only the fallback for visitors without JavaScript.
 * The file, the global (NEXO_NUMBERS) and the repository keep the old name.
 * Sources: the project is now called Farol Desk; its repository is still skarL007/nexo-assist.
 *   - unitTests, e2eTests and asOf: docs/validacao/REVISAO-2026-11-11.md (review of 11 Nov 2026)
 *     and README.md ("Como garanti a qualidade").
 *   - everything else is still the 3 Nov round (nexo-assist, 94eaf07): README.md,
 *     docs/validacao/README.md, docs/validacao/SIMULACAO.md, docs/validacao/RED-TEAM.md,
 *     and `git rev-list --count 94eaf07` for the commits.
 * asOf dates the unit and E2E tests only. The case study writes the date of the eval round
 * by hand (search for "farol:eval-date" in farol-desk/index.html and en/farol-desk/index.html).
 */
window.NEXO_NUMBERS = {
  asOf: '2026-11-11',        // date of the unit and E2E test run (YYYY-MM-DD); the evals below are from 3 Nov
  commits: 176,              // git rev-list --count 94eaf07
  unitTests: 573,            // npm test (Vitest, 77 files), review of 11 Nov
  e2eTests: 48,              // npm run test:e2e (Playwright)
  evalsPassed: 35,           // npm run eval, full suite (8 attacks, 6 simulation findings, 2 diagnostic checks)
  evalsTotal: 36,            // 3 Nov, with deepinfra/deepseek-ai/DeepSeek-V4-Flash (the production model since 2 Nov), US$ 0.07
  attacksPassed: 8,          // attack scenarios inside that suite
  attacksTotal: 8,
  redTeamPassed: 21,         // npm run eval -- ataque --repeat=3
  redTeamTotal: 21,
  simPass1: 0.93,            // 30 Oct (not re-run yet with DeepSeek): npm run eval:sim, pass^1, round 3 with the one persona re-run after its fix (round 2 also 0.93)
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
