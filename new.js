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
