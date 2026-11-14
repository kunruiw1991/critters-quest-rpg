'use strict';
// js/submaps/submap_23.js — Map 23: Maizen Laser Bank Vault & Escape Tunnel (Zone 18)
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
    id: 'submap_23',
    index: 23,
    key: 'maizen_bank_vault',
    name: 'Maizen Laser Bank Vault & Escape Tunnel',
    emoji: '🚓',
    zoneId: 18,
    color: '#2563eb',
    paletteId: 43,
    musicZone: 18,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 56, y: 245, kind: 'subportal', style: 'cellar', label: 'Maizen Laser Bank Vault' },
    entry: { x: 13, y: 17, dir: 3 },
    exit: { x: 13, y: 18, kind: 'exitmat', style: 'cellar', label: 'Exit to Maizen Bank Plaza' },
    palette: {
      g: '#1e293b', gd: '#0f172a', gl: '#334155',
      t1: '#facc15', t2: '#38bdf8', t3: '#ef4444',
      p: '#eab308', pd: '#ca8a04', pl: '#fef08a',
      sand: '#fef3c7', sandd: '#fde68a',
      tree: '#2563eb', treed: '#1d4ed8', treel: '#60a5fa',
      cliff: '#1e3a8a', cliffd: '#172554', cliffl: '#2563eb',
      floor: '#f1f5f9', floord: '#cbd5e1',
      plaza: '#fef08a', plazad: '#facc15', plazal: '#fffbeb'
    },
    tiles,
    decals: [
      { x: 3, y: 2, d: 9 }, { x: 22, y: 2, d: 9 },
      { x: 12, y: 3, d: 9 }, { x: 14, y: 3, d: 9 }
    ],
    props: [
      { kind: 'throne', x: 13, y: 2, w: 1, h: 1, title: 'Mountain of Gold Bullion', msg: '🪙 Stacks of sparkling Maizen gold bars and emerald blocks!' },
      { kind: 'crystal_cluster', x: 11, y: 2, w: 1, h: 1, title: 'Diamond Reserve Stack', msg: '💎 Pure Minecraft diamond blocks locked inside the main vault.' },
      { kind: 'crystal_cluster', x: 15, y: 2, w: 1, h: 1, title: 'Emerald Reserve Stack', msg: '💚 Sparkling villager emeralds stacked to the ceiling.' },
      { kind: 'pillar', x: 10, y: 8, w: 1, h: 1, title: 'Laser Grid Emitter', msg: '🔴 Redstone security beam emitter guarding the central aisle.' },
      { kind: 'pillar', x: 16, y: 8, w: 1, h: 1, title: 'Laser Grid Emitter', msg: '🔴 Redstone security beam emitter guarding the central aisle.' },
      { kind: 'sign', x: 9, y: 16, w: 1, h: 1, name: 'Police Chief Notice', title: 'Police Chief Notice', text: '🚓 "Watch out! Sneaky Robber dug a spoon tunnel behind the gold stacks!"', msg: '🚓 "Watch out! Sneaky Robber dug a spoon tunnel behind the gold stacks!"' }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 3, star: 2, berry: 5, gold: 250 } },
      { x: 22, y: 3, loot: { rainbow: 3, star: 2, berry: 5, gold: 250 } }
    ],
    npc: {
      id: 'sub_npc_23',
      name: 'Officer Chief',
      look: 'police_npc',
      x: 17,
      y: 16,
      lines: [
        'Glad you\'re here, Deputy Chuyu! 🚓🚨',
        'Sneaky Robber 🦹 tiptoed past our slime-block traps and is hiding right up by the Gold Bullion Dais!',
        'Take these Police Chief capsules — if you befriend him, he promises to return every single coin!'
      ],
      gift: { rainbow: 3, berry: 5, gold: 200 },
      after: ['Bolt the Pet Wolf 🐕 and Banana Cat 🍌 are cheering for you! 🚓✨']
    },
    wildPool: {
      lv: [19, 24],
      maxWilds: 4,
      table: [['policechief', 24], ['maizenrobber', 24], ['maizenwolf', 22], ['bananacat', 18], ['redstonegolem', 12]]
    },
    boss: {
      key: 'boss_submap_23',
      sp: 'maizenrobber',
      lv: 26,
      x: 13,
      y: 4,
      title: 'Sneaky Robber',
      intro: '🦹💰 "Uh-oh, busted!!" Sneaky Robber drops his cartoon loot sack and challenges you to a friendly vault showdown!',
      winLines: ['"Okay, okay, I\'ll be a good guy!!" Sneaky Robber hands back the vault bonus and joins your adventure! 🦹✨'],
      reward: { rainbow: 4, star: 3, berry: 5, gold: 300 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
