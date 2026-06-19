(() => {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-nav]");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", menu.classList.contains("is-open") ? "true" : "false");
    });
  }

  const hero = document.querySelector("[data-hero]");

  if (hero) {
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    let current = 0;

    const show = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
    };

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => show(i));
    });

    if (slides.length > 1) {
      window.setInterval(() => show(current + 1), 5800);
    }
  }

  const quickInput = document.querySelector("[data-quick-search]");
  const quickButton = document.querySelector("[data-quick-button]");

  if (quickInput && quickButton) {
    const go = () => {
      const q = quickInput.value.trim();
      const url = q ? `search.html?q=${encodeURIComponent(q)}` : "search.html";
      window.location.href = url;
    };

    quickButton.addEventListener("click", go);
    quickInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        go();
      }
    });
  }

  const filterInput = document.querySelector("[data-filter-input]");
  const filterYear = document.querySelector("[data-filter-year]");
  const filterType = document.querySelector("[data-filter-type]");
  const cards = Array.from(document.querySelectorAll("[data-movie-card]"));

  if (filterInput && cards.length) {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("q");

    if (initial) {
      filterInput.value = initial;
    }

    const apply = () => {
      const q = filterInput.value.trim().toLowerCase();
      const year = filterYear ? filterYear.value : "";
      const type = filterType ? filterType.value : "";

      cards.forEach((card) => {
        const text = (card.getAttribute("data-search") || "").toLowerCase();
        const cardYear = card.getAttribute("data-year") || "";
        const cardType = card.getAttribute("data-type") || "";
        const matchText = !q || text.includes(q);
        const matchYear = !year || cardYear === year;
        const matchType = !type || cardType === type;
        card.classList.toggle("is-filtered-out", !(matchText && matchYear && matchType));
      });
    };

    filterInput.addEventListener("input", apply);
    if (filterYear) {
      filterYear.addEventListener("change", apply);
    }
    if (filterType) {
      filterType.addEventListener("change", apply);
    }
    apply();
  }
})();
