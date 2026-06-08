import { loadModels } from './face-engine.js';

// revealPath wired in Task 11
export function revealPath(path) {
  console.log('Reveal path:', path);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadModels();
  // initPortal() wired in Task 5
});
