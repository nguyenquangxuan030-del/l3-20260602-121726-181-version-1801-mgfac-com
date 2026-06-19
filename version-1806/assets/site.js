(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var carousel = document.querySelector('[data-hero-carousel]');

    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var activeIndex = 0;

        function showSlide(index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === activeIndex);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var index = Number(dot.getAttribute('data-hero-dot')) || 0;
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5200);
        }
    }

    var filterBars = Array.prototype.slice.call(document.querySelectorAll('[data-filter-bar]'));

    filterBars.forEach(function (bar) {
        var section = bar.closest('section');
        var cards = section ? Array.prototype.slice.call(section.querySelectorAll('[data-movie-card]')) : [];
        var countText = section ? section.querySelector('[data-count-text]') : null;
        var searchInput = bar.querySelector('[data-search-input]');
        var yearFilter = bar.querySelector('[data-year-filter]');
        var regionFilter = bar.querySelector('[data-region-filter]');
        var typeFilter = bar.querySelector('[data-type-filter]');
        var params = new URLSearchParams(window.location.search);
        var queryValue = params.get('q');

        if (queryValue && searchInput) {
            searchInput.value = queryValue;
        }

        function textValue(element) {
            return element ? element.value.trim().toLowerCase() : '';
        }

        function applyFilter() {
            var keyword = textValue(searchInput);
            var year = textValue(yearFilter);
            var region = textValue(regionFilter);
            var type = textValue(typeFilter);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-year'),
                    card.textContent
                ].join(' ').toLowerCase();
                var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var matchesYear = !year || card.getAttribute('data-year') === year;
                var matchesRegion = !region || (card.getAttribute('data-region') || '').toLowerCase().indexOf(region) !== -1;
                var matchesType = !type || (card.getAttribute('data-type') || '').toLowerCase().indexOf(type) !== -1;
                var isVisible = matchesKeyword && matchesYear && matchesRegion && matchesType;

                card.classList.toggle('is-hidden', !isVisible);

                if (isVisible) {
                    visible += 1;
                }
            });

            if (countText) {
                countText.textContent = '当前显示 ' + visible + ' 部影片';
            }
        }

        [searchInput, yearFilter, regionFilter, typeFilter].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });

        applyFilter();
    });
})();
