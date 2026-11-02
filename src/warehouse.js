import * as THREE from 'three';
import { warehouseBounds, fitCamera } from './framing.js';
import { WIDTH, HEIGHT, STATION, SHELVES, PRODUCTS, ORDERS, AISLE, FAILURE, Simulation, plan } from './simulation.js';

const education = 'סימולציה לימודית עם אלגוריתם למציאת מסלול — ללא מודל בינה מלאכותית מאומן.';
const frame = () => `<div class="warehouse-frame"><div class="warehouse-viewport" role="img" aria-label="מחסן תלת־ממדי: מדפים, מוצרים צבעוניים, מעברים, עמדת אריזה ורובוט כתום"></div><p class="scene-caption">רובוט כתום · מסלול כחול · טבעת זהובה: יעד · ✓ נאסף<br>מוצרים: מחברת כחולה · אוזניות סגולות · בקבוק טורקיז</p></div>`;
export function simulationMarkup(blockage = false, guided = false) {
  return `<div class="split simulation-layout"><div class="sim-panel">${guided ? '<p class="guided-order">הזמנה 1: מחברת, אוזניות ובקבוק</p>' : `<fieldset class="orders"><legend>בחרו הזמנת הדגמה</legend>${ORDERS.map((ids, i) => `<label class="order"><input type="radio" name="order-${blockage ? 8 : 7}" value="${i}"><span><strong>הזמנה ${i + 1}</strong><small>${ids.map(id => PRODUCTS[id].label).join(' · ')}</small></span></label>`).join('')}</fieldset>`}${blockage ? '<label class="block-toggle"><input type="checkbox" data-block> חסימת המעבר המסומן</label><label class="block-toggle"><input type="checkbox" data-failure> תרחיש קבוע: אין גישה למחברת</label>' : ''}<ul class="pickup-list" aria-label="מצב איסוף המוצרים"></ul><p class="sim-status" role="status"></p><p class="sim-message" role="alert" hidden></p><div class="simulation-controls">${[['start','התחלה'],['pause','השהיה'],['resume','המשך'],['reset','איפוס']].map(([action,label]) => `<button data-action="${action}">${label}</button>`).join('')}</div><p class="route-metric"></p><small class="muted">יחידת הדגמה אחת = מעבר בין שני תאי רשת סמוכים; אינה מטר במציאות.</small></div><div>${frame()}<p class="data-note sim-disclaimer">נתוני הדגמה בלבד — אינם נתונים ממחסן אמיתי.<br>${education}</p>${blockage ? '<small class="muted">המעבר המסומן בזהב נמצא משמאל למדפים. הזמנה 2 מדגימה שינוי במסלול ובאורכו. לאחר שינוי חסימה יש ללחוץ על התחלה.</small>' : ''}</div></div>`;
}

export function setupWarehouses() {
  const shared = new Simulation(), guided = new Simulation(0), overview = new Simulation();
  const hosts = new Map();
  for (const number of [1, 4, 5, 7, 8]) {
    const section = document.querySelector(`#slide-${number}`);
    if (number === 1) section.querySelector('.warehouse-reserve').outerHTML = `<div>${frame()}<p class="data-note overview-note">נתוני הדגמה בלבד. ${education}</p></div>`;
    const host = section.querySelector('.warehouse-viewport');
    if (host) hosts.set(number - 1, host);
  }
  let activeIndex = -1, engine = overview, renderer, scene, camera, robot, routeGroup, obstacleGroup, productViews = [], activeHost;
  let raf = 0, lastTime = 0, drawnRoute, drawnObstacles, framingBounds;
  const material = color => new THREE.MeshStandardMaterial({ color, roughness: .65 });
  function box(w, h, d, color, x, y, z, parent = scene) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material(color));
    mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  }
  function label(text, x, y, z, color = '#16394f') {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 112;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#ffffffee'; ctx.fillRect(0, 0, 512, 112);
    ctx.fillStyle = color; ctx.font = 'bold 58px Arial'; ctx.textAlign = 'center'; ctx.direction = 'rtl'; ctx.fillText(text, 256, 78);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false }));
    sprite.scale.set(2.05, .48, 1); sprite.position.set(x, y, z); scene.add(sprite); return sprite;
  }
  function initialize() {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0xeaf3f8);
    scene = new THREE.Scene(); camera = new THREE.OrthographicCamera(-8, 8, 7, -7, .1, 100);
    camera.position.set(15, 19, 20); camera.lookAt(5, .2, 4);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8294a4, 2.4));
    const light = new THREE.DirectionalLight(0xffffff, 3); light.position.set(4, 15, 8); scene.add(light);
    box(WIDTH + .35, .12, HEIGHT + .35, 0xc5d8e3, 5, -.12, 4);
    for (let x = 0; x < WIDTH; x++) for (let z = 0; z < HEIGHT; z++) box(.94, .025, .94, (x + z) % 2 ? 0xe4eef3 : 0xf2f7fa, x, -.03, z);
    for (const [x, z] of SHELVES) {
      for (const dx of [-.34, .34]) box(.065, 1.45, .72, 0x547088, x + dx, .72, z);
      for (const y of [.12, .72, 1.32]) box(.82, .08, .84, 0x7792a5, x, y, z);
      box(.42, .32, .42, 0x9bb2c2, x, .32, z);
    }
    productViews = PRODUCTS.map(product => {
      const [x,z] = product.shelf;
      const mesh = box(.48, .45, .48, product.color, x, .98, z);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(.46, .095, 10, 40), new THREE.MeshBasicMaterial({ color: 0xf5a800, depthTest: false }));
      ring.renderOrder = 4;
      ring.rotation.x = Math.PI / 2; ring.position.set(x, 1.55, z); scene.add(ring);
      const name = label(product.label, x, 1.95, z);
      const collected = label('✓ נאסף', x, 2.4, z, '#087f70'); collected.visible = false;
      const pickup = new THREE.Mesh(new THREE.RingGeometry(.22, .39, 32), new THREE.MeshBasicMaterial({ color: 0xb87900, side: THREE.DoubleSide }));
      pickup.rotation.x = -Math.PI / 2; pickup.position.set(product.pickup[0], .045, product.pickup[1]); scene.add(pickup);
      return { mesh, ring, name, collected, pickup };
    });
    box(.9, .04, .9, 0x159d95, ...[STATION[0], .025, STATION[1]]);
    label('עמדת אריזה', 1, .8, 8.15);
    for (const [x,z] of AISLE) { box(.92, .025, .92, 0xf5d589, x, .01, z); }
    label('מעבר מסומן', .4, .8, 4);
    robot = new THREE.Group(); scene.add(robot);
    box(.46, .32, .46, 0xf05b16, 0, .3, 0, robot);
    box(.34, .24, .3, 0xffbe69, 0, .58, 0, robot);
    for (const x of [-.1, .1]) box(.07, .055, .03, 0x173b56, x, .6, .16, robot);
    for (const x of [-.25, .25]) for (const z of [-.14, .14]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.105, .105, .08, 16), material(0x23394a)); wheel.rotation.z = Math.PI / 2; wheel.position.set(x, .15, z); robot.add(wheel);
    }
    box(.04, .18, .04, 0x537a94, 0, .78, 0, robot);
    box(.1, .07, .1, 0xf05b16, 0, .9, 0, robot);
    routeGroup = new THREE.Group(); obstacleGroup = new THREE.Group(); scene.add(routeGroup, obstacleGroup);
    framingBounds = warehouseBounds(scene, camera, WIDTH, HEIGHT);
    renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); engine.pause(); cancelAnimationFrame(raf); raf = 0; renderer.dispose(); renderer = null; showFallback(); updateUI(); });
  }
  function clear(group) {
    for (const child of [...group.children]) { group.remove(child); child.geometry?.dispose(); child.material?.dispose(); }
  }
  function syncScene() {
    if (!renderer) return;
    if (drawnRoute !== engine.route) {
      clear(routeGroup); drawnRoute = engine.route;
      if (engine.route) {
        // Floor ribbons have reliable world-space thickness on WebGL implementations
        // where line width is limited to a single pixel.
        const seen = new Set();
        for (let i = 1; i < engine.route.cells.length; i++) {
          const [ax,az] = engine.route.cells[i-1], [bx,bz] = engine.route.cells[i];
          const id = [[ax,az].join(','),[bx,bz].join(',')].sort().join('/');
          if (seen.has(id)) continue;
          seen.add(id);
          const strip = new THREE.Mesh(new THREE.BoxGeometry(ax === bx ? .14 : 1.14, .025, az === bz ? .14 : 1.14), new THREE.MeshBasicMaterial({ color: 0x124bd2 }));
          strip.position.set((ax+bx)/2,.085,(az+bz)/2); routeGroup.add(strip);
        }
        for (const [x,z] of engine.route.cells) {
          const dot = new THREE.Mesh(new THREE.CircleGeometry(.105, 16), new THREE.MeshBasicMaterial({ color: 0x124bd2 })); dot.rotation.x = -Math.PI / 2; dot.position.set(x, .105, z); routeGroup.add(dot);
        }
      }
    }
    const obstacleKey = `${engine.blocked}/${engine.failure}`;
    if (drawnObstacles !== obstacleKey) {
      drawnObstacles = obstacleKey; clear(obstacleGroup);
      for (const [x,z] of [...(engine.blocked ? AISLE : []), ...(engine.failure ? FAILURE : [])]) {
        box(.9, .55, .9, 0xe47b42, x, .275, z, obstacleGroup);
        box(.94, .08, .94, 0xffdf9b, x, .57, z, obstacleGroup);
      }
    }
    robot.position.set(engine.position[0], 0, engine.position[1]);
    const next = engine.route?.cells[Math.min(Math.floor(engine.progress) + 1, engine.route.length)];
    if (next && (next[0] !== engine.position[0] || next[1] !== engine.position[1])) robot.rotation.y = Math.atan2(next[0] - engine.position[0], next[1] - engine.position[1]);
    productViews.forEach((view,i) => {
      const target = ORDERS[engine.order]?.includes(i), done = engine.collected.has(i);
      view.ring.visible = !!target && !done; view.collected.visible = done;
      view.mesh.material.emissive.setHex(target && !done ? 0x584000 : 0x000000);
      view.mesh.material.opacity = done ? .35 : 1; view.mesh.material.transparent = done;
      view.pickup.visible = !!target;
    });
  }
  const statusText = { idle: 'בחרו הזמנה', ready: 'מוכן להתחלה', running: 'בתנועה', paused: 'מושהה — לחצו על המשך', completed: 'הושלם — כל המוצרים הגיעו לאריזה', 'no-route': 'אין מסלול תקין' };
  function updateUI() {
    for (const number of [4, 7, 8]) {
      const section = document.querySelector(`#slide-${number}`), model = number === 4 ? guided : shared;
      section.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = Number(input.value) === model.order; });
      const block = section.querySelector('[data-block]'), failure = section.querySelector('[data-failure]');
      if (block) block.checked = model.blocked;
      if (failure) failure.checked = model.failure;
      section.querySelector('.sim-status').textContent = `מצב: ${statusText[model.status]}`;
      const message = section.querySelector('.sim-message'); message.textContent = model.message; message.hidden = !model.message;
      section.querySelector('.route-metric').textContent = model.route ? `אורך המסלול: ${model.route.length} יחידות הדגמה` : 'אורך המסלול: לא זמין';
      section.querySelector('.pickup-list').innerHTML = (ORDERS[model.order] || []).map(i => `<li class="${model.collected.has(i) ? 'collected' : ''}">${model.collected.has(i) ? '✓ נאסף' : '◎ יעד'}: ${PRODUCTS[i].label}</li>`).join('');
      section.querySelector('[data-action="start"]').disabled = ['running','paused'].includes(model.status) || !renderer;
      section.querySelector('[data-action="pause"]').disabled = model.status !== 'running';
      section.querySelector('[data-action="resume"]').disabled = model.status !== 'paused' || !renderer;
    }
  }
  function showFallback() {
    if (!activeHost) return;
    activeHost.innerHTML = '<p class="webgl-error">תצוגת התלת־ממד אינה זמינה בדפדפן זה. אפשר להמשיך במצגת ולבחור הזמנות.</p>' + `<div class="fallback-map" aria-label="מפת מחסן סטטית">${Array.from({length:WIDTH*HEIGHT}, (_, i) => { const x=i%WIDTH,z=Math.floor(i/WIDTH); return `<span class="${SHELVES.some(p=>p[0]===x&&p[1]===z)?'shelf-cell':''}">${x===STATION[0]&&z===STATION[1]?'אריזה':''}</span>`; }).join('')}</div>`;
  }
  function resize() {
    if (!activeHost || !renderer || !activeHost.clientWidth) return;
    const w = activeHost.clientWidth, h = activeHost.clientHeight, aspect = w / h;
    fitCamera(camera, framingBounds, aspect);
    renderer.setSize(w, h, false); renderer.render(scene, camera);
  }
  function animate(time) {
    if (!activeHost || document.hidden) { raf = 0; return; }
    const before = engine.progress, collectedBefore = engine.collected.size, statusBefore = engine.status;
    engine.tick(Math.min((time-lastTime)/1000, .05)); lastTime = time;
    if (engine.progress !== before || engine.status !== statusBefore) syncScene();
    if (engine.collected.size !== collectedBefore || engine.status !== statusBefore) updateUI();
    renderer.render(scene, camera);
    if (engine.status === 'running') raf = requestAnimationFrame(animate); else raf = 0;
  }
  function render() {
    syncScene(); updateUI(); resize();
    if (renderer && activeHost && engine.status === 'running' && !raf) { lastTime = performance.now(); raf = requestAnimationFrame(animate); }
  }
  try { initialize(); } catch (error) { console.warn('Warehouse WebGL unavailable:', error); renderer?.dispose(); renderer = null; }
  for (const number of [4,7,8]) {
    const section = document.querySelector(`#slide-${number}`), model = number === 4 ? guided : shared;
    section.querySelectorAll('input[type="radio"]').forEach(input => input.addEventListener('change', () => { model.select(Number(input.value)); render(); }));
    section.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => { model[button.dataset.action](); render(); }));
    section.querySelectorAll('[data-block], [data-failure]').forEach(input => input.addEventListener('change', () => { model.obstacles(section.querySelector('[data-block]').checked, section.querySelector('[data-failure]').checked); render(); }));
  }
  // Comparison uses the same order, occupancy and return station for both candidates.
  const comparison = document.querySelector('#slide-5');
  const fixed = plan(0,false,false,false), optimized = plan(0);
  comparison.querySelector('.comparison-note').innerHTML = `<strong>הזמנה 1 · אותם מוצרים, תחנת אריזה ומכשולים</strong><p>סדר קבוע: ${fixed.length} יחידות הדגמה · סדר מחושב: ${optimized.length} יחידות הדגמה<br>הפרש: ${fixed.length-optimized.length} יחידות הדגמה</p><button data-compare="fixed" aria-pressed="false">הצגת הסדר הקבוע</button> <button data-compare="optimized" aria-pressed="true">הצגת הסדר המחושב</button><small>יחידת הדגמה אחת = מעבר בין שני תאי רשת סמוכים; אינה מטר במציאות.<br>נתוני הדגמה בלבד — אינם נתונים ממחסן אמיתי.</small>`;
  const compareEngine = new Simulation(0);
  comparison.querySelectorAll('[data-compare]').forEach(button => button.addEventListener('click', () => { compareEngine.route = button.dataset.compare === 'fixed' ? fixed : optimized; comparison.querySelectorAll('[data-compare]').forEach(b=>b.setAttribute('aria-pressed',String(b===button))); render(); }));
  const observer = new ResizeObserver(resize); for (const host of hosts.values()) observer.observe(host);
  document.addEventListener('fullscreenchange', resize);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { engine.leave(); cancelAnimationFrame(raf); raf = 0; updateUI(); } });
  return {
    activate(index) {
      if (index !== activeIndex) { engine.leave(); cancelAnimationFrame(raf); raf = 0; }
      activeIndex = index; activeHost = hosts.get(index);
      engine = index === 3 ? guided : [6,7].includes(index) ? shared : index === 4 ? compareEngine : overview;
      if (activeHost) {
        if (renderer) { activeHost.append(renderer.domElement); drawnRoute = undefined; drawnObstacles = undefined; render(); }
        else { showFallback(); updateUI(); }
      } else updateUI();
    }
  };
}
