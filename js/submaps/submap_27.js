'use strict';
// js/submaps/submap_27.js — Map 27: Playtime GrabPack Assembly Hall (Zone 20)
(() => {
  const W = 24, H = 18;
  const tiles = [
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12],
    [12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12],
    [12,11,14,14,14,11,11,11,11,14,14,14,14,14,14,11,11,11,11,14,14,14,11,12],
    [12,11,14,14,14,11,11,11,11,14,14,14,14,14,14,11,11,11,11,14,14,14,11,12],
    [12,11,14,14,14,11,11,11,11,14,14,14,14,14,14,11,11,11,11,14,14,14,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11, 4, 4, 4, 4,11,11,11,14,14,14,14,11,11,11, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4,11, 1, 1, 1, 8, 8, 1, 1, 1,11, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4,11, 1, 1, 1, 8, 8, 1, 1, 1,11, 4, 4, 4, 4,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11, 7, 7,14,14,14,14, 7, 7,11,11,11,11,11,11,11,12],
    [12,11,11, 4, 4, 4, 4,11,11,11,14,14,14,14,11,11,11, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4,11,11,11,14,14,14,14,11,11,11, 4, 4, 4, 4,11,11,12],
    [12,11,11, 4, 4, 4, 4,11,11,11,14,14,14,14,11,11,11, 4, 4, 4, 4,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,11,11,11,11,11,11,11,11,11,14,14,14,14,11,11,11,11,11,11,11,11,11,12],
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12]
  ];

  const def = {
    id: 'submap_27',
    index: 27,
    key: 'playtime_grabpack_hall',
    name: 'Playtime GrabPack Assembly Hall',
    emoji: '🧸',
    zoneId: 20,
    color: '#3b82f6',
    paletteId: 47,
    musicZone: 20,
    borderTile: 12,
    width: W,
    height: H,
    entrance: { x: 25, y: 300, kind: 'subportal', style: 'door', label: 'Playtime GrabPack Assembly Hall' },
    entry: { x: 12, y: 15, dir: 3 },
    exit: { x: 12, y: 16, kind: 'exitmat', style: 'door', label: 'Exit to Playtime Factory Plaza' },
    palette: {
      g: '#1e3a8a', gd: '#172554', gl: '#2563eb',
      t1: '#ef4444', t2: '#3b82f6', t3: '#facc15',
      p: '#fde047', pd: '#eab308', pl: '#fef9c3',
      sand: '#dbeafe', sandd: '#93c5fd',
      tree: '#2563eb', treed: '#1d4ed8', treel: '#60a5fa',
      cliff: '#1e293b', cliffd: '#0f172a', cliffl: '#334155',
      floor: '#eff6ff', floord: '#dbeafe',
      plaza: '#fef08a', plazad: '#fde047', plazal: '#ffffff'
    },
    tiles,
    decals: [
      { x: 3, y: 2, d: 19 }, { x: 20, y: 2, d: 19 },
      { x: 11, y: 3, d: 9 }, { x: 13, y: 3, d: 9 }
    ],
    props: [
      { kind: 'statue', x: 12, y: 2, w: 1, h: 1, title: 'Giant Huggy Wuggy Lobby Pedestal', msg: '🧸 The towering 18-foot Playtime Co. lobby pedestal! Huggy Wuggy waves his big yellow paw with a goofy grin!' },
      { kind: 'arcade', x: 10, y: 2, w: 1, h: 1, title: 'XL GrabPack Workbench', msg: '🧤 Red & Blue GrabPack hands coiled with extra-bouncy spring cables!' },
      { kind: 'arcade', x: 14, y: 2, w: 1, h: 1, title: 'Make-A-Friend Toy Machine', msg: '🎨 Three colorful pipes paint and fluff brand-new toy buddies on the conveyor belt!' },
      { kind: 'crate', x: 8, y: 4, w: 1, h: 1, title: 'Boxy Boo Star Crate', msg: '📦 A starry blue crate humming a cheerful music-box tune!' },
      { kind: 'crate', x: 16, y: 4, w: 1, h: 1, title: 'Bunzo Cymbal Box', msg: '🥁 Packed with shiny golden party cymbals and birthday hats!' },
      { kind: 'sign', x: 8, y: 14, w: 1, h: 1, name: 'Playtime Welcome Sign', title: 'Playtime Welcome Sign', text: '🧸 "Welcome to Playtime Co.! High-five Huggy Wuggy & Kissy Missy at the center pedestal!"', msg: '🧸 "Welcome to Playtime Co.! High-five Huggy Wuggy & Kissy Missy at the center pedestal!"' }
    ],
    chests: [
      { x: 3, y: 3, loot: { rainbow: 3, star: 3, berry: 5, gold: 200 } },
      { x: 20, y: 3, loot: { rainbow: 3, star: 3, berry: 5, gold: 220 } }
    ],
    npc: {
      id: 'sub_npc_27',
      name: 'Poppy Doll',
      look: 'poppy_npc',
      x: 16,
      y: 14,
      lines: [
        'Welcome inside the Playtime Co. GrabPack Assembly Hall! 🎀🧸',
        'Huggy Wuggy, Kissy Missy, Bunzo Bunny, PJ Pug-a-Pillar, and Boxy Boo love playing tag around the Make-A-Friend conveyor belts!',
        'Take these sparkly Rainbow Capsules and step up to give Security Chief Huggy Wuggy a big friendly high-five!'
      ],
      gift: { rainbow: 3, berry: 5, gold: 180 },
      after: ['Huggy Wuggy and Kissy Missy give the biggest, fluffiest hugs in the whole factory! 🧸💗']
    },
    wildPool: {
      lv: [18, 24],
      maxWilds: 4,
      table: [['poppydoll', 22], ['kissymissy', 20], ['huggy', 20], ['bunzobunny', 20], ['boxyboo', 18]]
    },
    boss: {
      key: 'boss_submap_27',
      sp: 'huggy',
      lv: 25,
      x: 12,
      y: 4,
      title: 'Security Chief Huggy Wuggy',
      intro: '🧸💙 Huggy Wuggy hops off his lobby pedestal, waves both long blue fuzzy arms, and invites your team to a GrabPack high-five battle!',
      winLines: ['"Squeak-squeak!! Best hugger ever!!" Huggy Wuggy wraps your partner in a giant cozy blue bear-hug! 🧸💖'],
      reward: { rainbow: 4, star: 3, berry: 6, gold: 260 }
    }
  };
  if (window.CQData && typeof CQData.registerSubmap === 'function') CQData.registerSubmap(def);
  else { window.CQSubmaps = window.CQSubmaps || []; window.CQSubmaps.push(def); }
})();
