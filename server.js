'use strict';

// Express Server
var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('error-handler'),
    https = require('https'),
    path = require('path'),
    handlebars = require('express-handlebars'),
    os = require('os'),
    moment =require('moment'),
    networkInterfaces = os.networkInterfaces(),
    openWeatherAPI = require('./openWeatherAPI'),
    formWidgetEditor = require('./formWidgetEditor'),
    helpers = require('./lib/helpers');

//Setting up our express instances;
var server  = express();
var client = express(); //TODO: for instantiating another 

//Express Config settings
var serverConfig = {
    baseURL: 'public',    
    port: 9090,
    baseURLEndPoint: '/weather-widget/api/',
    handlerBarsViewPath: '/views/server',
    publicWidgetScr: '/example/widget.js',
    //serverHost: getIPAddress()
    serverHost: 'ec2-52-34-148-211.us-west-2.compute.amazonaws.com'
};

server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(methodOverride());

server.set('view engine', 'handlebars');

server.engine('handlebars', handlebars({
  defaultLayout: __dirname + serverConfig.handlerBarsViewPath + '/layouts/main',
  partialsDir: __dirname + serverConfig.handlerBarsViewPath  + '/partials',
  helpers: helpers
}));

server.set('views', __dirname + serverConfig.handlerBarsViewPath);

server.use(function(req, res, next){
  
  //Relaxed security rules on the cross resource sharing
 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.use(express.static(serverConfig.baseURL));

server.get('/', function (req, res) {
   res.render('home');
});

server.post('/', function (req, res){
   
   var title = req.body.title,
       units = req.body.units,
       showWind = req.body.showWind,
       lat = req.body.lat,
       lon = req.body.lon,
       elemCounter = req.body.elemCounter

   // console.log('title: ', title, 'units: ', units, 'showWind: ', showWind, 'lat: ', lat, 'lon: ', lon, 'elemCounter: ', elemCounter);
   
   if(!checkValidParameters(title, units, showWind)){
     res.status(400).send({error: 'One of your input fields has invalid parameters required'});
     return;
   }

   var snippet_data = generateDynamicScript(title, units, showWind, lat, lon);

   res.render('layouts/widget-panel', {layout: false, title: title, data: snippet_data, elemCounter: elemCounter});
   
});

server.post(serverConfig.baseURLEndPoint, function (req, res) {
  
  var title = req.body.title,
      geolocation = {
          lat: req.body.lat,
          lon: req.body.lon
      },
      units = req.body.units,
      showWind = req.body.showWind;

   if(!checkValidParameters(title, units, showWind)){
     res.status(400).send({error: 'One of your input fields has invalid parameters required'});
     return;
   }

  //Calls external OpenWeather API to get current Weather
  openWeatherAPI.getCurrentWeatherByGeoLocation(geolocation, units, function (error, data){
    
    if(error){
      res.send(error);
    }

    console.log('JSON Data returned: ', data);

    res.render('layouts/widget', {layout: false,
        widget_title: title,
        widget_city: data.name,
        widget_main: data.weather[0].main,
        widget_weather_icon: fetchWeatherIconClass(data.weather[0].id), 
        widget_description: data.weather[0].description,
        widget_temp: data.main.temp,
        widget_showWind: showWind,
        widget_units: units,
        widget_speed: data.wind.speed,
        widget_deg: data.wind.deg,
        widget_humidity: data.main.humidity,
        widget_min: data.main.temp_min,
        widget_max: data.main.temp_max,
        widget_current_time: moment.unix(data.sys.sunset).format('LT'),//Unix timestamp on server
        widget_current_date: moment.unix(data.sys.sunrise).format('DD MMM YYYY')//Unix timestamp on server
    });
  });

});

//TODO: Need to do about handling CSS attacks
function generateDynamicScript(title, units, showWind, lat, lon){
    
  var params = [title, units, showWind, lat, lon].map(function(item, key){
      return generateKeyValuePair('data-'+key, item);
  });

  var scriptId = 'id="script-loader"',
      scriptType = 'type=\"text/javascript"', 
      scriptSrc = 'src=\"http://' + serverConfig.serverHost + ':' + serverConfig.port + serverConfig.publicWidgetScr + '\"',
      scriptOpenTag = '<script '+ scriptId +' '+ scriptType + ' '+ scriptSrc+' '+params[0]+' '
                    +params[1]+' '+params[2]+' '+params[3]+ ' '+params[4]+'>',
      scriptCloseTag = '</script>',
      widgetContentTag = '<div id=\"widget-content\"></div>';

  return scriptOpenTag.concat(scriptCloseTag, widgetContentTag);
  
}

function generateKeyValuePair(key, value){
  return key + "=\"" + value + "\"";
}

//Sourced solutions to get dynamic IP/domain name when hosting
// http://blog.bguiz.com/articles/embeddable-widgets-html-javascript

function getIPAddress(){
   var keys = Object.keys(networkInterfaces);
    for (var x = 0; x < keys.length; ++x) {
        var netIf = networkInterfaces[keys[x]];
        for (var y = 0; y < netIf.length; ++ y) {
            var addr = netIf[y];
            if (addr.family === 'IPv4' && !addr.internal) {
                return addr.address;
            }
        }
    }
    return '127.0.0.1';
}

function checkValidParameters(title, units, showWind){
  
  if(!formWidgetEditor.isTitleValid(title)) {
    return false;
  }

  else if(!formWidgetEditor.areUnitsValid(units)) {
    return false;
  }

  else if(!formWidgetEditor.isShowWindValid(showWind)){
    return false;
  }
  else {
    return true;    
  }
  
}

function fetchWeatherIconClass(weather_icon_id){
   var weather_icons_mapping = {
      200: "wi wi-thunderstorm",
      300: "wi wi-sleet",
      500: "wi wi-rain",
      600: "wi wi-snow",
      741: "wi wi-fog",
      800: "wi wi-day-sunny",
      801: "wi wi-day-cloudy",
      802: "wi wi-cloud",
      803: "wi wi-cloudy",
      804: "wi wi-cloudy",
      900: "wi wi-tornado",
      901: "wi wi-storm-showers",
      902: "wi wi-hurricane",
      903: "wi wi-snowflake-cold",
      904: "wi wi-hot",
      905: "wi wi-windy",
      906: "wi wi-hail"
   };

   return weather_icons_mapping[weather_icon_id];
}


//Start up server
server.listen(serverConfig.port);
console.log("Express Server listening on port: " + serverConfig.port);
