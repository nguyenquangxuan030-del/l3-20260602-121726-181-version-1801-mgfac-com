(function () {
    var navToggle = document.querySelector('[data-nav-toggle]');
    var nav = document.getElementById('mainNav');

    if (navToggle && nav) {
        navToggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var activeSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === activeSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === activeSlide);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(activeSlide + 1);
        }, 5200);
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var yearFilter = document.querySelector('[data-year-filter]');
    var typeFilter = document.querySelector('[data-type-filter]');
    var scope = document.querySelector('[data-filter-scope]');
    var resultCount = document.querySelector('[data-result-count]');

    function matchYear(cardYear, selectedYear) {
        if (!selectedYear) {
            return true;
        }

        var year = Number(cardYear) || 0;
        var selected = Number(selectedYear) || 0;

        if (selected === 2010) {
            return year >= 2010 && year < 2020;
        }

        if (selected === 2000) {
            return year >= 2000 && year < 2010;
        }

        if (selected === 1990) {
            return year > 0 && year < 2000;
        }

        return year === selected;
    }

    function applyLocalFilter() {
        if (!scope) {
            return;
        }

        var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
        var selectedYear = yearFilter ? yearFilter.value : '';
        var selectedType = typeFilter ? typeFilter.value : '';
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
        var visible = 0;

        cards.forEach(function (card) {
            var text = card.textContent.toLowerCase();
            var cardYear = card.getAttribute('data-year') || '';
            var cardType = card.getAttribute('data-type') || '';
            var passKeyword = !keyword || text.indexOf(keyword) !== -1;
            var passYear = matchYear(cardYear, selectedYear);
            var passType = !selectedType || cardType.indexOf(selectedType) !== -1;
            var pass = passKeyword && passYear && passType;

            card.classList.toggle('is-hidden', !pass);
            if (pass) {
                visible += 1;
            }
        });

        if (resultCount) {
            resultCount.textContent = '显示 ' + visible + ' 部影片';
        }
    }

    [filterInput, yearFilter, typeFilter].forEach(function (item) {
        if (item) {
            item.addEventListener('input', applyLocalFilter);
            item.addEventListener('change', applyLocalFilter);
        }
    });
})();
