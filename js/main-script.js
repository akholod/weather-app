/**
 * Created by LocalAdmin on 14.06.2016.
 */

$(function() {

    var weatherApp = {};
    weatherApp.weather = {};
    //model Weather App
    weatherApp.model = function () {
        var currentLocation = {};


        getMyCurrentLocation(getWeatherJson);

        //function definition
            //func get location by api if navigator.geolocation doesn't work
            function getLocationByApi() {
                var locationURL = "http://ip-api.com/json";
                $.getJSON( locationURL, function(data) {
                    console.log(data);
                    currentLocation.latitude = data.lat;
                    currentLocation.longitude = data.lon;
                    getWeatherJson(currentLocation.latitude, currentLocation.longitude);
                })
            } //end getLocationByApi

            //func get location then if  call func getJSON to API api.openweathermap.org
            function getMyCurrentLocation(func) {
                if (!navigator.geolocation){
                    weather.errorWeather = 'Geolocation is not supported by your browser';
                    getLocationByApi();
                    error('Geolocation is not supported by your browser');
                    return;
                }

                function success(position) {
                    currentLocation.latitude = position.coords.latitude;
                    currentLocation.longitude = position.coords.longitude;
                    weatherApp.weather.errorWeather = '';

                    console.log(currentLocation.latitude);
                    console.log(currentLocation.longitude);

                    func(currentLocation.latitude, currentLocation.longitude);
                } //end success

                function error() {
                    weatherApp.weather.errorWeather = 'Unable to retrieve your location';
                    getLocationByApi();
                } //end error
                navigator.geolocation.getCurrentPosition(success, error);
            } //end getMyCurrentLocation


        function getWeatherJson(latitude, longitude) {
            $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&type=like&units=metric&APPID=43f65454b5ab109960c0b84f24ee0abe",
                function(data) {
                    weatherApp.weather.localCity = data.name;
                    weatherApp.weather.localCountry = data.sys.country;
                    weatherApp.weather.humidity = data.main.humidity;
                    weatherApp.weather.temperature = data.main.temp;
                    weatherApp.weather.wind = data.wind.speed;
                    weatherApp.weather.main = data.weather[0].main;
                    weatherApp.weather.decription = data.weather[0].description;
                    weatherApp.weather.id = data.weather[0].icon;

                    weatherApp.view(weatherApp.weather);
                }); //end getWeatherJson
        }
        //function definition end
    };

    //Weather app view
    weatherApp.view = function (data) {
        console.log(data);
        $('#city').text(data.localCity);
        $('#country').text(', ' + data.localCountry);
        $('#currentTemp').text("Temperature " + data.temperature);
        $('#humidity').text('Humidity ' + data.humidity + '%');
        $('#wind').text('Wind ' + data.wind + 'm/s');
        $('#main').text(data.main);
        $('#description').text(' ,' + data.decription);

        var weatherIconCode = '';

        switch (data.main) {
            case 'Dizzle':
                weatherIconCode = 'Q';
                break;
            case 'Clouds':
                weatherIconCode = 'N';
                if(data.decription == 'few clouds') {
                    weatherIconCode = 'H';
                } else if(data.decription == 'few clouds' && (data.id.indexOf("n") !== -1)) {
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
                (data.id.indexOf("n") !== -1)?weatherIconCode = 'C':weatherIconCode = 'B';
                break;
            case 'Thunderstorm':
                weatherIconCode = 'p';
                break;
            default:
                weatherIconCode = ''
        }

        $('.icon').attr('data-icon', weatherIconCode);
    };
        //Weather app control
    weatherApp.control = function (dataControl) {
        $('#tempUnit').on('click', function() {
            if($(this).is(':checked')) {
                var tempFarenheit;
                $(this).parent().find('span').text('F');
                $(this).parent().css('color', '#152EFF');
                tempFarenheit = Math.round(9/5 * dataControl.temperature + 32);
                $('#currentTemp').text("Temperature " + tempFarenheit)

            } else {
                $(this).parent().find('span').text('C');
                $(this).parent().css('color', '#b44af7');
                $('#currentTemp').text("Temperature " + dataControl.temperature)
            }

        })
    };
    weatherApp.control(weatherApp.weather);
    weatherApp.model();
});
