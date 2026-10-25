'use strict';
// js/submaps/submap_19.js — Map 19: Hoenn Sootopolis Underwater Temple (Zone 15)
(() => {
  // 24 × 18 white-marble & emerald Hoenn Sootopolis Underwater Temple layout:
  // 12 = T.CLIFF (outer border), 11 = T.FLOOR (Sootopolis white marble),
  // 14 = T.PLAZA (Emerald Sky Altar & avenue), 1 = T.SHALLOW (sacred crater lagoons),
  // 7 = T.BRIDGE_H (lagoon bridges), 13 = T.STONES (jade stepping stones),
  // 4 = T.TALL (36 tropical temple fern tiles).
  const tiles = [
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12],
    [12,11,11,11,11,11,11,11,11,14,14,14,14,14,14,14,11,11,11,11,11,11,11,12],
    [12,11,14,14,14,11,11,11,11,14,14,14,14,14,14,14,11,11,11,14,14,14,11,12],
    [12,11,14,14,14,11,11,11,11,14,14,14,14,14,14,14,11,11,11,14,14,14,11,12],
    [12,11,14,14,14,11,13,13,13,14,14,14,14,14,14,13,13,13,11,14,14,14,11,12],
    [12,11,11,11,11,11, 1, 1, 1,14,14,14,14,14,14, 1, 1, 1,11,11,11,11,11,12],
    [12,11, 4, 4, 4,11, 7, 7, 7,11,14,14,14,14,11, 7, 7, 7,11, 4, 4, 4,11,12],
    [12,11, 4, 4, 4,11, 1, 1, 1,11,11,14,14,14,11, 1, 1, 1,11, 4, 4, 4,11,12],
    [12,11, 4, 4, 4,11, 1, 1, 1,11,11,14,14,14,11, 1, 1, 1,11, 4, 4, 4,11,12],
    [12,11, 4, 4, 4,11,13,13,13,11,11,14,14,14,11,13,13,13,11, 4, 4, 4,11,12],
    [12,11, 4, 4, 4,11, 1, 1, 1,11,11,14,14,14,11, 1, 1, 1,11, 4, 4, 4,11,12],
    [12,11, 4, 4, 4,11, 7, 7, 7,11,11,14,14,14,11, 7, 7, 7,11, 4, 4, 4,11,12],
    [12,11,11,11,11,11, 1, 1, 1,11,11,14,14,14,11, 1, 1, 1,11,11,11,11,11,12],
    [12,11,11,11,11,11,13,13,13,11,11,14,14,14,11,13,13,13,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,11,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,14,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,14,11,11,11,11,11,11,11,11,12],
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]
  ];

  const def = {
    id: 'submap_19',
    index: 19,
    key: 'sootopolis_temple',
    name: 'Hoenn Sootopolis Underwater Temple',
    emoji: '🏛️',
    zoneId: 15,
    color: '#10b981',
    paletteId: 39,
    musicZone: 15,
    borderTile: 12,
    width: 24,
    height: 18,
    entrance: {
      x: 64,
      y: 204,
      kind: 'subportal',
      style: 'temple_dive',
      label: 'Hoenn Sootopolis Underwater Temple'
    },
    entry: { x: 12, y: 15, dir: 3 },
    exit: {
      x: 12,
      y: 16,
      kind: 'exitmat',
      style: 'temple_dive',
      label: 'Exit to Hoenn Tropical Archipelago'
    },
    palette: {
      g: '#047857', gd: '#065f46', gl: '#10b981',
      t1: '#34d399', t2: '#2dd4bf', t3: '#fde047',
      p: '#10b981', pd: '#059669', pl: '#6ee7b7',
      sand: '#a7f3d0', sandd: '#6ee7b7',
      tree: '#0f766e', treed: '#115e59', treel: '#14b8a6',
      cliff: '#022c22', cliffd: '#011c16', cliffl: '#064e3b',
      floor: '#e6f4f1', floord: '#cce8e2',
      plaza: '#10b981', plazad: '#059669', plazal: '#6ee7b7'
    },
    tiles,
    decals: [
      // Sacred lagoon lilypads & coral ripples
      { x: 6, y: 5, d: 3 }, { x: 8, y: 7, d: 3 }, { x: 7, y: 10, d: 3 }, { x: 6, y: 12, d: 3 },
      { x: 17, y: 5, d: 3 }, { x: 15, y: 7, d: 3 }, { x: 16, y: 10, d: 3 }, { x: 17, y: 12, d: 3 },
      // Emerald altar & marble colonnade sparkles
      { x: 10, y: 3, d: 8 }, { x: 14, y: 3, d: 8 }, { x: 12, y: 6, d: 8 },
      { x: 12, y: 9, d: 8 }, { x: 12, y: 13, d: 8 },
      { x: 4, y: 2, d: 5 }, { x: 19, y: 2, d: 5 },
      { x: 6, y: 14, d: 11 }, { x: 18, y: 14, d: 11 }
    ],
    props: [
      {
        kind: 'altar',
        x: 12,
        y: 2,
        w: 1,
        h: 1,
        variant: 1,
        name: 'Sootopolis Sky-Pillar Altar',
        title: 'Sootopolis Sky-Pillar Altar',
        text: '🏛️ An ancient white-marble and emerald altar inscribed with the Draconid sky prayer of Hoenn.',
        msg: '🏛️ An ancient white-marble and emerald altar inscribed with the Draconid sky prayer of Hoenn.'
      },
      {
        kind: 'statue',
        x: 9,
        y: 3,
        w: 1,
        h: 1,
        variant: 1,
        name: 'Relic of Land & Sea',
        title: 'Relic of Land & Sea',
        text: '🗿 A white limestone monument honoring the ancient slumber beneath Sootopolis Crater.',
        msg: '🗿 A white limestone monument honoring the ancient slumber beneath Sootopolis Crater.'
      },
      {
        kind: 'statue',
        x: 15,
        y: 3,
        w: 1,
        h: 1,
        variant: 2,
        name: 'Emerald Sovereign Statue',
        title: 'Emerald Sovereign Statue',
        text: '🐉 A gleaming jade sculpture of Sky-Temple Guardian Rayquaza coiling above the clouds.',
        msg: '🐉 A gleaming jade sculpture of Sky-Temple Guardian Rayquaza coiling above the clouds.'
      },
      {
        kind: 'pillar',
        x: 9,
        y: 8,
        w: 1,
        h: 1,
        variant: 1,
        name: 'Fluted Sootopolis Column',
        title: 'Fluted Sootopolis Column',
        text: '🏛️ Polished white crater-marble veined with glowing green prism crystal.',
        msg: '🏛️ Polished white crater-marble veined with glowing green prism crystal.'
      },
      {
        kind: 'pillar',
        x: 14,
        y: 8,
        w: 1,
        h: 1,
        variant: 1,
        name: 'Fluted Sootopolis Column',
        title: 'Fluted Sootopolis Column',
        text: '🏛️ Ancient Hoenn runes shimmer softly along the submerged limestone shaft.',
        msg: '🏛️ Ancient Hoenn runes shimmer softly along the submerged limestone shaft.'
      },
      {
        kind: 'pillar',
        x: 9,
        y: 13,
        w: 1,
        h: 1,
        variant: 2,
        name: 'Caldera Sanctum Pillar',
        title: 'Caldera Sanctum Pillar',
        text: '🏛️ Warm geothermal currents hum gently through the carved marble colonnade.',
        msg: '🏛️ Warm geothermal currents hum gently through the carved marble colonnade.'
      },
      {
        kind: 'pillar',
        x: 14,
        y: 13,
        w: 1,
        h: 1,
        variant: 2,
        name: 'Caldera Sanctum Pillar',
        title: 'Caldera Sanctum Pillar',
        text: '🏛️ Filtered ocean sunlight dances across the white-and-emerald stone.',
        msg: '🏛️ Filtered ocean sunlight dances across the white-and-emerald stone.'
      },
      {
        kind: 'coral_arch',
        x: 5,
        y: 5,
        w: 1,
        h: 1,
        variant: 1,
        name: 'Luminous Lagoon Coral Arch',
        title: 'Luminous Lagoon Coral Arch',
        text: '🐚 Iridescent sea-fan coral and pearl shells arch beside the western crater lagoon.',
        msg: '🐚 Iridescent sea-fan coral and pearl shells arch beside the western crater lagoon.'
      },
      {
        kind: 'coral_arch',
        x: 18,
        y: 5,
        w: 1,
        h: 1,
        variant: 2,
        name: 'Luminous Lagoon Coral Arch',
        title: 'Luminous Lagoon Coral Arch',
        text: '🐚 Glowing emerald kelp and reef coral frame the eastern lagoon walkway.',
        msg: '🐚 Glowing emerald kelp and reef coral frame the eastern lagoon walkway.'
      },
      {
        kind: 'fountain',
        x: 3,
        y: 14,
        w: 1,
        h: 1,
        variant: 1,
        name: 'Origin Crater Spring',
        title: 'Origin Crater Spring',
        text: '⛲ Crystal-clear spring water wells up from the heart of the Sootopolis caldera.',
        msg: '⛲ Crystal-clear spring water wells up from the heart of the Sootopolis caldera.'
      },
      {
        kind: 'fountain',
        x: 20,
        y: 14,
        w: 1,
        h: 1,
        variant: 1,
        name: 'Sky-Mirror Basin',
        title: 'Sky-Mirror Basin',
        text: '⛲ The tranquil marble basin reflects the emerald aurora of the high altar.',
        msg: '⛲ The tranquil marble basin reflects the emerald aurora of the high altar.'
      },
      {
        kind: 'sign',
        x: 10,
        y: 14,
        w: 1,
        h: 1,
        name: 'Sootopolis Altar Tablet',
        title: 'Sootopolis Altar Tablet',
        text: '🏛️ "Where submarine crater meets emerald sky, Sky-Temple Guardian Rayquaza calms the ancient storm."',
        msg: '🏛️ "Where submarine crater meets emerald sky, Sky-Temple Guardian Rayquaza calms the ancient storm."'
      }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 3, star: 2, berry: 4, gold: 220 } },
      { x: 20, y: 3, loot: { master: 1, rainbow: 2, berry: 3, gold: 260 } }
    ],
    npc: {
      id: 'sub_npc_19',
      name: 'Champion Steven',
      look: 'steven',
      x: 16,
      y: 14,
      lines: [
        'Welcome to the Hoenn Sootopolis Underwater Temple, Chuyu! 🏛️💎',
        'In my travels across Hoenn searching for rare stones and Meteor Falls relics, no sanctum compares to this white-marble crater beneath the sea.',
        'When land and sea clashed in ancient times, the emerald dragon descended upon this very altar. Take these rare Hoenn treasures for the trial ahead!'
      ],
      gift: { rainbow: 3, star: 2, berry: 4, gold: 180 },
      after: [
        'In the end, the strongest stone is an unbreakable bond with your Critters. Step onto the Emerald Altar when you are ready to face Sky-Temple Guardian Rayquaza! 🏛️🐉'
      ]
    },
    wildPool: {
      lv: [20, 26],
      maxWilds: 4,
      table: [
        ['treecko', 18],
        ['torchic', 18],
        ['mudkip', 18],
        ['gardevoir', 16],
        ['milotic', 16],
        ['absol', 14]
      ]
    },
    boss: {
      key: 'boss_submap_19',
      sp: 'rayquaza',
      lv: 30,
      x: 12,
      y: 4,
      title: 'Sky-Temple Guardian Rayquaza',
      intro: '🏛️🐉 Sky-Temple Guardian Rayquaza descends in a pillar of emerald ozone and ancient starlight! Prove your Hoenn mastery!',
      winLines: [
        'Rayquaza roars in approval as the emerald ozone parts, bestowing the Sootopolis Sky Crest upon Chuyu! 🏛️🌟'
      ],
      reward: { master: 1, rainbow: 4, berry: 4, gold: 300 }
    }
  };

  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();

