let https = require('https');
let parseString = require('xml2js').parseString;
const express = require('express');
const app = express();
app.use('/',express.static (__dirname + '/htdocs'));
app.set('view engine', 'ejs');
app.listen(8000, function() {
    console.log('Listening on port 8000');
});
app.get('/', function(request, response) {
     //fusions ejs + data
response.render('index.ejs', dataToDisplay);
            });
let dataToDisplay = new Object();
dataToDisplay.feedGeekWire = new Object();
dataToDisplay.feedGeekWire.item = [];
dataToDisplay.apiWeather = new Object();
dataToDisplay.apiWeather.temperatures = [];
dataToDisplay.movieDBApiData = new Object();
dataToDisplay.movieDBApiData.results = [];

updatemovieDBApiData();
            
         
            function updatemovieDBApiData(){
            require('dotenv').config();
            let path = "/3/movie/upcoming?api_key=8f92510fae151d38c68228db0575c7db" ;
            let request = {
                "host": "api.themoviedb.org",
                "port": 443,
                "path": path
            };
            https.get(request, receiveResponseCallback);
            function receiveResponseCallback(response) { 
                let rawData = "";
                response.on('data', (chunk) => { rawData += chunk; });
                response.on('end', function() { 
                    let movieDBApiData = JSON.parse(rawData);
                 console.log(movieDBApiData )
                        for (let i = 0; i < movieDBApiData.results.length; i++) {
                            let results = {
                                "title":movieDBApiData.results[i].title,
                                "affiche" : "https://image.tmdb.org/t/p/original" + movieDBApiData.results[i].poster_path,
                                "datedesortie": movieDBApiData.results[i].release_date, "description":movieDBApiData.results[i].overview,
                                "popularite":movieDBApiData.results[i].popularity,
                                "langue":movieDBApiData.results[i].original_language,
                                "video": movieDBApiData.results[i].video,
                            }
                            dataToDisplay.movieDBApiData.results.push(results);
                            }
                });
            }
        }
 
