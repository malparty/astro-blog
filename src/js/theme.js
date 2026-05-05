(function () {
  'use strict';
  var KEY = 'malparty-theme';

  function stored() {
    try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; }
  }

  function apply(theme) {
    var root = document.documentElement;
    if (theme === 'dark' || theme === 'light') {
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme');
    }
  }

  function set(theme) {
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    apply(theme);
    sync(theme);
  }

  function sync(theme) {
    document.querySelectorAll('[data-theme-btn]').forEach(function (btn) {
      var active = btn.dataset.themeBtn === theme;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var cur = stored();
    sync(cur);
    document.querySelectorAll('[data-theme-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () { set(btn.dataset.themeBtn); });
    });
  });
})();
