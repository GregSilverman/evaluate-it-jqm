// Wait for PhoneGap to load
//
//document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
//
function onDeviceReady() {

	//navigator.geolocation.getCurrentPosition(onSuccess, onError);
	// needed for Android 2.x
	navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
};

/*
 * function LoadGeo() { // navigator.geolocation.getCurrentPosition(onSuccess,
 * onError); // needed for Android 2.x
 * navigator.geolocation.getCurrentPosition(onSuccess, onError, {
 * enableHighAccuracy : true }); };
 */

// onSuccess Geolocation
function onSuccess(position) {
	var element = document.getElementById('geolocation');
	element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />'
			+ 'Longitude: ' + position.coords.longitude + '<br />'
			+ 'Altitude: ' + position.coords.altitude + '<br />' + 'Accuracy: '
			+ position.coords.accuracy + '<br />' + 'Altitude Accuracy: '
			+ position.coords.altitudeAccuracy + '<br />' + 'Heading: '
			+ position.coords.heading + '<br />' + 'Speed: '
			+ position.coords.speed + '<br />' + 'Timestamp: '
			+ new Date(position.timestamp) + '<br />';

	var timeStamp = new Date(position.timestamp);

	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var accuracy = position.coords.accuracy;

	/*
	 * var element1 = document.getElementById('lbLatitude'); element1.innerHTML =
	 * latitude;
	 * 
	 * var element2 = document.getElementById('lbLongitude'); element2.innerHTML =
	 * longitude;
	 * 
	 * var element3 = document.getElementById('lbAccuracy'); element3.innerHTML =
	 * accuracy;
	 * 
	 * //var element4 = document.getElementById('lbTimestamp); //
	 * element4.innerHTML = timeStamp;
	 */
	
	// initialize
	localStorage.clear();
	// insert
	localStorage["latitude"] = latitude;
	localStorage["longitude"] = longitude;
	localStorage["accuracy"] = accuracy;
	localStorage["timeStamp"] = timeStamp;

};

// onError Callback receives a PositionError object
//
function onError(error) {
	alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
};

var watchID = navigator.geolocation.watchPosition(onSuccess, onError, {
	frequency : 3000
});
