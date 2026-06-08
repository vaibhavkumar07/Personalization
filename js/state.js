export const S = {
  INIT:          'init',
  SCANNING:      'scanning',
  FACE_DETECTED: 'face_detected',
  NAME_INPUT:    'name_input',
  MATCHING:      'matching',
  NOT_FOUND:     'not_found',
  PATH_LOVE:     'path_love',
  PATH_BESTIE:   'path_bestie',
  PATH_SELF:     'path_self',
  ADMIN:         'admin',
};

let _state = S.INIT;
const _listeners = [];

export function getState() { return _state; }

export function setState(next) {
  if (next === _state) return;
  if (!Object.values(S).includes(next)) {
    throw new Error(`setState: unknown state "${next}"`);
  }
  const prev = _state;
  _state = next;
  _listeners.forEach(fn => fn(next, prev));
}

export function onState(fn) {
  _listeners.push(fn);
  return () => { const i = _listeners.indexOf(fn); if (i > -1) _listeners.splice(i, 1); };
}
