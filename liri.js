
//==== REQUIREMENTS ====//

var keys = require("./keys.js");

var Twitter = require('twitter');

var Spotify = require('node-spotify-api');

var request = require("request");

var fs = require("fs");

//==== TWITTER KEYS ====//

var consumerKey = keys.twitterKeys.consumer_key;
var consumerSecret = keys.twitterKeys.consumer_secret;
var tokenKey = keys.twitterKeys.access_token_key;
var tokenSecret = keys.twitterKeys.access_token_secret;

//==== VARIABLES FROM USER INPUT ====//

var command = process.argv[2];

var searchQuery = process.argv[3];

//==== CALL FUNCTION TO LOG DATA IN LOG.TXT ====//

logData();

//==== FUNCTIONS TO RUN BASED ON USER INPUT ====//

switch (command) {
	case "my-tweets":
		twitter();
	break;

	case "spotify-this-song":
		spotify();
	break;

	case "movie-this":
		omdb();
	break;

	case "do-what-it-says":
		readRandomFile();
	break;
};

//==== TWITTER FUNCTION ====//

function twitter() {

	var client = new Twitter({
	consumer_key: consumerKey,
	consumer_secret: consumerSecret,
	access_token_key: tokenKey,
	access_token_secret: tokenSecret
	});

	client.get("https://api.twitter.com/1.1/statuses/user_timeline.json?misshernandeztx=twitterapi&count=20", function(error, tweets, response) {

		if (error) throw (error);

		for (var i = 0 ; i < tweets.length ; i++) {
			console.log("\n-------------\n");
			console.log(tweets[i].text);
		};
		console.log("\n-------------\n");
	});
};

//==== SPOTIFY FUNCTION ====//

function spotify(){

	var spotify = new Spotify({
  	id: "34231615c0c04e3497a894bd6008f979",
  	secret: "c3efe1dd870942f78e9396a2e5e19e77"
	});

	if (typeof searchQuery === "undefined" || searchQuery === "") {

		searchQuery = "The Sign Ace of Base";

	};
 
	spotify.search({ type: 'track', query: searchQuery, limit: 1 }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
  		} else {
 
			console.log("\n-------------\n");
			console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
			console.log("Song: " + data.tracks.items[0].name);
			console.log("Preview Link: " + data.tracks.items[0].preview_url);
			console.log("Album: " + data.tracks.items[0].album.name);
			console.log("\n-------------\n");
		};

	});
};

//==== OMDB SEARCH FUNCTION ====//

function omdb() {

	if (typeof searchQuery === "undefined" || searchQuery === "") {

		var queryUrl = "http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=40e9cece"

		var rtLink = "mr_nobody";

	} else {
	
		var movieName = searchQuery.split(" ").join("+");

		var rtLink = searchQuery.split(" ").join("_");

		var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
	};

	request(queryUrl, function(error, response, body) {

		if (!error && response.statusCode === 200) {

			console.log("\n-------------\n");
			console.log("Title: " + JSON.parse(body).Title);
			console.log("Year: " + JSON.parse(body).Year);
			console.log("Rating: " + JSON.parse(body).Rated);
			console.log("Country: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
			console.log("Rotten Tomatoes URL: http://www.rottentomatoes.com/m/" + rtLink + "/");
			console.log("\n-------------\n");

  		}
	});
};

//==== READ RANDOM.TXT FUNCTION ====//

function readRandomFile() {

	fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    data = data.split(",");

    command = data[0];

    searchQuery = data[1].slice(1, -1);
    console.log(searchQuery);

    switch (command) {
		case "my-tweets":
			twitter();
		break;

		case "spotify-this-song":
			spotify(searchQuery);
		break;

		case "movie-this":
			omdb(searchQuery);
		break;
	};
  	});
};	

//==== LOG DATA FUNCTION ====//

function logData(){

	if (typeof searchQuery === "undefined") {

		fs.appendFile("log.txt", ("\n"+command), function(err) {
			if (err) {
				console.log(err);
			};
		});

	} else {
		fs.appendFile("log.txt", ("\n"+command+","+searchQuery), function(err) {
			if (err) {
				console.log(err);
			};
		});
	};
};







