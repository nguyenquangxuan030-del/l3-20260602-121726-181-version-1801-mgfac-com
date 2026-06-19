(() => {
  const panels = document.querySelectorAll("[data-player]");

  panels.forEach((panel) => {
    const video = panel.querySelector("video");
    const layer = panel.querySelector("[data-play-layer]");
    let hls = null;
    let ready = false;

    const connect = () => {
      if (!video || ready) {
        return;
      }

      const vod = video.getAttribute("data-vod");

      if (!vod) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(vod);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = vod;
      }

      ready = true;
    };

    const play = () => {
      connect();
      if (!video) {
        return;
      }
      const action = video.play();
      if (action && typeof action.catch === "function") {
        action.catch(() => {});
      }
      if (layer) {
        layer.classList.add("is-hidden");
      }
    };

    if (layer) {
      layer.addEventListener("click", play);
    }

    if (video) {
      video.addEventListener("click", () => {
        if (video.paused) {
          play();
        } else {
          video.pause();
        }
      });

      video.addEventListener("play", () => {
        if (layer) {
          layer.classList.add("is-hidden");
        }
      });

      video.addEventListener("pause", () => {
        if (layer && video.currentTime < 0.2) {
          layer.classList.remove("is-hidden");
        }
      });
    }

    window.addEventListener("pagehide", () => {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
