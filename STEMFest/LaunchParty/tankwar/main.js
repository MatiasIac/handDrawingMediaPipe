/* Tank Combat - HTML5 Canvas, vector-style rendering */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const hud = {
  pScore: document.getElementById('pScore'),
  eScore: document.getElementById('eScore'),
};

// Resize canvas to fill the screen
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.floor(window.innerWidth);
  const h = Math.floor(window.innerHeight);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

// Utilities
const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const angleWrap = (a) => {
  while (a <= -Math.PI) a += TAU;
  while (a > Math.PI) a -= TAU;
  return a;
};
const angleTo = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1);
const angDiff = (a, b) => angleWrap(b - a);

// Input
const Keys = {
  left: false, right: false, up: false, down: false, fire: false
};
window.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowLeft': case 'KeyA': Keys.left = true; break;
    case 'ArrowRight': case 'KeyD': Keys.right = true; break;
    case 'ArrowUp': case 'KeyW': Keys.up = true; break;
    case 'ArrowDown': case 'KeyS': Keys.down = true; break;
    case 'Space': Keys.fire = true; e.preventDefault(); break;
  }
});
window.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowLeft': case 'KeyA': Keys.left = false; break;
    case 'ArrowRight': case 'KeyD': Keys.right = false; break;
    case 'ArrowUp': case 'KeyW': Keys.up = false; break;
    case 'ArrowDown': case 'KeyS': Keys.down = false; break;
    case 'Space': Keys.fire = false; break;
  }
});

// World + Maze (normalized 0..1 positions; scaled to canvas each frame)
// A simple maze: borders, corridors and blocks
const maze = [
  // Outer frame bars
  { x: 0.05, y: 0.05, w: 0.90, h: 0.02 },
  { x: 0.05, y: 0.93, w: 0.90, h: 0.02 },
  { x: 0.05, y: 0.07, w: 0.02, h: 0.86 },
  { x: 0.93, y: 0.07, w: 0.02, h: 0.86 },
  // Horizontal corridors
  { x: 0.15, y: 0.22, w: 0.70, h: 0.02 },
  { x: 0.15, y: 0.50, w: 0.70, h: 0.02 },
  { x: 0.15, y: 0.78, w: 0.70, h: 0.02 },
  // Vertical blockers/gates
  { x: 0.28, y: 0.22, w: 0.02, h: 0.20 },
  { x: 0.60, y: 0.50, w: 0.02, h: 0.20 },
  { x: 0.42, y: 0.58, w: 0.02, h: 0.20 },
  { x: 0.74, y: 0.30, w: 0.02, h: 0.20 },
  // Center box with gaps
  { x: 0.40, y: 0.35, w: 0.20, h: 0.02 },
  { x: 0.40, y: 0.35, w: 0.02, h: 0.20 },
  { x: 0.58, y: 0.35, w: 0.02, h: 0.20 },
  { x: 0.40, y: 0.53, w: 0.20, h: 0.02 },
];

function wallPx(rect) {
  return {
    x: rect.x * canvas.clientWidth,
    y: rect.y * canvas.clientHeight,
    w: rect.w * canvas.clientWidth,
    h: rect.h * canvas.clientHeight,
  };
}

// Collision helpers
function circleRectCollision(cx, cy, r, rx, ry, rw, rh) {
  const nearestX = clamp(cx, rx, rx + rw);
  const nearestY = clamp(cy, ry, ry + rh);
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  const dist2 = dx * dx + dy * dy;
  return dist2 <= r * r;
}

function resolveCircleRect(cx, cy, r, rx, ry, rw, rh) {
  // Returns corrected (x,y) if intersecting, else same
  const insideX = cx > rx && cx < rx + rw;
  const insideY = cy > ry && cy < ry + rh;
  const nearestX = clamp(cx, rx, rx + rw);
  const nearestY = clamp(cy, ry, ry + rh);
  let dx = cx - nearestX;
  let dy = cy - nearestY;
  const d2 = dx * dx + dy * dy;
  const r2 = r * r;
  if (d2 > r2) return { x: cx, y: cy };
  // If center is inside the rectangle, push out along the smallest penetration
  if (insideX && insideY) {
    const leftPen = Math.abs(cx - rx) + 1e-6;
    const rightPen = Math.abs(rx + rw - cx) + 1e-6;
    const topPen = Math.abs(cy - ry) + 1e-6;
    const botPen = Math.abs(ry + rh - cy) + 1e-6;
    const minPen = Math.min(leftPen, rightPen, topPen, botPen);
    if (minPen === leftPen) return { x: rx - r, y: cy };
    if (minPen === rightPen) return { x: rx + rw + r, y: cy };
    if (minPen === topPen) return { x: cx, y: ry - r };
    return { x: cx, y: ry + rh + r };
  }
  // Otherwise, push out along the normal from the closest point
  const d = Math.max(Math.sqrt(Math.max(d2, 1e-8)), 1e-8);
  const nx = dx / d;
  const ny = dy / d;
  const px = nearestX + nx * r;
  const py = nearestY + ny * r;
  return { x: px, y: py };
}

function segSeg(a, b, c, d) {
  // Returns true if segments AB and CD intersect
  const r = { x: b.x - a.x, y: b.y - a.y };
  const s = { x: d.x - c.x, y: d.y - c.y };
  const rxs = r.x * s.y - r.y * s.x;
  const qpxr = (c.x - a.x) * r.y - (c.y - a.y) * r.x;
  if (Math.abs(rxs) < 1e-8 && Math.abs(qpxr) < 1e-8) {
    // Colinear: check overlap
    const t0 = ((c.x - a.x) * r.x + (c.y - a.y) * r.y) / (r.x * r.x + r.y * r.y);
    const t1 = t0 + (s.x * r.x + s.y * r.y) / (r.x * r.x + r.y * r.y);
    const tmin = Math.min(t0, t1), tmax = Math.max(t0, t1);
    return !(tmax < 0 || tmin > 1);
  }
  if (Math.abs(rxs) < 1e-8) return false; // parallel
  const t = ((c.x - a.x) * s.y - (c.y - a.y) * s.x) / rxs;
  const u = ((c.x - a.x) * r.y - (c.y - a.y) * r.x) / rxs;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

function segRectIntersects(p0, p1, rx, ry, rw, rh) {
  // Check if segment intersects any side of rect
  const rectInside = (x, y) => x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
  if (rectInside(p0.x, p0.y) || rectInside(p1.x, p1.y)) return true;
  const r1 = { x: rx, y: ry }, r2 = { x: rx + rw, y: ry }, r3 = { x: rx + rw, y: ry + rh }, r4 = { x: rx, y: ry + rh };
  return (
    segSeg(p0, p1, r1, r2) ||
    segSeg(p0, p1, r2, r3) ||
    segSeg(p0, p1, r3, r4) ||
    segSeg(p0, p1, r4, r1)
  );
}

function segCircleIntersects(p0, p1, cx, cy, r) {
  // Distance from circle center to segment <= r
  const vx = p1.x - p0.x, vy = p1.y - p0.y;
  const wx = cx - p0.x, wy = cy - p0.y;
  const vv = vx * vx + vy * vy;
  const t = clamp((wx * vx + wy * vy) / (vv || 1), 0, 1);
  const px = p0.x + vx * t, py = p0.y + vy * t;
  const dx = cx - px, dy = cy - py;
  return dx * dx + dy * dy <= r * r;
}

// Rendering helpers
function roundedRectPath(x, y, w, h, r) {
  const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

function drawWall(rect) {
  const { x, y, w, h } = wallPx(rect);
  const pad = Math.max(2, Math.min(w, h) * 0.05);
  // Base
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, '#2a364a');
  grad.addColorStop(1, '#182131');
  ctx.fillStyle = grad;
  ctx.strokeStyle = '#6fb1ff22';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#0008';
  ctx.shadowBlur = 10;
  roundedRectPath(x + pad, y + pad, w - pad * 2, h - pad * 2, Math.min(w, h) * 0.15);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.stroke();
}

class Bullet {
  constructor(x, y, vx, vy, color) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.r = 5;
    this.life = 3.5; // seconds max
    this.color = color;
    this.alive = true;
  }
  update(dt) {
    if (!this.alive) return;
    const nx = this.x + this.vx * dt;
    const ny = this.y + this.vy * dt;
    const p0 = { x: this.x, y: this.y }, p1 = { x: nx, y: ny };
    // Check walls
    for (const m of maze) {
      const { x, y, w, h } = wallPx(m);
      if (segRectIntersects(p0, p1, x, y, w, h)) {
        this.alive = false;
        spawnExplosion(this.x, this.y);
        return;
      }
    }
    // Out of bounds
    if (nx < 0 || ny < 0 || nx > canvas.clientWidth || ny > canvas.clientHeight) {
      this.alive = false;
      return;
    }
    this.x = nx; this.y = ny;
    this.life -= dt;
    if (this.life <= 0) this.alive = false;
  }
  draw() {
    if (!this.alive) return;
    ctx.save();
    ctx.shadowColor = this.color + 'aa';
    ctx.shadowBlur = 12;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, TAU);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }
}

class Tank {
  constructor(x, y, color) {
    this.x = x; this.y = y;
    this.angle = 0;
    this.speed = 0;
    this.radius = 20;
    this.color = color;
    this.turnSpeed = 2.5; // rad/s
    this.moveSpeed = 180; // px/s (scaled by screen but stays proportional)
    this.bullet = null; // Only one at a time
  }
  canFire() { return !this.bullet || !this.bullet.alive; }
  fire() {
    if (!this.canFire()) return null;
    const muzzle = 26; // offset from center forward
    const bx = this.x + Math.cos(this.angle) * (this.radius + muzzle);
    const by = this.y + Math.sin(this.angle) * (this.radius + muzzle);
    const speed = 520; // px/s
    const vx = Math.cos(this.angle) * speed;
    const vy = Math.sin(this.angle) * speed;
    const b = new Bullet(bx, by, vx, vy, this.color);
    this.bullet = b;
    bullets.push(b);
    return b;
  }
  updateMovement(dt, inputLeft, inputRight, inputForward, inputBackward) {
    // Rotation
    if (inputLeft) this.angle -= this.turnSpeed * dt;
    if (inputRight) this.angle += this.turnSpeed * dt;
    this.angle = angleWrap(this.angle);

    // Translation
    let v = 0;
    if (inputForward) v += 1;
    if (inputBackward) v -= 1;
    const spd = this.moveSpeed * v;
    const nx = this.x + Math.cos(this.angle) * spd * dt;
    const ny = this.y + Math.sin(this.angle) * spd * dt;

    // Try move, resolve against maze
    let rx = nx, ry = ny;
    for (const m of maze) {
      const { x, y, w, h } = wallPx(m);
      if (circleRectCollision(rx, ry, this.radius, x, y, w, h)) {
        const p = resolveCircleRect(rx, ry, this.radius, x, y, w, h);
        rx = p.x; ry = p.y;
      }
    }
    // Keep in bounds
    rx = clamp(rx, this.radius + 2, canvas.clientWidth - this.radius - 2);
    ry = clamp(ry, this.radius + 2, canvas.clientHeight - this.radius - 2);
    this.x = rx; this.y = ry;
  }
  draw() {
    const x = this.x, y = this.y, r = this.radius;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.angle);
    // Shadow
    ctx.shadowColor = '#0008';
    ctx.shadowBlur = 10;
    // Hull
    const hullW = r * 2.1, hullH = r * 1.3;
    roundedRectPath(-hullW/2, -hullH/2, hullW, hullH, r * 0.3);
    const grad = ctx.createLinearGradient(-hullW/2, -hullH/2, hullW/2, hullH/2);
    grad.addColorStop(0, lighten(this.color, 0.25));
    grad.addColorStop(1, this.color);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff22';
    ctx.stroke();
    // Tracks
    ctx.strokeStyle = '#00000033';
    ctx.lineWidth = 3;
    for (let i = -3; i <= 3; i += 3) {
      ctx.beginPath();
      ctx.moveTo(-hullW/2 + 6, i);
      ctx.lineTo(hullW/2 - 6, i);
      ctx.stroke();
    }
    // Turret base
    ctx.fillStyle = lighten(this.color, 0.05);
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.55, 0, TAU);
    ctx.fill();
    // Barrel
    ctx.fillStyle = lighten(this.color, 0.15);
    roundedRectPath(r * 0.3, -r * 0.15, r * 1.2, r * 0.3, r * 0.15);
    ctx.fill();
    // Nose highlight
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#ffffff33';
    roundedRectPath(-hullW/2, -hullH*0.25, hullW * 0.5, hullH * 0.5, r * 0.25);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

function lighten(hex, amt) {
  // hex like #RRGGBB; returns lighter color
  const h = hex.replace('#','');
  const r = clamp(parseInt(h.substring(0,2),16) + Math.floor(255 * amt), 0, 255);
  const g = clamp(parseInt(h.substring(2,4),16) + Math.floor(255 * amt), 0, 255);
  const b = clamp(parseInt(h.substring(4,6),16) + Math.floor(255 * amt), 0, 255);
  return '#' + r.toString(16).padStart(2,'0') + g.toString(16).padStart(2,'0') + b.toString(16).padStart(2,'0');
}

// Game state
const player = new Tank(0, 0, '#5eead4'); // teal
const enemy = new Tank(0, 0, '#f472b6');   // pink
let bullets = [];
let explosions = [];
let scores = { p: 0, e: 0 };

function spawnExplosion(x, y) {
  explosions.push({ x, y, t: 0, dur: 0.35 });
}

function resetPositions() {
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  player.x = W * 0.15; player.y = H * 0.85; player.angle = -Math.PI/4;
  enemy.x = W * 0.85; enemy.y = H * 0.15; enemy.angle = Math.PI*3/4;
  bullets = [];
  player.bullet = null;
  enemy.bullet = null;
}

function hasLineOfSight(ax, ay, bx, by) {
  const p0 = { x: ax, y: ay }, p1 = { x: bx, y: by };
  for (const m of maze) {
    const { x, y, w, h } = wallPx(m);
    if (segRectIntersects(p0, p1, x, y, w, h)) return false;
  }
  return true;
}

// Simple AI controller
let aiTimer = 0;
let aiState = 'chase';
let aiTurnDir = 0; // -1..1
function updateAI(dt) {
  const targetAng = angleTo(enemy.x, enemy.y, player.x, player.y);
  const diff = angDiff(enemy.angle, targetAng);
  const sight = hasLineOfSight(enemy.x, enemy.y, player.x, player.y);

  if (sight) {
    // Face player and move forward
    const turn = clamp(diff, -1, 1);
    enemy.updateMovement(dt, turn < 0, turn > 0, true, false);
    if (enemy.canFire() && Math.abs(diff) < 0.2) {
      enemy.fire();
    }
  } else {
    // Wander: simple obstacle avoidance
    aiTimer -= dt;
    if (aiTimer <= 0) {
      aiTimer = 0.8 + Math.random() * 0.9;
      aiTurnDir = Math.random() < 0.5 ? -1 : 1;
    }
    enemy.updateMovement(dt, aiTurnDir < 0, aiTurnDir > 0, true, false);
  }
}

// Handle bullet vs tank hits and bullets vs walls (already in bullet.update)
function handleCombat(dt) {
  // Update bullets
  for (const b of bullets) b.update(dt);
  bullets = bullets.filter(b => b.alive);

  // Check hits
  for (const b of bullets) {
    const p0 = { x: b.x - b.vx * dt, y: b.y - b.vy * dt };
    const p1 = { x: b.x, y: b.y };
    if (segCircleIntersects(p0, p1, player.x, player.y, player.radius)) {
      // Who shot? If enemy's bullet color == enemy.color
      if (b.color === enemy.color) {
        scores.e += 1; hud.eScore.textContent = scores.e;
        spawnExplosion(player.x, player.y);
        resetPositions();
        return;
      }
    }
    if (segCircleIntersects(p0, p1, enemy.x, enemy.y, enemy.radius)) {
      if (b.color === player.color) {
        scores.p += 1; hud.pScore.textContent = scores.p;
        spawnExplosion(enemy.x, enemy.y);
        resetPositions();
        return;
      }
    }
  }
}

function drawExplosions(dt) {
  const remain = [];
  for (const ex of explosions) {
    ex.t += dt;
    if (ex.t < ex.dur) {
      remain.push(ex);
      const k = ex.t / ex.dur;
      const R = 20 + 60 * k;
      ctx.save();
      ctx.globalAlpha = 1 - k;
      const grad = ctx.createRadialGradient(ex.x, ex.y, R * 0.1, ex.x, ex.y, R);
      grad.addColorStop(0, '#ffd29eaa');
      grad.addColorStop(0.6, '#ff9d4daa');
      grad.addColorStop(1, '#ff5a5a00');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ex.x, ex.y, R, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
  }
  explosions = remain;
}

// Game loop
let last = performance.now();
resetPositions();
function frame(t) {
  const dt = Math.min(0.033, (t - last) / 1000);
  last = t;

  // Clear
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  // Background grid lines for vector aesthetic
  drawBackdrop();

  // Update player
  player.updateMovement(dt, Keys.left, Keys.right, Keys.up, Keys.down);
  if (Keys.fire) { player.fire(); Keys.fire = false; }

  // Update AI
  updateAI(dt);

  // Combat
  handleCombat(dt);

  // Draw maze
  for (const m of maze) drawWall(m);

  // Draw tanks and bullets
  for (const b of bullets) b.draw();
  player.draw();
  enemy.draw();

  drawExplosions(dt);

  // Foreground vignette
  drawVignette();

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

function drawBackdrop() {
  const W = canvas.clientWidth, H = canvas.clientHeight;
  // Subtle glow backdrop
  const g = ctx.createRadialGradient(W*0.7, H*0.2, 60, W*0.7, H*0.2, Math.max(W, H));
  g.addColorStop(0, '#0a1220');
  g.addColorStop(1, '#060a12');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Thin grid
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#6fb1ff11';
  const step = Math.max(32, Math.floor(Math.min(W, H) / 20));
  ctx.beginPath();
  for (let x = 0; x <= W; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
  for (let y = 0; y <= H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke();
}

function drawVignette() {
  const W = canvas.clientWidth, H = canvas.clientHeight;
  const v = ctx.createLinearGradient(0, 0, 0, H);
  v.addColorStop(0, '#00000055');
  v.addColorStop(0.08, '#00000000');
  v.addColorStop(0.92, '#00000000');
  v.addColorStop(1, '#00000055');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}
