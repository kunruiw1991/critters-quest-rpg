'use strict';
// js/submaps/submap_16.js — Map 16: Volcano Magma Chamber (Zone 13)
(() => {
  const W = 22, H = 18;
  // Tile legend:
  // 0 = T.DEEP (molten magma channel, non-walkable)
  // 2 = T.SAND (ember sand, walkable)
  // 4 = T.TALL (ember-ash patches, walkable wild spawn)
  // 7 = T.BRIDGE_H (basalt bridge over magma, walkable)
  // 11 = T.FLOOR (basalt stone floor, walkable)
  // 12 = T.CLIFF (outer volcanic cliff wall, non-walkable)
  // 13 = T.STONES (stone causeway, walkable)
  // 14 = T.PLAZA (Charizard's caldera platform, walkable)
  const tiles = [
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12],
    [12,12,11,11,11,11, 0,11,11,14,14,14,14,14,11, 0,11,11,11,11,12,12],
    [12,11,11,14,14,11, 0,11,14,14,14,14,14,14,11, 0,11,14,14,11,11,12],
    [12,11,14,14,14,11, 7,13,14,14,14,14,14,14,13, 7,11,14,14,14,11,12],
    [12,11,11,13,11,11, 0,11,14,14,14,14,14,14,11, 0,11,11,13,11,11,12],
    [12,11, 2,13, 2,11, 0,11,11,14,14,14,14,11,11, 0,11, 2,13, 2,11,12],
    [12,11, 4, 4, 4, 2, 0, 2,11,11,13,13,11,11, 2, 0, 2, 4, 4, 4,11,12],
    [12,11, 4, 4, 4, 2, 7,13,13,13,14,14,13,13,13, 7, 2, 4, 4, 4,11,12],
    [12,11, 4, 4, 4, 2, 0, 2,11,14,14,14,14,11, 2, 0, 2, 4, 4, 4,11,12],
    [12,11, 2, 4, 4, 2, 0, 2,11,11,13,13,11,11, 2, 0, 2, 4, 4, 2,11,12],
    [12,11, 2,13, 2,11, 0,11,11,11,13,13,11,11,11, 0,11, 2,13, 2,11,12],
    [12,11,11,13,11,11, 7,13,13,11,13,13,11,13,13, 7,11,11,13,11,11,12],
    [12,11, 4, 4,11,11, 0,11,11,11,14,14,11,11,11, 0,11,11, 4, 4,11,12],
    [12,11,11,11,11, 2, 2,11,11,14,14,14,14,11,11, 2, 2,11,11,11,11,12],
    [12,11,11, 2, 2,11,11,11,11,14,14,14,14,11,11,11,11, 2, 2,11,11,12],
    [12,11,11,11,11,11,11,11,13,13,14,14,14,13,13,11,11,11,11,11,11,12],
    [12,12,11,11,11,11,11,11,11,11,14,14,14,11,11,11,11,11,11,11,12,12],
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]
  ];

  const def = {
    id: 'submap_16',
    index: 16,
    key: 'magma_chamber',
    name: 'Volcano Magma Chamber',
    emoji: '🌋',
    zoneId: 13,
    color: '#ef4444',
    paletteId: 36,
    musicZone: 13,
    borderTile: 12,
    width: W,
    height: H,
    entrance: {
      x: 104,
      y: 129,
      kind: 'subportal',
      style: 'lava_tube',
      label: 'Volcano Magma Chamber'
    },
    entry: { x: 11, y: 15, dir: 3 },
    exit: {
      x: 11,
      y: 16,
      kind: 'exitmat',
      style: 'lava_tube',
      label: 'Exit to Kanto Bright Meadows'
    },
    palette: {
      g: '#5c2418', gd: '#3d150d', gl: '#7c3222',
      t1: '#ef4444', t2: '#f97316', t3: '#facc15',
      p: '#9a3412', pd: '#7c2d12', pl: '#c2410c',
      sand: '#fdba74', sandd: '#f97316',
      tree: '#7f1d1d', treed: '#450a0a', treel: '#b91c1c',
      cliff: '#3b150e', cliffd: '#240b06', cliffl: '#5c2418',
      floor: '#451a12', floord: '#2e100a',
      plaza: '#ea580c', plazad: '#c2410c', plazal: '#fb923c'
    },
    tiles,
    decals: [
      { x: 10, y: 3, d: 11 }, { x: 12, y: 3, d: 11 },
      { x: 9, y: 4, d: 12 },  { x: 13, y: 4, d: 12 },
      { x: 11, y: 6, d: 10 }, { x: 10, y: 8, d: 11 }, { x: 12, y: 8, d: 11 },
      { x: 4, y: 5, d: 9 },   { x: 17, y: 5, d: 9 },
      { x: 4, y: 10, d: 9 },  { x: 17, y: 10, d: 9 },
      { x: 10, y: 13, d: 10 },{ x: 12, y: 13, d: 10 },
      { x: 7, y: 15, d: 9 },  { x: 15, y: 15, d: 9 }
    ],
    props: [
      {
        kind: 'altar', x: 11, y: 2, w: 1, h: 1,
        title: 'Magma Core Altar', name: 'Magma Core Altar',
        msg: '🌋 An ancient obsidian altar pulsing with the primordial heat of the volcano.',
        text: '🌋 An ancient obsidian altar pulsing with the primordial heat of the volcano.'
      },
      {
        kind: 'brazier', x: 8, y: 3, w: 1, h: 1,
        title: 'Caldera Flame Brazier', name: 'Caldera Flame Brazier',
        msg: '🔥 Crimson magma flames roar inside a carved basalt bowl.',
        text: '🔥 Crimson magma flames roar inside a carved basalt bowl.'
      },
      {
        kind: 'brazier', x: 13, y: 3, w: 1, h: 1,
        title: 'Caldera Flame Brazier', name: 'Caldera Flame Brazier',
        msg: '🔥 Crimson magma flames roar inside a carved basalt bowl.',
        text: '🔥 Crimson magma flames roar inside a carved basalt bowl.'
      },
      {
        kind: 'brazier', x: 9, y: 15, w: 1, h: 1,
        title: 'Gate Flame Brazier', name: 'Gate Flame Brazier',
        msg: '🔥 Twin volcanic braziers light the stone causeway into the Magma Chamber.',
        text: '🔥 Twin volcanic braziers light the stone causeway into the Magma Chamber.'
      },
      {
        kind: 'brazier', x: 13, y: 15, w: 1, h: 1,
        title: 'Gate Flame Brazier', name: 'Gate Flame Brazier',
        msg: '🔥 Twin volcanic braziers light the stone causeway into the Magma Chamber.',
        text: '🔥 Twin volcanic braziers light the stone causeway into the Magma Chamber.'
      },
      {
        kind: 'pillar', x: 8, y: 6, w: 1, h: 1,
        title: 'Basalt Column', name: 'Basalt Column',
        msg: '🏛️ A hexagonal obsidian pillar etched with ancient fire-tamer markings.',
        text: '🏛️ A hexagonal obsidian pillar etched with ancient fire-tamer markings.'
      },
      {
        kind: 'pillar', x: 13, y: 6, w: 1, h: 1,
        title: 'Basalt Column', name: 'Basalt Column',
        msg: '🏛️ A hexagonal obsidian pillar etched with ancient fire-tamer markings.',
        text: '🏛️ A hexagonal obsidian pillar etched with ancient fire-tamer markings.'
      },
      {
        kind: 'pillar', x: 8, y: 10, w: 1, h: 1,
        title: 'Scorched Pillar', name: 'Scorched Pillar',
        msg: '🏛️ Glowing veins of ember gold wind up this volcanic stone column.',
        text: '🏛️ Glowing veins of ember gold wind up this volcanic stone column.'
      },
      {
        kind: 'pillar', x: 13, y: 10, w: 1, h: 1,
        title: 'Scorched Pillar', name: 'Scorched Pillar',
        msg: '🏛️ Glowing veins of ember gold wind up this volcanic stone column.',
        text: '🏛️ Glowing veins of ember gold wind up this volcanic stone column.'
      },
      {
        kind: 'statue', x: 3, y: 1, w: 1, h: 1,
        title: 'Charizard Flame Statue', name: 'Charizard Flame Statue',
        msg: '🐉 A hand-carved obsidian statue honoring the winged guardian of the caldera.',
        text: '🐉 A hand-carved obsidian statue honoring the winged guardian of the caldera.'
      },
      {
        kind: 'statue', x: 18, y: 1, w: 1, h: 1,
        title: 'Volcano Guardian Statue', name: 'Volcano Guardian Statue',
        msg: '🌋 Warm golden embers shimmer around the statue\'s stone wings.',
        text: '🌋 Warm golden embers shimmer around the statue\'s stone wings.'
      },
      {
        kind: 'rock', x: 2, y: 14, w: 1, h: 1,
        title: 'Magma Core Boulder', name: 'Magma Core Boulder',
        msg: '🪨 Molten orange fissures glow beneath the dark basalt crust.',
        text: '🪨 Molten orange fissures glow beneath the dark basalt crust.'
      },
      {
        kind: 'rock', x: 19, y: 14, w: 1, h: 1,
        title: 'Sulfur Ember Rock', name: 'Sulfur Ember Rock',
        msg: '🪨 Warm volcanic steam rises from crystalline sulfur seams.',
        text: '🪨 Warm volcanic steam rises from crystalline sulfur seams.'
      },
      {
        kind: 'sign', x: 8, y: 14, w: 1, h: 1,
        title: 'Blaine\'s Volcano Quiz Board', name: 'Blaine\'s Volcano Quiz Board',
        msg: '🌋 "Quiz Time! Cross the basalt bridges to discover ember-ash Critters, or march north to the Caldera Plaza to face Magma Core Guardian Charizard!"',
        text: '🌋 "Quiz Time! Cross the basalt bridges to discover ember-ash Critters, or march north to the Caldera Plaza to face Magma Core Guardian Charizard!"'
      }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 2, star: 2, berry: 3, gold: 160 } },
      { x: 18, y: 3, loot: { master: 1, rainbow: 2, gold: 200 } }
    ],
    npc: {
      id: 'sub_npc_16',
      name: 'Volcano Tamer Blaine',
      look: 'guard',
      x: 14,
      y: 14,
      lines: [
        'Hah! Welcome to the Volcano Magma Chamber, Chuyu! Time for a red-hot volcanic quiz! 🌋🔥',
        'Question: What shines brighter than molten lava? A Trainer whose heart burns with friendship for their Critters!',
        'Bingo! You passed with flying embers! Take these fire-forged crystals before challenging Magma Core Guardian Charizard!'
      ],
      gift: { rainbow: 2, star: 2, berry: 4, gold: 150 },
      after: 'Magma Core Guardian Charizard is waiting atop the glowing caldera platform to the north! Better have Burn Heal ready! 🌋🐉'
    },
    wildPool: {
      lv: [16, 21],
      maxWilds: 4,
      table: [['charmander', 30], ['pikachu', 20], ['meowth', 18], ['gengar', 17], ['charizard', 15]]
    },
    boss: {
      key: 'boss_submap_16',
      sp: 'charizard',
      lv: 24,
      x: 11,
      y: 4,
      title: 'Magma Core Guardian Charizard',
      intro: '🌋🐉 Magma Core Guardian Charizard spreads its fiery wings atop the caldera platform and unleashes a spiral of golden embers!',
      winLines: ['Magma Core Guardian Charizard salutes Chuyu with a triumphant skyward flame and bestows the Caldera Core Treasure! 🌋🌟'],
      reward: { master: 1, rainbow: 3, berry: 4, gold: 240 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
