export function initMovieSite(options = {}) {
    setupMobileMenu();
    setupHeroSlider();
    setupFilters();
    setupPlayers(options.hlsModule);
}

function setupMobileMenu() {
    const button = document.querySelector('[data-menu-toggle]');
    const nav = document.querySelector('[data-main-nav]');

    if (!button || !nav) {
        return;
    }

    button.addEventListener('click', () => {
        nav.classList.toggle('is-open');
    });
}

function setupHeroSlider() {
    const slider = document.querySelector('[data-hero-slider]');

    if (!slider) {
        return;
    }

    const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(slider.querySelectorAll('[data-hero-dot]'));

    if (slides.length < 2) {
        return;
    }

    let activeIndex = 0;
    let timer = window.setInterval(showNext, 5200);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });

    slider.addEventListener('mouseenter', () => window.clearInterval(timer));
    slider.addEventListener('mouseleave', resetTimer);

    function showNext() {
        showSlide((activeIndex + 1) % slides.length);
    }

    function showSlide(index) {
        slides[activeIndex].classList.remove('active');
        dots[activeIndex]?.classList.remove('active');
        activeIndex = index;
        slides[activeIndex].classList.add('active');
        dots[activeIndex]?.classList.add('active');
    }

    function resetTimer() {
        window.clearInterval(timer);
        timer = window.setInterval(showNext, 5200);
    }
}

function setupFilters() {
    const scopes = document.querySelectorAll('[data-filter-scope]');

    scopes.forEach((scope) => {
        const keywordInput = scope.querySelector('[data-filter-keyword]');
        const categorySelect = scope.querySelector('[data-filter-category]');
        const yearSelect = scope.querySelector('[data-filter-year]');
        const regionSelect = scope.querySelector('[data-filter-region]');
        const countNode = scope.querySelector('[data-filter-count]');
        const section = scope.closest('section') || document;
        const cards = Array.from(section.querySelectorAll('[data-movie-card]'));
        const emptyState = section.querySelector('[data-empty-state]');

        const controls = [keywordInput, categorySelect, yearSelect, regionSelect].filter(Boolean);
        controls.forEach((control) => control.addEventListener('input', applyFilter));
        controls.forEach((control) => control.addEventListener('change', applyFilter));

        applyFilter();

        function applyFilter() {
            const keyword = normalize(keywordInput?.value || '');
            const category = normalize(categorySelect?.value || '');
            const year = normalize(yearSelect?.value || '');
            const region = normalize(regionSelect?.value || '');
            let visibleCount = 0;

            cards.forEach((card) => {
                const haystack = normalize([
                    card.dataset.title,
                    card.dataset.category,
                    card.dataset.year,
                    card.dataset.region,
                    card.dataset.genre,
                    card.dataset.tags
                ].join(' '));

                const matched = (!keyword || haystack.includes(keyword))
                    && (!category || normalize(card.dataset.category || '') === category)
                    && (!year || normalize(card.dataset.year || '') === year)
                    && (!region || normalize(card.dataset.region || '') === region);

                card.hidden = !matched;

                if (matched) {
                    visibleCount += 1;
                }
            });

            if (countNode) {
                countNode.textContent = `显示 ${visibleCount} 部影片`;
            }

            if (emptyState) {
                emptyState.hidden = visibleCount !== 0;
            }
        }
    });
}

function normalize(value) {
    return String(value || '').trim().toLowerCase();
}

function setupPlayers(hlsModuleUrl) {
    const players = document.querySelectorAll('[data-player]');

    players.forEach((player) => {
        const source = player.dataset.videoSrc;
        const video = player.querySelector('video');
        const trigger = player.querySelector('[data-play-trigger]');
        const status = player.querySelector('[data-player-status]');

        if (!source || !video || !trigger) {
            return;
        }

        trigger.addEventListener('click', async () => {
            trigger.disabled = true;
            setStatus(status, '正在加载播放源...');

            try {
                await attachHlsSource(video, source, hlsModuleUrl, player);
                trigger.hidden = true;
                await video.play();
                setStatus(status, '正在播放高清影片。');
            } catch (error) {
                trigger.disabled = false;
                setStatus(status, '播放源加载失败，请稍后重试或更换支持 HLS 的浏览器。');
                console.error(error);
            }
        });
    });
}

async function attachHlsSource(video, source, hlsModuleUrl, player) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
    }

    if (!hlsModuleUrl) {
        throw new Error('HLS module URL is missing.');
    }

    const module = await import(hlsModuleUrl);
    const Hls = module.H;

    if (!Hls || !Hls.isSupported()) {
        throw new Error('HLS is not supported in this browser.');
    }

    if (player.__hlsInstance) {
        player.__hlsInstance.destroy();
    }

    const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
    });

    player.__hlsInstance = hls;
    hls.loadSource(source);
    hls.attachMedia(video);

    await new Promise((resolve, reject) => {
        const timeout = window.setTimeout(() => reject(new Error('HLS loading timed out.')), 12000);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            window.clearTimeout(timeout);
            resolve();
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
            if (data?.fatal) {
                window.clearTimeout(timeout);
                reject(new Error(data.details || 'Fatal HLS error.'));
            }
        });
    });
}

function setStatus(status, text) {
    if (status) {
        status.textContent = text;
    }
}
