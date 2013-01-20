// DAO to override Backbone.sync  

// TODO:  CRUD on models: Site, SiteEvaluation, SiteEvaluationAward, SiteEvaluationFeature, SiteEvaluationScorecard, SiteEvaluationFeature

// use cases:
// create: load to device - Site, SiteEvaluation
// load to remote: findAll where SiteEvaluation has been done or Site not exist
// read: findAll where SiteEvaluation not done for completion of evaluation - Site, SiteEvaluation
// create: EvaluationFactor, SiteMaintainer, EvaluationAward, EvaluationFeature, SiteGeolocation for new evaluation
// read: findAll where SiteEvaluation done for update of evaluation - Site, SiteEvaluation
// update: EvaluationFactor, SiteMaintainer, EvluationAward, EvaluationFeature, SiteGeolocation for already completed evaluation
// read: findBy id in sessionStorage for page navigation - Site, SiteEvaluation
// delete:  findBy id in sessionStorage for element deletion - Site, SiteEvaluation EvaluationFactor, SiteMaintainer, EvluationAward, EvaluationFeature, SiteGeolocation:
// destroy: kill db

// LOAD

var createStatementSite = 'CREATE TABLE IF NOT EXISTS site  '
				+ '(id INTEGER NOT NULL PRIMARY KEY,  '
				+ 'site_id INTEGER NOT NULL,  '
				+ 'site_type_id INTEGER NOT NULL,  '
				+ 'address VARCHAR NOT NULL,  ' 
				+ 'city VARCHAR NOT NULL, '
				+ 'state VARCHAR NOT NULL, ' 
				+ 'zip INTEGER NOT NULL,  '
				+ 'neighborhood VARCHAR)', 

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
	
	createStatementSiteEvaluation = 'CREATE TABLE IF NOT EXISTS site_evaluation  '
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
	
	createStatementSiteEvaluationFactor = 'CREATE TABLE IF NOT EXISTS site_evaluation_factor  '
				+ '(id INTEGER PRIMARY KEY NOT NULL ,  '
				+ 'factor_id INTEGER NOT NULL ,  '
				+ 'rating INTEGER NOT NULL ,  '
				+ 'evaluation_id INTEGER NOT NULL )', 
				
	createStatementSiteEvaluationAward = 'CREATE TABLE IF NOT EXISTS site_evaluation_award  '
				+ '(id INTEGER PRIMARY KEY NOT NULL ,  '
				+ 'award_id INTEGER NOT NULL ,  '
				+ 'special_award_specified VARCHAR,  '
				+ 'evaluation_id INTEGER NOT NULL )', 
		
	createStatementSiteEvaluationFeature = 'CREATE TABLE IF NOT EXISTS site_evaluation_feature  '
				+ '(id INTEGER PRIMARY KEY NOT NULL ,  '
				+ 'evaluation_id INTEGER NOT NULL ,  '
				+ 'feature_id INTEGER NOT NULL) ';
			
executeSql(createStatementSite);
executeSql(createStatementSiteMaintainer);
executeSql(createStatementSiteGeolocation);
executeSql(createStatementSiteEvaluation);
executeSql(createStatementSiteEvaluationAward);
executeSql(createStatementSiteEvaluationFactor);
executeSql(createStatementSiteEvaluationFeature);

// DESTROY - table

var dropStatementSiteGeolocation = 'DROP TABLE site_geolocation',
	dropStatementSite = 'DROP TABLE site', 
	dropStatementSiteEvaluation = 'DROP TABLE site_evaluation',
	dropStatementSiteEvaluationAward = 'DROP TABLE site_evaluation_award',
	dropStatementSiteEvaluationFactor = 'DROP TABLE site_evaluation_factor',
	dropStatementSiteEvaluationFeature = 'DROP TABLE site_evaluation_feature',
	dropStatementSiteMaintainer = 'DROP TABLE site_maintainer';
 
executeSql(dropStatementSiteGeolocation); executeSql(dropStatementSite);
executeSql(dropStatementSite); executeSql(dropStatementEvaluation);
executeSql(dropStatementSiteEvaluation);
executeSql(dropStatementSiteEvaluationAward);
executeSql(dropStatementSiteEvaluationFactor);
executeSql(dropStatementSiteEvaluationFeature); 
executeSql(dropStatementSiteMaintainer); 

// CREATE:

//insert gardener name: insertGardener(siteId, gardenerName)
var insertStatement = 'INSERT INTO gardener   '
	+ '(site_id, name)  VALUES (?,?)';

// loadFactorToDb(value, label)
var insertStatement = 'INSERT INTO evaluation_factor  '
	+ '(factor_id, rating, evaluation_id)  ' + 'VALUES (?,?,?)';

// loadFeatureToDb(value)
var insertStatement = 'INSERT INTO evaluation_feature  '
	+ '(feature_id, evaluation_id)  ' 
	+ 'VALUES (?,?)';

// loadAwardToDb(value, comment)
var insertStatement = 'INSERT INTO evaluation_award  '
	+ '(award_id, special_award_specified, evaluation_id)  '
	+ 'VALUES (?,?,?)';

//insertGeolocationToDb(latitude, longitude, accuracy, timeStamp, siteId)
var insertStatement = 'INSERT INTO geo_location   '
	+ '(site_id, latitude,longitude,accuracy,timestamp)  VALUES (?,?,?,?,?)';

// loadDbSite(site_id, address, city, state, zip)
var InsertStatement = 'INSERT INTO site(site_id,  ' 
	+ 'site_type_id,  '
	+ 'address,   ' 
	+ 'city,   ' 
	+ 'state,   ' 
	+ 'zip)  '
	+ 'VALUES (?,?,?,?,?,?)';

//  loadDbEvaluation(site_id, evaluator_id, evaluation_id)
var InsertStatement = 'INSERT INTO evaluation(site_id,  '
	+ 'evaluator_id,  ' 
	+ 'evaluation_id, '
	+ 'date_loaded_to_device) VALUES (?,?,?,?)';

// READ:

// loadEvaluation(id) 
var selectStatement = 'SELECT * FROM evaluation e  '
	+ 'WHERE e.evaluation_id = ?';

// loadSite(id)
var selectStatement = 'SELECT * FROM evaluation e INNER JOIN  '
	+ 'site s ON s.site_id = e.site_id  ' + 'WHERE e.evaluation_id = ?';

//  loadEvaluationAward(id)
var selectStatement = 'SELECT * FROM evaluation_award ea  '
	+ 'WHERE ea.evaluation_id = ?';

// loadEvaluationFactor(id) 
var selectStatement = 'SELECT * FROM  evaluation_factor ef  '
	+ 'WHERE ef.evaluation_id = ?';

//  loadEvaluationFeature(id)
var selectStatement = 'SELECT * FROM  evaluation_feature ef  '
	+ 'WHERE ef.evaluation_id = ?';

// loadGeolocation(id)
var selectStatement = 'SELECT g.id, g.site_id, g.latitude, g.longitude, g.accuracy, g.timestamp, e.evaluation_id  '
	+ 'FROM geo_location g INNER JOIN  '
	+ 'site s ON g.site_id = s.site_id INNER JOIN evaluation e  '
	+ 'ON s.site_id = e.site_id  '
	+ 'WHERE e.evaluation_id = ?  '
	+ 'GROUP BY g.id, g.site_id, g.latitude, g.longitude, g.accuracy, g.timestamp,e.evaluation_id ';

// loadGardener(id)
var selectStatement = 'SELECT g.id, g.name, g.site_id, e.evaluation_id  '
	+ 'FROM gardener g INNER JOIN  '
	+ 'site s ON s.site_id = g.site_id INNER JOIN  '
	+ 'evaluation e ON s.site_id = e.site_id  '
	+ 'WHERE e.evaluation_id = ?  '
	+ 'GROUP BY g.id, g.name, g.site_id, e.evaluation_id ';

// UPDATE:

// updateHood(neighborhood)
var updateStatement = 'UPDATE site   ' // get evaluation_id
	+ 'SET neighborhood = ?  '
	+ 'WHERE site_id IN (SELECT site_id FROM evaluation WHERE evaluation_id = ?)';

// updateLocationPage()
var updateStatement = 'UPDATE evaluation   '
	+ 'SET date_of_evaluation = ?  ' 
	+ 'WHERE evaluation_id = ?';

// updateExistence()
var updateStatement = 'UPDATE evaluation  ' 
	+ 'SET no_longer_exists = 1 '
	+ 'WHERE evaluation_id = ?';

// updateEvaluationRatingComment(sumRating, generalComment)
var updateStatement = 'UPDATE evaluation  ' 
	+ 'SET sum_rating = ?,  '
	+ 'comments = ?,  '
	+ 'date_entered_on_device_by_evaluator  = ? '
	+ 'WHERE evaluation_id = ?';

var updateStatement = 'UPDATE evaluation  ' 
	+ 'SET sum_rating = ?,  '
	+ 'date_entered_on_device_by_evaluator  = ? '
	+ 'WHERE evaluation_id = ?';

// updateWhenPosted(id) 
var updateStatement = 'UPDATE evaluation   '
	+ 'SET date_posted_to_remote = ?  ' 
	+ 'WHERE evaluation_id = ?';

// DELETE???

// end DAO

// backbone-relational model
var SiteEvaluation,
	EvaluationFeature,
	EvaluationAward,
	EvaluationFactorScorecard,
	Site;

//parent class
Site = Backbone.AssociatedModel.extend({
	default: {
		id: '_id',
		remoteSiteId: '', // key to match remote db site
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
		maintainer: [{ // gardener, if known
			name: ''
		}],
	},
	relations: [{
		relatedModel: SiteEvaluation,
        type: Backbone.HasMany,
        key: 'Evaluation.id',
        reverseRelation: {
            key: 'SiteEvaluation.id',
        }
    }]
});

//each evaluation will have a score associated with an assessment factor. this collection is the scorecard for the evaluation
EvaluationFactorScorecard = Backbone.AssociatedModel.extend({
	default: {
		id: '_id',
		score: '',
		factorType: '' // link to Factor.id
	}
});

EvaluationAward = Backbone.AssociatedModel.extend({
	default: {
		id: '_id',
		specialAwardSpecified: '',
		awardType: '' // link to Award.id
	}
});

EvaluationFeature = Backbone.AssociatedModel.extend({
	default: {
		id: '_id',
		featureType: '' // link to Feature.id
	}
});

SiteEvaluation = Backbone.AssociatedModel.extend({
	default: {
		id: '_id',
		remoteEvaluationId: '', // key to match remote db site
		sumRating: '', // total score for evaluation factors - should equal sum of ratings over scorecard
		dateLoadedToDevice: '', // when loaded from remote
		datePostedToRemote: '', // when posted to remote
		dateUpdated: '', // update to evaluation
		evaluator: { // evaluator assigned to evaluation
			firstName: '',
			lastName: '',
			remoteEvaluatorId: '', // map to remote db  
		},
		noLongerExists: false,
		comments: '',
		evaluationType: '', // link to EvaluationType.id,
	},
	relations: [ 
		{
			relatedModel: EvaluationAward,
	        type: Backbone.HasOne,
	        key: 'EvaluationAward.id',
	        reverseRelation: {
	            key: 'SiteEvaluation.id',
	        }
		},
		{
			relatedModel: EvaluationFactorScorecard,
	        type: Backbone.HasMany,
	        key: 'EvaluationFactorScorecard.id',
	        reverseRelation: {
	            key: 'SiteEvaluation.id',
	        }
        }, 
		{
			relatedModel: EvaluationFeature,
	        type: Backbone.HasMany,
	        key: 'EvaluationFeature.id',
	        reverseRelation: {
	            key: 'SiteEvaluation.id',
	        }
		},  
    ],
});

// lookup data
var evaluationType = 
	[
	    { id: 1, description: 'First round garden' },
		{ id: 2, description: 'Second round garden' },
		{ id: 3, description: 'Voluntary rain garden' }
	];

var factor = 
	[ 
		{ id: 1, description: 'color' },
		{ id: 2, description: 'plant variety' },
		{ id: 3, description: 'design' },
		{ id: 4, description: 'maintenance' },
		{ id: 5, description: 'environmental stewardship' }
	];

// nominate for an award: garden should only be considered for best boulevard or container garden if sum of scorecard is less than 18
var award = 
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
	
var feature = 
	[
		{ id: 1, description: 'rain barrel'},
		{ id: 2, description: 'redirected downspouts'},
		{ id: 3, description: 'rain garden'}
	];	

// override Backbone.sync
Backbone.sync = function (method, model, options) {
	
	var dao = new model.dao(window.db);
	
	switch (method) {
	case 'read':
		if (model.id) {
            dao.find(model, function (data) {
                options.success(data);
            });
        } else {
            dao.findAll(function (data) {
                options.success(data);
            });
        }
        break;
    case 'create':
        dao.create(model, function (data) {
            options.success(data);
        });
        break;
    case 'update':
        dao.update(model, function (data) {
            options.success(data);
        });
        break;
    case 'delete':
        dao.destroy(model, function (data) {
            options.success(data);
        });
        break;
    }
};
