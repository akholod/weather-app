;(function () { 'use strict';
    const app = angular.module('weatherApp', []);

    //weather request service return promise
    app.service('GetWeatherData', ['$http', function($http){
        this.getData = function(latitude, longitude){
            return $http.get("http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&type=like&units=metric&APPID=43f65454b5ab109960c0b84f24ee0abe");
        }
    }]);

    //location request service, if error return default location or current if success
    app.service('GetCurrentLocation', ['$http', function($http){
        this.getCurrentLoc = function() {
            let response = {};
                return $http.get("http://ip-api.com/json")
                    .then((data) => {
                        response.lat = data.data.lat;
                        response.lon = data.data.lon;
                        return response;
                    }, (dataError) => {
                       console.log('Error location service' + dataError);
                        response.lat = 38.9;
                        response.lon = -77;
                        return response;
                    })
        }
    }]);

    app.controller('MainCtrl', function(GetWeatherData, GetCurrentLocation){
        this.tempUnit = 'C';
        //get location then get weather data for current location
        GetCurrentLocation.getCurrentLoc()
            .then((currentPosition) => {
                GetWeatherData.getData(currentPosition.lat, currentPosition.lon)
                    .then((response) => {
                        this.weatherData = response.data;
                        this.temp = this.weatherData.main.temp;
                }).then(() => {
                    this.weatherCode = chooseMeteoIcon(this.weatherData);
                });
        });

        //method change temperature range
        this.changeRange = function(){
            this.celsius = this.weatherData.main.temp;
            this.fahrenheit = Math.round(9/5 * this.weatherData.main.temp + 32);

            if(this.showFahrenheit) {
                this.temp = this.celsius;
                this.tempUnit = 'C';
                return this.showFahrenheit = 0;
            }
            this.temp = this.fahrenheit;
            this.tempUnit = 'F';
            this.showFahrenheit = 1;
        };

        //function choose meteo icon by id code, return icon code for meteocons-font
        function chooseMeteoIcon(weatherData){
            let weatherIconCode = '';
            switch (weatherData.weather[0].main) {
                case 'Dizzle':
                    weatherIconCode = 'Q';
                    break;
                case 'Clouds':
                    weatherIconCode = 'N';
                    if(weatherData.weather[0].decription == 'few clouds') {
                        weatherIconCode = 'H';
                    } else if(weatherData.weather[0].decription == 'few clouds' && (weatherData.weather[0].icon.indexOf("n") !== -1)) {
                        weatherIconCode = 'I';
                    }
                    break;
                case 'Rain':
                    weatherIconCode = 'R';
                    break;
                case 'Snow':
                    weatherIconCode = 'W';
                    break;
                case 'Clear':
                    (weatherData.weather[0].icon.indexOf("n") !== -1)?weatherIconCode = 'C':weatherIconCode = 'B';
                    break;
                case 'Thunderstorm':
                    weatherIconCode = 'p';
                    break;
                default:
                    weatherIconCode = ''
            }
            return weatherIconCode
        }
    });

    app.directive('weatherApp', function() {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'template/weather-template.html',
            controller: 'MainCtrl',
            controllerAs: 'mainCtrl'
        }
    });
})();
