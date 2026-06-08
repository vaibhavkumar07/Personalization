import { advanceLove } from './paths/love.js';
import { advanceBestie } from './paths/bestie.js';
import { advanceSelf } from './paths/self.js';
import { getState, S } from './state.js';

const HANDLERS = {
  [S.PATH_LOVE]:   advanceLove,
  [S.PATH_BESTIE]: advanceBestie,
  [S.PATH_SELF]:   advanceSelf,
};

export function initNav() {
  document.addEventListener('click', handleAdvance);
  document.addEventListener('touchend', e => { e.preventDefault(); handleAdvance(e); }, { passive: false });
}

function handleAdvance(e) {
  const tag = e.target.tagName.toLowerCase();
  if (['button','input','a'].includes(tag)) return;
  const handler = HANDLERS[getState()];
  if (handler) handler();
}
