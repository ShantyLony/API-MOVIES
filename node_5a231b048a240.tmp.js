let https = require('https');
let parseString = require('xml2js').parseString;const express = require('express');


const app = express();

app.use('/',express.static (__dirname + '/htdocs'));
app.set('view engine', 'ejs');

app.listen(8000, function() {
    console.log('Listening on port 8080');
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
dataToDisplay.InternationalLeMonde = new Object();
dataToDisplay.InternationalLeMonde.item = [];
            
updateWeather();
updatemovieDBApiData();
updateInternationalLeMonde();
            

            function updateWeather(){
                // Envoyer une requête de type GET à l'adresse :
                // https://api.open-meteo.com/v1/forecast?latitude=50.85&longitude=4.37&hourly=temperature_2m
                // Pour obtenir une réponse JSON
                let request = {
                    "host": "api.open-meteo.com",
                    "port": 443,
                    "path": "/v1/forecast?latitude=50.85&longitude=4.37&hourly=temperature_2m" 
                    };
                
                https.get(request, receiveResponseCallback);
                setTimeout(updateWeather, 5000);
                
                function receiveResponseCallback(response) { 
                    let rawData = "";
                    response.on('data', (chunk) => { rawData += chunk; }); 
                    response.on('end', function() { 
                        // console.log(rawData); 
                        let weather = JSON.parse(rawData);
                        dataToDisplay.apiWeather.temperatures = weather.hourly.temperature_2m;
                    
                        });
                    }
            }


            // N'oubliez pas d'installer : npm install dotenv
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
                    // Vérifiez si la propriété 'results' existe et n'est pas vide
                    
                        for (let i = 0; i < movieDBApiData.results.length; i++) {
                            
                            let results = {
                                "title":movieDBApiData.results[i].title,
                                "affiche" : "https://image.tmdb.org/t/p/original" + movieDBApiData.results[i].poster_path,
                                "datedesortie": movieDBApiData.results[i].release_date, "description":movieDBApiData.results[i].overview,
                                "popularite":movieDBApiData.results[i].popularity,
                                
                            }
                           
                            dataToDisplay.movieDBApiData.results.push(results);
                            }
                            //  console.log("https://image.tmdb.org/t/p/original" + movieDBApiData.results[1].poster_path)
                });
            }
        }


      function updateInternationalLeMonde (){
// Envoyer une requête de type GET à l'adresse :
// https://www.lemonde.fr/pixels/rss_full.xml
// Pour obtenir une réponse XML
//https://www.lemonde.fr/international/rss_full.xml

let request = {
    "host": "www.lemonde.fr",
    "port": 443,
    "path": "/international/rss_full.xml" 
    };

https.get(request, receiveResponseCallback);
setTimeout(updateInternationalLeMonde, 1000);

// console.log("requête envoyée");

function receiveResponseCallback(response) { 
    // console.log('Got response:' + response.statusCode);
    let rawData = "";
    response.on('data', (chunk) => { rawData += chunk; }); 
    response.on('end', function() { 
        // console.log(rawData);
        parseString(rawData, function (err, result) {
            for(let i=0; i<result.rss.channel[0].item.length ; i++){  // itérer les items
                let item = {
                    "title": result.rss.channel[0].item[i].title[0],
                    "link" : result.rss.channel[0].item[i].link[0],
                    "pubDate": result.rss.channel[0].item[i].pubDate[0]
                }
                dataToDisplay.InternationalLeMonde.item.push(item);
                }
                console.log(dataToDisplay.InternationalLeMonde.item);
            });
        });
    }

      }  


                        