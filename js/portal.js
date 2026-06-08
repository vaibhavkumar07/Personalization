import { loadUsers, ADMIN_PASSWORD, FACE_STABILITY_MS } from './config.js';
import { detectSingle, drawDetection, findMatch } from './face-engine.js';
import { setState, getState, S } from './state.js';

let _users = [];
let _video = null;
let _canvas = null;
let _stableTimer = null;
let _capturedDescriptor = null;
let _detectionLoopId = null;

export function initPortal() {
  _users = loadUsers();
  _video = document.getElementById('portal-video');
  _canvas = document.getElementById('portal-canvas');

  spawnParticles();
  checkSetupMode();
  startCamera();
  bindNameInput();
}

function checkSetupMode() {
  if (window.location.search.includes('setup')) {
    const pw = prompt('Admin password:');
    if (pw === ADMIN_PASSWORD) {
      import('./admin.js').then(m => m.initAdmin(_users));
    } else {
      document.body.innerHTML = '';
    }
  }
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    _video.srcObject = stream;
    _video.addEventListener('playing', () => {
      setState(S.SCANNING);
      setStatus('Scanning...');
      runDetectionLoop();
    }, { once: true });
  } catch {
    setStatus('Camera access needed', 'error');
  }
}

function runDetectionLoop() {
  let frameCount = 0;
  const loop = async () => {
    const state = getState();
    if (state === S.NAME_INPUT || state === S.MATCHING || state === S.ADMIN) {
      _detectionLoopId = requestAnimationFrame(loop);
      return;
    }
    if (frameCount++ % 3 === 0) {
      const det = await detectSingle(_video);
      drawDetection(_canvas, _video, det);
      if (det && state === S.SCANNING) {
        onFaceDetected(det.descriptor);
      } else if (!det && state === S.FACE_DETECTED) {
        clearStableTimer();
        setState(S.SCANNING);
        setStatus('Scanning...');
      }
    }
    _detectionLoopId = requestAnimationFrame(loop);
  };
  _detectionLoopId = requestAnimationFrame(loop);
}

function onFaceDetected(descriptor) {
  if (_stableTimer) return;
  setState(S.FACE_DETECTED);
  setStatus('Face detected ✓', 'detected');
  _capturedDescriptor = descriptor;
  _stableTimer = setTimeout(() => {
    setState(S.NAME_INPUT);
    document.getElementById('scan-line').classList.add('paused');
    document.getElementById('name-wrap').classList.remove('hidden');
    document.getElementById('name-input').focus();
    setStatus('Enter your name');
  }, FACE_STABILITY_MS);
}

function clearStableTimer() {
  clearTimeout(_stableTimer);
  _stableTimer = null;
}

function bindNameInput() {
  const input = document.getElementById('name-input');
  const btn   = document.getElementById('name-btn');
  const submit = () => attemptMatch(input.value.trim());
  btn.addEventListener('click', submit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
}

async function attemptMatch(name) {
  if (!name || !_capturedDescriptor) return;
  setState(S.MATCHING);

  if (name === ADMIN_PASSWORD) {
    const { initAdmin } = await import('./admin.js');
    initAdmin(_users);
    return;
  }

  const faceMatch = findMatch(_capturedDescriptor, _users);
  const nameMatch = faceMatch && name.toLowerCase() === faceMatch.name.toLowerCase();

  if (faceMatch && nameMatch) {
    const { revealPath } = await import('./main.js');
    revealPath(faceMatch.path);
  } else {
    showNotFound();
  }
}

function showNotFound() {
  const notFound = document.getElementById('screen-notfound');
  document.getElementById('screen-portal').classList.add('screen-shake');
  notFound.classList.remove('hidden');
  spawnDeniedParticles();
  setTimeout(() => notFound.classList.add('hidden'), 3000);
  setTimeout(() => {
    document.getElementById('screen-portal').classList.remove('screen-shake');
    resetPortal();
  }, 3200);
}

function spawnDeniedParticles() {
  const container = document.getElementById('denied-particles');
  container.innerHTML = '';
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'denied-particle';
    const angle = (i / 20) * 360;
    const dist = 80 + Math.random() * 120;
    p.style.cssText = `
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      left: 50%; top: 50%;
      --dx: ${Math.cos(angle * Math.PI/180) * dist}px;
      --dy: ${Math.sin(angle * Math.PI/180) * dist}px;
      animation-delay: ${Math.random() * 0.2}s;
    `;
    container.appendChild(p);
  }
}

function resetPortal() {
  _capturedDescriptor = null;
  clearStableTimer();
  const nameWrap = document.getElementById('name-wrap');
  const nameInput = document.getElementById('name-input');
  nameWrap.classList.add('hidden');
  nameInput.value = '';
  document.getElementById('scan-line').classList.remove('paused');
  setState(S.SCANNING);
  setStatus('Scanning...');
}

function setStatus(text, type = '') {
  const el = document.getElementById('portal-status');
  el.textContent = text;
  el.className = type;
}

function spawnParticles() {
  const container = document.getElementById('portal-particles');
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 1 + Math.random() * 3;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${8 + Math.random() * 12}s;
      animation-delay: ${-Math.random() * 20}s;
      opacity: ${0.2 + Math.random() * 0.5};
    `;
    container.appendChild(p);
  }
}
