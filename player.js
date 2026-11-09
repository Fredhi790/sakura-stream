const DEFAULT_COVER = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
  '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
  '<stop offset="0" stop-color="#ff9ad5"/><stop offset="1" stop-color="#8f7bff"/>' +
  '</linearGradient></defs>' +
  '<rect width="100" height="100" rx="22" fill="url(#g)"/>' +
  '<text x="50" y="68" font-size="56" text-anchor="middle" fill="#fff">&#9834;</text></svg>'
);

const THEMES = {
  dark:     { name: 'Тёмная',   bg: '#14121f', surface: '#1f1b2e', text: '#f3ecff', muted: '#a79cc4', accent: '#ff8fd0', accent2: '#9d8cff', border: '#2e2846' },
  light:    { name: 'Светлая',  bg: '#fff5fa', surface: '#ffffff', text: '#4b3a5e', muted: '#8e7ea6', accent: '#ff6fae', accent2: '#8fb8ff', border: '#f1d6e8' },
  night:    { name: 'Ночь',     bg: '#0b1026', surface: '#151d3d', text: '#e4ecff', muted: '#8d9ccc', accent: '#7fd6ff', accent2: '#c39bff', border: '#243066' },
  sakura:   { name: 'Сакура',   bg: '#2a1b2e', surface: '#3a2540', text: '#ffe9f5', muted: '#d7a9c9', accent: '#ffa6c9', accent2: '#ffd1e8', border: '#55355c' },
  aurora:   { name: 'Аврора',   bg: '#08161c', surface: '#0f2530', text: '#e6fff7', muted: '#8fc7b8', accent: '#5cffc4', accent2: '#7a8cff', border: '#1a3b46' },
  ocean:    { name: 'Океан',    bg: '#061a2e', surface: '#0c2a47', text: '#e3f4ff', muted: '#86b4d6', accent: '#3fc1ff', accent2: '#4ee0d0', border: '#14406a' },
  sunset:   { name: 'Закат',    bg: '#2b1224', surface: '#3d1a2f', text: '#fff0e6', muted: '#e0a9a0', accent: '#ff8a5c', accent2: '#ffc15e', border: '#5e2a40' },
  neon:     { name: 'Неон',     bg: '#0a0614', surface: '#150d26', text: '#f2e9ff', muted: '#a58fd0', accent: '#ff2fd6', accent2: '#19f0ff', border: '#3a1f66' },
  forest:   { name: 'Лес',      bg: '#0f1d14', surface: '#17301f', text: '#eaf7e8', muted: '#9cc79f', accent: '#7be07f', accent2: '#d8f26a', border: '#264a30' },
  mono:     { name: 'Графит',   bg: '#121212', surface: '#1c1c1e', text: '#f2f2f2', muted: '#9a9a9a', accent: '#e5e5e5', accent2: '#8e8e93', border: '#2c2c2e' }
};

const $ = (id) => document.getElementById(id);
let currentlyPlayingId = null;
let isPlaying = false;
let settings = { volume: 80, muted: false, effect: 'petals', theme: 'dark', custom: { bg: '#1a1030', accent: '#ff8fd0' }, bgImage: '' };
let sleepEndTime = null;
let sleepInterval = null;
let playbackStatus = '';

const PLAYER_TEXT = {
  ru: { idle:'Ничего не играет', volume:'Громкость', sleep:'Таймер сна', description:'Остановить радио автоматически', start:'Запустить таймер', cancel:'Отменить', off:'Таймер выключен', remaining:'Осталось', note:'В эфире для тебя', copy:'Скопировать трек', play:'Включить', stop:'Выключить', mute:'Выключить звук', unmute:'Включить звук', options:['5 минут','15 минут','30 минут','45 минут','1 час','1 ч 30 мин','2 часа'] },
  en: { idle:'Nothing is playing', volume:'Volume', sleep:'Sleep timer', description:'Stop the radio automatically', start:'Start timer', cancel:'Cancel', off:'Timer is off', remaining:'Remaining', note:'On air for you', copy:'Copy track', play:'Play', stop:'Stop', mute:'Mute', unmute:'Unmute', options:['5 minutes','15 minutes','30 minutes','45 minutes','1 hour','1 hr 30 min','2 hours'] },
  ja: { idle:'再生していません', volume:'音量', sleep:'スリープタイマー', description:'ラジオを自動的に停止', start:'タイマーを開始', cancel:'解除', off:'タイマーはオフです', remaining:'残り', note:'あなたのために放送中', copy:'曲名をコピー', play:'再生', stop:'停止', mute:'ミュート', unmute:'ミュート解除', options:['5分','15分','30分','45分','1時間','1時間30分','2時間'] }
};
function text() { return PLAYER_TEXT[settings.language] || PLAYER_TEXT.ru; }
function translateStatus(value) {
  const translations = { 'Запасной режим…': ['Fallback mode…', '予備モード…'], 'Играет через запасной режим': ['Playing in fallback mode', '予備モードで再生中'] };
  const entry = translations[value];
  return entry && settings.language === 'en' ? entry[0] : entry && settings.language === 'ja' ? entry[1] : value;
}
function applyLanguage() {
  document.documentElement.lang = PLAYER_TEXT[settings.language] ? settings.language : 'ru';
  const labels = { ru: ['Показать фон', 'Показать интерфейс'], en: ['Show background', 'Show interface'], ja: ['背景を表示', '画面を表示'] }[document.documentElement.lang];
  $('backgroundViewBtn').title = labels[0];
  $('backgroundViewBtn').setAttribute('aria-label', labels[0]);
  $('restoreInterfaceBtn').title = labels[1];
  $('restoreInterfaceBtn').setAttribute('aria-label', labels[1]);
  $('volumeLabel').textContent = text().volume;
  $('sleepLabel').textContent = text().sleep;
  $('sleepDescription').textContent = text().description;
  $('playerMessage').textContent = text().note;
  $('copyBtn').title = text().copy;
  $('copyBtn').setAttribute('aria-label', text().copy);
  $('playStopBtn').title = isPlaying ? text().stop : text().play;
  $('playStopBtn').setAttribute('aria-label', $('playStopBtn').title);
  $('muteBtn').title = settings.muted ? text().unmute : text().mute;
  $('muteBtn').setAttribute('aria-label', $('muteBtn').title);
  [...$('sleepSelect').options].forEach((option, i) => { option.textContent = text().options[i]; });
  if (!isPlaying) $('nowName').textContent = text().idle;
  if (playbackStatus) $('nowTrack').firstElementChild.textContent = translateStatus(playbackStatus);
  updateSleepUI();
}

function setBackgroundView(active) {
  document.body.classList.toggle('background-view', active);
  $('restoreInterfaceBtn').classList.toggle('hidden', !active);
  (active ? $('restoreInterfaceBtn') : $('backgroundViewBtn')).focus();
}
$('backgroundViewBtn').addEventListener('click', () => setBackgroundView(true));
$('restoreInterfaceBtn').addEventListener('click', () => setBackgroundView(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.body.classList.contains('background-view')) setBackgroundView(false);
});

function send(msg) {
  return chrome.runtime.sendMessage(msg).catch(() => null);
}

function isLight(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) > 160;
}

function getPalette() {
  if (settings.theme !== 'custom') return THEMES[settings.theme] || THEMES.dark;
  const bg = settings.custom.bg;
  const accent = settings.custom.accent;
  const light = isLight(bg);
  return {
    bg, surface: light ? '#ffffffe6' : '#ffffff14',
    text: light ? '#2b2233' : '#f7f2ff', muted: light ? '#6e6280' : '#b9afd3',
    accent, accent2: accent, border: light ? '#00000022' : '#ffffff26'
  };
}

function applyTheme() {
  const p = getPalette();
  const root = document.documentElement.style;
  root.setProperty('--bg', p.bg);
  root.setProperty('--surface', p.surface);
  root.setProperty('--text', p.text);
  root.setProperty('--muted', p.muted);
  root.setProperty('--accent', p.accent);
  root.setProperty('--accent2', p.accent2);
  root.setProperty('--border', p.border);
  root.setProperty('--on-accent', isLight(p.accent) ? '#14121f' : '#ffffff');
  
  document.body.style.setProperty('--player-bg-image', settings.bgImage ? `url("${settings.bgImage.replace(/"/g, '%22')}")` : 'none');
}

const rnd = (a, b) => a + Math.random() * (b - a);

const FX_SPECS = {
  petals: { n: 25, cls: 'fx-petal', vars: () => ({ '--x': rnd(0, 100) + '%', '--s': rnd(10, 18) + 'px', '--d': rnd(6, 12) + 's', '--delay': -rnd(0, 12) + 's' }) },
  snow: { n: 22, cls: 'fx-snow', vars: () => ({ '--x': rnd(0, 100) + '%', '--s': rnd(2, 6) + 'px', '--d': rnd(8, 15) + 's', '--delay': -rnd(0, 15) + 's', '--dx': rnd(8, 24) + 'px' }) },
  stars: { n: 18, cls: 'fx-star', vars: () => ({ '--x': rnd(0, 100) + '%', '--y': rnd(0, 100) + '%', '--s': rnd(5, 10) + 'px', '--d': rnd(2.5, 5) + 's', '--delay': -rnd(0, 5) + 's' }) },
  fireflies: { n: 20, cls: 'fx-firefly', vars: () => ({ '--x': rnd(0, 100) + '%', '--y': rnd(10, 90) + '%', '--s': rnd(4, 8) + 'px', '--d': rnd(4, 9) + 's', '--delay': -rnd(0, 9) + 's', '--dx': rnd(-40, 40) + 'px', '--dy': rnd(-40, 40) + 'px' }) },
  bubbles: { n: 9, cls: 'fx-bubble', vars: () => ({ '--x': rnd(0, 100) + '%', '--s': rnd(10, 24) + 'px', '--d': rnd(8, 15) + 's', '--delay': -rnd(0, 15) + 's', '--dx': rnd(-20, 20) + 'px' }) },
  rain: { n: 35, cls: 'fx-rain', vars: () => ({ '--x': rnd(0, 110) + '%', '--s': rnd(16, 30) + 'px', '--d': rnd(0.6, 1.2) + 's', '--delay': -rnd(0, 1.2) + 's' }) },
  hearts: { n: 15, cls: 'fx-heart', text: () => '♥', vars: () => ({ '--x': rnd(0, 95) + '%', '--s': rnd(14, 24) + 'px', '--d': rnd(6, 12) + 's', '--delay': -rnd(0, 12) + 's', '--dx': rnd(-20, 20) + 'px' }) },
  notes: { n: 15, cls: 'fx-note', text: () => (Math.random() < 0.5 ? '♪' : '♫'), vars: () => ({ '--x': rnd(0, 95) + '%', '--s': rnd(14, 24) + 'px', '--d': rnd(6, 12) + 's', '--delay': -rnd(0, 12) + 's', '--dx': rnd(-20, 20) + 'px' }) }
};

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

function buildEffects(effectId) {
  const container = $('fx');
  container.innerHTML = '';
  const spec = FX_SPECS[effectId];
  if (!spec) return;
  const add = (cls, vars, text) => {
    const n = el('span', 'fx-item ' + cls, text);
    for (const [k, v] of Object.entries(vars)) n.style.setProperty(k, v);
    container.appendChild(n);
  };
  for (let i = 0; i < spec.n; i++) add(spec.cls, spec.vars(), spec.text ? spec.text() : null);
}

function updateUI(name, track, icon, playing) {
  playbackStatus = '';
  $('nowName').textContent = name || text().idle;
  const trackSpan = $('nowTrack').firstElementChild;
  trackSpan.textContent = track || '';
  $('copyBtn').classList.toggle('hidden', !track);
  
  const cover = $('nowCover');
  cover.src = icon || DEFAULT_COVER;
  
  $('miniPlayer').classList.toggle('playing', playing);
  const btn = $('playStopBtn');
  if (playing) {
    btn.textContent = '■';
    btn.classList.replace('play', 'stop');
  } else {
    btn.textContent = '▶';
    btn.classList.replace('stop', 'play');
  }
  btn.title = playing ? text().stop : text().play;
  btn.setAttribute('aria-label', btn.title);
}

function updateVolumeUI() {
  $('volume').value = settings.volume;
  $('volumeVal').textContent = `${settings.volume}%`;
  $('muteBtn').textContent = settings.muted ? '🔇' : '🔊';
  $('muteBtn').title = settings.muted ? text().unmute : text().mute;
  $('muteBtn').setAttribute('aria-label', $('muteBtn').title);
}

function updateSleepUI() {
  const btn = $('sleepBtn');
  const select = $('sleepSelect');
  
  if (sleepEndTime && sleepEndTime > Date.now()) {
    const diff = sleepEndTime - Date.now();
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    btn.textContent = text().cancel;
    $('sleepStatus').textContent = `${text().remaining} ${mins}:${secs.toString().padStart(2, '0')}`;
    $('sleepStatus').classList.add('active');
    btn.classList.add('active');
    select.disabled = false;
    if (!sleepInterval) sleepInterval = setInterval(updateSleepUI, 1000);
  } else {
    if (sleepEndTime) sleepEndTime = null;
    btn.textContent = text().start;
    $('sleepStatus').textContent = text().off;
    $('sleepStatus').classList.remove('active');
    btn.classList.remove('active');
    select.disabled = false;
    if (sleepInterval) { clearInterval(sleepInterval); sleepInterval = null; }
  }
}

async function copyTrack() {
  const text = $('nowTrack').firstElementChild.textContent;
  if (!text) return;
  try { await navigator.clipboard.writeText(text); } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  const btn = $('copyBtn');
  btn.textContent = '✓';
  btn.classList.add('done');
  setTimeout(() => { btn.textContent = '⧉'; btn.classList.remove('done'); }, 1500);
}

$('copyBtn').addEventListener('click', copyTrack);
$('nowTrack').addEventListener('click', copyTrack);

$('playStopBtn').addEventListener('click', async () => {
  if (isPlaying) {
    await send({ action: 'STOP' });
    isPlaying = false;
    currentlyPlayingId = null;
    sleepEndTime = null;
    updateSleepUI();
    updateUI();
  } else {
    const data = await chrome.storage.local.get('radioStations');
    const stations = data.radioStations || [];
    if (stations.length > 0) {
      const st = stations[0];
      // Мгновенно обновляем интерфейс мини-плеера
      currentlyPlayingId = st.id;
      isPlaying = true;
      updateUI(st.name, '', st.iconUrl, true);

      await send({
        action: 'PLAY',
        id: st.id,
        url: st.streamUrl,
        programUrl: st.programUrl || '',
        volume: settings.muted ? 0 : settings.volume / 100
      });
    }
  }
});

$('muteBtn').addEventListener('click', () => {
  settings.muted = !settings.muted;
  updateVolumeUI();
  send({ action: 'SET_VOLUME', volume: settings.muted ? 0 : settings.volume / 100 });
  chrome.storage.local.get('radioSettings', res => {
    chrome.storage.local.set({ radioSettings: { ...(res.radioSettings || {}), ...settings } });
  });
});

$('volume').addEventListener('input', (e) => {
  settings.volume = Number(e.target.value);
  if (settings.volume > 0) settings.muted = false;
  updateVolumeUI();
  send({ action: 'SET_VOLUME', volume: settings.muted ? 0 : settings.volume / 100 });
  chrome.storage.local.get('radioSettings', res => {
    chrome.storage.local.set({ radioSettings: { ...(res.radioSettings || {}), ...settings } });
  });
});

$('sleepBtn').addEventListener('click', async () => {
  if (sleepEndTime) {
    sleepEndTime = null;
    updateSleepUI();
    if (sleepInterval) { clearInterval(sleepInterval); sleepInterval = null; }
    send({ action: 'SET_SLEEP_TIMER', minutes: 0 });
  } else {
    const mins = Number($('sleepSelect').value);
    if (mins > 0) {
      sleepEndTime = Date.now() + mins * 60000;
      updateSleepUI();
      send({ action: 'SET_SLEEP_TIMER', minutes: mins });
      if (sleepInterval) clearInterval(sleepInterval);
      sleepInterval = setInterval(updateSleepUI, 1000);
    }
  }
});

$('sleepSelect').addEventListener('change', async () => {
  if (!sleepEndTime) return;
  const minutes = Number($('sleepSelect').value);
  sleepEndTime = Date.now() + minutes * 60000;
  updateSleepUI();
  await send({ action: 'SET_SLEEP_TIMER', minutes });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'NOW_PLAYING' || message.action === 'PLAYBACK_STATUS') {
    if (message.id === currentlyPlayingId) {
      playbackStatus = message.action === 'PLAYBACK_STATUS' ? (message.text || '') : '';
      $('nowTrack').firstElementChild.textContent = message.track || translateStatus(playbackStatus);
      $('copyBtn').classList.toggle('hidden', !message.track);
    }
  }
  if (message.action === 'PLAYBACK_ERROR' || message.action === 'SLEEP_TIMER_FIRED') {
    isPlaying = false;
    currentlyPlayingId = null;
    sleepEndTime = null;
    updateSleepUI();
    updateUI();
  }
  if (message.action === 'SLEEP_TIMER_UPDATED') {
    sleepEndTime = message.sleepEndTime || null;
    updateSleepUI();
    if (sleepEndTime && !sleepInterval) sleepInterval = setInterval(updateSleepUI, 1000);
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.radioSettings) {
    const newSettings = changes.radioSettings.newValue || {};
    const visualChanged = newSettings.theme !== settings.theme || JSON.stringify(newSettings.custom) !== JSON.stringify(settings.custom) || newSettings.bgImage !== settings.bgImage || newSettings.effect !== settings.effect;
    settings = { ...settings, ...newSettings };
    if (visualChanged) { applyTheme(); buildEffects(settings.effect); }
    applyLanguage();
    updateVolumeUI();
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'session' && changes.sleepEndTime) {
    sleepEndTime = changes.sleepEndTime.newValue || null;
    updateSleepUI();
    if (sleepEndTime && !sleepInterval) sleepInterval = setInterval(updateSleepUI, 1000);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  $('nowCover').addEventListener('error', (e) => {
    if (e.target.src !== DEFAULT_COVER) e.target.src = DEFAULT_COVER;
  });

  const state = await send({ action: 'GET_STATE' });
  const data = await chrome.storage.local.get(['radioStations', 'radioSettings']);
  
  const stations = data.radioStations || [];
  const saved = data.radioSettings || {};
  settings = { ...settings, ...saved };
  applyLanguage();
  
  applyTheme();
  buildEffects(settings.effect);

  currentlyPlayingId = state?.playingId ?? null;
  isPlaying = !!currentlyPlayingId;

  const currentStation = stations.find(s => s.id === currentlyPlayingId);
  
  sleepEndTime = state?.sleepEndTime || null;
  updateSleepUI();
  if (sleepEndTime) {
    if (sleepInterval) clearInterval(sleepInterval);
    sleepInterval = setInterval(updateSleepUI, 1000);
  }

  updateVolumeUI();
  updateUI(
    currentStation ? currentStation.name : '',
    state?.track || '',
    currentStation ? currentStation.iconUrl : '',
    isPlaying
  );
});
