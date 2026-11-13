const english = document.documentElement.lang === 'en';
const stages = [...document.querySelectorAll('.step')];
const panels = [...document.querySelectorAll('[data-panel]')];
const host = document.querySelector('.scene');
const labels = [...host.querySelectorAll('.node-label')];
const pauseButton = document.querySelector('.motion');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let selected = 0, paused = reduced.matches, updateScene = () => {};
function selectStage(index) {
  selected = index;
  [...stages, ...labels].forEach((button, i) => button.setAttribute('aria-pressed', String(i % 4 === index)));
  panels.forEach((panel, i) => { panel.hidden = i !== index; });
  updateScene();
}
for (const buttons of [stages, labels]) buttons.forEach((button, index) => {
  button.addEventListener('click', () => selectStage(index));
  button.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 3 : (index + (event.key === 'ArrowRight' ? 1 : 3)) % 4;
    selectStage(next); buttons[next].focus();
  });
});
function pauseLabel() {
  pauseButton.textContent = paused ? (english ? 'Play motion' : 'Ativar movimento') : (english ? 'Pause motion' : 'Pausar movimento');
  pauseButton.setAttribute('aria-pressed', String(paused));
}
pauseLabel();
pauseButton.addEventListener('click', () => { paused = !paused; pauseLabel(); updateScene(); });
reduced.addEventListener('change', event => { paused = event.matches; pauseLabel(); updateScene(); });

// Licensed brain geometry with original illustrative synapses; no live telemetry.
async function startScene() {
  let renderer;
  try {
    const T = await import('./vendor/three.module.min.js');
    const canvas = document.createElement('canvas'); canvas.setAttribute('aria-hidden', 'true');
    const context = canvas.getContext('webgl2', { alpha: true, antialias: true });
    if (!context) throw new Error('WebGL2 unavailable');
    renderer = new T.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0x0d1212, 0); renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(35, 1, .1, 40);
    const brain = new T.Group(); scene.add(brain);
    scene.add(new T.HemisphereLight(0xe0f5ec, 0x071813, .9));
    const key = new T.DirectionalLight(0xdaf2e4, 2.5); key.position.set(-3, 5, 4); scene.add(key);
    const rim = new T.DirectionalLight(0xffa679, 3); rim.position.set(4, 1, -2); scene.add(rim);
    const fill = new T.PointLight(0x9fcbbb, 15, 15); fill.position.set(2, -2, 3); scene.add(fill);
    // BodyParts3D / DBCLS, CC BY 4.0, via OrganUI. See BRAIN-LICENSE.md.
    const [metadataResponse, modelResponse] = await Promise.all([
      fetch(new URL('./brain.json', import.meta.url)),
      fetch(new URL('./brain.bin.gz', import.meta.url))
    ]);
    if (!metadataResponse.ok || !modelResponse.ok) throw new Error('Brain model unavailable');
    const metadata = await metadataResponse.json();
    const buffer = await new Response(modelResponse.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
    const surface = [];
    for (const part of metadata.parts) {
      const packed = new Int16Array(buffer,part.positionOffset,part.vertices*3);
      const positions = Float32Array.from(packed,value=>value/metadata.scale);
      const geometry = new T.BufferGeometry();
      geometry.setAttribute('position',new T.BufferAttribute(positions,3));
      geometry.setIndex(new T.BufferAttribute(new Uint16Array(buffer,part.indexOffset,part.indexCount),1));
      geometry.computeVertexNormals();
      const mesh = new T.Mesh(geometry,new T.MeshStandardMaterial({color:0x617e70,metalness:.48,roughness:.38}));
      brain.add(mesh);
      if (/frontal|parietal|temporal|occipital/.test(part.name)) {
        for(let i=0;i<positions.length;i+=15)surface.push(new T.Vector3(positions[i],positions[i+1],positions[i+2]));
      }
    }
    function surfacePoint(direction) {
      const unit=direction.clone().normalize();let best=null,score=-Infinity;
      for(const p of surface){const alignment=p.clone().normalize().dot(unit);const value=alignment*5+p.length()*.08;if(value>score){score=value;best=p}}
      return best.clone().addScaledVector(unit,.025);
    }
    const nodes = [], routes = [], routeLines = [], particles = [];
    for (let i=0;i<96;i++) {
      const y=.98-i/95*1.75, radius=Math.sqrt(1-y*y), angle=i*2.399963;
      nodes.push(surfacePoint(new T.Vector3(Math.cos(angle)*radius,y,Math.sin(angle)*radius)));
    }
    const pointsGeo = new T.BufferGeometry().setFromPoints(nodes);
    const points = new T.Points(pointsGeo,new T.PointsMaterial({color:0xffd8b4,size:.035,sizeAttenuation:true}));brain.add(points);
    const neuralBranches=[];
    for(let i=0;i<nodes.length;i++) {
      const neighbours=nodes.map((point,index)=>({point,index,distance:point.distanceTo(nodes[i])})).filter(n=>n.index>i&&n.distance<.85).sort((a,b)=>a.distance-b.distance).slice(0,3);
      for(const neighbour of neighbours)neuralBranches.push(nodes[i],neighbour.point);
    }
    brain.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(neuralBranches),new T.LineBasicMaterial({color:0xe7c4a1,transparent:true,opacity:.35,depthTest:false})));
    // Cross-hemisphere routes are raised slightly from the cortex, like visible synaptic arcs.
    for(let i=0;i<32;i++) {
      const a=nodes[i*3], b=nodes[(i*3+13)%nodes.length];
      const mid=a.clone().lerp(b,.5).normalize().multiplyScalar(2.12);mid.y+=.1;
      const curve=new T.QuadraticBezierCurve3(a,mid,b);routes.push(curve);
      const material=new T.LineBasicMaterial({color:0xffad82,transparent:true,opacity:.15});
      const line=new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(48)),material);brain.add(line);routeLines.push(line);
      const particle=new T.Mesh(new T.SphereGeometry(.025,8,6),new T.MeshBasicMaterial({color:0xffe4bd}));brain.add(particle);particles.push(particle);
    }
    // The four selected regions explain software stages, not biological functions.
    const anchors=[nodes[12],nodes[25],nodes[46],nodes[65]];
    const beacons=anchors.map(position=>{const dot=new T.Mesh(new T.SphereGeometry(.055,16,12),new T.MeshBasicMaterial({color:0xffad82}));dot.position.copy(position);brain.add(dot);return dot});
    host.prepend(canvas); host.dataset.renderer='webgl';host.dataset.object='brain';
    let visible=true,lost=false,frameId=0,time=0,previous=0,px=0,py=0;
    const moving=()=>!paused&&visible&&!document.hidden&&!lost;
    function render(now=performance.now()) {
      frameId=0;const delta=previous?Math.min((now-previous)/1000,.05):0;previous=now;if(moving())time+=delta;
      brain.rotation.y = -.36+(paused?0:Math.sin(time*.13)*.12+px*.2);brain.rotation.z=-.08;brain.rotation.x=.12+(paused?0:py*.08);
      routeLines.forEach((line,i)=>{line.material.opacity=i%4===selected?.8:.15});
      particles.forEach((packet,i)=>{packet.position.copy(routes[i].getPoint((time*.14+i*.137)%1));packet.visible=i%4===selected});
      beacons.forEach((dot,i)=>{dot.scale.setScalar(i===selected?1.6:1);dot.material.color.setHex(i===selected?0xffd8ad:0xa3bfb1)});
      renderer.render(scene,camera);
      host.dataset.stage=String(selected);
      host.dataset.frames=String(Number(host.dataset.frames||0)+1);
      if(moving())frameId=requestAnimationFrame(render);
    }
    updateScene=()=>{if(frameId)cancelAnimationFrame(frameId);previous=0;if(!lost)render()};
    const resize=new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(3.9,2.4,w<500?8.9:8.2);camera.lookAt(0,-.1,0);camera.updateProjectionMatrix();updateScene()});resize.observe(host);
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;updateScene()},{rootMargin:'80px'});observer.observe(host);
    document.addEventListener('visibilitychange',updateScene);
    host.addEventListener('pointermove',event=>{const r=host.getBoundingClientRect();px=(event.clientX-r.left)/r.width-.5;py=(event.clientY-r.top)/r.height-.5});
    host.addEventListener('pointerleave',()=>{px=0;py=0});
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;if(frameId)cancelAnimationFrame(frameId);host.dataset.renderer='fallback';canvas.hidden=true;pauseButton.hidden=true});
    window.addEventListener('pagehide',event=>{if(frameId)cancelAnimationFrame(frameId);if(!event.persisted){observer.disconnect();resize.disconnect();scene.traverse(object=>{object.geometry?.dispose();if(object.material){for(const material of [object.material].flat())material.dispose()}});renderer.dispose()}});
    window.addEventListener('pageshow',event=>{if(event.persisted)updateScene()});
    updateScene();
  } catch {renderer?.dispose();host.dataset.renderer='fallback';pauseButton.hidden=true;}
}
startScene();
