'use strict';
// js/submaps/submap_25.js — Map 25: Hacker's Command-Block Glitch Arena (Zone 19)
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
    id: 'submap_25',
    index: 25,
    key: 'maizen_glitch_arena',
    name: "Hacker's Command-Block Glitch Arena",
    emoji: '💻',
    zoneId: 19,
    color: '#22c55e',
    paletteId: 45,
    musicZone: 19,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 89, y: 263, kind: 'subportal', style: 'rift', label: "Hacker's Command-Block Glitch Arena" },
    entry: { x: 13, y: 17, dir: 3 },
    exit: { x: 13, y: 18, kind: 'exitmat', style: 'rift', label: 'Exit to Skyblock Keep' },
    palette: {
      g: '#052e16', gd: '#022c22', gl: '#14532d',
      t1: '#22c55e', t2: '#eab308', t3: '#6366f1',
      p: '#4ade80', pd: '#16a34a', pl: '#86efac',
      sand: '#dcfce7', sandd: '#86efac',
      tree: '#15803d', treed: '#166534', treel: '#4ade80',
      cliff: '#090d16', cliffd: '#020617', cliffl: '#1e293b',
      floor: '#111827', floord: '#1f2937',
      plaza: '#166534', plazad: '#14532d', plazal: '#22c55e'
    },
    tiles,
    decals: [
      { x: 3, y: 2, d: 9 }, { x: 22, y: 2, d: 9 },
      { x: 12, y: 3, d: 9 }, { x: 14, y: 3, d: 9 }
    ],
    props: [
      { kind: 'origin_ring', x: 13, y: 2, w: 1, h: 1, title: 'Master Command Block', msg: '💻 Repeating Command Block executing `/give @a rainbow_capsule 99`!' },
      { kind: 'crystal_pillar', x: 11, y: 2, w: 1, h: 1, title: 'Matrix Code Pillar', msg: '🟢 Glowing streams of green 0s and 1s float upward.' },
      { kind: 'crystal_pillar', x: 15, y: 2, w: 1, h: 1, title: 'Herobrine Lightning Pylon', msg: '⚡ Crackling with friendly blue command-block lightning.' },
      { kind: 'arcade', x: 9, y: 6, w: 1, h: 1, title: 'WorldEdit Terminal', msg: '🖥️ "//set diamond_block" — The Masked Hacker\'s favorite build shortcut!' },
      { kind: 'arcade', x: 17, y: 6, w: 1, h: 1, title: 'Anti-Gravity Console', msg: '🖥️ Controls the floating Skyblock islands across Zone 19.' },
      { kind: 'sign', x: 9, y: 16, w: 1, h: 1, name: 'Command Terminal', title: 'Command Terminal', text: '💻 "/say Welcome to the Noob vs Pro vs Hacker Finals, Chuyu!"', msg: '💻 "/say Welcome to the Noob vs Pro vs Hacker Finals, Chuyu!"' }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 4, star: 2, berry: 5, gold: 260 } },
      { x: 22, y: 3, loot: { master: 1, rainbow: 3, berry: 5, gold: 280 } }
    ],
    npc: {
      id: 'sub_npc_25',
      name: 'Friendly Coder Kai',
      look: 'hacker_npc',
      x: 17,
      y: 16,
      lines: [
        'Welcome inside the Command-Block Glitch Arena, Chuyu! 💻🟢',
        'In every Noob vs Pro vs Hacker video, the Masked Glitch Hacker builds wild command-block contraptions just to surprise JJ and Mikey!',
        'Take this Command-Block supply pack and challenge him at the Master Command Block!'
      ],
      gift: { rainbow: 4, berry: 5, gold: 220 },
      after: ['Watch out for Cursed Herobrine ⚡ in the holographic grass patches too! 💻✨']
    },
    wildPool: {
      lv: [23, 28],
      maxWilds: 4,
      table: [['maizenhacker', 26], ['herobrine', 24], ['redstonegolem', 20], ['projj', 16], ['mutantmikey', 14]]
    },
    boss: {
      key: 'boss_submap_25',
      sp: 'maizenhacker',
      lv: 29,
      x: 13,
      y: 4,
      title: 'Masked Glitch Hacker',
      intro: '💻🟢 `010101!` The Masked Glitch Hacker summons a swirling ring of Command Blocks for the ultimate Noob vs Pro vs Hacker showdown!',
      winLines: ['"GG WP, Chuyu!!" The Masked Glitch Hacker tips his glowing neon mask and shares his Command Block secrets! 💻🏆'],
      reward: { master: 1, rainbow: 4, star: 3, berry: 5, gold: 320 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
