document.addEventListener('DOMContentLoaded', () => {
    const movieList = document.getElementById('movie-list');
    const allCards = movieList.querySelectorAll('.card');
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-select');
    const searchButton = document.getElementById('search-button');
    const paginationNumbers = document.getElementById('paginationNumbers');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const sortButtons = document.querySelectorAll('.btn-42');

    let filteredCards = Array.from(allCards);
    let currentPage = 1;
    const itemsPerPage = 2;

    const currentPath = window.location.pathname;
    const categoryMap = {
        '/movies': 'movies',
        '/series': 'series',
        '/anime': 'anime',
        '/irani': 'irani',
    };

    const selectedCategory = categoryMap[currentPath];

    if (selectedCategory) {
        filteredCards = Array.from(allCards).filter(card => card.dataset.category === selectedCategory);
    }

    function filterMovies() {
        const searchText = searchInput.value.toLowerCase();
        const selectedCategory = filterSelect.value;

        filteredCards = Array.from(allCards).filter(card => {
            const title = card.querySelector('h4').innerText.toLowerCase();
            const category = card.dataset.category;

            return (selectedCategory === 'all' || category === selectedCategory) && title.includes(searchText);
        });

        currentPage = 1;
        renderPage();
    }

    function sortCards(attribute) {
        filteredCards.sort((a, b) => {
            const aValue = parseFloat(a.dataset[attribute]) || 0;
            const bValue = parseFloat(b.dataset[attribute]) || 0;
            return bValue - aValue;
        });
        currentPage = 1;
        renderPage();
    }

    sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sortType = button.innerText.trim().toLowerCase();
            if (sortType === 'latest') {
                sortCards('update');
            } else if (sortType === 'top rated') {
                sortCards('rating');
            } else if (sortType === 'site rated') {
                sortCards('siteRating');
            }
        });
    });

    function renderPage() {
        allCards.forEach(card => card.style.display = 'none');

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        filteredCards.slice(start, end).forEach(card => {
            card.style.display = 'block';
        });

        updatePagination();
    }

    function updatePagination() {
        paginationNumbers.innerHTML = '';
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            pageButton.className = 'btn btn-xs mx-1';
            pageButton.onclick = () => {
                currentPage = i;
                renderPage();
            };

            if (i === currentPage) {
                pageButton.classList.add('btn-primary');
            }

            paginationNumbers.appendChild(pageButton);
        }

        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
        }
    });

    nextPageButton.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPage();
        }
    });

    searchButton.addEventListener('click', filterMovies);
    filterSelect.addEventListener('change', filterMovies);
    searchInput.addEventListener('input', () => {
        searchButton.disabled = searchInput.value.trim() === '';
    });

    renderPage();
});
