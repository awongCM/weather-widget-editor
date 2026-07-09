'use strict';

var request = require('request')

var OpenWeather = (function () {
   //URL RequestConfiguration 
    var openWeatherAPISettings = {
      uri: 'http://api.openweathermap.org/data/2.5/weather',
      qs: { 
        lat: '',
        lon: '',
        units: 'metric',
        appid: '44db6a862fba0b067b1930da0d769e98' //Free API public key ;p
      }
    };

    var getCurrentWeatherByGeoLocation = function (geolocation, units, callback) {
      
      openWeatherAPISettings.qs.lat = geolocation.lat;
      openWeatherAPISettings.qs.lon = geolocation.lon;
      openWeatherAPISettings.qs.units = units;

      request.get(openWeatherAPISettings, function (error, response, body) {
        
        if (!error && response.statusCode === 200) {
          try {
            
            var data = JSON.parse(body);
            
            callback(null, data);

          }
          catch (e) {
            
            callback(new Error('Open Weather feed API parse error: ' + e.message));
          }
        }
        else {

          callback(new Error('Open Weather feed API error'));
        }
      });
    };

  return {
    getCurrentWeatherByGeoLocation: getCurrentWeatherByGeoLocation
  };

})();

module.exports = OpenWeather;