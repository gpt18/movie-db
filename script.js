// OMDb API configuration
const API_KEY = '6c446938'; // Public OMDb API key for demonstration
const API_URL = 'https://www.omdbapi.com/';

// Demo mode with sample data for testing
const DEMO_MODE = false; // Set to true to use sample data without API calls

const DEMO_DATA = {
    'tt0111161': {
        Title: 'The Shawshank Redemption',
        Year: '1994',
        Rated: 'R',
        Runtime: '142 min',
        Genre: 'Drama',
        Director: 'Frank Darabont',
        Writer: 'Stephen King, Frank Darabont',
        Actors: 'Tim Robbins, Morgan Freeman, Bob Gunton',
        Plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency. Andy Dufresne is sent to Shawshank Prison for the murder of his wife and secret lover. He is very isolated and lonely at first, but realizes there is something deep inside your body that people can\'t touch or get to...HOPE. Andy becomes friends with prison \'fixer\' Red, and Andy epitomizes why it is crucial to have dreams. His spirit and determination lead us into a world full of imagination, one filled with courage and desire.',
        Language: 'English',
        Country: 'United States',
        Awards: 'Nominated for 7 Oscars. 21 wins & 42 nominations total',
        Poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
        Metascore: '82',
        imdbRating: '9.3',
        imdbID: 'tt0111161',
        BoxOffice: '$28,767,189',
        Response: 'True'
    },
    'tt0068646': {
        Title: 'The Godfather',
        Year: '1972',
        Rated: 'R',
        Runtime: '175 min',
        Genre: 'Crime, Drama',
        Director: 'Francis Ford Coppola',
        Writer: 'Mario Puzo, Francis Ford Coppola',
        Actors: 'Marlon Brando, Al Pacino, James Caan',
        Plot: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son. Don Vito Corleone is the head of a New York Mafia \'family.\' Problems arise when a gangster supported by another Mafia family, Sollozzo, announces his intentions to start selling drugs all over New York. The story details the Corleone family and the many trials and tribulations they face as they fight for power against the other families.',
        Language: 'English, Italian, Latin',
        Country: 'United States',
        Awards: 'Won 3 Oscars. 31 wins & 30 nominations total',
        Poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
        Metascore: '100',
        imdbRating: '9.2',
        imdbID: 'tt0068646',
        BoxOffice: '$136,381,073',
        Response: 'True'
    }
};

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
        let data;
        
        if (DEMO_MODE) {
            // Use demo data
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            data = DEMO_DATA[imdbId];
            if (!data) {
                throw new Error('Movie not found in demo data. Try tt0111161 or tt0068646');
            }
        } else {
            // Fetch from API
            const response = await fetch(`${API_URL}?i=${imdbId}&apikey=${API_KEY}&plot=full`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            data = await response.json();

            if (data.Response === 'False') {
                throw new Error(data.Error || 'Movie not found');
            }
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
