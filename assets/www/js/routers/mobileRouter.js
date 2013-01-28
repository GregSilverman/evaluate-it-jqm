var ActionsRoute = Backbone.Router.extend({
		
		routes: {
			'': 'main',
			'category?:type': 'loader',
			'evaluationNotCompleteForm': 'evaluate',
		}, 
		evaluate: function () {
			$.mobile.changePage("#evaluationNotCompleteForm", {reverse: false, changeHash: false});
		},
		main: function () {
			$.mobile.changePage("#main", {reverse: false, changeHash: false});
		},
		
		// load evaluations by category of done/not done
		loader: function (type) {
			alert("type:" + type);
	    
			selectTheseCategories(function (Actions, ActionView) {
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

$(document).ready(function () {
	
	// Prevents all anchor click handling including the addition of active button state and alternate link blurring.
	$.mobile.linkBindingEnabled = false;
	
	// Disabling this will prevent jQuery Mobile from handling hash changes
	$.mobile.hashListeningEnabled = false;
	
	// instantiate new router 
	var router = new ActionsRoute();
	
	// dispatch and monitor routing
	Backbone.history.start();
});