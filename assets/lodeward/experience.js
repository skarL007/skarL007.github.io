const root = document.documentElement;
const english = root.lang === 'en';
const stages = [...document.querySelectorAll('.step')];
const panels = [...document.querySelectorAll('[data-panel]')];
const sceneHost = document.querySelector('.scene');
const pauseButton = document.querySelector('.motion');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let selected = 0, paused = reduced.matches, updateScene = () => {};
function selectStage(index) {
  selected = index;
  stages.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  panels.forEach((panel, i) => { panel.hidden = i !== index; });
  updateScene();
}
stages.forEach((button, index) => {
  button.addEventListener('click', () => selectStage(index));
  button.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 3 : (index + (event.key === 'ArrowRight' ? 1 : 3)) % 4;
    selectStage(next); stages[next].focus();
  });
});
function pauseLabel() {
  pauseButton.textContent = paused ? (english ? 'Play motion' : 'Ativar movimento') : (english ? 'Pause motion' : 'Pausar movimento');
  pauseButton.setAttribute('aria-pressed', String(paused));
}
pauseLabel();
pauseButton.addEventListener('click', () => { paused = !paused; pauseLabel(); updateScene(); });
reduced.addEventListener('change', event => { paused = event.matches; pauseLabel(); updateScene(); });

// All product information lives in HTML. The procedural model is an optional illustration.
async function startScene() {
  let renderer;
  try {
    const THREE = await import('./vendor/three.module.min.js');
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    const context = canvas.getContext('webgl2', { alpha: true, antialias: true });
    if (!context) throw new Error('WebGL2 unavailable');
    renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0xefeee9, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, .1, 50);
    camera.position.set(6.5, 5.2, 8.8); camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x52628d, 3));
    for (const [x, y, z, intensity, color] of [[3, 6, 4, 8, 0xffffff], [-4, 2, -3, 6, 0x91afff], [0, -3, 5, 3, 0xffffff]]) {
      const light = new THREE.DirectionalLight(color, intensity); light.position.set(x, y, z); scene.add(light);
    }
    const machine = new THREE.Group(); scene.add(machine);
    function rounded(path, size, radius) {
      const h = size / 2, r = radius;
      path.moveTo(-h + r, -h); path.lineTo(h - r, -h); path.quadraticCurveTo(h, -h, h, -h + r);
      path.lineTo(h, h - r); path.quadraticCurveTo(h, h, h - r, h); path.lineTo(-h + r, h);
      path.quadraticCurveTo(-h, h, -h, h - r); path.lineTo(-h, -h + r); path.quadraticCurveTo(-h, -h, -h + r, -h);
    }
    const shape = new THREE.Shape(); rounded(shape, 3.4, .55);
    const hole = new THREE.Path(); rounded(hole, 2.55, .35); shape.holes.push(hole);
    const frameGeometry = new THREE.ExtrudeGeometry(shape, { depth: .17, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .055, bevelThickness: .055, curveSegments: 12 });
    const frames = [];
    for (let i = 0; i < 4; i++) {
      const material = new THREE.MeshPhysicalMaterial({ color: i === 0 ? 0x2447ed : 0x9da8bf, metalness: .65, roughness: .28, clearcoat: .7 });
      const frame = new THREE.Mesh(frameGeometry, material);
      frame.position.z = (i - 1.5) * .85; frames.push(frame); machine.add(frame);
      const screws = new THREE.Group(); frame.add(screws);
      const screwGeometry = new THREE.CylinderGeometry(.045, .045, .025, 12);
      const screwMaterial = new THREE.MeshStandardMaterial({ color: 0x353c50, metalness: .8, roughness: .3 });
      for (const x of [-1.48, 1.48]) for (const y of [-1.48, 1.48]) {
        const screw = new THREE.Mesh(screwGeometry, screwMaterial); screw.rotation.x = Math.PI / 2; screw.position.set(x, y, .24); screws.add(screw);
      }
    }
    const railGeometry = new THREE.CylinderGeometry(.025, .025, 3.6, 10);
    for (const x of [-1.46, 1.46]) for (const y of [-1.46, 1.46]) {
      const rail = new THREE.Mesh(railGeometry, new THREE.MeshStandardMaterial({ color: 0x8b95ad, metalness: .8, roughness: .24 }));
      rail.rotation.x = Math.PI / 2; rail.position.set(x, y, 0); machine.add(rail);
    }
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.64, 1), new THREE.MeshPhysicalMaterial({ color: 0x2447ed, metalness: .4, roughness: .22, clearcoat: 1 }));
    machine.add(core);
    const orbit = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(.88, 1)), new THREE.LineBasicMaterial({ color: 0x2447ed, transparent: true, opacity: .28 }));
    machine.add(orbit);
    const points = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) { const a = i * 2.39996; points[i * 3] = Math.cos(a) * (2.6 + i % 7 / 12); points[i * 3 + 1] = Math.sin(a) * (2.6 + i % 7 / 12); points[i * 3 + 2] = Math.sin(i * .8) * 1.3; }
    const particleGeometry = new THREE.BufferGeometry(); particleGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    machine.add(new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x2447ed, size: .018, transparent: true, opacity: .55 })));
    machine.rotation.set(-.25, -.2, -.3);
    sceneHost.prepend(canvas); sceneHost.dataset.renderer = 'webgl';
    let visible = true, frameId = 0, time = 0, previous = 0, pointerX = 0, pointerY = 0, lost = false;
    const moving = () => !paused && visible && !document.hidden && !lost;
    function render(now = performance.now()) {
      frameId = 0;
      const delta = previous ? Math.min((now - previous) / 1000, .05) : 0; previous = now;
      if (moving()) time += delta;
      machine.rotation.y = -.2 + Math.sin(time * .22) * .12 + (paused ? 0 : pointerX * .12);
      machine.rotation.x = -.25 + (paused ? 0 : pointerY * .1);
      core.rotation.set(time * .12, time * .18, .2); orbit.rotation.z = -time * .08;
      frames.forEach((frame, i) => { frame.material.color.setHex(i === selected ? 0x2447ed : 0x9da8bf); });
      renderer.render(scene, camera);
      sceneHost.dataset.frames = String(Number(sceneHost.dataset.frames || 0) + 1);
      if (moving()) frameId = requestAnimationFrame(render);
    }
    updateScene = () => { if (frameId) cancelAnimationFrame(frameId); previous = 0; if (!lost) render(); };
    const resize = new ResizeObserver(() => { const w = sceneHost.clientWidth, h = sceneHost.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.position.set(w < 450 ? 7.8 : 6.5, w < 450 ? 6.2 : 5.2, w < 450 ? 10.6 : 8.8); camera.updateProjectionMatrix(); updateScene(); });
    resize.observe(sceneHost);
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; updateScene(); }, { rootMargin: '80px' }); observer.observe(sceneHost);
    document.addEventListener('visibilitychange', updateScene);
    sceneHost.addEventListener('pointermove', event => { const rect = sceneHost.getBoundingClientRect(); pointerX = (event.clientX - rect.left) / rect.width - .5; pointerY = (event.clientY - rect.top) / rect.height - .5; });
    sceneHost.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
    canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); lost = true; if (frameId) cancelAnimationFrame(frameId); sceneHost.dataset.renderer = 'fallback'; canvas.hidden = true; pauseButton.hidden = true; });
    window.addEventListener('pagehide', event => { if (frameId) cancelAnimationFrame(frameId); if (!event.persisted) { observer.disconnect(); resize.disconnect(); renderer.dispose(); } });
    window.addEventListener('pageshow', event => { if (event.persisted) updateScene(); });
    updateScene();
  } catch {
    renderer?.dispose(); sceneHost.dataset.renderer = 'fallback'; pauseButton.hidden = true;
  }
}
startScene();
