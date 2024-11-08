document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const filterSelect = document.getElementById("filter-select");
    const latestCheckbox = document.querySelector('input[aria-label="Latest"]');
    const topRatingCheckbox = document.querySelector('input[aria-label="Top Rating"]');
    const siteRatingCheckbox = document.querySelector('input[aria-label="Site Rating"]');
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

    function handleCheckboxChange(selectedCheckbox) {
        [latestCheckbox, topRatingCheckbox, siteRatingCheckbox].forEach(checkbox => {
            if (checkbox !== selectedCheckbox) {
                checkbox.checked = false;
            }
        });

        if (!selectedCheckbox.checked) {
            filteredCards = allCards; // در صورت عدم انتخاب، همه کارت‌ها نمایش داده شوند
        }
        showPage(1);
    }

    searchInput.addEventListener("input", () => searchButton.disabled = !searchInput.value.trim());
    searchButton.addEventListener("click", applySearchAndFilter);
    filterSelect.addEventListener("change", applySearchAndFilter);

    latestCheckbox.addEventListener('change', () => handleCheckboxChange(latestCheckbox));
    topRatingCheckbox.addEventListener('change', () => handleCheckboxChange(topRatingCheckbox));
    siteRatingCheckbox.addEventListener('change', () => handleCheckboxChange(siteRatingCheckbox));

    document.getElementById("prevPage").onclick = () => showPage(currentPage - 1);
    document.getElementById("nextPage").onclick = () => showPage(currentPage + 1);

    initializeCategory();
    showPage(currentPage);
});
