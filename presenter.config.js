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

    copresenter: false, // Headset button that opens the AILANG co-presenter in a
                        //   second window and feeds it the slide on screen. It
                        //   lives on the demos site because its Gemini Live
                        //   session is driven by ~39MB of AILANG WASM; this is a
                        //   postMessage bridge, not a copy. Needs a Gemini API
                        //   key entered over there, and a mic. Anything it hears
                        //   worth keeping lands in the talk log.
  },

  // Where the co-presenter lives. Only consulted when `copresenter` is on.
  // Deployed under the same origin as this site, so the bridge is same-origin in
  // production; the postMessage handshake is still used so it works when the two
  // are served from different ports locally. Messages are addressed to this exact
  // origin and inbound ones checked against it — never widen this to a wildcard.
  copresenterUrl: 'https://www.sunholo.com/ailang-demos/co-presenter/',

  // Per-talk overrides, keyed by folder name. Merged over `defaults`.
  talks: {
    'ai-slaves-human-masters-ida': { talklog: true, copresenter: true },
    'analytics-for-ai-agents':     { talklog: true },
    // Webinar: talk log on to capture Q&A against the slide that prompted it.
    // Co-presenter stays off — it wants a mic, and the room audio is already in Zoom.
    'death-by-powerpoint':         { talklog: true },
  },
};
