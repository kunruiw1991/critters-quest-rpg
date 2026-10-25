'use strict';
// js/submaps/submap_20.js — Map 20: Sinnoh Hall of Origin Sanctum (Zone 16)
(() => {
  const W = 26, H = 20;
  // Tile IDs (World.T):
  // 1 = SHALLOW (starlight pool), 4 = TALL (cosmic-aura patch),
  // 7 = BRIDGE_H (celestial horizontal light bridge), 8 = BRIDGE_V (celestial vertical light bridge),
  // 11 = FLOOR (astral marble), 12 = CLIFF (outer sanctum wall), 14 = PLAZA (Origin Throne Dais)
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
    id: 'submap_20',
    index: 20,
    key: 'hall_of_origin',
    name: 'Sinnoh Hall of Origin Sanctum',
    emoji: '✨',
    zoneId: 16,
    color: '#eab308',
    paletteId: 40,
    musicZone: 16,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 103, y: 184, kind: 'subportal', style: 'origin_stairs', label: 'Sinnoh Hall of Origin Sanctum' },
    entry: { x: 13, y: 17, dir: 3 },
    exit: { x: 13, y: 18, kind: 'exitmat', style: 'origin_stairs', label: 'Exit to Sinnoh Coronet Summit' },
    palette: {
      g: '#312e81', gd: '#1e1b4b', gl: '#4338ca',
      t1: '#fde047', t2: '#f8fafc', t3: '#38bdf8',
      p: '#facc15', pd: '#eab308', pl: '#fef08a',
      sand: '#fef9c3', sandd: '#fde047',
      tree: '#475569', treed: '#334155', treel: '#94a3b8',
      cliff: '#1e1b4b', cliffd: '#0f172a', cliffl: '#312e81',
      floor: '#e2e8f0', floord: '#cbd5e1',
      plaza: '#fde047', plazad: '#eab308', plazal: '#fef9c3'
    },
    tiles,
    decals: [
      { x: 3, y: 2, d: 9 }, { x: 22, y: 2, d: 9 },
      { x: 12, y: 3, d: 9 }, { x: 14, y: 3, d: 9 },
      { x: 7, y: 4, d: 9 }, { x: 18, y: 4, d: 9 },
      { x: 13, y: 6, d: 9 }, { x: 13, y: 8, d: 9 },
      { x: 13, y: 11, d: 9 }, { x: 13, y: 14, d: 9 },
      { x: 6, y: 11, d: 9 }, { x: 19, y: 11, d: 9 },
      { x: 9, y: 15, d: 9 }, { x: 17, y: 15, d: 9 },
      { x: 12, y: 17, d: 9 }, { x: 14, y: 17, d: 9 }
    ],
    props: [
      { kind: 'throne', x: 13, y: 2, w: 1, h: 1, title: 'Origin Throne of Creation', msg: '✨ The celestial throne where the Original One shaped the Sinnoh cosmos with a thousand golden arms.' },
      { kind: 'altar', x: 11, y: 2, w: 1, h: 1, title: 'Altar of Time', msg: '⏳ An astral diamond altar resonating with the eternal heartbeat of time.' },
      { kind: 'altar', x: 15, y: 2, w: 1, h: 1, title: 'Altar of Space', msg: '🌌 A luminous pearl altar shimmering with boundless spatial dimensions.' },
      { kind: 'statue', x: 9, y: 4, w: 1, h: 1, title: 'Guardians of Lake Spirit', msg: '🗿 An astral marble monument honoring Knowledge, Emotion, and Willpower.' },
      { kind: 'statue', x: 17, y: 4, w: 1, h: 1, title: 'Monument of the Eighteen Plates', msg: '🗿 Inscribed in starlight: "Eighteen elemental Plates orbit the Alpha Creator in eternal harmony."' },
      { kind: 'pillar', x: 10, y: 6, w: 1, h: 1, title: 'Pillar of Genesis', msg: '🏛️ Fluted astral-glass column supporting the golden vault of the Hall of Origin.' },
      { kind: 'pillar', x: 16, y: 6, w: 1, h: 1, title: 'Pillar of Eternity', msg: '🏛️ Golden-veined marble pillar inscribed with ancient Spear Pillar verses.' },
      { kind: 'brazier', x: 11, y: 10, w: 1, h: 1, title: 'Starlight Brazier', msg: '🔥 Celestial golden flames burn eternally without smoke or ash.' },
      { kind: 'brazier', x: 15, y: 10, w: 1, h: 1, title: 'Starlight Brazier', msg: '🔥 Sacred starlight fire reflecting the constellations above Mount Coronet.' },
      { kind: 'crystal_cluster', x: 2, y: 11, w: 1, h: 1, title: 'Astral Crystal Cluster', msg: '💎 Prismatic origin shards refracting pure celestial light across the sanctum.' },
      { kind: 'crystal_cluster', x: 23, y: 11, w: 1, h: 1, title: 'Cosmic Prism Cluster', msg: '💎 Starlight crystals humming with the clear melody of the Azure Flute.' },
      { kind: 'pillar', x: 10, y: 14, w: 1, h: 1, title: 'West Origin Colonnade', msg: '🏛️ A radiant marble pillar lining the Hall of Origin processional.' },
      { kind: 'pillar', x: 16, y: 14, w: 1, h: 1, title: 'East Origin Colonnade', msg: '🏛️ A radiant marble pillar gleaming with celestial gold.' },
      { kind: 'sign', x: 9, y: 16, w: 1, h: 1, name: 'Azure Flute Pedestal', title: 'Azure Flute Pedestal', text: '✨ "At the summit where time and space converge stands the Alpha Creator Arceus!"', msg: '✨ "At the summit where time and space converge stands the Alpha Creator Arceus!"' }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 3, star: 2, berry: 5, gold: 220 } },
      { x: 22, y: 3, loot: { master: 1, rainbow: 3, berry: 5, gold: 260 } }
    ],
    npc: {
      id: 'sub_npc_20',
      name: 'Champion Cynthia',
      look: 'cynthia',
      x: 17,
      y: 16,
      lines: [
        'Welcome to the Sinnoh Hall of Origin Sanctum, Chuyu! ✨👑',
        'As a mythologist and Sinnoh Champion, I have dreamed of standing atop these astral-glass stairs beyond Spear Pillar!',
        'Take this Champion\'s Origin Blessing before you step across the celestial bridge to meet Arceus!'
      ],
      gift: { rainbow: 3, star: 2, berry: 5, gold: 200 },
      after: ['Alpha Creator Arceus awaits upon the Origin Throne Dais ahead—show it the bond uniting your Critter team! ✨🌟']
    },
    wildPool: {
      lv: [22, 28],
      maxWilds: 4,
      table: [['turtwig', 18], ['chimchar', 18], ['piplup', 18], ['shinx', 16], ['buneary', 14], ['lucario', 8], ['garchomp', 8]]
    },
    boss: {
      key: 'boss_submap_20',
      sp: 'arceus',
      lv: 32,
      x: 13,
      y: 4,
      title: 'Alpha Creator Arceus',
      intro: '✨🌟 Alpha Creator Arceus illuminates the Hall of Origin in celestial golden light! The Original One tests your heart!',
      winLines: ['Arceus resonates with cosmic harmony and bestows the Ultimate Origin Crown upon Chuyu! ✨👑'],
      reward: { master: 1, rainbow: 5, star: 3, berry: 5, gold: 350 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();

