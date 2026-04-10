# HTML/CSS/JS Boilerplate

Copy this skeleton when starting a new slide deck. Replace `TITLE`, slide content, and `TOTAL` count.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TITLE</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}

/* Paste CSS variables from design-system.md :root and [data-theme="light"] */
/* Paste background patterns */
/* Paste layout, top-bar, slide, bottom-bar, theme-toggle, transport, kbd styles */
/* Add slide-specific styles */
/* Add @keyframes fadeSlideUp and fadeSlideIn */
/* Add .slides-stage 16:9 letterbox + container queries (cqi/cqb) — block below */
/* Add .in-iframe rules to hide own top-bar/bottom-bar when embedded in presenter */

/* ─── Slide canvas: 16:9 letterbox stage ───
   The slide-stage is the "design canvas" — always 16:9, centred inside the
   viewport, with whatever space is left becoming letterbox bars (matches the
   --bg colour so they're invisible on dark and unobtrusive on light).
   Size by container query units inside .slides-viewport so type scales with
   the stage's actual dimensions, not the browser window's. */
.slides-viewport{
  flex:1; min-height:0;
  display:flex; align-items:center; justify-content:center;
  overflow:hidden; background:var(--bg);
  container-type:size;
}
.slides-stage{
  position:relative;
  width:  min(100cqi, 100cqb * 16 / 9);
  height: min(100cqb, 100cqi * 9 / 16);
  container-type:size;  /* so descendants resolve cqi/cqb against the stage */
}

/* ─── Embedded-in-presenter mode ───
   When loaded via presenter.html the presenter supplies global chrome
   (title, tabs, clock, deck counter, timer, kbd hints). Hide our own bars
   so the stage gets the full iframe height — otherwise the bottom of slide
   content gets clipped. */
.in-iframe .top-bar{display:none}
.in-iframe .bottom-bar{display:none}
</style>
</head>
<body>
<script>if(window!==window.top)document.body.classList.add('in-iframe');</script>
<div id="app">

  <!-- Top bar -->
  <div class="top-bar">
    <div class="top-bar-left">
      <img src="../images/logos/sunholo-logo.svg" alt="Sunholo" class="top-logo">
      <img src="../images/logos/ailang-logo.svg" alt="AILANG" class="top-logo ailang-logo">
      <span class="deck-title"><span class="accent">TOPIC</span> — Subtitle</span>
    </div>
    <button class="theme-toggle" id="themeToggle" title="Toggle theme">
      <i class="fas fa-sun"></i>
    </button>
  </div>

  <!-- Slides viewport: holds the 16:9 stage, lets letterbox bars show -->
  <div class="slides-viewport">
    <div class="slides-stage">
      <section class="slide active" data-slide="0">
        <!-- Slide 1 content -->
      </section>
      <section class="slide" data-slide="1">
        <!-- Slide 2 content -->
      </section>
    </div>
  </div>

  <!-- Bottom bar -->
  <div class="bottom-bar">
    <div class="transport">
      <button class="transport-btn" id="btnPrev" title="Previous slide">
        <i class="fas fa-chevron-left"></i>
      </button>
      <span class="step-indicator">
        <span class="current" id="slideNum">1</span> / <span id="slideTotal">TOTAL</span>
      </span>
      <button class="transport-btn" id="btnNext" title="Next slide">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
    <div class="slide-dots" id="slideDots"></div>
    <div class="nav-hints">
      <span class="kbd">←</span><span class="kbd">→</span>
      <span style="font-size:11px;color:var(--text-dim);margin-left:4px">navigate</span>
    </div>
  </div>

</div>

<script>
(function(){
  const TOTAL = 2; // UPDATE THIS
  let current = 0;
  let transitioning = false;

  const slides = document.querySelectorAll('.slide');
  const slideNum = document.getElementById('slideNum');
  const dotsContainer = document.getElementById('slideDots');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const themeToggle = document.getElementById('themeToggle');

  // Build dots
  for(let i=0;i<TOTAL;i++){
    const d = document.createElement('button');
    d.className = 'slide-dot' + (i===0?' active':'');
    d.dataset.idx = i;
    d.addEventListener('click', ()=> goTo(i));
    dotsContainer.appendChild(d);
  }

  function goTo(n){
    if(n<0||n>=TOTAL||n===current||transitioning) return;
    transitioning = true;
    const dir = n > current ? 1 : -1;

    slides.forEach(s=>{
      s.classList.remove('active','exit-left');
      // Reset animated elements — ADD YOUR CLASSES HERE
      s.querySelectorAll('.card,.anno-item,.compare-callout,.ct-data').forEach(el=>{
        el.style.opacity='0';
        el.style.transform='';
      });
    });

    if(dir>0) slides[current].classList.add('exit-left');
    slides[n].classList.add('active');

    current = n;
    slideNum.textContent = current + 1;
    document.querySelectorAll('.slide-dot').forEach((d,i)=>{
      d.classList.toggle('active', i===current);
    });
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === TOTAL - 1;

    setTimeout(()=>{ transitioning = false; }, 500);
  }

  // ←/→ = slides within this deck only (never crosses deck boundaries)
  // ↑/↓ = deck-level navigation (handled by parent presenter)
  btnPrev.addEventListener('click', ()=> goTo(current-1));
  btnNext.addEventListener('click', ()=> goTo(current+1));
  btnPrev.disabled = true;

  document.addEventListener('keydown', e=>{
    if(e.key==='ArrowRight'||e.key===' ') goTo(current+1);
    if(e.key==='ArrowLeft') goTo(current-1);
    if(e.key==='ArrowDown'){ e.preventDefault(); window.parent.postMessage({type:'deck-nav',dir:'next'},'*'); }
    if(e.key==='ArrowUp'){ e.preventDefault(); window.parent.postMessage({type:'deck-nav',dir:'prev'},'*'); }
  });

  // Listen for navigator commands (when embedded in presenter iframe)
  window.addEventListener('message', e=>{
    if(e.data && e.data.type==='deck-command'){
      if(e.data.action==='go-first') goTo(0);
      if(e.data.action==='go-last'){ current=-1; goTo(TOTAL-1); }
      if(e.data.action==='set-theme') setTheme(e.data.theme);
    }
  });
  window.parent.postMessage({type:'deck-ready',total:TOTAL},'*');

  function setTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.innerHTML = theme==='light'
      ? '<i class="fas fa-moon"></i>'
      : '<i class="fas fa-sun"></i>';
    localStorage.setItem('slides-theme', theme);
    window.parent.postMessage({type:'deck-theme',theme:theme},'*');
  }
  themeToggle.addEventListener('click', ()=>{
    const cur = document.documentElement.getAttribute('data-theme');
    setTheme(cur==='light'?'dark':'light');
  });
  const saved = localStorage.getItem('slides-theme');
  if(saved) setTheme(saved);
})();
</script>
</body>
</html>
```

## Checklist for New Slide Decks

- [ ] Update `<title>` and `.deck-title`
- [ ] Set `const TOTAL` in JS to match slide count
- [ ] Set `<span id="slideTotal">` to match
- [ ] Add all animated element classes to the reset selector in `goTo()`
- [ ] Test keyboard navigation (←→ slides, ↑↓ decks, space)
- [ ] Test theme toggle (both modes should look polished)
- [ ] Add deck entry to presenter.html PLAYLIST array
- [ ] Verify presenter bridge works (←→ auto-advances at boundaries, ↑↓ jumps decks)
- [ ] Verify at 1920x1080 (projector target)
- [ ] Check `white-space:pre` on all code containers
- [ ] Ensure code blocks are flush-left (no HTML indentation artifacts)
- [ ] Verify the deck looks right both standalone *and* inside `presenter.html` (no clipped bottom, no duplicate bars)
- [ ] Resize the browser to a non-16:9 shape (e.g. 1200×900). Slides should letterbox cleanly, not stretch
- [ ] Use `cqi` / `cqb` units for font sizes inside slides (e.g. `clamp(24px, 5cqi, 56px)`) instead of `vw`/`vh`, so type scales with the stage rather than the window
