'use strict';
// js/submaps/submap_30.js — Map 30: Red-Smoke Moon Cathedral (Zone 21)
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
    id: 'submap_30',
    index: 30,
    key: 'red_smoke_moon_cathedral',
    name: 'Red-Smoke Moon Cathedral',
    emoji: '🌙',
    zoneId: 21,
    color: '#7c3aed',
    paletteId: 50,
    musicZone: 21,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 57, y: 300, kind: 'subportal', style: 'rift', label: 'Red-Smoke Moon Cathedral' },
    entry: { x: 13, y: 17, dir: 3 },
    exit: { x: 13, y: 18, kind: 'exitmat', style: 'rift', label: 'Exit to Playcare Dome Courtyard' },
    palette: {
      g: '#2e1065', gd: '#1e1b4b', gl: '#4c1d95',
      t1: '#c084fc', t2: '#fb7185', t3: '#fde047',
      p: '#ddd6fe', pd: '#c4b5fd', pl: '#ede9fe',
      sand: '#f3e8ff', sandd: '#d8b4fe',
      tree: '#6d28d9', treed: '#4c1d95', treel: '#a855f7',
      cliff: '#1e1b4b', cliffd: '#0f172a', cliffl: '#312e81',
      floor: '#f5f3ff', floord: '#ede9fe',
      plaza: '#e9d5ff', plazad: '#d8b4fe', plazal: '#ffffff'
    },
    tiles,
    decals: [
      { x: 3, y: 2, d: 17 }, { x: 22, y: 2, d: 17 },
      { x: 12, y: 3, d: 9 }, { x: 14, y: 3, d: 9 }
    ],
    props: [
      { kind: 'throne', x: 13, y: 2, w: 1, h: 1, title: 'Crescent Moon Nap Altar', msg: '🌙 Nightmare CatNap\'s towering velvet cushion throne surrounded by sweet lavender dream mist!' },
      { kind: 'cauldron_pot', x: 11, y: 2, w: 1, h: 1, title: 'Lavender Dream Diffuser', msg: '💜 Gently puffs sparkly bedtime mist that smells like sweet berries and chamomile!' },
      { kind: 'cauldron_pot', x: 15, y: 2, w: 1, h: 1, title: 'Starlight Incense Censer', msg: '✨ Twinkles with golden crescent-moon sparks!' },
      { kind: 'crystal_pillar', x: 9, y: 4, w: 1, h: 1, title: 'Amethyst Moon Pillar', msg: '🔮 Carved with all eight Smiling Critter charm constellations.' },
      { kind: 'crystal_pillar', x: 17, y: 4, w: 1, h: 1, title: 'Amethyst Sun Pillar', msg: '🔮 Reflects warm starlight across the cathedral floor.' },
      { kind: 'sign', x: 9, y: 16, w: 1, h: 1, name: 'Cathedral Tablet', title: 'Cathedral Tablet', text: '🌙 "Shhh... Legendary Nightmare CatNap curls up on the Crescent Moon Altar! Offer a Sweet Berry to become best bedtime buddies!"', msg: '🌙 "Shhh... Legendary Nightmare CatNap curls up on the Crescent Moon Altar! Offer a Sweet Berry to become best bedtime buddies!"' }
    ],
    chests: [
      { x: 3, y: 3, loot: { master: 1, rainbow: 3, berry: 6, gold: 280 } },
      { x: 22, y: 3, loot: { rainbow: 4, star: 3, berry: 6, gold: 280 } }
    ],
    npc: {
      id: 'sub_npc_30',
      name: 'Teacher Miss Delight',
      look: 'delight_npc',
      x: 17,
      y: 16,
      lines: [
        'Gold star for attendance!! Welcome to the Red-Smoke Moon Cathedral! 🏫🌙',
        'Nightmare CraftyCorn, Nightmare Bubba, and all the Monster Smiling Critters gather here for storytime before bed!',
        'Take this Master Star Capsule blessing before meeting Legendary 👑 Nightmare CatNap at the Moon Altar!'
      ],
      gift: { master: 1, rainbow: 3, berry: 6, gold: 230 },
      after: ['Nightmare CatNap purrs like a giant purple thundercloud when he\'s happy! 🌙💜']
    },
    wildPool: {
      lv: [24, 29],
      maxWilds: 4,
      table: [['nmcatnap', 11], ['nmcrafty', 15], ['nmbubba', 15], ['nmbobby', 14], ['nmhoppy', 14], ['monstercatnap', 12], ['nmhuggy', 10], ['plushcatnap', 9]]
    },
    boss: {
      key: 'boss_submap_30',
      sp: 'nmcatnap',
      lv: 30,
      x: 13,
      y: 4,
      title: 'Nightmare CatNap',
      intro: '🌙💜 "Prrrrr... Sweet dreams, little friend..." Legendary Nightmare CatNap arches his tall purple plush back as his golden moon charm gleams!',
      winLines: ['"Prrrrr~ Best naptime friend forever!!" Nightmare CatNap curls his giant fluffy tail happily around your squad! 🌙✨'],
      reward: { master: 1, rainbow: 4, star: 4, berry: 8, gold: 360 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
