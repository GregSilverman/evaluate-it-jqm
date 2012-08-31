// db

//TODO: 
// add date of evaluation: better control with a DatePicker
// required values: neighborhood
// evaluator_id as a variable for completed by and for loading data

// TODO:
//get rid of abomination at bottom!! (list of evaluation object)
//ensure no dups inserted into tables
// clear form: rather kludgy... need to address through refactoring
// better style!
// editable forms!!!!!!!!!!
// MVC (Javascript or backbone: see http://blog.chariotsolutions.com/2012/02/using-jquerymobile-and-backbonejs-for.html)
// select/lookup for evaluator_id

// global variables
var db;
var shortName = 'EvaluateItDB';
var version = '1.0';
var displayName = 'EvaluateItDB';
var maxSize = 90000;
// this is called when an error happens in a transaction
function errorHandler(transaction, error) {
	alert('Error: ' + error.message + ' code: ' + error.code);
};

// this is called when a successful transaction happens
function successCallBack() {
	// alert("DEBUGGING: success");
};

function nullHandler() {
};

// called when the application loads
function onBodyLoad() {

	alert("DEBUGGING: we are in the onBodyLoad() function");

	if (!window.openDatabase) {
		// not all mobile devices support databases if it does not, the
		// following alert will display indicating the device
		// will not be albe to run this application
		alert('Databases are not supported in this browser.');
		return;
	}

	db = openDatabase(shortName, version, displayName, maxSize);

	// drop tables
	/*
	 * var dropStatementGeolocation = 'DROP TABLE geo_location'; var
	 * dropStatementSite = 'DROP TABLE site'; var dropStatementSiteType = 'DROP
	 * TABLE site_type'; var dropStatementEvaluation = 'DROP TABLE evaluation';
	 * var dropStatementEvaluationAward = 'DROP TABLE evaluation_award'; var
	 * dropStatementEvaluationFactor = 'DROP TABLE evaluation_factor'; var
	 * dropStatementEvaluationFeature = 'DROP TABLE evaluation_feature'; var
	 * dropStatementFeature = 'DROP TABLE feature'; var dropStatementAward =
	 * 'DROP TABLE award'; var dropStatementFactor = 'DROP TABLE factor'; var
	 * dropStatementGardener = 'DROP TABLE gardener';
	 * 
	 * executeSql(dropStatementGeolocation); executeSql(dropStatementSite);
	 * executeSql(dropStatementSiteType); executeSql(dropStatementEvaluation);
	 * executeSql(dropStatementEvaluationAward);
	 * executeSql(dropStatementEvaluationFactor);
	 * executeSql(dropStatementEvaluationFeature);
	 * executeSql(dropStatementFeature); executeSql(dropStatementAward);
	 * executeSql(dropStatementFactor); executeSql(dropStatementGardener);
	 */

	// create tables
	var createStatementSite = 'CREATE TABLE IF NOT EXISTS site \
	    (id INTEGER NOT NULL PRIMARY KEY, \
	    site_id INTEGER NOT NULL, \
	    site_type_id INTEGER NOT NULL, \
	    address VARCHAR NOT NULL, \
	    city VARCHAR NOT NULL,\
	    state VARCHAR NOT NULL,\
	    zip INTEGER NOT NULL, \
	    neighborhood VARCHAR)';

	var createStatementSiteType = 'CREATE TABLE IF NOT EXISTS site_type \
	    (id INTEGER NOT NULL PRIMARY KEY,\
	    name VARCHAR NOT NULL)';

	var createStatementGeolocation = 'CREATE TABLE IF NOT EXISTS geo_location \
	    (id INTEGER NOT NULL PRIMARY KEY, \
	    site_id INTEGER NOT NULL, \
	    latitude REAL NOT NULL, \
	    longitude REAL NOT NULL, \
	    accuracy VARCHAR NOT NULL,\
	    timestamp DATETIME)';

	var createStatementGardener = 'CREATE TABLE IF NOT EXISTS gardener \
	    (id INTEGER NOT NULL PRIMARY KEY, \
	    site_id INTEGER NOT NULL, \
	    name VARCHAR NOT NULL)';

	var createStatementEvaluation = 'CREATE TABLE IF NOT EXISTS evaluation \
	    (id INTEGER NOT NULL PRIMARY KEY , \
	    evaluation_id INTEGER NOT NULL,\
	    evaluator_id INTEGER NOT NULL , \
	    site_id INTEGER NOT NULL , \
	    sum_rating INTEGER, \
	    date_loaded_to_device DATETIME, \
	    no_longer_exists INTEGER, \
		comments TEXT, \
	    date_posted_to_remote DATETIME, \
		date_entered_on_device_by_evaluator DATEIME, \
	    date_of_evaluation DATETIME )';

	var createStatementEvaluationAward = 'CREATE TABLE IF NOT EXISTS evaluation_award \
	    (id INTEGER PRIMARY KEY NOT NULL , \
	    award_id INTEGER NOT NULL , \
	    special_award_specified VARCHAR, \
	    evaluation_id INTEGER NOT NULL )';

	var createStatementEvaluationFactor = 'CREATE TABLE IF NOT EXISTS evaluation_factor \
	    (id INTEGER PRIMARY KEY NOT NULL , \
	    factor_id INTEGER NOT NULL , \
	    rating INTEGER NOT NULL , \
	    evaluation_id INTEGER NOT NULL )';

	var createStatementEvaluationFeature = 'CREATE TABLE IF NOT EXISTS evaluation_feature \
	    (id INTEGER PRIMARY KEY NOT NULL , \
	    evaluation_id INTEGER NOT NULL , \
	    feature_id INTEGER NOT NULL) ';

	var createStatementAward = 'CREATE TABLE IF NOT EXISTS award \
	    (id INTEGER PRIMARY KEY NOT NULL , \
	    name VARCHAR NOT NULL ) ';

	var createStatementFactor = 'CREATE TABLE IF NOT EXISTS factor \
	    (id INTEGER PRIMARY KEY NOT NULL , \
	    name VARCHAR NOT NULL ) ';

	var createStatementFeature = 'CREATE TABLE IF NOT EXISTS feature \
	    (id INTEGER PRIMARY KEY NOT NULL , \
	    name VARCHAR NOT NULL )';

	executeSql(createStatementSite);
	executeSql(createStatementSiteType);
	executeSql(createStatementGardener);
	executeSql(createStatementGeolocation);
	executeSql(createStatementEvaluation);
	executeSql(createStatementEvaluationAward);
	executeSql(createStatementEvaluationFactor);
	executeSql(createStatementEvaluationFeature);
	executeSql(createStatementAward);
	executeSql(createStatementFeature);
	executeSql(createStatementFactor);

};

function executeSql(sqlStatement) {

	db.transaction(function(tx) {

		tx.executeSql(sqlStatement, [], nullHandler, errorHandler);

	}, errorHandler, successCallBack);

};

// list the values in the database to the screen using jquery to update the
// #lbGarden element
function SelectLocationToEvaluate() {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}
	// this line clears out any content in the #lbUsers element on the page so
	// that the next few lines will show updated
	// content and not just keep repeating lines

	$('#lbLocation').html('');
	// this next section will select all the content from the User table and
	// then go through it row by row
	// appending the UserId address garden_id to the #lbUsers element on the
	// page

	var SelectStatement = 'SELECT * FROM site s \
		INNER JOIN evaluation e ON s.site_id = e.site_id;'

	db.transaction(function(transaction) {
		transaction.executeSql(SelectStatement, [], function(transaction,
				result) {
			if (result != null && result.rows != null) {

				// TODO: load all sites for
				// evaluator
				// for ( var i = 0; i <
				// result.rows.length; i++) {
				for ( var i = 0; i < result.rows.length; i++) {
					var row = result.rows.item(i);
					var location = /*
									 * row.id + ' ' + row.site_id + ' ' +
									 */row.address + ' ' + row.city + ' ' + row.state + ' '
							+ row.zip;

					/*
					 * A nice way to do it, but this blobs together everything
					 * into one long string: var a = $('<a />' + '\n');
					 * a.attr('href','#mainPage'); a.text(location);
					 * a.attr('id', 'h' + row.id); $('#lbLocation').append(a);
					 */

					// create dynamic url: on
					// click, write
					// evaluation_id to Local
					// Storage for retrieval of
					// and use for later
					$('#lbLocation').append(
							'<a href="#location" font size="7" onclick="sessionStorage.ParameterID=' // TODO:
							// use
									// siteId
									// instead
									+ row.evaluation_id + '" >' + location
									+ '  </a><br>');

					// on page show for #location, we grab the id stored is
					// SessionStorage and pass it for linking

					/*
					 * var obj = { id : row.id, garden_id : row.garden_id,
					 * address : row.address, city : row.city, state :
					 * row.state, zip : row.zip };
					 */
				}

				// $('#xxx').listview('refresh');
				// TODO: try this to see if it f
				// fixes formating problems
			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
};

// load site data for use in page div
function LoadSiteEvaluation(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	$('#lbWhere').html('');
	$('#lbWhere').val('');

	var selectStatement = 'SELECT * FROM site s INNER JOIN evaluation e \
		ON s.site_id = e.site_id \
		WHERE e.evaluation_id = ?';

	var location = null;

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function(transaction) {

		transaction.executeSql(selectStatement, [ id ], function(transaction,
				result) {
			if (result != null && result.rows != null) {

				for ( var i = 0; i < 1; i++) {// TODO clean up
					// result.rows.length; i++)
					// {
					// load row into object
					var row = result.rows.item(i);
					location = row.id + ' ' + row.site_id + ' ' + row.address
							+ ' ' + row.city + ' ' + row.state + ' ' + row.zip
							+ ' ' + row.evaluation_id;

					$('#lbWhere').append(location);

					console.log(location);
				}

			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
};

// update/insert data on location div, if needed
function UpdateLocationPage() {

	// get evaluation_id
	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	var id = sessionStorage.ParameterID;
	// date of evaluation

	var dateOfEvaluation = $('#dateOfEvaluation').val();

	console.log('dateOfEvaluation:' + dateOfEvaluation);

	if (dateOfEvaluation) {

		// update data in need of correction:
		var updateStatement = 'UPDATE evaluation  \
		SET date_of_evaluation = ? \
		WHERE evaluation_id = ?';

		console.log('Updateme:' + updateStatement);

		db.transaction(function(transaction) {
			transaction.executeSql(updateStatement, [ dateOfEvaluation, id ],
					nullHandler, errorHandler);
		});

		alert('Updated date evaluated to: ' + dateOfEvaluation);
	}

	// does not exist:
	// site update, only if checked
	if ($("#checked-exists").is(":checked")) {
		UpdateExistence();
	}

	// update 'hood if given
	var neighborhood = $('#neighborhood').val();
	console.log('neighborhood:' + neighborhood);
	if (neighborhood) {
		UpdateHood(neighborhood);
	}

	// insert gardener name if given

	var gardenerName = $('#gardenerName').val();

	console.log('gardenerName:' + gardenerName);

	if (gardenerName) {
		GetSiteId(gardenerName);
	}

}

// thing to evaluate marked as no longer exists,
function UpdateExistence() {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	// get evaluation_id
	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	var id = sessionStorage.ParameterID;

	// update to evaluation, since no_longer_exists is tied to an evaluation,
	// not a site
	var updateStatement = 'UPDATE evaluation  \
		SET no_longer_exists = 1 \
		WHERE evaluation_id = ?';

	console.log('Updateme:' + updateStatement);
	console.log('Evaluation id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function(transaction) {
		transaction.executeSql(updateStatement, [ id ], nullHandler,
				errorHandler);
	});

	// this call

	alert("Not exists successfully updated");
	return false;
};

// hood is given
function UpdateHood(neighborhood) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	// get evaluation_id
	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	var id = sessionStorage.ParameterID;

	console.log('neighborhood update:' + neighborhood);

	updateStatement = 'UPDATE site  \
			SET neighborhood = ? \
			WHERE site_id IN (SELECT site_id FROM evaluation WHERE evaluation_id = ?)';

	console.log('Updateme:' + updateStatement);
	console.log('Evaluation id:' + id);
	// this next section will select all the content from the site table
	// as
	// queried by the passed parameter

	db.transaction(function(transaction) {
		transaction.executeSql(updateStatement, [ neighborhood, id ],
				nullHandler, errorHandler);
	});

	// this call

	alert("Not exists successfully updated")
	return false;

};

// get site_id for inserting given gardener's name
function GetSiteId(gardenerName) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	// get evaluation_id
	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	var id = sessionStorage.ParameterID;

	// select list of evaluations that have been completed for upload to remote
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
					InsertGardener(row.site_id, gardenerName)

				}
			}
		}, errorHandler);
	}, errorHandler, nullHandler);

	alert("success")
	return false;
};

function InsertGardener(siteId, gardenerName) {

	// insert gardener name
	var insertStatement = 'INSERT INTO gardener  \
	(site_id, name)  VALUES (?,?)';

	console.log('insertStatement me:' + insertStatement);

	// this next section will select all the content from the site table
	// as
	// queried by the passed parameter

	db.transaction(function(transaction) {
		transaction.executeSql(insertStatement, [ siteId, gardenerName ],
				nullHandler, errorHandler);
	});

	alert("Gardener successfully inserted")
	return false;

};

// make calls to load ratings and features
function LoadRatingsFeatures() {
	var sumRating = $("#sumRating").val();

	console.log('sumRating: ' + sumRating);

	if (!isNaN(parseInt(sumRating, 10))) {
		console.log('sumRating onward: ' + sumRating);
		AssignRatings();
		AssignFeature();
	} else {
		alert('Please rate this site before saving data!')
	}

};

// from HTML form
function AssignRatings() {

	var useOfColor = $("#useOfColor").val();
	var plantVariety = $("#plantVariety").val();
	var design = $("#design").val();
	var maintenance = $("#maintenance").val();
	var environmentalStewardship = $("#environmentalStewardship").val();
	var sumRating = $("#sumRating").val();
	var generalComment = $("#generalComment").val();

	// force to be a number and then check if indeed it really is and that all
	// exist prior to submitting

	console.log('sumRating variables: ' + useOfColor + ' ' + plantVariety + ' '
			+ design + ' ' + maintenance + ' ' + environmentalStewardship);
	console.log('sumRating: ' + sumRating);
	/*
	 * if (!isNaN(parseInt(sumRating,10)) && !isNaN(parseInt(useOfColor, 10)) &&
	 * !isNaN(parseInt(plantVariety, 10)) && !isNaN(parseInt(design, 10)) &&
	 * !isNaN(parseInt(maintenance, 10)) &&
	 * !isNaN(parseInt(environmentalStewardship, 10)))
	 */
	if (!isNaN(parseInt(sumRating, 10))) {

		console.log('Assignratings: here we got to load data')

		// TODO: make lookup table factor

		// add each to db: TODO loop through object and use .each
		// load factor ratings
		LoadFactorToDb(useOfColor, 'useOfColor');
		LoadFactorToDb(plantVariety, 'plantVariety');
		LoadFactorToDb(design, 'design');
		LoadFactorToDb(maintenance, 'maintenance');
		LoadFactorToDb(environmentalStewardship, 'environmentalStewardship');
		// update specific evaluation data
		UpdateEvaluationRatingComment(sumRating, generalComment);

	}
};

function LoadFactorToDb(value, label) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var insertStatement = 'INSERT INTO evaluation_factor \
		(factor_id, rating, evaluation_id) \
		VALUES (?,?,?)';

	// get evaluation_id
	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	var id = sessionStorage.ParameterID;
	var factor_id;

	console.log('Insertstatement: ' + insertStatement);

	console.log('value and label: ' + value + ' ' + label);

	// not the most elegant manner to do this, but it works for now
	if (label == 'useOfColor') {
		factor_id = 1;
	} else if (label == 'plantVariety') {
		factor_id = 2;
	} else if (label == 'design') {
		factor_id = 3;
	} else if (label == 'maintenance') {
		factor_id = 4;
	} else if (label == 'environmentalStewardship') {
		factor_id = 5;
	}

	// this is the section that actually inserts the values into the User table
	db.transaction(function(transaction) {
		transaction.executeSql(insertStatement, [ factor_id, value, id ],
				nullHandler, errorHandler);
	});
	// this calls the function that will show what is in the User table in the
	// database
	// ListDBValues();
	return false;
};

function UpdateEvaluationRatingComment(sumRating, generalComment) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var now = new Date();

	// get evaluation_id
	console.log('Parameter ID in ratings : ' + sessionStorage.ParameterID);
	var id = sessionStorage.ParameterID;

	if (generalComment) {

		var updateStatement = 'UPDATE evaluation \
		SET sum_rating = ?, \
		comments = ?, \
		date_entered_on_device_by_evaluator  = ?\
		WHERE evaluation_id = ?';

		console.log('Updatestatement: ' + updateStatement);

		db.transaction(function(transaction) {
			transaction.executeSql(updateStatement, [ sumRating,
					generalComment, now, id ], nullHandler, errorHandler);
		});

	} else {
		var updateStatement = 'UPDATE evaluation \
			SET sum_rating = ?, \
			date_entered_on_device_by_evaluator  = ?\
			WHERE evaluation_id = ?';

		console.log('Updatestatement: ' + updateStatement);

		db.transaction(function(transaction) {
			transaction.executeSql(updateStatement, [ sumRating,
					now, id ], nullHandler, errorHandler);
		});
	}

	alert("Factor ratings successfully saved!");

	// this call
	return false;
};

// from HTML form
function AssignFeature() {

	var features = $("#featuresMenu").val();

	console.log("featuresMenu:" + result);

	if (features) {

		// kludgey method: write items in multiple select array to string for
		// evaluation
		var items = [];
		$('#featuresMenu option:selected').each(function() {
			items.push($(this).val());
		});

		var result = items.join(',');

		// TODO: make lookup table factor
		console.log("featuresMenu 2:" + result);

		if (result == '1') {
			LoadFeatureToDb(1);
			console.log("Woop!:" + result);
		} else if (result == '2') {
			LoadFeatureToDb(2);
			console.log("Woop, Woop!:" + result);
		} else if (result == '1,2') {
			LoadFeatureToDb(3);
			console.log("Woop! Woop!:" + result);
		}

	}
};

// load site features tied to evaluation
function LoadFeatureToDb(value) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var insertStatement = 'INSERT INTO evaluation_feature \
		(feature_id, evaluation_id) \
		VALUES (?,?)'

	// get evaluation_id
	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	var id = sessionStorage.ParameterID;

	console.log("insertStatement:" + insertStatement);

	// this is the section that actually inserts the values into the User table
	db.transaction(function(transaction) {
		transaction.executeSql(insertStatement, [ value, id ], nullHandler,
				errorHandler);
	});

	alert("Garden features successfully saved!");
	// this calls the function that will show what is in the User table in the
	// database
	// ListDBValues();
	return false;
};

function AssignAward() {

	// TODO: make lookup table factor

	/*
	 * <option value="1"Best Residential </option<option value="2"Best
	 * Residential Raingarden </option<option value="3"Best Boulevard </option<option
	 * value="4"Best Business </option<option value="5"> Best Raingarden
	 * </option<option value="6"Best Apartment </option> <option value="7"Best
	 * Community </option<option value="8"Best Public </option<option
	 * value="9"Best School </option<option value="10"Best Congregation
	 * </option<option value="11"Best Window Box/Container </option<option
	 * value="12"Special award (specify below:) </option>
	 */

	var awardId = $("#awardMenu").val();
	var specialAward = $("#specialAward").val();
	var sumRating = $("#sumRating").val();

	// force to be a number and then check if indeed it really is and that all
	// exist prior to submitting

	if (!isNaN(parseInt(sumRating, 10))) {

		if (sumRating < 18 && !isNaN(parseInt(sumRating, 10))) {
			// $(".hide_me").show();
			alert("This garden should only be considered for best boulevard or container garden, since they are not an EG!");
		}

		if (!isNaN(parseInt(awardId, 10))) {
			console.log('award woop!: ');

			LoadAwardToDb(awardId, specialAward);

			/*
			 * if (awardId != 12 && awardId) { console.log('award woop woop!:
			 * '); LoadAwardToDb(awardId, ''); } else if (awardId == 12 &&
			 * specialAward) { console.log('award woooooooop!: ');
			 * LoadAwardToDb(awardId, specialAward); }
			 */

		}
	} else {
		alert("Need a rating in order to give an award!");
	}

};

function LoadAwardToDb(value, comment) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var insertStatement = 'INSERT INTO evaluation_award \
		(award_id, special_award_specified, evaluation_id) \
		VALUES (?,?,?)';

	// get evaluation_id
	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	var id = sessionStorage.ParameterID;

	console.log('insertStatement: ' + insertStatement);

	// this is the section that actually inserts the values into the User table
	db.transaction(function(transaction) {
		transaction.executeSql(insertStatement, [ value, comment, id ],
				nullHandler, errorHandler);
	});

	alert("Award successfully saved!");
	// this calls the function that will show what is in the User table in the
	// database
	// ListDBValues();
	return false;
};

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

	// select list of evaluations that have been completed for upload to remote
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

	// insert gardener name
	var insertStatement = 'INSERT INTO geo_location  \
		(site_id, latitude,longitude,accuracy,timestamp)  VALUES (?,?,?,?,?)';

	console.log('insertStatement me:' + insertStatement);

	// this next section will select all the content from the site table
	// as
	// queried by the passed parameter

	db.transaction(function(transaction) {
		transaction.executeSql(insertStatement, [ siteId, latitude, longitude,
				accuracy, timeStamp ], nullHandler, errorHandler);
	});

	alert("Geolocale successfully inserted")

	return false;

};

// function to capture requested object as a variable:
// $.getJSON will run asynchronously and hence Javascript will progress past the
// expression that invokes it even before its success callback fires,
// thus, there are no guarantees that the variable will capture any data
var json = function() {

	// TODO: use
	// URL/evaluations.php?callback=&evaluator_id=112 // Replace URL with appropriate URI
	// to load site with garden and address objects
	// var url =
	// "URL/gardens.php?output=json&callback=?";
	// grab all evaluation data specific to an evaluator_id
	var url = "URL/evaluations.php?callback=&evaluator_id=265"; // need callback for JSONP cross domain requesst
	// 116=Becky

	var json = [];

	// set as a deferred object
	var reqObj = $.ajax({
		async : false,
		global : false,
		url : url,
		dataType : "jsonp"
	/*
	 * 'success' : function(data) { json = data; alert("Success!");
	 * console.log('JSON ' + json[2].garden_id); LoadJsonObject(json); }
	 */

	});

	reqObj.done(function(data) {
		json = data;
		// alert("Success!");
		console.log('JSON ' + json[2].garden.garden_id);
		alert('JSON ' + json[2].garden.garden_id);
		LoadVariables(json); // make variable available outside of closure
	});

	reqObj.fail(function(e, jqxhr, settings, exception) {
		console.log(e);
	});

	// LoadJsonObject(window.reqObj ); */

};

// console.log('Biff' + typeof json);

// do stuff with the returned data from success closure defined above
function LoadVariables(val) {

	var site_id;
	var evaluation_id;
	var address;
	var city;
	var state;
	var zip;
	var evaluator_id;
	var evaluation_id;

	// for ( var i = 0; i < val.length; i++) {
	for ( var i = 0; i < val.length; i++) {

		site_id = val[i].garden.garden_id;
		address = val[i].garden.address.address;
		city = val[i].garden.address.city;
		state = val[i].garden.address.state;
		zip = val[i].garden.address.zip;
		evaluation_id = val[i].evaluation_id;
		evaluator_id = val[i].evaluator.evaluator_id;
		console.log('site info: LoadJsonObject:' + i + ' ' + site_id + ' '
				+ address + ' ' + city + ' ' + state + ' ' + zip
				+ ' completed ' + val[i].completed);

		if (val[i].completed == 0) {
			LoadDbSite(site_id, address, city, state, zip);
			LoadDbEvaluation(site_id, evaluator_id, evaluation_id);
		}

	}

};

// load site data
function LoadDbSite(site_id, address, city, state, zip) {

	console.log('site info: LoadDb:' + site_id + ' ' + address + ' ' + city
			+ ' ' + state + ' ' + zip);

	alert('site info: LoadDb:' + site_id + ' ' + address + ' ' + city + ' '
			+ state + ' ' + zip);

	var InsertStatement = 'INSERT INTO site(site_id, \
		site_type_id, \
		address,  \
		city,  \
		state,  \
		zip) \
		VALUES (?,?,?,?,?,?)';

	// this is the section that actually inserts the values into the User table
	db.transaction(function(transaction) {
		transaction.executeSql(InsertStatement, [ site_id, 1, address, city,
				state, zip ], nullHandler, errorHandler);
	});
	// this calls the function that will show what is in the User table in the
	// database
	// ListDBValues();
	return false;
};

// load evaluation data
function LoadDbEvaluation(site_id, evaluator_id, evaluation_id) {

	var now = new Date();

	var InsertStatement = 'INSERT INTO evaluation(site_id, \
		evaluator_id, \
		evaluation_id,\
		date_loaded_to_device) VALUES (?,?,?,?)';

	// var now = Date.parse('today').toString('MM/dd/yyyy');

	console.log('evaluation info: LoadDb:' + site_id + ' ' + ' ' + evaluator_id
			+ ' ' + evaluation_id + ' ' + now);

	alert('evaluation info: LoadDb:' + site_id + ' ' + ' ' + evaluator_id + ' '
			+ evaluation_id + ' ' + now);

	// this is the section that actually inserts the values into the User table
	db.transaction(function(transaction) {
		transaction.executeSql(InsertStatement, [ site_id, evaluator_id,
				evaluation_id, now ], nullHandler, errorHandler);
	});

	// this calls the function that will show what is in the User table in the
	// database
	// ListDBValues();
	return false;
};

function SelectEvaluationToPost() {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}
	// this line clears out any content in the #lbUsers element on the page so
	// that the next few lines will show updated
	// content and not just keep repeating lines

	$('#lbLocation').html('');
	// this next section will select all the content from the User table and
	// then go through it row by row
	// appending the UserId address garden_id to the #lbUsers element on the
	// page

	// select list of evaluations that have been completed for upload to remote
	var selectStatement = 'SELECT * FROM evaluation e  \
		INNER JOIN site s ON s.site_id = e.site_id  \
		WHERE (e.date_entered_on_device_by_evaluator IS NOT NULL) AND ((e.date_of_evaluation IS NOT NULL)  OR (e.no_longer_exists = 1)) \
		ORDER BY e.date_entered_on_device_by_evaluator';

	console.log('selectStatement: ' + selectStatement);

	db.transaction(function(transaction) {
		transaction.executeSql(selectStatement, [], function(transaction,
				result) {
			if (result != null && result.rows != null) {

				// TODO: load all sites for
				// evaluator
				// for ( var i = 0; i <
				// result.rows.length; i++) {
				for ( var i = 0; i < result.rows.length; i++) {
					var row = result.rows.item(i);
					var evaluation = row.evaluation_id + ' ' + row.address
							+ ' ' + row.city + ' ' + row.state + ' ' + row.zip
							+ ' date posted to remote'
							+ row.date_posted_to_remote;

					/*
					 * A nice way to do it, but this blobs together everything
					 * into one long string: var a = $('<a />' + '\n');
					 * a.attr('href','#mainPage'); a.text(location);
					 * a.attr('id', 'h' + row.id); $('#lbLocation').append(a);
					 */

					// create dynamic url: on
					// click, write
					// evaluation_id to Local
					// Storage for retrieval of
					// and use for later
					$('#lbUploadEvaluation').append(
							'<a href="#dataToRemote" font size="7" onclick="sessionStorage.ParameterID=' // TODO:
							// use
									// siteId
									// instead
									+ row.evaluation_id + '" >' + evaluation
									+ '  </a><br>');

				}

			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
};

function AssembleDataToPost(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}
	// this line clears out any content in the #lbUsers element on the page so
	// that the next few lines will show updated
	// content and not just keep repeating lines

	$('#lbUploadEvaluation').html('');
	$('#lbUploadEvaluation').val('');

	var currentYear = (new Date).getFullYear();

	// kludge until edit/delete records functionality is added

	var selectStatement = 'SELECT * FROM evaluation e INNER JOIN site s \
    ON e.site_id = s.site_id LEFT OUTER JOIN \
        (SELECT * FROM gardener g INNER JOIN \
            evaluation e ON e.site_id = g.site_id  \
            WHERE e.evaluation_id = ? \
            ORDER BY id Desc \
            LIMIT 1) AS g ON s.site_id  = g.site_id LEFT OUTER JOIN \
        (SELECT * FROM evaluation_award ea INNER JOIN \
            evaluation e ON e.evaluation_id = ea.evaluation_id \
            WHERE e.evaluation_id = ? \
            ORDER BY id Desc \
            LIMIT 1) AS ea ON e.evaluation_id = ea.evaluation_id LEFT OUTER JOIN \
        (SELECT * FROM evaluation_feature ef INNER JOIN \
            evaluation e ON e.evaluation_id = ef.evaluation_id  \
            WHERE e.evaluation_id = ? \
            ORDER BY id Desc \
            LIMIT 1) AS efeature ON e.evaluation_id = efeature.evaluation_id LEFT OUTER JOIN \
        (SELECT * FROM geo_location gl INNER JOIN \
            evaluation e ON e.site_id = gl.site_id\
            WHERE e.evaluation_id = ? \
            ORDER BY id Desc \
            LIMIT 1) AS gl ON s.site_id  = gl.site_id \
    WHERE e.evaluation_id = ? \
            ORDER BY id Desc \
		LIMIT 1';

	/*
	 * var selectStatement = 'SELECT * FROM evaluation e LEFT OUTER JOIN
	 * evaluation_factor efactor \ ON e.evaluation_id = efactor.evaluation_id \
	 * WHERE e.evaluation_id = ?';
	 */

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id to POST:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db
			.transaction(
					function(transaction) {
						transaction
								.executeSql(
										selectStatement,
										[ id, id, id, id, id ],
										function(transaction, result) {
											if (result != null
													&& result.rows != null) {
												for ( var i = 0; i < result.rows.length; i++) {
													var row = result.rows
															.item(i);

													// assign rating
													var rating;

													// TODO: make the damn
													// lookup tables!

													if (row.sum_rating >= 18) {
														rating = 'EG';
													} else if (row.sum_rating >= 14
															&& row.sum_rating < 18) {
														rating = 'GD';
													} else if (row.sum_rating >= 9
															&& row.sum_rating < 14) {
														rating = 'GM';
													} else if (row.sum_rating >= 5
															&& row.sum_rating < 9) {
														rating = 'CA';
													} else {
														rating = '';
													}

													// features

													var rain_garden = 0;
													var rain_barrel = 0;
													if (row.feature_id == 1) {
														rain_garden = 1;
													} else if (row.feature_id == 2) {
														rain_barrel = 1;
													} else if (row.feature_id == 3) {
														rain_garden = 1;
														rain_barrel = 1;
													}
													// award

													var bestof = 0;
													var nateSiegelAward = 0;
													var specialAwardSpecified = null;

													if (row.award_id == 1) {
														bestof = 'Residential';
													} else if (row.award_id == 2) {
														bestof = 'Residential Raingarden';
													} else if (row.award_id == 3) {
														bestof = 'Boulevard';
													} else if (row.award_id == 4) {
														bestof = 'Business';
													} else if (row.award_id == 5) {
														bestof = 'Business Raingarrden';
													} else if (row.award_id == 6) {
														bestof = 'Apartment';
													} else if (row.award_id == 7) {
														bestof = 'Community';
													} else if (row.award_id == 8) {
														bestof = 'Public';
													} else if (row.award_id == 9) {
														bestof = 'School';
													} else if (row.award_id == 10) {
														bestof = 'Congregation';
													} else if (row.award_id == 11) {
														bestof = 'Windowbox/container';
													} else if (row.award_id == 12) {
														bestof = 'NateSiegel';
														nateSiegelAward = 1;
													} else if (row.award_id == 13) {
														bestof = 'Special';
													}

													var obj = {
														evaluation_id : row.evaluation_id,
														score : row.sum_rating,
														rating : rating,
														rating_year : currentYear, // **
														bestof : bestof,
														special_award_specified : row.special_award_specified,
														nate_siegel_award : nateSiegelAward, // **
														score_card : {
															color : null,
															plant_variety : null,
															design : null,
															maintenance : null,
															environmental_stewardship : null
														},
														date_evaluated : row.date_of_evaluation, // was:
														// date_entered_on_device_by_evaluator,
														general_comments : row.comments,
														evaluator : {
															// evaluator_id :
															// row.evaluator_id
															// // need to
															// hardcode for my
															// oversight!
															evaluator_id : '265',
															completed_by : '265'
														},
														rainbarrel : rain_barrel,
														raingarden : rain_garden,
														garden : {
															garden_id : row.site_id,
															no_longer_exists : row.no_longer_exists,
															address : {
																neighborhood : row.neighborhood,
																county : 'Hennepin'
															},
															gardener : {
																name : row.name
															},
															geolocation : {
																latitude : row.latitude,
																longitude : row.longitude,
																accuracy : row.accuracy
															},
														},
													};

													var encoded = $.toJSON(obj);
													alert("data" + encoded);
													addFactorRating(encoded,
															obj, id);
													console
															.log('Session evaluation_id onward to POST!!!');
													// SendJson(obj);
												}
											}
										}, errorHandler);
					}, errorHandler, nullHandler);
	return;
};

// append to object as subobject
function addFactorRating(encoded, obj, id) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var SelectStatement = 'SELECT * FROM evaluation_factor  \
		WHERE evaluation_id = ? \
		ORDER BY id Desc LIMIT 5';

	console.log('Ratings factor add to obj SelectStatement' + SelectStatement);
	console.log('Session evaluation_id to POST:' + id);

	db
			.transaction(
					function(transaction) {
						transaction
								.executeSql(
										SelectStatement,
										[ id ],
										function(transaction, result) {
											if (result != null
													&& result.rows != null) {
												// for ( var i = 0; i <
												// result.rows.length; i++) {
												for ( var i = 0; i < 5; i++) {
													var row = result.rows
															.item(i);
													var factor;
													console
															.log('queried row'
																	+ row.rating
																	+ '  evaluation'
																	+ row.evaluation_id);

													// append to string
													if (i == 4) {
														obj.score_card["color"] = row.rating;
													} else if (i == 3) {
														obj.score_card["plant_variety"] = row.rating;
													} else if (i == 2) {
														obj.score_card["design"] = row.rating;
													} else if (i == 1) {
														obj.score_card["maintenance"] = row.rating;
													} else if (i == 0) {
														obj.score_card["environmental_stewardship"] = row.rating;
													}

													if (i == 4) {

														console
																.log(' '
																		+ $
																				.toJSON(obj));

														alert('encoded'
																+ $.toJSON(obj));

														SendJson(obj, id)
													}
												}
											}
										}, errorHandler);
					}, errorHandler, nullHandler);
	return;
};

function SendJson(obj, id) {

	$.ajax({
		type : "POST",
		url: "URL/updateData.php", // to POST: replace URL with appropriate address for JSON POST
		// updates/edits
		//url : "URL/showPostedData.php", // for
		// testing
		// dataType : "json",
		// data: { name: "John", location: "Boston" },
		data : obj,
		success : function(data, textStatus, jqXHR) {
			console.log('success' + textStatus + jqXHR.responseText);
			alert(textStatus + jqXHR.responseText);
			updateWhenPosted(id);
		},
		error : function() {
			console.log('failure');
		}
	});

};

function updateWhenPosted(id) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var now = new Date();

	// get evaluation_id
	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	var id = sessionStorage.ParameterID;

	// update to evaluation, since no_longer_exists is tied to an evaluation,
	// not a site
	var updateStatement = 'UPDATE evaluation  \
		SET date_posted_to_remote = ? \
		WHERE evaluation_id = ?';

	console.log('Updateme:' + updateStatement);
	console.log('Evaluation id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function(transaction) {
		transaction.executeSql(updateStatement, [ now, id ], nullHandler,
				errorHandler);
	});

	// this call

	alert("Fini!!!!!")
	return false;

}

// TODO: fix the following monstrocity!! meant only as a short-term fix for list
// view

function AsssembleEvaluationView(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}
	// this line clears out any content in the #lbUsers element on the page so
	// that the next few lines will show updated
	// content and not just keep repeating lines

	$('#lbViewEvaluation').html('');
	$('#lbViewEvaluation').val('');

	var currentYear = (new Date).getFullYear();

	// kludge until edit/delete records functionality is added
	var selectStatement = 'SELECT * FROM evaluation e INNER JOIN site s \
    ON e.site_id = s.site_id LEFT OUTER JOIN \
        (SELECT * FROM gardener g INNER JOIN \
            evaluation e ON e.site_id = g.site_id  \
            WHERE e.evaluation_id = ? \
            ORDER BY id Desc \
            LIMIT 1) AS g ON s.site_id  = g.site_id LEFT OUTER JOIN \
        (SELECT * FROM evaluation_award ea INNER JOIN \
            evaluation e ON e.evaluation_id = ea.evaluation_id \
            WHERE e.evaluation_id = ? \
            ORDER BY id Desc \
            LIMIT 1) AS ea ON e.evaluation_id = ea.evaluation_id LEFT OUTER JOIN \
        (SELECT * FROM evaluation_feature ef INNER JOIN \
            evaluation e ON e.evaluation_id = ef.evaluation_id  \
            WHERE e.evaluation_id = ? \
            ORDER BY id Desc \
            LIMIT 1) AS efeature ON e.evaluation_id = efeature.evaluation_id LEFT OUTER JOIN \
        (SELECT * FROM geo_location gl INNER JOIN \
            evaluation e ON e.site_id = gl.site_id\
            WHERE e.evaluation_id = ? \
            ORDER BY id Desc \
            LIMIT 1) AS gl ON s.site_id  = gl.site_id \
    WHERE e.evaluation_id = ? \
            ORDER BY id Desc \
			LIMIT 1';

	/*
	 * var selectStatement = 'SELECT * FROM evaluation e LEFT OUTER JOIN
	 * evaluation_factor efactor \ ON e.evaluation_id = efactor.evaluation_id \
	 * WHERE e.evaluation_id = ?';
	 */

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id to POST:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db
			.transaction(
					function(transaction) {
						transaction
								.executeSql(
										selectStatement,
										[ id, id, id, id, id ],
										function(transaction, result) {
											if (result != null
													&& result.rows != null) {
												for ( var i = 0; i < result.rows.length; i++) {
													var row = result.rows
															.item(i);

													// assign rating
													var rating;

													// TODO: make the damn
													// lookup tables!

													if (row.sum_rating >= 18) {
														rating = 'EG';
													} else if (row.sum_rating >= 14
															&& row.sum_rating < 18) {
														rating = 'GD';
													} else if (row.sum_rating >= 9
															&& row.sum_rating < 14) {
														rating = 'GM';
													} else if (row.sum_rating >= 5
															&& row.sum_rating < 9) {
														rating = 'CA';
													} else {
														rating = '';
													}

													// features

													var rain_garden = 0;
													var rain_barrel = 0;
													if (row.feature_id == 1) {
														rain_garden = 1;
													} else if (row.feature_id == 2) {
														rain_barrel = 1;
													} else if (row.feature_id == 3) {
														rain_garden = 1;
														rain_barrel = 1;
													}
													// award

													var bestof = 0;
													var nateSiegelAward = 0;
													var specialAwardSpecified = null;

													if (row.award_id == 1) {
														bestof = 'Residential';
													} else if (row.award_id == 2) {
														bestof = 'Residential Raingarden';
													} else if (row.award_id == 3) {
														bestof = 'Boulevard';
													} else if (row.award_id == 4) {
														bestof = 'Business';
													} else if (row.award_id == 5) {
														bestof = 'Business Raingarrden';
													} else if (row.award_id == 6) {
														bestof = 'Apartment';
													} else if (row.award_id == 7) {
														bestof = 'Community';
													} else if (row.award_id == 8) {
														bestof = 'Public';
													} else if (row.award_id == 9) {
														bestof = 'School';
													} else if (row.award_id == 10) {
														bestof = 'Congregation';
													} else if (row.award_id == 11) {
														bestof = 'Windowbox/container';
													} else if (row.award_id == 12) {
														bestof = 'NateSiegel';
														nateSiegelAward = 1;
													} else if (row.award_id == 13) {
														bestof = 'Special';
													}

													if (!row.no_longer_exists) {
														var no_longer_exists = 0;
													} else {
														var no_longer_exists = 1;
													}

													var obj = {
														evaluation_id : row.evaluation_id,
														score : row.sum_rating,
														rating : rating,
														rating_year : currentYear, // **
														bestof : bestof,
														special_award_specified : row.special_award_specified,
														nate_siegel_award : nateSiegelAward, // **
														score_card : {
															color : null,
															plant_variety : null,
															design : null,
															maintenance : null,
															environmental_stewardship : null
														},
														date_evaluated : row.date_of_evaluation,
														general_comments : row.comments,
														evaluator : {
															// evaluator_id :
															// row.evaluator_id
															// // need to
															// hardcode for my
															// oversight!
															evaluator_id : '265',
															completed_by : '265'
														},
														rainbarrel : rain_barrel,
														raingarden : rain_garden,
														garden : {
															garden_id : row.site_id,
															no_longer_exists : no_longer_exists,
															address : {
																neighborhood : row.neighborhood,
																county : 'Hennepin',
															},
															gardener : {
																name : row.name
															},
															geolocation : {
																latitude : row.latitude,
																longitude : row.longitude,
																accuracy : row.accuracy
															},
														},
													};

													var encoded = $.toJSON(obj);
													alert("data" + encoded);
													addFactorRatingView(
															encoded, obj, id);
													console
															.log('Session evaluation_id onward to POST!!!');
													// SendJson(obj);
												}
											}
										}, errorHandler);
					}, errorHandler, nullHandler);
	return;
};

// append to object as subobject
function addFactorRatingView(encoded, obj, id) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var SelectStatement = 'SELECT * FROM evaluation_factor  \
		WHERE evaluation_id = ? \
		ORDER BY id Desc LIMIT 5';

	console.log('Ratings factor add to obj SelectStatement' + SelectStatement);
	console.log('Session evaluation_id to POST:' + id);

	db
			.transaction(
					function(transaction) {
						transaction
								.executeSql(
										SelectStatement,
										[ id ],
										function(transaction, result) {
											if (result != null
													&& result.rows != null) {
												// for ( var i = 0; i <
												// result.rows.length; i++) {
												for ( var i = 0; i < result.rows.length; i++) {
													var row = result.rows
															.item(i);
													var factor;
													console
															.log('queried row'
																	+ row.rating
																	+ '  evaluation'
																	+ row.evaluation_id);

													// append to string
													if (i == 4) {
														obj.score_card["color"] = row.rating;
													} else if (i == 3) {
														obj.score_card["plant_variety"] = row.rating;
													} else if (i == 2) {
														obj.score_card["design"] = row.rating;
													} else if (i == 1) {
														obj.score_card["maintenance"] = row.rating;
													} else if (i == 0) {
														obj.score_card["environmental_stewardship"] = row.rating;
													}

													if (i == 4) {
														console
																.log(' '
																		+ $
																				.toJSON(obj));

														alert('encoded'
																+ $.toJSON(obj));

													}
												}
											}
										}, errorHandler);
					}, errorHandler, nullHandler);
	return;
};

// more eembarassing kludginess to fill in for actual data view lists

function LoadEvaluation(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	$('#lbEvaluation').html('');
	$('#lbEvaluation').val('');

	var selectStatement = 'SELECT * FROM evaluation e \
		WHERE e.evaluation_id = ?';

	var evaluation = null;

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function(transaction) {

		transaction.executeSql(selectStatement, [ id ], function(transaction,
				result) {
			if (result != null && result.rows != null) {

				for ( var i = 0; i < result.rows.length; i++) {// TODO clean up
					// result.rows.length; i++)
					// {
					// load row into object

					var row = result.rows.item(i);
					evaluation = row.id + '  evaluation_id:'
							+ row.evaluation_id + ' evaluator_id:'
							+ row.evaluator_id + ' site_id:' + row.site_id
							+ ' score:' + row.sum_rating + ' date_evaluated: '
							+ row.date_of_evaluation + ' does not exist: '
							+ row.no_longer_exists + ' comment:' + row.comments
							+ '<br>';

					$('#lbEvaluation').append(evaluation);

					console.log(evaluation);
				}

			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
};

function LoadSite(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	$('#lbSite').html('');
	$('#lbSite').val('');

	var selectStatement = 'SELECT * FROM evaluation e INNER JOIN \
		site s ON s.site_id = e.site_id \
		WHERE e.evaluation_id = ?';

	var site = null;

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function(transaction) {

		transaction.executeSql(selectStatement, [ id ], function(transaction,
				result) {
			if (result != null && result.rows != null) {

				for ( var i = 0; i < result.rows.length; i++) {// TODO clean up
					// result.rows.length; i++)
					// {
					// load row into object
					var row = result.rows.item(i);
					site = row.id + ' site_id:' + row.site_id + ' address:'
							+ row.address + ', ' + row.city + ', ' + row.state
							+ ', ' + row.zip + ' neighborhood: '
							+ row.neighborhood + '<br>';

					$('#lbSite').append(site);

					console.log(site);
				}

			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
};

function LoadEvaluationAward(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	$('#lbAward').html('');
	$('#lbAward').val('');

	var selectStatement = 'SELECT * FROM evaluation_award ea \
		WHERE ea.evaluation_id = ?';

	var award = null;

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function(transaction) {

		transaction.executeSql(selectStatement, [ id ], function(transaction,
				result) {
			if (result != null && result.rows != null) {

				for ( var i = 0; i < result.rows.length; i++) {// TODO clean up
					// result.rows.length; i++)
					// {
					// load row into object
					var row = result.rows.item(i);
					award = row.id + ' award_id:' + row.award_id
							+ ' special_award:' + row.special_award_specified
							+ ' evaluation_id:' + row.evaluation_id + '<br>';

					$('#lbAward').append(award);

					console.log(award);
				}

			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
};

function LoadEvaluationFactor(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	$('#lbFactor').html('');
	$('#lbFactor').val('');

	var selectStatement = 'SELECT * FROM  evaluation_factor ef \
		WHERE ef.evaluation_id = ?';

	var factor = null;

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function(transaction) {

		transaction.executeSql(selectStatement, [ id ], function(transaction,
				result) {
			if (result != null && result.rows != null) {

				for ( var i = 0; i < result.rows.length; i++) {// TODO clean up
					// result.rows.length; i++)
					// {
					// load row into object
					var row = result.rows.item(i);
					factor = row.id + ' factor_id:' + row.factor_id
							+ ' rating:' + row.rating + ' evaluation_id:'
							+ row.evaluation_id + '<br>';

					$('#lbFactor').append(factor);

					console.log(factor);
				}

			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
};

function LoadEvaluationFeature(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	$('#lbFeature').html('');
	$('#lbFeature').val('');

	var selectStatement = 'SELECT * FROM  evaluation_feature ef \
		WHERE ef.evaluation_id = ?';

	var feature = null;

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function(transaction) {

		transaction.executeSql(selectStatement, [ id ], function(transaction,
				result) {
			if (result != null && result.rows != null) {

				for ( var i = 0; i < result.rows.length; i++) {// TODO clean up
					// result.rows.length; i++)
					// {
					// load row into object
					var row = result.rows.item(i);
					feature = row.id + ' feature:' + row.feature_id
							+ ' evaluation_id:' + row.evaluation_id + '<br>';

					$('#lbFeature').append(feature);

					console.log(feature);
				}

			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
};

function LoadGeolocation(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	$('#lbGeolocale').html('');
	$('#lbGeolocale').val('');

	var selectStatement = 'SELECT g.id, g.site_id, g.latitude, g.longitude, g.accuracy, g.timestamp, e.evaluation_id \
		FROM geo_location g INNER JOIN \
        site s ON g.site_id = s.site_id INNER JOIN evaluation e \
        ON s.site_id = e.site_id \
        WHERE e.evaluation_id = ? \
        GROUP BY g.id, g.site_id, g.latitude, g.longitude, g.accuracy, g.timestamp,e.evaluation_id ';

	var geolocale = null;

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function(transaction) {

		transaction.executeSql(selectStatement, [ id ], function(transaction,
				result) {
			if (result != null && result.rows != null) {

				for ( var i = 0; i < result.rows.length; i++) {// TODO clean up
					// result.rows.length; i++)
					// {
					// load row into object
					var row = result.rows.item(i);
					geolocale = row.id + ' site_id:' + row.site_id
							+ ' latitude:' + row.latitude + ' longitude:'
							+ row.longitude + ' accuracy:' + row.accuracy
							+ ' timestamp:' + row.timestamp + ' evaluation_id:'
							+ row.evaluation_id + '<br>';

					$('#lbGeolocale').append(geolocale);

					console.log(geolocale);
				}

			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
};

function LoadGardener(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	$('#lbGardener').html('');
	$('#lbGardener').val('');

	var selectStatement = 'SELECT g.id, g.name, g.site_id, e.evaluation_id \
		FROM gardener g INNER JOIN \
		site s ON s.site_id = g.site_id INNER JOIN \
		evaluation e ON s.site_id = e.site_id \
		WHERE e.evaluation_id = ? \
		GROUP BY g.id, g.name, g.site_id, e.evaluation_id ';

	var gardener = null;

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function(transaction) {

		transaction.executeSql(selectStatement, [ id ], function(transaction,
				result) {
			if (result != null && result.rows != null) {

				for ( var i = 0; i < result.rows.length; i++) {// TODO clean up
					// result.rows.length; i++)
					// {
					// load row into object
					var row = result.rows.item(i);
					gardener = row.id + ' site_id:' + row.site_id + ' name:'
							+ row.name + ' evaluation_id:' + row.evaluation_id
							+ '<br>';

					$('#lbGardener').append(gardener);

					console.log(gardener);
				}

			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
};