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
        if (!attribute) return; // اگر هیچ ویژگی‌ای مشخص نشده باشد

        filteredCards = [...filteredCards].sort((a, b) => {
            const aValue = parseFloat(a.getAttribute(attribute)) || 0;
            const bValue = parseFloat(b.getAttribute(attribute)) || 0;
            return order === 'asc' ? aValue - bValue : bValue - aValue;
        });
        showPage(1);
    }

    function applyFilters() {
        const query = searchInput.value.toLowerCase();
        const selectedCategory = filterSelect.value;

        filteredCards = allCards.filter(card => {
            const category = card.dataset.category;
            const title = card.querySelector("h4").textContent.toLowerCase();
            return (selectedCategory === "all" || category === selectedCategory) && title.includes(query);
        });

        applySort();
    }

    function applySort() {
        let attribute = '';
        if (latestCheckbox.checked) attribute = 'data-update';
        else if (topRatingCheckbox.checked) attribute = 'data-rating';
        else if (siteRatingCheckbox.checked) attribute = 'data-site-rating';

        const sortOrder = sortSelect.value === 'newest-top' ? 'desc' : 'asc';
        sortCards(attribute, sortOrder);
    }

    function handleCheckboxChange(selectedCheckbox) {
        [latestCheckbox, topRatingCheckbox, siteRatingCheckbox].forEach(checkbox => {
            if (checkbox !== selectedCheckbox) checkbox.checked = false;
        });
        applySort();
    }

    searchInput.addEventListener("input", () => searchButton.disabled = !searchInput.value.trim());
    searchButton.addEventListener("click", applyFilters);
    filterSelect.addEventListener("change", applyFilters);

    latestCheckbox.addEventListener('change', () => handleCheckboxChange(latestCheckbox));
    topRatingCheckbox.addEventListener('change', () => handleCheckboxChange(topRatingCheckbox));
    siteRatingCheckbox.addEventListener('change', () => handleCheckboxChange(siteRatingCheckbox));

    sortSelect.addEventListener("change", applySort);

    document.getElementById("prevPage").onclick = () => showPage(currentPage - 1);
    document.getElementById("nextPage").onclick = () => showPage(currentPage + 1);

    // ابتدا تمام کارت‌ها را فیلتر کرده و صفحه اول را نمایش بدهید
    applyFilters();
});
