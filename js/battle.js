'use strict';
/* ==========================================================================
 * Battle: kid-friendly Pokemon-style catching battles.
 *  - Mercy Catch Rule: attacks never drop a wild Critter below 1 HP.
 *  - Catch chance = min(1, baseRate * hpBonus * capsuleMult + (fed ? 0.45 : 0))
 *    hpBonus = 1 + (1 - (hp-1)/(max-1))  -> 1.0 at full HP, 2.0 when Dizzy (1 HP)
 *    Star x1.0 (free, unlimited), Rainbow x2.2, Master = 100%.
 * ========================================================================== */
const Battle = (() => {
  const D = CQData;
  let el = null, cv = null, ctx = null;
  let active = false, covering = false, st = null, busy = false, sub = null, forced = false;
  let tweens = [], parts = [], effects = [];
  let time = 0, W = 300, H = 300, dpr = 1, cardsKey = '';
  const $ = id => document.getElementById(id);

  function bind() {
    el = $('battle'); cv = $('battleCanvas'); ctx = cv.getContext('2d');
    $('bActions').addEventListener('click', e => { const b = e.target.closest('button[data-act]'); if (b && !b.disabled) act(b.dataset.act); });
    $('bSub').addEventListener('click', e => { const b = e.target.closest('button[data-sub]'); if (b && !b.disabled) subAct(b.dataset.sub, b.dataset.arg); });
    window.addEventListener('resize', () => { if (active) sizeCanvas(); });
  }
  function sizeCanvas() {
    const r = cv.parentElement.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(120, r.width); H = Math.max(120, r.height);
    cv.width = Math.floor(W * dpr); cv.height = Math.floor(H * dpr);
  }
  function tween(dur, fn) { return new Promise(res => tweens.push({ t: 0, dur: Math.max(0.001, dur), fn, res })); }
  function wait(s) { return tween(s, null); }
  function say(text) { const m = $('bMsg'); if (m) m.textContent = text; }
  function pick(a) { return a[(Math.random() * a.length) | 0]; }

  function mineFrom(id) { return { id, sp: D.SP[id], t: Game.state.team[id], scale: 1, shake: 0, flash: 0, dx: 0, dy: 0 }; }
  function wildPos() { return { x: W * 0.68, y: H * 0.36, r: Math.max(26, Math.min(W * 0.15, H * 0.2)) }; }
  function minePos() { return { x: W * 0.28, y: H * 0.7, r: Math.max(22, Math.min(W * 0.115, H * 0.16)) }; }

  function chance(capsule) {
    if (!st) return 0;
    const w = st.wild;
    if (capsule === 'master') return 1;
    const hpBonus = 1 + (1 - (w.hp - 1) / Math.max(1, w.max - 1));
    const mult = D.ITEMS[capsule || 'star'].mult;
    return Math.min(1, w.sp.rate * hpBonus * mult + (w.fed ? 0.45 : 0));
  }

  function open(opts) {
    if (!el) bind();
    const s = Game.state;
    if (!Object.keys(s.team).some(id => s.team[id].hp > 0)) Game.healAll();
    let pid = s.partner;
    if (s.team[pid].hp <= 0) pid = Object.keys(s.team).find(id => s.team[id].hp > 0);
    const sp = D.SP[opts.sp], max = D.maxHp(sp, opts.lv);
    st = { zone: opts.zone, entity: opts.entity, wild: { sp, lv: opts.lv, hp: max, max, shown: max, fed: false, dizzy: false, scale: 0, alpha: 1, shake: 0, flash: 0, dx: 0, dy: 0, visible: true }, mine: mineFrom(pid), capsule: null, berry: null };
    st.mine.scale = 0; st.mine.shown = st.mine.t.hp;
    if (pid !== s.partner) Game.setPartner(pid);
    active = true; covering = true; busy = true; sub = null; forced = false; tweens = []; parts = []; effects = []; cardsKey = '';
    el.classList.remove('hidden');
    document.body.classList.add('in-battle');
    sizeCanvas();
    closeSub(true);
    setEnabled(false);
    renderCards(true);
    Sound.music(sp.id === 'gwima' ? 'boss' : 'battle', true);
    const rare = sp.rarity === 'rare' || sp.rarity === 'legendary';
    say(sp.id === 'gwima' ? '👹 WHOA! Gwi-Ma the demon king appeared! Let\'s turn that grumpy grin into a happy one! 💜'
      : (rare ? '✨ WOW! ' : '') + 'A wild ' + sp.name + ' ' + sp.emoji + ' appeared!' + (rare ? ' (' + D.RARITY[sp.rarity].label + ')' : ''));
    (async () => {
      await tween(0.55, k => { st.wild.scale = U.easeOutBack(k); st.mine.scale = U.easeOutBack(k); });
      if (rare) burst(wildPos().x, wildPos().y, 'stars', '#ffd23b', '#ffffff', 22);
      await wait(0.6);
      if (!active) return;
      say('Go, ' + st.mine.sp.name + '! ' + st.mine.sp.emoji + '  What will Chuyu do?');
      unbusy();
    })();
  }
  function unbusy() { if (!active) return; busy = false; setEnabled(true); focusFirst(); }
  function setEnabled(on) {
    document.querySelectorAll('#bActions button').forEach(b => { b.disabled = !on; });
    document.querySelectorAll('#bSub button').forEach(b => { if (!on) b.disabled = true; else b.disabled = b.dataset.dis === '1'; });
  }
  function visibleButtons() {
    const box = sub ? $('bSub') : $('bActions');
    return Array.from(box.querySelectorAll('button')).filter(b => !b.disabled);
  }
  function focusFirst() {
    const b = visibleButtons()[0];
    if (b && window.matchMedia && window.matchMedia('(hover: hover)').matches) { try { b.focus({ preventScroll: true }); } catch (e) { b.focus(); } }
  }
  function hpColor(r) { return r > 0.5 ? '#4cd964' : r > 0.2 ? '#ffcc00' : '#ff3b30'; }
  function renderCards(force) {
    if (!st) return;
    const w = st.wild, m = st.mine, s = Game.state;
    const mMax = D.maxHp(m.sp, m.t.lv);
    w.shown += (w.hp - w.shown) * 0.2; if (Math.abs(w.hp - w.shown) < 0.3) w.shown = w.hp;
    m.shown += (m.t.hp - m.shown) * 0.2; if (Math.abs(m.t.hp - m.shown) < 0.3) m.shown = m.t.hp;
    const pct = Math.round(chance('star') * 100);
    const key = [w.sp.id, w.lv, Math.round(w.shown), w.fed, w.dizzy, m.id, m.t.lv, Math.round(m.shown), m.t.exp, s.inv.berry, s.inv.rainbow, s.inv.master, s.inv.gold, pct].join('|');
    if (!force && key === cardsKey) return;
    cardsKey = key;
    const caught = !!s.team[w.sp.id];
    $('bwName').textContent = w.sp.name + ' ' + w.sp.emoji;
    $('bwLv').textContent = 'Lv ' + w.lv;
    const badge = $('bwBadge');
    badge.textContent = D.RARITY[w.sp.rarity].badge || (caught ? '✔ Caught' : 'NEW!');
    badge.className = 'b-badge ' + (w.sp.rarity === 'legendary' ? 'legend' : w.sp.rarity === 'rare' ? 'rare' : caught ? 'have' : 'new');
    const wr = w.shown / w.max;
    $('bwHp').style.width = (wr * 100).toFixed(1) + '%'; $('bwHp').style.background = hpColor(wr);
    $('bwHpTxt').textContent = 'HP ' + Math.ceil(w.shown) + '/' + w.max;
    $('bwStatus').textContent = w.dizzy ? '💫 Dizzy & Ready to Catch! 🎯' : w.fed ? '💕 Happy! (+45%)' : '';
    $('bwCatch').style.width = pct + '%';
    $('bwCatchTxt').textContent = '🎯 Catch Chance ' + pct + '%';
    $('bmName').textContent = m.sp.name + ' ' + m.sp.emoji;
    $('bmLv').textContent = 'Lv ' + m.t.lv;
    const mr = m.shown / mMax;
    $('bmHp').style.width = (mr * 100).toFixed(1) + '%'; $('bmHp').style.background = hpColor(mr);
    $('bmHpTxt').textContent = 'HP ' + Math.ceil(m.shown) + '/' + mMax;
    $('bmExp').style.width = (m.t.lv >= 50 ? 100 : (m.t.exp / D.expToNext(m.t.lv) * 100)).toFixed(1) + '%';
    $('bMoveName').textContent = w.dizzy ? (caught ? '🏁 Finish Battle (Nap & EXP) 💤' : 'Already Dizzy (1 HP) — Toss 🎯!') : m.sp.move + ' ' + D.TYPES[m.sp.type].emoji;
    const full = m.t.hp >= mMax;
    const bc = s.inv.berry > 0 ? '(x' + s.inv.berry + ')' : s.inv.gold >= D.ITEMS.berry.price ? '(🪙 ' + D.ITEMS.berry.price + ' Quick-Buy)' : '(x0)';
    $('bFeedInfo').textContent = w.fed ? (full ? '💕 Already +45% & Full HP! ' + bc : '💕 Already +45%! · Heal +HP ' + bc) : '+HP & +45% Catch Rate! ' + bc;
    const rbTxt = s.inv.rainbow > 0 ? 'x' + s.inv.rainbow : s.inv.gold >= D.ITEMS.rainbow.price ? '🪙' + D.ITEMS.rainbow.price : 'x0';
    $('bCatchInfo').textContent = '⭐ ' + pct + '% (∞) · 🌈 ' + Math.round(chance('rainbow') * 100) + '% (' + rbTxt + ')' + (s.inv.master ? ' · 👑 100% (x' + s.inv.master + ')' : '');
  }

  /* ---------------- menus ---------------- */
  function act(a) {
    if (busy || !active || sub) return;
    Sound.sfx('menu');
    if (a === 'attack') doAttack();
    else if (a === 'catch') openSub('catch');
    else if (a === 'feed') doFeed();
    else if (a === 'switch') openSub('switch');
  }
  function openSub(kind) {
    sub = kind;
    const s = Game.state, box = $('bSub');
    let html = '', n = 1;
    if (kind === 'catch') {
      html += '<div class="sub-title">🎯 Pick a capsule to throw!</div>';
      for (const id of ['star', 'rainbow', 'master']) {
        const it = D.ITEMS[id];
        const empty = id !== 'star' && s.inv[id] <= 0;
        const quick = empty && s.inv.gold >= it.price;
        const dis = empty && !quick;
        const have = id === 'star' ? '∞ Free' : quick ? '🪙 ' + it.price + ' Quick-Buy' : 'x' + s.inv[id];
        const tag = id === 'star' ? 'Always free & unlimited!' : id === 'rainbow' ? 'x2.2 Catch Rate' : '100% Instant Catch!';
        html += '<button class="sbtn cap-' + id + (quick ? ' quick' : '') + '" data-sub="throw" data-arg="' + id + '" data-dis="' + (dis ? 1 : 0) + '"' + (dis ? ' disabled' : '') + '>' +
          '<span class="k">' + (n++) + '</span><b>' + it.emoji + ' ' + it.name + ' [' + have + ']</b><small>' + tag + ' · 🎯 ' + Math.round(chance(id) * 100) + '%' +
          (quick ? " · buys 1 from Penny's Express 🛒" : dis ? ' · need 🪙 ' + it.price + ' (you have ' + s.inv.gold + ')' : '') + '</small></button>';
      }
    } else {
      html += '<div class="sub-title">' + (forced ? '💤 Pick a Critter friend to help!' : '🔄 Switch Critter or 🏃 Run') + '</div><div class="sub-team">';
      const ids = Object.keys(s.team).filter(id => id !== st.mine.id);
      if (!ids.length) html += '<div class="sub-empty">No other Critters yet — catch more friends! 🐾</div>';
      ids.forEach(id => {
        const t = s.team[id], sp = D.SP[id], mx = D.maxHp(sp, t.lv), dis = t.hp <= 0;
        html += '<button class="sbtn team" data-sub="switch" data-arg="' + id + '" data-dis="' + (dis ? 1 : 0) + '"' + (dis ? ' disabled' : '') + '>' +
          '<img src="' + Art.portraitURL(id) + '" alt=""><span class="tn"><b>' + sp.name + ' ' + sp.emoji + '</b><small>Lv ' + t.lv + ' · ' + (dis ? '💤 Sleepy' : 'HP ' + t.hp + '/' + mx) + '</small></span></button>';
      });
      html += '</div>';
      if (!forced) {
        if (st.wild.dizzy) html += '<button class="sbtn finish" data-sub="finish"><span class="k">F</span><b>🏁 Finish Battle</b><small>Wave bye-bye · +EXP & gold (no catch)</small></button>';
        html += '<button class="sbtn run" data-sub="run"><span class="k">R</span><b>🏃 Run</b><small>Friendly wave goodbye 👋</small></button>';
      }
    }
    if (!forced) html += '<button class="sbtn back" data-sub="back"><b>◀ Back</b></button>';
    box.innerHTML = html;
    box.classList.remove('hidden');
    $('bActions').classList.add('hidden');
    if (!busy) setEnabled(true);
    focusFirst();
  }
  function closeSub(silent) {
    sub = null;
    $('bSub').classList.add('hidden');
    $('bSub').innerHTML = '';
    $('bActions').classList.remove('hidden');
    if (!silent) focusFirst();
  }
  function subAct(kind, arg) {
    if (busy || !active) return;
    Sound.sfx('menu');
    if (kind === 'back') { closeSub(); return; }
    closeSub(true);
    if (kind === 'throw') doThrow(arg);
    else if (kind === 'switch') doSwitch(arg);
    else if (kind === 'run') doRun();
    else if (kind === 'finish') doFinish();
  }

  /* ---------------- actions ---------------- */
  async function doAttack() {
    const s = Game.state, m = st.mine, w = st.wild;
    if (w.hp <= 1) {
      if (s && s.team[w.sp.id]) {
        // Already caught and dizzy: peaceful Finish Battle with EXP & gold!
        doFinish();
        return;
      }
      // Mercy Catch Rule: a Dizzy Critter can't be hurt, so don't waste a turn - go straight to catching!
      w.shake = 0.5;
      say('💫 ' + w.sp.name + ' is already Dizzy (1 HP)! Pick a capsule to catch it! 🎯');
      openSub('catch');
      return;
    }
    busy = true; setEnabled(false);
    say(m.sp.name + ' used ' + m.sp.move + '! ' + D.TYPES[m.sp.type].emoji);
    Sound.sfx('attack', m.sp.type);
    await tween(0.18, k => { m.dx = Math.sin(k * Math.PI) * 18; m.dy = -Math.sin(k * Math.PI) * 10; });
    m.dx = 0; m.dy = 0;
    await projectile(m.sp.type, minePos(), wildPos(), 0.7);
    if (!active) return;
    if (w.hp <= 1) {
      w.shake = 0.6;
      say(w.sp.name + ' is already Dizzy! 💫 Throw a capsule now! 🎯');
      await wait(1.1);
    } else {
      const dmg = Math.max(1, Math.round(D.attackPower(m.sp, m.t.lv) * (0.85 + Math.random() * 0.3)));
      w.hp = Math.max(1, w.hp - dmg); // Mercy Catch Rule: never below 1 HP
      w.shake = 1; w.flash = 1;
      Sound.sfx('hit');
      await wait(0.55);
      if (w.hp === 1) {
        w.dizzy = true;
        burst(wildPos().x, wildPos().y - wildPos().r, 'stars', '#ffe066', '#ffffff', 12);
        say(w.sp.name + ' is Dizzy & Ready to Catch! 🎯 (Catch chance doubled!)');
      } else say('Bonk! ' + w.sp.name + ' got a little dizzy! 💫 Catch chance went up!');
      await wait(1.0);
    }
    if (!active) return;
    await wildTurn();
    if (!active || forced) return;
    say('What will ' + st.mine.sp.name + ' do?');
    unbusy();
  }
  function failWiggles(p) { const r = Math.random(); return p > 0.6 ? (r < 0.55 ? 2 : 1) : p > 0.3 ? (r < 0.35 ? 2 : r < 0.8 ? 1 : 0) : (r < 0.2 ? 2 : r < 0.55 ? 1 : 0); }
  async function doThrow(kind) {
    const s = Game.state, it = D.ITEMS[kind];
    if (kind !== 'star' && s.inv[kind] <= 0) {
      if (s.inv.gold < it.price) { say('No ' + it.name + 's left and not enough 🪙 gold! Try a free ⭐ Star Capsule.'); Sound.sfx('error'); return; }
      s.inv.gold -= it.price; s.inv[kind] += 1;
      Sound.sfx('buy');
      UI.toast("🛒 Penny's Express: bought 1 " + it.emoji + ' ' + it.name + ' for 🪙 ' + it.price + '!');
      UI.updateHUD();
    }
    busy = true; setEnabled(false);
    if (kind !== 'star') { s.inv[kind]--; UI.updateHUD(); }
    const p = chance(kind);
    const success = kind === 'master' || Math.random() < p;
    say('Chuyu threw a ' + it.emoji + ' ' + it.name + '!  (🎯 ' + Math.round(p * 100) + '%)');
    Sound.sfx('throw');
    const wp = wildPos(), s0 = { x: W * 0.1, y: H * 0.98 };
    const cap = st.capsule = { x: s0.x, y: s0.y, rot: 0, kind, r: Math.max(13, wp.r * 0.3), open: 0, glow: 0 };
    const topY = wp.y - wp.r * 0.15;
    await tween(0.7, k => { cap.x = U.lerp(s0.x, wp.x, k); cap.y = U.lerp(s0.y, topY, k) - Math.sin(k * Math.PI) * H * 0.3; cap.rot = k * Math.PI * 4; });
    if (!active) return;
    cap.open = 1; cap.rot = 0;
    Sound.sfx('pop');
    burst(wp.x, wp.y, 'spark', '#ffffff', '#fff6b0', 16);
    await tween(0.35, k => { st.wild.scale = 1 - k; st.wild.flash = 1; });
    st.wild.visible = false; st.wild.flash = 0;
    cap.open = 0;
    const groundY = wp.y + wp.r * 0.72;
    await tween(0.32, k => { cap.y = U.lerp(topY, groundY, U.easeIn(k)); });
    await tween(0.2, k => { cap.y = groundY - Math.sin(k * Math.PI) * 14; });
    const wig = success ? 3 : failWiggles(p);
    for (let i = 0; i < wig; i++) {
      await wait(kind === 'master' ? 0.12 : 0.3);
      Sound.sfx('wiggle');
      await tween(kind === 'master' ? 0.26 : 0.44, k => { cap.rot = Math.sin(k * Math.PI * 2) * 0.5; });
      cap.rot = 0;
    }
    await wait(0.35);
    if (!active) return;
    if (success) {
      Sound.sfx('click');
      cap.glow = 1;
      burst(cap.x, cap.y, 'stars', '#ffd23b', '#ffffff', 24);
      say('✨ GOTCHA! ' + st.wild.sp.name + ' was caught! ✨');
      await wait(0.9);
      const info = registerCatch();
      Sound.sfx('gotcha');
      Sound.jingle('victory', (D.REGIONS[st.zone] || D.REGIONS[9]).music);
      UI.celebrate(info, () => end('caught'));
    } else {
      Sound.sfx('pop');
      burst(cap.x, cap.y, 'spark', '#ffffff', '#ffb3c7', 14);
      st.capsule = null;
      st.wild.visible = true;
      await tween(0.3, k => { st.wild.scale = U.easeOutBack(k); });
      const n = st.wild.sp.name;
      say(pick(['Oh no! ' + n + ' popped out! So close! 😮', 'Aww! ' + n + ' wiggled free! Try again! 💨', n + ' hopped out! Tip: feed a 🍓 berry first!']));
      await wait(1.2);
      if (!active) return;
      await wildTurn();
      if (!active || forced) return;
      say('What will ' + st.mine.sp.name + ' do?');
      unbusy();
    }
  }
  function registerCatch() {
    const s = Game.state, w = st.wild, id = w.sp.id;
    const isNew = !s.team[id];
    const gain = 8 + w.lv * 3;
    const ups = [];
    if (isNew) s.team[id] = { lv: w.lv, exp: 0, hp: D.maxHp(w.sp, w.lv), caught: Date.now() };
    for (const tid of Object.keys(s.team)) {
      if (isNew && tid === id) continue;
      const n = Game.addExp(tid, gain);
      if (n) { const e = ups.find(u => u[0] === tid); if (e) e[1] = s.team[tid].lv; else ups.push([tid, s.team[tid].lv]); }
    }
    const gold = 15 + w.lv;
    s.inv.gold += gold;
    s.seen[id] = true;
    s.stats.caught++;
    UI.updateHUD();
    Game.save('catch');
    return { sp: w.sp, lv: w.lv, isNew, gain, gold, ups, count: Object.keys(s.team).length };
  }
  async function doFeed() {
    const s = Game.state, w = st.wild, m = st.mine;
    if (w.fed && m.t.hp >= D.maxHp(m.sp, m.t.lv)) {
      say('💕 ' + w.sp.name + ' is already happy (+45%) and ' + m.sp.name + ' is at full HP! Toss a 🎯 Capsule!');
      openSub('catch');
      return;
    }
    if (s.inv.berry <= 0) {
      const price = D.ITEMS.berry.price;
      if (s.inv.gold < price) { say('No 🍓 berries and not enough 🪙 gold! Shake fruit trees 🌳 after this battle.'); Sound.sfx('error'); return; }
      s.inv.gold -= price; s.inv.berry += 1;
      Sound.sfx('buy');
      UI.toast("🛒 Penny's Express: bought 1 🍓 Sweet Berry for 🪙 " + price + '!');
    }
    busy = true; setEnabled(false);
    s.inv.berry--; UI.updateHUD();
    const wp = wildPos(), mp = minePos();
    say('Chuyu tossed a 🍓 Sweet Berry to ' + w.sp.name + '!');
    Sound.sfx('throw');
    st.berry = { x: mp.x, y: mp.y };
    await tween(0.6, k => { st.berry.x = U.lerp(mp.x, wp.x, k); st.berry.y = U.lerp(mp.y - mp.r, wp.y, k) - Math.sin(k * Math.PI) * H * 0.22; });
    st.berry = null;
    if (!active) return;
    Sound.sfx('munch');
    const was = w.fed;
    w.fed = true;
    burst(wp.x, wp.y - wp.r * 0.6, 'hearts', '#ff5c8a', '#ffc2d6', 14);
    await wait(0.5);
    const mx = D.maxHp(m.sp, m.t.lv);
    const before = m.t.hp;
    m.t.hp = Math.min(mx, m.t.hp + Math.max(15, Math.round(mx * 0.5)));
    burst(mp.x, mp.y - mp.r * 0.6, 'hearts', '#ff5c8a', '#ffc2d6', 8);
    Sound.sfx('heal');
    say(w.sp.name + ' loves it! 💕 ' + (was ? 'Still super happy!' : 'Catch chance +45%!') + '  ' + m.sp.name + ' had one too: +' + (m.t.hp - before) + ' HP!');
    await wait(1.5);
    if (!active) return;
    await wildTurn();
    if (!active || forced) return;
    say('What will ' + st.mine.sp.name + ' do?');
    unbusy();
  }
  async function wildTurn() {
    const w = st.wild, m = st.mine;
    const calm = w.fed ? 0.7 : w.dizzy ? 0.85 : 0.35;
    if (Math.random() < calm) {
      const lines = w.dizzy ? [w.sp.name + ' is seeing stars! 💫', w.sp.name + ' wobbles around dizzily... 😵'] : w.fed ? [w.sp.name + ' does a happy dance! 💃', w.sp.name + ' munches happily! 😋'] : [w.sp.name + ' watches Chuyu curiously... 👀', w.sp.name + ' says "' + pick(w.sp.bubbles) + '"'];
      say(pick(lines));
      await tween(0.7, k => { w.dy = -Math.abs(Math.sin(k * Math.PI * 2)) * 16; });
      w.dy = 0;
      await wait(0.5);
      return 'calm';
    }
    say(w.sp.name + ' used ' + w.sp.move + '! ' + D.TYPES[w.sp.type].emoji);
    Sound.sfx('attack', w.sp.type);
    await tween(0.2, k => { w.dx = -Math.sin(k * Math.PI) * 20; w.dy = Math.sin(k * Math.PI) * 8; });
    w.dx = 0; w.dy = 0;
    await projectile(w.sp.type, wildPos(), minePos(), 0.55);
    if (!active) return 'gone';
    const mx = D.maxHp(m.sp, m.t.lv);
    let dmg = Math.max(1, Math.min(Math.round((3 + w.lv * 0.55) * (0.8 + Math.random() * 0.4)), Math.ceil(mx * 0.22)));
    if (w.dizzy) dmg = Math.min(dmg, Math.max(1, m.t.hp - 1));
    m.t.hp = Math.max(0, m.t.hp - dmg);
    m.shake = 1; m.flash = 1;
    Sound.sfx('hit');
    await wait(0.6);
    if (m.t.hp <= 0) return partnerTired();
    say(m.sp.name + ' took ' + dmg + ' damage but keeps smiling! 💪');
    await wait(0.8);
    return 'hit';
  }
  async function partnerTired() {
    const m = st.mine;
    Sound.sfx('tired');
    say(m.sp.name + ' is all tuckered out! 💤');
    await tween(0.5, k => { m.scale = 1 - k * 0.5; });
    await wait(0.7);
    const s = Game.state;
    const healthy = Object.keys(s.team).filter(id => s.team[id].hp > 0);
    if (healthy.length) {
      forced = true;
      busy = false;
      say('Pick another Critter friend to help! 🐾');
      openSub('switch');
      return 'switch';
    }
    say('All your Critters are sleepy! Chuyu hurries to the Healing Fountain! 💖');
    await wait(1.8);
    end('wiped');
    return 'wiped';
  }
  async function doSwitch(id) {
    const s = Game.state, t = s.team[id];
    if (!t || t.hp <= 0 || id === st.mine.id) return;
    busy = true; setEnabled(false);
    const wasForced = forced;
    forced = false;
    const old = st.mine;
    if (old.t.hp > 0) { say('Come back, ' + old.sp.name + '! Great job! 👋'); await tween(0.3, k => { old.scale = 1 - k; }); }
    st.mine = mineFrom(id);
    st.mine.scale = 0; st.mine.shown = st.mine.t.hp;
    Game.setPartner(id);
    say('Go, ' + st.mine.sp.name + '! ' + st.mine.sp.emoji);
    Sound.sfx('menu');
    await tween(0.4, k => { st.mine.scale = U.easeOutBack(k); });
    renderCards(true);
    await wait(0.6);
    if (!active) return;
    if (!wasForced) {
      await wildTurn();
      if (!active || forced) return;
    }
    say('What will ' + st.mine.sp.name + ' do?');
    unbusy();
  }
  async function doRun() {
    busy = true; setEnabled(false);
    const w = st.wild;
    say('Chuyu waves goodbye! 👋 ' + w.sp.name + ' waves back: "' + pick(w.sp.bubbles) + '"');
    await tween(0.8, k => { w.dy = -Math.abs(Math.sin(k * Math.PI * 3)) * 12; });
    await wait(0.5);
    end('ran');
  }
  async function doFinish() {
    busy = true; setEnabled(false);
    const s = Game.state, w = st.wild, m = st.mine;
    say(w.sp.name + ' is tuckered out and toddles home for a nap! 😴');
    await tween(0.7, k => { w.alpha = 1 - k; w.scale = 1 - k * 0.3; });
    const exp = 10 + w.lv * 4, half = Math.round(exp / 2), gold = 10 + w.lv * 2;
    const before = {};
    Object.keys(s.team).forEach(id => { before[id] = s.team[id].lv; });
    Game.addExp(m.id, exp);
    Object.keys(s.team).forEach(id => { if (id !== m.id) Game.addExp(id, half); });
    s.inv.gold += gold;
    UI.updateHUD();
    const ups = Object.keys(s.team).filter(id => s.team[id].lv > before[id]);
    Sound.sfx(ups.length ? 'levelup' : 'coin');
    const upTxt = ups.map(id => (id === m.id ? '⭐ ' : '🌟 ') + D.SP[id].name + ' → Lv ' + s.team[id].lv).join(' · ');
    say('+' + exp + ' EXP for ' + m.sp.name + ' (+' + half + ' for friends) · +' + gold + ' 🪙' + (upTxt ? '  ' + upTxt + '!' : ''));
    renderCards(true);
    await wait(2.0);
    end('finished');
  }
  function end(outcome) {
    if (!active) return;
    const res = { outcome, sp: st.wild.sp.id, entity: st.entity };
    active = false; covering = false; busy = false; sub = null; forced = false;
    el.classList.add('hidden');
    document.body.classList.remove('in-battle');
    tweens = []; parts = []; effects = [];
    st = null;
    Game.onBattleEnd(res);
  }

  /* ---------------- effects ---------------- */
  function spawnPart(fx, x, y, c1, c2, burstMode) {
    const a = Math.random() * Math.PI * 2, sp = burstMode ? 80 + Math.random() * 160 : 20 + Math.random() * 40;
    const typeMap = { beam: 'spark', stars: 'star', zap: 'spark', swirl: 'dot', hearts: 'heart', bubbles: 'bubble', leaves: 'leaf', petals: 'petal', apples: 'apple', snow: 'snow', galaxy: 'star', spark: 'spark', notes: 'note', flames: 'flame' };
    const type = typeMap[fx] || 'spark';
    parts.push({ type, x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (burstMode ? 40 : 10), g: burstMode ? 120 : 0, t: 0, life: 0.6 + Math.random() * 0.5, size: 4 + Math.random() * 6, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 8, color: fx === 'swirl' ? 'hsl(' + ((Math.random() * 360) | 0) + ',95%,65%)' : (Math.random() < 0.5 ? c1 : c2) });
  }
  function burst(x, y, fx, c1, c2, n) { for (let i = 0; i < (n || 14); i++) spawnPart(fx, x, y, c1, c2, true); }
  function projectile(type, from, to, dur) {
    const ty = D.TYPES[type] || D.TYPES.sun;
    const eff = { fx: ty.fx, from, to, c1: ty.color, c2: ty.color2, k: 0 };
    effects.push(eff);
    return tween(dur, k => {
      eff.k = k;
      const hx = U.lerp(from.x, to.x, k), hy = U.lerp(from.y, to.y, k) - Math.sin(k * Math.PI) * (ty.fx === 'apples' ? H * 0.18 : H * 0.05);
      eff.hx = hx; eff.hy = hy;
      for (let n = 0; n < 3; n++) spawnPart(ty.fx, hx + (Math.random() - 0.5) * 16, hy + (Math.random() - 0.5) * 16, ty.color, ty.color2, false);
    }).then(() => {
      const i = effects.indexOf(eff);
      if (i >= 0) effects.splice(i, 1);
      burst(to.x, to.y, ty.fx, ty.color, ty.color2, 18);
    });
  }
  function drawPart(p) {
    const h = Art.helpers;
    const a = 1 - p.t / p.life;
    ctx.save();
    ctx.globalAlpha = Math.max(0, a);
    ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.fillStyle = p.color; ctx.strokeStyle = p.color;
    const s = p.size;
    switch (p.type) {
      case 'star': h.star(ctx, 0, 0, s, s * 0.45, 5); ctx.fill(); break;
      case 'heart': h.heart(ctx, 0, 0, s); break;
      case 'bubble': ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, s * 0.8, 0, 7); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(-s * 0.3, -s * 0.3, s * 0.2, 0, 7); ctx.fill(); break;
      case 'leaf': ctx.beginPath(); ctx.ellipse(0, 0, s, s * 0.45, 0, 0, 7); ctx.fill(); break;
      case 'petal': ctx.beginPath(); ctx.ellipse(0, 0, s * 0.8, s * 0.5, 0, 0, 7); ctx.fill(); break;
      case 'apple': ctx.fillStyle = '#e8352f'; ctx.beginPath(); ctx.arc(0, 0, s * 0.8, 0, 7); ctx.fill(); ctx.fillStyle = '#4caf50'; ctx.fillRect(-1, -s, 3, s * 0.5); break;
      case 'snow': ctx.lineWidth = 2; for (let k = 0; k < 3; k++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); ctx.stroke(); } break;
      case 'dot': ctx.beginPath(); ctx.arc(0, 0, s * 0.7, 0, 7); ctx.fill(); break;
      case 'confetti': ctx.fillRect(-s / 2, -s / 4, s, s / 2); break;
      case 'note': {
        // a little eighth note: tilted oval head + stem + flag (drawn upright regardless of spin)
        ctx.rotate(-p.rot + Math.sin(p.t * 6) * 0.25);
        ctx.beginPath(); ctx.ellipse(-s * 0.25, s * 0.45, s * 0.42, s * 0.3, -0.45, 0, 7); ctx.fill();
        ctx.lineWidth = Math.max(1.5, s * 0.16); ctx.beginPath(); ctx.moveTo(s * 0.12, s * 0.42); ctx.lineTo(s * 0.12, -s * 0.75); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(s * 0.12, -s * 0.75); ctx.quadraticCurveTo(s * 0.7, -s * 0.5, s * 0.55, -s * 0.05); ctx.stroke();
        break;
      }
      case 'flame': {
        ctx.rotate(-p.rot);
        const fl = 1 + Math.sin(p.t * 18 + p.size) * 0.12;
        ctx.beginPath(); ctx.moveTo(0, -s * 1.1 * fl);
        ctx.quadraticCurveTo(s * 0.75, -s * 0.2, s * 0.45, s * 0.45); ctx.quadraticCurveTo(0, s * 0.8, -s * 0.45, s * 0.45);
        ctx.quadraticCurveTo(-s * 0.75, -s * 0.2, 0, -s * 1.1 * fl); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.ellipse(0, s * 0.2, s * 0.18, s * 0.28, 0, 0, 7); ctx.fill();
        break;
      }
      default: h.sparkle(ctx, 0, 0, s); break;
    }
    ctx.restore();
  }
  function drawEffect(e) {
    if (e.hx == null) return;
    ctx.save();
    if (e.fx === 'beam') {
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(255,214,90,.45)'; ctx.lineWidth = 22;
      ctx.beginPath(); ctx.moveTo(e.from.x, e.from.y); ctx.lineTo(e.hx, e.hy); ctx.stroke();
      ctx.strokeStyle = e.c2; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(e.from.x, e.from.y); ctx.lineTo(e.hx, e.hy); ctx.stroke();
    } else if (e.fx === 'zap') {
      ctx.strokeStyle = '#fff7a8'; ctx.lineWidth = 4; ctx.lineJoin = 'round';
      ctx.shadowColor = '#ffe13b'; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.moveTo(e.from.x, e.from.y);
      const n = 7;
      for (let k = 1; k <= n; k++) { const t = k / n; ctx.lineTo(U.lerp(e.from.x, e.hx, t) + (k < n ? (Math.random() - 0.5) * 30 : 0), U.lerp(e.from.y, e.hy, t) + (k < n ? (Math.random() - 0.5) * 30 : 0)); }
      ctx.stroke();
    } else if (e.fx === 'swirl' || e.fx === 'galaxy') {
      for (let k = 0; k < 6; k++) { const a = time * 12 + k; ctx.fillStyle = 'hsl(' + (k * 60) + ',95%,65%)'; ctx.beginPath(); ctx.arc(e.hx + Math.cos(a) * 18, e.hy + Math.sin(a) * 18, 6, 0, 7); ctx.fill(); }
    } else if (e.fx === 'notes') {
      // a glowing golden ribbon of sound with notes riding on it
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(255,214,90,.35)'; ctx.lineWidth = 16;
      ctx.beginPath();
      for (let k = 0; k <= 16; k++) { const t = k / 16, x = U.lerp(e.from.x, e.hx, t), y = U.lerp(e.from.y, e.hy, t) + Math.sin(t * 12 + time * 14) * 10; if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      ctx.stroke();
      ctx.strokeStyle = e.c2; ctx.lineWidth = 4; ctx.stroke();
      ctx.fillStyle = e.c1; ctx.shadowColor = e.c1; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(e.hx, e.hy, 11, 0, 7); ctx.fill();
    } else if (e.fx === 'flames') {
      ctx.shadowColor = e.c1; ctx.shadowBlur = 18;
      for (let k = 0; k < 5; k++) {
        const a = time * 9 + k * 1.26, rr = 10 + 6 * Math.sin(time * 13 + k);
        ctx.fillStyle = k % 2 ? e.c2 : e.c1; ctx.globalAlpha = 0.8;
        ctx.beginPath(); ctx.arc(e.hx + Math.cos(a) * 12, e.hy + Math.sin(a) * 9, rr * 0.7, 0, 7); ctx.fill();
      }
    } else {
      ctx.fillStyle = e.c1; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(e.hx, e.hy, 16, 0, 7); ctx.fill();
    }
    ctx.restore();
  }
  function drawCapsule(c) {
    const r = c.r;
    ctx.save();
    ctx.translate(c.x, c.y); ctx.rotate(c.rot);
    if (c.glow) { ctx.fillStyle = 'rgba(255,240,150,.45)'; ctx.beginPath(); ctx.arc(0, 0, r * 2, 0, 7); ctx.fill(); }
    if (c.kind === 'rainbow') { const g = ctx.createLinearGradient(-r, -r, r, 0); ['#ff6b6b', '#ffb347', '#ffe66d', '#7bd389', '#6ec6ff', '#b28dff'].forEach((col, k) => g.addColorStop(k / 5, col)); ctx.fillStyle = g; }
    else ctx.fillStyle = c.kind === 'master' ? '#7b4dff' : '#ff4d4d';
    ctx.beginPath(); ctx.arc(0, 0, r, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#2b2b3a'; ctx.fillRect(-r, -r * 0.1, r * 2, r * 0.2);
    ctx.beginPath(); ctx.arc(0, 0, r * 0.32, 0, 7); ctx.fill();
    ctx.fillStyle = c.open ? '#fff6b0' : '#ffffff'; ctx.beginPath(); ctx.arc(0, 0, r * 0.2, 0, 7); ctx.fill();
    if (c.kind === 'star') { ctx.fillStyle = '#ffd84d'; Art.helpers.star(ctx, 0, -r * 0.55, r * 0.26, r * 0.11, 5); ctx.fill(); }
    if (c.kind === 'master') { ctx.fillStyle = '#ffd84d'; ctx.beginPath(); ctx.moveTo(-r * 0.4, -r * 0.35); ctx.lineTo(-r * 0.4, -r * 0.75); ctx.lineTo(-r * 0.2, -r * 0.55); ctx.lineTo(0, -r * 0.85); ctx.lineTo(r * 0.2, -r * 0.55); ctx.lineTo(r * 0.4, -r * 0.75); ctx.lineTo(r * 0.4, -r * 0.35); ctx.closePath(); ctx.fill(); }
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke();
    ctx.restore();
  }
  function platform(x, y, rx, ry) {
    ctx.fillStyle = 'rgba(0,0,0,.16)'; ctx.beginPath(); ctx.ellipse(x, y + ry * 0.3, rx, ry, 0, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.38)'; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 2; ctx.stroke();
  }
  function draw() {
    if (!st) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    Art.battleBackdrop(ctx, W, H, st.zone, time, { boss: st.wild.sp.id === 'gwima' });
    const wp = wildPos(), mp = minePos();
    platform(wp.x, wp.y + wp.r * 0.95, wp.r * 1.55, wp.r * 0.38);
    platform(mp.x, mp.y + mp.r * 0.95, mp.r * 1.6, mp.r * 0.4);
    const w = st.wild;
    if (w.visible && w.scale > 0.02) {
      const sx = Math.sin(time * 55) * 9 * w.shake;
      const bob = Math.sin(time * 2.4) * 4;
      ctx.save(); ctx.globalAlpha = w.alpha;
      Art.drawMedallion(ctx, w.sp, wp.x + sx + w.dx, wp.y + bob + w.dy, wp.r * w.scale, time, { flash: w.flash });
      ctx.restore();
      if (w.dizzy && w.scale > 0.6) {
        for (let k = 0; k < 3; k++) {
          const a = time * 3.2 + k * 2.09;
          ctx.fillStyle = '#ffe066';
          Art.helpers.star(ctx, wp.x + Math.cos(a) * wp.r * 0.55, wp.y - wp.r * 1.2 + Math.sin(a) * wp.r * 0.14, wp.r * 0.12, wp.r * 0.05, 5); ctx.fill();
        }
      }
      if (w.fed && w.scale > 0.6) { ctx.fillStyle = '#ff5c8a'; Art.helpers.heart(ctx, wp.x + wp.r * 0.95, wp.y - wp.r * 0.85 + Math.sin(time * 3) * 5, wp.r * 0.14); }
    }
    const m = st.mine;
    if (m.scale > 0.02) {
      const sx = Math.sin(time * 55) * 9 * m.shake;
      const bob = Math.sin(time * 2.6 + 1) * 3;
      Art.drawMedallion(ctx, m.sp, mp.x + sx + m.dx, mp.y + bob + m.dy, mp.r * m.scale, time, { flash: m.flash });
    }
    effects.forEach(drawEffect);
    if (st.capsule) drawCapsule(st.capsule);
    if (st.berry) { ctx.fillStyle = '#ff3b5c'; ctx.beginPath(); ctx.arc(st.berry.x, st.berry.y, 9, 0, 7); ctx.fill(); ctx.fillStyle = '#4caf50'; Art.helpers.star(ctx, st.berry.x, st.berry.y - 8, 5, 2, 5); ctx.fill(); }
    parts.forEach(drawPart);
  }
  function update(dt) {
    if (!active || !st) return;
    time += dt;
    const stage = cv.parentElement;
    if (stage && (Math.abs(stage.clientWidth - W) > 0.5 || Math.abs(stage.clientHeight - H) > 0.5)) sizeCanvas();
    for (let i = tweens.length - 1; i >= 0; i--) {
      const tw = tweens[i];
      tw.t += dt;
      const k = Math.min(1, tw.t / tw.dur);
      if (tw.fn) tw.fn(k);
      if (k >= 1) { tweens.splice(i, 1); tw.res(); }
    }
    if (!st) return;
    for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.g * dt; p.rot += p.vr * dt; if (p.t >= p.life) parts.splice(i, 1); }
    const w = st.wild, m = st.mine;
    w.shake = Math.max(0, w.shake - dt * 2.5); w.flash = Math.max(0, w.flash - dt * 3);
    m.shake = Math.max(0, m.shake - dt * 2.5); m.flash = Math.max(0, m.flash - dt * 3);
    renderCards(false);
    draw();
  }
  function handleKey(e) {
    if (!active) return false;
    const k = e.key;
    const nav = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'Backspace', 'r', 'R', 'f', 'F'];
    if (busy) return nav.indexOf(k) >= 0;
    const btns = visibleButtons();
    if (/^[1-9]$/.test(k)) { const b = btns[+k - 1]; if (b) b.click(); return true; }
    if ((k === 'r' || k === 'R') && sub === 'switch') { const b = btns.find(x => x.dataset.sub === 'run'); if (b) b.click(); return true; }
    if ((k === 'f' || k === 'F') && sub === 'switch') { const b = btns.find(x => x.dataset.sub === 'finish'); if (b) b.click(); return true; }
    if (k === 'Escape' || k === 'Backspace') { if (sub && !forced) { Sound.sfx('menu'); closeSub(); } return true; }
    if (k.startsWith('Arrow')) {
      let i = btns.indexOf(document.activeElement);
      const cols = sub ? 1 : 2;
      if (i < 0) i = 0;
      else if (k === 'ArrowLeft') i = Math.max(0, i - 1);
      else if (k === 'ArrowRight') i = Math.min(btns.length - 1, i + 1);
      else if (k === 'ArrowUp') i = Math.max(0, i - cols);
      else if (k === 'ArrowDown') i = Math.min(btns.length - 1, i + cols);
      if (btns[i]) btns[i].focus();
      return true;
    }
    if (k === 'Enter' || k === ' ') {
      const a = document.activeElement;
      if (btns.indexOf(a) >= 0) a.click(); else if (btns[0]) { btns[0].focus(); }
      return true;
    }
    return false;
  }

  return {
    open, update, handleKey, chance, act, subAct,
    covering: () => covering, get active() { return active; }, get busy() { return busy; }, get state() { return st; }, get sub() { return sub; },
  };
})();
