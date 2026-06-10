# Love Portal — Design Spec
**Date:** 2026-06-08  
**Stack:** Vanilla HTML/CSS/JS · face-api.js · GitHub Pages

---

## Overview

Single-page facial recognition portal for 3 people. Each person sees only their own path after face + name verification. No backend. Fully client-side. Deployed to GitHub Pages.

**Users:**
| Person | Relation | Path |
|--------|----------|------|
| Pragya Yadav | Wife | Love Path |
| Alka Yadav ("Panda") | Wife's sister | Bestie Path |
| Vaibhavkumar Yadav | Self | Self Path |

---

## Architecture

```
index.html
├── face-api.js models (/models/)
├── style.css
└── app.js
    ├── Stage 1: Portal Screen (glass UI)
    ├── Stage 2: Camera capture + face scan
    ├── Stage 3: Name input
    ├── Stage 4: Match logic → success or fail
    └── Stage 5: Reveal path (Love / Bestie / Self)
```

All 3 paths exist in same HTML, hidden via JS state machine. No direct URL access. Paths render only after verified face+name match. Face descriptors stored as hardcoded float arrays in `app.js`.

---

## Flow

```
Open app
  → Glass portal loads (animated)
  → "Show your face" prompt
  → Camera opens, face-api.js scans live video feed
  → Face detected → freeze frame + scan animation
  → "Enter your name" input appears (slide-up)
  → Name typed → match face descriptor + name
  → ✅ Match → cinematic unlock transition → path revealed
  → ❌ No match → "Identity Unknown" glitch animation → auto-reset 3s
```

---

## Recognition Portal Screen

**Design:** Glassmorphism, full-screen, mobile-first.

**Visual layers (back to front):**
- Animated gradient background (slow-shifting deep navy/indigo)
- Floating particle field (30–40 drifting dots)
- Frosted glass card (center) with blur + border glow
- Circular camera viewport with pulsing ring border
- Scan line sweeping top→bottom while detecting
- Status text: "Scanning..." → "Face detected ✓" → "Enter your name"

**Not Found animation:**
- Screen shake (CSS keyframe)
- Red scan line flash
- Glitch text: "Identity Unknown"
- "Access denied" particles dissolve outward
- Auto-reset after 3s

**Face detection UX:**
- face-api.js on live `<video>` via `requestAnimationFrame`
- Bounding box overlay on `<canvas>`
- Confidence threshold: 0.6+ to trigger detection
- 1.5s stability hold before prompting name input

**Match logic:**
```js
const distance = faceapi.euclideanDistance(captured, reference);
const nameMatch = input.toLowerCase() === stored.toLowerCase();
if (distance < 0.55 && nameMatch) → unlock path
```

---

## Three Paths

### ❤️ Pragya — Love Path

**Palette:** Deep crimson → rose → blush pink  
**Background:** Slow radial gradient, continuous rose petal rain  
**Language:** Hindi + English mix

**Screens (tap/click to advance):**
1. **Unlock** — heart explosion, petals burst, "Meri Jaan aa gayi 🌹"
2. **Love letter** — handwritten font, long-distance message, "Tum door ho par dil mein ho..."
3. **Distance counter** — km counter using hardcoded coordinates: Texas, USA (Vaibhav) ↔ Noida, UP, India (Pragya) ≈ 13,400 km. Animated globe with glowing thread connecting the two points. Static calculation, no GPS needed.
4. **Reasons I love you** — cards flip on each tap, Hindi/English mix
5. **Memory wall** — polaroid-style photo slots
6. **Closing** — "Tumhara Vaibhav" handwritten signature + heart rain

---

### 🐼 Alka — Bestie Path

**Palette:** Midnight blue → sky blue + yellow/pink pops  
**Background:** Twinkling star field, occasional confetti bursts  
**Language:** Hindi + English mix

**Screens:**
1. **Unlock** — Panda bounces in, confetti explosion, "Panda aayi! 🐼🎉"
2. **Bestie certificate** — fake official cert, "Certified Best Dost", gold seal
3. **Chaos meter** — animated gauge, "Panda Chaos Level: 💥 MAXIMUM"
4. **Cards** — playful inside-joke energy (user-editable content)
5. **Appreciation wall** — sweet words, why she's irreplaceable
6. **Closing** — "Miss you, Panda 🐼" with star shower

---

### ⚡ Vaibhavkumar — Self Path

**Palette:** Deep navy → electric cyan → white  
**Background:** Subtle tech grid, slow particle drift  
**Language:** Hindi + English mix

**Screens:**
1. **Unlock** — terminal boot: `$ sudo load-vaibhav` → progress bar → "Welcome back, builder 🔥"
2. **Identity card** — holographic style, name, "Builder. Dreamer. Grinder.", current date
3. **Builder log** — goals, projects, ships-built counter
4. **Mirror moment** — personal growth reflection, not generic
5. **Mantra wall** — personal principles, one per screen, bold typography
6. **Closing** — "Keep going. The distance is temporary. The dream is not."

---

## Face Enrollment (Admin Setup)

**Two ways to access admin:**
1. Visit `yoursite.com?setup` → password prompt (hardcoded in app.js — visible in source, acceptable for personal project)
2. On portal screen: scan Vaibhavkumar's face + type admin password → admin dashboard opens

**Admin dashboard shows:**
- List of all enrolled users (name, path label, enrollment status)
- "Visit Path" button per user → preview their path directly
- "Re-enroll Face" button per user → recapture reference photo
- "Add New Person" flow → name + face capture → generates descriptor JSON

**Enrollment flow:**
- Select person → camera opens → capture reference photo
- Computes 128-dim face descriptor via face-api.js
- Saves descriptor to localStorage (persists across sessions)
- Falls back to hardcoded descriptors in `app.js` if localStorage empty (first run)

**Security:** Wrong password = blank screen. Admin path not reachable by Pragya or Alka.

---

## Audio

| Path | Audio |
|------|-------|
| Pragya | Soft instrumental love song (source: Pixabay Music or Free Music Archive) |
| Alka | Upbeat fun track (source: Pixabay Music or Free Music Archive) |
| Vaibhavkumar | Lo-fi beats (source: Pixabay Music or Free Music Archive) |
| Portal | Subtle ambient hum during scan |

All autoplay muted → visible unmute button. Respects browser autoplay policy.

---

## File Structure

```
/
├── index.html
├── app.js
├── style.css
├── models/
│   ├── tiny_face_detector_model-*
│   ├── face_landmark_68_model-*
│   └── face_recognition_model-*
├── audio/
│   ├── love.mp3
│   ├── bestie.mp3
│   └── self.mp3
└── assets/
    └── (photos, polaroids, etc.)
```

---

## GitHub Pages Deployment

Push to `main` branch → GitHub Pages serves `index.html` from root.  
Share single URL with all 3 people. Each sees only their path after verification.

---

## Non-Goals

- No server, no database, no login system
- No storing face data remotely (privacy)
- No building for other users beyond these 3
- No multi-language toggle UI
