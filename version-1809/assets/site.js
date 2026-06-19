(function () {
    var navToggle = document.querySelector('[data-nav-toggle]');
    var mainNav = document.querySelector('[data-main-nav]');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            mainNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('.poster-shell img, .rank-cover img, .hero-poster img').forEach(function (image) {
        image.addEventListener('error', function () {
            var parent = image.closest('.poster-shell, .rank-cover, .hero-poster');
            if (parent) {
                parent.classList.add('no-image');
            }
            image.style.display = 'none';
        });
    });

    function initHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
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

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function initHeroSearch() {
        document.querySelectorAll('[data-site-search]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = form.querySelector('input[name="q"]');
                var value = input ? input.value.trim() : '';
                var prefix = form.getAttribute('data-prefix') || '';
                var target = prefix + 'search.html';
                if (value) {
                    target += '?q=' + encodeURIComponent(value);
                }
                window.location.href = target;
            });
        });
    }

    function initFilters() {
        var panel = document.querySelector('[data-filter-panel]');
        if (!panel) {
            return;
        }

        var keywordInput = panel.querySelector('[data-filter-keyword]');
        var categorySelect = panel.querySelector('[data-filter-category]');
        var yearSelect = panel.querySelector('[data-filter-year]');
        var typeSelect = panel.querySelector('[data-filter-type]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
        var countNode = document.querySelector('[data-result-count]');
        var emptyState = document.querySelector('[data-empty-state]');
        var params = new URLSearchParams(window.location.search);

        if (keywordInput && params.get('q')) {
            keywordInput.value = params.get('q');
        }

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilters() {
            var keyword = normalize(keywordInput && keywordInput.value);
            var category = categorySelect ? categorySelect.value : '';
            var year = yearSelect ? yearSelect.value : '';
            var type = typeSelect ? typeSelect.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize(card.textContent + ' ' + card.dataset.title + ' ' + card.dataset.genre + ' ' + card.dataset.region);
                var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
                var matchedCategory = !category || card.dataset.category === category;
                var matchedYear = !year || card.dataset.year === year;
                var matchedType = !type || card.dataset.type === type;
                var matched = matchedKeyword && matchedCategory && matchedYear && matchedType;

                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (countNode) {
                countNode.textContent = visible;
            }
            if (emptyState) {
                emptyState.classList.toggle('is-visible', visible === 0);
            }
        }

        [keywordInput, categorySelect, yearSelect, typeSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });

        applyFilters();
    }

    function initPlayers() {
        document.querySelectorAll('[data-player]').forEach(function (player) {
            var video = player.querySelector('video');
            var overlay = player.querySelector('[data-player-overlay]');
            var button = player.querySelector('[data-play-button]');
            var url = player.getAttribute('data-video-url');
            var started = false;

            function startVideo() {
                if (!video || !url) {
                    return;
                }

                if (!started) {
                    if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = url;
                    } else if (window.Hls && window.Hls.isSupported()) {
                        var hls = new window.Hls({
                            enableWorker: true,
                            lowLatencyMode: false
                        });
                        hls.loadSource(url);
                        hls.attachMedia(video);
                    } else {
                        video.src = url;
                    }
                    started = true;
                }

                if (overlay) {
                    overlay.classList.add('is-hidden');
                }

                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(function () {
                        if (overlay) {
                            overlay.classList.remove('is-hidden');
                        }
                    });
                }
            }

            if (button) {
                button.addEventListener('click', startVideo);
            }
            if (overlay) {
                overlay.addEventListener('click', startVideo);
            }
            if (video) {
                video.addEventListener('click', function () {
                    if (video.paused) {
                        startVideo();
                    } else {
                        video.pause();
                    }
                });
            }
        });
    }

    initHero();
    initHeroSearch();
    initFilters();
    initPlayers();
})();
