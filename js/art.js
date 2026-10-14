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
    const cols = ['#ff7ab8', '#ffd84d', '#ffffff', '#9fb8ff', '#ff9f43', '#c58bff'];
    for (let k = 0; k < 9; k++) {
      const x = r() * 40 + 4, y = r() * 40 + 4;
      c.fillStyle = cols[(k + v) % cols.length];
      for (let a = 0; a < 5; a++) { circ(c, x + Math.cos(a * 1.256) * 2.4, y + Math.sin(a * 1.256) * 2.4, 1.9); c.fill(); }
      c.fillStyle = '#fff2a8'; circ(c, x, y, 1.3); c.fill();
    }
  }
  function floorTile(c, z, v, plaza) {
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
    const key = ((((type * 10 + z) * 4 + v) * 4 + f) * 16 + edges) * 16 + d;
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
  function drawTree(c, o, z) {
    const v = o.variant;
    if (v === 'palm') return drawPalm(c);
    if (v === 'pine') return drawPine(c, z);
    if (v === 'bamboo') return drawBamboo(c, o.x % 3);
    if (v === 'crystal') return drawCrystalTree(c);
    if (v === 'moon') return drawMoonTree(c);
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
      5: ['#c9ccd3', '#a2a6b0', '#7fb8ff'], 6: ['#efc58a', '#cf9d5c', '#ffb347'], 8: ['#d9d2f5', '#aaa0d8', '#c58bff'],
    }[style] || ['#e8e2d6', '#c9c0ae', '#ff7aa8'];
  }
  function drawFountain(c, o) {
    const [stone, stoneD, accent] = fountainStyle(o.style);
    shadow(c, 48, 88, 44, 9);
    c.fillStyle = stoneD; ell(c, 48, 66, 44, 26); c.fill();
    c.fillStyle = stone; ell(c, 48, 62, 44, 24); c.fill();
    c.fillStyle = '#5fc6ea'; ell(c, 48, 62, 36, 17); c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)'; ell(c, 40, 58, 16, 5); c.fill();
    c.fillStyle = stoneD; rr(c, 40, 28, 16, 36, 4); c.fill();
    c.fillStyle = stone; rr(c, 42, 28, 12, 34, 4); c.fill();
    c.fillStyle = stone; ell(c, 48, 28, 18, 7); c.fill();
    c.fillStyle = '#7fd8f2'; ell(c, 48, 27, 13, 4); c.fill();
    c.fillStyle = accent;
    if (o.style === 3) { c.beginPath(); c.moveTo(48, 6); c.quadraticCurveTo(62, 16, 56, 24); c.lineTo(40, 24); c.quadraticCurveTo(34, 16, 48, 6); c.fill(); }
    else if (o.style === 8) { star(c, 48, 14, 9, 4, 5); c.fill(); }
    else if (o.style === 6) { c.beginPath(); c.moveTo(48, 6); c.lineTo(58, 22); c.lineTo(38, 22); c.closePath(); c.fill(); }
    else heart(c, 48, 18, 9);
  }
  function animFountain(c, o, t) {
    const x = o.x * 48 + 48, y = o.y * 48;
    c.strokeStyle = 'rgba(200,240,255,.9)'; c.lineWidth = 2.2; c.lineCap = 'round';
    for (let k = 0; k < 6; k++) {
      const a = k / 6 * PI2 + t * 0.6;
      const ex = x + Math.cos(a) * 26, ey = y + 58 + Math.sin(a) * 10;
      c.beginPath(); c.moveTo(x, y + 24); c.quadraticCurveTo((x + ex) / 2, y - 6 - Math.sin(t * 4 + k) * 3, ex, ey); c.stroke();
    }
    c.fillStyle = 'rgba(255,255,255,.85)';
    for (let k = 0; k < 5; k++) { const ph = (t * 1.3 + k * 0.2) % 1; circ(c, x - 20 + k * 10, y + 60 - ph * 4, 1.6 + ph); c.fill(); }
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
  };
  OBJ.pyramid.draw = drawPyramid;

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
    if (o.kind === 'cactus' || o.kind === 'flowerbed') key += '|' + ((o.x + o.y) % 5);
    let spr = objCache.get(key);
    if (spr) return spr;
    const [bx, by, bw, bh] = def.box;
    const cv = mk(bw * S, bh * S), c = cv.getContext('2d');
    c.scale(S, S); c.translate(-bx, -by);
    if (o.kind === 'fence') drawFence(c, mask);
    else if (o.kind === 'chest') drawChest(c, state === 'open');
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
    c.translate(0, bob);
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
    c.restore();
  }
  function hair(c, look, dir, hy, flip) {
    c.fillStyle = look.hair;
    const st = look.hairStyle;
    if (st === 'bald') { c.beginPath(); c.arc(0, hy, 10.6, Math.PI * 0.95, Math.PI * 1.05); c.fill(); c.fillRect(-11, hy - 2, 3, 6); c.fillRect(8, hy - 2, 3, 6); return; }
    if (dir === 'up') { circ(c, 0, hy - 1, 10.8); c.fill(); }
    else {
      c.beginPath(); c.arc(0, hy - 1, 10.8, Math.PI, 0); c.fill();
      if (dir === 'down') { c.fillRect(-10.8, hy - 2, 4, 6); c.fillRect(6.8, hy - 2, 4, 6); }
      else { c.fillRect(-10.8 * flip - (flip < 0 ? -6 : 0) - (flip > 0 ? 0 : 6), hy - 2, 6, 8); }
    }
    if (st === 'spiky') { for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(k * 4 - 3, hy - 8); c.lineTo(k * 4, hy - 15); c.lineTo(k * 4 + 3, hy - 8); c.fill(); } }
    if (st === 'bun') { circ(c, 0, hy - 12, 5); c.fill(); }
    if (st === 'ponytail') { if (dir !== 'down') { ell(c, -8 * flip, hy + 2, 3.5, 7); c.fill(); } else { ell(c, 9, hy + 3, 3, 6); c.fill(); } }
    if (st === 'pigtails') { circ(c, -11, hy + 2, 4); c.fill(); circ(c, 11, hy + 2, 4); c.fill(); }
    if (st === 'braid') { c.fillRect(-12, hy, 4, 12); c.fillRect(8, hy, 4, 12); }
    if (st === 'long') { c.fillRect(-11, hy - 2, 4, 16); c.fillRect(7, hy - 2, 4, 16); if (dir === 'up') c.fillRect(-11, hy, 22, 14); }
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
  };
  function drawEars(c, sp, x, y, r, t, back) {
    const col = EAR[sp.id] || sp.color;
    const dk = shade(col.length === 7 ? col : '#888888', -40);
    const wig = Math.sin(t * 5 + sp.num) * 0.12;
    c.save();
    c.translate(x, y);
    c.lineWidth = r * 0.06; c.strokeStyle = dk;
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
      img.src = 'icons/' + icon + '.jpg';
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
      case T.SAND: return z === 6 ? [236, 187, 119] : [246, 228, 166];
      case T.GRASS: { const p = PAL[z] || PAL[9]; return hex(p.g); }
      case T.TALL: { const p = PAL[z] || PAL[9]; return z === 4 ? [245, 159, 208] : z === 8 ? [154, 119, 224] : hex(p.t2); }
      case T.PATH: return [214, 188, 139];
      case T.FLOWERS: return [255, 170, 214];
      case T.BRIDGE_H: case T.BRIDGE_V: return [176, 122, 70];
      case T.SNOW: return [236, 244, 252];
      case T.ICE: return [190, 232, 255];
      case T.FLOOR: return [196, 187, 230];
      case T.CLIFF: return z === 6 ? [170, 100, 50] : z === 7 ? [140, 175, 205] : [140, 140, 132];
      case T.STONES: return [255, 143, 171];
      case T.PLAZA: return [234, 223, 198];
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
        if (ob.kind === 'tree' || ob.kind === 'bush' || ob.kind === 'hedge') col = ob.variant === 'pine' ? [47, 100, 84] : ob.variant === 'moon' ? [70, 84, 160] : ob.variant === 'crystal' ? [200, 170, 240] : [44, 118, 52];
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
  };
  function battleBackdrop(c, w, h, z, t) {
    const [sky1, sky2, groundCol] = BATTLE_SKY[z] || BATTLE_SKY[9];
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, sky1); g.addColorStop(0.55, sky2); g.addColorStop(0.56, shade(groundCol, 18)); g.addColorStop(1, groundCol);
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    const hz = h * 0.55;
    c.save();
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
