// Wait for PhoneGap to load
//

document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
//
function onDeviceReady() {

	//navigator.geolocation.getCurrentPosition(onSuccess, onError);
	// needed for Android 2.x
	navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
};

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

// TODO: combine with GetSiteId to have one-and-only one instance of this
// function
function GetSiteIdForGeo() {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var latitude = localStorage.getItem("latitude");
	var longitude = localStorage.getItem("longitude");
	var accuracy = localStorage.getItem("accuracy");
	var timeStamp = localStorage.getItem("timeStamp");

	console.log('latitude: longitude: accuracy: timeStamp ' + latitude + ' '
			+ longitude + ' ' + accuracy + ' ' + timeStamp);

	// get evaluation_id
	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	var id = sessionStorage.ParameterID;

	// select to get siteId
	var selectStatement = 'SELECT * FROM evaluation   \
			WHERE (evaluation_id = ?)';

	console.log('selectStatement: ' + selectStatement);

	db.transaction(function(transaction) {
		transaction.executeSql(selectStatement, [ id ], function(transaction,
				result) {
			if (result != null && result.rows != null) {

				// get output from select
				for ( var i = 0; i < 1; i++) {
					var row = result.rows.item(i);
					// get siteId

					console.log('row.site_id: ' + row.site_id);

					InsertGeoLocaleToDb(latitude, longitude, accuracy,
							timeStamp, row.site_id);

				}
			}
		}, errorHandler);
	}, errorHandler, nullHandler);

	alert("success")
	return false;
};


function InsertGeoLocaleToDb(latitude, longitude, accuracy, timeStamp, siteId) {

	console.log("Before: latitude, longitude, altitude, accuracy, timeStamp"
			+ latitude + ' ' + longitude + ' ' + accuracy + ' ' + timeStamp);

	/*
	 * latitude = latitude.toFloat().toFixed(6); longitude =
	 * longitude.toFloat().toFixed(6); // altitude =altitude.toFixed(6);
	 * accuracy = accuracy.toFloat().toFixed(6); // altitudeAccuracy
	 * =altitudeAccuracy.toFixed(6);
	 */
	console.log("After: latitude, longitude, accuracy, timeStamp" + latitude
			+ ' ' + longitude + ' ' + accuracy + ' ' + timeStamp);

	// insert geolocation statement
	var insertStatement = 'INSERT INTO geo_location  \
		(site_id, latitude,longitude,accuracy,timestamp)  VALUES (?,?,?,?,?)';

	console.log('insertStatement me:' + insertStatement);

	db.transaction(function(transaction) {
		transaction.executeSql(insertStatement, [ siteId, latitude, longitude,
				accuracy, timeStamp ], nullHandler, errorHandler);
	});

	alert("Geolocale successfully inserted")

	return false;

};


