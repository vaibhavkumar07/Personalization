# Love Portal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a facial-recognition portal that unlocks a unique animated experience for each of 3 people (Pragya/love, Alka-Panda/bestie, Vaibhavkumar/self), deployed as static files on GitHub Pages.

**Architecture:** Single `index.html` state-machine app. All 3 paths live in the DOM, hidden until face+name verified. face-api.js runs entirely in browser — no server needed. Admin dashboard (face-gated or `?setup` URL) handles enrollment via localStorage.

**Tech Stack:** Vanilla HTML5 · CSS3 animations · ES Modules · face-api.js 0.22.2 (CDN) · Web Audio API · GitHub Pages

---

## File Map

```
/
├── index.html               ← app shell, all screen containers
├── css/
│   ├── base.css             ← reset, CSS variables, shared utilities
│   ├── portal.css           ← glassmorphism portal + scan animations
│   ├── admin.css            ← admin dashboard
│   ├── love.css             ← Pragya path styles
│   ├── bestie.css           ← Alka path styles
│   └── self.css             ← Vaibhavkumar path styles
├── js/
│   ├── config.js            ← passwords, thresholds, coordinates, content
│   ├── state.js             ← state machine (enum + transitions)
│   ├── face-engine.js       ← face-api.js wrapper (load, detect, match)
│   ├── portal.js            ← portal screen controller
│   ├── admin.js             ← admin dashboard + enrollment
│   ├── audio.js             ← path-specific audio controller
│   ├── nav.js               ← tap/click screen navigation
│   ├── paths/
│   │   ├── love.js          ← Pragya path logic
│   │   ├── bestie.js        ← Alka path logic
│   │   └── self.js          ← Vaibhavkumar path logic
│   └── main.js              ← entry point, wires everything together
├── models/                  ← face-api.js model weights (~6 MB total)
│   └── (downloaded in Task 2)
└── audio/
    ├── love.mp3             ← sourced from Pixabay Music (user adds)
    ├── bestie.mp3
    └── self.mp3
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `index.html`
- Create: `css/base.css`
- Create: `js/main.js`
- Create: `.gitignore`

- [ ] **Step 1: Create directory structure**

```bash
cd /Users/vaibhavkumaryadav/Documents/Projects/Love
mkdir -p css js/paths models audio assets
```

- [ ] **Step 2: Create `.gitignore`**

```
.DS_Store
.superpowers/
node_modules/
```

- [ ] **Step 3: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Portal</title>
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/portal.css">
  <link rel="stylesheet" href="css/admin.css">
  <link rel="stylesheet" href="css/love.css">
  <link rel="stylesheet" href="css/bestie.css">
  <link rel="stylesheet" href="css/self.css">
</head>
<body>

  <!-- PORTAL -->
  <div id="screen-portal" class="screen active">
    <div id="portal-particles"></div>
    <div class="glass-card">
      <div id="camera-ring">
        <video id="portal-video" autoplay muted playsinline></video>
        <canvas id="portal-canvas"></canvas>
        <div id="scan-line"></div>
        <div id="corner-tl" class="corner"></div>
        <div id="corner-tr" class="corner"></div>
        <div id="corner-bl" class="corner"></div>
        <div id="corner-br" class="corner"></div>
      </div>
      <div id="portal-status">Initializing...</div>
      <div id="name-wrap" class="hidden">
        <input id="name-input" type="text" placeholder="Enter your name..." autocomplete="off" autocorrect="off" spellcheck="false">
        <button id="name-btn" aria-label="Submit">→</button>
      </div>
      <div id="portal-hint">Look into the portal</div>
    </div>
  </div>

  <!-- NOT FOUND -->
  <div id="screen-notfound" class="screen hidden">
    <div class="glitch-wrap">
      <div class="glitch-text" data-text="Identity Unknown">Identity Unknown</div>
      <div class="access-denied">ACCESS DENIED</div>
    </div>
    <div id="denied-particles"></div>
  </div>

  <!-- ADMIN -->
  <div id="screen-admin" class="screen hidden">
    <div class="admin-panel">
      <div class="admin-header">
        <h1>Admin Portal</h1>
        <button id="admin-back">← Exit</button>
      </div>
      <div id="admin-users"></div>
      <div id="admin-enroll-modal" class="modal hidden">
        <div class="modal-inner">
          <h2 id="enroll-title">Enrolling...</h2>
          <div id="enroll-camera-ring">
            <video id="enroll-video" autoplay muted playsinline></video>
            <canvas id="enroll-canvas"></canvas>
          </div>
          <div id="enroll-status">Position face in frame</div>
          <div class="modal-actions">
            <button id="enroll-capture">Capture</button>
            <button id="enroll-cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- LOVE PATH -->
  <div id="screen-love" class="screen hidden">
    <div id="love-petals"></div>
    <div id="love-glow"></div>
    <div id="love-s0" class="love-screen active-screen"></div>
    <div id="love-s1" class="love-screen hidden"></div>
    <div id="love-s2" class="love-screen hidden"></div>
    <div id="love-s3" class="love-screen hidden"></div>
    <div id="love-s4" class="love-screen hidden"></div>
    <div id="love-s5" class="love-screen hidden"></div>
    <div class="path-nav">
      <div class="nav-dots" id="love-dots"></div>
      <div class="nav-hint">tap to continue</div>
    </div>
    <button class="mute-btn" id="love-mute" title="Toggle music">♪</button>
  </div>

  <!-- BESTIE PATH -->
  <div id="screen-bestie" class="screen hidden">
    <div id="bestie-stars"></div>
    <div id="bestie-confetti"></div>
    <div id="bestie-s0" class="bestie-screen active-screen"></div>
    <div id="bestie-s1" class="bestie-screen hidden"></div>
    <div id="bestie-s2" class="bestie-screen hidden"></div>
    <div id="bestie-s3" class="bestie-screen hidden"></div>
    <div id="bestie-s4" class="bestie-screen hidden"></div>
    <div id="bestie-s5" class="bestie-screen hidden"></div>
    <div class="path-nav">
      <div class="nav-dots" id="bestie-dots"></div>
      <div class="nav-hint">tap to continue</div>
    </div>
    <button class="mute-btn" id="bestie-mute" title="Toggle music">♪</button>
  </div>

  <!-- SELF PATH -->
  <div id="screen-self" class="screen hidden">
    <div id="self-grid-bg"></div>
    <div id="self-s0" class="self-screen active-screen"></div>
    <div id="self-s1" class="self-screen hidden"></div>
    <div id="self-s2" class="self-screen hidden"></div>
    <div id="self-s3" class="self-screen hidden"></div>
    <div id="self-s4" class="self-screen hidden"></div>
    <div id="self-s5" class="self-screen hidden"></div>
    <div class="path-nav">
      <div class="nav-dots" id="self-dots"></div>
      <div class="nav-hint">tap to continue</div>
    </div>
    <button class="mute-btn" id="self-mute" title="Toggle music">♪</button>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create `css/base.css`**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg-dark: #050810;
  --glass-bg: rgba(255,255,255,0.04);
  --glass-border: rgba(255,255,255,0.10);
  --glass-blur: 24px;
  --love-primary: #ff2060;
  --love-soft: #ff6699;
  --love-bg: #1a0010;
  --bestie-primary: #60a5fa;
  --bestie-soft: #93c5fd;
  --bestie-bg: #05101e;
  --self-primary: #00c8ff;
  --self-soft: #7dd3fc;
  --self-bg: #030912;
  --font-main: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-mono: 'Courier New', 'Lucida Console', monospace;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}

html, body {
  width: 100%; height: 100%;
  overflow: hidden;
  background: var(--bg-dark);
  color: #fff;
  font-family: var(--font-main);
  -webkit-font-smoothing: antialiased;
  touch-action: manipulation;
}

.screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.hidden { display: none !important; }
.active { display: flex !important; }

.mute-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 1.1rem;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: background 0.2s;
}
.mute-btn:hover { background: rgba(255,255,255,0.2); }
.mute-btn.muted { opacity: 0.4; }

.path-nav {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 50;
  pointer-events: none;
}

.nav-dots { display: flex; gap: 8px; }
.nav-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  transition: background 0.3s, transform 0.3s;
}
.nav-dot.active { background: #fff; transform: scale(1.4); }

.nav-hint {
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  animation: pulse-hint 2s ease-in-out infinite;
}
@keyframes pulse-hint { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }
```

- [ ] **Step 5: Create `js/main.js` stub**

```js
// Entry point — wired in later tasks
import { initPortal } from './portal.js';

document.addEventListener('DOMContentLoaded', () => {
  initPortal();
});
```

- [ ] **Step 6: Verify in browser**

Open `index.html` directly in browser (or via `python3 -m http.server 8080` then visit `http://localhost:8080`). Should see blank dark page, no console errors.

> Note: face-api.js CDN requires HTTP server, not `file://`. Always use `python3 -m http.server 8080` for local dev.

- [ ] **Step 7: Init git and commit**

```bash
git init
git add index.html css/base.css js/main.js .gitignore
git commit -m "feat: project scaffold — index.html shell + base CSS + entry point"
```

---

## Task 2: Download face-api.js Models

**Files:**
- Create: `models/` (populated by script)

face-api.js needs model weights to detect + recognize faces. We use 3 models: tiny face detector (fast), face landmarks (for descriptor alignment), face recognition net (for 128-dim descriptor).

- [ ] **Step 1: Download models**

```bash
cd /Users/vaibhavkumaryadav/Documents/Projects/Love
BASE="https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

for f in \
  tiny_face_detector_model-shard1 \
  tiny_face_detector_model-weights_manifest.json \
  face_landmark_68_model-shard1 \
  face_landmark_68_model-weights_manifest.json \
  face_recognition_model-shard1 \
  face_recognition_model-shard2 \
  face_recognition_model-weights_manifest.json; do
  curl -sL "$BASE/$f" -o "models/$f"
  echo "Downloaded: $f"
done
```

- [ ] **Step 2: Verify models downloaded**

```bash
ls -lh models/
```

Expected: 7 files, largest (`face_recognition_model-shard1`) ~5.5 MB.

- [ ] **Step 3: Commit**

```bash
git add models/
git commit -m "feat: add face-api.js model weights"
```

---

## Task 3: Config + State Machine

**Files:**
- Create: `js/config.js`
- Create: `js/state.js`

- [ ] **Step 1: Create `js/config.js`**

```js
// Change ADMIN_PASSWORD before deploying
export const ADMIN_PASSWORD = 'vaibhav2024';
export const FACE_MATCH_THRESHOLD = 0.55;
export const FACE_STABILITY_MS = 1500; // hold before prompting name

// Coordinates for distance globe (Texas ↔ Noida)
export const COORDS = {
  vaibhav: { lat: 30.2672, lng: -97.7431, label: 'Texas, USA' },
  pragya:  { lat: 28.5355, lng:  77.3910, label: 'Noida, India' },
};

// Haversine distance between the two — ~13,400 km
export function calcDistanceKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat/2)**2 +
    Math.cos(a.lat * Math.PI/180) * Math.cos(b.lat * Math.PI/180) * Math.sin(dLng/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x)));
}

// Default users — descriptors populated from localStorage after enrollment
export const DEFAULT_USERS = [
  { id: 'pragya',   name: 'Pragya Yadav',       path: 'love',   descriptor: null },
  { id: 'alka',     name: 'Alka Yadav',          path: 'bestie', descriptor: null },
  { id: 'vaibhav',  name: 'Vaibhavkumar Yadav',  path: 'self',   descriptor: null },
];

export const STORAGE_KEY = 'love_portal_users';

export function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USERS.map(u => ({ ...u }));
    const saved = JSON.parse(raw);
    return DEFAULT_USERS.map(u => {
      const s = saved.find(x => x.id === u.id);
      if (s?.descriptor) {
        return { ...u, descriptor: new Float32Array(Object.values(s.descriptor)) };
      }
      return { ...u };
    });
  } catch { return DEFAULT_USERS.map(u => ({ ...u })); }
}

export function saveUsers(users) {
  const serializable = users.map(u => ({
    id: u.id,
    descriptor: u.descriptor ? Array.from(u.descriptor) : null,
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}
```

- [ ] **Step 2: Create `js/state.js`**

```js
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
  const prev = _state;
  _state = next;
  _listeners.forEach(fn => fn(next, prev));
}

export function onState(fn) {
  _listeners.push(fn);
  return () => { const i = _listeners.indexOf(fn); if (i > -1) _listeners.splice(i, 1); };
}
```

- [ ] **Step 3: Verify no syntax errors**

```bash
python3 -m http.server 8080 &
# Open browser → http://localhost:8080
# Open DevTools console — should see no errors after adding quick import test
```

- [ ] **Step 4: Commit**

```bash
git add js/config.js js/state.js
git commit -m "feat: add config, state machine, localStorage user store"
```

---

## Task 4: face-api.js Engine

**Files:**
- Create: `js/face-engine.js`

- [ ] **Step 1: Create `js/face-engine.js`**

```js
import { FACE_MATCH_THRESHOLD } from './config.js';

let _modelsLoaded = false;

export async function loadModels() {
  if (_modelsLoaded) return;
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  ]);
  _modelsLoaded = true;
}

export async function detectSingle(video) {
  return faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }))
    .withFaceLandmarks()
    .withFaceDescriptor();
}

export async function computeDescriptor(video) {
  const det = await detectSingle(video);
  return det?.descriptor ?? null;
}

// Returns matched user or null
export function findMatch(descriptor, users) {
  let best = null;
  let bestDist = Infinity;
  for (const user of users) {
    if (!user.descriptor) continue;
    const dist = faceapi.euclideanDistance(
      Array.from(descriptor),
      Array.from(user.descriptor)
    );
    if (dist < bestDist) { bestDist = dist; best = user; }
  }
  return bestDist < FACE_MATCH_THRESHOLD ? best : null;
}

export function drawDetection(canvas, video, detection) {
  const dims = faceapi.matchDimensions(canvas, video, true);
  canvas.width = dims.width;
  canvas.height = dims.height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!detection) return;
  const resized = faceapi.resizeResults(detection, dims);
  const box = resized.detection.box;
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(box.x, box.y, box.width, box.height);
}
```

- [ ] **Step 2: Update `js/main.js` to load models on startup**

```js
import { loadModels } from './face-engine.js';
import { initPortal } from './portal.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadModels();
  initPortal();
});
```

- [ ] **Step 3: Verify models load**

Serve via `python3 -m http.server 8080`. Open `http://localhost:8080`. Open DevTools Network tab — should see 7 model files fetching from `/models/`. Console should show no errors.

- [ ] **Step 4: Commit**

```bash
git add js/face-engine.js js/main.js
git commit -m "feat: face-api.js engine — load models, detect, match, draw"
```

---

## Task 5: Portal Screen UI + CSS

**Files:**
- Create: `css/portal.css`
- Create: `js/portal.js`

- [ ] **Step 1: Create `css/portal.css`**

```css
/* ── Background ── */
#screen-portal {
  background: radial-gradient(ellipse at 30% 40%, #0d1a3a 0%, #050810 60%);
  animation: bg-shift 12s ease-in-out infinite alternate;
}
@keyframes bg-shift {
  0%   { background-position: 30% 40%; }
  100% { background-position: 70% 60%; }
}

/* ── Particles ── */
#portal-particles {
  position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
}
.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  animation: float-particle linear infinite;
}
@keyframes float-particle {
  0%   { transform: translateY(100vh) scale(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 0.4; }
  100% { transform: translateY(-10vh) scale(1); opacity: 0; }
}

/* ── Glass Card ── */
.glass-card {
  position: relative; z-index: 10;
  display: flex; flex-direction: column; align-items: center; gap: 24px;
  padding: 40px 36px;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 28px;
  box-shadow: 0 8px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08);
  min-width: 300px; max-width: 380px; width: 90%;
}

/* ── Camera Ring ── */
#camera-ring {
  position: relative;
  width: 200px; height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.15);
  box-shadow: 0 0 0 4px rgba(255,255,255,0.04), 0 0 40px rgba(100,180,255,0.1);
  animation: ring-pulse 3s ease-in-out infinite;
}
@keyframes ring-pulse {
  0%,100% { box-shadow: 0 0 0 4px rgba(255,255,255,0.04), 0 0 40px rgba(100,180,255,0.1); }
  50%     { box-shadow: 0 0 0 8px rgba(255,255,255,0.06), 0 0 60px rgba(100,180,255,0.2); }
}

#portal-video {
  width: 100%; height: 100%;
  object-fit: cover;
  transform: scaleX(-1); /* mirror */
}

#portal-canvas {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  transform: scaleX(-1);
}

/* ── Scan Line ── */
#scan-line {
  position: absolute;
  left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(100,200,255,0.8), transparent);
  top: 0;
  animation: scan 2.5s linear infinite;
  box-shadow: 0 0 12px rgba(100,200,255,0.6);
}
@keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
#scan-line.paused { animation-play-state: paused; }

/* ── Corner Brackets ── */
.corner {
  position: absolute;
  width: 16px; height: 16px;
  border-color: rgba(255,255,255,0.5);
  border-style: solid;
}
#corner-tl { top: 4px; left: 4px; border-width: 2px 0 0 2px; }
#corner-tr { top: 4px; right: 4px; border-width: 2px 2px 0 0; }
#corner-bl { bottom: 4px; left: 4px; border-width: 0 0 2px 2px; }
#corner-br { bottom: 4px; right: 4px; border-width: 0 2px 2px 0; }

/* ── Status Text ── */
#portal-status {
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  text-align: center;
  min-height: 1.2em;
  transition: color 0.3s;
}
#portal-status.detected { color: #7dffb0; }
#portal-status.error    { color: #ff6060; }

/* ── Name Input ── */
#name-wrap {
  display: flex; gap: 8px; width: 100%;
  animation: slide-up 0.4s var(--ease-out-expo);
}
@keyframes slide-up { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }

#name-input {
  flex: 1;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  padding: 10px 14px;
  color: #fff;
  font-size: 0.9rem;
  font-family: var(--font-main);
  outline: none;
  transition: border-color 0.2s;
}
#name-input:focus { border-color: rgba(255,255,255,0.4); }
#name-input::placeholder { color: rgba(255,255,255,0.3); }

#name-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  color: #fff;
  width: 44px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}
#name-btn:hover { background: rgba(255,255,255,0.2); }

/* ── Portal Hint ── */
#portal-hint {
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.2);
}

/* ── Not Found ── */
#screen-notfound {
  background: #050810;
  flex-direction: column;
  gap: 16px;
}
.glitch-wrap {
  display: flex; flex-direction: column; align-items: center; gap: 12px; z-index: 10;
}
.glitch-text {
  font-size: clamp(1.5rem, 6vw, 2.5rem);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ff2040;
  position: relative;
}
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
}
.glitch-text::before {
  color: #00ffcc;
  animation: glitch-a 0.3s steps(1) infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}
.glitch-text::after {
  color: #ff00aa;
  animation: glitch-b 0.3s steps(1) infinite 0.15s;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
}
@keyframes glitch-a {
  0%,100% { transform: translate(0); }
  20% { transform: translate(-3px, 1px); }
  40% { transform: translate(3px, -1px); }
  60% { transform: translate(-2px, 2px); }
  80% { transform: translate(2px, 0); }
}
@keyframes glitch-b {
  0%,100% { transform: translate(0); }
  20% { transform: translate(3px, -1px); }
  40% { transform: translate(-3px, 1px); }
  60% { transform: translate(2px, -2px); }
  80% { transform: translate(-2px, 1px); }
}
.access-denied {
  font-size: 0.65rem;
  letter-spacing: 0.5em;
  color: rgba(255,32,64,0.5);
  text-transform: uppercase;
}
.screen-shake { animation: shake 0.4s ease-in-out; }
@keyframes shake {
  0%,100% { transform: translate(0); }
  20% { transform: translate(-8px, 4px); }
  40% { transform: translate(8px, -4px); }
  60% { transform: translate(-6px, 2px); }
  80% { transform: translate(6px, -2px); }
}
#denied-particles { position: fixed; inset: 0; pointer-events: none; }
.denied-particle {
  position: absolute;
  border-radius: 50%;
  background: #ff2040;
  animation: denied-burst 1s var(--ease-out-expo) forwards;
}
@keyframes denied-burst {
  0%   { opacity: 1; transform: scale(1) translate(0,0); }
  100% { opacity: 0; transform: scale(0.2) translate(var(--dx), var(--dy)); }
}
```

- [ ] **Step 2: Create `js/portal.js`**

```js
import { loadUsers } from './config.js';
import { detectSingle, computeDescriptor, drawDetection, findMatch } from './face-engine.js';
import { setState, getState, S } from './state.js';
import { ADMIN_PASSWORD, FACE_STABILITY_MS } from './config.js';
import { revealPath } from './main.js';

let _users = [];
let _video = null;
let _canvas = null;
let _detectionLoop = null;
let _stableTimer = null;
let _capturedDescriptor = null;

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
    });
  } catch {
    setStatus('Camera access needed', 'error');
  }
}

function runDetectionLoop() {
  let frameCount = 0;
  const loop = async () => {
    if (getState() === S.NAME_INPUT || getState() === S.MATCHING) {
      _detectionLoop = requestAnimationFrame(loop);
      return;
    }
    if (frameCount++ % 3 === 0) { // every 3rd frame for perf
      const det = await detectSingle(_video);
      drawDetection(_canvas, _video, det);
      if (det && getState() === S.SCANNING) {
        onFaceDetected(det.descriptor);
      } else if (!det && getState() === S.FACE_DETECTED) {
        clearStableTimer();
        setState(S.SCANNING);
        setStatus('Scanning...');
      }
    }
    _detectionLoop = requestAnimationFrame(loop);
  };
  _detectionLoop = requestAnimationFrame(loop);
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

  // Check admin access
  if (name === ADMIN_PASSWORD) {
    const { initAdmin } = await import('./admin.js');
    initAdmin(_users);
    return;
  }

  const faceMatch = findMatch(_capturedDescriptor, _users);
  const nameMatch = faceMatch && name.toLowerCase() === faceMatch.name.toLowerCase();

  if (faceMatch && nameMatch) {
    revealPath(faceMatch.path);
  } else {
    showNotFound();
  }
}

function showNotFound() {
  const notFound = document.getElementById('screen-notfound');
  document.getElementById('screen-portal').classList.add('screen-shake');
  notFound.classList.remove('hidden');
  setTimeout(() => notFound.classList.add('hidden'), 3000);
  setTimeout(() => {
    document.getElementById('screen-portal').classList.remove('screen-shake');
    resetPortal();
  }, 3200);
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
```

- [ ] **Step 3: Add stub `revealPath` to `js/main.js`**

```js
import { loadModels } from './face-engine.js';
import { initPortal } from './portal.js';

export function revealPath(path) {
  console.log('Reveal path:', path); // replaced in Task 13
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadModels();
  initPortal();
});
```

- [ ] **Step 4: Test in browser**

`http://localhost:8080` — should see: glassmorphism card, camera feed in circle, scan line animating, floating particles, status text "Scanning...". Allow camera permission when prompted.

- [ ] **Step 5: Commit**

```bash
git add css/portal.css js/portal.js js/main.js
git commit -m "feat: portal screen — glass UI, camera feed, scan animation, particles"
```

---

## Task 6: Admin Dashboard

**Files:**
- Create: `css/admin.css`
- Create: `js/admin.js`

- [ ] **Step 1: Create `css/admin.css`**

```css
#screen-admin {
  background: #05080f;
  align-items: flex-start;
  overflow-y: auto;
  padding: 24px;
}
.admin-panel {
  width: 100%; max-width: 600px; margin: 0 auto;
  display: flex; flex-direction: column; gap: 24px;
}
.admin-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.admin-header h1 { font-size: 1.2rem; font-weight: 300; letter-spacing: 0.2em; }
#admin-back {
  background: none; border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.6); border-radius: 8px;
  padding: 8px 16px; cursor: pointer; font-size: 0.8rem;
  transition: all 0.2s;
}
#admin-back:hover { border-color: rgba(255,255,255,0.5); color: #fff; }

.admin-user-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px; padding: 20px 24px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.admin-user-info h3 { font-size: 1rem; font-weight: 500; margin-bottom: 4px; }
.admin-user-info .path-tag {
  font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;
  padding: 2px 8px; border-radius: 20px; display: inline-block;
}
.path-tag.love    { background: rgba(255,32,96,0.15);  color: var(--love-soft); }
.path-tag.bestie  { background: rgba(96,165,250,0.15); color: var(--bestie-soft); }
.path-tag.self    { background: rgba(0,200,255,0.15);  color: var(--self-soft); }
.admin-enrolled   { font-size: 0.7rem; margin-top: 4px; }
.admin-enrolled.yes { color: #7dffb0; }
.admin-enrolled.no  { color: rgba(255,255,255,0.3); }

.admin-user-actions { display: flex; gap: 8px; flex-shrink: 0; }
.admin-btn {
  padding: 8px 14px; border-radius: 8px; font-size: 0.75rem;
  cursor: pointer; transition: all 0.2s; border: 1px solid;
}
.admin-btn-enroll {
  background: rgba(0,200,255,0.1); border-color: rgba(0,200,255,0.3);
  color: var(--self-primary);
}
.admin-btn-enroll:hover { background: rgba(0,200,255,0.2); }
.admin-btn-visit {
  background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.7);
}
.admin-btn-visit:hover { background: rgba(255,255,255,0.12); color: #fff; }

/* Modal */
.modal {
  position: fixed; inset: 0; background: rgba(0,0,0,0.85);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; backdrop-filter: blur(8px);
}
.modal-inner {
  background: #0d1525; border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px; padding: 32px; max-width: 360px; width: 90%;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
}
.modal-inner h2 { font-weight: 300; letter-spacing: 0.1em; }
#enroll-camera-ring {
  width: 180px; height: 180px; border-radius: 50%;
  overflow: hidden; border: 2px solid rgba(0,200,255,0.3);
  position: relative;
}
#enroll-video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
#enroll-canvas { position: absolute; inset: 0; width: 100%; height: 100%; transform: scaleX(-1); }
#enroll-status { font-size: 0.8rem; color: rgba(255,255,255,0.6); text-align: center; }
.modal-actions { display: flex; gap: 12px; }
#enroll-capture {
  background: rgba(0,200,255,0.15); border: 1px solid rgba(0,200,255,0.4);
  color: #00c8ff; border-radius: 10px; padding: 10px 24px; cursor: pointer;
  font-size: 0.85rem; transition: all 0.2s;
}
#enroll-capture:hover { background: rgba(0,200,255,0.25); }
#enroll-cancel {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.6); border-radius: 10px; padding: 10px 24px;
  cursor: pointer; font-size: 0.85rem;
}
```

- [ ] **Step 2: Create `js/admin.js`**

```js
import { saveUsers, loadUsers } from './config.js';
import { computeDescriptor } from './face-engine.js';
import { setState, S } from './state.js';
import { revealPath } from './main.js';

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
    location.reload(); // simplest way to reset portal state
  });
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
      revealPath(user.path);
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
  let stream;
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } }).then(s => {
    stream = s;
    video.srcObject = s;
  });

  const captureBtn = document.getElementById('enroll-capture');
  const cancelBtn  = document.getElementById('enroll-cancel');

  const cleanup = () => {
    stream?.getTracks().forEach(t => t.stop());
    modal.classList.add('hidden');
    captureBtn.replaceWith(captureBtn.cloneNode(true));
    cancelBtn.replaceWith(cancelBtn.cloneNode(true));
  };

  document.getElementById('enroll-capture').addEventListener('click', async () => {
    document.getElementById('enroll-status').textContent = 'Computing descriptor...';
    const descriptor = await computeDescriptor(video);
    if (!descriptor) {
      document.getElementById('enroll-status').textContent = 'No face detected. Try again.';
      return;
    }
    user.descriptor = descriptor;
    saveUsers(_users);
    cleanup();
    renderUserList();
  });

  document.getElementById('enroll-cancel').addEventListener('click', cleanup);
}
```

- [ ] **Step 3: Test admin flow**

Serve locally. On portal, type admin password in name field after face detected → admin dashboard appears with 3 user cards showing "Not enrolled". Click "Enroll Face" on one → modal opens → camera shows → "Capture" → should save to localStorage.

Alternatively visit `http://localhost:8080?setup` → password prompt.

- [ ] **Step 4: Commit**

```bash
git add css/admin.css js/admin.js
git commit -m "feat: admin dashboard — user list, face enrollment, localStorage persistence"
```

---

## Task 7: Love Path

**Files:**
- Create: `css/love.css`
- Create: `js/paths/love.js`

- [ ] **Step 1: Create `css/love.css`**

```css
/* ── Love Path Container ── */
#screen-love {
  background: radial-gradient(ellipse at center, #3d0028 0%, #1a0010 60%, #050005 100%);
  flex-direction: column;
  overflow: hidden;
}

/* ── Petals ── */
#love-petals { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.petal {
  position: absolute;
  font-size: 1.2rem;
  animation: petal-fall linear infinite;
  user-select: none;
  pointer-events: none;
}
@keyframes petal-fall {
  0%   { transform: translateY(-5vh) rotate(0deg) translateX(0); opacity: 0; }
  5%   { opacity: 0.8; }
  95%  { opacity: 0.5; }
  100% { transform: translateY(105vh) rotate(720deg) translateX(40px); opacity: 0; }
}

#love-glow {
  position: fixed; width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,0,80,0.12), transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%,-50%);
  pointer-events: none; z-index: 0;
  animation: glow-breathe 4s ease-in-out infinite;
}
@keyframes glow-breathe {
  0%,100% { transform: translate(-50%,-50%) scale(1); opacity: 0.8; }
  50%     { transform: translate(-50%,-50%) scale(1.2); opacity: 1; }
}

/* ── Screens ── */
.love-screen {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 40px 28px; text-align: center; z-index: 10;
  opacity: 0; transition: opacity 0.8s ease;
}
.love-screen.active-screen { opacity: 1; }

/* Screen 0 — Unlock */
.love-unlock-heart {
  font-size: 5rem;
  animation: heartbeat 1.5s ease-in-out infinite, heart-enter 1s var(--ease-out-expo);
  filter: drop-shadow(0 0 30px rgba(255,0,80,0.8));
  margin-bottom: 24px;
}
@keyframes heartbeat { 0%,100%{transform:scale(1);} 50%{transform:scale(1.1);} }
@keyframes heart-enter { from{transform:scale(0) rotate(-30deg);} to{transform:scale(1) rotate(0);} }
.love-unlock-title {
  font-size: clamp(1.4rem, 5vw, 2rem); font-weight: 300;
  color: #ffb3cc; letter-spacing: 0.1em; margin-bottom: 8px;
}
.love-unlock-sub { font-size: 0.85rem; color: rgba(255,150,180,0.7); letter-spacing: 0.05em; }

/* Screen 1 — Love Letter */
.love-letter-paper {
  background: rgba(255,200,220,0.05);
  border: 1px solid rgba(255,100,150,0.2);
  border-radius: 16px; padding: 32px; max-width: 340px;
  font-family: 'Georgia', serif; line-height: 1.9;
  animation: letter-unfold 0.8s var(--ease-out-expo);
}
@keyframes letter-unfold {
  from { transform: scaleY(0.3) translateY(-20px); opacity: 0; }
  to   { transform: scaleY(1) translateY(0); opacity: 1; }
}
.love-letter-paper p { color: rgba(255,200,220,0.9); font-size: 0.9rem; }
.love-letter-paper .hindi { color: var(--love-soft); font-style: italic; margin-top: 12px; display: block; }
.love-letter-sign { margin-top: 16px; color: #ff6699; font-style: italic; }

/* Screen 2 — Distance */
.love-distance-num {
  font-size: clamp(2.5rem, 10vw, 4rem); font-weight: 100;
  color: #ffb3cc; letter-spacing: -0.02em;
  animation: count-up 2s var(--ease-out-expo);
}
@keyframes count-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.love-distance-label { font-size: 0.7rem; letter-spacing: 0.3em; color: rgba(255,150,180,0.6); text-transform: uppercase; margin-top: 4px; }
.love-globe-wrap { margin: 20px 0; }
.love-globe-sub { font-size: 0.75rem; color: rgba(255,150,180,0.5); margin-top: 8px; }

/* Screen 3 — Reason Cards */
.love-card {
  background: rgba(255,0,80,0.08); border: 1px solid rgba(255,100,150,0.25);
  border-radius: 20px; padding: 32px 28px; max-width: 320px;
  animation: card-flip-in 0.5s var(--ease-out-expo);
}
@keyframes card-flip-in {
  from { transform: rotateY(-90deg) scale(0.8); opacity: 0; }
  to   { transform: rotateY(0) scale(1); opacity: 1; }
}
.love-card-num { font-size: 0.65rem; letter-spacing: 0.3em; color: rgba(255,100,150,0.5); margin-bottom: 16px; text-transform: uppercase; }
.love-card-text { font-size: 1.1rem; color: #ffccdd; line-height: 1.6; }
.love-card-hindi { font-size: 0.85rem; color: var(--love-soft); margin-top: 12px; font-style: italic; }

/* Screen 4 — Memory Wall */
.love-polaroids { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; max-width: 360px; }
.polaroid {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px; padding: 10px 10px 24px;
  transform: rotate(var(--rot));
  animation: polaroid-in 0.4s var(--ease-out-expo) both;
  width: 100px;
}
@keyframes polaroid-in { from{transform:rotate(var(--rot)) scale(0.5) translateY(20px);opacity:0;} }
.polaroid-img { width: 80px; height: 80px; background: rgba(255,100,150,0.1); border-radius: 2px; display:flex;align-items:center;justify-content:center; font-size:1.5rem; }
.polaroid-caption { font-size: 0.55rem; text-align: center; color: rgba(255,200,220,0.5); margin-top: 6px; }

/* Screen 5 — Closing */
.love-closing-sig {
  font-family: 'Georgia', cursive; font-size: clamp(1.5rem, 6vw, 2.2rem);
  color: #ffb3cc; animation: sig-write 1.5s var(--ease-out-expo);
  margin-bottom: 20px;
}
@keyframes sig-write { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
.love-hearts-rain { font-size: 1.5rem; animation: hearts-dance 3s ease-in-out infinite; }
@keyframes hearts-dance { 0%,100%{letter-spacing:0.2em;} 50%{letter-spacing:0.5em;} }
```

- [ ] **Step 2: Create `js/paths/love.js`**

```js
import { COORDS, calcDistanceKm } from '../config.js';

const REASONS = [
  { en: "Your smile makes every distance disappear", hi: "Teri muskaan har doori mita deti hai" },
  { en: "You make ordinary moments extraordinary", hi: "Tu aam lamhon ko khaas bana deti hai" },
  { en: "Loving you is the easiest thing I've ever done", hi: "Tujhse pyaar karna sabse aasaan kaam hai" },
  { en: "You are home, no matter where I am", hi: "Tu hi mera ghar hai, chahe main kahan bhi hoon" },
  { en: "Every day apart makes me love you more", hi: "Har alag din pyaar badha deta hai" },
  { en: "You are the reason I believe in forever", hi: "Tu hi wajah hai ki main 'hamesha' mein yakeen karta hoon" },
];

let _currentScreen = 0;
const TOTAL = 6;

export function initLove() {
  _currentScreen = 0;
  buildScreens();
  renderNavDots('love-dots', TOTAL, 0);
  showScreen(0);
}

function buildScreens() {
  // Screen 0 — Unlock
  document.getElementById('love-s0').innerHTML = `
    <div class="love-unlock-heart">❤️</div>
    <div class="love-unlock-title">Meri Jaan aa gayi 🌹</div>
    <div class="love-unlock-sub">tumhara intezaar rehta hai...</div>
  `;

  // Screen 1 — Love Letter
  document.getElementById('love-s1').innerHTML = `
    <div class="love-letter-paper">
      <p>Meri pyaari Pragya,</p>
      <p style="margin-top:12px">
        Tum door ho, lekin har subah uthte hi tumhara chehra yaad aata hai.
        Ye doori dil ko thoda dard deti hai — par ye dard bhi ek yaad dilata hai
        ki hum kitna ek doosre ko chahte hain.
      </p>
      <p style="margin-top:12px">
        Distance is just a test to see how far love can travel.
        And ours? It crosses oceans.
      </p>
      <span class="hindi">— Tum meri duniya ho 🌹</span>
      <div class="love-letter-sign" style="margin-top:20px">Tumhara Vaibhav ❤️</div>
    </div>
  `;

  // Screen 2 — Distance Counter
  const distKm = calcDistanceKm(COORDS.vaibhav, COORDS.pragya);
  document.getElementById('love-s2').innerHTML = `
    <div class="love-distance-num" id="dist-counter">0</div>
    <div class="love-distance-label">kilometres apart</div>
    <div class="love-globe-wrap">${buildGlobeSVG()}</div>
    <div class="love-globe-sub">${COORDS.vaibhav.label} ↔ ${COORDS.pragya.label}</div>
    <div style="margin-top:16px;font-size:0.8rem;color:rgba(255,150,180,0.6)">
      Par dil ki doori? Zero. 💕
    </div>
  `;
  animateCounter('dist-counter', distKm, 2000);

  // Screen 3 — Reason Cards (rendered dynamically on tap)
  renderReasonCard(0);

  // Screen 4 — Memory Wall
  document.getElementById('love-s4').innerHTML = `
    <div style="font-size:0.7rem;letter-spacing:0.3em;color:rgba(255,150,180,0.5);text-transform:uppercase;margin-bottom:20px">Our Moments</div>
    <div class="love-polaroids" id="polaroid-wall">
      ${[
        { emoji: '🌹', caption: 'Always ❤️' },
        { emoji: '💕', caption: 'Together' },
        { emoji: '🌟', caption: 'Forever' },
        { emoji: '🥰', caption: 'My love' },
      ].map((p, i) => `
        <div class="polaroid" style="--rot:${[-3,4,-2,3][i]}deg;animation-delay:${i*0.1}s">
          <div class="polaroid-img">${p.emoji}</div>
          <div class="polaroid-caption">${p.caption}</div>
        </div>
      `).join('')}
    </div>
    <div style="margin-top:20px;font-size:0.75rem;color:rgba(255,150,180,0.4)">replace emojis with real photos ✨</div>
  `;

  // Screen 5 — Closing
  document.getElementById('love-s5').innerHTML = `
    <div class="love-hearts-rain">💕 ❤️ 🌹 💕 ❤️</div>
    <div class="love-closing-sig" style="margin-top:24px">Tumhara Vaibhav</div>
    <div style="font-size:0.85rem;color:rgba(255,150,180,0.7);margin-top:8px">Always & Forever 🌹</div>
    <div style="margin-top:24px;font-size:1.5rem;animation:heartbeat 1.5s ease-in-out infinite">❤️</div>
  `;
}

function renderReasonCard(index) {
  const r = REASONS[index % REASONS.length];
  document.getElementById('love-s3').innerHTML = `
    <div class="love-card">
      <div class="love-card-num">Reason ${index + 1} of ${REASONS.length}</div>
      <div class="love-card-text">${r.en}</div>
      <div class="love-card-hindi">${r.hi}</div>
    </div>
    <div style="margin-top:20px;font-size:0.65rem;letter-spacing:0.2em;color:rgba(255,150,180,0.35)">TAP FOR NEXT REASON</div>
  `;
}

export function advanceLove() {
  if (_currentScreen === 3) {
    // Cycle through reasons
    const shownCount = parseInt(document.getElementById('love-s3').dataset.shown || '0') + 1;
    document.getElementById('love-s3').dataset.shown = shownCount;
    if (shownCount < REASONS.length) {
      renderReasonCard(shownCount);
      return; // don't advance screen
    }
    document.getElementById('love-s3').dataset.shown = '0';
  }
  if (_currentScreen < TOTAL - 1) {
    showScreen(++_currentScreen);
    renderNavDots('love-dots', TOTAL, _currentScreen);
  }
}

function showScreen(index) {
  document.querySelectorAll('.love-screen').forEach((s, i) => {
    s.classList.toggle('active-screen', i === index);
    s.classList.toggle('hidden', i !== index);
  });
}

function buildGlobeSVG() {
  // Simplified globe: flat oval with arc + two dots for TX and Noida
  return `
    <svg width="200" height="120" viewBox="0 0 200 120">
      <defs>
        <radialGradient id="globe-grad" cx="50%" cy="50%">
          <stop offset="0%"  stop-color="#3d0028" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#1a0010" stop-opacity="0.3"/>
        </radialGradient>
        <filter id="glow-filter">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <!-- Globe ellipse -->
      <ellipse cx="100" cy="60" rx="90" ry="52" fill="url(#globe-grad)" stroke="rgba(255,100,150,0.2)" stroke-width="1"/>
      <!-- Latitude lines -->
      <ellipse cx="100" cy="60" rx="90" ry="20" fill="none" stroke="rgba(255,100,150,0.08)" stroke-width="0.5"/>
      <ellipse cx="100" cy="60" rx="90" ry="40" fill="none" stroke="rgba(255,100,150,0.08)" stroke-width="0.5"/>
      <!-- Vertical center line -->
      <line x1="100" y1="8" x2="100" y2="112" stroke="rgba(255,100,150,0.08)" stroke-width="0.5"/>
      <!-- Connection arc — TX (left ~35,55) to Noida (right ~160,50) -->
      <path d="M 38 58 Q 100 10 162 52" fill="none" stroke="rgba(255,100,150,0.7)" stroke-width="1.5"
            stroke-dasharray="4 3" filter="url(#glow-filter)">
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite"/>
      </path>
      <!-- TX dot -->
      <circle cx="38" cy="58" r="5" fill="#ff2060" filter="url(#glow-filter)"/>
      <circle cx="38" cy="58" r="9" fill="none" stroke="rgba(255,32,96,0.4)" stroke-width="1">
        <animate attributeName="r" values="5;12;5" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite"/>
      </circle>
      <!-- Noida dot -->
      <circle cx="162" cy="52" r="5" fill="#ff6699" filter="url(#glow-filter)"/>
      <circle cx="162" cy="52" r="9" fill="none" stroke="rgba(255,102,153,0.4)" stroke-width="1">
        <animate attributeName="r" values="5;12;5" dur="2s" begin="1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0;1" dur="2s" begin="1s" repeatCount="indefinite"/>
      </circle>
      <!-- Labels -->
      <text x="28" y="76" font-size="7" fill="rgba(255,150,180,0.7)" text-anchor="middle">Texas</text>
      <text x="168" y="68" font-size="7" fill="rgba(255,150,180,0.7)" text-anchor="middle">Noida</text>
    </svg>
  `;
}

function animateCounter(id, target, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = Date.now();
  const tick = () => {
    const pct = Math.min((Date.now() - start) / duration, 1);
    el.textContent = Math.round(pct * target).toLocaleString();
    if (pct < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function renderNavDots(containerId, total, active) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = Array.from({ length: total }, (_, i) =>
    `<div class="nav-dot ${i === active ? 'active' : ''}"></div>`
  ).join('');
}
```

- [ ] **Step 3: Test love path**

Temporarily call `initLove()` from `main.js` and show `#screen-love`. Verify petals falling, screens render, distance counter animates, globe SVG shows.

- [ ] **Step 4: Commit**

```bash
git add css/love.css js/paths/love.js
git commit -m "feat: love path — 6 screens, petals, distance globe, reason cards, polaroids"
```

---

## Task 8: Bestie Path

**Files:**
- Create: `css/bestie.css`
- Create: `js/paths/bestie.js`

- [ ] **Step 1: Create `css/bestie.css`**

```css
#screen-bestie {
  background: radial-gradient(ellipse at 40% 30%, #0f2040 0%, #05101e 70%);
  flex-direction: column; overflow: hidden;
}

/* Stars */
#bestie-stars { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.star-dot {
  position: absolute; border-radius: 50%; background: #fff;
  animation: star-twinkle ease-in-out infinite;
}
@keyframes star-twinkle {
  0%,100% { opacity: 0.15; transform: scale(1); }
  50%     { opacity: 1;    transform: scale(1.6); }
}

/* Confetti */
#bestie-confetti { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.conf-bit {
  position: absolute; border-radius: 2px;
  animation: conf-fall linear infinite;
}
@keyframes conf-fall {
  0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}

.bestie-screen {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 40px 28px; text-align: center; z-index: 10;
  opacity: 0; transition: opacity 0.8s ease;
}
.bestie-screen.active-screen { opacity: 1; }

/* Screen 0 — Unlock */
.bestie-panda {
  font-size: 5rem; margin-bottom: 20px;
  animation: panda-bounce 1s var(--ease-out-expo), panda-idle 2s ease-in-out 1s infinite;
}
@keyframes panda-bounce { from{transform:scale(0) rotate(-20deg);} to{transform:scale(1) rotate(0);} }
@keyframes panda-idle   { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
.bestie-unlock-title {
  font-size: clamp(1.4rem, 5vw, 2rem); color: var(--bestie-soft);
  font-weight: 300; letter-spacing: 0.1em; margin-bottom: 8px;
}
.bestie-unlock-sub { font-size: 0.85rem; color: rgba(147,197,253,0.6); }

/* Screen 1 — Certificate */
.bestie-cert {
  background: rgba(255,255,255,0.03);
  border: 2px solid rgba(255,215,0,0.3);
  border-radius: 16px; padding: 32px 28px; max-width: 320px;
  position: relative; text-align: center;
  box-shadow: inset 0 0 40px rgba(255,215,0,0.03), 0 0 40px rgba(255,215,0,0.05);
  animation: cert-appear 0.6s var(--ease-out-expo);
}
@keyframes cert-appear { from{transform:scale(0.7) rotate(-3deg);opacity:0;} to{transform:scale(1) rotate(0);opacity:1;} }
.cert-seal { font-size: 2.5rem; margin-bottom: 12px; }
.cert-title { font-size: 0.6rem; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(255,215,0,0.5); margin-bottom: 8px; }
.cert-name { font-size: 1.3rem; color: #fbbf24; font-style: italic; margin: 8px 0; }
.cert-body { font-size: 0.8rem; color: rgba(147,197,253,0.8); line-height: 1.7; }
.cert-sign { margin-top: 16px; font-size: 0.75rem; color: rgba(255,215,0,0.4); }

/* Screen 2 — Chaos Meter */
.chaos-label { font-size: 0.7rem; letter-spacing: 0.3em; color: rgba(147,197,253,0.5); text-transform: uppercase; margin-bottom: 20px; }
.chaos-meter {
  width: 280px; height: 20px; border-radius: 10px;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  overflow: hidden; margin-bottom: 12px;
}
.chaos-fill {
  height: 100%; border-radius: 10px;
  background: linear-gradient(90deg, #60a5fa, #f472b6, #fbbf24);
  animation: chaos-load 2s var(--ease-out-expo) forwards;
  width: 0;
}
@keyframes chaos-load { to { width: 98%; } }
.chaos-pct { font-size: 2rem; font-weight: 100; color: #f472b6; animation: chaos-num 2s var(--ease-out-expo); }
.chaos-verdict { font-size: 0.85rem; color: rgba(147,197,253,0.7); margin-top: 8px; }

/* Screen 3 — Cards */
.bestie-card {
  background: rgba(96,165,250,0.07); border: 1px solid rgba(96,165,250,0.2);
  border-radius: 20px; padding: 32px 28px; max-width: 320px;
  animation: card-slide-in 0.4s var(--ease-out-expo);
}
@keyframes card-slide-in { from{transform:translateX(40px);opacity:0;} to{transform:translateX(0);opacity:1;} }
.bestie-card-emoji { font-size: 2.5rem; margin-bottom: 16px; }
.bestie-card-text { font-size: 1rem; color: #bfdbfe; line-height: 1.7; }

/* Screen 4 — Appreciation */
.bestie-appr-title { font-size: 0.7rem; letter-spacing: 0.3em; color: rgba(147,197,253,0.5); text-transform: uppercase; margin-bottom: 24px; }
.bestie-appr-list { list-style: none; max-width: 300px; }
.bestie-appr-list li {
  padding: 12px 0;
  border-bottom: 1px solid rgba(96,165,250,0.1);
  font-size: 0.85rem; color: rgba(147,197,253,0.85); line-height: 1.6;
  animation: list-in 0.4s var(--ease-out-expo) both;
}
.bestie-appr-list li::before { content: '✦ '; color: var(--bestie-primary); }
@keyframes list-in { from{opacity:0;transform:translateX(-16px);} to{opacity:1;transform:translateX(0);} }

/* Screen 5 — Closing */
.bestie-closing-title {
  font-size: clamp(1.5rem, 6vw, 2.2rem); color: var(--bestie-soft);
  font-weight: 300; margin-bottom: 16px;
}
.bestie-star-shower { font-size: 1.8rem; animation: star-spin 3s linear infinite; letter-spacing: 0.3em; }
@keyframes star-spin { 0%{transform:rotate(0);} 100%{transform:rotate(360deg);} }
```

- [ ] **Step 2: Create `js/paths/bestie.js`**

```js
import { renderNavDots } from './love.js';

const CARDS = [
  { emoji: '🎭', text: "You are the kind of chaos that makes life actually interesting. Best Dost forever." },
  { emoji: '🌙', text: "Raat ko baatein, din ko tease — yahi toh dosti hai. Miss you, Panda." },
  { emoji: '🐼', text: "Panda naam mila na aise hi — you are rare, adorable, and absolutely unforgettable." },
  { emoji: '💙', text: "Koi baat ho ya na ho — tumhara hona hi kaafi hai. Dil se shukria." },
];

let _currentScreen = 0;
let _cardIndex = 0;
const TOTAL = 6;

export function initBestie() {
  _currentScreen = 0;
  _cardIndex = 0;
  buildScreens();
  spawnStars();
  spawnConfetti();
  renderNavDots('bestie-dots', TOTAL, 0);
  showBestieScreen(0);
}

function buildScreens() {
  document.getElementById('bestie-s0').innerHTML = `
    <div class="bestie-panda">🐼</div>
    <div class="bestie-unlock-title">Panda aayi! 🎉</div>
    <div class="bestie-unlock-sub">Best Dost has entered the chat</div>
  `;

  document.getElementById('bestie-s1').innerHTML = `
    <div class="bestie-cert">
      <div class="cert-seal">🏆</div>
      <div class="cert-title">Official Certificate of</div>
      <div class="cert-name">Best Dost</div>
      <div class="cert-body">
        This certifies that <strong style="color:#93c5fd">Alka "Panda" Yadav</strong>
        has achieved the prestigious rank of<br>
        <em style="color:#fbbf24">Ultimate Best Friend Forever</em><br><br>
        Powers include: understanding without explaining,<br>judging together, and vibing at 2am.
      </div>
      <div class="cert-sign">— Issued with love, Vaibhav ✦</div>
    </div>
  `;

  document.getElementById('bestie-s2').innerHTML = `
    <div class="chaos-label">Panda Chaos Level</div>
    <div class="chaos-meter"><div class="chaos-fill"></div></div>
    <div class="chaos-pct">💥 MAXIMUM</div>
    <div class="chaos-verdict">and we love every bit of it 🤣</div>
  `;

  renderBestieCard();

  document.getElementById('bestie-s4').innerHTML = `
    <div class="bestie-appr-title">Why you're irreplaceable</div>
    <ul class="bestie-appr-list">
      ${[
        "You get it before I even finish the sentence",
        "Samjhane ki zaroorat nahi — tum samajh jaati ho",
        "You make distance feel like nothing",
        "Your laugh is literally contagious — problem",
        "Honest without being cruel — rare superpower",
        "The Panda to my chaos 🐼",
      ].map((t, i) => `<li style="animation-delay:${i*0.08}s">${t}</li>`).join('')}
    </ul>
  `;

  document.getElementById('bestie-s5').innerHTML = `
    <div class="bestie-closing-title">Miss you, Panda 🐼</div>
    <div style="font-size:0.85rem;color:rgba(147,197,253,0.6);margin-bottom:24px">
      Doori hai, par dosti nahi 💙
    </div>
    <div class="bestie-star-shower">✦ ⭐ ✦ ⭐ ✦</div>
  `;
}

function renderBestieCard() {
  const c = CARDS[_cardIndex];
  document.getElementById('bestie-s3').innerHTML = `
    <div class="bestie-card">
      <div class="bestie-card-emoji">${c.emoji}</div>
      <div class="bestie-card-text">${c.text}</div>
    </div>
    <div style="margin-top:20px;font-size:0.65rem;letter-spacing:0.2em;color:rgba(96,165,250,0.35)">
      TAP FOR MORE 🐼
    </div>
  `;
}

export function advanceBestie() {
  if (_currentScreen === 3) {
    if (_cardIndex < CARDS.length - 1) {
      _cardIndex++;
      renderBestieCard();
      return;
    }
    _cardIndex = 0;
  }
  if (_currentScreen < TOTAL - 1) {
    showBestieScreen(++_currentScreen);
    renderNavDots('bestie-dots', TOTAL, _currentScreen);
  }
}

function showBestieScreen(index) {
  document.querySelectorAll('.bestie-screen').forEach((s, i) => {
    s.classList.toggle('active-screen', i === index);
    s.classList.toggle('hidden', i !== index);
  });
}

function spawnStars() {
  const c = document.getElementById('bestie-stars');
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'star-dot';
    const sz = 1 + Math.random() * 2.5;
    s.style.cssText = `
      width:${sz}px;height:${sz}px;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      animation-duration:${1.5+Math.random()*3}s;
      animation-delay:${-Math.random()*4}s;
    `;
    c.appendChild(s);
  }
}

function spawnConfetti() {
  const c = document.getElementById('bestie-confetti');
  const colors = ['#60a5fa','#f472b6','#fbbf24','#34d399','#a78bfa','#fb923c'];
  for (let i = 0; i < 30; i++) {
    const bit = document.createElement('div');
    bit.className = 'conf-bit';
    bit.style.cssText = `
      width:${4+Math.random()*6}px;height:${4+Math.random()*6}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      left:${Math.random()*100}%;
      animation-duration:${4+Math.random()*6}s;
      animation-delay:${-Math.random()*8}s;
      opacity:${0.4+Math.random()*0.6};
    `;
    c.appendChild(bit);
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add css/bestie.css js/paths/bestie.js
git commit -m "feat: bestie path — Panda theme, certificate, chaos meter, cards, star shower"
```

---

## Task 9: Self Path

**Files:**
- Create: `css/self.css`
- Create: `js/paths/self.js`

- [ ] **Step 1: Create `css/self.css`**

```css
#screen-self {
  background: radial-gradient(ellipse at 20% 80%, #001428 0%, #030912 70%);
  flex-direction: column; overflow: hidden;
}

/* Grid background */
#self-grid-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px);
  background-size: 28px 28px;
}

.self-screen {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 40px 28px; text-align: center; z-index: 10;
  opacity: 0; transition: opacity 0.8s ease;
}
.self-screen.active-screen { opacity: 1; }

/* Screen 0 — Terminal Unlock */
.self-terminal {
  background: rgba(0,0,0,0.7); border: 1px solid rgba(0,200,255,0.2);
  border-radius: 12px; padding: 20px 24px; min-width: 280px; max-width: 340px;
  text-align: left; font-family: var(--font-mono);
}
.term-top { display:flex; gap:6px; margin-bottom:14px; }
.term-dot { width:10px;height:10px;border-radius:50%; }
.term-line { font-size: 0.75rem; color: rgba(0,200,255,0.7); margin-bottom: 6px; line-height: 1.6; }
.term-line.out { color: rgba(255,255,255,0.85); }
.term-line.success { color: #7dffb0; }
.term-cursor {
  display: inline-block; width: 8px; height: 13px; vertical-align: middle;
  background: var(--self-primary); animation: blink 1s step-end infinite;
}
@keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
.progress-bar-wrap { margin: 6px 0; background: rgba(0,200,255,0.1); border-radius:4px; height:4px; overflow:hidden; }
.progress-bar-fill { height:100%; background: var(--self-primary); animation: prog-load 2s var(--ease-out-expo) forwards; width:0; }
@keyframes prog-load { to{width:100%;} }

/* Screen 1 — Identity Card */
.holo-card {
  width: 300px; background: linear-gradient(135deg, rgba(0,200,255,0.08), rgba(0,100,200,0.12));
  border: 1px solid rgba(0,200,255,0.25);
  border-radius: 16px; padding: 28px 24px;
  box-shadow: 0 0 40px rgba(0,200,255,0.08), inset 0 1px 0 rgba(0,200,255,0.1);
  animation: holo-appear 0.8s var(--ease-out-expo);
  position: relative; overflow: hidden;
}
.holo-card::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, transparent 30%, rgba(0,200,255,0.05) 50%, transparent 70%);
  animation: holo-shimmer 3s linear infinite;
}
@keyframes holo-shimmer { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }
@keyframes holo-appear { from{transform:rotateY(-40deg) scale(0.8);opacity:0;} to{transform:rotateY(0) scale(1);opacity:1;} }
.holo-name { font-size: 1.2rem; font-weight: 600; color: var(--self-primary); letter-spacing: 0.05em; margin-bottom: 4px; }
.holo-title { font-size: 0.65rem; letter-spacing: 0.3em; color: rgba(0,200,255,0.5); text-transform: uppercase; margin-bottom: 16px; }
.holo-divider { height:1px; background: linear-gradient(90deg,transparent,rgba(0,200,255,0.3),transparent); margin: 12px 0; }
.holo-badges { display:flex; flex-wrap:wrap; gap:6px; }
.holo-badge {
  background: rgba(0,200,255,0.08); border: 1px solid rgba(0,200,255,0.2);
  border-radius: 6px; padding: 3px 10px;
  font-size: 0.6rem; color: var(--self-primary); letter-spacing: 0.08em; text-transform: uppercase;
}
.holo-date { font-size:0.6rem; color:rgba(0,200,255,0.3); margin-top:12px; font-family:var(--font-mono); }

/* Screen 2 — Builder Log */
.builder-log { max-width: 320px; width: 100%; }
.log-title { font-size:0.65rem; letter-spacing:0.3em; color:rgba(0,200,255,0.4); text-transform:uppercase; margin-bottom:20px; }
.log-entry {
  display:flex; align-items:flex-start; gap:12px;
  padding: 12px 0; border-bottom: 1px solid rgba(0,200,255,0.08);
  animation: log-slide 0.4s var(--ease-out-expo) both;
  text-align: left;
}
@keyframes log-slide { from{opacity:0;transform:translateX(-16px);} to{opacity:1;transform:translateX(0);} }
.log-icon { font-size:1.1rem; flex-shrink:0; margin-top:2px; }
.log-text h4 { font-size:0.8rem; color: var(--self-soft); font-weight:500; margin-bottom:2px; }
.log-text p  { font-size:0.7rem; color:rgba(125,211,252,0.5); }

/* Screen 3 — Mirror Moment */
.mirror-quote {
  font-size: clamp(1rem, 4vw, 1.4rem); font-weight: 300;
  color: var(--self-soft); line-height: 1.7; max-width: 320px;
  border-left: 2px solid var(--self-primary); padding-left: 20px; text-align: left;
  animation: mirror-in 0.6s var(--ease-out-expo);
}
@keyframes mirror-in { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
.mirror-sub { font-size:0.75rem; color:rgba(0,200,255,0.4); margin-top:16px; font-family:var(--font-mono); }

/* Screen 4 — Mantras */
.mantra-text {
  font-size: clamp(1.3rem, 5vw, 2rem); font-weight: 700;
  color: #fff; letter-spacing: 0.04em; max-width: 320px; line-height: 1.4;
  text-shadow: 0 0 40px rgba(0,200,255,0.3);
  animation: mantra-pop 0.5s var(--ease-out-expo);
}
@keyframes mantra-pop { from{transform:scale(0.8);opacity:0;} to{transform:scale(1);opacity:1;} }
.mantra-num { font-size:0.6rem; letter-spacing:0.4em; color:rgba(0,200,255,0.3); margin-bottom:16px; text-transform:uppercase; font-family:var(--font-mono); }
.mantra-hindi { font-size:0.8rem; color:rgba(0,200,255,0.5); margin-top:12px; font-style:italic; }

/* Screen 5 — Closing */
.self-closing-line {
  font-size:clamp(0.9rem, 3.5vw, 1.1rem); color: var(--self-soft);
  line-height: 2; max-width: 320px; font-weight: 300;
  border: 1px solid rgba(0,200,255,0.12); border-radius:16px;
  padding: 28px 24px; background: rgba(0,200,255,0.03);
  animation: closing-fade 1s var(--ease-out-expo);
}
@keyframes closing-fade { from{opacity:0;} to{opacity:1;} }
.self-cursor-blink { display:inline-block; width:10px; height:18px; background:var(--self-primary); animation:blink 1s step-end infinite; vertical-align:middle; margin-left:4px; }
```

- [ ] **Step 2: Create `js/paths/self.js`**

```js
import { renderNavDots } from './love.js';

const MANTRAS = [
  { en: "Ship it. Done beats perfect.", hi: "Karo. Perfect baad mein hoga." },
  { en: "The distance is temporary. The dream is not.", hi: "Doori khatam hogi. Sapna nahi." },
  { en: "Build things that outlast the moment.", hi: "Aisa banao jo waqt se zyada chale." },
  { en: "Rest is not surrender. It is strategy.", hi: "Aaraam takleef nahi, takneek hai." },
  { en: "Your consistency will embarrass their talent.", hi: "Teri mehnat unki talent ko sharmayegi." },
];

const MIRROR_QUOTES = [
  { q: "You left everything comfortable to build something meaningful. That took courage most people don't have.", sub: "// acknowledged" },
  { q: "Long distance is hard. Building a future across oceans while staying sane — harder. You're doing both.", sub: "// running strong" },
  { q: "Vaibhav. The same person who couldn't sleep because of an idea at 2am — that energy is your edge.", sub: "// don't lose it" },
];

let _currentScreen = 0;
let _mantrasIndex = 0;
let _mirrorIndex = 0;
const TOTAL = 6;

export function initSelf() {
  _currentScreen = 0;
  _mantrasIndex = 0;
  _mirrorIndex = 0;
  buildScreens();
  renderNavDots('self-dots', TOTAL, 0);
  showSelfScreen(0);
}

function buildScreens() {
  // Screen 0 — Terminal Unlock
  document.getElementById('self-s0').innerHTML = `
    <div class="self-terminal">
      <div class="term-top">
        <div class="term-dot" style="background:#ff5f57"></div>
        <div class="term-dot" style="background:#febc2e"></div>
        <div class="term-dot" style="background:#28c840"></div>
      </div>
      <div class="term-line">$ whoami</div>
      <div class="term-line out">vaibhavkumar_yadav</div>
      <div class="term-line" style="margin-top:8px">$ sudo load-vaibhav --full</div>
      <div class="term-line out" style="color:#7dffb0">Loading identity...</div>
      <div class="progress-bar-wrap"><div class="progress-bar-fill"></div></div>
      <div class="term-line success" id="self-load-done" style="opacity:0">✓ Identity loaded. Welcome back, builder 🔥</div>
      <div class="term-line" style="margin-top:4px">$<span class="term-cursor"></span></div>
    </div>
  `;
  setTimeout(() => {
    const el = document.getElementById('self-load-done');
    if (el) el.style.cssText = 'opacity:1;transition:opacity 0.5s;';
  }, 2100);

  // Screen 1 — Identity Card
  const now = new Date();
  document.getElementById('self-s1').innerHTML = `
    <div class="holo-card">
      <div class="holo-name">Vaibhavkumar Yadav</div>
      <div class="holo-title">Builder · Dreamer · Grinder</div>
      <div class="holo-divider"></div>
      <div class="holo-badges">
        <span class="holo-badge">Full Stack</span>
        <span class="holo-badge">Texas, USA</span>
        <span class="holo-badge">Long Distance ✓</span>
        <span class="holo-badge">Ships Things</span>
        <span class="holo-badge">Never Stops</span>
      </div>
      <div class="holo-date">ACCESS DATE: ${now.toISOString().split('T')[0]} // AUTHENTICATED</div>
    </div>
  `;

  // Screen 2 — Builder Log
  document.getElementById('self-s2').innerHTML = `
    <div class="builder-log">
      <div class="log-title">Builder Log</div>
      ${[
        { icon:'🚀', h:'Building from Texas',     p:'Engineering the future, one commit at a time' },
        { icon:'💙', h:'Holding it together',      p:'Long distance, full focus, zero excuses' },
        { icon:'🛠', h:'Shipping what matters',    p:'Ideas into products. Every. Single. Week.' },
        { icon:'🌙', h:'2am sessions hit different', p:'When the world sleeps, builders build' },
        { icon:'🔥', h:'Not done yet',              p:'The best version of Vaibhav is loading...' },
      ].map((e, i) => `
        <div class="log-entry" style="animation-delay:${i*0.1}s">
          <div class="log-icon">${e.icon}</div>
          <div class="log-text"><h4>${e.h}</h4><p>${e.p}</p></div>
        </div>
      `).join('')}
    </div>
  `;

  // Screen 3 — Mirror (first one rendered)
  renderMirrorQuote();

  // Screen 4 — Mantras (first one rendered)
  renderMantra();

  // Screen 5 — Closing
  document.getElementById('self-s5').innerHTML = `
    <div class="self-closing-line">
      Keep going.<br>
      The distance is temporary.<br>
      The dream is not.<br><br>
      <span style="color:rgba(0,200,255,0.5);font-size:0.75rem">
        — Vaibhavkumar, Texas, USA 🌙
      </span>
    </div>
    <div style="margin-top:24px;font-family:var(--font-mono);font-size:0.7rem;color:rgba(0,200,255,0.2)">
      $ <span class="self-cursor-blink"></span>
    </div>
  `;
}

function renderMirrorQuote() {
  const m = MIRROR_QUOTES[_mirrorIndex];
  document.getElementById('self-s3').innerHTML = `
    <div class="mirror-quote">${m.q}</div>
    <div class="mirror-sub">${m.sub}</div>
  `;
}

function renderMantra() {
  const m = MANTRAS[_mantrasIndex];
  document.getElementById('self-s4').innerHTML = `
    <div class="mantra-num">Mantra ${_mantrasIndex + 1} / ${MANTRAS.length}</div>
    <div class="mantra-text">${m.en}</div>
    <div class="mantra-hindi">${m.hi}</div>
  `;
}

export function advanceSelf() {
  if (_currentScreen === 3) {
    if (_mirrorIndex < MIRROR_QUOTES.length - 1) { _mirrorIndex++; renderMirrorQuote(); return; }
    _mirrorIndex = 0;
  }
  if (_currentScreen === 4) {
    if (_mantrasIndex < MANTRAS.length - 1) { _mantrasIndex++; renderMantra(); return; }
    _mantrasIndex = 0;
  }
  if (_currentScreen < TOTAL - 1) {
    showSelfScreen(++_currentScreen);
    renderNavDots('self-dots', TOTAL, _currentScreen);
  }
}

function showSelfScreen(index) {
  document.querySelectorAll('.self-screen').forEach((s, i) => {
    s.classList.toggle('active-screen', i === index);
    s.classList.toggle('hidden', i !== index);
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add css/self.css js/paths/self.js
git commit -m "feat: self path — terminal unlock, holo card, builder log, mantras, mirror quotes"
```

---

## Task 10: Audio System

**Files:**
- Create: `js/audio.js`
- Add: `audio/` placeholder files (user sources MP3s)

- [ ] **Step 1: Source audio files**

Visit **pixabay.com/music** (free, no attribution needed for personal use).
- Search "romantic piano" → download as `audio/love.mp3`
- Search "upbeat fun" or "happy ukulele" → download as `audio/bestie.mp3`
- Search "lofi beats" → download as `audio/self.mp3`

Rename and place in `/audio/` folder.

- [ ] **Step 2: Create `js/audio.js`**

```js
const TRACKS = {
  love:   'audio/love.mp3',
  bestie: 'audio/bestie.mp3',
  self:   'audio/self.mp3',
};

let _current = null;
let _muted = false;

export function playTrack(path) {
  if (_current) {
    _current.pause();
    _current.currentTime = 0;
  }
  const audio = new Audio(TRACKS[path]);
  audio.loop = true;
  audio.volume = 0;
  _current = audio;
  if (!_muted) {
    audio.play().catch(() => {}); // ignore autoplay block
    fadeIn(audio, 0.5, 2000);
  }
}

export function stopTrack() {
  if (!_current) return;
  fadeOut(_current, 800).then(() => {
    _current.pause();
    _current = null;
  });
}

export function bindMuteBtn(btnId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener('click', () => {
    _muted = !_muted;
    btn.classList.toggle('muted', _muted);
    if (_current) {
      if (_muted) fadeOut(_current, 400);
      else { _current.play().catch(()=>{}); fadeIn(_current, 0.5, 400); }
    }
  });
}

function fadeIn(audio, targetVol, duration) {
  const step = targetVol / (duration / 50);
  const interval = setInterval(() => {
    audio.volume = Math.min(audio.volume + step, targetVol);
    if (audio.volume >= targetVol) clearInterval(interval);
  }, 50);
}

function fadeOut(audio, duration) {
  return new Promise(resolve => {
    const startVol = audio.volume;
    const step = startVol / (duration / 50);
    const interval = setInterval(() => {
      audio.volume = Math.max(audio.volume - step, 0);
      if (audio.volume <= 0) { clearInterval(interval); resolve(); }
    }, 50);
  });
}
```

- [ ] **Step 3: Commit (audio files + js)**

```bash
git add audio/ js/audio.js
git commit -m "feat: audio system — per-path tracks, fade in/out, mute toggle"
```

---

## Task 11: Navigation + Reveal + Wire Everything Together

**Files:**
- Create: `js/nav.js`
- Modify: `js/main.js`

- [ ] **Step 1: Create `js/nav.js`**

```js
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
  // Ignore clicks on interactive elements
  const tag = e.target.tagName.toLowerCase();
  if (['button','input','a'].includes(tag)) return;
  const handler = HANDLERS[getState()];
  if (handler) handler();
}
```

- [ ] **Step 2: Replace `js/main.js` with full wired version**

```js
import { loadModels } from './face-engine.js';
import { initPortal } from './portal.js';
import { initLove } from './paths/love.js';
import { initBestie } from './paths/bestie.js';
import { initSelf } from './paths/self.js';
import { playTrack, stopTrack, bindMuteBtn } from './audio.js';
import { initNav } from './nav.js';
import { setState, S } from './state.js';

export function revealPath(path) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));

  // Map path → state + screen + init
  const MAP = {
    love:   { state: S.PATH_LOVE,   screenId: 'screen-love',   init: initLove,   muteBtn: 'love-mute'   },
    bestie: { state: S.PATH_BESTIE, screenId: 'screen-bestie', init: initBestie, muteBtn: 'bestie-mute' },
    self:   { state: S.PATH_SELF,   screenId: 'screen-self',   init: initSelf,   muteBtn: 'self-mute'   },
  };

  const config = MAP[path];
  if (!config) return;

  setState(config.state);
  document.getElementById(config.screenId).classList.remove('hidden');
  config.init();
  playTrack(path);
  bindMuteBtn(config.muteBtn);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadModels();
  initPortal();
  initNav();
});
```

- [ ] **Step 3: Full end-to-end test**

1. `python3 -m http.server 8080`
2. Visit `http://localhost:8080`
3. Allow camera
4. Visit `?setup` → enroll Vaibhavkumar's face
5. On portal: let it detect your face → enter "Vaibhavkumar Yadav" → self path should open with terminal animation
6. Test wrong name → "Identity Unknown" glitch
7. Test wrong face (cover camera with hand) → no match

- [ ] **Step 4: Commit**

```bash
git add js/nav.js js/main.js
git commit -m "feat: wire everything — revealPath, navigation, full end-to-end flow"
```

---

## Task 12: GitHub Pages Deploy

**Files:**
- Create: `.github/workflows/pages.yml` (optional — for auto-deploy)

- [ ] **Step 1: Create GitHub repo**

```bash
# On github.com: create new repo "Love" (private recommended)
git remote add origin https://github.com/YOUR_USERNAME/Love.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Enable GitHub Pages**

GitHub → repo → Settings → Pages → Source: "Deploy from branch" → Branch: `main`, folder: `/ (root)` → Save.

Wait ~60 seconds → site live at `https://YOUR_USERNAME.github.io/Love/`

- [ ] **Step 3: Fix model paths for GitHub Pages subdirectory (if needed)**

If `face-api.js` model loading fails on GitHub Pages (because the app is at `/Love/` not `/`), update model path in `js/face-engine.js`:

```js
// Detect if running on GitHub Pages (subdirectory) vs localhost (root)
const MODEL_URL = window.location.hostname === 'localhost'
  ? '/models'
  : `${window.location.pathname.replace(/\/[^/]*$/, '')}/models`;

export async function loadModels() {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);
  _modelsLoaded = true;
}
```

- [ ] **Step 4: Test on real device**

Open GitHub Pages URL on mobile (iOS/Android). Allow camera. Verify:
- Camera opens (uses front camera via `facingMode: 'user'`)
- Face detection works
- Tap-to-advance navigation works with touch
- Audio unmutes and plays

- [ ] **Step 5: Final commit**

```bash
git add js/face-engine.js
git commit -m "fix: model path for GitHub Pages subdirectory deployment"
git push origin main
```

---

## Post-Deploy Checklist

- [ ] Enroll all 3 faces via `?setup` on the live site — descriptors save to **your** browser's localStorage
- [ ] Share the URL with Pragya and Alka — they will enroll fresh when they first visit... wait, no. **Important:** Enrollment must happen on each person's device OR you need to export/import descriptors.

**Descriptor portability solution** — after enrolling on your device, open DevTools Console on the live site and run:

```js
// Export descriptors from your device
console.log(localStorage.getItem('love_portal_users'));
```

Copy the JSON. On each person's device, open DevTools Console before their first visit and run:

```js
localStorage.setItem('love_portal_users', '<PASTE_JSON_HERE>');
```

Then the portal works on their device without re-enrollment.

Alternatively, add a one-time hardcoded fallback in `config.js` by pasting the exported Float32Array values directly — then the app works on any device without setup.

---

## Self-Review Notes

- All 3 paths use `renderNavDots` from `love.js` — ensure that import is correct in `bestie.js` and `self.js`
- `advanceLove/Bestie/Self` exported and imported in `nav.js` — names must match exactly
- `revealPath` in `main.js` exported and imported in `portal.js` and `admin.js` — circular import risk: use dynamic `import()` in portal.js (already done via `await import('./admin.js')`)
- `faceapi` is a global (from CDN script tag) — no import needed, but must load before `main.js` runs. CDN `<script>` tag in `index.html` comes before `<script type="module">` — correct order already in Task 1
- `loadModels()` guarded by `_modelsLoaded` flag — safe to call multiple times
- localStorage descriptor deserialization uses `new Float32Array(Object.values(...))` — handles both array and object-keyed serialization
