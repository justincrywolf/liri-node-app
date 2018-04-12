require("dotenv").config();
var Twitter = require( "twitter" );
var Spotify = require('node-spotify-api');
var request = require( "request" );
var dotenv = require( "dotenv" );
var keys = require( "./keys.js" );
var fs = require("fs");

var getTweets = function(){
  var client = new Twitter( keys.twitter );

  var params = { screen_name: "justincrywolf" };
  client.get( "statuses/user_timeline", params, function(error, tweets, response) {
    if (!error) {
      for( var i = 0; i < tweets.length; i++ ){
        console.log( tweets[i].created_at );
        console.log( " " );
        console.log( tweets[i].text );
      }
    }
  });
}

var getArtistNames = function( artist ){
  return artist.name;
}

var getMeSpotify = function( songName ) {
  var spotify = new Spotify( keys.spotify );

  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var songs = data.tracks.items
    for( var i = 0; i < songs.length; i++ ){
      console.log( i );
      console.log( "artist: " + songs[i].artists.map( getArtistNames ));
      console.log( "song name: " + songs[i].name );
      console.log( "preview song: " + songs[i].preview_url);
      console.log( "album: " + songs[i].album.name);
      console.log( "------------------------------");
    }
    fs.appendFile("log.txt", "\r" + "," + songName);
  });
  
}
var getMeMovie = function( movieName ){
  request("http://www.omdbapi.com/?apikey=trilogy&t=" + movieName + "&y=&plot=short&r=json", function(error, response, body){
    if( !error && response.statusCode === 200 ){
     
      var jsonData = JSON.parse(body);
      console.log( "Title: " + jsonData.Title + "\nYear: " + jsonData.Year + "\nIMDB Rating: " + jsonData.Ratings[0].Value + "\nRotten Tomatoes Rating: " + jsonData.Ratings[1].Value + "\nCountry: " + jsonData.Country + "\nLanguage: " + jsonData.Language + "\nPlot: " + jsonData.Plot + "\nActors: " + jsonData.Actors);
    }
  });
}

var doWhatItSays = function() {
  fs.readFile("./random.txt", "utf8", function( err, data ){
    if(err) throw err;
    var dataArr = data.split(",");
    if( dataArr.length === 2 ){
      pick(dataArr[0], dataArr[1]);
    } else if( dataArr.length === 1 ){
      pick(dataArr[0]);
    }
  });
}

var pick = function(caseData, functionData) {
  switch(caseData){
    case "my-tweets" :
      getTweets();
      break;
    case "spotify-this-song" :
      getMeSpotify(functionData);
      break;
    case "movie-this" :
      getMeMovie( functionData );
      break;
    case "do-what-it-says" :
      doWhatItSays();
      break;    
    default:
    console.log( "I don't have that feature...yet" );
  }
}

var runThis = function( argOne, argTwo ){
  pick( argOne, argTwo );
};

runThis(process.argv[2], process.argv[3]);