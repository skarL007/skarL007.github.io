# skarl007.github.io

Personal site of **Marcelo Machuca**, AI Solutions Developer (Desenvolvedor de Soluções em IA).

Live at <https://skarl007.github.io/> (Portuguese) and <https://skarl007.github.io/en/> (English).

## The idea: a living blueprint

The page is a technical drawing in 3D. The light hairlines are what I design. The orange cubes are the
coding agents that build it. As you scroll, the camera flies over the plan:

- **Method:** the four steps I follow (design, delegate, verify, measure).
- **Projects:** six modules. The agents raise each one, and its height follows the log of the
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
All of them load from public CDNs, with pinned versions. There is no build step and no tracking.

## Layout

```text
index.html          Portuguese page (default)
en/index.html       English page
assets/site.css     shared styles
assets/site.js      shared script; every string it writes is in the TX table at the top
assets/shots/       project screenshots (replace a file to update it; keep the name)
assets/og.png       social preview image
404.html            not-found page
lumen-demo/         LumenAI demo dashboard in replay mode (copied from lumen-ai-sdk)
```

`lumen-demo/` is `examples/local-observability-demo/static/` from
[lumen-ai-sdk](https://github.com/skarL007/lumen-ai-sdk), with `static/index.html` moved up to
`index.html`. With no backend, the page replays `static/recorded-events.json`, a real run of the
SDK. To update it, copy those files again.

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
