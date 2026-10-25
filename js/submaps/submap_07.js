'use strict';
// js/submaps/submap_07.js — Map 07: Glacier Ice Cavern ❄️ (Zone 7)
(() => {
  const W = 22, H = 18;
  // Tile legend:
  // 12 = T.CLIFF (glacier cavern perimeter walls)
  // 10 = T.ICE (crystalline mirror ice lake & causeway)
  //  9 = T.SNOW (packed powder snowbanks)
  // 14 = T.PLAZA (shimmering aurora altar & sanctum tiles)
  // 13 = T.STONES (carved glacial stepping-stone paths)
  //  4 = T.TALL (glowing frost-fern wild Critter patches: 36 tiles)
  const tiles = [
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    [12,  9,  9,  9,  9,  9,  9,  9, 10, 14, 14, 14, 14, 10,  9,  9,  9,  9,  9,  9,  9, 12],
    [12,  9, 14, 14, 13,  9,  9, 10, 10, 14, 14, 14, 14, 10, 10,  9,  9, 13, 14, 14,  9, 12],
    [12,  9, 14, 14, 13, 13, 13, 13, 10, 14, 14, 14, 14, 10, 13, 13, 13, 13, 14, 14,  9, 12],
    [12,  9,  9, 13,  9,  9, 10, 10, 10, 14, 14, 14, 14, 10, 10, 10,  9,  9, 13,  9,  9, 12],
    [12,  9,  9, 13,  9,  9, 10, 10, 10, 10, 14, 14, 10, 10, 10, 10,  9,  9, 13,  9,  9, 12],
    [12,  9,  9, 13, 13, 13, 13, 10, 10, 10, 13, 13, 10, 10, 10, 13, 13, 13, 13,  9,  9, 12],
    [12,  9,  4,  4,  4,  4, 13, 10, 10, 10, 10, 13, 10, 10, 10, 13,  4,  4,  4,  4,  9, 12],
    [12,  9,  4,  4,  4,  4, 13, 10, 10, 10, 10, 13, 10, 10, 10, 13,  4,  4,  4,  4,  9, 12],
    [12,  9,  4,  4,  4,  4, 13, 10, 10, 14, 14, 14, 14, 10, 10, 13,  4,  4,  4,  4,  9, 12],
    [12,  9,  4,  4,  4,  4, 13, 10, 10, 14, 14, 14, 14, 10, 10, 13,  4,  4,  4,  4,  9, 12],
    [12,  9,  9,  4,  4,  9, 13, 13, 10, 10, 10, 13, 10, 10, 13, 13,  9,  4,  4,  9,  9, 12],
    [12,  9,  9,  9,  9,  9,  9, 13, 13, 10, 10, 13, 10, 13, 13, 13,  9,  9,  9,  9,  9, 12],
    [12,  9,  9,  9,  9,  9,  9,  9, 13, 10, 10, 13, 10, 13, 14, 14, 14,  9,  9,  9,  9, 12],
    [12,  9,  9,  9,  9,  9,  9,  9,  9,  9, 10, 13, 10,  9, 14, 14,  9,  9,  9,  9,  9, 12],
    [12,  9,  9,  9,  9,  9,  9,  9,  9,  9, 13, 13, 13,  9,  9,  9,  9,  9,  9,  9,  9, 12],
    [12,  9,  9,  9,  9,  9,  9,  9,  9,  9, 13, 14, 13,  9,  9,  9,  9,  9,  9,  9,  9, 12],
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]
  ];

  const def = {
    id: 'submap_07',
    index: 7,
    key: 'ice_cavern',
    name: 'Glacier Ice Cavern',
    emoji: '❄️',
    zoneId: 7,
    color: '#7dd3fc',
    paletteId: 27,
    musicZone: 7,
    borderTile: 12,
    width: W,
    height: H,
    entrance: {
      x: 84,
      y: 13,
      kind: 'subportal',
      style: 'ice_cave',
      label: 'Glacier Ice Cavern'
    },
    entry: { x: 11, y: 15, dir: 3 },
    exit: {
      x: 11,
      y: 16,
      kind: 'exitmat',
      style: 'ice_cave',
      label: 'Exit to Frostberry Glacier'
    },
    palette: {
      g: '#dff2fc', gd: '#bfe0f5', gl: '#f5fbff',
      t1: '#90e0ef', t2: '#48cae4', t3: '#caf0f8',
      p: '#cce5f7', pd: '#a8d0ed', pl: '#ebf6ff',
      sand: '#e3f2fd', sandd: '#bbdefb',
      tree: '#3f888f', treed: '#2a656b', treel: '#66b2b8',
      cliff: '#5c9ec9', cliffd: '#3d769e', cliffl: '#94ccf0',
      floor: '#b3e5fc', floord: '#81d4fa',
      plaza: '#e1f5fe', plazad: '#b3e5fc', plazal: '#ffffff'
    },
    tiles,
    decals: [
      { x: 2, y: 5, d: 9 },
      { x: 6, y: 5, d: 9 },
      { x: 15, y: 5, d: 9 },
      { x: 19, y: 5, d: 9 },
      { x: 8, y: 7, d: 10 },
      { x: 11, y: 7, d: 10 },
      { x: 13, y: 7, d: 10 },
      { x: 10, y: 9, d: 11 },
      { x: 12, y: 9, d: 11 },
      { x: 4, y: 13, d: 9 },
      { x: 9, y: 12, d: 10 },
      { x: 17, y: 14, d: 9 }
    ],
    props: [
      {
        kind: 'altar',
        x: 11,
        y: 2,
        w: 1,
        h: 1,
        variant: 0,
        hue: 0,
        name: 'Aurora Prism Altar',
        title: 'Aurora Prism Altar',
        text: '❄️ Ribbons of cyan, violet, and rose northern light dance inside the ancient glacial altar.',
        msg: '❄️ Ribbons of cyan, violet, and rose northern light dance inside the ancient glacial altar.'
      },
      {
        kind: 'ice_pillar',
        x: 8,
        y: 4,
        w: 1,
        h: 1,
        variant: 0,
        hue: 0,
        name: 'West Glacier Pillar',
        title: 'West Glacier Pillar',
        text: '🧊 A fluted column of diamond-clear glacier ice humming with polar resonance.',
        msg: '🧊 A fluted column of diamond-clear glacier ice humming with polar resonance.'
      },
      {
        kind: 'ice_pillar',
        x: 14,
        y: 4,
        w: 1,
        h: 1,
        variant: 1,
        hue: 1,
        name: 'East Aurora Pillar',
        title: 'East Aurora Pillar',
        text: '🧊 Starlight refracts through the frozen pillar in shimmering rainbow arcs.',
        msg: '🧊 Starlight refracts through the frozen pillar in shimmering rainbow arcs.'
      },
      {
        kind: 'crystal_cluster',
        x: 5,
        y: 5,
        w: 1,
        h: 1,
        variant: 0,
        hue: 0,
        name: 'Singing Rime Cluster',
        title: 'Singing Rime Cluster',
        text: '💎 Chime-like frost crystals ring with a gentle lullaby whenever a Critter steps nearby.',
        msg: '💎 Chime-like frost crystals ring with a gentle lullaby whenever a Critter steps nearby.'
      },
      {
        kind: 'crystal_cluster',
        x: 16,
        y: 5,
        w: 1,
        h: 1,
        variant: 1,
        hue: 1,
        name: 'Starlight Ice Cluster',
        title: 'Starlight Ice Cluster',
        text: '💎 Frosted quartz spires glow with stored northern-lights energy.',
        msg: '💎 Frosted quartz spires glow with stored northern-lights energy.'
      },
      {
        kind: 'lantern',
        x: 9,
        y: 14,
        w: 1,
        h: 1,
        variant: 0,
        hue: 0,
        name: 'Frostfire Ice Lantern',
        title: 'Frostfire Ice Lantern',
        text: '🏮 A carved ice lantern holding a cozy blue aurora flame that never melts the snow.',
        msg: '🏮 A carved ice lantern holding a cozy blue aurora flame that never melts the snow.'
      },
      {
        kind: 'lantern',
        x: 13,
        y: 14,
        w: 1,
        h: 1,
        variant: 1,
        hue: 1,
        name: 'Glacier Guide Lantern',
        title: 'Glacier Guide Lantern',
        text: '🏮 Placed by Frostberry skiers to guide explorers safely back to the cavern exit.',
        msg: '🏮 Placed by Frostberry skiers to guide explorers safely back to the cavern exit.'
      },
      {
        kind: 'hotspring',
        x: 18,
        y: 13,
        w: 1,
        h: 1,
        variant: 0,
        hue: 0,
        name: 'Geothermal Melt Spring',
        title: 'Geothermal Melt Spring',
        text: '♨️ Warm mineral mist bubbles up through the glacier floor, keeping the skiers toasty!',
        msg: '♨️ Warm mineral mist bubbles up through the glacier floor, keeping the skiers toasty!'
      },
      {
        kind: 'snowman',
        x: 6,
        y: 13,
        w: 1,
        h: 1,
        variant: 0,
        hue: 0,
        name: 'Chilly Snowbuddy',
        title: 'Chilly Snowbuddy',
        text: '⛄ "Stay cozy, Chuyu! Aurora Guardian Fluff loves dancing where the ice mirror meets the northern altar!"',
        msg: '⛄ "Stay cozy, Chuyu! Aurora Guardian Fluff loves dancing where the ice mirror meets the northern altar!"'
      }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 2, berry: 3, star: 2, gold: 140 } },
      { x: 18, y: 3, loot: { rainbow: 2, star: 2, berry: 2, gold: 160 } }
    ],
    npc: {
      id: 'sub_npc_07',
      name: 'Skier Yukiko',
      look: 'girl',
      x: 15,
      y: 13,
      lines: [
        'Brrr-illiant! Welcome inside the sparkling Glacier Ice Cavern, Chuyu! ❄️✨',
        'When the northern lights shine through the glacier ceiling, the mirror lake below reflects a hundred pastel rainbows!',
        'Take these warm Sweet Berries, Star Candies, and Rainbow Capsules to keep your team energized in the snow!'
      ],
      gift: { rainbow: 2, berry: 4, star: 2, gold: 100 },
      after: [
        'Follow the carved stone causeway north across the mirror ice to meet Aurora Guardian Fluff at the Aurora Prism Altar! ❄️🌈'
      ]
    },
    wildPool: {
      lv: [11, 15],
      maxWilds: 4,
      table: [['bubba', 40], ['huggy', 40], ['aurora', 20]]
    },
    boss: {
      key: 'boss_submap_07',
      sp: 'aurora',
      lv: 18,
      x: 11,
      y: 4,
      title: 'Aurora Guardian Fluff',
      intro: '❄️ Aurora Guardian Fluff twirls a shimmering ribbon of polar starlight across the ice altar! Ready for a sparkling snow match?',
      winLines: [
        'Aurora Guardian Fluff wraps Chuyu in a warm northern-lights hug and bestows the Glacier Aurora Blessing! ❄️💖🌈'
      ],
      reward: { rainbow: 3, berry: 3, star: 2, gold: 180 }
    }
  };

  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();

