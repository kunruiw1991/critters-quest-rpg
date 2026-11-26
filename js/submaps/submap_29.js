'use strict';
// js/submaps/submap_29.js — Map 29: Playcare Playhouse & Sun-Belt Sanctum (Zone 21)
(() => {
  const W = 24, H = 18;
  const tiles = [
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12],
    [12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12],
    [12,11,14,14,14,11,11,11,11,14,14,14,14,14,14,11,11,11,11,14,14,14,11,12],
    [12,11,14,14,14,11,11,11,11,14,14,14,14,14,14,11,11,11,11,14,14,14,11,12],
    [12,11,14,14,14,11,11,11,11,14,14,14,14,14,14,11,11,11,11,14,14,14,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11, 4, 4, 4, 4,11,11,11,14,14,14,14,11,11,11, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4,11, 1, 1, 1, 8, 8, 1, 1, 1,11, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4,11, 1, 1, 1, 8, 8, 1, 1, 1,11, 4, 4, 4, 4,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11, 7, 7,14,14,14,14, 7, 7,11,11,11,11,11,11,11,12],
    [12,11,11, 4, 4, 4, 4,11,11,11,14,14,14,14,11,11,11, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4,11,11,11,14,14,14,14,11,11,11, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4,11,11,11,14,14,14,14,11,11,11, 4, 4, 4, 4,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]
  ];

  const def = {
    id: 'submap_29',
    index: 29,
    key: 'playcare_sun_playhouse',
    name: 'Playcare Playhouse & Sun-Belt Sanctum',
    emoji: '☀️',
    zoneId: 21,
    color: '#ea580c',
    paletteId: 49,
    musicZone: 21,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 55, y: 319, kind: 'subportal', style: 'door', label: 'Playcare Playhouse & Sun-Belt Sanctum' },
    entry: { x: 12, y: 15, dir: 3 },
    exit: { x: 12, y: 16, kind: 'exitmat', style: 'door', label: 'Exit to Nightmare Playcare Plaza' },
    palette: {
      g: '#7c2d12', gd: '#431407', gl: '#9a3412',
      t1: '#fb923c', t2: '#facc15', t3: '#4ade80',
      p: '#fed7aa', pd: '#fdba74', pl: '#ffedd5',
      sand: '#fef3c7', sandd: '#fde68a',
      tree: '#ea580c', treed: '#c2410c', treel: '#fb923c',
      cliff: '#3b0764', cliffd: '#1e1b4b', cliffl: '#581c87',
      floor: '#fffbeb', floord: '#fef3c7',
      plaza: '#fde68a', plazad: '#fcd34d', plazal: '#ffffff'
    },
    tiles,
    decals: [
      { x: 3, y: 2, d: 9 }, { x: 20, y: 2, d: 9 },
      { x: 11, y: 3, d: 9 }, { x: 13, y: 3, d: 9 }
    ],
    props: [
      { kind: 'throne', x: 12, y: 2, w: 1, h: 1, title: 'Golden Sun-Belt Dais', msg: '☀️ Nightmare DogDay\'s sunny playhouse stage, polished bright by all 8 Bigger Bodies Smiling Critters!' },
      { kind: 'banner_stand', x: 10, y: 2, w: 1, h: 1, title: 'Hoppy & Kickin Banner', msg: '⚡⭐ "Jump Higher, Shine Brighter — Playcare Athletics Club!"' },
      { kind: 'banner_stand', x: 14, y: 2, w: 1, h: 1, title: 'Bobby & Crafty Banner', msg: '❤️🌈 "Big Monster Smiles, Even Bigger Plushie Hugs!"' },
      { kind: 'brazier', x: 8, y: 4, w: 1, h: 1, title: 'Warm Sun Lantern', msg: '🔥 Glows with cozy golden morning light.' },
      { kind: 'brazier', x: 16, y: 4, w: 1, h: 1, title: 'Warm Sun Lantern', msg: '🔥 Glows with cozy golden morning light.' },
      { kind: 'sign', x: 8, y: 14, w: 1, h: 1, name: 'Playhouse Plaque', title: 'Playhouse Plaque', text: '☀️ "Inside this playhouse, Nightmare DogDay, Hoppy, Bobby, CraftyCorn, PickyPiggy, Bubba & KickinChicken love friendly matches!"', msg: '☀️ "Inside this playhouse, Nightmare DogDay, Hoppy, Bobby, CraftyCorn, PickyPiggy, Bubba & KickinChicken love friendly matches!"' }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 4, star: 2, berry: 6, gold: 240 } },
      { x: 20, y: 3, loot: { rainbow: 4, star: 3, berry: 6, gold: 260 } }
    ],
    npc: {
      id: 'sub_npc_29',
      name: 'Playcare Helper Ollie',
      look: 'ollie_npc',
      x: 16,
      y: 14,
      lines: [
        'Ring-ring! Hey there — it\'s Ollie on the Playcare walkie-talkie! 📞☀️',
        'Even in their giant Bigger Bodies Nightmare forms, DogDay, Hoppy, Bobby, CraftyCorn, PickyPiggy, Bubba and KickinChicken are loyal heroes at heart!',
        'Take these Rainbow Capsules and cheer up ✨ Nightmare DogDay right up ahead!'
      ],
      gift: { rainbow: 4, berry: 6, gold: 210 },
      after: ['You\'re Nightmare DogDay\'s little angel hero! ☀️🐾']
    },
    wildPool: {
      lv: [22, 27],
      maxWilds: 4,
      table: [['nmdogday', 14], ['nmhoppy', 16], ['nmbobby', 14], ['nmkickin', 14], ['nmpicky', 14], ['plushcatnap', 15], ['monstercatnap', 13]]
    },
    boss: {
      key: 'boss_submap_29',
      sp: 'nmdogday',
      lv: 28,
      x: 12,
      y: 4,
      title: 'Nightmare DogDay',
      intro: '☀️🧡 "Awooo!! My sunny hero has arrived!!" Giant Nightmare DogDay gleams with golden sunbeams for an epic Playhouse spar!',
      winLines: ['"Thank you, my little sunshine hero!! My sun pendant is shining brighter than ever!" Nightmare DogDay wags his tail! ☀️💛'],
      reward: { rainbow: 4, star: 4, berry: 6, gold: 320 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
