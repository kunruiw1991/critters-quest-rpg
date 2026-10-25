'use strict';
// js/submaps/submap_15.js — Map 15: Kanto Cerulean Cave 🧬 (Zone 13)
(() => {
  const W = 24, H = 18;
  // Explicit 18 rows × 24 cols grid of World.T tile IDs:
  // 1 = SHALLOW (subterranean lake channels), 4 = TALL (glowing cavern moss, 38 tiles),
  // 7 = BRIDGE_H (crystal bridges), 11 = FLOOR (cerulean crystal floor),
  // 12 = CLIFF (all 4 outer border walls), 13 = STONES (stone causeways),
  // 14 = PLAZA (Mew's inner island shrine & research pedestals)
  const tiles = [
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    [12, 11, 11, 11, 11, 11,  1,  1, 11, 11, 14, 14, 14, 14, 14, 11, 11,  1,  1, 11, 11, 11, 11, 12],
    [12, 11,  4,  4, 11, 11,  1,  1, 11, 14, 14, 14, 14, 14, 14, 14, 11,  1,  1, 11,  4,  4, 11, 12],
    [12, 11, 11, 14, 13, 13,  7,  7, 13, 14, 14, 14, 14, 14, 14, 14, 13,  7,  7, 13, 14, 11, 11, 12],
    [12, 11,  4,  4, 11,  1,  1,  1,  1, 14, 14, 14, 14, 14, 14, 14,  1,  1,  1, 11,  4,  4, 11, 12],
    [12, 11,  4,  4, 11,  1,  1,  1,  1,  1, 14, 14, 14, 14, 14,  1,  1,  1,  1, 11,  4,  4, 11, 12],
    [12, 11, 11, 11, 11,  1,  1,  1,  1,  1,  1, 13, 13, 13,  1,  1,  1,  1,  1, 11, 11, 11, 11, 12],
    [12, 11,  4,  4,  4, 11,  1,  1, 11, 11, 11, 13, 13, 13, 11, 11,  1,  1, 11,  4,  4,  4, 11, 12],
    [12, 11,  4,  4,  4, 13,  7,  7, 13, 11, 11, 13, 14, 13, 11, 13,  7,  7, 13,  4,  4,  4, 11, 12],
    [12, 11,  4,  4,  4, 11,  1,  1, 11, 11, 11, 13, 13, 13, 11, 11,  1,  1, 11,  4,  4,  4, 11, 12],
    [12, 11, 11, 11, 11, 11,  1,  1,  1, 11, 11, 13, 13, 13, 11,  1,  1,  1, 11, 11, 11, 11, 11, 12],
    [12, 11,  4,  4, 11, 11,  1,  1,  1, 11, 11, 13, 13, 13, 11,  1,  1,  1, 11, 11,  4,  4, 11, 12],
    [12, 11,  4,  4, 11, 13,  7,  7,  7, 13, 11, 13, 14, 13, 13,  7,  7,  7, 13, 11,  4,  4, 11, 12],
    [12, 11, 11, 11, 11, 11,  1,  1, 11, 11, 11, 13, 13, 13, 11, 11,  1,  1, 11, 11, 11, 11, 11, 12],
    [12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 13, 13, 13, 13, 13, 14, 14, 14, 11, 11, 11, 11, 11, 12],
    [12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 13, 14, 14, 14, 13, 11, 11, 11, 11, 11, 11, 11, 11, 12],
    [12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 13, 14, 13, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]
  ];

  const def = {
    id: 'submap_15',
    index: 15,
    key: 'cerulean_cave',
    name: 'Kanto Cerulean Cave',
    emoji: '🧬',
    zoneId: 13,
    color: '#f472b6',
    paletteId: 35,
    musicZone: 13,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 95, y: 155, kind: 'subportal', style: 'cave', label: 'Kanto Cerulean Cave' },
    entry: { x: 12, y: 15, dir: 3 },
    exit: { x: 12, y: 16, kind: 'exitmat', style: 'cave', label: 'Exit to Kanto Bright Meadows' },
    palette: {
      g: '#312e81', gd: '#1e1b4b', gl: '#4338ca',
      t1: '#38bdf8', t2: '#818cf8', t3: '#f472b6',
      p: '#818cf8', pd: '#6366f1', pl: '#c7d2fe',
      sand: '#c7d2fe', sandd: '#a5b4fc',
      tree: '#4c1d95', treed: '#2e1065', treel: '#7c3aed',
      cliff: '#1e1b4b', cliffd: '#0f172a', cliffl: '#3730a3',
      floor: '#3730a3', floord: '#2e1065',
      plaza: '#f472b6', plazad: '#db2777', plazal: '#fbcfe8'
    },
    tiles,
    decals: [
      { x: 5, y: 2, d: 6 },
      { x: 19, y: 2, d: 6 },
      { x: 11, y: 3, d: 7 },
      { x: 13, y: 3, d: 7 },
      { x: 9, y: 5, d: 5 },
      { x: 15, y: 5, d: 5 },
      { x: 4, y: 6, d: 2 },
      { x: 19, y: 6, d: 2 },
      { x: 12, y: 7, d: 8 },
      { x: 10, y: 8, d: 3 },
      { x: 14, y: 8, d: 3 },
      { x: 5, y: 10, d: 6 },
      { x: 18, y: 10, d: 6 },
      { x: 12, y: 11, d: 7 },
      { x: 8, y: 14, d: 1 },
      { x: 19, y: 15, d: 2 }
    ],
    props: [
      {
        kind: 'shrine', x: 12, y: 2, w: 1, h: 1,
        title: 'Cerulean Genesis Shrine',
        msg: '🧬 Ancient helix carvings shimmer with psychic starlight above Mew\'s island sanctum.',
        name: 'Cerulean Genesis Shrine',
        text: '🧬 Ancient helix carvings shimmer with psychic starlight above Mew\'s island sanctum.'
      },
      {
        kind: 'altar', x: 10, y: 2, w: 1, h: 1,
        title: 'Rose-Quartz DNA Altar',
        msg: '✨ A rose-quartz pedestal resonating with primordial Kanto Pokémon energy.',
        name: 'Rose-Quartz DNA Altar',
        text: '✨ A rose-quartz pedestal resonating with primordial Kanto Pokémon energy.'
      },
      {
        kind: 'altar', x: 14, y: 2, w: 1, h: 1,
        title: 'Cerulean-Quartz DNA Altar',
        msg: '✨ A cerulean-quartz pedestal humming in harmony with the subterranean lake.',
        name: 'Cerulean-Quartz DNA Altar',
        text: '✨ A cerulean-quartz pedestal humming in harmony with the subterranean lake.'
      },
      {
        kind: 'crystal_cluster', x: 1, y: 1, w: 1, h: 1,
        title: 'Luminescent Amethyst Cluster',
        msg: '💎 Towering psychic crystals illuminate the northwest cavern vault.',
        name: 'Luminescent Amethyst Cluster',
        text: '💎 Towering psychic crystals illuminate the northwest cavern vault.'
      },
      {
        kind: 'crystal_cluster', x: 22, y: 1, w: 1, h: 1,
        title: 'Cerulean Prism Cluster',
        msg: '💎 Pure cerulean crystals refract the underground waterfall mist into rainbows.',
        name: 'Cerulean Prism Cluster',
        text: '💎 Pure cerulean crystals refract the underground waterfall mist into rainbows.'
      },
      {
        kind: 'crystal_cluster', x: 1, y: 10, w: 1, h: 1,
        title: 'Bioluminescent Geode',
        msg: '💎 Warm magenta starlight pulses gently inside this crystalline geode.',
        name: 'Bioluminescent Geode',
        text: '💎 Warm magenta starlight pulses gently inside this crystalline geode.'
      },
      {
        kind: 'crystal_cluster', x: 22, y: 10, w: 1, h: 1,
        title: 'Starlight Quartz Cluster',
        msg: '💎 Kanto quartz needles chime softly whenever psychic waves ripple past.',
        name: 'Starlight Quartz Cluster',
        text: '💎 Kanto quartz needles chime softly whenever psychic waves ripple past.'
      },
      {
        kind: 'pillar', x: 9, y: 6, w: 1, h: 1,
        title: 'West Helix Pillar',
        msg: '🏛️ An ancient stone column inscribed with Kanto Pokédex fossil glyphs.',
        name: 'West Helix Pillar',
        text: '🏛️ An ancient stone column inscribed with Kanto Pokédex fossil glyphs.'
      },
      {
        kind: 'pillar', x: 15, y: 6, w: 1, h: 1,
        title: 'East Helix Pillar',
        msg: '🏛️ An ancient stone column guarding the causeway to Mew\'s island.',
        name: 'East Helix Pillar',
        text: '🏛️ An ancient stone column guarding the causeway to Mew\'s island.'
      },
      {
        kind: 'pillar', x: 9, y: 14, w: 1, h: 1,
        title: 'Cerulean Research Marker',
        msg: '🧬 "Pallet Lab Field Survey: Only trainers with a kind heart may approach the inner island."',
        name: 'Cerulean Research Marker',
        text: '🧬 "Pallet Lab Field Survey: Only trainers with a kind heart may approach the inner island."'
      },
      {
        kind: 'lantern', x: 10, y: 11, w: 1, h: 1,
        title: 'West Causeway Lantern',
        msg: '🏮 A crystal beacon placed by Professor Oak\'s research expedition.',
        name: 'West Causeway Lantern',
        text: '🏮 A crystal beacon placed by Professor Oak\'s research expedition.'
      },
      {
        kind: 'lantern', x: 14, y: 11, w: 1, h: 1,
        title: 'East Causeway Lantern',
        msg: '🏮 Its cerulean glow reflects across the subterranean lake channels.',
        name: 'East Causeway Lantern',
        text: '🏮 Its cerulean glow reflects across the subterranean lake channels.'
      },
      {
        kind: 'lantern', x: 18, y: 14, w: 1, h: 1,
        title: 'Field Survey Lantern',
        msg: '🏮 Lights up Professor Oak\'s Aide\'s Kanto Pokédex observation desk.',
        name: 'Field Survey Lantern',
        text: '🏮 Lights up Professor Oak\'s Aide\'s Kanto Pokédex observation desk.'
      }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 2, star: 2, berry: 3, gold: 180 } },
      { x: 20, y: 3, loot: { master: 1, rainbow: 2, gold: 220 } }
    ],
    npc: {
      id: 'sub_npc_15',
      name: "Professor Oak's Aide",
      look: 'oak',
      x: 16,
      y: 14,
      lines: [
        'Incredible, Chuyu! You made it all the way to the luminous depths of Kanto Cerulean Cave! 🧬✨',
        'Our Pallet Town Pokédex sensors detected high-energy psychic ripples and rare Kanto species gathering around these subterranean crystal lakes.',
        'Professor Oak entrusted me with this Kanto Research Supply Kit—take these Rainbow Crystals and Star Shards for your expedition!'
      ],
      gift: { rainbow: 2, star: 2, berry: 4, gold: 150 },
      after: 'My Pokédex scanner is off the charts! Cerulean Sanctum Guardian Mew is floating playfully above the inner island shrine just north of the causeway! 🧬💖'
    },
    wildPool: {
      lv: [16, 22],
      maxWilds: 4,
      table: [['pikachu', 20], ['eevee', 18], ['psyduck', 16], ['gengar', 18], ['snorlax', 18], ['mew', 10]]
    },
    boss: {
      key: 'boss_submap_15',
      sp: 'mew',
      lv: 26,
      x: 12,
      y: 4,
      title: 'Cerulean Sanctum Guardian Mew',
      intro: '🧬✨ Cerulean Sanctum Guardian Mew giggles melodically and twirls inside a shimmering bubble of psychic starlight!',
      winLines: [
        'Mew does a joyful somersault in midair and bestows a Mythical Genesis Blessing upon Chuyu! 🧬🌟'
      ],
      reward: { master: 1, rainbow: 3, berry: 4, gold: 260 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
