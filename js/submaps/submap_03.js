'use strict';
// js/submaps/submap_03.js — Map 03: Crystal Cavern (Zone 4)
(() => {
  const W = 22, H = 18;
  // 18 rows × 22 cols:
  // 12 = T.CLIFF (outer border), 11 = T.FLOOR (amethyst cavern floor),
  // 14 = T.PLAZA (central prism sanctum & dais), 1 = T.SHALLOW (crystal pools),
  // 13 = T.STONES (stepping stones), 4 = T.TALL (crystal grass), 6 = T.FLOWERS (prism blooms)
  const tiles = [
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12],
    [12,11,11,11,11,11,11,11,14,14,14,14,14,14,14,11,11,11,11,11,11,12],
    [12,11,14,14,14,11,11,11,14,14,14,14,14,14,14,11,11,14,14,14,11,12],
    [12,11,14,14,14,11,11,11,14,14,14,14,14,14,14,11,11,14,14,14,11,12],
    [12,11,14,14,14,11,11,11,14,14,14,14,14,14,14,11,11,14,14,14,11,12],
    [12,11, 1,13, 1, 1,11,11,14,14,14,14,14,14,14,11,11, 1, 1,13, 1,12],
    [12,11, 1,13, 1, 1,11,11,11,14,14,14,14,14,11,11,11, 1, 1,13, 1,12],
    [12,11,11,13,11,11,11,11,11,11,14,14,14,11,11,11,11,11,13,11,11,12],
    [12,11,11, 4, 4, 4, 4,11,11,11,14,14,14,11,11, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 6, 4,11,11,11,14,14,14,11,11, 4, 6, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4,11,11,11,14,14,14,11,11, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4,11,11,11,14,14,14,11,11, 4, 4, 4, 4,11,11,12],
    [12,11,11,11,11,11,11,11,11,14,14,14,14,14,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,13,13,13,14,14,14,14,14,14,14,13,13,13,11,11,11,12],
    [12,11,11, 1, 1,13, 1,11,11,14,14,14,14,14,11,11, 1,13, 1,11,11,12],
    [12,11,11, 1, 1,13, 1,11,11,11,14,14,14,11,11,11, 1,13, 1,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,11,11,11,11,11,11,11,11,12],
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]
  ];

  const def = {
    id: 'submap_03',
    index: 3,
    key: 'crystal_cavern',
    name: 'Crystal Cavern',
    emoji: '💎',
    zoneId: 4,
    color: '#b388ff',
    paletteId: 23,
    musicZone: 4,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 17, y: 37, kind: 'subportal', style: 'cave', label: 'Crystal Cavern' },
    entry: { x: 11, y: 15, dir: 3 },
    exit: { x: 11, y: 16, kind: 'exitmat', style: 'cave', label: 'Exit to Rainbow Crystal Meadow' },
    palette: {
      g: '#3b2d66', gd: '#2a1f4d', gl: '#52408a',
      t1: '#f48fb1', t2: '#80d8ff', t3: '#ffd54f',
      p: '#6e57b5', pd: '#544094', pl: '#8c75d6',
      sand: '#d1c4e9', sandd: '#b39ddb',
      tree: '#7e57c2', treed: '#5e35b1', treel: '#b39ddb',
      cliff: '#261c45', cliffd: '#17102e', cliffl: '#413270',
      floor: '#4a3980', floord: '#372963',
      plaza: '#7c65c9', plazad: '#5e49a8', plazal: '#a18ce8'
    },
    tiles,
    decals: [
      { x: 4, y: 2, d: 10 }, { x: 17, y: 2, d: 10 },
      { x: 10, y: 3, d: 9 }, { x: 12, y: 3, d: 9 },
      { x: 6, y: 5, d: 10 }, { x: 15, y: 5, d: 10 },
      { x: 11, y: 7, d: 9 }, { x: 11, y: 10, d: 9 },
      { x: 5, y: 12, d: 10 }, { x: 16, y: 12, d: 10 },
      { x: 7, y: 15, d: 9 }, { x: 15, y: 15, d: 9 }
    ],
    props: [
      { kind: 'altar', x: 11, y: 2, w: 1, h: 1, variant: 1, title: 'Rainbow Prism Altar', msg: 'A seven-faceted amethyst altar hums with harmonic rainbow resonance.' },
      { kind: 'pillar', x: 8, y: 2, w: 1, h: 1, variant: 1, title: 'Quartz Pillar', msg: 'Fluted quartz columns channel starlight deep beneath Rainbow Crystal Meadow.' },
      { kind: 'pillar', x: 14, y: 2, w: 1, h: 1, variant: 1, title: 'Quartz Pillar', msg: 'Ancient runes of harmony shimmer inside the translucent stone.' },
      { kind: 'crystal_cluster', x: 1, y: 2, w: 1, h: 1, hue: 1, variant: 1, title: 'Rose Tourmaline Spire', msg: 'Warm magenta light dances across the cavern walls.' },
      { kind: 'crystal_cluster', x: 20, y: 2, w: 1, h: 1, hue: 5, variant: 2, title: 'Celestial Topaz Cluster', msg: 'Golden-cyan prisms chime softly whenever a Critter steps nearby.' },
      { kind: 'lantern', x: 8, y: 6, w: 1, h: 1, variant: 1, title: 'Prism Lantern', msg: 'A floating crystal lantern casting violet-blue refractions over the pool.' },
      { kind: 'lantern', x: 14, y: 6, w: 1, h: 1, variant: 1, title: 'Prism Lantern', msg: 'A floating crystal lantern guiding travelers toward the northern sanctum.' },
      { kind: 'crystal_cluster', x: 1, y: 11, w: 1, h: 1, hue: 3, variant: 1, title: 'Sapphire Geode', msg: 'Cool sapphire crystals feed the underground reflection pools.' },
      { kind: 'crystal_cluster', x: 20, y: 11, w: 1, h: 1, hue: 7, variant: 2, title: 'Amethyst Geode', msg: 'Deep violet crystals sparkle with ancient Rainbow Island magic.' },
      { kind: 'lantern', x: 9, y: 14, w: 1, h: 1, variant: 1, title: 'Sanctum Waylight', msg: 'Crystal beacons welcome explorers entering from Rainbow Crystal Meadow.' },
      { kind: 'lantern', x: 13, y: 14, w: 1, h: 1, variant: 1, title: 'Sanctum Waylight', msg: 'Soft prism light marks the southern cavern entrance.' }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 2, star: 2, berry: 2, gold: 110 } },
      { x: 18, y: 3, loot: { rainbow: 2, star: 1, berry: 3, gold: 130 } }
    ],
    npc: {
      id: 'sub_npc_03',
      name: 'Crystal Sage Lyra',
      look: 'wizard',
      x: 15,
      y: 13,
      lines: [
        'Welcome to the shimmering Crystal Cavern, Chuyu! 💎🌈',
        'Beneath Rainbow Crystal Meadow, subterranean pools feed these giant quartz spires with seven-colored light.',
        'Every prism in this sanctum reflects the trust between you and your Critters. Please accept these Rainbow Capsules for your journey!'
      ],
      gift: { rainbow: 2, berry: 3, gold: 80 },
      after: [
        'Prism Guardian CraftyCorn awaits upon the northern crystal dais! Step across the stepping stones to discover the cavern chests too. 💎✨'
      ]
    },
    wildPool: {
      lv: [6, 10],
      maxWilds: 4,
      table: [['crafty', 35], ['bobby', 25], ['poppy', 25], ['prism', 15]]
    },
    boss: {
      key: 'boss_submap_03',
      sp: 'prism',
      lv: 13,
      x: 11,
      y: 4,
      title: 'Prism Guardian CraftyCorn',
      intro: '💎 Prism Guardian CraftyCorn sparkles with seven-colored crystal light! Let\'s paint a dazzling rainbow battle!',
      winLines: [
        'Prism Guardian CraftyCorn chimes like crystal bells and bestows a Rainbow Prism blessing upon Chuyu! 🌈💎'
      ],
      reward: { rainbow: 2, star: 2, berry: 3, gold: 120 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
