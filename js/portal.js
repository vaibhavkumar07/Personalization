import { USERS, ADMIN_PASSWORD } from './config.js';
import { setState, S } from './state.js';

export function initPortal() {
  spawnParticles();
  checkSetupMode();
  bindLoginForm();
}

function checkSetupMode() {
  if (!window.location.search.includes('setup')) return;
  const pw = prompt('Admin password:');
  if (pw === ADMIN_PASSWORD) {
    import('./admin.js').then(m => m.initAdmin(USERS));
  } else if (pw !== null) {
    setStatus('Access denied', 'error');
    history.replaceState(null, '', window.location.pathname);
  }
}

function bindLoginForm() {
  const usernameInput = document.getElementById('username-input');
  const passwordInput = document.getElementById('password-input');
  const loginBtn      = document.getElementById('login-btn');

  const submit = () => attemptLogin(
    usernameInput.value.trim(),
    passwordInput.value
  );

  loginBtn.addEventListener('click', submit);
  passwordInput.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  usernameInput.addEventListener('keydown', e => { if (e.key === 'Enter') passwordInput.focus(); });
}

async function attemptLogin(username, password) {
  if (!username || !password) {
    setStatus('Enter username and password', 'error');
    return;
  }

  setState(S.MATCHING);

  // Admin via username "admin" or the admin password as username
  if (password === ADMIN_PASSWORD && (username.toLowerCase() === 'admin' || username.toLowerCase() === 'vaibhav')) {
    const { initAdmin } = await import('./admin.js');
    initAdmin(USERS);
    return;
  }

  const user = USERS.find(u =>
    u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );

  if (user) {
    const { revealPath } = await import('./main.js');
    revealPath(user.path);
  } else {
    showNotFound();
  }
}

function showNotFound() {
  setState(S.NOT_FOUND);
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

function resetPortal() {
  setState(S.INIT);
  document.getElementById('username-input').value = '';
  document.getElementById('password-input').value = '';
  setStatus('');
  document.getElementById('username-input').focus();
}

function setStatus(text, type = '') {
  const el = document.getElementById('portal-status');
  el.textContent = text;
  el.className = type;
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
    `;
    container.appendChild(p);
  }
}
