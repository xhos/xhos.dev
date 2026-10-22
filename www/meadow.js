const HORIZON = 0.46;
const LAYERS = [
  { roots: [0.44, 0.64], grow: 1, bias: 1.6, spacing: 7, width: 0, step: 0.8, sway: 0.55, reach: 0, k: 60, every: 2, far: true, tip: 0.5 },
  { roots: [0.55, 0.86], grow: 1, bias: 1.4, spacing: 9, width: 0, step: 0.6, sway: 0.8, reach: 0.5, k: 50, every: 1, far: true, tip: 0.5 },
  { roots: [0.8, 1.08], grow: 1.1, bias: 1, spacing: 17, width: 0, step: 0.5, sway: 1, reach: 1, k: 40, tufts: true, every: 1 },
  { at: [0.7, 0.86, 0.97], len: [0.35, 0.68], width: 0.9, step: 0.5, sway: 1.1, reach: 1.4, k: 22, tufts: true, every: 1 },
];
const LIFE = [
  { flowers: 5, x: [0.42, 0.98], root: [0.5, 0.6], stem: 1.7, head: 3.5, flies: 3, near: 0, fly: [0.4, 0.58], pace: 0.35 },
  { flowers: 3, x: [0.5, 0.95], root: [0.62, 0.8], stem: 1.8, head: 5, flies: 4, near: 0.25, fly: [0.48, 0.72], spread: 420, pace: 0.6 },
  { flowers: 2, x: [0.56, 0.84], root: [0.86, 1], stem: 1.8, head: 7, flies: 8, near: 0.6, fly: [0.45, 0.92], spread: 200, pace: 1 },
];
const PARALLAX = [2, 3, 4, 24];
const NAME = { parallax: 3, stretch: 1.6 };

const DOT = new Uint8Array([0x01, 0x08, 0x02, 0x10, 0x04, 0x20, 0x40, 0x80]);
const NONE = -0x80000000;
const utf16 = new TextDecoder('utf-16le');

function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(i) {
  i = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b);
  i ^= i >>> 13;
  i = Math.imul(i, 0xc2b2ae35);
  i ^= i >>> 16;
  return (i >>> 0) / 4294967296;
}

const smooth = (f) => f * f * (3 - 2 * f);

function noise1(x) {
  const i = Math.floor(x);
  const u = smooth(x - i);
  return hash(i) * (1 - u) + hash(i + 1) * u;
}

function noise2(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const ux = smooth(x - ix);
  const uy = smooth(y - iy);
  const h = (a, b) => hash(a + Math.imul(b, 0x27d4eb2d));
  const top = h(ix, iy) * (1 - ux) + h(ix + 1, iy) * ux;
  const bottom = h(ix, iy + 1) * (1 - ux) + h(ix + 1, iy + 1) * ux;
  return top * (1 - uy) + bottom * uy;
}

function spring(b, target, dt, k, c) {
  b.w += ((target - b.a) * k - b.w * c) * dt;
  b.a += b.w * dt;
}

const BIT = [[0x01, 0x08], [0x02, 0x10], [0x04, 0x20], [0x40, 0x80]];

class Dots {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.w = cols * 2;
    this.h = rows * 4;
    this.cells = new Uint8Array(cols * rows);
  }
  clear() {
    this.cells.fill(0);
  }
  set(x, y) {
    x = Math.round(x);
    y = Math.floor(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.cells[(y >> 2) * this.cols + (x >> 1)] |= BIT[y & 3][x & 1];
  }
}

function walk(l, b, a, cells, list = null, k = 0) {
  const { cols, w, h } = l.grass;
  const { step, width } = l.cfg;
  const len = b.len;
  const turn = (a * 1.4 * step * step) / (len * len);
  let c = Math.cos(a * 0.3);
  let s = Math.sin(a * 0.3);
  let tc = Math.cos(turn);
  let ts = Math.sin(turn);
  const gc = tc * tc - ts * ts;
  const gs = 2 * tc * ts;
  let x = b.x + 0.5;
  let y = b.y;
  for (let d = 0; d < len; d += step) {
    x += s * step;
    y -= c * step;
    if (width) {
      const half = width * (1 - d / len);
      for (let o = -half; o <= half; o += 0.6) {
        const px = x + c * o;
        const py = y + s * o;
        if (px >= 0 && py >= 0 && px < w && py < h) {
          const X = px | 0;
          const Y = py | 0;
          cells[(Y >> 2) * cols + (X >> 1)] |= DOT[((Y & 3) << 1) | (X & 1)];
        }
      }
    } else if (x >= 0 && y >= 0 && x < w && y < h) {
      const X = x | 0;
      const Y = y | 0;
      const i = (Y >> 2) * cols + (X >> 1);
      const bit = DOT[((Y & 3) << 1) | (X & 1)];
      cells[i] |= bit;
      if (list) list[k++] = (i << 8) | bit;
    }
    const nc = c * tc - s * ts;
    s = s * tc + c * ts;
    c = nc;
    const ntc = tc * gc - ts * gs;
    ts = ts * gc + tc * gs;
    tc = ntc;
  }
  return k;
}

function remember(blades, step, tip) {
  const n = blades.length;
  const at = new Int32Array(n + 1);
  blades.forEach((b, i) => (at[i + 1] = at[i] + Math.ceil(b.len / step) + 1));
  return { per: 0.77 / tip, at, end: new Int32Array(n), bend: new Int32Array(n).fill(NONE), dots: new Int32Array(at[n]) };
}

function recall(l, n, cells) {
  const b = l.blades[n];
  const { memo } = l;
  const { at, end, dots } = memo;
  const per = memo.per * b.len;
  const bend = Math.round((b.a - b.lean) * per);
  if (bend === memo.bend[n]) {
    for (let j = at[n]; j < end[n]; j++) cells[dots[j] >> 8] |= dots[j] & 255;
    return;
  }
  memo.bend[n] = bend;
  end[n] = walk(l, b, b.lean + bend / per, cells, dots, at[n]);
}

function tipOf(b) {
  let x = b.x;
  let y = b.y;
  const s = b.len / 12;
  for (let j = 1; j <= 12; j++) {
    const k = j / 12;
    const th = b.a * (0.3 + 1.4 * k * k);
    x += Math.sin(th) * s;
    y -= Math.cos(th) * s;
  }
  return [x, y];
}

function text({ cols, rows, cells }, out) {
  let n = 0;
  for (let r = 0; r < rows; r++) {
    const start = r * cols;
    let end = start + cols;
    if (r < rows - 1) while (end > start && !cells[end - 1]) end--;
    if (end === start && !n) continue;
    if (n) out[n++] = 10;
    for (let i = start; i < end; i++) out[n++] = cells[i] ? 0x2800 + cells[i] : 32;
  }
  return utf16.decode(out.subarray(0, n));
}

function mow({ mask, grass, shine }) {
  if (!mask) return;
  const g = grass.cells;
  const s = shine.cells;
  for (let i = 0; i < mask.length; i++) if (mask[i]) g[i] = s[i] = 0;
}

function show(l) {
  mow(l);
  [l.grass, l.shine].forEach((dots, j) => {
    const s = text(dots, l.out);
    if (s !== l.shown[j]) l.pres[j].textContent = l.shown[j] = s;
  });
}

function meadow(hero) {
  const sky = hero.querySelectorAll('.sky, .tagline');
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const system = matchMedia('(prefers-color-scheme: dark)');
  const isNight = () => (document.documentElement.dataset.theme ?? (system.matches ? 'dark' : 'light')) === 'dark';
  const p = { x: 0, y: 0, vx: 0, active: false, moved: 0, tap: false };
  const seen = new Map();
  let layers = [];
  let raf = 0;
  let last = 0;
  let frame = 0;
  let load = 1;
  let cost = 0;
  let onscreen = true;
  let tilt = 0;
  let night = isNight();
  let pull = 0.04;
  let lived = 0;

  const gust = (px, t) => Math.max(0, noise1(px * 0.0022 - t * 0.32) - 0.35) / 0.65;
  const tall = (deep) => deep * (0.08 + 0.5 * Math.min(1, deep / (1 - HORIZON)) ** 1.3);
  const horizon = (px) => HORIZON + 0.03 * (0.65 * noise1(px / 900 + 5) + 0.35 * noise1(px / 300 + 9.1) - 0.5);

  function letters(box) {
    const h1 = hero.querySelector('.sky h1');
    if (!h1) return null;
    const cs = getComputedStyle(h1);
    const pad = parseFloat(getComputedStyle(h1.parentElement).paddingLeft);
    const base = box.height * (1 - parseFloat(getComputedStyle(hero).getPropertyValue('--name-bottom')) / 100);
    const k = 0.5;
    const c = document.createElement('canvas');
    c.width = Math.ceil(box.width * k);
    c.height = Math.ceil(box.height * k);
    const g = c.getContext('2d');
    g.font = `${cs.fontWeight} ${parseFloat(cs.fontSize)}px ${cs.fontFamily}`;
    g.letterSpacing = cs.letterSpacing;
    const m = g.measureText(h1.textContent);
    g.scale(k, k);
    g.translate(pad, base);
    g.scale(NAME.stretch, 1);
    g.fillText(h1.textContent, m.actualBoundingBoxLeft, 0);
    const px = g.getImageData(0, 0, c.width, c.height).data;
    let ink = 0;
    find: for (; ink < c.width; ink++) for (let y = 0; y < c.height; y++) if (px[(y * c.width + ink) * 4 + 3] > 127) break find;
    const shift = ink - Math.round(pad * k);
    hero.classList.add('written');
    return (x, y) => {
      x = (x * k + shift) | 0;
      y = (y * k) | 0;
      return x >= 0 && y >= 0 && x < c.width && y < c.height && px[(y * c.width + x) * 4 + 3] > 127 ? 1 : 0;
    };
  }

  function measure(pre) {
    const probe = document.createElement('span');
    probe.textContent = '⣿'.repeat(16);
    probe.style.position = 'absolute';
    pre.append(probe);
    const cw = probe.getBoundingClientRect().width / 16;
    probe.remove();
    return cw;
  }

  function grow(cfg, i, box, W, H, dots, above, dw, dh, now) {
    const rand = rng(17 + i);
    const blades = [];
    const add = (x, y, lean, len) => blades.push({ x, y, len, lean, give: 0.6 + 0.8 * rand(), a: lean, w: 0, t: now });
    const fan = (x, y, len, k = 3 + Math.floor(rand() * 3)) => {
      for (let j = 0; j < k; j++) {
        const f = j / (k - 1) - 0.5;
        add(x + f * (1 + cfg.width), y, f * 1.3, typeof len === 'function' ? len() : len * (0.75 + 0.25 * rand()));
      }
    };
    if (cfg.at) {
      for (const at of cfg.at) {
        const x = W * (at + (rand() - 0.5) * 0.03);
        rand();
        fan(x, H, () => H * (cfg.len[0] + (cfg.len[1] - cfg.len[0]) * rand()));
      }
      return blades;
    }
    const [a, b] = cfg.roots;
    const patch = (px, f) => noise2(px / 320 + i * 13, f * 14 + i * 5);
    const count = Math.round((W * (b - a) * dots) / cfg.spacing ** 2);
    for (let n = 0; n < count; n++) {
      const x = rand() * W;
      const px = x * dw;
      const f = a + (b - a) * rand() ** cfg.bias;
      const deep = f - horizon(px);
      if (deep < 0.004) continue;
      const pt = patch(px, f);
      if (rand() < 0.3 * (1 - pt)) continue;
      const y = (f * box.height - above) / dh;
      const len = dots * tall(deep) * cfg.grow * (0.75 + 0.5 * rand()) * (0.6 + 0.65 * pt);
      if (cfg.tufts) fan(x, y, len);
      else add(x, y, (rand() - 0.5) * 0.9, len);
    }
    return blades;
  }

  function build() {
    last = 0;
    const box = hero.getBoundingClientRect();
    const now = performance.now() / 1000;
    const name = letters(box);
    layers = LAYERS.map((cfg, i) => {
      const [gp, sp] = hero.querySelectorAll(`pre[data-layer="${i}"]:not(.life)`);
      const cw = measure(gp);
      const lh = parseFloat(getComputedStyle(gp).lineHeight);
      const r = gp.getBoundingClientRect();
      const cols = Math.ceil(r.width / cw);
      const rows = Math.floor(r.height / lh);
      const grass = new Dots(cols, rows);
      const dh = lh / 4;
      const above = box.height - rows * lh;
      const blades = grow(cfg, i, box, grass.w, grass.h, box.height / dh, above, cw / 2, dh, now);
      const l = {
        cfg,
        i,
        pres: [gp, sp],
        depth: gp.parentElement,
        shown: ['', ''],
        out: new Uint16Array(rows * (cols + 1)),
        grass,
        shine: new Dots(cols, rows),
        back: [new Dots(cols, rows), new Dots(cols, rows)],
        blades,
        memo: cfg.tip && !cfg.width ? remember(blades, cfg.step, cfg.tip) : null,
        next: 0,
        share: blades.length,
        dw: cw / 2,
        dh,
        left: r.left - box.left + (r.width - cols * cw) / 2,
        top: r.top - box.top + r.height - rows * lh,
      };
      if (name) {
        l.mask = new Uint8Array(cols * rows);
        for (let row = 0; row < rows; row++)
          for (let col = 0; col < cols; col++) l.mask[row * cols + col] = name(l.left + (col + 0.5) * cw, l.top + (row + 0.5) * lh);
      }
      if (LIFE[i]) born(l, LIFE[i], box, above, now);
      draw(l);
      if (l.life) drawLife(l);
      return l;
    });
  }

  function born(l, c, box, above, now) {
    const pre = hero.querySelector(`pre.life[data-layer="${l.i}"]`);
    if (!pre) return;
    const { cols, rows, w } = l.grass;
    const lh = l.dh * 4;
    const lrows = Math.floor(pre.getBoundingClientRect().height / lh);
    const rand = rng(91 + l.i);
    const L = {
      c,
      rand,
      pre,
      dots: new Dots(cols, lrows),
      out: new Uint16Array(lrows * (cols + 1)),
      shown: '',
      lift: (lrows - rows) * 4,
      top: box.height - lrows * lh,
      flowers: [],
      flying: [],
      flies: [],
    };
    for (let j = 0; j < c.flowers; j++) {
      const x = w * (c.x[0] + ((c.x[1] - c.x[0]) * (j + 0.15 + 0.7 * rand())) / c.flowers);
      const f = c.root[0] + (c.root[1] - c.root[0]) * rand();
      const deep = f - horizon(x * l.dw);
      if (deep < 0.01) continue;
      const lean = (rand() - 0.5) * 0.25;
      const len = (box.height / l.dh) * tall(deep) * c.stem * (0.85 + 0.3 * rand());
      const seeds = [];
      for (let k = 0; k < 20; k++) seeds.push({ ang: (k / 20) * Math.PI * 2 + rand() * 0.2, on: true });
      L.flowers.push({ stem: { x, y: (f * box.height - above) / l.dh, len, lean, give: 0.5, a: lean, w: 0, t: now }, seeds, lost: -1e9, regrow: 0 });
    }
    const clumps = LAYERS[3].at.map((at) => at * (box.width + 80) - 40);
    for (let n = Math.round((c.flies * box.width) / 1920); n > 0; n--) {
      const hx = rand() < c.near ? clumps[Math.floor(rand() * clumps.length)] + (rand() - 0.5) * c.spread : rand() * box.width;
      const hy = box.height * (c.fly[0] + (c.fly[1] - c.fly[0]) * rand());
      L.flies.push({
        hx,
        hy,
        x: (hx - l.left) / l.dw,
        y: (hy - L.top) / l.dh,
        ph: rand() * Math.PI * 2,
        om: (Math.PI * 2) / (2.6 + 1.6 * rand()),
        id: rand() * 1000,
      });
    }
    l.life = L;
  }

  function step(l, b, t) {
    const { cfg, dw, dh, left, top } = l;
    const reach = 120 * cfg.reach;
    const g = gust(left + b.x * dw, t);
    let target = b.lean + b.give * cfg.sway * (0.12 + 0.75 * g * g + 0.05 * Math.sin(t * 2.4 + b.x * 0.1));
    if (p.active && reach) {
      const dx = left + b.x * dw - p.x;
      const root = top + b.y * dh;
      const tip = root - b.len * 0.7 * dh;
      const dy = Math.max(0, tip - p.y, p.y - root);
      const f = Math.exp(-(dx * dx + dy * dy) / (reach * reach));
      target += f * (Math.sign(dx || 1) * 0.8 + Math.max(-0.8, Math.min(0.8, p.vx / 700)));
    }
    const dt = Math.min(0.2, Math.max(0, t - b.t));
    const n = Math.max(1, Math.round(dt * 30));
    for (let j = 0; j < n; j++) spring(b, target, dt / n, cfg.k, 5);
    b.t = t;
  }

  function draw(l, t) {
    const { blades, memo, cfg } = l;
    const [grass, shine] = l.back;
    if (!l.next) {
      grass.clear();
      shine.clear();
    }
    const stop = Math.min(blades.length, l.next + l.share);
    for (let n = l.next; n < stop; n++) {
      const b = blades[n];
      if (t) step(l, b, t);
      const cells = (b.a - b.lean > 0.55 * cfg.sway ? shine : grass).cells;
      if (memo) recall(l, n, cells);
      else walk(l, b, b.a, cells);
    }
    l.next = stop;
    if (stop < blades.length) return;
    l.next = -1;
    if (l.life && !night) for (const fl of l.life.flowers) walk(l, fl.stem, fl.stem.a, grass.cells);
    [l.grass, l.back[0]] = [grass, l.grass];
    [l.shine, l.back[1]] = [shine, l.shine];
    if (t && cfg.far) l.ready = true;
    else show(l);
  }

  function flies(all, t, dt) {
    pull += ((p.active ? 3 : 0.04) - pull) * Math.min(1, dt * (p.active ? 1.5 : 0.12));
    let mx = 0;
    let my = 0;
    let n = 0;
    for (const l of all)
      for (const f of l.life.flies) {
        mx += Math.cos(f.ph);
        my += Math.sin(f.ph);
        n++;
      }
    const order = Math.hypot(mx, my) / (n || 1);
    const mean = Math.atan2(my, mx);
    const tap = p.tap;
    p.tap = false;
    for (const l of all) {
      const L = l.life;
      const { pace } = L.c;
      const w = l.grass.w;
      for (const f of L.flies) {
        f.ph += (f.om + pull * order * Math.sin(mean - f.ph)) * dt;
        if (tap) f.ph = Math.atan2(Math.sin(f.ph), Math.cos(f.ph)) * 0.2;
        const h = noise1(f.id + t * 0.15) * Math.PI * 4;
        const fx = l.left + f.x * l.dw;
        const fy = L.top + f.y * l.dh;
        let vx = Math.cos(h) * 30 * pace + (f.hx - fx) * 0.3;
        let vy = Math.sin(h) * 18 * pace + (f.hy - fy) * 0.3;
        if (p.active) {
          const d = Math.hypot(p.x - fx, p.y - fy);
          if (d > 6 && d < 250) {
            vx += ((p.x - fx) / d) * 22 * pace;
            vy += ((p.y - fy) / d) * 14 * pace;
          }
        }
        f.x += (vx / l.dw) * dt;
        f.y += (vy / l.dh) * dt;
        if (f.x < -2) f.x += w + 4;
        if (f.x > w + 2) f.x -= w + 4;
      }
    }
  }

  function dandelions(all, t, dt) {
    const speed = Math.abs(p.vx);
    const k = 1 - Math.exp(-1.5 * dt);
    for (const l of all) {
      const L = l.life;
      const { pace, head } = L.c;
      const rand = L.rand;
      const sy = l.dw / l.dh;
      for (const fl of L.flowers) {
        step(l, fl.stem, t);
        const [hx, hy] = tipOf(fl.stem);
        const px = l.left + hx * l.dw;
        const py = l.top + hy * l.dh;
        const R = 40 + head * l.dw * 2;
        const d = p.active ? Math.hypot(p.x - px, p.y - py) : Infinity;
        const g = gust(px, t);
        for (const s of fl.seeds) {
          if (!s.on) continue;
          let go = rand() < 0.4 * dt * Math.max(0, g - 0.6);
          if (d < R) go ||= rand() < (0.3 + speed / 500) * (1 - d / R) * dt * 6;
          if (!go) continue;
          s.on = false;
          fl.lost = t;
          const ox = Math.cos(s.ang);
          const oy = Math.sin(s.ang);
          L.flying.push({
            x: hx + ox * head,
            y: hy + L.lift + oy * head * sy,
            vx: (ox * 20 + (d < R ? p.vx * 0.2 : 0)) / l.dw,
            vy: (oy * 20) / l.dh,
            age: 0,
            id: rand() * 1000,
          });
        }
        if (t - fl.lost > 6 && t > fl.regrow) {
          const bare = fl.seeds.filter((s) => !s.on);
          if (bare.length) bare[Math.floor(rand() * bare.length)].on = true;
          fl.regrow = t + 0.25;
        }
      }
      for (const s of L.flying) {
        const g = gust(l.left + s.x * l.dw, t);
        s.vx += (((25 + 150 * g) * pace) / l.dw - s.vx) * k;
        s.vy += (((-10 + 30 * (noise1(s.id + t * 0.5) - 0.6)) * pace) / l.dh - s.vy) * k;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.age += dt;
      }
      const { w, h } = L.dots;
      L.flying = L.flying.filter((s) => s.x < w + 2 && s.x > -2 && s.y > 0 && s.y < h && s.age < 25).slice(-150);
    }
  }

  function live(t) {
    const dt = Math.min(0.1, t - lived);
    lived = t;
    const all = layers.filter((l) => l.life && seen.get(l.depth) !== false);
    if (night) flies(all, t, dt);
    else dandelions(all, t, dt);
    for (const l of all) drawLife(l);
  }

  function drawLife(l) {
    const L = l.life;
    const D = L.dots;
    D.clear();
    if (night) {
      for (const f of L.flies) {
        const lit = Math.max(0, Math.cos(f.ph)) ** 6;
        const col = Math.floor(f.x / 2);
        const row = Math.floor(f.y / 4);
        if (lit > 0.1 && col >= 0 && col < D.cols && row >= 0 && row < D.rows) D.cells[row * D.cols + col] |= lit > 0.6 ? 0xff : lit > 0.3 ? 0x36 : 0x10;
      }
    } else {
      const { head } = L.c;
      const sy = l.dw / l.dh;
      for (const fl of L.flowers) {
        let [hx, hy] = tipOf(fl.stem);
        hy += L.lift;
        D.set(hx, hy);
        for (const s of fl.seeds) {
          if (!s.on) continue;
          const ox = Math.cos(s.ang);
          const oy = Math.sin(s.ang) * sy;
          for (let r = 1; r <= head; r += 0.75) D.set(hx + ox * r, hy + oy * r);
        }
      }
      for (const s of L.flying) {
        D.set(s.x, s.y);
        if (l.i) D.set(s.x, s.y + 1);
      }
    }
    const s = text(D, L.out);
    if (s !== L.shown) L.pre.textContent = L.shown = s;
  }

  function turn() {
    if (isNight() === night) return;
    night = !night;
    for (const l of layers) {
      if (!l.life) continue;
      l.next = 0;
      l.share = l.blades.length;
      draw(l);
      drawLife(l);
    }
  }

  const snap = (v) => Math.round(v * devicePixelRatio) / devicePixelRatio;

  function place() {
    for (const l of layers) l.depth.style.transform = `translateX(${snap(-tilt * PARALLAX[l.i])}px)`;
    for (const e of sky) e.style.transform = `translateX(${snap(-tilt * NAME.parallax)}px)`;
  }

  function tick(t) {
    raf = 0;
    if (!onscreen || still.matches) return;
    raf = requestAnimationFrame(tick);
    if (t - last < 30) {
      const l = layers.find((l) => l.ready);
      if (l) {
        l.ready = false;
        show(l);
      }
      return;
    }
    last = t;
    for (const l of layers)
      if (l.ready) {
        l.ready = false;
        show(l);
      }
    if (cost > 8) load = Math.min(4, load + 0.1);
    else if (cost < 5) load = Math.max(1, load - 0.02);
    const begin = performance.now();
    frame++;
    if (performance.now() - p.moved > 60) p.vx *= 0.7;
    tilt += ((p.active ? (p.x / hero.clientWidth) * 2 - 1 : 0) - tilt) * 0.06;
    for (const l of layers) {
      if (l.next < 0) {
        if (seen.get(l.depth) === false) continue;
        const ticks = l.cfg.far ? l.cfg.every * Math.round(load) : load < 2.5 ? 1 : 2;
        if ((frame + l.i) % ticks) continue;
        l.next = 0;
        l.share = Math.ceil(l.blades.length / ticks);
      }
      draw(l, t / 1000);
    }
    live(t / 1000);
    cost += (performance.now() - begin - cost) * 0.1;
    place();
  }

  function go() {
    if (!layers.length || still.matches || raf || !onscreen) return;
    last = 0;
    raf = requestAnimationFrame(tick);
  }

  const rebuild = () => {
    build();
    go();
  };

  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = e.clientX - r.left;
    if (p.active && e.timeStamp > p.moved) p.vx = 0.5 * p.vx + (0.5 * (x - p.x) * 1000) / Math.max(8, e.timeStamp - p.moved);
    p.x = x;
    p.y = e.clientY - r.top;
    p.moved = e.timeStamp;
    p.active = true;
  });
  hero.addEventListener('pointerdown', () => (p.tap = true));
  hero.addEventListener('pointerleave', () => (p.active = false));
  hero.addEventListener('pointercancel', () => (p.active = false));
  still.addEventListener('change', go);
  system.addEventListener('change', turn);
  new MutationObserver(turn).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  new ResizeObserver(rebuild).observe(hero);
  Promise.all([document.fonts.load('1em "Iosevka xhos"', '⣿'), document.fonts.load('800 1em "Iosevka Aile xhos"', 'xhos')]).then(rebuild);
  new IntersectionObserver(([e]) => {
    onscreen = e.isIntersecting;
    go();
  }).observe(hero);
  const depths = new IntersectionObserver((es) => es.forEach((e) => seen.set(e.target, e.isIntersecting)));
  hero.querySelectorAll('.depth').forEach((d) => depths.observe(d));
}

const hero = document.querySelector('.meadow');
if (hero) meadow(hero);
