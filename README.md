# 🌈🐾 Chuyu's Critter Quest: Rainbow Island RPG

🎮 **Play Live (GitHub Pages):** **[https://kunruiw1991.github.io/critters-quest-rpg/](https://kunruiw1991.github.io/critters-quest-rpg/)**

A cozy, kid-friendly **2D classic RPG** — a simple Pokémon-style adventure where **Chuyu** explores a huge
**120 × 90 tile Rainbow Island** (5,760 × 4,320 px world) with **8 hand-themed biomes**, makes friends with
villagers, opens treasure chests, shakes fruit trees, and **catches all 20 Critters** for the CritterDex!

![Chuyu's Critter Quest screenshot](screenshot.jpg)

| 🏡 Sunshine Village | 🌈 Crystal Meadow | ⚔️ Catching a rare Prism CraftyCorn |
|---|---|---|
| ![Village](screenshots/village.jpg) | ![Meadow](screenshots/meadow.jpg) | ![Battle](screenshots/battle.jpg) |
| **🗺️ World Map / Fast Travel** | **📖 CritterDex** | |
| ![World Map](screenshots/worldmap.jpg) | ![CritterDex](screenshots/critterdex.jpg) | |

---

## ✨ Highlights

- **Huge 120 × 90 world (10,800 tiles, 48 px tiles)** generated deterministically, so every player gets the same island.
  Every chest, tree, NPC, fountain, crystal and rare spot is checked to be reachable on foot. No softlocks.
- **8 distinct biomes + a central park**, each with its own tile palette, landmarks, music, weather particles and Critters:

  | # | Region | Landmarks | Critters |
  |---|--------|-----------|----------|
  | 1 | 🏡 **Sunshine Village** | Chuyu's red-roof house, Professor Bubba's Critter Lab, Capsule & Berry Shop, Healing Fountain, flowerbeds, lamps, cobblestone streets | *(safe town, no wild Critters)* |
  | 2 | 🍎 **Whispering Apple Orchard & Emerald Woods** | Apple-tree rows, streams with wooden bridges, a secret glade with a fairy mushroom ring | PickyPiggy 🍎, Bobby BearHug ❤️, Mikey 🌿 |
  | 3 | 🌊 **Sapphire Coral Lagoon & Beach Boardwalk** | Golden beach, palms, seashells, boardwalk, lighthouse pier, coral stepping stones, lagoon island | JJ 🌊, Poppy Dash 🌸, Bubba Bubbaphant 💡 |
  | 4 | 🌈 **Rainbow Crystal Meadow & Unicorn Shrine** | Pastel flower fields, glowing crystal pillars, fairy pond, Unicorn Gazebo | CraftyCorn 🌈, Bobby ❤️, Poppy 🌸, ✨ **Prism CraftyCorn** |
  | 5 | ⚡ **Thunder Windmill Ridge & Bamboo Grove** | Spinning windmills, bamboo trail, bouncy trampoline pads, Lightning Shrine | Hoppy Hopscotch ⚡, KickinChicken ⭐, ⚡ **Thunderbolt Hoppy** |
  | 6 | 🏜️ **Golden Sunbaked Canyon & Oasis Ruins** | Great Pyramid, little pyramid, palm oasis, cactus trails, ruins, buried treasure | DogDay ☀️, SunnyFox 🦊, KickinChicken ⭐, 🌟 **Superstar KickinChicken** |
  | 7 | ❄️ **Frostberry Glacier & Aurora Hot Springs** | Snowy pines, frozen lake, aurora ice crystals, steaming hot springs, snowmen | Bubba 💡, Huggy Wuggy 🧸, ❄️ **Aurora Huggy** |
  | 8 | 🏰 **Starlight Lavender Sanctuary & Moon Castle** | Lavender rows, moon lanterns, Starlight Moon Castle courtyard, Sun & Moon Altars | CatNap 🌙, LunaBat 🦇, 🌌 **Galaxy CatNap**, 👑 **Solar Crown DogDay** |
  | ★ | 🌳 **Rainbow Crossroads Park** (bonus hub) | Rainbow Lake with a treasure island, signposts to every land | DogDay, CatNap, Hoppy, PickyPiggy |

- **20 catchable Critters**: 14 core Critters + 6 sparkling rare/legendary variants. Rares use recolored portraits,
  glowing aura rings and ★ / 👑 badges. Each rare **always waits at its landmark until caught**, so 20/20 is always reachable.
- **71 visible overworld Critters** hop around every biome with animated ears/tails/wings, name tags, in-pill `NEW!` / `★` / `👑`
  badges and speech bubbles (`🍎!`, `☀️`, `💤`, `✨`). Every species in a land is always roaming somewhere, and at least two
  Critters are on screen right after each teleport. Rustling through **tall grass / flower patches** can trigger surprise encounters too.
  Tap a Critter and it waits (`❗`) while Chuyu walks over.
- **44 treasure chests 🎁, 24 shakeable fruit trees 🌳 (they regrow!), 8 healing fountains 💖 and 8 Rainbow Waypoint Crystals 🔮**, plus 19 friendly villagers with tips and gifts.
- **Automatic 🦆 Duckie Float** when Chuyu wades into shallow water (his partner gets a little swim ring too!), pink **coral
  stepping stones** across the deep lagoon, and **trampoline pads** that bounce him 3 tiles across Windmill Ridge (tap one to boing!).

## ⚔️ Kid-friendly battles & catching

Four big buttons. Use touch, mouse, keys `1` `2` `3` `4`, or arrow keys + `Enter`/`Space`:

1. **⚡ Attack**: an elemental skill with a projectile effect (Solar Ray, Moon Starbeam, Thunder Hop, Rainbow Swirl, Heart Wave…).
   **Mercy Catch Rule:** attacks *never* drop a wild Critter below **1 HP**. It just gets **"Dizzy & Ready to Catch! 🎯"**.
   Tapping Attack on a Dizzy Critter jumps straight to the capsule menu, so no turn is wasted.
   A battle only ends without a catch if Chuyu explicitly picks **🏁 Finish Battle**. Landmark rares stay at their spot until caught.
2. **🎯 Throw Capsule**: **⭐ Star Capsule (∞ free)**, **🌈 Rainbow Capsule (×2.2)**, **👑 Master Star Capsule (100%)**.
   Live odds are shown on every button. Animated arc, 3 suspenseful wiggles, then a **✨ GOTCHA!** celebration with confetti,
   party EXP, gold, a CritterDex entry and a 1-tap **"🐾 Make it my partner!"** button.
3. **🍓 Feed Treat**: heals Chuyu's Critter **and** makes the wild Critter happy (**+45% catch chance**). No berry is wasted
   when it wouldn't help.
4. **🔄 Switch / 🏃 Run**: swap partners from the whole collection, or wave a friendly goodbye.

Out of capsules or berries far from town? **🛒 Penny's Express** quick-buys one right inside the battle if Chuyu has the gold.

**Catch chance** (always shown live as a 🎯 meter):

```
chance = min(1, baseRate × hpBonus × capsule + (fed ? 0.45 : 0))
baseRate: common .45 · uncommon .36 · rare .25 · legendary .16
hpBonus  = 1 + (1 − (hp − 1)/(maxHp − 1))     → 1.0 at full HP, 2.0 when Dizzy
capsule  = Star ×1.0 · Rainbow ×2.2 · Master = 100%
```

If every Critter on the team gets sleepy, Chuyu just hurries back to the last Healing Fountain. Nobody faints and nothing is lost.

## 🎮 Controls

| Action | Touch / Mouse | Keyboard |
|--------|---------------|----------|
| Walk | **Tap anywhere** (auto-pathfinding around obstacles, with a destination ring) or the **▲▼◄►** D-pad | Arrow keys / WASD |
| Talk / Open / Catch | Tap the chest / tree / NPC / Critter (auto-walks there and uses it) or **A** | Enter / Space / Z |
| ⚡ Roller-skate dash | **B** (toggle) | B or X (toggle), hold Shift |
| 🗺️ World Map / Fast Travel | **World Map** button | M |
| 📖 CritterDex (X/20) | **Dex** button | C |
| 🎒 Shop / Bag | **Shop / Bag** button | I or E |
| Menu (sound, save, help, 🔄 New Adventure) | ⚙️ | Esc |

- **🗺️ Interactive World Map**: the full 120×90 island with biome labels, Chuyu's live position, unopened chests, fountains,
  crystals, rare-spot stars, habitat portraits with *caught/total* per land, and **1-tap teleport** to any region.
- **📖 CritterDex**: all 20 entries (unknown → seen → caught), levels, HP/EXP bars, habitats, and **1-tap "🤝 Partner"**.
  Your partner follows Chuyu around the overworld, like Pikachu in Pokémon Yellow!
- **🛒 Shop** (from the Shop / Bag button anywhere, or from Penny in the village): 🍓 Berries (1 = 10 🪙, 5 = 40, 10 = 75),
  🌈 Rainbow Capsules (1 = 30, 3 = 75) and 👑 Master Star Capsules (250). Star Capsules are always free. A live tip shows how
  many unopened chests, villager gifts and ripe fruit trees are left on the island.
- **⭐ Level-ups** happen in battle and on the overworld (star burst over the follower). The Dex shows HP/EXP bars for every
  caught Critter and a 🏆 trophy banner at 20/20.
- **🔊 WebAudio chiptunes**: a melody for each biome, an upbeat battle theme, encounter fanfare, attack whooshes, capsule wiggle
  beeps and a victory jingle. Mute toggle 🔊/🔇 is remembered.
- **💾 Auto-save** (`localStorage`) after every catch, chest, gift, purchase, level-up and teleport, plus every 20 s and when the
  tab is hidden. A `💾 Saved!` indicator flashes each time, and the ⚙️ Menu shows "Last saved". Chuyu's exact tile, his
  follower's tile, the team, opened chests, inventory and play time all come back after a reload.
  **🔄 New Adventure** (⚙️ Menu) starts over cleanly.

## 🧱 Project structure

```
index.html          HUD, battle, modals, title & celebration overlays
css/style.css       Responsive layout (desktop 1280×800, iPad, phone portrait 390×844 & landscape 844×390)
js/data.js          Critters, regions, items, villagers, formulas
js/util.js          Seeded RNG, value noise, easing, binary heap
js/world.js         Deterministic 120×90 island generator + connectivity audit/repair
js/art.js           Procedural tile atlas, objects, characters, critter medallions, rare-variant recoloring, minimap
js/audio.js         WebAudio chiptune sequencer + sound effects
js/battle.js        Battle system (mercy rule, capsules, feeding, switching)
js/ui.js            HUD, dialogue, World Map, CritterDex, Shop/Bag, menu, title, GOTCHA overlay
js/game.js          Main loop, camera, controls, tap-to-walk BFS pathfinding, overworld Critters, saving
icons/*.jpg         14 official Critter portraits
```

No build step and no dependencies. Open `index.html` through any static web server.

### 🧪 Developer test hooks

`window.CritterQuest` exposes `state`, `mode`, `player`, `follower`, `wilds`, `teleportToRegion(z)`, `teleportTo(x, y)`,
`walkTo(x, y)`, `tapWorld(wx, wy)`, `screenOf(tx, ty)`, `beginBattle(speciesId, level)`, `setPartner(id)` and `save()`.
`World.audit()` reports map size, object counts and unreachable targets (always `[]`). `Battle.act('attack'|'catch'|'feed'|'switch')`,
`Battle.subAct('throw', 'star'|'rainbow'|'master')`, `Battle.chance(capsule)` and `Art.stats()` (atlas memory) help with scripted tests.

### ✅ Quality

Built with a 10-round creator/critic audit covering world connectivity, spawns, battle math, controls, map, CritterDex,
economy, responsive layouts, save/audio and live headless gameplay. Every round ended with no open issues.
Verified in headless Chrome at 1280×800, 1024×768, 820×1180, 390×844, 844×390, 667×375 and 360×640: 0 console warnings or
errors, 0 off-screen controls, about 60 FPS.

---

Made with 💖 for Chuyu.
