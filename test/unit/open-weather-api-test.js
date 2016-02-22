'use strict';

var should = require('should');
var nock = require('nock');

var openWeatherAPI = require('./../../openWeatherAPI');

describe('Unit Testing for openWeatherAPI Widget', function(){
	//default params
	var geolocation = {
		  	lat: -33.87,
		  	lon: 151.21
	    }, 
	    units = 'metric';	

  	describe('getCurrentWeatherByGeoLocation(geolocation, units, callback)', function(){
  	  	it('should return a weather JSON data based on current user location ie Sydney', function () {

		  // mock the openWeather public feed api endpoint data
		  var jsonpData = {  
			   coord:{  
			      lon:151.21,
			      lat:-33.87
			   },
			   weather:[  
			      {  
			         id:802,
			         main:"Clouds",
			         description:"scattered clouds",
			         icon:"03d"
			      }
			   ],
			   base:"stations",
			   main:{  
			      temp:302.15,
			      pressure:1024,
			      humidity:51,
			      temp_min:302.15,
			      temp_max:302.15
			   },
			   visibility:10000,
			   wind:{  
			      speed:2.6,
			      deg:120
			   },
			   clouds:{  
			      all:40
			   },
			   dt:1456104600,
			   sys:{  
			      type:1,
			      id:8233,
			      message:0.0105,
			      country:"AU",
			      sunrise:1456083364,
			      sunset:1456130453
			   },
			   id:2147714,
			   name:"Sydney",
			   cod:200
			};

		  var openWeatherAPISettings = nock('http://api.openweathermap.org/data/2.5/weather')
		    .get('?lat=-33.87&lon=151.21&units=metric&appid=44db6a862fba0b067b1930da0d769e98')
		    .reply(200, jsonpData);

		  openWeatherAPI.getCurrentWeatherByGeoLocation(geolocation, units, function (error, data) {
		  	
		  	if (error !== null) {
		      error.should.not.be.ok;
		    }
		    data.should.be.an.instanceof(Object);

		    data.should.not.be.equal("");
		    
		  });

		});

		it('should give an error when API returns 500 http status code', function(){
			  
			// mock the Open Weather public feed api endpoint and return a 500 error
		    var openWeatherAPISettings = nock('http://api.openweathermap.org/data/2.5/weather')
		      .get('?lat=-33.87&lon=151.21&units=metric&appid=44db6a862fba0b067b1930da0d769e98')
		      .reply(500);	      

		    openWeatherAPI.getCurrentWeatherByGeoLocation(geolocation, units, function (error, data) {

		      should.exist(error);
		      error.should.match(/Open Weather feed API error/);
		      should.not.exist(data);

		    });

		});		
  	});
  	
});


