// Object created
App = function(){
	// Declaring self
	var self = this;
	
	// This code was built using the tutorials from: http://www.smashingmagazine.com/2012/02/09/beginners-guide-jquery-based-json-api-clients/
	// My own code is also part of this script including the retrieval of the movie overview data from JSON

	// API data elements stored
	var api_key = "ada03d75367a807d5fad77e1875764aa";
	var baseimg = "http://image.tmdb.org/t/p/w342";
	var baseid = "http://api.themoviedb.org/3/movie/";
	
	// App initialization	
	this.init = function(){
		console.log( 'App.init()' );

		$(function(){
			//This is to remove the validation message if no poster image is present
			$('#term').focus(function() {
				var full = $('#poster').has("img").length ? true: false;
				if (full == false) {
					$('#poster').empty();
				$( '#submit' ).on('click', self.getPoster );	
				}
			});
		});
	} 

	//getPoster definition
	this.getPoster = function(e){
	console.log( 'App.getPoster()' );
    	// this gets rid of the warning about using return false
		e.preventDefault();

		//clear credits
		$('#credits').empty('<figure><figcaption id="cast-name"></figcaption><img id="movie-credits" src="" /></figure>');

	  	//Captures the movie name and assigns film as the variable
		var film = $('#term').val();

		if (film == '') {
			$('#poster').html("<h2 class='loading'>Please enter a search.</h2>");
		} else {
			$('#poster').html("<h2 class='loading'>Seaching your query!</h2>");

			//JSON data retrieval
			$.getJSON("https://api.themoviedb.org/3/search/movie?query=" +
			    escape(film)  +
			      "&api_key=" +
			      api_key     +
			      "&callback=?",
				function(json) {
					console.log(json);
					// console.log(json.results[0].poster_path);
					if (json.total_results) {

							//Assigns movie variable to the movie's ID number
							var movie = json.results[0].id;

							//Uses JSON to retrieve data using the movie ID
							$.getJSON( baseid + movie + '?' + "&api_key=" + api_key,
							function(json) {

								console.log(json);

								//Displays the movie details (overview)	on the page
								$('#details').html(
								'<h2>Movie Details:</h2><p id="movie-details">' + json.overview + ' </p>');
							});

							$.getJSON( baseid + movie + '/credits' + '?' + "&api_key=" + api_key,
							function(json) {

								console.log(json);
								
								for (var cast = 0; cast <= 4; cast++)
								{
									//Displays the movie credits on the page
									$('#credits').append('<figure><figcaption id="cast-name">' + json.cast[cast].name + '</figcaption><img id="movie-credits" src=' + baseimg + json.cast[cast].profile_path + '/></figure>');
								}								
							});

					//Gets poster image and displays it on the page
					$('#poster').html(
					'<h2 class="loading">Movie Poster:</h2><img id="thePoster" src=' +
					      baseimg + json.results[0].poster_path + ' />');

					//If movie info not found, displays default The Matrix
					} else {
						$.getJSON("http://api.themoviedb.org/3/search/movie?query=the matrix&api_key=" +
						  api_key,
							function(json){
								$('#poster').html(
								  '<h2 class="loading">Sorry, nothing was found for that search. Perhaps you were looking for The Matrix?</h2><img id="thePoster" src='+
								  baseimg +
								  json.results[0].poster_path +'/>');
              		});
          		}
			});
		}
	}

	//Activates when submit button pressed	
	$('#fetch form').on('submit', this.getPoster);
}

var app = new App();