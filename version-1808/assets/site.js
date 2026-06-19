(() => {
    const header = document.querySelector('[data-header]');
    const toggle = document.querySelector('[data-mobile-toggle]');
    const panel = document.querySelector('[data-mobile-panel]');

    const syncHeader = () => {
        if (!header) {
            return;
        }
        header.classList.toggle('is-scrolled', window.scrollY > 20);
    };

    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });

    if (toggle && panel && header) {
        toggle.addEventListener('click', () => {
            panel.classList.toggle('is-open');
            header.classList.toggle('is-open', panel.classList.contains('is-open'));
        });
    }

    const hero = document.querySelector('[data-hero]');
    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const next = hero.querySelector('[data-hero-next]');
        const prev = hero.querySelector('[data-hero-prev]');
        let current = 0;
        let timer = null;

        const show = (index) => {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
            dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
        };

        const start = () => {
            clearInterval(timer);
            timer = setInterval(() => show(current + 1), 5000);
        };

        next?.addEventListener('click', () => {
            show(current + 1);
            start();
        });

        prev?.addEventListener('click', () => {
            show(current - 1);
            start();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                show(index);
                start();
            });
        });

        start();
    }

    const queryParams = new URLSearchParams(window.location.search);
    const initialQuery = queryParams.get('q') || '';

    document.querySelectorAll('[data-filter-bar]').forEach((bar) => {
        const input = bar.querySelector('[data-filter-input]');
        const tokenButtons = Array.from(bar.querySelectorAll('[data-filter-token]'));
        const list = bar.parentElement?.querySelector('[data-filter-list]');
        const cards = list ? Array.from(list.querySelectorAll('[data-movie-card]')) : [];
        let activeToken = '';

        if (input && initialQuery) {
            input.value = initialQuery;
        }

        const apply = () => {
            const keyword = (input?.value || '').trim().toLowerCase();
            cards.forEach((card) => {
                const text = (card.getAttribute('data-search') || '').toLowerCase();
                const filter = (card.getAttribute('data-filter') || '').toLowerCase();
                const token = activeToken.toLowerCase();
                const matchKeyword = !keyword || text.includes(keyword);
                const matchToken = !token || text.includes(token) || filter.includes(token);
                card.classList.toggle('is-hidden', !(matchKeyword && matchToken));
            });
        };

        input?.addEventListener('input', apply);

        tokenButtons.forEach((button) => {
            button.addEventListener('click', () => {
                activeToken = button.getAttribute('data-filter-token') || '';
                tokenButtons.forEach((item) => item.classList.toggle('is-active', item === button));
                apply();
            });
        });

        apply();
    });

    const video = document.querySelector('[data-player-video]');
    const overlay = document.querySelector('[data-player-cover]');
    const currentVideo = globalThis.currentVideo;

    if (video && currentVideo) {
        let attached = false;
        let hls = null;

        const attachStream = () => {
            if (attached) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = currentVideo;
            } else if (globalThis.Hls && globalThis.Hls.isSupported()) {
                hls = new globalThis.Hls({ enableWorker: true });
                hls.loadSource(currentVideo);
                hls.attachMedia(video);
            } else {
                video.src = currentVideo;
            }
            video.controls = true;
            attached = true;
        };

        const startPlayback = () => {
            attachStream();
            overlay?.classList.add('is-hidden');
            const promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(() => {
                    overlay?.classList.remove('is-hidden');
                });
            }
        };

        overlay?.addEventListener('click', startPlayback);
        video.addEventListener('click', () => {
            if (video.paused) {
                startPlayback();
            }
        });

        window.addEventListener('pagehide', () => {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }
})();
