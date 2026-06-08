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
    adminScreen.classList.add('hidden');
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
    card.innerHTML = `
      <div class="admin-user-info">
        <h3>${user.name}</h3>
        <span class="path-tag ${user.path}">${user.path} path</span>
        <div class="admin-enrolled ${enrolled ? 'yes' : 'no'}">
          ${enrolled ? '● Face enrolled' : '○ Not enrolled'}
        </div>
      </div>
      <div class="admin-user-actions">
        <button class="admin-btn admin-btn-visit" data-id="${user.id}">Visit Path</button>
        <button class="admin-btn admin-btn-enroll" data-id="${user.id}">
          ${enrolled ? 'Re-enroll' : 'Enroll Face'}
        </button>
      </div>
    `;
    card.querySelector('.admin-btn-visit').addEventListener('click', () => {
      document.getElementById('screen-admin').classList.add('hidden');
      import('./main.js').then(m => m.revealPath(user.path));
    });
    card.querySelector('.admin-btn-enroll').addEventListener('click', () => {
      openEnrollModal(user);
    });
    container.appendChild(card);
  });
}

function openEnrollModal(user) {
  const modal = document.getElementById('admin-enroll-modal');
  document.getElementById('enroll-title').textContent = `Enrolling: ${user.name}`;
  document.getElementById('enroll-status').textContent = 'Position face in frame, then capture';
  modal.classList.remove('hidden');

  const video = document.getElementById('enroll-video');
  let stream = null;
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } }).then(s => {
    stream = s;
    video.srcObject = s;
  });

  const captureBtn = document.getElementById('enroll-capture');
  const cancelBtn  = document.getElementById('enroll-cancel');

  function cleanup() {
    stream?.getTracks().forEach(t => t.stop());
    modal.classList.add('hidden');
    // Re-attach listeners by re-rendering the list (clones replace old nodes)
    renderUserList();
  }

  function handleCapture() {
    document.getElementById('enroll-status').textContent = 'Computing descriptor...';
    computeDescriptor(video).then(descriptor => {
      if (!descriptor) {
        document.getElementById('enroll-status').textContent = 'No face detected. Try again.';
        return;
      }
      user.descriptor = descriptor;
      saveUsers(_users);
      cleanup();
    });
  }

  captureBtn.addEventListener('click', handleCapture, { once: true });
  cancelBtn.addEventListener('click', cleanup, { once: true });
}
