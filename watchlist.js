const storedWatchlist = localStorage.getItem("watchlistArray");
const watchlistArray = storedWatchlist ? JSON.parse(storedWatchlist) : [];

const placeholderHtml = `
            <div class="no-data-container">
                <h1 class="no-data-initial">Your watchlist is looking a little empty</h1>
                <a class="no-data-search-link" href="index.html"> <i class="fa-solid fa-circle-plus"></i> Lets add some movies </a>
            </div>
            `

function setWatchlistHtml() {
    let storedDataArray = localStorage.getItem("watchlistArray") ? 
                          JSON.parse(localStorage.getItem("watchlistArray")) : []
    if(storedDataArray.length) {
            let html = " "
            for(let movies of storedDataArray){
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
                            <a class="card-watchlist" data-minus="${movies.imdbID}"><i class="fa-solid fa-circle-minus"></i>  Remove</a>
                        </div>
                        <h4 class="movie-plot">${movies.Plot}</h4>
                    </div>
                </div>`
            }
            document.getElementById("movie-container").innerHTML = html
    }
    else if (!storedDataArray.length) {
        document.getElementById("movie-container").innerHTML = placeholderHtml 
    }
       
}

setWatchlistHtml()

document.addEventListener("click", function(e){  
    if(e.target.dataset.minus) {
        handleDeleteButton(e.target.dataset.minus)   
    }
})

function handleDeleteButton(btnId) {
    let watchlistArray = JSON.parse(localStorage.getItem("watchlistArray"))
    for(movie of watchlistArray) { 
        if(btnId == movie.imdbID) {
            let movieIndex = watchlistArray.indexOf(movie)
            watchlistArray.splice(movieIndex,1)
            localStorage.setItem("watchlistArray", JSON.stringify(watchlistArray))
            setWatchlistHtml()
        }
    }   
}