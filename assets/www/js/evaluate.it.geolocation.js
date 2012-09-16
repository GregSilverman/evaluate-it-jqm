// Wait for PhoneGap to load
//
//document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
//

// global functions
var	onError,
	onSuccess;

function onDeviceReady() {

	//navigator.geolocation.getCurrentPosition(onSuccess, onError);
	// needed for Android 2.x
	navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
}

// onSuccess Geolocation
function onSuccess(position) {
	var element = document.getElementById('geolocation'),
		timeStamp = new Date(position.timestamp),
		latitude = position.coords.latitude, 
		longitude = position.coords.longitude,
		accuracy = position.coords.accuracy;


	element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />'
		+ 'Longitude: ' + position.coords.longitude + '<br />'
		+ 'Altitude: ' + position.coords.altitude + '<br />' 
		+ 'Accuracy: ' + position.coords.accuracy + '<br />'
		+ 'Timestamp: ' + new Date(position.timestamp) + '<br />';
	
	
	// initialize
	localStorage.clear();
	// insert
	localStorage.latitude = latitude;
	localStorage.longitude = longitude;
	localStorage.accuracy = accuracy;
	localStorage.timeStamp = timeStamp;

}

// onError Callback receives a PositionError object
//
function onError(error) {
	alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}

var watchID = navigator.geolocation.watchPosition(onSuccess, onError, {
	frequency : 3000
});
