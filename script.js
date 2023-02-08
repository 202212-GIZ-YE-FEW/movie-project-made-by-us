'use strict';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185';
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
const CONTAINER = document.querySelector('.container');
const genres = {
	28: 'Action',
	12: 'Adventure',
	16: 'Animation',
	35: 'Comedy',
	80: 'Crime',
	99: 'Documentary',
	18: 'Drama',
	10751: 'Family',
	14: 'Fantasy',
	36: 'History',
	27: 'Horror',
	10402: 'Music',
	9648: 'Mystery',
	10749: 'Romance',
	878: 'Science Fiction',
	10770: 'TV Movie',
	53: 'Thriller',
	10752: 'War',
	37: 'Western',
};
let dropCollapse = document.querySelector('#toggleMobileMenu');

// Don't touch this function please
const autorun = async () => {
	navBar();
	search();
	// const movies = await fetchMovies();
	const moviesMore = await moreFetchMovies();
	//  console.log(movies.results);
	renderMovies(moviesMore);
};

// Don't touch this function please
const constructUrl = (path) => {
	return `${TMDB_BASE_URL}/${path}?api_key=${atob(
		'NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI='
	)}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
	const movieRes = await fetchMovie(movie.id);
	renderMovie(movieRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
	const url = constructUrl(`movie/now_playing`);
	const res = await fetch(url);
	return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
	const url = constructUrl(`movie/${movieId}`);
	const res = await fetch(url);
	return res.json();
};

//sarah: fetch from multiple pages
//to add more than 20 movies
const moreFetchMovies = async () => {
	let moviesArray = [];
	for (let i = 1; i <= 3; i++) {
		const url = constructUrl(`trending/all/day`);
		const res = await fetch(`${url}&page=${i}`);
		const data = await res.json();
		moviesArray.push(...data.results);
	}
	return moviesArray;
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
	// console.log(movies);
	CONTAINER.innerHTML = ' ';
	const movieContainer = document.createElement('div');
	movieContainer.classList.add('movies');
	movies.map((movie) => {
		const movieDiv = document.createElement('div');
		movieDiv.classList.add('movie');
		movieDiv.innerHTML = `<div class="card">
			<div class="card card-top">
					<img class="card card-img-top"src="${
						BACKDROP_BASE_URL + movie.backdrop_path
					}" alt="${movie.title} poster">
					<p class="overview card card-text">Genres: ${movie.genre_ids
						.map((id) => genres[id])
						.join(', ')}</p>
					</div>
					<div class="card card-body">
					<h3 class="card card-subtitle text-center fs-4 fw-bold">${
						movie.title || movie.name
					}</h3>
					<p class="rating fw-bold text-center fs-3">Average: ${
						movie.vote_average
					}<i class="bi bi-star-fill text-warning fs-2 m-2"></i></p>
					</div>
					</div>
			`;
		movieDiv.addEventListener('click', () => {
			movieDetails(movie);
		});
		movieContainer.appendChild(movieDiv);
	});
	CONTAINER.appendChild(movieContainer);
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
	CONTAINER.innerHTML = `
		<div class="row">
				<div class="col-md-4">
					<img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdrop_path}>
				</div>
				<div class="col-md-8">
						<h2 id="movie-title">${movie.title}</h2>
						<p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
						<p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
						<h3>Overview:</h3>
						<p id="movie-overview">${movie.overview}</p>
				</div>
				<div>
						<h3>Actors:</h3>
						<ul id="actors" class="list-unstyled"></ul>
						
		</div>`;
};

//genres function:1
const genresDropDown = async () => {
	let fetchdeGenres = await fetchGenres();
	console.log(fetchdeGenres);
	let dropDown = document.querySelector('#genres');
	// console.log(dropDown);
	dropDown.innerHTML = ' ';
	fetchdeGenres.genres.forEach((kind) => {
		// console.log(kind.id);
		let dropDown_item = `<li><a class="dropdown-item " data=${kind.id} href="#">${kind.name}</a></li>`;
		dropDown.innerHTML += dropDown_item;
	});
	selectedGenres();
};
//genres function:2
const fetchGenres = async () => {
	let url = constructUrl('/genre/movie/list');
	//  console.log(url);
	let res = await fetch(url);
	return res.json();
};

//genres function:3
const selectedGenres = async () => {
	let movies = await moreFetchMovies();
	// console.log(movies);
	let found;
	let dropDownItems = document.querySelectorAll('#genres li a');

	// console.log(dropCollapse);
	console.log(dropDownItems);
	dropDownItems.forEach((item) => {
		item.addEventListener('click', (e) => {
			console.log(e.target);
			dropCollapse.classList.remove('show'); // to hide the collapse one dropdow item clicked
			found = movies.filter((movie) => {
				return movie.genre_ids.find((id) => {
					return id === parseInt(item.getAttribute('data'));
				});
			});

			CONTAINER.innerHTML = ' ';
			renderSearchAndFilter(found, item.innerHTML);
		});
	});
};

//fetch actors for search purpos
const fetchActors = async () => {
	const url = constructUrl(`person/popular`);
	console.log(url);
	const res = await fetch(url);
	return res.json();
};

//filter function:1
const filtersDropDown = async () => {
	let filterDropDown = document.querySelector('#filter');
	filterDropDown.innerHTML = ' ';

	let dropDown_item = `
	  <li>
	  <a class="dropdown-item" data="/now_playing" href="#">Now playing</a>
	</li>
	<li>
	  <a class="dropdown-item" data="/popular" href="#">Popular</a>
	</li>
	<li>
	  <a class="dropdown-item" data="/top_rated" href="#">Top rated</a>
	</li>
	<li>
	  <a class="dropdown-item" data="/upcoming" href="#">Upcoming</a>
	</li>`;
	filterDropDown.innerHTML += dropDown_item;

	selectedFilter();
};

//filter function:2
const selectedFilter = async () => {
	let filterDropDownItems = document.querySelectorAll('#filter li a');
	filterDropDownItems.forEach((item) => {
		item.addEventListener('click', (e) => {
			dropCollapse.classList.remove('show');
			console.log();
			filterResult(e.target.getAttribute('data'), e.target.innerHTML);
		});
	});
};
//filter function:3
const filterResult = async (filter, selectedFilter) => {
	const filters = await fetchFilters(filter);
	CONTAINER.innerHTML = ' ';
	renderSearchAndFilter(filters.results, selectedFilter);
};
//filter function:4
const fetchFilters = async (filter) => {
	console.log(filter);
	const url = constructUrl(`movie${filter}`);
	const res = await fetch(url);
	console.log(url);
	return res.json();
};

//filter & search function: 5
const renderSearchAndFilter = (results, name = 'Search Results') => {
	let div = document.createElement('div');
	div.innerHTML = `<h3 class="text-center"> ${name} </h3>`;
	div.classList.add('row');
	for (let i = 0; i < results.length; i++) {
		let col = document.createElement('div');
		col.classList.add('col-lg-4');
		col.classList.add('col-md-6');
		col.classList.add('col-sm-12');
		col.innerHTML = `
	  <div class="card mb-5 shadow-sm" >
	   <img id="img-card" 
	   style="height: 320px"  
	   src=${
				BACKDROP_BASE_URL +
				(results[i].backdrop_path || results[i].profile_path)
			}> 
	  <div class="card-body">
	  <h5 class="text-center">${results[i].title || results[i].name}</h5>
		</div>
	  </div>
	  `;
		CONTAINER.innerHTML = ' ';
		col.addEventListener('click', () => {
			// console.log(results[i]);
			searchDetails(results[i]);
		});
		div.append(col);
	}
	CONTAINER.innerHTML = ' ';
	CONTAINER.append(div);
};

const navBar = () => {
	let nav = document.querySelectorAll('.nav-link');

	nav.forEach((link) => {
		link.addEventListener('click', (e) => {
			nav.forEach((each) => {
				each.classList.remove('active');
				each.id = '';
			});
			// e.target.id = "current"
			e.target.classList.add('active');

			switch (e.target.innerHTML) {
				case 'Home':
					{
						CONTAINER.innerHTML = '';
						autorun();
					}
					break;
				case 'Genres':
					genresDropDown();
					break;
				case 'Actors':
					autorun2();
					break;
				case 'Filter':
					filtersDropDown();
					break;
				case 'About':
					aboutPage();
					break;
			}
		});
	});
};

const search = () => {
	let form = document.getElementById('form');
	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		const searchHere = [];
		// console.log(event.target.elements[0].value);//input value
		let movies = await moreFetchMovies();
		let actors = await fetchActors();
		movies.forEach((movie) => {
			searchHere.push(movie);
		});
		actors.results.forEach((actor) => {
			searchHere.push(actor);
		});
		let found = searchHere.filter((one) => {
			// console.log((one.title || one.name).toLowerCase());
			return (one.title || one.name)
				.toLowerCase()
				.includes(event.target.elements[0].value);
		});
		CONTAINER.innerHTML = '';
		renderSearchAndFilter(found);
	});
};

// to check if the clicked item in the search results is
// Movie or Actor, since each have different
// properties and different page
const searchDetails = async (movie) => {
	console.log(movie);
	if ('profile_path' in movie) {
		//call here the single actor page
	}
	if ('poster_path' in movie) {
		movieDetails(movie);
	}
};
const aboutPage = () => {
	CONTAINER.innerHTML = ' ';
	CONTAINER.innerHTML = `
	<div class= "text-center" style="height:auto ">
	<h4>About Us</h4>
	<p>This website had made for the second project in the Yemen &#127486;&#127466; bootcamp 2023 &#127881;</p>
	<p>it had built by fetching movies API and manipulating the DOM by HTML,CSS, and Javascript</p>
	<p>Our AWESOME team has collaborated on this work and has done their best  </p>
	<p>and by mentioning that, let us introduce our names</p>
	<p>	<i style="color:orange">&#127881; Abdullah, Abobakr, Sarah, Sufyan and finally Yassin &#127881; </i>
	</p>
	<p>Enjoy watching and we hope you find this website wonderful! </p>
	
	</div>
	`;
};

document.addEventListener('DOMContentLoaded', autorun);

const autorun2 = async () => {
	const persons = await fetchPersons();
	renderPersons(persons.results);
};
const personDetails = async (person) => {
	const personAllRes = await fetchPerson(person.id);
	const personRes = await personAllRes[0];
	const genders = ['Not specified', 'Female', 'Male'];
	personRes.gender = genders[personRes.gender];
	renderPerson({ ...personRes, movies: personAllRes[1].cast });
};

const fetchPersons = async () => {
	const url = constructUrl(`person/popular`);
	const res = await fetch(url);
	return res.json();
};

const fetchPerson = async (person_id) => {
	const url = constructUrl(`person/${person_id}`);
	const movies = constructUrl(`person/${person_id}/movie_credits`);
	const res = await fetch(url);
	const res2 = await fetch(movies);

	return Promise.all([res.json(), res2.json()]);
};

const renderPersons = (persons) => {
	CONTAINER.innerHTML = ' ';
	persons.map((person) => {
		// console.log(person)
		const personDiv = document.createElement('div');
		personDiv.className = 'bigCard';
		personDiv.innerHTML = `
	  <div class="card" style="width: 18rem;">
	  <img class="card-img-top"src="${
			PROFILE_BASE_URL + person.profile_path
		}" alt="${person.name}">
	  <div class="card-body">
	  <h3>${person.name}</h3>
		<p class="card-text">add movies that he act</p>
	  </div>
	</div>
	  `;
		personDiv.addEventListener('click', () => {
			personDetails(person);
		});
		CONTAINER.appendChild(personDiv);
	});
};

const renderPerson = (person) => {
	console.log(person);
	CONTAINER.innerHTML = `
	  <div class="row">
		  <div class="col-md-4">
			   <img id="actor-backdrop" src=${BACKDROP_BASE_URL + person.profile_path}>
		  </div>
		  <div class="col-md-8">
			  <h2 id="actor-name">${person.name}</h2>
			  <p id="actor-gender" ><b>Gender : </b> ${person.gender}</p>
			  <p id "actor-birthday"><b>Birthday : </b>${person.birthday}</p>
			  <p id="person-popularity"><b>Popularity : </b> ${person.popularity} </p>
		  </div>
		  	<div>
			  <h3>Biography:</h3>
			  <p id = "actor-biography">${person.biography}</p>
			</div>
			<div>
			<h3>Biography:</h3>
			<div class="movies">
			${person.movies
				.map((movie) => {
					return `
			<div class="movie"><div class="card">
			<div class="card card-top">
					<img class="card figure-img card-img-top placeholder" src="${BACKDROP_BASE_URL}/${movie.poster_path}" alt="${movie.title}">
					<p class="overview card card-text" style="transform: translateY(60%)">Genres: Action, Adventure, Science Fiction</p>
					</div>
					<div class="card card-body">
					<h3 class="card card-subtitle text-center fs-4 fw-bold">${movie.title}</h3>
					<p class="rating fw-bold text-center fs-3">Average: ${movie.vote_average}<i class="bi bi-star-fill text-warning fs-2 m-2"></i></p>
					</div>
					</div>
			</div>
			`;
				})
				.join('')}
			</div>
			`;
};
// let a = document.createElement('a')
// a.href = '#'
// a.id = 'actorPage'
// a.textContent = "Actor Page"
// CONTAINER.appendChild(a)

// document.querySelector('#actorPage').addEventListener('click', autorun2);
