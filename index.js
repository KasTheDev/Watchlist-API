const searchInput = document.getElementById('movie-search')
const searchBtn = document.getElementById('search-btn')
const errorContainer = document.getElementById('error-container')
let imdbIDArray = []
let watchlistArray = []
let movieData
let addToWatchlistArray = localStorage.getItem("watchlistArray") ? 
                          JSON.parse(localStorage.getItem("watchlistArray")) : []


function performSearch() {
  const searchInputValue = searchInput.value
  getImdb(searchInputValue)
    .then(getMovieData)
    .then((data)=>{      
        movieData = data 
        renderMovies(movieData)
        })
    document.getElementById('movie-search').value = ""
}

searchBtn.addEventListener('click', performSearch)

searchInput.addEventListener('keypress', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault()
    performSearch()
    errorContainer.innerHTML = ""
  }
})

async function getImdb(searchInput) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${searchInput}&apikey=1a8947bd`);
        const data = await response.json();
        for (let i = 0; i < data.Search.length; i++) {
            imdbIDArray.push(data.Search[i].imdbID);
        }
    } catch (error) { 
            errorContainer.innerHTML =`
        <div class="no-data-container">
            <p class="not-found-message">Unable to find what you're looking for... Please try another search.</p>
        </div>`     

    }
}

async function getMovieData() {
  const movieDataPromises = imdbIDArray.map(async (imdbID) => {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=1a8947bd`)
    return response.json()
  })
  const movieData = await Promise.all(movieDataPromises)
  return movieData
}

function renderMovies(movieData){
    let html = ""
    for(let movies of movieData){
        html += `
        <div class="movie-card">
            <img class="movie-poster" src="${movies.Poster}">
            <div class="movie-info">
                <div class="movie-header">
                    <h2 class="movie-title">${movies.Title}</h2>
                    <h3 class="imdb-rating">⭐${movies.imdbRating}</h3>
                </div>
                <div class="movie-subheader">
                    <h3 class="movie-runtime">${movies.Runtime}</h3>
                    <h3 class="movie-genre">${movies.Genre}</h3>
                    <div class="card-watchlist">
                        <a class="card-watchlist" data-add="${movies.imdbID}"><i class="fa-solid fa-circle-plus" data-add="${movies.imdbID}"></i>  Watchlist</a>
                    </div>
                </div>
                <h4 class="movie-plot">${movies.Plot}</h4>
            </div>
        </div>`
    }
    document.getElementById("movie-container").innerHTML = html
    imdbIDArray=[]
}

document.addEventListener('click', function(e){
         if(e.target.dataset.add) {
            addToWatchlist(e.target.dataset.add)
            e.target.parentElement.innerHTML = `<i class="fa-sharp fa-solid fa-circle-check"></i>`
            addToLocalStorage(addToWatchlistArray)
         }
})

function addToWatchlist(imdbID) {
  const movieToAdd = movieData.find((movie) => movie.imdbID === imdbID)

  if (!addToWatchlistArray.some((movie) => movie.imdbID === imdbID)) {
    addToWatchlistArray.push(movieToAdd)
    localStorage.setItem("watchlistArray", JSON.stringify(addToWatchlistArray))
  } else {
    console.log("Already on your watchlist")
  }
  return addToWatchlistArray
}

function addToLocalStorage(array) {
    localStorage.setItem("watchlistArray", JSON.stringify(array))
}