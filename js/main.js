import { loadModels } from './face-engine.js';
import { initPortal } from './portal.js';
import { initLove } from './paths/love.js';
import { initBestie } from './paths/bestie.js';
import { initSelf } from './paths/self.js';
import { playTrack, bindMuteBtn } from './audio.js';
import { initNav } from './nav.js';
import { setState, S } from './state.js';

export function revealPath(path) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));

  const MAP = {
    love:   { state: S.PATH_LOVE,   screenId: 'screen-love',   init: initLove,   muteBtn: document.getElementById('love-mute')   },
    bestie: { state: S.PATH_BESTIE, screenId: 'screen-bestie', init: initBestie, muteBtn: document.getElementById('bestie-mute') },
    self:   { state: S.PATH_SELF,   screenId: 'screen-self',   init: initSelf,   muteBtn: document.getElementById('self-mute')   },
  };

  const config = MAP[path];
  if (!config) return;

  setState(config.state);
  document.getElementById(config.screenId).classList.remove('hidden');
  config.init();
  playTrack(path);
  bindMuteBtn(config.muteBtn);
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadModels();
  } catch (err) {
    console.error('Failed to load face models:', err);
    const status = document.getElementById('portal-status');
    if (status) { status.textContent = 'Failed to load models. Check connection.'; status.className = 'error'; }
  }
  initPortal();
  initNav();
});
