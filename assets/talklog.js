// ═══════════════════════════════════════════════════════════════════════════
// talklog.js — capture what actually happened during a talk.
//
// Loaded by presenter.html when the `talklog` flag is on (see
// presenter.config.js). Three things, none of which need an API key:
//
//   Q  capture an audience question, tagged with the deck + slide on screen
//   N  capture a note to self, same tagging
//   L  open the log — timing table, entries, markdown export
//
// The point is the write-up afterwards. A retrospective post reconstructed
// from memory loses the questions and the real pacing; this keeps both, and
// the export hands you `minutes:` values measured from an actual run rather
// than guessed.
//
// State lives in localStorage under `talklog:<talkId>` so a mid-talk refresh
// doesn't lose anything.
// ═══════════════════════════════════════════════════════════════════════════
window.TalkLog = (function () {

  const CSS = `
  .tl-btn{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:10px;font-weight:600;
    letter-spacing:.03em;color:var(--text-dim);border:1px solid var(--ghost);border-radius:999px;padding:4px 11px;
    cursor:pointer;background:transparent;transition:all .2s}
  .tl-btn:hover{border-color:var(--orange);color:var(--orange)}
  .tl-btn .tl-count{font-variant-numeric:tabular-nums;background:var(--orange);color:#fff;border-radius:999px;
    padding:0 5px;font-size:9px;line-height:15px;min-width:15px;text-align:center}
  .tl-btn .tl-count:empty,.tl-btn .tl-count[data-n="0"]{display:none}

  .tl-scrim{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);z-index:200;
    display:flex;align-items:center;justify-content:center;padding:24px}
  .tl-scrim[hidden]{display:none}

  .tl-card{background:var(--surface);border:1px solid var(--ghost);border-radius:14px;
    box-shadow:0 24px 70px rgba(0,0,0,.45);width:min(680px,100%);max-height:86vh;display:flex;flex-direction:column}
  .tl-card h3{font-size:14px;font-weight:700;padding:16px 20px 0;color:var(--text)}
  .tl-ctx{font-family:var(--mono);font-size:10px;color:var(--text-dim);padding:4px 20px 0;letter-spacing:.03em}
  .tl-card textarea{margin:14px 20px;padding:11px 13px;border-radius:9px;border:1px solid var(--ghost);
    background:var(--bg);color:var(--text);font-family:var(--sans);font-size:14px;line-height:1.5;
    resize:vertical;min-height:92px;outline:none}
  .tl-card textarea:focus{border-color:var(--orange)}
  .tl-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;
    padding:0 20px 16px;font-family:var(--mono);font-size:10px;color:var(--text-dim)}
  .tl-actions{display:flex;gap:8px}
  .tl-act{font-family:var(--mono);font-size:10px;font-weight:600;padding:6px 13px;border-radius:8px;
    border:1px solid var(--ghost);background:transparent;color:var(--text);cursor:pointer;transition:all .2s}
  .tl-act:hover{border-color:var(--orange);color:var(--orange)}
  .tl-act.primary{background:var(--orange);border-color:var(--orange);color:#fff}
  .tl-act.primary:hover{background:transparent;color:var(--orange)}
  .tl-act.danger:hover{border-color:#ef4444;color:#ef4444}

  .tl-body{overflow-y:auto;padding:14px 20px 4px}
  .tl-sec{font-family:var(--mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;
    color:var(--text-dim);opacity:.7;margin:14px 0 7px}
  .tl-sec:first-child{margin-top:0}
  .tl-table{width:100%;border-collapse:collapse;font-family:var(--mono);font-size:11px}
  .tl-table th{text-align:left;font-weight:600;color:var(--text-dim);font-size:9px;text-transform:uppercase;
    letter-spacing:.08em;padding:0 8px 5px 0;opacity:.7}
  .tl-table td{padding:3px 8px 3px 0;color:var(--text);border-top:1px solid var(--ghost);font-variant-numeric:tabular-nums}
  .tl-table td.name{font-family:var(--sans);font-size:12px}
  .tl-table td.over{color:var(--orange)}
  .tl-table td.under{color:var(--green)}
  .tl-entry{border-left:2px solid var(--orange-dim);padding:5px 0 5px 11px;margin-bottom:9px}
  .tl-entry.note{border-left-color:var(--ghost)}
  .tl-entry .tl-meta{font-family:var(--mono);font-size:9px;color:var(--text-dim);letter-spacing:.03em;margin-bottom:2px}
  .tl-entry .tl-text{font-size:13px;line-height:1.5;color:var(--text);white-space:pre-wrap}
  .tl-empty{font-size:12px;color:var(--text-dim);padding:6px 0 10px}
  `;

  const fmt = (s) => {
    s = Math.max(0, Math.round(s));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  };
  const fmtSigned = (s) => (s < 0 ? '−' : '+') + fmt(Math.abs(s));
  const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  function mount(opts) {
    const { talkId, title, playlist, mountPoint } = opts;
    const KEY = 'talklog:' + talkId;

    // ── state ────────────────────────────────────────────────────────────
    let entries = [];                    // {kind:'q'|'n', text, at, tSec, deck, slide}
    let slideSpent = {};                 // deck index -> { slide index -> seconds }
    let slideOf = {};                    // deck index -> slide index currently showing
    let lastTick = null;

    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
      entries = saved.entries || [];
      slideSpent = saved.slideSpent || {};
    } catch { /* corrupt entry — start clean rather than break the talk */ }

    const save = () => {
      try { localStorage.setItem(KEY, JSON.stringify({ entries, slideSpent, savedAt: new Date().toISOString() })); }
      catch { /* private mode / quota — the talk matters more than the log */ }
    };

    // ── chrome ───────────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.className = 'tl-btn';
    btn.title = 'Talk log — Q question · N note · L open';
    btn.innerHTML = '<i class="fa-regular fa-comment-dots"></i> Log <span class="tl-count"></span>';
    btn.addEventListener('click', openLog);
    mountPoint.appendChild(btn);
    const countEl = btn.querySelector('.tl-count');

    const scrim = document.createElement('div');
    scrim.className = 'tl-scrim';
    scrim.hidden = true;
    document.body.appendChild(scrim);
    scrim.addEventListener('mousedown', (e) => { if (e.target === scrim) close(); });

    const renderCount = () => {
      countEl.textContent = entries.length || '';
      countEl.dataset.n = entries.length;
    };
    renderCount();

    function close() { scrim.hidden = true; scrim.innerHTML = ''; }
    const isOpen = () => !scrim.hidden;

    // ── capture ──────────────────────────────────────────────────────────
    function capture(kind) {
      if (isOpen()) return;
      const deck = opts.getDeck();
      const slide = slideOf[deck];
      const ctx = contextLabel(deck, slide);

      scrim.hidden = false;
      scrim.innerHTML = `
        <div class="tl-card">
          <h3>${kind === 'q' ? 'Audience question' : 'Note to self'}</h3>
          <div class="tl-ctx">${esc(ctx)}</div>
          <textarea placeholder="${kind === 'q' ? 'What did they ask?' : "What's worth remembering?"}"></textarea>
          <div class="tl-foot">
            <span>⏎ save &nbsp;·&nbsp; ⇧⏎ newline &nbsp;·&nbsp; esc cancel</span>
            <div class="tl-actions">
              <button class="tl-act" data-act="cancel">Cancel</button>
              <button class="tl-act primary" data-act="save">Save</button>
            </div>
          </div>
        </div>`;
      const ta = scrim.querySelector('textarea');
      ta.focus();

      const commit = () => {
        const text = ta.value.trim();
        if (text) {
          entries.push({
            kind, text,
            at: new Date().toISOString(),
            tSec: totalSpent(),
            deck, slide: slide === undefined ? null : slide,
          });
          save();
          renderCount();
        }
        close();
      };
      scrim.querySelector('[data-act="save"]').addEventListener('click', commit);
      scrim.querySelector('[data-act="cancel"]').addEventListener('click', close);
      ta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit(); }
        if (e.key === 'Escape') { e.preventDefault(); close(); }
      });
    }

    function contextLabel(deck, slide) {
      const d = playlist[deck];
      const where = d ? d.label : 'deck ' + (deck + 1);
      const s = (slide === undefined || slide === null || slide < 0) ? '' : ' · slide ' + (slide + 1);
      return fmt(totalSpent()) + ' into the talk · ' + where + s;
    }

    // ── timing ───────────────────────────────────────────────────────────
    const totalSpent = () => opts.getDeckSpent().reduce((a, b) => a + b, 0);

    // Called from the presenter's tick. Banks wall time onto the slide showing
    // right now — only while the talk timer is running, so pauses don't count.
    function tick() {
      const now = Date.now();
      if (!opts.isRunning()) { lastTick = null; return; }
      if (lastTick !== null) {
        const deck = opts.getDeck();
        const slide = slideOf[deck];
        if (slide !== undefined && slide >= 0) {
          slideSpent[deck] = slideSpent[deck] || {};
          slideSpent[deck][slide] = (slideSpent[deck][slide] || 0) + (now - lastTick) / 1000;
        }
      }
      lastTick = now;
    }

    function onSlide(deck, index) { slideOf[deck] = index; }

    // ── log panel ────────────────────────────────────────────────────────
    function openLog() {
      if (isOpen()) { close(); return; }
      save();
      const spent = opts.getDeckSpent();

      const rows = playlist.map((d, i) => {
        const budget = (d.minutes || 0) * 60;
        const actual = spent[i] || 0;
        const delta = actual - budget;
        const cls = !budget ? '' : delta > 30 ? 'over' : delta < -30 ? 'under' : '';
        return `<tr>
          <td>${i + 1}</td>
          <td class="name">${esc(d.label)}</td>
          <td>${budget ? fmt(budget) : '—'}</td>
          <td>${fmt(actual)}</td>
          <td class="${cls}">${budget ? fmtSigned(delta) : ''}</td>
        </tr>`;
      }).join('');

      const slowest = topSlides(5).map(
        (s) => `<tr><td class="name">${esc(s.deckLabel)}</td><td>slide ${s.slide + 1}</td><td>${fmt(s.sec)}</td></tr>`
      ).join('');

      const list = entries.length ? entries.map((e, i) => `
        <div class="tl-entry ${e.kind === 'n' ? 'note' : ''}">
          <div class="tl-meta">${e.kind === 'q' ? 'QUESTION' : 'NOTE'} · ${esc(contextLabelFor(e))}
            <button class="tl-act danger" data-del="${i}" style="padding:1px 7px;margin-left:8px">×</button></div>
          <div class="tl-text">${esc(e.text)}</div>
        </div>`).join('') : '<div class="tl-empty">Nothing captured yet — press Q during the talk.</div>';

      scrim.hidden = false;
      scrim.innerHTML = `
        <div class="tl-card">
          <h3>Talk log — ${esc(title)}</h3>
          <div class="tl-ctx">${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} · ${fmt(totalSpent())} spoken</div>
          <div class="tl-body">
            <div class="tl-sec">Timing</div>
            <table class="tl-table">
              <tr><th>#</th><th>Deck</th><th>Budget</th><th>Actual</th><th>Δ</th></tr>
              ${rows}
            </table>
            ${slowest ? `<div class="tl-sec">Slowest slides</div><table class="tl-table">${slowest}</table>` : ''}
            <div class="tl-sec">Captured</div>
            ${list}
          </div>
          <div class="tl-foot">
            <span>Q question · N note · L close</span>
            <div class="tl-actions">
              <button class="tl-act danger" data-act="clear">Clear</button>
              <button class="tl-act primary" data-act="export">Export markdown</button>
            </div>
          </div>
        </div>`;

      scrim.querySelector('[data-act="export"]').addEventListener('click', exportMarkdown);
      scrim.querySelector('[data-act="clear"]').addEventListener('click', () => {
        if (!confirm('Clear the whole talk log — entries and slide timings?')) return;
        entries = []; slideSpent = {}; save(); renderCount(); close();
      });
      scrim.querySelectorAll('[data-del]').forEach((b) =>
        b.addEventListener('click', () => {
          entries.splice(Number(b.dataset.del), 1);
          save(); renderCount(); close(); openLog();
        }));
    }

    function contextLabelFor(e) {
      const d = playlist[e.deck];
      const where = d ? d.label : 'deck ' + (e.deck + 1);
      const s = (e.slide === null || e.slide === undefined || e.slide < 0) ? '' : ', slide ' + (e.slide + 1);
      return fmt(e.tSec) + ' · ' + where + s;
    }

    function topSlides(n) {
      const out = [];
      for (const deck of Object.keys(slideSpent)) {
        for (const slide of Object.keys(slideSpent[deck])) {
          out.push({
            deckLabel: playlist[deck] ? playlist[deck].label : 'deck ' + (Number(deck) + 1),
            slide: Number(slide),
            sec: slideSpent[deck][slide],
          });
        }
      }
      return out.sort((a, b) => b.sec - a.sec).slice(0, n);
    }

    // ── export ───────────────────────────────────────────────────────────
    function exportMarkdown() {
      const spent = opts.getDeckSpent();
      const total = totalSpent();
      const budget = playlist.reduce((s, d) => s + (d.minutes || 0) * 60, 0);
      const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');

      const L = [];
      L.push(`# ${title} — talk log`, '');
      L.push(`Recorded ${stamp} · budget ${fmt(budget)} · actual ${fmt(total)} (${fmtSigned(total - budget)})`, '');

      L.push('## Timing', '');
      L.push('| # | Deck | Budget | Actual | Δ |', '|---|---|---|---|---|');
      playlist.forEach((d, i) => {
        const b = (d.minutes || 0) * 60, a = spent[i] || 0;
        L.push(`| ${i + 1} | ${d.label} | ${b ? fmt(b) : '—'} | ${fmt(a)} | ${b ? fmtSigned(a - b) : ''} |`);
      });
      L.push('');

      // The useful bit: minutes measured from a real run, ready to paste back.
      L.push('Re-budget from this run — paste over the PLAYLIST `minutes:` values:', '', '```js');
      playlist.forEach((d, i) => {
        const a = spent[i] || 0;
        L.push(`{ src: '${d.src}', label: '${d.label}', minutes: ${Math.max(0, Math.round(a / 60))} },`);
      });
      L.push('```', '');

      const slow = topSlides(8);
      if (slow.length) {
        L.push('## Slowest slides', '');
        slow.forEach((s) => L.push(`- ${s.deckLabel}, slide ${s.slide + 1} — ${fmt(s.sec)}`));
        L.push('');
      }

      const qs = entries.filter((e) => e.kind === 'q');
      const ns = entries.filter((e) => e.kind === 'n');
      if (qs.length) {
        L.push(`## Questions (${qs.length})`, '');
        qs.forEach((e) => L.push(`- **[${contextLabelFor(e)}]** ${e.text}`));
        L.push('');
      }
      if (ns.length) {
        L.push(`## Notes (${ns.length})`, '');
        ns.forEach((e) => L.push(`- **[${contextLabelFor(e)}]** ${e.text}`));
        L.push('');
      }

      const blob = new Blob([L.join('\n')], { type: 'text/markdown' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${talkId}-talklog.md`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }

    // ── hotkeys ──────────────────────────────────────────────────────────
    function hotkey(k) {
      if (k === 'q') capture('q');
      else if (k === 'n') capture('n');
      else if (k === 'l') openLog();
    }

    document.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      const k = (e.key || '').toLowerCase();
      if (k === 'escape' && isOpen()) { close(); return; }
      if (k === 'q' || k === 'n' || k === 'l') { e.preventDefault(); hotkey(k); }
    });

    return { tick, onSlide, hotkey, isOpen };
  }

  return { mount };
})();
