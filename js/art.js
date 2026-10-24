'use strict';
/* ==========================================================================
 * Art: procedural tile atlas, map objects, characters, critter medallions,
 * rare-variant portrait recoloring, and the world minimap.
 * All drawing is done in "world units" (48 per tile) and cached at device res.
 * ========================================================================== */
const Art = (() => {
  const TS = 48;
  const T = World.T;
  let S = 1, tpx = 48;
  const tileCache = new Map();
  const objCache = new Map();
  const portraits = {};
  const PI2 = Math.PI * 2;

  const PAL = {
    1: { g: '#8fd16a', gd: '#73b955', gl: '#aee486', t1: '#4f9f3d', t2: '#3c8a30', t3: '#6cc04f', p: '#ddd3c0', pd: '#bcae95', pl: '#efe8da', sand: '#f3e2a6', sandd: '#e3cc88', tree: '#4caf4a', treed: '#2f8a36', treel: '#7fd36a' },
    2: { g: '#7cc35a', gd: '#62a945', gl: '#98d673', t1: '#3e8f34', t2: '#2d7a29', t3: '#5aae45', p: '#c9a26b', pd: '#a9844f', pl: '#ddbb86', sand: '#f0dc9c', sandd: '#dcc382', tree: '#3c9b3b', treed: '#277329', treel: '#62bf54' },
    3: { g: '#9ad87a', gd: '#7fc362', gl: '#b5e797', t1: '#77bd61', t2: '#5aa24f', t3: '#8fd06f', p: '#d7b98a', pd: '#b99a6c', pl: '#e9d3ac', sand: '#f7e6a8', sandd: '#e9d189', tree: '#46b04c', treed: '#2f8a39', treel: '#7ad36c' },
    4: { g: '#b2e6a4', gd: '#96d58c', gl: '#cff3c2', t1: '#f59fd0', t2: '#9fbfff', t3: '#ffe08a', p: '#efe4fa', pd: '#d4c3ea', pl: '#fbf6ff', sand: '#f6ebc6', sandd: '#e8d9a8', tree: '#7fd09a', treed: '#55b07a', treel: '#b5ecc3' },
    5: { g: '#a8cf60', gd: '#8db84b', gl: '#c1e07d', t1: '#6b9d2f', t2: '#557f22', t3: '#86b83d', p: '#d6b98b', pd: '#b8996b', pl: '#e8d3ad', sand: '#efdca0', sandd: '#dcc483', tree: '#5a9e36', treed: '#3e7d25', treel: '#86c25a' },
    6: { g: '#c9c06a', gd: '#b0a752', gl: '#ddd685', t1: '#c9a246', t2: '#a6812d', t3: '#e0bd62', p: '#f3dba8', pd: '#ddbf86', pl: '#fbebc6', sand: '#ecbb77', sandd: '#d69f5a', tree: '#7aa83e', treed: '#56842a', treel: '#9fc85c', cliff: '#c47b3e', cliffd: '#97572a', cliffl: '#e6a666' },
    7: { g: '#eaf3fb', gd: '#d1e3f2', gl: '#ffffff', t1: '#bfe2f5', t2: '#8fc4e6', t3: '#e3f4ff', p: '#e4eef8', pd: '#c8d7e8', pl: '#f4f8fc', sand: '#eef5fc', sandd: '#d6e5f2', tree: '#3f7f6a', treed: '#2b5e4e', treel: '#5f9e88', cliff: '#9cc3df', cliffd: '#6e9bbf', cliffl: '#e2f3ff' },
    8: { g: '#92b9a6', gd: '#7aa290', gl: '#aed0bf', t1: '#9a77e0', t2: '#c6a6f6', t3: '#7f5fd0', p: '#d2cbee', pd: '#b3aada', pl: '#e8e3fa', sand: '#e9e1c8', sandd: '#d6ccaf', tree: '#5b6fb8', treed: '#3f4f96', treel: '#8296dc', floor: '#c4bbe6', floord: '#ab9fd3' },
    9: { g: '#88cd64', gd: '#6fb84f', gl: '#a2dd7d', t1: '#479a3b', t2: '#36852f', t3: '#5fb24a', p: '#d6bc8b', pd: '#b99f6f', pl: '#e8d3aa', sand: '#f1dfa0', sandd: '#ddc785', tree: '#47a446', treed: '#2f7f33', treel: '#73c962' },
    // Honmoon Island: mint-teal lawns, lightstick tall grass, lavender city cobbles, plum concert floor.
    10: { g: '#86d9bd', gd: '#68c4a5', gl: '#aaeed6', t1: '#ff5fa8', t2: '#a46bff', t3: '#ffcf3a', p: '#cbbcf0', pd: '#9d8cd3', pl: '#e6dcfd', sand: '#f7e4d0', sandd: '#e8cbb0', tree: '#3fb08e', treed: '#2a8c70', treel: '#72d4b0', floor: '#4b2a63', floord: '#3d2152', plaza: '#f8dfd0', plazad: '#e6c0b0', plazal: '#fff1e8' },
    // Zone 11 (Derpy's Minhwa Sanctum & Bathhouse Valley): celadon-jade grass, blue-and-gold minhwa tall grass, warm hanji-paper stone paths.
    11: { g: '#7fd4b8', gd: '#5eb89c', gl: '#a8eed7', t1: '#3f8fe0', t2: '#ffc93c', t3: '#56c2a6', p: '#efe2c8', pd: '#cfbda0', pl: '#fbf3e4', sand: '#f5e4be', sandd: '#dfc99e', tree: '#3b9b78', treed: '#267357', treel: '#6cd1aa', plaza: '#f5e6cf', plazad: '#dcc5a4', plazal: '#fff6e8' },
    // Zone 12 (Nightmare Critters Carnival & Twilight Hollow): twilight-violet grass, neon carnival tall grass, purple cobbles, dark midway floor.
    12: { g: '#78b894', gd: '#5c9c78', gl: '#9ad4b2', t1: '#c76bff', t2: '#ff5ca8', t3: '#45d1f5', p: '#c7b5ea', pd: '#9d88c9', pl: '#e3d7fa', sand: '#e8d8ee', sandd: '#cbb6d6', tree: '#5a6fb8', treed: '#3e4f94', treel: '#8598e0', floor: '#3d2358', floord: '#2d1842', plaza: '#e6d6f5', plazad: '#c6b0de', plazal: '#f6edff' },
    // Zone 13 (Kanto Classics Bay & Pallet Meadow): classic bright Kanto emerald grass, Viridian tall grass, warm Pallet cobbles.
    13: { g: '#7ed968', gd: '#61be4c', gl: '#a1eb8e', t1: '#3fa34d', t2: '#2d853a', t3: '#68cc5c', p: '#e8d6b3', pd: '#c9b38b', pl: '#f7ecd4', sand: '#f7e5a6', sandd: '#e3cc84', tree: '#42a846', treed: '#2b8030', treel: '#70cf68', plaza: '#f2e8d5', plazad: '#d6c6aa', plazal: '#fffaf0' },
    // Zone 14 (Johto Bell-Tower Groves & Ecruteak Lake — Gen 2): golden-autumn meadow grass, amber/crimson maple tall grass, warm Ecruteak flagstones.
    14: { g: '#a3d165', gd: '#85b548', gl: '#c2e887', t1: '#f59e0b', t2: '#e85d3f', t3: '#84cc16', p: '#ecd9bd', pd: '#cbb494', pl: '#faf0e1', sand: '#f5e2ad', sandd: '#dec68a', tree: '#d97724', treed: '#a85214', treel: '#f5a642', plaza: '#f6ead6', plazad: '#d9c6a8', plazal: '#fff8ec' },
    // Zone 15 (Hoenn Sky-Pillar Tropics & Sootopolis Lagoon — Gen 3): vibrant tropical emerald grass, cyan-hibiscus tall grass, coral sand.
    15: { g: '#68d68b', gd: '#4cb870', gl: '#92ebae', t1: '#10b981', t2: '#38bdf8', t3: '#f472b6', p: '#e6d8b5', pd: '#c4b48c', pl: '#f7efda', sand: '#faeaad', sandd: '#e6d18a', tree: '#2ea866', treed: '#1e7d49', treel: '#5cd692', plaza: '#e8f5ee', plazad: '#c2ded0', plazal: '#f7fcf9' },
    // Zone 16 (Sinnoh Spear-Pillar Peaks & Twinleaf Glade — Gen 4): crisp alpine meadow grass, celestial indigo-and-gold tall grass, white marble Hall of Origin floor.
    16: { g: '#7dc9a6', gd: '#5ead8a', gl: '#a3e2c4', t1: '#6366f1', t2: '#facc15', t3: '#60a5fa', p: '#dce3f0', pd: '#b8c3d8', pl: '#f0f4fc', sand: '#e8eef7', sandd: '#cbd5e6', tree: '#3b7a6b', treed: '#27594d', treel: '#5ca391', floor: '#e8ecf7', floord: '#c7d0e6', plaza: '#eef2fa', plazad: '#cdd6e8', plazal: '#ffffff' },
  };
  const GREY_CLIFF = { cliff: '#a3a39b', cliffd: '#76766e', cliffl: '#cfcfc6' };

  function setScale(s) {
    const nt = Math.max(16, Math.round(TS * s));
    if (nt === tpx && tileCache.size) return;
    tpx = nt; S = tpx / TS;
    tileCache.clear(); objCache.clear();
  }
  function mk(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
  function rnd(seed) { return U.mulberry32(seed); }
  function shade(hex, amt) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const n = parseInt(c, 16);
    const r = U.clamp((n >> 16) + amt, 0, 255), g = U.clamp(((n >> 8) & 255) + amt, 0, 255), b = U.clamp((n & 255) + amt, 0, 255);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  function ell(c, x, y, rx, ry) { c.beginPath(); c.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), 0, 0, PI2); }
  function circ(c, x, y, r) { c.beginPath(); c.arc(x, y, Math.max(0.01, r), 0, PI2); }
  function rr(c, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
  }
  function shadow(c, x, y, rx, ry, a) { c.fillStyle = 'rgba(0,0,0,' + (a || 0.2) + ')'; ell(c, x, y, rx, ry); c.fill(); }
  function star(c, x, y, r1, r2, n, rot) {
    c.beginPath();
    for (let k = 0; k < n * 2; k++) {
      const a = (rot || -Math.PI / 2) + k * Math.PI / n;
      const r = k % 2 ? r2 : r1;
      c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    c.closePath();
  }
  function sparkle(c, x, y, r) {
    c.beginPath();
    c.moveTo(x, y - r); c.quadraticCurveTo(x, y, x + r, y); c.quadraticCurveTo(x, y, x, y + r); c.quadraticCurveTo(x, y, x - r, y); c.quadraticCurveTo(x, y, x, y - r);
    c.fill();
  }
  function heart(c, x, y, s) {
    c.beginPath();
    c.moveTo(x, y + s * 0.35);
    c.bezierCurveTo(x - s * 1.1, y - s * 0.35, x - s * 0.45, y - s * 1.05, x, y - s * 0.45);
    c.bezierCurveTo(x + s * 0.45, y - s * 1.05, x + s * 1.1, y - s * 0.35, x, y + s * 0.35);
    c.fill();
  }

  /* ======================= TILES ======================= */
  function blade(c, x, y, h) {
    c.beginPath(); c.moveTo(x - 1.6, y + h * 0.4); c.lineTo(x - 0.4, y - h * 0.6); c.lineTo(x + 0.6, y + h * 0.4); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(x + 0.4, y + h * 0.4); c.lineTo(x + 2.4, y - h * 0.3); c.lineTo(x + 2.2, y + h * 0.4); c.closePath(); c.fill();
  }
  function grassBase(c, p, v) {
    c.fillStyle = p.g; c.fillRect(0, 0, 48, 48);
    const r = rnd(v * 7919 + 17);
    c.fillStyle = p.gd;
    for (let k = 0; k < 7; k++) blade(c, r() * 42 + 3, r() * 40 + 4, 5);
    c.fillStyle = p.gl;
    for (let k = 0; k < 4; k++) c.fillRect(r() * 44 + 2, r() * 44 + 2, 2.4, 2.4);
  }
  function sandBase(c, p, v, z) {
    c.fillStyle = p.sand; c.fillRect(0, 0, 48, 48);
    const r = rnd(v * 3571 + 5);
    c.fillStyle = p.sandd;
    for (let k = 0; k < 10; k++) c.fillRect(r() * 46, r() * 46, 1.8, 1.8);
    if (z === 6) {
      c.strokeStyle = p.sandd; c.lineWidth = 1.4;
      for (let k = 0; k < 2; k++) { const y = 10 + k * 20 + r() * 6; c.beginPath(); c.moveTo(4, y); c.quadraticCurveTo(24, y - 5, 44, y); c.stroke(); }
    }
    c.fillStyle = 'rgba(255,255,255,.4)';
    for (let k = 0; k < 4; k++) c.fillRect(r() * 46, r() * 46, 1.6, 1.6);
  }
  function snowBase(c, v) {
    const p = PAL[7];
    c.fillStyle = p.g; c.fillRect(0, 0, 48, 48);
    const r = rnd(v * 1237 + 3);
    c.fillStyle = p.gd;
    for (let k = 0; k < 3; k++) { ell(c, r() * 40 + 4, r() * 40 + 4, 7, 2.6); c.fill(); }
    c.fillStyle = '#ffffff';
    for (let k = 0; k < 3; k++) sparkle(c, r() * 42 + 3, r() * 42 + 3, 1.8);
  }
  function leaf(c, x, y, h, sw) {
    c.beginPath(); c.moveTo(x - 2.4, y);
    c.quadraticCurveTo(x - 1 + sw * 0.3, y - h * 0.55, x + sw, y - h);
    c.quadraticCurveTo(x + 1 + sw * 0.3, y - h * 0.5, x + 2.4, y);
    c.closePath(); c.fill();
  }
  function tallTile(c, z, v, f) {
    const p = PAL[z] || PAL[9];
    if (z === 6 || z === 3) sandBase(c, p, v, z); else if (z === 7) snowBase(c, v); else grassBase(c, p, v);
    const sway = f ? 1.8 : -1.1;
    const rows = [17, 31, 45];
    rows.forEach((y, ri) => {
      for (let k = 0; k < 4; k++) {
        const x = 6 + k * 12 + (ri % 2) * 6 - 3;
        if (z === 4) {
          c.strokeStyle = '#5fb86a'; c.lineWidth = 1.6;
          c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + sway * 0.5, y - 7, x + sway, y - 13); c.stroke();
          c.fillStyle = [p.t1, p.t2, p.t3][(k + ri + v) % 3];
          for (let a = 0; a < 5; a++) { circ(c, x + sway + Math.cos(a * 1.256) * 3, y - 13 + Math.sin(a * 1.256) * 3, 2.4); c.fill(); }
          c.fillStyle = '#fff6c8'; circ(c, x + sway, y - 13, 1.6); c.fill();
          c.fillStyle = '#4fae5e'; leaf(c, x - 2, y, 6, -2); leaf(c, x + 2, y, 6, 2);
        } else if (z === 8) {
          c.strokeStyle = '#5f8f6c'; c.lineWidth = 1.4;
          c.beginPath(); c.moveTo(x, y); c.lineTo(x + sway, y - 14); c.stroke();
          for (let s = 0; s < 4; s++) { c.fillStyle = s % 2 ? p.t2 : p.t1; ell(c, x + sway * (0.5 + s * 0.15), y - 7 - s * 2.6, 2.3, 1.8); c.fill(); }
          c.fillStyle = '#6e9e7a'; leaf(c, x - 3, y, 7, -2); leaf(c, x + 3, y, 7, 2);
        } else if (z === 6) {
          c.strokeStyle = p.t2; c.lineWidth = 1.3;
          for (let a = -2; a <= 2; a++) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + a * 3 + sway, y - 10 + Math.abs(a)); c.stroke(); }
          c.strokeStyle = p.t3; c.lineWidth = 1;
          for (let a = -1; a <= 1; a++) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + a * 4 + sway, y - 12); c.stroke(); }
        } else if (z === 7) {
          c.fillStyle = p.t2; leaf(c, x - 3, y, 10, sway - 2); leaf(c, x + 3, y, 9, sway + 2);
          c.fillStyle = p.t1; leaf(c, x, y, 12, sway);
          c.fillStyle = '#ffffff'; sparkle(c, x + sway, y - 12, 1.6);
        } else if (z === 10) {
          // "lightstick" grass: lush teal tufts, every other one topped with a glowing pink / violet / gold bulb
          c.fillStyle = '#3f9f80'; leaf(c, x - 4, y, 11, sway - 1.5); leaf(c, x + 4, y, 10, sway + 1.5);
          c.fillStyle = '#56b896'; leaf(c, x, y, 12.5, sway); leaf(c, x - 2, y, 9.5, sway - 0.6);
          c.fillStyle = '#7fd4b4'; leaf(c, x + 2, y, 8, sway + 0.8);
          if ((k + ri + v) % 2 === 0) {
            const bx = x + 1 + sway * 1.1, by = y - 15.5;
            c.strokeStyle = '#2f8a6c'; c.lineWidth = 1.2;
            c.beginPath(); c.moveTo(x + 1, y - 4); c.quadraticCurveTo(x + 1 + sway * 0.5, y - 10, bx, by + 2.2); c.stroke();
            const tip = [p.t1, p.t2, p.t3][(k + ri * 2 + v) % 3];
            c.globalAlpha = 0.22; c.fillStyle = tip; circ(c, bx, by, 3.9); c.fill(); c.globalAlpha = 1;
            c.fillStyle = tip; ell(c, bx, by, 2.1, 2.7); c.fill();
            c.fillStyle = 'rgba(255,255,255,.88)'; ell(c, bx - 0.7, by - 0.9, 0.7, 1.1); c.fill();
          }
        } else {
          c.fillStyle = p.t2; leaf(c, x - 4, y, 11, sway - 1.5); leaf(c, x + 4, y, 10, sway + 1.5);
          c.fillStyle = p.t1; leaf(c, x, y, 13, sway); leaf(c, x - 2, y, 10, sway - 0.6);
          c.fillStyle = p.t3; leaf(c, x + 2, y, 8, sway + 0.8);
        }
      }
    });
  }
  function pathTile(c, z, v) {
    const p = PAL[z] || PAL[9];
    if (z === 1 || z === 8) {
      c.fillStyle = p.pd; c.fillRect(0, 0, 48, 48);
      const r = rnd(v * 31 + 7);
      for (let row = 0; row < 3; row++) for (let col = -1; col < 3; col++) {
        const x = col * 17 + (row % 2) * 8 + 2 + r() * 2, y = row * 16 + 1.5;
        c.fillStyle = p.p; rr(c, x, y, 14.5, 13, 4); c.fill();
        c.fillStyle = p.pl; rr(c, x + 1.5, y + 1, 10, 3.5, 2); c.fill();
      }
    } else if (z === 4) {
      c.fillStyle = '#e7f6df'; c.fillRect(0, 0, 48, 48);
      const cols = ['#ffd0ea', '#d9ccff', '#c8f2e0', '#fff1b8'];
      const pos = [[12, 12], [34, 16], [16, 34], [36, 37]];
      pos.forEach(([x, y], k) => { c.fillStyle = cols[(k + v) % 4]; ell(c, x, y, 9.5, 8); c.fill(); c.fillStyle = 'rgba(255,255,255,.7)'; ell(c, x - 2, y - 3, 4, 2); c.fill(); });
    } else if (z === 7) {
      c.fillStyle = p.p; c.fillRect(0, 0, 48, 48);
      c.fillStyle = p.pd;
      const r = rnd(v * 13 + 1);
      for (let k = 0; k < 3; k++) { const x = 8 + r() * 30, y = 6 + k * 14; ell(c, x, y, 3, 4.5); c.fill(); ell(c, x + 9, y + 5, 3, 4.5); c.fill(); }
    } else if (z === 10) {
      // Seoul city setts: small lavender squares in running bond, a few pink / periwinkle stones
      c.fillStyle = p.pd; c.fillRect(0, 0, 48, 48);
      const r = rnd(v * 53 + 11);
      for (let row = 0; row < 4; row++) for (let col = -1; col < 4; col++) {
        const x = col * 12 + (row % 2) * 6 + 0.8, y = row * 12 + 0.8;
        if (x > 47 || x + 10.4 < 0) continue;
        const edge = row % 2 && (col < 0 || col === 3);
        const tint = edge ? 1 : r();
        c.fillStyle = tint < 0.1 ? '#f4c6e4' : tint < 0.19 ? '#bfcdf6' : p.p;
        rr(c, x, y, 10.4, 10.4, 2.6); c.fill();
        c.fillStyle = 'rgba(80,60,140,.12)'; rr(c, x + 1, y + 7.2, 8.4, 2.4, 1.2); c.fill();
        c.fillStyle = p.pl; rr(c, x + 1.4, y + 1.2, 6, 2.2, 1.1); c.fill();
      }
    } else {
      c.fillStyle = p.p; c.fillRect(0, 0, 48, 48);
      const r = rnd(v * 977 + 3);
      c.fillStyle = p.pd;
      for (let k = 0; k < 9; k++) { ell(c, r() * 46, r() * 46, 1.4 + r() * 1.6, 1 + r()); c.fill(); }
      c.fillStyle = p.pl;
      for (let k = 0; k < 6; k++) { ell(c, r() * 46, r() * 46, 1.2 + r(), 0.9); c.fill(); }
    }
  }
  function waterTile(c, deep, f, edges, z) {
    const base = deep ? '#2f86d6' : (z === 4 ? '#7fd8ec' : '#6fd2e6');
    c.fillStyle = base; c.fillRect(0, 0, 48, 48);
    if (!deep) {
      const r = rnd(z * 11 + 5);
      c.fillStyle = 'rgba(255,255,255,.18)';
      for (let k = 0; k < 6; k++) { ell(c, r() * 46, r() * 46, 2.2, 1.3); c.fill(); }
    }
    c.strokeStyle = deep ? 'rgba(140,200,255,.55)' : 'rgba(255,255,255,.55)';
    c.lineWidth = 1.6; c.lineCap = 'round';
    const off = f * 4;
    for (let k = 0; k < 3; k++) {
      const y = 9 + k * 15, x = ((k * 17 + off) % 40) + 2;
      c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 4, y - 3, x + 8, y); c.stroke();
    }
    if (edges) {
      const band = deep ? 'rgba(111,210,230,.85)' : 'rgba(255,255,255,.85)';
      c.fillStyle = band;
      const w = deep ? 7 : 4;
      const wob = (k) => (Math.sin(k * 0.6 + f * 1.4) + 1) * 1.2;
      if (edges & 1) for (let k = 0; k < 48; k += 4) c.fillRect(k, 0, 4.2, w + wob(k));
      if (edges & 4) for (let k = 0; k < 48; k += 4) { const h = w + wob(k); c.fillRect(k, 48 - h, 4.2, h); }
      if (edges & 8) for (let k = 0; k < 48; k += 4) c.fillRect(0, k, w + wob(k), 4.2);
      if (edges & 2) for (let k = 0; k < 48; k += 4) { const h = w + wob(k); c.fillRect(48 - h, k, h, 4.2); }
    }
  }
  function bridgeTile(c, horiz, z) {
    c.fillStyle = '#b98149'; c.fillRect(0, 0, 48, 48);
    c.strokeStyle = '#8a5a30'; c.lineWidth = 1.6;
    for (let k = 0; k <= 48; k += 8) { c.beginPath(); if (horiz) { c.moveTo(k, 0); c.lineTo(k, 48); } else { c.moveTo(0, k); c.lineTo(48, k); } c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,.12)';
    for (let k = 0; k < 48; k += 8) { if (horiz) c.fillRect(k + 1.5, 0, 2, 48); else c.fillRect(0, k + 1.5, 48, 2); }
    c.fillStyle = '#6e4322';
    if (horiz) { c.fillRect(0, 0, 48, 3); c.fillRect(0, 45, 48, 3); } else { c.fillRect(0, 0, 3, 48); c.fillRect(45, 0, 3, 48); }
    c.fillStyle = '#5a3418';
    for (let k = 4; k < 48; k += 16) { if (horiz) { circ(c, k, 1.5, 1.2); c.fill(); circ(c, k, 46.5, 1.2); c.fill(); } else { circ(c, 1.5, k, 1.2); c.fill(); circ(c, 46.5, k, 1.2); c.fill(); } }
  }
  function cliffTile(c, z, v, edges) {
    const p = z === 6 ? PAL[6] : z === 7 ? PAL[7] : GREY_CLIFF;
    c.fillStyle = p.cliff; c.fillRect(0, 0, 48, 48);
    c.strokeStyle = p.cliffd; c.lineWidth = 2;
    const r = rnd(v * 71 + z);
    for (let k = 0; k < 3; k++) {
      const y = 12 + k * 13 + r() * 3;
      c.beginPath(); c.moveTo(0, y); c.quadraticCurveTo(16, y - 3 + r() * 6, 30, y + 1); c.quadraticCurveTo(40, y + 2, 48, y - 1); c.stroke();
    }
    c.fillStyle = 'rgba(255,255,255,.14)';
    for (let k = 0; k < 4; k++) { ell(c, r() * 44 + 2, r() * 44 + 2, 3, 1.4); c.fill(); }
    if (z === 7) { c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.moveTo(8, 40); c.lineTo(16, 18); c.lineTo(20, 40); c.fill(); }
    if (edges & 1) { c.fillStyle = p.cliffl; c.fillRect(0, 0, 48, 9); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(0, 9, 48, 2); }
    if (edges & 4) { c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(0, 42, 48, 6); }
    if (edges & 8) { c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(0, 0, 3, 48); }
    if (edges & 2) { c.fillStyle = 'rgba(0,0,0,.15)'; c.fillRect(45, 0, 3, 48); }
  }
  function iceTile(c, v, edges) {
    c.fillStyle = '#c6ecff'; c.fillRect(0, 0, 48, 48);
    c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(6 + v * 3, 40); c.lineTo(20 + v * 3, 26); c.stroke();
    c.beginPath(); c.moveTo(24, 44); c.lineTo(42, 26); c.stroke();
    c.strokeStyle = 'rgba(120,180,220,.6)'; c.lineWidth = 1;
    c.beginPath(); c.moveTo(30, 6); c.lineTo(26, 14); c.lineTo(32, 20); c.stroke();
    if (edges) { c.strokeStyle = '#ffffff'; c.lineWidth = 3; c.beginPath(); if (edges & 1) { c.moveTo(0, 1.5); c.lineTo(48, 1.5); } if (edges & 4) { c.moveTo(0, 46.5); c.lineTo(48, 46.5); } if (edges & 8) { c.moveTo(1.5, 0); c.lineTo(1.5, 48); } if (edges & 2) { c.moveTo(46.5, 0); c.lineTo(46.5, 48); } c.stroke(); }
  }
  function flowersTile(c, z, v) {
    const p = PAL[z] || PAL[4];
    grassBase(c, p, v);
    const r = rnd(v * 113 + 9);
    const cols = z === 10 ? ['#ff5fa8', '#ffcf3a', '#ffffff', '#b48bff', '#ffb3d1', '#7fe3cf'] : ['#ff7ab8', '#ffd84d', '#ffffff', '#9fb8ff', '#ff9f43', '#c58bff'];
    for (let k = 0; k < 9; k++) {
      const x = r() * 40 + 4, y = r() * 40 + 4;
      c.fillStyle = cols[(k + v) % cols.length];
      for (let a = 0; a < 5; a++) { circ(c, x + Math.cos(a * 1.256) * 2.4, y + Math.sin(a * 1.256) * 2.4, 1.9); c.fill(); }
      c.fillStyle = '#fff2a8'; circ(c, x, y, 1.3); c.fill();
    }
  }
  function honmoonPlaza(c, v) {
    // warm pastel slabs with little golden star inlays
    const p = PAL[10];
    c.fillStyle = p.plaza; c.fillRect(0, 0, 48, 48);
    c.fillStyle = 'rgba(255,170,205,.26)'; c.fillRect(0, 0, 24, 24); c.fillRect(24, 24, 24, 24);
    c.fillStyle = p.plazal; c.fillRect(2.5, 2.5, 19, 2.6); c.fillRect(26.5, 2.5, 19, 2.6); c.fillRect(2.5, 26.5, 19, 2.6); c.fillRect(26.5, 26.5, 19, 2.6);
    c.strokeStyle = p.plazad; c.lineWidth = 1.5;
    c.strokeRect(0.75, 0.75, 22.5, 22.5); c.strokeRect(24.75, 0.75, 22.5, 22.5); c.strokeRect(0.75, 24.75, 22.5, 22.5); c.strokeRect(24.75, 24.75, 22.5, 22.5);
    if (v === 0 || v === 3) {
      c.fillStyle = '#d99a17'; star(c, 24, 24.6, 6, 2.6, 5); c.fill();
      c.fillStyle = '#ffcf3a'; star(c, 24, 24, 5.2, 2.2, 5); c.fill();
      c.fillStyle = '#fff3b8'; circ(c, 22.8, 22.6, 1); c.fill();
    } else if (v === 1) {
      c.fillStyle = '#ffcf3a'; star(c, 12, 36, 2.6, 1.1, 4, 0); c.fill(); star(c, 36, 12, 2, 0.9, 4, 0); c.fill();
    }
  }
  function stageFloor(c, v) {
    // glossy plum concert floor with golden seams
    const p = PAL[10];
    c.fillStyle = p.floor; c.fillRect(0, 0, 48, 48);
    c.fillStyle = p.floord; c.fillRect(0, 0, 24, 24); c.fillRect(24, 24, 24, 24);
    c.fillStyle = 'rgba(255,255,255,.07)';
    for (const [x, y] of [[0, 0], [24, 0], [0, 24], [24, 24]]) { c.beginPath(); c.moveTo(x + 2, y + 13); c.lineTo(x + 13, y + 2); c.lineTo(x + 18, y + 2); c.lineTo(x + 2, y + 18); c.closePath(); c.fill(); }
    c.strokeStyle = 'rgba(255,207,58,.35)'; c.lineWidth = 1;
    c.beginPath(); c.moveTo(24, 0); c.lineTo(24, 48); c.moveTo(0, 24); c.lineTo(48, 24); c.stroke();
    c.strokeStyle = 'rgba(255,207,58,.85)'; c.lineWidth = 1.2; c.strokeRect(0.6, 0.6, 46.8, 46.8);
    if (v === 1) { c.fillStyle = '#ffcf3a'; star(c, 36, 12, 4.5, 2, 5); c.fill(); }
    else if (v === 3) { c.fillStyle = 'rgba(255,140,210,.9)'; sparkle(c, 12, 36, 3.4); }
  }
  function petal(c, x, y, s, a) {
    c.save(); c.translate(x, y); c.rotate(a);
    c.beginPath(); c.moveTo(0, s);
    c.quadraticCurveTo(-s * 1.15, s * 0.1, -s * 0.42, -s); c.lineTo(0, -s * 0.6); c.lineTo(s * 0.42, -s);
    c.quadraticCurveTo(s * 1.15, s * 0.1, 0, s); c.closePath(); c.fill();
    c.restore();
  }
  function musicNote(c, x, y, s) {
    // eighth note ♪ (head at x,y)
    c.beginPath(); c.ellipse(x, y, s * 0.62, s * 0.45, -0.45, 0, PI2); c.fill();
    c.fillRect(x + s * 0.42, y - s * 2.3, s * 0.26, s * 2.3);
    c.beginPath(); c.moveTo(x + s * 0.68, y - s * 2.3);
    c.quadraticCurveTo(x + s * 1.65, y - s * 1.75, x + s * 1.3, y - s * 0.9);
    c.quadraticCurveTo(x + s * 1.35, y - s * 1.45, x + s * 0.68, y - s * 1.6); c.closePath(); c.fill();
  }
  function floorTile(c, z, v, plaza) {
    if (z === 10 || z === 11) return plaza ? honmoonPlaza(c, v) : stageFloor(c, v);
    if (z === 12 && !plaza) return stageFloor(c, v);
    if (plaza) {
      c.fillStyle = '#eadfc6'; c.fillRect(0, 0, 48, 48);
      c.strokeStyle = '#d4c3a2'; c.lineWidth = 1.5;
      c.strokeRect(0.75, 0.75, 22.5, 22.5); c.strokeRect(24.75, 0.75, 22.5, 22.5); c.strokeRect(0.75, 24.75, 22.5, 22.5); c.strokeRect(24.75, 24.75, 22.5, 22.5);
      if (v === 0) { c.fillStyle = '#ffb3c7'; heart(c, 12, 13, 5); }
      if (v === 2) { c.fillStyle = '#ffd36b'; circ(c, 36, 36, 3.6); c.fill(); }
    } else {
      const p = PAL[8];
      c.fillStyle = p.floor; c.fillRect(0, 0, 48, 48);
      c.fillStyle = p.floord; c.fillRect(0, 0, 24, 24); c.fillRect(24, 24, 24, 24);
      c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 1; c.strokeRect(0.5, 0.5, 47, 47);
      if (v === 1) { c.fillStyle = '#fff4b0'; star(c, 36, 12, 4.5, 2, 5); c.fill(); }
    }
  }
  function stonesTile(c, f, v) {
    waterTile(c, false, f, 0, 3);
    const stones = [[12, 13, 10.5, 8.5, '#ff8fab'], [36, 12, 10, 8, '#ffb08a'], [13, 36, 10, 8, '#ffb08a'], [36, 36, 10.5, 8.5, '#ff8fab']];
    stones.forEach(([x, y, rx, ry, col]) => {
      c.fillStyle = 'rgba(0,60,90,.22)'; ell(c, x + 1, y + 3, rx, ry); c.fill();
      c.fillStyle = col; ell(c, x, y, rx, ry); c.fill();
      c.fillStyle = 'rgba(255,255,255,.65)'; ell(c, x - 3, y - 3, rx * 0.4, ry * 0.3); c.fill();
      c.fillStyle = 'rgba(255,90,130,.55)'; for (let k = -1; k <= 1; k++) { circ(c, x + k * 3.5, y + 3, 1); c.fill(); }
    });
  }
  function drawDecal(c, d, v) {
    const DEC = World.DEC;
    const ox = 10 + (v * 9) % 26, oy = 12 + (v * 13) % 22;
    switch (d) {
      case DEC.SHELL: c.fillStyle = '#ffc2cf'; c.beginPath(); c.moveTo(ox - 6, oy + 4); c.quadraticCurveTo(ox, oy - 8, ox + 6, oy + 4); c.closePath(); c.fill(); c.strokeStyle = '#e88ea3'; c.lineWidth = 1; for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(ox, oy + 4); c.lineTo(ox + k * 2.4, oy - 3); c.stroke(); } break;
      case DEC.STARFISH: c.fillStyle = '#ff9a5c'; star(c, ox, oy, 6, 2.6, 5); c.fill(); c.fillStyle = '#ffd0a8'; circ(c, ox, oy, 1.2); c.fill(); break;
      case DEC.PEBBLE: c.fillStyle = 'rgba(120,110,95,.55)'; ell(c, ox, oy, 3, 2); c.fill(); ell(c, ox + 6, oy + 3, 2, 1.4); c.fill(); break;
      case DEC.MUSH: c.fillStyle = '#f3ead8'; c.fillRect(ox - 1.5, oy, 3, 5); c.fillStyle = '#e8433f'; c.beginPath(); c.arc(ox, oy, 5, Math.PI, 0); c.fill(); c.fillStyle = '#fff'; circ(c, ox - 2, oy - 2, 1); c.fill(); circ(c, ox + 2, oy - 3, 0.9); c.fill(); break;
      case DEC.LILY: c.fillStyle = '#4fbf5a'; c.beginPath(); c.moveTo(ox, oy); c.arc(ox, oy, 6, 0.4, PI2 - 0.2); c.closePath(); c.fill(); if (v % 2) { c.fillStyle = '#ff9ad5'; circ(c, ox + 2, oy - 1, 2); c.fill(); } break;
      case DEC.FLOWER_P: case DEC.FLOWER_Y: case DEC.FLOWER_B: case DEC.FLOWER_W: {
        const col = { 6: '#ff7ab8', 7: '#ffd84d', 8: '#8fb0ff', 14: '#ffffff' }[d];
        for (let k = 0; k < 2; k++) { const x = ox + k * 9, y = oy + k * 5; c.fillStyle = col; for (let a = 0; a < 5; a++) { circ(c, x + Math.cos(a * 1.256) * 2.2, y + Math.sin(a * 1.256) * 2.2, 1.7); c.fill(); } c.fillStyle = '#fff3a0'; circ(c, x, y, 1.1); c.fill(); }
        break;
      }
      case DEC.SPARKLE: c.fillStyle = 'rgba(255,255,255,.95)'; sparkle(c, ox, oy, 3.2); sparkle(c, ox + 10, oy + 8, 2); break;
      case DEC.SHARD: c.fillStyle = ['#ffb3e1', '#b3d4ff', '#c9b3ff'][v % 3]; c.beginPath(); c.moveTo(ox, oy - 7); c.lineTo(ox + 3.4, oy); c.lineTo(ox, oy + 3); c.lineTo(ox - 3.4, oy); c.closePath(); c.fill(); c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.moveTo(ox, oy - 6); c.lineTo(ox + 1.4, oy - 1); c.lineTo(ox, oy); c.closePath(); c.fill(); break;
      case DEC.TUFT: c.fillStyle = 'rgba(40,110,40,.55)'; leaf(c, ox - 2, oy + 4, 7, -1.5); leaf(c, ox + 2, oy + 4, 8, 1.5); leaf(c, ox, oy + 4, 9, 0); break;
      case DEC.CRACK: c.strokeStyle = 'rgba(150,90,40,.5)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(ox - 6, oy); c.lineTo(ox - 1, oy + 2); c.lineTo(ox + 2, oy - 3); c.lineTo(ox + 7, oy - 1); c.stroke(); break;
      case DEC.CLOVER: c.fillStyle = 'rgba(50,140,60,.8)'; for (let a = 0; a < 3; a++) { circ(c, ox + Math.cos(a * 2.09) * 2.2, oy + Math.sin(a * 2.09) * 2.2, 2); c.fill(); } break;
      case DEC.PETAL || 15:
        for (let k = 0; k < 3; k++) {
          c.fillStyle = 'rgba(190,60,120,.18)'; petal(c, ox + [0, 10, 4][k] + 0.8, oy + [0, 5, 11][k] + 1, [3.2, 2.6, 2.9][k], (v + k) * 1.7);
          c.fillStyle = ['#ff9fc6', '#ffc6dd', '#ffb0d0'][k]; petal(c, ox + [0, 10, 4][k], oy + [0, 5, 11][k], [3.2, 2.6, 2.9][k], (v + k) * 1.7);
        }
        break;
      case DEC.NOTE || 16:
        c.fillStyle = 'rgba(120,70,10,.3)'; musicNote(c, ox + 0.9, oy + 5.9, 3.4);
        c.fillStyle = '#ffc93c'; musicNote(c, ox, oy + 5, 3.4);
        c.fillStyle = 'rgba(255,255,255,.8)'; circ(c, ox - 0.9, oy + 4.3, 0.75); c.fill();
        if (v % 2) { c.fillStyle = 'rgba(255,214,90,.9)'; sparkle(c, ox + 9, oy - 2, 2.2); }
        break;
      default: break;
    }
  }
  function renderTile(type, z, v, f, edges, d) {
    const cv = mk(tpx, tpx), c = cv.getContext('2d');
    c.scale(S, S);
    switch (type) {
      case T.DEEP: waterTile(c, true, f, edges, z); break;
      case T.SHALLOW: waterTile(c, false, f, edges, z); break;
      case T.SAND: sandBase(c, PAL[z] || PAL[3], v, z); break;
      case T.GRASS: grassBase(c, PAL[z] || PAL[9], v); break;
      case T.TALL: tallTile(c, z, v, f); break;
      case T.PATH: pathTile(c, z, v); break;
      case T.FLOWERS: flowersTile(c, z, v); break;
      case T.BRIDGE_H: bridgeTile(c, true, z); break;
      case T.BRIDGE_V: bridgeTile(c, false, z); break;
      case T.SNOW: snowBase(c, v); break;
      case T.ICE: iceTile(c, v, edges); break;
      case T.FLOOR: floorTile(c, z, v, false); break;
      case T.CLIFF: cliffTile(c, z, v, edges); break;
      case T.STONES: stonesTile(c, f, v); break;
      case T.PLAZA: floorTile(c, z, v, true); break;
      default: c.fillStyle = '#f0f'; c.fillRect(0, 0, 48, 48);
    }
    if (d) drawDecal(c, d, v);
    return cv;
  }
  const ANIM_FRAMES = new Uint8Array(15);
  ANIM_FRAMES[T.DEEP] = 4; ANIM_FRAMES[T.SHALLOW] = 4; ANIM_FRAMES[T.STONES] = 4; ANIM_FRAMES[T.TALL] = 2;
  const NO_VARIANT = new Uint8Array(15);
  [T.DEEP, T.SHALLOW, T.STONES, T.BRIDGE_H, T.BRIDGE_V].forEach(t => { NO_VARIANT[t] = 1; });
  function tile(type, z, v, f, edges, d) {
    if (NO_VARIANT[type]) v = 0;
    if (type === T.BRIDGE_H || type === T.BRIDGE_V) z = 0;
    // 16 zone slots (zones 0..10) and 32 decal slots (DEC 0..16) so zone 10 / PETAL / NOTE never collide
    const key = ((((type * 16 + z) * 4 + v) * 4 + f) * 16 + edges) * 32 + d;
    let cv = tileCache.get(key);
    if (!cv) {
      if (tileCache.size > 1500) tileCache.clear();
      cv = renderTile(type, z, v, f, edges, d);
      tileCache.set(key, cv);
    }
    return cv;
  }

  /* ======================= OBJECTS ======================= */
  function trunk(c, x, y, w, h, col) { c.fillStyle = col || '#7a4a26'; rr(c, x, y, w, h, 3); c.fill(); c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(x + w * 0.6, y + 2, w * 0.4, h - 3); }
  function oakCanopy(c, base, deep, light) {
    c.fillStyle = deep; circ(c, 24, 6, 23); c.fill(); circ(c, 9, 14, 13); c.fill(); circ(c, 39, 14, 13); c.fill();
    c.fillStyle = base; circ(c, 24, 2, 21); c.fill(); circ(c, 11, 10, 12); c.fill(); circ(c, 37, 10, 12); c.fill(); circ(c, 24, -12, 14); c.fill();
    c.fillStyle = light; circ(c, 17, -9, 7); c.fill(); circ(c, 30, -3, 5); c.fill(); circ(c, 11, 5, 4); c.fill();
  }
  function drawOak(c, z, woods) {
    const p = PAL[z] || PAL[9];
    shadow(c, 24, 44, 19, 6, 0.22);
    trunk(c, 19, 20, 10, 26);
    if (woods) oakCanopy(c, p.treed, shade(p.treed, -22), p.tree);
    else oakCanopy(c, p.tree, p.treed, p.treel);
  }
  function drawPalm(c) {
    shadow(c, 26, 44, 16, 5);
    c.strokeStyle = '#a7743e'; c.lineWidth = 7; c.lineCap = 'round';
    c.beginPath(); c.moveTo(24, 44); c.quadraticCurveTo(31, 20, 23, -6); c.stroke();
    c.strokeStyle = '#7d5226'; c.lineWidth = 1.4;
    for (let k = 0; k < 6; k++) { const t = k / 6, x = 24 + 7 * 2 * t * (1 - t) - t, y = 44 - t * 48; c.beginPath(); c.moveTo(x - 3, y); c.lineTo(x + 3, y - 1); c.stroke(); }
    for (let k = 0; k < 7; k++) {
      const a = -Math.PI / 2 + (k - 3) * 0.55 + (k > 3 ? 0.2 : 0);
      const ex = 23 + Math.cos(a) * 27, ey = -6 + Math.sin(a) * 15 + 10;
      c.fillStyle = k % 2 ? '#2f9e45' : '#45b858';
      c.beginPath(); c.moveTo(23, -6);
      c.quadraticCurveTo((23 + ex) / 2 + Math.sin(a) * 6, (-6 + ey) / 2 - 10, ex, ey);
      c.quadraticCurveTo((23 + ex) / 2, (-6 + ey) / 2 - 2, 23, -2);
      c.fill();
    }
  }
  function drawPine(c, z) {
    const p = PAL[z] || PAL[7];
    shadow(c, 24, 44, 15, 5);
    trunk(c, 20, 30, 8, 16, '#6b4428');
    const tiers = [[24, -30, 13], [24, -14, 18], [24, 4, 22]];
    tiers.forEach(([x, y, w], k) => {
      c.fillStyle = k === 2 ? p.treed : p.tree;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y + 30); c.lineTo(x - w, y + 30); c.closePath(); c.fill();
      if (z === 7) { c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w * 0.55, y + 16); c.quadraticCurveTo(x, y + 12, x - w * 0.55, y + 16); c.closePath(); c.fill(); }
    });
    c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.moveTo(24, -30); c.lineTo(16, 30); c.lineTo(24, 30); c.fill();
  }
  function drawBamboo(c, v) {
    shadow(c, 24, 44, 16, 5);
    const xs = [12, 24, 35], hs = [-50, -62, -46];
    xs.forEach((x, k) => {
      const top = hs[(k + v) % 3];
      c.fillStyle = k === 1 ? '#5cb85c' : '#4aa64f'; rr(c, x - 3.5, top, 7, 46 - top, 3); c.fill();
      c.fillStyle = '#2f7d3a'; for (let y = top + 10; y < 44; y += 12) c.fillRect(x - 4, y, 8, 2.4);
      c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(x - 2.5, top + 2, 1.6, 40 - top);
      c.fillStyle = '#3d9c45'; leaf(c, x + 4, top + 12, 14, 9); leaf(c, x - 4, top + 22, 12, -8);
    });
  }
  function drawCrystalTree(c) {
    shadow(c, 24, 44, 17, 5);
    trunk(c, 20, 18, 8, 28, '#c9a27a');
    const cols = ['#ffb3e1', '#c8b6ff', '#a8e9ff', '#ffe2a8'];
    const facets = [[24, -22, 14], [10, -2, 11], [38, -2, 11], [24, 6, 13]];
    facets.forEach(([x, y, r], k) => {
      c.fillStyle = cols[k % 4];
      c.beginPath(); c.moveTo(x, y - r); c.lineTo(x + r, y); c.lineTo(x, y + r); c.lineTo(x - r, y); c.closePath(); c.fill();
      c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.moveTo(x, y - r); c.lineTo(x + r * 0.4, y); c.lineTo(x, y); c.closePath(); c.fill();
    });
  }
  function drawMoonTree(c) {
    shadow(c, 24, 44, 18, 6);
    trunk(c, 19, 20, 10, 26, '#4a3a5a');
    oakCanopy(c, '#5b6fb8', '#3f4f96', '#8296dc');
    c.fillStyle = '#fff3a8';
    [[14, -4], [30, -14], [34, 6], [20, 10], [26, -2]].forEach(([x, y]) => { circ(c, x, y, 1.8); c.fill(); });
  }
  function drawBlossomTree(c, v) {
    // cherry blossom: dark crooked trunk, fluffy pink cloud canopy, falling petals (odd variants mirrored)
    c.save();
    if (v % 2) { c.translate(48, 0); c.scale(-1, 1); }
    shadow(c, 24, 44, 20, 6, 0.22);
    c.fillStyle = '#563842';
    c.beginPath(); c.moveTo(18, 46); c.quadraticCurveTo(22, 32, 14, 17); c.lineTo(19.5, 15); c.quadraticCurveTo(25, 25, 24.6, 29);
    c.quadraticCurveTo(28, 21, 34, 14); c.lineTo(38.5, 17); c.quadraticCurveTo(30.5, 27, 30, 46); c.closePath(); c.fill();
    c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.moveTo(26.5, 46); c.quadraticCurveTo(27, 35, 30.5, 28); c.quadraticCurveTo(29.6, 36, 30, 46); c.closePath(); c.fill();
    const puffs = [[24, -21, 12], [11, -12, 11.5], [37, -12, 11.5], [3, 2, 10], [45, 2, 10], [12, 12, 11], [36, 12, 11], [24, 9, 13], [24, -5, 16]];
    c.fillStyle = '#ec8ab7'; puffs.forEach(([x, y, r]) => { circ(c, x, y + 3.5, r); c.fill(); });
    c.fillStyle = '#ffb4d2'; puffs.forEach(([x, y, r]) => { circ(c, x, y, r - 0.8); c.fill(); });
    c.fillStyle = '#ffd6e8'; [[17, -24, 6.5], [7, -13, 5], [29, -11, 5.5], [0, 0, 3.6], [19, 1, 4.5], [38, -1, 3.4]].forEach(([x, y, r]) => { circ(c, x, y, r); c.fill(); });
    c.fillStyle = '#563842'; c.beginPath(); c.moveTo(14, 17); c.quadraticCurveTo(10, 15, 7, 17); c.lineTo(9, 19); c.quadraticCurveTo(12, 18, 15, 19.5); c.fill();
    const r = rnd(v * 37 + 5);
    for (let k = 0; k < 10; k++) {
      const x = 3 + r() * 42, y = -27 + r() * 44;
      c.fillStyle = k % 3 ? '#fff4f9' : '#ff7fb2';
      for (let a = 0; a < 5; a++) { circ(c, x + Math.cos(a * 1.256) * 1.5, y + Math.sin(a * 1.256) * 1.5, 1.05); c.fill(); }
      c.fillStyle = '#ffd84d'; circ(c, x, y, 0.6); c.fill();
    }
    c.fillStyle = '#ff9fc6';
    [[0, 30, 0.5], [46, 25, 2.2], [40, 40, 1.2], [6, 42, 2.8], [52, 36, 4]].forEach(([x, y, a]) => petal(c, x, y, 2.5, a));
    c.restore();
  }
  function drawTree(c, o, z) {
    const v = o.variant;
    if (v === 'palm') return drawPalm(c);
    if (v === 'pine') return drawPine(c, z);
    if (v === 'bamboo') return drawBamboo(c, o.x % 3);
    if (v === 'crystal') return drawCrystalTree(c);
    if (v === 'moon') return drawMoonTree(c);
    if (v === 'blossom') return drawBlossomTree(c, ((o.x + o.y) % 5 + 5) % 5);
    return drawOak(c, z, v === 'woods');
  }
  function fruits(c, pos, col, r, hi) {
    pos.forEach(([x, y]) => { c.fillStyle = col; circ(c, x, y, r); c.fill(); c.fillStyle = hi || 'rgba(255,255,255,.6)'; circ(c, x - r * 0.35, y - r * 0.35, r * 0.35); c.fill(); });
  }
  function drawBerryTree(c, o, z, ready) {
    const v = o.variant;
    if (v === 'coconut' || v === 'date') {
      drawPalm(c);
      if (ready) fruits(c, [[19, -2], [25, 0], [22, 3], [28, -3]], v === 'coconut' ? '#7a4a1e' : '#ff8a2b', 3.6);
      return;
    }
    if (v === 'crystal') {
      drawCrystalTree(c);
      if (ready) fruits(c, [[14, -6], [33, -4], [24, -16], [18, 8], [31, 10]], '#ff4fa3', 3, '#ffffff');
      return;
    }
    if (v === 'moon') {
      drawMoonTree(c);
      if (ready) fruits(c, [[13, 4], [35, 2], [24, -12], [28, 10], [18, -6]], '#ffd84d', 3.2, '#ffffff');
      return;
    }
    if (v === 'frost') {
      shadow(c, 24, 44, 18, 6);
      trunk(c, 20, 26, 8, 20, '#6b4428');
      c.fillStyle = '#4f8f7a'; circ(c, 24, 10, 20); c.fill(); circ(c, 12, 18, 11); c.fill(); circ(c, 36, 18, 11); c.fill();
      c.fillStyle = '#ffffff'; c.beginPath(); c.arc(24, 6, 18, Math.PI * 1.05, Math.PI * 1.95); c.quadraticCurveTo(24, 2, 7, 3); c.fill();
      if (ready) fruits(c, [[14, 16], [32, 14], [24, 22], [20, 8], [33, 24]], '#4a7dff', 3, '#e0ecff');
      return;
    }
    const p = PAL[z] || PAL[2];
    shadow(c, 24, 44, 19, 6, 0.22);
    trunk(c, 19, 20, 10, 26);
    oakCanopy(c, p.tree, p.treed, p.treel);
    if (ready) fruits(c, [[12, 8], [34, 6], [24, -14], [18, -4], [31, 14], [22, 14]], v === 'plum' ? '#8e44ad' : '#e8352f', 3.6);
  }
  function drawRock(c, z) {
    const col = z === 6 ? ['#c98a52', '#a86a3a', '#e3ab76'] : z === 7 ? ['#b8d8ef', '#8fb6d6', '#e8f6ff'] : ['#a8a8a0', '#85857d', '#d0d0c8'];
    shadow(c, 24, 42, 17, 5);
    c.fillStyle = col[1]; c.beginPath(); c.moveTo(6, 40); c.quadraticCurveTo(4, 18, 20, 12); c.quadraticCurveTo(38, 8, 42, 26); c.quadraticCurveTo(46, 40, 40, 42); c.closePath(); c.fill();
    c.fillStyle = col[0]; c.beginPath(); c.moveTo(9, 36); c.quadraticCurveTo(8, 18, 21, 15); c.quadraticCurveTo(36, 12, 39, 26); c.quadraticCurveTo(40, 36, 30, 37); c.closePath(); c.fill();
    c.fillStyle = col[2]; ell(c, 19, 20, 6, 3); c.fill();
  }
  function drawBush(c, z, hedge) {
    const p = PAL[z] || PAL[9];
    shadow(c, 24, 43, 19, 5);
    if (hedge) {
      c.fillStyle = z === 8 ? '#5f8f74' : p.treed; rr(c, 3, 10, 42, 34, 9); c.fill();
      c.fillStyle = z === 8 ? '#77a98c' : p.tree; rr(c, 5, 8, 38, 26, 9); c.fill();
      c.fillStyle = 'rgba(255,255,255,.18)'; rr(c, 10, 11, 18, 6, 3); c.fill();
      if (z === 8) { c.fillStyle = '#c6a6f6'; [[12, 20], [24, 16], [35, 22]].forEach(([x, y]) => { circ(c, x, y, 2.2); c.fill(); }); }
      return;
    }
    c.fillStyle = p.treed; circ(c, 24, 28, 16); c.fill(); circ(c, 12, 32, 10); c.fill(); circ(c, 36, 32, 10); c.fill();
    c.fillStyle = p.tree; circ(c, 24, 25, 13); c.fill(); circ(c, 14, 30, 8); c.fill(); circ(c, 34, 30, 8); c.fill();
    c.fillStyle = p.treel; circ(c, 19, 20, 4.5); c.fill();
  }
  function drawCactus(c, v) {
    shadow(c, 24, 44, 13, 4);
    c.fillStyle = '#3f9b4f';
    rr(c, 18, -4, 12, 48, 6); c.fill();
    rr(c, 6, 10, 9, 18, 4.5); c.fill(); rr(c, 6, 22, 14, 8, 4); c.fill();
    rr(c, 33, 2, 9, 20, 4.5); c.fill(); rr(c, 28, 16, 14, 8, 4); c.fill();
    c.fillStyle = '#5cbf6a'; c.fillRect(21, 0, 2.5, 40); c.fillRect(8, 13, 2, 12); c.fillRect(35, 5, 2, 13);
    c.fillStyle = 'rgba(255,255,255,.7)'; for (let y = 4; y < 40; y += 7) { c.fillRect(26.5, y, 1.4, 1.4); }
    if (v % 2 === 0) { c.fillStyle = '#ff6fa8'; for (let a = 0; a < 5; a++) { circ(c, 24 + Math.cos(a * 1.256) * 3, -5 + Math.sin(a * 1.256) * 3, 2.4); c.fill(); } c.fillStyle = '#ffe36b'; circ(c, 24, -5, 1.6); c.fill(); }
  }
  function drawStump(c) {
    shadow(c, 24, 42, 15, 5);
    c.fillStyle = '#8a5a30'; rr(c, 11, 24, 26, 18, 5); c.fill();
    c.fillStyle = '#d9b07a'; ell(c, 24, 25, 13, 6); c.fill();
    c.strokeStyle = '#a97c48'; c.lineWidth = 1.2; ell(c, 24, 25, 8, 3.6); c.stroke(); ell(c, 24, 25, 4, 1.8); c.stroke();
  }
  function drawFence(c, mask) {
    c.fillStyle = 'rgba(0,0,0,.15)'; c.fillRect(4, 40, 40, 4);
    c.fillStyle = '#c98f55';
    if (mask & 8) { c.fillRect(0, 18, 24, 5); c.fillRect(0, 30, 24, 5); }
    if (mask & 2) { c.fillRect(24, 18, 24, 5); c.fillRect(24, 30, 24, 5); }
    if (mask & 1) c.fillRect(21, 0, 6, 20);
    if (mask & 4) c.fillRect(21, 30, 6, 18);
    c.fillStyle = '#a8703c'; rr(c, 19, 10, 10, 32, 3); c.fill();
    c.fillStyle = '#e0aa70'; c.fillRect(20.5, 11, 3, 28);
  }
  function drawFlowerbed(c, v) {
    shadow(c, 24, 44, 21, 4);
    c.fillStyle = '#9b6a3c'; rr(c, 3, 26, 42, 18, 4); c.fill();
    c.fillStyle = '#6b4424'; rr(c, 6, 26, 36, 8, 3); c.fill();
    const cols = ['#ff6fa8', '#ffd84d', '#ffffff', '#ff9f43', '#b98bff'];
    for (let k = 0; k < 6; k++) {
      const x = 9 + k * 6, y = 20 + (k % 2) * 4;
      c.fillStyle = '#4caf50'; c.fillRect(x - 0.8, y, 1.6, 8);
      c.fillStyle = cols[(k + v) % cols.length]; for (let a = 0; a < 5; a++) { circ(c, x + Math.cos(a * 1.256) * 2.3, y + Math.sin(a * 1.256) * 2.3, 1.9); c.fill(); }
      c.fillStyle = '#fff2a0'; circ(c, x, y, 1.1); c.fill();
    }
  }
  function drawLamp(c) {
    shadow(c, 24, 44, 8, 3);
    c.fillStyle = '#3b3f4a'; c.fillRect(22, -8, 4, 52); c.fillRect(17, 40, 14, 4);
    c.fillStyle = '#2a2d36'; rr(c, 15, -20, 18, 14, 3); c.fill();
    c.fillStyle = '#ffe9a0'; rr(c, 17.5, -18, 13, 10, 2); c.fill();
    c.fillStyle = '#2a2d36'; c.beginPath(); c.moveTo(13, -20); c.lineTo(35, -20); c.lineTo(24, -28); c.closePath(); c.fill();
  }
  function drawLantern(c) {
    shadow(c, 24, 44, 9, 3);
    c.fillStyle = '#8f86b3'; rr(c, 17, 22, 14, 22, 2); c.fill(); c.fillStyle = '#a79fca'; c.fillRect(14, 18, 20, 5); c.fillRect(15, 40, 18, 4);
    c.fillStyle = '#6f6796'; c.fillRect(22, -2, 4, 22);
    c.fillStyle = '#4a4270'; rr(c, 14, -16, 20, 16, 4); c.fill();
    c.fillStyle = '#d9f0ff'; rr(c, 17, -13, 14, 10, 3); c.fill();
    c.fillStyle = '#fff6b0'; c.beginPath(); c.arc(24, -8, 3.4, 0.6, 5.7); c.arc(25.6, -8.6, 2.8, 5.4, 0.9, true); c.fill();
  }
  function drawSign(c) {
    shadow(c, 24, 44, 12, 3);
    c.fillStyle = '#8a5a30'; c.fillRect(21, 18, 6, 26);
    c.fillStyle = '#c98f55'; rr(c, 6, 2, 36, 22, 4); c.fill();
    c.strokeStyle = '#8a5a30'; c.lineWidth = 2; rr(c, 6, 2, 36, 22, 4); c.stroke();
    c.fillStyle = '#7a4a26'; c.fillRect(12, 9, 24, 2.4); c.fillRect(12, 15, 18, 2.4);
  }
  function drawMailbox(c) {
    shadow(c, 24, 44, 9, 3);
    c.fillStyle = '#8a5a30'; c.fillRect(21, 22, 6, 22);
    c.fillStyle = '#e8413b'; rr(c, 10, 6, 28, 18, 8); c.fill(); c.fillRect(10, 14, 28, 10);
    c.fillStyle = '#ffd84d'; c.fillRect(34, 2, 3, 12); c.fillRect(34, 2, 8, 5);
    c.fillStyle = '#b52e2a'; c.fillRect(12, 18, 24, 2);
  }
  function drawChest(c, open) {
    shadow(c, 24, 43, 18, 5);
    if (!open) {
      c.fillStyle = '#9b5f2e'; rr(c, 6, 18, 36, 24, 4); c.fill();
      c.fillStyle = '#b8743c'; rr(c, 6, 10, 36, 14, 7); c.fill();
      c.fillStyle = '#f2c14e'; c.fillRect(6, 22, 36, 4); c.fillRect(13, 10, 4, 32); c.fillRect(31, 10, 4, 32);
      c.fillStyle = '#ffe58a'; rr(c, 20, 20, 8, 10, 2); c.fill();
      c.fillStyle = '#7a4a1e'; c.fillRect(23, 24, 2, 4);
      c.fillStyle = 'rgba(255,255,255,.3)'; rr(c, 9, 12, 14, 4, 2); c.fill();
    } else {
      c.fillStyle = '#5a3418'; rr(c, 6, 18, 36, 24, 4); c.fill();
      c.fillStyle = '#3a200c'; rr(c, 9, 20, 30, 8, 3); c.fill();
      c.fillStyle = '#9b5f2e'; rr(c, 6, 4, 36, 12, 5); c.fill();
      c.fillStyle = '#c99a3e'; c.fillRect(6, 13, 36, 3); c.fillRect(13, 4, 4, 12); c.fillRect(31, 4, 4, 12);
      c.fillStyle = '#c99a3e'; c.fillRect(6, 30, 36, 3);
    }
  }
  function fountainStyle(style) {
    return {
      1: ['#e8e2d6', '#c9c0ae', '#ff7aa8'], 2: ['#b9c9a0', '#8fa673', '#7fd36a'], 3: ['#ffd9e4', '#f2a7bd', '#ff8fab'], 4: ['#f6dcff', '#d9b6f2', '#ff9ad5'],
      5: ['#c9ccd3', '#a2a6b0', '#7fb8ff'], 6: ['#efc58a', '#cf9d5c', '#ffb347'], 8: ['#d9d2f5', '#aaa0d8', '#c58bff'], 10: ['#fff1c9', '#e8c46a', '#ffd23b'],
      12: ['#e9d6ff', '#bfa3e6', '#ff5ca8'],
    }[style] || ['#e8e2d6', '#c9c0ae', '#ff7aa8'];
  }
  function drawFountain(c, o) {
    const [stone, stoneD, accent] = fountainStyle(o.style);
    const gold = o.style === 10;
    shadow(c, 48, 88, 44, 9);
    c.fillStyle = stoneD; ell(c, 48, 66, 44, 26); c.fill();
    c.fillStyle = stone; ell(c, 48, 62, 44, 24); c.fill();
    c.fillStyle = gold ? '#ffd45e' : '#5fc6ea'; ell(c, 48, 62, 36, 17); c.fill();
    c.fillStyle = gold ? 'rgba(255,250,215,.55)' : 'rgba(255,255,255,.35)'; ell(c, 40, 58, 16, 5); c.fill();
    c.fillStyle = stoneD; rr(c, 40, 28, 16, 36, 4); c.fill();
    c.fillStyle = stone; rr(c, 42, 28, 12, 34, 4); c.fill();
    c.fillStyle = stone; ell(c, 48, 28, 18, 7); c.fill();
    c.fillStyle = gold ? '#ffe38a' : '#7fd8f2'; ell(c, 48, 27, 13, 4); c.fill();
    c.fillStyle = accent;
    if (o.style === 3) { c.beginPath(); c.moveTo(48, 6); c.quadraticCurveTo(62, 16, 56, 24); c.lineTo(40, 24); c.quadraticCurveTo(34, 16, 48, 6); c.fill(); }
    else if (o.style === 8) { star(c, 48, 14, 9, 4, 5); c.fill(); }
    else if (gold) {
      c.strokeStyle = accent; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.ellipse(48, 22, 10, 13, 0, Math.PI, 0); c.stroke();
      star(c, 48, 12, 6.5, 2.8, 5); c.fill(); c.fillStyle = '#fff6c2'; circ(c, 46.8, 10.8, 1.2); c.fill();
    }
    else if (o.style === 6) { c.beginPath(); c.moveTo(48, 6); c.lineTo(58, 22); c.lineTo(38, 22); c.closePath(); c.fill(); }
    else heart(c, 48, 18, 9);
  }
  function animFountain(c, o, t) {
    const x = o.x * 48 + 48, y = o.y * 48;
    const gold = o.style === 10;
    c.strokeStyle = gold ? 'rgba(255,236,160,.9)' : 'rgba(200,240,255,.9)'; c.lineWidth = 2.2; c.lineCap = 'round';
    for (let k = 0; k < 6; k++) {
      const a = k / 6 * PI2 + t * 0.6;
      const ex = x + Math.cos(a) * 26, ey = y + 58 + Math.sin(a) * 10;
      c.beginPath(); c.moveTo(x, y + 24); c.quadraticCurveTo((x + ex) / 2, y - 6 - Math.sin(t * 4 + k) * 3, ex, ey); c.stroke();
    }
    c.fillStyle = 'rgba(255,255,255,.85)';
    for (let k = 0; k < 5; k++) { const ph = (t * 1.3 + k * 0.2) % 1; circ(c, x - 20 + k * 10, y + 60 - ph * 4, 1.6 + ph); c.fill(); }
    if (gold) {
      c.fillStyle = '#fff3b0';
      for (let k = 0; k < 4; k++) { const ph = (t * 0.45 + k / 4) % 1; c.globalAlpha = Math.sin(ph * Math.PI); sparkle(c, x - 24 + k * 16, y + 50 - ph * 40, 2.2 + Math.sin(ph * Math.PI) * 1.6); }
      c.globalAlpha = 1;
      return;
    }
    c.fillStyle = 'rgba(255,120,170,.9)';
    const hb = (t * 0.5) % 1;
    heart(c, x + 22, y + 10 - hb * 26, 4 * (1 - hb * 0.5));
  }
  function drawHotspring(c) {
    shadow(c, 72, 92, 70, 8);
    c.fillStyle = '#8a9aa8'; rr(c, 2, 14, 140, 80, 34); c.fill();
    c.fillStyle = '#a9b8c6';
    for (let k = 0; k < 12; k++) { const a = k / 12 * PI2; circ(c, 72 + Math.cos(a) * 64, 54 + Math.sin(a) * 34, 10); c.fill(); }
    c.fillStyle = '#5fd6cf'; ell(c, 72, 54, 56, 28); c.fill();
    c.fillStyle = '#8ef0e6'; ell(c, 60, 48, 28, 10); c.fill();
    c.fillStyle = '#ffffff'; for (let k = 0; k < 5; k++) { ell(c, 30 + k * 22, 74 - (k % 2) * 4, 7, 4); c.fill(); }
  }
  function animSteam(c, o, t) {
    const x = o.x * 48, y = o.y * 48;
    for (let k = 0; k < 7; k++) {
      const ph = (t * 0.35 + k / 7) % 1;
      c.fillStyle = 'rgba(255,255,255,' + (0.55 * (1 - ph)) + ')';
      circ(c, x + 26 + k * 15 + Math.sin(t * 2 + k) * 5, y + 40 - ph * 60, 7 + ph * 9); c.fill();
    }
  }
  function drawWaypoint(c, o, t) {
    const x = o.x * 48 + 24, y = o.y * 48;
    shadow(c, x, y + 44, 15, 4);
    c.fillStyle = '#8a7fb5'; rr(c, x - 14, y + 30, 28, 14, 4); c.fill();
    c.fillStyle = '#b4abdc'; rr(c, x - 12, y + 28, 24, 6, 3); c.fill();
    const fy = y + 2 + Math.sin(t * 2.4) * 4;
    const g = c.createLinearGradient(x - 12, fy - 24, x + 12, fy + 24);
    const h = (t * 60) % 360;
    g.addColorStop(0, 'hsl(' + h + ',90%,72%)'); g.addColorStop(0.5, 'hsl(' + ((h + 120) % 360) + ',90%,75%)'); g.addColorStop(1, 'hsl(' + ((h + 240) % 360) + ',90%,72%)');
    c.globalAlpha = 0.35; c.fillStyle = 'hsl(' + h + ',100%,80%)'; circ(c, x, fy, 22 + Math.sin(t * 3) * 3); c.fill(); c.globalAlpha = 1;
    c.fillStyle = g;
    c.beginPath(); c.moveTo(x, fy - 24); c.lineTo(x + 12, fy); c.lineTo(x, fy + 22); c.lineTo(x - 12, fy); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.moveTo(x, fy - 22); c.lineTo(x + 4, fy - 2); c.lineTo(x, fy + 4); c.lineTo(x - 5, fy - 2); c.closePath(); c.fill();
    c.fillStyle = '#ffffff';
    for (let k = 0; k < 3; k++) { const a = t * 2 + k * 2.1; sparkle(c, x + Math.cos(a) * 18, fy + Math.sin(a) * 10, 2.6); }
  }
  function drawHouse(c, o) {
    const W = o.w * 48, roof = o.kind === 'house' ? '#e8483e' : o.kind === 'shop' ? '#22a88f' : o.kind === 'lab' ? '#4a8fe0' : (o.roof || '#ff8f3a');
    const wall = o.kind === 'lab' ? '#f7fbff' : '#fff3df';
    const H = o.h * 48;
    shadow(c, W / 2, H - 2, W / 2 + 6, 9);
    c.fillStyle = wall; c.fillRect(4, H * 0.32, W - 8, H * 0.68 - 4);
    c.fillStyle = 'rgba(0,0,0,.06)'; c.fillRect(4, H - 14, W - 8, 10);
    // roof
    c.fillStyle = shade(roof, -35);
    c.beginPath(); c.moveTo(-6, H * 0.4); c.lineTo(W / 2, -26); c.lineTo(W + 6, H * 0.4); c.closePath(); c.fill();
    c.fillStyle = roof;
    c.beginPath(); c.moveTo(-2, H * 0.36); c.lineTo(W / 2, -22); c.lineTo(W + 2, H * 0.36); c.closePath(); c.fill();
    c.strokeStyle = shade(roof, -25); c.lineWidth = 2;
    for (let k = 1; k < 5; k++) { const yy = -22 + k * (H * 0.36 + 22) / 5; const half = (yy + 22) / (H * 0.36 + 22) * (W / 2 + 2); c.beginPath(); c.moveTo(W / 2 - half, yy); c.lineTo(W / 2 + half, yy); c.stroke(); }
    if (o.kind === 'house') { c.fillStyle = '#a0522d'; c.fillRect(W * 0.7, -10, 12, 24); c.fillStyle = '#7a3d1f'; c.fillRect(W * 0.7 - 2, -14, 16, 5); }
    // door
    const ddx = (o.kind === 'lab' ? 2 : 1) * 48 + 10; // door column matches World's front tile (x+1, lab x+2)
    c.fillStyle = '#8a5a30'; rr(c, ddx, H - 44, 28, 40, 5); c.fill();
    c.fillStyle = '#a8703c'; rr(c, ddx + 3, H - 41, 22, 35, 4); c.fill();
    c.fillStyle = '#ffd84d'; circ(c, ddx + 21, H - 22, 2.2); c.fill();
    c.fillStyle = '#d9c3a0'; c.fillRect(ddx - 3, H - 5, 34, 4);
    // windows
    const wins = [];
    for (let k = 0; k < o.w; k++) { const wx = k * 48 + 10; if (Math.abs(wx - ddx) > 20) wins.push(wx); }
    wins.forEach(wx => {
      c.fillStyle = '#6b4a2a'; rr(c, wx - 2, H * 0.48 - 2, 32, 26, 3); c.fill();
      c.fillStyle = '#9fdcff'; rr(c, wx, H * 0.48, 28, 22, 2); c.fill();
      c.fillStyle = 'rgba(255,255,255,.6)'; c.fillRect(wx + 3, H * 0.48 + 3, 8, 6);
      c.fillStyle = '#6b4a2a'; c.fillRect(wx + 13, H * 0.48, 2, 22); c.fillRect(wx, H * 0.48 + 10, 28, 2);
      if (o.kind === 'house' || o.kind === 'cottage') { c.fillStyle = '#7a4a26'; c.fillRect(wx - 2, H * 0.48 + 22, 32, 5); c.fillStyle = '#ff6fa8'; for (let f = 0; f < 4; f++) { circ(c, wx + 3 + f * 7.5, H * 0.48 + 21, 2.6); c.fill(); } }
    });
    // signage
    if (o.kind === 'shop') {
      c.fillStyle = '#ffffff'; rr(c, W / 2 - 42, H * 0.3 - 8, 84, 22, 6); c.fill();
      c.fillStyle = '#22a88f'; c.font = 'bold 15px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('SHOP', W / 2 + 10, H * 0.3 + 3);
      c.fillStyle = '#e8413b'; c.beginPath(); c.arc(W / 2 - 26, H * 0.3 + 3, 8, Math.PI, 0); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(W / 2 - 26, H * 0.3 + 3, 8, 0, Math.PI); c.fill();
      c.strokeStyle = '#333'; c.lineWidth = 1.5; circ(c, W / 2 - 26, H * 0.3 + 3, 8); c.stroke(); c.beginPath(); c.moveTo(W / 2 - 34, H * 0.3 + 3); c.lineTo(W / 2 - 18, H * 0.3 + 3); c.stroke();
    }
    if (o.kind === 'lab') {
      c.fillStyle = '#ffffff'; rr(c, W / 2 - 50, H * 0.3 - 10, 100, 24, 6); c.fill();
      c.strokeStyle = '#4a8fe0'; c.lineWidth = 2; rr(c, W / 2 - 50, H * 0.3 - 10, 100, 24, 6); c.stroke();
      c.fillStyle = '#2f6fc0'; c.font = 'bold 14px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('CRITTER LAB', W / 2, H * 0.3 + 2);
      c.fillStyle = '#bcd7f5'; c.fillRect(W - 46, -20, 6, 30); c.fillStyle = '#e0ecfa'; ell(c, W - 43, -24, 14, 8); c.fill(); c.fillStyle = '#ffd84d'; circ(c, W - 43, -26, 3); c.fill();
    }
  }
  function drawLighthouse(c) {
    shadow(c, 48, 92, 36, 8);
    c.fillStyle = '#d6d0c4'; rr(c, 14, 64, 68, 30, 6); c.fill();
    c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(28, 70); c.lineTo(34, -70); c.lineTo(62, -70); c.lineTo(68, 70); c.closePath(); c.fill();
    c.fillStyle = '#e8413b';
    for (let k = 0; k < 4; k++) { const y0 = 52 - k * 34; c.beginPath(); c.moveTo(28.8 + (70 - y0) / 140 * 6 * 0, y0); c.lineTo(67.2, y0); c.lineTo(66.4, y0 - 14); c.lineTo(29.6, y0 - 14); c.closePath(); c.fill(); }
    c.fillStyle = '#3b3f4a'; c.fillRect(28, -78, 40, 8);
    c.fillStyle = '#fff3a0'; rr(c, 32, -100, 32, 22, 4); c.fill();
    c.fillStyle = '#3b3f4a'; c.beginPath(); c.moveTo(26, -100); c.lineTo(70, -100); c.lineTo(48, -118); c.closePath(); c.fill();
    c.fillStyle = '#8a5a30'; rr(c, 40, 74, 16, 20, 3); c.fill();
  }
  function animLighthouse(c, o, t) {
    const x = o.x * 48 + 48, y = o.y * 48 - 89;
    const a = t * 1.4;
    c.save();
    c.globalAlpha = 0.28;
    const g = c.createRadialGradient(x, y, 2, x, y, 160);
    g.addColorStop(0, '#fff9c4'); g.addColorStop(1, 'rgba(255,249,196,0)');
    c.fillStyle = g;
    c.beginPath(); c.moveTo(x, y); c.arc(x, y, 160, a - 0.22, a + 0.22); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(x, y); c.arc(x, y, 160, a + Math.PI - 0.22, a + Math.PI + 0.22); c.closePath(); c.fill();
    c.restore();
  }
  function drawWindmill(c) {
    shadow(c, 72, 140, 60, 9);
    c.fillStyle = '#e9dcc4'; c.beginPath(); c.moveTo(34, 140); c.lineTo(50, -10); c.lineTo(94, -10); c.lineTo(110, 140); c.closePath(); c.fill();
    c.fillStyle = 'rgba(0,0,0,.08)'; c.beginPath(); c.moveTo(72, -10); c.lineTo(94, -10); c.lineTo(110, 140); c.lineTo(72, 140); c.closePath(); c.fill();
    c.fillStyle = '#b5523a'; c.beginPath(); c.moveTo(42, -6); c.lineTo(72, -44); c.lineTo(102, -6); c.closePath(); c.fill();
    c.fillStyle = '#8a5a30'; rr(c, 60, 104, 24, 36, 10); c.fill();
    c.fillStyle = '#9fdcff'; circ(c, 72, 40, 9); c.fill(); c.strokeStyle = '#8a5a30'; c.lineWidth = 2.5; circ(c, 72, 40, 9); c.stroke();
    c.fillStyle = '#9fdcff'; rr(c, 64, 70, 16, 18, 3); c.fill();
  }
  function animWindmill(c, o, t) {
    const x = o.x * 48 + 72, y = o.y * 48 - 14;
    const a = t * 1.6 + (o.phase || 0);
    c.save(); c.translate(x, y); c.rotate(a);
    for (let k = 0; k < 4; k++) {
      c.rotate(Math.PI / 2);
      c.fillStyle = '#7a4a26'; c.fillRect(-2.5, 0, 5, 66);
      c.fillStyle = 'rgba(255,255,255,.92)'; c.fillRect(2.5, 14, 16, 50);
      c.strokeStyle = '#b89b7a'; c.lineWidth = 1; for (let s = 22; s < 64; s += 10) { c.beginPath(); c.moveTo(2.5, s); c.lineTo(18.5, s); c.stroke(); }
    }
    c.fillStyle = '#5a3418'; circ(c, 0, 0, 6); c.fill();
    c.restore();
  }
  function drawPyramid(c, o) {
    const W = o.w * 48, H = o.h * 48, top = o.big ? -110 : -60;
    shadow(c, W / 2, H - 4, W / 2 + 4, 10);
    c.fillStyle = '#e2b06a'; c.beginPath(); c.moveTo(-4, H - 2); c.lineTo(W / 2, top); c.lineTo(W + 4, H - 2); c.closePath(); c.fill();
    c.fillStyle = '#c48f4c'; c.beginPath(); c.moveTo(W / 2, top); c.lineTo(W + 4, H - 2); c.lineTo(W / 2 + 10, H - 2); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(120,70,30,.35)'; c.lineWidth = 2;
    const steps = o.big ? 8 : 5;
    for (let k = 1; k < steps; k++) {
      const yy = top + (H - 2 - top) * k / steps, half = (W / 2 + 4) * k / steps;
      c.beginPath(); c.moveTo(W / 2 - half, yy); c.lineTo(W / 2 + half, yy); c.stroke();
    }
    c.fillStyle = '#ffe9a8'; c.beginPath(); c.moveTo(W / 2, top); c.lineTo(W / 2 + 10, top + 16); c.lineTo(W / 2 - 10, top + 16); c.closePath(); c.fill();
    const dw = o.big ? 34 : 24;
    c.fillStyle = '#5a3418'; c.beginPath(); c.moveTo(W / 2 - dw / 2, H - 2); c.lineTo(W / 2 - dw / 2, H - 30); c.quadraticCurveTo(W / 2, H - 46, W / 2 + dw / 2, H - 30); c.lineTo(W / 2 + dw / 2, H - 2); c.closePath(); c.fill();
    if (o.big) { c.fillStyle = '#ffd84d'; star(c, W / 2, H - 60, 9, 4, 5); c.fill(); }
  }
  function drawGazebo(c) {
    shadow(c, 96, 140, 92, 10);
    c.fillStyle = '#f2ecff'; ell(c, 96, 128, 90, 16); c.fill();
    c.fillStyle = '#ffffff';
    [14, 58, 134, 178].forEach(x => { rr(c, x - 6, 30, 12, 98, 4); c.fill(); });
    c.fillStyle = 'rgba(0,0,0,.08)'; [14, 58, 134, 178].forEach(x => c.fillRect(x + 1, 32, 5, 94));
    const cols = ['#ff6b6b', '#ffb347', '#ffe66d', '#7bd389', '#6ec6ff', '#b28dff'];
    cols.forEach((col, k) => {
      c.fillStyle = col;
      c.beginPath(); c.ellipse(96, 34, 100 - k * 14, 70 - k * 10, 0, Math.PI, 0); c.closePath(); c.fill();
    });
    c.fillStyle = '#ffffff'; rr(c, -4, 26, 200, 10, 5); c.fill();
    c.fillStyle = '#ffd84d'; c.beginPath(); c.moveTo(96, -60); c.lineTo(102, -36); c.lineTo(90, -36); c.closePath(); c.fill();
    c.fillStyle = '#ffffff'; circ(c, 96, -32, 6); c.fill();
  }
  function drawShrine(c) {
    shadow(c, 72, 94, 70, 8);
    c.fillStyle = '#c94a3a'; c.fillRect(10, 10, 10, 84); c.fillRect(124, 10, 10, 84);
    c.fillStyle = '#a5372a'; c.fillRect(0, 2, 144, 10); c.fillRect(6, 20, 132, 7);
    c.fillStyle = '#ffd23b'; rr(c, 30, 34, 84, 60, 6); c.fill();
    c.fillStyle = '#e8a91a'; c.beginPath(); c.moveTo(22, 40); c.lineTo(72, 12); c.lineTo(122, 40); c.closePath(); c.fill();
    c.fillStyle = '#3b2a6b'; c.beginPath(); c.moveTo(78, 44); c.lineTo(62, 68); c.lineTo(72, 68); c.lineTo(66, 88); c.lineTo(84, 60); c.lineTo(74, 60); c.lineTo(82, 44); c.closePath(); c.fill();
  }
  function drawCastle(c, o) {
    const W = o.w * 48, H = o.h * 48;
    shadow(c, W / 2, H - 4, W / 2 + 8, 12);
    c.fillStyle = '#d7d0f2'; c.fillRect(20, 30, W - 40, H - 32);
    c.fillStyle = '#c3bae8'; for (let x = 20; x < W - 20; x += 24) c.fillRect(x, 18, 14, 14);
    c.fillStyle = 'rgba(0,0,0,.06)'; for (let y = 50; y < H; y += 22) c.fillRect(20, y, W - 40, 2);
    c.fillStyle = '#e4dcff'; c.fillRect(W / 2 - 90, -60, 180, H + 58);
    c.fillStyle = '#cdc3f0'; for (let x = W / 2 - 90; x < W / 2 + 90; x += 26) c.fillRect(x, -74, 16, 16);
    const towers = [[18, -40], [W - 18, -40], [W / 2 - 112, -100], [W / 2 + 112, -100]];
    towers.forEach(([x, top]) => {
      c.fillStyle = '#ece6ff'; c.fillRect(x - 22, top, 44, H - top - 2);
      c.fillStyle = 'rgba(0,0,0,.07)'; c.fillRect(x + 6, top, 16, H - top - 2);
      c.fillStyle = '#6a5acd'; c.beginPath(); c.moveTo(x - 28, top + 2); c.lineTo(x, top - 54); c.lineTo(x + 28, top + 2); c.closePath(); c.fill();
      c.fillStyle = '#ffd84d'; star(c, x, top - 60, 7, 3, 5); c.fill();
      c.fillStyle = '#fff3a0'; rr(c, x - 7, top + 26, 14, 20, 7); c.fill();
    });
    c.fillStyle = '#5b4fb5'; c.beginPath(); c.moveTo(W / 2 - 96, -58); c.lineTo(W / 2, -170); c.lineTo(W / 2 + 96, -58); c.closePath(); c.fill();
    c.fillStyle = '#fff6c2'; c.beginPath(); c.arc(W / 2, -96, 22, 0.5, 5.8); c.arc(W / 2 + 9, -100, 18, 5.4, 0.9, true); c.fill();
    [[W / 2 - 50, 10], [W / 2 + 50, 10], [W / 2 - 50, 70], [W / 2 + 50, 70]].forEach(([x, y]) => { c.fillStyle = '#fff3a0'; rr(c, x - 10, y, 20, 28, 10); c.fill(); });
    c.fillStyle = '#3d3170'; c.beginPath(); c.moveTo(W / 2 - 34, H - 2); c.lineTo(W / 2 - 34, H - 64); c.quadraticCurveTo(W / 2, H - 100, W / 2 + 34, H - 64); c.lineTo(W / 2 + 34, H - 2); c.closePath(); c.fill();
    c.strokeStyle = '#ffd84d'; c.lineWidth = 3; c.beginPath(); c.moveTo(W / 2 - 34, H - 64); c.quadraticCurveTo(W / 2, H - 100, W / 2 + 34, H - 64); c.stroke();
    [[W / 2 - 150, 40], [W / 2 + 150, 40]].forEach(([x, y]) => { c.fillStyle = '#8a7fd6'; c.fillRect(x - 2, y - 30, 4, 70); c.fillStyle = '#ff8fd0'; c.beginPath(); c.moveTo(x + 2, y - 30); c.lineTo(x + 34, y - 20); c.lineTo(x + 2, y - 8); c.closePath(); c.fill(); });
  }
  function drawAltar(c, o) {
    shadow(c, 48, 44, 44, 6);
    c.fillStyle = '#a79fca'; rr(c, 4, 18, 88, 26, 6); c.fill();
    c.fillStyle = '#c9c2ea'; rr(c, 10, 10, 76, 14, 5); c.fill();
    if (o.style === 'sun') {
      c.fillStyle = '#ffb627'; circ(c, 48, -8, 13); c.fill();
      c.strokeStyle = '#ffd84d'; c.lineWidth = 3;
      for (let k = 0; k < 10; k++) { const a = k / 10 * PI2; c.beginPath(); c.moveTo(48 + Math.cos(a) * 17, -8 + Math.sin(a) * 17); c.lineTo(48 + Math.cos(a) * 24, -8 + Math.sin(a) * 24); c.stroke(); }
    } else {
      c.fillStyle = '#e8ecff'; c.beginPath(); c.arc(48, -8, 14, 0.6, 5.7); c.arc(54, -11, 12, 5.3, 1.0, true); c.fill();
      c.fillStyle = '#fff6b0'; star(c, 30, -20, 4, 1.8, 5); c.fill(); star(c, 66, -2, 3, 1.4, 5); c.fill();
    }
  }
  function drawCrystal(c, o) {
    const hue = (o.hue || 0) * 45;
    shadow(c, 24, 44, 11, 4);
    c.fillStyle = '#b9b0d6'; rr(c, 12, 34, 24, 10, 3); c.fill();
    c.fillStyle = 'hsl(' + hue + ',85%,72%)';
    c.beginPath(); c.moveTo(24, -26); c.lineTo(34, -4); c.lineTo(31, 36); c.lineTo(17, 36); c.lineTo(14, -4); c.closePath(); c.fill();
    c.fillStyle = 'hsl(' + hue + ',85%,62%)';
    c.beginPath(); c.moveTo(24, -26); c.lineTo(34, -4); c.lineTo(31, 36); c.lineTo(24, 36); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.moveTo(22, -20); c.lineTo(18, -2); c.lineTo(20, 26); c.lineTo(22, 26); c.closePath(); c.fill();
  }
  function animGlow(c, o, t, col, r, yoff) {
    const x = o.x * 48 + 24, y = o.y * 48 + (yoff || 0);
    c.save();
    c.globalAlpha = 0.18 + 0.12 * Math.sin(t * 2.5 + o.x);
    c.fillStyle = col; circ(c, x, y, r); c.fill();
    c.restore();
  }
  function drawIceCrystal(c, o) {
    shadow(c, 24, 44, 13, 4);
    const cols = ['#bdf3ff', '#d6c8ff', '#b8ffd9'];
    const col = cols[(o.hue || 0) % 3];
    [[14, 6, 8], [33, 10, 7], [24, -12, 10]].forEach(([x, y, w], k) => {
      c.fillStyle = k === 2 ? col : shade(col, -25);
      c.beginPath(); c.moveTo(x, y - 18); c.lineTo(x + w, y + 10); c.lineTo(x, y + 34); c.lineTo(x - w, y + 10); c.closePath(); c.fill();
      c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.moveTo(x, y - 16); c.lineTo(x - w * 0.5, y + 8); c.lineTo(x, y + 4); c.closePath(); c.fill();
    });
  }
  function drawRod(c) {
    shadow(c, 24, 44, 9, 3);
    c.fillStyle = '#6f7787'; c.fillRect(22, -14, 4, 58); c.fillStyle = '#4a4f5c'; rr(c, 15, 36, 18, 8, 3); c.fill();
    c.fillStyle = '#ffd400'; c.beginPath(); c.moveTo(27, -34); c.lineTo(17, -16); c.lineTo(24, -16); c.lineTo(20, -2); c.lineTo(31, -22); c.lineTo(24, -22); c.closePath(); c.fill();
  }
  function animRod(c, o, t) {
    if (Math.sin(t * 7 + o.x) < 0.6) return;
    const x = o.x * 48 + 24, y = o.y * 48 - 26;
    c.strokeStyle = '#fff7a8'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + 8, y - 6); c.lineTo(x + 4, y - 10); c.lineTo(x + 12, y - 16); c.stroke();
    c.beginPath(); c.moveTo(x, y); c.lineTo(x - 7, y - 8); c.lineTo(x - 3, y - 12); c.stroke();
  }
  function drawPillar(c, o) {
    shadow(c, 24, 44, 13, 4);
    c.fillStyle = '#e3c08a'; rr(c, 12, 38, 24, 7, 2); c.fill();
    const top = o.variant ? -6 : 8;
    c.fillStyle = '#efd3a2'; c.fillRect(15, top, 18, 38 - top);
    c.fillStyle = '#d9b47c'; for (let x = 18; x < 33; x += 5) c.fillRect(x, top, 1.6, 38 - top);
    c.fillStyle = '#e3c08a'; c.beginPath(); c.moveTo(13, top); c.lineTo(20, top - 6); c.lineTo(26, top - 2); c.lineTo(35, top - 5); c.lineTo(35, top + 4); c.lineTo(13, top + 4); c.closePath(); c.fill();
  }
  function drawSnowman(c) {
    shadow(c, 24, 44, 15, 4);
    c.fillStyle = '#ffffff'; circ(c, 24, 32, 13); c.fill(); circ(c, 24, 12, 10); c.fill();
    c.strokeStyle = '#d6e6f5'; c.lineWidth = 1.5; circ(c, 24, 32, 13); c.stroke(); circ(c, 24, 12, 10); c.stroke();
    c.fillStyle = '#2b2b2b'; circ(c, 20.5, 9.5, 1.5); c.fill(); circ(c, 27.5, 9.5, 1.5); c.fill(); for (let k = 0; k < 3; k++) { circ(c, 24, 27 + k * 5, 1.5); c.fill(); }
    c.fillStyle = '#ff8a2b'; c.beginPath(); c.moveTo(24, 12); c.lineTo(33, 14); c.lineTo(24, 15.5); c.closePath(); c.fill();
    c.fillStyle = '#e8413b'; c.fillRect(14, 19, 20, 4); c.fillRect(27, 19, 4, 10);
    c.fillStyle = '#2b2b4a'; c.fillRect(15, 0, 18, 3); c.fillRect(18, -10, 12, 11);
  }
  function drawUmbrella(c, o) {
    shadow(c, 24, 44, 22, 5);
    c.fillStyle = '#ffffff'; c.fillRect(23, -6, 2.6, 50);
    const cols = [['#ff5c8a', '#ffffff'], ['#3fb6ff', '#ffffff'], ['#ffb020', '#ffffff']][(o.variant || 0) % 3];
    for (let k = 0; k < 6; k++) {
      c.fillStyle = cols[k % 2];
      c.beginPath(); c.moveTo(24, -14); c.arc(24, 2, 26, Math.PI + k * Math.PI / 6, Math.PI + (k + 1) * Math.PI / 6); c.closePath(); c.fill();
    }
    c.fillStyle = '#ff9fc0'; rr(c, 4, 32, 20, 10, 3); c.fill();
  }
  function drawSandcastle(c) {
    shadow(c, 24, 44, 19, 4);
    c.fillStyle = '#e8c87a';
    c.fillRect(8, 22, 32, 20); c.fillRect(6, 12, 10, 30); c.fillRect(32, 12, 10, 30); c.fillRect(19, 6, 10, 20);
    c.fillStyle = '#d4b062'; for (let x = 6; x < 42; x += 4) c.fillRect(x, 40, 2, 2);
    c.fillStyle = '#ff5c8a'; c.fillRect(23.5, -6, 1.6, 12); c.beginPath(); c.moveTo(25, -6); c.lineTo(33, -3); c.lineTo(25, 0); c.fill();
    c.fillStyle = '#8a6a3a'; rr(c, 20, 30, 8, 12, 4); c.fill();
  }
  function drawTrampoline(c) {
    c.fillStyle = 'rgba(0,0,0,.18)'; ell(c, 24, 30, 21, 9); c.fill();
    c.fillStyle = '#3b6fd6'; ell(c, 24, 26, 21, 11); c.fill();
    c.fillStyle = '#5fb0ff'; ell(c, 24, 25, 16, 7.5); c.fill();
    c.strokeStyle = '#ffd84d'; c.lineWidth = 1.5; for (let k = 0; k < 8; k++) { const a = k / 8 * PI2; c.beginPath(); c.moveTo(24 + Math.cos(a) * 16, 25 + Math.sin(a) * 7.5); c.lineTo(24 + Math.cos(a) * 20, 26 + Math.sin(a) * 10); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,.6)'; ell(c, 19, 22, 6, 2); c.fill();
  }

  /* ---------- Honmoon Island (zone 10) landmarks ---------- */
  function flameShape(c, x, y, w, h) {
    // teardrop flame: base centred at (x, y), tip at (x, y - h)
    c.beginPath(); c.moveTo(x - w, y);
    c.quadraticCurveTo(x - w * 1.15, y - h * 0.55, x, y - h);
    c.quadraticCurveTo(x + w * 1.15, y - h * 0.55, x + w, y);
    c.quadraticCurveTo(x, y + w * 0.95, x - w, y);
    c.fill();
  }
  function fireLick(c, x, y, w, h, lean) {
    // curly cartoon flame tongue: bulgy body, side notch, leaning curled tip at (x + lean, y - h)
    c.beginPath(); c.moveTo(x - w, y);
    c.bezierCurveTo(x - w * 1.3, y - h * 0.38, x - w * 0.2 + lean * 0.3, y - h * 0.42, x - w * 0.3 + lean * 0.7, y - h * 0.72);
    c.quadraticCurveTo(x - w * 0.12 + lean * 0.95, y - h * 0.9, x + lean, y - h);
    c.bezierCurveTo(x + w * 0.2 + lean * 0.55, y - h * 0.8, x + w * 0.8, y - h * 0.62, x + w * 0.55, y - h * 0.4);
    c.quadraticCurveTo(x + w * 1.2, y - h * 0.22, x + w, y);
    c.quadraticCurveTo(x, y + w * 0.5, x - w, y);
    c.fill();
  }
  function quadPt(x0, y0, cx, cy, x1, y1, u) {
    const a = (1 - u) * (1 - u), b = 2 * u * (1 - u), d = u * u;
    return [a * x0 + b * cx + d * x1, a * y0 + b * cy + d * y1];
  }
  function trussH(c, x0, x1, y, h) {
    c.strokeStyle = '#b9b3cf'; c.lineWidth = 2.6;
    c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.moveTo(x0, y + h); c.lineTo(x1, y + h); c.stroke();
    c.lineWidth = 1.4; c.beginPath();
    for (let x = x0; x + h <= x1 + 0.5; x += h) { c.moveTo(x, y + h); c.lineTo(x + h / 2, y); c.lineTo(x + h, y + h); }
    c.stroke();
  }
  function trussV(c, x, y0, y1, w) {
    c.strokeStyle = '#b9b3cf'; c.lineWidth = 2.6;
    c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y1); c.moveTo(x + w, y0); c.lineTo(x + w, y1); c.stroke();
    c.lineWidth = 1.4; c.beginPath();
    for (let y = y0; y + w <= y1 + 0.5; y += w) { c.moveTo(x, y); c.lineTo(x + w, y + w / 2); c.lineTo(x, y + w); }
    c.stroke();
  }
  function speakerStack(c, x, yb, w) {
    let y = yb;
    [42, 42, 36].forEach((bh, k) => {
      y -= bh;
      c.fillStyle = '#211b2c'; rr(c, x, y, w, bh - 2, 5); c.fill();
      c.fillStyle = '#352e44'; rr(c, x + 3, y + 3, w - 6, bh - 8, 4); c.fill();
      const cx = x + w / 2, cy = y + bh / 2 - 1, rw = Math.min(w, bh) * (k === 2 ? 0.26 : 0.33);
      c.fillStyle = '#120f18'; circ(c, cx, cy, rw); c.fill();
      c.strokeStyle = '#6d6386'; c.lineWidth = 1.6; circ(c, cx, cy, rw); c.stroke();
      c.fillStyle = '#463d5c'; circ(c, cx, cy, rw * 0.4); c.fill();
      c.fillStyle = 'rgba(255,255,255,.2)'; circ(c, cx - rw * 0.35, cy - rw * 0.4, rw * 0.22); c.fill();
      c.fillStyle = k % 2 ? '#7fe3ff' : '#ff5fa8'; c.fillRect(x + 6, y + bh - 7, w - 12, 1.6);
    });
  }
  const STAGE_LIGHTS = [[112, '#ff5fa8'], [166, '#a46bff'], [218, '#ffcf3a'], [262, '#7fe3ff'], [314, '#ffcf3a'], [368, '#ff5fa8']];
  function drawStage(c, o) {
    const W = o.w * 48, H = o.h * 48;
    shadow(c, W / 2, H - 2, W / 2 + 12, 10, 0.24);
    // deck surface (glossy plum)
    c.fillStyle = '#4e2b69'; rr(c, 30, 34, W - 60, 76, 8); c.fill();
    c.fillStyle = '#5f3680'; rr(c, 34, 50, W - 68, 54, 6); c.fill();
    c.strokeStyle = 'rgba(255,207,58,.28)'; c.lineWidth = 1;
    for (let y = 62; y < 104; y += 12) { c.beginPath(); c.moveTo(36, y); c.lineTo(W - 36, y); c.stroke(); }
    c.fillStyle = 'rgba(255,207,58,.16)'; ell(c, W / 2, 80, 120, 14); c.fill();
    // LED back wall
    c.fillStyle = '#1b1530'; rr(c, 50, -158, W - 100, 212, 10); c.fill();
    const g = c.createLinearGradient(0, -150, 0, 46);
    g.addColorStop(0, '#2a1c66'); g.addColorStop(0.55, '#7a2fa8'); g.addColorStop(1, '#e2489c');
    c.fillStyle = g; c.fillRect(58, -150, W - 116, 196);
    c.fillStyle = 'rgba(0,0,0,.14)';
    for (let x = 64; x < W - 58; x += 8) c.fillRect(x, -150, 1, 196);
    for (let y = -144; y < 46; y += 8) c.fillRect(58, y, W - 116, 1);
    const r = rnd(1010);
    c.fillStyle = 'rgba(255,255,255,.85)';
    for (let k = 0; k < 16; k++) { const x = 66 + r() * (W - 132), y = -144 + r() * 120; sparkle(c, x, y, 1.2 + r() * 2); }
    // equalizer bars in the lower corners
    for (let k = 0; k < 6; k++) {
      const bh = 10 + ((k * 37) % 23);
      c.fillStyle = k % 2 ? 'rgba(127,227,255,.75)' : 'rgba(255,95,168,.75)';
      c.fillRect(70 + k * 9, 40 - bh, 6, bh); c.fillRect(W - 76 - k * 9, 40 - bh, 6, bh);
    }
    // glowing golden Honmoon arch
    c.lineCap = 'round';
    [[28, 'rgba(255,207,58,.10)'], [17, 'rgba(255,207,58,.22)'], [9, '#ffc93c'], [3.2, '#fff4b8']].forEach(([lw, col]) => {
      c.strokeStyle = col; c.lineWidth = lw; c.beginPath(); c.ellipse(W / 2, 46, 132, 166, 0, Math.PI, 0); c.stroke();
    });
    c.strokeStyle = 'rgba(255,224,130,.55)'; c.lineWidth = 2; c.beginPath(); c.ellipse(W / 2, 46, 114, 146, 0, Math.PI, 0); c.stroke();
    c.fillStyle = '#ffe58a'; star(c, W / 2, -122, 9, 4, 5); c.fill();
    // neon logo
    c.font = '900 40px system-ui, "Arial Black", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.lineJoin = 'round';
    [[11, 'rgba(255,79,168,.22)'], [6, 'rgba(255,79,168,.5)']].forEach(([lw, col]) => { c.strokeStyle = col; c.lineWidth = lw; c.strokeText('HUNTR/X', W / 2, -44); });
    c.fillStyle = '#ffd9f0'; c.fillText('HUNTR/X', W / 2, -44);
    c.strokeStyle = '#ff4fa8'; c.lineWidth = 1.4; c.strokeText('HUNTR/X', W / 2, -44);
    c.fillStyle = '#7fe3ff'; heart(c, W / 2 - 64, -4, 6); heart(c, W / 2 + 64, -4, 6);
    c.fillStyle = '#ffcf3a'; musicNote(c, W / 2 - 30, 2, 4.4); musicNote(c, W / 2 + 22, 0, 4.4);
    // neon frame around the screen
    c.strokeStyle = 'rgba(255,95,168,.9)'; c.lineWidth = 2; rr(c, 55, -153, W - 110, 202, 8); c.stroke();
    // truss towers + top truss + spotlights
    trussV(c, 40, -178, 46, 14); trussV(c, W - 54, -178, 46, 14);
    trussH(c, 30, W - 30, -180, 14);
    STAGE_LIGHTS.forEach(([lx, col]) => {
      c.fillStyle = '#2a2535'; c.fillRect(lx - 1.5, -166, 3, 5);
      c.fillStyle = '#3d3650'; rr(c, lx - 7, -163, 14, 12, 3); c.fill();
      c.fillStyle = col; circ(c, lx, -150, 5); c.fill();
      c.fillStyle = 'rgba(255,255,255,.85)'; circ(c, lx - 1.2, -151, 1.8); c.fill();
    });
    // stage front face with neon trim
    c.fillStyle = '#2a1b3f'; c.fillRect(30, 106, W - 60, 32);
    c.fillStyle = 'rgba(255,255,255,.06)'; for (let x = 70; x < W - 40; x += 40) c.fillRect(x, 110, 2, 26);
    c.fillStyle = 'rgba(255,95,168,.35)'; c.fillRect(30, 103, W - 60, 8);
    c.fillStyle = '#ff7cc0'; c.fillRect(30, 105.5, W - 60, 2.4);
    c.fillStyle = '#7fe3ff'; c.fillRect(30, 134.5, W - 60, 2);
    c.fillStyle = '#ffcf3a'; for (let x = 52; x < W - 40; x += 20) { star(c, x, 121, 2.6, 1.1, 5); c.fill(); }
    // centre steps
    for (let k = 0; k < 3; k++) {
      const sx = W / 2 - 32 - k * 4, sw = 64 + k * 8, sy = 106 + k * 12;
      c.fillStyle = '#3b2655'; c.fillRect(sx, sy, sw, 12);
      c.fillStyle = '#5f3a80'; c.fillRect(sx, sy, sw, 3.5);
      c.fillStyle = '#ffcf3a'; c.fillRect(sx, sy + 3.5, sw, 1);
    }
    // footlights
    for (let x = 58; x < W - 40; x += 34) {
      if (Math.abs(x - W / 2) < 40) continue;
      c.fillStyle = 'rgba(255,230,140,.35)'; circ(c, x, 100, 5); c.fill();
      c.fillStyle = '#fff1a8'; circ(c, x, 100, 2.2); c.fill();
    }
    // speaker stacks
    speakerStack(c, -6, 140, 46); speakerStack(c, W - 40, 140, 46);
  }
  function animStage(c, o, t) {
    const x0 = o.x * 48, y0 = o.y * 48;
    c.save();
    c.globalCompositeOperation = 'lighter';
    STAGE_LIGHTS.forEach(([lx, col], k) => {
      const a = Math.sin(t * 0.8 + k * 1.3) * 0.3 + (k < 3 ? 0.07 : -0.07);
      const sx = x0 + lx, sy = y0 - 150, L = 202, hw = 24;
      const ex = sx + Math.sin(a) * L, ey = sy + Math.cos(a) * L;
      const px = Math.cos(a) * hw, py = -Math.sin(a) * hw;
      c.fillStyle = col;
      c.globalAlpha = 0.12;
      c.beginPath(); c.moveTo(sx - 3, sy); c.lineTo(ex - px, ey - py); c.lineTo(ex + px, ey + py); c.lineTo(sx + 3, sy); c.closePath(); c.fill();
      c.globalAlpha = 0.1;
      c.beginPath(); c.moveTo(sx - 1.5, sy); c.lineTo(ex - px * 0.45, ey - py * 0.45); c.lineTo(ex + px * 0.45, ey + py * 0.45); c.lineTo(sx + 1.5, sy); c.closePath(); c.fill();
      c.globalAlpha = 0.2; ell(c, ex, ey, hw * 0.95, hw * 0.34); c.fill();
    });
    c.restore();
    c.save();
    c.fillStyle = '#fff6c2';
    for (let k = 0; k < 7; k++) {
      const ang = Math.PI + ((t * 0.09 + k / 7) % 1) * Math.PI;
      c.globalAlpha = 0.45 + 0.55 * Math.abs(Math.sin(t * 2.6 + k * 1.9));
      sparkle(c, x0 + 240 + Math.cos(ang) * 132, y0 + 46 + Math.sin(ang) * 166, 2.6 + 1.6 * Math.abs(Math.sin(t * 3 + k)));
    }
    c.restore();
  }
  function drawSeoulTower(c) {
    shadow(c, 48, 96, 58, 9, 0.22);
    // Namsan hill
    c.fillStyle = '#3c9a79'; ell(c, 48, 82, 58, 22); c.fill();
    c.fillStyle = '#56bd96'; ell(c, 48, 76, 54, 24); c.fill();
    c.fillStyle = '#7fd6b2'; ell(c, 34, 66, 26, 10); c.fill();
    [[10, 80, 8], [24, 90, 7], [86, 82, 8], [72, 92, 7], [92, 68, 6], [4, 66, 6], [48, 95, 6]].forEach(([x, y, r], k) => {
      const pink = k % 3 === 2;
      c.fillStyle = pink ? '#e88ab4' : '#2c8a6a'; circ(c, x, y + 1.5, r); c.fill();
      c.fillStyle = pink ? '#ffb6d3' : '#47b08b'; circ(c, x, y, r - 1.2); c.fill();
      c.fillStyle = 'rgba(255,255,255,.28)'; circ(c, x - r * 0.3, y - r * 0.35, r * 0.32); c.fill();
    });
    // plaza ring with colourful love locks
    c.fillStyle = '#efeaf6'; ell(c, 48, 58, 26, 8); c.fill();
    c.strokeStyle = '#8f87a8'; c.lineWidth = 1.2; c.beginPath(); c.ellipse(48, 58, 26, 8, 0, 0.05, Math.PI - 0.05); c.stroke();
    const locks = ['#ff5fa8', '#ffcf3a', '#7fe3ff', '#a46bff', '#ff9a5c'];
    for (let k = 0; k < 13; k++) { const a = 0.2 + k / 12 * (Math.PI - 0.4); c.fillStyle = locks[k % 5]; circ(c, 48 + Math.cos(a) * 26, 59.6 + Math.sin(a) * 8, 1.7); c.fill(); }
    // base building
    c.fillStyle = '#d9d4e6'; rr(c, 32, 40, 32, 20, 4); c.fill();
    c.fillStyle = '#f6f4fb'; rr(c, 34, 38, 28, 18, 4); c.fill();
    c.fillStyle = '#88b6e6'; rr(c, 37, 44, 22, 5, 2); c.fill();
    // white shaft
    c.fillStyle = '#f7f6fc'; c.beginPath(); c.moveTo(41, 42); c.lineTo(44, -150); c.lineTo(52, -150); c.lineTo(55, 42); c.closePath(); c.fill();
    c.fillStyle = 'rgba(90,80,140,.14)'; c.beginPath(); c.moveTo(48, 42); c.lineTo(48, -150); c.lineTo(52, -150); c.lineTo(55, 42); c.closePath(); c.fill();
    c.fillStyle = 'rgba(120,110,160,.28)'; for (let y = -112; y < 40; y += 38) c.fillRect(42, y, 12, 1.2);
    // observation pod
    c.fillStyle = '#e4e0ef'; c.beginPath(); c.moveTo(44, -150); c.lineTo(35, -163); c.lineTo(61, -163); c.lineTo(52, -150); c.closePath(); c.fill();
    c.fillStyle = '#f7f6fc'; rr(c, 27, -185, 42, 24, 9); c.fill();
    c.fillStyle = 'rgba(90,80,140,.13)'; rr(c, 48, -185, 21, 24, 9); c.fill();
    const wg = c.createLinearGradient(0, -178, 0, -168);
    wg.addColorStop(0, '#3d5a9a'); wg.addColorStop(1, '#7cb6e6');
    c.fillStyle = wg; rr(c, 29, -178, 38, 10, 4); c.fill();
    c.fillStyle = '#ffe9a0'; [33, 41, 55, 62].forEach(x => c.fillRect(x, -175, 2.4, 3.4));
    c.fillStyle = 'rgba(255,255,255,.45)'; c.fillRect(31, -177, 14, 1.4);
    c.fillStyle = '#ecebf5'; rr(c, 32, -197, 32, 13, 6); c.fill();
    c.fillStyle = '#5d84c0'; rr(c, 34, -193, 28, 5, 2); c.fill();
    c.fillStyle = '#d9d4e6'; ell(c, 48, -198, 13, 4.5); c.fill();
    c.fillStyle = '#cfc9de'; ell(c, 48, -201, 8, 4); c.fill();
    // red & white antenna
    c.fillStyle = '#e4e0ee'; rr(c, 44.5, -216, 7, 15, 2); c.fill();
    for (let k = 0; k < 6; k++) {
      const ya = -216 - k * 8.6, yb = ya - 8.6, wa = 2.2 - k * 0.24, wb = 2.2 - (k + 1) * 0.24;
      c.fillStyle = k % 2 ? '#ffffff' : '#e8413b';
      c.beginPath(); c.moveTo(48 - wa, ya); c.lineTo(48 - wb, yb); c.lineTo(48 + wb, yb); c.lineTo(48 + wa, ya); c.closePath(); c.fill();
    }
    c.fillStyle = '#a8323c'; circ(c, 48, -269, 2.2); c.fill();
  }
  function animSeoulTower(c, o, t) {
    const x = o.x * 48 + 48, y = o.y * 48 - 269;
    const ph = (t * 1.1 + o.x * 0.13) % 1;
    if (ph > 0.55) return;
    const a = Math.sin(ph / 0.55 * Math.PI);
    c.save();
    c.globalAlpha = 0.35 * a; c.fillStyle = '#ff4d5e'; circ(c, x, y, 8); c.fill();
    c.globalAlpha = 1; c.fillStyle = '#ff6b78'; circ(c, x, y, 2.8); c.fill();
    c.fillStyle = '#ffffff'; circ(c, x - 0.8, y - 0.8, 1); c.fill();
    c.restore();
  }
  function paperLantern(c, x, y, s) {
    c.strokeStyle = '#3a2a20'; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y - s * 2); c.lineTo(x, y - s * 1.15); c.stroke();
    c.fillStyle = 'rgba(255,130,80,.22)'; circ(c, x, y, s * 1.7); c.fill();
    c.fillStyle = '#e8413b'; ell(c, x, y, s, s * 1.18); c.fill();
    c.strokeStyle = 'rgba(120,20,20,.45)'; c.lineWidth = 0.9;
    ell(c, x, y, s * 0.5, s * 1.18); c.stroke(); c.beginPath(); c.moveTo(x, y - s * 1.18); c.lineTo(x, y + s * 1.18); c.stroke();
    c.fillStyle = '#ffcf3a'; c.fillRect(x - s * 0.58, y - s * 1.28, s * 1.16, s * 0.32); c.fillRect(x - s * 0.58, y + s * 0.96, s * 1.16, s * 0.32);
    c.strokeStyle = '#ffcf3a'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x, y + s * 1.28); c.lineTo(x, y + s * 1.9); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.35)'; ell(c, x - s * 0.42, y - s * 0.3, s * 0.18, s * 0.45); c.fill();
  }
  function drawRamen(c, o) {
    const W = o.w * 48, H = o.h * 48;
    shadow(c, W / 2, H - 2, W / 2 + 8, 9);
    // walls + wood frame
    c.fillStyle = '#fff3df'; c.fillRect(6, 44, W - 12, H - 48);
    c.fillStyle = 'rgba(0,0,0,.06)'; c.fillRect(6, H - 16, W - 12, 12);
    c.fillStyle = '#9b5f2e'; c.fillRect(4, 44, 7, H - 48); c.fillRect(W - 11, 44, 7, H - 48);
    c.fillStyle = '#7a4a26'; c.fillRect(4, H - 10, W - 8, 6);
    // dark tiled roof with red trim
    c.fillStyle = '#2f2a3a'; c.beginPath(); c.moveTo(-8, 50); c.lineTo(12, 10); c.lineTo(W - 12, 10); c.lineTo(W + 8, 50); c.closePath(); c.fill();
    c.fillStyle = '#4a4258'; c.beginPath(); c.moveTo(-4, 46); c.lineTo(14, 13); c.lineTo(W - 14, 13); c.lineTo(W + 4, 46); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(20,16,30,.4)'; c.lineWidth = 1.6;
    for (let k = 1; k < 16; k++) { const u = k / 16; c.beginPath(); c.moveTo(14 + (W - 28) * u, 13); c.lineTo(-4 + (W + 8) * u, 46); c.stroke(); }
    c.fillStyle = '#e8413b'; c.fillRect(-8, 46, W + 16, 5);
    c.fillStyle = '#ffcf3a'; for (let x = -2; x < W + 6; x += 16) { circ(c, x, 48.5, 1.3); c.fill(); }
    // giant noodle-bowl sign on the roof
    const bx = W / 2, ry = -4;
    c.fillStyle = '#5a3418'; rr(c, bx - 20, 14, 40, 10, 3); c.fill();
    c.lineCap = 'round';
    c.strokeStyle = '#a8703c'; c.lineWidth = 4.2;
    c.beginPath(); c.moveTo(bx + 4, ry - 2); c.lineTo(bx + 34, ry - 44); c.stroke();
    c.beginPath(); c.moveTo(bx + 12, ry - 1); c.lineTo(bx + 47, ry - 36); c.stroke();
    c.strokeStyle = '#e0ad74'; c.lineWidth = 1.3;
    c.beginPath(); c.moveTo(bx + 5, ry - 6); c.lineTo(bx + 32, ry - 43); c.moveTo(bx + 14, ry - 5); c.lineTo(bx + 45, ry - 36); c.stroke();
    c.fillStyle = '#b5522a'; ell(c, bx, ry, 40, 9); c.fill();
    c.fillStyle = '#e8904c'; ell(c, bx, ry + 0.6, 36, 7); c.fill();
    c.fillStyle = '#1f3b2a'; c.beginPath(); c.moveTo(bx - 4, ry - 1); c.lineTo(bx - 1, ry - 17); c.lineTo(bx + 9, ry - 16); c.lineTo(bx + 7, ry); c.closePath(); c.fill();
    c.fillStyle = '#ffe08a'; ell(c, bx - 6, ry - 2, 22, 6.5); c.fill();
    c.strokeStyle = '#f0b43a'; c.lineWidth = 1.4;
    for (let k = 0; k < 3; k++) {
      const y = ry - 5 + k * 2.6;
      c.beginPath(); c.moveTo(bx - 25 + k * 2, y);
      for (let s = 0; s < 6; s++) c.quadraticCurveTo(bx - 22 + s * 6.5 + k * 2, y + (s % 2 ? 2.2 : -2.2), bx - 18.5 + s * 6.5 + k * 2, y);
      c.stroke();
    }
    c.fillStyle = '#ffffff'; ell(c, bx + 19, ry - 2.5, 8, 5.4); c.fill();
    c.fillStyle = '#ffb627'; circ(c, bx + 19, ry - 2.8, 3.2); c.fill();
    c.fillStyle = '#fff7f0'; circ(c, bx - 21, ry - 1, 5.4); c.fill();
    c.strokeStyle = '#ff6fa8'; c.lineWidth = 1.2; c.beginPath(); c.arc(bx - 21, ry - 1, 3.2, 0, 4.6); c.stroke(); c.beginPath(); c.arc(bx - 21, ry - 1, 1.3, 2, 6.2); c.stroke();
    c.fillStyle = '#6ccf4f'; [[bx + 6, ry - 3], [bx + 9, ry + 1], [bx - 9, ry + 2], [bx + 28, ry]].forEach(([x, y]) => { circ(c, x, y, 1.6); c.fill(); });
    c.fillStyle = '#e8413b';
    c.beginPath(); c.ellipse(bx, ry, 40, 9, 0, Math.PI, 0, true);
    c.quadraticCurveTo(bx + 38, ry + 28, bx + 12, ry + 30); c.lineTo(bx - 12, ry + 30); c.quadraticCurveTo(bx - 38, ry + 28, bx - 40, ry);
    c.closePath(); c.fill();
    c.save(); c.clip();
    c.fillStyle = '#fff4e8'; c.fillRect(bx - 42, ry + 10, 84, 7);
    c.strokeStyle = '#e8413b'; c.lineWidth = 1.3; c.beginPath();
    for (let x = bx - 40; x < bx + 40; x += 8) { c.moveTo(x, ry + 16); c.lineTo(x, ry + 11.5); c.lineTo(x + 5, ry + 11.5); c.lineTo(x + 5, ry + 14); c.lineTo(x + 2.5, ry + 14); }
    c.stroke();
    c.fillStyle = 'rgba(0,0,0,.13)'; c.fillRect(bx + 16, ry, 30, 34);
    c.fillStyle = 'rgba(255,255,255,.3)'; ell(c, bx - 26, ry + 9, 4, 8); c.fill();
    c.restore();
    c.strokeStyle = '#ff8f80'; c.lineWidth = 2; c.beginPath(); c.ellipse(bx, ry, 40, 9, 0, Math.PI, 0, true); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 2; c.lineCap = 'round';
    [[-14, 0], [2, 1], [16, 0]].forEach(([dx, ph]) => { c.beginPath(); c.moveTo(bx + dx, ry - 9); c.bezierCurveTo(bx + dx - 6, ry - 15, bx + dx + 6, ry - 20 - ph * 2, bx + dx, ry - 27); c.stroke(); });
    // striped awning (red / orange) with scalloped hem
    const n = 10, ay0 = 55, ay1 = 74;
    c.fillStyle = '#9b2f1f'; c.fillRect(-2, ay0 - 3, W + 4, 4);
    for (let k = 0; k < n; k++) {
      const u0 = k / n, u1 = (k + 1) / n;
      const tx0 = 6 + (W - 12) * u0, tx1 = 6 + (W - 12) * u1, bx0 = -4 + (W + 8) * u0, bx1 = -4 + (W + 8) * u1;
      c.fillStyle = k % 2 ? '#ffb347' : '#ff5a3c';
      c.beginPath(); c.moveTo(tx0, ay0); c.lineTo(tx1, ay0); c.lineTo(bx1, ay1); c.arc((bx0 + bx1) / 2, ay1, (bx1 - bx0) / 2, 0, Math.PI); c.closePath(); c.fill();
    }
    c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(6, ay0 + 1, W - 12, 3);
    c.fillStyle = 'rgba(0,0,0,.1)'; c.fillRect(11, ay1 + 9, W - 22, 7);
    // warm window with a noodle counter
    const wx = 104, wy = 88, ww = 66, wh = 38;
    c.fillStyle = '#7a4a26'; rr(c, wx - 3, wy - 3, ww + 6, wh + 6, 4); c.fill();
    const glow = c.createLinearGradient(0, wy, 0, wy + wh);
    glow.addColorStop(0, '#ffeab0'); glow.addColorStop(1, '#ffc46b');
    c.fillStyle = glow; c.fillRect(wx, wy, ww, wh);
    c.fillStyle = '#b07040'; c.fillRect(wx, wy + 26, ww, 12);
    c.fillStyle = '#e8413b'; [wx + 14, wx + 46].forEach(x => { c.beginPath(); c.arc(x, wy + 24, 6, 0, Math.PI); c.fill(); });
    c.fillStyle = 'rgba(255,255,255,.7)'; [wx + 14, wx + 46].forEach(x => { ell(c, x, wy + 18, 2, 3); c.fill(); });
    c.fillStyle = '#7a4a26'; c.fillRect(wx + ww / 2 - 1, wy, 2, wh);
    c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.moveTo(wx + 4, wy + 2); c.lineTo(wx + 12, wy + 2); c.lineTo(wx + 4, wy + 14); c.closePath(); c.fill();
    // door (front tile x+1) with a noren curtain
    const ddx = 58;
    c.fillStyle = '#8a5a30'; rr(c, ddx, H - 44, 28, 40, 5); c.fill();
    c.fillStyle = '#a8703c'; rr(c, ddx + 3, H - 41, 22, 35, 4); c.fill();
    c.fillStyle = '#ffd84d'; circ(c, ddx + 21, H - 20, 2.2); c.fill();
    c.fillStyle = '#2f3a6b'; [0, 1, 2].forEach(k => { c.fillRect(ddx - 3 + k * 11.6, H - 47, 10.4, 16); });
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(ddx + 14, H - 41, 4, 0, Math.PI); c.fill(); c.fillRect(ddx + 9.5, H - 42, 9, 1.4);
    c.fillStyle = '#d9c3a0'; c.fillRect(ddx - 3, H - 5, 34, 4);
    // paper lanterns
    paperLantern(c, 26, 96, 8); paperLantern(c, W - 14, 96, 8);
  }
  function animRamen(c, o, t) {
    const x = o.x * 48 + 96, y = o.y * 48 - 14;
    for (let k = 0; k < 5; k++) {
      const ph = (t * 0.42 + k / 5) % 1;
      c.fillStyle = 'rgba(255,255,255,' + (0.62 * (1 - ph) * Math.min(1, ph * 6)).toFixed(3) + ')';
      circ(c, x - 18 + k * 9 + Math.sin(t * 2 + k * 1.7) * 4, y - ph * 56, 4 + ph * 7); c.fill();
    }
  }
  function lattice(c, x, y, w, h) {
    c.fillStyle = '#7a4a2a'; c.fillRect(x - 2, y - 2, w + 4, h + 4);
    c.fillStyle = '#f8eed6'; c.fillRect(x, y, w, h);
    c.strokeStyle = '#9b6a3c'; c.lineWidth = 1.1; c.beginPath();
    const n = Math.max(2, Math.round(w / 6)), m = Math.max(2, Math.round(h / 6));
    for (let k = 1; k < n; k++) { const xx = x + k * w / n; c.moveTo(xx, y); c.lineTo(xx, y + h); }
    for (let k = 1; k < m; k++) { const yy = y + k * h / m; c.moveTo(x, yy); c.lineTo(x + w, yy); }
    c.stroke();
  }
  function giwaRoof(c, L, R, ey, cy, ridgeY, rx0, rx1, cols) {
    // curved Korean tile roof: eaves sweep up at the corners (cheoma), concave hips, white-banded ridge
    const [bodyTop, bodyBot, line, cap, ridge, ridgeLine, rafter, rafterEnd] = cols;
    const mid = (L + R) / 2;
    c.fillStyle = rafter || '#6b4428';
    c.beginPath(); c.moveTo(L + 2, ey); c.quadraticCurveTo(mid, cy, R - 2, ey); c.lineTo(R - 10, ey + 7); c.quadraticCurveTo(mid, cy + 9, L + 10, ey + 7); c.closePath(); c.fill();
    c.fillStyle = rafterEnd || '#d9b48a';
    for (let k = 1; k < 18; k++) { const [x, y] = quadPt(L + 10, ey + 7, mid, cy + 9, R - 10, ey + 7, k / 18); circ(c, x, y - 1.6, 1.7); c.fill(); }
    const g = c.createLinearGradient(0, ridgeY, 0, (ey + cy) / 2);
    g.addColorStop(0, bodyTop); g.addColorStop(1, bodyBot);
    c.fillStyle = g;
    const hL = [L + (rx0 - L) * 0.45, ridgeY + (ey - ridgeY) * 0.62], hR = [R - (R - rx1) * 0.45, ridgeY + (ey - ridgeY) * 0.62];
    c.beginPath(); c.moveTo(L, ey);
    c.quadraticCurveTo(hL[0], hL[1], rx0, ridgeY); c.lineTo(rx1, ridgeY); c.quadraticCurveTo(hR[0], hR[1], R, ey);
    c.quadraticCurveTo(mid, cy, L, ey); c.closePath(); c.fill();
    c.save(); c.clip();
    const N = 22;
    for (let k = 1; k < N; k++) {
      const u = k / N, xt = rx0 + (rx1 - rx0) * u, [xb, yb] = quadPt(L, ey, mid, cy, R, ey, 0.04 + u * 0.92);
      c.strokeStyle = line; c.lineWidth = 2; c.beginPath(); c.moveTo(xt, ridgeY); c.lineTo(xb, yb); c.stroke();
      c.strokeStyle = 'rgba(255,255,255,.07)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(xt + 2, ridgeY); c.lineTo(xb + 2.6, yb); c.stroke();
    }
    c.restore();
    c.lineCap = 'round';
    c.strokeStyle = ridge; c.lineWidth = 5;
    c.beginPath(); c.moveTo(L + 3, ey - 1); c.quadraticCurveTo(hL[0], hL[1], rx0, ridgeY); c.moveTo(R - 3, ey - 1); c.quadraticCurveTo(hR[0], hR[1], rx1, ridgeY); c.stroke();
    c.strokeStyle = ridgeLine; c.lineWidth = 1.3;
    c.beginPath(); c.moveTo(L + 5, ey - 3); c.quadraticCurveTo(hL[0] + 2, hL[1] - 2, rx0 + 2, ridgeY - 1); c.moveTo(R - 5, ey - 3); c.quadraticCurveTo(hR[0] - 2, hR[1] - 2, rx1 - 2, ridgeY - 1); c.stroke();
    c.fillStyle = cap;
    for (let k = 0; k <= N; k++) { const [x, y] = quadPt(L, ey, mid, cy, R, ey, k / N); circ(c, x, y, 3.3); c.fill(); }
    c.fillStyle = 'rgba(255,255,255,.18)';
    for (let k = 0; k <= N; k++) { const [x, y] = quadPt(L, ey, mid, cy, R, ey, k / N); circ(c, x - 0.8, y - 0.8, 1.3); c.fill(); }
    c.fillStyle = ridge; rr(c, rx0 - 6, ridgeY - 8, rx1 - rx0 + 12, 11, 3); c.fill();
    c.fillStyle = ridgeLine; c.fillRect(rx0 - 2, ridgeY - 2.5, rx1 - rx0 + 4, 2.6);
    for (const s of [-1, 1]) {
      const ex = s < 0 ? rx0 - 6 : rx1 + 6;
      c.fillStyle = ridge;
      c.beginPath(); c.moveTo(ex - s * 10, ridgeY + 3); c.lineTo(ex, ridgeY + 3); c.quadraticCurveTo(ex + s * 4, ridgeY - 6, ex + s * 6, ridgeY - 16);
      c.quadraticCurveTo(ex - s * 2, ridgeY - 10, ex - s * 10, ridgeY - 8); c.closePath(); c.fill();
    }
  }
  function onggi(c, x, y, s) {
    c.fillStyle = 'rgba(0,0,0,.18)'; ell(c, x, y, s * 1.05, s * 0.3); c.fill();
    c.fillStyle = '#6b3a22'; c.beginPath(); c.moveTo(x - s * 0.5, y); c.quadraticCurveTo(x - s * 1.25, y - s * 0.9, x - s * 0.55, y - s * 1.6); c.lineTo(x + s * 0.55, y - s * 1.6); c.quadraticCurveTo(x + s * 1.25, y - s * 0.9, x + s * 0.5, y); c.closePath(); c.fill();
    c.fillStyle = '#4e2914'; ell(c, x, y - s * 1.62, s * 0.62, s * 0.2); c.fill();
    c.fillStyle = '#7d4a2e'; ell(c, x, y - s * 1.78, s * 0.5, s * 0.2); c.fill();
    c.fillStyle = 'rgba(255,255,255,.22)'; ell(c, x - s * 0.45, y - s * 0.95, s * 0.14, s * 0.4); c.fill();
  }
  function drawHanok(c, o) {
    const W = o.w * 48, H = o.h * 48;
    shadow(c, W / 2, H - 2, W / 2 + 12, 9);
    // stone base platform + centre step
    c.fillStyle = '#9d998f'; rr(c, 0, 110, W, 30, 4); c.fill();
    c.fillStyle = '#c3bfb5'; rr(c, 2, 110, W - 4, 7, 3); c.fill();
    c.strokeStyle = 'rgba(60,55,50,.3)'; c.lineWidth = 1;
    c.beginPath(); c.moveTo(2, 128); c.lineTo(W - 2, 128);
    for (let x = 22; x < W; x += 30) { c.moveTo(x, 117); c.lineTo(x, 128); c.moveTo(x + 15, 128); c.lineTo(x + 15, 140); }
    c.stroke();
    c.fillStyle = '#aeaaa0'; rr(c, W / 2 - 25, 131, 50, 12, 3); c.fill();
    c.fillStyle = '#d3cfc5'; rr(c, W / 2 - 23, 131, 46, 3.5, 1.5); c.fill();
    // white plaster walls, wooden pillars and beams
    c.fillStyle = '#fbf7ee'; c.fillRect(10, 38, W - 20, 74);
    const pil = [10, 61, 123, 174];
    c.fillStyle = '#7a4a2a'; pil.forEach(x => c.fillRect(x, 38, 8, 74));
    c.fillStyle = 'rgba(255,255,255,.16)'; pil.forEach(x => c.fillRect(x + 1.2, 38, 2, 74));
    c.fillStyle = '#6b3f22'; c.fillRect(6, 38, W - 12, 8); c.fillRect(6, 104, W - 12, 7);
    lattice(c, 72, 54, 23, 48); lattice(c, 97, 54, 23, 48);
    c.fillStyle = '#ffcf3a'; circ(c, 92, 80, 1.6); c.fill(); circ(c, 100, 80, 1.6); c.fill();
    lattice(c, 25, 56, 31, 25); lattice(c, 136, 56, 31, 25);
    c.strokeStyle = '#8a5a30'; c.lineWidth = 2; c.strokeRect(25, 86, 31, 15); c.strokeRect(136, 86, 31, 15);
    c.strokeStyle = 'rgba(138,90,48,.5)'; c.lineWidth = 1; c.beginPath(); c.moveTo(40.5, 86); c.lineTo(40.5, 101); c.moveTo(151.5, 86); c.lineTo(151.5, 101); c.stroke();
    const sh = c.createLinearGradient(0, 38, 0, 62);
    sh.addColorStop(0, 'rgba(40,30,30,.28)'); sh.addColorStop(1, 'rgba(40,30,30,0)');
    c.fillStyle = sh; c.fillRect(6, 38, W - 12, 24);
    // curved giwa roof
    giwaRoof(c, -24, W + 24, 18, 66, -30, 42, W - 42, ['#646c7f', '#3d4453', 'rgba(18,22,32,.42)', '#2b313d', '#2b313d', '#efece4']);
    // onggi jars
    onggi(c, 14, 142, 8); onggi(c, 30, 143, 6.5);
  }
  function drawDemonGate(c, o) {
    const W = o.w * 48, H = o.h * 48;
    c.fillStyle = 'rgba(150,80,240,.22)'; ell(c, W / 2, H - 6, W / 2 + 10, 15); c.fill();
    shadow(c, W / 2, H - 4, W / 2 - 4, 9, 0.24);
    // swirling violet portal (base; the swirl + goofy mouth animate on top)
    const pg = c.createRadialGradient(W / 2, 74, 4, W / 2, 74, 68);
    pg.addColorStop(0, '#16072c'); pg.addColorStop(0.5, '#4a1786'); pg.addColorStop(0.84, '#9446f5'); pg.addColorStop(1, '#d6a2ff');
    c.fillStyle = pg; ell(c, W / 2, 74, 58, 66); c.fill();
    c.strokeStyle = 'rgba(170,90,255,.35)'; c.lineWidth = 9; ell(c, W / 2, 74, 60, 68); c.stroke();
    c.strokeStyle = '#e6c2ff'; c.lineWidth = 2.4; ell(c, W / 2, 74, 58, 66); c.stroke();
    // stone posts with glowing cracks
    for (const px of [12, W - 36]) {
      c.fillStyle = '#4b4459'; c.fillRect(px, -8, 24, 136);
      c.fillStyle = '#6c6480'; c.fillRect(px, -8, 3.5, 136);
      c.fillStyle = '#37313f'; c.fillRect(px + 20, -8, 4, 136);
      c.fillStyle = 'rgba(0,0,0,.25)'; for (let y = 18; y < 124; y += 26) c.fillRect(px, y, 24, 1.6);
      c.strokeStyle = 'rgba(200,130,255,.85)'; c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(px + 7, 64); c.lineTo(px + 11, 72); c.lineTo(px + 8, 79); c.lineTo(px + 13, 88); c.moveTo(px + 15, 22); c.lineTo(px + 12, 30); c.lineTo(px + 16, 35); c.stroke();
      c.fillStyle = '#3d3748'; rr(c, px - 6, 116, 36, 24, 4); c.fill();
      c.fillStyle = '#5a5268'; rr(c, px - 6, 116, 36, 6, 3); c.fill();
      c.fillStyle = '#2a2536'; rr(c, px + 4, 38, 16, 6, 2); c.fill(); c.fillRect(px + 10, 44, 4, 6);
      c.fillStyle = 'rgba(190,110,255,.35)'; ell(c, px + 12, 36, 10, 4); c.fill();
    }
    // lintel, brackets and a small curved roof (iljumun style)
    c.fillStyle = '#2f2a3c'; rr(c, 4, -8, W - 8, 9, 2); c.fill();
    c.fillStyle = '#3f3850'; rr(c, -6, -20, W + 12, 14, 3); c.fill();
    c.fillStyle = '#4b4459';
    for (let x = 0; x < W; x += 16) { rr(c, x, -31, 12, 12, 2); c.fill(); }
    c.fillStyle = '#b36bff'; for (let x = 6; x < W; x += 16) { circ(c, x, -25, 1.5); c.fill(); }
    giwaRoof(c, -18, W + 18, -36, -14, -70, 36, W - 36, ['#4d4566', '#2c263c', 'rgba(8,4,18,.45)', '#221d30', '#221d30', '#c79bff', '#2a2238', '#b36bff']);
    c.fillStyle = '#1f1a2b'; rr(c, W / 2 - 16, -18, 32, 20, 3); c.fill();
    c.strokeStyle = '#c79bff'; c.lineWidth = 1.4; rr(c, W / 2 - 14, -16, 28, 16, 2); c.stroke();
    c.fillStyle = '#b36bff'; flameShape(c, W / 2, -4, 4.5, 10);
    c.fillStyle = '#ffd6ff'; flameShape(c, W / 2, -4.5, 2.2, 5.5);
  }
  function demonMouth(c, s) {
    c.beginPath();
    c.moveTo(-40 * s, -10 * s);
    c.quadraticCurveTo(0, 6 * s, 42 * s, -14 * s);
    c.quadraticCurveTo(30 * s, 27 * s, 0, 29 * s);
    c.quadraticCurveTo(-30 * s, 27 * s, -40 * s, -10 * s);
    c.closePath();
  }
  function animDemonGate(c, o, t) {
    const x0 = o.x * 48, y0 = o.y * 48, cx = x0 + 96, cy = y0 + 74;
    c.save();
    ell(c, cx, cy, 57, 65); c.clip();
    c.translate(cx, cy);
    c.lineCap = 'round';
    for (let k = 0; k < 4; k++) {
      c.strokeStyle = k % 2 ? 'rgba(255,120,220,.38)' : 'rgba(196,150,255,.42)';
      c.lineWidth = 6 - k * 0.8;
      c.beginPath();
      for (let s = 0; s <= 24; s++) { const u = s / 24, a = t * 1.5 + k * Math.PI / 2 + u * 4.4, rad = 5 + u * 62; c.lineTo(Math.cos(a) * rad * 0.9, Math.sin(a) * rad); }
      c.stroke();
    }
    // goofy flame-mouth with jagged teeth (spooky-cute, softly chomping)
    const chomp = 1 + Math.sin(t * 2.6) * 0.1;
    c.translate(0, 12); c.scale(0.92, 0.92 * chomp);
    c.fillStyle = 'rgba(255,70,200,.5)';
    for (let k = 0; k < 7; k++) { const u = (k + 0.5) / 7, [fx, fy] = quadPt(-40, -10, 0, 6, 42, -14, u); flameShape(c, fx, fy - 2, 5, 10 + 5 * Math.abs(Math.sin(t * 7 + k * 1.3))); }
    c.fillStyle = 'rgba(255,90,210,.6)'; demonMouth(c, 1.13); c.fill();
    c.fillStyle = 'rgba(26,6,40,.93)'; demonMouth(c, 1); c.fill();
    c.fillStyle = '#ff6fb5'; ell(c, 7, 17, 14, 7.5); c.fill();
    c.fillStyle = 'rgba(255,255,255,.3)'; ell(c, 2, 14.5, 4.5, 2); c.fill();
    c.fillStyle = '#f6eeff';
    for (let k = 0; k < 7; k++) {
      const u0 = (k + 0.1) / 7, u1 = (k + 0.9) / 7, um = (k + 0.5) / 7;
      const [ax, ay] = quadPt(-40, -10, 0, 6, 42, -14, u0), [bx2, by2] = quadPt(-40, -10, 0, 6, 42, -14, u1), [mx, my] = quadPt(-40, -10, 0, 6, 42, -14, um);
      c.beginPath(); c.moveTo(ax, ay - 1); c.lineTo(bx2, by2 - 1); c.lineTo(mx, my + 7 + (k % 2) * 2); c.closePath(); c.fill();
    }
    for (let k = 0; k < 4; k++) {
      const xx = -21 + k * 14, yy = 26 - Math.abs(xx) * 0.06;
      c.beginPath(); c.moveTo(xx - 5, yy + 1); c.lineTo(xx + 5, yy + 1); c.lineTo(xx, yy - 6); c.closePath(); c.fill();
    }
    // goofy mismatched eyes
    c.fillStyle = 'rgba(243,230,255,.95)'; circ(c, -17, -30, 8.5); c.fill(); circ(c, 17, -33, 10.5); c.fill();
    c.strokeStyle = 'rgba(255,90,210,.8)'; c.lineWidth = 1.6; circ(c, -17, -30, 8.5); c.stroke(); circ(c, 17, -33, 10.5); c.stroke();
    const look = Math.sin(t * 1.3) * 2.5;
    c.fillStyle = '#2a0c40'; circ(c, -15 + look, -29, 3.8); c.fill(); circ(c, 14 + look, -31, 4.6); c.fill();
    c.fillStyle = '#ffffff'; circ(c, -16 + look, -31, 1.2); c.fill(); circ(c, 12.6 + look, -33, 1.5); c.fill();
    c.restore();
    // rim pulse + flickering sconce flames
    c.save();
    c.globalAlpha = 0.25 + 0.2 * Math.sin(t * 3);
    c.strokeStyle = '#d9a8ff'; c.lineWidth = 5; ell(c, cx, cy, 61, 69); c.stroke();
    c.restore();
    for (const fx of [x0 + 24, x0 + 168]) {
      const fy = y0 + 38;
      for (let k = 0; k < 3; k++) {
        const fl = 0.5 + 0.5 * Math.sin(t * 11 + k * 2.1 + fx * 0.07);
        c.fillStyle = ['#8a4dff', '#cc6bff', '#ffd6ff'][k];
        flameShape(c, fx + Math.sin(t * 7 + k + fx) * 1.4, fy, 7.5 - k * 2, 18 + fl * 7 - k * 4.5);
      }
    }
    c.fillStyle = 'rgba(214,160,255,.8)';
    for (let k = 0; k < 4; k++) { const ph = (t * 0.5 + k / 4) % 1; circ(c, x0 + 40 + k * 37 + Math.sin(t * 2 + k) * 6, y0 + 132 - ph * 120, 1.6 * (1 - ph) + 0.4); c.fill(); }
  }

  const OBJ = {
    tree: { box: [-10, -66, 68, 116], draw: (c, o) => drawTree(c, o, o.z) },
    berrytree: { box: [-10, -40, 68, 90] },
    rock: { box: [0, 0, 48, 48], draw: (c, o) => drawRock(c, o.z) },
    bush: { box: [0, 0, 48, 48], draw: (c, o) => drawBush(c, o.z, false) },
    hedge: { box: [0, 0, 48, 48], draw: (c, o) => drawBush(c, o.z, true) },
    cactus: { box: [0, -14, 48, 62], draw: (c, o) => drawCactus(c, o.x + o.y) },
    stump: { box: [0, 0, 48, 48], draw: drawStump },
    fence: { box: [0, 0, 48, 48] },
    flowerbed: { box: [0, 0, 48, 48], draw: (c, o) => drawFlowerbed(c, o.x % 5) },
    lamp: { box: [0, -32, 48, 80], draw: drawLamp },
    lantern: { box: [0, -20, 48, 68], draw: drawLantern },
    sign: { box: [0, 0, 48, 48], draw: drawSign },
    mailbox: { box: [0, 0, 48, 48], draw: drawMailbox },
    chest: { box: [0, 0, 48, 48] },
    fountain: { box: [-4, -4, 104, 104], draw: drawFountain, anim: animFountain },
    hotspring: { box: [-4, 0, 152, 100], draw: drawHotspring, anim: animSteam },
    waypoint: { box: [0, 0, 48, 48], anim: drawWaypoint, noCache: true },
    house: { box: [-10, -30, 212, 176], draw: drawHouse },
    lab: { box: [-10, -40, 260, 236], draw: drawHouse },
    shop: { box: [-10, -30, 212, 176], draw: drawHouse },
    cottage: { box: [-10, -30, 164, 176], draw: drawHouse },
    lighthouse: { box: [0, -124, 96, 222], draw: drawLighthouse, anim: animLighthouse },
    windmill: { box: [-8, -88, 160, 234], draw: drawWindmill, anim: animWindmill },
    pyramid: { box: [-8, -116, 352, 316] },
    gazebo: { box: [-8, -64, 208, 214], draw: drawGazebo },
    shrine: { box: [-4, 0, 152, 100], draw: drawShrine },
    castle: { box: [-14, -232, 700, 524], draw: drawCastle },
    altar: { box: [0, -40, 96, 88], draw: drawAltar, anim: (c, o, t) => animGlow(c, o, t, o.style === 'sun' ? '#ffd84d' : '#d6e0ff', 34, -8) },
    crystal: { box: [0, -30, 48, 78], draw: drawCrystal, anim: (c, o, t) => animGlow(c, o, t, 'hsl(' + ((o.hue || 0) * 45) + ',100%,80%)', 26, 4) },
    icecrystal: { box: [0, -34, 48, 82], draw: drawIceCrystal, anim: (c, o, t) => animGlow(c, o, t, ['#9ff', '#c9f', '#9fc'][(o.hue || 0) % 3], 28, 4) },
    rod: { box: [0, -40, 48, 88], draw: drawRod, anim: animRod },
    pillar: { box: [0, -14, 48, 62], draw: drawPillar },
    snowman: { box: [0, -14, 48, 62], draw: drawSnowman },
    umbrella: { box: [-4, -16, 56, 64], draw: drawUmbrella },
    sandcastle: { box: [0, -10, 48, 58], draw: drawSandcastle },
    trampoline: { box: [0, 0, 48, 48], draw: drawTrampoline },
    // Honmoon Island landmarks (anchor = top-left footprint tile; boxes include anims)
    stage: { box: [-12, -188, 504, 342], draw: drawStage, anim: animStage },
    seoultower: { box: [-14, -282, 124, 390], draw: drawSeoulTower, anim: animSeoulTower },
    ramen: { box: [-12, -96, 216, 250], draw: drawRamen, anim: animRamen },
    hanok: { box: [-30, -54, 252, 208], draw: drawHanok },
    demongate: { box: [-24, -92, 240, 246], draw: drawDemonGate, anim: animDemonGate },
    // Southern Continent (Zones 11..13)
    tigerpavilion: { box: [-20, -64, 232, 216], draw: drawTigerPavilion },
    flowerpot: { box: [-8, -16, 64, 68], draw: drawFlowerpot },
    bathhouse: { box: [-16, -64, 224, 216], draw: drawBathhouse, anim: animSteam },
    hanclinic: { box: [-16, -60, 224, 212], draw: drawHanClinic },
    sodapoptruck: { box: [-12, -48, 216, 152], draw: drawSodaPopTruck },
    carnivaltent: { box: [-20, -88, 280, 288], draw: drawCarnivalTent },
    cauldron: { box: [-12, -48, 168, 152], draw: drawCauldron, anim: animCauldron },
    pokecenter: { box: [-16, -56, 224, 208], draw: drawPokeCenter },
    oaklab: { box: [-16, -60, 272, 212], draw: drawOakLab },
    mewshrine: { box: [-16, -64, 176, 168], draw: drawMewShrine, anim: animMewShrine },
    volcano: { box: [-20, -72, 232, 224], draw: drawVolcano, anim: animVolcano },
    // Grand Pokémon Continent (Zones 14..16: Johto Gen 2, Hoenn Gen 3, Sinnoh Gen 4)
    belltower: { box: [-20, -110, 232, 260], draw: drawBellTower, anim: animBellTower },
    lugiaroost: { box: [-16, -64, 176, 168], draw: drawLugiaRoost, anim: animLugiaRoost },
    apricornshop: { box: [-16, -56, 224, 208], draw: drawApricornShop },
    skypillar: { box: [-20, -120, 232, 270], draw: drawSkyPillar, anim: animSkyPillar },
    secretbase: { box: [-16, -68, 224, 220], draw: drawSecretBase },
    spearpillar: { box: [-20, -96, 280, 248], draw: drawSpearPillar, anim: animSpearPillar },
    rowanlab: { box: [-16, -60, 272, 212], draw: drawRowanLab },
  };
  OBJ.pyramid.draw = drawPyramid;

  /* --- Southern Continent Landmark Drawers (Zones 11, 12, 13) --- */
  function drawTigerPavilion(c) {
    // Traditional Korean Minhwa Hojakdo Pavilion with blue tiger & magpie screen
    shadow(c, 96, 138, 96, 14, 0.24);
    c.fillStyle = '#c8bca6'; rr(c, 8, 96, 176, 44, 6); c.fill();
    c.fillStyle = '#e5dac6'; rr(c, 12, 92, 168, 36, 5); c.fill();
    // Wooden pillars
    for (const px of [20, 68, 124, 164]) { c.fillStyle = '#8c3b2b'; c.fillRect(px, 24, 8, 76); }
    // Hojakdo folding screen in center (cream hanji paper + blue tiger face + pine branch)
    c.fillStyle = '#fdf6e2'; rr(c, 36, 30, 120, 64, 4); c.fill();
    c.strokeStyle = '#b58d3d'; c.lineWidth = 2.5; rr(c, 36, 30, 120, 64, 4); c.stroke();
    // Blue Derpy Tiger motif on screen
    c.fillStyle = '#3f8fe0'; circ(c, 96, 62, 20); c.fill();
    c.fillStyle = '#1b1b24'; circ(c, 82, 46, 6); c.fill(); circ(c, 110, 46, 6); c.fill();
    c.fillStyle = '#ffd84d'; circ(c, 89, 58, 4.5); c.fill(); circ(c, 103, 58, 4.5); c.fill();
    c.fillStyle = '#111'; circ(c, 90, 58, 2); c.fill(); circ(c, 102, 58, 2); c.fill();
    c.fillStyle = '#ffffff'; rr(c, 86, 66, 20, 9, 4); c.fill();
    // Curved dancheong tiled roof
    c.fillStyle = '#2b3a4a';
    c.beginPath(); c.moveTo(-12, 30); c.quadraticCurveTo(96, -24, 204, 30); c.lineTo(188, 38); c.quadraticCurveTo(96, -4, 4, 38); c.closePath(); c.fill();
    c.fillStyle = '#48b89f'; c.fillRect(10, 26, 172, 6);
    c.fillStyle = '#ff6b4a'; c.fillRect(16, 31, 160, 4);
    // Golden tiger roof finial
    c.fillStyle = '#ffc93c'; star(c, 96, -6, 10, 4.5, 5); c.fill();
  }
  function drawFlowerpot(c, upright) {
    shadow(c, 24, 40, 14, 5, 0.22);
    c.save();
    if (!upright) {
      // Knocked-over flowerpot on its side with spilled soil & sideways flower!
      c.translate(22, 32); c.rotate(Math.PI * 0.46);
      c.fillStyle = '#c85a32';
      c.beginPath(); c.moveTo(-11, -10); c.lineTo(11, -10); c.lineTo(8, 12); c.lineTo(-8, 12); c.closePath(); c.fill();
      c.fillStyle = '#e06d42'; rr(c, -13, -14, 26, 6, 2); c.fill();
      c.fillStyle = '#4caf50'; c.fillRect(-1.5, -26, 3, 13);
      c.fillStyle = '#ff6fa8'; for (let a = 0; a < 5; a++) { circ(c, Math.cos(a * 1.256) * 4.5, -28 + Math.sin(a * 1.256) * 4.5, 3.5); c.fill(); }
      c.fillStyle = '#ffd84d'; circ(c, 0, -28, 2.2); c.fill();
      c.restore();
      // Little spilled dirt dots + question mark sparkle
      c.fillStyle = '#6b4424'; circ(c, 38, 38, 3); c.fill(); circ(c, 43, 35, 2); c.fill();
      return;
    }
    // Upright happy flowerpot with glowing blue tiger paw print!
    c.fillStyle = '#c85a32';
    c.beginPath(); c.moveTo(12, 22); c.lineTo(36, 22); c.lineTo(32, 42); c.lineTo(16, 42); c.closePath(); c.fill();
    c.fillStyle = '#e06d42'; rr(c, 10, 17, 28, 6, 2.5); c.fill();
    // Blue Derpy paw print on pot
    c.fillStyle = '#3f8fe0'; circ(c, 24, 33, 3.2); c.fill();
    for (const dx of [-3.5, 0, 3.5]) { circ(c, 24 + dx, 28.5, 1.4); c.fill(); }
    // Stem, leaves & blooming flower
    c.fillStyle = '#3da34d'; c.fillRect(22.5, 4, 3, 14);
    leaf(c, 18, 15, 7, -4); leaf(c, 30, 15, 7, 4);
    c.fillStyle = '#ff6fa8';
    for (let a = 0; a < 5; a++) { circ(c, 24 + Math.cos(a * 1.256) * 5.2, 3 + Math.sin(a * 1.256) * 5.2, 4); c.fill(); }
    c.fillStyle = '#ffd84d'; circ(c, 24, 3, 2.6); c.fill();
    c.restore();
  }
  function drawBathhouse(c) {
    // Jjimjilbang Korean Bathhouse with steaming aqua outdoor pool & yangmeori towel sign
    shadow(c, 96, 138, 96, 12, 0.24);
    c.fillStyle = '#f2e3c9'; rr(c, 8, 28, 176, 108, 10); c.fill();
    c.fillStyle = '#3b4d6b';
    c.beginPath(); c.moveTo(-8, 34); c.quadraticCurveTo(96, -18, 200, 34); c.lineTo(188, 42); c.quadraticCurveTo(96, 0, 4, 42); c.closePath(); c.fill();
    // Outdoor aqua hot spring basin in front
    c.fillStyle = '#7c8b99'; ell(c, 96, 104, 72, 26); c.fill();
    c.fillStyle = '#45d1f5'; ell(c, 96, 102, 64, 21); c.fill();
    c.fillStyle = '#9ff0ff'; ell(c, 82, 98, 32, 9); c.fill();
    // Glowing ♨️ sign on roof
    c.fillStyle = '#ff6fa8'; circ(c, 96, 18, 14); c.fill();
    c.strokeStyle = '#ffffff'; c.lineWidth = 2; circ(c, 96, 18, 12); c.stroke();
    c.fillStyle = '#ffffff'; ell(c, 84, 18, 5, 5); c.fill(); ell(c, 108, 18, 5, 5); c.fill(); // sheep-horn towel buns!
  }
  function drawHanClinic(c) {
    // Healer Han's Traditional Herbal Tonic Clinic
    shadow(c, 96, 138, 92, 12, 0.24);
    c.fillStyle = '#f7efe0'; rr(c, 12, 32, 168, 102, 6); c.fill();
    // Wooden apothecary drawer grid & sliding door
    c.fillStyle = '#8c5830'; c.fillRect(12, 32, 168, 8); c.fillRect(12, 126, 168, 8);
    c.fillStyle = '#5c381c'; rr(c, 74, 68, 44, 64, 4); c.fill();
    c.fillStyle = '#fff5dc'; rr(c, 78, 72, 16, 56, 2); c.fill(); rr(c, 98, 72, 16, 56, 2); c.fill();
    // Teal medicinal gourd sign
    c.fillStyle = '#2d443e';
    c.beginPath(); c.moveTo(-6, 36); c.quadraticCurveTo(96, -14, 198, 36); c.lineTo(186, 44); c.quadraticCurveTo(96, 4, 6, 44); c.closePath(); c.fill();
    c.fillStyle = '#48b89f'; circ(c, 96, 16, 11); c.fill(); circ(c, 96, 4, 7); c.fill();
    c.fillStyle = '#ffd84d'; circ(c, 96, 16, 4); c.fill();
  }
  function drawSodaPopTruck(c) {
    // Saja Boys' Pastel Soda Pop Idol Refreshment Truck
    shadow(c, 96, 90, 90, 10, 0.25);
    // Truck body (pastel cyan + hot pink stripes)
    c.fillStyle = '#45d1f5'; rr(c, 8, 8, 172, 76, 14); c.fill();
    c.fillStyle = '#ff5ca8'; rr(c, 8, 52, 172, 24, 6); c.fill();
    // Serving window & striped awning
    c.fillStyle = '#2b2345'; rr(c, 28, 20, 96, 34, 5); c.fill();
    for (let k = 0; k < 6; k++) {
      c.fillStyle = k % 2 ? '#ffffff' : '#ff5ca8';
      rr(c, 24 + k * 17, 14, 17, 10, 3); c.fill();
    }
    // Giant fizzy soda cup on roof
    c.fillStyle = '#ffc93c'; rr(c, 82, -26, 28, 34, 4); c.fill();
    c.fillStyle = '#ffffff'; rr(c, 79, -30, 34, 7, 3); c.fill();
    c.strokeStyle = '#ff3d8b'; c.lineWidth = 4; c.beginPath(); c.moveTo(98, -30); c.lineTo(106, -44); c.stroke();
    // Wheels
    c.fillStyle = '#222'; circ(c, 42, 84, 13); c.fill(); circ(c, 144, 84, 13); c.fill();
    c.fillStyle = '#ffd84d'; circ(c, 42, 84, 6); c.fill(); circ(c, 144, 84, 6); c.fill();
  }
  function drawCarnivalTent(c) {
    // Nightmare Critters Striped Big-Top Carnival Tent
    shadow(c, 120, 184, 114, 16, 0.26);
    // Tent wall cylinder
    for (let k = 0; k < 10; k++) {
      c.fillStyle = k % 2 ? '#4b246b' : '#e03e6b';
      c.fillRect(16 + k * 20.8, 78, 21, 104);
    }
    // Conical striped roof
    for (let k = 0; k < 10; k++) {
      c.fillStyle = k % 2 ? '#6b3596' : '#ff4f82';
      c.beginPath();
      c.moveTo(120, -42);
      c.lineTo(8 + k * 22.4, 82);
      c.lineTo(8 + (k + 1) * 22.4, 82);
      c.closePath(); c.fill();
    }
    // Gold scallop trim & entrance curtains
    c.fillStyle = '#ffd84d';
    for (let k = 0; k < 11; k++) { circ(c, 14 + k * 21, 82, 11); c.fill(); }
    c.fillStyle = '#1d112b'; rr(c, 92, 108, 56, 74, 24); c.fill();
    c.fillStyle = '#ffc93c'; star(c, 120, -54, 14, 6, 5); c.fill();
  }
  function drawCauldron(c) {
    // Simon Smoke's Bubbling Dragon Cauldron
    shadow(c, 72, 90, 56, 10, 0.26);
    c.fillStyle = '#4a3560'; ell(c, 72, 84, 52, 12); c.fill();
    c.fillStyle = '#2b2438'; ell(c, 72, 54, 46, 34); c.fill();
    c.fillStyle = '#3f3552'; ell(c, 72, 28, 48, 12); c.fill();
    c.fillStyle = '#c74bff'; ell(c, 72, 28, 40, 9); c.fill();
    c.fillStyle = '#ff8cf6'; ell(c, 64, 27, 22, 5); c.fill();
    // Golden dragon handles
    c.strokeStyle = '#ffc93c'; c.lineWidth = 4;
    c.beginPath(); c.arc(24, 50, 10, 0.5, 5.8); c.stroke();
    c.beginPath(); c.arc(120, 50, 10, 0.5, 5.8); c.stroke();
  }
  function animCauldron(c, o, t) {
    const x = o.x * 48 + 72, y = o.y * 48 + 20;
    for (let k = 0; k < 5; k++) {
      const ph = (t * 0.45 + k / 5) % 1;
      c.strokeStyle = 'rgba(215,120,255,' + (0.75 * (1 - ph)) + ')';
      c.lineWidth = 2.5;
      ell(c, x + Math.sin(t * 2 + k) * 10, y - ph * 54, 8 + ph * 16, 4 + ph * 7);
      c.stroke();
    }
  }
  function drawPokeCenter(c) {
    // Classic Red-Roof Pokémon Center with PokéBall emblem!
    shadow(c, 96, 138, 92, 12, 0.24);
    c.fillStyle = '#f7f9fc'; rr(c, 10, 36, 172, 98, 10); c.fill();
    c.fillStyle = '#d9e2ec'; c.fillRect(10, 122, 172, 12);
    // Red rounded roof
    c.fillStyle = '#e83e38'; rr(c, 4, 2, 184, 48, 18); c.fill();
    c.fillStyle = '#ff6b63'; rr(c, 12, 8, 168, 16, 8); c.fill();
    // Giant PokéBall emblem above sliding glass doors
    c.fillStyle = '#ffffff'; circ(c, 96, 36, 20); c.fill();
    c.fillStyle = '#e83e38'; c.beginPath(); c.arc(96, 36, 20, Math.PI, 0); c.closePath(); c.fill();
    c.strokeStyle = '#2b2d38'; c.lineWidth = 3.5; circ(c, 96, 36, 20); c.stroke();
    c.beginPath(); c.moveTo(76, 36); c.lineTo(116, 36); c.stroke();
    c.fillStyle = '#ffffff'; circ(c, 96, 36, 6.5); c.fill(); c.stroke();
    // Sliding cyan glass doors & windows
    c.fillStyle = '#58c4f5'; rr(c, 74, 74, 44, 60, 5); c.fill();
    c.fillStyle = '#a6e3ff'; rr(c, 24, 68, 34, 32, 5); c.fill(); rr(c, 134, 68, 34, 32, 5); c.fill();
  }
  function drawOakLab(c) {
    // Professor Oak's Pallet Research Lab
    shadow(c, 120, 138, 114, 12, 0.24);
    c.fillStyle = '#f5efe2'; rr(c, 10, 34, 220, 100, 8); c.fill();
    c.fillStyle = '#4a7bd6'; rr(c, 4, 4, 232, 40, 10); c.fill();
    c.fillStyle = '#739ef0'; rr(c, 12, 10, 216, 12, 6); c.fill();
    // Roof radar dish & PokéBall sign
    c.fillStyle = '#d9e2ec'; ell(c, 188, -6, 18, 10); c.fill();
    c.fillStyle = '#ff4d4d'; circ(c, 120, 24, 12); c.fill();
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(120, 24, 12, 0, Math.PI); c.fill();
    c.strokeStyle = '#222'; c.lineWidth = 2.5; circ(c, 120, 24, 12); c.stroke();
    // Entrance & lab windows
    c.fillStyle = '#7a4a26'; rr(c, 100, 74, 40, 60, 4); c.fill();
    c.fillStyle = '#8fd8ff';
    for (const wx of [26, 62, 152, 188]) { rr(c, wx, 64, 26, 34, 4); c.fill(); }
  }
  function drawMewShrine(c) {
    // Ancient Cerulean Mew Shrine with floating pink crystal
    shadow(c, 72, 90, 56, 10, 0.22);
    c.fillStyle = '#d8d2f2'; rr(c, 16, 64, 112, 26, 6); c.fill();
    c.fillStyle = '#eeeaff'; rr(c, 26, 52, 92, 18, 5); c.fill();
    // Twin crystal pillars
    for (const px of [32, 98]) {
      c.fillStyle = '#b8aef0'; rr(c, px, 2, 14, 54, 4); c.fill();
      c.fillStyle = '#ff94c8'; circ(c, px + 7, -2, 7); c.fill();
    }
    // Central Mew Psychic Crystal
    c.fillStyle = '#ff94c8';
    c.beginPath(); c.moveTo(72, -32); c.lineTo(90, 6); c.lineTo(72, 34); c.lineTo(54, 6); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,.65)';
    c.beginPath(); c.moveTo(72, -32); c.lineTo(82, 4); c.lineTo(72, 18); c.closePath(); c.fill();
  }
  function animMewShrine(c, o, t) {
    const x = o.x * 48 + 72, y = o.y * 48 + 4;
    for (let k = 0; k < 5; k++) {
      const a = t * 1.4 + k * (PI2 / 5);
      c.fillStyle = 'rgba(255,160,220,.75)';
      circ(c, x + Math.cos(a) * 34, y + Math.sin(a) * 14, 4 + Math.sin(t * 3 + k) * 1.5); c.fill();
    }
  }
  function drawVolcano(c) {
    // Ember Volcano Peak where Charizard roosts
    shadow(c, 96, 136, 92, 14, 0.25);
    c.fillStyle = '#7a4430';
    c.beginPath(); c.moveTo(4, 134); c.lineTo(52, -16); c.lineTo(140, -16); c.lineTo(188, 134); c.closePath(); c.fill();
    c.fillStyle = '#9e5a3c';
    c.beginPath(); c.moveTo(22, 134); c.lineTo(62, -12); c.lineTo(126, -12); c.lineTo(156, 134); c.closePath(); c.fill();
    // Glowing lava crater rim
    c.fillStyle = '#4a2418'; ell(c, 96, -14, 44, 14); c.fill();
    c.fillStyle = '#ff5a1f'; ell(c, 96, -14, 34, 9); c.fill();
    c.fillStyle = '#ffd84d'; ell(c, 96, -14, 20, 5); c.fill();
  }
  function animVolcano(c, o, t) {
    const x = o.x * 48 + 96, y = o.y * 48 - 14;
    for (let k = 0; k < 6; k++) {
      const ph = (t * 0.5 + k / 6) % 1;
      c.fillStyle = k % 2 ? '#ffd84d' : '#ff6b2b';
      circ(c, x + Math.sin(t * 2.5 + k * 1.7) * 22, y - ph * 46, (1 - ph) * 4.5 + 1); c.fill();
    }
  }

  /* --- Grand Pokémon Continent Landmark Drawers (Zones 14 Johto, 15 Hoenn, 16 Sinnoh) --- */
  function drawBellTower(c) {
    // Ecruteak 3-tier golden-roofed Bell Tower pagoda in Johto
    shadow(c, 96, 138, 92, 14, 0.25);
    c.fillStyle = '#d6c6ad'; rr(c, 12, 104, 168, 36, 6); c.fill();
    const tiers = [
      [24, 52, 144, 54, -8, 200, 56],
      [38, 4, 116, 50, 10, 182, 8],
      [54, -40, 84, 46, 28, 164, -36],
    ];
    for (const [wx, wy, ww, wh, rL, rR, ry] of tiers) {
      c.fillStyle = '#7a3022'; rr(c, wx, wy, ww, wh, 4); c.fill();
      c.fillStyle = '#fdf4dc'; rr(c, wx + 8, wy + 6, ww - 16, wh - 10, 3); c.fill();
      c.fillStyle = '#c2410c'; c.fillRect(wx + ww / 2 - 8, wy + 10, 16, wh - 12);
      // Curved golden-bronze pagoda roof
      c.fillStyle = '#292524';
      c.beginPath(); c.moveTo(rL, ry + 6); c.quadraticCurveTo(96, ry - 26, rR, ry + 6); c.lineTo(rR - 12, ry + 14); c.quadraticCurveTo(96, ry - 8, rL + 12, ry + 14); c.closePath(); c.fill();
      c.fillStyle = '#f59e0b';
      c.beginPath(); c.moveTo(rL + 6, ry + 5); c.quadraticCurveTo(96, ry - 22, rR - 6, ry + 5); c.lineTo(rR - 16, ry + 10); c.quadraticCurveTo(96, ry - 10, rL + 16, ry + 10); c.closePath(); c.fill();
    }
    // Golden spire & sacred bell finial
    c.fillStyle = '#fbbf24'; c.fillRect(93, -86, 6, 46);
    circ(c, 96, -88, 9); c.fill();
    star(c, 96, -100, 10, 4.5, 5); c.fill();
  }
  function animBellTower(c, o, t) {
    const x = o.x * 48 + 96, y = o.y * 48 - 40;
    for (let k = 0; k < 5; k++) {
      const ph = (t * 0.35 + k / 5) % 1;
      c.fillStyle = k % 2 ? '#fbbf24' : '#f97316';
      c.globalAlpha = 0.85 * (1 - ph);
      circ(c, x + Math.sin(t * 2 + k * 1.4) * 58, y + ph * 140, 3.5); c.fill();
    }
    c.globalAlpha = 1;
  }
  function drawLugiaRoost(c) {
    // Whirl Island Tidal Roost with silver wing arches
    shadow(c, 72, 90, 62, 11, 0.24);
    c.fillStyle = '#38bdf8'; ell(c, 72, 74, 58, 20); c.fill();
    c.fillStyle = '#bae6fd'; ell(c, 72, 72, 46, 15); c.fill();
    c.fillStyle = '#cbd5e1'; rr(c, 22, 54, 100, 22, 8); c.fill();
    // Twin silver Lugia wing pillars
    for (const s of [-1, 1]) {
      c.save(); c.translate(72 + s * 34, 54);
      c.fillStyle = '#e2e8f0';
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(s * 28, -42, s * 10, -86); c.quadraticCurveTo(-s * 6, -54, -s * 8, 0); c.closePath(); c.fill();
      c.fillStyle = '#60a5fa';
      c.beginPath(); c.moveTo(s * 2, -12); c.quadraticCurveTo(s * 18, -42, s * 8, -72); c.quadraticCurveTo(0, -46, -s * 2, -12); c.closePath(); c.fill();
      c.restore();
    }
    c.fillStyle = '#3b82f6'; circ(c, 72, 18, 13); c.fill();
    c.fillStyle = '#eff6ff'; circ(c, 72, 18, 7); c.fill();
  }
  function animLugiaRoost(c, o, t) {
    const x = o.x * 48 + 72, y = o.y * 48 + 18;
    c.save();
    c.strokeStyle = 'rgba(147,197,253,' + (0.45 + 0.3 * Math.sin(t * 3)) + ')';
    c.lineWidth = 2.5;
    circ(c, x, y, 16 + Math.sin(t * 2.5) * 5); c.stroke();
    c.restore();
  }
  function drawApricornShop(c) {
    // Kurt's Azalea Apricorn Workshop
    shadow(c, 96, 138, 92, 12, 0.24);
    c.fillStyle = '#fef3c7'; rr(c, 12, 36, 168, 98, 8); c.fill();
    c.fillStyle = '#92400e'; c.fillRect(12, 36, 168, 8); c.fillRect(12, 126, 168, 8);
    // Warm wooden roof
    c.fillStyle = '#b45309'; rr(c, 4, 6, 184, 38, 12); c.fill();
    c.fillStyle = '#d97706'; rr(c, 12, 12, 168, 14, 6); c.fill();
    // Giant golden-red Apricorn emblem on roof
    c.fillStyle = '#ef4444'; circ(c, 96, 22, 16); c.fill();
    c.fillStyle = '#f59e0b'; c.beginPath(); c.arc(96, 22, 16, Math.PI, 0); c.fill();
    c.fillStyle = '#22c55e'; ell(c, 96, 5, 9, 4); c.fill();
    c.strokeStyle = '#451a03'; c.lineWidth = 2.5; circ(c, 96, 22, 16); c.stroke();
    // Door & Apricorn display windows
    c.fillStyle = '#78350f'; rr(c, 76, 74, 40, 60, 4); c.fill();
    c.fillStyle = '#fde68a'; rr(c, 24, 68, 38, 34, 4); c.fill(); rr(c, 130, 68, 38, 34, 4); c.fill();
    // Colorful Apricorns in window
    [['#ef4444', 34], ['#3b82f6', 44], ['#10b981', 54], ['#f59e0b', 140], ['#ec4899', 150], ['#8b5cf6', 160]].forEach(([col, ax]) => {
      c.fillStyle = col; circ(c, ax, 88, 4.5); c.fill();
    });
  }
  function drawSkyPillar(c) {
    // Hoenn Ancient Emerald Sky Pillar where Rayquaza coils
    shadow(c, 96, 138, 90, 14, 0.25);
    c.fillStyle = '#6ee7b7'; ell(c, 96, 126, 82, 18); c.fill();
    // Tall tiered emerald-jade stone tower
    c.fillStyle = '#065f46'; rr(c, 34, 52, 124, 78, 8); c.fill();
    c.fillStyle = '#047857'; rr(c, 44, -8, 104, 66, 8); c.fill();
    c.fillStyle = '#059669'; rr(c, 54, -64, 84, 62, 8); c.fill();
    // Glowing golden-emerald Rayquaza Delta runes on the tower
    c.strokeStyle = '#fde047'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(96, -50); c.lineTo(72, -16); c.lineTo(120, -16); c.closePath(); c.stroke();
    c.beginPath(); c.arc(96, 24, 18, 0, PI2); c.stroke();
    // Jade dragon altar crown
    c.fillStyle = '#10b981'; ell(c, 96, -66, 48, 12); c.fill();
    c.fillStyle = '#fef08a'; star(c, 96, -84, 14, 6, 5); c.fill();
  }
  function animSkyPillar(c, o, t) {
    const x = o.x * 48 + 96, y = o.y * 48 - 66;
    c.save();
    for (let k = 0; k < 5; k++) {
      const a = t * 1.6 + k * (PI2 / 5);
      c.fillStyle = k % 2 ? '#fde047' : '#34d399';
      circ(c, x + Math.cos(a) * 42, y + Math.sin(a) * 14, 4); c.fill();
    }
    c.restore();
  }
  function drawSecretBase(c) {
    // Hoenn Tropical Secret Base Treehouse
    shadow(c, 96, 138, 92, 13, 0.24);
    // Giant Banyan trunks
    c.fillStyle = '#78350f'; c.fillRect(30, 56, 26, 80); c.fillRect(136, 56, 26, 80);
    // Lush tropical canopy
    c.fillStyle = '#15803d'; ell(c, 96, 20, 96, 46); c.fill();
    c.fillStyle = '#22c55e'; ell(c, 64, 14, 58, 32); c.fill(); ell(c, 128, 14, 58, 32); c.fill();
    // Cozy wooden treehouse cabin nestled in the branches
    c.fillStyle = '#d97706'; rr(c, 24, 34, 144, 68, 10); c.fill();
    c.fillStyle = '#fef3c7'; rr(c, 32, 42, 128, 52, 6); c.fill();
    c.fillStyle = '#10b981'; rr(c, 18, 22, 156, 18, 8); c.fill();
    // Rope ladder & starter doll windows
    c.strokeStyle = '#92400e'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(84, 94); c.lineTo(84, 136); c.moveTo(108, 94); c.lineTo(108, 136); c.stroke();
    for (let y = 100; y <= 132; y += 8) { c.beginPath(); c.moveTo(84, y); c.lineTo(108, y); c.stroke(); }
    // Cute Treecko, Torchic & Mudkip plushies in the window!
    c.fillStyle = '#4ade80'; circ(c, 52, 68, 8); c.fill();
    c.fillStyle = '#fb923c'; circ(c, 96, 68, 8); c.fill();
    c.fillStyle = '#38bdf8'; circ(c, 140, 68, 8); c.fill();
  }
  function drawSpearPillar(c) {
    // Sinnoh Spear Pillar Marble Temple & Golden Hall of Origin Arch
    shadow(c, 120, 138, 114, 14, 0.25);
    c.fillStyle = '#cbd5e1'; rr(c, 8, 98, 224, 40, 8); c.fill();
    c.fillStyle = '#f8fafc'; rr(c, 14, 92, 212, 36, 6); c.fill();
    // Four fluted marble columns
    for (const px of [24, 66, 154, 196]) {
      c.fillStyle = '#e2e8f0'; rr(c, px, 4, 20, 92, 4); c.fill();
      c.fillStyle = '#f8fafc'; rr(c, px + 3, 4, 14, 92, 2); c.fill();
      c.fillStyle = '#fbbf24'; rr(c, px - 2, 0, 24, 8, 2); c.fill(); rr(c, px - 2, 90, 24, 8, 2); c.fill();
    }
    // Golden Arceus Wheel / Celestial Arch in the center
    c.strokeStyle = '#f59e0b'; c.lineWidth = 7;
    circ(c, 120, 32, 38); c.stroke();
    c.strokeStyle = '#fef08a'; c.lineWidth = 2.5;
    circ(c, 120, 32, 38); c.stroke();
    for (let k = 0; k < 8; k++) {
      const a = k * (Math.PI / 4);
      c.fillStyle = '#fbbf24';
      star(c, 120 + Math.cos(a) * 44, 32 + Math.sin(a) * 44, 7, 3, 4, a); c.fill();
    }
    c.fillStyle = '#fef08a'; star(c, 120, 32, 18, 7, 5); c.fill();
  }
  function animSpearPillar(c, o, t) {
    const x = o.x * 48 + 120, y = o.y * 48 + 32;
    c.save();
    c.strokeStyle = 'rgba(253,224,71,' + (0.45 + 0.35 * Math.sin(t * 2.8)) + ')';
    c.lineWidth = 3;
    circ(c, x, y, 46 + Math.sin(t * 2) * 4); c.stroke();
    c.restore();
  }
  function drawRowanLab(c) {
    // Professor Rowan's Sandgem Evolution Research Lab (Sinnoh)
    shadow(c, 120, 138, 114, 12, 0.24);
    c.fillStyle = '#f1f5f9'; rr(c, 10, 34, 220, 100, 8); c.fill();
    c.fillStyle = '#3730a3'; rr(c, 4, 4, 232, 40, 10); c.fill();
    c.fillStyle = '#6366f1'; rr(c, 12, 10, 216, 12, 6); c.fill();
    // Golden Sinnoh Myth Emblem on Roof
    c.fillStyle = '#fbbf24'; circ(c, 120, 24, 13); c.fill();
    c.fillStyle = '#eef2ff'; star(c, 120, 24, 9, 4, 4); c.fill();
    // Entrance & lab windows
    c.fillStyle = '#1e1b4b'; rr(c, 100, 74, 40, 60, 4); c.fill();
    c.fillStyle = '#93c5fd';
    for (const wx of [26, 62, 152, 188]) { rr(c, wx, 64, 26, 34, 4); c.fill(); }
  }

  function fenceMask(o) {
    let m = 0;
    const f = (x, y) => { const q = World.objectAt(x, y); return q && q.kind === 'fence'; };
    if (f(o.x, o.y - 1)) m |= 1; if (f(o.x + 1, o.y)) m |= 2; if (f(o.x, o.y + 1)) m |= 4; if (f(o.x - 1, o.y)) m |= 8;
    return m;
  }
  function objSprite(o, state) {
    const def = OBJ[o.kind];
    if (!def || def.noCache) return null;
    let key = o.kind + '|' + (o.variant != null ? o.variant : '') + '|' + o.z + '|' + o.w + 'x' + o.h + '|' + (state || '') + '|' + (o.style || '') + '|' + (o.roof || '') + '|' + (o.hue != null ? o.hue : '') + '|' + (o.big ? 'b' : '');
    let mask = 0;
    if (o.kind === 'fence') { mask = fenceMask(o); key += '|' + mask; }
    if (o.kind === 'cactus' || o.kind === 'flowerbed' || (o.kind === 'tree' && o.variant === 'blossom')) key += '|' + ((o.x + o.y) % 5);
    let spr = objCache.get(key);
    if (spr) return spr;
    const [bx, by, bw, bh] = def.box;
    const cv = mk(bw * S, bh * S), c = cv.getContext('2d');
    c.scale(S, S); c.translate(-bx, -by);
    if (o.kind === 'fence') drawFence(c, mask);
    else if (o.kind === 'chest') drawChest(c, state === 'open');
    else if (o.kind === 'flowerpot') drawFlowerpot(c, state === 'upright');
    else if (o.kind === 'berrytree') drawBerryTree(c, o, o.z, state !== 'empty');
    else def.draw(c, o);
    spr = { cv, bx, by };
    if (objCache.size > 600) objCache.clear();
    objCache.set(key, spr);
    return spr;
  }

  /* ======================= PEOPLE ======================= */
  const CHUYU_LOOK = { skin: '#ffdcbc', hair: '#4a2c1a', hairStyle: 'short', shirt: '#3d8bfd', pants: '#2c4f8f', hat: 'cap', hatColor: '#ff4d4d', backpack: '#ffb020' };
  function drawPerson(c, look, dir, frame, opts) {
    opts = opts || {};
    const walk = opts.moving ? (frame % 2 ? 1 : -1) : 0;
    const bob = opts.moving ? -Math.abs(walk) * 1.2 : 0;
    const side = dir === 'left' || dir === 'right';
    const flip = dir === 'left' ? -1 : 1;
    c.save();
    if (!opts.float) shadow(c, 0, 0, 12, 4, 0.22);
    if (look.glow && !opts.float) glowRing(c, look.glow);
    c.translate(0, bob);
    if (BACK_HAIR[look.hairStyle] && dir !== 'up') hairBack(c, look, dir, flip);
    if (!opts.float) {
      c.fillStyle = look.pants;
      if (side) {
        c.fillRect(-4 + walk * 2.5 * flip, -12, 5, 11); c.fillRect(-1 - walk * 2.5 * flip, -12, 5, 11);
      } else {
        c.fillRect(-6, -12, 5, 11 + (walk > 0 ? -1.5 : 0)); c.fillRect(1, -12, 5, 11 + (walk < 0 ? -1.5 : 0));
      }
      c.fillStyle = opts.skates ? '#ff5c8a' : '#3b2a20';
      if (side) { rr(c, -5 + walk * 2.5 * flip, -2, 7, 3.5, 1.5); c.fill(); rr(c, -2 - walk * 2.5 * flip, -2, 7, 3.5, 1.5); c.fill(); }
      else { rr(c, -7, -2 + (walk > 0 ? -1.5 : 0), 6.5, 3.5, 1.5); c.fill(); rr(c, 0.5, -2 + (walk < 0 ? -1.5 : 0), 6.5, 3.5, 1.5); c.fill(); }
      if (opts.skates) { c.fillStyle = '#ffd84d'; [-6, -2, 2, 6].forEach(x => { circ(c, x, 2, 1.6); c.fill(); }); }
    }
    if (look.backpack && dir !== 'down') { c.fillStyle = look.backpack; rr(c, side ? -10 * flip - (flip < 0 ? 0 : 0) - 3 : -8, -27, side ? 7 : 16, 15, 4); c.fill(); }
    if (look.wings) { c.fillStyle = 'rgba(190,240,255,.75)'; ell(c, -12, -26, 8, 11); c.fill(); ell(c, 12, -26, 8, 11); c.fill(); }
    c.fillStyle = look.coat ? '#ffffff' : look.shirt;
    rr(c, -9, -27, 18, 16, 5); c.fill();
    if (look.coat) { c.fillStyle = look.shirt === '#ffffff' ? '#9fc4ff' : look.shirt; c.fillRect(-2, -26, 4, 12); c.fillStyle = '#e0e6ef'; c.fillRect(-9, -14, 18, 4); }
    if (look.apron) { c.fillStyle = look.apron; rr(c, -6, -22, 12, 12, 2); c.fill(); }
    c.fillStyle = look.skin;
    if (side) { c.fillRect(-2 - walk * 2 * flip, -25, 4, 11); }
    else { c.fillRect(-12, -25 + walk * 1.2, 4, 10); c.fillRect(8, -25 - walk * 1.2, 4, 10); }
    if (look.backpack && dir === 'down') { c.fillStyle = shade(look.backpack, -30); c.fillRect(-9, -27, 3, 10); c.fillRect(6, -27, 3, 10); }
    // head
    const hy = -36;
    c.fillStyle = look.skin; circ(c, 0, hy, 10.5); c.fill();
    hair(c, look, dir, hy, flip);
    if (dir !== 'up') face(c, look, dir, hy, flip);
    hat(c, look, dir, hy, flip);
    if (look.headset) headset(c, dir, hy, flip);
    if (look.weapon) weapon(c, look, dir, flip, side);
    if (look.glow) glowSparkles(c, look.glow);
    c.restore();
  }
  /* --- Honmoon Island looks: long back hair, braids, buns, weapons, headset, golden glow --- */
  const BACK_HAIR = { longpig: 1, sidepart: 1, dragonbraid: 1 };
  function nowSec() { return (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000; }
  function glowRing(c, col) {
    const p = 0.5 + 0.5 * Math.sin(nowSec() * 3);
    c.save();
    c.globalAlpha = 0.2 + 0.12 * p; c.fillStyle = col; ell(c, 0, 0, 15 + p * 2, 5.4 + p * 0.8); c.fill();
    c.globalAlpha = 0.55 + 0.35 * p; c.strokeStyle = col; c.lineWidth = 1.6; ell(c, 0, 0, 12.5 + p * 3.5, 4.4 + p * 1.2); c.stroke();
    c.restore();
  }
  function glowSparkles(c, col) {
    const t = nowSec();
    c.save();
    for (let k = 0; k < 3; k++) {
      const ph = (t * 0.55 + k / 3) % 1, a = Math.sin(ph * Math.PI);
      const x = (k === 1 ? -1 : 1) * (13 + (k % 2) * 2) + Math.sin(t * 2 + k) * 1.5, y = -4 - ph * 36;
      c.globalAlpha = a; c.fillStyle = col; sparkle(c, x, y, 1.4 + a * 1.6);
      c.fillStyle = '#ffffff'; sparkle(c, x, y, 0.6 + a * 0.7);
    }
    c.restore();
  }
  function braidChain(c, x0, y0, x1, y1, n, w, col) {
    // braid = chain of alternating tilted ovals along the segment, tapering toward the end
    const dk = shade(col, -45), ang = Math.atan2(y1 - y0, x1 - x0) - Math.PI / 2;
    for (let k = 0; k < n; k++) {
      const u = (k + 0.5) / n, x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u, ww = w * (1 - u * 0.3);
      c.save(); c.translate(x, y); c.rotate(ang + (k % 2 ? 0.55 : -0.55));
      c.fillStyle = col; ell(c, 0, 0, ww * 0.55, ww * 0.92); c.fill();
      c.strokeStyle = dk; c.lineWidth = Math.max(0.5, ww * 0.12); c.stroke();
      c.restore();
    }
  }
  function ribbonBow(c, x, y, s, col) {
    c.fillStyle = col;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x - s * 1.5, y - s * 0.9); c.lineTo(x - s * 1.5, y + s * 0.9); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + s * 1.5, y - s * 0.9); c.lineTo(x + s * 1.5, y + s * 0.9); c.closePath(); c.fill();
    c.fillRect(x - s * 0.5, y, s * 0.4, s * 1.9); c.fillRect(x + s * 0.1, y, s * 0.4, s * 1.7);
    c.fillStyle = shade(col, -40); circ(c, x, y, s * 0.5); c.fill();
  }
  function hairBack(c, look, dir, flip) {
    const hy = -36, st = look.hairStyle;
    c.fillStyle = look.hair;
    if (st === 'longpig') {
      if (dir === 'down') { rr(c, -12.5, hy - 4, 25, 31, 8); c.fill(); }
      else { rr(c, flip > 0 ? -13 : 2, hy - 3, 11, 31, 5); c.fill(); }
    } else if (st === 'sidepart') {
      if (dir === 'down') { rr(c, -12.2, hy - 4, 24.4, 22, 7); c.fill(); }
      else { rr(c, flip > 0 ? -13 : 3, hy - 3, 10, 22, 5); c.fill(); }
    }
  }
  function headset(c, dir, hy, flip) {
    c.save();
    c.strokeStyle = '#2b2b38'; c.lineWidth = 1.6; c.lineCap = 'round'; c.fillStyle = '#2b2b38';
    if (dir === 'down' || dir === 'up') {
      c.beginPath(); c.arc(0, hy - 0.5, 11.8, Math.PI * 1.06, Math.PI * 1.94); c.stroke();
      rr(c, -13.2, hy - 2.5, 4.4, 7.5, 2); c.fill(); rr(c, 8.8, hy - 2.5, 4.4, 7.5, 2); c.fill();
      c.fillStyle = '#ff5fa8'; circ(c, -11, hy + 1.2, 1); c.fill(); circ(c, 11, hy + 1.2, 1); c.fill();
      if (dir === 'down') {
        c.strokeStyle = '#2b2b38'; c.lineWidth = 1.1;
        c.beginPath(); c.moveTo(-11, hy + 4); c.quadraticCurveTo(-10, hy + 8.5, -4.5, hy + 7.6); c.stroke();
        c.fillStyle = '#2b2b38'; circ(c, -4, hy + 7.5, 1.5); c.fill();
      }
    } else {
      c.beginPath(); c.arc(0, hy - 0.5, 11.8, Math.PI * 1.2, Math.PI * 1.8); c.stroke();
      const ex = -1.5 * flip;
      rr(c, ex - 2.6, hy - 3, 5.2, 7.5, 2.4); c.fill();
      c.fillStyle = '#ff5fa8'; circ(c, ex, hy + 0.8, 1); c.fill();
      c.strokeStyle = '#2b2b38'; c.lineWidth = 1.1;
      c.beginPath(); c.moveTo(ex, hy + 4); c.quadraticCurveTo(ex + 3 * flip, hy + 9, 7.5 * flip, hy + 6.8); c.stroke();
      c.fillStyle = '#2b2b38'; circ(c, 7.8 * flip, hy + 6.8, 1.5); c.fill();
    }
    c.restore();
  }
  function weapon(c, look, dir, flip, side) {
    const w = look.weapon, t = nowSec(), glow = look.glow || '#ffd84d';
    const pulse = 0.5 + 0.5 * Math.sin(t * 3);
    const sx = dir === 'up' ? -1 : 1;
    c.save();
    c.lineCap = 'round';
    if (w === 'saingeom') {
      // slim golden sword held upright at her side
      if (side) { c.translate(2 * flip, -15); c.rotate(flip * 0.22); } else { c.translate(11.5 * sx, -15); c.rotate(sx * 0.1); }
      c.globalAlpha = 0.25 + 0.2 * pulse; c.strokeStyle = glow; c.lineWidth = 6; c.beginPath(); c.moveTo(0, -5); c.lineTo(0, -31); c.stroke();
      c.globalAlpha = 1;
      c.fillStyle = '#fff6c4'; c.beginPath(); c.moveTo(-1.3, -4); c.lineTo(-1.1, -29); c.lineTo(0, -33); c.lineTo(1.1, -29); c.lineTo(1.3, -4); c.closePath(); c.fill();
      c.fillStyle = '#ffc93c'; c.fillRect(-0.35, -28, 0.7, 23);
      c.fillStyle = '#ffc93c'; rr(c, -3.8, -5.2, 7.6, 2.4, 1.1); c.fill();
      c.fillStyle = '#4b2a63'; rr(c, -1.2, -3, 2.4, 6.5, 1); c.fill();
      c.fillStyle = '#ffc93c'; circ(c, 0, 4, 1.4); c.fill();
    } else if (w === 'gokdo') {
      // tall polearm with a curved crescent blade and a pink tassel
      if (side) c.translate(3 * flip, 0); else c.translate(13 * sx, 0);
      const bs = side ? flip : sx;
      c.strokeStyle = '#7a4a26'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(0, 1); c.lineTo(0, -48); c.stroke();
      c.fillStyle = '#ffc93c'; c.fillRect(-1.6, -49.5, 3.2, 2.4); c.fillRect(-1.4, -26, 2.8, 1.6); circ(c, 0, 1.5, 1.4); c.fill();
      c.globalAlpha = 0.22 + 0.18 * pulse; c.fillStyle = glow;
      c.beginPath(); c.moveTo(-1, -48); c.quadraticCurveTo(bs * 13, -53, bs * 3, -67); c.quadraticCurveTo(bs * 5, -56, -1, -51); c.closePath(); c.fill();
      c.globalAlpha = 1;
      c.fillStyle = '#eef1fb'; c.beginPath(); c.moveTo(0, -49); c.quadraticCurveTo(bs * 10, -53, bs * 3, -64); c.quadraticCurveTo(bs * 4.5, -55, 0, -52.5); c.closePath(); c.fill();
      c.strokeStyle = '#ffc93c'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(bs * 1, -51); c.quadraticCurveTo(bs * 7.5, -54, bs * 3, -62); c.stroke();
      c.fillStyle = '#ff3d8b'; c.beginPath(); c.moveTo(0, -47); c.quadraticCurveTo(-bs * 4, -42, -bs * 3, -36); c.lineTo(-bs * 1, -37); c.quadraticCurveTo(-bs * 1.5, -42, 0, -45); c.closePath(); c.fill();
    } else if (w === 'shinkal') {
      // two small glowing knives, one in each hand
      const hands = side ? [[1.5 * flip, flip]] : [[-11, -1], [11, 1]];
      hands.forEach(([hx, s]) => {
        c.save(); c.translate(hx, -15); c.rotate(s * 0.65);
        c.globalAlpha = 0.3 + 0.25 * pulse; c.strokeStyle = glow; c.lineWidth = 4.5; c.beginPath(); c.moveTo(0, -2.5); c.lineTo(0, -11.5); c.stroke();
        c.globalAlpha = 1;
        c.fillStyle = '#fff8d6'; c.beginPath(); c.moveTo(-1.3, -2.4); c.lineTo(0, -12.5); c.lineTo(1.3, -2.4); c.closePath(); c.fill();
        c.fillStyle = '#ffc93c'; c.fillRect(-2.3, -2.8, 4.6, 1.3);
        c.fillStyle = '#2b2b45'; rr(c, -0.9, -1.6, 1.8, 4.6, 0.9); c.fill();
        c.restore();
      });
    }
    c.restore();
  }
  function hairExtras(c, look, dir, hy, flip) {
    const st = look.hairStyle, col = look.hair;
    if (st === 'dragonbraid') {
      const rib = look.ribbon || '#ffc93c';
      if (dir === 'down') {
        braidChain(c, 0, hy - 2, 0, hy - 9.6, 4, 4.4, col);
        braidChain(c, -8.5, hy + 4, -9.6, -12, 6, 5.6, col);
        ribbonBow(c, -9.6, -12.5, 1.8, rib);
        c.fillStyle = col; c.beginPath(); c.moveTo(-11, -10.5); c.lineTo(-8, -10.5); c.lineTo(-8.4, -6.5); c.lineTo(-9.6, -7.5); c.lineTo(-10.8, -6.3); c.closePath(); c.fill();
      } else if (dir === 'up') {
        braidChain(c, 0, hy - 12, 0, -11, 9, 6, col);
        ribbonBow(c, 0, -11.5, 1.9, rib);
        c.fillStyle = col; c.beginPath(); c.moveTo(-1.6, -9.5); c.lineTo(1.6, -9.5); c.lineTo(1.2, -5.5); c.lineTo(0, -6.5); c.lineTo(-1.2, -5.3); c.closePath(); c.fill();
      } else {
        for (let k = 0; k < 4; k++) {
          const a = -Math.PI / 2 + flip * (0.75 - k * 0.55), x = Math.cos(a) * 10.8, y = hy - 1 + Math.sin(a) * 10.8;
          c.save(); c.translate(x, y); c.rotate(a + Math.PI / 2 + (k % 2 ? 0.5 : -0.5)); c.fillStyle = col; ell(c, 0, 0, 2.6, 3.6); c.fill();
          c.strokeStyle = shade(col, -45); c.lineWidth = 0.6; c.stroke(); c.restore();
        }
        braidChain(c, -8.5 * flip, hy + 3, -10.5 * flip, -12, 6, 5.6, col);
        ribbonBow(c, -10.5 * flip, -12.5, 1.8, rib);
      }
    } else if (st === 'longpig') {
      // two little pigtail bunches tied at the top of the head, drooping outward
      const tufts = dir === 'down' || dir === 'up' ? [-1, 1] : [-flip];
      tufts.forEach(s => {
        const ox = dir === 'down' || dir === 'up' ? 0 : -2 * flip;
        c.fillStyle = col;
        c.beginPath(); c.moveTo(ox + s * 3.5, hy - 10.5);
        c.quadraticCurveTo(ox + s * 11.5, hy - 15.5, ox + s * 14, hy - 6.5);
        c.quadraticCurveTo(ox + s * 13.6, hy - 3.6, ox + s * 11.8, hy - 5.4);
        c.quadraticCurveTo(ox + s * 10, hy - 10, ox + s * 5, hy - 7.6);
        c.closePath(); c.fill();
        c.fillStyle = '#ffd84d'; circ(c, ox + s * 5.4, hy - 9.6, 1.5); c.fill();
      });
      if (dir === 'down') { c.fillStyle = col; c.fillRect(-11.4, hy - 2, 4, 15); c.fillRect(7.4, hy - 2, 4, 15); }
      else if (dir === 'up') { c.fillStyle = col; rr(c, -11.5, hy - 2, 23, 30, 7); c.fill(); }
    } else if (st === 'spacebuns') {
      const pos = dir === 'down' || dir === 'up' ? [[-8.2, hy - 8.4], [8.2, hy - 8.4]] : [[-1.5 * flip, hy - 10.6], [-7.8 * flip, hy - 7.4]];
      pos.forEach(([bx, by]) => {
        c.fillStyle = col; circ(c, bx, by, 4.6); c.fill();
        c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = 0.75;
        c.beginPath(); c.arc(bx, by, 3.3, 0.4, 2.6); c.stroke();
        c.beginPath(); c.arc(bx, by, 1.8, 3.5, 5.7); c.stroke();
        c.beginPath(); c.arc(bx, by, 3.3, 3.6, 4.9); c.stroke();
      });
      c.fillStyle = '#2ec4b6';
      pos.forEach(([bx, by]) => { const dx = bx > 0 ? -1 : 1; c.beginPath(); c.ellipse(bx + dx * 2.6, by + 3, 1.6, 1, 0.6 * dx, 0, PI2); c.fill(); });
    } else if (st === 'sidepart') {
      const sc = look.streak || '#bfbfbf';
      if (dir === 'down') {
        c.fillStyle = col;
        c.beginPath(); c.moveTo(-3.5, hy - 11); c.quadraticCurveTo(8, hy - 11.5, 10.8, hy - 1); c.quadraticCurveTo(4, hy - 6.5, -3.5, hy - 7.2); c.closePath(); c.fill();
        c.beginPath(); c.moveTo(-3.5, hy - 11); c.quadraticCurveTo(-10.5, hy - 8.5, -10.8, hy + 1); c.lineTo(-8, hy + 1); c.quadraticCurveTo(-7.4, hy - 5.5, -3, hy - 8.4); c.closePath(); c.fill();
        c.fillRect(-11.3, hy - 2, 4, 16); c.fillRect(7.3, hy - 2, 4, 16);
        c.strokeStyle = sc; c.lineWidth = 1.7; c.lineCap = 'round';
        c.beginPath(); c.moveTo(-2.5, hy - 10.6); c.quadraticCurveTo(5.5, hy - 10.4, 9.2, hy - 2.6); c.stroke();
      } else if (dir === 'up') {
        c.fillStyle = col; rr(c, -11.4, hy - 2, 22.8, 21, 7); c.fill();
        c.strokeStyle = sc; c.lineWidth = 1.7; c.lineCap = 'round';
        c.beginPath(); c.moveTo(3, hy - 10); c.quadraticCurveTo(5, hy, 4, hy + 16); c.stroke();
      } else {
        c.fillStyle = col;
        c.beginPath(); c.moveTo(-6 * flip, hy - 10.5); c.quadraticCurveTo(8 * flip, hy - 12, 10.6 * flip, hy - 2); c.quadraticCurveTo(5 * flip, hy - 6.5, -2 * flip, hy - 7); c.closePath(); c.fill();
        c.strokeStyle = sc; c.lineWidth = 1.7; c.lineCap = 'round';
        c.beginPath(); c.moveTo(-3 * flip, hy - 10.2); c.quadraticCurveTo(6 * flip, hy - 10.6, 9.5 * flip, hy - 3.5); c.stroke();
      }
    }
  }
  function hair(c, look, dir, hy, flip) {
    c.fillStyle = look.hair;
    const st = look.hairStyle;
    if (st === 'bald') { c.beginPath(); c.arc(0, hy, 10.6, Math.PI * 0.95, Math.PI * 1.05); c.fill(); c.fillRect(-11, hy - 2, 3, 6); c.fillRect(8, hy - 2, 3, 6); return; }
    if (dir === 'up') { circ(c, 0, hy - 1, 10.8); c.fill(); }
    else {
      c.beginPath(); c.arc(0, hy - 1, 10.8, Math.PI, 0); c.fill();
      if (dir === 'down') { c.fillRect(-10.8, hy - 2, 4, 6); c.fillRect(6.8, hy - 2, 4, 6); }
      else { c.fillRect(flip > 0 ? -10.8 : 4.8, hy - 2, 6, 8); } // back-of-head lock, mirrored for left/right
    }
    if (st === 'spiky') { for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(k * 4 - 3, hy - 8); c.lineTo(k * 4, hy - 15); c.lineTo(k * 4 + 3, hy - 8); c.fill(); } }
    if (st === 'bun') { circ(c, 0, hy - 12, 5); c.fill(); }
    if (st === 'ponytail') { if (dir !== 'down') { ell(c, -8 * flip, hy + 2, 3.5, 7); c.fill(); } else { ell(c, 9, hy + 3, 3, 6); c.fill(); } }
    if (st === 'pigtails') { circ(c, -11, hy + 2, 4); c.fill(); circ(c, 11, hy + 2, 4); c.fill(); }
    if (st === 'braid') { c.fillRect(-12, hy, 4, 12); c.fillRect(8, hy, 4, 12); }
    if (st === 'long') { c.fillRect(-11, hy - 2, 4, 16); c.fillRect(7, hy - 2, 4, 16); if (dir === 'up') c.fillRect(-11, hy, 22, 14); }
    if (st === 'dragonbraid' || st === 'longpig' || st === 'spacebuns' || st === 'sidepart') hairExtras(c, look, dir, hy, flip);
  }
  function face(c, look, dir, hy, flip) {
    c.fillStyle = '#2b1d14';
    if (dir === 'down') {
      ell(c, -4, hy + 1, 1.6, 2.2); c.fill(); ell(c, 4, hy + 1, 1.6, 2.2); c.fill();
      c.fillStyle = '#fff'; circ(c, -3.5, hy, 0.6); c.fill(); circ(c, 4.5, hy, 0.6); c.fill();
      c.strokeStyle = '#a0522d'; c.lineWidth = 1.2; c.beginPath(); c.arc(0, hy + 4, 3, 0.2, Math.PI - 0.2); c.stroke();
      c.fillStyle = 'rgba(255,120,120,.35)'; ell(c, -7, hy + 4, 2.4, 1.4); c.fill(); ell(c, 7, hy + 4, 2.4, 1.4); c.fill();
      if (look.glasses) { c.strokeStyle = '#333'; c.lineWidth = 1; circ(c, -4, hy + 1, 3); c.stroke(); circ(c, 4, hy + 1, 3); c.stroke(); }
      if (look.beard) { c.fillStyle = look.hair; c.beginPath(); c.arc(0, hy + 4, 8, 0.1, Math.PI - 0.1); c.fill(); }
    } else {
      ell(c, 4.5 * flip, hy + 1, 1.5, 2.2); c.fill();
      c.fillStyle = look.skin; circ(c, 10 * flip, hy + 2, 2.2); c.fill();
      c.strokeStyle = '#a0522d'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(4 * flip, hy + 5.5); c.lineTo(7 * flip, hy + 5); c.stroke();
      if (look.glasses) { c.strokeStyle = '#333'; c.lineWidth = 1; circ(c, 5 * flip, hy + 1, 3); c.stroke(); }
      if (look.beard) { c.fillStyle = look.hair; c.beginPath(); c.arc(2 * flip, hy + 4, 7, 0.1, Math.PI - 0.1); c.fill(); }
    }
  }
  function hat(c, look, dir, hy, flip) {
    const h = look.hat;
    if (!h || h === 'none') return;
    const col = look.hatColor;
    switch (h) {
      case 'cap':
        c.fillStyle = col; c.beginPath(); c.arc(0, hy - 3, 11, Math.PI, 0); c.fill();
        c.fillStyle = '#ffffff'; c.beginPath(); c.arc(0, hy - 3, 11, Math.PI * 1.35, Math.PI * 1.65); c.lineTo(0, hy - 3); c.fill();
        c.fillStyle = shade(col, -30);
        if (dir === 'down') { ell(c, 0, hy - 3, 12, 3); c.fill(); }
        else if (dir !== 'up') { ell(c, 9 * flip, hy - 3, 8, 2.6); c.fill(); }
        else { ell(c, 0, hy - 3, 11, 2); c.fill(); }
        c.fillStyle = '#ffd84d'; star(c, 0, hy - 9, 2.6, 1.1, 5); c.fill();
        break;
      case 'cap2': c.fillStyle = '#3b6fd6'; c.beginPath(); c.arc(0, hy - 3, 11, Math.PI, 0); c.fill(); c.fillStyle = '#2a4f9a'; ell(c, dir === 'down' ? 0 : 8 * flip, hy - 3, 10, 2.6); c.fill(); break;
      case 'elephant':
        c.fillStyle = '#8fc3f0'; ell(c, -12, hy - 2, 6, 8); c.fill(); ell(c, 12, hy - 2, 6, 8); c.fill();
        c.fillStyle = '#a9d3f7'; c.beginPath(); c.arc(0, hy - 4, 11, Math.PI, 0); c.fill();
        c.fillStyle = '#ffd84d'; circ(c, 0, hy - 12, 2.6); c.fill();
        break;
      case 'ranger': case 'explorer': case 'straw': case 'fisher': {
        const cc = h === 'ranger' ? '#7a5c3a' : h === 'explorer' ? '#e9dcb0' : h === 'straw' ? '#f2d16b' : '#5a7b9a';
        c.fillStyle = cc; ell(c, 0, hy - 6, 15, 4); c.fill(); c.beginPath(); c.arc(0, hy - 6, 9, Math.PI, 0); c.fill();
        if (h === 'straw') { c.fillStyle = '#e8413b'; c.fillRect(-9, hy - 9, 18, 2.4); }
        break;
      }
      case 'beanie': case 'beanie2': c.fillStyle = h === 'beanie' ? '#c94a3a' : '#ff6fa8'; c.beginPath(); c.arc(0, hy - 3, 11, Math.PI, 0); c.fill(); c.fillStyle = '#ffffff'; c.fillRect(-11, hy - 4, 22, 3); circ(c, 0, hy - 14, 3); c.fill(); break;
      case 'visor': c.fillStyle = '#ffffff'; c.fillRect(-11, hy - 7, 22, 3); c.fillStyle = '#ff4d4d'; ell(c, dir === 'down' ? 0 : 8 * flip, hy - 5, 9, 2.4); c.fill(); break;
      case 'flower': ['#ff7ab8', '#ffd84d', '#9fb8ff', '#ffffff', '#ff9f43'].forEach((cc, k) => { c.fillStyle = cc; circ(c, -9 + k * 4.5, hy - 9 - Math.sin(k) * 1.5, 2.6); c.fill(); }); break;
      case 'ninja': c.fillStyle = '#e8413b'; c.fillRect(-11, hy - 5, 22, 3.4); if (dir !== 'down') { c.fillRect(-10 * flip, hy - 4, 3 * -flip, 9); } break;
      case 'helmet': c.fillStyle = '#c0c6d6'; c.beginPath(); c.arc(0, hy - 2, 12, Math.PI, 0); c.fill(); c.fillStyle = '#e8413b'; c.fillRect(-2, hy - 20, 4, 8); break;
      case 'crown': c.fillStyle = '#ffd84d'; c.beginPath(); c.moveTo(-8, hy - 7); c.lineTo(-8, hy - 15); c.lineTo(-4, hy - 10); c.lineTo(0, hy - 17); c.lineTo(4, hy - 10); c.lineTo(8, hy - 15); c.lineTo(8, hy - 7); c.closePath(); c.fill(); c.fillStyle = '#ff5c8a'; circ(c, 0, hy - 10, 1.6); c.fill(); break;
      case 'gat':
        c.fillStyle = '#1b1b24'; ell(c, 0, hy - 7, 15, 3.6); c.fill();
        rr(c, -6.5, hy - 19, 13, 12, 3); c.fill();
        break;
      default: break;
    }
  }
  function drawDuckFloat(c, front) {
    // ring around Chuyu's waist (draw back half first, front half after the body)
    if (!front) {
      c.fillStyle = 'rgba(255,255,255,.55)'; ell(c, 0, -6, 20, 6); c.fill();
      c.fillStyle = '#e8b400'; c.beginPath(); c.ellipse(0, -10, 17, 7, 0, Math.PI, 0); c.fill();
    } else {
      c.fillStyle = '#ffd400'; c.beginPath(); c.ellipse(0, -10, 17, 7, 0, 0, Math.PI); c.lineTo(-17, -10); c.fill();
      c.fillStyle = '#ffe866'; ell(c, -6, -6, 5, 2); c.fill();
      c.fillStyle = '#ffd400'; circ(c, 13, -16, 5.5); c.fill();
      c.fillStyle = '#ff8a00'; c.beginPath(); c.moveTo(17, -16); c.lineTo(23, -14.5); c.lineTo(17, -13); c.fill();
      c.fillStyle = '#222'; circ(c, 14.5, -17.5, 1.1); c.fill();
    }
  }

  function drawMiniFloat(c, x, y, r, front, col) {
    c.save();
    c.lineWidth = r * 0.42;
    const seg = (a0, a1, colr) => { c.strokeStyle = colr; c.beginPath(); c.ellipse(x, y, r, r * 0.38, 0, a0, a1); c.stroke(); };
    if (!front) { for (let k = 0; k < 4; k++) seg(Math.PI + k * Math.PI / 4, Math.PI + (k + 1) * Math.PI / 4, k % 2 ? '#ffffff' : col); }
    else { for (let k = 0; k < 4; k++) seg(k * Math.PI / 4, (k + 1) * Math.PI / 4, k % 2 ? '#ffffff' : col); }
    c.restore();
  }

  /* ======================= CRITTERS ======================= */
  const EAR = {
    dogday: '#9b5a2b', solar: '#e89a14', catnap: '#6a4fc0', galaxy: '#3b3bb0', hoppy: '#2fbf7f', thunderbolt: '#ffcc00', picky: '#f6a5c0',
    bobby: '#d93f56', poppy: '#2b2b38', bubba: '#7fb8ec', crafty: '#ffffff', prism: '#ffc4f0', kickin: '#ffcf33', superstar: '#ffae00',
    sunny: '#f08a3c', huggy: '#2f6fd6', aurora: '#9ff4ff', luna: '#6b4fb8', mikey: '#3fa34d', jj: '#3b82f6',
    derpy: '#2f9bff', sussie: '#1e2233', imp: '#8a4dff', gwima: '#9b4dff', jinu: '#1b1b24', abby: '#1b1b24', mystery: '#1b1b24',
    romance: '#1b1b24', baby: '#1b1b24', rumi: '#8e4bff', mira: '#ff3d8b', zoey: '#1b1b24',
    gatderpy: '#2b7de9', waterdemon: '#ffffff', flightdemon: '#2b3e6b', jeoseung: '#1b1b24',
    baba: '#3b3b4f', icky: '#49b84c', rabie: '#ff5ca8', allister: '#3b9c4c', simon: '#e03e3e', poe: '#554296', touille: '#8c7b70', maggie: '#3a9fe8',
    pikachu: '#f7d02c', bulbasaur: '#49a86b', charmander: '#ff7f32', squirtle: '#58b4f5', jigglypuff: '#ff9ecf', eevee: '#c88a4b',
    psyduck: '#f5c842', meowth: '#f0d27f', gengar: '#7a52b8', snorlax: '#3b7a8c', charizard: '#ff6b2b', mew: '#ff94c8',
  };
  // accessories with a layer drawn OVER the portrait (hat brims, chin strings)
  const FRONT_EARS = { gat: 1, gatderpy: 1, magpie: 1, horns: 1, towel: 1, cap: 1 };
  function gatHat(c, r, s, col, tilt, chin, y0) {
    // traditional Korean gat: translucent black horsehair brim + tall rounded crown (+ beaded chin string)
    c.save(); c.rotate(tilt);
    const by = y0 != null ? y0 : -r * 0.8;
    const cw = r * 0.44 * s, ch = r * 0.66 * s;
    const ink = col.length === 7 ? col : '#1b1b24';
    c.fillStyle = ink;
    c.beginPath(); c.moveTo(-cw, by);
    c.lineTo(-cw * 0.9, by - ch + cw * 0.55); c.quadraticCurveTo(-cw * 0.86, by - ch, 0, by - ch);
    c.quadraticCurveTo(cw * 0.86, by - ch, cw * 0.9, by - ch + cw * 0.55); c.lineTo(cw, by); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,.16)'; c.fillRect(-cw * 0.62, by - ch * 0.82, cw * 0.22, ch * 0.7);
    c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(-cw * 0.95, by - ch * 0.24, cw * 1.9, ch * 0.1);
    c.globalAlpha = 0.6; c.fillStyle = ink; ell(c, 0, by, r * 1.3 * s, r * 0.25 * s); c.fill(); c.globalAlpha = 1;
    c.strokeStyle = ink; c.lineWidth = Math.max(0.8, r * 0.04 * s); ell(c, 0, by, r * 1.3 * s, r * 0.25 * s); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.16)'; c.lineWidth = Math.max(0.5, r * 0.02); ell(c, 0, by, r * 0.98 * s, r * 0.17 * s); c.stroke();
    if (chin) {
      const br = Math.max(0.7, r * 0.045);
      for (const sd of [-1, 1]) {
        for (let k = 0; k <= 9; k++) {
          const [x, y] = quadPt(sd * cw * 1.05, by + r * 0.06, sd * r * 0.62, r * 0.5, sd * r * 0.06, r * 0.96, k / 9);
          c.fillStyle = k % 3 === 1 ? '#c99a3e' : ink; circ(c, x, y, br); c.fill();
        }
      }
    }
    c.restore();
  }
  function drawEars(c, sp, x, y, r, t, front) {
    const col = EAR[sp.id] || sp.color;
    const dk = shade(col.length === 7 ? col : '#888888', -40);
    const wig = Math.sin(t * 5 + sp.num) * 0.12;
    c.save();
    c.translate(x, y);
    c.lineWidth = r * 0.06; c.strokeStyle = dk;
    if (front) {
      if (sp.ears === 'gat') gatHat(c, r, 1, col, -0.12, true);
      else if (sp.ears === 'gatderpy') gatHat(c, r, 0.72, '#1b1b24', 0.08, false, -r * 0.88);
      else if (sp.ears === 'magpie') gatHat(c, r, 0.5, '#1b1b24', 0.1, false, -r * 0.94);
      else if (sp.ears === 'horns') gatHat(c, r, 0.52, '#1b1b24', -0.08, false, -r * 0.93);
      else if (sp.ears === 'towel') {
        // Korean bathhouse sheep-horn towel (yangmeori)
        c.fillStyle = '#ffffff'; c.strokeStyle = '#9bc4e2'; c.lineWidth = r * 0.05;
        rr(c, -r * 0.75, -r * 1.08, r * 1.5, r * 0.34, r * 0.14); c.fill(); c.stroke();
        for (const s of [-1, 1]) { circ(c, s * r * 0.82, -r * 0.88, r * 0.28); c.fill(); c.stroke(); }
      } else if (sp.ears === 'cap') {
        // Cabin-crew flight cap
        c.fillStyle = '#243b6b'; c.strokeStyle = '#ffc93c'; c.lineWidth = r * 0.05;
        c.beginPath(); c.moveTo(-r * 0.55, -r * 0.86); c.lineTo(0, -r * 1.22); c.lineTo(r * 0.55, -r * 0.86); c.closePath(); c.fill(); c.stroke();
      }
      c.restore();
      return;
    }
    switch (sp.ears) {
      case 'dog':
        for (const s of [-1, 1]) { c.save(); c.rotate(s * (0.35 + wig)); c.fillStyle = col; ell(c, s * r * 0.92, r * 0.05, r * 0.32, r * 0.62); c.fill(); c.stroke(); c.restore(); }
        break;
      case 'cat': case 'fox':
        for (const s of [-1, 1]) {
          c.save(); c.rotate(s * (0.12 + wig));
          c.fillStyle = col; c.beginPath(); c.moveTo(s * r * 0.25, -r * 0.8); c.lineTo(s * r * 0.75, -r * 1.42); c.lineTo(s * r * 0.95, -r * 0.45); c.closePath(); c.fill(); c.stroke();
          c.fillStyle = '#ffb3cf'; c.beginPath(); c.moveTo(s * r * 0.4, -r * 0.82); c.lineTo(s * r * 0.73, -r * 1.22); c.lineTo(s * r * 0.85, -r * 0.6); c.closePath(); c.fill();
          c.restore();
        }
        if (sp.ears === 'fox') { c.save(); c.rotate(Math.sin(t * 3) * 0.2); c.fillStyle = col; ell(c, r * 1.05, r * 0.55, r * 0.42, r * 0.22); c.fill(); c.stroke(); c.fillStyle = '#fff'; ell(c, r * 1.38, r * 0.5, r * 0.14, r * 0.13); c.fill(); c.restore(); }
        break;
      case 'bunny':
        for (const s of [-1, 1]) {
          c.save(); c.rotate(s * (0.18 + wig * 1.5));
          c.fillStyle = col; ell(c, s * r * 0.38, -r * 1.25, r * 0.22, r * 0.62); c.fill(); c.stroke();
          c.fillStyle = '#ffd6e6'; ell(c, s * r * 0.38, -r * 1.22, r * 0.1, r * 0.45); c.fill();
          c.restore();
        }
        break;
      case 'pig':
        for (const s of [-1, 1]) { c.save(); c.rotate(s * (0.4 + wig)); c.fillStyle = col; c.beginPath(); c.moveTo(s * r * 0.2, -r * 0.9); c.lineTo(s * r * 0.55, -r * 1.25); c.lineTo(s * r * 0.75, -r * 0.7); c.closePath(); c.fill(); c.stroke(); c.restore(); }
        break;
      case 'bear':
        for (const s of [-1, 1]) { c.fillStyle = col; circ(c, s * r * 0.7, -r * 0.72, r * 0.3); c.fill(); c.stroke(); c.fillStyle = '#ffb3c0'; circ(c, s * r * 0.7, -r * 0.72, r * 0.15); c.fill(); }
        break;
      case 'elephant':
        for (const s of [-1, 1]) { c.save(); c.rotate(s * (Math.sin(t * 3) * 0.12)); c.fillStyle = col; ell(c, s * r * 1.0, -r * 0.05, r * 0.5, r * 0.62); c.fill(); c.stroke(); c.fillStyle = '#ffc7d9'; ell(c, s * r * 1.02, -r * 0.03, r * 0.28, r * 0.4); c.fill(); c.restore(); }
        break;
      case 'unicorn':
        c.fillStyle = '#ffd84d'; c.beginPath(); c.moveTo(-r * 0.16, -r * 0.88); c.lineTo(0, -r * 1.55); c.lineTo(r * 0.16, -r * 0.88); c.closePath(); c.fill(); c.stroke();
        c.strokeStyle = '#e8a91a'; c.lineWidth = r * 0.04; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(-r * 0.15 + k * 0.03 * r, -r * (0.9 + k * 0.15)); c.lineTo(r * 0.15 - k * 0.03 * r, -r * (0.95 + k * 0.15)); c.stroke(); }
        for (const s of [-1, 1]) { c.fillStyle = col; c.strokeStyle = dk; c.lineWidth = r * 0.05; c.beginPath(); c.moveTo(s * r * 0.4, -r * 0.82); c.lineTo(s * r * 0.62, -r * 1.2); c.lineTo(s * r * 0.82, -r * 0.62); c.closePath(); c.fill(); c.stroke(); }
        break;
      case 'comb':
        for (let k = -1; k <= 1; k++) { c.save(); c.rotate(k * 0.35 + wig); c.fillStyle = col; ell(c, 0, -r * 1.12, r * 0.13, r * 0.3); c.fill(); c.stroke(); c.restore(); }
        for (const s of [-1, 1]) { c.save(); c.rotate(s * (0.3 + Math.sin(t * 8) * 0.15)); c.fillStyle = col; ell(c, s * r * 1.02, r * 0.25, r * 0.22, r * 0.4); c.fill(); c.stroke(); c.restore(); }
        break;
      case 'skunk':
        c.save(); c.rotate(Math.sin(t * 3) * 0.25); c.fillStyle = '#2b2b38'; ell(c, r * 0.95, -r * 0.35, r * 0.4, r * 0.75); c.fill(); c.fillStyle = '#ffffff'; ell(c, r * 0.95, -r * 0.4, r * 0.12, r * 0.6); c.fill(); c.restore();
        for (const s of [-1, 1]) { c.fillStyle = '#2b2b38'; circ(c, s * r * 0.62, -r * 0.8, r * 0.24); c.fill(); c.fillStyle = '#ff9ccf'; circ(c, s * r * 0.62, -r * 0.8, r * 0.11); c.fill(); }
        break;
      case 'fluff':
        c.fillStyle = col;
        for (let k = 0; k < 14; k++) { const a = k / 14 * PI2 + wig; c.beginPath(); c.moveTo(Math.cos(a - 0.2) * r * 0.9, Math.sin(a - 0.2) * r * 0.9); c.lineTo(Math.cos(a) * r * 1.22, Math.sin(a) * r * 1.22); c.lineTo(Math.cos(a + 0.2) * r * 0.9, Math.sin(a + 0.2) * r * 0.9); c.fill(); }
        break;
      case 'bat':
        for (const s of [-1, 1]) {
          c.save(); c.rotate(s * Math.sin(t * 9) * 0.25);
          c.fillStyle = col; c.beginPath(); c.moveTo(s * r * 0.75, -r * 0.2); c.lineTo(s * r * 1.65, -r * 0.65); c.lineTo(s * r * 1.45, -r * 0.1); c.lineTo(s * r * 1.6, r * 0.25); c.lineTo(s * r * 1.2, r * 0.15); c.lineTo(s * r * 1.05, r * 0.5); c.lineTo(s * r * 0.75, r * 0.3); c.closePath(); c.fill(); c.stroke();
          c.restore();
          c.fillStyle = col; c.beginPath(); c.moveTo(s * r * 0.25, -r * 0.82); c.lineTo(s * r * 0.62, -r * 1.42); c.lineTo(s * r * 0.85, -r * 0.55); c.closePath(); c.fill(); c.stroke();
        }
        break;
      case 'shell':
        c.fillStyle = col; c.beginPath(); c.arc(0, -r * 0.1, r * 1.12, Math.PI * 1.1, Math.PI * 1.9); c.lineTo(r * 0.3, -r * 0.7); c.fill();
        break;
      case 'gatderpy':
      case 'tiger': {
        for (const s of [-1, 1]) {
          const er = r * 0.34;
          c.save(); c.translate(s * r * 0.74, -r * 0.72); c.rotate(s * wig * 0.8);
          c.fillStyle = col; circ(c, 0, 0, er); c.fill();
          c.save(); circ(c, 0, 0, er); c.clip();
          c.strokeStyle = '#15151f'; c.lineWidth = er * 0.26; c.lineCap = 'round';
          for (const a of [-2.25, -1.57, -0.89]) { c.beginPath(); c.moveTo(Math.cos(a) * er * 1.1, Math.sin(a) * er * 1.1); c.lineTo(Math.cos(a) * er * 0.58, Math.sin(a) * er * 0.58); c.stroke(); }
          c.restore();
          c.fillStyle = '#ffffff'; circ(c, s * er * 0.06, er * 0.16, er * 0.5); c.fill();
          c.strokeStyle = dk; c.lineWidth = r * 0.06; circ(c, 0, 0, er); c.stroke();
          c.restore();
        }
        c.strokeStyle = 'rgba(20,20,32,.85)'; c.lineWidth = Math.max(1, r * 0.045); c.lineCap = 'round';
        for (const s of [-1, 1]) for (let k = -1; k <= 1; k++) { c.beginPath(); c.moveTo(s * r * 0.9, r * (0.22 + k * 0.13)); c.lineTo(s * r * 1.38, r * (0.15 + k * 0.25)); c.stroke(); }
        break;
      }
      case 'magpie': {
        const flap = Math.sin(t * 9 + sp.num) * 0.28;
        for (const s of [-1, 1]) {
          c.save(); c.translate(s * r * 0.78, -r * 0.08); c.rotate(s * (flap - 0.12));
          c.fillStyle = col;
          c.beginPath(); c.moveTo(0, -r * 0.34);
          c.quadraticCurveTo(s * r * 0.7, -r * 0.82, s * r * 1.02, -r * 0.4);
          c.lineTo(s * r * 0.86, -r * 0.24); c.lineTo(s * r * 0.98, -r * 0.06); c.lineTo(s * r * 0.8, r * 0.04);
          c.lineTo(s * r * 0.86, r * 0.24); c.lineTo(s * r * 0.62, r * 0.22); c.lineTo(s * r * 0.58, r * 0.38); c.lineTo(0, r * 0.3);
          c.closePath(); c.fill(); c.stroke();
          c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(s * r * 0.5, -r * 0.2, r * 0.24, r * 0.1, s * -0.35, 0, PI2); c.fill();
          c.strokeStyle = 'rgba(90,160,255,.75)'; c.lineWidth = Math.max(0.8, r * 0.035);
          c.beginPath(); c.moveTo(s * r * 0.3, r * 0.06); c.quadraticCurveTo(s * r * 0.55, -r * 0.02, s * r * 0.74, r * 0.12); c.stroke();
          c.restore();
        }
        break;
      }
      case 'horns':
        for (const s of [-1, 1]) {
          c.save(); c.rotate(s * wig * 0.5);
          const hg = c.createLinearGradient(0, -r * 0.8, 0, -r * 1.55);
          hg.addColorStop(0, col); hg.addColorStop(1, '#e6ccff');
          c.fillStyle = hg;
          c.beginPath(); c.moveTo(s * r * 0.3, -r * 0.86);
          c.quadraticCurveTo(s * r * 0.36, -r * 1.36, s * r * 0.95, -r * 1.55);
          c.quadraticCurveTo(s * r * 0.62, -r * 1.24, s * r * 0.66, -r * 0.72);
          c.closePath(); c.fill(); c.lineWidth = r * 0.05; c.stroke();
          c.strokeStyle = 'rgba(70,30,130,.45)'; c.lineWidth = Math.max(0.6, r * 0.035);
          for (const u of [0.3, 0.55]) {
            const [ax, ay] = quadPt(s * r * 0.3, -r * 0.86, s * r * 0.36, -r * 1.36, s * r * 0.95, -r * 1.55, u);
            const [bx2, by2] = quadPt(s * r * 0.66, -r * 0.72, s * r * 0.62, -r * 1.24, s * r * 0.95, -r * 1.55, u);
            c.beginPath(); c.moveTo(ax, ay); c.quadraticCurveTo((ax + bx2) / 2, (ay + by2) / 2 - r * 0.04, bx2, by2); c.stroke();
          }
          c.restore();
        }
        break;
      case 'flame': {
        // violet fire licking up around the top half (tongues rise upward, flickering)
        for (let k = 0; k < 9; k++) {
          const a = Math.PI * 0.96 + (k + 0.5) / 9 * Math.PI * 1.08;
          const fl = 0.75 + 0.25 * Math.sin(t * 9 + k * 1.9) + 0.08 * Math.sin(t * 15 + k * 3.1);
          const len = r * (0.5 + ((k * 5) % 3) * 0.17 + (k === 4 ? 0.25 : 0)) * fl;
          const bx = Math.cos(a) * r * 0.86, by = Math.sin(a) * r * 0.86;
          const up = Math.atan2(Math.sin(a) - 1.6, Math.cos(a));
          c.save(); c.translate(bx, by); c.rotate(up + Math.PI / 2);
          const lean = Math.sin(t * 4 + k * 1.3) * r * 0.12;
          c.fillStyle = col; fireLick(c, 0, 0, r * 0.26, len + r * 0.25, lean);
          c.fillStyle = '#ff5fd0'; fireLick(c, 0, -r * 0.02, r * 0.16, (len + r * 0.25) * 0.68, lean * 0.7);
          c.fillStyle = '#ffd9ff'; flameShape(c, 0, -r * 0.04, r * 0.07, (len + r * 0.25) * 0.36);
          c.restore();
        }
        break;
      }
      case 'braid': {
        for (let k = 0; k < 5; k++) {
          const a = Math.PI * (1.28 + k * 0.11);
          c.save(); c.translate(Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.98); c.rotate(a + Math.PI / 2 + (k % 2 ? 0.5 : -0.5));
          c.fillStyle = col; ell(c, 0, 0, r * 0.13, r * 0.21); c.fill(); c.lineWidth = r * 0.035; c.stroke();
          c.restore();
        }
        const sway = Math.sin(t * 2.2 + sp.num) * r * 0.05;
        braidChain(c, r * 0.95, -r * 0.45, r * 1.12 + sway, r * 1.3, 7, r * 0.34, col);
        ribbonBow(c, r * 1.12 + sway, r * 1.32, r * 0.11, '#ffc93c');
        c.fillStyle = col; c.beginPath(); c.moveTo(r * 1.02 + sway, r * 1.42); c.lineTo(r * 1.22 + sway, r * 1.42); c.lineTo(r * 1.18 + sway, r * 1.66); c.lineTo(r * 1.12 + sway, r * 1.56); c.lineTo(r * 1.05 + sway, r * 1.68); c.closePath(); c.fill();
        break;
      }
      case 'pigtails':
        for (const s of [-1, 1]) {
          c.save(); c.rotate(s * wig * 0.35);
          c.fillStyle = col;
          c.beginPath(); c.moveTo(s * r * 0.15, -r * 1.0);
          c.quadraticCurveTo(s * r * 1.28, -r * 0.95, s * r * 1.16, r * 0.25);
          c.quadraticCurveTo(s * r * 1.12, r * 1.0, s * r * 1.34, r * 1.46);
          c.quadraticCurveTo(s * r * 0.95, r * 1.3, s * r * 0.72, r * 0.62);
          c.closePath(); c.fill(); c.stroke();
          c.strokeStyle = 'rgba(255,255,255,.3)'; c.lineWidth = Math.max(0.7, r * 0.03);
          c.beginPath(); c.moveTo(s * r * 1.02, -r * 0.3); c.quadraticCurveTo(s * r * 1.04, r * 0.6, s * r * 1.2, r * 1.2); c.stroke();
          c.restore();
          c.save(); c.translate(s * r * 0.34, -r * 0.94); c.rotate(s * wig);
          c.fillStyle = col;
          c.beginPath(); c.moveTo(0, 0);
          c.quadraticCurveTo(s * r * 0.5, -r * 0.42, s * r * 0.68, r * 0.08);
          c.quadraticCurveTo(s * r * 0.66, r * 0.26, s * r * 0.55, r * 0.16);
          c.quadraticCurveTo(s * r * 0.42, -r * 0.08, s * r * 0.08, r * 0.1);
          c.closePath(); c.fill(); c.lineWidth = r * 0.04; c.stroke();
          c.restore();
          c.fillStyle = '#ffd84d'; circ(c, s * r * 0.37, -r * 0.94, r * 0.08); c.fill();
        }
        break;
      case 'buns':
        for (const s of [-1, 1]) {
          const bx = s * r * 0.5, by = -r * 0.92, br = r * 0.37;
          c.fillStyle = col; circ(c, bx, by, br); c.fill(); c.stroke();
          c.strokeStyle = 'rgba(255,255,255,.42)'; c.lineWidth = Math.max(0.8, r * 0.045); c.lineCap = 'round';
          c.beginPath(); for (let a = 0; a < 9.4; a += 0.3) { const rad = br * (0.8 - a * 0.072); c.lineTo(bx + Math.cos(a + s) * rad, by + Math.sin(a + s) * rad); } c.stroke();
          c.fillStyle = '#2ec4b6'; c.beginPath(); c.ellipse(bx - s * br * 0.3, by + br * 0.85, br * 0.42, br * 0.22, s * 0.4, 0, PI2); c.fill();
          c.fillStyle = 'rgba(255,255,255,.5)'; circ(c, bx - s * br * 0.45, by + br * 0.8, br * 0.08); c.fill();
        }
        break;
      case 'sheep':
        for (const s of [-1, 1]) { c.fillStyle = '#f0eef8'; circ(c, s * r * 0.65, -r * 0.78, r * 0.28); c.fill(); c.stroke(); }
        c.fillStyle = '#ffffff'; circ(c, 0, -r * 0.96, r * 0.28); c.fill(); c.stroke();
        break;
      case 'frog':
        for (const s of [-1, 1]) {
          c.fillStyle = col; circ(c, s * r * 0.48, -r * 0.94, r * 0.26); c.fill(); c.stroke();
          c.fillStyle = '#fff'; circ(c, s * r * 0.48, -r * 0.96, r * 0.14); c.fill();
        }
        break;
      case 'gator':
        for (let k = -2; k <= 2; k++) {
          c.fillStyle = col;
          c.beginPath(); c.moveTo(k * r * 0.25 - r * 0.12, -r * 0.88); c.lineTo(k * r * 0.25, -r * 1.18); c.lineTo(k * r * 0.25 + r * 0.12, -r * 0.88); c.closePath(); c.fill(); c.stroke();
        }
        break;
      case 'dragon':
        for (const s of [-1, 1]) {
          c.save(); c.rotate(s * (0.18 + wig));
          c.fillStyle = '#ffd84d'; c.beginPath(); c.moveTo(s * r * 0.32, -r * 0.85); c.lineTo(s * r * 0.68, -r * 1.45); c.lineTo(s * r * 0.78, -r * 0.72); c.closePath(); c.fill(); c.stroke();
          c.fillStyle = col; c.beginPath(); c.moveTo(s * r * 0.82, -r * 0.2); c.lineTo(s * r * 1.55, -r * 0.55); c.lineTo(s * r * 1.35, r * 0.25); c.lineTo(s * r * 0.82, r * 0.2); c.closePath(); c.fill(); c.stroke();
          c.restore();
        }
        break;
      case 'crow':
        c.fillStyle = col;
        for (let k = -1; k <= 1; k++) { ell(c, k * r * 0.18, -r * 1.08, r * 0.1, r * 0.26); c.fill(); }
        break;
      case 'mouse':
        for (const s of [-1, 1]) {
          c.fillStyle = col; circ(c, s * r * 0.76, -r * 0.72, r * 0.36); c.fill(); c.stroke();
          c.fillStyle = '#ffb3c6'; circ(c, s * r * 0.76, -r * 0.72, r * 0.2); c.fill();
        }
        break;
      case 'fin':
        c.fillStyle = col;
        c.beginPath(); c.moveTo(-r * 0.22, -r * 0.9); c.quadraticCurveTo(0, -r * 1.55, r * 0.32, -r * 1.32); c.quadraticCurveTo(r * 0.18, -r * 1.0, r * 0.24, -r * 0.88); c.closePath(); c.fill(); c.stroke();
        break;
      case 'pika':
        for (const s of [-1, 1]) {
          c.save(); c.rotate(s * (0.28 + wig));
          c.fillStyle = '#f7d02c'; ell(c, s * r * 0.42, -r * 1.24, r * 0.18, r * 0.56); c.fill(); c.stroke();
          c.fillStyle = '#1b1b24'; ell(c, s * r * 0.42, -r * 1.62, r * 0.13, r * 0.2); c.fill();
          c.restore();
        }
        break;
      case 'bulb':
        c.fillStyle = '#49a86b'; ell(c, 0, -r * 1.02, r * 0.48, r * 0.36); c.fill(); c.stroke();
        break;
      default: break;
    }
    c.restore();
  }
  function portraitOf(spId) { return portraits[spId] || null; }
  function drawMedallion(c, sp, x, y, r, t, opts) {
    opts = opts || {};
    const rare = sp.rarity === 'rare' || sp.rarity === 'legendary';
    if (opts.aura !== false && rare) {
      c.save();
      const legend = sp.rarity === 'legendary';
      const g = c.createRadialGradient(x, y, r * 0.8, x, y, r * 1.7);
      g.addColorStop(0, legend ? 'rgba(255,230,120,.75)' : 'rgba(255,255,255,.65)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g; circ(c, x, y, r * 1.7); c.fill();
      c.translate(x, y); c.rotate(t * 1.2);
      c.strokeStyle = legend ? '#ffd23b' : sp.color; c.lineWidth = r * 0.08; c.setLineDash([r * 0.25, r * 0.18]);
      circ(c, 0, 0, r * 1.32); c.stroke(); c.setLineDash([]);
      c.fillStyle = '#ffffff';
      for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; sparkle(c, Math.cos(a) * r * 1.42, Math.sin(a) * r * 1.42, r * 0.16); }
      c.restore();
    }
    if (opts.ears !== false) drawEars(c, sp, x, y, r, t);
    const img = portraits[sp.id];
    c.save();
    circ(c, x, y, r); c.clip();
    if (img) c.drawImage(img, x - r, y - r, r * 2, r * 2);
    else { c.fillStyle = sp.color; c.fillRect(x - r, y - r, r * 2, r * 2); }
    if (opts.silhouette) { c.fillStyle = 'rgba(40,40,70,.92)'; c.fillRect(x - r, y - r, r * 2, r * 2); }
    if (opts.flash) { c.fillStyle = 'rgba(255,255,255,' + opts.flash + ')'; c.fillRect(x - r, y - r, r * 2, r * 2); }
    c.restore();
    c.lineWidth = Math.max(1.5, r * 0.13); c.strokeStyle = opts.ringColor || sp.color; circ(c, x, y, r); c.stroke();
    c.lineWidth = Math.max(0.8, r * 0.045); c.strokeStyle = 'rgba(255,255,255,.9)'; circ(c, x, y, r * 0.9); c.stroke();
    if (opts.ears !== false && FRONT_EARS[sp.ears]) drawEars(c, sp, x, y, r, t, true);
  }
  function bubble(c, x, y, text, scale) {
    scale = scale || 1;
    c.save();
    c.font = 'bold ' + (13 * scale) + 'px system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    const w = Math.max(24 * scale, c.measureText(text).width + 14 * scale), h = 22 * scale;
    c.fillStyle = 'rgba(255,255,255,.96)'; c.strokeStyle = 'rgba(60,40,90,.35)'; c.lineWidth = 1.5;
    rr(c, x - w / 2, y - h, w, h, 9 * scale); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(x - 5 * scale, y - 1); c.lineTo(x, y + 6 * scale); c.lineTo(x + 5 * scale, y - 1); c.closePath(); c.fill();
    c.fillStyle = '#3a2a5a'; c.fillText(text, x, y - h / 2 + 0.5);
    c.restore();
  }
  function nameTag(c, x, y, text, color, badge) {
    c.save();
    c.font = 'bold 11px system-ui, sans-serif';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    const tw = c.measureText(text).width;
    let bw = 0;
    if (badge) { c.font = 'bold 9px system-ui, "Noto Color Emoji", sans-serif'; bw = c.measureText(badge).width + 10; c.font = 'bold 11px system-ui, sans-serif'; }
    const w = tw + 12 + (bw ? bw + 3 : 0);
    const left = x - w / 2;
    c.fillStyle = 'rgba(30,20,60,.74)'; rr(c, left, y - 8, w, 16, 8); c.fill();
    c.fillStyle = '#ffffff'; c.fillText(text, left + 6 + tw / 2, y + 0.5);
    if (bw) {
      const bx = left + 6 + tw + 3;
      c.fillStyle = badge === 'NEW!' ? '#ff3b6b' : '#ffb000';
      rr(c, bx, y - 6, bw, 12, 6); c.fill();
      c.font = 'bold 9px system-ui, "Noto Color Emoji", sans-serif';
      c.fillStyle = '#fff'; c.fillText(badge, bx + bw / 2, y + 0.5);
    }
    c.restore();
  }

  /* ======================= PORTRAITS ======================= */
  function rgb2hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    let h = 0, s = 0; const l = (mx + mn) / 2;
    if (mx !== mn) {
      const d = mx - mn;
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (mx === r) h = (g - b) / d + (g < b ? 6 : 0); else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
      h *= 60;
    }
    return [h, s, l];
  }
  function hsl2rgb(h, s, l) {
    h = ((h % 360) + 360) % 360 / 360;
    if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    const f = t => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
    return [Math.round(f(h + 1 / 3) * 255), Math.round(f(h) * 255), Math.round(f(h - 1 / 3) * 255)];
  }
  const VARIANT_BG = {
    prism: (x, y) => hsl2rgb((x + y) * 1.4, 0.85, 0.86),
    thunder: (x, y) => { const d = Math.hypot(x - 64, y - 64) / 90; return hsl2rgb(235, 0.6, 0.32 - d * 0.12); },
    superstar: (x, y) => { const a = Math.atan2(y - 64, x - 64); const ray = Math.sin(a * 8) > 0 ? 0.08 : 0; return hsl2rgb(275, 0.55, 0.33 + ray); },
    aurora: (x, y) => hsl2rgb(150 + Math.sin(x * 0.06) * 40 + y * 0.6, 0.6, 0.28 + Math.sin(x * 0.08 + y * 0.03) * 0.06),
    galaxy: (x, y) => { const n = Math.sin(x * 0.07) * Math.cos(y * 0.05); return hsl2rgb(250 + n * 30, 0.6, 0.12 + Math.max(0, n) * 0.12); },
    solar: (x, y) => { const d = Math.hypot(x - 64, y - 64) / 90; return hsl2rgb(30 - d * 30, 1, 0.6 - d * 0.18); },
  };
  function recolor(style, h, s, l, x, y) {
    switch (style) {
      case 'prism': if (s > 0.2 && l > 0.2) return [(x * 2 + y * 2.4) % 360, Math.max(s, 0.7), U.clamp(l * 1.05, 0, 0.9)]; if (l > 0.8) return [320, 0.6, 0.93]; return [h, s, l];
      case 'thunder': if (s > 0.2 && l > 0.15) return [h - 100, Math.min(1, s * 1.2), U.clamp(l * 1.1, 0, 0.85)]; return [h, s, l];
      case 'superstar': if (s > 0.2 && l > 0.15) return [h - 12, 1, U.clamp(l + 0.06, 0, 0.88)]; return [h, s, l];
      case 'aurora': if (s > 0.2 && l > 0.15) return [188, s * 0.75, U.clamp(l + 0.25, 0, 0.92)]; return [h, s, l];
      case 'galaxy': if (s > 0.15 && l > 0.12) return [248, Math.min(1, s * 1.1), l * 0.82]; return [h, s, l];
      case 'solar': if (s > 0.2 && l > 0.15) return [h - 10, 1, U.clamp(l + 0.04, 0, 0.86)]; return [h, s, l];
      default: return [h, s, l];
    }
  }
  function decorate(g, style) {
    g.save();
    g.fillStyle = '#ffffff';
    const r = rnd(style.length * 77);
    if (style === 'galaxy' || style === 'aurora' || style === 'superstar' || style === 'prism') {
      for (let k = 0; k < 18; k++) { const x = r() * 128, y = r() * 128; if (Math.hypot(x - 64, y - 70) < 46) continue; g.globalAlpha = 0.5 + r() * 0.5; sparkle(g, x, y, 1.5 + r() * 3); }
    }
    g.globalAlpha = 1;
    if (style === 'thunder') {
      g.fillStyle = '#ffe600';
      [[16, 20], [108, 30], [20, 104]].forEach(([x, y]) => { g.beginPath(); g.moveTo(x + 6, y - 12); g.lineTo(x - 4, y + 2); g.lineTo(x + 2, y + 2); g.lineTo(x - 4, y + 14); g.lineTo(x + 8, y - 2); g.lineTo(x + 2, y - 2); g.closePath(); g.fill(); });
    }
    if (style === 'solar') {
      g.fillStyle = '#ffd400'; g.strokeStyle = '#b8860b'; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(44, 26); g.lineTo(44, 8); g.lineTo(54, 18); g.lineTo(64, 4); g.lineTo(74, 18); g.lineTo(84, 8); g.lineTo(84, 26); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = '#ff3b6b'; circ(g, 64, 17, 3.2); g.fill(); g.fillStyle = '#3bc4ff'; circ(g, 50, 20, 2.2); g.fill(); circ(g, 78, 20, 2.2); g.fill();
    }
    if (style === 'superstar') { g.fillStyle = '#ffd400'; star(g, 104, 22, 10, 4.5, 5); g.fill(); star(g, 22, 100, 7, 3, 5); g.fill(); }
    if (style === 'aurora') { g.fillStyle = 'rgba(255,255,255,.95)'; [[18, 24], [110, 96]].forEach(([x, y]) => { for (let k = 0; k < 3; k++) { g.save(); g.translate(x, y); g.rotate(k * Math.PI / 3); g.fillRect(-7, -1, 14, 2); g.restore(); } }); }
    g.restore();
  }
  function makeVariant(img, style) {
    const c = mk(128, 128), g = c.getContext('2d');
    g.drawImage(img, 0, 0, 128, 128);
    try {
      const id = g.getImageData(0, 0, 128, 128), d = id.data;
      const bg = new Uint8Array(128 * 128);
      const ref = [d[0], d[1], d[2]];
      const close = p => { const k = p * 4; return Math.abs(d[k] - ref[0]) + Math.abs(d[k + 1] - ref[1]) + Math.abs(d[k + 2] - ref[2]) < 46; };
      const stack = [0, 127, 127 * 128, 127 * 128 + 127];
      while (stack.length) {
        const p = stack.pop();
        if (bg[p] || !close(p)) continue;
        bg[p] = 1;
        const x = p % 128, y = (p / 128) | 0;
        if (x > 0) stack.push(p - 1); if (x < 127) stack.push(p + 1); if (y > 0) stack.push(p - 128); if (y < 127) stack.push(p + 128);
      }
      const bgf = VARIANT_BG[style];
      for (let p = 0; p < 128 * 128; p++) {
        const k = p * 4, x = p % 128, y = (p / 128) | 0;
        let out;
        if (bg[p]) out = bgf(x, y);
        else { const [h, s, l] = rgb2hsl(d[k], d[k + 1], d[k + 2]); const [h2, s2, l2] = recolor(style, h, s, l, x, y); out = hsl2rgb(h2, s2, l2); }
        d[k] = out[0]; d[k + 1] = out[1]; d[k + 2] = out[2];
      }
      g.putImageData(id, 0, 0);
    } catch (e) {
      const tint = { prism: '#ff8ad8', thunder: '#ffd400', superstar: '#ff9f1c', aurora: '#7ff0ff', galaxy: '#5b5bff', solar: '#ff7b00' }[style];
      g.globalCompositeOperation = 'color'; g.globalAlpha = 0.6; g.fillStyle = tint; g.fillRect(0, 0, 128, 128);
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    }
    decorate(g, style);
    return c;
  }
  function placeholder(sp) {
    const c = mk(128, 128), g = c.getContext('2d');
    g.fillStyle = sp.color; g.fillRect(0, 0, 128, 128);
    g.font = '64px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(sp.emoji, 64, 70);
    return c;
  }
  function loadPortraits() {
    const base = {};
    const icons = Array.from(new Set(CQData.SPECIES.map(s => s.icon)));
    const loads = icons.map(icon => new Promise(res => {
      const img = new Image();
      let done = false;
      const finish = ok => { if (done) return; done = true; base[icon] = ok ? img : null; res(ok); };
      img.onload = () => finish(true);
      img.onerror = () => finish(false);
      setTimeout(() => finish(img.complete && img.naturalWidth > 0), 8000);
      img.src = 'icons/' + icon + '.jpg?v=r14';
    }));
    return Promise.all(loads).then(results => {
      for (const sp of CQData.SPECIES) {
        const img = base[sp.icon];
        if (!img) { portraits[sp.id] = placeholder(sp); continue; }
        portraits[sp.id] = sp.variant ? makeVariant(img, sp.variant) : img;
      }
      return { loaded: results.filter(Boolean).length, total: icons.length };
    });
  }
  function portraitURL(spId) {
    const p = portraits[spId];
    if (!p) return '';
    if (p.toDataURL) { if (!p._url) { try { p._url = p.toDataURL('image/png'); } catch (e) { p._url = ''; } } return p._url; }
    return p.src;
  }

  /* ======================= MINIMAP ======================= */
  function minimapColor(g, z) {
    switch (g) {
      case T.DEEP: return [47, 125, 214];
      case T.SHALLOW: return [111, 210, 230];
      case T.SAND: return z === 6 ? [236, 187, 119] : z === 10 ? hex(PAL[10].sand) : [246, 228, 166];
      case T.GRASS: { const p = PAL[z] || PAL[9]; return hex(p.g); }
      case T.TALL: { const p = PAL[z] || PAL[9]; return z === 4 ? [245, 159, 208] : z === 8 ? [154, 119, 224] : z === 10 ? hex(shade(p.gd, -22)) : hex(p.t2); }
      case T.PATH: return z === 10 ? hex(PAL[10].p) : [214, 188, 139];
      case T.FLOWERS: return [255, 170, 214];
      case T.BRIDGE_H: case T.BRIDGE_V: return [176, 122, 70];
      case T.SNOW: return [236, 244, 252];
      case T.ICE: return [190, 232, 255];
      case T.FLOOR: return z === 10 ? [92, 52, 122] : [196, 187, 230];
      case T.CLIFF: return z === 6 ? [170, 100, 50] : z === 7 ? [140, 175, 205] : [140, 140, 132];
      case T.STONES: return [255, 143, 171];
      case T.PLAZA: return z === 10 ? hex(PAL[10].plaza) : [234, 223, 198];
      default: return [255, 0, 255];
    }
  }
  function hex(h) { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
  function renderMinimap(px) {
    const W = World.W, H = World.H;
    const cv = mk(W * px, H * px), c = cv.getContext('2d');
    const id = c.createImageData(W * px, H * px), d = id.data;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = World.I(x, y);
      let col = minimapColor(World.ground[i], World.zone[i]);
      const o = World.objAt[i];
      if (o >= 0) {
        const ob = World.objects[o];
        if (ob.kind === 'tree' || ob.kind === 'bush' || ob.kind === 'hedge') col = ob.variant === 'pine' ? [47, 100, 84] : ob.variant === 'moon' ? [70, 84, 160] : ob.variant === 'crystal' ? [200, 170, 240] : ob.variant === 'blossom' ? [255, 168, 206] : [44, 118, 52];
        else if (ob.kind === 'cactus') col = [46, 139, 87];
        else if (ob.kind === 'rock' || ob.kind === 'pillar') col = [150, 140, 130];
        else if (ob.kind === 'house') col = [232, 72, 62];
        else if (ob.kind === 'lab') col = [74, 143, 224];
        else if (ob.kind === 'shop') col = [34, 168, 143];
        else if (ob.kind === 'cottage') col = [255, 143, 58];
        else if (ob.kind === 'castle') col = [120, 100, 210];
        else if (ob.kind === 'pyramid') col = [226, 176, 106];
        else if (ob.kind === 'windmill') col = [200, 120, 90];
        else if (ob.kind === 'gazebo') col = [255, 255, 255];
        else if (ob.kind === 'fence') col = [180, 130, 80];
        else if (ob.kind === 'stage') col = [255, 201, 60];
        else if (ob.kind === 'seoultower') col = [246, 246, 252];
        else if (ob.kind === 'ramen') col = [255, 98, 58];
        else if (ob.kind === 'hanok') col = [96, 104, 122];
        else if (ob.kind === 'demongate') col = [140, 77, 255];
        else if (ob.kind === 'tigerpavilion') col = [63, 143, 224];
        else if (ob.kind === 'bathhouse') col = [69, 209, 245];
        else if (ob.kind === 'hanclinic') col = [72, 184, 159];
        else if (ob.kind === 'sodapoptruck') col = [255, 92, 168];
        else if (ob.kind === 'carnivaltent') col = [224, 62, 107];
        else if (ob.kind === 'cauldron') col = [199, 75, 255];
        else if (ob.kind === 'pokecenter') col = [232, 62, 56];
        else if (ob.kind === 'oaklab' || ob.kind === 'rowanlab') col = [74, 123, 214];
        else if (ob.kind === 'mewshrine' || ob.kind === 'lugiaroost') col = [147, 197, 253];
        else if (ob.kind === 'volcano') col = [255, 90, 31];
        else if (ob.kind === 'belltower' || ob.kind === 'apricornshop') col = [245, 158, 11];
        else if (ob.kind === 'skypillar' || ob.kind === 'secretbase') col = [16, 185, 129];
        else if (ob.kind === 'spearpillar') col = [250, 204, 21];
      }
      for (let yy = 0; yy < px; yy++) for (let xx = 0; xx < px; xx++) {
        const k = ((y * px + yy) * W * px + x * px + xx) * 4;
        d[k] = col[0]; d[k + 1] = col[1]; d[k + 2] = col[2]; d[k + 3] = 255;
      }
    }
    c.putImageData(id, 0, 0);
    return cv;
  }

  /* ======================= BATTLE BACKDROP ======================= */
  const BATTLE_SKY = {
    1: ['#9fe3ff', '#e6f9ff', '#8fd16a'], 2: ['#a8e6a3', '#e9ffe0', '#6fbf52'], 3: ['#7fd6ff', '#e0f8ff', '#f7e6a8'], 4: ['#ffd6f0', '#e8f2ff', '#b2e6a4'],
    5: ['#bfe6ff', '#f2fff0', '#a8cf60'], 6: ['#ffd38a', '#fff2d6', '#ecbb77'], 7: ['#b9d9ff', '#f3f9ff', '#eef6ff'], 8: ['#2b2f6b', '#7a6bc4', '#8fb0a6'], 9: ['#a8e8ff', '#effcff', '#88cd64'],
    10: ['#4a3896', '#ffaed3', '#a8e6cf'],
    11: ['#5888c9', '#ffe8be', '#7fd4b8'],
    12: ['#2e1b52', '#a855c9', '#78b894'],
    13: ['#6cc8ff', '#e6f7ff', '#7ed968'],
    14: ['#f59e0b', '#fef3c7', '#a3d165'],
    15: ['#38bdf8', '#d1fae5', '#68d68b'],
    16: ['#312e81', '#818cf8', '#7dc9a6'],
  };
  // Seoul skyline for the Honmoon battle backdrop: [x, width, height] as fractions of w / h (built once)
  let SKYLINE = null;
  function skyline() {
    if (SKYLINE) return SKYLINE;
    const r = rnd(2010), far = [], near = [];
    for (let x = -0.02; x < 1.02;) { const bw = 0.03 + r() * 0.035; far.push([x, bw, 0.07 + r() * 0.1]); x += bw * 0.9; }
    for (let x = -0.02; x < 1.02;) { const bw = 0.035 + r() * 0.045; near.push([x, bw, 0.04 + r() * 0.11, r() < 0.3, r()]); x += bw + 0.004; }
    SKYLINE = { far, near };
    return SKYLINE;
  }
  function honmoonArc(c, cx, cy, rx, ry, t, strong) {
    const sh = 0.75 + 0.25 * Math.sin(t * 1.8);
    c.save();
    c.lineCap = 'round';
    [[strong ? 34 : 26, 0.08], [strong ? 18 : 13, 0.18], [strong ? 7 : 5, 0.55], [2.2, 0.95]].forEach(([lw, a], k) => {
      c.globalAlpha = a * (k === 3 ? 1 : sh); c.strokeStyle = k === 3 ? '#fff6c8' : '#ffcf3a'; c.lineWidth = lw;
      c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, Math.PI, 0); c.stroke();
    });
    c.globalAlpha = strong ? 0.1 : 0.06; c.fillStyle = '#ffd84d';
    c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, Math.PI, 0); c.closePath(); c.fill();
    c.fillStyle = '#fff6c8';
    for (let k = 0; k < 9; k++) {
      const ang = Math.PI + ((t * 0.05 + k / 9) % 1) * Math.PI;
      c.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 2.3 + k * 1.7));
      sparkle(c, cx + Math.cos(ang) * rx, cy + Math.sin(ang) * ry, 2.5 + 2 * Math.abs(Math.sin(t * 3 + k)));
    }
    c.restore();
  }
  function honmoonSky(c, w, h, t) {
    const hz = h * 0.55;
    c.fillStyle = '#ffffff';
    for (let k = 0; k < 26; k++) { const x = (k * 97.3 + 13) % w, y = (k * 41.7) % (hz * 0.62); c.globalAlpha = 0.35 + 0.55 * Math.abs(Math.sin(t * 1.6 + k * 2.3)); sparkle(c, x, y, 1.2 + (k % 3) * 0.9); }
    c.globalAlpha = 1;
    c.fillStyle = '#fff3c4'; c.beginPath(); c.arc(w * 0.91, h * 0.12, h * 0.05, 0.5, 5.8); c.arc(w * 0.91 + h * 0.022, h * 0.11, h * 0.042, 5.4, 0.9, true); c.fill();
    c.fillStyle = 'rgba(255,214,236,.5)';
    for (let k = 0; k < 3; k++) { const x = ((k * 0.37 + t * 0.008) % 1.3) * w - 0.15 * w, y = h * (0.2 + k * 0.07); ell(c, x, y, w * 0.08, h * 0.018); c.fill(); ell(c, x + w * 0.05, y - h * 0.012, w * 0.05, h * 0.018); c.fill(); }
    honmoonArc(c, w * 0.5, hz + h * 0.04, w * 0.56, h * 0.42, t, false);
    const sk = skyline();
    c.fillStyle = 'rgba(126,92,190,.55)';
    sk.far.forEach(([x, bw, bh]) => c.fillRect(x * w, hz - bh * h, bw * w + 1, bh * h));
    // near city blocks with warm windows
    sk.near.forEach(([x, bw, bh, roof, s]) => {
      const bx = x * w, by = hz - bh * h, ww = bw * w;
      c.fillStyle = '#3f2c74'; c.fillRect(bx, by, ww, bh * h + 1);
      if (roof) { c.beginPath(); c.moveTo(bx - 2, by); c.quadraticCurveTo(bx + ww / 2, by - h * 0.012, bx + ww + 2, by); c.lineTo(bx + ww / 2, by - h * 0.03); c.closePath(); c.fill(); }
      c.fillStyle = s < 0.5 ? 'rgba(255,226,140,.85)' : 'rgba(255,170,220,.8)';
      for (let yy = by + h * 0.014; yy < hz - h * 0.01; yy += h * 0.022) for (let xx = bx + ww * 0.18; xx < bx + ww - ww * 0.2; xx += ww * 0.24) if (((xx * 7 + yy * 3) | 0) % 3) c.fillRect(xx, yy, ww * 0.1, h * 0.009);
    });
    // N Seoul Tower on Namsan (left side, clear of the wild Critter at ~0.68w)
    const tx = w * 0.13, th = h * 0.36;
    c.fillStyle = '#4c3585'; c.beginPath(); c.ellipse(tx, hz + 1, w * 0.12, h * 0.085, 0, Math.PI, 0); c.fill();
    c.fillStyle = '#5f45a0'; c.beginPath(); c.ellipse(tx - w * 0.02, hz + 1, w * 0.07, h * 0.06, 0, Math.PI, 0); c.fill();
    c.fillStyle = '#f1ecff';
    c.beginPath(); c.moveTo(tx - w * 0.0065, hz - h * 0.07); c.lineTo(tx - w * 0.0035, hz - th * 0.78); c.lineTo(tx + w * 0.0035, hz - th * 0.78); c.lineTo(tx + w * 0.0065, hz - h * 0.07); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(tx - w * 0.005, hz - th * 0.78); c.lineTo(tx - w * 0.013, hz - th * 0.81); c.lineTo(tx + w * 0.013, hz - th * 0.81); c.lineTo(tx + w * 0.005, hz - th * 0.78); c.closePath(); c.fill();
    rr(c, tx - w * 0.02, hz - th * 0.89, w * 0.04, th * 0.085, th * 0.03); c.fill();
    c.fillStyle = '#ffe28a'; rr(c, tx - w * 0.017, hz - th * 0.865, w * 0.034, th * 0.03, th * 0.012); c.fill();
    c.fillStyle = '#e4dcff'; rr(c, tx - w * 0.012, hz - th * 0.93, w * 0.024, th * 0.04, th * 0.015); c.fill();
    c.fillStyle = '#ffffff'; c.fillRect(tx - w * 0.0015, hz - th, w * 0.003, th * 0.075);
    c.fillStyle = '#ff7a86'; c.fillRect(tx - w * 0.0015, hz - th * 0.975, w * 0.003, th * 0.018);
    if ((t * 1.1) % 1 < 0.55) { c.fillStyle = 'rgba(255,77,94,.45)'; circ(c, tx, hz - th * 1.01, h * 0.013); c.fill(); }
    c.fillStyle = '#ff4d5e'; circ(c, tx, hz - th * 1.01, h * 0.005); c.fill();
    // blossom puffs along the river bank
    [[0.03, 1], [0.27, 0.8], [0.31, 1.1], [0.62, 0.9], [0.97, 1.2], [0.93, 0.8]].forEach(([fx, s], k) => {
      const x = fx * w, rad = h * 0.03 * s;
      c.fillStyle = '#e985b6'; circ(c, x, hz - rad * 0.4, rad); c.fill(); circ(c, x + rad * 0.9, hz - rad * 0.2, rad * 0.8); c.fill();
      c.fillStyle = '#ffb6d4'; circ(c, x - rad * 0.2, hz - rad * 0.7, rad * 0.75); c.fill(); circ(c, x + rad * 0.8, hz - rad * 0.5, rad * 0.55); c.fill();
      c.fillStyle = k % 2 ? '#ffe0ef' : '#ffd0e6'; circ(c, x - rad * 0.4, hz - rad * 0.95, rad * 0.3); c.fill();
    });
    c.fillStyle = 'rgba(255,207,58,.35)'; c.fillRect(0, hz - 1.5, w, 3);
    c.fillStyle = 'rgba(255,255,255,.22)'; ell(c, w * 0.2, h * 0.8, w * 0.28, h * 0.05); c.fill(); ell(c, w * 0.78, h * 0.68, w * 0.24, h * 0.04); c.fill();
    // drifting cherry petals
    c.fillStyle = 'rgba(255,170,205,.9)';
    for (let k = 0; k < 9; k++) { const ph = (t * 0.06 + k / 9) % 1; petal(c, ((k * 0.29 + ph * 0.5) % 1.1) * w, h * (0.08 + ph * 0.85), 3.4, t * 1.5 + k); }
  }
  function bossSky(c, w, h, t) {
    // Gwi-Ma's violet flame sky (dramatic but friendly), held back by the golden Honmoon
    const hz = h * 0.55;
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#2a0f5e'); g.addColorStop(0.3, '#5a24a6'); g.addColorStop(0.55, '#c25ae6'); g.addColorStop(0.56, '#6e4fae'); g.addColorStop(1, '#43306f');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = '#ffffff';
    for (let k = 0; k < 16; k++) { const x = (k * 113.7 + 31) % w, y = (k * 37.3) % (hz * 0.4); c.globalAlpha = 0.25 + 0.4 * Math.abs(Math.sin(t * 1.3 + k)); sparkle(c, x, y, 1 + (k % 3) * 0.8); }
    c.globalAlpha = 1;
    const rows = [['#4a1890', '#9a45ec', 1.0, 0, 11], ['#8a2fd8', '#f070e8', 0.72, 1.7, 15], ['#e650dc', '#ffd8f6', 0.46, 3.1, 19]];
    rows.forEach(([top, bot, sc, off, n]) => {
      const fg = c.createLinearGradient(0, hz - h * 0.34 * sc, 0, hz);
      fg.addColorStop(0, top); fg.addColorStop(1, bot);
      c.fillStyle = fg;
      for (let k = 0; k <= n; k++) {
        const fx = (k / n) * w + Math.sin(off * 3 + k * 1.7) * w * 0.012;
        const fl = 0.74 + 0.26 * Math.sin(t * (3.2 + (k % 3) * 0.9) + k * 1.9 + off);
        const fh = h * (0.17 + 0.13 * Math.abs(Math.sin(k * 2.7 + off))) * sc * fl;
        fireLick(c, fx, hz + 3, w / n * 0.62, fh, Math.sin(t * 2.4 + k * 1.3 + off) * fh * 0.22);
      }
    });
    c.fillStyle = 'rgba(255,200,255,.85)';
    for (let k = 0; k < 14; k++) { const ph = (t * 0.25 + k / 14) % 1; circ(c, ((k * 0.173 + Math.sin(t + k) * 0.01) % 1) * w, hz - ph * h * 0.5, 2.2 * (1 - ph) + 0.6); c.fill(); }
    honmoonArc(c, w * 0.5, hz, w * 0.6, h * 0.48, t, true);
    c.save();
    c.globalAlpha = 0.16 + 0.08 * Math.sin(t * 2.2);
    c.strokeStyle = '#ffe58a'; c.lineWidth = 1.2;
    for (let k = 1; k < 4; k++) { c.beginPath(); c.ellipse(w * 0.5, hz, w * 0.6 * (1 - k * 0.08), h * 0.48 * (1 - k * 0.08), 0, Math.PI * 1.04, Math.PI * 1.96); c.stroke(); }
    c.restore();
    c.fillStyle = 'rgba(255,207,58,.5)'; c.fillRect(0, hz - 1.5, w, 3);
    c.fillStyle = 'rgba(255,255,255,.1)'; ell(c, w * 0.22, h * 0.8, w * 0.28, h * 0.05); c.fill(); ell(c, w * 0.76, h * 0.68, w * 0.22, h * 0.04); c.fill();
  }
  function battleBackdrop(c, w, h, z, t, opts) {
    if (opts && opts.boss) { c.save(); bossSky(c, w, h, t); c.restore(); return; }
    const [sky1, sky2, groundCol] = BATTLE_SKY[z] || BATTLE_SKY[9];
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, sky1); g.addColorStop(0.55, sky2); g.addColorStop(0.56, shade(groundCol, 18)); g.addColorStop(1, groundCol);
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    const hz = h * 0.55;
    c.save();
    if (z === 10) { honmoonSky(c, w, h, t); c.restore(); return; }
    if (z === 8) {
      c.fillStyle = '#ffffff';
      for (let k = 0; k < 40; k++) { const x = (k * 97.3) % w, y = (k * 53.7) % (hz * 0.9); c.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + k)); sparkle(c, x, y, 1.5 + (k % 3)); }
      c.globalAlpha = 1; c.fillStyle = '#fff6c2'; c.beginPath(); c.arc(w * 0.82, h * 0.16, h * 0.07, 0.5, 5.8); c.arc(w * 0.82 + h * 0.03, h * 0.15, h * 0.06, 5.4, 0.9, true); c.fill();
    } else {
      c.fillStyle = 'rgba(255,255,255,.85)';
      for (let k = 0; k < 4; k++) { const x = ((k * 0.31 + t * 0.012) % 1.2) * w - 0.1 * w, y = h * (0.08 + k * 0.08); ell(c, x, y, w * 0.07, h * 0.03); c.fill(); ell(c, x + w * 0.05, y - h * 0.015, w * 0.05, h * 0.03); c.fill(); }
    }
    if (z === 6) { c.fillStyle = '#e2b06a'; c.beginPath(); c.moveTo(w * 0.05, hz); c.lineTo(w * 0.17, hz - h * 0.2); c.lineTo(w * 0.29, hz); c.fill(); c.fillStyle = '#c48f4c'; c.beginPath(); c.moveTo(w * 0.17, hz - h * 0.2); c.lineTo(w * 0.29, hz); c.lineTo(w * 0.19, hz); c.fill(); }
    else if (z === 7) { c.fillStyle = '#dbeeff'; c.beginPath(); c.moveTo(0, hz); c.lineTo(w * 0.15, hz - h * 0.22); c.lineTo(w * 0.32, hz); c.lineTo(w * 0.5, hz - h * 0.16); c.lineTo(w * 0.7, hz); c.closePath(); c.fill(); }
    else if (z === 3) { c.fillStyle = '#3fa9e8'; c.fillRect(0, hz - h * 0.06, w, h * 0.06); }
    else if (z === 5) { c.fillStyle = 'rgba(255,255,255,.9)'; const x = w * 0.12, y = hz - h * 0.2; c.fillRect(x - 3, y, 6, h * 0.2); c.save(); c.translate(x, y); c.rotate(t); for (let k = 0; k < 4; k++) { c.rotate(Math.PI / 2); c.fillRect(-2, 0, 4, h * 0.12); } c.restore(); }
    else if (z === 11) {
      // Minhwa pine mountains + golden Honmoon shimmer
      c.fillStyle = '#3a6b7c'; c.beginPath(); c.moveTo(0, hz); c.quadraticCurveTo(w * 0.18, hz - h * 0.24, w * 0.38, hz); c.quadraticCurveTo(w * 0.65, hz - h * 0.18, w, hz); c.closePath(); c.fill();
      honmoonArc(c, w * 0.5, hz + h * 0.04, w * 0.54, h * 0.38, t, false);
    } else if (z === 12) {
      // Carnival Big-Top silhouette & glowing purple smoke rings
      c.fillStyle = '#4b246b'; c.beginPath(); c.moveTo(w * 0.06, hz); c.lineTo(w * 0.18, hz - h * 0.22); c.lineTo(w * 0.3, hz); c.closePath(); c.fill();
      c.fillStyle = '#ffc93c'; star(c, w * 0.18, hz - h * 0.23, 8, 3.5, 5); c.fill();
      c.strokeStyle = 'rgba(215,120,255,.55)'; c.lineWidth = 2.5;
      for (let k = 0; k < 3; k++) { ell(c, w * (0.75 + k * 0.06), hz - h * (0.12 + k * 0.07), 16 + k * 6, 7 + k * 2); c.stroke(); }
    } else if (z === 13) {
      // Kanto Bay sea band + Ember Volcano silhouette on left
      c.fillStyle = '#3fa9e8'; c.fillRect(0, hz - h * 0.05, w, h * 0.05);
      c.fillStyle = '#8c4f36'; c.beginPath(); c.moveTo(w * 0.04, hz - h * 0.04); c.lineTo(w * 0.13, hz - h * 0.22); c.lineTo(w * 0.21, hz - h * 0.22); c.lineTo(w * 0.3, hz - h * 0.04); c.closePath(); c.fill();
      c.fillStyle = '#ff6b2b'; ell(c, w * 0.17, hz - h * 0.22, w * 0.04, h * 0.015); c.fill();
    } else if (z === 14) {
      // Johto Ecruteak Bell Tower silhouette + golden autumn sky
      c.fillStyle = '#92400e';
      for (let k = 0; k < 3; k++) {
        const tw = w * (0.12 - k * 0.025), ty = hz - h * (0.07 + k * 0.065);
        c.fillRect(w * 0.16 - tw / 2, ty, tw, h * 0.065);
        c.fillStyle = '#f59e0b';
        c.beginPath(); c.moveTo(w * 0.16 - tw * 0.7, ty + 4); c.quadraticCurveTo(w * 0.16, ty - h * 0.03, w * 0.16 + tw * 0.7, ty + 4); c.closePath(); c.fill();
        c.fillStyle = '#92400e';
      }
    } else if (z === 15) {
      // Hoenn tropical ocean + emerald Sky Pillar spire
      c.fillStyle = '#0ea5e9'; c.fillRect(0, hz - h * 0.05, w, h * 0.05);
      c.fillStyle = '#047857'; c.fillRect(w * 0.13, hz - h * 0.26, w * 0.06, h * 0.22);
      c.fillStyle = '#fde047'; star(c, w * 0.16, hz - h * 0.28, 9, 4, 5); c.fill();
    } else if (z === 16) {
      // Sinnoh Mount Coronet & Spear Pillar golden wheel
      c.fillStyle = '#4338ca'; c.beginPath(); c.moveTo(0, hz); c.lineTo(w * 0.18, hz - h * 0.25); c.lineTo(w * 0.38, hz); c.closePath(); c.fill();
      c.strokeStyle = '#fbbf24'; c.lineWidth = 3; circ(c, w * 0.18, hz - h * 0.28, h * 0.06); c.stroke();
    }
    else { c.fillStyle = 'rgba(80,160,80,.35)'; ell(c, w * 0.2, hz, w * 0.3, h * 0.08); c.fill(); ell(c, w * 0.75, hz, w * 0.35, h * 0.1); c.fill(); }
    c.restore();
  }

  return {
    TS, PAL, setScale, get S() { return S; }, get tpx() { return tpx; }, tile, ANIM_FRAMES,
    stats() { let px = 0; tileCache.forEach(c => { px += c.width * c.height; }); objCache.forEach(o => { px += o.cv.width * o.cv.height; }); return { tiles: tileCache.size, objects: objCache.size, megabytes: Math.round(px * 4 / 1048576 * 10) / 10, tpx }; },
    OBJ, objSprite, drawPerson, drawDuckFloat, drawMiniFloat, CHUYU_LOOK, drawMedallion, drawEars, bubble, nameTag,
    loadPortraits, portraitOf, portraitURL, portraits, renderMinimap, battleBackdrop,
    helpers: { ell, circ, rr, star, sparkle, heart, shadow, shade },
  };
})();
