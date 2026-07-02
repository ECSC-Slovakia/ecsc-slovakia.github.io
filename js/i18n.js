/* Slovak Cyber Team — i18n.js
   Slovak is baked into the HTML (source of truth, works without JS).
   English lives in window.I18N_EN, defined inline per page as
   { "key": "English text", ... }.
   Markup hooks:
     data-i18n="key"       — element innerHTML is swapped
     data-i18n-aria="key"  — element aria-label is swapped
     data-i18n-alt="key"   — image alt text is swapped
   Language: ?lang= (this visit only) → localStorage → browser language
   (sk* → SK, else EN). The SK/EN buttons persist the choice. */
(function () {
  'use strict';

  var EN = window.I18N_EN || {};
  var skHtml = {};   // key -> original Slovak innerHTML
  var skAria = {};   // key -> original Slovak aria-label
  var skAlt = {};    // key -> original Slovak alt

  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    skHtml[el.getAttribute('data-i18n')] = el.innerHTML;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
    skAria[el.getAttribute('data-i18n-aria')] = el.getAttribute('aria-label');
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
    skAlt[el.getAttribute('data-i18n-alt')] = el.getAttribute('alt');
  });

  function detectLang() {
    var qs = new URLSearchParams(location.search).get('lang');
    if (qs === 'sk' || qs === 'en') return { lang: qs, persist: false };
    var stored = null;
    try { stored = localStorage.getItem('sct-lang'); } catch (e) {}
    if (stored === 'sk' || stored === 'en') return { lang: stored, persist: false };
    var nav = (navigator.language || 'sk').toLowerCase();
    return { lang: nav.indexOf('sk') === 0 ? 'sk' : 'en', persist: false };
  }

  function apply(lang, persist) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (lang === 'en') { if (EN[key] != null) el.innerHTML = EN[key]; }
      else { if (skHtml[key] != null) el.innerHTML = skHtml[key]; }
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      var val = lang === 'en' ? EN[key] : skAria[key];
      if (val != null) el.setAttribute('aria-label', val);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-alt');
      var val = lang === 'en' ? EN[key] : skAlt[key];
      if (val != null) el.setAttribute('alt', val);
    });
    if (lang === 'en' && EN._title) document.title = EN._title;
    if (lang === 'sk' && window.SK_TITLE) document.title = window.SK_TITLE;
    document.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    if (persist) {
      try { localStorage.setItem('sct-lang', lang); } catch (e) {}
    }
    document.dispatchEvent(new CustomEvent('sct:lang', { detail: { lang: lang } }));
  }

  window.SK_TITLE = document.title;
  window.sctSetLang = function (lang) { apply(lang, true); };

  document.querySelectorAll('.lang-toggle button').forEach(function (b) {
    b.addEventListener('click', function () { apply(b.dataset.lang, true); });
  });

  var initial = detectLang();
  apply(initial.lang, initial.persist);
})();
