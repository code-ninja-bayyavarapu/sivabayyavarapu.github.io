/** Shared navigation, theme, and accessible disclosure state. */
(function () {
  var base = (window.location.pathname || "").indexOf("/blog") !== -1 ? "../" : "";

  function initNav() {
    var nav = document.querySelector(".main-nav");
    var toggle = document.querySelector(".nav-toggle");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  function initTheme() {
    var themeButton = document.querySelector(".theme-toggle");
    if (!themeButton) return;

    var savedTheme = localStorage.getItem("theme");
    var isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
    themeButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");

    themeButton.addEventListener("click", function () {
      isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      themeButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  function initDisclosures() {
    document.querySelectorAll("details").forEach(function (details) {
      var summary = details.querySelector("summary");
      if (!summary) return;
      summary.setAttribute("aria-expanded", String(details.open));
      details.addEventListener("toggle", function () {
        summary.setAttribute("aria-expanded", String(details.open));
      });
    });
  }

  function renderFallbackHeader(header) {
    header.innerHTML = '<div class="wrap topbar-inner"><a class="brand brand-mark" href="' + (base || "./") + '">Siva Bayyavarapu</a><a class="text-link" href="' + (base || "./") + 'blog/">Writing</a></div>';
  }

  var header = document.getElementById("site-header");
  if (header) {
    fetch(base + "includes/header.html")
      .then(function (response) {
        if (!response.ok) throw new Error("Header unavailable");
        return response.text();
      })
      .then(function (html) {
        header.innerHTML = html;
        initNav();
        initTheme();
      })
      .catch(function () {
        renderFallbackHeader(header);
        initTheme();
      });
  } else {
    initNav();
    initTheme();
  }

  initDisclosures();
})();
