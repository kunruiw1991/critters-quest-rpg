'use strict';
// js/submaps/submap_01.js — Map 01: Sunshine Cozy Village Hall 🏡 (Zone 1)
(() => {
  const W = 20, H = 16;
  // Tile legend:
  // 12 = T.CLIFF (outer walls)
  // 11 = T.FLOOR (warm oak floorboards)
  // 14 = T.PLAZA (royal crimson & gold hearth carpet runner / stage)
  //  5 = T.PATH  (golden woven trim & cross-aisles)
  //  6 = T.FLOWERS (indoor flower border planters & stage garland)
  //  4 = T.TALL  (sunlit indoor herb & clover planter beds — 21 tiles total)
  const tiles = [
    // x: 0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12], // y=0  North wall
    [12, 11, 11, 11, 11, 11, 11, 11, 14, 14, 14, 14, 14, 11, 11, 11, 11, 11, 11, 12], // y=1  North library wall & throne dais
    [12, 11, 11,  5, 11, 11,  6, 14, 14, 14, 14, 14, 14, 14,  6, 11,  5, 11, 11, 12], // y=2  Upper stage & treasure alcoves
    [12, 11,  5, 14,  5, 11,  6, 14, 14, 14, 14, 14, 14, 14,  6,  5, 14,  5, 11, 12], // y=3  Chests at (3,3) and (16,3)
    [12, 11, 11,  5, 11, 11,  6, 14, 14, 14, 14, 14, 14, 14,  6, 11,  5, 11, 11, 12], // y=4  Boss Village Guardian Sunny at (10,4)
    [12, 11, 11,  5, 11, 11,  6, 14, 14, 14, 14, 14, 14, 14,  6, 11,  5, 11, 11, 12], // y=5  Lower stage steps
    [12, 11,  5,  5,  5,  5,  5,  5,  5, 14, 14, 14,  5,  5,  5,  5,  5,  5, 11, 12], // y=6  Main cross-walkway
    [12, 11,  6,  6,  6,  6, 11, 11,  5, 14, 14, 14,  5, 11, 11,  6,  6,  6, 11, 12], // y=7  North planter flower border
    [12, 11,  4,  4,  4,  4, 11, 11,  5, 14, 14, 14,  5, 11, 11,  4,  4,  4, 11, 12], // y=8  Indoor tall-grass gardens (row 1)
    [12, 11,  4,  4,  4,  4, 11, 11,  5, 14, 14, 14,  5, 11,  5,  4,  4,  4, 11, 12], // y=9  Indoor tall-grass gardens (row 2)
    [12, 11,  4,  4,  4,  4, 11, 11,  5, 14, 14, 14,  5,  5, 14,  4,  4,  4, 11, 12], // y=10 Elder Sunny at (14,10)
    [12, 11,  6,  6,  6,  6, 11, 11,  5, 14, 14, 14,  5, 11,  5,  6,  6,  6, 11, 12], // y=11 South planter flower border
    [12, 11,  5,  5,  5,  5,  5,  5,  5, 14, 14, 14,  5,  5,  5,  5,  5,  5, 11, 12], // y=12 South cross-walkway
    [12, 11, 11, 11, 11, 11, 11, 11,  5, 14, 14, 14,  5, 11, 11, 11, 11, 11, 11, 12], // y=13 Entry at (10,13)
    [12, 11, 11,  6, 11, 11, 11, 11,  5, 14, 14, 14,  5, 11, 11, 11,  6, 11, 11, 12], // y=14 Exit at (10,14)
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]  // y=15 South wall
  ];

  const def = {
    id: 'submap_01',
    index: 1,
    key: 'village_hall',
    name: 'Sunshine Cozy Village Hall',
    emoji: '🏡',
    zoneId: 1,
    color: '#ffd166',
    paletteId: 21,
    musicZone: 1,
    borderTile: 12,
    width: W,
    height: H,
    entrance: {
      x: 60,
      y: 67,
      kind: 'subportal',
      style: 'hall_door',
      label: 'Sunshine Cozy Village Hall'
    },
    entry: { x: 10, y: 13, dir: 3 },
    exit: {
      x: 10,
      y: 14,
      kind: 'exitmat',
      style: 'hall_door',
      label: 'Exit to Sunshine Village'
    },
    palette: {
      g: '#8fd16a', gd: '#73b955', gl: '#aee486',
      t1: '#59b345', t2: '#429632', t3: '#7ad662',
      p: '#e6c89c', pd: '#c9a675', pl: '#f5dec0',
      sand: '#f3e2a6', sandd: '#e3cc88',
      tree: '#4caf4a', treed: '#2f8a36', treel: '#7fd36a',
      cliff: '#6b4226', cliffd: '#4a2c18', cliffl: '#8f5b38',
      floor: '#d8a46f', floord: '#ba8550',
      plaza: '#e85d5d', plazad: '#c44141', plazal: '#ff8585'
    },
    tiles,
    decals: [
      { x: 9, y: 3, d: 6 },
      { x: 11, y: 3, d: 7 },
      { x: 3, y: 2, d: 6 },
      { x: 16, y: 2, d: 7 },
      { x: 9, y: 6, d: 6 },
      { x: 11, y: 6, d: 7 },
      { x: 4, y: 6, d: 5 },
      { x: 15, y: 6, d: 5 },
      { x: 10, y: 8, d: 9 },
      { x: 10, y: 11, d: 9 },
      { x: 3, y: 12, d: 6 },
      { x: 16, y: 12, d: 7 }
    ],
    props: [
      {
        kind: 'throne',
        x: 10, y: 2, w: 1, h: 1,
        title: 'Sunshine Guardian Seat',
        msg: '☀️ The carved oak seat of Village Guardian Sunny, radiating gentle golden warmth.',
        name: 'Sunshine Guardian Seat',
        text: '☀️ The carved oak seat of Village Guardian Sunny, radiating gentle golden warmth.'
      },
      {
        kind: 'banner_stand',
        x: 7, y: 1, w: 1, h: 1,
        title: 'Smiling Sun Crest',
        msg: '🚩 A golden tapestry woven with the cheerful emblem of Sunshine Village.',
        name: 'Smiling Sun Crest',
        text: '🚩 A golden tapestry woven with the cheerful emblem of Sunshine Village.'
      },
      {
        kind: 'banner_stand',
        x: 13, y: 1, w: 1, h: 1,
        title: 'Rainbow Island Welcome Banner',
        msg: '🚩 "May every traveler and Critter find a true friend under the sun!"',
        name: 'Rainbow Island Welcome Banner',
        text: '🚩 "May every traveler and Critter find a true friend under the sun!"'
      },
      {
        kind: 'bookshelf',
        x: 2, y: 1, w: 1, h: 1,
        title: 'Village Chronicle Shelf',
        msg: '📖 "How Sunshine Village & the Smiling Critters built their cozy island home!"',
        name: 'Village Chronicle Shelf',
        text: '📖 "How Sunshine Village & the Smiling Critters built their cozy island home!"'
      },
      {
        kind: 'bookshelf',
        x: 4, y: 1, w: 1, h: 1,
        title: 'Critter Bond Encyclopedia',
        msg: '📖 "Smiling Critters thrive on kindness, warm sunshine, and shared adventures."',
        name: 'Critter Bond Encyclopedia',
        text: '📖 "Smiling Critters thrive on kindness, warm sunshine, and shared adventures."'
      },
      {
        kind: 'bookshelf',
        x: 15, y: 1, w: 1, h: 1,
        title: 'Critter Care Guide',
        msg: '📖 "Remember: Sweet Berries heal your Critter and give +45% Catch Chance!"',
        name: 'Critter Care Guide',
        text: '📖 "Remember: Sweet Berries heal your Critter and give +45% Catch Chance!"'
      },
      {
        kind: 'bookshelf',
        x: 17, y: 1, w: 1, h: 1,
        title: 'Island Explorer Atlas',
        msg: '📖 "Twenty hidden sanctums, grottoes, and cozy halls await across Rainbow Island!"',
        name: 'Island Explorer Atlas',
        text: '📖 "Twenty hidden sanctums, grottoes, and cozy halls await across Rainbow Island!"'
      },
      {
        kind: 'table',
        x: 2, y: 5, w: 1, h: 1,
        title: 'Honey-Berry Tea Table',
        msg: '🍵 A steaming pot of chamomile tea beside freshly baked sweet-berry scones.',
        name: 'Honey-Berry Tea Table',
        text: '🍵 A steaming pot of chamomile tea beside freshly baked sweet-berry scones.'
      },
      {
        kind: 'table',
        x: 17, y: 5, w: 1, h: 1,
        title: 'Elder Sunny\'s Study Desk',
        msg: '📜 Detailed maps of Sunshine Meadows and affectionate sketches of DogDay and CatNap.',
        name: 'Elder Sunny\'s Study Desk',
        text: '📜 Detailed maps of Sunshine Meadows and affectionate sketches of DogDay and CatNap.'
      },
      {
        kind: 'fountain',
        x: 6, y: 9, w: 1, h: 1,
        title: 'Sunbeam Indoor Basin',
        msg: '⛲ A crystal-clear indoor spring basin humming with soothing meadow melodies.',
        name: 'Sunbeam Indoor Basin',
        text: '⛲ A crystal-clear indoor spring basin humming with soothing meadow melodies.'
      },
      {
        kind: 'lantern',
        x: 7, y: 3, w: 1, h: 1,
        title: 'Hearth Glow Lantern',
        msg: '🏮 A warm amber lantern illuminating the Guardian hearth stage.',
        name: 'Hearth Glow Lantern',
        text: '🏮 A warm amber lantern illuminating the Guardian hearth stage.'
      },
      {
        kind: 'lantern',
        x: 13, y: 3, w: 1, h: 1,
        title: 'Hearth Glow Lantern',
        msg: '🏮 A warm amber lantern casting golden light across the crimson carpet.',
        name: 'Hearth Glow Lantern',
        text: '🏮 A warm amber lantern casting golden light across the crimson carpet.'
      },
      {
        kind: 'lantern',
        x: 8, y: 13, w: 1, h: 1,
        title: 'Welcome Lantern',
        msg: '🏮 Welcoming travelers stepping into the Sunshine Cozy Village Hall.',
        name: 'Welcome Lantern',
        text: '🏮 Welcoming travelers stepping into the Sunshine Cozy Village Hall.'
      },
      {
        kind: 'lantern',
        x: 12, y: 13, w: 1, h: 1,
        title: 'Welcome Lantern',
        msg: '🏮 Guiding adventurers safely back out toward Sunshine Village.',
        name: 'Welcome Lantern',
        text: '🏮 Guiding adventurers safely back out toward Sunshine Village.'
      },
      {
        kind: 'flowerpot',
        x: 6, y: 13, w: 1, h: 1,
        title: 'Sun-Drop Planter',
        msg: '🌻 Golden sunflowers tended with love by Bobby BearHug and Hoppy Hopscotch.',
        name: 'Sun-Drop Planter',
        text: '🌻 Golden sunflowers tended with love by Bobby BearHug and Hoppy Hopscotch.'
      },
      {
        kind: 'flowerpot',
        x: 14, y: 13, w: 1, h: 1,
        title: 'Sweet Lavender Planter',
        msg: '🪻 Fragrant lavender blossoms that help CatNap purr with peaceful dreams.',
        name: 'Sweet Lavender Planter',
        text: '🪻 Fragrant lavender blossoms that help CatNap purr with peaceful dreams.'
      }
    ],
    chests: [
      { x: 3, y: 3, loot: { berry: 3, star: 2, gold: 80 } },
      { x: 16, y: 3, loot: { rainbow: 1, berry: 2, gold: 100 } }
    ],
    npc: {
      id: 'sub_npc_01',
      name: 'Elder Sunny',
      look: 'elder',
      x: 14,
      y: 10,
      lines: [
        'Welcome to the Sunshine Cozy Village Hall, Chuyu! 🏡☀️ Step onto our warm oak floor and make yourself right at home.',
        'Here in Sunshine Meadows, we raise young Smiling Critters among our indoor flower beds before they set off across Rainbow Island.',
        'Every great expedition begins with a kind heart and a full satchel — please accept this Village Care Pack with my blessing!'
      ],
      gift: { berry: 3, rainbow: 1, gold: 60 },
      after: [
        'Village Guardian Sunny is waiting on the crimson hearth carpet up north — step up for a friendly sparring match whenever you feel ready! ☀️🌟'
      ]
    },
    wildPool: {
      lv: [3, 6],
      maxWilds: 4,
      table: [['dogday', 25], ['catnap', 25], ['hoppy', 25], ['bobby', 25]]
    },
    boss: {
      key: 'boss_submap_01',
      sp: 'sunny',
      lv: 8,
      x: 10,
      y: 4,
      title: 'Village Guardian Sunny',
      intro: '☀️ Village Guardian Sunny beams with golden warmth from the hearth stage! "Let\'s see the bright bond between you and your Critters in a friendly match!"',
      winLines: [
        '☀️ Village Guardian Sunny cheers with a radiant smile and bestows the Sunshine Hearth Blessing upon Chuyu! 🌟'
      ],
      reward: { rainbow: 2, berry: 3, gold: 80 }
    }
  };

  if (window.CQData && typeof CQData.registerSubmap === 'function') {
    CQData.registerSubmap(def);
  } else {
    window.CQSubmaps = window.CQSubmaps || [];
    window.CQSubmaps.push(def);
  }
})();
