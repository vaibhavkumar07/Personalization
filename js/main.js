import { loadModels } from './face-engine.js';
import { initPortal } from './portal.js';

export function revealPath(path) {
  console.log('Reveal path:', path); // replaced in Task 11
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadModels();
    initPortal();
  } catch (err) {
    console.error('Failed to load face models:', err);
    const status = document.getElementById('portal-status');
    if (status) {
      status.textContent = 'Failed to load models. Check connection.';
      status.className = 'error';
    }
  }
});
