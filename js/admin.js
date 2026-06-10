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
    const card = document.createElement('div');
    card.className = 'admin-user-card';

    const info = document.createElement('div');
    info.className = 'admin-user-info';

    const nameEl = document.createElement('h3');
    nameEl.textContent = user.name;

    const pathTag = document.createElement('span');
    pathTag.className = `path-tag ${user.path}`;
    pathTag.textContent = `${user.path} path`;

    const credEl = document.createElement('div');
    credEl.className = 'admin-enrolled yes';
    credEl.textContent = `username: ${user.username}`;

    info.appendChild(nameEl);
    info.appendChild(pathTag);
    info.appendChild(credEl);

    const actions = document.createElement('div');
    actions.className = 'admin-user-actions';

    const visitBtn = document.createElement('button');
    visitBtn.className = 'admin-btn admin-btn-visit';
    visitBtn.textContent = 'Visit Path';
    visitBtn.addEventListener('click', () => {
      document.getElementById('screen-admin').classList.add('hidden');
      import('./main.js').then(m => m.revealPath(user.path));
    });

    actions.appendChild(visitBtn);
    card.appendChild(info);
    card.appendChild(actions);
    container.appendChild(card);
  });
}
