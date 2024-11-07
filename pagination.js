let currentPage = 1;
const cardsPerPage = 2;

function showPage(page, filteredMovies = null) {
    const movieList = filteredMovies || Array.from(document.querySelectorAll('#movie-list .card'));
    const displayedCards = Math.min(movieList.length, cardsPerPage);
    const totalPages = Math.ceil(movieList.length / cardsPerPage);

    document.getElementById('movie-list').scrollIntoView({ behavior: 'smooth', block: 'start' });
    movieList.forEach(card => card.style.display = 'none');

    const start = (page - 1) * cardsPerPage;
    const end = start + displayedCards;
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
    const finalPages = [];
    for (let i = 0; i < uniquePageNumbers.length; i++) {
        finalPages.push(uniquePageNumbers[i]);
        if (i < uniquePageNumbers.length - 1 && uniquePageNumbers[i + 1] - uniquePageNumbers[i] > 1) {
            finalPages.push('...');
        }
    }

    finalPages.forEach(page => {
        const pageLink = document.createElement('span');
        pageLink.innerText = page === '...' ? '...' : page;
        pageLink.classList.add('page-number');
        if (page === currentPage) pageLink.classList.add('active-page');
        if (page !== '...') pageLink.onclick = () => changePage(page);
        paginationContainer.appendChild(pageLink);
    });

    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;

    prevPageButton.onclick = () => { if (currentPage > 1) changePage(currentPage - 1); };
    nextPageButton.onclick = () => { if (currentPage < totalPages) changePage(currentPage + 1); };
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
