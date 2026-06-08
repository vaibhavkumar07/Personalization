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
  buildBestieScreens();
  spawnStars();
  spawnConfetti();
  renderNavDots('bestie-dots', TOTAL, 0);
  showBestieScreen(0);
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
    _currentScreen++;
    showBestieScreen(_currentScreen);
    renderNavDots('bestie-dots', TOTAL, _currentScreen);
  }
}

function buildBestieScreens() {
  // Screen 0 — Unlock
  const s0 = document.getElementById('bestie-s0');
  s0.innerHTML = '';
  const panda = document.createElement('div');
  panda.className = 'bestie-panda';
  panda.textContent = '🐼';
  const title = document.createElement('div');
  title.className = 'bestie-unlock-title';
  title.textContent = 'Panda aayi! 🎉';
  const sub = document.createElement('div');
  sub.className = 'bestie-unlock-sub';
  sub.textContent = 'Best Dost has entered the chat';
  s0.append(panda, title, sub);

  // Screen 1 — Certificate
  const s1 = document.getElementById('bestie-s1');
  s1.innerHTML = '';
  const cert = document.createElement('div');
  cert.className = 'bestie-cert';
  cert.innerHTML = `
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
  `;
  s1.appendChild(cert);

  // Screen 2 — Chaos Meter
  const s2 = document.getElementById('bestie-s2');
  s2.innerHTML = '';
  const chaosLabel = document.createElement('div');
  chaosLabel.className = 'chaos-label';
  chaosLabel.textContent = 'Panda Chaos Level';
  const meter = document.createElement('div');
  meter.className = 'chaos-meter';
  const fill = document.createElement('div');
  fill.className = 'chaos-fill';
  meter.appendChild(fill);
  const pct = document.createElement('div');
  pct.className = 'chaos-pct';
  pct.textContent = '💥 MAXIMUM';
  const verdict = document.createElement('div');
  verdict.className = 'chaos-verdict';
  verdict.textContent = 'and we love every bit of it 🤣';
  s2.append(chaosLabel, meter, pct, verdict);

  // Screen 3 — Cards (rendered dynamically)
  renderBestieCard();

  // Screen 4 — Appreciation
  const s4 = document.getElementById('bestie-s4');
  s4.innerHTML = '';
  const apprTitle = document.createElement('div');
  apprTitle.className = 'bestie-appr-title';
  apprTitle.textContent = "Why you're irreplaceable";
  const list = document.createElement('ul');
  list.className = 'bestie-appr-list';
  [
    "You get it before I even finish the sentence",
    "Samjhane ki zaroorat nahi — tum samajh jaati ho",
    "You make distance feel like nothing",
    "Your laugh is literally contagious — problem",
    "Honest without being cruel — rare superpower",
    "The Panda to my chaos 🐼",
  ].forEach((text, i) => {
    const li = document.createElement('li');
    li.textContent = text;
    li.style.animationDelay = `${i * 0.08}s`;
    list.appendChild(li);
  });
  s4.append(apprTitle, list);

  // Screen 5 — Closing
  const s5 = document.getElementById('bestie-s5');
  s5.innerHTML = '';
  const closingTitle = document.createElement('div');
  closingTitle.className = 'bestie-closing-title';
  closingTitle.textContent = 'Miss you, Panda 🐼';
  const closingSub = document.createElement('div');
  closingSub.style.cssText = 'font-size:0.85rem;color:rgba(147,197,253,0.6);margin-bottom:24px';
  closingSub.textContent = 'Doori hai, par dosti nahi 💙';
  const starShower = document.createElement('div');
  starShower.className = 'bestie-star-shower';
  starShower.textContent = '✦ ⭐ ✦ ⭐ ✦';
  s5.append(closingTitle, closingSub, starShower);
}

function renderBestieCard() {
  const c = CARDS[_cardIndex];
  const s3 = document.getElementById('bestie-s3');
  s3.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'bestie-card';
  const emoji = document.createElement('div');
  emoji.className = 'bestie-card-emoji';
  emoji.textContent = c.emoji;
  const text = document.createElement('div');
  text.className = 'bestie-card-text';
  text.textContent = c.text;
  card.append(emoji, text);
  const tapHint = document.createElement('div');
  tapHint.style.cssText = 'margin-top:20px;font-size:0.65rem;letter-spacing:0.2em;color:rgba(96,165,250,0.35)';
  tapHint.textContent = 'TAP FOR MORE 🐼';
  s3.append(card, tapHint);
}

function showBestieScreen(index) {
  document.querySelectorAll('.bestie-screen').forEach((s, i) => {
    const isActive = i === index;
    s.classList.toggle('active-screen', isActive);
    if (isActive) s.classList.remove('hidden');
    else s.classList.add('hidden');
  });
}

function spawnStars() {
  const c = document.getElementById('bestie-stars');
  c.innerHTML = '';
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
  c.innerHTML = '';
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
    `;
    c.appendChild(bit);
  }
}
