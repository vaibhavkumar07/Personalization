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
  buildSelfScreens();
  renderNavDots('self-dots', TOTAL, 0);
  showSelfScreen(0);
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
    _currentScreen++;
    showSelfScreen(_currentScreen);
    renderNavDots('self-dots', TOTAL, _currentScreen);
  }
}

function buildSelfScreens() {
  // Screen 0 — Terminal Unlock
  const s0 = document.getElementById('self-s0');
  s0.innerHTML = '';
  const terminal = document.createElement('div');
  terminal.className = 'self-terminal';
  terminal.innerHTML = `
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
  `;
  s0.appendChild(terminal);
  setTimeout(() => {
    const el = document.getElementById('self-load-done');
    if (el) el.style.cssText = 'opacity:1;transition:opacity 0.5s;color:#7dffb0;font-size:0.75rem;margin-bottom:6px;line-height:1.6';
  }, 2100);

  // Screen 1 — Identity Card
  const s1 = document.getElementById('self-s1');
  s1.innerHTML = '';
  const now = new Date();
  const holoCard = document.createElement('div');
  holoCard.className = 'holo-card';
  const nameEl = document.createElement('div');
  nameEl.className = 'holo-name';
  nameEl.textContent = 'Vaibhavkumar Yadav';
  const titleEl = document.createElement('div');
  titleEl.className = 'holo-title';
  titleEl.textContent = 'Builder · Dreamer · Grinder';
  const divider = document.createElement('div');
  divider.className = 'holo-divider';
  const badges = document.createElement('div');
  badges.className = 'holo-badges';
  ['Full Stack', 'Texas, USA', 'Long Distance ✓', 'Ships Things', 'Never Stops'].forEach(b => {
    const badge = document.createElement('span');
    badge.className = 'holo-badge';
    badge.textContent = b;
    badges.appendChild(badge);
  });
  const dateEl = document.createElement('div');
  dateEl.className = 'holo-date';
  dateEl.textContent = `ACCESS DATE: ${now.toISOString().split('T')[0]} // AUTHENTICATED`;
  holoCard.append(nameEl, titleEl, divider, badges, dateEl);
  s1.appendChild(holoCard);

  // Screen 2 — Builder Log
  const s2 = document.getElementById('self-s2');
  s2.innerHTML = '';
  const logWrap = document.createElement('div');
  logWrap.className = 'builder-log';
  const logTitle = document.createElement('div');
  logTitle.className = 'log-title';
  logTitle.textContent = 'Builder Log';
  logWrap.appendChild(logTitle);
  [
    { icon:'🚀', h:'Building from Texas', p:'Engineering the future, one commit at a time' },
    { icon:'💙', h:'Holding it together', p:'Long distance, full focus, zero excuses' },
    { icon:'🛠', h:'Shipping what matters', p:'Ideas into products. Every. Single. Week.' },
    { icon:'🌙', h:'2am sessions hit different', p:'When the world sleeps, builders build' },
    { icon:'🔥', h:'Not done yet', p:'The best version of Vaibhav is loading...' },
  ].forEach((e, i) => {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.style.animationDelay = `${i * 0.1}s`;
    const icon = document.createElement('div');
    icon.className = 'log-icon';
    icon.textContent = e.icon;
    const textWrap = document.createElement('div');
    textWrap.className = 'log-text';
    const h = document.createElement('h4');
    h.textContent = e.h;
    const p = document.createElement('p');
    p.textContent = e.p;
    textWrap.append(h, p);
    entry.append(icon, textWrap);
    logWrap.appendChild(entry);
  });
  s2.appendChild(logWrap);

  // Screen 3 — Mirror (first quote)
  renderMirrorQuote();

  // Screen 4 — Mantra (first mantra)
  renderMantra();

  // Screen 5 — Closing
  const s5 = document.getElementById('self-s5');
  s5.innerHTML = '';
  const closing = document.createElement('div');
  closing.className = 'self-closing-line';
  closing.innerHTML = `
    Keep going.<br>
    The distance is temporary.<br>
    The dream is not.<br><br>
    <span style="color:rgba(0,200,255,0.5);font-size:0.75rem">— Vaibhavkumar, Texas, USA 🌙</span>
  `;
  const cursorLine = document.createElement('div');
  cursorLine.style.cssText = 'margin-top:24px;font-family:var(--font-mono);font-size:0.7rem;color:rgba(0,200,255,0.2)';
  cursorLine.innerHTML = '$ <span class="self-cursor-blink"></span>';
  s5.append(closing, cursorLine);
}

function renderMirrorQuote() {
  const m = MIRROR_QUOTES[_mirrorIndex];
  const s3 = document.getElementById('self-s3');
  s3.innerHTML = '';
  const quote = document.createElement('div');
  quote.className = 'mirror-quote';
  quote.textContent = m.q;
  const sub = document.createElement('div');
  sub.className = 'mirror-sub';
  sub.textContent = m.sub;
  s3.append(quote, sub);
}

function renderMantra() {
  const m = MANTRAS[_mantrasIndex];
  const s4 = document.getElementById('self-s4');
  s4.innerHTML = '';
  const num = document.createElement('div');
  num.className = 'mantra-num';
  num.textContent = `Mantra ${_mantrasIndex + 1} / ${MANTRAS.length}`;
  const text = document.createElement('div');
  text.className = 'mantra-text';
  text.textContent = m.en;
  const hindi = document.createElement('div');
  hindi.className = 'mantra-hindi';
  hindi.textContent = m.hi;
  s4.append(num, text, hindi);
}

function showSelfScreen(index) {
  document.querySelectorAll('.self-screen').forEach((s, i) => {
    const isActive = i === index;
    s.classList.toggle('active-screen', isActive);
    if (isActive) s.classList.remove('hidden');
    else s.classList.add('hidden');
  });
}
