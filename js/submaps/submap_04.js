'use strict';
// js/submaps/submap_04.js — Map 04: Sea-Bottom Coral City (Zone 3)
(() => {
  const W = 24, H = 18;
  // Tile legend:
  // 0 = T.DEEP (abyssal trench border), 1 = T.SHALLOW (tidal lagoon),
  // 2 = T.SAND (golden seabed lane), 4 = T.TALL (luminous sea-kelp beds),
  // 6 = T.FLOWERS (sea-anemone carpet), 7 = T.BRIDGE_H (living coral bridge),
  // 12 = T.CLIFF (coral reef wall corner), 14 = T.PLAZA (mother-of-pearl plaza)
  const tiles = [
    [12, 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12],
    [0,  2,  2,  2,  2,  6,  6,  2, 14, 14, 14, 14, 14, 14, 14, 14,  2,  6,  6,  2,  2,  2,  2,  0],
    [0,  2, 14, 14, 14,  2,  2,  2, 14,  6, 14, 14, 14, 14,  6, 14,  2,  2,  2, 14, 14, 14,  2,  0],
    [0,  2, 14, 14, 14,  2,  4,  4, 14, 14, 14,  6, 14,  6, 14, 14,  4,  4,  2, 14, 14, 14,  2,  0],
    [0,  2, 14, 14, 14,  2,  4,  4, 14,  6, 14, 14, 14, 14,  6, 14,  4,  4,  2, 14, 14, 14,  2,  0],
    [0,  2,  2,  2,  2,  2,  4,  4, 14, 14, 14, 14, 14, 14, 14, 14,  4,  4,  2,  2,  2,  2,  2,  0],
    [0,  2,  4,  4,  2,  6,  2,  2,  2, 14, 14, 14, 14, 14, 14,  2,  2,  2,  6,  2,  4,  4,  2,  0],
    [0,  2,  4,  4,  1,  1,  1,  1,  2, 14,  2, 14, 14, 14,  2, 14,  2,  1,  1,  1,  4,  4,  2,  0],
    [0,  2,  2,  2,  7,  7,  7,  7,  7, 14, 14, 14, 14, 14, 14,  7,  7,  7,  7,  7,  2,  2,  2,  0],
    [0,  2,  1,  1,  1,  1,  1,  1,  2,  2, 14, 14, 14, 14,  2,  2,  1,  1,  1,  1,  1,  1,  2,  0],
    [0,  2,  1,  1,  1, 14, 14,  1,  1,  2, 14,  6, 14,  6, 14,  2,  1, 14, 14,  1,  1,  1,  2,  0],
    [0,  2,  1,  1,  1,  1,  1,  1,  7,  7, 14, 14, 14, 14,  7,  7,  1,  1,  1,  1,  1,  1,  2,  0],
    [0,  2,  4,  4,  4,  2,  2,  2,  2,  2, 14, 14, 14, 14,  2,  2,  2,  2,  2,  4,  4,  4,  2,  0],
    [0,  2,  4,  4,  4,  2,  6,  2, 14, 14, 14, 14, 14, 14, 14, 14, 14,  2,  6,  4,  4,  4,  2,  0],
    [0,  2,  2,  2,  2,  2,  2,  2,  2, 14, 14, 14, 14, 14, 14, 14,  2,  2,  2,  2,  2,  2,  2,  0],
    [0,  2,  1,  1,  2,  6,  2,  2,  2,  2, 14, 14, 14, 14, 14,  2,  2,  2,  6,  2,  1,  1,  2,  0],
    [0,  2,  2,  2,  2,  2,  2,  2,  2,  2, 14, 14, 14, 14, 14,  2,  2,  2,  2,  2,  2,  2,  2,  0],
    [12, 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12]
  ];

  const def = {
    id: 'submap_04',
    index: 4,
    key: 'coral_city',
    name: 'Sea-Bottom Coral City',
    emoji: '🐚',
    zoneId: 3,
    color: '#38bdf8',
    paletteId: 24,
    musicZone: 3,
    borderTile: 0,
    width: W,
    height: H,
    entrance: { x: 98, y: 67, kind: 'subportal', style: 'whirlpool', label: 'Sea-Bottom Coral City' },
    entry: { x: 12, y: 15, dir: 3 },
    exit: { x: 12, y: 16, kind: 'exitmat', style: 'whirlpool', label: 'Surface to Sapphire Coral Lagoon' },
    palette: {
      g: '#2998b5', gd: '#1d7a94', gl: '#4dc0de',
      t1: '#ff7eb6', t2: '#48cae4', t3: '#ffd166',
      p: '#ade8f4', pd: '#90e0ef', pl: '#caf0f8',
      sand: '#f7e1b5', sandd: '#e0c590',
      tree: '#ef476f', treed: '#c9184a', treel: '#ff8fa3',
      cliff: '#023e8a', cliffd: '#03045e', cliffl: '#0077b6',
      floor: '#48bfe3', floord: '#0096c7',
      plaza: '#fcefb4', plazad: '#f5dc82', plazal: '#fff8d6'
    },
    tiles,
    decals: [
      { x: 2, y: 2, d: 1 }, { x: 5, y: 5, d: 2 }, { x: 8, y: 6, d: 1 },
      { x: 15, y: 6, d: 2 }, { x: 18, y: 5, d: 1 }, { x: 21, y: 2, d: 2 },
      { x: 4, y: 9, d: 9 }, { x: 7, y: 9, d: 9 }, { x: 17, y: 9, d: 9 },
      { x: 20, y: 9, d: 9 }, { x: 3, y: 11, d: 9 }, { x: 20, y: 11, d: 9 },
      { x: 6, y: 14, d: 1 }, { x: 17, y: 14, d: 2 }, { x: 8, y: 16, d: 1 },
      { x: 15, y: 16, d: 2 }, { x: 12, y: 9, d: 3 }, { x: 12, y: 12, d: 4 }
    ],
    props: [
      {
        kind: 'coral_arch', x: 12, y: 2, w: 1, h: 1,
        title: 'Royal Coral Arch',
        msg: 'An iridescent arch of living pink and sapphire coral framing King Bubba\'s Pearl Throne.'
      },
      {
        kind: 'pillar', x: 9, y: 3, w: 1, h: 1,
        title: 'Mother-of-Pearl Pillar',
        msg: 'A fluted column inlaid with luminous nacre and spiral sea-shells.'
      },
      {
        kind: 'pillar', x: 15, y: 3, w: 1, h: 1,
        title: 'Mother-of-Pearl Pillar',
        msg: 'Tiny neon damselfish dart playfully around the carved coral capital.'
      },
      {
        kind: 'statue', x: 9, y: 7, w: 1, h: 1,
        title: 'Sapphire Sea-Guardian Statue',
        msg: 'A carved coral monument honoring the ancient protectors of the Sapphire Lagoon.'
      },
      {
        kind: 'statue', x: 15, y: 7, w: 1, h: 1,
        title: 'Sapphire Sea-Guardian Statue',
        msg: 'Shimmering bubbles rise gently from the base of the sea-stone sculpture.'
      },
      {
        kind: 'fountain', x: 6, y: 10, w: 1, h: 1,
        title: 'West Tidal Bubble Geyser',
        msg: 'Warm, oxygen-rich currents fountain upward in a curtain of silvery pearls!'
      },
      {
        kind: 'fountain', x: 18, y: 10, w: 1, h: 1,
        title: 'East Tidal Bubble Geyser',
        msg: 'Water-type Critters gather around the soothing hydro-thermal current to play.'
      },
      {
        kind: 'lantern', x: 10, y: 14, w: 1, h: 1,
        title: 'Bioluminescent Pearl Lantern',
        msg: 'A giant clam-shell lantern housing a softly glowing deep-sea pearl.'
      },
      {
        kind: 'lantern', x: 14, y: 14, w: 1, h: 1,
        title: 'Bioluminescent Pearl Lantern',
        msg: 'Its warm aqua glow guides divers safely back to the whirlpool portal.'
      }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 2, berry: 3, star: 1, gold: 110 } },
      { x: 20, y: 3, loot: { rainbow: 2, star: 2, berry: 2, gold: 130 } }
    ],
    npc: {
      id: 'sub_npc_04',
      name: 'Coral Diver Marina',
      look: 'sailor',
      x: 16,
      y: 13,
      lines: [
        'Blub blub! Welcome to the sparkling air-dome of Sea-Bottom Coral City! 🐚🌊',
        'Our sandy sea-lanes and coral bridges connect the West and East Tidal Lagoons to the grand Pearl Promenade.',
        'Take these sea-polished Rainbow Capsules and sweet kelp-berries for your underwater adventure!'
      ],
      gift: { rainbow: 2, berry: 3, star: 1, gold: 80 },
      after: [
        'Coral King Bubba presides over the Pearl Throne just up north! 🐘🐚',
        'If you rustle through the swaying sea-kelp beds along the lagoons, friendly JJ, Poppy, Bubba, and Marill love to say hello!'
      ]
    },
    wildPool: {
      lv: [6, 10],
      maxWilds: 4,
      table: [['jj', 35], ['poppy', 30], ['bubba', 25], ['marill', 10]]
    },
    boss: {
      key: 'boss_submap_04',
      sp: 'bubba',
      lv: 12,
      x: 12,
      y: 4,
      title: 'Coral King Bubba',
      intro: '🐚 Coral King Bubba trumpets a joyful bubble fanfare from the Pearl Throne! "Let us test your wisdom and tidal harmony in a royal sea-floor match!"',
      winLines: [
        'Coral King Bubba applauds with a mighty splash and crowns Chuyu an Honorary Sovereign of the Sapphire Reef! 🐚👑',
        '"May the ocean currents always guide your Critter journey!"'
      ],
      reward: { rainbow: 2, star: 2, berry: 3, gold: 140 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();

