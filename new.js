document.addEventListener('DOMContentLoaded', function () {
    // چک می‌کند که آیا تم قبلاً ذخیره شده است یا خیر
    const savedTheme = localStorage.getItem('theme') || 'retro';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // تغییر وضعیت چک‌باکس بر اساس تم ذخیره شده
    const themeController = document.getElementById('theme-controller');
    themeController.checked = savedTheme === 'forest';

    // اضافه کردن رویداد به چک‌باکس
    themeController.addEventListener('change', function () {
        const newTheme = themeController.checked ? 'forest' : 'retro';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

});


document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const movieList = document.getElementById('movie-list');
    const allCards = movieList.querySelectorAll('.card');

    const categoryMap = {
        '/movies': 'movies',
        '/series': 'series',
        '/anime': 'anime',
        '/irani': 'irani',
    };

    const selectedCategory = categoryMap[currentPath];

    if (selectedCategory) {
        allCards.forEach(card => {
            if (card.dataset.category !== selectedCategory) {
                card.style.display = 'none';
            } else {
                card.style.display = 'block';
            }
        });
    } else {
        allCards.forEach(card => {
            card.style.display = 'block'; // نمایش همه کارت‌ها در صفحه اصلی یا صفحات دیگر
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const filterSelect = document.getElementById("filter-select");

    // فعال کردن دکمه جستجو با وارد کردن متن
    searchInput.addEventListener("input", function () {
        searchButton.disabled = searchInput.value.trim() === "";
    });

    // تابع برای جستجو و فیلتر کردن محتوا
    searchButton.addEventListener("click", function () {
        const query = searchInput.value.toLowerCase();
        const selectedCategory = filterSelect.value;

        // فیلتر کردن کارت‌ها بر اساس جستجو و دسته‌بندی انتخابی
        document.querySelectorAll("#movie-list a").forEach(card => {
            const category = card.getAttribute("data-category");
            const title = card.querySelector("h4").textContent.toLowerCase();

            // شرط نمایش کارت‌ها
            const matchCategory = selectedCategory === "all" || category === selectedCategory;
            const matchTitle = title.includes(query);

            // نمایش یا مخفی کردن کارت بر اساس شرط
            card.style.display = matchCategory && matchTitle ? "block" : "none";
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const latestCheckbox = document.querySelector('input[aria-label="Latest"]');
    const topRatingCheckbox = document.querySelector('input[aria-label="Top Rating"]');
    const siteRatingCheckbox = document.querySelector('input[aria-label="Site Rating"]');
    const sortSelect = document.querySelector('.select-warning');
    const movieList = document.getElementById('movie-list');

    function disableOtherCheckboxes(selectedCheckbox) {
        [latestCheckbox, topRatingCheckbox, siteRatingCheckbox].forEach(checkbox => {
            checkbox !== selectedCheckbox ? checkbox.checked = false : null;
        });
    }

    latestCheckbox.addEventListener('change', () => {
        if (latestCheckbox.checked) {
            disableOtherCheckboxes(latestCheckbox);
            sortCards('data-update', 'desc'); // به صورت نزولی مرتب می‌کند
        }
    });

    topRatingCheckbox.addEventListener('change', () => {
        if (topRatingCheckbox.checked) {
            disableOtherCheckboxes(topRatingCheckbox);
            sortCards('data-rating', 'desc');
        }
    });

    siteRatingCheckbox.addEventListener('change', () => {
        if (siteRatingCheckbox.checked) {
            disableOtherCheckboxes(siteRatingCheckbox);
            sortCards('data-site-rating', 'desc');
        }
    });

    function sortCards(dataAttribute, order = 'desc') {
        const sortedCards = Array.from(movieList.children)
            .sort((a, b) => {
                const aValue = parseFloat(a.getAttribute(dataAttribute)) || 0;
                const bValue = parseFloat(b.getAttribute(dataAttribute)) || 0;
                return order === 'asc' ? aValue - bValue : bValue - aValue;
            });

        movieList.innerHTML = '';
        sortedCards.forEach(card => movieList.appendChild(card));
    }

    sortSelect.addEventListener('change', () => {
        const sortOrder = sortSelect.value;
        const order = sortOrder === 'newest-top' ? 'desc' : 'asc';

        if (latestCheckbox.checked) {
            sortCards('data-update', order);
        } else if (topRatingCheckbox.checked) {
            sortCards('data-rating', order);
        } else if (siteRatingCheckbox.checked) {
            sortCards('data-site-rating', order);
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const movieList = document.getElementById("movie-list");
    const allCards = Array.from(movieList.querySelectorAll(".card"));
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const filterSelect = document.getElementById("filter-select");
    const sortSelect = document.getElementById("sort-select"); // افزودن گزینه مرتب‌سازی
    const cardsPerPage = 2; // تعداد کارت‌ها در هر صفحه
    let currentPage = 1;
    let filteredCards = allCards; // کارت‌های فیلتر شده بر اساس دسته‌بندی و جستجو

    // تشخیص دسته‌بندی بر اساس URL
    const currentPath = window.location.pathname;
    const categoryMap = {
        '/movies': 'movies',
        '/series': 'series',
        '/anime': 'anime',
        '/irani': 'irani',
    };
    const selectedCategory = categoryMap[currentPath];

    // اعمال دسته‌بندی اولیه بر اساس URL
    if (selectedCategory) {
        filteredCards = allCards.filter(card => card.dataset.category === selectedCategory);
    }

    // تابع مرتب‌سازی کارت‌ها
    function sortCards() {
        const sortOption = sortSelect.value; // دریافت گزینه مرتب‌سازی انتخاب‌شده
        filteredCards.sort((a, b) => {
            if (sortOption === "latest") {
                return new Date(b.dataset.release) - new Date(a.dataset.release); // جدیدترین
            } else if (sortOption === "oldest") {
                return new Date(a.dataset.release) - new Date(b.dataset.release); // قدیمی‌ترین
            } else if (sortOption === "topRating") {
                return b.dataset.rating - a.dataset.rating; // بالاترین امتیاز
            } else if (sortOption === "lowestRating") {
                return a.dataset.rating - b.dataset.rating; // پایین‌ترین امتیاز
            }
            return 0;
        });
    }

    // تابع نمایش کارت‌های یک صفحه خاص
    function showPage(page) {
        const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
        if (page < 1 || page > totalPages) return;

        currentPage = page;

        // مخفی کردن همه کارت‌ها و نمایش کارت‌های صفحه فعلی
        allCards.forEach(card => (card.style.display = "none"));
        const start = (currentPage - 1) * cardsPerPage;
        const end = start + cardsPerPage;
        filteredCards.slice(start, end).forEach(card => {
            card.style.display = "block";
        });

        updatePaginationNumbers(totalPages);
    }

    // تابع به‌روزرسانی دکمه‌های صفحه‌بندی
    function updatePaginationNumbers(totalPages) {
        const paginationNumbers = document.getElementById("paginationNumbers");
        paginationNumbers.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.className = "page-number";
            pageButton.textContent = i;
            pageButton.onclick = () => showPage(i);

            if (i === currentPage) {
                pageButton.classList.add("active");
            }

            paginationNumbers.appendChild(pageButton);
        }
    }

    // رویداد برای دکمه‌های Prev و Next
    document.getElementById("prevPage").onclick = () => showPage(currentPage - 1);
    document.getElementById("nextPage").onclick = () => showPage(currentPage + 1);

    // تابع جستجو و فیلتر کردن کارت‌ها
    function searchAndFilter() {
        const query = searchInput.value.toLowerCase();
        const selectedCategory = filterSelect.value;

        filteredCards = allCards.filter(card => {
            const category = card.dataset.category;
            const title = card.querySelector("h4").textContent.toLowerCase();
            const matchCategory = selectedCategory === "all" || category === selectedCategory;
            const matchTitle = title.includes(query);

            return matchCategory && matchTitle;
        });

        // مرتب‌سازی بر اساس گزینه انتخاب شده
        sortCards();

        // نمایش صفحه اول نتایج جستجو
        currentPage = 1;
        showPage(currentPage);
    }

    // فعال کردن جستجو با کلیک بر روی دکمه
    searchButton.addEventListener("click", searchAndFilter);

    // افزودن رویداد برای گزینه مرتب‌سازی
    sortSelect.addEventListener("change", () => {
        sortCards();
        currentPage = 1; // تنظیم به صفحه اول پس از مرتب‌سازی
        showPage(currentPage);
    });

    // نمایش تمام کارت‌های دسته‌بندی شده در صفحه اول هنگام بارگذاری اولیه
    showPage(currentPage);
});

