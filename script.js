let currentPage = 1;
const cardsPerPage = 1;

let sortOrder = {
    latest: true,
    'top-rated': true,
    'site-rated': true
};

window.onload = function() {
    document.body.style.display = 'block';
    document.getElementById('skeletons').style.display = 'none';

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.display = 'block';
    });

    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    currentPage = pageParam ? parseInt(pageParam) : 1;

    showPage(currentPage);

    const currentPath = window.location.pathname;
    cards.forEach(card => {
        const href = card.getAttribute("href");
        if (currentPath.includes("/movies") && !href.includes("movies")) {
            card.style.display = "none";
        } else if (currentPath.includes("/series") && !href.includes("series")) {
            card.style.display = "none";
        } else if (currentPath.includes("/anime") && !href.includes("anime")) {
            card.style.display = "none";
        } else if (currentPath.includes("/irani") && !href.includes("irani")) {
            card.style.display = "none";
        }
    });
};

function showPage(page, filteredMovies = null) {
    const movieList = filteredMovies || Array.from(document.querySelectorAll('#movie-list .card'));
    const totalPages = Math.ceil(movieList.length / cardsPerPage);

    document.getElementById('movie-list').scrollIntoView({ behavior: 'smooth', block: 'start' });

    movieList.forEach(card => card.style.display = 'none');

    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    for (let i = start; i < end && i < movieList.length; i++) {
        movieList[i].style.display = 'block';
    }

    currentPage = page; 
    renderPagination(totalPages);
    window.history.pushState({ page: page }, '', `?page=${page}`);
}

function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('paginationNumbers');
    paginationContainer.innerHTML = '';

    const pageNumbers = [];
    if (currentPage > 1) pageNumbers.push(currentPage - 1);
    pageNumbers.push(currentPage);
    if (currentPage < totalPages) pageNumbers.push(currentPage + 1);
    
    if (currentPage > 2) pageNumbers.unshift(1);
    if (currentPage < totalPages - 1) pageNumbers.push(totalPages);

    const uniquePageNumbers = [...new Set(pageNumbers)];
    uniquePageNumbers.forEach(page => {
        const pageLink = document.createElement('span');
        pageLink.innerText = page === '...' ? '...' : page;
        pageLink.classList.add('page-number');
        if (page === currentPage) pageLink.classList.add('active-page');
        pageLink.onclick = () => changePage(page);
        paginationContainer.appendChild(pageLink);
    });

    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
}

function changePage(page) {
    const skeletons = document.getElementById('skeletons');
    const movieList = document.getElementById('movie-list');

    movieList.style.display = 'none';
    skeletons.style.display = 'flex';

    setTimeout(() => {
        skeletons.style.display = 'none';
        movieList.style.display = 'grid';
        showPage(page);
    }, 1000);
}

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
