'use strict';
/* ==========================================================================
 * Game: main loop, camera, rendering, controls (tap-to-walk / D-pad / keys),
 * overworld critters, interactions, encounters, saving, and a test API.
 * ========================================================================== */
const Game = (() => {
  const D = CQData, T = World.T, TS = 48;
  let W = World.W, H = World.H;
  function syncDims() { W = World.W; H = World.H; }
  const SAVE_KEY = 'critterQuestRPG_v1';
  const DV = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  function normDir(d) {
    if (d === 0) return 'down';
    if (d === 1) return 'left';
    if (d === 2) return 'right';
    if (d === 3) return 'up';
    return DV[d] ? d : 'down';
  }
  const WALK_MS = 0.2, DASH_MS = 0.105, TREE_REGROW = 90, ENCOUNTER_RATE = 0.09;
  const ZONE_WILDS = { 2: 9, 3: 9, 4: 9, 5: 9, 6: 8, 7: 8, 8: 7, 9: 6, 10: 9, 11: 9, 12: 10, 13: 10, 14: 9, 15: 9, 16: 9 };

  let canvas, ctx, dpr = 1, zoom = 1, viewW = 0, viewH = 0;
  const cam = { x: 0, y: 0 };
  let state = null;
  let mode = 'boot';
  let time = 0, lastFrame = 0, saveTimer = 0, playAcc = 0;
  let curZone = 0, encounterCooldown = 3, graceUntil = 0;
  const rng = Math.random;

  const player = { x: 0, y: 0, px: 0, py: 0, dir: 'down', mv: null, path: [], target: null, frame: 0, frameAcc: 0, bumpArmed: true, jump: 0, exclaim: 0 };
  const follower = { x: 0, y: 0, px: 0, py: 0, mv: null, dir: 'down', show: true };
  let wilds = [], respawns = [], fx = [], parts = [], wildUid = 1;
  let dest = null, walkGoal = null, waitUntil = 0;
  const input = { stack: [], dashHeld: false };

  /* ---------------- state ---------------- */
  function newState(starter) {
    const sp = D.SP[starter];
    return {
      v: 1, mapV: D.MAP_VERSION, created: Date.now(), saved: 0,
      starter, partner: starter,
      team: { [starter]: { lv: 5, exp: 0, hp: D.maxHp(sp, 5), caught: Date.now() } },
      seen: { [starter]: true },
      inv: { gold: 100, berry: 5, rainbow: 2, master: 0 },
      pos: { x: World.start.x, y: World.start.y, dir: 'down' },
      chests: {}, subChests: {}, trees: {}, gifts: {}, pots: {}, bosses: {}, subVisited: {}, submap: null,
      visited: { 1: true }, lastHeal: { x: World.start.x, y: World.start.y },
      dash: false, stats: { steps: 0, battles: 0, caught: 1, chests: 0, playMs: 0, levelUps: 0 },
      news: { honmoon: true, southlands: true, gen234: true },
    };
  }
  function validate(s) {
    if (!s || typeof s !== 'object' || !s.team || typeof s.team !== 'object') return null;
    const ids = Object.keys(s.team).filter(id => D.SP[id]);
    if (!ids.length) return null;
    const team = {};
    ids.forEach(id => {
      const t = s.team[id] || {};
      const lv = U.clamp(parseInt(t.lv, 10) || 5, 1, 50);
      const mx = D.maxHp(D.SP[id], lv);
      team[id] = { lv, exp: Math.max(0, parseInt(t.exp, 10) || 0), hp: U.clamp(parseInt(t.hp, 10) || mx, 0, mx), caught: t.caught || Date.now() };
    });
    const base = newState(ids[0]);
    const out = Object.assign(base, {
      created: s.created || Date.now(), starter: D.SP[s.starter] ? s.starter : ids[0],
      partner: team[s.partner] ? s.partner : ids[0], team,
      seen: Object.assign({}, s.seen || {}), inv: Object.assign(base.inv, s.inv || {}),
      chests: Object.assign({}, s.chests || {}), subChests: Object.assign({}, s.subChests || {}),
      trees: Object.assign({}, s.trees || {}), gifts: Object.assign({}, s.gifts || {}), pots: Object.assign({}, s.pots || {}),
      bosses: Object.assign({}, s.bosses || {}), subVisited: Object.assign({}, s.subVisited || {}),
      submap: (s.submap && typeof s.submap === 'object' && typeof s.submap.id === 'string' && World.submaps && World.submaps[s.submap.id]) ? (() => {
        const sm = World.submaps[s.submap.id];
        let sx = Number.isInteger(s.submap.x) ? s.submap.x : sm.entry.x;
        let sy = Number.isInteger(s.submap.y) ? s.submap.y : sm.entry.y;
        if (sx < 0 || sy < 0 || sx >= sm.W || sy >= sm.H || sm.reach[sy * sm.W + sx] !== 1) {
          sx = sm.entry.x; sy = sm.entry.y;
        }
        return {
          id: s.submap.id,
          x: sx,
          y: sy,
          dir: normDir(s.submap.dir || sm.entry.dir),
          returnX: Number.isInteger(s.submap.returnX) ? s.submap.returnX : (s.pos && Number.isInteger(s.pos.x) ? s.pos.x : (sm.entrance ? sm.entrance.x : World.start.x)),
          returnY: Number.isInteger(s.submap.returnY) ? s.submap.returnY : (s.pos && Number.isInteger(s.pos.y) ? s.pos.y : (sm.entrance ? sm.entrance.y : World.start.y)),
          returnDir: normDir(s.submap.returnDir || (s.pos && s.pos.dir) || 'down'),
        };
      })() : null,
      visited: Object.assign({ 1: true }, s.visited || {}), dash: !!s.dash, stats: Object.assign(base.stats, s.stats || {}),
      news: Object.assign({}, s.news || {}),
    });
    ids.forEach(id => { out.seen[id] = true; });
    ['gold', 'berry', 'rainbow', 'master'].forEach(k => { out.inv[k] = Math.max(0, Math.floor(Number(out.inv[k]) || 0)); });
    const ow = World.overworld || World;
    const owInb = (x, y) => x >= 0 && y >= 0 && x < ow.W && y < ow.H;
    const owWalk = (x, y) => owInb(x, y) && ow.reach[y * ow.W + x] === 1;
    if (s.mapV === D.MAP_VERSION && s.pos && owWalk(s.pos.x | 0, s.pos.y | 0)) {
      out.pos = { x: s.pos.x | 0, y: s.pos.y | 0, dir: DV[s.pos.dir] ? s.pos.dir : 'down' };
      if (Number.isInteger(s.pos.fx) && Number.isInteger(s.pos.fy)) { out.pos.fx = s.pos.fx; out.pos.fy = s.pos.fy; out.pos.fdir = DV[s.pos.fdir] ? s.pos.fdir : 'down'; }
      if (s.lastHeal && owWalk(s.lastHeal.x | 0, s.lastHeal.y | 0)) out.lastHeal = { x: s.lastHeal.x | 0, y: s.lastHeal.y | 0 };
    } else if (s.mapV !== D.MAP_VERSION) {
      out.chests = {}; out.subChests = {}; out.trees = {}; out.pots = {}; out.submap = null;
    }
    return out;
  }
  function load() {
    try { const raw = localStorage.getItem(SAVE_KEY); if (!raw) return null; return validate(JSON.parse(raw)); } catch (e) { return null; }
  }
  function save(reason) {
    if (!state) return false;
    if (playAcc > 0) { state.stats.playMs += Math.round(playAcc * 1000); playAcc = 0; }
    state.saved = Date.now();
    if (World.activeSubmap && state.submap) {
      state.submap.x = player.x;
      state.submap.y = player.y;
      state.submap.dir = player.dir;
      state.pos = {
        x: Number.isInteger(state.submap.returnX) ? state.submap.returnX : World.start.x,
        y: Number.isInteger(state.submap.returnY) ? state.submap.returnY : World.start.y,
        dir: normDir(state.submap.returnDir || 'down'),
      };
    } else {
      state.pos = { x: player.x, y: player.y, dir: player.dir, fx: follower.x, fy: follower.y, fdir: follower.dir };
    }
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { return false; }
    if (reason !== 'auto-quiet') UI.flashSave();
    return true;
  }
  function newAdventure() {
    // Drop the in-memory state FIRST so the pagehide/visibilitychange auto-save during reload can't restore it.
    state = null;
    mode = 'boot';
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
    location.reload();
  }

  /* ---------------- team helpers ---------------- */
  function member(id) { return state && state.team ? state.team[id] : null; }
  function partnerSp() { return state && state.partner ? D.SP[state.partner] : null; }
  function maxHpOf(id) { const m = member(id); return m ? D.maxHp(D.SP[id], m.lv) : 10; }
  function addExp(id, amount) {
    const t = state.team[id];
    if (!t) return 0;
    let ups = 0;
    t.exp += Math.round(amount);
    while (t.lv < 50 && t.exp >= D.expToNext(t.lv)) { t.exp -= D.expToNext(t.lv); t.lv++; ups++; }
    if (t.lv >= 50) t.exp = 0;
    if (ups) { t.hp = maxHpOf(id); state.stats.levelUps += ups; }
    return ups;
  }
  function healAll() { for (const id in state.team) state.team[id].hp = maxHpOf(id); }
  function setPartner(id) {
    if (!state || !state.team[id]) return false;
    const changed = state.partner !== id;
    state.partner = id;
    UI.updateHUD();
    if (changed) {
      addFx('burst', follower.px + 24, follower.py + 20, D.SP[id].color);
      addFx('heart', follower.px + 24, follower.py + 8);
      addFx('heart', follower.px + 14, follower.py + 12);
    }
    save('partner');
    return true;
  }
  function giveItems(items) {
    const msgs = [];
    for (const k in items) {
      const n = items[k];
      if (!n) continue;
      state.inv[k] = (state.inv[k] || 0) + n;
      if (k === 'gold') msgs.push('+' + n + ' 🪙 Gold');
      else if (k === 'berry') msgs.push('+' + n + ' 🍓 Sweet Berr' + (n > 1 ? 'ies' : 'y'));
      else if (k === 'rainbow') msgs.push('+' + n + ' 🌈 Rainbow Capsule' + (n > 1 ? 's' : ''));
      else if (k === 'master') msgs.push('+' + n + ' 👑 Master Star Capsule' + (n > 1 ? 's' : '') + '!');
      else if (k === 'star') msgs.push('+' + n + ' ⭐ Star Capsule' + (n > 1 ? 's' : ''));
    }
    UI.updateHUD();
    return msgs;
  }

  /* ---------------- canvas & camera ---------------- */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(200, window.innerWidth), h = Math.max(200, window.innerHeight);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    zoom = U.clamp(Math.min(w, h) / (11 * TS), 0.7, 1.25);
    Art.setScale(zoom * dpr);
    viewW = canvas.width / Art.S; viewH = canvas.height / Art.S;
    ctx.imageSmoothingEnabled = true;
    snapCamera();
  }
  function camTarget() {
    let tx = player.px + 24 - viewW / 2, ty = player.py + 24 - viewH / 2;
    const ww = W * TS, wh = H * TS;
    tx = viewW >= ww ? (ww - viewW) / 2 : U.clamp(tx, 0, ww - viewW);
    ty = viewH >= wh ? (wh - viewH) / 2 : U.clamp(ty, 0, wh - viewH);
    return [tx, ty];
  }
  function snapCamera() { const [x, y] = camTarget(); cam.x = x; cam.y = y; }
  function screenToWorld(cx, cy) {
    const r = canvas.getBoundingClientRect();
    return [cam.x + (cx - r.left) * (canvas.width / r.width) / Art.S, cam.y + (cy - r.top) * (canvas.height / r.height) / Art.S];
  }

  /* ---------------- wild critters ---------------- */
  function wildAt(x, y) { for (const w of wilds) if (w.x === x && w.y === y) return w; return null; }
  function occupied(x, y) { return wildAt(x, y) || (player.x === x && player.y === y) || (follower.x === x && follower.y === y); }
  function pickSpecies(zone) {
    const sm = World.activeSubmap;
    if (sm && sm.wildPool && Array.isArray(sm.wildPool.table) && sm.wildPool.table.length) {
      return U.weighted(rng, sm.wildPool.table);
    }
    const reg = D.REGIONS[zone];
    if (!reg || !reg.table.length) return null;
    return U.weighted(rng, reg.table);
  }
  /* Core (common/uncommon) species of a zone that currently have no visible roaming Critter there. */
  function missingCore(zone) {
    const sm = World.activeSubmap;
    if (sm && sm.wildPool && Array.isArray(sm.wildPool.table)) {
      return sm.wildPool.table.map(e => e[0]).filter(id => D.SP[id] && !wilds.some(w => w.sp === id));
    }
    const reg = D.REGIONS[zone];
    if (!reg) return [];
    return reg.table.map(e => e[0]).filter(id => { const r = D.SP[id].rarity; return (r === 'common' || r === 'uncommon') && !wilds.some(w => w.zone === zone && w.sp === id); });
  }
  function wildLevel(spId, zone) {
    const sm = World.activeSubmap;
    const sp = D.SP[spId];
    if (sm && sm.wildPool && Array.isArray(sm.wildPool.lv)) {
      return U.randInt(rng, sm.wildPool.lv[0], sm.wildPool.lv[1]);
    }
    const reg = D.REGIONS[zone];
    let lv = U.randInt(rng, reg.lv[0], reg.lv[1]);
    if (sp.rarity === 'rare') lv += 2;
    if (sp.rarity === 'legendary') lv = Math.max(lv, 18);
    return lv;
  }
  function spawnWild(zone, anchor) {
    const sm = World.activeSubmap;
    let tiles = sm ? (Array.isArray(World.spawnTiles) ? World.spawnTiles : (World.spawnTiles[zone] || [])) : World.spawnTiles[zone];
    if (!tiles || !tiles.length) return null;
    if (anchor && !sm) {
      const near = nearTiles(zone, anchor.x, anchor.y);
      if (near.length) tiles = near;
    }
    const minDist = sm ? 2 : (anchor ? 3 : 8);
    for (let tries = 0; tries < 60; tries++) {
      const i = tiles[(rng() * tiles.length) | 0];
      const x = i % W, y = (i / W) | 0;
      if (Math.abs(x - player.x) + Math.abs(y - player.y) < minDist) continue;
      if (occupied(x, y) || World.specials.some(s => s.x === x && s.y === y)) continue;
      const miss = missingCore(zone);
      const sp = miss.length ? miss[0] : pickSpecies(zone);
      if (!sp || (!sm && D.SP[sp].rarity === 'legendary' && rng() < 0.6)) continue;
      const w = { uid: wildUid++, sp, zone, x, y, px: x * TS, py: y * TS, hx: x, hy: y, lv: wildLevel(sp, zone), dir: 'down', mv: null, next: time + 0.5 + rng() * 2.5, bubble: null, bubbleT: 0, special: false, pause: 0, phase: rng() * 6 };
      wilds.push(w);
      return w;
    }
    return null;
  }
  /* Spawn tiles that are on-screen around (x,y) on every device: |dx|,|dy| <= 5 and at least 2-3 tiles away. */
  function nearTiles(zone, x, y) {
    const list = Array.isArray(World.spawnTiles) ? World.spawnTiles : (World.spawnTiles[zone] || []);
    return list.filter(i => {
      const dx = Math.abs(i % W - x), dy = Math.abs(((i / W) | 0) - y);
      return dx <= 5 && dy <= 5 && Math.max(dx, dy) >= 3;
    });
  }
  /* After a teleport, make sure at least 2 wild Critters of this land are visible near Chuyu. */
  function ensureNearbyWilds(zone, x, y) {
    const near = () => wilds.filter(w => w.zone === zone && Math.abs(w.x - x) <= 6 && Math.abs(w.y - y) <= 5);
    let guard = 0;
    while (near().length < 2 && guard++ < 4) {
      const cands = nearTiles(zone, x, y).filter(i => !occupied(i % W, (i / W) | 0) && !World.specials.some(s => s.x === i % W && s.y === ((i / W) | 0)));
      if (!cands.length) return;
      const i = cands[(rng() * cands.length) | 0];
      const nx = i % W, ny = (i / W) | 0;
      const far = wilds.filter(w => w.zone === zone && !w.special && !w.mv && near().indexOf(w) < 0)
        .sort((a, b) => (Math.abs(b.x - x) + Math.abs(b.y - y)) - (Math.abs(a.x - x) + Math.abs(a.y - y)))[0];
      if (far) { far.x = nx; far.y = ny; far.px = nx * TS; far.py = ny * TS; far.hx = nx; far.hy = ny; far.next = time + 1 + rng() * 2; }
      else if (!spawnWild(zone, { x, y })) return;
    }
  }
  function initWilds() {
    wilds = []; respawns = [];
    const sm = World.activeSubmap;
    for (const s of World.specials) {
      const done = s.isBoss ? (state.bosses && state.bosses[s.key]) : state.team[s.sp];
      if (done) continue;
      wilds.push({
        uid: wildUid++, sp: s.sp, zone: s.zone, x: s.x, y: s.y, px: s.x * TS, py: s.y * TS, hx: s.x, hy: s.y,
        lv: s.lv, dir: 'down', mv: null, next: 1e9, bubble: null, bubbleT: 0, special: true,
        isBoss: !!s.isBoss, boss: !!s.boss, key: s.key || null, title: s.title || null,
        intro: s.intro || null, winLines: s.winLines || null, reward: s.reward || null, submapId: s.submapId || null,
        pause: 0, phase: rng() * 6
      });
    }
    if (sm) {
      const maxW = (sm.wildPool && sm.wildPool.maxWilds) || 4;
      for (let k = 0; k < maxW; k++) spawnWild(sm.zoneId);
      return;
    }
    for (const z in ZONE_WILDS) {
      let k = 0;
      const wp = World.waypoints[z];
      if (wp) for (; k < 2; k++) spawnWild(+z, { x: wp.x, y: wp.y });
      for (; k < ZONE_WILDS[z]; k++) spawnWild(+z);
    }
  }
  function updateWilds(dt) {
    for (let k = respawns.length - 1; k >= 0; k--) if (time >= respawns[k].at) { spawnWild(respawns[k].zone); respawns.splice(k, 1); }
    const sm = World.activeSubmap;
    for (const w of wilds) {
      if (w.bubbleT > 0) { w.bubbleT -= dt; if (w.bubbleT <= 0) w.bubble = null; }
      else if (rng() < dt * 0.09) { const sp = D.SP[w.sp]; w.bubble = U.pick(rng, sp.bubbles); w.bubbleT = 2.4; }
      if (w.mv) {
        w.mv.t += dt;
        const k = Math.min(1, w.mv.t / w.mv.dur);
        w.px = U.lerp(w.mv.fx, w.x, k) * TS; w.py = U.lerp(w.mv.fy, w.y, k) * TS;
        w.hop = Math.sin(k * Math.PI) * 9;
        if (k >= 1) { w.mv = null; w.hop = 0; }
        continue;
      }
      if (w.special || mode !== 'play' || time < w.next || time < w.pause) continue;
      if (player.target && player.target.wild === w) continue;
      w.next = time + 1.1 + rng() * 2.6;
      const dirs = ['up', 'down', 'left', 'right'].sort(() => rng() - 0.5);
      for (const d of dirs) {
        const nx = w.x + DV[d][0], ny = w.y + DV[d][1];
        if (Math.abs(nx - w.hx) > 6 || Math.abs(ny - w.hy) > 6) continue;
        if (!World.inb(nx, ny) || World.zoneAt(nx, ny) !== w.zone || !World.walkable(nx, ny) || !World.reach[World.I(nx, ny)]) continue;
        if (sm && nx === sm.entry.x && ny === sm.entry.y) continue;
        if (World.road[World.I(nx, ny)] && rng() < 0.7) continue;
        const g = World.groundAt(nx, ny);
        if (g === T.BRIDGE_H || g === T.BRIDGE_V || g === T.STONES) continue;
        if (occupied(nx, ny)) continue;
        const ob = World.objectAt(nx, ny);
        if (ob && (ob.kind === 'trampoline' || ob.kind === 'subportal' || ob.kind === 'exitmat')) continue;
        w.mv = { fx: w.x, fy: w.y, t: 0, dur: 0.32 };
        w.dir = d; w.x = nx; w.y = ny;
        break;
      }
    }
  }
  function removeWild(w, respawn) {
    const k = wilds.indexOf(w);
    if (k >= 0) wilds.splice(k, 1);
    if (respawn && !w.special) respawns.push({ zone: w.zone, at: time + 20 + rng() * 15 });
  }

  /* ---------------- sub-map transitions ---------------- */
  function enterSubmap(submapId, opts) {
    if (!state || !submapId) return false;
    opts = opts || {};
    const prevSub = state.submap;
    const sm = World.setActiveSubmap(submapId);
    if (!sm) return false;
    const returnX = prevSub && Number.isInteger(prevSub.returnX) ? prevSub.returnX : (sm.entrance ? sm.entrance.x : player.x);
    const returnY = prevSub && Number.isInteger(prevSub.returnY) ? prevSub.returnY : (sm.entrance ? sm.entrance.y : player.y);
    const returnDir = prevSub && prevSub.returnDir ? prevSub.returnDir : (player.dir || 'down');
    syncDims();
    const hasCustomPos = opts.x != null && opts.y != null && World.inb(opts.x, opts.y) && World.walkable(opts.x, opts.y);
    const ex = hasCustomPos ? opts.x : sm.entry.x;
    const ey = hasCustomPos ? opts.y : sm.entry.y;
    const edir = normDir(opts.dir != null ? opts.dir : sm.entry.dir);
    state.submap = { id: sm.id, x: ex, y: ey, dir: edir, returnX, returnY, returnDir };
    if (!state.subVisited) state.subVisited = {};
    state.subVisited[sm.id] = true;
    player.x = ex; player.y = ey; player.px = ex * TS; player.py = ey * TS;
    player.dir = edir;
    player.mv = null; player.path = []; player.target = null; dest = null; walkGoal = null; player.jump = 0;
    clearInput();
    placeFollowerBehind();
    fx = []; parts = [];
    initWilds();
    snapCamera();
    curZone = sm.zoneId;
    const mReg = D.REGIONS[sm.musicZone || sm.zoneId] || D.REGIONS[sm.zoneId];
    if (mReg && (mode === 'play' || mode === 'dialog' || mode === 'modal')) Sound.music(mReg.music);
    if (!opts.silent) {
      Sound.sfx('warp');
      addFx('warp', player.px + 24, player.py + 24);
      UI.banner({ emoji: sm.emoji || '🚪', name: sm.name, color: sm.color || (mReg && mReg.color) || '#ffd84d' });
    }
    encounterCooldown = 3;
    graceUntil = time + 1.2;
    UI.updateHUD();
    save('auto-quiet');
    return true;
  }
  function exitSubmap(silent) {
    if (!state || (!World.activeSubmapId && !state.submap)) return false;
    const sub = state.submap;
    const sm = World.activeSubmap || (sub && World.submaps && World.submaps[sub.id]);
    let rx = (sub && Number.isInteger(sub.returnX)) ? sub.returnX : (sm && sm.entrance ? sm.entrance.x : World.start.x);
    let ry = (sub && Number.isInteger(sub.returnY)) ? sub.returnY : (sm && sm.entrance ? sm.entrance.y : World.start.y);
    const rdir = normDir((sub && sub.returnDir) || 'down');
    World.setActiveSubmap(null);
    syncDims();
    state.submap = null;
    if (!World.inb(rx, ry) || !World.walkable(rx, ry)) {
      rx = World.start.x; ry = World.start.y;
    }
    player.x = rx; player.y = ry; player.px = rx * TS; player.py = ry * TS;
    player.dir = rdir;
    player.mv = null; player.path = []; player.target = null; dest = null; walkGoal = null; player.jump = 0;
    clearInput();
    placeFollowerBehind();
    fx = []; parts = [];
    initWilds();
    snapCamera();
    const z = zoneHere();
    curZone = z;
    const reg = D.REGIONS[z];
    if (reg && (mode === 'play' || mode === 'dialog' || mode === 'modal')) Sound.music(reg.music);
    if (!silent) {
      Sound.sfx('warp');
      addFx('warp', player.px + 24, player.py + 24);
      if (reg) UI.banner(reg);
    }
    encounterCooldown = 3;
    graceUntil = time + 1.2;
    UI.updateHUD();
    save('auto-quiet');
    return true;
  }

  /* ---------------- movement ---------------- */
  function zoneHere() { return World.zoneAt(player.x, player.y); }
  function startFollowerMove(tx, ty, dur) {
    if (!follower.show) return;
    if (Math.abs(follower.x - tx) + Math.abs(follower.y - ty) > 1) { follower.x = tx; follower.y = ty; follower.px = tx * TS; follower.py = ty * TS; follower.mv = null; return; }
    if (follower.x === tx && follower.y === ty) return;
    follower.dir = tx > follower.x ? 'right' : tx < follower.x ? 'left' : ty > follower.y ? 'down' : 'up';
    follower.mv = { fx: follower.x, fy: follower.y, t: 0, dur };
    follower.x = tx; follower.y = ty;
  }
  function placeFollowerBehind() {
    const [dx, dy] = DV[player.dir];
    const px = player.x, py = player.y;
    const cands = [[px - dx, py - dy], [px - dy, py + dx], [px + dy, py - dx], [px + dx, py + dy], [px - 1, py + 1], [px + 1, py + 1], [px - 1, py - 1], [px + 1, py - 1]];
    for (const [x, y] of cands) {
      if (World.walkable(x, y) && !wildAt(x, y)) { follower.x = x; follower.y = y; follower.px = x * TS; follower.py = y * TS; follower.mv = null; return; }
    }
    follower.x = player.x; follower.y = player.y; follower.px = player.px; follower.py = player.py;
  }
  function stepDur() { return (state.dash || input.dashHeld) ? DASH_MS : WALK_MS; }
  function tryStep(a, b, c) {
    let dir = a;
    if (typeof a === 'number') {
      dir = c || (a > 0 ? 'right' : a < 0 ? 'left' : b > 0 ? 'down' : 'up');
    }
    if (!DV[dir]) return false;
    player.dir = dir;
    const nx = player.x + DV[dir][0], ny = player.y + DV[dir][1];
    const w = wildAt(nx, ny);
    if (w) {
      if (time < graceUntil) return false;
      startWildBattle(w);
      return false;
    }
    const stepObj = World.objectAt(nx, ny);
    if (stepObj && !stepObj.removed && (stepObj.act === 'subportal' || stepObj.act === 'submap')) {
      enterSubmap(stepObj.submapId);
      return true;
    }
    if (stepObj && !stepObj.removed && stepObj.act === 'exitmat') {
      exitSubmap();
      return true;
    }
    if (!World.walkable(nx, ny)) {
      if (player.bumpArmed) {
        player.bumpArmed = false;
        if (!interactAt(nx, ny, true)) Sound.sfx('bump');
      }
      return false;
    }
    const ox = player.x, oy = player.y;
    const dur = stepDur();
    player.mv = { fx: ox, fy: oy, t: 0, dur, arc: 0 };
    player.x = nx; player.y = ny;
    startFollowerMove(ox, oy, dur);
    return true;
  }
  function jumpTo(x, y, dur) {
    const ox = player.x, oy = player.y;
    player.mv = { fx: ox, fy: oy, t: 0, dur, arc: 46 };
    player.x = x; player.y = y;
    follower.mv = null;
  }
  function arrive() {
    const mv = player.mv;
    player.mv = null;
    player.jump = 0;
    state.stats.steps++;
    if (mv && mv.arc) placeFollowerBehind();
    const z = zoneHere();
    if (z !== curZone) enterZone(z);
    const g = World.groundAt(player.x, player.y);
    if (g === T.SHALLOW && (!mv || World.groundAt(mv.fx, mv.fy) !== T.SHALLOW)) { Sound.sfx('splash'); addFx('ripple', player.x * TS + 24, player.y * TS + 40); }
    if (g === T.STONES) { Sound.sfx('splash'); addFx('ripple', player.x * TS + 24, player.y * TS + 40); }
    const ob = World.objectAt(player.x, player.y);
    if (ob && (ob.act === 'subportal' || ob.act === 'submap')) { enterSubmap(ob.submapId); return; }
    if (ob && ob.act === 'exitmat') { exitSubmap(); return; }
    if (ob && ob.kind === 'trampoline' && !(mv && mv.arc)) { bounce(); return; }
    if (encounterCooldown > 0) encounterCooldown--;
    if (g === T.TALL) {
      addFx('rustle', player.x * TS + 24, player.y * TS + 30);
      Sound.sfx('rustle');
      const hasTable = World.activeSubmap
        ? (World.activeSubmap.wildPool && World.activeSubmap.wildPool.table && World.activeSubmap.wildPool.table.length)
        : (D.REGIONS[z] && D.REGIONS[z].table.length);
      if (encounterCooldown <= 0 && hasTable && rng() < ENCOUNTER_RATE) { grassEncounter(z); return; }
    }
    if (player.path.length === 0 && player.target) {
      const tg = player.target;
      player.target = null;
      faceAndInteract(tg);
    }
  }
  function bounce() {
    const [dx, dy] = DV[player.dir];
    for (let d = 3; d >= 2; d--) {
      const lx = player.x + dx * d, ly = player.y + dy * d;
      if (World.walkable(lx, ly) && World.reach[World.I(lx, ly)] && !wildAt(lx, ly) && !(World.objectAt(lx, ly) && World.objectAt(lx, ly).kind === 'trampoline')) {
        Sound.sfx('boing');
        addFx('text', player.x * TS + 24, player.y * TS - 10, 'BOING! 🦘');
        player.path = []; player.target = null; dest = null;
        jumpTo(lx, ly, 0.5);
        return;
      }
    }
    Sound.sfx('boing');
    addFx('text', player.x * TS + 24, player.y * TS - 10, 'boing!');
  }
  function enterZone(z) {
    const prev = curZone;
    curZone = z;
    const reg = D.REGIONS[z];
    if (!reg) return;
    if (prev) UI.banner(reg);
    if (mode === 'play' || mode === 'dialog' || mode === 'modal') Sound.music(reg.music);
    if (D.MAIN_REGIONS.indexOf(z) >= 0 && !state.visited[z]) { state.visited[z] = true; }
  }
  function updatePlayer(dt) {
    if (player.mv) {
      const mv = player.mv;
      mv.t += dt;
      const k = Math.min(1, mv.t / mv.dur);
      player.px = U.lerp(mv.fx, player.x, k) * TS;
      player.py = U.lerp(mv.fy, player.y, k) * TS;
      player.jump = mv.arc ? Math.sin(k * Math.PI) * mv.arc : 0;
      player.frameAcc += dt;
      if (player.frameAcc > mv.dur / 2) { player.frameAcc = 0; player.frame++; }
      if (k >= 1) arrive();
    }
    if (follower.mv) {
      const m = follower.mv;
      m.t += dt;
      const k = Math.min(1, m.t / m.dur);
      follower.px = U.lerp(m.fx, follower.x, k) * TS; follower.py = U.lerp(m.fy, follower.y, k) * TS;
      if (k >= 1) follower.mv = null;
    }
    if (player.mv || mode !== 'play') return;
    const held = input.stack.length ? input.stack[input.stack.length - 1] : null;
    if (held) {
      if (player.path.length) { player.path = []; player.target = null; dest = null; }
      tryStep(held);
      return;
    }
    if (player.path.length) {
      const [nx, ny] = player.path[0];
      const dir = nx > player.x ? 'right' : nx < player.x ? 'left' : ny > player.y ? 'down' : 'up';
      const w = wildAt(nx, ny);
      if (w && !(player.target && player.target.wild === w)) {
        // A roaming Critter stepped onto the route: look for a detour (throttled); otherwise wait for it to hop away.
        player.dir = dir;
        if (time >= waitUntil) { waitUntil = time + 0.35; replan(); }
        return;
      }
      if (Math.abs(nx - player.x) + Math.abs(ny - player.y) !== 1) { player.path = []; return; }
      player.path.shift();
      if (!tryStep(dir) && !w) { replan(); }
      if (!player.path.length && !player.mv && player.target) { const tg = player.target; player.target = null; faceAndInteract(tg); }
    } else if (dest && !player.mv) {
      dest = null;
    }
  }
  function replan() {
    const tg = player.target, g = walkGoal;
    player.path = [];
    if (tg) walkToTarget(tg, true);
    else if (g) walkTo(g.x, g.y, true, true);
  }

  /* ---------------- pathfinding (BFS with parents) ---------------- */
  function bfsFrom(sx, sy, ignoreWild) {
    const N = W * H;
    const prev = new Int32Array(N).fill(-1);
    const seen = new Uint8Array(N);
    const q = new Int32Array(N);
    let h = 0, t = 0;
    const s = sy * W + sx;
    seen[s] = 1; q[t++] = s;
    const wildSet = new Set();
    if (!ignoreWild) for (const w of wilds) wildSet.add(w.y * W + w.x);
    while (h < t) {
      const c = q[h++];
      const cx = c % W, cy = (c / W) | 0;
      for (let d = 0; d < 4; d++) {
        const nx = cx + (d === 0 ? 1 : d === 1 ? -1 : 0), ny = cy + (d === 2 ? 1 : d === 3 ? -1 : 0);
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const ni = ny * W + nx;
        if (seen[ni] || !World.walkable(nx, ny) || wildSet.has(ni)) continue;
        const ob = World.objectAt(nx, ny);
        if (ob && (ob.kind === 'trampoline' || ob.kind === 'subportal' || ob.kind === 'exitmat')) continue;
        seen[ni] = 1; prev[ni] = c; q[t++] = ni;
      }
    }
    return { prev, seen, s };
  }
  function pathTo(b, i) {
    const out = [];
    let c = i;
    while (c !== b.s && c >= 0) { out.push([c % W, (c / W) | 0]); c = b.prev[c]; }
    return out.reverse();
  }
  function walkTo(tx, ty, silent, keepGoal) {
    if (!state) return false;
    tx = U.clamp(tx, 0, W - 1); ty = U.clamp(ty, 0, H - 1);
    if (!keepGoal) walkGoal = { x: tx, y: ty };
    let b = bfsFrom(player.x, player.y);
    let goal = ty * W + tx;
    if (!b.seen[goal]) {
      // A wild Critter may be standing on a bridge/corridor: plan through it and wait for it to move.
      const b2 = bfsFrom(player.x, player.y, true);
      if (b2.seen[goal]) b = b2;
    }
    const tramp = World.objectAt(tx, ty);
    if (tramp && tramp.kind === 'trampoline' && !wildAt(tx, ty)) {
      // Trampolines are avoided by normal routing, but tapping one walks Chuyu onto it for a BOING!
      let best = -1, bl = Infinity;
      for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const nx = tx + dx, ny = ty + dy;
        if (!World.inb(nx, ny)) continue;
        const ni = ny * W + nx;
        if (!b.seen[ni]) continue;
        const L = pathTo(b, ni).length;
        if (L < bl) { bl = L; best = ni; }
      }
      if (best >= 0 || (Math.abs(player.x - tx) + Math.abs(player.y - ty) === 1)) {
        player.path = best >= 0 && best !== b.s ? pathTo(b, best) : [];
        player.path.push([tx, ty]);
        player.target = null;
        dest = { x: tx, y: ty, t: time };
        return true;
      }
    }
    if (!b.seen[goal]) {
      let best = -1, bd = Infinity;
      for (let y = Math.max(0, ty - 12); y <= Math.min(H - 1, ty + 12); y++) for (let x = Math.max(0, tx - 12); x <= Math.min(W - 1, tx + 12); x++) {
        const i = y * W + x;
        if (!b.seen[i]) continue;
        const d = (x - tx) ** 2 + (y - ty) ** 2;
        if (d < bd) { bd = d; best = i; }
      }
      if (best < 0) { if (!silent) { UI.toast("Chuyu can't get there! 🙈"); Sound.sfx('error'); } return false; }
      goal = best;
    }
    player.path = pathTo(b, goal);
    player.target = null;
    dest = { x: goal % W, y: (goal / W) | 0, t: time };
    return true;
  }
  function targetTiles(tg) {
    if (tg.npc) return [[tg.npc.x, tg.npc.y + 1], [tg.npc.x - 1, tg.npc.y], [tg.npc.x + 1, tg.npc.y], [tg.npc.x, tg.npc.y - 1]];
    if (tg.wild) return [[tg.wild.x, tg.wild.y + 1], [tg.wild.x - 1, tg.wild.y], [tg.wild.x + 1, tg.wild.y], [tg.wild.x, tg.wild.y - 1]];
    const o = tg.obj, out = [];
    if (o.act === 'door') {
      // Buildings are entered from the front door only.
      const fx = doorX(o);
      return [[fx, o.y + o.h], [fx - 1, o.y + o.h], [fx + 1, o.y + o.h]].filter(([x, y]) => x >= o.x && x < o.x + o.w && World.inb(x, y));
    }
    for (let x = o.x; x < o.x + o.w; x++) out.push([x, o.y + o.h]);
    for (let y = o.y; y < o.y + o.h; y++) { out.push([o.x - 1, y]); out.push([o.x + o.w, y]); }
    for (let x = o.x; x < o.x + o.w; x++) out.push([x, o.y - 1]);
    return out;
  }
  function walkToTarget(tg, silent) {
    if (tg.obj && player.x >= tg.obj.x && player.x < tg.obj.x + tg.obj.w && player.y >= tg.obj.y && player.y < tg.obj.y + tg.obj.h) {
      player.path = []; player.target = null; dest = null;
      useObject(tg.obj);
      return true;
    }
    const tiles = targetTiles(tg);
    if (tiles.some(([x, y]) => x === player.x && y === player.y)) { player.path = []; player.target = null; dest = null; faceAndInteract(tg); return true; }
    let b = bfsFrom(player.x, player.y);
    if (!tiles.some(([x, y]) => World.inb(x, y) && b.seen[y * W + x])) b = bfsFrom(player.x, player.y, true);
    let best = -1, bl = Infinity;
    const lens = new Map();
    for (const [x, y] of tiles) {
      if (!World.inb(x, y)) continue;
      const i = y * W + x;
      if (!b.seen[i]) continue;
      let L = lens.get(i);
      if (L == null) { L = pathTo(b, i).length; lens.set(i, L); }
      if (L < bl) { bl = L; best = i; }
      if (tg.obj && tg.obj.act === 'door' && best >= 0) break;
    }
    if (best < 0) { if (!silent) { UI.toast("Chuyu can't reach that! 🙈"); Sound.sfx('error'); } return false; }
    player.path = pathTo(b, best);
    player.target = tg;
    walkGoal = null;
    dest = { x: best % W, y: (best / W) | 0, t: time, obj: true };
    return true;
  }
  function faceAndInteract(tg) {
    let tx, ty;
    if (tg.npc) { tx = tg.npc.x; ty = tg.npc.y; }
    else if (tg.wild) { if (wilds.indexOf(tg.wild) < 0) return; tx = tg.wild.x; ty = tg.wild.y; }
    else { const o = tg.obj; tx = U.clamp(player.x, o.x, o.x + o.w - 1); ty = U.clamp(player.y, o.y, o.y + o.h - 1); }
    const dx = tx - player.x, dy = ty - player.y;
    if (Math.abs(dx) + Math.abs(dy) !== 1) { if (tg.wild) walkToTarget(tg, true); return; }
    player.dir = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up';
    dest = null;
    if (tg.wild) startWildBattle(tg.wild); else interactAt(tx, ty, false);
  }

  /* ---------------- interactions ---------------- */
  function interactFacing() {
    if (mode !== 'play' || player.mv) return;
    const tx = player.x + DV[player.dir][0], ty = player.y + DV[player.dir][1];
    if (interactAt(tx, ty, false)) return;
    const hereObj = World.objectAt(player.x, player.y);
    if (hereObj && (hereObj.act === 'subportal' || hereObj.act === 'submap' || hereObj.act === 'exitmat')) {
      if (useObject(hereObj)) return;
    }
    const g = World.groundAt(player.x, player.y);
    if (g === T.TALL) UI.toast('Rustle rustle... 🌿 Walk around in tall grass to find Critters!');
    else UI.toast(U.pick(rng, ['Nothing here! Try tapping a chest 🎁, tree 🌳 or Critter 🐾', 'Explore! Every land hides chests and Critters ✨']));
  }
  function interactAt(x, y, viaBump) {
    const w = wildAt(x, y);
    if (w) { if (time < graceUntil) return true; startWildBattle(w); return true; }
    const n = World.npcAtTile(x, y);
    if (n) { if (viaBump) return false; talkTo(n); return true; }
    const o = World.objectAt(x, y);
    if (o && o.act && !o.removed) {
      if (viaBump && (o.act === 'sign' || o.act === 'door')) return false;
      return useObject(o);
    }
    return false;
  }
  function chestOpen(o) { return !!(state && ((state.chests && state.chests[o.key]) || (state.subChests && state.subChests[o.key]))); }
  function treeReady(o) { const t = state && state.trees[o.key]; return !t || (Date.now() - t) / 1000 >= TREE_REGROW; }
  function potUpright(o) { return !!(state && state.pots && state.pots[o.key]); }
  function doorX(o) { return o.kind === 'lab' ? o.x + 2 : o.x + 1; }
  function useObject(o) {
    if (o.act === 'door' && !(player.y === o.y + o.h && player.dir === 'up' && Math.abs(player.x - doorX(o)) <= 1)) {
      UI.toast('🚪 The door is around the front of the ' + (o.kind === 'lab' ? 'lab' : o.kind === 'shop' ? 'shop' : 'house') + '!');
      Sound.sfx('bump');
      return true;
    }
    switch (o.act) {
      case 'subportal':
      case 'submap': {
        return enterSubmap(o.submapId);
      }
      case 'exitmat': {
        return exitSubmap();
      }
      case 'chest': {
        if (chestOpen(o)) { UI.toast('This chest is empty. ✨ Find more treasure!'); Sound.sfx('bump'); return true; }
        const isSubChest = !!(World.activeSubmap || String(o.key || '').startsWith('sub:'));
        if (isSubChest) {
          if (!state.subChests) state.subChests = {};
          state.subChests[o.key] = Date.now();
        }
        state.chests[o.key] = Date.now();
        state.stats.chests++;
        const msgs = giveItems(o.loot);
        Sound.sfx('chest'); setTimeout(() => Sound.sfx('coin'), 380);
        addFx('burst', o.x * TS + 24, o.y * TS + 18, '#ffd84d');
        addFx('text', o.x * TS + 24, o.y * TS - 6, msgs.join('  '));
        if (isSubChest && World.activeSubmap) {
          const smChests = World.activeSubmap.chests || [];
          const smOpened = smChests.filter(c => chestOpen(c)).length;
          UI.toast('🎁 Treasure! ' + msgs.join(' · ') + '  (' + smOpened + '/' + smChests.length + ' in ' + World.activeSubmap.name + ')');
        } else {
          UI.toast('🎁 Treasure! ' + msgs.join(' · ') + '  (' + openedChests() + '/' + World.chests.length + ' chests)');
        }
        save('chest');
        return true;
      }
      case 'shake': {
        if (!treeReady(o)) {
          const left = Math.ceil(TREE_REGROW - (Date.now() - state.trees[o.key]) / 1000);
          o.shakeT = 0.4; Sound.sfx('rustle');
          UI.toast('🌱 New fruit is growing... ready in ' + left + 's!');
          return true;
        }
        state.trees[o.key] = Date.now();
        o.shakeT = 0.9;
        const berries = 1 + ((rng() * 3) | 0), gold = 5 + ((rng() * 11) | 0);
        const msgs = giveItems({ berry: berries, gold });
        Sound.sfx('shake'); setTimeout(() => Sound.sfx('coin'), 450);
        for (let k = 0; k < berries + 2; k++) addFx('fruit', o.x * TS + 10 + rng() * 28, o.y * TS - 10 - rng() * 20, o.variant);
        addFx('text', o.x * TS + 24, o.y * TS - 30, msgs.join('  '));
        UI.toast('🌳 Shake shake! ' + msgs.join(' · '));
        save('tree');
        return true;
      }
      case 'flowerpot': {
        if (potUpright(o)) {
          o.shakeT = 0.35;
          Sound.sfx('talk');
          addFx('heart', o.x * TS + 24, o.y * TS + 6);
          UI.toast('🪴 This flowerpot is standing tall and happy! Derpy Tiger purrs with pride! 🐯💙');
          return true;
        }
        state.pots[o.key] = Date.now();
        o.shakeT = 0.65;
        const msgs = giveItems({ berry: 2, gold: 25 });
        Sound.sfx('chest'); setTimeout(() => Sound.sfx('coin'), 360);
        addFx('burst', o.x * TS + 24, o.y * TS + 16, '#4fb3ff');
        addFx('heart', o.x * TS + 24, o.y * TS + 4);
        addFx('text', o.x * TS + 24, o.y * TS - 8, '🐯🐾 Upright!  ' + msgs.join('  '));
        UI.toast('🐯🐾 Boop! Derpy Tiger patted the knocked-over flowerpot upright! ' + msgs.join(' · '));
        save('pot');
        return true;
      }
      case 'heal': {
        healAll();
        const fx0 = o.x * TS + o.w * 24, fy0 = o.y * TS + o.h * 24;
        if (!World.activeSubmap) {
          let best = null, bd = Infinity;
          for (const [x, y] of targetTiles({ obj: o })) { if (World.inb(x, y) && World.walkable(x, y) && World.reach[World.I(x, y)]) { const d = Math.abs(x - player.x) + Math.abs(y - player.y); if (d < bd) { bd = d; best = { x, y }; } } }
          state.lastHeal = best || { x: player.x, y: player.y };
        }
        if (o.kind === 'ramen') { Sound.sfx('munch'); setTimeout(() => Sound.sfx('heal'), 420); } else Sound.sfx('heal');
        for (let k = 0; k < 8; k++) addFx('heart', fx0 - 30 + rng() * 60, fy0 - rng() * 30);
        if (o.kind === 'ramen') { addFx('text', fx0, o.y * TS - 10, '🍜 Slurp slurp!'); UI.toast('🍜 Slurp slurp! Yummy Honmoon ramen — all your Critters are full of energy! 💖'); }
        else if (o.kind === 'bathhouse') { addFx('text', fx0, o.y * TS - 10, '♨️ Ahh~'); UI.toast('♨️ Jjimjilbang Bathhouse: warm herbal steam healed all your Critters! 💖'); }
        else if (o.kind === 'pokecenter') { addFx('text', fx0, o.y * TS - 10, '❤️ Ding-ding-ding!'); UI.toast('❤️ Ding-ding-ding-ding-ding! Welcome to the Pokémon Center — your team is fighting fit!'); }
        else UI.toast('💖 ' + (o.name || 'Healing Fountain') + ': all your Critters are full of energy!');
        UI.updateHUD();
        save('heal');
        return true;
      }
      case 'warp': {
        state.visited[o.region] = true;
        Sound.sfx('warp');
        addFx('burst', o.x * TS + 24, o.y * TS + 10, '#c58bff');
        UI.toast('🔮 Rainbow Crystal: tap any land to teleport!');
        save('warp-touch');
        UI.openMap();
        return true;
      }
      case 'sign': {
        UI.dialog({ name: o.name || o.title || (o.kind === 'mailbox' ? 'Mailbox' : 'Sign'), emoji: o.kind === 'mailbox' ? '📬' : o.kind === 'sign' ? '🪧' : '✨' }, [o.text || o.msg || ('✨ ' + (o.name || o.title || 'A mysterious landmark.'))]);
        return true;
      }
      case 'door': {
        if (o.kind === 'house') {
          UI.dialog({ name: "Chuyu's House", emoji: '🏡' }, ['Home sweet home! 🏡 Chuyu takes a cozy nap...', '💤 Zzz... Your Critters are fully rested and happy! 💖'], () => {
            healAll(); if (!World.activeSubmap) state.lastHeal = { x: o.x + 1, y: o.y + o.h }; UI.updateHUD(); Sound.sfx('heal'); save('nap');
          });
        } else if (o.kind === 'lab') {
          const prof = World.npcs.find(n => n.id === 'prof');
          if (prof) talkTo(prof); else UI.dialog({ name: 'Critter Lab', emoji: '🔬' }, ['The lab is full of Critter books!']);
        } else if (o.kind === 'shop') {
          Sound.sfx('menu'); UI.openBag('shop');
        } else {
          UI.dialog({ name: o.name || 'Cottage', emoji: '🏠' }, ['Knock knock! 🚪 Nobody is home... they must be out catching Critters!']);
        }
        return true;
      }
      default: return false;
    }
  }
  function talkTo(n) {
    const dx = player.x - n.x, dy = player.y - n.y;
    n.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
    const gifted = !!state.gifts[n.id];
    const lines = gifted && n.after ? n.after : n.lines;
    Sound.sfx('talk');
    UI.dialog(n, lines, () => {
      if (n.gift && !state.gifts[n.id]) {
        state.gifts[n.id] = true;
        const msgs = giveItems(n.gift);
        Sound.sfx('chest');
        UI.toast('🎁 ' + n.name + ' gave you ' + msgs.join(' · ') + '!');
        save('gift');
      }
      if (n.join && D.SP[n.join] && !state.team[n.join]) joinTeam(n);
      if (n.shop) UI.openBag('shop');
    });
  }
  /* HUNTR/X heroes join Chuyu's team after the chat (no capsule needed) and leave their spot. */
  function joinTeam(n) {
    const sp = D.SP[n.join];
    const lv = n.joinLv || 15;
    state.team[sp.id] = { lv, exp: 0, hp: D.maxHp(sp, lv), caught: Date.now() };
    state.seen[sp.id] = true;
    state.gifts[n.id] = true;
    state.stats.caught++;
    addFx('burst', n.x * TS + 24, n.y * TS + 6, sp.color);
    addFx('levelup', n.x * TS + 24, n.y * TS + 6);
    World.hideNPC(n);
    Sound.sfx('gotcha');
    UI.updateHUD();
    save('join');
    mode = 'modal';
    UI.celebrate({ sp, lv, isNew: true, joined: true, gain: 0, gold: 0, ups: [], count: Object.keys(state.team).length }, () => { if (mode === 'modal' && !UI.modalOpen) mode = 'play'; });
  }
  function hideJoinedHeroes() {
    for (const n of World.npcs) if (n.join && state && state.team[n.join]) World.hideNPC(n);
  }
  function openedChests() {
    return state && state.chests ? Object.keys(state.chests).filter(k => state.chests[k] && !k.startsWith('sub:')).length : 0;
  }

  /* ---------------- battles ---------------- */
  function startWildBattle(w) {
    if (mode !== 'play') return;
    w.pause = time + 9999;
    beginBattle(w.sp, w.lv, w);
  }
  function grassEncounter(z) {
    const sp = pickSpecies(z);
    if (!sp) return;
    beginBattle(sp, wildLevel(sp, z), null);
  }
  let lvSnapshot = null;
  function beginBattle(spId, lv, entity) {
    if (!state || !D.SP[spId] || mode === 'battle' || mode === 'title') return false;
    lvSnapshot = {};
    for (const id in state.team) lvSnapshot[id] = state.team[id].lv;
    mode = 'battle';
    player.path = []; player.target = null; dest = null; walkGoal = null; clearInput();
    state.seen[spId] = true;
    state.stats.battles++;
    player.exclaim = 0.7;
    Sound.sfx('encounter');
    UI.flashScreen();
    setTimeout(() => Battle.open({ sp: spId, lv, zone: zoneHere() || 9, entity }), 650);
    return true;
  }
  function onBattleEnd(res) {
    mode = 'play';
    encounterCooldown = 4;
    graceUntil = time + 1.5;
    let bossWinInfo = null;
    if (res.entity) {
      const e = res.entity;
      const isBoss = !!(e.isBoss || e.boss);
      const won = res.outcome === 'caught' || res.outcome === 'finished';
      // Landmark rares/legendaries only leave their spot once they are actually caught; sub-map bosses leave once caught or defeated.
      const leave = res.outcome === 'caught' || (res.outcome === 'finished' && (!e.special || isBoss));
      if (leave) removeWild(e, !isBoss);
      else { e.pause = time + (e.special ? 5 : 3); e.next = time + 0.4; }
      if (isBoss && won) {
        if (!state.bosses) state.bosses = {};
        const bKey = e.key || ('boss_' + (e.submapId || (World.activeSubmap && World.activeSubmap.id) || e.sp));
        const firstWin = !state.bosses[bKey];
        state.bosses[bKey] = true;
        if (firstWin) {
          const rMsgs = e.reward ? giveItems(e.reward) : [];
          bossWinInfo = {
            speaker: { name: e.title || (D.SP[e.sp] && D.SP[e.sp].name) || 'Guardian', emoji: (D.SP[e.sp] && D.SP[e.sp].emoji) || '👑' },
            lines: (Array.isArray(e.winLines) ? e.winLines.slice() : [String(e.winLines || 'You befriended the Guardian!')]).concat(
              rMsgs.length ? ['🎁 Guardian Blessing: ' + rMsgs.join(' · ') + '!'] : []
            ),
          };
        }
      }
    }
    if (res.outcome === 'wiped') {
      if (World.activeSubmap || state.submap) exitSubmap(true);
      healAll();
      const h = state.lastHeal;
      teleportTo(h.x, h.y, true);
      UI.toast('💖 Your Critters had a rest at the Healing Fountain. All better!');
    }
    UI.updateHUD();
    const mZone = World.activeSubmap ? (World.activeSubmap.musicZone || World.activeSubmap.zoneId) : zoneHere();
    const reg = D.REGIONS[mZone];
    if (reg) Sound.music(reg.music, true);
    if (bossWinInfo) {
      UI.dialog(bossWinInfo.speaker, bossWinInfo.lines);
    }
    // Level-up celebration on the overworld
    if (lvSnapshot) {
      const ups = Object.keys(state.team).filter(id => lvSnapshot[id] != null && state.team[id].lv > lvSnapshot[id]);
      if (ups.length) {
        const names = ups.map(id => D.SP[id].name + ' → Lv ' + state.team[id].lv);
        setTimeout(() => {
          UI.toast('⭐ Level Up! ' + names.join(' · '));
          Sound.sfx('levelup');
          addFx('levelup', follower.px + 24, follower.py + 18);
          addFx('text', follower.px + 24, follower.py - 8, '⭐ Lv UP!');
        }, 350);
      }
      lvSnapshot = null;
    }
    save('battle');
  }

  /* ---------------- teleport ---------------- */
  function teleportTo(x, y, quiet, dir) {
    if (typeof quiet === 'string' && !dir) { dir = quiet; quiet = true; }
    if (!state || !World.inb(x, y) || !World.walkable(x, y) || !World.reach[World.I(x, y)]) return false;
    if (!quiet) { addFx('warp', player.px + 24, player.py + 24); Sound.sfx('warp'); }
    player.x = x; player.y = y; player.px = x * TS; player.py = y * TS; player.mv = null; player.path = []; player.target = null; dest = null;
    player.dir = DV[dir] ? dir : (y >= 75 ? 'up' : 'down');
    placeFollowerBehind();
    snapCamera();
    const z = zoneHere();
    if (z !== curZone) enterZone(z);
    if (!quiet) addFx('warp', x * TS + 24, y * TS + 24);
    encounterCooldown = 3;
    return true;
  }
  function teleportToRegion(z) {
    if (!state) return false;
    if (World.activeSubmap || state.submap) {
      World.setActiveSubmap(null);
      syncDims();
      state.submap = null;
      initWilds();
    }
    if (z === 9) {
      for (let r = 0; r < 8; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        const x = 58 + dx, y = 47 + dy;
        if (Math.max(Math.abs(dx), Math.abs(dy)) === r && World.walkable(x, y) && World.reach[World.I(x, y)] && !wildAt(x, y) && World.zoneAt(x, y) === 9) {
          teleportTo(x, y, false, 'down'); ensureNearbyWilds(9, x, y); UI.banner(D.REGIONS[9]); save('warp'); return true;
        }
      }
      return false;
    }
    const wp = World.waypoints[z];
    if (!wp) return false;
    const cands = [[wp.x, wp.y + 1], [wp.x - 1, wp.y + 1], [wp.x + 1, wp.y + 1], [wp.x - 1, wp.y], [wp.x + 1, wp.y], [wp.x, wp.y + 2], [wp.x, wp.y - 1]];
    let spot = null;
    for (const [x, y] of cands) if (World.walkable(x, y) && World.reach[World.I(x, y)] && !wildAt(x, y)) { spot = [x, y]; break; }
    if (!spot) {
      for (let r = 2; r < 8 && !spot; r++) for (let dy = -r; dy <= r && !spot; dy++) for (let dx = -r; dx <= r && !spot; dx++) {
        const x = wp.x + dx, y = wp.y + dy;
        if (World.inb(x, y) && World.walkable(x, y) && World.reach[World.I(x, y)] && !wildAt(x, y)) spot = [x, y];
      }
    }
    if (!spot) return false;
    teleportTo(spot[0], spot[1], false, (z === 8 || z === 7 || z === 4) ? 'up' : 'down');
    ensureNearbyWilds(z, spot[0], spot[1]);
    state.visited[z] = true;
    UI.banner(D.REGIONS[z]);
    save('warp');
    return true;
  }

  /* ---------------- effects ---------------- */
  function addFx(type, x, y, arg) {
    fx.push({ type, x, y, arg, t: 0, life: type === 'text' ? 1.6 : type === 'levelup' ? 1.3 : type === 'warp' ? 1.1 : type === 'burst' ? 0.9 : type === 'ripple' ? 0.8 : type === 'rustle' ? 0.5 : type === 'fruit' ? 0.9 : 1.2, seed: rng() * 10 });
  }
  function updateFx(dt) {
    for (let k = fx.length - 1; k >= 0; k--) { fx[k].t += dt; if (fx[k].t >= fx[k].life) fx.splice(k, 1); }
    for (const o of World.objects) if (o.shakeT > 0) o.shakeT -= dt;
    // ambient particles
    const z = curZone;
    const want = z === 7 ? 'snow' : (z === 8 || z === 12) ? 'firefly' : (z === 4 || z === 16) ? 'sparkle' : (z === 2 || z === 13 || z === 14) ? 'leaf' : z === 6 ? 'dust' : (z === 3 || z === 15) ? 'bubble' : (z === 10 || z === 11) ? 'petal' : null;
    if (want && parts.length < 46 && rng() < dt * 22) {
      parts.push({ type: want, x: cam.x + rng() * viewW, y: cam.y + (want === 'snow' || want === 'leaf' || want === 'petal' ? -10 : rng() * viewH), vx: (rng() - 0.5) * 20 + (want === 'petal' ? 14 : 0), vy: want === 'snow' ? 30 + rng() * 30 : want === 'leaf' || want === 'petal' ? 22 + rng() * 16 : (rng() - 0.5) * 10 - (want === 'bubble' ? 12 : 0), t: 0, life: 3 + rng() * 3, ph: rng() * 6 });
    }
    for (let k = parts.length - 1; k >= 0; k--) {
      const p = parts[k];
      p.t += dt; p.x += (p.vx + Math.sin(p.t * 2 + p.ph) * 12) * dt; p.y += p.vy * dt;
      if (p.t > p.life || p.type !== want) parts.splice(k, 1);
    }
  }

  /* ---------------- rendering ---------------- */
  function sortKeyObj(o) { return (o.kind === 'trampoline' || o.kind === 'exitmat') ? o.y * TS : (o.y + o.h) * TS - 1; }
  function render() {
    const S = Art.S, tpx = Art.tpx;
    const ox = Math.round(cam.x * S), oy = Math.round(cam.y * S);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const tx0 = Math.floor(cam.x / TS), ty0 = Math.floor(cam.y / TS);
    const tx1 = Math.ceil((cam.x + viewW) / TS), ty1 = Math.ceil((cam.y + viewH) / TS);
    const wf = Math.floor(time * 2.2) % 4, gf = Math.floor(time * 1.6) % 2;
    const sm = World.activeSubmap;
    const oobTile = sm ? (sm.borderTile != null ? sm.borderTile : T.CLIFF) : T.DEEP;
    const oobPal = sm ? (sm.paletteId || sm.zoneId || 1) : 3;
    for (let ty = ty0; ty < ty1; ty++) {
      for (let tx = tx0; tx < tx1; tx++) {
        let spr;
        if (tx < 0 || ty < 0 || tx >= W || ty >= H) spr = Art.tile(oobTile, oobPal, 0, wf, 0, 0);
        else {
          const i = ty * W + tx, g = World.ground[i];
          const v = (U.hash2(tx, ty, 9) * 4) | 0;
          const nf = Art.ANIM_FRAMES[g];
          const f = nf === 4 ? (wf + ((tx + ty) & 1)) % 4 : nf === 2 ? (gf + (tx & 1)) % 2 : 0;
          spr = Art.tile(g, World.zone[i], v, f, World.edge[i], World.decal[i]);
        }
        ctx.drawImage(spr, tx * tpx - ox, ty * tpx - oy);
      }
    }
    ctx.setTransform(S, 0, 0, S, -ox, -oy);
    // destination marker
    if (dest && (player.path.length || player.mv)) {
      const p = 0.5 + 0.5 * Math.sin(time * 6);
      ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(dest.x * TS + 24, dest.y * TS + 30, 14 + p * 4, 7 + p * 2, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = dest.obj ? 'rgba(255,200,60,.95)' : 'rgba(255,90,140,.9)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(dest.x * TS + 24, dest.y * TS + 30, 9 + p * 3, 4.5 + p * 1.5, 0, 0, Math.PI * 2); ctx.stroke();
    }
    // y-sorted world
    const list = [];
    const ay0 = Math.max(0, ty0 - 1), ay1 = Math.min(H, ty1 + 6), ax0 = Math.max(0, tx0 - 15), ax1 = Math.min(W, tx1 + 1);
    for (let ty = ay0; ty < ay1; ty++) for (let tx = ax0; tx < ax1; tx++) {
      const a = World.anchorAt[ty * W + tx];
      if (a >= 0) { const o = World.objects[a]; if (!o.removed) list.push({ k: sortKeyObj(o), o }); }
    }
    const inView = (px, py) => px > cam.x - 96 && px < cam.x + viewW + 48 && py > cam.y - 96 && py < cam.y + viewH + 96;
    if (state) {
      for (const w of wilds) if (inView(w.px, w.py)) list.push({ k: w.py + 46, w });
      if (follower.show) list.push({ k: follower.py + 45, f: true });
      list.push({ k: player.py + 47, p: true });
    }
    for (const n of World.npcs) if (!n.hidden && inView(n.x * TS, n.y * TS)) list.push({ k: n.y * TS + 46, n });
    list.sort((a, b) => a.k - b.k);
    for (const it of list) {
      if (it.o) drawObject(it.o);
      else if (it.w) drawWild(it.w);
      else if (it.n) drawNPC(it.n);
      else if (it.f) drawFollower();
      else if (it.p) drawPlayer();
    }
    drawFx();
    drawParticles();
  }
  function drawObject(o) {
    const def = Art.OBJ[o.kind] || { box: [-6, -28, 60, 76] };
    if (!def) return;
    let st = '';
    if (o.kind === 'chest') st = chestOpen(o) ? 'open' : 'closed';
    else if (o.kind === 'berrytree') st = treeReady(o) ? 'ready' : 'empty';
    else if (o.kind === 'flowerpot') st = potUpright(o) ? 'upright' : 'tipped';
    const spr = Art.objSprite(o, st);
    if (spr) {
      const x = o.x * TS + spr.bx, y = o.y * TS + spr.by, w = spr.cv.width / Art.S, h = spr.cv.height / Art.S;
      if (o.shakeT > 0) {
        ctx.save();
        ctx.translate(o.x * TS + 24, o.y * TS + 44);
        ctx.rotate(Math.sin(time * 38) * 0.07 * Math.min(1, o.shakeT * 2));
        ctx.drawImage(spr.cv, x - (o.x * TS + 24), y - (o.y * TS + 44), w, h);
        ctx.restore();
      } else ctx.drawImage(spr.cv, x, y, w, h);
    }
    if (def.anim) def.anim(ctx, o, time);
    if (o.kind === 'chest' && st === 'closed') {
      const a = 0.5 + 0.5 * Math.sin(time * 3 + o.x);
      ctx.fillStyle = 'rgba(255,255,255,' + a + ')';
      Art.helpers.sparkle(ctx, o.x * TS + 40, o.y * TS + 10, 4);
    }
  }
  function inTall(x, y) { return World.groundAt(x, y) === T.TALL; }
  function tallOverlay(tx, ty, from) {
    from = from || 24;
    const i = ty * W + tx;
    const v = (U.hash2(tx, ty, 9) * 4) | 0, gf = (Math.floor(time * 1.6) % 2 + (tx & 1)) % 2;
    const spr = Art.tile(T.TALL, World.zone[i], v, gf, World.edge[i], World.decal[i]);
    const sy = Math.floor(spr.height * from / TS);
    ctx.drawImage(spr, 0, sy, spr.width, spr.height - sy, tx * TS, ty * TS + from, TS, TS - from);
  }
  function drawPlayer() {
    const x = player.px + 24, y = player.py + 44 - player.jump;
    const fl = World.groundAt(player.x, player.y) === T.SHALLOW && (!player.mv || World.groundAt(player.mv.fx, player.mv.fy) === T.SHALLOW || player.mv.t / player.mv.dur > 0.5);
    ctx.save();
    ctx.translate(x, y);
    if (player.jump > 0) { ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(0, player.jump, 11, 4, 0, 0, Math.PI * 2); ctx.fill(); }
    if (fl) { ctx.translate(0, 6 + Math.sin(time * 3) * 1.2); Art.drawDuckFloat(ctx, false); }
    Art.drawPerson(ctx, Art.CHUYU_LOOK, player.dir, player.frame, { moving: !!player.mv, skates: state.dash || input.dashHeld, float: fl });
    if (fl) Art.drawDuckFloat(ctx, true);
    if ((state.dash || input.dashHeld) && player.mv && !fl) {
      ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 2;
      const [dx, dy] = DV[player.dir];
      for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(-dx * (14 + k * 5) + (dy ? (k - 1) * 7 : 0), -14 - dy * 8 + (dx ? (k - 1) * 7 : 0)); ctx.lineTo(-dx * (26 + k * 5) + (dy ? (k - 1) * 7 : 0), -14 - dy * 20 + (dx ? (k - 1) * 7 : 0)); ctx.stroke(); }
    }
    if (player.exclaim > 0) Art.bubble(ctx, 0, -54, '❗', 1.2);
    ctx.restore();
    if (!fl && !player.jump && inTall(player.x, player.y) && (!player.mv || player.mv.t / player.mv.dur > 0.4)) tallOverlay(player.x, player.y);
  }
  function drawFollower() {
    if (!state) return;
    const sp = partnerSp();
    const bob = Math.abs(Math.sin(time * (follower.mv ? 12 : 3))) * (follower.mv ? 5 : 2);
    const x = follower.px + 24, y = follower.py + 24 - bob;
    const fl = World.groundAt(follower.x, follower.y) === T.SHALLOW;
    ctx.fillStyle = fl ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,.2)';
    ctx.beginPath(); ctx.ellipse(follower.px + 24, follower.py + 42, 13, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    if (fl) Art.drawMiniFloat(ctx, x, y + 12, 15, false, '#ff7ab8');
    Art.drawMedallion(ctx, sp, x, y + 8, 14, time, { aura: true });
    if (fl) Art.drawMiniFloat(ctx, x, y + 12, 15, true, '#ff7ab8');
    if (inTall(follower.x, follower.y) && !fl && !follower.mv) tallOverlay(follower.x, follower.y, 37);
  }
  function drawWild(w) {
    const sp = D.SP[w.sp];
    const isBoss = !!(w.isBoss || w.boss);
    const bob = (w.hop || 0) + Math.abs(Math.sin(time * 2.2 + w.phase)) * 2;
    const x = w.px + 24, y = w.py + 22 - bob;
    const fl = World.groundAt(w.x, w.y) === T.SHALLOW;
    ctx.fillStyle = fl ? 'rgba(255,255,255,.55)' : 'rgba(0,0,0,.22)';
    ctx.beginPath(); ctx.ellipse(w.px + 24, w.py + 42, isBoss ? 19 : 15, isBoss ? 6.5 : 5, 0, 0, Math.PI * 2); ctx.fill();
    if (isBoss) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255,216,77,' + (0.55 + 0.35 * Math.sin(time * 4)) + ')';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.ellipse(w.px + 24, w.py + 42, 21 + Math.sin(time * 4) * 2, 7.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (fl) Art.drawMiniFloat(ctx, x, y + 15, 18, false, '#4fb3ff');
    Art.drawMedallion(ctx, sp, x, y, isBoss ? 19 : 17, time, isBoss ? { aura: true } : undefined);
    if (fl) Art.drawMiniFloat(ctx, x, y + 15, 18, true, '#4fb3ff');
    if (inTall(w.x, w.y) && !w.mv) tallOverlay(w.x, w.y, 35);
    const caught = !!state.team[w.sp];
    const badge = isBoss ? '👑 BOSS' : ((sp.rarity === 'legendary' ? '👑 ' : sp.rarity === 'rare' ? '★ ' : '') + (!caught ? 'NEW!' : '')).trim();
    const label = (isBoss && w.title ? w.title : sp.name) + ' Lv' + w.lv;
    Art.nameTag(ctx, x, w.py + 52, label, sp.color, badge);
    if (w.bubble) Art.bubble(ctx, x, y - 24, w.bubble);
  }
  function drawNPC(n) {
    const near = Math.abs(n.x - player.x) + Math.abs(n.y - player.y) <= 3;
    let dir = n.dir || 'down';
    if (near && mode === 'play' && state) { const dx = player.x - n.x, dy = player.y - n.y; dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); }
    ctx.save();
    ctx.translate(n.x * TS + 24, n.y * TS + 44);
    Art.drawPerson(ctx, n.look, dir, 0, { moving: false, bob: 0 });
    ctx.restore();
    const hasGift = (n.gift && !(state && state.gifts[n.id])) || (n.join && state && !state.team[n.join]);
    const icon = n.join && hasGift ? '🎤' : hasGift ? '🎁' : n.shop ? '🛒' : '💬';
    if (hasGift || near || n.shop) Art.bubble(ctx, n.x * TS + 24, n.y * TS - 6 + Math.sin(time * 3) * 2, icon, 0.95);
  }
  function drawFx() {
    const h = Art.helpers;
    for (const e of fx) {
      const k = e.t / e.life;
      ctx.save();
      switch (e.type) {
        case 'text':
          ctx.globalAlpha = 1 - Math.max(0, k - 0.6) / 0.4;
          ctx.font = 'bold 15px system-ui, "Noto Color Emoji", sans-serif'; ctx.textAlign = 'center';
          ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(40,20,70,.85)'; ctx.strokeText(e.arg, e.x, e.y - k * 34);
          ctx.fillStyle = '#fff6b0'; ctx.fillText(e.arg, e.x, e.y - k * 34);
          break;
        case 'burst':
          for (let j = 0; j < 12; j++) { const a = j / 12 * Math.PI * 2 + e.seed; ctx.fillStyle = j % 2 ? '#ffffff' : (e.arg || '#ffd84d'); ctx.globalAlpha = 1 - k; h.sparkle(ctx, e.x + Math.cos(a) * k * 46, e.y + Math.sin(a) * k * 34, 5 * (1 - k) + 1.5); }
          break;
        case 'heart':
          ctx.globalAlpha = 1 - k; ctx.fillStyle = '#ff5c8a'; h.heart(ctx, e.x + Math.sin(k * 8 + e.seed) * 6, e.y - k * 50, 7);
          break;
        case 'warp': {
          const g = ctx.createLinearGradient(e.x, e.y - 120, e.x, e.y + 20);
          g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'hsla(' + ((time * 200) % 360) + ',100%,75%,.7)'); g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.globalAlpha = 1 - k; ctx.fillStyle = g; ctx.fillRect(e.x - 22 * (1 - k * 0.5), e.y - 130, 44 * (1 - k * 0.5), 150);
          for (let j = 0; j < 8; j++) { ctx.fillStyle = 'hsl(' + (j * 45) + ',100%,75%)'; h.sparkle(ctx, e.x + Math.cos(j + time * 5) * 26 * (1 - k), e.y - k * 90 - j * 6, 4); }
          break;
        }
        case 'levelup':
          for (let j = 0; j < 14; j++) { const a = j / 14 * Math.PI * 2 + k * 3; ctx.globalAlpha = 1 - k; ctx.fillStyle = j % 2 ? '#ffd23b' : '#fff6b0'; h.star(ctx, e.x + Math.cos(a) * (10 + k * 40), e.y + Math.sin(a) * (8 + k * 30) - k * 20, 5, 2.2, 5); ctx.fill(); }
          break;
        case 'ripple':
          ctx.globalAlpha = 1 - k; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.ellipse(e.x, e.y, 10 + k * 22, 4 + k * 8, 0, 0, Math.PI * 2); ctx.stroke();
          break;
        case 'rustle':
          for (let j = 0; j < 5; j++) { ctx.globalAlpha = 1 - k; ctx.fillStyle = j % 2 ? '#3e8f34' : '#6cc04f'; const a = -Math.PI / 2 + (j - 2) * 0.5; ctx.beginPath(); ctx.ellipse(e.x + Math.cos(a) * k * 22, e.y + Math.sin(a) * k * 22, 3, 1.6, a, 0, Math.PI * 2); ctx.fill(); }
          break;
        case 'fruit': {
          const col = { apple: '#e8352f', plum: '#8e44ad', coconut: '#7a4a1e', date: '#ff8a2b', crystal: '#ff4fa3', frost: '#4a7dff', moon: '#ffd84d' }[e.arg] || '#e8352f';
          ctx.globalAlpha = 1 - Math.max(0, k - 0.7) / 0.3; ctx.fillStyle = col;
          ctx.beginPath(); ctx.arc(e.x, e.y + k * k * 60, 4, 0, Math.PI * 2); ctx.fill();
          break;
        }
        default: break;
      }
      ctx.restore();
    }
  }
  function drawParticles() {
    const h = Art.helpers;
    for (const p of parts) {
      const a = Math.min(1, p.t, (p.life - p.t)) * (p.type === 'firefly' ? (0.5 + 0.5 * Math.sin(p.t * 5 + p.ph)) : 1);
      ctx.globalAlpha = Math.max(0, a);
      if (p.type === 'snow') { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2); ctx.fill(); }
      else if (p.type === 'firefly') { ctx.fillStyle = '#fff3a0'; ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'rgba(255,243,160,.25)'; ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill(); }
      else if (p.type === 'sparkle') { ctx.fillStyle = 'hsl(' + ((p.ph * 60) % 360) + ',100%,85%)'; h.sparkle(ctx, p.x, p.y, 3); }
      else if (p.type === 'leaf') { ctx.fillStyle = p.ph > 3 ? '#ff9ccf' : '#7cc35a'; ctx.beginPath(); ctx.ellipse(p.x, p.y, 3.4, 1.8, p.t * 2, 0, Math.PI * 2); ctx.fill(); }
      else if (p.type === 'dust') { ctx.fillStyle = 'rgba(255,230,170,.8)'; ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill(); }
      else if (p.type === 'bubble') { ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2); ctx.stroke(); }
      else if (p.type === 'petal') {
        ctx.fillStyle = p.ph > 4.5 ? '#ffe08a' : p.ph > 2 ? '#ffb7d5' : '#ff8fc4';
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.t * 2.4 + p.ph);
        if (p.ph > 4.5) { h.sparkle(ctx, 0, 0, 2.6); } else { ctx.beginPath(); ctx.ellipse(0, 0, 3.6, 2, 0, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---------------- input ---------------- */
  const KEYDIR = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' };
  function syncControls() {
    const dp = document.getElementById('dpad'), bb = document.getElementById('btnB');
    if (dp) dp.dataset.dir = input.stack.length ? input.stack[input.stack.length - 1] : '';
    if (bb) bb.classList.toggle('held', !!input.dashHeld);
  }
  function clearInput() { input.stack = []; input.dashHeld = false; syncControls(); }
  function pushDir(d) { const i = input.stack.indexOf(d); if (i >= 0) input.stack.splice(i, 1); input.stack.push(d); player.bumpArmed = true; syncControls(); }
  function popDir(d) { const i = input.stack.indexOf(d); if (i >= 0) input.stack.splice(i, 1); player.bumpArmed = true; syncControls(); }
  function onKeyDown(e) {
    Sound.unlock(e);
    if (UI.handleKey(e)) return;
    if (mode === 'battle') { if (Battle.handleKey(e)) e.preventDefault(); return; }
    if (mode !== 'play') return;
    const k = e.key;
    if (KEYDIR[k]) { pushDir(KEYDIR[k]); e.preventDefault(); return; }
    if (k === 'Enter' || k === ' ' || k === 'z' || k === 'Z') { e.preventDefault(); if (!e.repeat) interactFacing(); return; }
    if (k === 'Shift') { input.dashHeld = true; syncControls(); return; }
    if ((k === 'x' || k === 'X' || k === 'b' || k === 'B') && !e.repeat) { toggleDash(); return; }
    if ((k === 'm' || k === 'M') && !e.repeat) { UI.openMap(); return; }
    if ((k === 'c' || k === 'C') && !e.repeat) { UI.openDex(); return; }
    if ((k === 'i' || k === 'I' || k === 'e' || k === 'E') && !e.repeat) { UI.openBag('bag'); return; }
    if (k === 'Escape' && !e.repeat) { UI.openMenu(); return; }
  }
  function onKeyUp(e) {
    if (KEYDIR[e.key]) popDir(KEYDIR[e.key]);
    if (e.key === 'Shift') { input.dashHeld = false; syncControls(); }
  }
  function toggleDash() {
    state.dash = !state.dash;
    Sound.sfx(state.dash ? 'coin' : 'menu');
    UI.toast(state.dash ? '⚡ Roller Skates ON! Zoom zoom!' : '🚶 Roller Skates off — nice and steady.');
    UI.updateHUD();
    save('auto-quiet');
  }
  function onCanvasPointer(e) {
    Sound.unlock(e);
    if (mode === 'dialog' && UI.dialogOpen) { e.preventDefault(); UI.advanceDialog(); return; }
    if (mode !== 'play' || !state) return;
    e.preventDefault();
    const [wx, wy] = screenToWorld(e.clientX, e.clientY);
    tapWorld(wx, wy);
  }
  function tapWorld(wx, wy) {
    if (!state || mode !== 'play') return false;
    if (Number.isInteger(wx) && Number.isInteger(wy) && wx >= 0 && wy >= 0 && wx < W && wy < H) {
      const tileObj = World.objectAt(wx, wy) || World.npcAtTile(wx, wy);
      const pxObj = World.objectAt(Math.floor(wx / TS), Math.floor(wy / TS));
      if (tileObj && !pxObj) {
        wx = wx * TS + 24;
        wy = wy * TS + 24;
      }
    }
    let best = null, bd = 34 * 34;
    for (const w of wilds) { const dx = wx - (w.px + 24), dy = wy - (w.py + 22); const d = dx * dx + dy * dy; if (d < bd) { bd = d; best = w; } }
    if (best) {
      best.pause = Math.max(best.pause, time + 8);
      best.bubble = '❗'; best.bubbleT = 1.5;
      walkToTarget({ wild: best });
      return 'wild';
    }
    const tx = Math.floor(wx / TS), ty = Math.floor(wy / TS);
    for (const [x, y] of [[tx, ty], [tx, ty + 1]]) {
      const n = World.npcAtTile(x, y);
      if (n) { walkToTarget({ npc: n }); return 'npc'; }
    }
    // Interactive objects: hit-test the whole drawn sprite (roofs, spires, canopies), frontmost first.
    let hit = null, hitKey = -Infinity;
    for (const o of World.objects) {
      if (o.removed || !o.act || o.act === 'bounce') continue;
      if (o.x > tx + 1 || o.x + o.w < tx - 1 || o.y > ty + 6 || o.y + o.h < ty - 1) continue;
      const def = Art.OBJ[o.kind];
      const top = o.y * TS + (def ? Math.min(0, def.box[1]) : 0);
      if (wx >= o.x * TS - 4 && wx <= (o.x + o.w) * TS + 4 && wy >= top - 4 && wy <= (o.y + o.h) * TS + 2) {
        const k = sortKeyObj(o);
        if (k > hitKey) { hitKey = k; hit = o; }
      }
    }
    if (hit) { walkToTarget({ obj: hit }); return hit.kind; }
    walkTo(tx, ty);
    return 'walk';
  }
  function bindDpad(el) {
    let pid = null;
    const dirFrom = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < r.width * 0.12) return null;
      return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
    };
    const set = (d) => {
      input.stack = d ? [d] : [];
      player.bumpArmed = true;
      el.dataset.dir = d || '';
    };
    el.addEventListener('pointerdown', e => { Sound.unlock(e); e.preventDefault(); pid = e.pointerId; try { el.setPointerCapture(pid); } catch (er) { /* ignore */ } if (mode === 'play') set(dirFrom(e)); });
    el.addEventListener('pointermove', e => { if (e.pointerId !== pid) return; e.preventDefault(); if (mode === 'play') { const d = dirFrom(e); if ((input.stack[0] || null) !== d) set(d); } });
    const end = e => { if (e.pointerId !== pid) return; pid = null; set(null); };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end); el.addEventListener('lostpointercapture', end);
  }
  function pressA() { Sound.unlock(); if (UI.advanceDialog()) return; if (mode === 'play') interactFacing(); }
  function pressB() { Sound.unlock(); if (mode === 'play') toggleDash(); }

  /* ---------------- main loop ---------------- */
  let frameErrors = 0;
  function frame(ts) {
    try { tick(ts); } catch (err) { if (frameErrors++ < 5) console.error('frame error', err); }
    requestAnimationFrame(frame);
  }
  function tick(ts) {
    const dt = Math.min(0.05, Math.max(0, (ts - lastFrame) / 1000 || 0));
    lastFrame = ts;
    time += dt;
    if (state && (mode === 'play' || mode === 'dialog' || mode === 'modal')) {
      updatePlayer(dt);
      updateWilds(dt);
      updateFx(dt);
      if (player.exclaim > 0) player.exclaim -= dt;
      const [tx, ty] = camTarget();
      const k = Math.min(1, dt * 9);
      cam.x += (tx - cam.x) * k; cam.y += (ty - cam.y) * k;
      if (Math.abs(tx - cam.x) < 0.3) cam.x = tx;
      if (Math.abs(ty - cam.y) < 0.3) cam.y = ty;
      playAcc += dt;
      saveTimer += dt;
      if (saveTimer > 20) { saveTimer = 0; save('auto-quiet'); }
    }
    if (mode === 'battle') { Battle.update(dt); if (player.exclaim > 0) player.exclaim -= dt; }
    if (mode !== 'battle' || !Battle.covering()) render();
    UI.updateFx(dt);
  }

  /* ---------------- boot ---------------- */
  function startWith(s, isNew) {
    state = s;
    World.setActiveSubmap(null);
    syncDims();
    hideJoinedHeroes();
    document.body.classList.remove('at-title', 'in-battle');
    document.getElementById('title').classList.add('hidden');
    if (!isNew && s.submap && s.submap.id && World.submaps && World.submaps[s.submap.id]) {
      const sm = World.setActiveSubmap(s.submap.id);
      syncDims();
      const sx = (Number.isInteger(s.submap.x) && World.inb(s.submap.x, s.submap.y) && World.walkable(s.submap.x, s.submap.y)) ? s.submap.x : sm.entry.x;
      const sy = (Number.isInteger(s.submap.x) && World.inb(s.submap.x, s.submap.y) && World.walkable(s.submap.x, s.submap.y)) ? s.submap.y : sm.entry.y;
      player.x = sx; player.y = sy; player.dir = normDir(s.submap.dir || sm.entry.dir);
      player.px = player.x * TS; player.py = player.y * TS;
      placeFollowerBehind();
      if (!state.subVisited) state.subVisited = {};
      state.subVisited[sm.id] = true;
    } else {
      state.submap = null;
      player.x = s.pos.x; player.y = s.pos.y; player.dir = s.pos.dir || 'down';
      player.px = player.x * TS; player.py = player.y * TS;
      const p0 = s.pos;
      if (Number.isInteger(p0.fx) && Number.isInteger(p0.fy) && Math.abs(p0.fx - player.x) + Math.abs(p0.fy - player.y) === 1 && World.walkable(p0.fx, p0.fy)) {
        follower.x = p0.fx; follower.y = p0.fy; follower.px = p0.fx * TS; follower.py = p0.fy * TS; follower.dir = p0.fdir || 'down'; follower.mv = null;
      } else placeFollowerBehind();
    }
    snapCamera();
    initWilds();
    mode = 'play';
    curZone = 0;
    enterZone(zoneHere());
    if (World.activeSubmap) {
      const sm = World.activeSubmap;
      const mReg = D.REGIONS[sm.musicZone || sm.zoneId] || D.REGIONS[sm.zoneId];
      if (mReg) Sound.music(mReg.music, true);
      UI.banner({ emoji: sm.emoji || '🚪', name: sm.name, color: sm.color || (mReg && mReg.color) || '#ffd84d' });
    } else {
      const reg0 = D.REGIONS[zoneHere()];
      if (reg0) Sound.music(reg0.music, true);
    }
    UI.updateHUD();
    if (isNew) {
      save('new');
      const sp = D.SP[s.starter];
      UI.dialog({ name: 'Professor Bubba', emoji: '👨‍🔬', look: D.NPCS[1].look }, [
        'Wonderful choice, Chuyu! ' + sp.name + ' ' + sp.emoji + ' is so happy to be your partner!',
        sp.name + ' will follow you everywhere you go. 🐾',
        'Tap anywhere to walk, or use the ▲▼◄► pad. Rustle through tall grass and walk into wild Critters to meet them!',
        'Come visit me at the Critter Lab ➡ for a present! Now go explore Rainbow Island! 🌈',
      ]);
    } else if (!s.news || !s.news.honmoon) {
      // One-time announcement for adventures saved before Honmoon Island existed.
      s.news = Object.assign({}, s.news, { honmoon: true, southlands: true, gen234: true });
      save('auto-quiet');
      UI.dialog({ name: 'Professor Bubba', emoji: '👨‍🔬', look: D.NPCS[1].look }, [
        'Welcome back, Chuyu! I have HUGE news! 🎤🐯⚡👑',
        'Golden bridges now connect Rainbow Island to Honmoon Island, the Southern Continent, AND the Grand Pokémon Continent!',
        'Meet the K-Pop Demon Hunters, Derpy\'s Minhwa Sanctum 🐯, Nightmare Critters 🎪, Kanto Classics Bay ⚡ (Gen 1), Johto Bell-Tower Groves 🔔 (Gen 2), Hoenn Sky-Pillar Tropics 🌴 (Gen 3), and Sinnoh Spear-Pillar Peaks 👑 (Gen 4)!',
        'Open the 🗺️ World Map and tap any of the 15 lands to teleport. Have fun catching all 80 Critters! 🌟',
      ]);
    } else if (!s.news.southlands) {
      s.news = Object.assign({}, s.news, { southlands: true, gen234: true });
      save('auto-quiet');
      UI.dialog({ name: 'Professor Bubba', emoji: '👨‍🔬', look: D.NPCS[1].look }, [
        'Welcome back, Chuyu! Six brand-new lands just opened south of Honmoon Island! 🐯🎪⚡🔔🌴👑',
        'Explore Derpy\'s Minhwa Sanctum 🐯, Nightmare Critters Carnival 🎪, and Kanto Classics Bay ⚡ (Gen 1) — plus three Grand Pokémon Regions for Generations 2, 3 & 4!',
        'Catch Chikorita, Cyndaquil, Totodile, Togepi, Marill, Umbreon, Suicune & Lugia in Johto 🔔; Treecko, Torchic, Mudkip, Gardevoir, Milotic, Absol, Metagross & Rayquaza in Hoenn 🌴; and Turtwig, Chimchar, Piplup, Shinx, Buneary, Lucario, Garchomp & Arceus in Sinnoh 👑!',
      ]);
    } else if (!s.news.gen234) {
      s.news = Object.assign({}, s.news, { gen234: true });
      save('auto-quiet');
      UI.dialog({ name: 'Professor Bubba', emoji: '👨‍🔬', look: D.NPCS[1].look }, [
        'Welcome back, Chuyu! A third huge map just opened south of the Southern Continent — the Grand Pokémon Continent! 🔔🌴👑',
        '1️⃣ Johto Bell-Tower Groves 🔔 (Gen 2) — visit Ecruteak Bell Tower, Kurt\'s Apricorn Workshop & Whirl Island Roost to catch Chikorita, Cyndaquil, Totodile, Togepi, Marill, Umbreon, Suicune & Legendary Lugia!',
        '2️⃣ Hoenn Sky-Pillar Tropics 🌴 (Gen 3) — explore Sootopolis Lagoon, Secret Base Treehouse & Sky Pillar to catch Treecko, Torchic, Mudkip, Gardevoir, Milotic, Absol, Metagross & Legendary Rayquaza!',
        '3️⃣ Sinnoh Spear-Pillar Peaks 👑 (Gen 4) — visit Professor Rowan\'s Lab, Champion Cynthia & Spear Pillar Temple to catch Turtwig, Chimchar, Piplup, Shinx, Buneary, Lucario, Garchomp & Mythical Arceus!',
      ]);
    } else {
      UI.toast('👋 Welcome back, Chuyu! Your adventure was saved. 💾');
    }
  }
  function init() {
    canvas = document.getElementById('world');
    ctx = canvas.getContext('2d');
    World.generate();
    syncDims();
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', () => setTimeout(resize, 200));
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearInput);
    canvas.addEventListener('pointerdown', onCanvasPointer);
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('pointerdown', e => Sound.unlock(e), { capture: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden && state) save('auto-quiet'); });
    window.addEventListener('pagehide', () => { if (state) save('auto-quiet'); });
    UI.init();
    bindDpad(document.getElementById('dpad'));
    // preview camera on the village while the title is up
    player.x = World.start.x; player.y = World.start.y; player.px = player.x * TS; player.py = player.y * TS;
    snapCamera();
    requestAnimationFrame(t => { lastFrame = t; requestAnimationFrame(frame); });
    Art.loadPortraits().then(info => {
      window.__portraits = info;
      const s = load();
      if (s) { UI.hideLoading(); startWith(s, false); }
      else { mode = 'title'; UI.hideLoading(); UI.showTitle(id => { startWith(newState(id), true); }); }
    });
  }

  /* ---------------- public / test API ---------------- */
  const api = {
    init, save, load, validate, newState, startWith, render, newAdventure, setPartner, addExp, healAll, giveItems,
    teleportToRegion, teleportTo, enterSubmap, exitSubmap,
    walkTo, tryStep, tapWorld, interactFacing,
    pressA, pressB, toggleDash, onBattleEnd, beginBattle, member, maxHpOf, partnerSp, openedChests,
    getState() { return state; },
    get state() { return state; }, get mode() { return mode; }, set mode(m) { mode = m; }, get player() { return player; }, get wilds() { return wilds; },
    get time() { return time; }, get cam() { return cam; }, get zone() { return curZone; }, get follower() { return follower; },
    treeReady, chestOpen, potUpright,
    screenOf(tx, ty) { const r = canvas.getBoundingClientRect(); return [r.left + ((tx * TS + 24 - cam.x) * Art.S) / (canvas.width / r.width), r.top + ((ty * TS + 24 - cam.y) * Art.S) / (canvas.height / r.height)]; },
    pickStarter(id) { if (mode !== 'title' || !D.SP[id]) return false; UI.pickStarter(id); return true; },
  };
  if (typeof window !== 'undefined') {
    window.Game = api;
    window.CritterQuest = api;
  }
  return api;
})();
