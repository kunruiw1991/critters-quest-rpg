'use strict';
/* ==========================================================================
 * Sound: tiny WebAudio chiptune sequencer (per-biome melodies + battle theme)
 * and procedural sound effects. Starts after the first user gesture.
 * ========================================================================== */
const Sound = (() => {
  let ctx = null, master = null, musicBus = null, sfxBus = null, noiseBuf = null, timer = null;
  let muted = false;
  try { muted = localStorage.getItem('cq_muted') === '1'; } catch (e) { /* ignore */ }
  let cur = null;          // { name, track, step, next }
  let wanted = null;       // track requested before unlock

  const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function midi(tok) {
    const m = /^([A-G])([#b]?)(\d)$/.exec(tok);
    if (!m) return null;
    return NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (parseInt(m[3], 10) + 1) * 12;
  }
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  function parse(str) { return str.replace(/\|/g, ' ').trim().split(/\s+/).map(t => (t === '-' ? null : t === '.' ? '.' : midi(t))); }

  const TRACKS = {
    village: { bpm: 112, lw: 'square', bw: 'triangle', drums: 'k.h.s.h.',
      lead: 'C5 . E5 G5 A5 . G5 E5 | F5 . A5 C6 B5 . G5 . | E5 . G5 C6 D6 . C6 A5 | G5 E5 F5 D5 C5 . . - | A4 . C5 E5 F5 . E5 C5 | D5 . F5 A5 G5 . E5 . | F5 E5 D5 C5 B4 . D5 G5 | C5 . E5 . C5 . . -',
      bass: 'C3 . G3 . C3 . G3 . | F3 . C4 . G3 . D3 . | C3 . G3 . F3 . A3 . | G3 . G3 . C3 . G2 . | A2 . E3 . A2 . E3 . | D3 . A3 . G3 . D3 . | F3 . C3 . G3 . G2 . | C3 . G2 . C3 . - -' },
    nature: { bpm: 104, lw: 'square', bw: 'triangle', drums: 'k...s...',
      lead: 'G4 . B4 D5 E5 . D5 B4 | C5 . E5 G5 F#5 . D5 . | B4 . D5 G5 A5 . G5 E5 | D5 B4 C5 A4 G4 . . - | E5 . G5 . F#5 . D5 . | E5 . C5 . B4 . G4 . | A4 B4 C5 D5 E5 . F#5 . | G5 . D5 . G4 . . -',
      bass: 'G2 . D3 . G2 . D3 . | C3 . G3 . D3 . A2 . | G2 . D3 . C3 . E3 . | D3 . D3 . G2 . D3 . | C3 . G3 . D3 . A3 . | C3 . G3 . G2 . D3 . | A2 . E3 . D3 . F#3 . | G2 . D3 . G2 . - -' },
    lagoon: { bpm: 108, lw: 'triangle', bw: 'triangle', drums: 'k..hs.h.',
      lead: 'F5 . A5 . C6 . A5 G5 | F5 . D5 . C5 . . - | Bb4 . D5 F5 G5 . F5 D5 | C5 . A4 . C5 . . - | F5 . G5 A5 Bb5 . A5 G5 | F5 . E5 F5 G5 . C5 . | D5 . E5 F5 G5 . A5 G5 | F5 . . . F5 . . -',
      bass: 'F2 . C3 . F2 . C3 . | Bb2 . F3 . C3 . G2 . | Bb2 . F3 . Bb2 . F3 . | C3 . G3 . C3 . G2 . | F2 . C3 . D3 . A2 . | Bb2 . F3 . C3 . G2 . | Bb2 . F3 . C3 . E3 . | F2 . C3 . F2 . - -' },
    meadow: { bpm: 100, lw: 'triangle', bw: 'sine', drums: 'k...h...',
      lead: 'D5 F#5 A5 F#5 B5 . A5 . | G5 F#5 E5 F#5 D5 . . - | E5 G5 B5 G5 C#6 . B5 . | A5 G5 F#5 E5 A4 . . - | D5 F#5 A5 D6 C#6 . A5 . | B5 A5 G5 B5 A5 . F#5 . | G5 F#5 E5 D5 C#5 . E5 . | D5 . A4 . D5 . . -',
      bass: 'D3 . A3 . G3 . D3 . | G3 . D3 . D3 . A2 . | E3 . B3 . A3 . E3 . | A2 . E3 . A2 . E3 . | D3 . A3 . A2 . E3 . | G3 . D3 . D3 . A2 . | E3 . B2 . A2 . C#3 . | D3 . A2 . D3 . - -' },
    adventure: { bpm: 124, lw: 'square', bw: 'triangle', drums: 'k.hsk.hs',
      lead: 'A4 . C5 E5 A5 . G5 E5 | F5 . E5 D5 E5 . . - | G4 . B4 D5 G5 . F5 D5 | E5 . D5 C5 D5 . . - | A4 . C5 E5 A5 . B5 C6 | B5 . G5 E5 G5 . A5 . | F5 E5 D5 C5 B4 . D5 . | C5 . B4 . A4 . . -',
      bass: 'A2 . E3 . A2 . E3 . | F2 . C3 . G2 . D3 . | G2 . D3 . G2 . D3 . | C3 . G3 . G2 . D3 . | A2 . E3 . A2 . E3 . | E2 . B2 . E2 . B2 . | F2 . C3 . G2 . D3 . | A2 . E3 . A2 . - -' },
    desert: { bpm: 112, lw: 'square', bw: 'triangle', drums: 'k..sk.s.',
      lead: 'D5 . F5 G5 A5 . G5 F5 | E5 . C#5 . D5 . . - | A4 . D5 F5 G5 . F5 E5 | F5 . E5 C#5 D5 . . - | D5 F5 A5 C6 Bb5 . A5 . | G5 . F5 E5 F5 . D5 . | Bb4 . C#5 E5 G5 . F5 E5 | D5 . A4 . D5 . . -',
      bass: 'D2 . A2 . D2 . A2 . | A2 . E3 . D2 . A2 . | D2 . A2 . Bb2 . F2 . | A2 . E2 . D2 . A2 . | D2 . A2 . G2 . D3 . | G2 . D3 . D2 . A2 . | Bb2 . F2 . A2 . E2 . | D2 . A2 . D2 . - -' },
    glacier: { bpm: 92, lw: 'triangle', bw: 'sine', drums: 'k.......',
      lead: 'E5 . B5 . G5 . F#5 E5 | D5 . E5 . B4 . . - | C5 . G5 . E5 . D5 C5 | B4 . . . B4 . . - | E5 . G5 B5 D6 . C6 B5 | A5 . G5 . F#5 . E5 . | C5 D5 E5 F#5 G5 . A5 . | B5 . . . E5 . . -',
      bass: 'E2 . B2 . E3 . B2 . | D3 . A2 . G2 . D3 . | C3 . G2 . C3 . G2 . | B2 . F#2 . B2 . F#2 . | E2 . B2 . G2 . D3 . | A2 . E3 . D3 . A2 . | C3 . G2 . D3 . A2 . | E2 . B2 . E2 . - -' },
    castle: { bpm: 88, lw: 'sine', bw: 'triangle', drums: 'k...h...',
      lead: 'E5 . A5 . C6 . B5 A5 | G5 . E5 . A5 . . - | F5 . A5 . D6 . C6 B5 | C6 . B5 . G5 . . - | E5 . A5 . C6 . E6 . | D6 . C6 . B5 . A5 . | F5 . G5 . A5 . B5 . | A5 . . . A4 . . -',
      bass: 'A2 . E3 . A3 . E3 . | C3 . G3 . E3 . G3 . | D3 . A3 . F3 . A3 . | G2 . D3 . G3 . D3 . | A2 . E3 . C3 . E3 . | F2 . C3 . G2 . D3 . | D3 . A2 . E3 . B2 . | A2 . E3 . A2 . - -' },
    battle: { bpm: 152, lw: 'square', bw: 'square', drums: 'khshkhsh', bassVol: 0.07,
      lead: 'A4 A4 C5 A4 D5 C5 A4 G4 | A4 A4 E5 D5 C5 B4 G4 B4 | A4 A4 C5 A4 F5 E5 D5 C5 | B4 G4 B4 D5 E5 . E5 . | F5 F5 E5 D5 C5 D5 E5 C5 | D5 D5 C5 B4 A4 B4 C5 A4 | F5 E5 D5 C5 B4 C5 D5 B4 | E5 . G#4 . A4 . E5 .',
      bass: 'A2 A3 A2 A3 A2 A3 A2 A3 | G2 G3 G2 G3 G2 G3 G2 G3 | F2 F3 F2 F3 F2 F3 F2 F3 | E2 E3 E2 E3 E2 E3 E2 E3 | F2 F3 F2 F3 F2 F3 F2 F3 | G2 G3 G2 G3 G2 G3 G2 G3 | D2 D3 D2 D3 D2 D3 D2 D3 | E2 E3 E2 E3 E2 E3 E2 E3' },
    title: { bpm: 116, lw: 'square', bw: 'triangle', drums: 'k.h.s.h.',
      lead: 'G4 C5 E5 G5 C6 . G5 E5 | F5 A5 C6 . B5 . G5 . | E5 G5 C6 E6 D6 . C6 A5 | B5 G5 A5 F5 G5 . . - | C6 . B5 A5 G5 . E5 . | F5 . E5 D5 E5 . C5 . | D5 E5 F5 G5 A5 B5 C6 D6 | C6 . G5 . C6 . . -',
      bass: 'C3 . G3 . C3 . G3 . | F3 . C3 . G3 . D3 . | C3 . G3 . A2 . E3 . | G2 . D3 . G2 . D3 . | A2 . E3 . E3 . B2 . | F3 . C3 . C3 . G2 . | D3 . A3 . G3 . D3 . | C3 . G2 . C3 . - -' },
    /* Honmoon Island: an original bouncy K-pop style tune (Am - F - C - G). */
    honmoon: { bpm: 120, lw: 'square', bw: 'triangle', drums: 'k.h.skh.',
      lead: 'A4 . C5 E5 A5 . G5 E5 | F5 . E5 C5 D5 . C5 A4 | C5 . E5 G5 C6 . B5 G5 | B5 . A5 G5 D5 . . - | E5 E5 A5 . G5 E5 C5 . | F5 F5 A5 . C6 . A5 F5 | G5 . E5 G5 C6 . D6 E6 | D6 . B5 . G5 . . -',
      bass: 'A2 . A3 . A2 . A3 . | F2 . F3 . F2 . F3 . | C3 . C4 . C3 . C4 . | G2 . G3 . G2 . D3 . | A2 . E3 . A2 . E3 . | F2 . C3 . F2 . C3 . | C3 . G3 . C3 . G3 . | G2 . D3 . G2 . - -' },
    /* Gwi-Ma, the demon king: an exciting (but not scary) boss battle tune. */
    boss: { bpm: 144, lw: 'square', bw: 'square', drums: 'khshkhsh', bassVol: 0.07,
      lead: 'E5 . G5 E5 B5 . A5 G5 | F#5 . E5 D5 E5 . . - | E5 . G5 B5 E6 . D6 B5 | C6 . B5 A5 B5 . . - | G5 G5 A5 B5 C6 . B5 A5 | F#5 F#5 G5 A5 B5 . A5 G5 | E5 F#5 G5 A5 B5 C6 D6 D#6 | E6 . B5 . E5 . . -',
      bass: 'E2 E3 E2 E3 E2 E3 E2 E3 | D2 D3 D2 D3 D2 D3 D2 D3 | C2 C3 C2 C3 C2 C3 C2 C3 | B1 B2 B1 B2 B1 B2 B1 B2 | C2 C3 C2 C3 C2 C3 C2 C3 | D2 D3 D2 D3 D2 D3 D2 D3 | A1 A2 A1 A2 B1 B2 B1 B2 | E2 E3 E2 E3 E2 E3 E2 E3' },
    /* Derpy's Minhwa Sanctum: playful Korean folk pentatonic melody (C-D-E-G-A). */
    minhwa: { bpm: 108, lw: 'triangle', bw: 'triangle', drums: 'k..hk.s.',
      lead: 'E5 . G5 A5 C6 . A5 G5 | E5 . D5 C5 D5 . . - | G5 . A5 C6 D6 . C6 A5 | G5 . E5 D5 C5 . . - | A4 C5 D5 E5 G5 . A5 G5 | E5 D5 C5 D5 E5 . G5 . | A5 G5 E5 D5 C5 . D5 E5 | C5 . G4 . C5 . . -',
      bass: 'C3 . G3 . C3 . G3 . | G2 . D3 . G2 . D3 . | A2 . E3 . A2 . E3 . | C3 . G3 . C3 . G2 . | F2 . C3 . F2 . C3 . | C3 . G3 . C3 . G3 . | F2 . C3 . G2 . D3 . | C3 . G2 . C3 . - -' },
    /* Nightmare Critters Carnival: bouncy spooky-cute calliope waltz-march. */
    carnival: { bpm: 126, lw: 'square', bw: 'triangle', drums: 'k.hsk.hs',
      lead: 'D5 . F5 A5 D6 . C#6 D6 | Bb5 . A5 G5 A5 . . - | G5 . Bb5 D6 C6 . Bb5 A5 | G5 . F5 E5 D5 . . - | A4 . D5 F5 A5 . G5 F5 | E5 . G5 Bb5 A5 . G5 F5 | D5 E5 F5 G5 A5 Bb5 C#6 . | D6 . A5 . D5 . . -',
      bass: 'D2 . A2 . D2 . A2 . | Gm2 . D3 . A2 . E3 . | G2 . D3 . C3 . G3 . | F2 . C3 . D2 . A2 . | D2 . A2 . D2 . A2 . | A2 . E3 . A2 . E3 . | D2 . A2 . A2 . E3 . | D2 . A2 . D2 . - -'.replace('Gm2', 'G2') },
    /* Kanto Classics Bay: nostalgic 8-bit Game Boy route adventure march. */
    kanto: { bpm: 128, lw: 'square', bw: 'triangle', drums: 'k.h.s.h.',
      lead: 'G4 . B4 D5 G5 . F#5 G5 | A5 . G5 E5 D5 . . - | C5 . E5 G5 B5 . A5 G5 | F#5 . G5 A5 D5 . . - | G5 . B5 D6 C6 . B5 A5 | G5 . E5 C5 D5 . B4 . | C5 D5 E5 F#5 G5 A5 B5 C6 | D6 . B5 . G5 . . -',
      bass: 'G2 . D3 . G2 . D3 . | D3 . A3 . D3 . A2 . | C3 . G3 . C3 . G3 . | D3 . A3 . D3 . A2 . | G2 . D3 . F#2 . D3 . | E2 . B2 . G2 . D3 . | C3 . G3 . D3 . A3 . | G2 . D3 . G2 . - -' },
  };
  for (const k in TRACKS) {
    const t = TRACKS[k];
    t.L = parse(t.lead); t.B = parse(t.bass); t.len = Math.max(t.L.length, t.B.length);
  }
  const ONE_SHOTS = {
    victory: { bpm: 140, lw: 'square', bw: 'triangle', L: parse('C5 E5 G5 C6 . . G5 . C6 . E6 . G6 . . .'), B: parse('C3 . . . G2 . . . C3 . . . C3 . . .') },
  };
  ONE_SHOTS.victory.len = 16;

  function init() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try { ctx = new AC(); } catch (e) { ctx = null; return false; }
    master = ctx.createGain(); master.gain.value = muted ? 0 : 0.9; master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = 0.55; musicBus.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.8; sfxBus.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    ctx.addEventListener('statechange', () => {
      if (ctx && ctx.state === 'running' && wanted && (!cur || cur.name !== wanted)) music(wanted, true);
    });
    timer = setInterval(schedule, 25);
    return true;
  }
  const isRunning = () => !!ctx && ctx.state === 'running';
  function unlock(e) {
    if (e && e.isTrusted === false) return; // only real user gestures may start audio
    if (!init()) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    if (isRunning() && wanted && (!cur || cur.name !== wanted)) music(wanted);
  }
  function tone(t, f, dur, type, vol, bus, slide) {
    if (!isRunning()) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t + dur);
    const a = 0.006, rel = Math.min(0.09, dur * 0.45);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + a);
    g.gain.setValueAtTime(Math.max(0.0002, vol), t + Math.max(a, dur - rel));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(bus || sfxBus);
    o.start(t); o.stop(t + dur + 0.03);
  }
  function noise(t, dur, vol, freq, type, bus) {
    if (!isRunning()) return;
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type || 'bandpass'; f.frequency.value = freq || 1000; f.Q.value = 0.8;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(bus || sfxBus);
    s.start(t); s.stop(t + dur + 0.02);
  }
  function drum(kind, t) {
    if (kind === 'k') tone(t, 140, 0.12, 'sine', 0.35, musicBus, 45);
    else if (kind === 's') noise(t, 0.09, 0.22, 1800, 'bandpass', musicBus);
    else if (kind === 'h') noise(t, 0.03, 0.08, 8000, 'highpass', musicBus);
  }
  function playStep(tr, s, t, stepDur) {
    const L = tr.L[s], B = tr.B[s];
    const hold = (arr, i) => { let n = 1; while (arr[(i + n) % arr.length] === '.' && n < 8) n++; return n; };
    if (typeof L === 'number') tone(t, hz(L), stepDur * hold(tr.L, s) * 0.92, tr.lw, tr.leadVol || 0.075, musicBus);
    if (typeof B === 'number') tone(t, hz(B), stepDur * hold(tr.B, s) * 0.9, tr.bw, tr.bassVol || (tr.bw === 'square' ? 0.05 : 0.16), musicBus);
    if (tr.drums) { const ch = tr.drums[s % tr.drums.length]; if (ch !== '.') drum(ch, t); }
  }
  function schedule() {
    if (!isRunning() || !cur) return;
    const tr = cur.track;
    const stepDur = 60 / tr.bpm / 2;
    let guard = 0;
    while (cur && cur.next < ctx.currentTime + 0.12 && guard++ < 16) {
      if (cur.step >= tr.len) {
        if (cur.once) { const after = cur.after; cur = null; if (after) music(after, true); return; }
        cur.step = 0;
      }
      playStep(tr, cur.step, cur.next, stepDur);
      cur.next += stepDur;
      cur.step++;
    }
  }
  let fadeTimer = null;
  function music(name, force) {
    wanted = name;
    if (!isRunning()) { if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {}); return; }
    if (!force && cur && cur.name === name) return;
    const tr = TRACKS[name];
    if (!tr) return;
    const start = () => {
      fadeTimer = null;
      cur = { name, track: tr, step: 0, next: ctx.currentTime + 0.06 };
      musicBus.gain.cancelScheduledValues(ctx.currentTime);
      musicBus.gain.setValueAtTime(0.0001, ctx.currentTime);
      musicBus.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.45);
    };
    if (fadeTimer) clearTimeout(fadeTimer);
    if (cur && !cur.once) {
      // quick fade-out of the old tune, then fade the new one in
      musicBus.gain.cancelScheduledValues(ctx.currentTime);
      musicBus.gain.setValueAtTime(musicBus.gain.value, ctx.currentTime);
      musicBus.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      fadeTimer = setTimeout(start, 240);
    } else start();
  }
  function jingle(name, after) {
    if (!isRunning()) { if (after) wanted = after; return; }
    const tr = ONE_SHOTS[name];
    if (!tr) return;
    if (fadeTimer) { clearTimeout(fadeTimer); fadeTimer = null; }
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setValueAtTime(0.55, ctx.currentTime);
    if (after) wanted = after;
    cur = { name, track: tr, step: 0, next: ctx.currentTime + 0.05, once: true, after: after || wanted };
  }
  function stopMusic() { cur = null; }

  function sfx(name, arg) {
    if (!isRunning() || muted) return;
    const n = ctx.currentTime + 0.005;
    switch (name) {
      case 'step': tone(n, 150, 0.03, 'triangle', 0.05); break;
      case 'bump': tone(n, 130, 0.09, 'square', 0.08, null, 70); break;
      case 'talk': tone(n, 740, 0.035, 'square', 0.05); break;
      case 'menu': tone(n, 880, 0.045, 'square', 0.06); tone(n + 0.04, 1175, 0.05, 'square', 0.05); break;
      case 'coin': tone(n, 988, 0.07, 'square', 0.1); tone(n + 0.07, 1319, 0.2, 'square', 0.1); break;
      case 'chest': [523, 659, 784, 1047, 1319].forEach((f, k) => tone(n + k * 0.07, f, 0.16, 'square', 0.1)); break;
      case 'shake': noise(n, 0.35, 0.3, 1400); noise(n + 0.12, 0.25, 0.2, 2200); tone(n + 0.3, 660, 0.08, 'square', 0.08); tone(n + 0.38, 880, 0.12, 'square', 0.08); break;
      case 'heal': [523, 659, 784, 1047, 1319, 1568].forEach((f, k) => tone(n + k * 0.08, f, 0.3, 'triangle', 0.13)); break;
      case 'warp': for (let k = 0; k < 10; k++) tone(n + k * 0.045, 400 + k * 140, 0.14, 'sine', 0.11); break;
      case 'encounter': [880, 1047, 1319, 1760].forEach((f, k) => tone(n + k * 0.06, f, 0.1, 'square', 0.1)); tone(n + 0.28, 1760, 0.35, 'square', 0.08, null, 440); break;
      case 'throw': noise(n, 0.35, 0.22, 900, 'bandpass'); tone(n, 300, 0.35, 'sine', 0.12, null, 900); break;
      case 'wiggle': tone(n, 520, 0.08, 'square', 0.1); tone(n + 0.1, 470, 0.08, 'square', 0.08); break;
      case 'click': tone(n, 1400, 0.05, 'square', 0.12); tone(n + 0.06, 2100, 0.12, 'square', 0.1); break;
      case 'gotcha': [784, 988, 1175, 1568].forEach((f, k) => tone(n + k * 0.09, f, 0.22, 'square', 0.11)); tone(n + 0.4, 2093, 0.5, 'triangle', 0.12); break;
      case 'pop': tone(n, 700, 0.18, 'square', 0.1, null, 180); noise(n, 0.15, 0.2, 2500); break;
      case 'hit': noise(n, 0.14, 0.35, 900); tone(n, 200, 0.1, 'square', 0.08, null, 90); break;
      case 'attack': {
        const ty = arg || 'sun';
        if (ty === 'thunder') { tone(n, 1200, 0.25, 'square', 0.1, null, 120); noise(n + 0.05, 0.3, 0.3, 3000); }
        else if (ty === 'moon' || ty === 'star' || ty === 'galaxy') { [1047, 1319, 1568, 2093, 1568, 2637].forEach((f, k) => tone(n + k * 0.05, f, 0.12, 'triangle', 0.09)); }
        else if (ty === 'rainbow' || ty === 'flower') { [523, 659, 784, 988, 1175, 1397, 1568].forEach((f, k) => tone(n + k * 0.04, f, 0.1, 'sine', 0.1)); }
        else if (ty === 'heart') { tone(n, 660, 0.15, 'sine', 0.12); tone(n + 0.15, 880, 0.25, 'sine', 0.12); }
        else if (ty === 'water' || ty === 'ice') { for (let k = 0; k < 6; k++) tone(n + k * 0.05, 400 + Math.random() * 600, 0.06, 'sine', 0.1, null, 1200); }
        else if (ty === 'leaf' || ty === 'fruit') { noise(n, 0.4, 0.2, 1600, 'bandpass'); tone(n, 330, 0.2, 'triangle', 0.1, null, 660); }
        else if (ty === 'golden') { tone(n, 392, 0.3, 'square', 0.05, null, 784); [784, 988, 1175, 1568, 1976].forEach((f, k) => tone(n + k * 0.045, f, 0.16, 'triangle', 0.1)); }
        else if (ty === 'pop') { for (let k = 0; k < 5; k++) tone(n + k * 0.06, 600 + k * 180, 0.07, 'square', 0.08, null, 1400); }
        else if (ty === 'demon') { tone(n, 110, 0.45, 'sawtooth', 0.08, null, 55); noise(n, 0.4, 0.18, 600, 'lowpass'); }
        else if (ty === 'spirit') { noise(n, 0.25, 0.12, 2400); tone(n, 523, 0.12, 'triangle', 0.1); tone(n + 0.1, 784, 0.18, 'triangle', 0.1); }
        else { tone(n, 220, 0.4, 'sawtooth', 0.07, null, 1200); noise(n, 0.3, 0.12, 2000); }
        break;
      }
      case 'levelup': [523, 659, 784, 1047, 784, 1047, 1319, 1568].forEach((f, k) => tone(n + k * 0.07, f, 0.14, 'square', 0.09)); break;
      case 'boing': tone(n, 180, 0.3, 'sine', 0.22, null, 760); break;
      case 'splash': noise(n, 0.25, 0.25, 700, 'lowpass'); break;
      case 'munch': for (let k = 0; k < 3; k++) noise(n + k * 0.12, 0.06, 0.3, 1200); tone(n + 0.4, 990, 0.08, 'square', 0.08); tone(n + 0.48, 1320, 0.14, 'square', 0.08); break;
      case 'error': tone(n, 260, 0.1, 'square', 0.08); tone(n + 0.11, 200, 0.14, 'square', 0.08); break;
      case 'rustle': noise(n, 0.16, 0.15, 2600); break;
      case 'buy': tone(n, 1319, 0.06, 'square', 0.1); tone(n + 0.06, 1760, 0.15, 'square', 0.1); break;
      case 'tired': [523, 440, 349, 262].forEach((f, k) => tone(n + k * 0.12, f, 0.16, 'triangle', 0.1)); break;
      default: break;
    }
  }
  function setMuted(m) {
    muted = !!m;
    try { localStorage.setItem('cq_muted', muted ? '1' : '0'); } catch (e) { /* ignore */ }
    if (master && ctx) master.gain.setTargetAtTime(muted ? 0 : 0.9, ctx.currentTime, 0.05);
  }
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend().catch(() => {}); else ctx.resume().catch(() => {});
  });
  return {
    unlock, music, jingle, stopMusic, sfx, setMuted,
    get muted() { return muted; }, get running() { return !!ctx && ctx.state === 'running'; }, get current() { return cur ? cur.name : null; },
    TRACKS,
  };
})();
