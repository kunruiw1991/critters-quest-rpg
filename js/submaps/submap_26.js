'use strict';
// js/submaps/submap_26.js — Map 26: Maizen Skyblock Dragon & Golden Throne Sanctum (Zone 19)
(() => {
  const W = 26, H = 20;
  const tiles = [
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12],
    [12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12],
    [12,11,14,14,14,11,11,11,11,11,14,14,14,14,14,14,14,11,11,11,11,14,14,14,11,12],
    [12,11,14,14,14,11,11,11,11,11,14,14,14,14,14,14,14,11,11,11,11,14,14,14,11,12],
    [12,11,14,14,14,11,11,11,11,11,14,14,14,14,14,14,14,11,11,11,11,14,14,14,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,14,14,14,11,11,11,11,11,11,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11,11,14,14,14,14,14,14,14,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11, 1, 1, 1, 8, 8, 8, 1, 1,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11, 1, 1, 1, 8, 8, 8, 1, 1,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11, 1, 1, 1, 8, 8, 8, 1, 1,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11,11,11,11,11,11,11, 1, 1,11,14,14,14,11, 1,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11, 7, 7, 7, 7,14,14,14, 7, 7, 7, 7,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11, 1, 1,11,14,14,14,11, 1,11,11,11,11,11,11,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11,11,11,11,14,14,14,11,11,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11,11,11,11,14,14,14,11,11,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11,11,11,11,14,14,14,11,11,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,11,14,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,11,14,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,11,14,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]
  ];

  const def = {
    id: 'submap_26',
    index: 26,
    key: 'maizen_skyblock_sanctum',
    name: 'Maizen Skyblock Dragon & Golden Throne Sanctum',
    emoji: '👑',
    zoneId: 19,
    color: '#eab308',
    paletteId: 46,
    musicZone: 19,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 96, y: 244, kind: 'subportal', style: 'origin_stairs', label: 'Maizen Skyblock Dragon & Golden Throne Sanctum' },
    entry: { x: 13, y: 17, dir: 3 },
    exit: { x: 13, y: 18, kind: 'exitmat', style: 'origin_stairs', label: 'Exit to Skyblock Plaza' },
    palette: {
      g: '#3b0764', gd: '#2e1065', gl: '#581c87',
      t1: '#fde047', t2: '#c084fc', t3: '#38bdf8',
      p: '#facc15', pd: '#eab308', pl: '#fef08a',
      sand: '#fef9c3', sandd: '#fde047',
      tree: '#7e22ce', treed: '#581c87', treel: '#a855f7',
      cliff: '#1e1b4b', cliffd: '#0f172a', cliffl: '#312e81',
      floor: '#fefce8', floord: '#fef08a',
      plaza: '#fde047', plazad: '#eab308', plazal: '#ffffff'
    },
    tiles,
    decals: [
      { x: 3, y: 2, d: 9 }, { x: 22, y: 2, d: 9 },
      { x: 12, y: 3, d: 9 }, { x: 14, y: 3, d: 9 },
      { x: 13, y: 6, d: 9 }, { x: 13, y: 11, d: 9 }
    ],
    props: [
      { kind: 'throne', x: 13, y: 2, w: 1, h: 1, title: '100-Million Golden Play Button Throne', msg: '👑 The legendary golden throne celebrating JJ, Mikey & Carrie\'s biggest adventures!' },
      { kind: 'origin_ring', x: 11, y: 2, w: 1, h: 1, title: 'King Golden JJ Scepter Altar', msg: '💛 Shimmering with 100-Million Gold Rain starlight!' },
      { kind: 'origin_ring', x: 15, y: 2, w: 1, h: 1, title: 'Ender Dragon Egg Pedestal', msg: '🌌 The sacred purple Ender Dragon Egg guarded by Ender Dragon Mikey!' },
      { kind: 'statue', x: 9, y: 4, w: 1, h: 1, title: 'Golden JJ Monument', msg: '🗿 "Best Friends Forever: JJ & Mikey!"' },
      { kind: 'statue', x: 17, y: 4, w: 1, h: 1, title: 'Ender Mikey Monument', msg: '🗿 "From One Skyblock Dirt Block to the Dragon Sanctum!"' },
      { kind: 'sign', x: 9, y: 16, w: 1, h: 1, name: 'Skyblock Plaque', title: 'Skyblock Plaque', text: '👑 "Welcome to the Grand Finale of the Maizen Block Continent! Ender Dragon Mikey awaits!"', msg: '👑 "Welcome to the Grand Finale of the Maizen Block Continent! Ender Dragon Mikey awaits!"' }
    ],
    chests: [
      { x: 3, y: 3, loot: { master: 1, rainbow: 4, berry: 6, gold: 300 } },
      { x: 22, y: 3, loot: { master: 1, rainbow: 4, berry: 6, gold: 300 } }
    ],
    npc: {
      id: 'sub_npc_26',
      name: 'Skyblock Referee Carrie',
      look: 'carrie_npc',
      x: 17,
      y: 16,
      lines: [
        'You made it to the Maizen Skyblock Dragon & Golden Throne Sanctum, Chuyu! 🐱👑🌌',
        'JJ and Mikey started on a single floating grass block, and now they built this whole golden palace in the clouds!',
        'Take this Master Star Capsule blessing and step up to meet Legendary 👑 Ender Dragon Mikey!'
      ],
      gift: { master: 1, rainbow: 4, berry: 6, gold: 250 },
      after: ['Ender Dragon Mikey 🌌 and King Golden JJ 👑 are so excited to be on your team! 🌟']
    },
    wildPool: {
      lv: [24, 30],
      maxWilds: 4,
      table: [['kingjj', 18], ['dragonmikey', 18], ['herobrine', 20], ['maizenhacker', 20], ['mutantmikey', 24]]
    },
    boss: {
      key: 'boss_submap_26',
      sp: 'dragonmikey',
      lv: 32,
      x: 13,
      y: 4,
      title: 'Ender Dragon Mikey',
      intro: '🌌🐉 "ENDER TURTLE NOVA!!" Legendary Ender Dragon Mikey flutters his purple dragon wings atop the Golden Throne Dais!',
      winLines: ['"YAY!! Best friends forever, Chuyu!!" Ender Dragon Mikey & King Golden JJ crown you Grand Champion of Maizen Island! 👑🐢🌊'],
      reward: { master: 1, rainbow: 5, star: 5, berry: 8, gold: 400 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
