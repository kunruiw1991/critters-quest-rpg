'use strict';
/* Small shared helpers: seeded RNG, value noise, easing, binary heap, A* pathfinding. */
const U = (() => {
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash2(x, y, s) {
    let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 982451653)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  function vnoise(x, y, s) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s), c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function fbm(x, y, s) {
    return vnoise(x, y, s) * 0.6 + vnoise(x * 2.1, y * 2.1, s + 7) * 0.3 + vnoise(x * 4.3, y * 4.3, s + 13) * 0.1;
  }
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = t => 1 - (1 - t) * (1 - t);
  const easeIn = t => t * t;
  const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const easeOutBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length) % arr.length]; }
  function weighted(rng, pairs) {
    let tot = 0;
    for (const p of pairs) tot += p[1];
    let r = rng() * tot;
    for (const p of pairs) { r -= p[1]; if (r <= 0) return p[0]; }
    return pairs[pairs.length - 1][0];
  }
  function randInt(rng, a, b) { return a + Math.floor(rng() * (b - a + 1)); }

  class MinHeap {
    constructor() { this.k = []; this.v = []; }
    get size() { return this.k.length; }
    push(key, val) {
      const k = this.k, v = this.v;
      let i = k.length; k.push(key); v.push(val);
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (k[p] <= key) break;
        k[i] = k[p]; v[i] = v[p]; i = p;
      }
      k[i] = key; v[i] = val;
    }
    pop() {
      const k = this.k, v = this.v;
      const top = v[0];
      const lk = k.pop(), lv = v.pop();
      if (k.length) {
        let i = 0; const n = k.length;
        for (;;) {
          const l = 2 * i + 1, r = l + 1;
          let m = i, mk = lk;
          if (l < n && k[l] < mk) { m = l; mk = k[l]; }
          if (r < n && k[r] < mk) { m = r; mk = k[r]; }
          if (m === i) break;
          k[i] = k[m]; v[i] = v[m]; i = m;
        }
        k[i] = lk; v[i] = lv;
      }
      return top;
    }
  }

  /**
   * A* on a 4-connected grid. cost(x,y) -> 0 (blocked) or >= 1.
   * If the goal is unreachable, returns the path to the reachable tile closest to the goal.
   * Returns { path: [[x,y], ...] (excluding start), reached: bool }.
   */
  function astar(W, H, cost, sx, sy, tx, ty, opts) {
    opts = opts || {};
    const N = W * H;
    const g = new Float32Array(N).fill(Infinity);
    const came = new Int32Array(N).fill(-1);
    const closed = new Uint8Array(N);
    const heap = new MinHeap();
    const s = sy * W + sx, goal = ty * W + tx;
    const h = (x, y) => Math.abs(x - tx) + Math.abs(y - ty);
    g[s] = 0; heap.push(h(sx, sy), s);
    let best = s, bestH = h(sx, sy), bestG = 0;
    let expanded = 0;
    const maxNodes = opts.maxNodes || N;
    const goalOk = opts.goalAlwaysOk;
    while (heap.size) {
      const cur = heap.pop();
      if (closed[cur]) continue;
      closed[cur] = 1;
      if (cur === goal) { best = cur; bestH = 0; break; }
      const cx = cur % W, cy = (cur / W) | 0;
      const ch = h(cx, cy);
      if (ch < bestH || (ch === bestH && g[cur] < bestG)) { best = cur; bestH = ch; bestG = g[cur]; }
      if (++expanded > maxNodes) break;
      for (let d = 0; d < 4; d++) {
        const nx = cx + (d === 0 ? 1 : d === 1 ? -1 : 0);
        const ny = cy + (d === 2 ? 1 : d === 3 ? -1 : 0);
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const ni = ny * W + nx;
        if (closed[ni]) continue;
        let c = cost(nx, ny);
        if (!c) { if (goalOk && ni === goal) c = 1; else continue; }
        const ng = g[cur] + c;
        if (ng < g[ni]) {
          g[ni] = ng; came[ni] = cur;
          heap.push(ng + h(nx, ny) * 1.001, ni);
        }
      }
    }
    const path = [];
    let c = best;
    while (c !== s && c >= 0) { path.push([c % W, (c / W) | 0]); c = came[c]; }
    path.reverse();
    return { path, reached: best === goal };
  }

  function fmt(n) { return String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  return { mulberry32, hash2, vnoise, fbm, clamp, lerp, easeOut, easeIn, easeInOut, easeOutBack, pick, weighted, randInt, MinHeap, astar, fmt, escapeHtml };
})();
if (typeof window !== 'undefined') window.U = U;

