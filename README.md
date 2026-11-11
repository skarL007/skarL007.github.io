# skarl007.github.io

Personal site of **Marcelo Machuca**, AI Solutions Developer (Desenvolvedor de Soluções em IA).

Live at <https://skarl007.github.io/> (Portuguese) and <https://skarl007.github.io/en/> (English).

## The idea: a living blueprint

The page is a technical drawing in 3D. The light hairlines are what I design. The orange cubes are the
coding agents that build it. As you scroll, the camera flies over the plan:

- **Method:** the four steps I follow (design, delegate, verify, measure).
- **Projects:** seven modules. The agents raise each one, and its height follows the log of the
  repository's commit count.
- **Activity:** my real GitHub contribution calendar, stacked block by block.
- **Path:** the timeline from medicine to AI.

## How it was built

I built this site the same way I build everything else: I designed it and set the limits, and AI
coding agents wrote the code. The 3D is progressive enhancement, so every word a visitor needs is
plain HTML:

- **Modo 2D / 2D mode** turns WebGL off and shows the plain layout. The choice is remembered.
- `prefers-reduced-motion` gets a single still frame with no camera flight and no smooth scroll.
- If WebGL is unavailable, the page falls back to 2D without errors.

**Stack:** [three.js](https://threejs.org/) 0.169 (EffectComposer, UnrealBloomPass, custom shaders,
InstancedMesh), [GSAP](https://gsap.com/) 3.12 with ScrollTrigger, and [Lenis](https://lenis.darkroom.engineering/) 1.1.
All of them load from public CDNs, with pinned versions. There is no build step. Visits are counted with [GoatCounter](https://www.goatcounter.com/) (`gc.zgo.at/count.js`, loaded on every page): it sets no cookies and keeps no personal profile of a visitor. There is no other analytics script.

## Layout

```text
index.html          Portuguese page (default)
en/index.html       English page
assets/site.css     shared styles
assets/site.js      shared script; every string it writes is in the TX table at the top
assets/shots/       project screenshots (replace a file to update it; keep the name)
assets/og.jpg       social preview image, 1200x630
farol-desk/         Farol Desk case study, Portuguese (en/farol-desk/ is the English one); the project was Nexo Assist until 11 Nov 2026
nexo-assist/        the old address of that case study: a page that only redirects to farol-desk/ (so does en/nexo-assist/)
assets/farol.css    Farol Desk case-study styles, on top of site.css (which it uses for the header and footer only)
assets/farol.js     Farol Desk case-study script: menu, current section, "por quê?" panels, video chapters, fade on scroll
tools/farol-shots.py  build tool, not part of the site: regenerates assets/shots/farol-* from the captures in the Farol Desk repository
assets/case.css     case-study styles, on top of site.css
assets/case.js      case-study script: the 3D architecture and its 2D plan; strings in the TX table at the top
assets/nexo-numbers.js  the Farol Desk numbers that still change (tests, evals, simulation, commits); the file keeps the old name
assets/video/       the Farol Desk demo video, recorded under the old name (a lighter encode of docs/demo/nexo-assist-demo.mp4 in that repo)
404.html            not-found page
lumen-demo/         LumenAI demo dashboard in replay mode (copied from lumen-ai-sdk)
```

`lumen-demo/` is `examples/local-observability-demo/static/` from
[lumen-ai-sdk](https://github.com/skarL007/lumen-ai-sdk), with `static/index.html` moved up to
`index.html`. With no backend, the page replays `static/recorded-events.json`, a real run of the
SDK. To update it, copy those files again. The LumenAI card links to the live demo on Vercel
(<https://lumen-ai-sdk-demo.vercel.app>); this copy is the recorded fallback.

## Updating the Farol Desk numbers and screenshots

The card on both home pages and the case study read the numbers that still change from one block at
the top of `assets/nexo-numbers.js`. Edit that block; every element with `data-n` is filled from it
on load, and the 3D module height follows `commits`. The numbers written in the HTML are only the
fallback for visitors without JavaScript. `asOf` dates the unit and E2E tests; the date of the eval
round is written by hand in both case-study pages, next to the `farol:eval-date` comments. The case
study's "Still open" list is prose, so it is edited in both pages, between the `nexo:open-items`
comments.

The screenshots come from `docs/capturas/` in the Farol Desk repository (still named `nexo-assist`).
After the captures change, run `python tools/farol-shots.py` (it expects that repository next to
this one; `--src` points elsewhere). The file names stay the same, so the pages need no edit.

## Run it locally

Any static server works. For example:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/>.

## Data honesty

- The numbers come from my GitHub profile and the repositories themselves: contributions, commits,
  pull requests, tests and release dates.
- The contribution calendar is the real one, from 26 Oct 2025 to 27 Oct 2026.
- Private projects are described, never linked.
- Screenshots are labelled with where they come from.
