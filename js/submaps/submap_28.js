'use strict';
// js/submaps/submap_28.js — Map 28: Mommy Long Legs' Game Station Arena (Zone 20)
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
    [12,11,11, 4, 4, 4, 4,11, 6, 6, 6,14,14, 6, 6, 6,11, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4,11, 6, 6, 6,14,14, 6, 6, 6,11, 4, 4, 4, 4,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,14,14,14,14,14,14,14,14,11,11,11,11,11,11,11,12],
    [12,11,11, 4, 4, 4, 4,11,11,11,14,14,14,14,11,11,11, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4,11,11,11,14,14,14,14,11,11,11, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4,11,11,11,14,14,14,14,11,11,11, 4, 4, 4, 4,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]
  ];

  const def = {
    id: 'submap_28',
    index: 28,
    key: 'mommy_game_station',
    name: "Mommy Long Legs' Game Station Arena",
    emoji: '🕷️',
    zoneId: 20,
    color: '#ec4899',
    paletteId: 48,
    musicZone: 20,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 32, y: 300, kind: 'subportal', style: 'neon_door', label: "Mommy Long Legs' Game Station Arena" },
    entry: { x: 12, y: 15, dir: 3 },
    exit: { x: 12, y: 16, kind: 'exitmat', style: 'neon_door', label: 'Exit to Game Station Courtyard' },
    palette: {
      g: '#831843', gd: '#500724', gl: '#be185d',
      t1: '#f472b6', t2: '#facc15', t3: '#38bdf8',
      p: '#fbcfe8', pd: '#f9a8d4', pl: '#fdf2f8',
      sand: '#fce7f3', sandd: '#f9a8d4',
      tree: '#ec4899', treed: '#db2777', treel: '#f472b6',
      cliff: '#4a044e', cliffd: '#2e1065', cliffl: '#701a75',
      floor: '#fdf2f8', floord: '#fce7f3',
      plaza: '#fbcfe8', plazad: '#f472b6', plazal: '#ffffff'
    },
    tiles,
    decals: [
      { x: 3, y: 2, d: 19 }, { x: 20, y: 2, d: 19 },
      { x: 11, y: 3, d: 9 }, { x: 13, y: 3, d: 9 }
    ],
    props: [
      { kind: 'throne', x: 12, y: 2, w: 1, h: 1, title: "Mommy's Pink Web Balcony", msg: '🕷️ Woven from sparkly pink elastic silk overlooking all three Game Station mini-games!' },
      { kind: 'arcade', x: 10, y: 2, w: 1, h: 1, title: 'Musical Memory Drum Console', msg: '🥁 Bunzo Bunny cheers whenever you tap the glowing color buttons in rhythm!' },
      { kind: 'arcade', x: 14, y: 2, w: 1, h: 1, title: 'Statues Obstacle Course', msg: '🐛 PJ Pug-a-Pillar wiggles happily through the foam obstacle course!' },
      { kind: 'stage_light', x: 8, y: 4, w: 1, h: 1 },
      { kind: 'stage_light', x: 16, y: 4, w: 1, h: 1 },
      { kind: 'sign', x: 8, y: 14, w: 1, h: 1, name: 'Game Station Scoreboard', title: 'Game Station Scoreboard', text: '🕷️ "Round 1: Musical Memory · Round 2: Whack-a-Wuggy · Round 3: Friendly Showdown with Mommy Long Legs!"', msg: '🕷️ "Round 1: Musical Memory · Round 2: Whack-a-Wuggy · Round 3: Friendly Showdown with Mommy Long Legs!"' }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 3, star: 3, berry: 5, gold: 220 } },
      { x: 20, y: 3, loot: { rainbow: 4, star: 2, berry: 5, gold: 240 } }
    ],
    npc: {
      id: 'sub_npc_28',
      name: 'Doey the Doughman',
      look: 'doey_npc',
      x: 16,
      y: 14,
      lines: [
        'Tip of the bowler hat to ya!! Welcome to the Game Station Arena! 🎩🕷️',
        'Yarnaby, Pianosaurus, Bunzo Bunny, and PJ Pug-a-Pillar are all warming up for Mommy Long Legs\' three party games!',
        'Take these Safe Haven treats and Rainbow Capsules — Mommy Long Legs loves trainers who play fair and smile big!'
      ],
      gift: { rainbow: 4, berry: 5, gold: 200 },
      after: ['Stretchy three-color clay thumbs-up! Go win that Game Station Train Code! 🎩🌈']
    },
    wildPool: {
      lv: [20, 26],
      maxWilds: 4,
      table: [['mommylonglegs', 12], ['bunzobunny', 16], ['pjpug', 16], ['yarnaby', 14], ['pianosaurus', 14], ['bron', 12], ['smilinghuggy', 10], ['biggerbron', 6]]
    },
    boss: {
      key: 'boss_submap_28',
      sp: 'mommylonglegs',
      lv: 27,
      x: 12,
      y: 4,
      title: 'Mommy Long Legs',
      intro: '🕷️💗 "Ooh, a new playmate!!" Mommy Long Legs swings down on her stretchy neon-pink arms to host the Grand Game Station Finale!',
      winLines: ['"Wonderful game, superstar!! Here is your Golden Train Ticket & prize pack!" Mommy Long Legs claps all four stretchy hands! 🕷️🎉'],
      reward: { rainbow: 4, star: 4, berry: 6, gold: 300 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
