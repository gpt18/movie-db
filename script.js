// OMDb API configuration
const API_KEY = '6c446938'; // Public OMDb API key for demonstration
const API_URL = 'https://www.omdbapi.com/';

// DOM elements
const imdbInput = document.getElementById('imdbInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const movieData = document.getElementById('movieData');

// Event listeners
searchBtn.addEventListener('click', handleSearch);
imdbInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Handle search action
async function handleSearch() {
    const imdbId = imdbInput.value.trim();
    
    if (!imdbId) {
        showError('Please enter an IMDb ID');
        return;
    }

    // Validate IMDb ID format (should start with 'tt' followed by numbers)
    const imdbPattern = /^tt\d+$/;
    if (!imdbPattern.test(imdbId)) {
        showError('Invalid IMDb ID format. Example: tt0111161');
        return;
    }

    await fetchMovieData(imdbId);
}

// Fetch movie data from API
async function fetchMovieData(imdbId) {
    showLoading();
    hideError();
    hideMovieData();

    try {
        const response = await fetch(`${API_URL}?i=${imdbId}&apikey=${API_KEY}&plot=full`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.Response === 'False') {
            throw new Error(data.Error || 'Movie not found');
        }

        displayMovieData(data);
        hideLoading();
    } catch (err) {
        hideLoading();
        showError(err.message || 'Failed to fetch movie data. Please try again.');
    }
}

// Display movie data
function displayMovieData(movie) {
    // Set poster
    const poster = document.getElementById('moviePoster');
    if (movie.Poster && movie.Poster !== 'N/A') {
        poster.src = movie.Poster;
        poster.alt = `${movie.Title} Poster`;
    } else {
        poster.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><rect fill="%23141414" width="300" height="450"/><text x="50%" y="50%" text-anchor="middle" fill="%23666" font-size="20" font-family="Arial">No Poster Available</text></svg>';
        poster.alt = 'No Poster Available';
    }

    // Set logo (if available from the API)
    const logoContainer = document.querySelector('.movie-logo-container');
    const logo = document.getElementById('movieLogo');
    if (movie.Logo && movie.Logo !== 'N/A') {
        logo.src = movie.Logo;
        logo.alt = `${movie.Title} Logo`;
        logoContainer.style.display = 'block';
    } else {
        logoContainer.style.display = 'none';
    }

    // Set title and basic info
    document.getElementById('movieTitle').textContent = movie.Title;
    document.getElementById('movieYear').textContent = movie.Year;
    document.getElementById('movieRated').textContent = movie.Rated !== 'N/A' ? movie.Rated : 'Not Rated';
    document.getElementById('movieRuntime').textContent = movie.Runtime !== 'N/A' ? movie.Runtime : 'N/A';

    // Set genres
    const genreContainer = document.getElementById('movieGenre');
    if (movie.Genre && movie.Genre !== 'N/A') {
        const genres = movie.Genre.split(', ');
        genreContainer.innerHTML = genres.map(genre => 
            `<span class="genre-tag">${genre}</span>`
        ).join('');
    } else {
        genreContainer.innerHTML = '<span class="genre-tag">N/A</span>';
    }

    // Set ratings
    const imdbRating = document.getElementById('imdbRating');
    if (movie.imdbRating && movie.imdbRating !== 'N/A') {
        imdbRating.textContent = `${movie.imdbRating}/10`;
    } else {
        imdbRating.textContent = 'N/A';
    }

    const metascore = document.getElementById('metascore');
    if (movie.Metascore && movie.Metascore !== 'N/A') {
        metascore.textContent = `${movie.Metascore}/100`;
    } else {
        metascore.textContent = 'N/A';
    }

    // Set plot/synopsis
    document.getElementById('moviePlot').textContent = movie.Plot !== 'N/A' ? movie.Plot : 'No synopsis available.';

    // Set director
    document.getElementById('movieDirector').textContent = movie.Director !== 'N/A' ? movie.Director : 'N/A';

    // Set cast
    document.getElementById('movieActors').textContent = movie.Actors !== 'N/A' ? movie.Actors : 'N/A';

    // Set writers
    document.getElementById('movieWriter').textContent = movie.Writer !== 'N/A' ? movie.Writer : 'N/A';

    // Set additional info
    document.getElementById('movieLanguage').textContent = movie.Language !== 'N/A' ? movie.Language : 'N/A';
    document.getElementById('movieCountry').textContent = movie.Country !== 'N/A' ? movie.Country : 'N/A';
    document.getElementById('movieAwards').textContent = movie.Awards !== 'N/A' ? movie.Awards : 'N/A';
    document.getElementById('movieBoxOffice').textContent = movie.BoxOffice !== 'N/A' ? movie.BoxOffice : 'N/A';

    showMovieData();
}

// Show/hide functions
function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    const errorMessage = error.querySelector('.error-message');
    errorMessage.textContent = message;
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
}

function showMovieData() {
    movieData.classList.remove('hidden');
}

function hideMovieData() {
    movieData.classList.add('hidden');
}

// Load a default movie on page load for demonstration
window.addEventListener('DOMContentLoaded', () => {
    // Optional: Load a popular movie by default
    // Uncomment the following lines to load The Shawshank Redemption on page load
    // imdbInput.value = 'tt0111161';
    // handleSearch();
});
