const player = document.getElementById('radioPlayer');

const CONNECT_TIMEOUT = 15000; // 15 секунд на подключение
const META_INTERVAL = 20000;

const S = {
  station: null,
  volume: 1,
  candidates: [],
  idx: 0,
  token: 0,
  playing: false,
  restartPending: false,
  retries: 0,
  ctrl: null,
  objUrl: null,
  connectTimer: null,
  metaTimer: null,
  metaCtrl: null,
  metaOk: null,
  metaFails: 0,
  streamMeta: false,
  lastTrack: ''
};

const post = (msg) => chrome.runtime.sendMessage(msg).catch(() => {});

function notifyError(text) {
  post({ action: 'PLAYBACK_ERROR', message: text });
}

function status(text) {
  if (S.station) post({ action: 'PLAYBACK_STATUS', id: S.station.id, text, playing: S.playing });
}

function buildCandidates(url) {
  // Теперь только прямое подключение и запасной режим (MSE)
  return [
    { mode: 'direct', url, note: '' },
    { mode: 'mse', url, label: 'Запасной режим…', note: 'Играет через запасной режим' }
  ];
}

function cleanupStream() {
  if (S.ctrl) { S.ctrl.abort(); S.ctrl = null; }
  if (S.objUrl) { URL.revokeObjectURL(S.objUrl); S.objUrl = null; }
}

function stopAll() {
  S.token++;
  S.station = null;
  S.playing = false;
  S.restartPending = false;
  clearTimeout(S.connectTimer);
  cleanupStream();
  stopMeta();
  player.pause();
  player.removeAttribute('src');
  player.load();
}

function fatal(text) {
  stopAll();
  notifyError(text);
}

async function startAttempt() {
  const token = ++S.token;
  S.restartPending = false;
  S.playing = false;
  cleanupStream();
  clearTimeout(S.connectTimer);

  const cand = S.candidates[S.idx];
  if (!cand) return fatal('Не удалось подключиться к потоку. Попробуйте использовать VPN.');

  if (cand.label) status(cand.label);
  S.connectTimer = setTimeout(() => onFail(token), CONNECT_TIMEOUT);

  try {
    if (cand.mode === 'direct') {
      player.src = cand.url;
      player.volume = S.volume;
      await player.play();
    } else {
      await playViaMse(cand.url, token);
    }
  } catch (e) {
    if (token !== S.token) return;
    console.warn('Attempt failed:', cand.mode, e);
    if (e && e.name === 'NotAllowedError') return fatal(e.message);
    onFail(token);
  }
}

function onFail(token) {
  if (token !== S.token || !S.station || S.restartPending) return;
  clearTimeout(S.connectTimer);

  if (S.playing) {
    S.restartPending = true;
    S.playing = false;
    if (++S.retries > 5) return fatal('Поток прерван. Попробуйте использовать VPN.');
    setTimeout(() => {
      if (S.station && S.token === token) startAttempt();
    }, 1500);
  } else {
    S.idx++;
    startAttempt();
  }
}

player.addEventListener('playing', () => {
  if (!S.station) return;
  clearTimeout(S.connectTimer);
  if (!S.playing) {
    S.playing = true;
    S.retries = 0;
    const cand = S.candidates[S.idx];
    status(cand ? cand.note : '');
  }
  if (!S.metaCtrl) startMeta();
});

player.addEventListener('error', () => {
  if (!S.station || !player.getAttribute('src')) return;
  onFail(S.token);
});

player.addEventListener('ended', () => {
  if (S.station) onFail(S.token);
});

async function playViaMse(url, token) {
  const ctrl = new AbortController();
  S.ctrl = ctrl;

  const resp = await fetch(url, {
    headers: { 'Icy-MetaData': '1' },
    signal: ctrl.signal,
    cache: 'no-store'
  });
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  if (token !== S.token) return;

  const ct = (resp.headers.get('content-type') || '').toLowerCase();
  let mime = 'audio/mpeg';
  if (/aac|mp4|m4a/.test(ct)) mime = 'audio/aac';
  else if (/ogg|opus|vorbis/.test(ct)) throw new Error('Формат не поддерживается в запасном режиме');
  if (!MediaSource.isTypeSupported(mime)) throw new Error('Формат не поддерживается');

  const metaint = parseInt(resp.headers.get('icy-metaint') || '0', 10);
  let parser = null;
  if (metaint > 0) {
    S.streamMeta = true;
    const id = S.station.id;
    parser = createIcyParser(metaint, (text) => {
      const t = parseStreamTitle(text);
      if (t) emitTrack(id, t);
    });
  }

  const ms = new MediaSource();
  S.objUrl = URL.createObjectURL(ms);
  player.src = S.objUrl;
  player.volume = S.volume;

  await new Promise((resolve, reject) => {
    ms.addEventListener('sourceopen', resolve, { once: true });
    setTimeout(() => reject(new Error('MediaSource timeout')), 5000);
  });
  if (token !== S.token) return;

  const sb = ms.addSourceBuffer(mime);
  const queue = [];

  const trim = (force) => {
    if (!sb.buffered.length) return false;
    const start = sb.buffered.start(0);
    const cur = player.currentTime;
    const limit = force ? 5 : 40;
    if (cur - start > limit) {
      try { sb.remove(start, Math.max(start + 1, cur - (force ? 3 : 20))); return true; } catch { /* ignore */ }
    }
    return false;
  };

  const pump = () => {
    if (sb.updating || ms.readyState !== 'open') return;
    if (trim(false)) return;
    const next = queue.shift();
    if (!next) return;
    try {
      sb.appendBuffer(next);
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        queue.unshift(next);
        trim(true);
      } else {
        console.warn('appendBuffer error', e);
        onFail(token);
      }
    }
  };
  sb.addEventListener('updateend', pump);

  const reader = resp.body.getReader();
  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const parts = parser ? parser(value) : [value];
        for (const p of parts) if (p.length) queue.push(p);
        pump();
      }
      if (token === S.token) onFail(token);
    } catch (e) {
      if (token === S.token && e.name !== 'AbortError') onFail(token);
    }
  })();

  player.play().catch((e) => {
    if (token === S.token && e.name === 'NotAllowedError') fatal(e.message);
  });
}

function createIcyParser(metaint, onMeta) {
  let state = 'audio';
  let remaining = metaint;
  let metaLeft = 0;
  let metaBuf = [];

  return function parse(chunk) {
    const out = [];
    let i = 0;
    while (i < chunk.length) {
      if (state === 'audio') {
        const n = Math.min(remaining, chunk.length - i);
        out.push(chunk.subarray(i, i + n));
        i += n;
        remaining -= n;
        if (remaining === 0) state = 'len';
      } else if (state === 'len') {
        metaLeft = chunk[i++] * 16;
        metaBuf = [];
        if (metaLeft === 0) { state = 'audio'; remaining = metaint; }
        else state = 'meta';
      } else {
        const n = Math.min(metaLeft, chunk.length - i);
        for (let j = 0; j < n; j++) metaBuf.push(chunk[i + j]);
        i += n;
        metaLeft -= n;
        if (metaLeft === 0) {
          onMeta(decodeBytes(new Uint8Array(metaBuf)));
          state = 'audio';
          remaining = metaint;
        }
      }
    }
    return out;
  };
}

function decodeBytes(bytes) {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder('windows-1251').decode(bytes);
  }
}

function parseStreamTitle(text) {
  const m = text.match(/StreamTitle='([\s\S]*?)';/) || text.match(/StreamTitle='([\s\S]*)'/);
  const t = m ? m[1].replace(/\0/g, '').trim() : '';
  return /^[-–—\s]*$/.test(t) ? '' : t;
}

function cleanTrack(raw) {
  let t = String(raw || '');
  if (/[<&]/.test(t)) {
    t = new DOMParser().parseFromString(t, 'text/html').documentElement.textContent || '';
  }
  return t.replace(/^\s*В эфире:\s*/i, '').replace(/\s+/g, ' ').trim();
}

function emitTrack(id, track) {
  if (!S.station || S.station.id !== id) return;
  track = cleanTrack(track);
  if (!track || track === S.lastTrack) return;
  S.lastTrack = track;
  post({ action: 'NOW_PLAYING', id, track });
}

const timeout = (sig, ms) => AbortSignal.any([sig, AbortSignal.timeout(ms)]);

async function readIcy(url, sig) {
  const ctrl = new AbortController();
  const resp = await fetch(url, {
    headers: { 'Icy-MetaData': '1' },
    signal: AbortSignal.any([sig, ctrl.signal, AbortSignal.timeout(12000)]),
    cache: 'no-store'
  });
  const metaint = parseInt(resp.headers.get('icy-metaint') || '0', 10);
  if (!(metaint > 0)) { ctrl.abort(); return ''; }

  let result = '';
  const parser = createIcyParser(metaint, (text) => {
    const t = parseStreamTitle(text);
    if (t) result = t;
  });
  const reader = resp.body.getReader();
  let total = 0;
  try {
    while (!result && total < metaint * 3 + 8192) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      parser(value);
    }
  } finally {
    ctrl.abort();
    reader.cancel().catch(() => {});
  }
  return result;
}

const joinTrack = (artist, title) =>
  artist && title && !title.toLowerCase().includes(artist.toLowerCase())
    ? `${artist} — ${title}` : (title || artist || '');

async function fromIcecast(url, sig) {
  const u = new URL(url);
  const r = await fetch(u.origin + '/status-json.xsl', { signal: timeout(sig, 6000), cache: 'no-store' });
  if (!r.ok) return '';
  const j = await r.json();
  const src = j?.icestats?.source;
  if (!src) return '';
  const arr = Array.isArray(src) ? src : [src];
  const m = arr.find(s => (s.listenurl || '').endsWith(u.pathname)) || arr[0];
  return joinTrack(m.artist, m.title) || m.yp_currently_playing || '';
}

async function fromShoutcast(url, sig) {
  const u = new URL(url);
  try {
    const r = await fetch(u.origin + '/7.html', { signal: timeout(sig, 6000), cache: 'no-store' });
    if (r.ok) {
      const txt = await r.text();
      const m = txt.match(/<body>([\s\S]*?)<\/body>/i);
      if (m) {
        const t = m[1].split(',').slice(6).join(',').trim();
        if (t) return t;
      }
    }
  } catch { if (sig.aborted) return ''; }
  const r2 = await fetch(u.origin + '/stats?sid=1&json=1', { signal: timeout(sig, 6000), cache: 'no-store' });
  if (!r2.ok) return '';
  const j = await r2.json();
  return j.songtitle || '';
}

function findTrack(o, depth = 0) {
  if (!o || typeof o !== 'object' || depth > 5) return '';
  const keys = Object.keys(o);
  const str = (names) => {
    for (const k of keys) {
      if (names.includes(k.toLowerCase()) && typeof o[k] === 'string' && o[k].trim()) return o[k].trim();
    }
    return '';
  };
  const title = str(['title', 'song', 'songtitle', 'song_title', 'current_song', 'currentsong',
    'currenttrack', 'current_track', 'nowplaying', 'now_playing', 'on_air', 'track', 'trackname']);
  if (title) return joinTrack(str(['artist', 'performer', 'singer']), title);

  const skip = /histor|prev|next|upcoming|schedule/i;
  const pref = /now|current|song|track|playing/i;
  const sorted = keys.filter(k => !skip.test(k)).sort((a, b) => pref.test(b) - pref.test(a));
  for (const k of sorted) {
    const r = findTrack(o[k], depth + 1);
    if (r) return r;
  }
  return '';
}

async function fromProgramUrl(url, sig) {
  const r = await fetch(url, { signal: timeout(sig, 8000), cache: 'no-store' });
  if (!r.ok) return '';
  const txt = await r.text();
  try {
    return findTrack(JSON.parse(txt));
  } catch {
    return '';
  }
}

function hasHost(st, domain) {
  return [st.url, st.programUrl].some((u) => {
    try { return new URL(u).hostname.endsWith(domain); } catch { return false; }
  });
}

async function fromAnison(sig) {
  const r = await fetch('https://anison.fm/status.php?widget=true', { signal: timeout(sig, 6000), cache: 'no-store' });
  if (!r.ok) return '';
  let j = JSON.parse(await r.text());
  if (Array.isArray(j)) j = j[0];
  return (j && j.on_air) ? j.on_air : findTrack(j);
}

function formatMoe(song) {
  const artists = (song.artists || []).map(a => a.nameRomaji || a.name).filter(Boolean).join(', ');
  return joinTrack(artists, song.title || '');
}

function startListenMoe(st, ctrl) {
  let kpop = false;
  try { kpop = new URL(st.url).pathname.startsWith('/kpop'); } catch { /* ignore */ }
  const wsUrl = 'wss://listen.moe' + (kpop ? '/kpop' : '') + '/gateway_v2';
  let ws = null;
  let hb = null;

  const connect = () => {
    if (S.metaCtrl !== ctrl) return;
    ws = new WebSocket(wsUrl);
    ws.onmessage = (ev) => {
      let m;
      try { m = JSON.parse(ev.data); } catch { return; }
      if (m.op === 0) {
        clearInterval(hb);
        hb = setInterval(() => {
          if (ws && ws.readyState === 1) ws.send(JSON.stringify({ op: 9 }));
        }, (m.d && m.d.heartbeat) || 45000);
      } else if (m.op === 1 && m.d && m.d.song) {
        emitTrack(st.id, formatMoe(m.d.song));
      }
    };
    ws.onerror = () => { try { ws.close(); } catch { /* ignore */ } };
    ws.onclose = () => {
      clearInterval(hb);
      if (S.metaCtrl === ctrl) S.metaTimer = setTimeout(connect, 5000);
    };
  };

  ctrl.signal.addEventListener('abort', () => {
    clearInterval(hb);
    clearTimeout(S.metaTimer);
    try { if (ws) ws.close(); } catch { /* ignore */ }
  });
  connect();
}

async function fetchTrack(st, sig) {
  const methods = [];
  if (hasHost(st, 'anison.fm')) methods.push(['anison', () => fromAnison(sig)]);
  if (st.programUrl) methods.push(['program', () => fromProgramUrl(st.programUrl, sig)]);
  methods.push(
    ['icy', () => readIcy(st.url, sig)],
    ['icecast', () => fromIcecast(st.url, sig)],
    ['shoutcast', () => fromShoutcast(st.url, sig)]
  );
  methods.sort((a, b) => (b[0] === S.metaOk) - (a[0] === S.metaOk));

  for (const [name, fn] of methods) {
    try {
      const t = await fn();
      if (t) { S.metaOk = name; return t; }
    } catch {
      if (sig.aborted) return '';
    }
  }
  return '';
}

function startMeta() {
  if (S.streamMeta || !S.station) return;

  const st = S.station;
  const ctrl = new AbortController();
  S.metaCtrl = ctrl;
  S.metaFails = 0;

  if (hasHost(st, 'listen.moe')) {
    startListenMoe(st, ctrl);
    return;
  }

  const run = async () => {
    if (S.metaCtrl !== ctrl) return;
    const t = await fetchTrack(st, ctrl.signal);
    if (S.metaCtrl !== ctrl) return;
    if (t) { S.metaFails = 0; emitTrack(st.id, t); }
    else S.metaFails++;
    const delay = S.metaFails >= 3 ? 60000 : (S.metaOk === 'anison' ? 10000 : META_INTERVAL);
    S.metaTimer = setTimeout(run, delay);
  };
  run();
}

function stopMeta() {
  clearTimeout(S.metaTimer);
  if (S.metaCtrl) { S.metaCtrl.abort(); S.metaCtrl = null; }
  S.metaOk = null;
  S.metaFails = 0;
  S.streamMeta = false;
  S.lastTrack = '';
}

function play(m) {
  stopMeta();
  if (typeof m.volume === 'number') S.volume = m.volume;
  player.volume = S.volume;
  S.station = { id: m.id, url: m.url, programUrl: m.programUrl || '' };
  S.candidates = buildCandidates(m.url);
  S.idx = 0;
  S.retries = 0;
  startAttempt();
}

chrome.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case 'PLAY_AUDIO':
      play(message);
      break;

    case 'STOP_AUDIO':
      stopAll();
      break;

    case 'SET_VOLUME':
      if (typeof message.volume === 'number') {
        S.volume = message.volume;
        player.volume = message.volume;
      }
      break;
  }
});
