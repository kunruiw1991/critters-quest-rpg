'use strict';
// js/submaps/submap_22.js — Map 22: Noob vs Pro Burger Tycoon Kitchen (Zone 17)
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
    [12,11,11, 4, 4, 4, 4, 4,11,11,11,11,14,14,14,11,11,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11,11,11,11,14,14,14,11,11,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11,11,11,11,14,14,14,11,11,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,11,11,14,14,14,11,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,14,14,14,14,14,14,14,14,14,14,14,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,11,11,14,14,14,11,11,11,11,11,11,11,11,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11,11,11,11,14,14,14,11,11,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11,11,11,11,14,14,14,11,11,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11,11,11,11,14,14,14,11,11,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,11,14,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,11,14,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,11,14,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]
  ];

  const def = {
    id: 'submap_22',
    index: 22,
    key: 'maizen_burger_kitchen',
    name: 'Noob vs Pro Burger Tycoon Kitchen',
    emoji: '🍔',
    zoneId: 17,
    color: '#ef4444',
    paletteId: 42,
    musicZone: 17,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 25, y: 263, kind: 'subportal', style: 'neon_door', label: 'Noob vs Pro Burger Tycoon Kitchen' },
    entry: { x: 13, y: 17, dir: 3 },
    exit: { x: 13, y: 18, kind: 'exitmat', style: 'neon_door', label: 'Exit to Burger Boulevard' },
    palette: {
      g: '#fef2f2', gd: '#fee2e2', gl: '#ffffff',
      t1: '#facc15', t2: '#ef4444', t3: '#fb923c',
      p: '#fde047', pd: '#eab308', pl: '#fef9c3',
      sand: '#fef3c7', sandd: '#fde68a',
      tree: '#dc2626', treed: '#991b1b', treel: '#f87171',
      cliff: '#991b1b', cliffd: '#7f1d1d', cliffl: '#dc2626',
      floor: '#fffbeb', floord: '#fef3c7',
      plaza: '#fde047', plazad: '#facc15', plazal: '#fef9c3'
    },
    tiles,
    decals: [
      { x: 3, y: 2, d: 9 }, { x: 22, y: 2, d: 9 },
      { x: 12, y: 3, d: 9 }, { x: 14, y: 3, d: 9 },
      { x: 13, y: 8, d: 9 }, { x: 13, y: 13, d: 9 }
    ],
    props: [
      { kind: 'counter', x: 13, y: 2, w: 1, h: 1, title: 'Golden Cheeseburger Grill', msg: '🍔 Sizzling triple-decker golden cheeseburgers and crispy french fries!' },
      { kind: 'table', x: 10, y: 4, w: 1, h: 1, title: 'Pro VIP Booth', msg: '🍟 A shiny golden diner booth stocked with extra ketchup and milkshakes.' },
      { kind: 'table', x: 16, y: 4, w: 1, h: 1, title: "Mikey's Secret Snack Table", msg: '🐢 Half-eaten mountain of 50 french fry cartons. Mikey was definitely here!' },
      { kind: 'arcade', x: 9, y: 10, w: 1, h: 1, title: 'Burger Flipper Arcade Machine', msg: '🕹️ High Score: MIKEY — 999,999 Fries Eaten!' },
      { kind: 'arcade', x: 17, y: 10, w: 1, h: 1, title: 'Maizen Dance-Off Machine', msg: '🎵 Banana Cat\'s "Happy Happy Happy!" song plays from the speakers!' },
      { kind: 'sign', x: 9, y: 16, w: 1, h: 1, name: 'Menu Board', title: 'Menu Board', text: '🍔 "Today\'s Special: JJ\'s Golden Cheeseburger & Mikey\'s Crispy Fries!"', msg: '🍔 "Today\'s Special: JJ\'s Golden Cheeseburger & Mikey\'s Crispy Fries!"' }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 3, star: 2, berry: 6, gold: 180 } },
      { x: 22, y: 3, loot: { rainbow: 3, star: 2, berry: 6, gold: 210 } }
    ],
    npc: {
      id: 'sub_npc_22',
      name: 'Diner Judge Carrie',
      look: 'carrie_npc',
      x: 17,
      y: 16,
      lines: [
        'Welcome to the Noob vs Pro Burger Tycoon Kitchen, Chuyu! 🐱🍔',
        'JJ built an automated Golden Burger Conveyor Belt, while Mikey is busy sampling every batch of Crispy Fries! 🍟',
        'Here are some fresh berry shakes and Rainbow Capsules for your kitchen challenge!'
      ],
      gift: { rainbow: 3, berry: 6, gold: 160 },
      after: ['Head up to the Golden Grill to challenge Burger Chef JJ! 🍔✨']
    },
    wildPool: {
      lv: [16, 22],
      maxWilds: 4,
      table: [['burgerjj', 25], ['burgermikey', 25], ['bananacat', 20], ['carrie', 15], ['mikey', 15]]
    },
    boss: {
      key: 'boss_submap_22',
      sp: 'burgerjj',
      lv: 24,
      x: 13,
      y: 4,
      title: 'Burger Chef JJ',
      intro: '🍔☀️ "Order up!!" Burger Chef JJ flips a sizzling Golden Cheeseburger high into the air to test your team!',
      winLines: ['"Five-star review!!" Burger Chef JJ awards Chuyu the Golden Spatula and a huge feast! 🍔🏆'],
      reward: { rainbow: 4, star: 3, berry: 6, gold: 250 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
