let https = require('https');
let parseString = require('xml2js').parseString;const express = require('express');

const app = express();

app.use('/',express.static (__dirname + '/htdocs'));
app.set('view engine', 'ejs');

app.listen(8080, function() {
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
            
updateRSSGeekWire();
updateWeather();
            
function updateRSSGeekWire() {
                // Envoyer une requête de type GET à l'adresse :
                // https://www.geekwire.com/feed/
                // Pour obtenir une réponse XML
let request = {
"host": "www.geekwire.com",
"port": 443,
"path": "/feed/"
            };
https.get(request, receiveResponseCallback);
setTimeout(updateRSSGeekWire, 10000);
                
                function receiveResponseCallback(response) {
                   
                    let rawData = "";
                    response.on('data', (chunk) => { rawData += chunk; }); 
                    response.on('end', function() {            
                        parseString(rawData, function (err, result) {
                            for(let i=0; i<result.rss.channel[0].item.length ; i++){  // itérer les items
                                let item = {
                                    "title": result.rss.channel[0].item[i].title[0],
                                    "link" : result.rss.channel[0].item[i].link[0],
                                    "pubDate": result.rss.channel[0].item[i].pubDate[0]
                                }
                                dataToDisplay.feedGeekWire.item.push(item);
                                }
                            });
                        });
                    }
            }
            
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
                                                                                                            