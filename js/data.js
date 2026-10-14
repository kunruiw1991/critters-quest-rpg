'use strict';
/* ============================================================
 * Chuyu's Critter Quest: Rainbow Island RPG — static game data
 * ============================================================ */
const CQData = (() => {
  const TILE = 48;
  const MAP_W = 120;
  const MAP_H = 90;
  const MAP_VERSION = 1;

  /* Elemental "types" are pure flavor: they pick the attack visual + colors. */
  const TYPES = {
    sun:     { name: 'Sun',     emoji: '☀️', fx: 'beam',    color: '#ffb627', color2: '#fff3a0' },
    moon:    { name: 'Moon',    emoji: '🌙', fx: 'stars',   color: '#a78bff', color2: '#e9dcff' },
    thunder: { name: 'Thunder', emoji: '⚡', fx: 'zap',     color: '#ffe13b', color2: '#ffffff' },
    rainbow: { name: 'Rainbow', emoji: '🌈', fx: 'swirl',   color: '#ff6fb5', color2: '#7fe0ff' },
    heart:   { name: 'Heart',   emoji: '💖', fx: 'hearts',  color: '#ff5c8a', color2: '#ffc2d6' },
    water:   { name: 'Splash',  emoji: '💦', fx: 'bubbles', color: '#4fb3ff', color2: '#d4f1ff' },
    leaf:    { name: 'Leaf',    emoji: '🌿', fx: 'leaves',  color: '#4cc36a', color2: '#c9f7b5' },
    fruit:   { name: 'Fruit',   emoji: '🍎', fx: 'apples',  color: '#ff5a5a', color2: '#ffd1d1' },
    star:    { name: 'Star',    emoji: '⭐', fx: 'stars',   color: '#ffd23b', color2: '#fff6c2' },
    flower:  { name: 'Flower',  emoji: '🌸', fx: 'petals',  color: '#ff9ccf', color2: '#ffe3f1' },
    ice:     { name: 'Frost',   emoji: '❄️', fx: 'snow',    color: '#9fe8ff', color2: '#ffffff' },
    galaxy:  { name: 'Galaxy',  emoji: '🌌', fx: 'galaxy',  color: '#8b7bff', color2: '#ffd6ff' },
  };

  const RARITY = {
    common:    { label: 'Common',    rate: 0.45, badge: '',          stars: 1 },
    uncommon:  { label: 'Uncommon',  rate: 0.36, badge: '',          stars: 2 },
    rare:      { label: 'Rare ✨',    rate: 0.25, badge: '★ RARE',    stars: 3 },
    legendary: { label: 'Legendary', rate: 0.16, badge: '👑 LEGEND', stars: 4 },
  };

  /* 20 catchable Critters: 14 core + 6 sparkling rare / legendary variants. */
  const SPECIES = [
    { id: 'dogday', name: 'DogDay', emoji: '☀️', icon: 'dogday', type: 'sun', rarity: 'common', color: '#f39c34', ears: 'dog',
      move: 'Solar Ray', bubbles: ['☀️', '🦴', 'Woof!', '🌞'], hpB: 2, atkB: 1, starter: true,
      desc: 'A sunshine pup who naps in warm canyon sand and gives the best morning hugs.' },
    { id: 'catnap', name: 'CatNap', emoji: '🌙', icon: 'catnap', type: 'moon', rarity: 'common', color: '#7d5bd6', ears: 'cat',
      move: 'Moon Starbeam', bubbles: ['💤', '🌙', 'Mrrow~', '✨'], hpB: 1, atkB: 2, starter: true,
      desc: 'A sleepy purple kitty who sprinkles dreamy moon dust over the lavender fields.' },
    { id: 'hoppy', name: 'Hoppy Hopscotch', emoji: '⚡', icon: 'hoppy', type: 'thunder', rarity: 'common', color: '#2fbf7f', ears: 'bunny',
      move: 'Thunder Hop', bubbles: ['⚡', 'Boing!', '🥕', '!'], hpB: 0, atkB: 3, starter: true,
      desc: 'A zippy bunny who hops so fast she sparkles with thunder!' },
    { id: 'picky', name: 'PickyPiggy', emoji: '🍎', icon: 'picky', type: 'fruit', rarity: 'common', color: '#f283b6', ears: 'pig',
      move: 'Apple Bonk', bubbles: ['🍎!', 'Oink!', '😋', '🍏'], hpB: 3, atkB: 0,
      desc: 'A snack-loving piggy who knows exactly which apple tree has the sweetest apples.' },
    { id: 'bobby', name: 'Bobby BearHug', emoji: '❤️', icon: 'bobby', type: 'heart', rarity: 'common', color: '#e8485f', ears: 'bear',
      move: 'Heart Wave', bubbles: ['❤️', 'Hug?', '🤗', '💕'], hpB: 3, atkB: 1,
      desc: 'A cuddly red bear whose Heart Wave makes everyone smile.' },
    { id: 'mikey', name: 'Mikey', emoji: '🌿', icon: 'mikey', type: 'leaf', rarity: 'common', color: '#3fa34d', ears: 'shell',
      move: 'Leaf Twirl', bubbles: ['🌿', 'Hi!', '🐢', '🍃'], hpB: 2, atkB: 1,
      desc: 'A friendly explorer in a turtle hoodie who loves the quiet Emerald Woods.' },
    { id: 'jj', name: 'JJ', emoji: '🌊', icon: 'jj', type: 'water', rarity: 'common', color: '#3b82f6', ears: 'none',
      move: 'Wave Splash', bubbles: ['🌊', 'Splash!', '😄', '🐚'], hpB: 1, atkB: 2,
      desc: 'A cheerful builder who splashes in the lagoon and collects shiny seashells.' },
    { id: 'poppy', name: 'Poppy Dash', emoji: '🌸', icon: 'poppydash', type: 'flower', rarity: 'common', color: '#ff7fbf', ears: 'skunk',
      move: 'Petal Dash', bubbles: ['🌸', '🍿', 'Zoom!', '💨'], hpB: 0, atkB: 3,
      desc: 'A speedy little skunk who dashes through flowers with a bucket of popcorn.' },
    { id: 'bubba', name: 'Bubba Bubbaphant', emoji: '💡', icon: 'bubba', type: 'water', rarity: 'uncommon', color: '#5aa9e6', ears: 'elephant',
      move: 'Bright Bubbles', bubbles: ['💡', 'Idea!', '🫧', '📚'], hpB: 3, atkB: 1,
      desc: 'A brainy elephant whose lightbulb glows whenever he has a great idea.' },
    { id: 'crafty', name: 'CraftyCorn', emoji: '🌈', icon: 'craftycorn', type: 'rainbow', rarity: 'uncommon', color: '#58c7f3', ears: 'unicorn',
      move: 'Rainbow Swirl', bubbles: ['🌈', '✂️', '🎨', '✨'], hpB: 1, atkB: 2,
      desc: 'A crafty unicorn who paints rainbows across the Crystal Meadow sky.' },
    { id: 'kickin', name: 'KickinChicken', emoji: '⭐', icon: 'kickin', type: 'star', rarity: 'common', color: '#f6b928', ears: 'comb',
      move: 'Star Kick', bubbles: ['⭐', 'Bawk!', '🥚', '💪'], hpB: 1, atkB: 2,
      desc: 'A sporty chicken who practices star kicks on the windy ridge every morning.' },
    { id: 'sunny', name: 'SunnyFox', emoji: '🦊', icon: 'sunnyfox', type: 'sun', rarity: 'uncommon', color: '#f07f2c', ears: 'fox',
      move: 'Sunny Spark', bubbles: ['🦊', '🔔', '☀️', 'Yip!'], hpB: 1, atkB: 3,
      desc: 'A clever fox with a jingly bell who explores the golden canyon ruins.' },
    { id: 'huggy', name: 'Huggy Wuggy', emoji: '🧸', icon: 'huggy', type: 'heart', rarity: 'uncommon', color: '#2f6fd6', ears: 'fluff',
      move: 'Big Huggy Hug', bubbles: ['🧸', 'Hug!', '🔔', '💙'], hpB: 4, atkB: 0,
      desc: 'A big fluffy blue friend who keeps everyone warm with gigantic hugs.' },
    { id: 'luna', name: 'LunaBat', emoji: '🦇', icon: 'lunabat', type: 'moon', rarity: 'uncommon', color: '#6b4fb8', ears: 'bat',
      move: 'Night Flutter', bubbles: ['🦇', '🌙', 'Eee!', '✨'], hpB: 0, atkB: 3,
      desc: 'A starry little bat who flutters around the moon lanterns at the castle.' },
    /* ---- 6 sparkling rare & legendary variants ---- */
    { id: 'prism', name: 'Prism CraftyCorn', emoji: '✨', icon: 'craftycorn', base: 'crafty', variant: 'prism', type: 'rainbow', rarity: 'rare',
      color: '#ff8ad8', ears: 'unicorn', move: 'Prism Rainbow Swirl', bubbles: ['✨', '🌈', '💎', '🦄'], hpB: 2, atkB: 3,
      desc: 'A shimmering crystal unicorn. Its mane sparkles with every color of the rainbow!' },
    { id: 'thunderbolt', name: 'Thunderbolt Hoppy', emoji: '⚡', icon: 'hoppy', base: 'hoppy', variant: 'thunder', type: 'thunder', rarity: 'rare',
      color: '#ffd400', ears: 'bunny', move: 'Mega Thunder Hop', bubbles: ['⚡', '⚡⚡', 'ZAP!', '🌩️'], hpB: 1, atkB: 4,
      desc: 'A golden electric bunny who guards the Lightning Shrine in the bamboo grove.' },
    { id: 'superstar', name: 'Superstar KickinChicken', emoji: '🌟', icon: 'kickin', base: 'kickin', variant: 'superstar', type: 'star', rarity: 'rare',
      color: '#ff9f1c', ears: 'comb', move: 'Superstar Kick', bubbles: ['🌟', '⭐⭐', 'BAWK!', '🏆'], hpB: 2, atkB: 3,
      desc: 'A dazzling golden chicken who dances in the sunshine at the Great Pyramid.' },
    { id: 'aurora', name: 'Aurora Huggy', emoji: '❄️', icon: 'huggy', base: 'huggy', variant: 'aurora', type: 'ice', rarity: 'rare',
      color: '#7ff0ff', ears: 'fluff', move: 'Aurora Frosty Hug', bubbles: ['❄️', '🌌', 'Brrr!', '💎'], hpB: 4, atkB: 2,
      desc: 'A frosty friend whose fur glows with the dancing northern lights.' },
    { id: 'galaxy', name: 'Galaxy CatNap', emoji: '🌌', icon: 'catnap', base: 'catnap', variant: 'galaxy', type: 'galaxy', rarity: 'legendary',
      color: '#5b5bff', ears: 'cat', move: 'Galaxy Starbeam', bubbles: ['🌌', '🌠', '💫', '🪐'], hpB: 4, atkB: 4,
      desc: 'A legendary cosmic kitty who naps on the Moon Altar and dreams up new stars.' },
    { id: 'solar', name: 'Solar Crown DogDay', emoji: '👑', icon: 'dogday', base: 'dogday', variant: 'solar', type: 'sun', rarity: 'legendary',
      color: '#ff7b00', ears: 'dog', move: 'Royal Solar Flare', bubbles: ['👑', '☀️', '🔥', '🌞'], hpB: 4, atkB: 4,
      desc: 'The legendary sun king pup! His golden crown shines brighter than noon.' },
  ];
  SPECIES.forEach((s, i) => { s.num = i + 1; s.rate = RARITY[s.rarity].rate; });
  const SP = {};
  SPECIES.forEach(s => { SP[s.id] = s; });

  /* Regions. rect = [x0, y0, x1, y1] (inclusive tile coords). Zone ids 1..9. */
  const REGIONS = [
    null,
    { id: 1, key: 'village', name: 'Sunshine Village', short: 'Village', emoji: '🏡', rect: [50, 62, 70, 80], lv: [2, 4],
      color: '#ffcf4d', music: 'village', table: [] },
    { id: 2, key: 'orchard', name: 'Whispering Apple Orchard & Emerald Woods', short: 'Orchard', emoji: '🍎', rect: [8, 56, 46, 84], lv: [2, 5],
      color: '#5cc45a', music: 'nature', table: [['picky', 40], ['bobby', 30], ['mikey', 30]] },
    { id: 3, key: 'lagoon', name: 'Sapphire Coral Lagoon & Beach Boardwalk', short: 'Lagoon', emoji: '🌊', rect: [72, 56, 114, 84], lv: [3, 6],
      color: '#3fc1e8', music: 'lagoon', table: [['jj', 40], ['poppy', 30], ['bubba', 30]] },
    { id: 4, key: 'meadow', name: 'Rainbow Crystal Meadow & Unicorn Shrine', short: 'Meadow', emoji: '🌈', rect: [6, 28, 44, 54], lv: [5, 9],
      color: '#f59fd0', music: 'meadow', table: [['crafty', 34], ['bobby', 28], ['poppy', 28], ['prism', 10]] },
    { id: 5, key: 'windmill', name: 'Thunder Windmill Ridge & Bamboo Grove', short: 'Windmill', emoji: '⚡', rect: [74, 28, 114, 54], lv: [6, 10],
      color: '#b6d94a', music: 'adventure', table: [['hoppy', 48], ['kickin', 42], ['thunderbolt', 10]] },
    { id: 6, key: 'canyon', name: 'Golden Sunbaked Canyon & Oasis Ruins', short: 'Canyon', emoji: '🏜️', rect: [6, 4, 44, 26], lv: [8, 12],
      color: '#f0a952', music: 'desert', table: [['dogday', 34], ['sunny', 30], ['kickin', 28], ['superstar', 8]] },
    { id: 7, key: 'glacier', name: 'Frostberry Glacier & Aurora Hot Springs', short: 'Glacier', emoji: '❄️', rect: [74, 4, 114, 26], lv: [10, 14],
      color: '#9fdcff', music: 'glacier', table: [['bubba', 45], ['huggy', 45], ['aurora', 10]] },
    { id: 8, key: 'castle', name: 'Starlight Lavender Sanctuary & Moon Castle', short: 'Castle', emoji: '🏰', rect: [45, 4, 73, 32], lv: [12, 16],
      color: '#a98bf0', music: 'castle', table: [['catnap', 46], ['luna', 44], ['galaxy', 5], ['solar', 5]] },
    { id: 9, key: 'cross', name: 'Rainbow Crossroads Park', short: 'Crossroads', emoji: '🌳', rect: [45, 33, 73, 61], lv: [2, 5],
      color: '#7fd36a', music: 'nature', table: [['dogday', 25], ['catnap', 25], ['hoppy', 25], ['picky', 25]] },
  ];
  /* The 8 official biome regions (fast-travel destinations); Crossroads is a bonus park. */
  const MAIN_REGIONS = [1, 2, 3, 4, 5, 6, 7, 8];

  /* Where each rare / legendary always waits (until caught) — so 20/20 is always possible. */
  const SPECIAL_SPOTS = [
    { sp: 'prism', zone: 4, at: [15, 38], lv: 11, place: 'the Unicorn Gazebo' },
    { sp: 'thunderbolt', zone: 5, at: [107, 50], lv: 12, place: 'the Lightning Shrine' },
    { sp: 'superstar', zone: 6, at: [12, 11], lv: 14, place: 'the Great Pyramid' },
    { sp: 'aurora', zone: 7, at: [84, 10], lv: 16, place: 'the Aurora Crystals' },
    { sp: 'galaxy', zone: 8, at: [65, 18], lv: 20, place: 'the Moon Altar' },
    { sp: 'solar', zone: 8, at: [53, 18], lv: 20, place: 'the Sun Altar' },
  ];

  const ITEMS = {
    star:    { id: 'star',    name: 'Star Capsule',        emoji: '⭐', mult: 1.0, price: 0,   desc: 'Free & unlimited! The trusty everyday capsule.' },
    rainbow: { id: 'rainbow', name: 'Rainbow Capsule',     emoji: '🌈', mult: 2.2, price: 30,  bundles: [[1, 30], [3, 75]], desc: 'x2.2 catch rate! Sparkly and super bouncy.' },
    master:  { id: 'master',  name: 'Master Star Capsule', emoji: '👑', mult: 999, price: 250, bundles: [[1, 250]], desc: '100% instant catch! Works on ANY Critter.' },
    berry:   { id: 'berry',   name: 'Sweet Berry',         emoji: '🍓', price: 10,  bundles: [[1, 10], [5, 40], [10, 75]], desc: 'Heals your Critter and makes wild Critters happy (+45% catch chance)!' },
  };

  /* Friendly villagers. look = sprite palette. gift is given once. */
  const NPCS = [
    { id: 'mom', name: 'Mom', zone: 1, at: [55, 68], look: { skin: '#ffd6b3', hair: '#7a4a2a', hairStyle: 'bun', shirt: '#ff8fb1', pants: '#7c5cd6', hat: 'none', apron: '#ffffff' },
      lines: ['Good morning, Chuyu! 🌞 Did you sleep well?', 'If your Critters get sleepy, splash them at a 💖 Healing Fountain — or come home for a nap!', 'Here, take some snacks for your adventure! I love you! 💕'],
      gift: { berry: 5 }, after: ['Be careful and have fun, sweetie! Come home any time for a nap. 🏡'] },
    { id: 'prof', name: 'Professor Bubba', zone: 1, at: [63, 69], look: { skin: '#f5cfa5', hair: '#d9d9d9', hairStyle: 'short', shirt: '#ffffff', pants: '#5a7bd6', hat: 'elephant', coat: true, glasses: true },
      lines: ['Ah, Chuyu! Welcome to my Critter Lab! 🔬', 'Twenty different Critters live all over Rainbow Island!', 'Walk into a wild Critter, or rustle through tall grass, to meet one.', 'Feed it a 🍓 berry, then toss a capsule! Watch the 🎯 Catch Chance meter!', 'Take these Rainbow Capsules — they work 2.2x better! 🌈'],
      gift: { rainbow: 3 }, after: ['Fill your 📖 CritterDex! Rare ✨ Critters wait at special landmarks in every land!'] },
    { id: 'shopkeeper', name: 'Shopkeeper Penny', zone: 1, at: [54, 76], look: { skin: '#e8b48a', hair: '#2b2b2b', hairStyle: 'ponytail', shirt: '#2fb39a', pants: '#3c4a6b', hat: 'none', apron: '#fff3c4' },
      lines: ['Welcome to the Capsule & Berry Shop! 🛒'], shop: true },
    { id: 'timmy', name: 'Timmy', zone: 1, at: [57, 74], look: { skin: '#ffe0c2', hair: '#e8b84a', hairStyle: 'spiky', shirt: '#ffb020', pants: '#3b6fd6', hat: 'none' },
      lines: ['Press B to put on your ⚡ Roller Skates and zoom super fast!', 'You can also just tap anywhere on the map to walk there!'] },
    { id: 'lila', name: 'Lila', zone: 1, at: [62, 73], look: { skin: '#c98d5e', hair: '#3a2416', hairStyle: 'pigtails', shirt: '#b56cff', pants: '#ff8fb1', hat: 'none' },
      lines: ['Open the 🗺️ Map and tap any land to teleport there instantly! ✨', 'Every land has a glowing 🔮 Rainbow Crystal and a 💖 Healing Fountain.'] },
    { id: 'grandpa', name: 'Grandpa Joe', zone: 1, at: [69, 69], look: { skin: '#f0c9a0', hair: '#f2f2f2', hairStyle: 'bald', shirt: '#7a8f5a', pants: '#6b5a45', hat: 'none', beard: true },
      lines: ['When I was little, I saw a Galaxy CatNap 🌌 napping on the Moon Altar up north!', 'And its friend, Solar Crown DogDay 👑, guards the Sun Altar right beside it.'] },
    { id: 'ranger', name: 'Ranger Rosie', zone: 9, at: [56, 48], look: { skin: '#f3c79b', hair: '#b5532a', hairStyle: 'ponytail', shirt: '#5c8a3a', pants: '#7a5c3a', hat: 'ranger' },
      lines: ['Welcome to Rainbow Crossroads Park! 🌳', '⬅ West: Rainbow Meadow · ➡ East: Windmill Ridge · ⬆ North: Moon Castle · ⬇ South: Sunshine Village', 'DogDay, CatNap and Hoppy all love to play in this tall grass!'] },
    { id: 'farmer', name: 'Farmer Fern', zone: 2, at: [40, 68], look: { skin: '#ffd2a8', hair: '#c46a2b', hairStyle: 'braid', shirt: '#e8473f', pants: '#3a64b8', hat: 'straw' },
      lines: ['Howdy, Chuyu! 🍎 Stand next to an apple tree and press A to shake it!', 'Shaken trees drop free Sweet Berries and gold. They grow back after a little while!', 'Here are some berries to get you started!'],
      gift: { berry: 3 }, after: ['PickyPiggy LOVES my apples. You will find lots of them around here! 🐷'] },
    { id: 'woods', name: 'Woodsy Will', zone: 2, at: [22, 71], look: { skin: '#e9b98c', hair: '#4a3020', hairStyle: 'short', shirt: '#2f7a3a', pants: '#5a4030', hat: 'beanie', beard: true },
      lines: ['Psst! Follow the little trail into the Emerald Woods...', 'There is a secret glade with fairy mushrooms and a treasure chest! 🍄🎁'] },
    { id: 'lifeguard', name: 'Lifeguard Lily', zone: 3, at: [88, 73], look: { skin: '#d9a070', hair: '#f5d061', hairStyle: 'ponytail', shirt: '#ff4d4d', pants: '#ffffff', hat: 'visor' },
      lines: ['Walk right into the shallow water — you will float on a 🦆 Duckie Ring!', 'Hop across the pink coral stepping stones to reach the lagoon island!'] },
    { id: 'fisher', name: 'Fisherman Finn', zone: 3, at: [116, 64], look: { skin: '#e7b58b', hair: '#6b6b6b', hairStyle: 'short', shirt: '#2f6fd6', pants: '#c9a26b', hat: 'fisher', beard: true },
      lines: ['Ahoy, Chuyu! The lighthouse keeps all the boats safe. ⚓', 'JJ loves splashing near the coral stones! Take these lucky capsules!'],
      gift: { rainbow: 2 }, after: ['Nothing beats a sunny day on the pier! 🎣'] },
    { id: 'fairy', name: 'Fairy Fiona', zone: 4, at: [20, 38], look: { skin: '#ffe4f0', hair: '#ff9ad5', hairStyle: 'long', shirt: '#b8f0ff', pants: '#ffd1ef', hat: 'flower', wings: true },
      lines: ['Hee hee! Welcome to the Rainbow Crystal Meadow! 🌈', 'A shimmering ✨ Prism CraftyCorn waits by the Unicorn Gazebo. Bring a berry!'] },
    { id: 'miller', name: 'Miller Max', zone: 5, at: [83, 38], look: { skin: '#f2c49b', hair: '#8a5a2b', hairStyle: 'short', shirt: '#d9a43a', pants: '#4a5a8a', hat: 'cap2' },
      lines: ['The wind never stops on Thunder Windmill Ridge! 🌬️', 'Step on a blue trampoline pad and BOING — you fly over the grass! 🦘'] },
    { id: 'ninja', name: 'Ninja Ken', zone: 5, at: [102, 47], look: { skin: '#f0c9a0', hair: '#1b1b1b', hairStyle: 'short', shirt: '#2b2b4a', pants: '#2b2b4a', hat: 'ninja' },
      lines: ['Shhh... ⚡ Thunderbolt Hoppy guards the Lightning Shrine past the bamboo!', 'Follow the bamboo trail east, then south.'] },
    { id: 'explorer', name: 'Explorer Ella', zone: 6, at: [18, 11], look: { skin: '#e3a878', hair: '#5a3218', hairStyle: 'long', shirt: '#e0c48a', pants: '#8a6a3a', hat: 'explorer' },
      lines: ['Whew, it is hot! 🏜️ The Golden Canyon is full of buried treasure chests!', 'A dazzling 🌟 Superstar KickinChicken dances at the Great Pyramid!', 'Take some gold for your journey!'],
      gift: { gold: 100 }, after: ['Look behind the rocks and cacti — chests love to hide there! 🎁'] },
    { id: 'snowkid', name: 'Snowy Sam', zone: 7, at: [90, 12], look: { skin: '#ffd9c2', hair: '#3a2a1a', hairStyle: 'short', shirt: '#4fa3ff', pants: '#2b3f7a', hat: 'beanie2' },
      lines: ['Brrr! ⛄ Aurora Huggy dances where the ice crystals glow!', 'If you get cold, hop into the hot springs ♨️ — your Critters will feel all better!'] },
    { id: 'spa', name: 'Spa Keeper Yuki', zone: 7, at: [104, 21], look: { skin: '#ffe0c8', hair: '#1f1f2b', hairStyle: 'bun', shirt: '#ff9ccf', pants: '#7a4fd6', hat: 'none' },
      lines: ['Welcome to the Aurora Hot Springs! ♨️ Press A at the pool to heal your Critters!'] },
    { id: 'guard', name: 'Guard Gus', zone: 8, at: [56, 11], look: { skin: '#f2c49b', hair: '#3a2a1a', hairStyle: 'short', shirt: '#4a3fa8', pants: '#2b2b4a', hat: 'helmet' },
      lines: ['Halt! Oh... it is you, Chuyu! Welcome to the Starlight Moon Castle! 🏰', 'Two Legendary Critters rest at the ☀️ Sun Altar and the 🌙 Moon Altar!'] },
    { id: 'princess', name: 'Princess Stella', zone: 8, at: [62, 11], look: { skin: '#ffe0c8', hair: '#ffd84d', hairStyle: 'long', shirt: '#c58bff', pants: '#ffb3e6', hat: 'crown' },
      lines: ['Hello, brave Critter friend! 👸', 'Legendary Critters are very shy... This Master Star Capsule catches ANY Critter, 100%!'],
      gift: { master: 1 }, after: ['May the stars light your way, Chuyu! 🌟'] },
  ];

  /* Chest contents are decided by world generation; these are the reward tiers. */
  const CHEST_LOOT = [
    ['gold', 54], ['berry', 26], ['rainbow', 17], ['master', 3],
  ];

  const TIPS = [
    'Tip: Tap anywhere on the map to walk there — tap a chest, tree or Critter to use it!',
    'Tip: Feed a 🍓 berry before throwing a capsule: +45% catch chance!',
    'Tip: Attacks never knock a wild Critter out — they just get dizzy 🎯 and easier to catch!',
    'Tip: Press B for ⚡ roller-skate dash!',
    'Tip: The 🗺️ Map can teleport you to any land in one tap!',
  ];

  function maxHp(sp, lv) { return Math.round(18 + lv * 4 + sp.hpB * lv * 0.5); }
  function attackPower(sp, lv) { return 7 + lv * 2.4 + sp.atkB * lv * 0.3; }
  function expToNext(lv) { return 10 + lv * 10; }

  return { TILE, MAP_W, MAP_H, MAP_VERSION, TYPES, RARITY, SPECIES, SP, REGIONS, MAIN_REGIONS, SPECIAL_SPOTS, ITEMS, NPCS, CHEST_LOOT, TIPS, maxHp, attackPower, expToNext };
})();
