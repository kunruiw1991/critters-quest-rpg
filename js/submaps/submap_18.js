'use strict';
// js/submaps/submap_18.js — Map 18: Bell Tower Sacred Attic 🔔 (Zone 14: Johto Golden Autumn)
(() => {
  // 22 cols × 18 rows handcrafted Ecruteak Bell Tower tenth-tier sacred attic:
  //   12 = T.CLIFF (outer hinoki pagoda walls & rafters)
  //   11 = T.FLOOR (aged hinoki pagoda wood floor)
  //   14 = T.PLAZA (Clear Bell sanctum dais & ceremonial alcoves)
  //    6 = T.FLOWERS (crimson & gold autumn maple-petal carpets)
  //    5 = T.PATH (sacred golden lantern walkways)
  //    4 = T.TALL (28 golden-leaf tatami encounter mats in west & east wings)
  const tiles = [
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12],
    [12,11,11,11,11,11,11, 6, 6,14,14,14,14,14, 6, 6,11,11,11,11,11,12],
    [12,11,14,14,14,11, 6, 6,14,14,14,14,14,14,14, 6,11,14,14,14,11,12],
    [12,11,14,14,14, 5, 5, 5,14,14,14,14,14,14,14, 5, 5,14,14,14,11,12],
    [12,11,14,14,14, 6, 6,11,14,14,14,14,14,14,14,11, 6,14,14,14,11,12],
    [12,11, 6, 5,11,11, 6, 6,14,14,14,14,14,14,14, 6, 6,11, 5, 6,11,12],
    [12,11, 6, 5, 4, 4, 4, 4, 6,11,14,14,14,11, 6, 4, 4, 4, 5, 6,11,12],
    [12,11, 6, 5, 4, 4, 4, 4, 6, 5, 5,14, 5, 5, 6, 4, 4, 4, 5, 6,11,12],
    [12,11, 5, 5, 5, 5, 5, 5, 5, 5,14,14,14, 5, 5, 5, 5, 5, 5, 5,11,12],
    [12,11, 6, 5, 4, 4, 4, 4, 6, 5,14,14,14, 5, 6, 4, 4, 4, 5, 6,11,12],
    [12,11, 6, 5, 4, 4, 4, 4, 6,11,14,14,14,11, 6, 4, 4, 4, 5, 6,11,12],
    [12,11, 6, 5, 6, 6, 6, 6,11,11, 5,14, 5,11,11, 6, 6, 6, 5, 6,11,12],
    [12,11,11, 5, 5, 5, 5, 5, 5,11, 5,14, 5,11, 5, 5, 5, 5, 5,11,11,12],
    [12,11, 6, 6,11,11, 6, 6, 5, 5,14,14,14, 5, 5, 6, 6,11, 6, 6,11,12],
    [12,11, 6,11,11,11,11,11,11, 5,14,14,14, 5,14,14,14,11,11, 6,11,12],
    [12,11,11,11, 6, 6, 5, 5, 5, 5,14,14,14, 5, 5, 5, 6, 6,11,11,11,12],
    [12,11,11,11,11,11,11, 6, 6,14,14,14,14,14, 6, 6,11,11,11,11,11,12],
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]
  ];

  const def = {
    id: 'submap_18',
    index: 18,
    key: 'bell_tower',
    name: 'Bell Tower Sacred Attic',
    emoji: '🔔',
    zoneId: 14,
    color: '#d97706',
    paletteId: 38,
    musicZone: 14,
    borderTile: 12,
    width: 22,
    height: 18,
    entrance: {
      x: 30,
      y: 188,
      kind: 'subportal',
      style: 'pagoda_stairs',
      label: 'Bell Tower Sacred Attic'
    },
    entry: { x: 11, y: 15, dir: 3 },
    exit: {
      x: 11,
      y: 16,
      kind: 'exitmat',
      style: 'pagoda_stairs',
      label: 'Exit to Johto Golden Autumn'
    },
    palette: {
      g: '#78350f', gd: '#451a03', gl: '#92400e',
      t1: '#f59e0b', t2: '#ef4444', t3: '#fde047',
      p: '#d97706', pd: '#b45309', pl: '#fbbf24',
      sand: '#fde68a', sandd: '#fcd34d',
      tree: '#991b1b', treed: '#7f1d1d', treel: '#dc2626',
      cliff: '#451a03', cliffd: '#290f02', cliffl: '#78350f',
      floor: '#7c2d12', floord: '#581c0c',
      plaza: '#f59e0b', plazad: '#d97706', plazal: '#fde047'
    },
    tiles,
    decals: [
      { x: 10, y: 3, d: 4 },
      { x: 12, y: 3, d: 4 },
      { x: 6, y: 4, d: 6 },
      { x: 16, y: 4, d: 6 },
      { x: 10, y: 5, d: 9 },
      { x: 12, y: 5, d: 9 },
      { x: 6, y: 8, d: 3 },
      { x: 11, y: 8, d: 4 },
      { x: 16, y: 8, d: 3 },
      { x: 6, y: 11, d: 6 },
      { x: 16, y: 11, d: 6 },
      { x: 8, y: 13, d: 3 },
      { x: 14, y: 13, d: 3 },
      { x: 10, y: 15, d: 9 },
      { x: 12, y: 15, d: 9 }
    ],
    props: [
      {
        kind: 'shrine',
        x: 11,
        y: 2,
        w: 1,
        h: 1,
        title: 'Clear Bell Sanctum Altar',
        msg: '🔔 The ancient Clear Bell hangs from golden hinoki beams, resonating with a crystalline chime that echoes across Ecruteak.',
        name: 'Clear Bell Sanctum Altar',
        text: '🔔 The ancient Clear Bell hangs from golden hinoki beams, resonating with a crystalline chime that echoes across Ecruteak.'
      },
      {
        kind: 'banner_stand',
        x: 9,
        y: 2,
        w: 1,
        h: 1,
        title: 'Crest of the Clear Bell',
        msg: '🎌 A gold-embroidered silk banner depicting the Clear Bell and the Rainbow Wing above Ecruteak Pagoda.',
        name: 'Crest of the Clear Bell',
        text: '🎌 A gold-embroidered silk banner depicting the Clear Bell and the Rainbow Wing above Ecruteak Pagoda.'
      },
      {
        kind: 'banner_stand',
        x: 13,
        y: 2,
        w: 1,
        h: 1,
        title: 'Crest of the North Wind',
        msg: '🎌 A ceremonial tapestry honoring Suicune, embodiment of the purifying North Wind.',
        name: 'Crest of the North Wind',
        text: '🎌 A ceremonial tapestry honoring Suicune, embodiment of the purifying North Wind.'
      },
      {
        kind: 'pillar',
        x: 5,
        y: 2,
        w: 1,
        h: 1,
        title: 'North-West Hinoki Pillar',
        msg: '🪵 A centuries-old hinoki cypress column joined without a single iron nail.',
        name: 'North-West Hinoki Pillar',
        text: '🪵 A centuries-old hinoki cypress column joined without a single iron nail.'
      },
      {
        kind: 'pillar',
        x: 16,
        y: 2,
        w: 1,
        h: 1,
        title: 'North-East Hinoki Pillar',
        msg: '🪵 Gold-lacquered rings encircle this ancient structural beam of the Bell Tower.',
        name: 'North-East Hinoki Pillar',
        text: '🪵 Gold-lacquered rings encircle this ancient structural beam of the Bell Tower.'
      },
      {
        kind: 'brazier',
        x: 8,
        y: 4,
        w: 1,
        h: 1,
        title: 'Sacred Amber Brazier',
        msg: '🔥 Fragrant cedar and autumn maple incense burn with a warm golden glow.',
        name: 'Sacred Amber Brazier',
        text: '🔥 Fragrant cedar and autumn maple incense burn with a warm golden glow.'
      },
      {
        kind: 'brazier',
        x: 14,
        y: 4,
        w: 1,
        h: 1,
        title: 'Aurora Flame Brazier',
        msg: '🔥 Shimmering blue-gold embers dance in rhythm with the chimes of the Clear Bell.',
        name: 'Aurora Flame Brazier',
        text: '🔥 Shimmering blue-gold embers dance in rhythm with the chimes of the Clear Bell.'
      },
      {
        kind: 'lantern',
        x: 9,
        y: 6,
        w: 1,
        h: 1,
        title: 'West Sanctum Lantern',
        msg: '🏮 A warm paper lantern casting golden light across the maple-leaf tatami.',
        name: 'West Sanctum Lantern',
        text: '🏮 A warm paper lantern casting golden light across the maple-leaf tatami.'
      },
      {
        kind: 'lantern',
        x: 13,
        y: 6,
        w: 1,
        h: 1,
        title: 'East Sanctum Lantern',
        msg: '🏮 Hand-painted with golden ginkgo and crimson momiji leaves.',
        name: 'East Sanctum Lantern',
        text: '🏮 Hand-painted with golden ginkgo and crimson momiji leaves.'
      },
      {
        kind: 'torii_mini',
        x: 9,
        y: 12,
        w: 1,
        h: 1,
        title: 'West Inner Torii',
        msg: '⛩️ Vermilion torii gate marking the threshold to the Clear Bell dais.',
        name: 'West Inner Torii',
        text: '⛩️ Vermilion torii gate marking the threshold to the Clear Bell dais.'
      },
      {
        kind: 'torii_mini',
        x: 13,
        y: 12,
        w: 1,
        h: 1,
        title: 'East Inner Torii',
        msg: '⛩️ Sacred cedar arch welcoming pure-hearted travelers into the attic sanctum.',
        name: 'East Inner Torii',
        text: '⛩️ Sacred cedar arch welcoming pure-hearted travelers into the attic sanctum.'
      },
      {
        kind: 'pillar',
        x: 5,
        y: 14,
        w: 1,
        h: 1,
        title: 'South-West Pagoda Pillar',
        msg: '🪵 Carved with reliefs of three legendary beasts racing across Johto.',
        name: 'South-West Pagoda Pillar',
        text: '🪵 Carved with reliefs of three legendary beasts racing across Johto.'
      },
      {
        kind: 'pillar',
        x: 17,
        y: 14,
        w: 1,
        h: 1,
        title: 'South-East Pagoda Pillar',
        msg: '🪵 Inscribed with ancient Ecruteak verses praising the Clear Bell.',
        name: 'South-East Pagoda Pillar',
        text: '🪵 Inscribed with ancient Ecruteak verses praising the Clear Bell.'
      },
      {
        kind: 'sign',
        x: 8,
        y: 14,
        w: 1,
        h: 1,
        title: 'Clear Bell Inscription',
        msg: '🔔 "When the Clear Bell chimes across golden maple leaves, the North Wind Suicune appears to test the pure of heart."',
        name: 'Clear Bell Inscription',
        text: '🔔 "When the Clear Bell chimes across golden maple leaves, the North Wind Suicune appears to test the pure of heart."'
      }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 2, star: 2, berry: 4, gold: 180 } },
      { x: 18, y: 3, loot: { master: 1, rainbow: 2, star: 2, gold: 220 } }
    ],
    npc: {
      id: 'sub_npc_18',
      name: 'Bell Keeper Eusine',
      look: 'elm',
      x: 15,
      y: 14,
      lines: [
        'Magnificent! You climbed all the way to the Bell Tower Sacred Attic, where the Clear Bell chimes across Ecruteak\'s golden autumn canopy! 🔔🍁',
        'Ever since the ancient Brass Tower burned and the Rainbow Wing revived the three beasts, Suicune has returned here on the purifying North Wind.',
        'I have searched all of Johto to witness Suicune\'s grace — please accept these sacred Bell Tower offerings before you approach the dais!'
      ],
      gift: { rainbow: 2, star: 2, berry: 4, gold: 160 },
      after: [
        'Sacred Bell Guardian Suicune stands serenely beneath the Clear Bell Altar to the north! May the crystal North Wind bless your battle! 🔔💎'
      ]
    },
    wildPool: {
      lv: [18, 23],
      maxWilds: 4,
      table: [
        ['chikorita', 22],
        ['cyndaquil', 24],
        ['togepi', 22],
        ['umbreon', 18],
        ['suicune', 14]
      ]
    },
    boss: {
      key: 'boss_submap_18',
      sp: 'suicune',
      lv: 27,
      x: 11,
      y: 4,
      title: 'Sacred Bell Guardian Suicune',
      intro: '🔔💎 Sacred Bell Guardian Suicune leaps gracefully across the golden hinoki beams as the Clear Bell chimes and a crystal aurora fills the attic!',
      winLines: [
        'Suicune nods with regal grace as the Clear Bell rings a pure note across the golden maple rafters! 🔔✨',
        'Sacred Bell Guardian Suicune purifies your pouch with Crystal Bell Treasure!'
      ],
      reward: { master: 1, rainbow: 3, star: 2, berry: 4, gold: 260 }
    }
  };

  if (window.CQData && typeof CQData.registerSubmap === 'function') {
    CQData.registerSubmap(def);
  } else {
    window.CQSubmaps = window.CQSubmaps || [];
    window.CQSubmaps.push(def);
  }
})();
