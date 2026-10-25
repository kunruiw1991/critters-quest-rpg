'use strict';
// js/submaps/submap_11.js — Map 11: Gwi-Ma's Underworld Sanctum 🔥 (Zone 10)
(() => {
  const W = 24, H = 18;
  // Tile legend (World.T):
  //  4 = TALL (spirit-flame patches, 36 tiles >= 14 required)
  //  5 = PATH (obsidian ritual walkways)
  //  6 = FLOWERS (crimson-magenta ember carpet)
  //  7 = BRIDGE_H (Honmoon seal bridges across nether vents)
  // 10 = ICE (glowing nether-crystal / magma vent channels)
  // 11 = FLOOR (polished magenta-obsidian sanctum halls)
  // 12 = CLIFF (outer obsidian sanctum walls on all 4 borders)
  // 13 = STONES (Honmoon rune stepping-stone causeway)
  // 14 = PLAZA (Demon King Gwi-Ma's throne dais & treasure alcoves)
  const tiles = [
    // y=0: North outer cliff wall
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    // y=1: Upper sanctum perimeter & northern throne frieze
    [12, 11, 11, 11, 11, 11, 11, 10, 11,  6, 14, 14, 14, 14, 14,  6, 11, 10, 11, 11, 11, 11, 11, 12],
    // y=2: Throne back-row & East/West treasure sanctuary alcoves
    [12, 11, 14, 14, 14, 11, 11, 10, 11,  6, 14, 14, 14, 14, 14,  6, 11, 10, 11, 14, 14, 14, 11, 12],
    // y=3: Chest alcoves at (3,3) and (20,3) + Demon King upper dais
    [12, 11, 14, 14, 14, 11, 11, 10, 11,  6, 14, 14, 14, 14, 14,  6, 11, 10, 11, 14, 14, 14, 11, 12],
    // y=4: Upper Honmoon seal bridges (7) + Boss Gwi-Ma spot at (12,4) on throne dais (14)
    [12, 11, 11,  5, 11, 11,  7,  7,  7, 14, 14, 14, 14, 14, 14, 14,  7,  7,  7, 11,  5, 11, 11, 12],
    // y=5: Lower edge of Demon King throne dais & brazier gallery
    [12, 11, 11,  5, 11, 11, 11, 10, 11, 11, 14, 14, 14, 14, 14, 11, 11, 10, 11, 11,  5, 11, 11, 12],
    // y=6: Spirit-flame chambers begin (left x=3..5, right x=18..20) + central Honmoon causeway
    [12, 11, 11,  4,  4,  4, 11, 10, 11, 11,  6, 13, 13, 13,  6, 11, 11, 10,  4,  4,  4, 11, 11, 12],
    // y=7: Spirit-flame chambers + central rune causeway
    [12, 11, 11,  4,  4,  4, 11, 10, 11, 11,  6, 13, 13, 13,  6, 11, 11, 10,  4,  4,  4, 11, 11, 12],
    // y=8: Mid-sanctum spirit-flame chambers + guardian statue alcoves at (2,8) & (21,8)
    [12, 11, 11,  4,  4,  4, 11, 10, 11, 11,  6, 13, 13, 13,  6, 11, 11, 10,  4,  4,  4, 11, 11, 12],
    // y=9: Central Honmoon seal bridge span (7) linking both flame wings to the grand nave
    [12, 11, 11,  4,  4,  4,  7,  7,  7, 13, 13, 14, 14, 14, 13, 13,  7,  7,  4,  4,  4, 11, 11, 12],
    // y=10: Lower spirit-flame chambers
    [12, 11, 11,  4,  4,  4, 11, 10, 11, 11,  6, 13, 13, 13,  6, 11, 11, 10,  4,  4,  4, 11, 11, 12],
    // y=11: Lower spirit-flame chambers + brazier posts at (9,11) & (15,11)
    [12, 11, 11,  4,  4,  4, 11, 10, 11, 11,  6, 13, 13, 13,  6, 11, 11, 10,  4,  4,  4, 11, 11, 12],
    // y=12: Southern ritual colonnade
    [12, 11, 11,  5,  5,  5, 11, 10, 11, 11,  6, 13, 13, 13,  6, 11, 11, 10,  5,  5,  5, 11, 11, 12],
    // y=13: Southern Honmoon seal bridge span (7)
    [12, 11, 11,  5, 11, 11,  7,  7,  7, 11,  6, 13, 13, 13,  6, 11,  7,  7,  7, 11,  5, 11, 11, 12],
    // y=14: Sanctum vestibule — Sign at (8,14), Guardian Mentor Celine NPC at (16,14)
    [12, 11, 11,  5,  5,  5,  5,  5, 11, 11, 14, 13, 13, 13, 14, 11, 11,  5,  5,  5,  5, 11, 11, 12],
    // y=15: Player entry spawn at (12,15) on Honmoon stones (13)
    [12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 14, 13, 13, 13, 14, 11, 11, 11, 11, 11, 11, 11, 11, 12],
    // y=16: Rift exit mat at (12,16) on Honmoon stones (13)
    [12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 13, 13, 13, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12],
    // y=17: South outer cliff wall
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]
  ];

  const def = {
    id: 'submap_11',
    index: 11,
    key: 'gwima_sanctum',
    name: "Gwi-Ma's Underworld Sanctum",
    emoji: '🔥',
    zoneId: 10,
    color: '#991b1b',
    paletteId: 31,
    musicZone: 10,
    borderTile: 12,
    width: W,
    height: H,
    entrance: {
      x: 90,
      y: 102,
      kind: 'subportal',
      style: 'rift',
      label: "Gwi-Ma's Underworld Sanctum"
    },
    entry: { x: 12, y: 15, dir: 3 },
    exit: {
      x: 12,
      y: 16,
      kind: 'exitmat',
      style: 'rift',
      label: 'Exit to Honmoon Concert Plaza'
    },
    palette: {
      g: '#381528', gd: '#260d1b', gl: '#4d1f38',
      t1: '#e11d48', t2: '#9333ea', t3: '#fb7185',
      p: '#701a75', pd: '#4a044e', pl: '#a21caf',
      sand: '#4c1d95', sandd: '#2e1065',
      tree: '#7f1d1d', treed: '#450a0a', treel: '#b91c1c',
      cliff: '#1f0916', cliffd: '#12040c', cliffl: '#3b112b',
      floor: '#2d1222', floord: '#1c0a15',
      plaza: '#be123c', plazad: '#881337', plazal: '#f43f5e'
    },
    tiles,
    decals: [
      // Scorch marks, obsidian cracks & glowing Honmoon seal runes across the sanctum
      { x: 11, y: 3, d: 11 },
      { x: 13, y: 3, d: 11 },
      { x: 8, y: 5, d: 9 },
      { x: 16, y: 5, d: 9 },
      { x: 12, y: 7, d: 12 },
      { x: 4, y: 8, d: 8 },
      { x: 19, y: 8, d: 8 },
      { x: 12, y: 9, d: 12 },
      { x: 10, y: 12, d: 9 },
      { x: 14, y: 12, d: 9 },
      { x: 12, y: 13, d: 11 },
      { x: 6, y: 15, d: 8 },
      { x: 18, y: 15, d: 8 }
    ],
    props: [
      // Demon King's Obsidian Throne & flanking Soul-Flame Altars at the north dais
      {
        kind: 'throne',
        x: 12,
        y: 2,
        w: 1,
        h: 1,
        variant: 1,
        name: "Gwi-Ma's Obsidian Flame Throne",
        title: "Gwi-Ma's Obsidian Flame Throne",
        text: '🔥 Carved from volcanic nether-glass, the throne thrums with ancient underworld basslines.',
        msg: '🔥 Carved from volcanic nether-glass, the throne thrums with ancient underworld basslines.'
      },
      {
        kind: 'altar',
        x: 10,
        y: 2,
        w: 1,
        h: 1,
        variant: 1,
        name: 'Crimson Soul-Chord Altar',
        title: 'Crimson Soul-Chord Altar',
        text: '🕯️ An obsidian altar etched with the ancient seals of the first Demon Hunters.',
        msg: '🕯️ An obsidian altar etched with the ancient seals of the first Demon Hunters.'
      },
      {
        kind: 'altar',
        x: 14,
        y: 2,
        w: 1,
        h: 1,
        variant: 2,
        name: 'Violet Resonance Altar',
        title: 'Violet Resonance Altar',
        text: '🕯️ Magenta spirit-flames dance in sync with the heartbeat of the Honmoon Rift.',
        msg: '🕯️ Magenta spirit-flames dance in sync with the heartbeat of the Honmoon Rift.'
      },
      // Sanctum Obsidian Pillars framing the upper and lower colonnades
      {
        kind: 'pillar',
        x: 6,
        y: 2,
        w: 1,
        h: 1,
        variant: 1,
        name: 'West Rift Pillar',
        title: 'West Rift Pillar',
        text: '🏛️ A towering magenta-obsidian pillar inscribed with Sunlight Sisters warding glyphs.',
        msg: '🏛️ A towering magenta-obsidian pillar inscribed with Sunlight Sisters warding glyphs.'
      },
      {
        kind: 'pillar',
        x: 17,
        y: 2,
        w: 1,
        h: 1,
        variant: 1,
        name: 'East Rift Pillar',
        title: 'East Rift Pillar',
        text: '🏛️ Golden Honmoon threads spiral up this dark volcanic column to anchor the barrier.',
        msg: '🏛️ Golden Honmoon threads spiral up this dark volcanic column to anchor the barrier.'
      },
      {
        kind: 'pillar',
        x: 6,
        y: 12,
        w: 1,
        h: 1,
        variant: 2,
        name: 'South-West Sanctum Pillar',
        title: 'South-West Sanctum Pillar',
        text: '🏛️ Scorch marks from past clashes between hunters and underworld spirits scar the stone.',
        msg: '🏛️ Scorch marks from past clashes between hunters and underworld spirits scar the stone.'
      },
      {
        kind: 'pillar',
        x: 17,
        y: 12,
        w: 1,
        h: 1,
        variant: 2,
        name: 'South-East Sanctum Pillar',
        title: 'South-East Sanctum Pillar',
        text: '🏛️ The obsidian surface hums softly whenever a sacred vocal harmony is sung nearby.',
        msg: '🏛️ The obsidian surface hums softly whenever a sacred vocal harmony is sung nearby.'
      },
      // Four Underworld Spirit Braziers lining the central processional nave
      {
        kind: 'brazier',
        x: 9,
        y: 5,
        w: 1,
        h: 1,
        variant: 1,
        name: 'Magenta Spirit Brazier',
        title: 'Magenta Spirit Brazier',
        text: '🔥 Violet-crimson underworld fire crackles without consuming a single ember.',
        msg: '🔥 Violet-crimson underworld fire crackles without consuming a single ember.'
      },
      {
        kind: 'brazier',
        x: 15,
        y: 5,
        w: 1,
        h: 1,
        variant: 1,
        name: 'Magenta Spirit Brazier',
        title: 'Magenta Spirit Brazier',
        text: '🔥 The dark flames part whenever the Golden Honmoon resonance approaches.',
        msg: '🔥 The dark flames part whenever the Golden Honmoon resonance approaches.'
      },
      {
        kind: 'brazier',
        x: 9,
        y: 11,
        w: 1,
        h: 1,
        variant: 2,
        name: 'Honmoon Sentinel Brazier',
        title: 'Honmoon Sentinel Brazier',
        text: '🔥 Lit by Guardian Mentor Celine to guide hunters safely back toward the rift exit.',
        msg: '🔥 Lit by Guardian Mentor Celine to guide hunters safely back toward the rift exit.'
      },
      {
        kind: 'brazier',
        x: 15,
        y: 11,
        w: 1,
        h: 1,
        variant: 2,
        name: 'Honmoon Sentinel Brazier',
        title: 'Honmoon Sentinel Brazier',
        text: '🔥 Warm golden sparks mingle with the deep magenta underworld glow.',
        msg: '🔥 Warm golden sparks mingle with the deep magenta underworld glow.'
      },
      // Wing Statues watching over the spirit-flame sanctum chambers
      {
        kind: 'statue',
        x: 2,
        y: 8,
        w: 1,
        h: 1,
        variant: 1,
        name: 'Ancient Demon Sentinel Statue',
        title: 'Ancient Demon Sentinel Statue',
        text: '🗿 An ancient stone guardian keeping watch over the western spirit-flame thicket.',
        msg: '🗿 An ancient stone guardian keeping watch over the western spirit-flame thicket.'
      },
      {
        kind: 'statue',
        x: 21,
        y: 8,
        w: 1,
        h: 1,
        variant: 2,
        name: 'Sunlight Ward Effigy',
        title: 'Sunlight Ward Effigy',
        text: '🗿 A consecrated guardian statue resonating with the protective vows of the Sunlight Sisters.',
        msg: '🗿 A consecrated guardian statue resonating with the protective vows of the Sunlight Sisters.'
      },
      // Lore Sign near the sanctum vestibule
      {
        kind: 'sign',
        x: 8,
        y: 14,
        w: 1,
        h: 1,
        name: 'Honmoon Barrier Seal',
        title: 'Honmoon Barrier Seal',
        text: '🔥 "For generations, the sacred songs of the Guardians have woven the Golden Honmoon across this rift. Only true harmony can quell Underworld Flame King Gwi-Ma!"',
        msg: '🔥 "For generations, the sacred songs of the Guardians have woven the Golden Honmoon across this rift. Only true harmony can quell Underworld Flame King Gwi-Ma!"'
      }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 2, star: 2, berry: 3, gold: 160 } },
      { x: 20, y: 3, loot: { master: 1, rainbow: 2, gold: 180 } }
    ],
    npc: {
      id: 'sub_npc_11',
      name: 'Guardian Mentor Celine',
      look: 'celine',
      x: 16,
      y: 14,
      lines: [
        'Stay close, Chuyu! Beyond this rift lies Gwi-Ma\'s Underworld Sanctum, where magenta spirit-flames test every hunter\'s heart! 🔥⚔️',
        'In my days with the Sunlight Sisters, we sang the Golden Honmoon barrier into being—and now Rumi, Mira, Zoey, and you carry that light forward!',
        'Take these consecrated Honmoon crystals and berries to fortify your Critters before stepping onto the Demon King\'s throne dais!'
      ],
      gift: { rainbow: 2, star: 2, berry: 4, gold: 150 },
      after: [
        'Keep your melody unwavering, Chuyu! Underworld Flame King Gwi-Ma awaits upon the obsidian throne dais at the north end of the sanctum! 🔥👑'
      ]
    },
    wildPool: {
      lv: [16, 21],
      maxWilds: 4,
      table: [
        ['imp', 25],
        ['baby', 20],
        ['abby', 20],
        ['mystery', 18],
        ['jinu', 12],
        ['gwima', 5]
      ]
    },
    boss: {
      key: 'boss_submap_11',
      sp: 'gwima',
      lv: 24,
      x: 12,
      y: 4,
      title: 'Underworld Flame King Gwi-Ma',
      intro: '🔥 Underworld Flame King Gwi-Ma erupts in towering magenta-obsidian demon fire upon the sanctum throne dais! "Show me if your Golden Honmoon harmony can withstand the roar of the Underworld!"',
      winLines: [
        'Gwi-Ma\'s tempest of dark flames softens into a resonant golden-violet chord as the Underworld Flame King acknowledges Chuyu\'s true harmony! 🔥👑✨'
      ],
      reward: { rainbow: 3, star: 2, berry: 4, gold: 240 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
