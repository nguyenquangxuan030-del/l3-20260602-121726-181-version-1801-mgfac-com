(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");

    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        var open = mobileNav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }

        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          start();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
          start();
        });
      }

      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
      start();
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
    panels.forEach(function (panel) {
      var container = panel.parentElement;
      if (!container) {
        return;
      }

      var list = container.querySelector("[data-card-list]");
      if (!list) {
        return;
      }

      var input = panel.querySelector("[data-filter-query]");
      var year = panel.querySelector("[data-filter-year]");
      var type = panel.querySelector("[data-filter-type]");
      var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q") || "";

      if (input && q) {
        input.value = q;
      }

      function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
      }

      function filter() {
        var query = normalize(input ? input.value : "");
        var selectedYear = normalize(year ? year.value : "");
        var selectedType = normalize(type ? type.value : "");

        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags"),
            card.getAttribute("data-year")
          ].join(" "));
          var yearMatch = !selectedYear || normalize(card.getAttribute("data-year")) === selectedYear;
          var typeMatch = !selectedType || normalize(card.getAttribute("data-type")) === selectedType;
          var queryMatch = !query || haystack.indexOf(query) !== -1;
          card.hidden = !(yearMatch && typeMatch && queryMatch);
        });
      }

      if (input) {
        input.addEventListener("input", filter);
      }
      if (year) {
        year.addEventListener("change", filter);
      }
      if (type) {
        type.addEventListener("change", filter);
      }

      filter();
    });
  });
})();
