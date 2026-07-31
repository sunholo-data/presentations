// ═══════════════════════════════════════════════════════════════════════════
// presenter.config.js — feature flags for every presenter in this repo.
//
// Loaded by each <talk>/presenter.html before its own script runs. Flip a
// flag here to turn a feature on or off everywhere; override per talk in
// `talks` below when you want to try something on one deck first.
//
// This file is FLAGS ONLY. Deck order, labels and time budgets stay in each
// talk's PLAYLIST — that's the shape of the talk, not a feature toggle.
//
// A missing or broken config is not fatal: presenter.html falls back to the
// same defaults listed here, so the deck always opens.
// ═══════════════════════════════════════════════════════════════════════════
window.PRESENTER_CONFIG = {

  defaults: {
    // ── Stable ──────────────────────────────────────────────────────────
    picker:   true,  // deck picker in the top bar (off = no deck switching UI,
                     //   ↑/↓ keys still work)
    timer:    true,  // wall clock, per-deck budget bar, schedule delta
    density:  true,  // stage/guide detail toggle (D) — broadcast to all decks
    pdf:      true,  // show the PDF download button when the talk sets `const PDF`

    // ── Experimental ────────────────────────────────────────────────────
    talklog:  false, // Q to capture an audience question, N for a note, L to
                     //   open the log. Records per-slide dwell time and exports
                     //   markdown for the write-up afterwards. No API key needed.
  },

  // Per-talk overrides, keyed by folder name. Merged over `defaults`.
  talks: {
    'ai-slaves-human-masters-ida': { talklog: true },
    'analytics-for-ai-agents':     { talklog: true },
  },
};
