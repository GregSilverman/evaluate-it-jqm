// Sets the require.js configuration for your application.

require.config({
	
	// 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.2.min")
	paths: {
		// Core Libraries
		"jquery": "libs/jquery-1.8.3",
		"jquerymobile": "libs/jquery.mobile-1.2.0",
		"cordova": "libs/cordova-1.7.0rc1",
		"underscore": "libs/lodash",
		"backbone": "libs/backbone",
		"jqueryjson": "libs/json2",
		"backbonevalidate": "libs/Backbone.validateAll",//look at backbone.validate
		"evaluateit": "libs/evaluate.it",
		"evaluateitconfig": "libs/evaluate.it.config"
	},

		
      // Sets the configuration for your third party scripts that are not AMD compatible
	shim: {
		"backbone": {
			"deps": [ "underscore", "jquery" ],
			"exports": "Backbone"  //attaches "Backbone" to the window object
		},
		"backbonevalidate": {
			"deps": [ "backbone", "jquery" ],
			"exports": "backbonevalidate"  
		},
		"cordova": {
			"exports": 'cordova'
		},
		"evaluateitconfig": {
			"exports": "evaluateitconfig"  
		},
		"evaluateit": {
			"deps": [ "cordova", "jquery", "jquerymobile", "jqueryjson", "evaluateitconfig", "underscore"],
			"exports": "evaluateit"  
		},
		"jqueryjson" : {
			"deps": [ "jquery" ],
			"exports": "jqueryjson"
		}
	} // end Shim Configuration

});

// Includes File Dependencies
require([  "jquery",  "cordova", "jquerymobile",  "underscore", "evaluateit"], function () {

//require(["jquery", "cordova",  "routers/mobileRouter", "jquerymobile",  "underscore", "evaluateit", "jqueryjson"], function ($, Backbone, Mobile) {
	onBodyLoad();
	
	
	selectLocation(function (test) {
		console.log("DATA out:" + JSON.stringify(test));
		testMe(JSON.stringify(test));
	});
	
	function testMe(test) {
		test = "AAAA:::" + test;
		console.log("DATA last:" + test);
	}
	
	
	
	// Prevents all anchor click handling including the addition of active button state and alternate link blurring.
	//$.mobile.linkBindingEnabled = false;

	// Disabling this will prevent jQuery Mobile from handling hash changes
	//$.mobile.hashListeningEnabled = false;

	// Instantiates a new Backbone.js Mobile Router
	//this.router = new Mobile();
	
});