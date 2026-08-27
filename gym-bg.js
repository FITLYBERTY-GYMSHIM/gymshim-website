// Gym-themed animated background for Workout+ hero
(function () {
  const canvas = document.getElementById('gymBgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = canvas.closest('.workout-hero');
  if (!hero) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Force CSS positioning (fallback for when stylesheet hasn't loaded)
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';

  let W = 0, H = 0;
  function resize() {
    const rect = hero.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      W = canvas.width = rect.width;
      H = canvas.height = rect.height;
    }
  }
  resize();
  window.addEventListener('resize', resize);
  // Retry until hero has dimensions
  (function retryResize() {
    if (W === 0 || H === 0) { resize(); requestAnimationFrame(retryResize); }
  })();
  window.addEventListener('load', resize);

  // ---------- COLORS (higher opacity for dark bg) ----------
  const C = {
    red:    [216, 35, 74],
    orange: [255, 107, 53],
    warm:   [255, 160, 80],
    white:  [255, 255, 255],
    pink:   [255, 100, 120],
  };

  function rgba(rgb, a) { return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`; }

  // ---------- GYM EQUIPMENT SILHOUETTES ----------

  function drawDumbbell(x, y, size, alpha, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    const bw = size * 0.8, pr = size * 0.24, bh = size * 0.07;

    // bar
    ctx.strokeStyle = rgba(C.red, alpha);
    ctx.lineWidth = bh;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-bw, 0); ctx.lineTo(bw, 0); ctx.stroke();
    // plates
    ctx.fillStyle = rgba(C.orange, alpha * 0.9);
    ctx.beginPath(); ctx.arc(-bw, 0, pr, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(bw, 0, pr, 0, Math.PI * 2); ctx.fill();
    // inner rings
    ctx.fillStyle = rgba(C.red, alpha * 0.6);
    ctx.beginPath(); ctx.arc(-bw, 0, pr * 0.55, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(bw, 0, pr * 0.55, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawKettlebell(x, y, size, alpha, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    const r = size * 0.3, hw = size * 0.24;
    // body
    ctx.fillStyle = rgba(C.red, alpha * 0.8);
    ctx.beginPath(); ctx.arc(0, size * 0.06, r, 0, Math.PI * 2); ctx.fill();
    // handle
    ctx.strokeStyle = rgba(C.orange, alpha);
    ctx.lineWidth = size * 0.06;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, -size * 0.06, hw, Math.PI * 1.05, -0.05 * Math.PI); ctx.stroke();
    // inner circle
    ctx.fillStyle = rgba(C.orange, alpha * 0.4);
    ctx.beginPath(); ctx.arc(0, size * 0.06, r * 0.45, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawWeightPlate(x, y, size, alpha, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    const r = size * 0.32;
    // outer ring
    ctx.strokeStyle = rgba(C.white, alpha * 0.7);
    ctx.lineWidth = size * 0.06;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    // inner ring
    ctx.strokeStyle = rgba(C.red, alpha * 0.9);
    ctx.lineWidth = size * 0.045;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2); ctx.stroke();
    // center hole
    ctx.fillStyle = rgba(C.orange, alpha * 0.5);
    ctx.beginPath(); ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawBarbell(x, y, size, alpha, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    const bl = size * 0.9, bh = size * 0.04, pw = size * 0.09, ph = size * 0.3;

    // bar
    ctx.strokeStyle = rgba(C.white, alpha * 0.6);
    ctx.lineWidth = bh; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-bl, 0); ctx.lineTo(bl, 0); ctx.stroke();
    // plates left
    ctx.fillStyle = rgba(C.red, alpha * 0.7);
    ctx.fillRect(-bl - pw * 0.5, -ph, pw, ph * 2);
    ctx.fillStyle = rgba(C.orange, alpha * 0.55);
    ctx.fillRect(-bl - pw * 1.4, -ph * 0.7, pw, ph * 1.4);
    // plates right
    ctx.fillStyle = rgba(C.red, alpha * 0.7);
    ctx.fillRect(bl - pw * 0.5, -ph, pw, ph * 2);
    ctx.fillStyle = rgba(C.orange, alpha * 0.55);
    ctx.fillRect(bl + pw * 0.9 - pw * 0.5, -ph * 0.7, pw, ph * 1.4);
    ctx.restore();
  }

  function drawJumpRope(x, y, size, alpha, phase) {
    ctx.save();
    ctx.translate(x, y);
    const w = size * 0.5, h = size * 0.4;
    // handles
    ctx.strokeStyle = rgba(C.warm, alpha * 0.8);
    ctx.lineWidth = size * 0.045; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-w, -h); ctx.lineTo(-w, h * 0.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w, -h); ctx.lineTo(w, h * 0.2); ctx.stroke();
    // rope
    const swing = Math.sin(phase) * h * 0.5;
    ctx.strokeStyle = rgba(C.pink, alpha * 0.6);
    ctx.lineWidth = size * 0.025;
    ctx.beginPath(); ctx.moveTo(-w, h * 0.2);
    ctx.quadraticCurveTo(0, h + swing, w, h * 0.2); ctx.stroke();
    ctx.restore();
  }

  const drawFns = [drawDumbbell, drawKettlebell, drawWeightPlate, drawBarbell, drawJumpRope];

  // ---------- FLOATING EQUIPMENT ----------
  const equipment = [];
  const EQUIPMENT_COUNT = 16;
  function spawnEquipment() {
    equipment.length = 0;
    for (let i = 0; i < EQUIPMENT_COUNT; i++) {
      equipment.push({
        x: Math.random() * (W || 800),
        y: Math.random() * (H || 600),
        size: 50 + Math.random() * 60,
        speed: 0.12 + Math.random() * 0.28,
        drift: (Math.random() - 0.5) * 0.25,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.004,
        alpha: 0.25 + Math.random() * 0.35,
        type: Math.floor(Math.random() * drawFns.length),
        phase: Math.random() * Math.PI * 2,
      });
    }
  }
  spawnEquipment();
  window.addEventListener('resize', () => { resize(); spawnEquipment(); });

  function updateEquipment() {
    for (const e of equipment) {
      e.y -= e.speed;
      e.x += e.drift;
      e.rotation += e.rotSpeed;
      e.phase += 0.015;
      if (e.y < -e.size) { e.y = H + e.size; e.x = Math.random() * W; }
      if (e.x < -e.size) e.x = W + e.size;
      if (e.x > W + e.size) e.x = -e.size;
    }
  }

  function drawEquipment() {
    for (const e of equipment) {
      drawFns[e.type](e.x, e.y, e.size, e.alpha, e.rotation + e.phase * 0.08);
    }
  }

  // ---------- ENERGY PULSE RINGS ----------
  const pulses = [];
  const MAX_PULSES = 4;
  function spawnPulse() {
    if (pulses.length >= MAX_PULSES) return;
    pulses.push({
      x: W * (0.15 + Math.random() * 0.7),
      y: H * (0.2 + Math.random() * 0.6),
      radius: 0,
      maxRadius: 100 + Math.random() * 150,
      alpha: 0.4 + Math.random() * 0.3,
      speed: 0.7 + Math.random() * 0.6,
    });
  }

  function updatePulses() {
    for (let i = pulses.length - 1; i >= 0; i--) {
      pulses[i].radius += pulses[i].speed;
      if (pulses[i].radius > pulses[i].maxRadius) pulses.splice(i, 1);
    }
  }

  function drawPulses() {
    for (const p of pulses) {
      const t = p.radius / p.maxRadius;
      const a = p.alpha * (1 - t);
      // outer ring
      ctx.strokeStyle = rgba(C.red, a);
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.stroke();
      // inner glow
      ctx.strokeStyle = rgba(C.orange, a * 0.4);
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * 0.65, 0, Math.PI * 2); ctx.stroke();
    }
  }

  let pulseTimer = 0;

  // ---------- RISING PARTICLES (sparks / energy) ----------
  const PARTICLE_COUNT = 50;
  const particlesArr = [];
  function makeParticle(randomY) {
    return {
      x: Math.random() * (W || 800),
      y: randomY ? Math.random() * (H || 600) : (H || 600) + Math.random() * 30,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(0.4 + Math.random() * 1.0),
      size: 1.5 + Math.random() * 3,
      alpha: 0.35 + Math.random() * 0.55,
      life: 0,
      maxLife: 180 + Math.random() * 260,
      color: Math.random() > 0.4 ? C.red : C.orange,
    };
  }
  for (let i = 0; i < PARTICLE_COUNT; i++) particlesArr.push(makeParticle(true));

  function updateParticles() {
    for (const p of particlesArr) {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      if (p.life > p.maxLife || p.y < -10) Object.assign(p, makeParticle(false));
    }
  }

  function drawParticles() {
    for (const p of particlesArr) {
      const t = p.life / p.maxLife;
      const fadeIn = Math.min(t * 5, 1);
      const fadeOut = t > 0.7 ? Math.max(1 - (t - 0.7) / 0.3, 0) : 1;
      const a = p.alpha * fadeIn * fadeOut;
      ctx.fillStyle = rgba(p.color, a);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      // glow
      if (p.size > 2.5) {
        ctx.fillStyle = rgba(p.color, a * 0.15);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  // ---------- HEARTBEAT / ECG LINE ----------
  let hbOffset = 0;

  function drawHeartbeat() {
    const baseY = H * 0.88;
    ctx.strokeStyle = rgba(C.red, 0.2);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const seg = 5;
    const count = Math.ceil(W / seg) + 12;
    for (let i = 0; i < count; i++) {
      const x = i * seg - (hbOffset % seg);
      const t = (i + hbOffset / seg) * 0.07;
      let y = baseY;
      const c = t % (Math.PI * 2);
      if (c > 2.5 && c < 2.8) y -= 20;
      else if (c > 2.8 && c < 3.0) y += 12;
      else if (c > 3.0 && c < 3.2) y -= 35;
      else if (c > 3.2 && c < 3.4) y += 18;
      else y += Math.sin(t * 3) * 1;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // ---------- MAIN ANIMATION LOOP ----------
  let raf = null;
  function animate() {
    // Re-measure in case layout changed
    resize();
    ctx.clearRect(0, 0, W, H);

    if (!prefersReducedMotion) {
      updateEquipment();
      updatePulses();
      updateParticles();
      hbOffset += 0.6;
      pulseTimer++;
      if (pulseTimer > 70) { spawnPulse(); pulseTimer = 0; }
    }

    drawEquipment();
    drawPulses();
    drawParticles();
    drawHeartbeat();

    raf = requestAnimationFrame(animate);
  }

  const observer = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) { resize(); if (!raf) animate(); }
      else { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    }
  }, { threshold: 0 });
  observer.observe(hero);
  // Fallback: if observer doesn't fire within 500ms, force start
  setTimeout(() => { if (!raf && W > 0 && H > 0) animate(); }, 500);

  if (prefersReducedMotion) {
    ctx.clearRect(0, 0, W, H);
    drawEquipment(); drawParticles();
  }
})();
