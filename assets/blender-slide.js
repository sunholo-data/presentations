(function () {
  'use strict';

  const MODEL_VIEWER_SRC =
    'https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js';
  const EXPORT_MODE =
    navigator.webdriver || new URLSearchParams(window.location.search).has('export');
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (EXPORT_MODE) document.documentElement.classList.add('blender-export');

  let modelViewerPromise;

  function ensureStyles() {
    if (document.getElementById('sunholo-blender-slide-styles')) return;
    const style = document.createElement('style');
    style.id = 'sunholo-blender-slide-styles';
    style.textContent = `
      sunholo-blender {
        display: block;
        position: relative;
        overflow: hidden;
      }
      sunholo-blender .sunholo-blender-poster,
      sunholo-blender model-viewer {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
      }
      sunholo-blender .sunholo-blender-poster {
        object-fit: contain;
        opacity: 1;
        transition: opacity 420ms ease;
      }
      html:not([data-theme="light"]) sunholo-blender .sunholo-blender-poster {
        mix-blend-mode: screen;
      }
      sunholo-blender model-viewer {
        --poster-color: transparent;
        background: transparent;
        opacity: 0;
        transition: opacity 420ms ease;
      }
      sunholo-blender[data-loaded] model-viewer { opacity: 1; }
      sunholo-blender[data-loaded] .sunholo-blender-poster { opacity: 0; }
      sunholo-blender[data-background] { pointer-events: none; }
      html.blender-export [data-blender-hint] { display: none !important; }
      @media (prefers-reduced-motion: reduce) {
        sunholo-blender model-viewer { display: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureModelViewer() {
    if (customElements.get('model-viewer')) return Promise.resolve();
    if (modelViewerPromise) return modelViewerPromise;

    modelViewerPromise = new Promise((resolve) => {
      let script = document.getElementById('sunholo-model-viewer');
      if (!script) {
        script = document.createElement('script');
        script.id = 'sunholo-model-viewer';
        script.type = 'module';
        script.src = MODEL_VIEWER_SRC;
        document.head.appendChild(script);
      }
      customElements.whenDefined('model-viewer').then(resolve);
    });
    return modelViewerPromise;
  }

  class SunholoBlender extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready) return;
      this.dataset.ready = 'true';
      ensureStyles();

      const poster = document.createElement('img');
      poster.className = 'sunholo-blender-poster';
      poster.src = this.dataset.poster;
      poster.alt = this.dataset.alt || '';
      poster.decoding = 'async';
      this.appendChild(poster);

      this.slide = this.closest('.slide');
      this.frame = window.frameElement;
      this.sync = this.sync.bind(this);

      if (this.slide) {
        this.slideObserver = new MutationObserver(this.sync);
        this.slideObserver.observe(this.slide, {
          attributes: true,
          attributeFilter: ['class'],
        });
      }

      try {
        if (this.frame) {
          this.frameObserver = new MutationObserver(this.sync);
          this.frameObserver.observe(this.frame, {
            attributes: true,
            attributeFilter: ['class'],
          });
        }
      } catch (_) {
        // Cross-origin embedding still gets slide-level activation.
      }

      document.addEventListener('visibilitychange', this.sync);
      REDUCED_MOTION.addEventListener('change', this.sync);
      this.sync();
    }

    disconnectedCallback() {
      this.slideObserver?.disconnect();
      this.frameObserver?.disconnect();
      document.removeEventListener('visibilitychange', this.sync);
      REDUCED_MOTION.removeEventListener('change', this.sync);
    }

    isVisible() {
      const slideVisible = !this.slide || this.slide.classList.contains('active');
      let frameVisible = true;
      try {
        frameVisible = !this.frame || this.frame.classList.contains('active');
      } catch (_) {
        frameVisible = true;
      }
      return slideVisible && frameVisible && !document.hidden;
    }

    async sync() {
      const visible = this.isVisible();
      if (!visible || EXPORT_MODE || REDUCED_MOTION.matches) {
        this.viewer?.pause?.();
        return;
      }

      if (!this.viewer) {
        await ensureModelViewer();
        if (!this.isConnected || !this.isVisible()) return;
        this.createViewer();
      }
      this.viewer.play?.();
    }

    createViewer() {
      const viewer = document.createElement('model-viewer');
      viewer.src = this.dataset.src;
      viewer.poster = this.dataset.poster;
      viewer.alt = this.dataset.alt || '';
      viewer.setAttribute('autoplay', '');
      viewer.setAttribute('interaction-prompt', 'none');
      viewer.setAttribute('loading', 'eager');
      viewer.setAttribute('reveal', 'auto');
      viewer.setAttribute('shadow-intensity', this.dataset.shadowIntensity || '0');
      viewer.setAttribute('environment-image', this.dataset.environment || 'neutral');

      if (this.hasAttribute('controls')) {
        viewer.setAttribute('camera-controls', '');
        viewer.setAttribute('disable-zoom', '');
        viewer.setAttribute('touch-action', 'pan-y');
      }
      if (this.dataset.cameraOrbit) {
        viewer.setAttribute('camera-orbit', this.dataset.cameraOrbit);
      }
      if (this.dataset.fieldOfView) {
        viewer.setAttribute('field-of-view', this.dataset.fieldOfView);
      }
      if (this.dataset.animationName) {
        viewer.setAttribute('animation-name', this.dataset.animationName);
      }

      viewer.addEventListener('load', () => {
        this.dataset.loaded = 'true';
        if (this.isVisible()) viewer.play?.();
      });
      viewer.addEventListener('error', () => {
        delete this.dataset.loaded;
      });

      this.viewer = viewer;
      this.appendChild(viewer);
    }
  }

  if (!customElements.get('sunholo-blender')) {
    customElements.define('sunholo-blender', SunholoBlender);
  }
})();
