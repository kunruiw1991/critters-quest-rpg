'use strict';
// js/submaps/submap_13.js — Map 13: Bathhouse Steam Grotto (Zone 11)
(() => {
  const W = 20, H = 16;
  // 12 = T.CLIFF (outer rock wall), 11 = T.FLOOR (warm hinoki cypress decking),
  // 14 = T.PLAZA (warm celadon jade tiles), 1 = T.SHALLOW (steaming mineral pools),
  // 7 = T.BRIDGE_H (wooden bath bridges), 4 = T.TALL (aromatic steam-herb patches)
  const tiles = [
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    [12, 11, 11, 11, 11, 11, 14, 14, 14, 14, 14, 14, 14, 14, 11, 11, 11, 11, 11, 12],
    [12, 11, 14, 14, 11, 11, 14,  1,  1, 14, 14,  1,  1, 14, 11, 11, 14, 14, 11, 12],
    [12, 11, 14, 14, 11, 11, 14, 14, 14, 14, 14, 14, 14, 14, 11, 11, 14, 14, 11, 12],
    [12, 11, 11, 11, 11, 11, 14, 14, 14, 14, 14, 14, 14, 14, 11, 11, 11, 11, 11, 12],
    [12,  4,  4,  1,  1,  1,  1,  7,  7, 14, 14,  7,  7,  1,  1,  1,  1,  4,  4, 12],
    [12,  4,  4,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  4,  4, 12],
    [12,  4,  4,  1,  1,  1,  7,  7,  7,  7,  7,  7,  7,  7,  1,  1,  1,  4,  4, 12],
    [12,  4,  4,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  4,  4, 12],
    [12,  4,  4,  7,  7,  7,  1,  1, 14, 14, 14, 14,  1,  1,  7,  7,  7,  4,  4, 12],
    [12,  4,  4, 11, 11, 11, 11, 11, 14, 14, 14, 14, 11, 11, 11, 11, 11,  4,  4, 12],
    [12, 11, 11, 11, 11, 11, 11, 11, 14, 14, 14, 14, 11, 11, 11, 11, 11, 11, 11, 12],
    [12, 11, 11, 14, 14, 14, 11, 11, 14, 14, 14, 14, 11, 11, 14, 14, 14, 11, 11, 12],
    [12, 11, 11, 11, 11, 11, 11, 11, 14, 14, 14, 14, 11, 11, 11, 11, 11, 11, 11, 12],
    [12, 11, 11, 11, 11, 11, 11, 11, 11, 14, 14, 11, 11, 11, 11, 11, 11, 11, 11, 12],
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]
  ];
  const def = {
    id: 'submap_13',
    index: 13,
    key: 'bathhouse_grotto',
    name: 'Bathhouse Steam Grotto',
    emoji: '♨️',
    zoneId: 11,
    color: '#38bdf8',
    paletteId: 33,
    musicZone: 11,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 22, y: 148, kind: 'subportal', style: 'bath_curtain', label: 'Bathhouse Steam Grotto' },
    entry: { x: 10, y: 13, dir: 3 },
    exit: { x: 10, y: 14, kind: 'exitmat', style: 'bath_curtain', label: 'Exit to Tiger Forest & Namsan Sanctuary' },
    palette: {
      g: '#2f6f7e', gd: '#215360', gl: '#488d9e',
      t1: '#38bdf8', t2: '#67e8f9', t3: '#bae6fd',
      p: '#c89b6e', pd: '#a4774b', pl: '#e2bc93',
      sand: '#ebd5a0', sandd: '#cfb478',
      tree: '#2b6e5e', treed: '#1c4d41', treel: '#438f7c',
      cliff: '#4a5568', cliffd: '#2d3748', cliffl: '#718096',
      floor: '#d6ad7c', floord: '#b58958',
      plaza: '#5eead4', plazad: '#2dd4bf', plazal: '#99f6e4'
    },
    tiles,
    decals: [
      { x: 8, y: 2, d: 7 }, { x: 12, y: 2, d: 7 },
      { x: 3, y: 6, d: 7 }, { x: 6, y: 8, d: 7 },
      { x: 13, y: 8, d: 7 }, { x: 16, y: 6, d: 7 },
      { x: 6, y: 4, d: 8 }, { x: 14, y: 4, d: 8 },
      { x: 9, y: 6, d: 8 }, { x: 11, y: 6, d: 8 },
      { x: 10, y: 7, d: 8 },
      { x: 9, y: 8, d: 8 }, { x: 11, y: 8, d: 8 },
      { x: 9, y: 12, d: 8 }, { x: 11, y: 12, d: 8 }
    ],
    props: [
      { kind: 'hotspring', x: 4, y: 6, w: 2, h: 2, title: 'Jade Mineral Hot Spring', msg: '♨️ Steaming jade-mineral spring water infused with mugwort and fragrant yuzu peel!' },
      { kind: 'hotspring', x: 14, y: 6, w: 2, h: 2, title: 'Cypress Hinoki Bath', msg: '♨️ Warm hinoki cypress thermal bath bubbling with soothing volcanic geyser steam!' },
      { kind: 'lantern', x: 7, y: 3, w: 1, h: 1, title: 'Steam Grotto Lantern', msg: '🏮 A warm hanji paper lantern glowing softly through the rising mineral mist.' },
      { kind: 'lantern', x: 13, y: 3, w: 1, h: 1, title: 'Steam Grotto Lantern', msg: '🏮 A warm hanji paper lantern illuminating the jade bathhouse sanctuary.' },
      { kind: 'table', x: 4, y: 11, w: 2, h: 1, title: 'Jjimjilbang Cypress Table', msg: '🥚 A low cypress table set with oak-roasted jjimjilbang eggs, chilled sweet rice sikhye, and sheep-horn towels!' },
      { kind: 'counter', x: 15, y: 11, w: 2, h: 1, title: 'Auntie Bora\'s Snack Bar', msg: '🥤 Steaming baskets of smoky roasted eggs and frosty pitchers of sweet sikhye!' },
      { kind: 'flowerpot', x: 7, y: 12, w: 1, h: 1, title: 'Mugwort & Lotus Planter', msg: '🌿 Aromatic Korean mugwort and water-lotus thriving in the warm bathhouse humidity.' },
      { kind: 'flowerpot', x: 12, y: 12, w: 1, h: 1, title: 'Yuzu & Camellia Planter', msg: '🍊 Blooming camellia and citrus yuzu branches perfuming the cypress walkway.' },
      { kind: 'sign', x: 8, y: 13, w: 1, h: 1, name: 'Bathhouse Rules', title: 'Bathhouse Rules', text: '♨️ "Please rinse before entering the mineral pools, enjoy roasted eggs & sikhye, and watch out for the Steam-Spring Lord Water Demon!"', msg: '♨️ "Please rinse before entering the mineral pools, enjoy roasted eggs & sikhye, and watch out for the Steam-Spring Lord Water Demon!"' }
    ],
    chests: [
      { x: 2, y: 3, loot: { rainbow: 2, berry: 3, star: 2, gold: 130 } },
      { x: 17, y: 3, loot: { rainbow: 2, berry: 2, star: 2, gold: 150 } }
    ],
    npc: {
      id: 'sub_npc_13',
      name: 'Bathhouse Auntie Bora',
      look: 'chef',
      x: 14,
      y: 12,
      lines: [
        'Welcome to the Bathhouse Steam Grotto, Chuyu! Fold your towel into cute sheep horns and unwind! ♨️🐑',
        'I just pulled smoky oak-roasted jjimjilbang eggs from the stone kiln and poured ice-cold sweet rice sikhye! 🥚🥤',
        'Take these warm bathhouse treats before challenging the Steam-Spring Lord Water Demon!'
      ],
      gift: { rainbow: 2, berry: 4, star: 2, gold: 110 },
      after: 'Nothing beats smoky jjimjilbang eggs and chilled sweet sikhye after calming the Steam-Spring Lord Water Demon! ♨️🥚'
    },
    wildPool: {
      lv: [13, 17],
      maxWilds: 4,
      table: [['waterdemon', 35], ['derpy', 25], ['sussie', 20], ['jeoseung', 20]]
    },
    boss: {
      key: 'boss_submap_13',
      sp: 'waterdemon',
      lv: 19,
      x: 10,
      y: 4,
      title: 'Steam-Spring Lord Water Demon',
      intro: '♨️ Steam-Spring Lord Water Demon erupts from the jade mineral geyser in a swirling vortex of sparkling steam!',
      winLines: ['Steam-Spring Lord Water Demon calms the boiling geysers and gifts Chuyu a glowing Hot Spring Pearl! ♨️✨'],
      reward: { rainbow: 2, berry: 4, star: 2, gold: 165 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();

