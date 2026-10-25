'use strict';
// js/submaps/submap_02.js — Map 02: Whispering Mushroom Grotto (Zone 2)
(() => {
  const W = 22, H = 16;
  // Explicit 22x16 bioluminescent mushroom grotto layout:
  // 12 = T.CLIFF (outer cavern walls)
  // 3  = T.GRASS (mossy cavern floor)
  // 4  = T.TALL  (glowing spore patches — 36 tiles total)
  // 5  = T.PATH  (winding woodland trail)
  // 6  = T.FLOWERS (bioluminescent fairy-ring flora)
  // 1  = T.SHALLOW (glowing underground stream)
  // 7  = T.BRIDGE_H (mossy log bridge)
  // 13 = T.STONES (luminescent stepping stones)
  // 14 = T.PLAZA (ancient mycelium sanctum floor)
  const tiles = [
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12], // y=0
    [12, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 6, 6, 6, 3, 3, 3, 3, 3, 3,12], // y=1
    [12, 3, 3, 6, 6, 3, 3, 6, 6,14,14,14,14,14, 6, 6, 3, 6, 6, 3, 3,12], // y=2
    [12, 3, 6, 6, 5, 5, 5, 5, 5,14,14,14,14,14, 5, 5, 5, 5, 6, 6, 3,12], // y=3
    [12, 3, 6, 6, 5, 3, 3, 6, 6,14,14,14,14,14, 6, 6, 3, 5, 6, 6, 3,12], // y=4
    [12, 3, 3, 4, 4, 4, 3, 3, 6, 6, 5, 5, 5, 6, 6, 3, 4, 4, 4, 3, 3,12], // y=5
    [12, 3, 3, 4, 4, 4, 3, 3, 3, 3, 5, 5, 5, 3, 3, 3, 4, 4, 4, 3, 3,12], // y=6
    [12, 3, 6, 3, 3, 3, 5, 5, 3, 3, 5, 5, 5, 3, 5, 5, 3, 3, 3, 6, 3,12], // y=7
    [12, 1, 1, 1, 1, 1,13,13, 1, 1, 7, 7, 7, 1,13,13, 1, 1, 1, 1, 1,12], // y=8
    [12, 3, 6, 4, 4, 4, 4, 5, 3, 3, 5, 5, 5, 3, 5, 4, 4, 4, 4, 6, 3,12], // y=9
    [12, 3, 3, 4, 4, 4, 4, 5, 3, 3, 5, 5, 5, 3, 5, 4, 4, 4, 4, 3, 3,12], // y=10
    [12, 3, 3, 4, 4, 4, 4, 5, 5, 3, 5, 5, 5, 5, 5, 4, 4, 4, 4, 3, 3,12], // y=11
    [12, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 3,12], // y=12
    [12, 3, 6, 3, 3, 3, 3, 6, 3, 3, 5, 5, 5, 3, 3, 6, 3, 3, 6, 3, 3,12], // y=13
    [12, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3,12], // y=14
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]  // y=15
  ];

  const def = {
    id: 'submap_02',
    index: 2,
    key: 'mushroom_grotto',
    name: 'Whispering Mushroom Grotto',
    emoji: '🍄',
    zoneId: 2,
    color: '#7ae582',
    paletteId: 22,
    musicZone: 2,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 16, y: 78, kind: 'subportal', style: 'hollow', label: 'Whispering Mushroom Grotto' },
    entry: { x: 11, y: 13, dir: 3 },
    exit: { x: 11, y: 14, kind: 'exitmat', style: 'hollow', label: 'Exit to Whispering Orchard' },
    palette: {
      g: '#387d56', gd: '#2a6342', gl: '#4f9e70',
      t1: '#3fc189', t2: '#2ca370', t3: '#68e3ae',
      p: '#8c6d53', pd: '#6e533d', pl: '#ab896b',
      sand: '#c9b38b', sandd: '#ab946c',
      tree: '#2d7a4c', treed: '#1d5734', treel: '#4da870',
      cliff: '#294236', cliffd: '#1b2e25', cliffl: '#3f6352',
      floor: '#5c8a6e', floord: '#456b54',
      plaza: '#70c49c', plazad: '#52a37d', plazal: '#98e6c0'
    },
    tiles,
    decals: [
      { x: 2, y: 4, d: 4 }, { x: 6, y: 2, d: 4 }, { x: 8, y: 4, d: 4 },
      { x: 14, y: 4, d: 4 }, { x: 16, y: 2, d: 4 }, { x: 19, y: 4, d: 4 },
      { x: 2, y: 7, d: 4 }, { x: 19, y: 7, d: 4 }, { x: 2, y: 9, d: 4 },
      { x: 19, y: 9, d: 4 }, { x: 8, y: 10, d: 3 }, { x: 13, y: 10, d: 3 },
      { x: 7, y: 13, d: 4 }, { x: 15, y: 13, d: 4 }, { x: 11, y: 6, d: 9 },
      { x: 10, y: 3, d: 2 }, { x: 12, y: 3, d: 2 }, { x: 5, y: 13, d: 3 }
    ],
    props: [
      { kind: 'shrine', x: 11, y: 2, w: 1, h: 1, title: 'Whispering Toadstool Shrine', msg: 'A giant bioluminescent mushroom cap hums with a soothing woodland melody as golden spores drift upward.' },
      { kind: 'lantern', x: 8, y: 2, w: 1, h: 1, title: 'Spore-Glass Lantern', msg: 'A carved gourd lantern filled with softly glowing emerald mushroom spores.' },
      { kind: 'lantern', x: 14, y: 2, w: 1, h: 1, title: 'Spore-Glass Lantern', msg: 'Warm cyan light flickers inside the spore-glass lantern, illuminating the fairy ring.' },
      { kind: 'crystal_cluster', x: 2, y: 2, w: 1, h: 1, title: 'Luminescent Quartz & Fungi', msg: 'Translucent cave crystals intertwined with glowing blue-green mycena caps.' },
      { kind: 'crystal_cluster', x: 19, y: 2, w: 1, h: 1, title: 'Luminescent Quartz & Fungi', msg: 'Cool dewdrops drip from the crystal tips onto velvet cavern moss below.' },
      { kind: 'cauldron', x: 16, y: 12, w: 1, h: 1, title: 'Herbalist Fern\'s Dew Cauldron', msg: 'A copper cauldron simmering with sweet orchard berries, mint leaves, and golden truffle broth!' },
      { kind: 'flowerpot', x: 17, y: 12, w: 1, h: 1, title: 'Potted Glow-Cap', msg: 'A baby bioluminescent toadstool thriving in rich Whispering Orchard compost.' },
      { kind: 'flowerpot', x: 4, y: 12, w: 1, h: 1, title: 'Starlight Clover Pot', msg: 'Four-leaf woodland clovers that chime softly whenever a breeze drifts through the hollow.' },
      { kind: 'stump', x: 2, y: 12, w: 1, h: 1, title: 'Mossy Hollow Stump', msg: 'An ancient oak root stump covered in velvet shelf mushrooms.' },
      { kind: 'sign', x: 9, y: 11, w: 1, h: 1, title: 'Mushroom Grotto Signpost', msg: '🍄 Whispering Mushroom Grotto — North: Fairy-Ring Sanctum | East: Herbalist Fern\'s Apothecary.' },
      { kind: 'lantern', x: 9, y: 13, w: 1, h: 1, title: 'Grotto Trail Lantern', msg: 'Guides travelers safely along the mossy trail back to Whispering Orchard.' },
      { kind: 'lantern', x: 13, y: 13, w: 1, h: 1, title: 'Grotto Trail Lantern', msg: 'Its gentle turquoise glow marks the hollow entrance of the Mushroom Grotto.' }
    ],
    chests: [
      { x: 3, y: 3, loot: { berry: 4, star: 2, gold: 85 } },
      { x: 18, y: 3, loot: { rainbow: 1, berry: 3, gold: 95 } }
    ],
    npc: {
      id: 'sub_npc_02',
      name: 'Herbalist Fern',
      look: 'gardener',
      x: 14,
      y: 12,
      lines: [
        'Shhh... listen closely, Chuyu! Every glowing cap in the Whispering Mushroom Grotto hums a different note of the forest lullaby! 🍄✨',
        'I brew restorative dew tonics here by the underground stream. Take these freshly gathered berries and a Rainbow Fruit for your Critter team!'
      ],
      gift: { berry: 4, rainbow: 1, star: 1, gold: 60 },
      after: 'Grotto Guardian Mikey is dancing inside the northern fairy mushroom ring across the mossy log bridge! 🍄🌟'
    },
    wildPool: {
      lv: [4, 7],
      maxWilds: 4,
      table: [['picky', 35], ['bobby', 30], ['mikey', 25], ['poppy', 10]]
    },
    boss: {
      key: 'boss_submap_02',
      sp: 'mikey',
      lv: 10,
      x: 11,
      y: 4,
      title: 'Grotto Guardian Mikey',
      intro: '🍄 Grotto Guardian Mikey leaps from the glowing fairy mushroom ring in a whirl of turquoise spores! Ready for a joyful woodland showdown?',
      winLines: [
        'Mikey twirls happily and showers Chuyu with a basket of shimmering grotto berries! 🍄🌟'
      ],
      reward: { rainbow: 2, berry: 3, gold: 90 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();

