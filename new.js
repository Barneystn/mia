document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const filterSelect = document.getElementById("filter-select");
    const latestCheckbox = document.querySelector('input[aria-label="Latest"]');
    const topRatingCheckbox = document.querySelector('input[aria-label="Top Rating"]');
    const siteRatingCheckbox = document.querySelector('input[aria-label="Site Rating"]');
    const sortSelect = document.querySelector('.select-warning');
    const movieList = document.getElementById("movie-list");
    const paginationNumbers = document.getElementById("paginationNumbers");
    const allCards = Array.from(movieList.querySelectorAll(".card"));
    const cardsPerPage = 2;
    let currentPage = 1;
    let filteredCards = allCards;

    const categoryMap = {
        '/movies': 'movies',
        '/series': 'series',
        '/anime': 'anime',
        '/irani': 'irani',
    };

    function initializeCategory() {
        const selectedCategory = categoryMap[window.location.pathname];
        if (selectedCategory) {
            filteredCards = allCards.filter(card => card.dataset.category === selectedCategory);
        }
    }

    function showPage(page) {
        const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
        if (page < 1 || page > totalPages) return;

        currentPage = page;
        allCards.forEach(card => (card.style.display = "none"));
        filteredCards.slice((page - 1) * cardsPerPage, page * cardsPerPage).forEach(card => {
            card.style.display = "block";
        });
        updatePaginationNumbers(totalPages);
    }

    function updatePaginationNumbers(totalPages) {
        paginationNumbers.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.className = "page-number";
            pageButton.textContent = i;
            pageButton.classList.toggle("active", i === currentPage);
            pageButton.onclick = () => showPage(i);
            paginationNumbers.appendChild(pageButton);
        }
    }

    function sortCards(attribute, order = 'desc') {
        const sortedCards = [...movieList.children].sort((a, b) => {
            const aValue = parseFloat(a.getAttribute(attribute)) || 0;
            const bValue = parseFloat(b.getAttribute(attribute)) || 0;
            return order === 'asc' ? aValue - bValue : bValue - aValue;
        });
        movieList.innerHTML = '';
        sortedCards.forEach(card => movieList.appendChild(card));
    }

    function applySearchAndFilter() {
        const query = searchInput.value.toLowerCase();
        const selectedCategory = filterSelect.value;

        filteredCards = allCards.filter(card => {
            const category = card.dataset.category;
            const title = card.querySelector("h4").textContent.toLowerCase();
            return (selectedCategory === "all" || category === selectedCategory) && title.includes(query);
        });
        showPage(1);
    }

    function handleCheckboxChange(selectedCheckbox, attribute) {
        [latestCheckbox, topRatingCheckbox, siteRatingCheckbox].forEach(checkbox => checkbox !== selectedCheckbox && (checkbox.checked = false));
        if (selectedCheckbox.checked) sortCards(attribute, sortSelect.value === 'newest-top' ? 'desc' : 'asc');
    }

    searchInput.addEventListener("input", () => searchButton.disabled = !searchInput.value.trim());
    searchButton.addEventListener("click", applySearchAndFilter);
    filterSelect.addEventListener("change", applySearchAndFilter);

    latestCheckbox.addEventListener('change', () => handleCheckboxChange(latestCheckbox, 'data-update'));
    topRatingCheckbox.addEventListener('change', () => handleCheckboxChange(topRatingCheckbox, 'data-rating'));
    siteRatingCheckbox.addEventListener('change', () => handleCheckboxChange(siteRatingCheckbox, 'data-site-rating'));

    sortSelect.addEventListener("change", () => {
        const attribute = latestCheckbox.checked ? 'data-update' : topRatingCheckbox.checked ? 'data-rating' : 'data-site-rating';
        sortCards(attribute, sortSelect.value === 'newest-top' ? 'desc' : 'asc');
    });

    document.getElementById("prevPage").onclick = () => showPage(currentPage - 1);
    document.getElementById("nextPage").onclick = () => showPage(currentPage + 1);

    initializeCategory();
    showPage(currentPage);
});
