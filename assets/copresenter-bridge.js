// ═══════════════════════════════════════════════════════════════════════════
// copresenter-bridge.js — connect the presenter to the AILANG co-presenter.
//
// The co-presenter is a separate app on the demos site: it listens to the room
// through Gemini Live, researches in the background, and shows a trace of every
// tool call. Its Gemini session is driven by AILANG WASM (~39MB), which is why
// it stays where it lives instead of being copied in here.
//
// So this is a bridge, not a port. The presenter opens the co-presenter in a
// second window (your laptop, while the deck is on the projector) and the two
// talk over postMessage. That works cross-origin — unlike reading the slide
// iframe's contentDocument, which is what silently returned "no slide context"
// when the two were pointed at each other before.
//
// We send:   presenter-context  { talk, deck, slide, title, text }
//            presenter-hello    handshake, answered with copresenter-ready
// We accept: copresenter-ready  the far side is listening
//            copresenter-entry  { kind:'q'|'n', text } → straight into the talk log
//
// Every message is addressed to the configured origin, and everything arriving
// is checked against it. No wildcards: this window holds a live talk.
// ═══════════════════════════════════════════════════════════════════════════
window.CoPresenterBridge = (function () {

  const CSS = `
  .cp-btn{width:28px;height:28px;border-radius:50%;border:1px solid var(--ghost);
    background:transparent;color:var(--text-dim);cursor:pointer;font-size:12px;transition:all .25s;
    display:flex;align-items:center;justify-content:center;position:relative}
  .cp-btn:hover{border-color:var(--orange);color:var(--orange)}
  .cp-btn.live{border-color:var(--green);color:var(--green)}
  .cp-btn.live::after{content:'';position:absolute;top:-1px;right:-1px;width:7px;height:7px;
    border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green)}
  .cp-btn.waiting{border-color:#f59e0b;color:#f59e0b}
  `;

  function mount(opts) {
    const { url, mountPoint, onEntry, getContext } = opts;

    let origin;
    try { origin = new URL(url, location.href).origin; }
    catch { console.warn('[copresenter] bad url in presenter.config.js:', url); return null; }

    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.className = 'cp-btn';
    btn.innerHTML = '<i class="fa-solid fa-headset"></i>';
    btn.title = 'Open the AI co-presenter (listens, researches, traces)';
    mountPoint.appendChild(btn);

    let win = null;
    let ready = false;
    let helloTimer = null;

    const setState = (s) => {
      btn.classList.toggle('live', s === 'live');
      btn.classList.toggle('waiting', s === 'waiting');
      btn.title = s === 'live'
        ? 'Co-presenter connected — click to focus its window'
        : s === 'waiting'
          ? 'Co-presenter window open, waiting for it to answer…'
          : 'Open the AI co-presenter (listens, researches, traces)';
    };

    function open() {
      if (win && !win.closed) { win.focus(); if (ready) return; }
      else {
        win = window.open(url, 'copresenter', 'width=1200,height=900');
        if (!win) { alert('The co-presenter window was blocked — allow popups for this site.'); return; }
      }
      ready = false;
      setState('waiting');
      // The far side may still be booting its WASM; keep saying hello until it answers.
      clearInterval(helloTimer);
      let tries = 0;
      helloTimer = setInterval(() => {
        if (!win || win.closed) { clearInterval(helloTimer); setState(''); return; }
        if (ready || ++tries > 40) { clearInterval(helloTimer); return; }
        win.postMessage({ type: 'presenter-hello' }, origin);
      }, 1500);
    }

    btn.addEventListener('click', open);

    window.addEventListener('message', (e) => {
      if (e.origin !== origin) return;              // ignore anything not from the co-presenter
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'copresenter-ready') {
        ready = true;
        clearInterval(helloTimer);
        setState('live');
        send();                                     // it missed everything before it woke up
      }
      if (e.data.type === 'copresenter-entry' && onEntry) {
        // The co-presenter heard something worth keeping — put it in the talk log.
        onEntry(e.data.kind === 'n' ? 'n' : 'q', String(e.data.text || '').slice(0, 2000));
      }
    });

    // Push the current slide over. Cheap and idempotent, so callers can fire it
    // on every deck/slide change without tracking whether anything changed.
    function send() {
      if (!win || win.closed || !ready) return;
      try { win.postMessage(Object.assign({ type: 'presenter-context' }, getContext()), origin); }
      catch (err) { console.warn('[copresenter] send failed', err); }
    }

    // Don't leave an orphaned window behind when the talk ends.
    window.addEventListener('pagehide', () => { clearInterval(helloTimer); });

    return { send, open, isLive: () => ready };
  }

  return { mount };
})();
