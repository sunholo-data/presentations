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
- Target **1920x1080** resolution for projectors

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

**Keyboard navigation:**
- **← →** — Navigate slides/steps within a deck only (never crosses deck boundaries)
- **↑ ↓** — Jump between decks (↓ = next deck, ↑ = previous deck)

**How it works:**
- Each deck stays self-contained — works fine opened directly in a browser
- ←/→ only navigate within a deck; they stop at the first/last slide
- When embedded, decks communicate via `postMessage`:
  - ↑/↓ keys: posts `{type:'deck-nav', dir:'next'|'prev'}` → presenter switches decks
  - Theme syncs across all decks via `{type:'deck-command', action:'set-theme', theme:'light'}`
- Playlist order is a simple JS array — edit to reorder/include/exclude per audience:

```js
const PLAYLIST = [
  { src: '01-entropy-explorer.html', label: 'Entropy' },
  { src: '02-authority-complexity.html', label: 'Authority' },
];
```

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

1. Copy the `.clock`, `.timer-block`, `.timer-deck`, `.timer-bar`, `.timer-delta` CSS blocks.
2. Add the `<div class="clock">` to `.top-right`.
3. Add the `<div class="timer-block">` to `.bottom-bar`.
4. Add `minutes:` to each PLAYLIST entry.
5. Append the `CLOCK + PER-DECK TIMER + SCHEDULE DELTA` JS block, including the `switchDeck` wrapper at the end.
6. Verify total of all `minutes` matches the talk's target duration.

## Existing Presentations

- `ai-slaves-human-masters/presenter.html` — Playlist navigator (open this for the full talk)
- `ai-slaves-human-masters/01-entropy-explorer.html` — D3.js interactive decision space visualization
- `ai-slaves-human-masters/02-authority-complexity.html` — Static slides: axioms, effects, pattern matching, Z3 contracts, complexity table
