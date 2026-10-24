'use strict';
/* ==========================================================================
 * UI: HUD, dialogue box, toasts, region banner, World Map + fast travel,
 * CritterDex, Bag & Shop, settings menu, starter title screen, GOTCHA overlay.
 * ========================================================================== */
const UI = (() => {
  const D = CQData;
  const $ = id => document.getElementById(id);
  const esc = U.escapeHtml;
  let dlg = null, dlgTimer = null;
  let modalOpen = false, modalKind = null, minimap = null;
  let titleCb = null, celebrating = null;
  let bannerTimer = null, saveTimer = null;
  let fxCv = null, fxCtx = null, confetti = [], fxDirty = false;

  function init() {
    fxCv = $('fx'); fxCtx = fxCv.getContext('2d');
    sizeFx(); window.addEventListener('resize', sizeFx);
    $('btnA').addEventListener('pointerdown', e => { e.preventDefault(); $('btnA').classList.add('down'); Game.pressA(); });
    $('btnB').addEventListener('pointerdown', e => { e.preventDefault(); $('btnB').classList.add('down'); Game.pressB(); });
    ['btnA', 'btnB'].forEach(id => ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => $(id).addEventListener(ev, () => $(id).classList.remove('down'))));
    $('mapBtn').addEventListener('click', () => openMap());
    $('dexBtn').addEventListener('click', () => openDex());
    $('bagBtn').addEventListener('click', () => openBag('bag'));
    $('muteBtn').addEventListener('click', toggleMute);
    $('menuBtn').addEventListener('click', openMenu);
    $('partnerCard').addEventListener('click', () => { if (Game.state) openDex(Game.state.partner); });
    $('dialog').addEventListener('pointerdown', e => { e.preventDefault(); advanceDialog(); });
    $('modalClose').addEventListener('click', () => closeModal());
    $('modal').addEventListener('pointerdown', e => { if (e.target.id === 'modal') closeModal(); });
    $('celeOk').addEventListener('click', closeCelebrate);
    $('celePartner').addEventListener('click', () => {
      if (!celebrating || !celebrating.spId) return;
      const sp = D.SP[celebrating.spId];
      if (Game.setPartner(sp.id)) toast('🐾 ' + sp.name + ' ' + sp.emoji + ' is now Chuyu\'s partner! Let\'s go explore!');
      closeCelebrate();
    });
    updateMuteBtn();
  }
  function sizeFx() {
    const d = Math.min(window.devicePixelRatio || 1, 2);
    fxCv.width = Math.floor(window.innerWidth * d); fxCv.height = Math.floor(window.innerHeight * d);
    fxCtx.setTransform(d, 0, 0, d, 0, 0);
  }
  function hideLoading() { const l = $('loading'); if (l) l.classList.add('hidden'); }

  /* ---------------- HUD ---------------- */
  function hpColor(r) { return r > 0.5 ? '#4cd964' : r > 0.2 ? '#ffcc00' : '#ff3b30'; }
  function updateHUD() {
    const s = Game.state;
    if (!s) return;
    const sp = D.SP[s.partner], t = s.team[s.partner], mx = D.maxHp(sp, t.lv);
    const img = $('pcImg');
    const url = Art.portraitURL(sp.id);
    if (img.dataset.src !== url) { img.src = url; img.dataset.src = url; }
    $('partnerCard').style.setProperty('--pc', sp.color);
    $('pcName').textContent = sp.name;
    $('pcLv').textContent = 'Lv ' + t.lv;
    const r = t.hp / mx;
    $('pcHp').style.width = (r * 100).toFixed(1) + '%';
    $('pcHp').style.background = hpColor(r);
    $('pcHpTxt').textContent = t.hp + '/' + mx;
    $('gold').textContent = U.fmt(s.inv.gold);
    $('berries').textContent = s.inv.berry;
    $('rainbows').textContent = s.inv.rainbow;
    $('masters').textContent = s.inv.master;
    $('dexCount').textContent = Object.keys(s.team).length + '/' + D.SPECIES.length;
    $('btnB').classList.toggle('on', !!s.dash);
    $('btnBLabel').textContent = s.dash ? 'Dash ON' : 'Dash';
  }
  function flashSave() {
    const el = $('saveInd');
    el.classList.add('saved'); el.textContent = '💾 Saved!';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { el.classList.remove('saved'); el.textContent = '💾'; }, 1400);
  }
  function toggleMute() {
    Sound.unlock();
    Sound.setMuted(!Sound.muted);
    updateMuteBtn();
    toast(Sound.muted ? '🔇 Sound off' : '🔊 Sound on!');
  }
  function updateMuteBtn() { const b = $('muteBtn'); if (b) { b.textContent = Sound.muted ? '🔇' : '🔊'; b.setAttribute('aria-label', Sound.muted ? 'Unmute' : 'Mute'); } }
  function toast(text) {
    const box = $('toasts');
    const d = document.createElement('div');
    d.className = 'toast'; d.textContent = text;
    box.appendChild(d);
    while (box.children.length > 3) box.removeChild(box.firstChild);
    setTimeout(() => d.classList.add('out'), 2700);
    setTimeout(() => { if (d.parentNode) d.parentNode.removeChild(d); }, 3200);
  }
  function banner(reg) {
    if (!reg) return;
    const b = $('banner');
    b.innerHTML = '<span class="be">' + reg.emoji + '</span><span class="bt">' + esc(reg.name) + '</span>';
    b.style.setProperty('--c', reg.color);
    b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => b.classList.remove('show'), 2900);
  }
  function flashScreen() { const f = $('flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); }

  /* ---------------- dialogue ---------------- */
  function personCanvas(look) {
    const c = document.createElement('canvas');
    c.width = 112; c.height = 112;
    const g = c.getContext('2d');
    g.scale(2.6, 2.6); g.translate(21.5, 47);
    Art.drawPerson(g, look, 'down', 0, {});
    return c;
  }
  function dialog(speaker, lines, onDone) {
    if (dlgTimer) { clearInterval(dlgTimer); dlgTimer = null; }
    dlg = { speaker, lines: lines.slice(), i: 0, onDone, typing: false, full: '', shown: 0 };
    $('dlgName').textContent = speaker.name || '';
    const face = $('dlgFace');
    face.innerHTML = '';
    if (speaker.look) face.appendChild(personCanvas(speaker.look));
    else face.textContent = speaker.emoji || '💬';
    $('dialog').classList.remove('hidden');
    document.body.classList.add('in-dialog');
    if (Game.mode === 'play') Game.mode = 'dialog';
    showLine();
  }
  function showLine() {
    const text = dlg.lines[dlg.i];
    dlg.full = text; dlg.shown = 0; dlg.typing = true;
    $('dlgMore').textContent = dlg.i < dlg.lines.length - 1 ? '▶ tap' : '✔ OK';
    const el = $('dlgText');
    el.textContent = '';
    dlgTimer = setInterval(() => {
      if (!dlg) { clearInterval(dlgTimer); dlgTimer = null; return; }
      dlg.shown = Math.min(dlg.full.length, dlg.shown + 2);
      el.textContent = dlg.full.slice(0, dlg.shown);
      if (dlg.shown >= dlg.full.length) { dlg.typing = false; clearInterval(dlgTimer); dlgTimer = null; }
    }, 16);
  }
  function advanceDialog() {
    if (!dlg) return false;
    if (dlg.typing) {
      dlg.typing = false; dlg.shown = dlg.full.length; $('dlgText').textContent = dlg.full;
      if (dlgTimer) { clearInterval(dlgTimer); dlgTimer = null; }
      return true;
    }
    Sound.sfx('talk');
    dlg.i++;
    if (dlg.i >= dlg.lines.length) {
      const cb = dlg.onDone;
      dlg = null;
      $('dialog').classList.add('hidden');
      document.body.classList.remove('in-dialog');
      if (Game.mode === 'dialog') Game.mode = 'play';
      if (cb) cb();
      return true;
    }
    showLine();
    return true;
  }

  /* ---------------- modal framework ---------------- */
  function openModal(kind, title, html) {
    if (dlg) return false;
    modalKind = kind; modalOpen = true;
    $('modalTitle').innerHTML = title;
    $('modalBody').innerHTML = html;
    $('modalBody').scrollTop = 0;
    const m = $('modal');
    m.dataset.kind = kind;
    m.classList.remove('hidden');
    document.body.classList.add('in-modal');
    if (Game.mode === 'play') Game.mode = 'modal';
    Sound.sfx('menu');
    return true;
  }
  function closeModal(silent) {
    if (!modalOpen) return;
    modalOpen = false; modalKind = null;
    $('modal').classList.add('hidden');
    $('modalBody').innerHTML = '';
    document.body.classList.remove('in-modal');
    if (Game.mode === 'modal') Game.mode = 'play';
    if (!silent) Sound.sfx('menu');
  }
  function modalButtons() { return Array.from(document.querySelectorAll('#modal button:not([disabled])')).filter(b => b.offsetParent !== null); }

  /* ---------------- World Map + fast travel ---------------- */
  function regionStats(z) {
    const reg = D.REGIONS[z], s = Game.state;
    const ids = Array.from(new Set(reg.table.map(e => e[0])));
    D.SPECIAL_SPOTS.forEach(sp => { if (sp.zone === z && ids.indexOf(sp.sp) < 0) ids.push(sp.sp); });
    D.NPCS.forEach(n => { if (n.zone === z && n.join && ids.indexOf(n.join) < 0) ids.unshift(n.join); });
    const caught = ids.filter(id => s.team[id]).length;
    const chests = World.chests.filter(c => !c.removed && c.z === z);
    const opened = chests.filter(c => s.chests[c.key]).length;
    return { ids, caught, total: ids.length, chests: chests.length, opened };
  }
  function openMap() {
    const s = Game.state;
    if (!s || Game.mode === 'battle') return;
    if (!minimap) minimap = Art.renderMinimap(6);
    const pct = (x, y) => 'left:' + ((x + 0.5) / World.W * 100).toFixed(2) + '%;top:' + ((y + 0.5) / World.H * 100).toFixed(2) + '%';
    let labels = '';
    const labelAt = { 1: [60, 74], 2: [26, 66], 3: [94, 66], 4: [24, 44], 5: [94, 41], 6: [25, 17], 7: [95, 17], 8: [59, 23], 9: [60, 50], 10: [44, 105] };
    for (let z = 1; z < D.REGIONS.length; z++) {
      const reg = D.REGIONS[z], st = regionStats(z);
      if (!labelAt[z]) continue;
      const habs = st.ids.map(id => '<img src="' + Art.portraitURL(id) + '" class="' + (s.team[id] ? 'got' : 'nope') + '" alt="" title="' + esc(D.SP[id].name) + '">').join('');
      const [lx, ly] = labelAt[z];
      const done = st.total > 0 && st.caught === st.total;
      labels += '<button class="map-label' + (z === Game.zone ? ' here' : '') + (done ? ' done' : '') + '" data-tp="' + z + '" style="' + pct(lx, ly) + ';--c:' + reg.color + '">' +
        '<span class="ml-t">' + reg.emoji + ' ' + esc(reg.short) + '</span>' + (st.total ? '<span class="ml-c">' + (done ? '✅ ' : '🐾 ') + st.caught + '/' + st.total + '</span>' : '<span class="ml-c">🏡 Home</span>') +
        (habs ? '<span class="ml-h">' + habs + '</span>' : '') + '</button>';
    }
    const me = Game.player;
    labels += '<div class="map-me" style="' + pct(me.x, me.y) + '"><i></i><span>Chuyu</span></div>';
    let list = '';
    const tpz = D.MAIN_REGIONS.concat([9]);
    for (const z of tpz) {
      const reg = D.REGIONS[z], st = regionStats(z);
      const habRow = st.ids.map(id => '<img src="' + Art.portraitURL(id) + '" class="' + (s.team[id] ? 'got' : 'nope') + '" alt="" title="' + esc(D.SP[id].name) + '">').join('');
      const done = st.total > 0 && st.caught === st.total;
      const here = z === Game.zone, atCrystal = here && nearCrystal(z);
      const fresh = reg.isNew && !s.visited[z];
      list += '<button class="map-tp' + (done ? ' done' : '') + (fresh ? ' fresh' : '') + '" data-tp="' + z + '" style="--c:' + reg.color + '"><span class="mt-e">' + reg.emoji + '</span><span class="mt-t"><b>' + (fresh ? '🆕 ' : '') + esc(reg.name) + '</b><small>' +
        (st.total ? (done ? '✅ All ' + st.total + ' Critters caught!' : '🐾 ' + st.caught + '/' + st.total + ' Critters caught') : '🏡 Home sweet home') + ' · ' + (st.chests > 0 && st.opened === st.chests ? '🎁 All ' + st.chests + ' opened! ✨' : '🎁 ' + st.opened + '/' + st.chests) + (s.visited[z] ? ' · ✨ visited' : '') + '</small>' +
        (habRow ? '<span class="mt-h">' + habRow + '</span>' : '') + '</span><span class="mt-go">' + (here ? (atCrystal ? '📍 At Crystal' : '📍 Re-center') : '✨ Teleport') + '</span></button>';
    }
    const caught = Object.keys(s.team).length;
    const ar = (World.W / World.H).toFixed(4);
    const html = '<div class="map-top"><span>📍 Chuyu is in <b>' + esc(D.REGIONS[Game.zone] ? D.REGIONS[Game.zone].name : 'Rainbow Island') + '</b></span><span>📖 ' + caught + '/' + D.SPECIES.length + ' caught · 🎁 ' + Game.openedChests() + '/' + World.chests.length + ' chests</span></div>' +
      '<div class="map-layout"><div class="map-col"><div class="map-wrap" style="--map-ar:' + ar + '"><div class="map-inner" id="mapInner" style="aspect-ratio:' + World.W + ' / ' + World.H + '"><canvas id="mapCanvas" width="' + minimap.width + '" height="' + minimap.height + '"></canvas>' + labels + '</div></div>' +
      '<div class="map-legend">🎁 chest · 💖 healing fountain · 🔮 rainbow crystal · ⭐ rare Critter spot · 🔴 Chuyu · ✅ land complete</div></div>' +
      '<div class="map-regions">' + list + '</div></div>';
    openModal('map', '🗺️ World Map / Fast Travel <small>tap any land to teleport!</small>', html);
    const c = $('mapCanvas'), g = c.getContext('2d');
    g.drawImage(minimap, 0, 0);
    const px = minimap.width / World.W;
    for (const ch of World.chests) {
      if (ch.removed) continue;
      const open = !!s.chests[ch.key];
      g.fillStyle = open ? 'rgba(90,60,30,.45)' : '#ffd84d';
      g.strokeStyle = open ? 'rgba(0,0,0,.2)' : '#7a4a1e'; g.lineWidth = 1.5;
      g.fillRect(ch.x * px - 1, ch.y * px - 1, px + 2, px + 2); g.strokeRect(ch.x * px - 1, ch.y * px - 1, px + 2, px + 2);
    }
    for (const z in World.fountains) { const f = World.fountains[z]; g.fillStyle = '#ff4f9a'; Art.helpers.heart(g, (f.x + f.w / 2) * px, (f.y + f.h / 2) * px + 4, 8); }
    for (const z in World.waypoints) {
      const w = World.waypoints[z], x = (w.x + 0.5) * px, y = (w.y + 0.5) * px;
      g.fillStyle = '#b44dff'; g.strokeStyle = '#fff'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(x, y - 8); g.lineTo(x + 6, y); g.lineTo(x, y + 8); g.lineTo(x - 6, y); g.closePath(); g.fill(); g.stroke();
    }
    for (const sp of World.specials) {
      if (s.team[sp.sp]) continue;
      g.fillStyle = '#fff36b'; g.strokeStyle = '#b8860b'; g.lineWidth = 1.5;
      Art.helpers.star(g, (sp.x + 0.5) * px, (sp.y + 0.5) * px, 8, 3.5, 5); g.fill(); g.stroke();
    }
    $('modalBody').querySelectorAll('[data-tp]').forEach(b => b.addEventListener('click', ev => { ev.stopPropagation(); teleport(+b.dataset.tp); }));
    c.addEventListener('click', ev => {
      const r = c.getBoundingClientRect();
      const tx = Math.floor((ev.clientX - r.left) / r.width * World.W), ty = Math.floor((ev.clientY - r.top) / r.height * World.H);
      const z = World.zoneAt(tx, ty);
      if (z) teleport(z);
    });
  }
  function crystalOf(z) { return z === 9 ? { x: 58, y: 47 } : World.waypoints[z]; }
  function nearCrystal(z) {
    const c = crystalOf(z), p = Game.player;
    return !!c && Math.abs(p.x - c.x) <= 3 && Math.abs(p.y - c.y) <= 3;
  }
  function teleport(z) {
    closeModal(true);
    if (z === Game.zone && nearCrystal(z)) { toast('📍 Chuyu is already at the Rainbow Crystal here!'); return; }
    if (!Game.teleportToRegion(z)) toast('Hmm, the crystal is sleepy. Try again!');
  }

  /* ---------------- CritterDex ---------------- */
  function habitatsOf(id) {
    const out = [];
    for (let z = 1; z < D.REGIONS.length; z++) { const reg = D.REGIONS[z]; if (reg.table.some(e => e[0] === id)) out.push(z); }
    D.SPECIAL_SPOTS.forEach(s => { if (s.sp === id && out.indexOf(s.zone) < 0) out.push(s.zone); });
    D.NPCS.forEach(n => { if (n.join === id && out.indexOf(n.zone) < 0) out.push(n.zone); });
    return out;
  }
  function openDex(focusId) {
    const s = Game.state;
    if (!s || Game.mode === 'battle') return;
    const caught = Object.keys(s.team).length, seen = D.SPECIES.filter(sp => s.seen[sp.id]).length, total = D.SPECIES.length;
    let html = (caught >= total ? '<div class="dex-trophy">🏆 Master Critter Trainer! Chuyu caught all ' + total + '/' + total + ' Critters of Rainbow Island & Honmoon Island! 🌈👑</div>' : '') +
      '<div class="dex-head"><span>📖 <b>' + caught + '/' + total + '</b> caught</span><span>👀 ' + seen + '/' + total + ' seen</span><span>⭐ Partner: <b>' + esc(D.SP[s.partner].name) + '</b></span><span class="dex-tip">Tap 🤝 to choose who follows Chuyu!</span></div><div class="dex-grid">';
    for (const sp of D.SPECIES) {
      const t = s.team[sp.id], seenIt = !!s.seen[sp.id];
      const cls = t ? 'caught' : seenIt ? 'seen' : 'unknown';
      const rare = sp.rarity === 'rare' || sp.rarity === 'legendary';
      const habs = habitatsOf(sp.id).map(z => D.REGIONS[z].emoji).join(' ');
      html += '<div class="dex-card ' + cls + (rare ? ' ' + sp.rarity : '') + '" data-id="' + sp.id + '" style="--c:' + sp.color + '">' +
        '<div class="dex-num">#' + String(sp.num).padStart(2, '0') + '</div>' + (rare ? '<div class="dex-rare">' + D.RARITY[sp.rarity].badge + '</div>' : '') +
        '<div class="dex-img"><img src="' + Art.portraitURL(sp.id) + '" alt="" class="' + (cls === 'unknown' ? 'sil' : '') + '"></div>' +
        '<div class="dex-name">' + (cls === 'unknown' ? '???' : esc(sp.name) + ' ' + sp.emoji) + '</div>' +
        '<div class="dex-info">' + (t ? 'Lv ' + t.lv + ' · HP ' + t.hp + '/' + D.maxHp(sp, t.lv) : seenIt ? '👀 Seen! Lives in ' + habs : '🔍 Lives in ' + habs) + '</div>' +
        (t ? (() => { const mx = D.maxHp(sp, t.lv), need = D.expToNext(t.lv), ep = t.lv >= 50 ? 100 : t.exp / need * 100; return '<div class="dex-bars"><span class="bar"><i style="width:' + (t.hp / mx * 100).toFixed(1) + '%;background:' + hpColor(t.hp / mx) + '"></i></span><span class="bar exp"><i style="width:' + ep.toFixed(1) + '%"></i></span><small>EXP ' + (t.lv >= 50 ? 'MAX' : t.exp + '/' + need) + '</small></div>'; })() : '') +
        (t ? (s.partner === sp.id ? '<span class="dex-partner on">★ Partner</span>' : '<button class="dex-partner" data-partner="' + sp.id + '">🤝 Partner</button>') : '') +
        '</div>';
    }
    html += '</div>';
    openModal('dex', '📖 CritterDex <span class="pill">' + caught + '/' + total + '</span>', html);
    bindDex();
    if (focusId) dexDetail(focusId);
  }
  function bindDex() {
    const body = $('modalBody');
    body.querySelectorAll('[data-partner]').forEach(b => b.addEventListener('click', ev => {
      ev.stopPropagation();
      const id = b.dataset.partner;
      if (Game.setPartner(id)) {
        Sound.sfx('coin');
        toast('⭐ ' + D.SP[id].name + ' ' + D.SP[id].emoji + ' is now Chuyu\'s partner!');
        const sc = body.scrollTop;
        closeModal(true); openDex(); $('modalBody').scrollTop = sc;
      }
    }));
    body.querySelectorAll('.dex-card').forEach(c => c.addEventListener('click', () => dexDetail(c.dataset.id)));
  }
  function dexDetail(id) {
    const s = Game.state, sp = D.SP[id], t = s.team[id], seenIt = !!s.seen[id];
    const known = t || seenIt;
    const habs = habitatsOf(id).map(z => D.REGIONS[z].emoji + ' ' + esc(D.REGIONS[z].name)).join('<br>');
    const spot = D.SPECIAL_SPOTS.find(x => x.sp === id);
    const joiner = D.NPCS.find(n => n.join === id);
    let html = '<div class="dex-detail" style="--c:' + sp.color + '"><button class="dex-back" id="dexBack">◀ All Critters</button>' +
      '<div class="dd-top"><div class="dd-img' + (known ? '' : ' unknown') + '"><img src="' + Art.portraitURL(id) + '" alt="" class="' + (known ? '' : 'sil') + '"></div><div class="dd-info">' +
      '<div class="dd-num">#' + String(sp.num).padStart(2, '0') + ' · ' + D.RARITY[sp.rarity].label + '</div>' +
      '<h3>' + (known ? esc(sp.name) + ' ' + sp.emoji : '???') + '</h3>' +
      '<div class="dd-type">' + D.TYPES[sp.type].emoji + ' ' + D.TYPES[sp.type].name + ' type · ⚡ ' + (known ? esc(sp.move) : '???') + '</div>';
    if (t) {
      const mx = D.maxHp(sp, t.lv), need = D.expToNext(t.lv);
      html += '<div class="dd-stat">Lv <b>' + t.lv + '</b></div>' +
        '<div class="dd-bar"><span>HP ' + t.hp + '/' + mx + '</span><div class="bar"><i style="width:' + (t.hp / mx * 100).toFixed(1) + '%;background:' + hpColor(t.hp / mx) + '"></i></div></div>' +
        '<div class="dd-bar"><span>EXP ' + t.exp + '/' + need + '</span><div class="bar exp"><i style="width:' + (t.lv >= 50 ? 100 : t.exp / need * 100).toFixed(1) + '%"></i></div></div>';
    }
    html += '</div></div><p class="dd-desc">' + (known ? esc(sp.desc) : 'A mysterious Critter! Explore to find it.') + '</p>' +
      '<div class="dd-hab"><b>🏞️ Lives in:</b><br>' + habs + (spot ? '<br>⭐ Always waits at ' + esc(spot.place) + ' until caught!' : '') +
      (joiner ? '<br>🎤 Say hi to ' + esc(joiner.name) + ' on ' + esc(D.REGIONS[joiner.zone].name) + ' — she joins your team!' : '') + '</div>' +
      '<div class="dd-actions">';
    if (t) {
      html += s.partner === id ? '<span class="dex-partner on big">★ Chuyu\'s Partner</span>' : '<button class="big-btn" id="ddPartner">🤝 Make Partner</button>';
      const mx = D.maxHp(sp, t.lv);
      html += '<button class="big-btn green" id="ddFeed"' + (s.inv.berry > 0 && t.hp < mx ? '' : ' disabled') + '>🍓 Feed a Berry (+HP) · x' + s.inv.berry + '</button>';
    }
    html += '</div></div>';
    $('modalBody').innerHTML = html;
    $('modalBody').scrollTop = 0;
    $('dexBack').addEventListener('click', () => { closeModal(true); openDex(); });
    const pb = $('ddPartner');
    if (pb) pb.addEventListener('click', () => { Game.setPartner(id); Sound.sfx('coin'); toast('⭐ ' + sp.name + ' is now Chuyu\'s partner!'); dexDetail(id); });
    const fb = $('ddFeed');
    if (fb) fb.addEventListener('click', () => feedOutside(id, () => dexDetail(id)));
  }
  function feedOutside(id, after) {
    const s = Game.state, t = s.team[id], sp = D.SP[id], mx = D.maxHp(sp, t.lv);
    if (s.inv.berry <= 0 || t.hp >= mx) return;
    s.inv.berry--;
    const before = t.hp;
    t.hp = Math.min(mx, t.hp + Math.max(15, Math.round(mx * 0.5)));
    Sound.sfx('munch');
    toast('🍓 ' + sp.name + ' munched a berry: +' + (t.hp - before) + ' HP!');
    updateHUD(); Game.save('feed');
    if (after) after();
  }

  /* ---------------- Bag & Shop ---------------- */
  function openBag(tab) {
    const s = Game.state;
    if (!s || Game.mode === 'battle') return;
    tab = tab || 'bag';
    if (!modalOpen) openModal('bag', '', '');
    else { modalKind = 'bag'; $('modal').dataset.kind = 'bag'; }
    renderBag(tab);
  }
  function renderBag(tab) {
    const s = Game.state, inv = s.inv;
    $('modalTitle').innerHTML = tab === 'shop' ? '🛒 Capsule & Berry Shop' : '🎒 Bag';
    let html = '<div class="tabs"><button data-tab="bag" class="' + (tab === 'bag' ? 'on' : '') + '">🎒 Bag</button><button data-tab="shop" class="' + (tab === 'shop' ? 'on' : '') + '">🛒 Shop</button><span class="gold-pill">🪙 ' + U.fmt(inv.gold) + '</span></div>';
    if (tab === 'bag') {
      const row = (emoji, name, count, desc, buyable) => '<div class="item-row"><span class="ie">' + emoji + '</span><span class="it"><b>' + name + '</b><small>' + desc + '</small></span><span class="ic">' + count + '</span>' +
        (buyable ? '<button class="mini-btn shop-link" data-tab="shop">🛒 Buy</button>' : '') + '</div>';
      html += row('⭐', 'Star Capsule', '∞', 'Free & unlimited! The trusty everyday capsule.') +
        row('🌈', 'Rainbow Capsule', 'x' + inv.rainbow, 'x2.2 catch rate! Sparkly and super bouncy.', true) +
        row('👑', 'Master Star Capsule', 'x' + inv.master, '100% instant catch — works on ANY Critter!', true) +
        row('🍓', 'Sweet Berry', 'x' + inv.berry, 'Heals your Critter · +45% catch chance in battle.', true) +
        row('🪙', 'Gold', U.fmt(inv.gold), 'Find it in chests 🎁, fruit trees 🌳 and battles.');
      const team = Object.keys(s.team);
      html += '<h4 class="sec">💖 Chuyu\'s Critters (' + team.length + ')</h4><div class="team-list">';
      team.forEach(id => {
        const t = s.team[id], sp = D.SP[id], mx = D.maxHp(sp, t.lv);
        html += '<div class="team-row' + (id === s.partner ? ' partner' : '') + '"><img src="' + Art.portraitURL(id) + '" alt=""><span class="tn"><b>' + esc(sp.name) + ' ' + sp.emoji + (id === s.partner ? ' ★' : '') + '</b><small>Lv ' + t.lv + ' · HP ' + t.hp + '/' + mx + '</small><span class="bar"><i style="width:' + (t.hp / mx * 100).toFixed(1) + '%;background:' + hpColor(t.hp / mx) + '"></i></span></span>' +
          (id === s.partner ? '' : '<button class="mini-btn partner-btn" data-partner="' + id + '">🤝 Partner</button>') +
          '<button class="mini-btn" data-feed="' + id + '"' + (inv.berry > 0 && t.hp < mx ? '' : ' disabled') + '>🍓 Feed</button></div>';
      });
      html += '</div>';
    } else {
      const prod = (id) => {
        const it = D.ITEMS[id];
        const btns = id === 'star' ? '<button class="buy" disabled>Always free!</button>' : it.bundles.map(([n, price]) => {
          const save = it.price * n - price;
          return '<button class="buy' + (inv.gold >= price ? '' : ' poor') + '" data-buy="' + id + '" data-n="' + n + '">Buy ' + n + '<small>🪙 ' + price + '</small>' + (save > 0 ? '<em class="save">save ' + save + '!</em>' : '') + '</button>';
        }).join('');
        return '<div class="shop-row"><span class="ie">' + it.emoji + '</span><span class="it"><b>' + it.name + '</b><small>' + it.desc + '</small><small class="have">You have: ' + (id === 'star' ? '∞' : inv[id]) + '</small></span><span class="sb">' + btns + '</span></div>';
      };
      const chestsLeft = World.chests.filter(c => !c.removed && !Game.chestOpen(c)).length;
      const giftsLeft = D.NPCS.filter(n => n.gift && !s.gifts[n.id]).length;
      const ripe = World.berryTrees.filter(t => !t.removed && Game.treeReady(t)).length;
      html += '<p class="shop-hi">🛒 Penny says: "Welcome! Star Capsules are always free. Bundles save you gold!"</p>' +
        prod('berry') + prod('rainbow') + prod('master') + prod('star') +
        '<p class="shop-tip">💡 Free treasure left on the island: 🎁 <b>' + chestsLeft + '</b> unopened chests · 🎀 <b>' + giftsLeft + '</b> villager gifts · 🌳 <b>' + ripe + '</b> ripe fruit trees! Battles give gold too.</p>';
    }
    $('modalBody').innerHTML = html;
    $('modalBody').querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => { Sound.sfx('menu'); renderBag(b.dataset.tab); }));
    $('modalBody').querySelectorAll('[data-buy]').forEach(b => b.addEventListener('click', () => buy(b.dataset.buy, +b.dataset.n)));
    $('modalBody').querySelectorAll('[data-feed]').forEach(b => b.addEventListener('click', () => feedOutside(b.dataset.feed, () => renderBag('bag'))));
    $('modalBody').querySelectorAll('[data-partner]').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.partner;
      if (Game.setPartner(id)) { Sound.sfx('coin'); toast('⭐ ' + D.SP[id].name + ' ' + D.SP[id].emoji + ' is now Chuyu\'s partner!'); }
      const sc = $('modalBody').scrollTop; renderBag('bag'); $('modalBody').scrollTop = sc;
    }));
  }
  function bundlePrice(id, n) {
    const it = D.ITEMS[id], b = (it.bundles || []).find(x => x[0] === n);
    return b ? b[1] : it.price * n;
  }
  function buy(id, n) {
    const s = Game.state, it = D.ITEMS[id], price = bundlePrice(id, n);
    if (s.inv.gold < price) { toast('Need ' + (price - s.inv.gold) + ' more 🪙 gold! Open chests 🎁 and shake trees 🌳!'); Sound.sfx('error'); return; }
    s.inv.gold -= price; s.inv[id] += n;
    Sound.sfx('buy');
    toast('🛒 Bought ' + n + ' ' + it.emoji + ' ' + it.name + (n > 1 ? 's' : '') + '! Thank you!');
    updateHUD(); Game.save('shop');
    const sc = $('modalBody').scrollTop;
    renderBag('shop');
    $('modalBody').scrollTop = sc;
  }

  /* ---------------- menu ---------------- */
  function savedAgo(ts) {
    if (!ts) return 'not yet';
    const sec = Math.max(0, Math.round((Date.now() - ts) / 1000));
    const clock = new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return (sec < 5 ? 'just now' : sec < 60 ? sec + ' s ago' : Math.round(sec / 60) + ' min ago') + ' (' + clock + ')';
  }
  function fmtTime(ms) { const m = Math.floor(ms / 60000); return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + (m % 60) + ' min'; }
  function openMenu() {
    const s = Game.state;
    if (!s || Game.mode === 'battle') return;
    const st = s.stats;
    const html = '<div class="menu-grid">' +
      '<button class="big-btn" id="mSound">' + (Sound.muted ? '🔇 Sound is OFF — turn on' : '🔊 Sound is ON — turn off') + '</button>' +
      '<button class="big-btn green" id="mSave">💾 Save now</button>' +
      '<button class="big-btn blue" id="mHelp">❓ How to play</button>' +
      '<button class="big-btn red" id="mNew">🔄 New Adventure</button></div>' +
      '<div class="stats-box"><h4>📊 Chuyu\'s Adventure</h4><ul>' +
      '<li>🐾 Critters caught: <b>' + Object.keys(s.team).length + '/' + D.SPECIES.length + '</b></li>' +
      '<li>🎁 Chests opened: <b>' + Game.openedChests() + '/' + World.chests.length + '</b></li>' +
      '<li>⚔️ Battles: <b>' + st.battles + '</b> · ⭐ Level-ups: <b>' + st.levelUps + '</b></li>' +
      '<li>👣 Steps: <b>' + U.fmt(st.steps) + '</b> · ⏱️ Play time: <b>' + fmtTime(st.playMs) + '</b></li>' +
      '<li>🗺️ Lands visited: <b>' + D.MAIN_REGIONS.filter(z => s.visited[z]).length + '/' + D.MAIN_REGIONS.length + '</b></li>' +
      '<li>💾 Last saved: <b id="mSavedAt">' + savedAgo(s.saved) + '</b></li></ul></div>';
    openModal('menu', '⚙️ Menu', html);
    $('mSound').addEventListener('click', () => { toggleMute(); closeModal(true); openMenu(); });
    $('mSave').addEventListener('click', () => { if (Game.save('manual')) { toast('💾 Adventure saved!'); const el = $('mSavedAt'); if (el) el.textContent = savedAgo(Game.state.saved); } });
    $('mHelp').addEventListener('click', openHelp);
    $('mNew').addEventListener('click', confirmNew);
  }
  function openHelp() {
    const html = '<div class="help">' +
      '<h4>🚶 Walking</h4><p>Tap or click anywhere on the map and Chuyu walks there! Tap a 🎁 chest, 🌳 tree, 🧑 friend, 🔮 crystal or 🐾 Critter to use it. Or use the <b>▲▼◄►</b> pad / arrow keys / WASD.</p>' +
      '<h4>🅰️ A button</h4><p>Talk, open, shake, catch! (Keys: Enter, Space or Z)</p>' +
      '<h4>🅱️ B button</h4><p>⚡ Roller-skate dash on/off! (Keys: B or X · hold Shift)</p>' +
      '<h4>🐾 Catching Critters</h4><p>Walk into a wild Critter or rustle through tall grass. In battle:<br>1️⃣ ⚡ Attack — makes them dizzy (never knocks them out!)<br>2️⃣ 🎯 Throw Capsule — catch them!<br>3️⃣ 🍓 Feed Treat — heals your Critter and +45% catch chance<br>4️⃣ 🔄 Switch / 🏃 Run</p>' +
      '<h4>🎤 Honmoon Island</h4><p>Walk out of Sunshine Village\'s south gate and cross the Golden Honmoon Bridge! Say hi to Rumi, Mira and Zoey — they join your team. Tap the 🍜 Ramen Shop to heal, and find Gwi-Ma at the Demon Gate!</p>' +
      '<h4>🗺️ Map (M) · 📖 Dex (C) · 🎒 Bag (I)</h4><p>Teleport to any land, choose your partner, and shop for capsules. Your adventure saves automatically! 💾</p></div>';
    openModal('help', '❓ How to Play', html);
  }
  function confirmNew() {
    const html = '<div class="confirm"><p>🔄 Start a brand-new adventure?</p><p class="warn">All caught Critters, chests and items will be erased!</p>' +
      '<button class="big-btn red" id="cYes">Yes, start over</button><button class="big-btn green" id="cNo">No, keep playing! 🎉</button></div>';
    openModal('confirm', '🔄 New Adventure', html);
    $('cYes').addEventListener('click', () => Game.newAdventure());
    $('cNo').addEventListener('click', () => closeModal());
  }

  /* ---------------- title & starters ---------------- */
  function showTitle(cb) {
    titleCb = cb;
    const box = $('starters');
    box.innerHTML = ['dogday', 'catnap', 'hoppy'].map((id, k) => {
      const sp = D.SP[id];
      return '<button class="starter" data-id="' + id + '" style="--c:' + sp.color + '"><span class="sk">' + (k + 1) + '</span><img src="' + Art.portraitURL(id) + '" alt=""><b>' + esc(sp.name) + ' ' + sp.emoji + '</b><small>⚡ ' + esc(sp.move) + '</small><em>' + esc(sp.desc) + '</em></button>';
    }).join('');
    box.querySelectorAll('.starter').forEach(b => b.addEventListener('click', () => pickStarter(b.dataset.id)));
    $('title').classList.remove('hidden');
    document.body.classList.add('at-title');
    Sound.music('title');
  }
  function pickStarter(id) {
    if (!titleCb || !D.SP[id]) return;
    const cb = titleCb;
    titleCb = null;
    Sound.unlock();
    Sound.sfx('gotcha');
    $('title').classList.add('hidden');
    document.body.classList.remove('at-title');
    confettiBurst(90);
    cb(id);
  }

  /* ---------------- GOTCHA celebration ---------------- */
  function celebrate(info, onClose) {
    celebrating = { onClose, spId: info.sp.id };
    const total = D.SPECIES.length;
    const pb = $('celePartner');
    const canPartner = Game.state && Game.state.partner !== info.sp.id && Game.state.team[info.sp.id];
    pb.classList.toggle('hidden', !canPartner);
    pb.textContent = '🐾 Make ' + info.sp.name + ' my partner!';
    $('celeImg').src = Art.portraitURL(info.sp.id);
    $('celeCard').style.setProperty('--c', info.sp.color);
    const ct = document.querySelector('#celeCard .cele-title');
    if (ct) ct.textContent = info.joined ? '🎤 NEW FRIEND! 🎤' : '✨ GOTCHA! ✨';
    $('celeName').textContent = info.joined ? info.sp.name + ' joined your team! ' + info.sp.emoji : 'Caught ' + info.sp.name + '! ' + info.sp.emoji;
    const lines = [];
    lines.push(info.isNew ? '📖 New CritterDex entry #' + String(info.sp.num).padStart(2, '0') + '!  (' + info.count + '/' + total + ' caught)' : '💞 ' + info.sp.name + ' is already your friend — friendship bonus EXP!');
    if (info.joined) {
      lines.push('⭐ ' + info.sp.name + ' joins at Lv ' + info.lv + ' with the move ' + info.sp.move + '!');
      lines.push('💜 Battle demons together and make them your friends too!');
    } else {
      lines.push('⭐ +' + info.gain + ' EXP for your whole team!');
      lines.push('🪙 +' + info.gold + ' gold');
    }
    info.ups.forEach(([id, lv]) => lines.push('🎉 ' + D.SP[id].name + ' grew to Lv ' + lv + '!'));
    const isMaster = info.count >= total;
    if (isMaster) lines.push('🏆 WOW! Chuyu caught ALL ' + total + ' Critters! CritterDex complete! 🏆');
    const trophyHtml = isMaster ? '<div class="cele-trophy">🏆 Master Critter Trainer! Chuyu caught all ' + total + ' Critters! 🌈👑</div>' : '';
    $('celeLines').innerHTML = trophyHtml + lines.map(l => '<li>' + esc(l) + '</li>').join('');
    $('celebrate').classList.remove('hidden');
    confettiBurst(isMaster ? 260 : 140);
    if (info.ups.length) setTimeout(() => Sound.sfx('levelup'), 900);
    setTimeout(() => { try { $('celeOk').focus({ preventScroll: true }); } catch (e) { /* ignore */ } }, 50);
  }
  function closeCelebrate() {
    if (!celebrating) return;
    const cb = celebrating.onClose;
    celebrating = null;
    $('celebrate').classList.add('hidden');
    Sound.sfx('menu');
    if (cb) cb();
  }

  /* ---------------- confetti fx ---------------- */
  function confettiBurst(n) {
    const w = window.innerWidth, h = window.innerHeight;
    for (let i = 0; i < n; i++) {
      confetti.push({ x: w / 2 + (Math.random() - 0.5) * w * 0.25, y: h * 0.4, vx: (Math.random() - 0.5) * 900, vy: -250 - Math.random() * 600, g: 900, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 14, w: 6 + Math.random() * 8, h: 4 + Math.random() * 6, c: 'hsl(' + ((Math.random() * 360) | 0) + ',95%,62%)', t: 0, life: 2 + Math.random() * 1.4, star: Math.random() < 0.25 });
    }
  }
  function updateFx(dt) {
    if (!confetti.length) { if (fxDirty) { fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight); fxDirty = false; } return; }
    fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    fxDirty = true;
    for (let i = confetti.length - 1; i >= 0; i--) {
      const p = confetti[i];
      p.t += dt; p.vy += p.g * dt; p.vx *= 0.99; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      if (p.t > p.life || p.y > window.innerHeight + 40) { confetti.splice(i, 1); continue; }
      fxCtx.save();
      fxCtx.globalAlpha = Math.min(1, (p.life - p.t) * 2);
      fxCtx.translate(p.x, p.y); fxCtx.rotate(p.rot);
      fxCtx.fillStyle = p.c;
      if (p.star) { Art.helpers.star(fxCtx, 0, 0, p.w * 0.8, p.w * 0.35, 5); fxCtx.fill(); } else fxCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      fxCtx.restore();
    }
  }

  /* ---------------- keyboard routing ---------------- */
  function handleKey(e) {
    const k = e.key;
    if (celebrating) {
      const pb = $('celePartner'), ok = $('celeOk');
      if (k.startsWith('Arrow') && !pb.classList.contains('hidden')) { e.preventDefault(); (document.activeElement === ok ? pb : ok).focus(); return true; }
      if (k === 'Enter' || k === ' ') { e.preventDefault(); if (!e.repeat) { if (document.activeElement === pb && !pb.classList.contains('hidden')) pb.click(); else closeCelebrate(); } return true; }
      if (k === 'Escape') { e.preventDefault(); if (!e.repeat) closeCelebrate(); }
      return true;
    }
    if (titleCb) {
      if (k === '1' || k === '2' || k === '3') { pickStarter(['dogday', 'catnap', 'hoppy'][+k - 1]); return true; }
      if (k.startsWith('Arrow')) {
        e.preventDefault();
        const bs = Array.from(document.querySelectorAll('#starters .starter'));
        let i = bs.indexOf(document.activeElement);
        i = i < 0 ? 0 : (k === 'ArrowLeft' || k === 'ArrowUp') ? Math.max(0, i - 1) : Math.min(bs.length - 1, i + 1);
        bs[i].focus();
      }
      return true;
    }
    if (dlg) {
      if (k === 'Enter' || k === ' ' || k === 'z' || k === 'Z' || k === 'Escape') { e.preventDefault(); if (!e.repeat) advanceDialog(); }
      return true;
    }
    if (modalOpen) {
      if (k === 'Escape') { e.preventDefault(); closeModal(); return true; }
      if ((k === 'm' || k === 'M') && modalKind === 'map') { closeModal(); return true; }
      if ((k === 'c' || k === 'C') && modalKind === 'dex') { closeModal(); return true; }
      if ((k === 'i' || k === 'I' || k === 'e' || k === 'E') && modalKind === 'bag') { closeModal(); return true; }
      if (k.startsWith('Arrow')) {
        e.preventDefault();
        const bs = modalButtons();
        if (!bs.length) return true;
        let i = bs.indexOf(document.activeElement);
        i = i < 0 ? 0 : (k === 'ArrowLeft' || k === 'ArrowUp') ? Math.max(0, i - 1) : Math.min(bs.length - 1, i + 1);
        bs[i].focus();
        try { bs[i].scrollIntoView({ block: 'nearest' }); } catch (er) { /* ignore */ }
      }
      return true;
    }
    return false;
  }

  return {
    init, hideLoading, updateHUD, flashSave, toast, banner, flashScreen, dialog, advanceDialog,
    openMap, openDex, openBag, openMenu, closeModal, showTitle, pickStarter, celebrate, closeCelebrate, confettiBurst, updateFx, handleKey,
    get modalOpen() { return modalOpen; }, get modalKind() { return modalKind; }, get dialogOpen() { return !!dlg; }, get celebrating() { return !!celebrating; },
  };
})();
