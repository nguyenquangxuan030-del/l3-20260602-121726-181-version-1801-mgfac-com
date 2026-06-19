(function () {
    var shell = document.querySelector('[data-player-shell]');
    var video = shell ? shell.querySelector('video') : null;
    var startButton = shell ? shell.querySelector('[data-player-start]') : null;

    if (!shell || !video || !startButton) {
        return;
    }

    var source = video.getAttribute('data-src');
    var initialized = false;

    function playNative() {
        video.src = source;
        video.play();
        shell.classList.add('is-playing');
    }

    function playWithHls(Hls) {
        var hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true
        });

        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
            shell.classList.add('is-playing');
        });
        hls.on(Hls.Events.ERROR, function (_, data) {
            if (data && data.fatal) {
                startButton.textContent = '播放异常，请稍后重试';
                shell.classList.remove('is-playing');
            }
        });
    }

    function initializePlayer() {
        if (initialized) {
            video.play();
            shell.classList.add('is-playing');
            return;
        }

        initialized = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            playNative();
            return;
        }

        import('./hls-vendor-dru42stk.js')
            .then(function (module) {
                var Hls = module.H;

                if (Hls && Hls.isSupported()) {
                    playWithHls(Hls);
                } else {
                    playNative();
                }
            })
            .catch(function () {
                startButton.textContent = '播放器加载失败，请刷新后重试';
            });
    }

    startButton.addEventListener('click', initializePlayer);
    video.addEventListener('play', function () {
        shell.classList.add('is-playing');
    });
})();
