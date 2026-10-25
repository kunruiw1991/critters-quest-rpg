'use strict';
// js/submaps/submap_17.js — Map 17: Johto Whirl Islands Abyss (Zone 14)
(() => {
  // 24 cols × 18 rows
  // Tile IDs: 0=DEEP, 1=SHALLOW, 2=SAND, 4=TALL, 7=BRIDGE_H, 11=FLOOR, 12=CLIFF, 13=STONES, 14=PLAZA
  const tiles = [
    [12,12,12,12,12,12, 0, 0,12,12,12,12,12,12,12,12, 0, 0,12,12,12,12,12,12],
    [12,12, 1, 1, 1, 1, 0, 1, 1,14,14,14,14,14,14, 1, 1, 0, 1, 1, 1, 1,12,12],
    [12, 1, 2, 2, 2, 2, 1, 1,14,14,14,14,14,14,14,14, 1, 1, 2, 2, 2, 2, 1,12],
    [12, 1, 2, 2, 2, 2, 1, 0, 1,14,14,14,14,14,14, 1, 0, 1, 2, 2, 2, 2, 1,12],
    [12, 1, 2, 2,13, 2, 1, 1, 1,14,14,14,14,14,14, 1, 1, 1, 2,13, 2, 2, 1,12],
    [ 0, 1, 2,13,13,13, 7, 7, 7,14,14,14,14,14,14, 7, 7, 7,13,13,13, 2, 1, 0],
    [ 0, 1, 2, 4, 4, 4, 1, 0, 1, 1,13,14,14,14,13, 1, 0, 1, 4, 4, 4, 2, 1, 0],
    [12, 1, 2, 4, 4, 4, 1, 1, 1, 1,13,13,14,13,13, 1, 1, 1, 4, 4, 4, 2, 1,12],
    [12, 1, 2, 4, 4, 4, 1, 0, 1, 1, 1,13,14,13, 1, 1, 0, 1, 4, 4, 4, 2, 1,12],
    [12, 1, 2, 4, 4, 4, 1, 1, 1, 1, 1,13,14,13, 1, 1, 1, 1, 4, 4, 4, 2, 1,12],
    [12, 1, 2, 2,13, 2, 1, 0, 1, 1,13,14,14,14,13, 1, 0, 1, 2,13, 2, 2, 1,12],
    [ 0, 1, 2,13,13,13, 7, 7, 7,13,13,14,14,14,13, 7, 7, 7,13,13,13, 2, 1, 0],
    [ 0, 1, 2, 2,13, 2, 2, 1, 1,11,13,13,14,13,13,11, 1, 2, 2,13, 2, 2, 1, 0],
    [12, 1, 2, 2,13,13,11,11,11,11,13,13,14,13,13,11,11,11,13,13, 2, 2, 1,12],
    [12, 1, 2,11,11,11,11,13,13,13,13,14,14,14,13,13,13,11,11,11,11, 2, 1,12],
    [12,12, 1, 1,11,11,11,11,13,13,13,14,14,14,13,13,11,11,11,11, 1, 1,12,12],
    [12,12,12, 1, 1, 1,11,11,11,13,13,14,14,14,13,11,11,11, 1, 1, 1,12,12,12],
    [12,12,12,12,12,12, 0, 0,12,12,12,12,12,12,12,12, 0, 0,12,12,12,12,12,12]
  ];

  const def = {
    id: 'submap_17',
    index: 17,
    key: 'whirl_islands',
    name: 'Johto Whirl Islands Abyss',
    emoji: '🌊',
    zoneId: 14,
    color: '#0284c7',
    paletteId: 37,
    musicZone: 14,
    borderTile: 12,
    width: 24,
    height: 18,
    entrance: {
      x: 20, y: 185,
      kind: 'subportal',
      style: 'whirlpool',
      label: 'Johto Whirl Islands Abyss'
    },
    entry: { x: 12, y: 15, dir: 3 },
    exit: {
      x: 12, y: 16,
      kind: 'exitmat',
      style: 'whirlpool',
      label: 'Exit to Johto Golden Autumn'
    },
    palette: {
      g: '#0c4a6e', gd: '#082f49', gl: '#0369a1',
      t1: '#38bdf8', t2: '#7dd3fc', t3: '#e0f2fe',
      p: '#0284c7', pd: '#0369a1', pl: '#38bdf8',
      sand: '#bae6fd', sandd: '#7dd3fc',
      tree: '#164e63', treed: '#083344', treel: '#0e7490',
      cliff: '#082f49', cliffd: '#041929', cliffl: '#0c4a6e',
      floor: '#155e75', floord: '#0e4152',
      plaza: '#38bdf8', plazad: '#0284c7', plazal: '#bae6fd'
    },
    tiles,
    decals: [
      { x: 11, y: 4, d: 8 },
      { x: 13, y: 4, d: 8 },
      { x: 12, y: 6, d: 8 },
      { x: 4, y: 4, d: 6 },
      { x: 19, y: 4, d: 6 },
      { x: 6, y: 11, d: 6 },
      { x: 17, y: 11, d: 6 },
      { x: 11, y: 13, d: 8 },
      { x: 13, y: 13, d: 8 },
      { x: 4, y: 13, d: 6 },
      { x: 20, y: 13, d: 6 }
    ],
    props: [
      {
        kind: 'altar', x: 12, y: 2, w: 1, h: 1,
        title: 'Silver Wing Altar',
        msg: '🪶 Ancient tidal runes shimmer upon the Silver Wing Altar where Lugia roosts.',
        name: 'Silver Wing Altar',
        text: '🪶 Ancient tidal runes shimmer upon the Silver Wing Altar where Lugia roosts.'
      },
      {
        kind: 'pillar', x: 9, y: 3, w: 1, h: 1,
        title: 'Whirlpool Sea Pillar',
        msg: '🌀 Carved with the swirling crests of the four Whirl Islands.',
        name: 'Whirlpool Sea Pillar',
        text: '🌀 Carved with the swirling crests of the four Whirl Islands.'
      },
      {
        kind: 'pillar', x: 15, y: 3, w: 1, h: 1,
        title: 'Whirlpool Sea Pillar',
        msg: '🌀 Sea-stone pillar humming with the deep ocean current.',
        name: 'Whirlpool Sea Pillar',
        text: '🌀 Sea-stone pillar humming with the deep ocean current.'
      },
      {
        kind: 'coral_arch', x: 10, y: 7, w: 1, h: 1,
        title: 'Bioluminescent Coral Arch',
        msg: '🌊 Luminous abyssal coral frames the sea-stone causeway to the Silver Wing Sanctuary.',
        name: 'Bioluminescent Coral Arch',
        text: '🌊 Luminous abyssal coral frames the sea-stone causeway to the Silver Wing Sanctuary.'
      },
      {
        kind: 'shrine', x: 5, y: 2, w: 1, h: 1,
        title: 'Tidal Shell Shrine',
        msg: '⛩️ Offerings of silver shells calm the roaring whirlpools of Johto.',
        name: 'Tidal Shell Shrine',
        text: '⛩️ Offerings of silver shells calm the roaring whirlpools of Johto.'
      },
      {
        kind: 'fountain', x: 19, y: 14, w: 1, h: 1,
        title: 'Abyssal Spring Basin',
        msg: '💧 Pure, restorative spring water wells up from the cavern floor.',
        name: 'Abyssal Spring Basin',
        text: '💧 Pure, restorative spring water wells up from the cavern floor.'
      }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 2, star: 2, berry: 4, gold: 180 } },
      { x: 20, y: 3, loot: { master: 1, rainbow: 2, gold: 220 } }
    ],
    npc: {
      id: 'sub_npc_17',
      name: 'Tidal Sage Hiro',
      look: 'elder',
      x: 15,
      y: 14,
      lines: [
        'Welcome to the Johto Whirl Islands Abyss, young traveler! 🌊🪶',
        'For centuries, the four whirlpools have guarded the Silver Wing Sanctuary where the Guardian of the Seas slumbers.',
        'Your Silver Wing gleams in harmony with the deep tide! Accept these ocean blessings for your journey ahead!'
      ],
      gift: { rainbow: 2, star: 2, berry: 4, gold: 160 },
      after: 'Abyssal Roost Guardian Lugia awaits upon the Silver Wing Sanctuary dais to the north! 🌊🕊️'
    },
    wildPool: {
      lv: [19, 25],
      maxWilds: 4,
      table: [['totodile', 25], ['marill', 25], ['umbreon', 20], ['suicune', 18], ['lugia', 12]]
    },
    boss: {
      key: 'boss_submap_17',
      sp: 'lugia',
      lv: 28,
      x: 12,
      y: 4,
      title: 'Abyssal Roost Guardian Lugia',
      intro: '🌊🕊️ Abyssal Roost Guardian Lugia spreads its luminous silver wings, parting the roaring whirlpools of the deep!',
      winLines: ['Lugia sings a resonant ocean melody that calms the abyssal tides and bestows a Silver Wing Blessing! 🌊✨'],
      reward: { master: 1, rainbow: 3, star: 2, berry: 4, gold: 280 }
    }
  };

  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();

