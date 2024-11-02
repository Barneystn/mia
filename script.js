window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        document.body.style.display = 'block';

        const skeletons = document.getElementById('skeletons');
        skeletons.style.display = 'none';

        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.display = 'block';
        });

        const params = new URLSearchParams(window.location.search);
        const pageParam = params.get('page');
        currentPage = pageParam ? parseInt(pageParam) : 1; 
        
        showPage(currentPage);
    } else {
        window.location.href = '../login.html';
    }
};

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


// رویدادها
document.querySelector('#search-input').addEventListener('input', filterMovies);
document.querySelector('#search-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        filterMovies();
    }
});
