(function () {
    var video = document.querySelector('[data-player]');
    var playButton = document.querySelector('[data-play-button]');

    if (!video || !playButton) {
        return;
    }

    var source = video.getAttribute('data-source');
    var ready = false;
    var hlsInstance = null;

    function attachSource() {
        if (ready || !source) {
            return;
        }

        ready = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            return;
        }

        video.src = source;
    }

    function startPlayback() {
        attachSource();
        var result = video.play();

        if (result && typeof result.then === 'function') {
            result.then(function () {
                playButton.classList.add('is-hidden');
            }).catch(function () {
                playButton.classList.remove('is-hidden');
            });
        } else {
            playButton.classList.add('is-hidden');
        }
    }

    playButton.addEventListener('click', function () {
        startPlayback();
    });

    video.addEventListener('play', function () {
        playButton.classList.add('is-hidden');
    });

    video.addEventListener('pause', function () {
        if (video.currentTime === 0 || video.ended) {
            playButton.classList.remove('is-hidden');
        }
    });

    video.addEventListener('ended', function () {
        playButton.classList.remove('is-hidden');
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
})();
