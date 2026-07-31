---
name: presentation-slides
description: Build presentation slide decks as self-contained HTML files with dark/light themes, keyboard navigation, and animated transitions. Use when user asks to create slides, build a presentation, make a slide deck, add slides to a presentation, or wants conference-ready visual assets. Also use when user says "new slides", "presentation for", or references an existing presentation folder.
---

# Presentation Slides

Build conference-grade presentation slide decks as single self-contained HTML files with no build step. Each file includes inline CSS, JS, and uses CDN fonts/icons.

## Quick Start

1. **Research** the topic thoroughly (web fetch, CLI docs, codebase exploration)
2. **Create** the HTML file using the `frontend-design` skill for visual quality
3. **Match** the established design system (see resources/design-system.md)
4. **Test** in browser, iterate on spacing and animations

## When to Use

- User asks to create presentation slides or a slide deck
- User wants to add new slides to an existing presentation
- User references a presentation folder under `/Users/mark/dev/sunholo/presentations/`
- User wants conference-ready visual assets for a talk

## Architecture

Each presentation lives in its own subfolder under `presentations/`. A presentation may have multiple HTML files (separate asset files that can be combined later).

```
presentations/
  images/
    logos/
      sunholo-logo.svg           # Sunholo company logo
      ailang-logo.svg            # AILANG language logo (hexagonal lambda)
  my-talk/
    01-topic-name.html           # First asset (numbered for sequencing)
    02-topic-name.html           # Second asset
    design-doc.md                # Planning/requirements doc
```

### Naming Convention

Files are numbered with a two-digit prefix (`01-`, `02-`, etc.) for sequencing. These are separate assets now but will eventually be combined into one presentation. Use descriptive kebab-case names after the number.

### Logos

Shared logos live in `presentations/images/logos/`. Reference from slide HTML with relative paths:

```html
<img src="../images/logos/sunholo-logo.svg" alt="Sunholo" class="top-logo">
<img src="../images/logos/ailang-logo.svg" alt="AILANG" class="top-logo ailang-logo">
```

```css
.top-logo{height:22px;opacity:.7;transition:opacity .2s}
.top-logo:hover{opacity:1}
.top-logo.ailang-logo{height:26px}
```

### Slide Structure

Every slide deck follows this DOM structure:

```html
<div id="app">
  <div class="top-bar"><!-- title + theme toggle --></div>
  <div class="slides-viewport">
    <section class="slide active" data-slide="0">...</section>
    <section class="slide" data-slide="1">...</section>
    <!-- more slides -->
  </div>
  <div class="bottom-bar"><!-- nav buttons + dots + kbd hints --></div>
</div>
```

- Slides are `position:absolute; inset:0` inside `.slides-viewport`
- Active slide gets `.active` class; outgoing gets `.exit-left`
- CSS transitions handle opacity + translateX (0.45s ease)
- JS manages `current` index, keyboard events, dot indicators

### Slide Canvas & Dimensions

Every slide is rendered into a fixed **16:9 stage** centred inside `.slides-viewport`. The stage is the design canvas:

- **Target dimensions: 1920×1080** (16:9). This is the projector target and what you should imagine when laying out content.
- **Letterboxed automatically.** When the browser window or presenter iframe isn't 16:9, the stage shrinks to fit and the leftover space becomes letterbox bars (painted in `--bg` so they blend in).
- **Type scales with the stage**, not the window. Use container query units inside `.slides-stage`:
  - `cqi` = 1% of the stage's inline (horizontal) size
  - `cqb` = 1% of the stage's block (vertical) size
- **Recommended type scale** (use `clamp()` so things stay readable on small windows):
  - Slide title: `clamp(28px, 5cqi, 64px)`
  - Slide subtitle: `clamp(14px, 2cqi, 24px)`
  - Body / quotes: `clamp(16px, 2.4cqi, 32px)`
  - Captions / mono: `clamp(11px, 1.4cqi, 18px)`
- **Padding / max-widths in `cqi`** too. Avoid raw `px` for outer padding — use `padding: 4cqb 6cqi` so margins scale proportionally.

The DOM looks like this:

```html
<div class="slides-viewport">       <!-- flex centre + container-type:size -->
  <div class="slides-stage">         <!-- 16:9 box -->
    <section class="slide active">…</section>
    <section class="slide">…</section>
  </div>
</div>
```

The CSS that makes this work lives in `resources/boilerplate.md` — new decks generated from the boilerplate get it for free.

**Why a fixed canvas?** Without it, slides stretch into whatever shape the window happens to be. On a tall browser, content gets pushed down into a tall narrow column ("too high and not wide"). On a short browser, content gets clipped. A fixed 16:9 stage means you design once and it always looks the same.

#### Stage-safe sizing rules (READ THIS BEFORE WRITING SLIDE CSS)

The 16:9 stage is the *only* sizing surface that matters. **Anything inside `.slides-stage` must be sized relative to the stage, not the window or iframe.** Get this wrong and content overflows the bottom of the stage on non-16:9 windows even though the stage itself is letterboxed correctly.

**NEVER use these inside slide content:**

- `vh`, `vw`, `dvh`, `dvw`, `svh`, `svw`, `lvh`, `lvw` — these all measure the *iframe/window*, not the stage. Inside a tall browser, `100vh` is bigger than the stage's actual height, so a `max-height:80vh` chart can blow past the stage's bottom edge.
- `calc(100vh - Npx)` to "subtract chrome height" — this was a pre-stage workaround. The stage already excludes chrome via letterboxing; subtracting again double-counts and overflows.
- Hard-coded pixel heights (`height:600px`, `max-height:540px`) on content that should fill the stage. Pixels don't scale with the stage; on a small window the content stays 600px tall while the stage shrinks to 400px and overflows.

**ALWAYS use these instead:**

- `cqb` (1% of stage height) and `cqi` (1% of stage width) for any size that should track the stage. These resolve against `.slides-stage` (which has `container-type:size`).
- Percentages (`%`) when the parent already has a fixed size.
- Flex layout with `flex:1; min-height:0` to let a child grow to fill remaining stage height without doing pixel math at all.
- `clamp(MINpx, Ncqi, MAXpx)` for type — keeps it readable on tiny windows and projector-large at the same time.

**Before / after — a real bug from this repo:**

```css
/* ❌ WRONG — measured in viewport units, overflowed the stage on tall windows */
.dumky-chart{
  max-height:calc(100vh - 320px);  /* assumes chrome is exactly 320px; ignores stage */
}

/* ✅ RIGHT — measured against the stage, leaves room for title + subtitle + footer */
.dumky-chart{
  max-height:70cqb;  /* 70% of stage height; the other 30% is title/subtitle/bets */
}
```

**Mental model:** if you're tempted to write `100vh` or `calc(100vh - …)`, stop. Picture the letterboxed stage as your only canvas and ask "what fraction of the stage height should this take?" — that fraction is your `cqb` value.

**Automatic verification.** A `PostToolUse` hook in `.claude/settings.json` runs `scripts/lint-slides.mjs` after every `Write` / `Edit` / `MultiEdit` and exits non-zero if the change introduces a forbidden viewport unit. The hook only inspects the *new* text the tool call introduces, so editing an old file with pre-existing violations elsewhere won't trip it. To audit the whole repo manually:

```bash
node .claude/skills/presentation-slides/scripts/lint-slides.mjs
```

That walks every `*.html` under cwd, scans `<style>` blocks, and prints `file:line` for every violation. Use it as a tech-debt list when retrofitting old decks.

### Adding a Slide

When adding a slide to an existing deck:
1. Add new `<section class="slide" data-slide="N">` inside `.slides-viewport`
2. Increment `data-slide` indices on all subsequent slides
3. Update `const TOTAL = N` in the JS
4. Update the `<span id="slideTotal">N</span>` in the HTML
5. Add any new animated element classes to the JS animation reset selector
6. Add CSS for slide-specific styles and animation delays

## Slide Types

See `resources/slide-types.md` for detailed patterns and markup for each type:

1. **Card Grid** — Horizontal cards with icon, title, description
2. **Code Signature + Annotations** — Large monospace code with labeled callouts
3. **Side-by-Side Code Comparison** — Two panels comparing languages/approaches
4. **CLI + Output** — Terminal command with animated result lines
5. **Contrast Columns** — Two cards comparing warn vs safe approaches
6. **Data Table** — CSS Grid table with header + animated rows
7. **Z3/Verification Output** — Code panel + terminal verification results

## Design System

The full design system (CSS variables, themes, typography, colors) is in `resources/design-system.md`. Key points:

- **Always** support both dark and light themes via `data-theme="light"` on `<html>`
- **Orange accent** (`#e73c17` dark / `#d4300f` light) for emphasis, never overused
- **Montserrat** for all text, **JetBrains Mono** for code and data
- **Font Awesome 6.5.1** for icons
- Subtle grid background at 60px intervals
- Slide canvas is a fixed 16:9 stage at 1920×1080 (see "Slide Canvas & Dimensions" above)

## Code Blocks

- Use `white-space: pre` on code containers
- Manual `<span>` syntax highlighting — no external library
- CSS classes: `.kw` (keywords), `.fn-name` (functions), `.typ-name` (types), `.fx-name` (effects), `.cm` (comments), `.num` (numbers), `.str` (strings)
- See `resources/design-system.md` for exact color mappings

## Animation

- `fadeSlideUp`: opacity 0→1, translateY(20px→0)
- `fadeSlideIn`: opacity 0→1, translateX(-16px→0)
- Elements start `opacity:0` in CSS, animated via `.slide.active .element` selectors
- Stagger with `animation-delay` on `:nth-child()` (120-150ms gaps)
- JS resets animated elements when leaving a slide (sets opacity back to 0)

## Workflow Integration

Use the **frontend-design** skill for generating the initial HTML — it produces distinctive, non-generic visuals. Then iterate:
- Fix whitespace issues (code blocks especially)
- Verify theme toggle works in both modes
- Check animation timing feels natural
- Ensure content is factually accurate (research first, build second)

## Reference Files

- `resources/design-system.md` — Complete CSS variables, themes, typography
- `resources/slide-types.md` — Markup patterns for each slide type
- `resources/boilerplate.md` — Copy-paste HTML/CSS/JS skeleton

## Presenter / Playlist Navigator

Each presentation folder can have a `presenter.html` that sequences standalone decks via iframes:

```
presenter.html          ← Open this for the full talk
  ├── 01-entropy.html   ← Loaded in iframe, standalone too
  ├── 02-authority.html
  └── 03-future.html
```

**Feature flags live in `presenter.config.js` at the repo root**, not in the presenter. It sets repo-wide `defaults` and per-talk overrides keyed by folder name:

```js
window.PRESENTER_CONFIG = {
  defaults: { picker: true, timer: true, density: true, pdf: true, talklog: false },
  talks: { 'ai-slaves-human-masters-ida': { talklog: true } },
};
```

Flags are for turning features on and off while trying them out. Deck order, labels and `minutes` stay in each talk's PLAYLIST — that's the shape of the talk, not a toggle. The presenter carries the same defaults inline as a fallback, so a missing config file degrades to a working deck rather than a blank page.

**Never hand-write a presenter.** Copy `resources/presenter-template.html` and fill its four placeholders — `{{TITLE}}`, `{{HEADER_TITLE}}`, `{{LOGOS}}`, `{{PLAYLIST}}`, `{{PDF}}`. It is the single source of the deck picker, theme sync, density toggle, timer and PDF button; every deck folder in this repo is an instance of it. Fixing a presenter bug means fixing the template and re-instantiating, not patching five copies.

**Keyboard navigation:**
- **← →** — Navigate slides/steps within a deck only (never crosses deck boundaries)
- **↑ ↓** — Jump between decks (↓ = next deck, ↑ = previous deck)
- **D** — Toggle detail density (stage ↔ guide) across every deck
- **Esc** — Close the deck jump menu

**How it works:**
- Each deck stays self-contained — works fine opened directly in a browser
- ←/→ only navigate within a deck; they stop at the first/last slide
- When embedded, decks communicate via `postMessage`:
  - ↑/↓ keys: posts `{type:'deck-nav', dir:'next'|'prev'}` → presenter switches decks
  - Theme syncs across all decks via `{type:'deck-command', action:'set-theme', theme:'light'}`
  - Density syncs the same way via `{type:'deck-command', action:'set-density', density:'stage'|'guide'}`; a deck whose own **D** key was pressed reports back up with `{type:'deck-density', density}` so the presenter's button stays in sync
- Playlist order is a simple JS array — edit to reorder/include/exclude per audience:

```js
const PLAYLIST = [
  { src: '01-entropy-explorer.html', label: 'Entropy',   minutes: 3, group: 'Talk' },
  { src: '02-authority-complexity.html', label: 'Authority', minutes: 6, group: 'Talk' },
];
```

`minutes` drives the timer (0 = off-clock). `group` is optional and becomes a heading in the jump menu — use it for workshop blocks, acts, or an appendix.

### Deck picker

The current-deck control sits in the middle of the top bar: prev/next arrows, the names of the adjacent decks either side, and a centre pill showing `n / total` plus the current label. Clicking the pill opens a popover jump menu grouped by `group`, with each deck's minute budget on the right.

It is deliberately **space-stable** — the menu is a popover, so opening it never reflows the bar mid-talk, and the neighbour labels are width-capped with ellipsis. This replaced a row of tabs, which stopped working past about six decks (the Croatia workshop ran seventeen).

**Deck files are always loaded via the presenter** — they do not need their own logos, theme toggles, or global navigation. The presenter handles all of that. Individual decks should only contain:
- Their own slide content and within-deck navigation (slide dots, prev/next buttons if needed)
- Any deck-specific controls (e.g., play/pause for animated decks)
- A `setTheme(theme)` function that the presenter calls via postMessage

**Adding postMessage bridge to a new deck:**

Add to the keyboard handler — ←/→ stay within deck, ↑/↓ signal parent:
```js
document.addEventListener('keydown', e=>{
  if(e.key==='ArrowRight'||e.key===' ') goTo(current+1);
  if(e.key==='ArrowLeft') goTo(current-1);
  // ↑/↓ = deck-level navigation (handled by parent presenter)
  if(e.key==='ArrowDown'){ e.preventDefault(); window.parent.postMessage({type:'deck-nav',dir:'next'},'*'); }
  if(e.key==='ArrowUp'){ e.preventDefault(); window.parent.postMessage({type:'deck-nav',dir:'prev'},'*'); }
});
```

Add message listener for presenter commands (theme sync, jump to first/last):
```js
window.addEventListener('message', e=>{
  if(e.data && e.data.type==='deck-command'){
    if(e.data.action==='go-first') goTo(0);
    if(e.data.action==='go-last'){ current=-1; goTo(TOTAL-1); }
    if(e.data.action==='set-theme') setTheme(e.data.theme);
  }
});
```

## Detail Density: Stage vs Guide

The same deck serves two very different readers — the room, which needs a sparse slide behind a talking human, and the person who opens the published link cold weeks later with no narration. Density is how one file serves both.

Wrap take-home prose in `class="detail"`:

```html
<div class="stat">−66.7 → +4.5</div>
<p class="detail">That's AILANG's LoCoBench delta against Python between v0.6 and v0.9 —
   the point where an AI-first language stopped being a toy.</p>
```

Two modes:
- **stage** — `.detail` hidden. What the projector shows.
- **guide** — `.detail` revealed. The laptop view, and the default for anyone opening the deck standalone.

The whole mechanism, already wired into every deck by the boilerplate:

```css
html[data-density="stage"] .detail{display:none}
```
```js
var embedded = window !== window.top, root = document.documentElement;
root.setAttribute('data-density', embedded ? 'stage' : 'guide');
```

That one line is the important bit: **in the presenter iframe it defaults to stage; opened directly it defaults to guide.** So the deck the room sees stays clean, and the same URL on sunholo.com explains itself to a stranger with no extra file to maintain.

Toggle it with **D** (in either the presenter or a standalone deck), or the ◦ button in the presenter's top-right, which broadcasts to every loaded deck at once. The presenter remembers the choice in `localStorage` under `presenter-density`.

**Authoring rules:**
- Design the slide for **stage** first. `.detail` is additive — a slide must never depend on it to make sense.
- Keep `.detail` prose to a sentence or two, and give it somewhere to go: a slide that's already full in stage mode will overflow in guide mode. Prefer a footer strip or a column that's empty on stage.
- Never put a `.detail` block inside a `data-steps` reveal sequence — the step counter won't know about it.
- Check both modes before shipping. The linter can't see layout overflow.

## Talk Log (flag: `talklog`)

`assets/talklog.js`, loaded only when the flag is on. Captures what actually happened during a talk so the write-up afterwards isn't reconstructed from memory.

- **Q** — capture an audience question, tagged with the deck and slide on screen
- **N** — capture a note to self
- **L** — open the log: timing table, slowest slides, captured entries, markdown export

The export is the point. It gives you the questions with the slide that prompted them, the slowest slides, and a ready-to-paste block of `minutes:` values measured from a real run — so the next delivery is budgeted from evidence rather than a guess.

State persists in `localStorage` under `talklog:<folder>`, so a mid-talk refresh loses nothing. Clear it before a repeat delivery, or you'll append to the previous run.

### How slide timing works without touching decks

Slide-level timing needs to know which slide is showing. Rather than hooking every deck's `goTo()`, the deck-side bridge watches for `.slide.active` changing with a `MutationObserver` and posts `{type:'deck-slide', index, total}` to the presenter. Decks don't know the talk log exists.

Decks that aren't slide-based (the entropy explorer steps through scenarios, not `.slide` elements) simply report nothing and degrade to deck-level timing.

### Hotkeys and iframe focus

During a talk keyboard focus sits **inside the deck iframe**, so a `keydown` listener in the presenter never fires. The deck-side bridge relays the keys a deck doesn't use itself — `d`, `q`, `n`, `l` — up as `{type:'deck-hotkey', key}`. The presenter is the single authority: it acts on the key and broadcasts the result back down.

If you add a presenter-level hotkey, add it to the relay list in the boilerplate too, or it will only work when focus happens to be on the presenter chrome. Both the relay and the presenter's own handler skip events originating in an `INPUT` or `TEXTAREA`, so typing a question doesn't trigger anything.

## AI Co-Presenter (flag: `copresenter`)

A headset button in the top bar opens the AILANG co-presenter in a second window — your laptop, while the deck is on the projector. It listens to the room through Gemini Live, researches in the background, and shows a trace of every tool call.

**It is a bridge, not a port, and that was a deliberate call.** The co-presenter lives at `sunholo.com/ailang-demos/co-presenter/` because its Gemini Live session is driven by AILANG WASM — `ailang.wasm` alone is 39MB, plus `gemini-live-core.js` and four `pkg/sunholo/gemini_live/*.ail` modules. Copying that here would double the repo and fork the AILANG stack. So `assets/copresenter-bridge.js` opens the deployed app and talks to it over `postMessage`.

That also fixes the reason the two never worked together before. The co-presenter's `getSlideContext` tool read `frame.contentDocument`, which is same-origin only — point it at a deck on another origin and it silently returned *"No slide context available."* postMessage has no such limit, so the presenter now pushes what's on screen:

```
presenter → copresenter   presenter-hello       handshake, retried until answered
                          presenter-context     { talk, title, deck, slide{index,total,title,text} }
copresenter → presenter   copresenter-ready     it's listening
                          copresenter-entry     { kind:'q'|'n', text } → into the talk log
```

The last one is the nice part: a question the model logs through its `audienceQuestion` tool lands in the same markdown export as the ones you typed by hand.

Messages are addressed to the exact origin from `copresenterUrl` and inbound ones are checked against it. Never widen either to `'*'` — that window holds a Gemini API key.

### Two failure modes worth knowing

**`innerText` is layout-dependent.** Read a slide the instant its `.active` class lands and you get an empty string, because the transition hasn't been laid out yet. The bridge waits 160ms and falls back to `textContent`. If you see empty slide context, that's the place to look.

**A deck that doesn't change slide never reports.** Switching decks used to leave the presenter describing the *previous* deck's slide indefinitely. The presenter now clears its cached slide on every switch and sends `{action:'report-slide'}` to the incoming deck, which forces a fresh report.

Decks that aren't slide-based (the entropy explorer steps through scenarios, not `.slide` elements) report `index: -1` and send the whole view's text instead, so the model still knows what's on screen.

## PDF Export

`scripts/export-pdf.mjs` produces a faithful PDF of any deck folder — one landscape page per slide.

```bash
cd scripts && npm install            # one-time, downloads a Chromium
node export-pdf.mjs ai-slaves-human-masters-ida
node export-pdf.mjs analytics-for-ai-agents --density=guide   # include .detail prose
node export-pdf.mjs multivac --only=00-multivac-platform.html --scale=1
```

It is **not** `@media print`, and it can't be: decks stack slides absolutely with only `.active` visible, reveal content through CSS animations starting at `opacity:0`, and build some slides up over several `data-steps` presses. A static print captures none of that. So the script drives the real decks in headless Chrome, walks each slide to its final revealed step, screenshots at 1920×1080, and assembles the images into one PDF.

- Deck order comes from that folder's `PLAYLIST`, so the PDF can never drift from the live deck order.
- Defaults to `--density=stage` (faithful to the room). Pass `--density=guide` for a take-home handout that includes the detail prose.
- Output lands at `<folder>/<folder>.pdf`. To expose the download button, set `const PDF = '<folder>.pdf'` next to the PLAYLIST in that folder's `presenter.html` — leave it `null` and the button stays hidden.
- Roughly 250KB per slide at the default 2× scale. Only commit PDFs for talks that are actually published.

### Embed-aware chrome (fixes "inner page too high")

A deck keeps its own `.top-bar` and `.bottom-bar` so it still works standalone. But inside the presenter iframe, those bars duplicate the presenter's own chrome and steal vertical space from `.slides-viewport` — the bottom of slide content ends up clipped. Since `html,body{overflow:hidden}`, no scrollbar appears; it just looks wrong.

**Fix:** detect embedded mode and hide the deck's own bars.

```html
<script>if(window!==window.top)document.body.classList.add('in-iframe');</script>
```
```css
.in-iframe .top-bar{display:none}
.in-iframe .bottom-bar{display:none}
```

Standalone viewing is unchanged (the class only sets when `window !== window.top`). The boilerplate ships with this wired up.

## Presenter Timer & Schedule Tracking

The presenter frame supports per-deck time budgeting so the speaker can see at a glance whether they're ahead or behind schedule. This lives entirely in `presenter.html` — individual decks need no changes.

### File-level metadata

Each PLAYLIST entry takes a `minutes` field (file-level, not per-slide):

```js
const PLAYLIST = [
  { src: '00-opening.html',   label: 'Opening',      minutes: 1  },
  { src: '01-what-i-saw.html',label: 'What I Saw',   minutes: 6  },
  { src: '02-what-i-found.html',label:'What I Found',minutes: 11 },
  // ...
];
```

Time budgets should match the talk's outline doc (e.g. an `outline.md` "structure summary" table). When the user asks to allocate timings, read the outline first and sum the section budgets per deck — don't guess.

### UI elements

**Top-right wall clock** (in `.top-right` next to theme toggle):
- Shows `HH:MM` updated every tick
- Small status dot — grey when stopped, green (with glow) when running
- **Click** = start/pause the talk timer
- **Double-click** = reset all deck timers (with confirm)

**Bottom bar timer block** (in `.bottom-bar` between nav-info and nav-hints):
- `Slide  M:SS / M:SS` — elapsed vs budget for the *current* deck (cumulative across revisits — does NOT reset when you navigate back to it)
- Slim progress bar — green → amber at 80% → orange when over budget
- `Total  M:SS / M:SS` — total wall time spoken across all decks vs full talk budget
- Schedule delta pill — `±M:SS`. Green "ahead" / orange "behind".
  - `expected = sum(budgets[0..currentDeck-1]) + min(spent_current, budget_current)`
  - `delta = totalSpent - expected`
  - Backtrack-aware: uses `totalSpent` across all decks, so jumping back to an earlier deck still reflects time blown on later ones. Capping `spent_current` at the deck budget prevents the pill from flickering "behind" while you're still legitimately within the current deck's allowance.

### How time accumulates

- A `deckSpent[]` array stores cumulative seconds per deck.
- A 500ms `setInterval` calls `accumulate()` then `render()`. Accumulation only happens when `timerRunning` is true.
- When the user switches decks while the timer is running, time is "banked" onto the leaving deck before retargeting `activeDeck` to the new one. This is done by wrapping the original `switchDeck()` function — the wrapped version calls `accumulate()` first, then delegates.
- Switching decks while *paused* doesn't bank anything (`lastTick === null`).

### Implementation notes

- The timer is purely client-side, no localStorage persistence — a page refresh resets state. This is intentional: presenters typically open fresh for the talk.
- Keep the timer block CSS variables themed (uses `--green`, `--orange`, `--orange-dim`, `--ghost`) so it works in both dark and light modes.
- The status dot uses `box-shadow: 0 0 6px var(--green)` for a subtle glow when running — deliberately not flashy.
- Reference implementation: `analytics-for-ai-agents/presenter.html` (search for "CLOCK + PER-DECK TIMER + SCHEDULE DELTA").

### When porting to other presentations

Nothing to port — `resources/presenter-template.html` already includes the timer. Instantiate the template and give each PLAYLIST entry a `minutes` value, then check the total matches the talk's target duration.

## Existing Presentations

- `ai-slaves-human-masters/presenter.html` — Playlist navigator (open this for the full talk)
- `ai-slaves-human-masters/01-entropy-explorer.html` — D3.js interactive decision space visualization
- `ai-slaves-human-masters/02-authority-complexity.html` — Static slides: axioms, effects, pattern matching, Z3 contracts, complexity table
