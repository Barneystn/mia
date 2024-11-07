document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#search-input');
    const searchButton = document.querySelector('#search-button');

    function toggleSearchButton() {
        searchButton.disabled = !searchInput.value.trim();
    }

    searchInput.addEventListener('input', function() {
        toggleSearchButton();
    });
    
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            filterMovies();
        }
    });

    searchButton.addEventListener('click', function() {
        filterMovies();
    });

    toggleSearchButton();
});
