# AGENTS.md — AI Platform Instructions

Read this file before every task. These instructions apply to: Claude Code, Gemini CLI, GitHub Copilot, OpenAI Codex, Cursor, and any other AI assistant operating in this repository.

---

## Core Directive: Token Efficiency

Every interaction must minimize token consumption without losing technical accuracy. Install and activate the skills below. They are not optional enhancements — they are required operational defaults.

---

## Required Skills

Install each skill from its source repo before first use. Skill install is one-time per environment.

### 1. Caveman — Token Compression (~75% reduction)
**Repo:** https://github.com/JuliusBrussee/caveman.git  
**Install:** Follow repo README for your platform (Claude Code: plugin install from repo URL).  
**Trigger always on:** Session start, every response, unless user says "normal mode" or "stop caveman".

**Rules:**
- Drop articles (a/an/the), filler words (just/really/basically/actually/simply), pleasantries (sure/certainly/of course/happy to), hedging language.
- Fragments OK. Short synonyms preferred (big not extensive, fix not "implement a solution for").
- Technical terms stay exact. Code blocks unchanged.
- Pattern: `[thing] [action] [reason]. [next step].`
- Auto-clarity exception: use full sentences for security warnings, irreversible action confirmations, multi-step sequences where fragment order risks misread.

**Intensity levels:** `/caveman lite` | `/caveman full` (default) | `/caveman ultra`

---

### 2. Ruflo — Memory + Multi-Agent Orchestration
**Repo:** https://github.com/ruvnet/ruflo.git  
**Install:** `ruflo init` in project root (generates MCP config and hooks).  
**Key MCP tools:** `memory_store`, `memory_search`, `hooks_route`, `swarm_init`, `agent_spawn`.

**Trigger when:**
- Starting multi-file or complex features — use `swarm_init` + `agent_spawn` to parallelize.
- Before reading files already seen this session — `memory_search` first, skip re-read if cached.
- After any significant discovery — `memory_store` immediately so subagents inherit context.

**Token benefit:** Shared memory across agents eliminates redundant file reads and repeated context injection.

---

### 3. Graphify — Knowledge Graph Compression
**Repo:** https://github.com/safishamsi/graphify.git  
**Install:** Follow repo README for your platform.  
**Trigger:** `/graphify` or when user asks to visualize/map/understand a codebase, document set, or any complex input.

**What it does:** Converts any input (code, docs, papers, images) into a knowledge graph with clustered communities, HTML + JSON output, and audit report.

**Token benefit:** Replace long prose explanations with structured graph output. Compress large context into node/edge relationships instead of repeated narrative.

---

### 4. UI/UX Pro Max — Design Intelligence
**Repo:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git  
**Install:** Follow repo README for your platform.  
**Trigger when:** User asks to build, design, review, or fix any UI — components, pages, dashboards, mobile screens.

**Capabilities:** 50+ styles, 161 color palettes, 57 font pairings, 25 chart types, 99 UX guidelines across React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, HTML/CSS.

**Token benefit:** Structured design system knowledge replaces open-ended exploration. First response is correct response.

---

### 5. jcode — Harness Expansion
**Repo:** https://github.com/1jehuang/jcode.git  
**Install:** Clone repo and follow README for your platform.  
**Trigger when:** Extending or customizing the AI harness — new agent capabilities, tool bindings, runtime hooks, or execution environment modifications.

**Token benefit:** Reuse harness primitives instead of reimplementing. Faster agent capability expansion with less scaffolding code.

---

### 6. MiroFish — Multi-Agent Simulation & Prediction
**Repo:** https://github.com/666ghj/MiroFish.git  
**Install:** Follow repo README for your platform.  
**Trigger when:** User needs to test a policy, strategy, scenario, or decision before real-world execution — public opinion prediction, financial trend simulation, political outcome modeling, narrative exploration.

**What it does:** Deploys thousands of autonomous agents with personalities and memory to simulate outcomes. Accepts seed data (reports, news, narratives). Supports mid-simulation variable injection. Post-simulation: chat with individual agents and ReportAgent for analysis.

**Use cases:**
- "What happens if we launch this feature to power users first?"
- "Simulate how this API change affects downstream consumers"
- "Test this policy/PR decision at zero risk before committing"
- Predicting outcomes of novel storylines, financial trends, political developments

**Token benefit:** Sandbox-test decisions before committing. Eliminates trial-and-error implementation loops by simulating outcomes first. One simulation run replaces many iterative code/test cycles.

---

### 7. Impeccable — Frontend Design Quality & Anti-Pattern Detection
**Repo:** https://github.com/pbakaus/impeccable  
**Install:** Multiple methods — CLI installer, Git submodule, or direct download. See repo README for your platform (supports Claude Code, Cursor, Gemini CLI, OpenCode, 11+ tools).  
**Trigger when:** Any frontend UI needs auditing, polishing, or critique — detect 27 deterministic anti-patterns (gray text on colored bg, excessive card nesting, overused fonts, etc.) + 12 LLM critique rules.

**Commands:** `/impeccable init`, `/impeccable audit`, `/impeccable polish`, `/impeccable animate`, `/impeccable bolder`, `/impeccable quieter`, `/impeccable colorize`, `/impeccable critique`, `/impeccable distill`

**What it does:** Builds on Anthropic's original frontend-design skill with seven domain references (typography, color/contrast, spatial design, motion, interaction, responsive, UX writing). Runs anti-pattern detection on directories, HTML files, or live URLs — no AI required for that mode.

**Token benefit:** Structured 23-command vocabulary replaces open-ended design critique. Anti-pattern scan catches regressions deterministically before LLM review pass.

---

### 8. Taste Skill — Anti-Slop UI Framework for AI Agents
**Repo:** https://github.com/Leonxlnx/taste-skill  
**Install:**
```bash
npx skills add https://github.com/Leonxlnx/taste-skill
```
Or copy `SKILL.md` directly into project / paste into conversation.  
**Trigger when:** AI is about to generate or refactor frontend UI — prevents boilerplate-looking outputs, enforces better layout, typography, motion, and information density.

**Dials (adjustable):**
- Design variance — layout experimentation level
- Motion intensity — animation depth
- Visual density — information per viewport

**Variants:** soft, minimalist, brutalist styles; image-generation for web/mobile/brand; image-to-code workflows; redesign-audit protocol with GSAP code skeletons.

**Token benefit:** Brief-inference step maps requirements to design system before generation — first output is high-quality, eliminating iteration rounds.

---

### 9. Emil Kowalski's Skill — Design & Engineering Reference Collection
**Repo:** https://github.com/emilkowalski/skill  
**Install:** Copy target `SKILL.md` files from `/skills` directory into project, or reference via Claude Code plugin system.  
**Trigger when:** Need authoritative design/engineering guidance rooted in published articles — especially for animation, interaction design, and UI craftsmanship.

**What it does:** Curated SKILL.md files derived from design and engineering articles. Each skill encodes opinionated, article-backed guidance for building better interfaces. Companion site: emilkowal.ski/skill.

**Token benefit:** Article knowledge distilled to actionable SKILL.md format — no need to retrieve or summarize source articles.

---

### 10. Awesome DESIGN.md — 72+ Pre-Built Design System Documents
**Repo:** https://github.com/VoltAgent/awesome-design-md  
**Install:** Copy a `DESIGN.md` file from the collection into your project root, then instruct AI to reference it when generating UI. No tooling required — pure markdown.  
**Trigger when:** Starting a new UI feature and want to match a known brand/product design language (Claude, Vercel, Linear, Stripe, Figma, Apple, Spotify, etc.).

**What it does:** 72+ plain-text design system files extracted from real product CSS. Each DESIGN.md has nine sections: visual theme, color palette with semantic roles, typography hierarchy, component styling + states, layout principles, depth/elevation, design guardrails, responsive breakpoints, and agent prompts.

**Categories covered:** AI/LLM platforms, Developer tools, Backend/DevOps, SaaS/Productivity, Design tools, Fintech/Crypto, E-commerce, Media/Tech, Automotive, Retro Web.

**Token benefit:** Pre-extracted design system replaces manual CSS analysis. Drop file → AI generates on-brand UI immediately.

---

### 11. Andrej Karpathy Skills — Coding Discipline for Claude Code
**Repo:** https://github.com/multica-ai/andrej-karpathy-skills  
**Install:**
```bash
# Option A: Plugin (all projects)
/plugin marketplace add forrestchang/andrej-karpathy-skills
/plugin install andrej-karpathy-skills@karpathy-skills

# Option B: Per-project CLAUDE.md
curl -o CLAUDE.md https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md
```
**Trigger when:** Setting up any Claude Code project — add once, applies globally. Especially important before complex multi-file work.

**Four principles (from Karpathy's LLM pitfall observations):**
1. **Think Before Coding** — State assumptions, surface tradeoffs, stop when confused
2. **Simplicity First** — Minimum code that solves problem; no speculative abstraction
3. **Surgical Changes** — Touch only what request requires; don't improve adjacent code
4. **Goal-Driven Execution** — Define success criteria; write tests first; loop until verified

**Token benefit:** Reduces costly back-and-forth from wrong assumptions and over-complicated first drafts. Especially effective on non-trivial multi-file tasks.

---

### 12. Spec Kit — Spec-Driven Development Toolkit
**Repo:** https://github.com/github/spec-kit  
**Install:**
```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z
```
Requires `uv` and Python 3.11+. Run `specify init` to bootstrap a project.  
**Trigger when:** Starting any new feature or project — write the spec before writing code.

**Workflow:** `/speckit.constitution` → `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`

**What it does:** Spec-Driven Development toolkit. Defines requirements, technical architecture, and implementation tasks before any code is written. Works with 30+ AI coding agents (Claude, Copilot, Gemini, etc.).

**Token benefit:** Upfront spec eliminates requirement drift. AI builds from a written contract instead of vibe-coding from a vague prompt — fewer correction loops.

---

### 13. Superpowers — Agentic Skills Framework
**Repo:** https://github.com/obra/superpowers  
**Install:** Available via Claude Code plugin marketplace, Codex, Factory Droid, Gemini CLI, OpenCode, Cursor, GitHub Copilot CLI — install method varies per harness. See repo README.  
**Trigger when:** Beginning any non-trivial build task — brainstorm requirements BEFORE writing code.

**Workflow:** Brainstorming → design validation → implementation planning → TDD → code review → autonomous execution.

**What it does:** Structured methodology that prevents agents from jumping straight to code. Enforces clarification of requirements, design decisions, and test criteria first — enables agents to work autonomously on complex tasks for extended periods.

**Token benefit:** Front-loads intent clarification so agents build the right thing first time. Fewer mid-task pivots = fewer wasted token cycles.

---

### 14. Claude-Mem — Persistent Memory Compression
**Repo:** https://github.com/thedotmack/claude-mem  
**Install:**
```bash
npx claude-mem install
# or
/plugin marketplace add thedotmack/claude-mem
```
**Trigger when:** Starting any session on a project worked on before — retrieve prior context before reading files.

**What it does:** Captures agent activity and generates AI summaries across sessions. Injects relevant prior context into new sessions via intelligent retrieval and progressive disclosure. Maintains project continuity without re-reading all files.

**Token benefit:** Replaces full file re-reads with compressed memory summaries. Prior session context costs tokens once (on write), not every session.

---

## Skill Invocation Protocol

```
1. User message received
2. Check: does any skill apply? (even 1% chance = yes)
3. Invoke skill BEFORE any response or clarifying question
4. Announce: "Using [skill] to [purpose]"
5. Follow skill instructions exactly
6. Respond with caveman compression active
```

**Never skip step 2.** Common rationalizations to ignore:
- "This is just a simple question" → still check
- "I need context first" → skill check comes before context gathering
- "The skill is overkill" → invoke it, then judge

---

## Platform-Specific Notes

| Platform | Skill tool | Config file |
|----------|-----------|-------------|
| Claude Code | `Skill` tool | `CLAUDE.md` + `.claude/settings.json` |
| Gemini CLI | `activate_skill` tool | `GEMINI.md` |
| GitHub Copilot CLI | `skill` tool | `.github/copilot-instructions.md` |
| OpenAI Codex | Check `references/codex-tools.md` in skill repos | `AGENTS.md` (this file) |
| Cursor | Prompt injection via `.cursorrules` | Reference this file |

All platforms: this file (`AGENTS.md`) is authoritative. Platform config files defer to it.

---

## Instruction Priority

1. **User explicit instructions** (direct request, CLAUDE.md, GEMINI.md) — highest
2. **Skills activated from this file** — override default behavior
3. **Platform defaults** — lowest

---

## What NOT to Do

- Do not re-read files already in session context without `memory_search` first.
- Do not write multi-paragraph explanations when caveman fragments suffice.
- Do not design UI without invoking ui-ux-pro-max skill first.
- Do not build complex features without ruflo swarm initialization.
- Do not generate knowledge maps/graphs manually — use graphify.
