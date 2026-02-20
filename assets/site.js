/**
 * Shared header injector and site init (nav toggle, theme).
 * Load this script once per page; it fetches includes/header.html and inits UI.
 */
(function () {
  var base = (window.location.pathname || '').indexOf('/blog') !== -1 ? '../' : '';

  function initNav() {
    var nav = document.querySelector('.main-nav');
    var toggle = document.querySelector('.nav-toggle');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open);
      });
      nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  function initTheme() {
    var themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
      var dark = localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', dark);
      themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      themeBtn.addEventListener('click', function () {
        dark = !document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      });
    }
  }

  var headerEl = document.getElementById('site-header');
  if (headerEl) {
    fetch(base + 'includes/header.html')
      .then(function (r) { return r.text(); })
      .then(function (html) {
        headerEl.innerHTML = html;
        initNav();
        initTheme();
      })
      .catch(function () {
        headerEl.innerHTML = '<div class="wrap topbar-inner"><a class="brand" href="' + (base || './') + '">Siva Bayyavarapu</a><a href="' + (base || './') + 'blog/">Blog</a></div>';
        initTheme();
      });
  } else {
    initNav();
    initTheme();
  }
})();
