'use strict';
// js/submaps/submap_05.js — Map 05: Pirate Shipwreck Hold (Zone 5)
(() => {
  const W = 24, H = 16;
  // 24x16 sunken gale-shipwreck cargo hold:
  // 12 = T.CLIFF (hull timbers / outer bulkheads)
  // 11 = T.FLOOR (weathered timber deck planks)
  // 14 = T.PLAZA (gilded captain's quarter dais & treasure alcoves)
  //  1 = T.SHALLOW (flooded bilge water channels)
  //  7 = T.BRIDGE_H (rope-lashed oak gangplanks)
  //  4 = T.TALL (bioluminescent sea-moss & kelp patches: 28 tiles)
  const tiles = [
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12],
    [12,11,11,11,11,11,11, 1,11,14,14,14,14,14,14,14,11, 1,11,11,11,11,11,12],
    [12,11,14,14,14,11,11, 1,11,14,14,14,14,14,14,14,11, 1,11,14,14,14,11,12],
    [12,11,14,14,14,11, 7, 7, 7,14,14,14,14,14,14,14, 7, 7, 7,14,14,14,11,12],
    [12,11,14,14,14,11, 7, 7, 7,14,14,14,14,14,14,14, 7, 7, 7,14,14,14,11,12],
    [12,11,11,11,11,11,11, 1,11,14,14,14,14,14,14,14,11, 1,11,11,11,11,11,12],
    [12,11, 4, 4, 4, 4,11, 1,11,11,11, 7, 7, 7,11,11,11, 1,11, 4, 4, 4,11,12],
    [12,11, 4, 4, 4, 4, 7, 7, 7,11,11, 7, 7, 7,11,11, 7, 7, 7, 4, 4, 4,11,12],
    [12,11, 4, 4, 4, 4, 7, 7, 7,11,11, 7, 7, 7,11,11, 7, 7, 7, 4, 4, 4,11,12],
    [12,11, 4, 4, 4, 4,11, 1,11,11,11, 7, 7, 7,11,11,11, 1,11, 4, 4, 4,11,12],
    [12,11, 1, 1, 1, 1, 1, 1,11,11,11, 7, 7, 7,11,11,11, 1, 1, 1, 1, 1,11,12],
    [12,11,11,11,11,11,11, 1,11,11,11, 7, 7, 7,11,11,11, 1,11,11,11,11,11,12],
    [12,11,11,11,11,11, 7, 7, 7,11,11, 7, 7, 7,11,11,11, 7, 7,11,11,11,11,12],
    [12,11,11,11,11,11,11, 1,11,11,11,14,14,14,11,11,11, 1,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,11,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]
  ];
  const def = {
    id: 'submap_05',
    index: 5,
    key: 'shipwreck_hold',
    name: 'Pirate Shipwreck Hold',
    emoji: '🏴‍☠️',
    zoneId: 5,
    color: '#f59e0b',
    paletteId: 25,
    musicZone: 5,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 112, y: 35, kind: 'subportal', style: 'hatch', label: 'Pirate Shipwreck Hold' },
    entry: { x: 12, y: 13, dir: 3 },
    exit: { x: 12, y: 14, kind: 'exitmat', style: 'hatch', label: 'Climb up to Windmill Ridge Coast' },
    palette: {
      g: '#5c4028', gd: '#47301c', gl: '#755336',
      t1: '#3b8c6e', t2: '#296e54', t3: '#56b893',
      p: '#8c6239', pd: '#6e4b2a', pl: '#a8794c',
      sand: '#d4b483', sandd: '#b89765',
      tree: '#3d7a5a', treed: '#28593f', treel: '#5aa67d',
      cliff: '#3d2817', cliffd: '#26180d', cliffl: '#593c24',
      floor: '#7a5230', floord: '#5e3d22',
      plaza: '#b8860b', plazad: '#916806', plazal: '#daa520'
    },
    tiles,
    decals: [
      { x: 6, y: 2, d: 12 },
      { x: 18, y: 2, d: 12 },
      { x: 12, y: 5, d: 9 },
      { x: 12, y: 9, d: 9 },
      { x: 3, y: 12, d: 11 },
      { x: 21, y: 12, d: 11 }
    ],
    props: [
      { kind: 'throne', x: 12, y: 2, w: 1, h: 1, title: 'Captain\'s Helm Throne', msg: '🏴‍☠️ The ornate oak-and-brass throne of the Galleon\'s Storm-Captain, overlooking the flooded cargo deck.' },
      { kind: 'banner_stand', x: 9, y: 2, w: 1, h: 1, title: 'Jolly Roger Banner', msg: '🏴‍☠️ A weathered silk Jolly Roger embroidered with a golden lightning bolt and smiling Critter skull.' },
      { kind: 'banner_stand', x: 15, y: 2, w: 1, h: 1, title: 'Windmill Fleet Ensign', msg: '⚓ The royal amber-and-teal ensign of the Windmill Ridge explorer fleet.' },
      { kind: 'brazier', x: 10, y: 4, w: 1, h: 1, title: 'Storm-Flame Brazier', msg: '🔥 Crackling amber sea-resin keeps the captain\'s quarter warm against the ocean chill.' },
      { kind: 'brazier', x: 14, y: 4, w: 1, h: 1, title: 'Storm-Flame Brazier', msg: '🔥 Crackling amber sea-resin casts dancing golden shadows across the quarterdeck.' },
      { kind: 'lantern', x: 9, y: 6, w: 1, h: 1, title: 'Port Bilge Lantern', msg: '🏮 A brass ship\'s lantern swaying gently as tidewater laps through the bilge channels.' },
      { kind: 'lantern', x: 15, y: 6, w: 1, h: 1, title: 'Starboard Bilge Lantern', msg: '🏮 A brass ship\'s lantern illuminating the oak gangplanks across the cargo hold.' },
      { kind: 'table', x: 4, y: 11, w: 2, h: 1, title: 'Navigator\'s Sea-Chart Table', msg: '🗺️ Ink-stained charts of Rainbow Island\'s hidden reefs, compasses, and brass astrolabes.' },
      { kind: 'counter', x: 19, y: 11, w: 2, h: 1, title: 'Galley Mess Counter', msg: '🍊 Casks of sweet berry cider, spiced sea-biscuits, and gleaming brass tankards.' },
      { kind: 'sign', x: 9, y: 12, w: 1, h: 1, name: 'Captain\'s Logbook', title: 'Captain\'s Logbook', text: '⚓ "Log #402: When the great gale beached our galleon below Windmill Ridge, the local Critters helped every sailor ashore. Now our hold is a cozy haven for bold adventurers!"', msg: '⚓ "Log #402: When the great gale beached our galleon below Windmill Ridge, the local Critters helped every sailor ashore. Now our hold is a cozy haven for bold adventurers!"' }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 2, star: 2, gold: 150 } },
      { x: 20, y: 3, loot: { berry: 4, star: 2, rainbow: 1, gold: 160 } }
    ],
    npc: {
      id: 'sub_npc_05',
      name: 'First Mate Barnaby',
      look: 'sailor',
      x: 16,
      y: 12,
      lines: [
        'Yoho, matey! Welcome aboard the Golden Gale\'s sunken cargo hold! 🏴‍☠️⚓',
        'Years ago a howling squall wedged our galleon into the cliffs of Windmill Ridge, and the sea-moss grew right across the bilge.',
        'Take a fair crewman\'s share of our doubloons, Star Berries, and Rainbow Capsules before ye cross the gangplank!'
      ],
      gift: { rainbow: 2, berry: 3, star: 1, gold: 120 },
      after: [
        'Storm-Captain Thunderbolt Hoppy still stands watch on the gilded quarterdeck at the bow! ⚡🏴‍☠️',
        'Check the port and starboard treasure alcoves for the rest of our sea chests!'
      ]
    },
    wildPool: {
      lv: [7, 11],
      maxWilds: 4,
      table: [['hoppy', 35], ['kickin', 35], ['jj', 15], ['thunderbolt', 15]]
    },
    boss: {
      key: 'boss_submap_05',
      sp: 'thunderbolt',
      lv: 14,
      x: 12,
      y: 4,
      title: 'Storm-Captain Thunderbolt',
      intro: '⚡ Storm-Captain Thunderbolt Hoppy salutes from the gilded quarterdeck as lightning crackles across the helm!',
      winLines: [
        '⚡ "Shiver me whiskers, what a tempest of a battle! Ye have the heart of a true Sea-Captain!"',
        'Captain Thunderbolt salutes and shares the Galleon\'s Golden Compass hoard! 🏴‍☠️🌟'
      ],
      reward: { rainbow: 2, berry: 3, star: 2, gold: 160 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();

