/** Shared navigation, theme, and accessible disclosure state. */
(function () {
  var path = window.location.pathname || "";
  var base = path.indexOf("/blog/") !== -1 || path.indexOf("/research/") !== -1 ? "../" : "";

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


  function initCitationCopy() {
    var actions = document.querySelector(".paper-actions");
    var citation = document.querySelector(".citation-panel > p");
    if (!actions || !citation || !navigator.clipboard) return;

    var button = document.createElement("button");
    button.className = "btn btn-secondary copy-citation";
    button.type = "button";
    button.textContent = "Copy citation";
    actions.appendChild(button);

    button.addEventListener("click", function () {
      navigator.clipboard.writeText(citation.textContent.trim()).then(function () {
        button.textContent = "Citation copied";
        window.setTimeout(function () {
          button.textContent = "Copy citation";
        }, 1800);
      }).catch(function () {
        button.textContent = "Copy unavailable";
      });
    });
  }

  function initGallery() {
    var root = document.querySelector("[data-gallery]");
    if (!root) return;

    var track = root.querySelector(".gallery-track");
    var slides = Array.prototype.slice.call(root.querySelectorAll(".gallery-slide"));
    var prev = root.querySelector(".gallery-prev");
    var next = root.querySelector(".gallery-next");
    var status = root.querySelector(".gallery-status");
    var dotsWrap = root.querySelector(".gallery-dots");
    var index = 0;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Show photo " + (i + 1));
      dot.addEventListener("click", function () { show(i); });
      dotsWrap.appendChild(dot);
    });

    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll(".gallery-dot"));

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      track.style.transform = "translateX(-" + (index * 100) + "%)";
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
      if (status) status.textContent = (index + 1) + " / " + slides.length;
    }

    prev.addEventListener("click", function () { show(index - 1); });
    next.addEventListener("click", function () { show(index + 1); });
    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") show(index - 1);
      if (event.key === "ArrowRight") show(index + 1);
    });
    root.setAttribute("tabindex", "0");

    var touchStartX = 0;
    root.addEventListener("touchstart", function (event) {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });
    root.addEventListener("touchend", function (event) {
      var delta = event.changedTouches[0].screenX - touchStartX;
      if (delta > 40) show(index - 1);
      if (delta < -40) show(index + 1);
    }, { passive: true });
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
  initCitationCopy();
  initGallery();
})();
