/*!
 * TWM Stories — Instagram Embed Component
 *
 * Wraps Instagram's official embed (licensed music stays intact) in a
 * clean, chrome-minimal shell that sits naturally on a dark background.
 *
 * Auto usage — add the attribute to any element and include this script:
 *   <div data-insta-embed="https://www.instagram.com/reel/CODE/"></div>
 *   <script src="/assets/js/insta-embed.js" defer></script>
 *
 * JS usage (dynamic / SPA):
 *   TWMInstaEmbed.render(containerEl, 'https://www.instagram.com/reel/CODE/')
 *   TWMInstaEmbed.init()   // re-scan for new [data-insta-embed] nodes
 *
 * Mask color — set --twm-ig-mask on the element or any ancestor to match
 * your section background (defaults to #1A1612):
 *   <div data-insta-embed="..." style="--twm-ig-mask: var(--color-bg)"></div>
 */
(function () {
  'use strict';

  var EMBED_SRC = 'https://www.instagram.com/embed.js';

  /* ── Styles injected once into <head> ───────────────────────── */
  function injectStyles() {
    if (document.getElementById('twm-ig-css')) return;
    var s = document.createElement('style');
    s.id = 'twm-ig-css';
    s.textContent = [

      /* Outer shell */
      '.twm-ig {',
      '  --twm-ig-mask: #1A1612;',
      '  position: relative;',
      '  max-width: 480px;',
      '  margin: 0 auto;',
      '  border-radius: 6px;',
      '  overflow: hidden;',
      '  background: var(--twm-ig-mask);',
      '}',

      /* Force the Instagram blockquote to fill the shell cleanly */
      '.twm-ig .instagram-media {',
      '  margin: 0 auto !important;',
      '  min-width: 0 !important;',
      '  border-radius: 0 !important;',
      '  box-shadow: none !important;',
      '  border: none !important;',
      '}',

      /* Mask bars that sit on top of Instagram's chrome */
      '.twm-ig__mask {',
      '  position: absolute;',
      '  left: 0;',
      '  right: 0;',
      '  z-index: 10;',
      '  pointer-events: none;',  /* clicks pass through so video plays */
      '  background: var(--twm-ig-mask);',
      '}',

      /* Top mask — hides the profile-header row (~58px) */
      '.twm-ig__mask--top {',
      '  top: 0;',
      '  height: 58px;',
      '}',

      /* Feather the bottom edge of the top mask */
      '.twm-ig__mask--top::after {',
      '  content: "";',
      '  position: absolute;',
      '  left: 0; right: 0;',
      '  bottom: -20px;',
      '  height: 20px;',
      '  background: linear-gradient(to bottom, var(--twm-ig-mask), transparent);',
      '}',

      /* Bottom mask — hides the action-row (~52px) */
      '.twm-ig__mask--bot {',
      '  bottom: 0;',
      '  height: 52px;',
      '}',

      /* Feather the top edge of the bottom mask */
      '.twm-ig__mask--bot::before {',
      '  content: "";',
      '  position: absolute;',
      '  left: 0; right: 0;',
      '  top: -20px;',
      '  height: 20px;',
      '  background: linear-gradient(to top, var(--twm-ig-mask), transparent);',
      '}',

    ].join('\n');
    document.head.appendChild(s);
  }

  /* ── Build the wrapper for one element ──────────────────────── */
  function build(el) {
    var url = el.dataset.instaEmbed;
    if (!url) return;

    /* Normalise URL — strip tracking params, ensure trailing slash */
    var clean = url.split('?')[0].replace(/\/?$/, '/');

    var wrap = document.createElement('div');
    wrap.className = 'twm-ig';

    /* Propagate a custom mask colour if the caller set one */
    var maskColor = el.style.getPropertyValue('--twm-ig-mask') ||
                    getComputedStyle(el).getPropertyValue('--twm-ig-mask');
    if (maskColor && maskColor.trim()) {
      wrap.style.setProperty('--twm-ig-mask', maskColor.trim());
    }

    var topMask = document.createElement('div');
    topMask.className = 'twm-ig__mask twm-ig__mask--top';
    topMask.setAttribute('aria-hidden', 'true');

    var botMask = document.createElement('div');
    botMask.className = 'twm-ig__mask twm-ig__mask--bot';
    botMask.setAttribute('aria-hidden', 'true');

    /* The official Instagram blockquote — embed.js turns this into the
       licensed iframe. No data-instgrm-captioned keeps caption chrome off. */
    var bq = document.createElement('blockquote');
    bq.className = 'instagram-media';
    bq.dataset.instgrmPermalink = clean;
    bq.dataset.instgrmVersion   = '14';

    wrap.appendChild(topMask);
    wrap.appendChild(bq);
    wrap.appendChild(botMask);

    el.replaceWith(wrap);
  }

  /* ── Load embed.js (once) then fire Embeds.process() ────────── */
  function trigger() {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    /* Already loading? embed.js calls process() itself on load. */
    if (document.querySelector('script[src="' + EMBED_SRC + '"]')) return;

    var s   = document.createElement('script');
    s.src   = EMBED_SRC;
    s.async = true;
    document.body.appendChild(s);
  }

  /* ── Scan the DOM for uninitialised embeds ───────────────────── */
  function init() {
    document.querySelectorAll('[data-insta-embed]').forEach(build);
    trigger();
  }

  /* ── Bootstrap ───────────────────────────────────────────────── */
  injectStyles();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Public API ──────────────────────────────────────────────── */
  window.TWMInstaEmbed = {
    /** Re-scan for new [data-insta-embed] nodes (SPA navigation etc.) */
    init: init,
    /** Render a single embed into el, using the given Instagram URL */
    render: function (el, url) {
      el.dataset.instaEmbed = url;
      build(el);
      trigger();
    }
  };

}());
