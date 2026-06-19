(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');

    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, current) {
        slide.classList.toggle('is-active', current === index);
      });

      dots.forEach(function (dot, current) {
        dot.classList.toggle('is-active', current === index);
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    start();
  }

  function setupSearch() {
    var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));

    forms.forEach(function (form) {
      var input = form.querySelector('[data-search-input]');
      var category = form.querySelector('[data-filter-category]');
      var year = form.querySelector('[data-filter-year]');
      var list = document.querySelector('[data-card-list]');
      var cards = list ? Array.prototype.slice.call(list.querySelectorAll('[data-card]')) : [];

      function apply() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var categoryValue = category ? category.value.trim() : '';
        var yearValue = year ? year.value.trim() : '';

        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-year'),
            card.getAttribute('data-type'),
            card.getAttribute('data-category')
          ].join(' ').toLowerCase();
          var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchCategory = !categoryValue || haystack.indexOf(categoryValue.toLowerCase()) !== -1;
          var cardYear = card.getAttribute('data-year') || '';
          var cardYearNumber = Number((cardYear.match(/\d{4}/) || ['0'])[0]);
          var matchYear = true;

          if (yearValue === '2010') {
            matchYear = cardYearNumber >= 2010 && cardYearNumber < 2020;
          } else if (yearValue === '2000') {
            matchYear = cardYearNumber > 0 && cardYearNumber < 2010;
          } else if (yearValue) {
            matchYear = cardYear.indexOf(yearValue) !== -1;
          }

          card.classList.toggle('is-hidden', !(matchKeyword && matchCategory && matchYear));
        });
      }

      if (input) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');

        if (q && window.location.pathname.indexOf('search.html') !== -1) {
          input.value = q;
        }

        input.addEventListener('input', apply);
      }

      if (category) {
        category.addEventListener('change', apply);
      }

      if (year) {
        year.addEventListener('change', apply);
      }

      if (cards.length) {
        form.addEventListener('submit', function (event) {
          event.preventDefault();
          apply();
        });
        apply();
      }
    });
  }

  function setupPlayer() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (player) {
      var video = player.querySelector('video');
      var button = player.querySelector('[data-play-button]');

      if (!video) {
        return;
      }

      var source = video.getAttribute('data-video-source');

      function attachSource() {
        if (!source || video.getAttribute('data-source-ready') === 'true') {
          return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            lowLatencyMode: true,
            enableWorker: true
          });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }

        video.setAttribute('data-source-ready', 'true');
      }

      attachSource();

      if (button) {
        button.addEventListener('click', function () {
          attachSource();
          player.classList.add('is-playing');
          var promise = video.play();

          if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {
              player.classList.remove('is-playing');
            });
          }
        });
      }

      video.addEventListener('play', function () {
        player.classList.add('is-playing');
      });

      video.addEventListener('pause', function () {
        player.classList.remove('is-playing');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupHero();
    setupSearch();
    setupPlayer();
  });
})();
