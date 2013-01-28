selectTheseCategories = function (callback) {
			  
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
