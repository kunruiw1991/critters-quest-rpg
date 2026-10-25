'use strict';
// js/submaps/submap_06.js — Map 06: Pyramid Pharaoh Tomb (Zone 6)
(() => {
  const W = 24, H = 18;
  // 18 rows × 24 cols:
  // 12 = T.CLIFF (outer sandstone tomb walls)
  // 11 = T.FLOOR (golden sandstone masonry floor)
  // 14 = T.PLAZA (royal sarcophagus hall & sun causeway)
  //  2 = T.SAND  (sunlit desert sand chambers)
  //  1 = T.SHALLOW (sacred subterranean oasis pools)
  //  4 = T.TALL  (32 desert papyrus reed tiles for wild encounters)
  const tiles = [
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12],
    [12,11,11,11,11,11,11,11,11,14,14,14,14,14,14,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,14,14,14,14,14,14,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,14,14,14,14,14,14,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,14,14,14,14,14,14,11,11,11,11,11,11,11,11,12],
    [12,11, 2, 1, 1, 1, 2,11,11,14,14,14,14,14,14,11,11, 2, 1, 1, 1, 2,11,12],
    [12,11, 2, 1, 1, 1, 2,11,11,14,14,14,14,14,14,11,11, 2, 1, 1, 1, 2,11,12],
    [12,11, 2, 2, 2, 2, 2, 2,11,14,14,14,14,14,14,11, 2, 2, 2, 2, 2, 2,11,12],
    [12,11, 2, 4, 4, 4, 4, 2,11,14,14,14,14,14,14,11, 2, 4, 4, 4, 4, 2,11,12],
    [12,11, 2, 4, 4, 4, 4, 2,11,14,14,14,14,14,14,11, 2, 4, 4, 4, 4, 2,11,12],
    [12,11, 2, 4, 4, 4, 4, 2,11,14,14,14,14,14,14,11, 2, 4, 4, 4, 4, 2,11,12],
    [12,11, 2, 4, 4, 4, 4, 2,11,14,14,14,14,14,14,11, 2, 4, 4, 4, 4, 2,11,12],
    [12,11, 2, 2, 2, 2, 2, 2,11,14,14,14,14,14,14,11, 2, 2, 2, 2, 2, 2,11,12],
    [12,11,11,11,11,11,11,11,11,14,14,14,14,14,14,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,14,14,14,14,14,14,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,14,14,14,14,14,14,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,14,14,14,14,14,14,11,11,11,11,11,11,11,11,12],
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]
  ];
  const def = {
    id: 'submap_06',
    index: 6,
    key: 'pharaoh_tomb',
    name: 'Pyramid Pharaoh Tomb',
    emoji: '🏺',
    zoneId: 6,
    color: '#fbbf24',
    paletteId: 26,
    musicZone: 6,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 15, y: 11, kind: 'subportal', style: 'tomb', label: 'Pyramid Pharaoh Tomb' },
    entry: { x: 12, y: 15, dir: 3 },
    exit: { x: 12, y: 16, kind: 'exitmat', style: 'tomb', label: 'Exit to Golden Sunbaked Canyon' },
    palette: {
      g: '#d4a853', gd: '#b88d3b', gl: '#ebd875',
      t1: '#e09f3e', t2: '#b57b24', t3: '#f5be5b',
      p: '#f2d08a', pd: '#d6b269', pl: '#fae3b0',
      sand: '#e8bc72', sandd: '#cc9e54',
      tree: '#8ca83e', treed: '#688228', treel: '#b2cf5c',
      cliff: '#8c5828', cliffd: '#633c18', cliffl: '#b5783e',
      floor: '#c99b52', floord: '#ab7e38',
      plaza: '#f5c542', plazad: '#d4a324', plazal: '#ffe07d'
    },
    tiles,
    decals: [
      { x: 5, y: 3, d: 9 }, { x: 18, y: 3, d: 9 },
      { x: 11, y: 3, d: 9 }, { x: 13, y: 3, d: 9 },
      { x: 12, y: 7, d: 9 }, { x: 12, y: 11, d: 9 },
      { x: 5, y: 14, d: 9 }, { x: 18, y: 14, d: 9 }
    ],
    props: [
      { kind: 'throne', x: 12, y: 2, w: 1, h: 1, title: 'Golden Sun Throne', msg: 'An ancient throne of solid sun-gold, carved with solar wings and royal cartouches.' },
      { kind: 'altar', x: 10, y: 2, w: 1, h: 1, title: 'Altar of the Dawn', msg: 'Offerings of desert lotus and sunstones glimmer atop this ritual altar.' },
      { kind: 'altar', x: 14, y: 2, w: 1, h: 1, title: 'Altar of the Horizon', msg: 'Sacred hieroglyphs bless travelers who brave the shifting sands with pure hearts.' },
      { kind: 'statue', x: 7, y: 2, w: 1, h: 1, title: 'Jackal Guardian Statue', msg: 'A sandstone sentinel watching over the western royal treasure chamber.' },
      { kind: 'statue', x: 16, y: 2, w: 1, h: 1, title: 'Falcon Guardian Statue', msg: 'A gilded falcon statue whose ruby eyes reflect the warm torchlight.' },
      { kind: 'pillar', x: 8, y: 4, w: 1, h: 1, title: 'Hieroglyph Pillar', msg: 'Carved reliefs depict DogDay, Sunny, and Superstar KickinChicken uniting the desert oasis.' },
      { kind: 'pillar', x: 16, y: 4, w: 1, h: 1, title: 'Hieroglyph Pillar', msg: 'Ancient glyphs tell of the Solar Star that shines upon Rainbow Island.' },
      { kind: 'brazier', x: 10, y: 5, w: 1, h: 1, title: 'Eternal Sun Brazier', msg: 'Golden flames dance without smoke, lit since the age of the first Pharaoh.' },
      { kind: 'brazier', x: 14, y: 5, w: 1, h: 1, title: 'Eternal Sun Brazier', msg: 'Warm amber fire illuminates the royal sarcophagus causeway.' },
      { kind: 'pillar', x: 8, y: 9, w: 1, h: 1, title: 'Sandstone Obelisk', msg: 'A towering sandstone column etched with the Royal Sun Disk.' },
      { kind: 'pillar', x: 15, y: 9, w: 1, h: 1, title: 'Sandstone Obelisk', msg: 'Inscriptions record the trials of courage inside the Pyramid Pharaoh Tomb.' },
      { kind: 'brazier', x: 9, y: 14, w: 1, h: 1, title: 'Entrance Torch Brazier', msg: 'Welcoming flames guide explorers safely back toward the canyon portal.' },
      { kind: 'brazier', x: 15, y: 14, w: 1, h: 1, title: 'Entrance Torch Brazier', msg: 'Twin braziers mark the sacred threshold of the Pharaohs.' }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 2, star: 2, gold: 160 } },
      { x: 20, y: 3, loot: { berry: 4, rainbow: 1, star: 2, gold: 150 } }
    ],
    npc: {
      id: 'sub_npc_06',
      name: 'Explorer Nile',
      look: 'scholar',
      x: 16,
      y: 13,
      lines: [
        'Welcome to the Pyramid Pharaoh Tomb! These golden sandstone halls and subterranean oasis pools have slumbered beneath the canyon for centuries! 🏺☀️',
        'The murals along the Royal Sarcophagus Causeway tell of ancient Critter guardians who danced under the desert sun.',
        'Please take these expedition supplies before challenging the Sun Throne up north!'
      ],
      gift: { rainbow: 2, berry: 3, star: 2, gold: 120 },
      after: ['Pharaoh Guardian Superstar awaits before the Golden Sun Throne at the north end of the causeway! 🌟🏺']
    },
    wildPool: {
      lv: [9, 13],
      maxWilds: 4,
      table: [['dogday', 35], ['sunny', 30], ['kickin', 25], ['superstar', 10]]
    },
    boss: {
      key: 'boss_submap_06',
      sp: 'superstar',
      lv: 16,
      x: 12,
      y: 4,
      title: 'Pharaoh Guardian Superstar',
      intro: '🌟 Pharaoh Guardian Superstar KickinChicken strikes a dazzling golden pose before the Sun Throne! Ready for a royal desert showdown?',
      winLines: [
        'Superstar KickinChicken gives a thumbs-up salute and bestows the Pharaoh\'s Solar Blessing! 🏺🌟',
        'The ancient hieroglyphs along the causeway glow with warm golden light!'
      ],
      reward: { rainbow: 3, berry: 3, star: 2, gold: 180 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();

