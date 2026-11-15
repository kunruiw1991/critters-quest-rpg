'use strict';
// js/submaps/submap_31.js — Map 31: Dr. Sawyer's Cyber-Destroyer Lair (Zone 22)
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
    id: 'submap_31',
    index: 31,
    key: 'sawyer_cyber_destroyer_lair',
    name: "Dr. Sawyer's Cyber-Destroyer Lair",
    emoji: '📺',
    zoneId: 22,
    color: '#7c3aed',
    paletteId: 51,
    musicZone: 22,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 101, y: 319, kind: 'subportal', style: 'cellar', label: "Dr. Sawyer's Cyber-Destroyer Lair" },
    entry: { x: 13, y: 17, dir: 3 },
    exit: { x: 13, y: 18, kind: 'exitmat', style: 'cellar', label: 'Exit to Prototype Citadel South Plaza' },
    palette: {
      g: '#111827', gd: '#030712', gl: '#1f2937',
      t1: '#a855f7', t2: '#22c55e', t3: '#38bdf8',
      p: '#c4b5fd', pd: '#8b5cf6', pl: '#ede9fe',
      sand: '#d1fae5', sandd: '#6ee7b7',
      tree: '#10b981', treed: '#047857', treel: '#4ade80',
      cliff: '#0f172a', cliffd: '#020617', cliffl: '#1e293b',
      floor: '#e2e8f0', floord: '#cbd5e1',
      plaza: '#ddd6fe', plazad: '#c4b5fd', plazal: '#f5f3ff'
    },
    tiles,
    decals: [
      { x: 3, y: 2, d: 20 }, { x: 22, y: 2, d: 20 },
      { x: 12, y: 3, d: 9 }, { x: 14, y: 3, d: 9 }
    ],
    props: [
      { kind: 'throne', x: 13, y: 2, w: 1, h: 1, title: 'Omni-Eye TV Mainframe Throne', msg: '📺 Dr. Harley Sawyer\'s towering CRT monitor console! Dozens of purple digital eyes blink curiously at your team!' },
      { kind: 'crystal_cluster', x: 11, y: 2, w: 1, h: 1, title: 'Toy-Kryptonite Crystal Tube', msg: '🟢 Dr. Destroyer\'s glowing green crystal — luckily Rory Redcape already unplugged the drain switch!' },
      { kind: 'crystal_cluster', x: 15, y: 2, w: 1, h: 1, title: 'Time-Machine Computer Chip Bank', msg: '💾 "Property of Dr. Sawyer — Do NOT lend to Protosaurus!"' },
      { kind: 'arcade', x: 9, y: 4, w: 1, h: 1, title: 'Super Toy Team Radar', msg: '🦸 Tracks Cyber-Spider, Amethyst Lily, Best-Buddy Chum, and Rory Redcape!' },
      { kind: 'arcade', x: 17, y: 4, w: 1, h: 1, title: 'Shrink-Ray Reverse Switch', msg: '🔬 Restores tiny mouse-sized Prototype back to full size!' },
      { kind: 'sign', x: 9, y: 16, w: 1, h: 1, name: 'Destroyer Lab Log', title: 'Destroyer Lab Log', text: '📺 "From this point on, refer to me as Dr. Destroyer! — Dr. Harley Sawyer"', msg: '📺 "From this point on, refer to me as Dr. Destroyer! — Dr. Harley Sawyer"' }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 4, star: 3, berry: 6, gold: 280 } },
      { x: 22, y: 3, loot: { master: 1, rainbow: 3, berry: 6, gold: 300 } }
    ],
    npc: {
      id: 'sub_npc_31',
      name: 'Rory Redcape',
      look: 'rory_npc',
      x: 17,
      y: 16,
      lines: [
        'HAVE NO FEAR — Rory Redcape is here!! 🦸🍭',
        'My cape grew right back, and together with Cyber-Spider, Amethyst Lily, and Chum Chompkins we shut down Dr. Destroyer\'s green Kryptonite ray!',
        'Take these superhero supplies and challenge ✨ Dr. Harley Sawyer at his Omni-Eye TV Mainframe!'
      ],
      gift: { rainbow: 4, berry: 6, gold: 250 },
      after: ['Go Super Toy Team!! Let\'s show Dr. Sawyer the power of friendship! 🦸✨']
    },
    wildPool: {
      lv: [24, 30],
      maxWilds: 4,
      table: [['drsawyer', 20], ['roryredcape', 20], ['chumchompkins', 20], ['giblet', 20], ['prototypejr', 20]]
    },
    boss: {
      key: 'boss_submap_31',
      sp: 'drsawyer',
      lv: 31,
      x: 13,
      y: 4,
      title: 'The Doctor (Harley Sawyer)',
      intro: '📺🟣 "Fascinating... The Super Toy Team has a new trainer!" Dr. Harley Sawyer\'s purple CRT monitor eye zooms in for a cyber showdown!',
      winLines: ['"Impressive... My calculations did not account for this much heart!" Dr. Sawyer powers down his turrets and joins your research squad! 📺✨'],
      reward: { master: 1, rainbow: 4, star: 4, berry: 7, gold: 380 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
