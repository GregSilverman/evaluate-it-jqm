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
		"evaluateitconfig": "libs/evaluate.it.config",
		"router": "routers/mobileRouter",
		"view": "views/mobileView",
	},

		
      // Sets the configuration for your third party scripts that are not AMD compatible
	shim: {
		"backbone": {
			"deps": [ "underscore", "jquery" ],
			"exports": "Backbone"  //attaches "Backbone" to the window object
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
		},
		"router" : {
			"deps": [ "jquery", "backbone" ],
			"exports": "router"
		},
		"view" : {
			"deps": [ "jquery", "backbone", "router" ],
			"exports": "router"
		}
	} // end Shim Configuration

});

// Includes File Dependencies and then fire it off!
require([  "jquery",  "cordova", "jquerymobile",  "backbone", "underscore", "evaluateit", "router", "view"], function () {

//require(["jquery", "cordova",  "routers/mobileRouter", "jquerymobile",  "underscore", "evaluateit", "jqueryjson"], function ($, Backbone, Mobile) {
	onBodyLoad();
	 
	
	
});