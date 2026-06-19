(function () {
    var input = document.getElementById('globalSearchInput');
    var button = document.getElementById('globalSearchButton');
    var results = document.getElementById('globalSearchResults');
    var count = document.getElementById('globalSearchCount');
    var data = window.MOVIE_SEARCH_INDEX || [];

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function render(items) {
        results.innerHTML = items.map(function (item) {
            var tags = (item.tags || []).slice(0, 3).map(function (tag) {
                return '<span>' + escapeHtml(tag) + '</span>';
            }).join('');

            return [
                '<article class="movie-card">',
                '    <a href="' + escapeHtml(item.url) + '" class="poster-link">',
                '        <img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
                '        <span class="poster-shade"></span>',
                '        <span class="poster-play">播放</span>',
                '    </a>',
                '    <div class="movie-card-body">',
                '        <h3><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h3>',
                '        <p class="movie-meta">' + escapeHtml(item.year) + ' · ' + escapeHtml(item.region) + ' · ' + escapeHtml(item.type) + '</p>',
                '        <p class="movie-desc">' + escapeHtml(item.oneLine) + '</p>',
                '        <div class="tag-row">' + tags + '</div>',
                '    </div>',
                '</article>'
            ].join('\n');
        }).join('\n');
    }

    function search() {
        var keyword = input.value.trim().toLowerCase();
        var matched;

        if (!keyword) {
            matched = data.slice(0, 24);
            count.textContent = '默认显示 24 部推荐影片';
        } else {
            matched = data.filter(function (item) {
                var haystack = [
                    item.title,
                    item.year,
                    item.region,
                    item.type,
                    item.genre,
                    item.category,
                    (item.tags || []).join(' '),
                    item.oneLine
                ].join(' ').toLowerCase();

                return haystack.indexOf(keyword) !== -1;
            }).slice(0, 120);
            count.textContent = '找到 ' + matched.length + ' 部匹配影片，最多显示 120 部';
        }

        render(matched);
    }

    if (input && button && results && count) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q') || '';
        input.value = q;
        button.addEventListener('click', search);
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                search();
            }
        });
        input.addEventListener('input', function () {
            if (!input.value.trim()) {
                search();
            }
        });
        search();
    }
})();
