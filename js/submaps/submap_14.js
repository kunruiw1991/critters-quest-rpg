'use strict';
// js/submaps/submap_14.js — Map 14: Nightmare Funhouse Maze (Zone 12)
(() => {
  const W = 24, H = 18;
  // Tile legend:
  // 12 = T.CLIFF (border walls & mirror partitions)
  // 11 = T.FLOOR (checkerboard carnival floor)
  // 14 = T.PLAZA (grand funhouse stage, treasure daises & entry foyer)
  //  5 = T.PATH  (golden starlight maze lanes)
  //  4 = T.TALL  (twilight-velvet plushie patches, 32 tiles >= 14)
  //  6 = T.FLOWERS (velvet stage trim)
  const tiles = [
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12],
    [12,11,11,11,11,11,11,11, 6,14,14,14,14,14,14,14, 6,11,11,11,11,11,11,12],
    [12,11,14,14,14,11,11,11, 6,14,14,14,14,14,14,14, 6,11,11,14,14,14,11,12],
    [12,11,14,14, 5, 5, 5,11, 6,14,14,14,14,14,14,14, 6,11, 5, 5,14,14,11,12],
    [12,11,14,14,11,11, 5,11, 6,14,14,14,14,14,14,14, 6,11, 5,14,14,14,11,12],
    [12,11,11, 4, 4,11, 5,11, 6,14,14,14,14,14,14,14, 6,11, 5, 4, 4,11,11,12],
    [12,11,11, 4, 4,11, 5,11,11,14,14,14, 5,14,14,14,11,11, 5, 4, 4,11,11,12],
    [12,11,11,11,11,11, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,11,11,11,11,12],
    [12,11,11,14,11,11, 5,11,12,12,11,11, 5,11,11,12,12,11, 5,11,14,11,11,12],
    [12,11,11, 4, 4, 4, 5,11,11,11,14,11, 5,11,14,11,11,11, 5, 4, 4, 4,11,12],
    [12,11,11, 4, 4, 4, 5,11,11,14,11,14, 5,14,11,14,11,11, 5, 4, 4, 4,11,12],
    [12,11,11,11,11,11, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,11,11,11,11,12],
    [12,11,11,11, 4, 4, 4,11,11,12,12,11, 5,11,12,12,11, 4, 4, 4,11,11,11,12],
    [12,11,11,11, 4, 4, 4,11,11,11,11,11, 5,11,11,11,11, 4, 4, 4,11,11,11,12],
    [12,11,11,11,11,11, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,14,14, 5,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14, 5,14,14,11,14,14,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,14,11,11,11,11,11,11,11,11,12],
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]
  ];

  const def = {
    id: 'submap_14',
    index: 14,
    key: 'funhouse_maze',
    name: 'Nightmare Funhouse Maze',
    emoji: '🎪',
    zoneId: 12,
    color: '#c084fc',
    paletteId: 34,
    musicZone: 12,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 55, y: 133, kind: 'subportal', style: 'funhouse', label: 'Nightmare Funhouse Maze' },
    entry: { x: 12, y: 15, dir: 3 },
    exit: { x: 12, y: 16, kind: 'exitmat', style: 'funhouse', label: 'Exit to Nightmare Carnival' },
    palette: {
      g: '#3b1c54', gd: '#27103b', gl: '#522973',
      t1: '#c084fc', t2: '#f43f5e', t3: '#facc15',
      p: '#a855f7', pd: '#7e22ce', pl: '#d8b4fe',
      sand: '#fde047', sandd: '#eab308',
      tree: '#6b21a8', treed: '#4c1d95', treel: '#9333ea',
      cliff: '#2e1065', cliffd: '#1e0945', cliffl: '#4c1d95',
      floor: '#4c1d95', floord: '#3b0764',
      plaza: '#e879f9', plazad: '#c026d3', plazal: '#f5d0fe'
    },
    tiles,
    decals: [
      { x: 5, y: 2, d: 7 }, { x: 18, y: 2, d: 7 },
      { x: 10, y: 3, d: 11 }, { x: 14, y: 3, d: 11 },
      { x: 10, y: 5, d: 9 }, { x: 14, y: 5, d: 9 },
      { x: 7, y: 7, d: 5 }, { x: 17, y: 7, d: 5 },
      { x: 10, y: 9, d: 12 }, { x: 14, y: 9, d: 12 },
      { x: 8, y: 11, d: 7 }, { x: 16, y: 11, d: 7 },
      { x: 11, y: 14, d: 11 }, { x: 13, y: 14, d: 11 }
    ],
    props: [
      { kind: 'stage_light', x: 9, y: 2, w: 1, h: 1, title: 'Crimson Spotlight', msg: '🎪 A dazzling neon-violet stage spotlight illuminates Simon Smoke\'s mirror stage!' },
      { kind: 'stage_light', x: 15, y: 2, w: 1, h: 1, title: 'Starlight Spotlight', msg: '🎪 Glittering golden beams dance across the funhouse mirrors!' },
      { kind: 'banner_stand', x: 8, y: 4, w: 1, h: 1, title: 'Nightmare Big-Top Banner', msg: '🎪 A velvet carnival banner embroidered with smiling crescent moons and stars.' },
      { kind: 'banner_stand', x: 16, y: 4, w: 1, h: 1, title: 'Mirror-Maze Pennant', msg: '🎪 "Step Right Up to Simon Smoke\'s Grand Mirror Illusion!"' },
      { kind: 'arcade', x: 2, y: 8, w: 1, h: 1, title: 'Claw-Machine Arcade', msg: '🕹️ A blinking carnival claw machine overflowing with Baba Chops and Rabie Baby plushies!' },
      { kind: 'arcade', x: 21, y: 8, w: 1, h: 1, title: 'Whack-a-Critter Cabinet', msg: '🕹️ Icky Licky holds the all-time high score on this neon carnival arcade cabinet!' },
      { kind: 'cauldron', x: 2, y: 14, w: 1, h: 1, title: 'Cotton-Candy Cauldron', msg: '🍬 A bubbling carnival cauldron spinning clouds of glowing grape and cherry cotton candy!' },
      { kind: 'cauldron', x: 21, y: 14, w: 1, h: 1, title: 'Popcorn Cauldron', msg: '🍿 Sweet caramel-starlight kettle corn pops cheerfully inside the cauldron!' },
      { kind: 'lantern', x: 9, y: 15, w: 1, h: 1, title: 'Funhouse Paper Lantern', msg: '🏮 A warm purple carnival lantern welcomes visitors into the Mirror Maze.' },
      { kind: 'lantern', x: 15, y: 15, w: 1, h: 1, title: 'Funhouse Paper Lantern', msg: '🏮 A glowing magenta lantern marks the path back to the carnival midway.' },
      { kind: 'sign', x: 7, y: 15, w: 1, h: 1, name: 'Funhouse Mirror Sign', title: 'Funhouse Mirror Sign', text: '🎪 "Step right up! Follow the golden starlight lanes through the Mirror Maze—every Nightmare Critter inside just wants a hug and a snack!"', msg: '🎪 "Step right up! Follow the golden starlight lanes through the Mirror Maze—every Nightmare Critter inside just wants a hug and a snack!"' }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 2, star: 2, berry: 3, gold: 150 } },
      { x: 20, y: 3, loot: { rainbow: 2, star: 3, berry: 2, gold: 180 } }
    ],
    npc: {
      id: 'sub_npc_14',
      name: 'Ringmaster Trick',
      look: 'witch',
      x: 16,
      y: 14,
      lines: [
        'Roll up, roll up to the Nightmare Funhouse Maze, Chuyu! 🎪🎈',
        'Don\'t let the spooky mirrors fool you—Baba Chops, Rabie Baby, Icky Licky, and Maggie Mako are just playing carnival hide-and-seek!',
        'Take this prize bag of starlight treats before challenging Simon Smoke on the Grand Stage!'
      ],
      gift: { rainbow: 2, star: 2, berry: 4, gold: 120 },
      after: ['Mirror-Maze Ringmaster Simon Smoke is practicing his sparkly crimson smoke rings on the center stage! 🎪🐉']
    },
    wildPool: {
      lv: [16, 20],
      maxWilds: 4,
      table: [['baba', 18], ['icky', 16], ['rabie', 16], ['allister', 14], ['poe', 14], ['touille', 12], ['maggie', 10]]
    },
    boss: {
      key: 'boss_submap_14',
      sp: 'simon',
      lv: 22,
      x: 12,
      y: 4,
      title: 'Mirror-Maze Ringmaster Simon Smoke',
      intro: '🎪🐉 Mirror-Maze Ringmaster Simon Smoke swoops onto the center ring in a dazzling swirl of crimson carnival sparkles!',
      winLines: [
        'Simon Smoke takes a theatrical bow and hands Chuyu the Golden Big-Top VIP Ticket! 🎪🌟',
        '"Magnificent show, little Ringmaster! The Nightmare Carnival is yours to explore anytime!"'
      ],
      reward: { rainbow: 3, star: 3, berry: 4, gold: 200 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();

