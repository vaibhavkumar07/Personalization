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
let _reasonIndex = 0;
const TOTAL = 6;

export function initLove() {
  _currentScreen = 0;
  _reasonIndex = 0;
  buildScreens();
  spawnPetals();
  renderNavDots('love-dots', TOTAL, 0);
  showLoveScreen(0);
}

export function advanceLove() {
  if (_currentScreen === 3) {
    if (_reasonIndex < REASONS.length - 1) {
      _reasonIndex++;
      renderReasonCard(_reasonIndex);
      return;
    }
    _reasonIndex = 0;
  }
  if (_currentScreen < TOTAL - 1) {
    _currentScreen++;
    showLoveScreen(_currentScreen);
    renderNavDots('love-dots', TOTAL, _currentScreen);
  }
}

function buildScreens() {
  // Screen 0 — Unlock
  const s0 = document.getElementById('love-s0');
  s0.innerHTML = '';
  const heart = document.createElement('div');
  heart.className = 'love-unlock-heart';
  heart.textContent = '❤️';
  const title = document.createElement('div');
  title.className = 'love-unlock-title';
  title.textContent = 'Meri Jaan aa gayi 🌹';
  const sub = document.createElement('div');
  sub.className = 'love-unlock-sub';
  sub.textContent = 'tumhara intezaar rehta hai...';
  s0.append(heart, title, sub);

  // Screen 1 — Love Letter
  const s1 = document.getElementById('love-s1');
  s1.innerHTML = '';
  const paper = document.createElement('div');
  paper.className = 'love-letter-paper';
  paper.innerHTML = `
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
  `;
  s1.appendChild(paper);

  // Screen 2 — Distance Counter
  const s2 = document.getElementById('love-s2');
  s2.innerHTML = '';
  const distKm = calcDistanceKm(COORDS.vaibhav, COORDS.pragya);
  const numEl = document.createElement('div');
  numEl.className = 'love-distance-num';
  numEl.id = 'dist-counter';
  numEl.textContent = '0';
  const labelEl = document.createElement('div');
  labelEl.className = 'love-distance-label';
  labelEl.textContent = 'kilometres apart';
  const globeWrap = document.createElement('div');
  globeWrap.className = 'love-globe-wrap';
  globeWrap.innerHTML = buildGlobeSVG();
  const subEl = document.createElement('div');
  subEl.className = 'love-globe-sub';
  subEl.textContent = `${COORDS.vaibhav.label} ↔ ${COORDS.pragya.label}`;
  const noteEl = document.createElement('div');
  noteEl.style.cssText = 'margin-top:16px;font-size:0.8rem;color:rgba(255,150,180,0.6)';
  noteEl.textContent = 'Par dil ki doori? Zero. 💕';
  s2.append(numEl, labelEl, globeWrap, subEl, noteEl);

  // Screen 3 — Reason Card (rendered dynamically)
  renderReasonCard(0);

  // Screen 4 — Memory Wall
  const s4 = document.getElementById('love-s4');
  s4.innerHTML = '';
  const wallLabel = document.createElement('div');
  wallLabel.style.cssText = 'font-size:0.7rem;letter-spacing:0.3em;color:rgba(255,150,180,0.5);text-transform:uppercase;margin-bottom:20px';
  wallLabel.textContent = 'Our Moments';
  const polaroids = document.createElement('div');
  polaroids.className = 'love-polaroids';
  [
    { emoji: '🌹', caption: 'Always ❤️' },
    { emoji: '💕', caption: 'Together' },
    { emoji: '🌟', caption: 'Forever' },
    { emoji: '🥰', caption: 'My love' },
  ].forEach((p, i) => {
    const pol = document.createElement('div');
    pol.className = 'polaroid';
    pol.style.cssText = `--rot:${[-3,4,-2,3][i]}deg;animation-delay:${i*0.1}s`;
    const img = document.createElement('div');
    img.className = 'polaroid-img';
    img.textContent = p.emoji;
    const cap = document.createElement('div');
    cap.className = 'polaroid-caption';
    cap.textContent = p.caption;
    pol.append(img, cap);
    polaroids.appendChild(pol);
  });
  const hint = document.createElement('div');
  hint.style.cssText = 'margin-top:20px;font-size:0.75rem;color:rgba(255,150,180,0.4)';
  hint.textContent = 'replace emojis with real photos ✨';
  s4.append(wallLabel, polaroids, hint);

  // Screen 5 — Closing
  const s5 = document.getElementById('love-s5');
  s5.innerHTML = '';
  const rain = document.createElement('div');
  rain.className = 'love-hearts-rain';
  rain.textContent = '💕 ❤️ 🌹 💕 ❤️';
  const sig = document.createElement('div');
  sig.className = 'love-closing-sig';
  sig.style.marginTop = '24px';
  sig.textContent = 'Tumhara Vaibhav';
  const forever = document.createElement('div');
  forever.style.cssText = 'font-size:0.85rem;color:rgba(255,150,180,0.7);margin-top:8px';
  forever.textContent = 'Always & Forever 🌹';
  const finalHeart = document.createElement('div');
  finalHeart.style.cssText = 'margin-top:24px;font-size:1.5rem;animation:heartbeat 1.5s ease-in-out infinite';
  finalHeart.textContent = '❤️';
  s5.append(rain, sig, forever, finalHeart);
}

function renderReasonCard(index) {
  const r = REASONS[index];
  const s3 = document.getElementById('love-s3');
  s3.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'love-card';
  const num = document.createElement('div');
  num.className = 'love-card-num';
  num.textContent = `Reason ${index + 1} of ${REASONS.length}`;
  const text = document.createElement('div');
  text.className = 'love-card-text';
  text.textContent = r.en;
  const hindi = document.createElement('div');
  hindi.className = 'love-card-hindi';
  hindi.textContent = r.hi;
  card.append(num, text, hindi);
  const tapHint = document.createElement('div');
  tapHint.style.cssText = 'margin-top:20px;font-size:0.65rem;letter-spacing:0.2em;color:rgba(255,150,180,0.35)';
  tapHint.textContent = 'TAP FOR NEXT REASON';
  s3.append(card, tapHint);
}

function showLoveScreen(index) {
  document.querySelectorAll('.love-screen').forEach((s, i) => {
    const isActive = i === index;
    s.classList.toggle('active-screen', isActive);
    if (isActive) s.classList.remove('hidden');
    else s.classList.add('hidden');
  });
  if (index === 2) {
    const distKm = calcDistanceKm(COORDS.vaibhav, COORDS.pragya);
    animateCounter('dist-counter', distKm, 2000);
  }
}

function spawnPetals() {
  const container = document.getElementById('love-petals');
  container.innerHTML = '';
  ['🌸','🌹','💕','✨','🌺'].forEach(emoji => {
    for (let j = 0; j < 3; j++) {
      const p = document.createElement('div');
      p.className = 'petal';
      p.textContent = emoji;
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        animation-duration: ${4 + Math.random() * 4}s;
        animation-delay: ${-Math.random() * 8}s;
      `;
      container.appendChild(p);
    }
  });
}

function buildGlobeSVG() {
  return `<svg width="200" height="120" viewBox="0 0 200 120" role="img" aria-label="Globe showing Texas and Noida">
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
    <ellipse cx="100" cy="60" rx="90" ry="52" fill="url(#globe-grad)" stroke="rgba(255,100,150,0.2)" stroke-width="1"/>
    <ellipse cx="100" cy="60" rx="90" ry="20" fill="none" stroke="rgba(255,100,150,0.08)" stroke-width="0.5"/>
    <ellipse cx="100" cy="60" rx="90" ry="40" fill="none" stroke="rgba(255,100,150,0.08)" stroke-width="0.5"/>
    <line x1="100" y1="8" x2="100" y2="112" stroke="rgba(255,100,150,0.08)" stroke-width="0.5"/>
    <path d="M 38 58 Q 100 10 162 52" fill="none" stroke="rgba(255,100,150,0.7)" stroke-width="1.5" stroke-dasharray="4 3" filter="url(#glow-filter)">
      <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite"/>
    </path>
    <circle cx="38" cy="58" r="5" fill="#ff2060" filter="url(#glow-filter)"/>
    <circle cx="38" cy="58" r="9" fill="none" stroke="rgba(255,32,96,0.4)" stroke-width="1">
      <animate attributeName="r" values="5;12;5" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="162" cy="52" r="5" fill="#ff6699" filter="url(#glow-filter)"/>
    <circle cx="162" cy="52" r="9" fill="none" stroke="rgba(255,102,153,0.4)" stroke-width="1">
      <animate attributeName="r" values="5;12;5" dur="2s" begin="1s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="1;0;1" dur="2s" begin="1s" repeatCount="indefinite"/>
    </circle>
    <text x="28" y="76" font-size="7" fill="rgba(255,150,180,0.7)" text-anchor="middle">Texas</text>
    <text x="168" y="68" font-size="7" fill="rgba(255,150,180,0.7)" text-anchor="middle">Noida</text>
  </svg>`;
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
  el.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = `nav-dot${i === active ? ' active' : ''}`;
    el.appendChild(dot);
  }
}
