'use strict';
// js/submaps/submap_08.js — Map 08: Starlight Moon Dungeon (Zone 8)
(() => {
  const W = 24, H = 18;
  // 12 = T.CLIFF, 11 = T.FLOOR (starlit marble), 14 = T.PLAZA (lunar dais),
  // 1 = T.SHALLOW (mirror pools), 6 = T.FLOWERS (lavender gardens), 4 = T.TALL (starlight grass)
  const tiles = [
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12],
    [12,11,11,11,11,11,11,11,11,14,14,14,14,14,14,11,11,11,11,11,11,11,11,12],
    [12,11,14,14,14,11, 6, 6,11,14,14,14,14,14,14,11, 6, 6,11,14,14,14,11,12],
    [12,11,14,14,14,11, 6, 6,11,14,14,14,14,14,14,11, 6, 6,11,14,14,14,11,12],
    [12,11,14,14,14,11,11,11,11,14,14,14,14,14,14,11,11,11,11,14,14,14,11,12],
    [12,11,11,11,11,11, 1, 1,11,11,14,14,14,14,11,11, 1, 1,11,11,11,11,11,12],
    [12,11, 6, 6,11,11, 1, 1,11,11,14,14,14,14,11,11, 1, 1,11,11, 6, 6,11,12],
    [12,11, 6, 6,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11, 6, 6,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11,11,14,14,14,14,11,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 6, 4, 4,11,11,14,14,14,14,11,11, 4, 4, 6, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11,11,14,14,14,14,11,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11,11,14,14,14,14,11,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11, 6, 6,11, 1, 1,11,11,11,14,14,14,14,11,14,14,14,11, 6, 6,11,11,12],
    [12,11, 6, 6,11, 1, 1,11,11,11,14,14,14,14,11,14,14,14,11, 6, 6,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11, 6, 6,11,11,11,11,11,14,14,14,14,11,11,11,11, 6, 6,11,11,11,12],
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]
  ];
  const def = {
    id: 'submap_08',
    index: 8,
    key: 'moon_dungeon',
    name: 'Starlight Moon Dungeon',
    emoji: '🌙',
    zoneId: 8,
    color: '#c084fc',
    paletteId: 28,
    musicZone: 8,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 59, y: 12, kind: 'subportal', style: 'stair_down', label: 'Starlight Moon Dungeon' },
    entry: { x: 12, y: 15, dir: 3 },
    exit: { x: 12, y: 16, kind: 'exitmat', style: 'stair_down', label: 'Ascend to Starlight Moon Castle' },
    palette: {
      g: '#382c66', gd: '#281e4d', gl: '#4e3f87',
      t1: '#a78bfa', t2: '#c084fc', t3: '#fde047',
      p: '#6d5cae', pd: '#53438f', pl: '#8b79cf',
      sand: '#ddd6fe', sandd: '#c4b5fd',
      tree: '#5b4b9e', treed: '#42357a', treel: '#7c6bc4',
      cliff: '#1f163d', cliffd: '#120c26', cliffl: '#362863',
      floor: '#45377a', floord: '#33275e',
      plaza: '#7e6bc4', plazad: '#604ea6', plazal: '#a391e6'
    },
    tiles,
    decals: [
      { x: 10, y: 3, d: 10 }, { x: 13, y: 3, d: 10 },
      { x: 11, y: 5, d: 9 }, { x: 12, y: 6, d: 9 }, { x: 13, y: 5, d: 9 },
      { x: 5, y: 4, d: 9 }, { x: 18, y: 4, d: 9 },
      { x: 11, y: 9, d: 10 }, { x: 12, y: 10, d: 9 }, { x: 13, y: 9, d: 10 },
      { x: 9, y: 13, d: 9 }, { x: 15, y: 15, d: 9 },
      { x: 11, y: 14, d: 10 }, { x: 13, y: 14, d: 10 }
    ],
    props: [
      { kind: 'bookshelf', x: 2, y: 1, w: 1, h: 1 },
      { kind: 'bookshelf', x: 4, y: 1, w: 1, h: 1 },
      { kind: 'telescope', x: 6, y: 1, w: 1, h: 1 },
      { kind: 'throne', x: 12, y: 1, w: 1, h: 1 },
      { kind: 'telescope', x: 17, y: 1, w: 1, h: 1 },
      { kind: 'bookshelf', x: 19, y: 1, w: 1, h: 1 },
      { kind: 'bookshelf', x: 21, y: 1, w: 1, h: 1 },
      { kind: 'altar', x: 12, y: 2, w: 1, h: 1 },
      { kind: 'pillar', x: 8, y: 3, w: 1, h: 1 },
      { kind: 'pillar', x: 15, y: 3, w: 1, h: 1 },
      { kind: 'lantern', x: 9, y: 4, w: 1, h: 1 },
      { kind: 'lantern', x: 14, y: 4, w: 1, h: 1 },
      { kind: 'pillar', x: 8, y: 7, w: 1, h: 1 },
      { kind: 'pillar', x: 15, y: 7, w: 1, h: 1 },
      { kind: 'lantern', x: 9, y: 12, w: 1, h: 1 },
      { kind: 'lantern', x: 14, y: 12, w: 1, h: 1 },
      { kind: 'pillar', x: 8, y: 14, w: 1, h: 1 },
      { kind: 'telescope', x: 18, y: 14, w: 1, h: 1 },
      { kind: 'lantern', x: 10, y: 16, w: 1, h: 1 },
      { kind: 'lantern', x: 14, y: 16, w: 1, h: 1 }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 2, star: 2, berry: 3, gold: 160 } },
      { x: 20, y: 3, loot: { master: 1, rainbow: 2, gold: 200 } }
    ],
    npc: {
      id: 'sub_npc_08',
      name: 'Astrologer Selene',
      look: 'princess',
      x: 16,
      y: 13,
      lines: [
        'Welcome to the Starlight Moon Dungeon beneath the castle, Chuyu! 🌙✨',
        'Our astral telescopes and mirror pools reflect the ancient constellations of Rainbow Island.',
        'The stars foretold your arrival — accept these starlit Rainbow Capsules for your journey!'
      ],
      gift: { rainbow: 3, star: 2, berry: 3, gold: 140 },
      after: [
        'Gaze into the lunar mirror pools and tread softly through the lavender star-grass! 🌌',
        'Moon-Sanctum Guardian Galaxy rests upon the celestial dais ahead — may the moonlight guide you! 🌙✨'
      ]
    },
    wildPool: {
      lv: [13, 17],
      maxWilds: 4,
      table: [['catnap', 40], ['luna', 38], ['galaxy', 12], ['solar', 10]]
    },
    boss: {
      key: 'boss_submap_08',
      sp: 'galaxy',
      lv: 21,
      x: 12,
      y: 4,
      title: 'Moon-Sanctum Guardian Galaxy',
      intro: '🌌 Moon-Sanctum Guardian Galaxy CatNap awakens upon the lunar dais in a swirl of nebula stardust!',
      winLines: [
        'Galaxy CatNap purrs a cosmic lullaby as silver starlight ripples across the mirror pools! 🌙✨',
        'You have earned the celestial blessing of the Starlight Moon Dungeon!'
      ],
      reward: { master: 1, rainbow: 2, star: 2, gold: 220 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
