let currentPage = 1;
const cardsPerPage = 2;

let sortOrder = {
    latest: true,
    'top-rated': true,
    'site-rated': true
};

// تنظیم کوکی
function setCookie(name, value, hours) {
    let expires = "";
    if (hours) {
        const date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// خواندن کوکی
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// حذف کوکی
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

window.onload = function() {
    const isLoggedIn = getCookie('isLoggedIn');
    if (isLoggedIn === 'true') {
        document.body.style.display = 'block';

        const skeletons = document.getElementById('skeletons');
        skeletons.style.display = 'none';

        const cards = document.querySelectorAll('.card');

        // فیلتر کردن کارت‌ها بر اساس URL و data-category
        const currentPath = window.location.pathname;
        cards.forEach(card => {
            const category = card.getAttribute("data-category");
            if (currentPath.includes("/movies") && category !== "movies") {
                card.style.display = "none";
            } else if (currentPath.includes("/series") && category !== "series") {
                card.style.display = "none";
            } else if (currentPath.includes("/anime") && category !== "anime") {
                card.style.display = "none";
            } else if (currentPath.includes("/irani") && category !== "irani") {
                card.style.display = "none";
            } else {
                card.style.display = "block"; // نمایش کارت‌های مرتبط
            }
        });

        const params = new URLSearchParams(window.location.search);
        const pageParam = params.get('page');
        currentPage = pageParam ? parseInt(pageParam) : 1;

        showPage(currentPage);

    } else {
        window.location.href = '../login.html';
    }
};


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
    const searchInput = document.querySelector('#search-input');
    const searchButton = document.querySelector('#search-button');

    // تابعی برای فعال یا غیرفعال کردن دکمه جستجو
    function toggleSearchButton() {
        searchButton.disabled = !searchInput.value.trim();
    }

    // رویدادها
    searchInput.addEventListener('input', function() {
        toggleSearchButton(); // وضعیت دکمه را با توجه به ورودی تغییر دهید
    });
    
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            filterMovies();
        }
    });

    searchButton.addEventListener('click', function() {
        filterMovies();
    });

    // غیرفعال کردن دکمه جستجو در ابتدا
    toggleSearchButton();
});

function showPage(page, filteredMovies = null) {
    const movieList = filteredMovies || Array.from(document.querySelectorAll('#movie-list .card'));
    const totalPages = Math.ceil(movieList.length / cardsPerPage);

    // اسکرول به بالای فهرست کارت‌ها
    document.getElementById('movie-list').scrollIntoView({ behavior: 'smooth', block: 'start' });

    movieList.forEach(card => card.style.display = 'none');

    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    for (let i = start; i < end && i < movieList.length; i++) {
        movieList[i].style.display = 'block';
    }

    currentPage = page; 
    renderPagination(totalPages);

    window.history.pushState({ page: page }, '', `?page=${page}`);

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('paginationNumbers');
    paginationContainer.innerHTML = '';

    const pageNumbers = [];
    if (currentPage > 1) pageNumbers.push(currentPage - 1);
    pageNumbers.push(currentPage);
    if (currentPage < totalPages) pageNumbers.push(currentPage + 1);
    
    if (currentPage > 2) {
        pageNumbers.unshift(1);
    }

    if (currentPage < totalPages - 1) {
        pageNumbers.push(totalPages);
    }

    const uniquePageNumbers = [...new Set(pageNumbers)];
    const finalPages = [];

    for (let i = 0; i < uniquePageNumbers.length; i++) {
        finalPages.push(uniquePageNumbers[i]);

        if (i < uniquePageNumbers.length - 1 && uniquePageNumbers[i + 1] - uniquePageNumbers[i] > 1) {
            finalPages.push('...');
        }
    }

    finalPages.forEach(page => {
        if (page === '...') {
            const dots = document.createElement('span');
            dots.innerText = '...';
            paginationContainer.appendChild(dots);
        } else {
            const pageLink = document.createElement('span');
            pageLink.innerText = page;
            pageLink.classList.add('page-number');
            if (page === currentPage) pageLink.classList.add('active-page');

            pageLink.onclick = () => changePage(page);
            paginationContainer.appendChild(pageLink);
        }
    });

    // اضافه کردن رویداد برای دکمه‌های قبلی و بعدی
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;

    prevPageButton.onclick = () => {
        if (currentPage > 1) {
            changePage(currentPage - 1);
        }
    };

    nextPageButton.onclick = () => {
        if (currentPage < totalPages) {
            changePage(currentPage + 1);
        }
    };
}

function changePage(page) {
    const skeletons = document.getElementById('skeletons');
    const movieList = document.getElementById('movie-list');

    // کارت‌ها را مخفی می‌کند
    movieList.style.display = 'none';
    skeletons.style.display = 'flex';

    setTimeout(() => {
        skeletons.style.display = 'none'; // اسکلت‌ها را مخفی می‌کند
        movieList.style.display = 'grid'; // کارت‌ها را نمایش می‌دهد
        showPage(page);
    }, 1000); // یک ثانیه تاخیر قبل از نمایش کارت‌ها
}


function filterMovies() {
    const searchTerm = document.querySelector('#search-input').value.toLowerCase();
    const selectedFilter = document.querySelector('#filter-select').value.toLowerCase();
    const movies = document.querySelectorAll('#movie-list .card');

    let matchedMovies = [];

    // پنهان کردن کارت‌ها و نشان دادن اسکلت‌ها
    document.getElementById('movie-list').classList.add('hidden');
    document.getElementById('skeletonsx').classList.remove('hidden');

    // تأخیر یک ثانیه‌ای برای نشان دادن اسکلت‌ها
    setTimeout(function() {
        movies.forEach(movie => {
            const title = movie.querySelector('h4').textContent.toLowerCase();
            
            let category = '';
            if (movie.href.includes('movies')) {
                category = 'movies';
            } else if (movie.href.includes('series')) {
                category = 'series';
            } else if (movie.href.includes('anime')) {
                category = 'anime';
            } else if (movie.href.includes('irani')) {
                category = 'irani';
            }

            const matchesFilter = (selectedFilter === 'all') || (selectedFilter === category);
            const matchesSearch = title.includes(searchTerm);

            if (matchesFilter && matchesSearch) {
                matchedMovies.push(movie);
                movie.style.display = 'block';
            } else {
                movie.style.display = 'none';
            }
        });

        // پنهان کردن اسکلت‌ها و نشان دادن کارت‌ها
        document.getElementById('skeletonsx').classList.add('hidden');
        document.getElementById('movie-list').classList.remove('hidden');

        // به صفحه اول برگردید و نتایج فیلتر شده را نمایش دهید
        showPage(1, matchedMovies);
    }, 1000); // یک ثانیه
}



function sortMovies(criteria) {
    const movieList = document.getElementById('movie-list');
    const movies = Array.from(movieList.children);

    movies.forEach(movie => movie.classList.add('fade-out'));

    setTimeout(() => {
        movies.sort((a, b) => {
            const aValue = criteria === 'latest' ? a.getAttribute('data-update') :
                            criteria === 'top-rated' ? a.getAttribute('data-rating') :
                            a.getAttribute('data-site-rating');

            const bValue = criteria === 'latest' ? b.getAttribute('data-update') :
                            criteria === 'top-rated' ? b.getAttribute('data-rating') :
                            b.getAttribute('data-site-rating');
        
        return sortOrder[criteria] ? bValue - aValue : aValue - bValue;
    });

    sortOrder[criteria] = !sortOrder[criteria];

    movieList.innerHTML = '';
        movies.forEach(movie => {
            movie.classList.remove('fade-out');
            movie.classList.add('fade-in');
            movieList.appendChild(movie);
        });

    showPage(currentPage);
    }, 500);
}

// رویدادها
document.querySelector('#search-input').addEventListener('input', filterMovies);
document.querySelector('#search-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        filterMovies();
    }
});
