  
// TODO:  CRUD on Backbone relational models: Site, SiteEvaluation, SiteEvaluationAward, SiteEvaluationFeature, SiteEvaluationScorecard, SiteEvaluationFeature
// these are implemented as part of the model by overriding the default Backbone.sync method

// Use cases for evaluator interaction with app:
// 
// CREATE: 

// case: load to device/Ajax GET from remote 
// process: Ajax GET of JSONP from remote parsed to Webkit DB tables, Site, SiteEvaluation -> TODO: override default Backbone.sync using model specific sync implementations

// from fn: loadDbSite(site_id, address, city, state, zip)
var InsertStatement = 'INSERT INTO site (site_id,  ' 
	+ 'site_type_id,  '
	+ 'address,   ' 
	+ 'city,   ' 
	+ 'state,   ' 
	+ 'zip)  '
	+ 'VALUES (?,?,?,?,?,?)';

//  from fn:loadDbEvaluation(site_id, evaluator_id, evaluation_id)
var InsertStatement = 'INSERT INTO evaluation (site_id,  '
	+ 'evaluator_id,  ' 
	+ 'evaluation_id, '
	+ 'date_loaded_to_device) '
	+ 'VALUES (?,?,?,?)';

// e.g., JSONP collection (URL with defined callback queried on evaluator_id)
//
/*test_collection: [
	{"evaluation_id": "40380", // write to table evaluation 
	  "completed": "1", // used to control whether object gets written to table; only write those that have not been completed (viz., "completed": 0)
	  "eval_type": "regular", // n.a.
	  "score": "15", // n.a
	  "rating": "GD", // n.a
	  "ratingyear": "2010", // n.a
	  "bestof": "", // n.a
	  "nateSiegelAward": "0", // n.a
	  "rainbarrel": "0", // n.a
	  "downspouts_redirected": "0", // n.a
	  "date_assigned": "2010-07-15 12:55:14", // n.a
	  "date_evaluated": "2010-08-22 18:25:28", // n.a
	  "comments": "", // n.a
	  "revisit": "", // n.a
	  "evaluator": {"evaluator_id": "112", // write to evaluation
		  "evaluator_notified": "1", // n.a
		  "firstname": "Bob", // n.a
		  "lastname": "Plant", // n.a
		  "email": "rplant@zep.com"}, // n.a
	 "garden": {"garden_id": "39094", // write to site_id in table site
		 "name_of_garden": "",  // n.a
		 "no_longer_exists": null,  // n.a
		 "noteworthy_features": "", // n.a
		 "uploaded_image": "",  // n.a
		 "date_created": "", // n.a 
		 "address": {"address": "113 W 32th St", // write nested address object to site
			 "city": "MPLS", 
			 "state": "MN",
			 "zip": "55408",
			 "neighborhood": "Lyndale",
			 "county": "Hennepin"},
		"gardener": {"name0": "Daphne K. Freaklet", // write to site (if new maintainer discovered during evaluation, then create new site_maintainer record)
			"name2": "",
			"name3": "",
			"name4": "",
			"email": "",
			"phone": ""},
		"features": {"business_garden": null, // n.a
			"raingarden": null, 
			"residential_garden": "1", 
			"community_garden": "0", 
			"church_garden": null,
			"public_building": null, 
			"apartment_or_condo": null,
			"container_or_windowbox": null,
			"downspouts_redirected": "0",
			"has_rainbarrel": "0",
			"not_publically_visible": null}
			}
	  }, 
	  {"evaluation_id": "43864", 
	  "completed": "0",
	  "eval_type": "",
	  "score":"0", 
	  "rating": "",
	  "ratingyear": "2012",
	  "bestof": "",
	  "nateSiegelAward": "0",
	  "rainbarrel": "0",
	  "downspouts_redirected":"0",
	  "date_assigned": "2012-07-11 17:01:00",
	  "date_evaluated": "0000-00-00 00:00:00",
	  "comments": null,
	  "revisit": "",
	  "evaluator": {"evaluator_id": "112",
		  "evaluator_notified": "1",
		  "firstname": "Bob",
		  "lastname": "Plant",
		  "email":" rplant@zep.com"},
		  "garden": {"garden_id": "39262",
				"name_of_garden": "",
				"no_longer_exists": null,
				"noteworthy_features": "",
				"uploaded_image": "",
				"date_created": "",
				"address": {"address": "4658 51th Ave. S.",
					"city": "minneapolis",
					"state": "MN",
					"zip": "55406",
					"neighborhood": "Longfellow",
					"county": ""},
				"gardener": {"name0":	"Polly Q. Pitchfork",
					"name2":	"",	
					"name3":	"",
					"name4": "",
					"email":	"",
					"phone": ""},
				"features": {"business_garden":	null,
					"raingarden": null,
					"residential_garden":	"1",
					"community_garden": "0",
					"church_garden": null,
					"public_building": null,
					"apartment_or_condo": null,
					"container_or_windowbox": null,
					"downspouts_redirected": "0", 
					"has_rainbarrel": "0",
					"not_publically_visible": null}
				},
			}
	}] */

//Case Load to remote: findAll where SiteEvaluation has been done or Site not exist -> TODO: use default backbone sync for REST API
// Webkit DB queries; TODO: rewrite (ORDER BY and LIMIT were a kludge...):

// These queries pull a selected evaluation that has been completed.
// Data are assembled for remote POST (see function assembleDataToPost: TODO rewrite to utilize native Backbone.sync) 
var selectStatement = 'SELECT * FROM evaluation e INNER JOIN site s  '
	+ 'ON e.site_id = s.site_id LEFT OUTER JOIN  '
	+ '(SELECT * FROM site_maintainer g INNER JOIN  '
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

// get individual score to append to JSON for POST; TODO: rewrite
SelectStatement = 'SELECT * FROM evaluation_factor   '
	+ 'WHERE evaluation_id = ?  ' + 'ORDER BY id Desc LIMIT 5';

// e.g.,  assembled JSON to POST
//
/*test: {"evaluation_id": 44214,
	"score": 20, // computed, but stored value
	"rating": "EG", // computed by range (see function assembleDataToPost)
	"rating_year": 2012, // computed
	"bestof": "Special", // from evaluation_award
	"special_award_specified": "Absolute bestest ever!", // from evaluation_award; code stored. lookup via JSON object Award
	"nate_siegel_award": 0, // from evaluation_award
	"score_card": {"color": 4,  // from evaluation_factor, lookup via JSON object Factor
		"plant_variety": 4,
		"design": 4,
		"maintenance": 4,
		"environmental_stewardship": 4},
	"date_evaluated":"2012-08-01", // entered
	"general_comments":"This is a test", // evaluation
	"evaluator": {"evaluator_id":"265", // evaluation; id from remote db
		"completed_by": "265"},
	"rainbarrel":1, //evaluation_factor; lookup via JSON object Factor
	"raingarden":1,
	"garden": {"garden_id": 39439, // remote id maps to site_id
		"no_longer_exists": 0, // bit value
		"address": {"neighborhood": "Lake Forest", 
			"county": "Hennepin"},
		"gardener": {"name":"Greg The Marvelous"}, // maps to site_maintainer
		"geolocation": {"latitude": 44.9267,
			"longitude": -93.405282,
			"accuracy":"24000"}
		}
	} */

// Case READ: findAll where SiteEvaluation not done for completion of evaluation - Site, SiteEvaluation -> override default Backbone.sync using model specific sync implementations
// findAll where SiteEvaluation done for update of evaluation - Site, SiteEvaluation -> override default Backbone.sync using model specific sync implementations
SelectStatement = 'SELECT * FROM site s  '
	+ 'INNER JOIN evaluation e ON s.site_id = e.site_id '
	+ 'ORDER BY s.site_id ';

// from fn: var selectLocation, code determines status of evaluation

/* complete = row.date_entered_on_device_by_evaluator;
	notExists = row.no_longer_exists;
	if (complete || notExists) {
		category = "evaluationComplete";
	} else {
		category = "evaluationNotComplete";
	} */ 

// variable "category" is used to control output of nested object site.address to select menu via Backbone template

// Case READ: findBy id in sessionStorage for page navigation - Site, SiteEvaluation -> override default Backbone.sync using model specific sync implementations
var	id = sessionStorage.ParameterID;

// Case CREATE: EvaluationFactor, SiteMaintainer, EvaluationAward, EvaluationFeature, SiteGeolocation for new evaluation -> override default Backbone.sync using model specific sync implementations

//insert gardener name: fn insertGardener(siteId, gardenerName)
var insertStatement = 'INSERT INTO site_maintainer   ' // was gardener
	+ '(site_id, name)  VALUES (?,?)';

// fn loadFactorToDb(value, label)
var insertStatement = 'INSERT INTO evaluation_factor  '
	+ '(factor_id, rating, evaluation_id)  ' + 'VALUES (?,?,?)';

// fn loadFeatureToDb(value)
var insertStatement = 'INSERT INTO evaluation_feature  '
	+ '(feature_id, evaluation_id)  ' 
	+ 'VALUES (?,?)';

// fn loadAwardToDb(value, comment)
var insertStatement = 'INSERT INTO evaluation_award  '
	+ '(award_id, special_award_specified, evaluation_id)  '
	+ 'VALUES (?,?,?)';

// fn insertGeolocationToDb(latitude, longitude, accuracy, timeStamp, siteId)
// first, write to localstorage onSuccess call in onDeviceReady
// need to use localstorage because of the asynchronous nature of the API call

/*
// initialize
localStorage.clear();
// add data to localStorage 
localStorage.latitude = latitude;
localStorage.longitude = longitude;
localStorage.accuracy = accuracy;
localStorage.timeStamp = timeStamp;
*/

// then write to
var insertStatement = 'INSERT INTO site_geolocation   '
	+ '(site_id, latitude,longitude,accuracy,timestamp)  VALUES (?,?,?,?,?)';

// Case UPDATE: EvaluationFactor, SiteMaintainer, EvluationAward, EvaluationFeature, SiteGeolocation for already completed evaluation -> override default Backbone.sync using model specific sync implementations
// TODO: need to create missing updates, since they do not exist in current version of app
// fn updateHood(neighborhood)
var updateStatement = 'UPDATE site   ' // get evaluation_id
	+ 'SET neighborhood = ?  '
	+ 'WHERE site_id IN (SELECT site_id FROM evaluation WHERE evaluation_id = ?)';

// fn updateLocationPage()
var updateStatement = 'UPDATE evaluation   '
	+ 'SET date_of_evaluation = ?  ' 
	+ 'WHERE evaluation_id = ?';

// fn updateExistence()
var updateStatement = 'UPDATE evaluation  ' 
	+ 'SET no_longer_exists = 1 '
	+ 'WHERE evaluation_id = ?';

// fn updateEvaluationRatingComment(sumRating, generalComment)
var updateStatement = 'UPDATE evaluation  ' 
	+ 'SET sum_rating = ?,  '
	+ 'comments = ?,  '
	+ 'date_entered_on_device_by_evaluator  = ? '
	+ 'WHERE evaluation_id = ?';

// fn updateWhenPosted(id) 
var updateStatement = 'UPDATE evaluation   '
	+ 'SET date_posted_to_remote = ?  ' 
	+ 'WHERE evaluation_id = ?';

// Case DELETE:  findBy id in sessionStorage for element deletion - Site, SiteEvaluation EvaluationFactor, SiteMaintainer, EvluationAward, EvaluationFeature, SiteGeolocation:] -> override default Backbone.sync using model specific sync implementations
// TODO: create queries, since they currently do not exist in app

// Case LOAD to db

var createStatementSite = 'CREATE TABLE IF NOT EXISTS site  '
				+ '(id INTEGER NOT NULL PRIMARY KEY,  '
				+ 'site_id INTEGER NOT NULL,  '
				+ 'site_type_id INTEGER NOT NULL,  '
				+ 'address VARCHAR NOT NULL,  ' 
				+ 'city VARCHAR NOT NULL, '
				+ 'state VARCHAR NOT NULL, ' 
				+ 'zip INTEGER NOT NULL,  '
				+ 'neighborhood VARCHAR)' 
				+ 'county VARCHAR)',
				
	createStatementSiteMaintainer = 'CREATE TABLE IF NOT EXISTS site_maintainer  '
				+ '(id INTEGER NOT NULL PRIMARY KEY,  '
				+ 'site_id INTEGER NOT NULL,  ' 
				+ 'name VARCHAR NOT NULL)', 
	
	createStatementSiteGeolocation = 'CREATE TABLE IF NOT EXISTS site_geolocation  '
				+ '(id INTEGER NOT NULL PRIMARY KEY,  '
				+ 'site_id INTEGER NOT NULL,  ' 
				+ 'latitude REAL NOT NULL,  '
				+ 'longitude REAL NOT NULL,  ' 
				+ 'accuracy VARCHAR NOT NULL, '
				+ 'timestamp DATETIME)', 
	
	createStatementSiteEvaluation = 'CREATE TABLE IF NOT EXISTS evaluation  '
				+ '(id INTEGER NOT NULL PRIMARY KEY ,  '
				+ 'evaluation_id INTEGER NOT NULL, '
				+ 'evaluator_first_name VARCHAR NOT NULL ,  '
				+ 'evaluator_last_name VARCHAR NOT NULL ,  '
				+ 'evaluator_id INTEGER NOT NULL ,  '
				+ 'site_id INTEGER NOT NULL ,  ' 
				+ 'sum_rating INTEGER,  '
				+ 'date_loaded_to_device DATETIME,  '
				+ 'no_longer_exists INTEGER,  ' 
				+ 'comments TEXT,  '
				+ 'evaluation_type INTEGER NOT NULL,  '
				+ 'date_posted_to_remote DATETIME,  '
				+ 'date_entered_on_device_by_evaluator DATETIME,  '
				+ 'date_loaded_to_device_by_evaluator DATEIME,  '
				+ 'date_of_evaluation DATETIME )', 
			
	createStatementSiteEvaluationFactor = 'CREATE TABLE IF NOT EXISTS evaluation_factor  '
				+ '(id INTEGER PRIMARY KEY NOT NULL ,  '
				+ 'factor_id INTEGER NOT NULL ,  '
				+ 'rating INTEGER NOT NULL ,  '
				+ 'evaluation_id INTEGER NOT NULL )', 
				
	createStatementSiteEvaluationAward = 'CREATE TABLE IF NOT EXISTS evaluation_award  '
				+ '(id INTEGER PRIMARY KEY NOT NULL ,  '
				+ 'award_id INTEGER NOT NULL ,  '
				+ 'special_award_specified VARCHAR,  '
				+ 'evaluation_id INTEGER NOT NULL )', 
		
	createStatementSiteEvaluationFeature = 'CREATE TABLE IF NOT EXISTS evaluation_feature  '
				+ '(id INTEGER PRIMARY KEY NOT NULL ,  '
				+ 'evaluation_id INTEGER NOT NULL ,  '
				+ 'feature_id INTEGER NOT NULL) ';
			
executeSql(createStatementSite);
executeSql(createStatementSiteMaintainer);
executeSql(createStatementSiteGeolocation);
executeSql(createStatementEvaluation);
executeSql(createStatementEvaluationAward);
executeSql(createStatementEvaluationFactor);
executeSql(createStatementEvaluationFeature);

// Case DESTROY: kill db -> override default Backbone.sync using model specific sync implementations

var dropStatementSiteGeolocation = 'DROP TABLE site_geolocation',
	dropStatementSite = 'DROP TABLE site', 
	dropStatementSiteEvaluation = 'DROP TABLE evaluation',
	dropStatementSiteEvaluationAward = 'DROP TABLE evaluation_award',
	dropStatementSiteEvaluationFactor = 'DROP TABLE evaluation_factor',
	dropStatementSiteEvaluationFeature = 'DROP TABLE evaluation_feature',
	dropStatementSiteMaintainer = 'DROP TABLE site_maintainer';
 
executeSql(dropStatementSiteGeolocation); executeSql(dropStatementSite);
executeSql(dropStatementSite); executeSql(dropStatementEvaluation);
executeSql(dropStatementEvaluation);
executeSql(dropStatementEvaluationAward);
executeSql(dropStatementEvaluationFactor);
executeSql(dropStatementEvaluationFeature); 
executeSql(dropStatementSiteMaintainer); 

// Case LIST: 
// fn loadEvaluation(id) 
var selectStatement = 'SELECT * FROM evaluation e  '
	+ 'WHERE e.evaluation_id = ?';

// fn loadSite(id)
var selectStatement = 'SELECT * FROM evaluation e INNER JOIN  '
	+ 'site s ON s.site_id = e.site_id  ' + 'WHERE e.evaluation_id = ?';

// fn loadEvaluationAward(id)
var selectStatement = 'SELECT * FROM evaluation_award ea  '
	+ 'WHERE ea.evaluation_id = ?';

// fn loadEvaluationFactor(id) 
var selectStatement = 'SELECT * FROM  evaluation_factor ef  '
	+ 'WHERE ef.evaluation_id = ?';

// fn loadEvaluationFeature(id)
var selectStatement = 'SELECT * FROM  evaluation_feature ef  '
	+ 'WHERE ef.evaluation_id = ?';

// fn loadGeolocation(id)
var selectStatement = 'SELECT g.id, g.site_id, g.latitude, g.longitude, g.accuracy, g.timestamp, e.evaluation_id  '
	+ 'FROM geo_location g INNER JOIN  '
	+ 'site s ON g.site_id = s.site_id INNER JOIN evaluation e  '
	+ 'ON s.site_id = e.site_id  '
	+ 'WHERE e.evaluation_id = ?  '
	+ 'GROUP BY g.id, g.site_id, g.latitude, g.longitude, g.accuracy, g.timestamp,e.evaluation_id ';

// fn loadGardener(id)
var selectStatement = 'SELECT g.id, g.name, g.site_id, e.evaluation_id  '
	+ 'FROM site_maintainer g INNER JOIN  '
	+ 'site s ON s.site_id = g.site_id INNER JOIN  '
	+ 'evaluation e ON s.site_id = e.site_id  '
	+ 'WHERE e.evaluation_id = ?  '
	+ 'GROUP BY g.id, g.name, g.site_id, e.evaluation_id ';

// backbone-relational models to implement
var SiteEvaluation,
	EvaluationFeature,
	EvaluationAward,
	EvaluationFactorScorecard,
	Site;

//parent class of object graph
Site = Backbone.AssociatedModel.extend({
	default: {
		id: '_id',
		remoteSiteId: '', // key to match remote db site (site_id)
	    address: {
			streetAddress: '',
			city: '',
			state: '',
			zipcode: '',
			county: '',
			neighborhood: ''
		},
		geolocation: {
			latitude: '',
			longitude: '',
			accuracy: '',
			timestamp: ''
		},
		hasEvaluation: [],
		hasSiteMaintainer: [],
	},
	relations: [
		{
			relatedModel: Evaluation,
			type: Backbone.Many,
			key: 'is_evaluated', // linking id that defines the relationship to the nested object, e.g., site is evaluated
		},
		{
			relatedModel: SiteMaintainer,
		    type: Backbone.Many,
		    key: 'is_maintain', // site is maintained
	    }],
    sync: function (method, model, options) {} // add CRUD operations here, based on use cases 
});

//each evaluation may have zero or many known maintainers (was gardener)
SiteMaintainer = Backbone.AssociatedModel.extend({
	default: {
		id: '_id',
		name: ''
	},
    sync: function (method, model, options) {} // add CRUD operations here, based on use cases
});

//each evaluation will have a score associated with an assessment factor. this collection is the scorecard for the evaluation
EvaluationFactorScorecard = Backbone.AssociatedModel.extend({
	default: {
		id: '_id',
		score: '',
		factorType: '' // link to Factor.id
	},
    sync: function (method, model, options) {} // add CRUD operations here, based on use cases
});

EvaluationAward = Backbone.AssociatedModel.extend({
	default: {
		id: '_id',
		specialAwardSpecified: '',
		awardType: '' // link to Award.id
	},
    sync: function (method, model, options) {} // add CRUD operations here, based on use cases
});

EvaluationFeature = Backbone.AssociatedModel.extend({
	default: {
		id: '_id',
		featureType: '' // link to Feature.id
	},
    sync: function (method, model, options) {} // add CRUD operations here, based on use cases
});

Evaluation = Backbone.AssociatedModel.extend({
	default: {
		id: '_id',
		remoteEvaluationId: '', // key to match remote db site (evaluation_id)
		sumRating: '', // total score for evaluation factors - should equal sum of ratings over scorecard
		dateLoadedToDevice: '', // when loaded from remote
		datePostedToRemote: '', // when posted to remote
		dateUpdated: '', // update to evaluation
		dateOfEvaluation: '', // date of evaluation: if not provided, use dateEvaluated
		evaluator: { // evaluator assigned to evaluation
			firstName: '',
			lastName: '',
			remoteEvaluatorId: '', // map to remote db  
		},
		noLongerExists: false,
		comments: '',
		evaluationType: '', // link to EvaluationType.id,
		hasEvaluationAward: {},
		hasEvaluationFactorScorecard: [],
		hasEvaluationFeature: [],
	},
	relations: [ 
		{
			relatedModel: EvaluationAward,
	        type: Backbone.One,
	        key: 'may_award', // an evaluation may award
	    },
		{
			relatedModel: EvaluationFactorScorecard,
	        type: Backbone.Many,
	        key: 'is_scored', // an evaluation is scored
	    }, 
		{
			relatedModel: EvaluationFeature,
	        type: Backbone.Many,
	        key: 'may_feature', // an evaluation may feature
        },  
    ],
    sync: function (method, model, options) {} // add CRUD operations here, based on use cases
});

// lookup data
var EvaluationType = 
	[
	    { id: 1, description: 'First round garden' },
		{ id: 2, description: 'Second round garden' },
		{ id: 3, description: 'Voluntary rain garden' }
	];

var Factor = 
	[ 
		{ id: 1, description: 'color' },
		{ id: 2, description: 'plant variety' },
		{ id: 3, description: 'design' },
		{ id: 4, description: 'maintenance' },
		{ id: 5, description: 'environmental stewardship' }
	];

// nominate for an award: garden should only be considered for best boulevard or container garden if sum of scorecard is less than 18
var Award = 
	[
		{ id: 1, description: 'Residential' },
		{ id: 2, description: 'Residential Raingarden' },
		{ id: 3, description: 'Boulevard' },
		{ id: 4, description: 'Business' },
		{ id: 5, description: 'Business Raingarrden' },
		{ id: 6, description: 'Apartment' },
		{ id: 7, description: 'Community' },
		{ id: 8, description: 'Public' },
		{ id: 9, description: 'School' },
		{ id: 10, description: 'Congregation' },
		{ id: 11, description: 'Windowbox/container' },
		{ id: 12, description: 'NateSiegel' },
		{ id: 13, description: 'Specify' }
	];
	
// key features reflective of good environmental stewardship; values may change 
var Feature = 
	[
		{ id: 1, description: 'rain barrel'},
		{ id: 2, description: 'redirected downspouts'},
		{ id: 3, description: 'rain garden'}
	];	

