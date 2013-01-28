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
require([  "jquery",  "cordova", "jquerymobile",  "backbone", "underscore", "evaluateit"], function () {

//require(["jquery", "cordova",  "routers/mobileRouter", "jquerymobile",  "underscore", "evaluateit", "jqueryjson"], function ($, Backbone, Mobile) {
	onBodyLoad();
	 
	/*selectLocation(function (test) {
		console.log("DATA out:" + JSON.stringify(test));
		testMe(JSON.stringify(test));
	});
	
	function testMe(test) {
		test = "AAAA:::" + test;
		console.log("DATA last:" + test);
	}*/
	
	var ActionsRoute = Backbone.Router.extend({
		
		routes: {
			'': 'main',
			'category?:type': 'loader' 
		}, 
		
		main: function () {
			$.mobile.changePage("#main", {reverse: false, changeHash: false});
		},
		
		loader: function (type) {
			alert("type:" + type);
	    
			testStuff(function (Actions, ActionView) {
				// filter out chosen category to render in view
				var categories = [];
				selectLocation(function (data) {
					//alert("DATA out:" + JSON.stringify(data));
					categories = _.filter(data, function (row) {
						return row.category === type;
					});
					
					// Instantiates a new Category View
					var actions = new Actions(categories), 
						evaluationNotCompleteView,
						evaluationCompleteView;
					
					// TODO: refactor by adding views to a collection
			        switch (type) { 
		            case 'evaluationNotComplete': 
		                evaluationNotCompleteView = new ActionView({el: "#evaluationNotComplete", collection: actions});
		                evaluationNotCompleteView.render();
		                break;
		            case 'evaluationComplete': 
		                evaluationCompleteView = new ActionView({el: "#evaluationComplete", collection: actions});
		                evaluationCompleteView.render();
		                break;
		            default:
		                alert('Nobody Wins!');
			        }
			        
			        alert("Hola!" + this);
		        });
				$.mobile.changePage("#" + type, {reverse: false, changeHash: false});
			});
		}
	});   

	testStuff = function (callback) {
			  
			  // TODO: implement the following pattern
			  
			  /*var Produce =  = {
			    Models: {},
			    Collections: {},
			    Views: {},
			    Templates: {},
			    Routers: {}
			  };*/
			  
		var Action,
			Actions,
			ActionTemplate,
			ActionView;
		
		Action = Backbone.Model.extend({});
			  
		Actions = Backbone.Collection.extend({
			model: Action,
			initialize: function () { 
				alert("Evaluations initialize");
		    }
		});
		
		ActionTemplate =  _.template($('#actions-template').html());
		
		ActionView = Backbone.View.extend({
			initialize: function () {
				
				// The render method is called when Category Models are added to the Collection
				this.collection.on("added", this.render, this);
			},
			
			//template: ActionTemplate,
			events: {
				"click": "makeInput"
			},
			//tagName: 'ul', 
			render: function () { 
				alert("a" + JSON.stringify(this.collection));
				
				// Set view's template property
				this.template = _.template($("script#actions-template").html(), {actions: this.collection.toJSON()});
				
				// Render view's template inside of the current listview element
				this.$el.find("ul").html(this.template);
				
				// Maintains chainability
				return this;
			},
			
			makeInput: function () {
				alert("im in");
			}
		});
		callback(Actions, ActionView);
	};
	
	$(document).ready(function () {
		
		// Prevents all anchor click handling including the addition of active button state and alternate link bluring.
		$.mobile.linkBindingEnabled = false;
		
		// Disabling this will prevent jQuery Mobile from handling hash changes
		$.mobile.hashListeningEnabled = false;
		
		var router = new ActionsRoute();
		Backbone.history.start();
	});
	
	
	
	// Prevents all anchor click handling including the addition of active button state and alternate link blurring.
	//$.mobile.linkBindingEnabled = false;

	// Disabling this will prevent jQuery Mobile from handling hash changes
	//$.mobile.hashListeningEnabled = false;

	// Instantiates a new Backbone.js Mobile Router
	//this.router = new Mobile();
	
});