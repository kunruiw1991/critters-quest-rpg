'use strict';
// js/submaps/submap_24.js — Map 24: Dr. Craft's Giant Potion & Portal Lab (Zone 18)
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
    id: 'submap_24',
    index: 24,
    key: 'maizen_potion_lab',
    name: "Dr. Craft's Giant Potion & Portal Lab",
    emoji: '🧪',
    zoneId: 18,
    color: '#10b981',
    paletteId: 44,
    musicZone: 18,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 64, y: 263, kind: 'subportal', style: 'rift', label: "Dr. Craft's Giant Potion Lab" },
    entry: { x: 13, y: 17, dir: 3 },
    exit: { x: 13, y: 18, kind: 'exitmat', style: 'rift', label: 'Exit to Science Canyon' },
    palette: {
      g: '#064e3b', gd: '#022c22', gl: '#047857',
      t1: '#4ade80', t2: '#a855f7', t3: '#38bdf8',
      p: '#6ee7b7', pd: '#34d399', pl: '#a7f3d0',
      sand: '#d1fae5', sandd: '#6ee7b7',
      tree: '#10b981', treed: '#059669', treel: '#34d399',
      cliff: '#064e3b', cliffd: '#022c22', cliffl: '#047857',
      floor: '#ecfdf5', floord: '#d1fae5',
      plaza: '#a7f3d0', plazad: '#6ee7b7', plazal: '#ecfdf5'
    },
    tiles,
    decals: [
      { x: 3, y: 2, d: 9 }, { x: 22, y: 2, d: 9 },
      { x: 12, y: 3, d: 9 }, { x: 14, y: 3, d: 9 }
    ],
    props: [
      { kind: 'cauldron_pot', x: 13, y: 2, w: 1, h: 1, title: 'Mega Emerald Potion Vat', msg: '🧪 Bubbling with Dr. Craft\'s Super Mutant Turtle Elixir! Smells like lime soda!' },
      { kind: 'mirror_arch', x: 11, y: 2, w: 1, h: 1, title: 'Shrink-Ray Portal', msg: '🔬 A glowing portal from the Maizen Giant vs Tiny Challenge!' },
      { kind: 'mirror_arch', x: 15, y: 2, w: 1, h: 1, title: 'Dimension Portal', msg: '🌌 A swirling dimensional frame calibrated by Dr. Craft.' },
      { kind: 'bookshelf', x: 9, y: 4, w: 1, h: 1, title: 'Potion Recipe Encyclopedia', msg: '📚 "Chapter 92: How to turn a normal turtle into Super Mutant Mikey!"' },
      { kind: 'bookshelf', x: 17, y: 4, w: 1, h: 1, title: 'Redstone Robotics Notes', msg: '📚 Detailed schematics for friendly Iron & Redstone Golems.' },
      { kind: 'sign', x: 9, y: 16, w: 1, h: 1, name: 'Lab Safety Sign', title: 'Lab Safety Sign', text: '🧪 "Caution: Do NOT mistake the Emerald Mega-Potion for apple juice! — Dr. Craft"', msg: '🧪 "Caution: Do NOT mistake the Emerald Mega-Potion for apple juice! — Dr. Craft"' }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 3, star: 2, berry: 5, gold: 220 } },
      { x: 22, y: 3, loot: { rainbow: 4, star: 2, berry: 5, gold: 240 } }
    ],
    npc: {
      id: 'sub_npc_24',
      name: 'Dr. Craft',
      look: 'scientist_npc',
      x: 17,
      y: 16,
      lines: [
        'EUREKA! You stepped right through my lab portal, Chuyu! 🧪🔬',
        'Mikey thought my glowing green Mega-Potion was lime soda and drank the whole flask in one gulp!',
        'Now he\'s flexing as ✨ Super Mutant Mikey 🐢 up at the Potion Vat — take these capsules and calm him down!'
      ],
      gift: { rainbow: 4, berry: 5, gold: 180 },
      after: ['Once you befriend Super Mutant Mikey, he\'s the strongest turtle guardian ever! 🐢💪']
    },
    wildPool: {
      lv: [20, 26],
      maxWilds: 4,
      table: [['scientist', 28], ['mutantmikey', 18], ['redstonegolem', 20], ['bananacat', 18], ['maizenwolf', 16]]
    },
    boss: {
      key: 'boss_submap_24',
      sp: 'mutantmikey',
      lv: 27,
      x: 13,
      y: 4,
      title: 'Super Mutant Mikey',
      intro: '🐢💚 "TURTLE POWER!!" Super Mutant Mikey flexes his glowing emerald shell and challenges your squad to a friendly strength test!',
      winLines: ['"Woohoo!! You\'re super strong, Chuyu!!" Super Mutant Mikey high-fives your team! 🐢💪'],
      reward: { rainbow: 4, star: 3, berry: 6, gold: 280 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
