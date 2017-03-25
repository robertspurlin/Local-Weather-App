$(document).ready(function() {
	
    $(window).resize(function() {
        var homeHeight = $(this).height();
        var hCenter = (($(this).height() /2) - ($("#box").height() /2));
        $("#background").height(homeHeight);
        $("#box").css("margin-top", hCenter);
    }).resize();

    locationFinder();
    apiCall();

    
    // Unit changer (F to C, vice versa). Tagged to body due to API
	$("body").on("click", "a", function(e) {
    	if (unit === "F") {
    		temperature = (temperature - 32) * 5 / 9;
    		unit = "C";
    		$("#change").html(Math.round(temperature) + "&#176;" + unit);
    		}

    	else if (unit === "C") {
    		temperature = temperature * 9 / 5 + 32;
    		unit = "F";
    		$("#change").html(Math.round(temperature) + "&#176;" + unit);
    	}
    	e.preventDefault();
	});

// End of (document).ready 

});

// Initial definition of global variables
var temperature, city, unit, fullLocation, apiLink = "";

function locationFinder() {
	$.getJSON("https://ipinfo.io/geo").done(function(response) {
  		city = response.city;
  		fullLocation = response.city + ", " + response.region;
	});	    	
}
    
// Waits for latitude and longitude to fill before it calls the if 
function apiCall() {
	if (typeof city !== "undefined") {
		apiLink = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=576ee27d965b31a73dccacba92eb4567";
		$.getJSON(apiLink).done(update).fail(error);

		function update(response) {
			
			// Units are F, initial setting. &units=imperial
			unit = "F";
			var description = response.weather[0].main;
			temperature = Math.round(response.main.temp);
			
			var iconLink = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";

			$("#city").html("<h3>" + fullLocation + "</h3>");
			$("#description").html(description + " | " + "<a href='#' id='change'>" + temperature + "&#176;" + unit + "</a>");
			$("#icon").html('<img src="' + iconLink + '">');
		
			// Changes background color based on timestamp. ts defines current timestamp
			var ts = Math.round((new Date()).getTime() / 1000);
			var sunset = response.sys.sunset;
			var sunrise = response.sys.sunrise;

			if (ts < sunset) {
				$("#background").animate({backgroundColor: '#000000'}, 'slow');
			}

			else {
				$("#background").animate({backgroundColor: '#77B5FE'}, 'slow');
			}
		}
	}
		
	else {
		setTimeout(apiCall, 100);
	}
}
	
// Only runs when JSON fails or server responds with anything other than expected
function error() {
	$("#city").html("There has been an error.</br>Try again later!");
}
