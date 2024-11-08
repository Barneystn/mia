document.addEventListener('DOMContentLoaded', () => {
    const movieList = document.getElementById('movie-list');
    const allCards = movieList.querySelectorAll('.card');
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-select');
    const searchButton = document.getElementById('search-button');
    const paginationNumbers = document.getElementById('paginationNumbers');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');

    const latestCheckbox = document.querySelector('[aria-label="Latest"]');
    const topRatingCheckbox = document.querySelector('[aria-label="Top Rating"]');
    const siteRatingCheckbox = document.querySelector('[aria-label="Site Rating"]');

    let filteredCards = Array.from(allCards);
    let currentPage = 1;
    const itemsPerPage = 5;

    const currentPath = window.location.pathname;
    const categoryMap = {
        '/movies': 'movies',
        '/series': 'series',
        '/anime': 'anime',
        '/irani': 'irani',
    };

    const selectedCategory = categoryMap[currentPath];

    // فیلتر دسته‌بندی بر اساس URL
    if (selectedCategory) {
        filteredCards = Array.from(allCards).filter(card => card.dataset.category === selectedCategory);
    } else {
        filteredCards = Array.from(allCards); // اگر هیچ فیلتر دسته‌بندی اعمال نشد، همه کارت‌ها را نشان بده
    }

    // فیلتر کردن بر اساس جستجو و دسته‌بندی
    function filterMovies() {
        const searchText = searchInput.value.toLowerCase();
        const selectedCategory = filterSelect.value;

        filteredCards = Array.from(allCards).filter(card => {
            const title = card.querySelector('h4').innerText.toLowerCase();
            const category = card.dataset.category;

            return (selectedCategory === 'all' || category === selectedCategory) && title.includes(searchText);
        });

        currentPage = 1; // بازگشت به صفحه اول بعد از هر فیلتر
        renderPage();
    }

    // مرتب کردن کارت‌ها بر اساس چک‌باکس‌ها
    function sortCards() {
        if (latestCheckbox.checked) {
            // مرتب‌سازی بر اساس تاریخ آخرین بروزرسانی (از جدیدترین به قدیمی‌ترین)
            filteredCards.sort((a, b) => new Date(b.dataset.update) - new Date(a.dataset.update));
        } else if (topRatingCheckbox.checked) {
            // مرتب‌سازی بر اساس رتبه‌بندی (از بیشترین به کمترین)
            filteredCards.sort((a, b) => parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating));
        } else if (siteRatingCheckbox.checked) {
            // مرتب‌سازی بر اساس رتبه‌بندی سایت (از بیشترین به کمترین)
            filteredCards.sort((a, b) => parseFloat(b.dataset.siteRating) - parseFloat(a.dataset.siteRating));
        }

        renderPage();
    }

    // نمایش کارت‌ها بر اساس صفحه فعلی
    function renderPage() {
        allCards.forEach(card => card.style.display = 'none');

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        filteredCards.slice(start, end).forEach(card => {
            card.style.display = 'block';
        });

        updatePagination();
    }

    // به‌روزرسانی شماره‌های صفحه‌بندی
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

        // فعال یا غیرفعال کردن دکمه‌ها
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }

    // دکمه "Prev" برای رفتن به صفحه قبلی
    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
        }
    });

    // دکمه "Next" برای رفتن به صفحه بعدی
    nextPageButton.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPage();
        }
    });

    // اتصال به دکمه جستجو و فیلتر
    searchButton.addEventListener('click', filterMovies);
    filterSelect.addEventListener('change', filterMovies);
    searchInput.addEventListener('input', () => {
        searchButton.disabled = searchInput.value.trim() === '';
    });

    // غیرفعال کردن چک‌باکس‌های دیگر
    latestCheckbox.addEventListener('change', () => {
        if (latestCheckbox.checked) {
            topRatingCheckbox.disabled = true;
            siteRatingCheckbox.disabled = true;
        } else {
            topRatingCheckbox.disabled = false;
            siteRatingCheckbox.disabled = false;
        }
        sortCards();
    });

    topRatingCheckbox.addEventListener('change', () => {
        if (topRatingCheckbox.checked) {
            latestCheckbox.disabled = true;
            siteRatingCheckbox.disabled = true;
        } else {
            latestCheckbox.disabled = false;
            siteRatingCheckbox.disabled = false;
        }
        sortCards();
    });

    siteRatingCheckbox.addEventListener('change', () => {
        if (siteRatingCheckbox.checked) {
            latestCheckbox.disabled = true;
            topRatingCheckbox.disabled = true;
        } else {
            latestCheckbox.disabled = false;
            topRatingCheckbox.disabled = false;
        }
        sortCards();
    });

    // نمایش اولیه
    renderPage();
});
