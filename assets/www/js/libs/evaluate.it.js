// TODO: 
// redesign #selectLocationToEvaluate using template to menu 
// redesign #postToRemote using template to menu on HTML form to utilize fn selectImage if so desire - check box - to upload an image to remote server
// date of evaluation: better control with a DatePicker
// validation: neighborhood, others, as per model using backboneValidateAll
// evaluator_id as a variable for completedBy and for filter to load data
// select/lookup for evaluator_id
// secure cookie auth
// ensure no dups inserted into tables
// clear form: rather kludgy... need to address through refactoring
// better style!


// refactorization
// MVC (backbone.js, require.js)

// global variables and functions
var	db, 
	shortName = 'EvaluateItDB', 
	version = '1.0', 
	displayName = 'EvaluateItDB', 
	maxSize = 90000,
	onError,
	onSuccess,
	addFactorRating,
	addFactorRatingView,
	assignFeature,
	assignRating,
	getSiteId,
	initializeParamaterGetSiteId,
	insertGardener,
	insertGeolocation,
	insertGeolocationToDb,
	loadAwrdToDb,
	loadDbSite,
	loadAwardToDb,
	loadDbEvaluation,
	loadFactorToDb,
	loadFeatureToDb,
	loadVariable,
	onBodyLoad,
	onError,
	onSuccess,
	postToRemote,
	updateEvaluationRatingComment,
	updateExistence,
	updateHood,
	updateWhenPosted,
	postError,
	postSuccess,
	postWithImage,
	selectImage,
	assembleDataToPost,
	loadEvaluation,
	loadEvaluationFactor,
	loadEvaluationAward,
	loadEvaluationFeature,
	loadGardener,
	loadSite,
	loadSiteEvaluation,
	loadGeolocation,
	selectLocation,
	collection,
	jsonOut;
	
$(document).ready(function () {
	
	// bind actions to controls to hide or show items in div: 
	$("#garden").hide();

	$("#mainMenu").change(function () {
		var value = $(this).val();

		if (value !== "1") {
			$("#garden").hide();
		} else {
			$("#garden").show();
		}

	});

	// clear all form elements: TODO need a better method!!!
	$(function () {
		$('#res').bind('click', function () {
			$('#locationForm')[0].reset();
			$("input[type='checkbox']").attr("checked", false).checkboxradio("refresh");
		});
	});
	
	// TODO - need to change to a class for brevity
	$('#btn-reset').live('click',
		function () {
		
			var myselect = $("select#useOfColor"); // TODO: use class to simplify code

			myselect[0].selectedIndex = 0;
			myselect.selectmenu("refresh");

			myselect = $("select#plantVariety");
			myselect[0].selectedIndex = 0;
			myselect.selectmenu("refresh");

			myselect = $("select#design");
			myselect[0].selectedIndex = 0;
			myselect.selectmenu("refresh");

			myselect = $("select#maintenance");
			myselect[0].selectedIndex = 0;
			myselect.selectmenu("refresh");

			myselect = $("select#environmentalStewardship");
			myselect[0].selectedIndex = 0;
			myselect.selectmenu("refresh");

			myselect = $("select#featuresMenu");
			myselect[0].selectedIndex = 0;
			myselect.selectmenu("refresh");

			$("input[type='checkbox']").attr("checked", false).checkboxradio("refresh");
			$("#generalComment").val('');
			$("#sumRating").val('');

		});

	$('#myElement').live('click', function () {
		alert($(this).data('id'));
	});

});

$(function () {
	$('#btn').bind('click', function () {
		var myselect = $("select#awardMenu"); // TODO: use class to simplify code
		myselect[0].selectedIndex = 0;
		myselect.selectmenu("refresh");

		$("#specialAward").val('');
	});
});

// when loading this element retrieve value of ID from Session Storage: this
// will allow for use in data linking
$('#toEvaluate').live('pageshow', function (event, ui) {
	
	console.log('Parameter ID: ' + sessionStorage.ParameterID);

	loadSiteEvaluation(sessionStorage.ParameterID);

	// console.log('Selection of location yields:' +
	// SelectValues(sessionStorage.ParameterID));
});

$('#dataToRemote').live('pageshow', function (event, ui) {
	console.log('Parameter ID: ' + sessionStorage.ParameterID);

	var toPost = true; // use for posting object to web server

	assembleDataToPost(sessionStorage.ParameterID, toPost);

	// console.log('Selection of location yields:' +
	// SelectValues(sessionStorage.ParameterID));
});

$('#viewEvaluation').live('pageshow', function (event, ui) {

	var id = sessionStorage.ParameterID,
		toPost = false; // use for test output of object
	
	console.log('Parameter ID: ' + sessionStorage.ParameterID);

	// view object to be posted
	assembleDataToPost(sessionStorage.ParameterID, toPost);

	// view all stored data on device
	loadEvaluation(id);
	loadSite(id);
	loadEvaluationAward(id);
	loadEvaluationFactor(id);
	loadEvaluationFeature(id);
	loadGardener(id);
	loadGeolocation(id);

	// console.log('Selection of location yields:' +
	// SelectValues(sessionStorage.ParameterID));
});

// compute sum of ratings: TODO - add other categories
function computeScore() {
	var	useOfColor = $("#useOfColor").val(),
		plantVariety = $("#plantVariety").val(),
		design = $("#design").val(),
		maintenance = $("#maintenance").val(),
		environmentalStewardship = $("#environmentalStewardship").val(),
		sum;
	
	// force to be a number and then check if indeed it really is
	if (!isNaN(parseInt(useOfColor, 10)) 
			&& !isNaN(parseInt(plantVariety, 10)) 
			&& !isNaN(parseInt(design, 10)) 
			&& !isNaN(parseInt(maintenance, 10)) 
			&& !isNaN(parseInt(environmentalStewardship, 10))) {
		
		sum = parseInt(useOfColor, 10) 
			+ parseInt(plantVariety, 10) 
			+ parseInt(design, 10) 
			+ parseInt(maintenance, 10) 
			+ parseInt(environmentalStewardship, 10);

		// alert("sum:" + parseInt(sum));

		$("#sumRating").val(sum);
		$("#sumRating").attr('disabled', 'disabled');

		// based on threshold value control visibility of award page via div
		// encapsulating a href : this would be ideal, however, since rules are
		// too convoluted, we just issue an alert!

		if (sum < 18 && !isNaN(parseInt(sum, 10))) {
			// $(".hide_me").show();
			alert("This garden should only be considered for best boulevard or container garden, since they are not an EG!");
		} 
			// else { $(".hide_me").hide(); }

	} else {
		alert("Please enter a rating!");
	}
}

// db stuffs

//Wait for PhoneGap to load
//document.addEventListener("deviceready", onDeviceReady, false);

// this is called when an error happens in a transaction
function errorHandler(error) {
	/* global alert */
	alert('Error: ' + error.message + ' code: ' + error.code);
}

// this is called when a successful transaction happens
function successCallBack() {
	//alert("DEBUGGING: success");
}

function nullHandler() {
}

function executeSql(sqlStatement) {
	db.transaction(function (tx) {
		tx.executeSql(sqlStatement, [], nullHandler, errorHandler);
	}, errorHandler, successCallBack);
}

// called when the application loads
function onBodyLoad() {
	//alert("DEBUGGING: we are in the onBodyload() function");
	
	if (!window.openDatabase) {
		// not all mobile devices support databases if it does not, the
		// following alert will display indicating the device
		// will not be able to run this application
		alert('Databases are not supported in this browser.');
		return;
	}

	db = openDatabase(shortName, version, displayName, maxSize);
	
	// drop tables

	/*
	 * var dropStatementGeolocation = 'DROP TABLE geo_location',
	 * dropStatementSite = 'DROP TABLE site', 
	 * dropStatementSiteType = 'DROP TABLE site_type';, 
	 * dropStatementEvaluation = 'DROP TABLE evaluation'
	 * dropStatementEvaluationAward = 'DROP TABLE evaluation_award',
	 * dropStatementEvaluationFactor = 'DROP TABLE evaluation_factor',
	 * dropStatementEvaluationFeature = 'DROP TABLE evaluation_feature',
	 * dropStatementFeature = 'DROP TABLE feature', 
	 * dropStatementAward = 'DROP TABLE award', dropStatementFactor = 'DROP TABLE factor',
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
	var	createStatementSite = 'CREATE TABLE IF NOT EXISTS site  '
				+ '(id INTEGER NOT NULL PRIMARY KEY,  '
				+ 'site_id INTEGER NOT NULL,  '
				+ 'site_type_id INTEGER NOT NULL,  '
				+ 'address VARCHAR NOT NULL,  ' 
				+ 'city VARCHAR NOT NULL, '
				+ 'state VARCHAR NOT NULL, ' 
				+ 'zip INTEGER NOT NULL,  '
				+ 'neighborhood VARCHAR)',

		createStatementSiteType = 'CREATE TABLE IF NOT EXISTS site_type  '
			+ '(id INTEGER NOT NULL PRIMARY KEY, ' 
			+ 'name VARCHAR NOT NULL)',

		createStatementGeolocation = 'CREATE TABLE IF NOT EXISTS geo_location  '
			+ '(id INTEGER NOT NULL PRIMARY KEY,  '
			+ 'site_id INTEGER NOT NULL,  ' 
			+ 'latitude REAL NOT NULL,  '
			+ 'longitude REAL NOT NULL,  ' 
			+ 'accuracy VARCHAR NOT NULL, '
			+ 'timestamp DATETIME)',

		createStatementGardener = 'CREATE TABLE IF NOT EXISTS gardener  '
			+ '(id INTEGER NOT NULL PRIMARY KEY,  '
			+ 'site_id INTEGER NOT NULL,  ' 
			+ 'name VARCHAR NOT NULL)',

		createStatementEvaluation = 'CREATE TABLE IF NOT EXISTS evaluation  '
			+ '(id INTEGER NOT NULL PRIMARY KEY ,  '
			+ 'evaluation_id INTEGER NOT NULL, '
			+ 'evaluator_id INTEGER NOT NULL ,  '
			+ 'site_id INTEGER NOT NULL ,  ' 
			+ 'sum_rating INTEGER,  '
			+ 'date_loaded_to_device DATETIME,  '
			+ 'no_longer_exists INTEGER,  ' 
			+ 'comments TEXT,  '
			+ 'date_posted_to_remote DATETIME,  '
			+ ' date_entered_on_device_by_evaluator DATEIME,  '
			+ 'date_of_evaluation DATETIME )',

		createStatementEvaluationAward = 'CREATE TABLE IF NOT EXISTS evaluation_award  '
			+ '(id INTEGER PRIMARY KEY NOT NULL ,  '
			+ 'award_id INTEGER NOT NULL ,  '
			+ 'special_award_specified VARCHAR,  '
			+ 'evaluation_id INTEGER NOT NULL )',

		createStatementEvaluationFactor = 'CREATE TABLE IF NOT EXISTS evaluation_factor  '
			+ '(id INTEGER PRIMARY KEY NOT NULL ,  '
			+ 'factor_id INTEGER NOT NULL ,  '
			+ 'rating INTEGER NOT NULL ,  '
			+ 'evaluation_id INTEGER NOT NULL )',

		createStatementEvaluationFeature = 'CREATE TABLE IF NOT EXISTS evaluation_feature  '
			+ '(id INTEGER PRIMARY KEY NOT NULL ,  '
			+ 'evaluation_id INTEGER NOT NULL ,  '
			+ 'feature_id INTEGER NOT NULL) ',

		createStatementAward = 'CREATE TABLE IF NOT EXISTS award  '
			+ '(id INTEGER PRIMARY KEY NOT NULL ,  '
			+ 'name VARCHAR NOT NULL ) ',

		createStatementFactor = 'CREATE TABLE IF NOT EXISTS factor  '
			+ '(id INTEGER PRIMARY KEY NOT NULL ,  '
			+ 'name VARCHAR NOT NULL ) ',

		createStatementFeature = 'CREATE TABLE IF NOT EXISTS feature  '
			+ '(id INTEGER PRIMARY KEY NOT NULL ,  '
			+ 'name VARCHAR NOT NULL )';

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
	
}

// TODO: templatize
// specified sites categorized as no yet evaluated (toEvaluate) or evaluation done (complete)
// make json for use in dynamically generated menu generated by template populated via Backbone.js
var selectLocation = function (callback) {
	
	var SelectStatement = 'SELECT * FROM site s  '
			+ 'INNER JOIN evaluation e ON s.site_id = e.site_id '
			+ 'ORDER BY s.site_id ';
	
	db.transaction(function (transaction) {
		transaction.executeSql(SelectStatement, [], function (transaction, result) {
			if (result !== null && result.rows !== null) {
				var	i  = 0,
					max,
					row,
					location,
					complete,
					notExists,
					category,
					jsonToEvaluate = []; // initialize as a collection 
				
				for (i = 0, max = result.rows.length;  i < max; i += 1) {
					row = result.rows.item(i);
					location = row.address 
						+ ' ' + row.city 
						+ ' ' + row.state 
						+ ' ' + row.zip;
					complete = row.date_entered_on_device_by_evaluator;
					notExists = row.no_longer_exists;
						
					if (complete || notExists) {
						category = "evaluationComplete";
					} else {
						category = "evaluationNotComplete";
					}
					
					jsonToEvaluate[i] = {
						id: row.evaluation_id,
						category: category,
						location: location
					};
					
					if (i + 1 === max) {
						console.log("DATA in:" + JSON.stringify(jsonToEvaluate));
						callback(jsonToEvaluate);
						//alert(JSON.stringify(jsonToEvaluate));
						//return jsonToEvaluate;
					}
					
				}
			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
};

// test underscore template
// return  json object 
function jsonOut(json) { 
	
	 
	json =  "Data:" + JSON.stringify(json);
	console.log(json);
	var template = $("#categoryItems").html();
	$("#evaluations").html(_.template(template, {json: json}));
	return json;
	
}

// TODO: convert to model getter
// load site data for use in page div
function loadSiteEvaluation(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var	selectStatement = 'SELECT * FROM site s INNER JOIN evaluation e  '
			+ 'ON s.site_id = e.site_id  ' 
			+ 'WHERE e.evaluation_id = ?',
		location = null;

	$('#lbWhere').html('');
	$('#lbWhere').val('');

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function (transaction) {

		transaction.executeSql(selectStatement, [ id ], function (transaction, result) {
			if (result !== null && result.rows !== null) {
				var	i,
					row,
					location;
				for (i = 0; i < 1; i += 1) {
					row = result.rows.item(i);
					location = row.id 
						+ ' ' + row.site_id 
						+ ' ' + row.address
						+ ' ' + row.city 
						+ ' ' + row.state 
						+ ' ' + row.zip
						+ ' ' + row.evaluation_id;
					
					$('#lbWhere').append(location);
					
					console.log(location);
				}
			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
}

// TODO: CRUD
// update/insert data on location div, if needed
function updateLocationPage() {

	// get evaluation_id
	var	id = sessionStorage.ParameterID,
		// date of evaluation
		dateOfEvaluation = $('#dateOfEvaluation').val(), 
		neighborhood = $('#neighborhood').val(), 
		gardenerName = $('#gardenerName').val(),
		updateStatement,
		obj;

	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	console.log('dateOfEvaluation:' + dateOfEvaluation);

	if (dateOfEvaluation) {

		// update data in need of correction:
		updateStatement = 'UPDATE evaluation   '
			+ 'SET date_of_evaluation = ?  ' 
			+ 'WHERE evaluation_id = ?';

		console.log('updateme:' + updateStatement);

		db.transaction(function (transaction) {
			transaction.executeSql(updateStatement, [ dateOfEvaluation, id ],
					nullHandler, errorHandler);
		});

		alert('updated date evaluated to: ' + dateOfEvaluation);
	}

	// does not exist:
	// site update, only if checked
	if ($("#checked-exists").is(":checked")) {
		updateExistence();
	}

	// update 'hood if given
	console.log('neighborhood:' + neighborhood);
	if (neighborhood) {
		updateHood(neighborhood);
	}

	// insert gardener name if given
	console.log('gardenerName:' + gardenerName);
	if (gardenerName) {
		obj = {
			var: gardenerName
		};
		console.log('obj:' + $.toJSON(obj));
		getSiteId(obj.var);
	}

}

//TODO: CRUD
// thing to evaluate marked as no longer exists,
function updateExistence() {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var	id = sessionStorage.ParameterID, // get evaluation_id
		updateStatement = 'UPDATE evaluation  ' 
			+ 'SET no_longer_exists = 1 '
			+ 'WHERE evaluation_id = ?';

	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	console.log('updateme:' + updateStatement);
	console.log('Evaluation id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function (transaction) {
		transaction.executeSql(updateStatement, [ id ], nullHandler,
				errorHandler);
	});

	alert("Not exists successfully updated");
	return false;
}

//TODO: CRUD
// hood is given
function updateHood(neighborhood) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var	id = sessionStorage.ParameterID, 
		updateStatement = 'UPDATE site   ' // get evaluation_id
			+ 'SET neighborhood = ?  '
			+ 'WHERE site_id IN (SELECT site_id FROM evaluation WHERE evaluation_id = ?)';

	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	console.log('neighborhood update:' + neighborhood);
	console.log('updateme:' + updateStatement);
	console.log('Evaluation id:' + id);

	// this next section will select all the content from the site table as
	// queried by the passed parameter
	db.transaction(function (transaction) {
		transaction.executeSql(updateStatement, [ neighborhood, id ],
				nullHandler, errorHandler);
	});

	alert("Not exists successfully updated");
	return false;

}

// TODO: CRUD
function insertGardener(siteId, gardenerName) {

	// insert gardener name
	var insertStatement = 'INSERT INTO gardener   '
			+ '(site_id, name)  VALUES (?,?)';

	console.log('insertStatement me:' + insertStatement);

	// this next section will select all the content from the site table
	// as
	// queried by the passed parameter

	db.transaction(function (transaction) {
		transaction.executeSql(insertStatement, [ siteId, gardenerName ],
				nullHandler, errorHandler);
	});

	alert("Gardener successfully inserted");
	return false;

}

// make calls to load ratings and features
function loadRatingsFeatures() {
	var sumRating = $("#sumRating").val();

	console.log('sumRating: ' + sumRating);

	if (!isNaN(parseInt(sumRating, 10))) {
		console.log('sumRating onward: ' + sumRating);
		assignRating();
		assignFeature();
	} else {
		alert('Please rate this site before saving data!');
	}

}

// from HTML form
function assignRating() {

	var	useOfColor = $("#useOfColor").val(), 
		plantVariety = $("#plantVariety").val(), 
		design = $("#design").val(), 
		maintenance = $("#maintenance").val(), 
		environmentalStewardship = $("#environmentalStewardship").val(), 
		sumRating = $("#sumRating").val(), 
		generalComment = $("#generalComment").val();

	// force to be a number and then check if indeed it really is and that all
	// exist prior to submitting

	console.log('sumRating variables: ' 
			+ useOfColor 
			+ ' ' + plantVariety 
			+ ' ' + design 
			+ ' ' + maintenance 
			+ ' ' + environmentalStewardship);
	console.log('sumRating: ' + sumRating);
	/*
	 * if (!isNaN(parseInt(sumRating,10)) && !isNaN(parseInt(useOfColor, 10)) &&
	 * !isNaN(parseInt(plantVariety, 10)) && !isNaN(parseInt(design, 10)) &&
	 * !isNaN(parseInt(maintenance, 10)) &&
	 * !isNaN(parseInt(environmentalStewardship, 10)))
	 */
	if (!isNaN(parseInt(sumRating, 10))) {

		console.log('assignRating: here we got to load data');

		// TODO: make lookup table factor

		// add each to db: TODO loop through object and use .each
		// load factor ratings
		loadFactorToDb(useOfColor, 'useOfColor');
		loadFactorToDb(plantVariety, 'plantVariety');
		loadFactorToDb(design, 'design');
		loadFactorToDb(maintenance, 'maintenance');
		loadFactorToDb(environmentalStewardship, 'environmentalStewardship');
		// update specific evaluation data
		updateEvaluationRatingComment(sumRating, generalComment);
	}
}

// TODO: CRUD
function loadFactorToDb(value, label) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var insertStatement = 'INSERT INTO evaluation_factor  '
			+ '(factor_id, rating, evaluation_id)  ' + 'VALUES (?,?,?)',
		id = sessionStorage.ParameterID, // get evaluation_id
		factor_id;

	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	console.log('Insertstatement: ' + insertStatement);
	console.log('value and label: ' + value + ' ' + label);

	// use until lookup class exists
	switch (label) {
	case 'useOfColor':
		factor_id = 1;
		break;
	case 'plantVariety':
		factor_id = 2;
		break;
	case 'design':
		factor_id = 3;
		break;
	case 'maintenance':
		factor_id = 4;
		break;
	case 'environmentalStewardship':
		factor_id = 5;
		break;
	default:
		factor_id = -1;  // TODO: throw error
	}

	// this is the section that actually inserts the values into the User table
	db.transaction(function (transaction) {
		transaction.executeSql(insertStatement, [ factor_id, value, id ],
				nullHandler, errorHandler);
	});
	
	return false;
}

// TODO: CRUD
function updateEvaluationRatingComment(sumRating, generalComment) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var	now = new Date(), id = sessionStorage.ParameterID, // get evaluation_id
		updateStatement;

	console.log('Parameter ID in ratings : ' + sessionStorage.ParameterID);

	if (generalComment) {

		updateStatement = 'UPDATE evaluation  ' 
			+ 'SET sum_rating = ?,  '
			+ 'comments = ?,  '
			+ 'date_entered_on_device_by_evaluator  = ? '
			+ 'WHERE evaluation_id = ?';

		console.log('updatestatement: ' + updateStatement);

		db.transaction(function (transaction) {
			transaction.executeSql(updateStatement, [ sumRating,
					generalComment, now, id ], nullHandler, errorHandler);
		});

	} else {
		updateStatement = 'UPDATE evaluation  ' 
			+ 'SET sum_rating = ?,  '
			+ 'date_entered_on_device_by_evaluator  = ? '
			+ 'WHERE evaluation_id = ?';

		console.log('updatestatement: ' + updateStatement);

		db.transaction(function (transaction) {
			transaction.executeSql(updateStatement, [ sumRating, now, id ],
					nullHandler, errorHandler);
		});
	}

	alert("Factor ratings successfully saved!");

	return false;
}

// from HTML form
function assignFeature() {

	var	features = $("#featuresMenu").val(),
		items,
		result;

	console.log("featuresMenu:" + result);

	if (features) {

		// kludgey method: write items in multiple select array to string for
		// evaluation
		items = [];
		result = items.join(',');

		$('#featuresMenu option:selected').each(function () {
			items.push($(this).val());
		});

		// TODO: make lookup table factor
		console.log("featuresMenu 2:" + result);

		switch (result) {
		case '1':
			loadFeatureToDb(1);
			console.log("Woop!:" + result);
			break;
		case '2':
			loadFeatureToDb(2);
			console.log("Woop, Woop!:" + result);
			break;
		case '1,2':
			loadFeatureToDb(3);
			console.log("Woop! Woop! Woop!:" + result);
			break;
		default:
			break;	
		}
	}
		
}

//TODO: CRUD
// load site features tied to evaluation
function loadFeatureToDb(value) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var	insertStatement = 'INSERT INTO evaluation_feature  '
			+ '(feature_id, evaluation_id)  ' 
			+ 'VALUES (?,?)', 
		id = sessionStorage.ParameterID; // get evaluation_id
																								
	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	console.log("insertStatement:" + insertStatement);

	// this is the section that actually inserts the values into the User table
	db.transaction(function (transaction) {
		transaction.executeSql(insertStatement, [ value, id ], nullHandler,
				errorHandler);
	});

	alert("Garden features successfully saved!");
	return false;
}

function assignAward() {

	var	awardId = $("#awardMenu").val(), 
		specialAward = $("#specialAward").val(),
		sumRating = $("#sumRating").val();

	// force to be a number and then check if indeed it really is and that all
	// exist prior to submitting

	if (!isNaN(parseInt(sumRating, 10))) {

		if (sumRating < 18 && !isNaN(parseInt(sumRating, 10))) {
			// $(".hide_me").show();
			alert("This garden should only be considered for best boulevard or container garden, since they are not an EG!");
		}

		if (!isNaN(parseInt(awardId, 10))) {
			console.log('award woop!: ');

			loadAwardToDb(awardId, specialAward);

		}
	} else {
		alert("Need a rating in order to give an award!");
	}

}

function loadAwardToDb(value, comment) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var	insertStatement = 'INSERT INTO evaluation_award  '
			+ '(award_id, special_award_specified, evaluation_id)  '
			+ 'VALUES (?,?,?)', 
		id = sessionStorage.ParameterID; // get evaluation_id
																	
	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	console.log('insertStatement: ' + insertStatement);

	// this is the section that actually inserts the values into the User table
	db.transaction(function (transaction) {
		transaction.executeSql(insertStatement, [ value, comment, id ],
				nullHandler, errorHandler);
	});

	alert("Award successfully saved!");
	// this calls the function that will show what is in the User table in the
	// database
	// ListDBValues();
	return false;
}

// utilize design pattern to make optional parameter
function initializeParamaterGetSiteId() {
	var obj = {
		var: null
	};
	
	console.log('obj:' + $.toJSON(obj));
	getSiteId(obj);
	
}


// TODO: convert to model getter method
function getSiteId(obj) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var id = sessionStorage.ParameterID, // get evaluation_id
		selectStatement = 'SELECT * FROM evaluation    '
			+ 'WHERE (evaluation_id = ?)',
		latitude, 
		longitude, 
		accuracy, 
		timeStamp;
		
	console.log('obj: ' + obj);
	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	console.log('selectStatement: ' + selectStatement);

	// select list of evaluations that have been completed for upload to remote
	db.transaction(function (transaction) {
		transaction.executeSql(selectStatement, [ id ], function (transaction, result) {
			if (result !== null && result.rows !== null) {
				// get output from select
				var	i = 0,
					row;
				for (i = 0; i < 1; i += 1) {
					row = result.rows.item(i);
					// get siteId
					console.log('row.site_id: ' + row.site_id);

					if (obj.parameter === null) {
						latitude = localStorage.getItem("latitude");
						longitude = localStorage.getItem("longitude"); 
						accuracy = localStorage.getItem("accuracy"); 
						timeStamp = localStorage.getItem("timeStamp"); 
						console.log('latitude: longitude: accuracy: timeStamp ' + latitude 
								+ ' ' +  longitude 
								+ ' ' +  accuracy 
								+ ' ' +  timeStamp);
						insertGeolocationToDb(latitude, longitude, accuracy, timeStamp, row.site_id);
					} else if (obj.parameter !== null && typeof obj.parameter === "string") {
						insertGardener(row.site_id, gardenerName);
					}
				}
			}
		}, errorHandler);
	}, errorHandler, nullHandler);

	alert("success");
	return false;
}

//TODO: CRUD
function insertGeolocationToDb(latitude, longitude, accuracy, timeStamp, siteId) {

	// insert geolocation
	var insertStatement = 'INSERT INTO geo_location   '
			+ '(site_id, latitude,longitude,accuracy,timestamp)  VALUES (?,?,?,?,?)';

	console.log("After: latitude, longitude, accuracy, timeStamp" 
			+ latitude
			+ ' ' + longitude 
			+ ' ' + accuracy 
			+ ' ' + timeStamp);
	console.log('insertStatement me:' + insertStatement);

	db.transaction(function (transaction) {
		transaction.executeSql(insertStatement, [ siteId, latitude, longitude,
				accuracy, timeStamp ], nullHandler, errorHandler);
	});

	alert("Geolocation successfully inserted");

	return false;

}

// function to capture requested object as a variable:
// $.getJSON will run asynchronously and hence Javascript will progress past the
// expression that invokes it even before its success callback fires,
// thus, there are no guarantees that the variable will capture any data, hence we select async: false 
// and use a deferred object to grab the state after it has been returned
var getJson = function () { // TODO: get evaluator_id
	
	var	url,
		json,
		reqObj;
	
	url = webServer; 
	
	// get from dev or production data
	if (environ === 'dev') {
		url = url + '/' + collectionDevelopment + '/' + callback + evaluator_id;
	} else if (environ === 'prod') {
		url = url + '/' + collectionProduction + '/' + callback + evaluator_id;
	}
	
	json = [];
	// set as a deferred object
	reqObj = $.ajax({ 
		async : false,
		global : false,
		url : url,
		dataType : "jsonp"
	});

	reqObj.done(function (data) {
		json = data;
		// alert("Success!");
		console.log('JSON ' + json[2].garden.garden_id);
		alert('JSON ' + json[2].garden.garden_id);
		loadVariable(json); // make variable available outside of closure
	});

	reqObj.fail(function (e, jqxhr, settings, exception) {
		console.log(e);
	});

};

// console.log('Biff' + typeof json);

// do stuff with the returned data from success closure defined above
function loadVariable(val) {

	var	site_id, 
		evaluation_id, 
		address, 
		city, 
		state, 
		zip, 
		evaluator_id,
		i = 0,
		max;
	for (i = 0, max = val.length; i < max; i += 1) {
		site_id = val[i].garden.garden_id;
		address = val[i].garden.address.address;
		city = val[i].garden.address.city;
		state = val[i].garden.address.state;
		zip = val[i].garden.address.zip;
		evaluation_id = val[i].evaluation_id;
		evaluator_id = val[i].evaluator.evaluator_id;
		console.log('site info: loadJsonObject:' + i + ' ' + site_id + ' '
				+ address + ' ' + city + ' ' + state + ' ' + zip
				+ ' completed ' + val[i].completed);
		// only load evaluations that have not been done
		if (val[i].completed === 0) {
			loadDbSite(site_id, address, city, state, zip);
			loadDbEvaluation(site_id, evaluator_id, evaluation_id);
		}
	}
}

//TODO: CRUD
// load site data
function loadDbSite(site_id, address, city, state, zip) {

	var InsertStatement = 'INSERT INTO site(site_id,  ' 
		+ 'site_type_id,  '
		+ 'address,   ' 
		+ 'city,   ' 
		+ 'state,   ' 
		+ 'zip)  '
		+ 'VALUES (?,?,?,?,?,?)';

	console.log('site info: loadDb:' 
			+ site_id 
			+ ' ' + address 
			+ ' ' + city
			+ ' ' + state 
			+ ' ' + zip);

	alert('site info: loadDb:' 
			+ site_id 
			+ ' ' + address 
			+ ' ' + city 
			+ ' ' + state 
			+ ' ' + zip);

	// this is the section that actually inserts the values into the User table
	db.transaction(function (transaction) {
		transaction.executeSql(InsertStatement, [ site_id, 1, address, city,
				state, zip ], nullHandler, errorHandler);
	});
	// this calls the function that will show what is in the User table in the
	// database
	// ListDBValues();
	return false;
}

//TODO: CRUD
// load evaluation data
function loadDbEvaluation(site_id, evaluator_id, evaluation_id) {

	var now = new Date(), 
		InsertStatement = 'INSERT INTO evaluation(site_id,  '
			+ 'evaluator_id,  ' 
			+ 'evaluation_id, '
			+ 'date_loaded_to_device) VALUES (?,?,?,?)';

	// var now = Date.parse('today').toString('MM/dd/yyyy');

	console.log('evaluation info: loadDb:' 
			+ site_id 
			+ ' ' + evaluator_id
			+ ' ' + evaluation_id 
			+ ' ' + now);

	alert('evaluation info: loadDb:' + site_id + ' ' + ' ' + evaluator_id + ' '
			+ evaluation_id + ' ' + now);

	// this is the section that actually inserts the values into the User table
	db.transaction(function (transaction) {
		transaction.executeSql(InsertStatement, [ site_id, evaluator_id,
				evaluation_id, now ], nullHandler, errorHandler);
	});

	return false;
}

// TODO: convert over to underscoree templated view
// obsoleted by selectLocation
function selectEvaluationToPost() {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	// select list of evaluations that have been completed for upload to remote
	var selectStatement = 'SELECT * FROM evaluation e   '
			+ 'INNER JOIN site s ON s.site_id = e.site_id   '
			+ 'WHERE (e.date_entered_on_device_by_evaluator IS NOT NULL) AND ((e.date_of_evaluation IS NOT NULL)  OR (e.no_longer_exists = 1))  '
			+ 'ORDER BY e.date_entered_on_device_by_evaluator';
	
	// clear element
	$('#lbLocation').html('');
	
	console.log('selectStatement: ' + selectStatement);

	db.transaction(function (transaction) {
		transaction.executeSql(selectStatement, [], function (transaction, result) {
			if (result !== null && result.rows !== null) {
				var	i = 0,
					max,
					row,
					evaluation;
				for (i = 0, max  =  result.rows.length; i < max; i += 1) {
					row = result.rows.item(i);
					evaluation = row.evaluation_id
						+ ' '
						+ row.address
						+ ' '
						+ row.city
						+ ' '
						+ row.state
						+ ' '
						+ row.zip
						+ ' date posted to remote'
						+ row.date_posted_to_remote;

					// create dynamic url: on	click, write evaluation_id to LocalStorage for retrieval of and use for later
					$('#lbUploadEvaluation').append('<a href="#dataToRemote" font size="7" onclick="sessionStorage.ParameterID=' 
						+ row.evaluation_id + '" >'
						+ evaluation + '  </a><br>');
				}
			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
}

// TODO: convert to backbone model assembly
function assembleDataToPost(id, toPost) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var  currentYear = (new Date()).getFullYear(),
		// kludge until edit/delete records functionality is added we use LIMIT
		selectStatement = 'SELECT * FROM evaluation e INNER JOIN site s  '
			+ 'ON e.site_id = s.site_id LEFT OUTER JOIN  '
			+ '(SELECT * FROM gardener g INNER JOIN  '
			+ 'evaluation e ON e.site_id = g.site_id   '
			+ 'WHERE e.evaluation_id = ?  '
			+ 'ORDER BY id Desc  '
			+ 'LIMIT 1) AS g ON s.site_id  = g.site_id LEFT OUTER JOIN  '
			+ '(SELECT * FROM evaluation_award ea INNER JOIN  '
			+ 'evaluation e ON e.evaluation_id = ea.evaluation_id  '
			+ 'WHERE e.evaluation_id = ?  '
			+ 'ORDER BY id Desc  '
			+ 'LIMIT 1) AS ea ON e.evaluation_id = ea.evaluation_id LEFT OUTER JOIN  '
			+ '(SELECT * FROM evaluation_feature ef INNER JOIN  '
			+ 'evaluation e ON e.evaluation_id = ef.evaluation_id   '
			+ 'WHERE e.evaluation_id = ?  '
			+ 'ORDER BY id Desc  '
			+ 'LIMIT 1) AS efeature ON e.evaluation_id = efeature.evaluation_id LEFT OUTER JOIN  '
			+ ' (SELECT * FROM geo_location gl INNER JOIN  '
			+ 'evaluation e ON e.site_id = gl.site_id '
			+ 'WHERE e.evaluation_id = ?  ' + 'ORDER BY id Desc  '
			+ 'LIMIT 1) AS gl ON s.site_id  = gl.site_id  '
			+ 'WHERE e.evaluation_id = ?  ' + 'ORDER BY id Desc  ' + 'LIMIT 1';

	// clear element
	
	$('#lbUploadEvaluation').html('');
	$('#lbUploadEvaluation').val('');

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id to POST:' + id);
	// this next section will select all the content from the site table as queried by the passed parameter

	db.transaction(function (transaction) {
		transaction.executeSql(selectStatement, [ id, id, id, id, id ],
				function (transaction, result) {
				if (result !== null && result.rows !== null) {
					var	i = 0,
						max,
						row,
						rating, 
						bestof = 0, 
						nateSiegelAward = 0, 
						specialAwardSpecified = null, 
						rain_garden = 0, 
						rain_barrel = 0, 
						obj, 
						encoded;
					for (i = 0, max = result.rows.length; i < max; i += 1) {
						row = result.rows.item(i);
						// TODO: make the damn lookup classes!
	
						// assign rating
						if (row.sum_rating >= 18) {
							rating = 'EG';
						} else if (row.sum_rating >= 14 && row.sum_rating < 18) {
							rating = 'GD';
						} else if (row.sum_rating >= 9 && row.sum_rating < 14) {
							rating = 'GM';
						} else if (row.sum_rating >= 5 && row.sum_rating < 9) {
							rating = 'CA';
						} else {
							rating = '';
						}
	
						// features
						switch (row.feature_id) {
						case 1:
							rain_garden = 1;
							break;
						case 2:
							rain_barrel = 1;
							break;
						case 3:
							rain_garden = 1;
							rain_barrel = 1;
							break;
						default:
							break;
						}

						// award
						switch (row.award_id) {
						case 1:
							bestof = 'Residential';
							break;
						case 2:
							bestof = 'Residential Raingarden';
							break;
						case 3:
							bestof = 'Boulevard';
							break;
						case 4:
							bestof = 'Business';
							break;
						case 5:
							bestof = 'Business Raingarrden';
							break;
						case 6:
							bestof = 'Apartment';
							break;
						case 7:
							bestof = 'Community';
							break;
						case 8:
							bestof = 'Public';
							break;
						case 9:
							bestof = 'School';
							break;
						case 10:
							bestof = 'Congregation';
							break;
						case 11:
							bestof = 'Windowbox/container';
							break;
						case 12:
							bestof = 'NateSiegel';
							nateSiegelAward = 1;
							break;
						case 13:
							bestof = 'Special';
							break;
						default:
							break;
						}

						obj = {
							evaluation_id : row.evaluation_id,
							score : row.sum_rating,
							rating : rating,
							rating_year : currentYear,
							bestof : bestof,
							special_award_specified : row.special_award_specified,
							nate_siegel_award : nateSiegelAward,
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

						//encoded = $.toJSON(obj);
						encoded = obj;
						alert("data" + encoded);
						addFactorRating(encoded, obj, id, toPost);
						console.log('Session evaluation_id onward to POST!!!');
						// sendJson(obj);
					}
				}
			}, errorHandler);
	}, errorHandler, nullHandler);
	return;
}

// TODO: Backbone model
// append to object as subobject
function addFactorRating(encoded, obj, id, toPost) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var SelectStatement = 'SELECT * FROM evaluation_factor   '
			+ 'WHERE evaluation_id = ?  ' + 'ORDER BY id Desc LIMIT 5';

	console.log('Ratings factor add to obj SelectStatement' + SelectStatement);
	console.log('Session evaluation_id to POST:' + id);

	db.transaction(function (transaction) {
		transaction.executeSql(SelectStatement, [ id ], function (transaction, result) {
			if (result !== null && result.rows !== null) {
				var	i = 0,
					row,
					factor;
				for (i = 0; i < 5; i += 1) {
					row = result.rows.item(i);
					
					console.log('queried row' + row.rating + '  evaluation'
							+ row.evaluation_id);

					// append to string object
					// descending due to way data aare stored
					switch (i) {
					case 4:
						obj.score_card.color = row.rating;
						break;
					case 3:
						obj.score_card.plant_variety = row.rating;
						break;
					case 2:
						obj.score_card.design = row.rating;
						break;
					case 1:
						obj.score_card.maintenance = row.rating;
						break;
					case 0:
						obj.score_card.environmental_stewardship = row.rating;
						break;
					default:
						factor_id = -1;
					}

					if (i === 4) {

						//console.log(' ' + $.toJSON(obj));
						//alert('encoded' + $.toJSON(obj));

						if (toPost) {
							postToRemote(obj, id);
						}
					}
				}
			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
}

function postToRemote(obj, id) {
	
	// set up url
	
	var url = webServer;
	
	console.log('url: ' + url);
	console.log('environ: ' + environ);
	console.log('action: ' + action);
	
	// post to test db
	if (environ === 'dev') {
		url = url + '/' + collectionDevelopment;
	
		// post data
		if (action === 'post') {
			url = url + '/' + showResults;
		} else if (action === 'response') {  // test response from server
			url = url + '/' + testHttpResponse;
		}	
		
	} else if (environ === 'prod') { // post to prod db
		url = url + '/' + collectionProduction;
		
		// post data
		if (action === 'post') {
			url = url + '/' + showResults;
		} else if (action === 'response') { //test response from server
			url = url + '/' + showResults;
		}
	}
	console.log('new url: ' + url);

	// if select-image checked on form call select- image: need to redesign #selectLocationToEvaluate in HTML form
	if ($("#get-image").is(":checked")) {
		selectImage(obj, id, url);
	} else {
	
	    $.ajax({
		    type : "POST",
		    url : url,
		    data : obj,
		    success : function (data, textStatus, jqXHR) {
			    console.log('success' + textStatus + jqXHR.responseText);
			    alert(textStatus + jqXHR.responseText);
			    updateWhenPosted(id);
		    },
		    error : function () {
			    console.log('failure');
		    }
	    }); 
	}
	
}

function selectImage(obj, id, url) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(postWithImage, function (message) {
	    alert('get picture failed');
    }, {
	    quality: 50, 
	    destinationType: navigator.camera.DestinationType.FILE_URI,
	    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    }, obj, id, url
        );

}

function postWithImage(imageURI, obj, id, url) {
    var options = new FileUploadOptions(),
        ft = new FileTransfer();
    
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.params = obj;
    options.chunkedMode = false;

    ft.upload(imageURI, url, postSuccess, postError, options);
}

function postSuccess(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    alert(r.response);
    updateWhenPosted(id);
}

function postError(error) {
    alert("An error has occurred: Code = " + error.code);
}


// TODO: CRUD
function updateWhenPosted(id) {

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var	now = new Date(),
		updateStatement = 'UPDATE evaluation   '
				+ 'SET date_posted_to_remote = ?  ' 
				+ 'WHERE evaluation_id = ?';
	
	id = sessionStorage.ParameterID;	// get evaluation_id
			
	console.log('Parameter ID: ' + sessionStorage.ParameterID);
	console.log('updateme:' + updateStatement);
	console.log('Evaluation id:' + id);

	db.transaction(function (transaction) {
		transaction.executeSql(updateStatement, [ now, id ], nullHandler,
				errorHandler);
	});

	alert("Fini!!!!!");
	return false;
}

// TODO: CRUD
// more embarassing kludginess to fill in for actual data view lists
function loadEvaluation(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var selectStatement = 'SELECT * FROM evaluation e  '
			+ 'WHERE e.evaluation_id = ?', 
		evaluation = null;

	$('#lbEvaluation').html('');
	$('#lbEvaluation').val('');

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function (transaction) {

		transaction.executeSql(selectStatement, [ id ], function (transaction, result) {
			if (result !== null && result.rows !== null) {
				var	i = 0,
					max, 
					row,
					evaluation;
				for (i = 0, max = result.rows.length; i < max; i += 1) {
					row = result.rows.item(i);
					evaluation = row.id + '  evaluation_id:'
						+ row.evaluation_id + ' evaluator_id:'
						+ row.evaluator_id + ' site_id:' + row.site_id
						+ ' score:' + row.sum_rating + ' date_evaluated: '
						+ row.date_of_evaluation + ' does not exist: '
						+ row.no_longer_exists + ' comment:' + row.comments
						+ '<br>';
					
					// load row into element
					$('#lbEvaluation').append(evaluation);

					console.log(evaluation);
				}

			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
}

//TODO: CRUD
function loadSite(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var selectStatement = 'SELECT * FROM evaluation e INNER JOIN  '
			+ 'site s ON s.site_id = e.site_id  ' + 'WHERE e.evaluation_id = ?', 
		site = null;

	$('#lbSite').html('');
	$('#lbSite').val('');

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function (transaction) {

		transaction.executeSql(selectStatement, [ id ], function (transaction, result) {
			if (result !== null && result.rows !== null) {
				var	i = 0,
					max, 
					row,
					evaluation;
				for (i = 0, max = result.rows.length; i < max; i += 1) {
					row = result.rows.item(i);
					site = row.id + ' site_id:' + row.site_id + ' address:'
						+ row.address + ', ' + row.city + ', ' + row.state
						+ ', ' + row.zip + ' neighborhood: '
						+ row.neighborhood + '<br>';
			
					// load row into element
					$('#lbSite').append(site);

					console.log(site);
				}

			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
}

//TODO: CRUD
function loadEvaluationAward(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var selectStatement = 'SELECT * FROM evaluation_award ea  '
			+ 'WHERE ea.evaluation_id = ?', 
		award = null;

	$('#lbAward').html('');
	$('#lbAward').val('');

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function (transaction) {

		transaction.executeSql(selectStatement, [ id ], function (transaction, result) {
			if (result !== null && result.rows !== null) {
				var	i = 0,
					max,
					row,
					award;
				for (i = 0, max = result.rows.length; i < max; i += 1) {
					row = result.rows.item(i);
					award = row.id + ' award_id:' + row.award_id
						+ ' special_award:' + row.special_award_specified
						+ ' evaluation_id:' + row.evaluation_id + '<br>';

					// load row into element
					$('#lbAward').append(award);

					console.log(award);
				}

			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
}

//TODO: CRUD
function loadEvaluationFactor(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var selectStatement = 'SELECT * FROM  evaluation_factor ef  '
			+ 'WHERE ef.evaluation_id = ?', 
		factor = null;

	$('#lbFactor').html('');
	$('#lbFactor').val('');

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function (transaction) {

		transaction.executeSql(selectStatement, [ id ], function (transaction, result) {
			if (result !== null && result.rows !== null) {
				var	i = 0,
					max,
					row,
					factor;
				for (i = 0, max = result.rows.length; i < max; i += 1) {					
					row = result.rows.item(i);
					factor = row.id + ' factor_id:' + row.factor_id
						+ ' rating:' + row.rating + ' evaluation_id:'
						+ row.evaluation_id + '<br>';
					
					// load row into element
					$('#lbFactor').append(factor);

					console.log(factor);
				}

			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
}

//TODO: CRUD
function loadEvaluationFeature(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var selectStatement = 'SELECT * FROM  evaluation_feature ef  '
			+ 'WHERE ef.evaluation_id = ?', 
		feature = null;

	$('#lbFeature').html('');
	$('#lbFeature').val('');

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function (transaction) {

		transaction.executeSql(selectStatement, [ id ], function (transaction, result) {
			if (result !== null && result.rows !== null) {
				var	i = 0,
					max,
					row,
					feature;
				for (i = 0, max = result.rows.length; i < max; i += 1) {
					row = result.rows.item(i);
					feature = row.id + ' feature:' + row.feature_id
						+ ' evaluation_id:' + row.evaluation_id + '<br>';
					
					// load row into element
					$('#lbFeature').append(feature);

					console.log(feature);
				}

			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
}

//TODO: CRUD
function loadGeolocation(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var selectStatement = 'SELECT g.id, g.site_id, g.latitude, g.longitude, g.accuracy, g.timestamp, e.evaluation_id  '
			+ 'FROM geo_location g INNER JOIN  '
			+ 'site s ON g.site_id = s.site_id INNER JOIN evaluation e  '
			+ 'ON s.site_id = e.site_id  '
			+ 'WHERE e.evaluation_id = ?  '
			+ 'GROUP BY g.id, g.site_id, g.latitude, g.longitude, g.accuracy, g.timestamp,e.evaluation_id ', 
		geolocation = null;

	$('#lbGeolocation').html('');
	$('#lbGeolocation').val('');

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function (transaction) {

		transaction.executeSql(selectStatement, [ id ], function (transaction, result) {
			if (result !== null && result.rows !== null) {
				var	i = 0,
					max,
					row,
					geolocation;
				for (i = 0, max = result.rows.length; i < max; i += 1) {
					row = result.rows.item(i);
					geolocation = row.id + ' site_id:' + row.site_id
						+ ' latitude:' + row.latitude + ' longitude:'
						+ row.longitude + ' accuracy:' + row.accuracy
						+ ' timestamp:' + row.timestamp + ' evaluation_id:'
						+ row.evaluation_id + '<br>';

					// load row into element
					$('#lbGeolocation').append(geolocation);

					console.log(geolocation);
				}

			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
}

//TODO: CRUD
function loadGardener(id) {
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	var selectStatement = 'SELECT g.id, g.name, g.site_id, e.evaluation_id  '
			+ 'FROM gardener g INNER JOIN  '
			+ 'site s ON s.site_id = g.site_id INNER JOIN  '
			+ 'evaluation e ON s.site_id = e.site_id  '
			+ 'WHERE e.evaluation_id = ?  '
			+ 'GROUP BY g.id, g.name, g.site_id, e.evaluation_id ', 
		gardener = null;

	$('#lbGardener').html('');
	$('#lbGardener').val('');

	console.log('Select me:' + selectStatement);
	console.log('Session evaluation_id:' + id);
	// this next section will select all the content from the site table as
	// queried by the passed parameter

	db.transaction(function (transaction) {

		transaction.executeSql(selectStatement, [ id ], function (transaction, result) {
			if (result !== null && result.rows !== null) {
				var	i = 0,
					max,
					row,
					gardener;
				for (i = 0, max = result.rows.length; i < max; i += 1) {
					row = result.rows.item(i);
					gardener = row.id + ' site_id:' + row.site_id + ' name:'
						+ row.name + ' evaluation_id:' + row.evaluation_id
						+ '<br>';
					
					// load row into element
					$('#lbGardener').append(gardener);

					console.log(gardener);
				}

			}
		}, errorHandler);
	}, errorHandler, nullHandler);
	return;
}

// geolocation 

var watchID = navigator.geolocation.watchPosition(onSuccess, onError, {
	frequency : 3000
});

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
	// add data to localStorage 
	localStorage.latitude = latitude;
	localStorage.longitude = longitude;
	localStorage.accuracy = accuracy;
	localStorage.timeStamp = timeStamp;

}

// onError Callback receives a PositionError object
function onError(error) {
	alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}
