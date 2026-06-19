(function() {
  var nav = document.querySelector('.site-nav');
  var toggle = document.querySelector('.menu-toggle');

  if (toggle && nav) {
    toggle.addEventListener('click', function() {
      nav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var prev = hero.querySelector('.hero-prev');
    var next = hero.querySelector('.hero-next');
    var current = 0;

    function showSlide(index) {
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      current = index;
    }

    function step(offset) {
      if (!slides.length) {
        return;
      }
      var target = (current + offset + slides.length) % slides.length;
      showSlide(target);
    }

    if (prev) {
      prev.addEventListener('click', function() {
        step(-1);
      });
    }

    if (next) {
      next.addEventListener('click', function() {
        step(1);
      });
    }

    if (slides.length > 1) {
      window.setInterval(function() {
        step(1);
      }, 6000);
    }
  }

  function createResult(movie) {
    var link = document.createElement('a');
    link.className = 'link-card';
    link.href = movie.url;
    link.innerHTML = [
      '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<span>',
      '<strong>' + escapeHtml(movie.title) + '</strong>',
      '<em>' + movie.year + ' · ' + escapeHtml(movie.region) + '</em>',
      '</span>'
    ].join('');
    return link;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function(match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[match];
    });
  }

  var searchForm = document.querySelector('[data-search-form]');
  var searchResults = document.querySelector('[data-search-results]');

  if (searchForm && searchResults && window.SEARCH_MOVIES) {
    searchForm.addEventListener('submit', function(event) {
      event.preventDefault();
      var formData = new FormData(searchForm);
      var keyword = String(formData.get('q') || '').trim().toLowerCase();
      var type = String(formData.get('type') || '').trim();
      var results = window.SEARCH_MOVIES.filter(function(movie) {
        var text = [
          movie.title,
          movie.year,
          movie.region,
          movie.type,
          movie.genre,
          movie.tags.join(' '),
          movie.oneLine
        ].join(' ').toLowerCase();
        var typeMatched = !type || String(movie.type).indexOf(type) !== -1;
        var keywordMatched = !keyword || text.indexOf(keyword) !== -1;
        return typeMatched && keywordMatched;
      }).slice(0, 24);

      searchResults.innerHTML = '';
      if (!results.length) {
        var empty = document.createElement('p');
        empty.textContent = '未找到匹配内容';
        searchResults.appendChild(empty);
        return;
      }
      results.forEach(function(movie) {
        searchResults.appendChild(createResult(movie));
      });
    });
  }

  var localFilter = document.querySelector('[data-local-filter]');
  var cardList = document.querySelector('[data-card-list]');

  if (localFilter && cardList) {
    var cards = Array.prototype.slice.call(cardList.querySelectorAll('.movie-card'));
    localFilter.addEventListener('input', function() {
      var keyword = localFilter.value.trim().toLowerCase();
      cards.forEach(function(card) {
        var text = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-genre') || '',
          card.textContent || ''
        ].join(' ').toLowerCase();
        card.classList.toggle('is-hidden', keyword && text.indexOf(keyword) === -1);
      });
    });
  }
})();
