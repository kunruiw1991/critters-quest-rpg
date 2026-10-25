'use strict';
// js/submaps/submap_12.js — Map 12: Derpy's Secret Tiger Den (Zone 11)
(() => {
  const W = 22, H = 16;
  // Tile legend:
  // 12 = T.CLIFF (strict outer perimeter walls)
  // 14 = T.PLAZA (Hanji mulberry-paper folk-art courtyards & north Gat-Derpy shrine dais)
  // 13 = T.STONES (traditional garden stepping stones)
  // 11 = T.FLOOR (polished Hanok wood veranda & painter's studio)
  //  6 = T.FLOWERS (peony & plum-blossom Minhwa border carpets)
  //  5 = T.PATH (swept earthen sanctuary trail)
  //  4 = T.TALL (28 tiger bamboo & longevity-pine brush tiles for wild encounters)
  //  3 = T.GRASS (lush Namsan pine-garden turf)
  const tiles = [
    // x: 0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12], // y=0
    [12,  3,  6, 14, 14,  6,  3, 11, 14, 14, 14, 14, 14, 14, 14, 11,  3,  6, 14, 14,  3, 12], // y=1
    [12,  3, 14, 14, 14, 14,  3, 11, 14,  6, 14, 14, 14,  6, 14, 11,  3, 14, 14, 14,  3, 12], // y=2
    [12,  3, 14, 14, 14, 14, 13, 13, 14, 14, 14, 14, 14, 14, 14, 13, 13, 14, 14, 14,  3, 12], // y=3 (chests at 3,3 & 18,3)
    [12,  3,  6, 14, 14,  6,  3, 11, 14, 14, 14, 14, 14, 14, 14, 11,  3,  6, 14,  6,  3, 12], // y=4 (boss at 11,4)
    [12,  3,  3,  3, 13,  3,  3,  5,  5, 13,  5, 13,  5, 13,  5,  3,  3, 13,  3,  3,  3, 12], // y=5
    [12,  3,  4,  4,  4,  4,  3,  3,  5, 14, 14, 13, 14, 14,  5,  3,  4,  4,  4,  4,  3, 12], // y=6 (8 T.TALL)
    [12,  3,  4,  4,  4,  4,  4,  3,  5, 14,  6, 13,  6, 14,  5,  4,  4,  4,  4,  4,  3, 12], // y=7 (10 T.TALL)
    [12,  3,  3, 13, 13, 13, 13, 13,  5, 14, 14, 13, 14, 14,  5, 13, 13, 13, 13,  3,  3, 12], // y=8
    [12,  3,  4,  4,  4,  4,  4,  3,  5, 14,  6, 13,  6, 14,  5,  4,  4,  4,  4,  4,  3, 12], // y=9 (10 T.TALL -> 28 total)
    [12,  3,  3,  3, 13,  3,  3,  3,  5,  5,  5, 13,  5,  5,  5,  3,  3, 13,  3,  3,  3, 12], // y=10
    [12, 11, 11, 11, 13, 11, 11, 11, 11, 14, 14, 13, 14, 14, 11, 11, 11, 13, 11, 11, 11, 12], // y=11
    [12, 11, 11, 14, 14, 14, 11, 11, 11, 14, 14,  5, 14, 14, 11, 11, 14, 14, 11, 11, 11, 12], // y=12 (sign at 7,12; npc at 15,12)
    [12, 11, 11, 14, 14, 14, 11, 11, 11, 14,  5,  5,  5, 14, 11, 11, 14, 14, 11, 11, 11, 12], // y=13 (entry at 11,13)
    [12, 11,  6, 11, 11, 11,  6, 11, 11, 11,  5,  5,  5, 11, 11,  6, 11, 11, 11,  6, 11, 12], // y=14 (exit at 11,14)
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]  // y=15
  ];

  const def = {
    id: 'submap_12',
    index: 12,
    key: 'derpy_den',
    name: "Derpy's Secret Tiger Den",
    emoji: '🐯',
    zoneId: 11,
    color: '#fb923c',
    paletteId: 32,
    musicZone: 11,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 23, y: 130, kind: 'subportal', style: 'den', label: "Derpy's Secret Tiger Den" },
    entry: { x: 11, y: 13, dir: 3 },
    exit: { x: 11, y: 14, kind: 'exitmat', style: 'den', label: 'Exit to Tiger Forest & Namsan Sanctuary' },
    palette: {
      g: '#386641', gd: '#284b2f', gl: '#4f8259',
      t1: '#fb923c', t2: '#38bdf8', t3: '#facc15',
      p: '#d4a373', pd: '#a97c50', pl: '#e9c49a',
      sand: '#f3d5b5', sandd: '#d4a373',
      tree: '#1b4332', treed: '#081c15', treel: '#2d6a4f',
      cliff: '#5c4033', cliffd: '#3e2723', cliffl: '#8d6e63',
      floor: '#7f5539', floord: '#583924',
      plaza: '#e07a5f', plazad: '#b5563e', plazal: '#f29f89'
    },
    tiles,
    decals: [
      { x: 4, y: 2, d: 2 },
      { x: 17, y: 2, d: 3 },
      { x: 9, y: 3, d: 5 },
      { x: 13, y: 3, d: 5 },
      { x: 6, y: 5, d: 4 },
      { x: 15, y: 5, d: 4 },
      { x: 10, y: 6, d: 2 },
      { x: 12, y: 6, d: 3 },
      { x: 10, y: 8, d: 6 },
      { x: 12, y: 8, d: 6 },
      { x: 8, y: 11, d: 2 },
      { x: 14, y: 11, d: 3 },
      { x: 4, y: 13, d: 5 },
      { x: 17, y: 13, d: 5 }
    ],
    props: [
      {
        kind: 'torii_mini',
        x: 11,
        y: 2,
        w: 1,
        h: 1,
        variant: 0,
        name: 'Minhwa Pine Shrine Arch',
        title: 'Minhwa Pine Shrine Arch',
        text: '⛩️ A crimson folk-art archway painted with knotted pine branches, clouds, and chattering magpies.',
        msg: '⛩️ A crimson folk-art archway painted with knotted pine branches, clouds, and chattering magpies.'
      },
      {
        kind: 'statue',
        x: 8,
        y: 2,
        w: 1,
        h: 1,
        variant: 1,
        name: 'Sussie the Three-Eyed Magpie Perch',
        title: 'Sussie the Three-Eyed Magpie Perch',
        text: '🐦 A carved stone pine branch where three-eyed Sussie perches to scold Derpy in stereo.',
        msg: '🐦 A carved stone pine branch where three-eyed Sussie perches to scold Derpy in stereo.'
      },
      {
        kind: 'statue',
        x: 14,
        y: 2,
        w: 1,
        h: 1,
        variant: 2,
        name: 'Minhwa Laughing Tiger Statue',
        title: 'Minhwa Laughing Tiger Statue',
        text: '🐯 A cross-eyed folk-art stone tiger balancing a miniature scholarly Gat hat on one ear.',
        msg: '🐯 A cross-eyed folk-art stone tiger balancing a miniature scholarly Gat hat on one ear.'
      },
      {
        kind: 'lantern',
        x: 8,
        y: 4,
        w: 1,
        h: 1,
        variant: 0,
        name: 'Hanji Mulberry Lantern',
        title: 'Hanji Mulberry Lantern',
        text: '🏮 Warm amber light glows through hand-pressed Hanji paper decorated with golden tiger stripes.',
        msg: '🏮 Warm amber light glows through hand-pressed Hanji paper decorated with golden tiger stripes.'
      },
      {
        kind: 'lantern',
        x: 14,
        y: 4,
        w: 1,
        h: 1,
        variant: 0,
        name: 'Magpie Ink Lantern',
        title: 'Magpie Ink Lantern',
        text: '🏮 Painted in Sumi ink with tiny magpie footprints circling a pine cone.',
        msg: '🏮 Painted in Sumi ink with tiny magpie footprints circling a pine cone.'
      },
      {
        kind: 'flowerpot',
        x: 2,
        y: 12,
        w: 1,
        h: 1,
        variant: 1,
        name: 'Wobbly Celadon Flowerpot',
        title: 'Wobbly Celadon Flowerpot',
        text: '🪴 A jade-green celadon pot with a suspiciously fresh tiger nose-print on the rim!',
        msg: '🪴 A jade-green celadon pot with a suspiciously fresh tiger nose-print on the rim!'
      },
      {
        kind: 'flowerpot',
        x: 19,
        y: 12,
        w: 1,
        h: 1,
        variant: 2,
        name: 'Blue-and-White Peony Planter',
        title: 'Blue-and-White Peony Planter',
        text: '🪴 Painter Seojun tied a silk ribbon around this pot so Derpy stops batting it across the veranda.',
        msg: '🪴 Painter Seojun tied a silk ribbon around this pot so Derpy stops batting it across the veranda.'
      },
      {
        kind: 'table',
        x: 18,
        y: 12,
        w: 1,
        h: 1,
        variant: 0,
        name: 'Minhwa Scroll Painting Desk',
        title: 'Minhwa Scroll Painting Desk',
        text: '🖌️ Unrolled Hanji scrolls, mineral pigments, and a brush dipped in tangerine-orange tiger paint.',
        msg: '🖌️ Unrolled Hanji scrolls, mineral pigments, and a brush dipped in tangerine-orange tiger paint.'
      },
      {
        kind: 'sign',
        x: 7,
        y: 12,
        w: 1,
        h: 1,
        name: 'Minhwa Tiger Scroll',
        title: 'Minhwa Tiger Scroll',
        text: '🐯 "Ho-jak-do Studio Rule #1: Guard your flowerpots! Rule #2: Compliment Gat-Derpy\'s horsehair hat!"',
        msg: '🐯 "Ho-jak-do Studio Rule #1: Guard your flowerpots! Rule #2: Compliment Gat-Derpy\'s horsehair hat!"'
      }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 2, berry: 3, star: 2, gold: 130 } },
      { x: 18, y: 3, loot: { rainbow: 2, master: 1, gold: 150 } }
    ],
    npc: {
      id: 'sub_npc_12',
      name: 'Minhwa Painter Seojun',
      look: 'scholar',
      x: 15,
      y: 12,
      lines: [
        'Welcome to Derpy\'s Secret Tiger Den, Chuyu! 🐯🎨',
        'In Korean Minhwa folk art, the magpie brings joyful news while the goofy pine-tiger chases away bad luck—and occasionally knocks over my celadon flowerpots!',
        'Derpy and three-eyed Sussie leaped right off my mulberry Hanji scroll this morning. Take these shimmering pigments and crystals for your journey!'
      ],
      gift: { rainbow: 2, berry: 4, star: 2, gold: 110 },
      after: 'Secret Den Guardian Gat-Derpy is practicing his dignified scholar pose at the north shrine while Sussie critiques his hat angle! 🐯🎩🐦'
    },
    wildPool: {
      lv: [13, 17],
      maxWilds: 4,
      table: [['derpy', 30], ['sussie', 25], ['flightdemon', 20], ['jeoseung', 15], ['gatderpy', 10]]
    },
    boss: {
      key: 'boss_submap_12',
      sp: 'gatderpy',
      lv: 20,
      x: 11,
      y: 4,
      title: 'Secret Den Guardian Gat-Derpy',
      intro: '🐯🎩 Secret Den Guardian Gat-Derpy adjusts his woven horsehair Gat hat, flashes a huge cross-eyed Minhwa grin, and pounces from the pine scroll!',
      winLines: [
        'Gat-Derpy purrs like a giant tea kettle, accidentally tips over one last flowerpot, and nudges a trove of Rainbow Crystals to Chuyu! 🐯💖🪴'
      ],
      reward: { rainbow: 3, berry: 3, star: 2, gold: 170 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
