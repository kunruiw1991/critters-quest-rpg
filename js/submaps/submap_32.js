'use strict';
// js/submaps/submap_32.js — Map 32: Infernotype's Blast-Furnace & God-Stone Sanctum (Zone 22)
(() => {
  const W = 26, H = 20;
  const tiles = [
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12],
    [12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12],
    [12,11,14,14,14,11,11,11,11,11,14,14,14,14,14,14,14,11,11,11,11,14,14,14,11,12],
    [12,11,14,14,14,11,11,11,11,11,14,14,14,14,14,14,14,11,11,11,11,14,14,14,11,12],
    [12,11,14,14,14,11,11,11,11,11,14,14,14,14,14,14,14,11,11,11,11,14,14,14,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,14,14,14,11,11,11,11,11,11,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11,11,14,14,14,14,14,14,14,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11, 1, 1, 1, 8, 8, 8, 1, 1,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11, 1, 1, 1, 8, 8, 8, 1, 1,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11, 1, 1, 1, 8, 8, 8, 1, 1,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11,11,11,11,11,11,11, 1, 1,11,14,14,14,11, 1,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11, 7, 7, 7, 7,14,14,14, 7, 7, 7, 7,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11, 1, 1,11,14,14,14,11, 1,11,11,11,11,11,11,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11,11,11,11,14,14,14,11,11,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11,11,11,11,14,14,14,11,11,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4, 4,11,11,11,11,14,14,14,11,11,11, 4, 4, 4, 4, 4,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,11,14,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,11,14,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,11,14,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]
  ];

  const def = {
    id: 'submap_32',
    index: 32,
    key: 'infernotype_furnace_sanctum',
    name: "Infernotype's Blast-Furnace & God-Stone Sanctum",
    emoji: '🔥',
    zoneId: 22,
    color: '#f97316',
    paletteId: 52,
    musicZone: 22,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 96, y: 299, kind: 'subportal', style: 'origin_stairs', label: "Infernotype's Blast-Furnace & God-Stone Sanctum" },
    entry: { x: 13, y: 17, dir: 3 },
    exit: { x: 13, y: 18, kind: 'exitmat', style: 'origin_stairs', label: 'Exit to Prototype Citadel Courtyard' },
    palette: {
      g: '#431407', gd: '#270a03', gl: '#7c2d12',
      t1: '#fb923c', t2: '#38bdf8', t3: '#fde047',
      p: '#fed7aa', pd: '#fb923c', pl: '#ffedd5',
      sand: '#fef3c7', sandd: '#fcd34d',
      tree: '#ea580c', treed: '#9a3412', treel: '#facc15',
      cliff: '#1c1917', cliffd: '#0c0a09', cliffl: '#292524',
      floor: '#292524', floord: '#1c1917',
      plaza: '#fde047', plazad: '#f97316', plazal: '#fef9c3'
    },
    tiles,
    decals: [
      { x: 3, y: 2, d: 9 }, { x: 22, y: 2, d: 9 },
      { x: 12, y: 3, d: 17 }, { x: 14, y: 3, d: 17 },
      { x: 13, y: 6, d: 9 }, { x: 13, y: 11, d: 9 }
    ],
    props: [
      { kind: 'throne', x: 13, y: 2, w: 1, h: 1, title: 'Infernotype\'s Twin-Flame Throne', msg: '🔥🦾 Forged in the Playtime Blast Furnace! Orange molten fire crackles on the left armrest and cool blue star-fire shimmers on the right!' },
      { kind: 'origin_ring', x: 11, y: 2, w: 1, h: 1, title: 'Ancient Golden God Stone', msg: '⚡ "Power Level: OVER 9,000!!" The glowing celestial God Stone from Verity vs. Prototype!' },
      { kind: 'origin_ring', x: 15, y: 2, w: 1, h: 1, title: 'Globy Starlight & Hydro Pedestal', msg: '🌊🌌 Channels Cosmic Luna Lovebraids\' starlight and Cascade Candy Cat\'s Bubble Beam & Hydro Pump!' },
      { kind: 'magma_vent', x: 9, y: 4, w: 1, h: 1, title: 'Smelting Furnace Vent', msg: '🌋 Warm orange sparks dance harmlessly in the air!' },
      { kind: 'whirlpool_vortex', x: 17, y: 4, w: 1, h: 1, title: 'Cascade Cat Hydro Spring', msg: '💦 "Water is super effective against Fire!!" Cool sparkling bubbles keep everyone refreshed!' },
      { kind: 'sign', x: 9, y: 16, w: 1, h: 1, name: 'Last Stand Plaque', title: 'Last Stand Plaque', text: '🔥 "THE LAST STAND: Team up with Verity, Cosmic Luna Lovebraids & Cascade Candy Cat to cool down Legendary Infernotype!"', msg: '🔥 "THE LAST STAND: Team up with Verity, Cosmic Luna Lovebraids & Cascade Candy Cat to cool down Legendary Infernotype!"' }
    ],
    chests: [
      { x: 3, y: 3, loot: { master: 1, rainbow: 5, berry: 8, gold: 350 } },
      { x: 22, y: 3, loot: { master: 1, rainbow: 5, berry: 8, gold: 350 } }
    ],
    npc: {
      id: 'sub_npc_32',
      name: 'Player & Helper Verity',
      look: 'player_verity_npc',
      x: 17,
      y: 16,
      lines: [
        'Hello!! I\'m Verity, your personal helper friend — and you made it to THE LAST STAND!! 🔵🦾🔥',
        'When Dr. Sawyer knocked The Prototype into the blast furnace, he absorbed the flames and rose as Legendary 👑 Infernotype!',
        'Cosmic Luna Lovebraids 🌌 and Cascade Candy Cat 🌊 ("Use Bubble Beam & Hydro Pump — it\'s super effective!!") are right here to help you cool him down! Take this Master Star Capsule!'
      ],
      gift: { master: 1, rainbow: 5, berry: 8, gold: 300 },
      after: ['Once Infernotype cools off, he and Baby Prototype Jr. love coming to Lily\'s crumpet tea parties! 🫖🦾']
    },
    wildPool: {
      lv: [26, 32],
      maxWilds: 4,
      table: [['prototype', 20], ['infernotype', 16], ['verity', 22], ['lunalovebraids', 21], ['cascadecat', 21]]
    },
    boss: {
      key: 'boss_submap_32',
      sp: 'infernotype',
      lv: 34,
      x: 13,
      y: 4,
      title: 'Legendary Infernotype',
      intro: '🔥🦾 "I AM NO LONGER MERELY THE PROTOTYPE — BEHOLD THE INFERNOTYPE!!" Orange hellfire and blue cold-flame swirl as The Last Stand begins!',
      winLines: ['"SPLASH!! Looks like friendship & Hydro Pump ARE super effective!!" Infernotype cools down with a cheerful grin and crowns you Supreme Champion of Playtime Co.! 🏆🔥🌊'],
      reward: { master: 2, rainbow: 6, star: 6, berry: 10, gold: 500 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
