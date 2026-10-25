'use strict';
// js/submaps/submap_09.js — Map 09: Crossroads Secret Treehouse (Zone 9)
(() => {
  const W = 20, H = 16;
  // 16 rows × 20 cols:
  // 12 = T.CLIFF (outer bark walls), 11 = T.FLOOR (cedar planks),
  // 7 = T.BRIDGE_H (rope-bridge walkways), 3 = T.GRASS & 6 = T.FLOWERS (sunlit leaf terraces),
  // 14 = T.PLAZA (central leaf-woven clubhouse rug), 4 = T.TALL (24 canopy foliage tiles)
  const tiles = [
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    [12,  6,  3,  3,  6, 11, 11,  6, 14, 14, 14, 14,  6, 11, 11,  6,  3,  3,  6, 12],
    [12,  3, 11, 11, 11, 11,  7,  7, 14, 14, 14, 14,  7,  7, 11, 11, 11, 11,  3, 12],
    [12,  3, 11, 11, 11, 11,  3,  6, 14, 14, 14, 14,  6,  3, 11, 11, 11, 11,  3, 12],
    [12,  6, 11, 11, 11, 11,  3,  3, 14, 14, 14, 14,  3,  3, 11, 11, 11, 11,  6, 12],
    [12,  3, 11, 11, 11, 11,  7,  7, 14, 14, 14, 14,  7,  7, 11, 11, 11, 11,  3, 12],
    [12,  3,  6,  4,  4,  4,  3, 11, 14, 14, 14, 14, 11,  3,  4,  4,  4,  6,  3, 12],
    [12,  6,  3,  4,  4,  4,  6, 11, 14, 14, 14, 14, 11,  6,  4,  4,  4,  3,  6, 12],
    [12,  3,  3,  4,  4,  4,  3, 11, 14, 14, 14, 14, 11,  3,  4,  4,  4,  3,  3, 12],
    [12,  3,  6,  4,  4,  4,  6, 11, 14, 14, 14, 14, 11,  6,  4,  4,  4,  6,  3, 12],
    [12,  6, 11, 11, 11, 11,  7,  7, 14, 14, 14, 14,  7,  7, 11, 11, 11, 11,  6, 12],
    [12,  3, 11, 11, 11, 11, 11, 11, 14, 14, 14, 14, 11, 11, 11, 11, 11, 11,  3, 12],
    [12,  3, 11, 11, 11, 11,  6, 11, 14, 14, 14, 14, 11,  6, 11, 11, 11, 11,  3, 12],
    [12,  6,  3, 11, 11, 11, 11, 11, 14, 14, 14, 14, 11, 11, 11, 11, 11,  3,  6, 12],
    [12,  3,  6,  3, 11, 11, 11, 11, 11, 14, 14, 11, 11, 11, 11, 11,  3,  6,  3, 12],
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]
  ];
  const def = {
    id: 'submap_09',
    index: 9,
    key: 'secret_treehouse',
    name: 'Crossroads Secret Treehouse',
    emoji: '🌳',
    zoneId: 9,
    color: '#4ade80',
    paletteId: 29,
    musicZone: 9,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 63, y: 45, kind: 'subportal', style: 'ladder', label: 'Crossroads Secret Treehouse' },
    entry: { x: 10, y: 13, dir: 3 },
    exit: { x: 10, y: 14, kind: 'exitmat', style: 'ladder', label: 'Climb down to Crossroads Park' },
    palette: {
      g: '#6ec25a', gd: '#54a342', gl: '#8ee079',
      t1: '#4caf50', t2: '#388e3c', t3: '#81c784',
      p: '#c99b68', pd: '#ab7d4c', pl: '#e0b787',
      sand: '#e8d2a6', sandd: '#ccb382',
      tree: '#3d9942', treed: '#29732d', treel: '#62bd67',
      cliff: '#5c3a21', cliffd: '#3d2514', cliffl: '#7d5232',
      floor: '#b8824c', floord: '#966636',
      plaza: '#68b85c', plazad: '#4e9643', plazal: '#8ad47f'
    },
    tiles,
    decals: [
      { x: 5, y: 3, d: 3 },
      { x: 14, y: 3, d: 3 },
      { x: 2, y: 7, d: 4 },
      { x: 17, y: 7, d: 4 },
      { x: 9, y: 6, d: 5 },
      { x: 10, y: 8, d: 9 },
      { x: 9, y: 10, d: 5 },
      { x: 5, y: 11, d: 2 },
      { x: 15, y: 11, d: 2 }
    ],
    props: [
      {
        kind: 'bookshelf', x: 2, y: 2, w: 1, h: 1,
        name: 'Treehouse Ranger Log', title: 'Treehouse Ranger Log',
        text: '🌳 "Secret Treehouse Rule #1: Always share your sweet berries with visiting Critters and keep the rope bridges shipshape!"',
        msg: '🌳 "Secret Treehouse Rule #1: Always share your sweet berries with visiting Critters and keep the rope bridges shipshape!"'
      },
      {
        kind: 'bookshelf', x: 17, y: 2, w: 1, h: 1,
        name: 'Canopy Field Guide', title: 'Canopy Field Guide',
        text: '📖 "High in the Great Oak crown, DogDay, CatNap, and Hoppy Hopscotch love playing hide-and-seek among the sunlit leaf piles!"',
        msg: '📖 "High in the Great Oak crown, DogDay, CatNap, and Hoppy Hopscotch love playing hide-and-seek among the sunlit leaf piles!"'
      },
      {
        kind: 'telescope', x: 9, y: 1, w: 1, h: 1,
        name: 'Brass Canopy Telescope', title: 'Brass Canopy Telescope',
        text: '🔭 Peering through the brass lens, you can see all four corners of Rainbow Crossroads Park sparkling below the treetops!',
        msg: '🔭 Peering through the brass lens, you can see all four corners of Rainbow Crossroads Park sparkling below the treetops!'
      },
      {
        kind: 'table', x: 4, y: 12, w: 1, h: 1,
        name: 'Cedar Clubhouse Table', title: 'Cedar Clubhouse Table',
        text: '🍵 Acorn cups, hand-drawn Critter maps, and a plate of fresh honey-berries sit neatly on the cedar table.',
        msg: '🍵 Acorn cups, hand-drawn Critter maps, and a plate of fresh honey-berries sit neatly on the cedar table.'
      },
      {
        kind: 'lantern', x: 7, y: 4, w: 1, h: 1,
        name: 'Amber Acorn Lantern', title: 'Amber Acorn Lantern',
        text: '🏮 A warm amber lantern sways gently from a cedar beam.',
        msg: '🏮 A warm amber lantern sways gently from a cedar beam.'
      },
      {
        kind: 'lantern', x: 12, y: 4, w: 1, h: 1,
        name: 'Sunbeam Acorn Lantern', title: 'Sunbeam Acorn Lantern',
        text: '🏮 Golden firefly light dances softly inside the glass lantern.',
        msg: '🏮 Golden firefly light dances softly inside the glass lantern.'
      },
      {
        kind: 'flowerpot', x: 7, y: 12, w: 1, h: 1,
        name: 'Sunlit Fern Planter', title: 'Sunlit Fern Planter',
        text: '🌿 Dewy emerald ferns and wildflowers perfume the treehouse breeze.',
        msg: '🌿 Dewy emerald ferns and wildflowers perfume the treehouse breeze.'
      },
      {
        kind: 'flowerpot', x: 12, y: 12, w: 1, h: 1,
        name: 'Golden Blossom Planter', title: 'Golden Blossom Planter',
        text: '🌼 Sun-kissed blossoms rustle happily in the canopy wind.',
        msg: '🌼 Sun-kissed blossoms rustle happily in the canopy wind.'
      }
    ],
    chests: [
      { x: 3, y: 4, loot: { rainbow: 2, berry: 3, gold: 100 } },
      { x: 16, y: 4, loot: { star: 2, berry: 3, gold: 120 } }
    ],
    npc: {
      id: 'sub_npc_09',
      name: 'Scout Maple',
      look: 'boy',
      x: 14,
      y: 12,
      lines: [
        'Welcome to the Crossroads Secret Treehouse, perched high in the Great Oak canopy! 🌳🔭',
        'Our rope bridges connect the sunlit leaf terraces where friendly Critters gather to nap and play.',
        'Here, pack these Scout rations and Rainbow Orbs for your journey across the island!'
      ],
      gift: { rainbow: 2, berry: 3, gold: 80 },
      after: [
        'Canopy Guardian Solar is basking in the golden sunbeams on the north observation deck! ☀️🌳'
      ]
    },
    wildPool: {
      lv: [11, 14],
      maxWilds: 4,
      table: [['dogday', 25], ['catnap', 25], ['hoppy', 25], ['solar', 25]]
    },
    boss: {
      key: 'boss_submap_09',
      sp: 'solar',
      lv: 15,
      x: 10,
      y: 4,
      title: 'Canopy Guardian Solar',
      intro: '☀️ Canopy Guardian Solar leaps forward amidst golden treehouse sunbeams! Show your radiant heart in a treetop match!',
      winLines: [
        'Solar wags his tail joyfully and bestows the Treehouse Sun Blessing upon your team! 🌞🌳'
      ],
      reward: { rainbow: 2, berry: 4, gold: 140 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();

