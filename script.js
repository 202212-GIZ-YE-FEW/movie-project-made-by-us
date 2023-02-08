'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};


// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const actorRes = await fetchActors(movie.id);
  const trailRes = await fetchTrail(movie.id);
  const relatedRes = await fetchRelated(movie.id);
  renderMovie(movieRes);
  renderSingleMovieActor(actorRes);
  renderTrails(trailRes);
  renderRelated(relatedRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// To fatch Realted Movies in Movie Detilas.
const fetchRelated = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/similar`);
  console.log(url)
  const res = await fetch(url);
  return res.json();
};

// To fatch Actors in Movie Detilas.
const fetchActors = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  console.log(url)
  const res = await fetch(url);
  return res.json();
};
// To fatch Trails in Movie Detilas.
const fetchTrail = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/videos`);
  console.log(url)
  const res = await fetch(url);
  return res.json();
};
// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title
      } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  console.log(movie)
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdrop_path
    }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title" class="movie-title">${movie.title}</h2>
            <p id="movie-release-date"> <b>Categories : </b>${movie.genres.map((ele) => { return  `<span>${ele.name}</span>` }).join(' ')}</p>
           
            <p id="movie-release-date"><b>Release Date : </b> <span>${movie.release_date}</span></p>
            <p id="movie-runtime"><b>Runtime : </b> <span>${movie.runtime} Minutes</span></p>
            <p id="movie-lang"> <b>Language : </b> <span>${movie.original_language}glish</span></p>
            <p id="directior-name"><b>Director name : </b> <span>${movie.director}</span></p>
            <p id="movie-votes"><b>Votes received : </b> <span>${movie.vote_count}</span></p>
            <p id="movie-rating"><b>Rating : </b> <span>${movie.vote_average}</span></p>
        </div>
        
        <div class="pl-3">
        <h3 class="mt-5 mb-3 movie-title production ">Production Companies:</h3>
        <div class="container-production">
           ${movie.production_companies.map((ele) => {
      return `<div class="production-companies"><img src=${ele.logo_path ? BACKDROP_BASE_URL + ele.logo_path : "https://via.placeholder.com/150" }><p>${ele.name}</p></div>`;
    }).join(' ')}
        </div>
          <h3 class="mt-5 mb-3 movie-title overview">Overview :</h3>
          <p id="movie-overview">${movie.overview}</p>  
        </div>
        `;
};
// This is for Single Movie Actors in Movie Details
const renderSingleMovieActor = (movie) => {
  console.log(movie)
  CONTAINER.innerHTML += `
  <h3 class="mt-5 mb-3 movie-title actor">Actors :<h3>
  <div class="container-actor mt-5">
        ${movie.cast.slice(0, 5).map((ele) => {
    return `<div class="actor-card"><img id="actor-img" src=${BACKDROP_BASE_URL + ele.profile_path}><p>${ele.name}</p></div>`;
  }).join(' ')}
  </div>
        `
}
// This is for Trails Movie in Movie Details
const renderTrails = (movie) => {
  console.log(movie)
  CONTAINER.innerHTML += `
    <h3 class="mt-5 mb-3 movie-title trails">Trails :</h3>
    ${movie.results.slice(0, 1).map((ele) => {
    return `<iframe width="100%" height="700" src="https://www.youtube.com/embed/${ele.key}" title=${ele.name} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
  }).join(' ')}
        `
}

// This is for Related Movies in Movie Details 
const renderRelated = (movie) => {
  console.log(movie)
  CONTAINER.innerHTML += `
    <h3 class="mt-5 mb-3 movie-title related">Related Movie :<h3>
   <div class="container-actor mt-5 mb-5">
        ${movie.results.slice(0, 5).map((ele) => {
    return `<div class="actor-card"><img id="actor-img" src=${ele.poster_path ?  BACKDROP_BASE_URL + ele.poster_path : "https://via.placeholder.com/150" }><p>${ele.original_title}</p></div>`;
  }).join(' ')}
  </div>
        `
}

document.addEventListener("DOMContentLoaded", autorun);



