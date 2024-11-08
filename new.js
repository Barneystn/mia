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

    // تابع برای غیر فعال کردن بقیه چک‌باکس‌ها
    function disableOtherCheckboxes(selectedCheckbox) {
        [latestCheckbox, topRatingCheckbox, siteRatingCheckbox].forEach(checkbox => {
            checkbox !== selectedCheckbox ? checkbox.checked = false : null;
        });
    }

    // رویدادها برای چک‌باکس‌ها
    latestCheckbox.addEventListener('change', () => {
        if (latestCheckbox.checked) {
            disableOtherCheckboxes(latestCheckbox);
            sortCards('data-update');
        }
    });

    topRatingCheckbox.addEventListener('change', () => {
        if (topRatingCheckbox.checked) {
            disableOtherCheckboxes(topRatingCheckbox);
            sortCards('data-rating');
        }
    });

    siteRatingCheckbox.addEventListener('change', () => {
        if (siteRatingCheckbox.checked) {
            disableOtherCheckboxes(siteRatingCheckbox);
            sortCards('data-site-rating');
        }
    });

    // تابع برای سورت کارت‌ها بر اساس مقدار داده‌شده
    function sortCards(dataAttribute) {
        const sortedCards = Array.from(movieList.children)
            .sort((a, b) => parseFloat(b.getAttribute(dataAttribute)) - parseFloat(a.getAttribute(dataAttribute)));

        movieList.innerHTML = ''; // پاک کردن محتوای قبلی
        sortedCards.forEach(card => movieList.appendChild(card)); // اضافه کردن کارت‌های سورت‌شده
    }

    // رویداد برای انتخاب سورت
    sortSelect.addEventListener('change', () => {
        const sortOrder = sortSelect.value;

        if (latestCheckbox.checked) {
            sortCards(sortOrder === 'newest-top' ? 'data-update' : 'data-update', sortOrder);
        } else if (topRatingCheckbox.checked) {
            sortCards(sortOrder === 'newest-top' ? 'data-rating' : 'data-rating', sortOrder);
        } else if (siteRatingCheckbox.checked) {
            sortCards(sortOrder === 'newest-top' ? 'data-site-rating' : 'data-site-rating', sortOrder);
        }
    });
});
