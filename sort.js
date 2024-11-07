let sortOrder = { latest: true, 'top-rated': true, 'site-rated': true };

function sortMovies(criteria) {
    const movieList = document.getElementById('movie-list');
    const movies = Array.from(movieList.children);

    movies.forEach(movie => movie.classList.add('fade-out'));

    setTimeout(() => {
        movies.sort((a, b) => {
            const aValue = criteria === 'latest' ? a.getAttribute('data-update') :
                            criteria === 'top-rated' ? a.getAttribute('data-rating') :
                            a.getAttribute('data-site-rating');

            const bValue = criteria === 'latest' ? b.getAttribute('data-update') :
                            criteria === 'top-rated' ? b.getAttribute('data-rating') :
                            b.getAttribute('data-site-rating');

            return sortOrder[criteria] ? bValue - aValue : aValue - bValue;
        });

        sortOrder[criteria] = !sortOrder[criteria];

        movieList.innerHTML = '';
        movies.forEach(movie => {
            movie.classList.remove('fade-out');
            movie.classList.add('fade-in');
            movieList.appendChild(movie);
        });

        showPage(currentPage);
    }, 500);
}
