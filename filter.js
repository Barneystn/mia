function filterMovies() {
    const searchTerm = document.querySelector('#search-input').value.toLowerCase();
    const selectedFilter = document.querySelector('#filter-select').value.toLowerCase();
    const movies = document.querySelectorAll('#movie-list .card');
    let matchedMovies = [];

    document.getElementById('movie-list').classList.add('hidden');
    document.getElementById('skeletonsx').classList.remove('hidden');

    setTimeout(function() {
        movies.forEach(movie => {
            const title = movie.querySelector('h4').textContent.toLowerCase();
            let category = '';
            if (movie.href.includes('movies')) category = 'movies';
            else if (movie.href.includes('series')) category = 'series';
            else if (movie.href.includes('anime')) category = 'anime';
            else if (movie.href.includes('irani')) category = 'irani';

            const matchesFilter = (selectedFilter === 'all') || (selectedFilter === category);
            const matchesSearch = title.includes(searchTerm);

            if (matchesFilter && matchesSearch) {
                matchedMovies.push(movie);
                movie.style.display = 'block';
            } else {
                movie.style.display = 'none';
            }
        });

        document.getElementById('skeletonsx').classList.add('hidden');
        document.getElementById('movie-list').classList.remove('hidden');
        showPage(1, matchedMovies);
    }, 1000);
}
