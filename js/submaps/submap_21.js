'use strict';
// js/submaps/submap_21.js — Map 21: JJ & Mikey's 100-Layer Security Bunker (Zone 17)
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
    id: 'submap_21',
    index: 21,
    key: 'maizen_security_bunker',
    name: "JJ & Mikey's 100-Layer Security Bunker",
    emoji: '🤖',
    zoneId: 17,
    color: '#38bdf8',
    paletteId: 41,
    musicZone: 17,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 25, y: 245, kind: 'subportal', style: 'cellar', label: "JJ & Mikey's 100-Layer Security Bunker" },
    entry: { x: 13, y: 17, dir: 3 },
    exit: { x: 13, y: 18, kind: 'exitmat', style: 'cellar', label: 'Exit to Security Mansion Yard' },
    palette: {
      g: '#1e293b', gd: '#0f172a', gl: '#334155',
      t1: '#38bdf8', t2: '#ef4444', t3: '#facc15',
      p: '#94a3b8', pd: '#64748b', pl: '#cbd5e1',
      sand: '#e2e8f0', sandd: '#94a3b8',
      tree: '#0284c7', treed: '#0369a1', treel: '#38bdf8',
      cliff: '#0f172a', cliffd: '#020617', cliffl: '#1e293b',
      floor: '#e2e8f0', floord: '#cbd5e1',
      plaza: '#bae6fd', plazad: '#7dd3fc', plazal: '#f0f9ff'
    },
    tiles,
    decals: [
      { x: 3, y: 2, d: 9 }, { x: 22, y: 2, d: 9 },
      { x: 12, y: 3, d: 9 }, { x: 14, y: 3, d: 9 },
      { x: 13, y: 6, d: 9 }, { x: 13, y: 11, d: 9 },
      { x: 6, y: 11, d: 9 }, { x: 19, y: 11, d: 9 }
    ],
    props: [
      { kind: 'throne', x: 13, y: 2, w: 1, h: 1, title: "JJ's Redstone Control Console", msg: '💎 JJ\'s 100-Layer Security Control Panel! A sticky note reads: "PASSCODE: 1-2-3-4 (Do NOT let Mikey press the big red button!!)"' },
      { kind: 'crystal_pillar', x: 11, y: 2, w: 1, h: 1, title: 'Diamond Generator Core', msg: '💎 An enchanted diamond generator humming with bright cyan energy.' },
      { kind: 'crystal_pillar', x: 15, y: 2, w: 1, h: 1, title: 'Redstone Laser Relay', msg: '🔴 A glowing redstone relay powering the 100 security doors.' },
      { kind: 'statue', x: 9, y: 4, w: 1, h: 1, title: 'Golden Turtle Trophy', msg: '🐢 Mikey\'s "Best Secret Tunnel Digger" trophy!' },
      { kind: 'statue', x: 17, y: 4, w: 1, h: 1, title: 'Diamond Builder Trophy', msg: '🏆 JJ\'s "Pro Build Battle Champion" trophy!' },
      { kind: 'brazier', x: 11, y: 10, w: 1, h: 1, title: 'Redstone Torch Beacon', msg: '🔥 A warm redstone torch lighting the diamond bridge.' },
      { kind: 'brazier', x: 15, y: 10, w: 1, h: 1, title: 'Redstone Torch Beacon', msg: '🔥 A warm redstone torch lighting the diamond bridge.' },
      { kind: 'sign', x: 9, y: 16, w: 1, h: 1, name: 'Bunker Blueprint Sign', title: 'Bunker Blueprint Sign', text: '🤖 "Layer 100: Guarded by JJ\'s Redstone Security Golem! Bring a Sweet Berry to make friends!"', msg: '🤖 "Layer 100: Guarded by JJ\'s Redstone Security Golem! Bring a Sweet Berry to make friends!"' }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 3, star: 2, berry: 5, gold: 180 } },
      { x: 22, y: 3, loot: { rainbow: 3, star: 3, berry: 5, gold: 220 } }
    ],
    npc: {
      id: 'sub_npc_21',
      name: 'Security Engineer JJ',
      look: 'jj_npc',
      x: 17,
      y: 16,
      lines: [
        'Welcome down to Layer 100 of our Underground Security Bunker, Chuyu! 💎🤖',
        'I built 99 laser doors, slime-block launchers, and a diamond moat so no pranksters could sneak in...',
        'Take these spare Rainbow Capsules before you meet my Redstone Security Golem up ahead!'
      ],
      gift: { rainbow: 3, berry: 5, gold: 160 },
      after: ['My Redstone Security Golem looks super tough, but he secretly loves yellow flowers and Sweet Berries! 🤖🌼']
    },
    wildPool: {
      lv: [16, 21],
      maxWilds: 4,
      table: [['projj', 24], ['noobmikey', 22], ['mikey', 18], ['jj', 18], ['redstonegolem', 18]]
    },
    boss: {
      key: 'boss_submap_21',
      sp: 'redstonegolem',
      lv: 23,
      x: 13,
      y: 4,
      title: 'Redstone Security Golem',
      intro: '🤖🔴 BEEP-BOOP! JJ\'s Redstone Security Golem scans the bunker and holds out a friendly yellow flower for a battle test!',
      winLines: ['BEEP-HAPPY! The Redstone Security Golem salutes Chuyu and unlocks the Diamond Bunker Vault! 🤖💎'],
      reward: { rainbow: 4, star: 3, berry: 5, gold: 240 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
