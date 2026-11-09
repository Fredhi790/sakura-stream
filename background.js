// Управление фоновым воспроизведением через Offscreen API
const OFFSCREEN_PATH = 'offscreen.html';
let creatingOffscreen = null;

// Убираем Origin/Referer у запросов самого расширения
async function setupHeaderRules() {
  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: [{
        id: 1,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          requestHeaders: [
            { header: 'origin', operation: 'remove' },
            { header: 'referer', operation: 'remove' }
          ]
        },
        condition: {
          initiatorDomains: [chrome.runtime.id],
          resourceTypes: ['media', 'xmlhttprequest', 'other']
        }
      }]
    });
  } catch (e) {
    console.warn('DNR rules error:', e);
  }
}
setupHeaderRules();

function setBadge(on) {
  try {
    chrome.action.setBadgeBackgroundColor({ color: '#ff6fae' });
    chrome.action.setBadgeText({ text: on ? '▶' : '' });
  } catch { /* ignore */ }
}

chrome.runtime.onStartup.addListener(() => { setBadge(false); });

async function hasOffscreen() {
  const contexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [chrome.runtime.getURL(OFFSCREEN_PATH)]
  });
  return contexts.length > 0;
}

async function ensureOffscreen() {
  if (await hasOffscreen()) return;

  if (!creatingOffscreen) {
    creatingOffscreen = chrome.offscreen.createDocument({
      url: OFFSCREEN_PATH,
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Playing radio streams in the background'
    }).finally(() => { creatingOffscreen = null; });
  }
  await creatingOffscreen;
}

function notify(msg) {
  return chrome.runtime.sendMessage(msg).catch(() => null);
}

// Слушаем таймер сна
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'sleepTimer') {
    await chrome.storage.session.remove(['playingId', 'track', 'trackId', 'sleepEndTime']);
    await notify({ action: 'SLEEP_TIMER_UPDATED', sleepEndTime: null });
    setBadge(false);
    if (await hasOffscreen()) await notify({ action: 'STOP_AUDIO' });
    // Сообщаем попапу, что таймер сработал
    chrome.runtime.sendMessage({ action: 'SLEEP_TIMER_FIRED' }).catch(() => null);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    switch (message.action) {
      case 'PLAY':
        await ensureOffscreen();
        await chrome.storage.session.set({ playingId: message.id });
        await chrome.storage.session.remove(['track', 'trackId']);
        setBadge(true);
        await notify({
          action: 'PLAY_AUDIO',
          id: message.id,
          url: message.url,
          programUrl: message.programUrl || '',
          volume: message.volume
        });
        return { ok: true };

      case 'STOP':
        await chrome.alarms.clear('sleepTimer'); // Сбрасываем таймер при стопе
        await chrome.storage.session.remove(['playingId', 'track', 'trackId', 'sleepEndTime']);
        setBadge(false);
        if (await hasOffscreen()) await notify({ action: 'STOP_AUDIO' });
        return { ok: true };

      case 'SET_VOLUME':
        if (await hasOffscreen()) await notify({ action: 'SET_VOLUME', volume: message.volume });
        return { ok: true };

      case 'GET_STATE': {
        const s = await chrome.storage.session.get(['playingId', 'track', 'trackId', 'sleepEndTime']);
        const playingId = s.playingId ?? null;
        
        return {
          playingId,
          track: playingId && s.trackId === playingId ? (s.track || '') : '',
          sleepEndTime: s.sleepEndTime || null
        };
      }

      case 'NOW_PLAYING':
        await chrome.storage.session.set({ track: message.track || '', trackId: message.id });
        
        if (message.track) {
          const { radioHistory = [] } = await chrome.storage.local.get('radioHistory');
          if (!radioHistory[0] || radioHistory[0].track !== message.track) {
            radioHistory.unshift({ 
              track: message.track, 
              time: Date.now(), 
              stationId: message.id 
            });
            if (radioHistory.length > 15) radioHistory.pop();
            await chrome.storage.local.set({ radioHistory });
          }
        }
        return { ok: true };

      case 'SET_SLEEP_TIMER':
        if (message.minutes > 0) {
          const endTime = Date.now() + message.minutes * 60000;
          await chrome.storage.session.set({ sleepEndTime: endTime });
          await chrome.alarms.create('sleepTimer', { when: endTime });
          await notify({ action: 'SLEEP_TIMER_UPDATED', sleepEndTime: endTime });
        } else {
          await chrome.storage.session.remove('sleepEndTime');
          await chrome.alarms.clear('sleepTimer');
          await notify({ action: 'SLEEP_TIMER_UPDATED', sleepEndTime: null });
        }
        return { ok: true };

      case 'PLAYBACK_ERROR':
        await chrome.storage.session.remove(['playingId', 'track', 'trackId', 'sleepEndTime']);
        setBadge(false);
        return { ok: true };

      default:
        return { ok: true };
    }
  })()
    .then(sendResponse)
    .catch(err => sendResponse({ error: err.message }));

  return true;
});
