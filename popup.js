const DEFAULT_COVER = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
  '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
  '<stop offset="0" stop-color="#ff9ad5"/><stop offset="1" stop-color="#8f7bff"/>' +
  '</linearGradient></defs>' +
  '<rect width="100" height="100" rx="22" fill="url(#g)"/>' +
  '<text x="50" y="68" font-size="56" text-anchor="middle" fill="#fff">&#9834;</text></svg>'
);

const PRESET_STATIONS = [
  { id: 'preset-anison', name: 'Anison.FM', streamUrl: 'https://pool.anison.fm/AniSonFM(320)', iconUrl: 'https://anison.fm/resources/og-image.jpg', programUrl: 'https://anison.fm/status.php?widget=true' },
  { id: 'preset-listenmoe-kpop', name: 'LISTEN.moe K-POP', streamUrl: 'https://listen.moe/kpop/stream', iconUrl: 'https://listen.moe/images/kpop.jpg', programUrl: '' },
  { id: 'preset-energyfm', name: 'Energy FM', streamUrl: 'https://hls-01-gpm.hostingradio.ru/energyfm495/playlist.m3u8', iconUrl: 'https://www.energyfm.ru/favicon.ico', programUrl: 'https://hls-01-gpm.hostingradio.ru/energyfm495/metadata.json' },
  { id: 'preset-laut-anime', name: 'Anime Radio Switzerland', streamUrl: 'https://stream.laut.fm/anime-radio-switzerland', iconUrl: 'https://spotwaveradio.com/assets/station-logos/official/genre-intake-20261022-anime-radio-switzerland-laut-fm-327fda39f475.webp', programUrl: '' },
  { id: 'preset-ronin', name: 'Ronin Radio', streamUrl: 'https://s3.radio.co/sff133d65b/listen', iconUrl: 'https://cdn-profiles.tunein.com/s296483/images/logod.png?t=637151337440000000', programUrl: '' },
  { id: 'preset-j1hits', name: 'J1 Radio HITS', streamUrl: 'https://jenny.torontocast.com:2000/stream/J1HITS', iconUrl: '', programUrl: '' },
  { id: 'preset-gensokyo', name: 'Gensokyo Radio', streamUrl: 'https://stream.gensokyoradio.net/3/', iconUrl: '', programUrl: '' },
  { id: 'preset-japanisu', name: 'Japanisu Radio', streamUrl: 'https://listen.japanisu.com/listen/japanisu/radio.mp3', iconUrl: 'https://liveonlineradio.net/wp-content/uploads/2022/06/Japanisu-Radio-100x47.webp', programUrl: '' },
  { id: 'preset-animenexus', name: 'Radio Anime Nexus', streamUrl: 'https://cast.animenexusla.com/radio/8000/animenexus', iconUrl: '', programUrl: '' },
  { id: 'preset-radio-anime-24', name: 'Radio Anime 24', streamUrl: 'http://91.232.4.33:7028/stream?type=http&nocache=4642', iconUrl: 'https://cdn-radiotime-logos.tunein.com/s154005d.png', programUrl: '' },
  { id: 'preset-yggdrasil-radio', name: 'Yggdrasil Radio', streamUrl: 'http://yggdrasilradio.net:8000/;?type=http&nocache=83', iconUrl: 'https://cdn-radiotime-logos.tunein.com/s120196d.png', programUrl: '' },
  { id: 'preset-anime-radio-de', name: 'Anime Radio De', streamUrl: 'https://anime-radio-de.stream.laut.fm/anime-radio-de?ref=radiodns', iconUrl: 'https://cdn-profiles.tunein.com/s317747/images/logod.png?t=639235476630000000', programUrl: '' },
  { id: 'preset-otaku-world', name: 'Otaku World', streamUrl: 'https://otaku-world.stream.laut.fm/otaku-world?ref=radiodns', iconUrl: 'https://cdn-profiles.tunein.com/s311560/images/logod.png?t=639227700490000000', programUrl: '' },
  { id: 'preset-japan-city-pop', name: 'Japan City Pop', streamUrl: 'https://boxradio-edge-00.streamafrica.net/jpopchill', iconUrl: 'https://cdn-profiles.tunein.com/s341316/images/logod.jpg?t=638783301440000000', programUrl: '' }
];

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

const EFFECTS = [
  { id: 'none',     emoji: '🚫', name: 'Нет' },
  { id: 'petals',   emoji: '🌸', name: 'Сакура' },
  { id: 'snow',     emoji: '❄️', name: 'Снег' },
  { id: 'stars',    emoji: '✨', name: 'Звёзды' },
  { id: 'fireflies',emoji: '💫', name: 'Светлячки' },
  { id: 'bubbles',  emoji: '🫧', name: 'Пузыри' },
  { id: 'rain',     emoji: '🌧️', name: 'Дождь' },
  { id: 'hearts',   emoji: '💖', name: 'Сердечки' },
  { id: 'notes',    emoji: '🎵', name: 'Ноты' }
];

const DEFAULT_SETTINGS = {
  language: 'ru',
  theme: 'dark',
  custom: { bg: '#1a1030', accent: '#ff8fd0' },
  bgImage: '',
  effect: 'petals',
  volume: 80,
  muted: false
};

const UI_TEXT = {
  ru: { now:'Сейчас играет', idle:'Ничего не играет', play:'Включить', stop:'Выключить', folder:'📻 Основные станции', add:'+ Добавить станцию', empty:'Пока пусто… добавь первую станцию ✨', settings:'Оформление и настройки', tagline:'музыка под лепестками', timer:'⏱ Таймер:', start:'Старт', cancelTimer:'Отменить', timerCancelTitle:'Нажмите, чтобы отменить таймер', timerStartTitle:'Запустить таймер', edit:'Редактировать', delete:'Удалить', historyEmpty:'История пуста...', copyTrack:'Скопировать название трека', editStation:'Редактировать станцию', newStation:'Новая станция', name:'Название', nameHint:'Например, Lo-fi Sakura', stream:'Ссылка на поток', image:'Картинка или GIF (необязательно)', program:'Ссылка на программу / JSON с треком (необязательно)', save:'Сохранить', cancel:'Отмена', themes:'Темы', bgColor:'Цвет фона (Своя)', accentColor:'Цвет акцента (Своя)', bgImage:'Фон (URL изображения или GIF)', chooseGif:'Или выбрать GIF с устройства', effects:'Эффекты', history:'История треков', clearHistory:'Очистить историю', restoreStations:'Вернуть станции по умолчанию', resetTheme:'Сбросить оформление', language:'Язык интерфейса', creator:'Создал', love:'с любовью', popout:'Отдельное окно плеера', mute:'Выключить звук', unmute:'Включить звук', connectError:'Не удалось подключиться. Попробуйте VPN', trackHint:'Нажмите, чтобы скопировать', minutes:'минут', hour:'час', halfHour:'1 ч 30 мин', twoHours:'2 часа' },
  en: { now:'Now playing', idle:'Nothing is playing', play:'Play', stop:'Stop', folder:'📻 Main stations', add:'+ Add station', empty:'No stations yet… add your first one ✨', settings:'Appearance and settings', tagline:'music beneath the petals', timer:'⏱ Timer:', start:'Start', cancelTimer:'Cancel', timerCancelTitle:'Click to cancel timer', timerStartTitle:'Start timer', edit:'Edit', delete:'Delete', historyEmpty:'History is empty...', copyTrack:'Copy track title', editStation:'Edit station', newStation:'New station', name:'Name', nameHint:'For example, Lo-fi Sakura', stream:'Stream URL', image:'Image or GIF (optional)', program:'Program / track metadata URL (optional)', save:'Save', cancel:'Cancel', themes:'Themes', bgColor:'Background color (Custom)', accentColor:'Accent color (Custom)', bgImage:'Background (image or GIF URL)', chooseGif:'Or choose a GIF from your device', effects:'Effects', history:'Track history', clearHistory:'Clear history', restoreStations:'Restore default stations', resetTheme:'Reset appearance', language:'Interface language', creator:'Created by', love:'with love', popout:'Open separate player window', mute:'Mute', unmute:'Unmute', connectError:'Could not connect. Try using a VPN', trackHint:'Click to copy', minutes:'minutes', hour:'hour', halfHour:'1 hr 30 min', twoHours:'2 hours' },
  ja: { now:'再生中', idle:'再生していません', play:'再生', stop:'停止', folder:'📻 メイン局', add:'+ 放送局を追加', empty:'放送局がありません。追加してください ✨', settings:'表示と設定', tagline:'花びらの下で音楽を', timer:'⏱ タイマー:', start:'開始', cancelTimer:'解除', timerCancelTitle:'クリックしてタイマーを解除', timerStartTitle:'タイマーを開始', edit:'編集', delete:'削除', historyEmpty:'履歴はありません', copyTrack:'曲名をコピー', editStation:'放送局を編集', newStation:'新しい放送局', name:'名前', nameHint:'例：Lo-fi Sakura', stream:'ストリームURL', image:'画像またはGIF（任意）', program:'番組 / 曲情報URL（任意）', save:'保存', cancel:'キャンセル', themes:'テーマ', bgColor:'背景色（カスタム）', accentColor:'アクセント色（カスタム）', bgImage:'背景（画像またはGIFのURL）', chooseGif:'端末からGIFを選択', effects:'エフェクト', history:'再生履歴', clearHistory:'履歴を消去', restoreStations:'初期放送局に戻す', resetTheme:'表示をリセット', language:'表示言語', creator:'作成者', love:'愛を込めて', popout:'別ウィンドウでプレーヤーを開く', mute:'ミュート', unmute:'ミュート解除', connectError:'接続できません。VPNをお試しください', trackHint:'クリックしてコピー', minutes:'分', hour:'時間', halfHour:'1時間30分', twoHours:'2時間' }
};

const $ = (id) => document.getElementById(id);
const listEl = $('stationsList');
const form = $('addForm');
const toggleBtn = $('toggleFormBtn');

let stations = [];
let settings = structuredClone(DEFAULT_SETTINGS);
let currentlyPlayingId = null;
let editingId = null;
let track = '';
let statusText = '';
let statusTimer = null;
let sleepEndTime = null;
let sleepInterval = null;
let autoSwitchTimer = null;
let connectionMessageTimer = null;
let isAutoSwitching = false;
let autoSwitchOrder = [];
let autoSwitchGeneration = 0;

function cancelAutoSwitch() {
  clearTimeout(autoSwitchTimer);
  clearTimeout(connectionMessageTimer);
  autoSwitchTimer = null;
  connectionMessageTimer = null;
  isAutoSwitching = false;
  autoSwitchOrder = [];
  autoSwitchGeneration++;
}

function markStationOffline(id) {
  const index = stations.findIndex(station => station.id === id);
  if (index < 0) return;
  const [station] = stations.splice(index, 1);
  station.connectionOffline = true;
  stations.push(station);
  saveStations();
  renderStations();
}

function markStationOnline(id) {
  const station = stations.find(item => item.id === id);
  if (!station || !station.connectionOffline) return;
  delete station.connectionOffline;
  saveStations();
}

function autoSwitchMessage(key) {
  const messages = {
    ru: { fixing: ['Мизу-тян ловит волну 📻', 'Мизу-тян настраивается 🌸', 'Мизу-тян ищет сигнал 📡', 'Мизу-тян проснулась 🥱', 'Мизу-тян в эфире 🎙️'], next: ['Мизу-тян меняет волну 🔄', 'Мизу-тян ищет другую 📻', 'Мизу-тян: следующая! ➡️', 'Мизу-тян не сдаётся ✨', 'Мизу-тян в поисках… 🔍'], all: 'Все станции недоступны.', cancel: 'Отменить подключение' },
    en: { fixing: ['Mizu-chan catches a wave 📻', 'Mizu-chan is tuning up 🌸', 'Mizu-chan is looking for a signal 📡', 'Mizu-chan woke up 🥱', 'Mizu-chan is on the air 🎙️'], next: ['Mizu-chan changes the wave 🔄', 'Mizu-chan is looking for another one 📻', 'Mizu-chan: next! ➡️', "Mizu-chan doesn't give up ✨", 'Mizu-chan in search of... 🔍'], all: 'All stations are unavailable.', cancel: 'Cancel connection' },
    ja: { fixing: ['ミズちゃんが電波をキャッチ 📻', 'ミズちゃんがチューニング中 🌸', 'ミズちゃんが電波を探しています 📡', 'ミズちゃんが目を覚ましました 🥱', 'ミズちゃんが放送中 🎙️'], next: ['ミズちゃんが周波数を変えます 🔄', 'ミズちゃんが別の局を探しています 📻', 'ミズちゃん：次へ！ ➡️', 'ミズちゃんはあきらめません ✨', 'ミズちゃんが探し中… 🔍'], all: 'すべての放送局に接続できません。', cancel: '接続をキャンセル' }
  };
  const value = (messages[settings.language] || messages.ru)[key];
  return Array.isArray(value) ? value[Math.floor(Math.random() * value.length)] : value;
}

function t() { return UI_TEXT[settings.language] || UI_TEXT.ru; }
function translateStatus(value) {
  const translations = {
    'Запасной режим…': ['Fallback mode…', '予備モード…'],
    'Играет через запасной режим': ['Playing in fallback mode', '予備モードで再生中']
  };
  const entry = translations[value];
  return entry && settings.language === 'en' ? entry[0] : entry && settings.language === 'ja' ? entry[1] : value;
}

function applyLanguage() {
  const lang = settings.language || 'ru';
  document.documentElement.lang = lang;
  document.querySelectorAll('.language-option').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.language === lang));
  });
  $('nowLabel').textContent = t().now;
  const backgroundLabels = { ru: ['Показать фон', 'Показать интерфейс'], en: ['Show background', 'Show interface'], ja: ['背景を表示', '画面を表示'] }[lang] || ['Показать фон', 'Показать интерфейс'];
  $('backgroundViewBtn').title = backgroundLabels[0];
  $('backgroundViewBtn').setAttribute('aria-label', backgroundLabels[0]);
  $('restoreInterfaceBtn').title = backgroundLabels[1];
  $('restoreInterfaceBtn').setAttribute('aria-label', backgroundLabels[1]);
  $('settingsBtn').title = t().settings;
  $('settingsBtn').setAttribute('aria-label', t().settings);
  $('stationsFolderLabel').textContent = t().folder;
  $('toggleFormBtn').textContent = t().add;
  $('timerLabel').textContent = t().timer;
  $('sleepBtn').textContent = t().start;
  $('languageLabel').textContent = t().language;
  $('tagline').textContent = t().tagline;
  $('popoutBtn').title = t().popout;
  $('muteBtn').title = settings.muted ? t().unmute : t().mute;
  $('nowTrack').title = t().trackHint;
  $('clearHistoryBtn').textContent = t().clearHistory;
  $('restoreStationsBtn').textContent = t().restoreStations;
  $('resetThemeBtn').textContent = t().resetTheme;
  $('themeHeading').textContent = t().themes;
  $('effectsHeading').textContent = t().effects;
  $('historyHeading').textContent = t().history;
  $('bgColorLabel').textContent = t().bgColor;
  $('accentColorLabel').textContent = t().accentColor;
  $('bgImageLabel').textContent = t().bgImage;
  const clearBackgroundLabel = { ru: 'Удалить фон', en: 'Remove background', ja: '背景を削除' }[lang] || 'Remove background';
  $('clearBgImage').title = clearBackgroundLabel;
  $('clearBgImage').setAttribute('aria-label', clearBackgroundLabel);
  const bgHelp = {
    ru: ['Как это сделать?', '🌸 Мизу-тян подсказывает: 🌸', 'Нажмите правой кнопкой мыши на изображение или GIF.', 'Выберите «Копировать адрес изображения» (не само изображение!).', 'Вставьте эту ссылку в настройки.', 'Мизу-тян шепчет: Ссылка должна вести прямо на изображение. Она может заканчиваться на .jpg, .png или .gif, но расширение не обязательно. Ссылка на веб-страницу не подойдёт! 🥺✨', 'Назад'],
    en: ['How do I do this?', '🌸 Mizu chan suggests: 🌸', 'Right-click on the image or GIF.', 'Select “Copy image address” (not the image itself!).', 'Paste this link into the settings.', 'Mizu chan whispers: The link must point directly to the image. It may end in .jpg, .png or .gif, but an extension is not required. A link to a web page will not work! 🥺✨', 'Back'],
    ja: ['どうすればいい？', '🌸 ミズちゃんのアドバイス: 🌸', '画像またはGIFを右クリックします。', '「画像アドレスをコピー」を選びます（画像自体ではありません！）。', 'そのリンクを設定に貼り付けます。', 'ミズちゃんのささやき: 画像への直接リンクが必要です。.jpg、.png、.gifで終わることもありますが、拡張子は必須ではありません。ウェブページへのリンクは使えません！ 🥺✨', '戻る']
  }[lang] || [];
  ['bgHelpBtn', 'bgHelpTitle', 'bgHelpStep1', 'bgHelpStep2', 'bgHelpStep3', 'bgHelpHint', 'bgHelpBack'].forEach((id, i) => { $(id).textContent = bgHelp[i]; });
  $('chooseGifLabel').textContent = t().chooseGif;
  const emptyHistory = $('historyList').querySelector('.empty-msg');
  if (emptyHistory) emptyHistory.textContent = t().historyEmpty;
  $('footerCreated').textContent = t().creator;
  $('footerLove').textContent = t().love;
  $('stationNameLabel').textContent = t().name;
  $('stationName').placeholder = t().nameHint;
  $('streamLabel').textContent = t().stream;
  $('iconLabel').textContent = t().image;
  $('programLabel').textContent = t().program;
  $('saveLabel').textContent = t().save;
  $('cancelLabel').textContent = t().cancel;
  $('formTitle').textContent = editingId ? t().editStation : t().newStation;
  $('timerOption5').textContent = `5 ${t().minutes}`;
  $('timerOption15').textContent = `15 ${t().minutes}`;
  $('timerOption30').textContent = `30 ${t().minutes}`;
  $('timerOption45').textContent = `45 ${t().minutes}`;
  $('timerOption60').textContent = `1 ${t().hour}`;
  $('timerOption90').textContent = t().halfHour;
  $('timerOption120').textContent = t().twoHours;
  $('copyBtn').title = t().copyTrack;
  $('copyBtn').setAttribute('aria-label', t().copyTrack);
  buildThemeGrid();
  buildFxGrid();
  applyTheme();
  updateSleepUI();
  if (!$('settingsView').classList.contains('hidden')) renderHistory();
  updateNowPlaying();
  renderStations();
}

$('languageOptions').addEventListener('click', (event) => {
  const button = event.target.closest('.language-option');
  if (!button) return;
  settings.language = button.dataset.language;
  applyLanguage();
  saveSettings();
});

function setBackgroundView(active) {
  document.body.classList.toggle('background-view', active);
  $('restoreInterfaceBtn').classList.toggle('hidden', !active);
  if (active) $('restoreInterfaceBtn').focus();
  else $('backgroundViewBtn').focus();
}
$('backgroundViewBtn').addEventListener('click', () => setBackgroundView(true));
$('restoreInterfaceBtn').addEventListener('click', () => setBackgroundView(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.body.classList.contains('background-view')) setBackgroundView(false);
});

async function copyText(text, button) {
  try { await navigator.clipboard.writeText(text); } catch {
    const area = document.createElement('textarea');
    area.value = text; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
  }
  button.textContent = '✓'; button.classList.add('done');
  setTimeout(() => { button.textContent = '⧉'; button.classList.remove('done'); }, 1200);
}

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

function makeEq() {
  const eq = el('div', 'eq active');
  for (let i = 0; i < 4; i++) eq.appendChild(el('span'));
  return eq;
}

function hostOf(url) {
  try { return new URL(url).hostname; } catch { return ''; }
}

function makeImg(url, cls) {
  const img = el('img', cls);
  img.alt = '';
  img.referrerPolicy = 'no-referrer';
  img.src = url || DEFAULT_COVER;
  img.addEventListener('error', () => {
    if (img.src !== DEFAULT_COVER) img.src = DEFAULT_COVER;
  });
  return img;
}

function send(msg) { return chrome.runtime.sendMessage(msg).catch(() => null); }
function saveStations() { chrome.storage.local.set({ radioStations: stations }); }
function saveSettings() { chrome.storage.local.set({ radioSettings: settings }); }

function isLight(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) > 160;
}

const rnd = (a, b) => a + Math.random() * (b - a);

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

function buildThemeGrid() {
  const grid = $('themeGrid');
  grid.innerHTML = '';
  const add = (key, name, background) => {
    const chip = el('button', 'theme-chip', name);
    chip.dataset.theme = key;
    chip.style.background = background;
    grid.appendChild(chip);
  };
  const names = { en: ['Dark','Light','Night','Sakura','Aurora','Ocean','Sunset','Neon','Forest','Graphite','Custom'], ja: ['ダーク','ライト','夜','桜','オーロラ','海','夕焼け','ネオン','森','グラファイト','カスタム'] }[settings.language];
  let index = 0;
  for (const [key, p] of Object.entries(THEMES)) {
    add(key, names ? names[index++] : p.name, `linear-gradient(135deg, ${p.bg} 30%, ${p.accent} 70%, ${p.accent2})`);
  }
  add('custom', names ? names[10] : 'Своя', 'conic-gradient(from 90deg, #ff8fd0, #8f7bff, #7fd6ff, #7be07f, #ffc15e, #ff8fd0)');
}

function buildFxGrid() {
  const grid = $('fxGrid');
  grid.innerHTML = '';
  const names = { en: ['None','Sakura','Snow','Stars','Fireflies','Bubbles','Rain','Hearts','Notes'], ja: ['なし','桜','雪','星','蛍','泡','雨','ハート','音符'] }[settings.language];
  for (const [index, fx] of EFFECTS.entries()) {
    const chip = el('button', 'fx-chip');
    chip.dataset.fx = fx.id;
    chip.append(el('span', 'fx-emoji', fx.emoji), el('span', null, names ? names[index] : fx.name));
    grid.appendChild(chip);
  }
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
  root.setProperty('--bg-image', settings.bgImage ? `url("${settings.bgImage.replace(/"/g, '%22')}")` : 'none');

  document.querySelectorAll('.theme-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.theme === settings.theme);
  });
  document.querySelectorAll('.fx-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.fx === settings.effect);
  });

  $('customBg').value = settings.custom.bg;
  $('customAccent').value = settings.custom.accent;
  const localBackground = settings.bgImage.startsWith('data:');
  const displayedUrl = localBackground ? '' : settings.bgImage;
  if ($('customImg').value !== displayedUrl) $('customImg').value = displayedUrl;
  $('customImg').readOnly = localBackground;
  $('customImg').tabIndex = localBackground ? -1 : 0;
  $('localBgStatus').textContent = { ru: 'Изображение с устройства', en: 'Image from device', ja: '端末の画像' }[settings.language] || 'Image from device';
  $('localBgStatus').hidden = !localBackground;
  $('clearBgImage').hidden = !settings.bgImage;
}

const FX_SPECS = {
  petals: { n: 16, cls: 'fx-petal', vars: () => ({ '--x': rnd(0, 100) + '%', '--s': rnd(8, 16) + 'px', '--d': rnd(8, 16) + 's', '--delay': -rnd(0, 16) + 's' }) },
  snow: { n: 30, cls: 'fx-snow', vars: () => ({ '--x': rnd(0, 100) + '%', '--s': rnd(2, 6) + 'px', '--d': rnd(10, 18) + 's', '--delay': -rnd(0, 18) + 's', '--dx': rnd(8, 24) + 'px' }) },
  stars: { n: 24, cls: 'fx-star', vars: () => ({ '--x': rnd(0, 100) + '%', '--y': rnd(0, 100) + '%', '--s': rnd(5, 11) + 'px', '--d': rnd(2.5, 5) + 's', '--delay': -rnd(0, 5) + 's' }) },
  fireflies: { n: 18, cls: 'fx-firefly', vars: () => ({ '--x': rnd(0, 100) + '%', '--y': rnd(10, 90) + '%', '--s': rnd(3, 6) + 'px', '--d': rnd(4, 9) + 's', '--delay': -rnd(0, 9) + 's', '--dx': rnd(-60, 60) + 'px', '--dy': rnd(-70, 70) + 'px' }) },
  bubbles: { n: 12, cls: 'fx-bubble', vars: () => ({ '--x': rnd(0, 100) + '%', '--s': rnd(10, 26) + 'px', '--d': rnd(10, 18) + 's', '--delay': -rnd(0, 18) + 's', '--dx': rnd(-24, 24) + 'px' }) },
  rain: { n: 46, cls: 'fx-rain', vars: () => ({ '--x': rnd(0, 110) + '%', '--s': rnd(14, 26) + 'px', '--d': rnd(0.8, 1.6) + 's', '--delay': -rnd(0, 1.6) + 's' }) },
  hearts: { n: 14, cls: 'fx-heart', text: () => '♥', vars: () => ({ '--x': rnd(0, 95) + '%', '--s': rnd(10, 20) + 'px', '--d': rnd(8, 15) + 's', '--delay': -rnd(0, 15) + 's', '--dx': rnd(-30, 30) + 'px' }) },
  notes: { n: 14, cls: 'fx-note', text: () => (Math.random() < 0.5 ? '♪' : '♫'), vars: () => ({ '--x': rnd(0, 95) + '%', '--s': rnd(12, 22) + 'px', '--d': rnd(8, 15) + 's', '--delay': -rnd(0, 15) + 's', '--dx': rnd(-30, 30) + 'px' }) }
};

function buildEffects() {
  const container = $('fx');
  container.innerHTML = '';
  const spec = FX_SPECS[settings.effect];
  container.classList.toggle('off', !spec);
  if (!spec) return;

  const add = (cls, vars, text) => {
    const n = el('span', 'fx-item ' + cls, text);
    for (const [k, v] of Object.entries(vars)) n.style.setProperty(k, v);
    container.appendChild(n);
  };

  for (let i = 0; i < spec.n; i++) add(spec.cls, spec.vars(), spec.text ? spec.text() : null);

  if (settings.effect === 'stars') {
    for (let i = 0; i < 3; i++) add('fx-shoot', { '--x': rnd(0, 50) + '%', '--y': rnd(0, 40) + '%', '--d': rnd(7, 12) + 's', '--delay': -rnd(0, 10) + 's' });
  }
}

function effectiveVolume() { return settings.muted ? 0 : settings.volume / 100; }

function updateVolumeUI() {
  const slider = $('volume');
  slider.value = settings.volume;
  slider.style.setProperty('--vol', settings.volume + '%');
  slider.classList.toggle('muted', settings.muted || settings.volume === 0);
  $('volumeVal').textContent = settings.volume + '%';
  $('muteBtn').textContent = (settings.muted || settings.volume === 0) ? '🔇' : '🔊';
  $('muteBtn').title = (settings.muted || settings.volume === 0) ? t().unmute : t().mute;
}

function pushVolume() { send({ action: 'SET_VOLUME', volume: effectiveVolume() }); }

function updateSleepUI() {
  const btn = $('sleepBtn');
  const select = $('sleepSelect');
  
  if (sleepEndTime && sleepEndTime > Date.now()) {
    const diff = sleepEndTime - Date.now();
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    
    btn.textContent = t().cancelTimer;
    btn.title = `${t().timerCancelTitle} (${mins}:${secs.toString().padStart(2, '0')})`;
    btn.classList.add('active');
    select.disabled = false;
    if (!sleepInterval) sleepInterval = setInterval(updateSleepUI, 1000);
  } else {
    if (sleepEndTime) sleepEndTime = null;
    btn.textContent = t().start;
    btn.title = t().timerStartTitle;
    btn.classList.remove('active');
    select.disabled = false;
    if (sleepInterval) { clearInterval(sleepInterval); sleepInterval = null; }
  }
}

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
  const mins = Number($('sleepSelect').value);
  sleepEndTime = Date.now() + mins * 60000;
  updateSleepUI();
  await send({ action: 'SET_SLEEP_TIMER', minutes: mins });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'session' || !changes.sleepEndTime) return;
  sleepEndTime = changes.sleepEndTime.newValue || null;
  updateSleepUI();
  if (sleepEndTime && !sleepInterval) sleepInterval = setInterval(updateSleepUI, 1000);
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'SLEEP_TIMER_FIRED') {
    sleepEndTime = null;
    updateSleepUI();
  }
});

function renderTrack() {
  const box = $('nowTrack');
  const span = box.firstElementChild;
  const text = track || translateStatus(statusText);
  const changed = span.textContent !== text;
  if (changed) span.textContent = text;
  $('copyBtn').classList.toggle('hidden', !track);
  box.title = track ? t().trackHint : text;
  if (!changed && box.classList.contains('marquee')) return;
  box.classList.remove('marquee');
  requestAnimationFrame(() => {
    if (span.textContent !== text || !text) return;
    const distance = Math.max(span.scrollWidth - box.clientWidth, 0);
    box.style.setProperty('--scroll-distance', `${distance}px`);
    box.style.setProperty('--scroll-duration', `${Math.max(5, distance / 24 + 3)}s`);
    if (distance > 0) box.classList.add('marquee');
  });
}

async function copyTrack() {
  if (!track) return;
  try { await navigator.clipboard.writeText(track); } catch {
    const ta = document.createElement('textarea');
    ta.value = track;
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

function updateNowPlaying() {
  const s = stations.find(x => x.id === currentlyPlayingId);
  $('nowName').textContent = s ? s.name : t().idle;
  const cover = $('nowCover');
  cover.src = (s && s.iconUrl) ? s.iconUrl : DEFAULT_COVER;
  $('player').classList.toggle('playing', !!s);
  $('eq').classList.toggle('active', !!s);
  const mainPlayBtn = $('mainPlayBtn');
  mainPlayBtn.textContent = s ? '■' : '▶';
  mainPlayBtn.classList.toggle('btn-stop', !!s);
  mainPlayBtn.classList.toggle('btn-play', !s);
  mainPlayBtn.disabled = !s && stations.length === 0;
  mainPlayBtn.title = s && isAutoSwitching ? autoSwitchMessage('cancel') : s ? t().stop : t().play;
  mainPlayBtn.setAttribute('aria-label', s ? `${mainPlayBtn.title}: ${s.name}` : t().play);
  renderTrack();
}

$('mainPlayBtn').addEventListener('click', () => {
  const playingStation = stations.find(s => s.id === currentlyPlayingId);
  if (playingStation) stopPlayback();
  else if (stations.length) play(stations[0]);
});

const stationsFolderBtn = $('stationsFolderBtn');
stationsFolderBtn.addEventListener('click', () => {
  const expanded = stationsFolderBtn.getAttribute('aria-expanded') === 'true';
  stationsFolderBtn.setAttribute('aria-expanded', String(!expanded));
  listEl.hidden = expanded;
  chrome.storage.local.set({ stationsFolderExpanded: !expanded });
});

function play(station, retry = false) {
  if (!retry) {
    cancelAutoSwitch();
    const startIndex = stations.findIndex(s => s.id === station.id);
    autoSwitchOrder = [...stations.slice(startIndex), ...stations.slice(0, startIndex)].map(s => s.id);
  }
  isAutoSwitching = true;
  const generation = ++autoSwitchGeneration;
  clearTimeout(autoSwitchTimer);
  clearTimeout(connectionMessageTimer);
  connectionMessageTimer = setTimeout(() => {
    if (generation !== autoSwitchGeneration || currentlyPlayingId !== station.id || !isAutoSwitching) return;
    statusText = autoSwitchMessage('fixing');
    renderTrack();
  }, 5000);
  autoSwitchTimer = setTimeout(async () => {
    if (generation !== autoSwitchGeneration || currentlyPlayingId !== station.id) return;
    markStationOffline(station.id);
    statusText = autoSwitchMessage('next');
    track = '';
    renderTrack();
    await send({ action: 'STOP' });
    if (generation !== autoSwitchGeneration) return;
    sleepEndTime = null;
    updateSleepUI();
    const currentIndex = autoSwitchOrder.indexOf(station.id);
    const nextId = autoSwitchOrder[(currentIndex + 1) % autoSwitchOrder.length];
    const next = stations.find(s => s.id === nextId);
    if (!next || nextId === autoSwitchOrder[0]) {
      cancelAutoSwitch();
      currentlyPlayingId = null;
      statusText = autoSwitchMessage('all');
      updateNowPlaying();
      renderStations();
      return;
    }
    play(next, true);
    statusText = autoSwitchMessage('next');
    renderTrack();
  }, 10000);
  currentlyPlayingId = station.id;
  track = '';
  statusText = settings.language === 'en' ? 'Connecting…' : settings.language === 'ja' ? '接続中…' : 'Подключение…';
  
  const idx = stations.findIndex(s => s.id === station.id);
  if (!retry && idx > 0 && !station.connectionOffline) {
    const [st] = stations.splice(idx, 1);
    stations.unshift(st);
    saveStations();
  }

  updateNowPlaying();
  renderStations();

  send({
    action: 'PLAY',
    id: station.id,
    url: station.streamUrl,
    programUrl: station.programUrl || '',
    volume: effectiveVolume()
  });
}

function stopPlayback() {
  cancelAutoSwitch();
  currentlyPlayingId = null;
  track = '';
  statusText = '';
  sleepEndTime = null;
  updateSleepUI();
  updateNowPlaying();
  renderStations();
  send({ action: 'STOP' });
}

function deleteStation(id) {
  if (id === currentlyPlayingId) stopPlayback();
  stations = stations.filter(s => s.id !== id);
  saveStations();
  renderStations();
}

function renderStations() {
  listEl.innerHTML = '';
  if (stations.length === 0) {
    listEl.appendChild(el('p', 'empty-msg', t().empty));
    return;
  }

  stations.forEach((s, i) => {
    const isPlaying = s.id === currentlyPlayingId;
    const card = el('div', 'station-item' + (isPlaying ? ' playing' : ''));
    card.style.animationDelay = (i * 70) + 'ms';

    const icon = makeImg(s.iconUrl, 'station-icon');

    const info = el('div', 'station-info');
    info.appendChild(el('div', 'station-name', s.name));
    info.appendChild(el('div', 'station-host', hostOf(s.streamUrl)));
    if (s.connectionOffline) {
      const offlineText = { ru: 'Мизу-тян не в сети 🌙', en: 'Mizu-chan is offline 🌙', ja: 'ミズちゃんはオフラインです 🌙' }[settings.language] || 'Мизу-тян не в сети 🌙';
      info.appendChild(el('div', 'station-offline', offlineText));
    }
    if (isPlaying) info.appendChild(makeEq());

    const controls = el('div', 'station-controls');
    const playBtn = el('button', isPlaying ? 'btn-stop' : 'btn-play', isPlaying ? '■' : '▶');
    playBtn.title = isPlaying && isAutoSwitching ? autoSwitchMessage('cancel') : isPlaying ? t().stop : t().play;
    playBtn.setAttribute('aria-label', `${isPlaying ? t().stop : t().play}: ${s.name}`);
    playBtn.addEventListener('click', () => isPlaying ? stopPlayback() : play(s));

    const editBtn = el('button', 'icon-btn', '✎');
    editBtn.title = t().edit;
    editBtn.addEventListener('click', () => openForm(s));

    const delBtn = el('button', 'icon-btn danger', '✕');
    delBtn.title = t().delete;
    delBtn.addEventListener('click', () => deleteStation(s.id));

    controls.append(playBtn, editBtn, delBtn);
    card.append(icon, info, controls);
    listEl.appendChild(card);
  });
}

async function renderHistory() {
  const { radioHistory = [] } = await chrome.storage.local.get('radioHistory');
  const container = $('historyList');
  container.innerHTML = '';

  if (radioHistory.length === 0) {
    container.appendChild(el('p', 'empty-msg', t().historyEmpty));
    return;
  }

  radioHistory.forEach(item => {
    const timeStr = new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const elItem = el('div', 'history-item');
    const info = el('div', 'history-info');
    info.appendChild(el('div', 'history-track', item.track));
    info.appendChild(el('div', 'history-time', timeStr));
    const copyBtn = el('button', 'history-copy', '⧉');
    copyBtn.type = 'button';
    copyBtn.title = t().copyTrack;
    copyBtn.addEventListener('click', () => copyText(item.track, copyBtn));
    elItem.append(info, copyBtn);
    container.appendChild(elItem);
  });
}

$('clearHistoryBtn').addEventListener('click', async () => {
  await chrome.storage.local.set({ radioHistory: [] });
  renderHistory();
});

function openForm(station = null) {
  editingId = station ? station.id : null;
  $('formTitle').textContent = station ? t().editStation : t().newStation;
  $('stationName').value = station ? station.name : '';
  $('streamUrl').value = station ? station.streamUrl : '';
  $('iconUrl').value = station ? (station.iconUrl || '') : '';
  $('programUrl').value = station ? (station.programUrl || '') : '';
  form.classList.remove('hidden');
  toggleBtn.classList.add('hidden');
  $('stationName').focus();
}

function closeForm() {
  form.classList.add('hidden');
  toggleBtn.classList.remove('hidden');
  form.reset();
  editingId = null;
}

toggleBtn.addEventListener('click', () => openForm());
$('cancelBtn').addEventListener('click', closeForm);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    name: $('stationName').value.trim(),
    streamUrl: $('streamUrl').value.trim(),
    iconUrl: $('iconUrl').value.trim(),
    programUrl: $('programUrl').value.trim()
  };

  if (editingId) {
    const idx = stations.findIndex(s => s.id === editingId);
    if (idx !== -1) stations[idx] = { id: editingId, ...data };
  } else {
    stations.push({ id: Date.now().toString(), ...data });
  }
  saveStations();
  closeForm();
  renderStations();
  updateNowPlaying();
});

// --- ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ ---
$('bgHelpBtn').addEventListener('click', () => {
  $('settingsView').classList.add('hidden');
  $('bgHelpView').classList.remove('hidden');
  $('bgHelpTitle').focus();
});
$('bgHelpBack').addEventListener('click', () => {
  $('bgHelpView').classList.add('hidden');
  $('settingsView').classList.remove('hidden');
  $('bgHelpBtn').focus();
});
$('settingsBtn').addEventListener('click', () => {
  if (!$('bgHelpView').classList.contains('hidden')) {
    $('bgHelpView').classList.add('hidden');
    $('settingsView').classList.remove('hidden');
    $('bgHelpBtn').focus();
    return;
  }
  const opening = $('settingsView').classList.contains('hidden');
  $('settingsView').classList.toggle('hidden', !opening);
  $('mainView').classList.toggle('hidden', opening);
  $('settingsBtn').classList.toggle('active', opening);
  if (opening) renderHistory();
});

// --- ОТДЕЛЬНОЕ ОКНО ---
$('popoutBtn').addEventListener('click', () => {
  chrome.windows.create({
    url: chrome.runtime.getURL('player.html'),
    type: 'popup',
    width: 360,
    height: 350
  });
});

// --- ТЕМЫ И ЭФФЕКТЫ ---
$('themeGrid').addEventListener('click', (e) => {
  const chip = e.target.closest('.theme-chip');
  if (!chip) return;
  settings.theme = chip.dataset.theme;
  applyTheme();
  saveSettings();
});

$('fxGrid').addEventListener('click', (e) => {
  const chip = e.target.closest('.fx-chip');
  if (!chip) return;
  settings.effect = chip.dataset.fx;
  applyTheme();
  buildEffects();
  saveSettings();
});

$('customBg').addEventListener('input', (e) => {
  settings.custom.bg = e.target.value;
  settings.theme = 'custom';
  applyTheme();
  saveSettings();
});

$('customAccent').addEventListener('input', (e) => {
  settings.custom.accent = e.target.value;
  settings.theme = 'custom';
  applyTheme();
  saveSettings();
});

let backgroundSelectionVersion = 0;
$('customImg').addEventListener('input', (e) => {
  backgroundSelectionVersion++;
  settings.bgImage = e.target.value.trim();
  applyTheme();
  saveSettings();
});

$('clearBgImage').addEventListener('click', () => {
  backgroundSelectionVersion++;
  settings.bgImage = '';
  $('customGifFile').value = '';
  applyTheme();
  saveSettings();
  $('customImg').focus();
});

$('customGifFile').addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file || !file.type.startsWith('image/')) return;
  e.target.value = '';
  const selectionVersion = ++backgroundSelectionVersion;
  const image = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  if (selectionVersion !== backgroundSelectionVersion) return;
  settings.bgImage = image;
  applyTheme();
  saveSettings();
});

$('restoreStationsBtn').addEventListener('click', () => {
  for (const p of PRESET_STATIONS) {
    if (!stations.some(s => s.id === p.id || s.streamUrl === p.streamUrl)) stations.push({ ...p });
  }
  saveStations();
  renderStations();
});

$('resetThemeBtn').addEventListener('click', () => {
  backgroundSelectionVersion++;
  $('customGifFile').value = '';
  settings = { ...structuredClone(DEFAULT_SETTINGS), volume: settings.volume, muted: settings.muted, language: settings.language };
  applyTheme();
  buildEffects();
  saveSettings();
});

$('volume').addEventListener('input', (e) => {
  settings.volume = Number(e.target.value);
  if (settings.volume > 0) settings.muted = false;
  updateVolumeUI();
  pushVolume();
  saveSettings();
});

$('muteBtn').addEventListener('click', () => {
  settings.muted = !settings.muted;
  updateVolumeUI();
  pushVolume();
  saveSettings();
});

chrome.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case 'PLAYBACK_ERROR':
      if (isAutoSwitching) break;
      currentlyPlayingId = null;
      track = '';
      statusText = t().connectError;
      updateNowPlaying();
      renderStations();
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => { statusText = ''; renderTrack(); }, 8000);
      break;
    case 'NOW_PLAYING':
      if (message.id === currentlyPlayingId) { if (message.track) { markStationOnline(message.id); cancelAutoSwitch(); updateNowPlaying(); renderStations(); } track = message.track; renderTrack(); }
      break;
    case 'PLAYBACK_STATUS':
      if (message.id === currentlyPlayingId) { if (message.playing) { markStationOnline(message.id); cancelAutoSwitch(); statusText = message.text || ''; updateNowPlaying(); renderStations(); } else if (!isAutoSwitching) { statusText = message.text || ''; } renderTrack(); }
      break;
    case 'SLEEP_TIMER_FIRED':
      stopPlayback();
      break;
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  $('nowCover').addEventListener('error', (e) => {
    if (e.target.src !== DEFAULT_COVER) e.target.src = DEFAULT_COVER;
  });

  const data = await chrome.storage.local.get(['radioStations', 'radioSettings', 'stationsFolderExpanded']);
  const folderExpanded = data.stationsFolderExpanded !== false;
  stationsFolderBtn.setAttribute('aria-expanded', String(folderExpanded));
  listEl.hidden = !folderExpanded;
  if (Array.isArray(data.radioStations) && data.radioStations.length > 0) {
    stations = data.radioStations;
    const updatedPresetIds = new Set(['preset-laut-anime', 'preset-ronin', 'preset-japanisu']);
    let imagesUpdated = false;
    for (const station of stations) {
      if (!station.iconUrl && updatedPresetIds.has(station.id)) {
        station.iconUrl = PRESET_STATIONS.find(preset => preset.id === station.id).iconUrl;
        imagesUpdated = true;
      }
    }
    if (imagesUpdated) saveStations();
  } else {
    stations = PRESET_STATIONS.map(p => ({ ...p }));
    saveStations();
  }

  const saved = data.radioSettings || {};
  settings = { ...structuredClone(DEFAULT_SETTINGS), ...saved, custom: { ...DEFAULT_SETTINGS.custom, ...(saved.custom || {}) } };
  if (!UI_TEXT[settings.language]) settings.language = 'ru';
  if (!THEMES[settings.theme] && settings.theme !== 'custom') settings.theme = 'dark';

  const state = await send({ action: 'GET_STATE' });
  currentlyPlayingId = state?.playingId ?? null;
  track = state?.track || '';
  
  sleepEndTime = state?.sleepEndTime || null;
  updateSleepUI();
  if (sleepEndTime) {
    if (!sleepInterval) sleepInterval = setInterval(updateSleepUI, 1000);
  }

  buildThemeGrid();
  buildFxGrid();
  buildEffects();
  applyTheme();
  applyLanguage();
  updateVolumeUI();
  updateNowPlaying();
  renderStations();
});
