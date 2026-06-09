import { saveUsers } from './config.js';
import { computeDescriptor } from './face-engine.js';
import { setState, S } from './state.js';

let _users = [];

export function initAdmin(users) {
  _users = users;
  setState(S.ADMIN);
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  const adminScreen = document.getElementById('screen-admin');
  adminScreen.classList.remove('hidden');
  renderUserList();
  document.getElementById('admin-back').addEventListener('click', () => {
    location.reload();
  }, { once: true });
}

function renderUserList() {
  const container = document.getElementById('admin-users');
  container.innerHTML = '';
  _users.forEach(user => {
    const enrolled = !!user.descriptor;

    const card = document.createElement('div');
    card.className = 'admin-user-card';

    const info = document.createElement('div');
    info.className = 'admin-user-info';

    const nameEl = document.createElement('h3');
    nameEl.textContent = user.name;

    const pathTag = document.createElement('span');
    pathTag.className = `path-tag ${user.path}`;
    pathTag.textContent = `${user.path} path`;

    const enrolledEl = document.createElement('div');
    enrolledEl.className = `admin-enrolled ${enrolled ? 'yes' : 'no'}`;
    enrolledEl.textContent = enrolled ? '● Face enrolled' : '○ Not enrolled';

    info.appendChild(nameEl);
    info.appendChild(pathTag);
    info.appendChild(enrolledEl);

    const actions = document.createElement('div');
    actions.className = 'admin-user-actions';

    const visitBtn = document.createElement('button');
    visitBtn.className = 'admin-btn admin-btn-visit';
    visitBtn.textContent = 'Visit Path';
    visitBtn.addEventListener('click', () => {
      document.getElementById('screen-admin').classList.add('hidden');
      import('./main.js').then(m => m.revealPath(user.path));
    });

    const enrollBtn = document.createElement('button');
    enrollBtn.className = 'admin-btn admin-btn-enroll';
    enrollBtn.textContent = enrolled ? 'Re-enroll' : 'Enroll Face';
    enrollBtn.addEventListener('click', () => openEnrollModal(user));

    actions.appendChild(visitBtn);
    actions.appendChild(enrollBtn);
    card.appendChild(info);
    card.appendChild(actions);
    container.appendChild(card);
  });
}

function openEnrollModal(user) {
  const modal = document.getElementById('admin-enroll-modal');
  document.getElementById('enroll-title').textContent = `Enrolling: ${user.name}`;
  document.getElementById('enroll-status').textContent = 'Position face in frame, then capture';
  modal.classList.remove('hidden');

  const enrollVideo = document.getElementById('enroll-video');
  const portalVideo = document.getElementById('portal-video');
  let ownStream = null;
  let cancelled = false;

  const captureBtn = document.getElementById('enroll-capture');
  const cancelBtn  = document.getElementById('enroll-cancel');

  const newCaptureBtn = captureBtn.cloneNode(true);
  const newCancelBtn  = cancelBtn.cloneNode(true);
  captureBtn.replaceWith(newCaptureBtn);
  cancelBtn.replaceWith(newCancelBtn);

  // Disable until video is playing
  newCaptureBtn.disabled = true;
  document.getElementById('enroll-status').textContent = 'Waiting for camera...';

  function onVideoReady() {
    if (cancelled) return;
    newCaptureBtn.disabled = false;
    document.getElementById('enroll-status').textContent = 'Position face in frame, then capture';
  }

  enrollVideo.addEventListener('playing', onVideoReady, { once: true });

  // Reuse portal stream to avoid dual-camera conflict on mobile
  if (portalVideo?.srcObject) {
    enrollVideo.srcObject = portalVideo.srcObject;
    enrollVideo.play().catch(() => {});
    // If already playing (e.g. same stream reused), fire ready immediately
    if (!enrollVideo.paused && enrollVideo.readyState >= 3) onVideoReady();
  } else {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then(s => {
        if (cancelled) { s.getTracks().forEach(t => t.stop()); return; }
        ownStream = s;
        enrollVideo.srcObject = s;
        enrollVideo.play().catch(() => {});
      })
      .catch(() => {
        document.getElementById('enroll-status').textContent = 'Camera access denied. Cannot enroll.';
      });
  }

  function cleanup() {
    cancelled = true;
    enrollVideo.removeEventListener('playing', onVideoReady);
    if (ownStream) { ownStream.getTracks().forEach(t => t.stop()); ownStream = null; }
    enrollVideo.srcObject = null;
    modal.classList.add('hidden');
    renderUserList();
  }

  function handleCapture() {
    newCaptureBtn.disabled = true;
    document.getElementById('enroll-status').textContent = 'Computing descriptor...';
    computeDescriptor(enrollVideo)
      .then(descriptor => {
        if (!descriptor) {
          document.getElementById('enroll-status').textContent = 'No face detected. Try again.';
          newCaptureBtn.disabled = false;
          return;
        }
        user.descriptor = descriptor;
        saveUsers(_users);
        cleanup();
      })
      .catch(err => {
        document.getElementById('enroll-status').textContent = 'Error: ' + (err.message || 'unknown');
        newCaptureBtn.disabled = false;
      });
  }

  newCaptureBtn.addEventListener('click', handleCapture);
  newCancelBtn.addEventListener('click', cleanup, { once: true });
}
