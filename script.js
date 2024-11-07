let currentPage = 1;
const cardsPerPage = 5;

window.onload = function() {
    document.body.style.display = 'block';

    const skeletons = document.getElementById('skeletons');
    skeletons.style.display = 'none';

    const params = new URLSearchParams(window.location.search);
    currentPage = params.get('page') ? parseInt(params.get('page')) : 1;

    applyFilters();
    showPage(currentPage);
};

function applyFilters() {
    const currentPath = window.location.pathname;
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const href = card.getAttribute("href");
        if ((currentPath.includes("/movies") && !href.includes("movies")) ||
            (currentPath.includes("/series") && !href.includes("series")) ||
            (currentPath.includes("/anime") && !href.includes("anime")) ||
            (currentPath.includes("/irani") && !href.includes("irani"))) {
            card.style.display = "none";
        } else {
            card.style.display = "block";
        }
    });
}

function showPage(page) {
    const cards = Array.from(document.querySelectorAll('.card:not([style*="display: none"])'));
    const totalPages = Math.ceil(cards.length / cardsPerPage);

    cards.forEach((card, index) => {
        card.style.display = (index >= (page - 1) * cardsPerPage && index < page * cardsPerPage) ? 'block' : 'none';
    });

    currentPage = page;
    renderPagination(totalPages);

    window.history.pushState({ page: page }, '', `?page=${page}`);
}

function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('paginationNumbers');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('span');
        pageLink.innerText = i;
        pageLink.classList.add('page-number', i === currentPage ? 'active-page' : '');
        pageLink.onclick = () => showPage(i);
        paginationContainer.appendChild(pageLink);
    }

    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;

    prevPageButton.onclick = () => {
        if (currentPage > 1) showPage(currentPage - 1);
    };

    nextPageButton.onclick = () => {
        if (currentPage < totalPages) showPage(currentPage + 1);
    };
}

function filterMovies() {
    const searchTerm = document.querySelector('#search-input').value.toLowerCase();
    const selectedFilter = document.querySelector('#filter-select').value.toLowerCase();
    const movies = Array.from(document.querySelectorAll('.card'));

    const filteredMovies = movies.filter(movie => {
        const title = movie.querySelector('h4').textContent.toLowerCase();
        const href = movie.getAttribute('href');
        const matchesCategory = selectedFilter === 'all' || href.includes(selectedFilter);
        const matchesSearch = title.includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    filteredMovies.forEach(movie => movie.style.display = 'block');
    showPage(1);
}

document.querySelector('#search-input').addEventListener('input', filterMovies);
document.querySelector('#search-button').addEventListener('click', filterMovies);
