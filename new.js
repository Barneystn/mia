document.addEventListener('DOMContentLoaded', () => {
    const latestCheckbox = document.getElementById('latest');
    const topRatingCheckbox = document.getElementById('topRating');
    const siteRatingCheckbox = document.getElementById('siteRating');
    const movieList = document.getElementById('movie-list');
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-select');
    const searchButton = document.getElementById('search-button');
    const paginationNumbers = document.getElementById('paginationNumbers');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    
    const allCards = movieList.querySelectorAll('.card');
    let filteredCards = Array.from(allCards);
    let currentPage = 1;
    const itemsPerPage = 5;

    // Event Listeners for Sorting Checkboxes
    latestCheckbox.addEventListener('change', () => sortMovies());
    topRatingCheckbox.addEventListener('change', () => sortMovies());
    siteRatingCheckbox.addEventListener('change', () => sortMovies());

    // Event Listeners for Search and Filter
    searchButton.addEventListener('click', filterMovies);
    filterSelect.addEventListener('change', filterMovies);
    searchInput.addEventListener('input', () => {
        searchButton.disabled = searchInput.value.trim() === '';
    });

    // Sort Movies Function
    function sortMovies() {
        const checkedCheckboxes = getCheckedCheckboxes();
        const movies = Array.from(movieList.querySelectorAll('.card'));

        if (checkedCheckboxes.length > 0) {
            const key = checkedCheckboxes[0]; // Only take the first checked checkbox
            movies.sort((a, b) => {
                const aValue = parseFloat(a.getAttribute(`data-${key}`));
                const bValue = parseFloat(b.getAttribute(`data-${key}`));
                return bValue - aValue; // Sort in descending order
            });
        }

        // Add sorted movies back to the list
        movies.forEach(movie => movieList.appendChild(movie));

        disableOtherCheckboxes(checkedCheckboxes);
    }

    function getCheckedCheckboxes() {
        const checked = [];
        if (latestCheckbox.checked) checked.push('update');
        if (topRatingCheckbox.checked) checked.push('rating');
        if (siteRatingCheckbox.checked) checked.push('site-rating');
        return checked;
    }

    function disableOtherCheckboxes(checkedCheckboxes) {
        [latestCheckbox, topRatingCheckbox, siteRatingCheckbox].forEach(checkbox => {
            checkbox.disabled = checkedCheckboxes.length > 0 && !checkedCheckboxes.includes(checkbox.id);
        });
    }

    // Filter Movies Based on Search and Category
    function filterMovies() {
        const searchText = searchInput.value.toLowerCase();
        const selectedCategory = filterSelect.value;

        filteredCards = Array.from(allCards).filter(card => {
            const title = card.querySelector('h4').innerText.toLowerCase();
            const category = card.dataset.category;

            return (selectedCategory === 'all' || category === selectedCategory) && title.includes(searchText);
        });

        currentPage = 1; // Reset to page 1 after filtering
        renderPage();
    }

    // Render the movies based on the current page
    function renderPage() {
        allCards.forEach(card => card.style.display = 'none');
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        filteredCards.slice(start, end).forEach(card => {
            card.style.display = 'block';
        });

        updatePagination();
    }

    // Update pagination buttons
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

        // Disable previous/next buttons if needed
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }

    // Prev page button
    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
        }
    });

    // Next page button
    nextPageButton.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPage();
        }
    });

    // Initial render
    renderPage();
});
