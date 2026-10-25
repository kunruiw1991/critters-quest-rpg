'use strict';
/* ==========================================================================
 * World: deterministic Rainbow Island generator (120x90) + Honmoon Island
 * (rows 90..117, KPop Demon Hunters) + connectivity audit.
 * ========================================================================== */
const World = (() => {
  const D = CQData;
  const OW_W = D.MAP_W, OW_H = D.MAP_H, H0 = D.MAP_H0 || 90, H1 = D.MAP_H1 || 118, H2 = D.MAP_H2 || 174, OW_N = OW_W * OW_H;
  let W = OW_W, H = OW_H, N = OW_N;
  const HZ = 10; // Honmoon Island zone id
  const MAX_Z = 16; // Highest zone id (Zones 14..16 on the Grand Pokémon Continent)
  const T = { DEEP: 0, SHALLOW: 1, SAND: 2, GRASS: 3, TALL: 4, PATH: 5, FLOWERS: 6, BRIDGE_H: 7, BRIDGE_V: 8, SNOW: 9, ICE: 10, FLOOR: 11, CLIFF: 12, STONES: 13, PLAZA: 14 };
  const T_NAMES = Object.keys(T);
  const WALK = new Uint8Array([0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1]);
  const SOLID = new Uint8Array(15);
  [T.SAND, T.GRASS, T.TALL, T.FLOWERS, T.SNOW].forEach(t => { SOLID[t] = 1; });
  const WATERLIKE = new Uint8Array(15);
  [T.DEEP, T.SHALLOW, T.STONES, T.BRIDGE_H, T.BRIDGE_V].forEach(t => { WATERLIKE[t] = 1; });
  const DEC = { NONE: 0, SHELL: 1, STARFISH: 2, PEBBLE: 3, MUSH: 4, LILY: 5, FLOWER_P: 6, FLOWER_Y: 7, FLOWER_B: 8, SPARKLE: 9, SHARD: 10, TUFT: 11, CRACK: 12, CLOVER: 13, FLOWER_W: 14, PETAL: 15, NOTE: 16, RUNE: 17, PAW: 18, CONFETTI: 19, CRYSTAL_GLOW: 20 };
  const DIRS4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  const KIND = {
    tree: { block: 1, rm: 1 }, berrytree: { block: 1, act: 'shake' }, rock: { block: 1, rm: 1 }, bush: { block: 1, rm: 1 },
    cactus: { block: 1, rm: 1 }, stump: { block: 1, rm: 1 }, hedge: { block: 1, rm: 1 }, fence: { block: 1, rm: 1 },
    house: { block: 1, act: 'door' }, lab: { block: 1, act: 'door' }, shop: { block: 1, act: 'door' }, cottage: { block: 1, act: 'door' },
    fountain: { block: 1, act: 'heal' }, hotspring: { block: 1, act: 'heal' }, waypoint: { block: 1, act: 'warp' },
    chest: { block: 1, act: 'chest' }, sign: { block: 1, act: 'sign' }, mailbox: { block: 1, act: 'sign' },
    lamp: { block: 1 }, lantern: { block: 1 }, flowerbed: { block: 1, rm: 1 },
    crystal: { block: 1, rm: 1 }, gazebo: { block: 1, act: 'sign' }, windmill: { block: 1, act: 'sign' }, shrine: { block: 1, act: 'sign' },
    rod: { block: 1 }, pyramid: { block: 1, act: 'sign' }, pillar: { block: 1, rm: 1 }, snowman: { block: 1, act: 'sign' },
    icecrystal: { block: 1 }, castle: { block: 1, act: 'sign' }, altar: { block: 1, act: 'sign' }, lighthouse: { block: 1, act: 'sign' },
    umbrella: { block: 1, rm: 1 }, sandcastle: { block: 1, act: 'sign' }, trampoline: { block: 0, act: 'bounce' },
    // Honmoon Island (KPop Demon Hunters)
    stage: { block: 1, act: 'sign' }, seoultower: { block: 1, act: 'sign' }, ramen: { block: 1, act: 'heal' },
    hanok: { block: 1, act: 'sign' }, demongate: { block: 1, act: 'sign' },
    // Southern Continent (Zones 11..13: Minhwa Sanctum, Nightmare Carnival, Kanto Classics Bay)
    tigerpavilion: { block: 1, act: 'sign' }, flowerpot: { block: 1, act: 'flowerpot' },
    bathhouse: { block: 1, act: 'heal' }, hanclinic: { block: 1, act: 'sign' }, sodapoptruck: { block: 1, act: 'sign' },
    carnivaltent: { block: 1, act: 'sign' }, cauldron: { block: 1, act: 'sign' },
    pokecenter: { block: 1, act: 'heal' }, oaklab: { block: 1, act: 'sign' },
    mewshrine: { block: 1, act: 'sign' }, volcano: { block: 1, act: 'sign' },
    // Grand Pokémon Continent (Zones 14..16: Johto Gen 2, Hoenn Gen 3, Sinnoh Gen 4)
    belltower: { block: 1, act: 'sign' }, lugiaroost: { block: 1, act: 'sign' }, apricornshop: { block: 1, act: 'sign' },
    skypillar: { block: 1, act: 'sign' }, secretbase: { block: 1, act: 'sign' },
    spearpillar: { block: 1, act: 'sign' }, rowanlab: { block: 1, act: 'sign' },
    // Sub-Map Portals & Interior Props
    subportal: { block: 0, act: 'subportal' }, exitmat: { block: 0, act: 'exitmat' },
    table: { block: 1, act: 'sign' }, bookshelf: { block: 1, act: 'sign' }, bed: { block: 1, act: 'heal' },
    rug: { block: 0 }, torch: { block: 1 }, barrel: { block: 1 }, crate: { block: 1 },
    statue: { block: 1, act: 'sign' }, crystal_pillar: { block: 1, act: 'sign' }, cauldron_pot: { block: 1, act: 'sign' },
    pagoda_bell: { block: 1, act: 'sign' }, whirlpool_vortex: { block: 1, act: 'sign' }, magma_vent: { block: 1, act: 'sign' },
    stage_light: { block: 1 }, minhwa_screen: { block: 1, act: 'sign' }, steam_vent: { block: 1 },
    mirror_arch: { block: 1, act: 'sign' }, origin_ring: { block: 1, act: 'sign' },
    throne: { block: 1, act: 'sign' }, banner_stand: { block: 1, act: 'sign' }, crystal_cluster: { block: 1, act: 'sign' },
    coral_arch: { block: 1, act: 'sign' }, brazier: { block: 1 }, counter: { block: 1, act: 'sign' },
    ice_pillar: { block: 1, act: 'sign' }, telescope: { block: 1, act: 'sign' }, arcade: { block: 1, act: 'sign' },
    torii_mini: { block: 1, act: 'sign' },
  };

  const owGround = new Uint8Array(OW_N), owZone = new Uint8Array(OW_N), owDecal = new Uint8Array(OW_N);
  const owRoad = new Uint8Array(OW_N), owClear = new Uint8Array(OW_N), owFront = new Uint8Array(OW_N), owReach = new Uint8Array(OW_N), owEdge = new Uint8Array(OW_N);
  const owObjAt = new Int16Array(OW_N), owAnchorAt = new Int16Array(OW_N), owNpcAt = new Int16Array(OW_N);
  let ground = owGround, zone = owZone, decal = owDecal, road = owRoad, clear = owClear, front = owFront, reach = owReach, edge = owEdge;
  let objAt = owObjAt, anchorAt = owAnchorAt, npcAt = owNpcAt;
  let objects = [], npcs = [], specials = [], chests = [], berryTrees = [], waypoints = {}, fountains = {}, spawnTiles = {};
  let overworld = null, submaps = {}, activeSubmapId = null;
  const start = { x: 52, y: 69, dir: 'down' };
  let rng = Math.random;
  let repairs = 0;

  const I = (x, y) => y * W + x;
  const inb = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
  function setT(x, y, t) { if (inb(x, y)) ground[I(x, y)] = t; }
  function isLand(x, y) { if (!inb(x, y)) return false; const g = ground[I(x, y)]; return g !== T.DEEP && g !== T.SHALLOW; }
  function solidBase(z) { return z === 6 || z === 3 ? T.SAND : z === 7 ? T.SNOW : T.GRASS; }

  /* ---------------- zones & terrain ---------------- */
  function distRect(x, y, r) {
    const dx = Math.max(r[0] - x, 0, x - r[2]);
    const dy = Math.max(r[1] - y, 0, y - r[3]);
    return Math.hypot(dx, dy);
  }
  function zoneOf(x, y) {
    if (y >= H2) {
      const jx = x + (U.vnoise(x * 0.17, y * 0.17, 25) - 0.5) * 3;
      if (jx < 44) return 14;
      if (jx < 76) return 15;
      return 16;
    }
    if (y >= H1) {
      const jx = x + (U.vnoise(x * 0.17, y * 0.17, 15) - 0.5) * 3;
      if (jx < 44) return 11;
      if (jx < 76) return 12;
      return 13;
    }
    if (y >= H0) return HZ; // Honmoon Island fills rows 90..117
    if (x >= 49 && x <= 71 && y >= 61 && y <= 81) return 1; // the fenced village is exact
    const jx = x + (U.vnoise(x * 0.17, y * 0.17, 5) - 0.5) * 5;
    const jy = y + (U.vnoise(x * 0.17 + 40, y * 0.17 + 40, 6) - 0.5) * 5;
    let best = 9, bd = Infinity;
    for (let z = 2; z <= 9; z++) {
      const d = distRect(jx, jy, D.REGIONS[z].rect);
      if (d < bd) { bd = d; best = z; }
    }
    return best;
  }
  /* Honmoon Island outline (rows H0..H1-1), Southern Continent (rows H1..H2-1), and Grand Pokémon Continent (rows H2..H-1). */
  const HON = { x0: 18, x1: 101, y0: H0 - 1, y1: H1 - 1 };
  const SOUTH = { x0: 5, x1: 115, y0: H1 + 1, y1: H2 - 1 };
  const GEN234 = { x0: 5, x1: 115, y0: H2 + 1, y1: H - 1 };
  function coastVal(x, y) {
    if (y >= H2) {
      const d = Math.min(x - GEN234.x0, GEN234.x1 - x, y - GEN234.y0, GEN234.y1 - y);
      return d + (U.fbm(x * 0.09, y * 0.09, 31) - 0.5) * 4;
    }
    if (y >= H1) {
      const d = Math.min(x - SOUTH.x0, SOUTH.x1 - x, y - SOUTH.y0, SOUTH.y1 - y);
      return d + (U.fbm(x * 0.09, y * 0.09, 21) - 0.5) * 4;
    }
    if (y >= H0) {
      const d = Math.min(x - HON.x0, HON.x1 - x, y - HON.y0, HON.y1 - y);
      return d + (U.fbm(x * 0.09, y * 0.09, 11) - 0.5) * 4;
    }
    // Rainbow Island keeps its original coastline (computed against its original 90-row height).
    const d = Math.min(x, W - 1 - x, y, H0 - 1 - y);
    return d + (U.fbm(x * 0.09, y * 0.09, 11) - 0.5) * 6;
  }
  function ellipse(cx, cy, rx, ry, fn) {
    for (let y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry + 1); y++) {
      for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx + 1); x++) {
        if (!inb(x, y)) continue;
        const d = Math.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2);
        if (d <= 1) fn(x, y, d);
      }
    }
  }

  function terrain() {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = I(x, y);
        const z = zone[i] = zoneOf(x, y);
        const c = coastVal(x, y);
        if (c < 2.6) ground[i] = T.DEEP;
        else if (c < 4.0) ground[i] = T.SHALLOW;
        else if (c < (z === 3 ? 7.5 : 5.4)) ground[i] = (z === 7 ? T.SNOW : T.SAND);
        else {
          let g = solidBase(z);
          if (z === 3 && x < 77 + U.vnoise(x * 0.2, y * 0.2, 9) * 3) g = T.GRASS;
          ground[i] = g;
          if (z !== 1) {
            const thr = { 2: 0.6, 3: 0.66, 4: 0.63, 5: 0.58, 6: 0.65, 7: 0.62, 8: 0.68, 9: 0.57, 10: 0.6, 11: 0.59, 12: 0.58, 13: 0.58, 14: 0.58, 15: 0.58, 16: 0.58 }[z];
            if (U.fbm(x * 0.13, y * 0.13, 100 + z) > thr) ground[i] = T.TALL;
            else if (z === 4 && U.fbm(x * 0.11, y * 0.11, 300) > 0.6) ground[i] = T.FLOWERS;
            else if (z >= HZ && U.fbm(x * 0.12, y * 0.12, 300 + z) > 0.64) ground[i] = T.FLOWERS;
            if (z === 8 && y >= 21 && y <= 31 && (x <= 55 || x >= 64) && y % 2 === 0 && U.vnoise(x * 0.18, y * 0.18, 77) > 0.25) ground[i] = T.TALL;
          }
        }
      }
    }
  }

  function features() {
    // River between the orchard and the meadow (flows from the crossroads lake to the west sea)
    for (let x = 0; x <= 47; x++) {
      const yc = 55 + Math.round(Math.sin(x * 0.21) * 1.3);
      for (let k = 0; k < 2; k++) if (isLand(x, yc + k) || ground[I(x, yc + k)] === T.SHALLOW) setT(x, yc + k, T.DEEP);
    }
    // Orchard stream down to the south sea (stops at Rainbow Island's original shore)
    for (let y = 56; y < H0; y++) {
      const xc = 35 + Math.round(Math.sin(y * 0.3) * 1.5);
      for (let k = 0; k < 2; k++) if (isLand(xc + k, y)) setT(xc + k, y, T.DEEP);
    }
    // Ridges: canyon|meadow, glacier|windmill, castle west & east walls
    for (let x = 0; x <= 45; x++) {
      const y0 = 26 + (U.vnoise(x * 0.3, 3, 21) > 0.55 ? 1 : 0);
      for (let y = y0; y <= y0 + 1; y++) if (isLand(x, y)) setT(x, y, T.CLIFF);
    }
    for (let x = 74; x < W; x++) {
      const y0 = 26 + (U.vnoise(x * 0.3, 9, 22) > 0.55 ? 1 : 0);
      for (let y = y0; y <= y0 + 1; y++) if (isLand(x, y)) setT(x, y, T.CLIFF);
    }
    for (let y = 0; y <= 27; y++) {
      for (const xa of [44, 73]) {
        const x0 = xa + (U.vnoise(y * 0.3, xa, 23) > 0.6 ? 1 : 0);
        for (let x = x0; x <= x0 + 1; x++) if (isLand(x, y)) setT(x, y, T.CLIFF);
      }
    }
    // Extra mountain passes
    for (let y = 25; y <= 28; y++) for (const x of [10, 11, 106, 107]) if (ground[I(x, y)] === T.CLIFF) setT(x, y, T.PATH);
    // Canyon mesas
    for (let y = 5; y < 26; y++) for (let x = 6; x < 44; x++) {
      const i = I(x, y);
      if (zone[i] === 6 && (ground[i] === T.SAND || ground[i] === T.TALL) && U.fbm(x * 0.16, y * 0.16, 61) > 0.67) ground[i] = T.CLIFF;
    }
    // Rainbow Crossroads lake + island + bridge
    ellipse(51, 53, 5, 3.6, (x, y, d) => setT(x, y, d < 0.32 ? T.GRASS : d < 0.62 ? T.DEEP : T.SHALLOW));
    for (let x = 52; x <= 57; x++) if (ground[I(x, 53)] === T.DEEP) setT(x, 53, T.BRIDGE_H);
    // Meadow fairy pond (all shallow -> Duckie Float!)
    ellipse(12, 47, 4.6, 2.7, (x, y) => setT(x, y, T.SHALLOW));
    // Canyon palm oasis
    ellipse(31, 19, 3.8, 2.4, (x, y, d) => setT(x, y, d < 0.45 ? T.DEEP : T.SHALLOW));
    // Glacier frozen lake
    ellipse(101, 11, 6.5, 3.2, (x, y) => setT(x, y, T.ICE));
    // Sapphire Coral Lagoon with an island and coral stepping stones
    ellipse(101, 75, 10, 6.5, (x, y, d) => setT(x, y, d < 0.16 ? T.SAND : d < 0.45 ? T.DEEP : T.SHALLOW));
    for (let x = 88; x <= 101; x++) if (ground[I(x, 75)] === T.DEEP) setT(x, 75, T.STONES);
    for (let y = 66; y <= 75; y++) if (ground[I(101, y)] === T.DEEP) setT(101, y, T.STONES);
    // Lighthouse pier
    for (let x = 110; x <= 117; x++) setT(x, 64, T.BRIDGE_H);
    for (let y = 61; y <= 63; y++) for (let x = 109; x <= 112; x++) if (!isLand(x, y)) setT(x, y, T.SAND);
  }

  /* ---------------- roads ---------------- */
  function stamp(x, y, orient, w) {
    for (let dy = 0; dy < w; dy++) for (let dx = 0; dx < w; dx++) {
      const xx = x + dx, yy = y + dy;
      if (!inb(xx, yy)) continue;
      const i = I(xx, yy), g = ground[i];
      road[i] = 1;
      if (g === T.DEEP || g === T.SHALLOW || g === T.STONES) ground[i] = orient === 'h' ? T.BRIDGE_H : T.BRIDGE_V;
      else if (g === T.FLOOR || g === T.PLAZA || g === T.BRIDGE_H || g === T.BRIDGE_V) { /* keep */ }
      else if (zone[i] === 3 && (g === T.SAND || g === T.TALL)) ground[i] = orient === 'h' ? T.BRIDGE_H : T.BRIDGE_V;
      else ground[i] = T.PATH;
    }
  }
  function roadSeg(x0, y0, x1, y1, amp, w) {
    w = w || 2;
    const horiz = y0 === y1;
    const len = horiz ? Math.abs(x1 - x0) : Math.abs(y1 - y0);
    const dir = horiz ? Math.sign(x1 - x0) : Math.sign(y1 - y0);
    let prev = 0;
    for (let k = 0; k <= len; k++) {
      const taper = Math.min(1, k / 6, (len - k) / 6);
      const along = horiz ? x0 + k * dir : y0 + k * dir;
      let off = amp ? Math.round(Math.sin(along * 0.17 + (horiz ? y0 : x0) * 0.9) * amp * taper) : 0;
      if (off > prev + 1) off = prev + 1; else if (off < prev - 1) off = prev - 1;
      prev = off;
      if (horiz) stamp(along, y0 + off, 'h', w); else stamp(x0 + off, along, 'v', w);
    }
  }
  function trail(points) {
    for (let k = 0; k + 1 < points.length; k++) {
      const [x0, y0] = points[k], [x1, y1] = points[k + 1];
      if (y0 === y1) { const d = Math.sign(x1 - x0); for (let x = x0; x !== x1 + d; x += d) stamp(x, y0, 'h', 1); }
      else { const d = Math.sign(y1 - y0); for (let y = y0; y !== y1 + d; y += d) stamp(x0, y, 'v', 1); }
    }
  }
  function roads() {
    roadSeg(59, 80, 59, 62, 0);    // village main street
    roadSeg(59, 62, 59, 20, 1.6);  // crossroads -> castle courtyard
    roadSeg(50, 70, 70, 70, 0);    // village east-west street
    roadSeg(50, 70, 27, 70, 1.5);  // -> orchard
    roadSeg(70, 70, 93, 70, 1.2);  // -> lagoon boardwalk
    roadSeg(26, 70, 26, 45, 1.5);  // orchard -> meadow
    roadSeg(93, 70, 93, 45, 1.4);  // lagoon -> windmill
    roadSeg(24, 44, 93, 44, 1.6);  // meadow <-> crossroads <-> windmill
    roadSeg(24, 44, 24, 14, 1.4);  // meadow -> canyon
    roadSeg(93, 44, 93, 14, 1.4);  // windmill -> glacier
    roadSeg(24, 13, 93, 13, 1.2);  // canyon <-> castle <-> glacier
    roadSeg(51, 77, 68, 77, 0);    // village south street
    trail([[25, 72], [19, 72], [19, 78], [17, 78]]);                    // secret glade trail
    trail([[95, 47], [101, 47], [101, 52], [106, 52], [106, 50]]);      // bamboo grove trail
  }

  /* ---------------- objects ---------------- */
  function isOpen(x, y) {
    if (!inb(x, y)) return false;
    const i = I(x, y);
    if (!WALK[ground[i]]) return false;
    const o = objAt[i];
    if (o >= 0 && objects[o].block) return false;
    return npcAt[i] < 0;
  }
  function addObj(kind, x, y, w, h, props) {
    const k = KIND[kind];
    const o = Object.assign({ id: objects.length, kind, x, y, w, h, block: k.block, act: k.act || null, rm: !!k.rm, z: zone[I(x, y + h - 1)], key: kind + ':' + x + ',' + y }, props || {});
    objects.push(o);
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) objAt[I(xx, yy)] = o.id;
    anchorAt[I(x, y + h - 1)] = o.id;
    return o;
  }
  function removeObj(o) {
    for (let yy = o.y; yy < o.y + o.h; yy++) for (let xx = o.x; xx < o.x + o.w; xx++) if (objAt[I(xx, yy)] === o.id) objAt[I(xx, yy)] = -1;
    if (anchorAt[I(o.x, o.y + o.h - 1)] === o.id) anchorAt[I(o.x, o.y + o.h - 1)] = -1;
    o.removed = true;
  }
  function clearRect(x, y, w, h) { for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) if (inb(xx, yy)) clear[I(xx, yy)] = 1; }
  function ensureWalk(x, y, asFront) {
    if (!inb(x, y)) return;
    const i = I(x, y);
    if (objAt[i] >= 0 && objects[objAt[i]].rm) removeObj(objects[objAt[i]]);
    if (!WALK[ground[i]]) ground[i] = solidBase(zone[i]);
    clear[i] = 1;
    if (asFront) front[i] = 1;
  }
  function landmark(kind, x, y, w, h, props, opt) {
    opt = opt || {};
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) {
      const i = I(xx, yy);
      if (objAt[i] >= 0) removeObj(objects[objAt[i]]);
      road[i] = 0;
      ground[i] = opt.ground != null ? opt.ground : solidBase(zone[i]);
    }
    const o = addObj(kind, x, y, w, h, props);
    clearRect(x - 1, y - 1, w + 2, h + 2);
    if (opt.front !== false) {
      const fx = opt.fx != null ? opt.fx : x + (w >> 1);
      ensureWalk(fx, y + h, true);
    }
    return o;
  }
  function canPlace(x, y, w, h, opt) {
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) {
      if (xx < 1 || yy < 1 || xx >= W - 1 || yy >= H - 1) return false;
      const i = I(xx, yy);
      if (objAt[i] >= 0 || npcAt[i] >= 0 || front[i]) return false;
      if (road[i]) return false;
      if (!opt.ignoreClear && clear[i]) return false;
      const g = ground[i];
      if (opt.anyWalk ? !WALK[g] || g === T.BRIDGE_H || g === T.BRIDGE_V || g === T.STONES : !SOLID[g]) return false;
      if (opt.zone && zone[i] !== opt.zone) return false;
    }
    return true;
  }
  function placeNear(kind, x, y, w, h, props, opt) {
    opt = opt || {};
    const R = opt.radius != null ? opt.radius : 6;
    for (let r = 0; r <= R; r++) {
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const px = x + dx, py = y + dy;
        if (!canPlace(px, py, w, h, opt)) continue;
        if (opt.front) {
          const fx = px + (w >> 1), fy = py + h;
          if (!isOpen(fx, fy)) continue;
        }
        if (opt.safe && !safeToBlock(px, py)) continue;
        const o = addObj(kind, px, py, w, h, props);
        if (opt.front) ensureWalk(px + (w >> 1), py + h, true);
        if (opt.ring) clearRect(px - 1, py - 1, w + 2, h + 2);
        return o;
      }
    }
    return null;
  }
  function safeToBlock(x, y) {
    const r = [isOpen(x, y - 1), isOpen(x + 1, y - 1), isOpen(x + 1, y), isOpen(x + 1, y + 1), isOpen(x, y + 1), isOpen(x - 1, y + 1), isOpen(x - 1, y), isOpen(x - 1, y - 1)];
    let orth = 0, links = 0;
    for (let k = 0; k < 8; k += 2) if (r[k]) orth++;
    if (orth <= 1) return true;
    for (let k = 0; k < 8; k += 2) { const n = (k + 2) % 8; if (r[k] && r[n] && r[k + 1]) links++; }
    let groups = orth - links;
    if (orth === 4 && links === 4) groups = 1;
    return groups <= 1;
  }
  function placeNPC(def, idx) {
    let [x, y] = def.at;
    let ok = false;
    for (let r = 0; r <= 4 && !ok; r++) {
      for (let dy = -r; dy <= r && !ok; dy++) for (let dx = -r; dx <= r && !ok; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const px = def.at[0] + dx, py = def.at[1] + dy;
        if (!inb(px, py)) continue;
        const i = I(px, py);
        if (objAt[i] >= 0 || npcAt[i] >= 0 || front[i]) continue;
        if (!WALK[ground[i]] || ground[i] === T.SHALLOW || ground[i] === T.STONES) continue;
        x = px; y = py; ok = true;
      }
    }
    const n = Object.assign({}, def, { x, y, dir: 'down', idx });
    npcs.push(n);
    npcAt[I(x, y)] = npcs.length - 1;
    clearRect(x - 1, y - 1, 3, 3);
    return n;
  }
  function addSpecial(s) {
    const [x, y] = s.at;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const i = I(x + dx, y + dy);
      clear[i] = 1;
      if (dx === 0 && dy === 0) ensureWalk(x, y, true);
    }
    specials.push(Object.assign({}, s, { x, y }));
  }
  function fence(x, y) {
    if (!inb(x, y)) return;
    const i = I(x, y);
    if (road[i] || objAt[i] >= 0 || npcAt[i] >= 0 || front[i]) return;
    if (!SOLID[ground[i]] && ground[i] !== T.PATH) return;
    if (ground[i] === T.PATH) return;
    addObj('fence', x, y, 1, 1);
  }
  function berryTree(x, y, variant) {
    const o = placeNear('berrytree', x, y, 1, 1, { variant }, { radius: 4, front: true, ignoreClear: true, safe: true });
    if (o) { clearRect(o.x - 1, o.y - 1, 3, 3); berryTrees.push(o); }
    return o;
  }

  function buildLandmarks() {
    /* ===== 1. Sunshine Village ===== */
    for (let y = 66; y <= 75; y++) for (let x = 56; x <= 63; x++) { ground[I(x, y)] = T.PLAZA; clear[I(x, y)] = 1; }
    landmark('house', 51, 66, 4, 3, { name: "Chuyu's House", fx: 52 }, { fx: 52 });
    landmark('lab', 64, 65, 5, 4, { name: "Professor Bubba's Critter Lab" }, { fx: 66 });
    landmark('shop', 51, 73, 4, 3, { name: 'Capsule & Berry Shop' }, { fx: 52 });
    landmark('cottage', 64, 73, 3, 3, { name: "Timmy's House", roof: '#ff8f3a' }, { fx: 65 });
    landmark('cottage', 67, 73, 3, 3, { name: "Lila's House", roof: '#9b6bff' }, { fx: 68 });
    fountains[1] = landmark('fountain', 59, 70, 2, 2, { style: 1, name: 'Sunshine Healing Fountain' }, { ground: T.PLAZA });
    waypoints[1] = landmark('waypoint', 57, 67, 1, 1, { region: 1 }, { ground: T.PLAZA });
    for (let x = 49; x <= 71; x++) { fence(x, 61); fence(x, 81); }
    for (let y = 62; y <= 80; y++) { fence(49, y); fence(71, y); }
    for (const [x, y] of [[58, 63], [61, 63], [55, 72], [64, 71], [58, 79], [61, 79], [50, 72], [70, 72]]) placeNear('lamp', x, y, 1, 1, {}, { radius: 1, ignoreClear: true, anyWalk: true, safe: true });
    for (const [x, y] of [[56, 75], [63, 75], [63, 66], [50, 65], [55, 65], [69, 64]]) placeNear('flowerbed', x, y, 1, 1, {}, { radius: 1, ignoreClear: true, anyWalk: true, safe: true });
    placeNear('mailbox', 50, 69, 1, 1, { text: "📬 Chuyu's mailbox: \"Dear Chuyu, go catch all 32 Critters — and cross the golden bridge south of the village to meet the K-Pop Demon Hunters! Love, Professor Bubba\"" }, { radius: 1, ignoreClear: true, safe: true });
    berryTree(55, 79, 'apple'); berryTree(67, 79, 'apple');

    /* ===== 9. Rainbow Crossroads ===== */
    berryTree(66, 52, 'apple'); berryTree(68, 39, 'apple');

    /* ===== 2. Orchard & Emerald Woods ===== */
    for (const [x, y] of [[41, 60], [44, 60], [41, 63], [44, 63], [41, 76], [44, 76], [41, 79], [44, 79]]) {
      ensureWalk(x, y); const o = addObj('berrytree', x, y, 1, 1, { variant: 'apple' }); berryTrees.push(o);
      clearRect(x - 1, y - 1, 3, 3); ensureWalk(x, y + 1, true);
    }
    ellipse(15, 78, 3.6, 2.8, (x, y) => { ground[I(x, y)] = (x + y) % 3 === 0 ? T.FLOWERS : T.GRASS; clear[I(x, y)] = 1; });
    fountains[2] = placeNear('fountain', 30, 73, 2, 2, { style: 2, name: 'Orchard Spring Fountain' }, { front: true, ring: true, radius: 6 });
    waypoints[2] = placeNear('waypoint', 30, 66, 1, 1, { region: 2 }, { front: true, ring: true, radius: 6 });

    /* ===== 3. Lagoon ===== */
    landmark('lighthouse', 110, 62, 2, 2, { name: 'Coral Lighthouse', text: '🗼 The Coral Lighthouse shines all night to guide the boats home.' }, { ground: T.SAND, fx: 110 });
    ensureWalk(111, 64, true);
    fountains[3] = placeNear('fountain', 84, 63, 2, 2, { style: 3, name: 'Seashell Healing Fountain' }, { front: true, ring: true, radius: 6 });
    waypoints[3] = placeNear('waypoint', 88, 66, 1, 1, { region: 3 }, { front: true, ring: true, radius: 6 });
    for (const [x, y] of [[80, 78], [86, 81], [107, 68], [96, 83]]) placeNear('umbrella', x, y, 1, 1, { variant: x % 3 }, { radius: 3, safe: true });
    for (const [x, y] of [[83, 79], [104, 82]]) placeNear('sandcastle', x, y, 1, 1, { text: '🏰 A wonderful sandcastle! JJ must have built it.' }, { radius: 3, safe: true });
    berryTree(79, 63, 'coconut'); berryTree(84, 69, 'coconut');

    /* ===== 4. Rainbow Crystal Meadow ===== */
    landmark('gazebo', 14, 33, 4, 3, { name: 'Unicorn Gazebo', text: '🦄 The ancient Unicorn Gazebo. Rainbow light dances under its dome.' }, { fx: 15 });
    ensureWalk(16, 36, true);
    for (let k = 0; k < 8; k++) {
      const a = k * Math.PI / 4;
      placeNear('crystal', Math.round(15.5 + Math.cos(a) * 6.5), Math.round(34.5 + Math.sin(a) * 4.6), 1, 1, { hue: k }, { radius: 1, ignoreClear: true, safe: true });
    }
    fountains[4] = placeNear('fountain', 20, 47, 2, 2, { style: 4, name: 'Fairy Pond Fountain' }, { front: true, ring: true, radius: 6 });
    waypoints[4] = placeNear('waypoint', 31, 40, 1, 1, { region: 4 }, { front: true, ring: true, radius: 6 });
    berryTree(34, 35, 'crystal'); berryTree(37, 50, 'crystal');

    /* ===== 5. Thunder Windmill Ridge & Bamboo Grove ===== */
    [[78, 31], [85, 34], [100, 31], [107, 36]].forEach(([x, y], k) => landmark('windmill', x, y, 3, 3, { phase: k * 0.7, name: 'Thunder Windmill', text: '🌬️ A giant windmill spins in the breeze. Whoosh, whoosh!' }));
    landmark('shrine', 106, 47, 3, 2, { name: 'Lightning Shrine', text: '⛩️ The Lightning Shrine crackles with friendly thunder energy! ⚡' }, { fx: 107 });
    clearRect(104, 49, 7, 3);
    placeNear('rod', 104, 47, 1, 1, {}, { radius: 1, ignoreClear: true, safe: true });
    placeNear('rod', 110, 47, 1, 1, {}, { radius: 1, ignoreClear: true, safe: true });
    for (const [x, y] of [[81, 40], [87, 49], [99, 38], [80, 51], [110, 32]]) {
      const o = placeNear('trampoline', x, y, 1, 1, {}, { radius: 3 });
      if (o) clearRect(o.x - 3, o.y - 3, 7, 7);
    }
    fountains[5] = placeNear('fountain', 88, 40, 2, 2, { style: 5, name: 'Windmill Pump Fountain' }, { front: true, ring: true, radius: 6 });
    waypoints[5] = placeNear('waypoint', 97, 41, 1, 1, { region: 5 }, { front: true, ring: true, radius: 6 });
    berryTree(78, 47, 'plum'); berryTree(90, 36, 'plum');

    /* ===== 6. Golden Canyon & Oasis Ruins ===== */
    landmark('pyramid', 9, 6, 7, 4, { name: 'Great Pyramid', big: true, text: '🔺 The Great Pyramid! Ancient Critter drawings cover its golden stones.' }, { fx: 12 });
    for (let y = 10; y <= 12; y++) for (let x = 8; x <= 16; x++) { const i = I(x, y); if (ground[i] === T.CLIFF || ground[i] === T.TALL) ground[i] = T.SAND; clear[i] = 1; }
    landmark('pyramid', 35, 6, 5, 3, { name: 'Little Pyramid', text: '🔺 A little pyramid. It is warm from the sun!' }, { fx: 37 });
    for (let k = 0; k < 7; k++) {
      const a = k * Math.PI * 2 / 7 + 0.3;
      placeNear('tree', Math.round(31 + Math.cos(a) * 5.3), Math.round(19 + Math.sin(a) * 3.6), 1, 1, { variant: 'palm' }, { radius: 1, ignoreClear: true, safe: true });
    }
    fountains[6] = placeNear('fountain', 37, 17, 2, 2, { style: 6, name: 'Oasis Spring' }, { front: true, ring: true, radius: 6 });
    waypoints[6] = placeNear('waypoint', 20, 17, 1, 1, { region: 6 }, { front: true, ring: true, radius: 6 });
    for (const [x, y] of [[8, 13], [16, 13], [7, 9], [18, 7], [20, 9]]) placeNear('pillar', x, y, 1, 1, { variant: x % 2 }, { radius: 1, ignoreClear: true, safe: true });
    berryTree(26, 16, 'date'); berryTree(35, 22, 'date');

    /* ===== 7. Frostberry Glacier & Aurora Hot Springs ===== */
    clearRect(81, 7, 7, 7);
    for (let k = 0; k < 6; k++) {
      const a = k * Math.PI / 3;
      const x = Math.round(84 + Math.cos(a) * 3), y = Math.round(10 + Math.sin(a) * 2.6);
      ensureWalk(x, y); if (objAt[I(x, y)] < 0 && !road[I(x, y)]) addObj('icecrystal', x, y, 1, 1, { hue: k });
    }
    fountains[7] = landmark('hotspring', 106, 19, 3, 2, { name: 'Aurora Hot Springs' }, { fx: 107 });
    for (const [x, y] of [[88, 18], [98, 21], [110, 8], [80, 20]]) placeNear('snowman', x, y, 1, 1, { text: '⛄ A happy snowman with a carrot nose! Hello, Mr. Snowman!' }, { radius: 3, safe: true });
    waypoints[7] = placeNear('waypoint', 97, 17, 1, 1, { region: 7 }, { front: true, ring: true, radius: 6 });
    berryTree(80, 15, 'frost'); berryTree(100, 22, 'frost');

    /* ===== 8. Starlight Lavender Sanctuary & Moon Castle ===== */
    landmark('castle', 52, 4, 14, 6, { name: 'Starlight Moon Castle', big: true, text: '🏰 The Starlight Moon Castle! Its towers glow softly under the stars.' }, { fx: 58 });
    for (let y = 10; y <= 20; y++) for (let x = 51; x <= 66; x++) { const i = I(x, y); ground[i] = T.FLOOR; clear[i] = 1; }
    ensureWalk(59, 10, true);
    landmark('altar', 53, 16, 2, 1, { style: 'sun', name: 'Sun Altar', text: '☀️ The Sun Altar glows warm and golden.' }, { ground: T.FLOOR, front: false });
    landmark('altar', 64, 16, 2, 1, { style: 'moon', name: 'Moon Altar', text: '🌙 The Moon Altar shimmers with silver starlight.' }, { ground: T.FLOOR, front: false });
    fountains[8] = landmark('fountain', 59, 16, 2, 2, { style: 8, name: 'Starlight Fountain' }, { ground: T.FLOOR });
    waypoints[8] = placeNear('waypoint', 63, 22, 1, 1, { region: 8 }, { front: true, ring: true, radius: 6 });
    for (let y = 22; y <= 31; y += 3) {
      let lx = -1, rx = -1;
      for (let x = 50; x <= 70; x++) if (road[I(x, y)]) { if (lx < 0) lx = x; rx = x; }
      if (lx > 0) { placeNear('lantern', lx - 1, y, 1, 1, {}, { radius: 0, ignoreClear: true, anyWalk: true }); placeNear('lantern', rx + 1, y, 1, 1, {}, { radius: 0, ignoreClear: true, anyWalk: true }); }
    }
    for (let x = 45; x <= 73; x++) { const i = I(x, 32); if (!road[i] && objAt[i] < 0 && SOLID[ground[i]] && Math.abs(x - 59.5) > 2) addObj('hedge', x, 32, 1, 1); }
    berryTree(48, 24, 'moon'); berryTree(70, 24, 'moon');

    /* ===== NPCs, special spots, signs (Honmoon Island & Southern Continent ones are added in their own builders) ===== */
    D.NPCS.forEach((def, k) => { if (def.zone < HZ) placeNPC(def, k); });
    D.SPECIAL_SPOTS.forEach(s => { if (s.zone < HZ) addSpecial(s); });
    const SIGNS = [
      [57, 63, "🏡 Sunshine Village — Chuyu's hometown!  ⬆ Crossroads Park · ⬅ Apple Orchard · ➡ Coral Lagoon"],
      [62, 47, '🌳 Rainbow Crossroads —  ⬆ Moon Castle · ⬅ Crystal Meadow · ➡ Windmill Ridge · ⬇ Sunshine Village'],
      [46, 72, '🍎 Whispering Apple Orchard & Emerald Woods'],
      [74, 72, '🌊 Sapphire Coral Lagoon & Beach Boardwalk'],
      [29, 47, '🌈 Rainbow Crystal Meadow — the Unicorn Shrine is to the west!'],
      [97, 47, '⚡ Thunder Windmill Ridge — the Bamboo Grove trail starts here ➡'],
      [27, 29, '🏜️ ⬆ Golden Sunbaked Canyon & Oasis Ruins'],
      [96, 29, '❄️ ⬆ Frostberry Glacier & Aurora Hot Springs'],
      [62, 30, '🏰 ⬆ Starlight Lavender Sanctuary & Moon Castle'],
    ];
    for (const [x, y, text] of SIGNS) placeNear('sign', x, y, 1, 1, { text }, { radius: 4, ignoreClear: true, anyWalk: true, safe: true });
  }

  function scatter() {
    // Rainbow Island only (rows < H0): Honmoon Island is scattered later with its own RNG stream.
    for (let y = 1; y < Math.min(H, H0 + 1) - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = I(x, y);
        if (road[i] || clear[i] || front[i] || objAt[i] >= 0 || npcAt[i] >= 0 || !SOLID[ground[i]]) continue;
        if (zone[i] === HZ) continue;
        const z = zone[i], g = ground[i], r = rng();
        let kind = null, variant = null;
        if (z === 1) { if (r < 0.03) { kind = 'tree'; variant = 'oak'; } }
        else if (z === 2) {
          const woods = x < 25;
          if (woods) { if (r < 0.42) { kind = 'tree'; variant = 'woods'; } else if (r < 0.46) kind = 'bush'; else if (r < 0.47) kind = 'stump'; }
          else if (r < 0.07) { kind = 'tree'; variant = 'oak'; } else if (r < 0.09) kind = 'bush'; else if (r < 0.1) kind = 'rock';
        } else if (z === 3) {
          if (r < 0.045) { kind = 'tree'; variant = g === T.SAND ? 'palm' : 'oak'; } else if (r < 0.053) kind = 'rock';
        } else if (z === 4) {
          if (r < 0.03) { kind = 'tree'; variant = 'crystal'; } else if (r < 0.045) { kind = 'tree'; variant = 'oak'; } else if (r < 0.06) kind = 'bush';
        } else if (z === 5) {
          const grove = x >= 98 && y >= 40;
          if (grove) { if (r < 0.5) { kind = 'tree'; variant = 'bamboo'; } }
          else if (r < 0.05) { kind = 'tree'; variant = 'oak'; } else if (r < 0.07) kind = 'rock'; else if (r < 0.09) kind = 'bush';
        } else if (z === 6) {
          if (r < 0.045) kind = 'cactus'; else if (r < 0.075) kind = 'rock';
        } else if (z === 7) {
          if (r < 0.11) { kind = 'tree'; variant = 'pine'; } else if (r < 0.13) kind = 'rock';
        } else if (z === 8) {
          if (r < 0.035) { kind = 'tree'; variant = 'moon'; } else if (r < 0.05) kind = 'bush';
        } else if (z === 9) {
          if (r < 0.07) { kind = 'tree'; variant = 'oak'; } else if (r < 0.09) kind = 'bush';
        }
        if (!kind) continue;
        if (!safeToBlock(x, y)) continue;
        addObj(kind, x, y, 1, 1, { variant: variant || (rng() * 3) | 0 });
      }
    }
  }

  function bfs(sx, sy) {
    reach.fill(0);
    const q = new Int32Array(N);
    let h = 0, t = 0;
    const s = I(sx, sy);
    reach[s] = 1; q[t++] = s;
    while (h < t) {
      const c = q[h++];
      const cx = c % W, cy = (c / W) | 0;
      for (let d = 0; d < 4; d++) {
        const nx = cx + DIRS4[d][0], ny = cy + DIRS4[d][1];
        if (!inb(nx, ny)) continue;
        const ni = I(nx, ny);
        if (reach[ni] || !isOpen(nx, ny)) continue;
        reach[ni] = 1; q[t++] = ni;
      }
    }
  }

  function chooseLoot() {
    const kind = U.weighted(rng, D.CHEST_LOOT);
    if (kind === 'gold') return { gold: 20 + 5 * U.randInt(rng, 0, 14) };
    if (kind === 'berry') return { berry: U.randInt(rng, 3, 6) };
    if (kind === 'rainbow') return { rainbow: U.randInt(rng, 1, 3) };
    return { master: 1 };
  }
  function placeChests() {
    const fixed = [[14, 77, 'Secret Glade'], [101, 75, 'Lagoon Island'], [51, 53, 'Crossroads Lake Island'], [16, 7, 'Great Pyramid']];
    for (const [x, y, where] of fixed) {
      const i = I(x, y);
      if (objAt[i] >= 0) removeObj(objects[objAt[i]]);
      road[i] = 0;
      if (!WALK[ground[i]] || ground[i] === T.SHALLOW) ground[i] = solidBase(zone[i]);
      const o = addObj('chest', x, y, 1, 1, { loot: { master: 1, gold: 50 }, where, special: true });
      chests.push(o);
      clearRect(x - 1, y - 1, 3, 3);
    }
    bfs(start.x, start.y);
    const COUNTS = { 1: 2, 2: 6, 3: 4, 4: 5, 5: 5, 6: 7, 7: 5, 8: 4, 9: 2 };
    const cands = {};
    for (let y = 2; y < Math.min(H, H0) - 2; y++) for (let x = 2; x < W - 2; x++) {
      const i = I(x, y);
      if (!reach[i] || road[i] || front[i] || clear[i] || objAt[i] >= 0 || npcAt[i] >= 0 || !SOLID[ground[i]]) continue;
      let blocked = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && !isOpen(x + dx, y + dy)) blocked++;
      if (blocked < 2) continue;
      (cands[zone[i]] = cands[zone[i]] || []).push([x, y, blocked]);
    }
    for (let z = 1; z <= 9; z++) {
      const list = (cands[z] || []).slice();
      for (let k = list.length - 1; k > 0; k--) { const j = Math.floor(rng() * (k + 1)); const tmp = list[k]; list[k] = list[j]; list[j] = tmp; }
      list.sort((a, b) => b[2] - a[2] + (rng() - 0.5) * 3);
      let placed = 0;
      for (const [x, y] of list) {
        if (placed >= COUNTS[z]) break;
        if (chests.some(c => Math.abs(c.x - x) + Math.abs(c.y - y) < 7)) continue;
        if (objAt[I(x, y)] >= 0 || !safeToBlock(x, y)) continue;
        const o = addObj('chest', x, y, 1, 1, { loot: chooseLoot() });
        chests.push(o); placed++;
      }
    }
  }

  function decals() {
    // Rainbow Island only (rows < H0); Honmoon Island decals are placed by buildHonmoon().
    for (let y = 0; y < Math.min(H, H0); y++) for (let x = 0; x < W; x++) {
      const i = I(x, y);
      if (objAt[i] >= 0 && objects[objAt[i]].block) continue;
      if (zone[i] === HZ) continue;
      const z = zone[i], g = ground[i], r = rng();
      let d = 0;
      if (g === T.SAND && z === 3) d = r < 0.035 ? DEC.SHELL : r < 0.06 ? DEC.STARFISH : 0;
      else if (g === T.SAND && z === 6) d = r < 0.03 ? DEC.CRACK : r < 0.06 ? DEC.PEBBLE : 0;
      else if (g === T.SHALLOW && z === 4) d = r < 0.25 ? DEC.LILY : 0;
      else if (g === T.SNOW) d = r < 0.06 ? DEC.SPARKLE : 0;
      else if (g === T.PATH) d = r < 0.05 ? DEC.PEBBLE : 0;
      else if (g === T.GRASS) {
        if (z === 2 && x < 25 && r < 0.06) d = DEC.MUSH;
        else if (z === 4) d = r < 0.05 ? DEC.SHARD : r < 0.17 ? [DEC.FLOWER_P, DEC.FLOWER_B, DEC.FLOWER_Y, DEC.FLOWER_W][(r * 100) & 3] : 0;
        else if (z === 8) d = r < 0.06 ? DEC.SPARKLE : r < 0.1 ? DEC.FLOWER_B : 0;
        else d = r < 0.04 ? [DEC.FLOWER_P, DEC.FLOWER_Y, DEC.FLOWER_W][(r * 1000) % 3 | 0] : r < 0.07 ? DEC.TUFT : r < 0.08 ? DEC.CLOVER : 0;
      }
      decal[i] = d;
    }
    // fairy mushroom ring in the secret glade
    for (let k = 0; k < 10; k++) {
      const a = k * Math.PI / 5;
      const x = Math.round(15 + Math.cos(a) * 2.6), y = Math.round(78 + Math.sin(a) * 1.9);
      if (inb(x, y) && objAt[I(x, y)] < 0) decal[I(x, y)] = DEC.MUSH;
    }
  }

  /* ---------------- 10. Honmoon Island (KPop Demon Hunters) ----------------
   * Built AFTER the original island is finished, with its own RNG stream, so every chest,
   * tree and decal on Rainbow Island stays exactly where it was (old saves keep working). */
  function buildHonmoon() {
    const r2 = U.mulberry32(20261023);
    const inHon = (x, y) => inb(x, y) && zone[I(x, y)] === HZ;
    // Honmoon Plaza (the bridge lands here) and the concert floor in front of the Golden Stage
    for (let y = 97; y <= 104; y++) for (let x = 53; x <= 66; x++) { const i = I(x, y); ground[i] = T.PLAZA; clear[i] = 1; }
    for (let y = 99; y <= 104; y++) for (let x = 71; x <= 85; x++) { const i = I(x, y); ground[i] = T.FLOOR; clear[i] = 1; }
    // Golden Honmoon Bridge: straight south from Sunshine Village's south gate (fence gap at x 59-60, y 81)
    for (let y = 81; y <= 98; y++) for (let x = 59; x <= 60; x++) {
      const i = I(x, y);
      if (objAt[i] >= 0 && objects[objAt[i]].rm) removeObj(objects[objAt[i]]);
    }
    roadSeg(59, 81, 59, 97, 0);
    // Main street across the island + two little trails
    roadSeg(25, 105, 95, 105, 0);
    trail([[34, 105], [34, 101]]);   // up Namsan hill to N Seoul Tower
    trail([[90, 105], [90, 102]]);   // to the Demon Gate
    // Landmarks
    landmark('stage', 73, 96, 10, 3, { name: 'Golden Honmoon Stage', text: '🎤 The Golden Honmoon Stage! When HUNTR/X sing here, a golden shield called the Honmoon glows over the whole island and keeps everyone safe. ✨' }, { ground: T.FLOOR, fx: 78 });
    landmark('seoultower', 33, 98, 2, 2, { name: 'N Seoul Tower', text: '🗼 N Seoul Tower! From the very top you can see all of Honmoon Island — and Rainbow Island far to the north!' }, { fx: 34 });
    fountains[HZ] = landmark('ramen', 67, 101, 4, 3, { name: 'Ramen Shop' }, { fx: 68 });
    landmark('hanok', 47, 101, 4, 3, { name: "Celine's Hanok", text: "🏯 Celine's Hanok. This is where Celine trained Rumi, Mira and Zoey to be demon hunters. It smells like warm barley tea. 🍵" }, { fx: 48 });
    landmark('demongate', 88, 98, 4, 3, { name: 'Demon Gate', text: '👹 The Demon Gate! Purple flames flicker inside... Gwi-Ma the demon king is waiting nearby. Bring a 🍓 berry and your bravest friends!' }, { fx: 90 });
    waypoints[HZ] = landmark('waypoint', 56, 98, 1, 1, { region: HZ }, { ground: T.PLAZA });
    // Plaza centerpiece + corner decorations
    landmark('fountain', 59, 100, 2, 2, { style: HZ, name: 'Golden Honmoon Fountain' }, { ground: T.PLAZA });
    for (const [x, y] of [[53, 97], [66, 97]]) placeNear('lantern', x, y, 1, 1, {}, { radius: 1, ignoreClear: true, anyWalk: true, safe: true });
    for (const [x, y] of [[53, 100], [66, 100], [53, 103], [64, 98]]) placeNear('flowerbed', x, y, 1, 1, {}, { radius: 1, ignoreClear: true, anyWalk: true, safe: true });
    // Lanterns along the main street and around the concert floor
    for (const [x, y] of [[29, 104], [41, 104], [52, 107], [67, 107], [70, 99], [86, 99], [86, 107], [94, 104]]) placeNear('lantern', x, y, 1, 1, {}, { radius: 1, ignoreClear: true, anyWalk: true, safe: true });
    // Cherry blossoms framing the hill, the plaza and the stage
    for (const [x, y] of [[30, 99], [37, 97], [39, 102], [44, 99], [52, 99], [67, 97], [87, 96], [70, 108], [46, 108], [58, 109]]) placeNear('tree', x, y, 1, 1, { variant: 'blossom' }, { radius: 1, safe: true });
    berryTree(43, 107, 'plum'); berryTree(79, 108, 'plum');
    // Heroes, friends and the two special Critter spots
    D.NPCS.forEach((def, k) => { if (def.zone === HZ) placeNPC(def, k); });
    D.SPECIAL_SPOTS.forEach(s => { if (s.zone === HZ) addSpecial(s); });
    for (const [x, y, text] of [
      [62, 97, '🎤 Welcome to Honmoon Island! ⬅ N Seoul Tower · ➡ Golden Honmoon Stage & Demon Gate · ⬆ Golden Bridge to Sunshine Village'],
      [87, 104, '👹 ⬆ Demon Gate — Gwi-Ma waits here! Be brave!'],
    ]) placeNear('sign', x, y, 1, 1, { text }, { radius: 3, ignoreClear: true, anyWalk: true, safe: true });
    // A sign inside Sunshine Village pointing to the new bridge
    placeNear('sign', 62, 80, 1, 1, { text: '⬇ Golden Honmoon Bridge → 🎤 Honmoon Island! Meet the K-Pop Demon Hunters!' }, { radius: 2, ignoreClear: true, anyWalk: true, safe: true });
    // Scatter blossom trees, bushes and rocks (separate RNG stream)
    for (let y = H0; y < H1 - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = I(x, y);
      if (zone[i] !== HZ || road[i] || clear[i] || front[i] || objAt[i] >= 0 || npcAt[i] >= 0 || !SOLID[ground[i]]) continue;
      const r = r2(), hill = x < 44;
      let kind = null, variant = null;
      if (r < (hill ? 0.1 : 0.045)) { kind = 'tree'; variant = 'blossom'; }
      else if (r < (hill ? 0.12 : 0.06)) kind = 'bush';
      else if (r < (hill ? 0.125 : 0.066)) kind = 'rock';
      if (!kind || !safeToBlock(x, y)) continue;
      addObj(kind, x, y, 1, 1, { variant: variant || (r2() * 3) | 0 });
    }
    // Treasure chests: one special chest on Namsan hill + 5 hidden ones
    {
      const [x, y] = [36, 96];
      const i = I(x, y);
      if (objAt[i] >= 0) removeObj(objects[objAt[i]]);
      road[i] = 0;
      if (!WALK[ground[i]] || ground[i] === T.SHALLOW) ground[i] = T.GRASS;
      chests.push(addObj('chest', x, y, 1, 1, { loot: { master: 1, gold: 60 }, where: 'Namsan Hill', special: true }));
      clearRect(x - 1, y - 1, 3, 3); ensureWalk(x, y + 1, true);
    }
    bfs(start.x, start.y);
    const list = [];
    for (let y = H0; y < H1 - 2; y++) for (let x = 2; x < W - 2; x++) {
      const i = I(x, y);
      if (zone[i] !== HZ || !reach[i] || road[i] || front[i] || clear[i] || objAt[i] >= 0 || npcAt[i] >= 0 || !SOLID[ground[i]]) continue;
      let blocked = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && !isOpen(x + dx, y + dy)) blocked++;
      if (blocked >= 2) list.push([x, y, blocked]);
    }
    for (let k = list.length - 1; k > 0; k--) { const j = Math.floor(r2() * (k + 1)); const tmp = list[k]; list[k] = list[j]; list[j] = tmp; }
    list.sort((a, b) => b[2] - a[2] + (r2() - 0.5) * 3);
    let placed = 0;
    for (const [x, y] of list) {
      if (placed >= 5) break;
      if (chests.some(c => Math.abs(c.x - x) + Math.abs(c.y - y) < 7)) continue;
      if (objAt[I(x, y)] >= 0 || !safeToBlock(x, y)) continue;
      const kind = U.weighted(r2, D.CHEST_LOOT);
      const loot = kind === 'gold' ? { gold: 30 + 5 * U.randInt(r2, 0, 14) } : kind === 'berry' ? { berry: U.randInt(r2, 3, 6) } : kind === 'rainbow' ? { rainbow: U.randInt(r2, 1, 3) } : { master: 1 };
      chests.push(addObj('chest', x, y, 1, 1, { loot }));
      placed++;
    }
    // Decals: blossom petals, golden music notes, flowers and sparkles
    for (let y = H0; y < H1; y++) for (let x = 0; x < W; x++) {
      const i = I(x, y);
      if (!inHon(x, y) || (objAt[i] >= 0 && objects[objAt[i]].block)) continue;
      const g = ground[i], r = r2();
      let d = 0;
      if (g === T.GRASS) d = r < 0.03 ? DEC.FLOWER_P : r < 0.07 ? DEC.PETAL : r < 0.085 ? DEC.NOTE : r < 0.1 ? DEC.FLOWER_W : r < 0.11 ? DEC.SPARKLE : 0;
      else if (g === T.PATH) d = r < 0.08 ? DEC.PETAL : 0;
      else if (g === T.PLAZA) d = r < 0.06 ? DEC.PETAL : r < 0.1 ? DEC.NOTE : 0;
      else if (g === T.FLOOR) d = r < 0.05 ? DEC.NOTE : 0;
      else if (g === T.SAND) d = r < 0.03 ? DEC.SHELL : r < 0.05 ? DEC.STARFISH : 0;
      decal[i] = d;
    }
  }

  /* ---------------- Zones 11..13: Southern Continent Expansion ----------------
   * Built AFTER Honmoon Island with its own RNG stream (r3 = U.mulberry32(20261024)),
   * so all 50 existing chests on Rainbow Island & Honmoon Island remain untouched! */
  function buildSouthContinent() {
    const r3 = U.mulberry32(20261024);

    // 1. River separating Zone 12 (Nightmare Carnival) and Zone 13 (Kanto Classics Bay)
    for (let y = H1; y < H2; y++) {
      const xc = 76 + Math.round(Math.sin(y * 0.22) * 0.8);
      for (let k = 0; k < 2; k++) if (isLand(xc + k, y) || ground[I(xc + k, y)] === T.SHALLOW) setT(xc + k, y, T.DEEP);
    }

    // 2. Plazas & courtyards for the 3 Southern Lands
    // Zone 11: Minhwa Pavilion Courtyard & Clinic Plaza
    for (let y = 129; y <= 135; y++) for (let x = 19; x <= 27; x++) { const i = I(x, y); ground[i] = T.PLAZA; clear[i] = 1; }
    for (let y = 146; y <= 151; y++) for (let x = 16; x <= 32; x++) { const i = I(x, y); ground[i] = T.PLAZA; clear[i] = 1; }
    // Zone 12: Nightmare Carnival Midway Floor
    for (let y = 131; y <= 141; y++) for (let x = 52; x <= 67; x++) { const i = I(x, y); ground[i] = T.FLOOR; clear[i] = 1; }
    // Allister Gator's Swamp Pond (shallow duckie-float pond in Zone 12)
    ellipse(52, 155, 4.5, 2.8, (x, y) => setT(x, y, T.SHALLOW));
    // Zone 13: Pallet Town Square & Cerulean Mew Shrine Lagoon
    for (let y = 132; y <= 140; y++) for (let x = 82; x <= 95; x++) { const i = I(x, y); ground[i] = T.PLAZA; clear[i] = 1; }
    for (let y = 128; y <= 133; y++) for (let x = 102; x <= 109; x++) { const i = I(x, y); ground[i] = T.SAND; clear[i] = 1; }
    ellipse(104, 158, 7.2, 4.6, (x, y, d) => setT(x, y, d < 0.42 ? T.FLOWERS : d < 0.72 ? T.DEEP : T.SHALLOW));

    // 3. Three Bridges from Honmoon Island (y = 105..125) + Grand Southern Highway (y = 144)
    for (const bx of [34, 59, 90]) {
      for (let y = 105; y <= 126; y++) for (let x = bx; x <= bx + 1; x++) {
        const i = I(x, y);
        if (objAt[i] >= 0 && objects[objAt[i]].rm) removeObj(objects[objAt[i]]);
      }
      roadSeg(bx, 105, bx, 144, 0);
    }
    // East-West Grand Southern Highway connecting Zone 11 <-> Zone 12 <-> Snorlax Footbridge <-> Zone 13
    roadSeg(15, 144, 105, 144, 0);
    // Local trails in Zones 11, 12, 13
    trail([[34, 132], [23, 132]]);   // to Derpy's Tiger Pavilion
    trail([[24, 144], [24, 157], [34, 157]]); // to Bathhouse, Clinic & Soda Pop Truck
    trail([[60, 144], [60, 159]]);   // down to Carnival Pier
    trail([[91, 135], [105, 131]]);  // up to Ember Volcano Peak
    trail([[96, 144], [96, 158]]);   // down to Cerulean Bay
    // Coral stepping stones across Cerulean Lagoon to Mew Shrine Island
    for (let x = 96; x <= 104; x++) if (ground[I(x, 158)] === T.DEEP || ground[I(x, 158)] === T.SHALLOW) { setT(x, 158, T.STONES); clear[I(x, 158)] = 1; }
    for (let y = 152; y <= 160; y++) for (let x = 102; x <= 106; x++) if (ground[I(x, y)] === T.FLOWERS || ground[I(x, y)] === T.GRASS) clear[I(x, y)] = 1;

    // 4. Zone 11 Landmarks (Derpy's Minhwa Sanctum & Bathhouse Valley)
    landmark('tigerpavilion', 21, 126, 4, 3, { name: "Derpy's Tiger Pavilion", text: "🐯 Derpy's Minhwa Tiger Pavilion! Painted pine screens of the goofy blue tiger and the gat-hat magpie glow with warm spirit magic." }, { ground: T.PLAZA, fx: 22 });
    fountains[11] = landmark('bathhouse', 17, 145, 4, 3, { name: 'Jjimjilbang Bathhouse' }, { ground: T.PLAZA, fx: 19 });
    landmark('hanclinic', 27, 145, 4, 3, { name: "Healer Han's Tonic Clinic", text: "🍵 Healer Han's Tonic Clinic! Shelves of sweet jujube & berry tonics keep HUNTR/X's voices golden — and Derpy Tiger loves napping on the rug!" }, { ground: T.PLAZA, fx: 28 });
    landmark('sodapoptruck', 32, 155, 4, 2, { name: 'Soda Pop Idol Truck', text: '🥤 The Saja Boys\' pastel Soda Pop Truck! Fizzy berry sodas and neon banners sparkle in the sunshine. 🎶' }, { fx: 33 });
    waypoints[11] = landmark('waypoint', 31, 141, 1, 1, { region: 11 }, { front: true, ring: true });
    // Interactive Knocked-Over Flowerpots (Derpy Tiger's signature flowerpot gag!)
    for (const [x, y] of [[25, 133], [15, 141], [31, 138], [20, 154], [37, 152]]) {
      placeNear('flowerpot', x, y, 1, 1, { upright: false }, { radius: 2, ignoreClear: true, anyWalk: true, safe: true, front: true });
    }
    berryTree(14, 134, 'plum'); berryTree(38, 156, 'plum');

    // 5. Zone 12 Landmarks (Nightmare Critters Carnival & Twilight Hollow)
    landmark('carnivaltent', 53, 126, 5, 4, { name: 'Nightmare Critters Carnival Tent', text: '🎪 The Nightmare Critters Big-Top Tent! Inside, Baba Chops, Icky Licky, Rabie Baby, Allister Gator, Poe, Touille and Maggie Mako play music and share cotton candy!' }, { ground: T.FLOOR, fx: 55 });
    landmark('cauldron', 62, 128, 3, 2, { name: 'Dragon Smoke Cauldron', text: '🐉 The Dragon Smoke Cauldron! Sparkly violet smoke rings float into the sky where Simon Smoke practices his loop-de-loops!' }, { ground: T.FLOOR, fx: 63 });
    fountains[12] = landmark('fountain', 59, 135, 2, 2, { style: 12, name: 'Sweet-Tooth Carnival Fountain' }, { ground: T.FLOOR });
    waypoints[12] = landmark('waypoint', 64, 135, 1, 1, { region: 12 }, { ground: T.FLOOR });
    for (const [x, y] of [[50, 139], [70, 139], [60, 152]]) {
      ensureWalk(x, y, true);
      if (objAt[I(x, y)] < 0) addObj('trampoline', x, y, 1, 1);
    }
    for (const [x, y] of [[52, 131], [67, 131], [52, 141], [67, 141], [58, 149], [62, 149]]) {
      placeNear('lantern', x, y, 1, 1, {}, { radius: 1, ignoreClear: true, anyWalk: true, safe: true });
    }
    berryTree(48, 132, 'moon'); berryTree(71, 154, 'moon');

    // 6. Zone 13 Landmarks (Kanto Classics Bay & Pallet Meadow — Gen 1 Pokémon)
    landmark('oaklab', 88, 128, 5, 3, { name: "Professor Oak's Pallet Lab", text: "🔬 Professor Oak's Pokémon Research Lab! PokéBalls, Kanto maps, and starter notes on Bulbasaur, Charmander, Squirtle & Pikachu fill the tables." }, { ground: T.PLAZA, fx: 90 });
    fountains[13] = landmark('pokecenter', 82, 134, 4, 3, { name: 'Pokémon Center' }, { ground: T.PLAZA, fx: 84 });
    landmark('volcano', 104, 125, 4, 3, { name: 'Ember Volcano Peak', text: '🔥 Ember Volcano Peak! Warm embers glow along the crater rim where Charizard spreads its mighty wings!' }, { ground: T.SAND, fx: 106 });
    landmark('mewshrine', 103, 154, 3, 2, { name: 'Cerulean Mew Shrine', text: '✨ The ancient Cerulean Mew Shrine! Pink psychic bubbles drift gently around the crystal monument.' }, { ground: T.FLOWERS, fx: 104 });
    waypoints[13] = landmark('waypoint', 94, 138, 1, 1, { region: 13 }, { ground: T.PLAZA });
    berryTree(83, 154, 'apple'); berryTree(109, 142, 'gold');

    // 7. NPCs, Special Critter Spots, and Signs for Zones 11..13
    D.NPCS.forEach((def, k) => { if (def.zone > HZ && def.zone <= 13) placeNPC(def, k); });
    D.SPECIAL_SPOTS.forEach(s => { if (s.zone > HZ && s.zone <= 13) addSpecial(s); });
    for (const [x, y, text] of [
      [34, 108, "⬇ Minhwa Tiger Bridge → 🐯 Derpy's Minhwa Sanctum & Bathhouse Valley"],
      [61, 108, '⬇ Twilight Carnival Bridge → 🎪 Nightmare Critters Carnival & Twilight Hollow'],
      [92, 108, '⬇ Vermilion Sea Bridge → ⚡ Kanto Classics Bay & Pallet Meadow (Gen 1 Pokémon!)'],
      [32, 143, "🐯 Derpy's Minhwa Sanctum — ⬆ Tiger Pavilion · ⬇ Jjimjilbang Bathhouse & Healer Han's Clinic · ➡ Nightmare Carnival"],
      [58, 143, '🎪 Nightmare Critters Carnival — ⬆ Big-Top Tent & Dragon Cauldron · ⬅ Minhwa Sanctum · ➡ Snorlax Footbridge to Kanto Bay'],
      [79, 143, '😴 Snorlax Footbridge — Watch out for a sleepy Snorlax napping by the bridge!'],
      [89, 143, "⚡ Kanto Classics Bay — ⬆ Pallet Lab & Pokémon Center · ↗ Ember Volcano Peak · ↘ Cerulean Mew Shrine"],
    ]) placeNear('sign', x, y, 1, 1, { text }, { radius: 3, ignoreClear: true, anyWalk: true, safe: true });

    // 8. Scatter trees, bushes & rocks across Zones 11..13
    for (let y = H1; y < H2 - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = I(x, y);
      const z = zone[i];
      if (z <= HZ || z > 13 || road[i] || clear[i] || front[i] || objAt[i] >= 0 || npcAt[i] >= 0 || !SOLID[ground[i]]) continue;
      const r = r3();
      let kind = null, variant = null;
      if (z === 11) {
        if (r < 0.045) { kind = 'tree'; variant = r < 0.025 ? 'pine' : 'blossom'; }
        else if (r < 0.06) kind = 'bush';
        else if (r < 0.068) kind = 'rock';
      } else if (z === 12) {
        if (r < 0.045) { kind = 'tree'; variant = r < 0.03 ? 'moon' : 'crystal'; }
        else if (r < 0.06) kind = 'bush';
        else if (r < 0.07) kind = 'rock';
      } else if (z === 13) {
        if (r < 0.045) { kind = 'tree'; variant = ground[i] === T.SAND ? 'palm' : 'oak'; }
        else if (r < 0.06) kind = 'bush';
        else if (r < 0.07) kind = 'rock';
      }
      if (!kind || !safeToBlock(x, y)) continue;
      addObj(kind, x, y, 1, 1, { variant: variant || (r3() * 3) | 0 });
    }

    // 9. Treasure chests: 1 special Master Star chest + 5 hidden chests per new zone (18 new chests total)
    for (const [x, y, where] of [
      [14, 128, 'Minhwa Pine Bluff'],
      [60, 160, 'Twilight Carnival Pier'],
      [108, 158, 'Cerulean Shrine Island'],
    ]) {
      const i = I(x, y);
      if (objAt[i] >= 0) removeObj(objects[objAt[i]]);
      road[i] = 0;
      if (!WALK[ground[i]] || ground[i] === T.SHALLOW) ground[i] = T.GRASS;
      chests.push(addObj('chest', x, y, 1, 1, { loot: { master: 1, gold: 80 }, where, special: true }));
      clearRect(x - 1, y - 1, 3, 3); ensureWalk(x, y + 1, true);
    }
    bfs(start.x, start.y);
    for (const z of [11, 12, 13]) {
      const list = [];
      for (let y = H1 + 1; y < H2 - 2; y++) for (let x = 2; x < W - 2; x++) {
        const i = I(x, y);
        if (zone[i] !== z || !reach[i] || road[i] || front[i] || clear[i] || objAt[i] >= 0 || npcAt[i] >= 0 || !SOLID[ground[i]]) continue;
        let blocked = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && !isOpen(x + dx, y + dy)) blocked++;
        if (blocked >= 2) list.push([x, y, blocked]);
      }
      for (let k = list.length - 1; k > 0; k--) { const j = Math.floor(r3() * (k + 1)); const tmp = list[k]; list[k] = list[j]; list[j] = tmp; }
      list.sort((a, b) => b[2] - a[2] + (r3() - 0.5) * 3);
      let placed = 0;
      for (const [x, y] of list) {
        if (placed >= 5) break;
        if (chests.some(c => Math.abs(c.x - x) + Math.abs(c.y - y) < 7)) continue;
        if (objAt[I(x, y)] >= 0 || !safeToBlock(x, y)) continue;
        const kind = U.weighted(r3, D.CHEST_LOOT);
        const loot = kind === 'gold' ? { gold: 35 + 5 * U.randInt(r3, 0, 14) } : kind === 'berry' ? { berry: U.randInt(r3, 3, 6) } : kind === 'rainbow' ? { rainbow: U.randInt(r3, 1, 3) } : { master: 1 };
        chests.push(addObj('chest', x, y, 1, 1, { loot }));
        placed++;
      }
    }

    // 10. Decals across Zones 11..13
    for (let y = H1; y < H2; y++) for (let x = 0; x < W; x++) {
      const i = I(x, y);
      if (zone[i] <= HZ || zone[i] > 13 || (objAt[i] >= 0 && objects[objAt[i]].block)) continue;
      const z = zone[i], g = ground[i], r = r3();
      let d = 0;
      if (z === 11) {
        if (g === T.GRASS) d = r < 0.04 ? DEC.PETAL : r < 0.07 ? DEC.FLOWER_B : r < 0.09 ? DEC.SPARKLE : 0;
        else if (g === T.PLAZA || g === T.PATH) d = r < 0.06 ? DEC.PETAL : 0;
      } else if (z === 12) {
        if (g === T.GRASS) d = r < 0.04 ? DEC.SHARD : r < 0.07 ? DEC.FLOWER_P : r < 0.09 ? DEC.MUSH : 0;
        else if (g === T.FLOOR) d = r < 0.06 ? DEC.SPARKLE : r < 0.09 ? DEC.NOTE : 0;
        else if (g === T.SHALLOW) d = r < 0.2 ? DEC.LILY : 0;
      } else if (z === 13) {
        if (g === T.GRASS) d = r < 0.04 ? DEC.FLOWER_Y : r < 0.07 ? DEC.FLOWER_W : r < 0.09 ? DEC.CLOVER : 0;
        else if (g === T.SAND) d = r < 0.04 ? DEC.SHELL : r < 0.06 ? DEC.STARFISH : 0;
      }
      decal[i] = d;
    }
  }

  /* ---------------- Zones 14..16: Grand Pokémon Continent (Gen 2 Johto, Gen 3 Hoenn, Gen 4 Sinnoh) ----------------
   * Built AFTER buildSouthContinent() with its own RNG stream (r4 = U.mulberry32(20261025)),
   * so all 68 existing chests in Zones 1..13 remain 100% untouched! */
  function buildGen234Continent() {
    const r4 = U.mulberry32(20261025);

    // 1. Two scenic channels separating Zone 14 (Johto) | Zone 15 (Hoenn) | Zone 16 (Sinnoh)
    for (let y = H2; y < H; y++) {
      for (const base of [44, 76]) {
        const xc = base + Math.round(Math.sin(y * 0.21) * 0.8);
        for (let k = 0; k < 2; k++) if (isLand(xc + k, y) || ground[I(xc + k, y)] === T.SHALLOW) setT(xc + k, y, T.DEEP);
      }
    }

    // 2. Plazas, Lakes & Sacred Courtyards for Johto (14), Hoenn (15), and Sinnoh (16)
    // Zone 14 (Johto): Whirl Island Lugia Roost, Ecruteak Bell-Tower Courtyard, Pokémon Center & Kurt's Apricorn Plaza
    for (let y = 181; y <= 188; y++) for (let x = 19; x <= 26; x++) { const i = I(x, y); ground[i] = T.PLAZA; clear[i] = 1; }
    for (let y = 183; y <= 193; y++) for (let x = 26; x <= 34; x++) { const i = I(x, y); ground[i] = T.PLAZA; clear[i] = 1; }
    for (let y = 193; y <= 199; y++) for (let x = 15; x <= 22; x++) { const i = I(x, y); ground[i] = T.PLAZA; clear[i] = 1; }
    for (let y = 201; y <= 208; y++) for (let x = 29; x <= 36; x++) { const i = I(x, y); ground[i] = T.PLAZA; clear[i] = 1; }
    // Ecruteak Crystal Spring (shallow duckie-float spring where Suicune waits)
    ellipse(18, 210, 4.5, 2.8, (x, y) => { setT(x, y, T.SHALLOW); clear[I(x, y)] = 1; });

    // Zone 15 (Hoenn): Sky Pillar Summit Plaza, Hoenn Pokémon Center & Secret Base Plaza, Sootopolis Lagoon & Meteor Crater
    for (let y = 179; y <= 187; y++) for (let x = 56; x <= 64; x++) { const i = I(x, y); ground[i] = T.PLAZA; clear[i] = 1; }
    for (let y = 188; y <= 196; y++) for (let x = 50; x <= 57; x++) { const i = I(x, y); ground[i] = T.PLAZA; clear[i] = 1; }
    for (let y = 188; y <= 196; y++) for (let x = 65; x <= 71; x++) { const i = I(x, y); ground[i] = T.PLAZA; clear[i] = 1; }
    for (let y = 209; y <= 214; y++) for (let x = 50; x <= 56; x++) { const i = I(x, y); ground[i] = T.SAND; clear[i] = 1; }
    ellipse(64, 208, 4.8, 3.0, (x, y) => { setT(x, y, T.SHALLOW); clear[I(x, y)] = 1; });

    // Zone 16 (Sinnoh): Spear Pillar Marble Hall, Sandgem Lab & Pokémon Center Square, Aura Dojo & Champion Cliff
    for (let y = 179; y <= 190; y++) for (let x = 99; x <= 108; x++) { const i = I(x, y); ground[i] = T.FLOOR; clear[i] = 1; }
    for (let y = 187; y <= 197; y++) for (let x = 80; x <= 95; x++) { const i = I(x, y); ground[i] = T.PLAZA; clear[i] = 1; }
    for (let y = 209; y <= 214; y++) for (let x = 83; x <= 89; x++) { const i = I(x, y); ground[i] = T.PLAZA; clear[i] = 1; }
    for (let y = 209; y <= 214; y++) for (let x = 103; x <= 109; x++) { const i = I(x, y); ground[i] = T.PLAZA; clear[i] = 1; }

    // 3. Three Sea Bridges south from Zones 11, 12, 13 (y = 144..200) + Grand Champion Highway (y = 200)
    for (const bx of [24, 64, 90]) {
      for (let y = 144; y <= 184; y++) for (let x = bx; x <= bx + 1; x++) {
        const i = I(x, y);
        if (objAt[i] >= 0 && objects[objAt[i]].rm) removeObj(objects[objAt[i]]);
      }
      roadSeg(bx, 144, bx, 200, 0);
    }
    // East-West Grand Champion Highway connecting Zone 14 (Johto) <-> Zone 15 (Hoenn) <-> Zone 16 (Sinnoh)
    roadSeg(15, 200, 105, 200, 0);
    // Local trails in Zones 14, 15, 16
    trail([[24, 186], [30, 186]]);    // Lugia Roost <-> Bell Tower
    trail([[18, 200], [18, 210]]);    // Highway -> Ecruteak Crystal Spring (Suicune)
    trail([[32, 200], [32, 207]]);    // Highway -> Kurt's Apricorn Workshop
    trail([[60, 200], [60, 185]]);    // Highway -> Sky Pillar Summit (Rayquaza)
    trail([[53, 200], [53, 212]]);    // Highway -> Steven's Meteor Crater (Metagross)
    trail([[103, 200], [103, 186]]);  // Highway -> Spear Pillar Temple (Arceus & Cynthia)
    trail([[86, 200], [86, 212]]);    // Highway -> Aura Training Dojo (Lucario)
    trail([[106, 200], [106, 212]]);  // Highway -> Cynthia's Champion Cliff (Garchomp)

    // 4. Zone 14 Landmarks (Johto Bell-Tower Groves & Ecruteak Lake — Gen 2 Pokémon)
    landmark('belltower', 28, 184, 4, 3, { name: 'Ecruteak Bell Tower', text: '🔔 The golden-roofed Ecruteak Bell Tower! Autumn maple leaves drift around the 3-tier pagoda where Ho-Oh and Lugia\'s legends began.' }, { ground: T.PLAZA, fx: 30 });
    landmark('lugiaroost', 21, 182, 3, 2, { name: 'Whirl Island Lugia Roost', text: '🌊 Whirl Island Roost! Silver ocean spray and glowing tidal runes shimmer where Lugia rests its wings.' }, { ground: T.PLAZA, fx: 22 });
    fountains[14] = landmark('pokecenter', 16, 194, 4, 3, { name: 'Johto Pokémon Center' }, { ground: T.PLAZA, fx: 18 });
    landmark('apricornshop', 30, 202, 4, 3, { name: "Kurt's Apricorn Workshop", text: "🌰 Kurt's Azalea Apricorn Workshop! Baskets of red, blue, yellow and rainbow Apricorns are polished into custom capsules!" }, { ground: T.PLAZA, fx: 32 });
    waypoints[14] = landmark('waypoint', 23, 198, 1, 1, { region: 14 }, { front: true, ring: true });
    berryTree(13, 188, 'gold'); berryTree(38, 212, 'plum');

    // 5. Zone 15 Landmarks (Hoenn Sky-Pillar Tropics & Sootopolis Lagoon — Gen 3 Pokémon)
    landmark('skypillar', 58, 180, 4, 3, { name: 'Sky Pillar Tower', text: '🐉 The ancient emerald spire of Sky Pillar! Above the tropical clouds, Legendary Rayquaza watches over Hoenn.' }, { ground: T.PLAZA, fx: 60 });
    fountains[15] = landmark('pokecenter', 51, 189, 4, 3, { name: 'Hoenn Pokémon Center' }, { ground: T.PLAZA, fx: 53 });
    landmark('secretbase', 66, 189, 4, 3, { name: 'Hoenn Secret Base Treehouse', text: '🌴 A cozy Hoenn Secret Base Treehouse! Inside are PokéDolls of Treecko, Torchic & Mudkip and a sparkly slide!' }, { ground: T.PLAZA, fx: 68 });
    waypoints[15] = landmark('waypoint', 61, 196, 1, 1, { region: 15 }, { front: true, ring: true });
    berryTree(48, 186, 'coconut'); berryTree(71, 212, 'apple');

    // 6. Zone 16 Landmarks (Sinnoh Spear-Pillar Peaks & Twinleaf Glade — Gen 4 Pokémon)
    landmark('spearpillar', 101, 180, 5, 3, { name: 'Spear Pillar Temple', text: '👑 Spear Pillar & the Hall of Origin! Marble flutes and a golden celestial arch shine beneath Mythical Arceus.' }, { ground: T.FLOOR, fx: 103 });
    fountains[16] = landmark('pokecenter', 81, 188, 4, 3, { name: 'Sinnoh Pokémon Center' }, { ground: T.PLAZA, fx: 83 });
    landmark('rowanlab', 87, 188, 5, 3, { name: "Professor Rowan's Sandgem Lab", text: "🔬 Professor Rowan's Evolution Research Lab! Studies on Turtwig, Chimchar, Piplup, Lucario and Sinnoh's ancient myths line the bookshelves." }, { ground: T.PLAZA, fx: 89 });
    waypoints[16] = landmark('waypoint', 94, 196, 1, 1, { region: 16 }, { ground: T.PLAZA });
    berryTree(82, 182, 'frost'); berryTree(110, 204, 'gold');

    // 7. NPCs, Special Critter Spots, and Signs for Zones 14..16
    D.NPCS.forEach((def, k) => { if (def.zone >= 14) placeNPC(def, k); });
    D.SPECIAL_SPOTS.forEach(s => { if (s.zone >= 14) addSpecial(s); });
    for (const [x, y, text] of [
      [23, 160, '⬇ Goldenrod Magnet Bridge → 🔔 Johto Bell-Tower Groves & Ecruteak Lake (Gen 2 Pokémon!)'],
      [63, 160, '⬇ Slateport Ocean Bridge → 🌴 Hoenn Sky-Pillar Tropics & Sootopolis Lagoon (Gen 3 Pokémon!)'],
      [89, 160, '⬇ Cycling Road Sea Bridge → 👑 Sinnoh Spear-Pillar Peaks & Twinleaf Glade (Gen 4 Pokémon!)'],
      [26, 199, "🔔 Johto Region (Gen 2) — ⬆ Bell Tower & Lugia Roost · ↙ Suicune's Crystal Spring · ↘ Kurt's Apricorn Workshop"],
      [58, 199, "🌴 Hoenn Region (Gen 3) — ⬆ Sky Pillar (Rayquaza) & Pokémon Center · ↙ Steven's Meteor Crater (Metagross) · ↘ Sootopolis Lagoon"],
      [92, 199, "👑 Sinnoh Region (Gen 4) — ⬆ Sandgem Lab & Spear Pillar (Arceus) · ↙ Aura Dojo (Lucario) · ↘ Champion Cliff (Garchomp)"],
    ]) placeNear('sign', x, y, 1, 1, { text }, { radius: 3, ignoreClear: true, anyWalk: true, safe: true });

    // 8. Scatter trees, bushes & rocks across Zones 14..16
    for (let y = H2; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = I(x, y);
      const z = zone[i];
      if (z < 14 || road[i] || clear[i] || front[i] || objAt[i] >= 0 || npcAt[i] >= 0 || !SOLID[ground[i]]) continue;
      const r = r4();
      let kind = null, variant = null;
      if (z === 14) {
        if (r < 0.045) { kind = 'tree'; variant = r < 0.028 ? 'blossom' : 'oak'; }
        else if (r < 0.06) kind = 'bush';
        else if (r < 0.068) kind = 'rock';
      } else if (z === 15) {
        if (r < 0.045) { kind = 'tree'; variant = r < 0.03 ? 'palm' : 'oak'; }
        else if (r < 0.06) kind = 'bush';
        else if (r < 0.07) kind = 'rock';
      } else if (z === 16) {
        if (r < 0.045) { kind = 'tree'; variant = r < 0.03 ? 'pine' : 'crystal'; }
        else if (r < 0.06) kind = 'bush';
        else if (r < 0.07) kind = 'rock';
      }
      if (!kind || !safeToBlock(x, y)) continue;
      addObj(kind, x, y, 1, 1, { variant: variant || (r4() * 3) | 0 });
    }

    // 9. Treasure chests: 1 special Master Star chest + 5 hidden chests per new zone (18 new chests -> 86 total)
    for (const [x, y, where] of [
      [13, 214, 'Whirl Island Cove'],
      [68, 215, 'Sootopolis Coral Atoll'],
      [109, 215, 'Spear Pillar Overlook'],
    ]) {
      const i = I(x, y);
      if (objAt[i] >= 0) removeObj(objects[objAt[i]]);
      road[i] = 0;
      if (!WALK[ground[i]] || ground[i] === T.SHALLOW) ground[i] = T.GRASS;
      chests.push(addObj('chest', x, y, 1, 1, { loot: { master: 1, gold: 100 }, where, special: true }));
      clearRect(x - 1, y - 1, 3, 3); ensureWalk(x, y + 1, true);
    }
    bfs(start.x, start.y);
    for (const z of [14, 15, 16]) {
      const list = [];
      for (let y = H2 + 1; y < H - 2; y++) for (let x = 2; x < W - 2; x++) {
        const i = I(x, y);
        if (zone[i] !== z || !reach[i] || road[i] || front[i] || clear[i] || objAt[i] >= 0 || npcAt[i] >= 0 || !SOLID[ground[i]]) continue;
        let blocked = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && !isOpen(x + dx, y + dy)) blocked++;
        if (blocked >= 2) list.push([x, y, blocked]);
      }
      for (let k = list.length - 1; k > 0; k--) { const j = Math.floor(r4() * (k + 1)); const tmp = list[k]; list[k] = list[j]; list[j] = tmp; }
      list.sort((a, b) => b[2] - a[2] + (r4() - 0.5) * 3);
      let placed = 0;
      for (const [x, y] of list) {
        if (placed >= 5) break;
        if (chests.some(c => Math.abs(c.x - x) + Math.abs(c.y - y) < 7)) continue;
        if (objAt[I(x, y)] >= 0 || !safeToBlock(x, y)) continue;
        const kind = U.weighted(r4, D.CHEST_LOOT);
        const loot = kind === 'gold' ? { gold: 40 + 5 * U.randInt(r4, 0, 14) } : kind === 'berry' ? { berry: U.randInt(r4, 3, 6) } : kind === 'rainbow' ? { rainbow: U.randInt(r4, 1, 3) } : { master: 1 };
        chests.push(addObj('chest', x, y, 1, 1, { loot }));
        placed++;
      }
    }

    // 10. Decals across Zones 14..16
    for (let y = H2; y < H; y++) for (let x = 0; x < W; x++) {
      const i = I(x, y);
      if (zone[i] < 14 || (objAt[i] >= 0 && objects[objAt[i]].block)) continue;
      const z = zone[i], g = ground[i], r = r4();
      let d = 0;
      if (z === 14) {
        if (g === T.GRASS) d = r < 0.05 ? DEC.PETAL : r < 0.08 ? DEC.FLOWER_Y : r < 0.1 ? DEC.SPARKLE : 0;
        else if (g === T.PLAZA || g === T.PATH) d = r < 0.06 ? DEC.PETAL : 0;
      } else if (z === 15) {
        if (g === T.GRASS) d = r < 0.04 ? DEC.FLOWER_P : r < 0.07 ? DEC.FLOWER_B : r < 0.09 ? DEC.CLOVER : 0;
        else if (g === T.SAND) d = r < 0.05 ? DEC.SHELL : r < 0.08 ? DEC.STARFISH : 0;
        else if (g === T.SHALLOW) d = r < 0.2 ? DEC.LILY : 0;
      } else if (z === 16) {
        if (g === T.GRASS) d = r < 0.04 ? DEC.SHARD : r < 0.07 ? DEC.FLOWER_W : r < 0.1 ? DEC.SPARKLE : 0;
        else if (g === T.FLOOR) d = r < 0.08 ? DEC.SPARKLE : 0;
      }
      decal[i] = d;
    }
  }

  /* ---------------- connectivity repair ---------------- */
  function rectNeighbors(x, y, w, h) {
    const out = [];
    for (let xx = x; xx < x + w; xx++) { out.push([xx, y - 1]); out.push([xx, y + h]); }
    for (let yy = y; yy < y + h; yy++) { out.push([x - 1, yy]); out.push([x + w, yy]); }
    return out;
  }
  function targets() {
    const list = [];
    for (const o of objects) {
      if (o.removed || !o.act) continue;
      if (o.kind === 'trampoline' || o.kind === 'subportal' || o.kind === 'exitmat') list.push({ label: o.kind + '@' + o.x + ',' + o.y, tiles: [[o.x, o.y]] });
      else list.push({ label: o.kind + '@' + o.x + ',' + o.y, tiles: rectNeighbors(o.x, o.y, o.w, o.h) });
    }
    for (const n of npcs) if (!n.hidden) list.push({ label: 'npc:' + n.id, tiles: rectNeighbors(n.x, n.y, 1, 1) });
    for (const s of specials) list.push({ label: 'spot:' + s.sp, tiles: [[s.x, s.y]] });
    return list;
  }
  function carveCost(x, y) {
    if (x < 1 || y < 1 || x >= W - 1 || y >= H - 1) return 0;
    const i = I(x, y);
    if (npcAt[i] >= 0) return 0;
    if (objAt[i] >= 0) { const o = objects[objAt[i]]; if (o.block && !o.rm) return 0; if (o.block) return 6; }
    const g = ground[i];
    if (WALK[g]) return 1;
    if (g === T.CLIFF) return 5;
    if (g === T.DEEP) return 8;
    return 0;
  }
  function carveFrom(tiles) {
    const dist = new Float32Array(N).fill(Infinity);
    const prev = new Int32Array(N).fill(-1);
    const heap = new U.MinHeap();
    for (const [x, y] of tiles) {
      if (!inb(x, y)) continue;
      const c = carveCost(x, y);
      if (!c) continue;
      const i = I(x, y);
      if (c < dist[i]) { dist[i] = c; heap.push(c, i); }
    }
    let found = -1;
    while (heap.size) {
      const cur = heap.pop();
      if (reach[cur]) { found = cur; break; }
      const cx = cur % W, cy = (cur / W) | 0;
      for (let d = 0; d < 4; d++) {
        const nx = cx + DIRS4[d][0], ny = cy + DIRS4[d][1];
        if (!inb(nx, ny)) continue;
        const c = carveCost(nx, ny);
        if (!c) continue;
        const ni = I(nx, ny), nd = dist[cur] + c;
        if (nd < dist[ni]) { dist[ni] = nd; prev[ni] = cur; heap.push(nd, ni); }
      }
    }
    if (found < 0) return false;
    let last = found, c = prev[found];
    while (c >= 0) {
      if (objAt[c] >= 0 && objects[objAt[c]].block && objects[objAt[c]].rm) removeObj(objects[objAt[c]]);
      const g = ground[c];
      if (g === T.CLIFF) ground[c] = T.PATH;
      else if (g === T.DEEP) ground[c] = Math.abs(c - last) === 1 ? T.BRIDGE_H : T.BRIDGE_V;
      clear[c] = 1;
      last = c; c = prev[c];
    }
    return true;
  }
  function repair() {
    let carved = 0;
    for (let pass = 0; pass < 4; pass++) {
      bfs(start.x, start.y);
      let changed = false;
      for (const tg of targets()) {
        if (tg.tiles.some(([x, y]) => inb(x, y) && reach[I(x, y)])) continue;
        if (carveFrom(tg.tiles)) { carved++; changed = true; bfs(start.x, start.y); }
      }
      if (!changed) break;
    }
    return carved;
  }

  function computeEdges() {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = I(x, y), g = ground[i];
      let b = 0;
      const nb = [[0, -1, 1], [1, 0, 2], [0, 1, 4], [-1, 0, 8]];
      for (const [dx, dy, bit] of nb) {
        const nx = x + dx, ny = y + dy;
        if (!inb(nx, ny)) continue;
        const ng = ground[I(nx, ny)];
        if (g === T.DEEP && ng !== T.DEEP && ng !== T.STONES && ng !== T.BRIDGE_H && ng !== T.BRIDGE_V) b |= bit;
        else if (g === T.SHALLOW && !WATERLIKE[ng]) b |= bit;
        else if (g === T.CLIFF && ng !== T.CLIFF) b |= bit;
        else if (g === T.ICE && ng !== T.ICE) b |= bit;
      }
      edge[i] = b;
    }
  }

  function computeSpawns() {
    spawnTiles = {};
    for (let z = 1; z <= MAX_Z; z++) spawnTiles[z] = [];
    for (let i = 0; i < N; i++) {
      if (!reach[i] || road[i] || front[i] || objAt[i] >= 0 || npcAt[i] >= 0) continue;
      const g = ground[i];
      if (g === T.GRASS || g === T.TALL || g === T.SAND || g === T.SNOW || g === T.FLOWERS || g === T.SHALLOW || g === T.ICE) spawnTiles[zone[i]].push(i);
    }
  }

  function syncRegisteredSubmaps() {
    if (typeof window !== 'undefined' && Array.isArray(window.CQSubmaps) && typeof D.registerSubmap === 'function') {
      window.CQSubmaps.forEach(def => D.registerSubmap(def));
    }
  }

  function placeSubmapEntrances() {
    syncRegisteredSubmaps();
    const list = D.SUBMAPS || [];
    for (const def of list) {
      if (!def || !def.entrance) continue;
      const ex = def.entrance.x, ey = def.entrance.y;
      if (!inb(ex, ey)) continue;
      ensureWalk(ex, ey, true);
      addObj('subportal', ex, ey, 1, 1, {
        submapId: def.id,
        style: def.entrance.style || 'door',
        label: def.entrance.label || def.name,
        emoji: def.emoji || '🚪',
        name: def.name
      });
    }
  }

  function buildSubmap(def) {
    const sw = def.width || 22, sh = def.height || 16, sn = sw * sh;
    const palId = def.paletteId || (20 + (def.index || 1));
    const zId = def.zoneId || 1;
    const smGround = new Uint8Array(sn);
    const smZone = new Uint8Array(sn);
    const smDecal = new Uint8Array(sn);
    const smRoad = new Uint8Array(sn);
    const smClear = new Uint8Array(sn);
    const smFront = new Uint8Array(sn);
    const smReach = new Uint8Array(sn);
    const smEdge = new Uint8Array(sn);
    const smObjAt = new Int16Array(sn).fill(-1);
    const smAnchorAt = new Int16Array(sn).fill(-1);
    const smNpcAt = new Int16Array(sn).fill(-1);
    const smObjects = [], smNpcs = [], smSpecials = [], smChests = [], smBerryTrees = [];
    const smWaypoints = {}, smFountains = {};

    smZone.fill(palId);
    if (typeof window !== 'undefined' && window.Art && window.Art.PAL && def.palette) {
      window.Art.PAL[palId] = Object.assign({}, window.Art.PAL[zId] || window.Art.PAL[1], def.palette);
    }

    const smI = (x, y) => y * sw + x;
    const smInb = (x, y) => x >= 0 && y >= 0 && x < sw && y < sh;

    if (Array.isArray(def.tiles)) {
      if (Array.isArray(def.tiles[0])) {
        for (let y = 0; y < sh; y++) {
          const row = def.tiles[y] || [];
          for (let x = 0; x < sw; x++) {
            const t = row[x] != null ? row[x] : T.FLOOR;
            smGround[smI(x, y)] = (t >= 0 && t <= 14) ? t : T.FLOOR;
          }
        }
      } else {
        for (let i = 0; i < sn; i++) {
          const t = def.tiles[i] != null ? def.tiles[i] : T.FLOOR;
          smGround[i] = (t >= 0 && t <= 14) ? t : T.FLOOR;
        }
      }
    } else {
      smGround.fill(T.FLOOR);
    }

    const entry = Object.assign({ x: (sw >> 1), y: sh - 3, dir: 3 }, def.entry || {});
    const exit = Object.assign({ x: entry.x, y: Math.min(sh - 2, entry.y + 1), kind: 'exitmat', style: (def.entrance && def.entrance.style) || 'door', label: 'Return to Overworld' }, def.exit || {});
    if (smInb(entry.x, entry.y) && !WALK[smGround[smI(entry.x, entry.y)]]) smGround[smI(entry.x, entry.y)] = T.FLOOR;
    if (smInb(exit.x, exit.y) && !WALK[smGround[smI(exit.x, exit.y)]]) smGround[smI(exit.x, exit.y)] = T.FLOOR;

    if (Array.isArray(def.decals)) {
      for (const dc of def.decals) {
        if (!dc || !smInb(dc.x, dc.y)) continue;
        const val = typeof dc.d === 'string' ? (DEC[dc.d] || 0) : (dc.d || 0);
        smDecal[smI(dc.x, dc.y)] = val;
      }
    }

    // Reserve critical interactive coordinates so decorative props never seal them
    const reserved = new Set();
    reserved.add(smI(entry.x, entry.y));
    reserved.add(smI(exit.x, exit.y));
    if (Array.isArray(def.chests)) {
      for (const c of def.chests) if (c && smInb(c.x, c.y)) reserved.add(smI(c.x, c.y));
    }
    const rawNpcs = Array.isArray(def.npcs) ? def.npcs.slice() : (def.npc ? [def.npc] : []);
    for (const n of rawNpcs) if (n && smInb(n.x, n.y)) reserved.add(smI(n.x, n.y));
    if (def.boss && smInb(def.boss.x, def.boss.y)) reserved.add(smI(def.boss.x, def.boss.y));

    function addSmObj(kind, x, y, w, h, props) {
      w = w || 1; h = h || 1;
      if (!smInb(x, y) || !smInb(x + w - 1, y + h - 1)) return null;
      const k = KIND[kind] || { block: (props && props.block != null) ? props.block : 1, act: (props && (props.act || ((props.text || props.msg) ? 'sign' : null))) || null };
      const o = Object.assign({
        id: smObjects.length,
        kind, x, y, w, h,
        block: k.block != null ? k.block : 1,
        act: k.act || ((props && (props.text || props.msg)) ? 'sign' : null),
        rm: !!k.rm,
        z: zId,
        key: 'sub:' + def.id + ':' + kind + ':' + x + ',' + y
      }, props || {});
      if (!o.name && o.title) o.name = o.title;
      if (!o.text && o.msg) o.text = o.msg;
      smObjects.push(o);
      for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) smObjAt[smI(xx, yy)] = o.id;
      smAnchorAt[smI(x, y + h - 1)] = o.id;
      if (o.act === 'heal') {
        const fKey = o.fountainKey || ('sub_' + def.id + '_heal_' + x + '_' + y);
        o.fountainKey = fKey;
        smFountains[fKey] = { name: o.name || (def.name + ' Healing Spring'), x: x + (w >> 1), y: Math.min(sh - 2, y + h) };
      }
      if (o.kind === 'berrytree') smBerryTrees.push(o);
      return o;
    }

    // Place exit mat(s)
    addSmObj('exitmat', exit.x, exit.y, 1, 1, {
      submapId: def.id,
      style: exit.style || (def.entrance && def.entrance.style) || 'door',
      label: exit.label || 'Return to Overworld',
      block: 0,
      act: 'exitmat'
    });
    if (Array.isArray(def.exits)) {
      for (const ex of def.exits) {
        if (!ex || (ex.x === exit.x && ex.y === exit.y)) continue;
        if (smInb(ex.x, ex.y) && !WALK[smGround[smI(ex.x, ex.y)]]) smGround[smI(ex.x, ex.y)] = T.FLOOR;
        addSmObj('exitmat', ex.x, ex.y, 1, 1, {
          submapId: def.id,
          style: ex.style || exit.style || 'door',
          label: ex.label || exit.label || 'Return to Overworld',
          block: 0,
          act: 'exitmat'
        });
      }
    }

    // Place decorative & interactive props
    if (Array.isArray(def.props)) {
      for (const p of def.props) {
        if (!p || !p.kind) continue;
        const pw = p.w || 1, ph = p.h || 1;
        let overlapsReserved = false;
        for (let yy = p.y; yy < p.y + ph; yy++) {
          for (let xx = p.x; xx < p.x + pw; xx++) {
            if (!smInb(xx, yy) || reserved.has(smI(xx, yy)) || smObjAt[smI(xx, yy)] >= 0) overlapsReserved = true;
          }
        }
        if (overlapsReserved) continue;
        addSmObj(p.kind, p.x, p.y, pw, ph, p);
      }
    }

    // Place chests
    if (Array.isArray(def.chests)) {
      for (const c of def.chests) {
        if (!c || !smInb(c.x, c.y)) continue;
        if (!WALK[smGround[smI(c.x, c.y)]]) smGround[smI(c.x, c.y)] = T.FLOOR;
        const ch = addSmObj('chest', c.x, c.y, 1, 1, {
          key: c.key || ('sub:' + def.id + ':chest:' + c.x + ',' + c.y),
          loot: c.loot || { rainbow: 2, berry: 3, gold: 100 },
          block: 1,
          act: 'chest'
        });
        if (ch) smChests.push(ch);
      }
    }

    // Place NPC(s)
    rawNpcs.forEach((n, idx) => {
      if (!n || !smInb(n.x, n.y)) return;
      const ni = smI(n.x, n.y);
      if (!WALK[smGround[ni]]) smGround[ni] = T.FLOOR;
      const lines = typeof n.lines === 'string' ? [n.lines] : (Array.isArray(n.lines) && n.lines.length ? n.lines : ['Welcome to ' + def.name + '!']);
      const after = typeof n.after === 'string' ? [n.after] : (Array.isArray(n.after) && n.after.length ? n.after : lines);
      const npcObj = Object.assign({}, n, {
        id: n.id || ('sub_npc_' + (def.index || 1) + (idx > 0 ? '_' + idx : '')),
        name: n.name || 'Sub-Map Guide',
        look: n.look || 'scholar',
        x: n.x,
        y: n.y,
        dir: n.dir || 'down',
        lines,
        after,
        idx
      });
      smNpcs.push(npcObj);
      smNpcAt[ni] = smNpcs.length - 1;
    });

    // Place Boss / Guardian
    let smBoss = null;
    if (def.boss && smInb(def.boss.x, def.boss.y)) {
      const bi = smI(def.boss.x, def.boss.y);
      if (!WALK[smGround[bi]]) smGround[bi] = T.FLOOR;
      const winLines = typeof def.boss.winLines === 'string' ? [def.boss.winLines] : (Array.isArray(def.boss.winLines) && def.boss.winLines.length ? def.boss.winLines : ['You befriended the guardian of ' + def.name + '!']);
      smBoss = Object.assign({}, def.boss, {
        key: def.boss.key || ('boss_' + def.id),
        sp: def.boss.sp,
        lv: def.boss.lv || 15,
        x: def.boss.x,
        y: def.boss.y,
        title: def.boss.title || def.name + ' Guardian',
        intro: def.boss.intro || ('✨ ' + (def.boss.title || 'Guardian') + ' steps forward to challenge you!'),
        winLines,
        reward: def.boss.reward || { rainbow: 2, berry: 3, gold: 120 },
        isBoss: true,
        submapId: def.id
      });
      smSpecials.push(smBoss);
    }

    function smIsOpen(x, y) {
      if (!smInb(x, y)) return false;
      const i = smI(x, y);
      if (!WALK[smGround[i]]) return false;
      const o = smObjAt[i];
      if (o >= 0 && smObjects[o].block) return false;
      return smNpcAt[i] < 0;
    }

    function smBfs() {
      smReach.fill(0);
      if (!smInb(entry.x, entry.y)) return;
      const q = new Int32Array(sn);
      let h = 0, t = 0;
      const s = smI(entry.x, entry.y);
      smReach[s] = 1; q[t++] = s;
      while (h < t) {
        const c = q[h++];
        const cx = c % sw, cy = (c / sw) | 0;
        for (let d = 0; d < 4; d++) {
          const nx = cx + DIRS4[d][0], ny = cy + DIRS4[d][1];
          if (!smInb(nx, ny)) continue;
          const ni = smI(nx, ny);
          if (smReach[ni] || !smIsOpen(nx, ny)) continue;
          smReach[ni] = 1; q[t++] = ni;
        }
      }
    }

    function ensureTargetReachable(tx, ty, standOnTile) {
      const checkTiles = standOnTile ? [[tx, ty]] : DIRS4.map(([dx, dy]) => [tx + dx, ty + dy]).filter(([nx, ny]) => smInb(nx, ny));
      if (checkTiles.some(([nx, ny]) => smReach[smI(nx, ny)] === 1)) return;
      const goal = checkTiles[0] || [tx, ty];
      let cx = entry.x, cy = entry.y;
      while (cx !== goal[0] || cy !== goal[1]) {
        if (cx !== goal[0]) cx += Math.sign(goal[0] - cx);
        else cy += Math.sign(goal[1] - cy);
        if (!smInb(cx, cy)) break;
        const ci = smI(cx, cy);
        if (!WALK[smGround[ci]]) smGround[ci] = T.FLOOR;
        if (smObjAt[ci] >= 0 && smObjects[smObjAt[ci]].block && smObjects[smObjAt[ci]].kind !== 'chest') {
          const ro = smObjects[smObjAt[ci]];
          for (let yy = ro.y; yy < ro.y + ro.h; yy++) for (let xx = ro.x; xx < ro.x + ro.w; xx++) if (smObjAt[smI(xx, yy)] === ro.id) smObjAt[smI(xx, yy)] = -1;
          if (smAnchorAt[smI(ro.x, ro.y + ro.h - 1)] === ro.id) smAnchorAt[smI(ro.x, ro.y + ro.h - 1)] = -1;
          ro.removed = true;
        }
      }
      smBfs();
    }

    smBfs();
    ensureTargetReachable(exit.x, exit.y, true);
    for (const c of smChests) ensureTargetReachable(c.x, c.y, false);
    for (const n of smNpcs) ensureTargetReachable(n.x, n.y, false);
    if (smBoss) ensureTargetReachable(smBoss.x, smBoss.y, true);

    // Compute edges for sub-map
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
      const i = smI(x, y), g = smGround[i];
      let b = 0;
      const nb = [[0, -1, 1], [1, 0, 2], [0, 1, 4], [-1, 0, 8]];
      for (const [dx, dy, bit] of nb) {
        const nx = x + dx, ny = y + dy;
        if (!smInb(nx, ny)) continue;
        const ng = smGround[smI(nx, ny)];
        if (g === T.DEEP && ng !== T.DEEP && ng !== T.STONES && ng !== T.BRIDGE_H && ng !== T.BRIDGE_V) b |= bit;
        else if (g === T.SHALLOW && !WATERLIKE[ng]) b |= bit;
        else if (g === T.CLIFF && ng !== T.CLIFF) b |= bit;
        else if (g === T.ICE && ng !== T.ICE) b |= bit;
      }
      smEdge[i] = b;
    }

    // Compute spawn tiles (Array of tile indices, also indexed by zoneId/palId for compatibility)
    const smSpawnList = [];
    for (let i = 0; i < sn; i++) {
      if (!smReach[i] || smObjAt[i] >= 0 || smNpcAt[i] >= 0) continue;
      const sx = i % sw, sy = (i / sw) | 0;
      if ((sx === entry.x && sy === entry.y) || (sx === exit.x && sy === exit.y)) continue;
      if (smBoss && sx === smBoss.x && sy === smBoss.y) continue;
      const g = smGround[i];
      if (g === T.TALL || g === T.GRASS || g === T.FLOWERS || g === T.SAND || g === T.SNOW || g === T.SHALLOW || g === T.ICE) {
        smSpawnList.push(i);
      }
    }
    if (smSpawnList.length < 12) {
      for (let i = 0; i < sn; i++) {
        if (!smReach[i] || smObjAt[i] >= 0 || smNpcAt[i] >= 0 || smSpawnList.includes(i)) continue;
        const sx = i % sw, sy = (i / sw) | 0;
        if (Math.abs(sx - entry.x) + Math.abs(sy - entry.y) <= 1) continue;
        if (Math.abs(sx - exit.x) + Math.abs(sy - exit.y) <= 1) continue;
        if (smBoss && sx === smBoss.x && sy === smBoss.y) continue;
        if (WALK[smGround[i]]) smSpawnList.push(i);
      }
    }

    return {
      id: def.id,
      index: def.index,
      key: def.key,
      name: def.name,
      emoji: def.emoji || '🗺️',
      zoneId: zId,
      paletteId: palId,
      musicZone: def.musicZone || zId,
      color: def.color || '#7c3aed',
      borderTile: def.borderTile != null ? def.borderTile : T.CLIFF,
      W: sw,
      H: sh,
      N: sn,
      entrance: def.entrance,
      entry,
      exit,
      palette: def.palette || null,
      wildPool: def.wildPool || { lv: [2, 5], maxWilds: 4, table: [['spark', 50], ['bubba', 50]] },
      boss: smBoss,
      ground: smGround,
      zone: smZone,
      decal: smDecal,
      road: smRoad,
      clear: smClear,
      front: smFront,
      reach: smReach,
      edge: smEdge,
      objAt: smObjAt,
      anchorAt: smAnchorAt,
      npcAt: smNpcAt,
      objects: smObjects,
      npcs: smNpcs,
      specials: smSpecials,
      chests: smChests,
      berryTrees: smBerryTrees,
      waypoints: smWaypoints,
      fountains: smFountains,
      spawnTiles: smSpawnList,
      def
    };
  }

  function rebuildSubmaps() {
    syncRegisteredSubmaps();
    submaps = {};
    const list = D.SUBMAPS || [];
    for (const def of list) {
      if (!def || !def.id) continue;
      const sm = buildSubmap(def);
      submaps[def.id] = sm;
      const pad = String(def.index || 0).padStart(2, '0');
      for (const alias of ['sub_' + pad + '_' + def.key, def.key]) {
        if (alias && !submaps[alias]) {
          Object.defineProperty(submaps, alias, { value: sm, enumerable: false, configurable: true, writable: true });
        }
      }
    }
    return submaps;
  }

  function applyContext(ctx) {
    W = ctx.W; H = ctx.H; N = ctx.N;
    ground = ctx.ground; zone = ctx.zone; decal = ctx.decal;
    road = ctx.road; clear = ctx.clear; front = ctx.front;
    reach = ctx.reach; edge = ctx.edge;
    objAt = ctx.objAt; anchorAt = ctx.anchorAt; npcAt = ctx.npcAt;
    objects = ctx.objects; npcs = ctx.npcs; specials = ctx.specials;
    chests = ctx.chests; berryTrees = ctx.berryTrees;
    waypoints = ctx.waypoints; fountains = ctx.fountains; spawnTiles = ctx.spawnTiles;
  }

  function setActiveSubmap(id) {
    if (!id) {
      if (overworld) applyContext(overworld);
      activeSubmapId = null;
      return overworld;
    }
    const sm = submaps[id];
    if (!sm) return null;
    applyContext(sm);
    activeSubmapId = sm.id;
    return sm;
  }

  function generate() {
    W = OW_W; H = OW_H; N = OW_N;
    ground = owGround; zone = owZone; decal = owDecal;
    road = owRoad; clear = owClear; front = owFront;
    reach = owReach; edge = owEdge;
    objAt = owObjAt; anchorAt = owAnchorAt; npcAt = owNpcAt;
    activeSubmapId = null;
    rng = U.mulberry32(20261014);
    objects = []; npcs = []; specials = []; chests = []; berryTrees = []; waypoints = {}; fountains = {};
    objAt.fill(-1); anchorAt.fill(-1); npcAt.fill(-1);
    road.fill(0); clear.fill(0); front.fill(0); decal.fill(0); reach.fill(0);
    terrain();
    features();
    roads();
    buildLandmarks();
    ensureWalk(start.x, start.y, true);
    scatter();
    placeChests();
    decals();
    if (H > H0) buildHonmoon();
    if (H > H1) buildSouthContinent();
    if (H > H2) buildGen234Continent();
    placeSubmapEntrances();
    repairs = repair();
    bfs(start.x, start.y);
    computeEdges();
    computeSpawns();
    overworld = {
      id: null,
      W: OW_W, H: OW_H, N: OW_N,
      ground: owGround, zone: owZone, decal: owDecal,
      road: owRoad, clear: owClear, front: owFront,
      reach: owReach, edge: owEdge,
      objAt: owObjAt, anchorAt: owAnchorAt, npcAt: owNpcAt,
      objects, npcs, specials, chests, berryTrees, waypoints, fountains, spawnTiles
    };
    rebuildSubmaps();
    setActiveSubmap(null);
  }

  /* ---------------- queries ---------------- */
  function objectAt(x, y) { if (!inb(x, y)) return null; const o = objAt[I(x, y)]; return o >= 0 ? objects[o] : null; }
  function npcAtTile(x, y) { if (!inb(x, y)) return null; const n = npcAt[I(x, y)]; return n >= 0 ? npcs[n] : null; }
  /* A hero who joined the team leaves her spot (frees the tile for walking). */
  function hideNPC(n) {
    if (!n || n.hidden) return;
    n.hidden = true;
    const i = I(n.x, n.y);
    if (npcAt[i] >= 0 && npcs[npcAt[i]] === n) npcAt[i] = -1;
  }
  function walkable(x, y) { return isOpen(x, y); }
  function groundAt(x, y) { return inb(x, y) ? ground[I(x, y)] : (activeSubmapId && submaps[activeSubmapId] ? submaps[activeSubmapId].borderTile : T.DEEP); }
  function zoneAt(x, y) {
    if (activeSubmapId && submaps[activeSubmapId]) return submaps[activeSubmapId].zoneId;
    return inb(x, y) ? zone[I(x, y)] : 0;
  }

  function audit() {
    if (!overworld) generate();
    const prevId = activeSubmapId;
    if (prevId) setActiveSubmap(null);
    const counts = {};
    objects.forEach(o => { if (!o.removed) counts[o.kind] = (counts[o.kind] || 0) + 1; });
    const unreachable = targets().filter(tg => !tg.tiles.some(([x, y]) => inb(x, y) && reach[I(x, y)])).map(t => t.label);
    const zoneTiles = {}, zoneReach = {}, tall = {}, spawn = {};
    for (let i = 0; i < N; i++) {
      const z = zone[i];
      zoneTiles[z] = (zoneTiles[z] || 0) + 1;
      if (reach[i]) zoneReach[z] = (zoneReach[z] || 0) + 1;
      if (ground[i] === T.TALL && reach[i]) tall[z] = (tall[z] || 0) + 1;
    }
    for (let z = 1; z <= MAX_Z; z++) spawn[z] = (spawnTiles[z] || []).length;
    let reachable = 0, walk = 0;
    for (let i = 0; i < N; i++) { if (reach[i]) reachable++; if (WALK[ground[i]]) walk++; }
    const res = {
      size: W + 'x' + H, tiles: N, worldPx: (W * D.TILE) + 'x' + (H * D.TILE),
      chests: chests.filter(c => !c.removed).length, berryTrees: berryTrees.filter(o => !o.removed).length,
      fountains: Object.keys(fountains).length, waypoints: Object.keys(waypoints).length,
      npcs: npcs.length, specials: specials.length, subportals: counts.subportal || 0,
      repairs, unreachable, counts,
      zoneTiles, zoneReach, tallReachable: tall, spawnTiles: spawn, reachable, walkableTiles: walk,
    };
    if (prevId) setActiveSubmap(prevId);
    return res;
  }

  function auditSubmaps() {
    if (!overworld) generate();
    const prevId = activeSubmapId;
    const ids = Object.keys(submaps).sort();
    const unreachable = [];
    const errors = [];
    const perMap = {};
    let allEntriesWalkable = ids.length === 20;
    let allEntrancesReachable = ids.length === 20;
    let roundTripOk = ids.length === 20;

    for (const id of ids) {
      const sm = submaps[id];
      const sw = sm.W, sh = sm.H;
      const smI = (x, y) => y * sw + x;
      const smInb = (x, y) => x >= 0 && y >= 0 && x < sw && y < sh;

      // 1. Overworld entrance reachability & subportal presence
      const ent = sm.entrance || {};
      const owInb = ent.x >= 0 && ent.y >= 0 && ent.x < OW_W && ent.y < OW_H;
      const owIdx = owInb ? (ent.y * OW_W + ent.x) : -1;
      const owReachable = owInb && overworld && overworld.reach[owIdx] === 1;
      const owObjId = owInb && overworld ? overworld.objAt[owIdx] : -1;
      const owObj = owObjId >= 0 && overworld ? overworld.objects[owObjId] : null;
      const hasSubportal = !!(owObj && owObj.kind === 'subportal' && owObj.submapId === id);
      if (!owReachable || !hasSubportal) {
        allEntrancesReachable = false;
        unreachable.push(id + ':entrance@' + ent.x + ',' + ent.y);
      }

      // 2. Entry and exit walkability & reachability
      const entryOk = smInb(sm.entry.x, sm.entry.y) && sm.reach[smI(sm.entry.x, sm.entry.y)] === 1;
      const exitOk = smInb(sm.exit.x, sm.exit.y) && sm.reach[smI(sm.exit.x, sm.exit.y)] === 1;
      if (!entryOk || !exitOk) {
        allEntriesWalkable = false;
        unreachable.push(id + ':entry_or_exit');
      }

      // 3. Chests, NPCs, Boss reachability
      for (const c of sm.chests) {
        const adj = DIRS4.some(([dx, dy]) => smInb(c.x + dx, c.y + dy) && sm.reach[smI(c.x + dx, c.y + dy)] === 1);
        if (!adj) unreachable.push(id + ':chest@' + c.x + ',' + c.y);
      }
      for (const n of sm.npcs) {
        const adj = DIRS4.some(([dx, dy]) => smInb(n.x + dx, n.y + dy) && sm.reach[smI(n.x + dx, n.y + dy)] === 1);
        if (!adj) unreachable.push(id + ':npc:' + n.id);
      }
      if (sm.boss) {
        const bReach = (smInb(sm.boss.x, sm.boss.y) && sm.reach[smI(sm.boss.x, sm.boss.y)] === 1) ||
          DIRS4.some(([dx, dy]) => smInb(sm.boss.x + dx, sm.boss.y + dy) && sm.reach[smI(sm.boss.x + dx, sm.boss.y + dy)] === 1);
        if (!bReach) unreachable.push(id + ':boss:' + sm.boss.sp);
      } else {
        errors.push(id + ':missing_boss');
      }

      // 4. Schema & content checks
      if (sm.chests.length < 2) errors.push(id + ':fewer_than_2_chests');
      if (sm.npcs.length < 1) errors.push(id + ':missing_npc');
      if (!sm.boss || !D.SP[sm.boss.sp]) errors.push(id + ':invalid_boss_species:' + (sm.boss && sm.boss.sp));
      if (!sm.wildPool || !Array.isArray(sm.wildPool.table) || sm.wildPool.table.length < 3) {
        errors.push(id + ':invalid_wildPool');
      } else {
        for (const [sp, w] of sm.wildPool.table) {
          if (!D.SP[sp] || !(w > 0)) errors.push(id + ':invalid_wild_species:' + sp);
        }
      }
      if (!Array.isArray(sm.spawnTiles) || sm.spawnTiles.length < 8) {
        errors.push(id + ':insufficient_spawnTiles:' + (sm.spawnTiles ? sm.spawnTiles.length : 0));
      }

      // 5. Context switch round-trip check
      setActiveSubmap(id);
      if (W !== sm.W || H !== sm.H || activeSubmapId !== id) roundTripOk = false;
      setActiveSubmap(null);
      if (W !== OW_W || H !== OW_H || activeSubmapId !== null) roundTripOk = false;

      let reachCount = 0;
      for (let i = 0; i < sm.N; i++) if (sm.reach[i]) reachCount++;
      perMap[id] = {
        name: sm.name,
        zoneId: sm.zoneId,
        size: sm.W + 'x' + sm.H,
        chests: sm.chests.length,
        npcs: sm.npcs.length,
        boss: sm.boss ? sm.boss.sp : null,
        spawnTiles: sm.spawnTiles.length,
        reachable: reachCount
      };
    }

    setActiveSubmap(prevId);
    const ok = ids.length === 20 && allEntriesWalkable && allEntrancesReachable && roundTripOk && unreachable.length === 0 && errors.length === 0;
    return {
      count: ids.length,
      allEntriesWalkable,
      allEntrancesReachable,
      roundTripOk,
      unreachable,
      errors,
      perMap,
      ok
    };
  }

  return {
    get W() { return W; }, get H() { return H; }, H0, get N() { return N; },
    T, T_NAMES, WALK, SOLID, DEC, KIND, I, inb,
    get ground() { return ground; }, get zone() { return zone; }, get decal() { return decal; },
    get road() { return road; }, get edge() { return edge; }, get objAt() { return objAt; },
    get anchorAt() { return anchorAt; }, get npcAt() { return npcAt; }, get reach() { return reach; }, get front() { return front; },
    get objects() { return objects; }, get npcs() { return npcs; }, get specials() { return specials; },
    get chests() { return chests; }, get berryTrees() { return berryTrees; }, get waypoints() { return waypoints; },
    get fountains() { return fountains; }, get spawnTiles() { return spawnTiles; },
    get overworld() { return overworld; }, get submaps() { return submaps; }, get submapList() { return Object.values(submaps); }, get submapOrder() { return Object.keys(submaps).sort(); },
    get activeSubmapId() { return activeSubmapId; }, get activeSubmap() { return activeSubmapId ? submaps[activeSubmapId] : null; },
    start, generate, audit, auditSubmaps, buildSubmap, rebuildSubmaps, setActiveSubmap,
    objectAt, npcAtTile, hideNPC, walkable, groundAt, zoneAt, isOpen,
  };
})();
if (typeof window !== 'undefined') window.World = World;


