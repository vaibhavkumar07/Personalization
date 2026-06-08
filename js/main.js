import { loadModels } from './face-engine.js';

// revealPath wired in Task 11
export function revealPath(path) {
  console.log('Reveal path:', path);
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadModels();
    // initPortal() wired in Task 5
  } catch (err) {
    console.error('Failed to load face models:', err);
    const status = document.getElementById('portal-status');
    if (status) {
      status.textContent = 'Failed to load models. Check connection.';
      status.className = 'error';
    }
  }
});
