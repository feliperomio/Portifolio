// Cursor glow
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 70);
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Form
function sendMsg() {
  const btn = document.querySelector('.contact-form .btn');
  btn.textContent = 'Mensagem enviada! ✓';
  btn.style.background = '#22c55e';
  setTimeout(() => { btn.textContent = 'Enviar mensagem →'; btn.style.background = ''; }, 3000);
}

// Globo 3D
(function() {
  const canvas = document.getElementById('globe-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 2.8;

  // Lights
  scene.add(new THREE.AmbientLight(0x2a3f52, 1.92));
  const sun = new THREE.DirectionalLight(0xf5f9ff, 0.88);
  sun.position.set(3, 2, 6);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x8ec5ff, 0.24);
  fill.position.set(-2, -1, 4);
  scene.add(fill);

  // Globe texture
  function makeTexture() {
    const S = 2048;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');

    // Ocean
    ctx.fillStyle = '#1d5f9d';
    ctx.fillRect(0, 0, S, S);

    // Land helper
    function land(pts, color = '#4f7d3a') {
      ctx.fillStyle = color;
      ctx.beginPath();
      pts.forEach(([x, y], i) => {
        const px = (x / 360 + 0.5) * S;
        const py = (0.5 - y / 180) * S;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.closePath(); ctx.fill();
    }

    // South America
    land([[-82,12],[-77,8],[-75,11],[-62,12],[-50,5],[-34,-6],[-35,-10],[-37,-14],[-40,-19],[-44,-23],[-48,-28],[-52,-34],[-55,-35],[-65,-55],[-68,-55],[-73,-50],[-75,-40],[-72,-30],[-70,-20],[-75,-10],[-80,-3],[-78,5],[-77,8]]);
    // North America
    land([[-140,60],[-130,54],[-124,46],[-124,37],[-117,32],[-100,20],[-90,20],[-85,23],[-80,25],[-80,32],[-75,35],[-70,42],[-66,44],[-60,47],[-55,50],[-52,55],[-60,60],[-65,65],[-70,63],[-80,62],[-90,60],[-100,60],[-110,60],[-120,55],[-130,58],[-135,60],[-140,60]]);
    // Europe
    land([[10,71],[20,70],[28,70],[30,65],[28,60],[25,56],[20,54],[18,54],[10,55],[5,52],[2,50],[-5,48],[-9,44],[-9,39],[-5,36],[2,37],[5,40],[10,44],[15,44],[18,40],[20,38],[25,38],[30,40],[28,44],[25,48],[15,52],[10,54],[8,58],[5,62],[0,60],[-2,57],[0,52],[2,51],[5,54],[8,56],[10,56],[15,60],[20,65],[15,68],[10,71]]);
    // Africa
    land([[-5,36],[10,37],[25,37],[32,32],[36,22],[38,12],[42,12],[44,10],[42,2],[38,-5],[36,-18],[34,-30],[26,-34],[20,-35],[14,-28],[10,-20],[8,-4],[2,4],[-2,5],[-8,5],[-15,10],[-16,12],[-14,16],[-14,20],[-12,24],[-8,28],[-5,32],[-5,36]]);
    // Asia
    land([[40,40],[45,42],[50,44],[55,44],[60,44],[65,42],[70,38],[75,36],[80,36],[85,32],[90,26],[100,20],[102,12],[105,10],[108,15],[115,22],[120,30],[125,38],[128,42],[132,48],[136,50],[138,46],[140,42],[142,46],[145,46],[150,50],[146,56],[140,60],[135,55],[130,50],[125,50],[120,45],[115,42],[110,38],[105,42],[100,44],[95,45],[90,50],[85,54],[80,56],[75,54],[70,52],[65,52],[60,56],[55,58],[50,56],[45,54],[42,52],[38,48],[36,42],[40,40]]);
    // Australia
    land([[114,-22],[118,-20],[125,-16],[130,-12],[136,-12],[138,-14],[136,-18],[134,-24],[130,-30],[128,-34],[118,-34],[115,-30],[112,-26],[114,-22]]);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
    for (let lat = -80; lat <= 80; lat += 20) {
      ctx.beginPath(); ctx.moveTo(0,(0.5-lat/180)*S); ctx.lineTo(S,(0.5-lat/180)*S); ctx.stroke();
    }
    for (let lon = -180; lon <= 180; lon += 20) {
      ctx.beginPath(); ctx.moveTo((lon/360+0.5)*S,0); ctx.lineTo((lon/360+0.5)*S,S); ctx.stroke();
    }

    // Destaque de Garibaldi, RS: lon -51.53, lat -29.25
    const gx = (-51.53/360+0.5)*S, gy = (0.5-(-29.25/180))*S;
    const grad = ctx.createRadialGradient(gx,gy,0,gx,gy,60);
    grad.addColorStop(0,'rgba(255,255,255,0.22)'); grad.addColorStop(1,'transparent');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(gx,gy,60,0,Math.PI*2); ctx.fill();

    return new THREE.CanvasTexture(c);
  }

  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshPhongMaterial({
      map: makeTexture(),
      specular: new THREE.Color(0x1f3f5c), shininess: 4,
      emissive: new THREE.Color(0x08131f), emissiveIntensity: 0.064
    })
  );
  scene.add(globe);

  // Atmosphere
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.05, 64, 64),
    new THREE.MeshPhongMaterial({ color: 0x7fc8ff, transparent: true, opacity: 0.024, side: THREE.FrontSide })
  ));
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 64, 64),
    new THREE.MeshPhongMaterial({ color: 0x3f8cff, transparent: true, opacity: 0.016, side: THREE.FrontSide })
  ));

  // Stars
  const stars = [];
  for (let i = 0; i < 3000; i++) {
    const t = Math.random()*Math.PI*2, p = Math.acos(2*Math.random()-1), r = 15+Math.random()*10;
    stars.push(r*Math.sin(p)*Math.cos(t), r*Math.sin(p)*Math.sin(t), r*Math.cos(p));
  }
  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute('position', new THREE.Float32BufferAttribute(stars,3));
  scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({color:0xffffff,size:0.025,transparent:true,opacity:0.7})));

  // Garibaldi, RS: lat -29.25, lon -51.53
  function ll3d(lat, lon, r) {
    const phi = (90-lat)*(Math.PI/180), theta = (lon+180)*(Math.PI/180);
    return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta));
  }
  const garibaldiPos = ll3d(-29.25, -51.53, 1.02);

  const pin = new THREE.Mesh(new THREE.SphereGeometry(0.022,16,16), new THREE.MeshBasicMaterial({color:0xf59e0b}));
  pin.position.copy(garibaldiPos); pin.visible = false; scene.add(pin);

  const ring = new THREE.Mesh(new THREE.RingGeometry(0.028,0.055,32), new THREE.MeshBasicMaterial({color:0xf59e0b,transparent:true,opacity:0.8,side:THREE.DoubleSide}));
  ring.position.copy(garibaldiPos); ring.visible = false; scene.add(ring);

  // Target rotation to face Garibaldi
  const targetRotY = -((-51.53+180)*(Math.PI/180)) + Math.PI;
  const targetRotX = (-29.25)*(Math.PI/180);

  let phase = 'spin', elapsed = 0, spinSpeed = 0.014;
  let rotY = Math.PI*4, rotX = 0.15;
  const pingEl = document.getElementById('locationPing');
  const clock = new THREE.Clock();

  function posPin() {
    const wp = garibaldiPos.clone().applyEuler(globe.rotation);
    const proj = wp.clone().project(camera);
    if (proj.z > 1) { pingEl.style.display='none'; return; }
    pingEl.style.left = ((proj.x*0.5+0.5)*window.innerWidth)+'px';
    pingEl.style.top  = ((-proj.y*0.5+0.5)*window.innerHeight-32)+'px';
    pingEl.style.display = 'flex';
  }

  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta(); elapsed += dt;

    if (phase === 'spin') {
      rotY += spinSpeed; spinSpeed *= 0.9985;
      if (elapsed > 2.5) phase = 'align';
    } else if (phase === 'align') {
      let dY = targetRotY - rotY;
      while (dY > Math.PI) dY -= Math.PI*2;
      while (dY < -Math.PI) dY += Math.PI*2;
      const dX = targetRotX - rotX;
      rotY += dY*0.045; rotX += dX*0.045;
      if (Math.abs(dY) < 0.004 && Math.abs(dX) < 0.004) {
        rotY = targetRotY; rotX = targetRotX;
        phase = 'idle';
        pin.visible = ring.visible = true;
        pingEl.style.display = 'flex';
      }
    } else {
      rotY += 0.0008; posPin();
    }

    globe.rotation.y = rotY; globe.rotation.x = rotX;

    if (ring.visible) {
      ring.position.copy(garibaldiPos.clone().applyEuler(globe.rotation));
      ring.lookAt(camera.position);
      pin.position.copy(garibaldiPos.clone().applyEuler(globe.rotation));
      const s = 1 + 0.35*Math.sin(elapsed*3);
      ring.scale.set(s,s,s); ring.material.opacity = 0.7*(2-s);
    }

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Drag to rotate
  let drag=false, lx, ly;
  canvas.addEventListener('mousedown', e=>{drag=true;lx=e.clientX;ly=e.clientY;});
  window.addEventListener('mouseup', ()=>drag=false);
  window.addEventListener('mousemove', e=>{
    if(!drag||phase!=='idle') return;
    rotY+=(e.clientX-lx)*0.005; rotX+=(e.clientY-ly)*0.003;
    rotX=Math.max(-0.9,Math.min(0.9,rotX)); lx=e.clientX; ly=e.clientY;
  });
  canvas.addEventListener('touchstart',e=>{drag=true;lx=e.touches[0].clientX;ly=e.touches[0].clientY;});
  canvas.addEventListener('touchend',()=>drag=false);
  canvas.addEventListener('touchmove',e=>{
    if(!drag||phase!=='idle') return;
    rotY+=(e.touches[0].clientX-lx)*0.005; rotX+=(e.touches[0].clientY-ly)*0.003;
    lx=e.touches[0].clientX; ly=e.touches[0].clientY;
  });
})();
