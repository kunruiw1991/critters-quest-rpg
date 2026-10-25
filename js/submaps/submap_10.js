'use strict';
// js/submaps/submap_10.js — Map 10: Honmoon Backstage Idol Lounge (Zone 10)
(() => {
  const W = 22, H = 16;
  // 16 rows x 22 cols:
  // 12 = T.CLIFF (perimeter walls), 11 = T.FLOOR (neon studio floor),
  // 14 = T.PLAZA (holographic rehearsal stage), 6 = T.FLOWERS (starlight carpet),
  // 5 = T.PATH (VIP runway & walkways), 4 = T.TALL (rhythm-glow dance pads)
  const tiles = [
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    [12, 11, 11, 11, 11, 11,  6,  6,  6,  6,  6,  6,  6,  6,  6,  6, 11, 11, 11, 11, 11, 12],
    [12, 11,  6,  6,  6, 11,  6, 14, 14, 14, 14, 14, 14, 14, 14, 14,  6,  6,  6,  6, 11, 12],
    [12, 11,  6,  5,  5,  5,  5, 14, 14, 14, 14, 14, 14, 14, 14, 14,  5,  5,  5,  6, 11, 12],
    [12, 11,  6,  6,  5, 11, 11, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11,  5,  6,  6, 11, 12],
    [12, 11, 11, 11,  5, 11,  6, 14, 14, 14, 14, 14, 14, 14, 14, 14,  6,  5, 11, 11, 11, 12],
    [12, 11, 11, 11,  5, 11,  6,  6,  6,  6,  5,  5,  5,  6,  6,  6,  6,  5, 11, 11, 11, 12],
    [12, 11, 11,  4,  4,  4,  4, 11, 11,  6,  5, 14,  5,  6, 11,  4,  4,  4,  4, 11, 11, 12],
    [12, 11, 11,  4,  4,  4,  4, 11, 11,  6,  5, 14,  5,  6, 11,  4,  4,  4,  4, 11, 11, 12],
    [12, 11, 11,  4,  4,  4,  4, 11, 11,  6,  5, 14,  5,  6, 11,  4,  4,  4,  4, 11, 11, 12],
    [12, 11, 11,  4,  4,  4,  4, 11, 11,  6,  5, 14,  5,  6, 11,  4,  4,  4,  4, 11, 11, 12],
    [12, 11, 11, 11,  5, 11, 11, 11, 11,  6,  5,  5,  5,  6, 11, 11, 11,  5, 11, 11, 11, 12],
    [12, 11, 11,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5, 11, 11, 12],
    [12, 11, 11, 11, 11, 11,  6,  6,  6,  6,  5,  5,  5,  6,  6,  6,  6, 11, 11, 11, 11, 12],
    [12, 11, 11, 11, 11, 11, 11, 11, 11,  6,  5,  5,  5,  6, 11, 11, 11, 11, 11, 11, 11, 12],
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]
  ];
  const def = {
    id: 'submap_10',
    index: 10,
    key: 'idol_lounge',
    name: 'Honmoon Backstage Idol Lounge',
    emoji: '🎤',
    zoneId: 10,
    color: '#ff5fa8',
    paletteId: 30,
    musicZone: 10,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 81, y: 101, kind: 'subportal', style: 'neon_door', label: 'Honmoon Backstage Idol Lounge' },
    entry: { x: 11, y: 13, dir: 3 },
    exit: { x: 11, y: 14, kind: 'exitmat', style: 'neon_door', label: 'Exit to Honmoon Concert Plaza' },
    palette: {
      g: '#4a2566', gd: '#36194d', gl: '#633587',
      t1: '#ff5fa8', t2: '#a855f7', t3: '#facc15',
      p: '#c084fc', pd: '#9333ea', pl: '#e9d5ff',
      sand: '#fbcfe8', sandd: '#f472b6',
      tree: '#ec4899', treed: '#be185d', treel: '#f9a8d4',
      cliff: '#2e1042', cliffd: '#1d092b', cliffl: '#4c1d6e',
      floor: '#3b1d54', floord: '#2a123d',
      plaza: '#f472b6', plazad: '#db2777', plazal: '#fbcfe8'
    },
    tiles,
    decals: [
      { x: 9, y: 3, d: 9 }, { x: 13, y: 3, d: 9 },
      { x: 8, y: 5, d: 10 }, { x: 14, y: 5, d: 10 },
      { x: 11, y: 7, d: 9 }, { x: 11, y: 10, d: 9 },
      { x: 5, y: 6, d: 11 }, { x: 16, y: 6, d: 11 },
      { x: 8, y: 9, d: 12 }, { x: 14, y: 9, d: 12 },
      { x: 7, y: 13, d: 10 }, { x: 15, y: 13, d: 10 }
    ],
    props: [
      {
        kind: 'stage_light', x: 7, y: 2, w: 1, h: 1,
        title: 'Honmoon Laser Spotlight (Left)',
        msg: '✨ Magenta and gold stage lasers sweep across the holographic rehearsal floor!'
      },
      {
        kind: 'stage_light', x: 15, y: 2, w: 1, h: 1,
        title: 'Honmoon Laser Spotlight (Right)',
        msg: '🎤 Neon beam lights pulse in sync with the HUNTR/X vs. Saja Boys encore beat!'
      },
      {
        kind: 'banner_stand', x: 6, y: 4, w: 1, h: 1,
        title: 'HUNTR/X World Tour Standee',
        msg: '🌟 "HUNTR/X — Rumi, Mira & Zoey: Sealing the Golden Honmoon with Every High Note!"'
      },
      {
        kind: 'banner_stand', x: 16, y: 4, w: 1, h: 1,
        title: 'Saja Boys Chart-Topper Standee',
        msg: '🦁 "Saja Boys — Jinu, Abby, Mystery, Romance & Baby: Soda Pop Tour Backstage!"'
      },
      {
        kind: 'counter', x: 2, y: 6, w: 1, h: 1,
        title: 'HUNTR/X Glam & Mic Counter',
        msg: '💄 Custom golden in-ear monitors, ribbon charms, and glowing lightsticks lined up for Rumi, Mira, and Zoey.'
      },
      {
        kind: 'table', x: 19, y: 6, w: 1, h: 1,
        title: 'Backstage Ramyeon & Soda Bar',
        msg: '🍜 Steaming cups of spicy backstage ramyeon and fizzy soda pop ready for the post-encore party!'
      },
      {
        kind: 'arcade', x: 2, y: 12, w: 1, h: 1,
        title: 'Honmoon Rhythm Beat Arcade',
        msg: '🕹️ High Score #1: ZOEY & DERPY — 999,990 pts on "Golden (Encore Remix)"!'
      },
      {
        kind: 'arcade', x: 19, y: 12, w: 1, h: 1,
        title: 'Idol Choreography Step Machine',
        msg: '🎶 Mira and Abby are tied for the all-time Perfect Combo streak on this rehearsal cabinet!'
      }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 2, star: 2, berry: 3, gold: 140 } },
      { x: 18, y: 3, loot: { rainbow: 2, star: 3, gold: 160 } }
    ],
    npc: {
      id: 'sub_npc_10',
      name: 'Manager Bobby',
      look: 'bobby',
      x: 15,
      y: 12,
      lines: [
        'Welcome to the VIP Honmoon Backstage Idol Lounge, Chuyu! 🎤✨',
        'HUNTR/X—Rumi, Mira, and Zoey—just finished soundcheck, and now the Saja Boys are rehearsing their choreography on the holographic stage!',
        'Here, take this VIP All-Access Idol Pack before you head down the starlight runway!'
      ],
      gift: { rainbow: 2, berry: 4, gold: 120 },
      after: [
        'Backstage Idol Leader Jinu is waiting at the center holographic stage for a friendly HUNTR/X vs. Saja Boys showcase! 🦁🎤'
      ]
    },
    wildPool: {
      lv: [12, 16],
      maxWilds: 4,
      table: [['derpy', 22], ['sussie', 20], ['abby', 18], ['mystery', 15], ['romance', 15], ['jinu', 10]]
    },
    boss: {
      key: 'boss_submap_10',
      sp: 'jinu',
      lv: 19,
      x: 11,
      y: 4,
      title: 'Backstage Idol Leader Jinu',
      intro: '🎤 Backstage Idol Leader Jinu steps into the holographic spotlight with a wink and a golden mic! "Ready for a HUNTR/X vs. Saja Boys backstage encore, Chuyu?"',
      winLines: [
        'Jinu laughs warmly, tips his idol mic to HUNTR/X, and hands Chuyu a Golden VIP Encore Pass! 🎤🌟'
      ],
      reward: { rainbow: 3, berry: 3, gold: 180 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();

