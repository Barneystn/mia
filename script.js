let currentPage = 1;  // صفحه جاری
const cardsPerPage = 5;  // تعداد کارت‌ها در هر صفحه

window.onload = function () {
    // نمایش محتوای صفحه
    document.body.style.display = 'block';
    const skeletons = document.getElementById('skeletons');
    skeletons.style.display = 'none';

    const params = new URLSearchParams(window.location.search);
    currentPage = params.get('page') ? parseInt(params.get('page')) : 1; // صفحه از URL گرفته می‌شود
    applyFilters();
    showPage(currentPage);  // صفحه مورد نظر را نمایش می‌دهیم
};

function applyFilters() {
    // فیلتر کردن کارت‌ها بر اساس مسیر
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
    const cards = Array.from(document.querySelectorAll('.card'));
    const totalPages = Math.ceil(cards.length / cardsPerPage);  // تعداد کل صفحات

    // جلوگیری از رفتن به صفحه‌های نامعتبر
    if (page < 1 || page > totalPages) return;

    // مخفی کردن همه کارت‌ها
    cards.forEach(card => card.style.display = 'none');

    // محاسبه و نمایش کارت‌ها برای صفحه انتخابی
    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;

    for (let i = start; i < end && i < cards.length; i++) {
        cards[i].style.display = 'block';
    }

    currentPage = page;  // به‌روزرسانی صفحه جاری
    renderPagination(totalPages);  // به‌روزرسانی دکمه‌های صفحه‌بندی

    // به‌روزرسانی URL برای ذخیره صفحه
    window.history.pushState({ page: page }, '', `?page=${page}`);
}

function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('paginationNumbers');
    paginationContainer.innerHTML = '';  // پاک کردن شماره‌های صفحه قبلی

    // ایجاد شماره‌های صفحه
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('span');
        pageLink.innerText = i;
        pageLink.classList.add('page-number');
        if (i === currentPage) pageLink.classList.add('active-page');
        pageLink.onclick = () => showPage(i);
        paginationContainer.appendChild(pageLink);
    }

    // مدیریت دکمه‌های قبلی و بعدی
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;

    prevPageButton.onclick = () => showPage(currentPage - 1);
    nextPageButton.onclick = () => showPage(currentPage + 1);
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

    // مخفی کردن کارت‌ها و نمایش اسکلت‌ها
    filteredMovies.forEach(movie => movie.style.display = 'block');
    showPage(1);  // نمایش نتایج فیلتر شده از صفحه اول
}

document.querySelector('#search-input').addEventListener('input', filterMovies);
document.querySelector('#search-button').addEventListener('click', filterMovies);
