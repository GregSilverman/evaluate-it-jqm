// miscellaneous jQuery functions

$(document).ready(
		function() {
			
			// initialize validation rules
			$("#locationForm").validate({
				rules : {
					dateOfEvaluation : {
						required : true,
						date : true
					},
					neighborhood:  {
						required : true
					}
				},
				messages : {
					dateOfEvaluation : "Please enter valid date!",
					neighborhood: "Please enter the neighborhood!"
				}
			});

			// bind actions to controls to hide or show items: TODO - add other
			// categories
			$("#garden").hide();

			$("#mainMenu").change(function() {
				var value = $(this).val();

				if (value != "1") {
					$("#garden").hide();
				} else {
					$("#garden").show();
				}

			});

			// clear all form elements: TODO need a better method!!!
			$(function() {
				$('#res').bind(
						'click',
						function() {
							$('#locationForm')[0].reset();
							$("input[type='checkbox']").attr("checked", false)
									.checkboxradio("refresh");
						});
			});

			// hide this until computing a threshold sum_rating: not needed,
			// since rules
			// are too convoluted, will issue and alert instead
			// $(".hide_me").hide();

			// test for reset menu controls; TODO - need to change to a class
			// for code
			// simplification
			$('#btn-reset').live(
					'click',
					function() {

						var myselect = $("select#useOfColor"); // TODO: use
						// class to
						// simplify code
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

						$("input[type='checkbox']").attr("checked", false)
								.checkboxradio("refresh");
						$("#generalComment").val('');
						$("#sumRating").val('');

					});

			$('#myElement').live('click', function() {
				alert($(this).data('id'));
			});

		});

$(function() {
	$('#btn').bind('click', function() {
		var myselect = $("select#awardMenu"); // TODO: use class to
		// simplify code
		myselect[0].selectedIndex = 0;
		myselect.selectmenu("refresh");

		$("#specialAward").val('');
	});
});

// when loading this element retrieve value of ID from Session Storage: this
// will allow for use in data linking
$('#location').live('pageshow', function(event, ui) {
	
	console.log('Parameter ID: ' + sessionStorage.ParameterID);

	LoadSiteEvaluation(sessionStorage.ParameterID);

	// console.log('Selection of location yields:' +
	// SelectValues(sessionStorage.ParameterID));
});

$('#dataToRemote').live('pageshow', function(event, ui) {
	console.log('Parameter ID: ' + sessionStorage.ParameterID);

	AssembleDataToPost(sessionStorage.ParameterID);

	// console.log('Selection of location yields:' +
	// SelectValues(sessionStorage.ParameterID));
});

$('#viewEvaluation').live('pageshow', function(event, ui) {

	var id = sessionStorage.ParameterID;
	console.log('Parameter ID: ' + sessionStorage.ParameterID);

	// view object to be posted
	AsssembleEvaluationView(sessionStorage.ParameterID);

	// view all stored data on device
	LoadEvaluation(id);
	LoadSite(id);
	LoadEvaluationAward(id);
	LoadEvaluationFactor(id);
	LoadEvaluationFeature(id);
	LoadGardener(id);
	LoadGeolocation(id);

	// console.log('Selection of location yields:' +
	// SelectValues(sessionStorage.ParameterID));
});

// validate rules defined above
// moved to updateLocationPage
function validateSite() {
	if ($("#locationForm").valid())
		console.log("Woop! Woop!");
	// save record here
	// called if successfully validated
};

// force menu selection: not yet needed
function validate_form() {
	if (document.evaluate_form.mainMenu.selectedIndex == 0) {
		alert("Please select an evaluation type.");
		return false;
	}
};

// compute sum of ratings: TODO - add other categories
function computeScore() {
	var useOfColor = $("#useOfColor").val();
	var plantVariety = $("#plantVariety").val();
	var design = $("#design").val();
	var maintenance = $("#maintenance").val();
	var environmentalStewardship = $("#environmentalStewardship").val();

	// validate form data
	// $("#evaluatorForm").valid()

	// $(".hide_me").hide();

	// force to be a number and then check if indeed it really is
	if (!isNaN(parseInt(useOfColor, 10)) && !isNaN(parseInt(plantVariety, 10))
			&& !isNaN(parseInt(design, 10))
			&& !isNaN(parseInt(maintenance, 10))
			&& !isNaN(parseInt(environmentalStewardship, 10))) {
		// looks like there might be data in both
		// looks like there might be data in both

		// alert("useOfColor:" + parseInt(useOfColor));
		// alert("plantVariety:" + parseInt(plantVariety));

		var sum = parseInt(useOfColor) + parseInt(plantVariety)
				+ parseInt(design) + parseInt(maintenance)
				+ parseInt(environmentalStewardship);

		// alert("sum:" + parseInt(sum));

		$("#sumRating").val(sum);
		$("#sumRating").attr('disabled', 'disabled');

		// based on threshold value control visibility of award page via div
		// encapsulating a href : this would be ideal, however, since rules are
		// too convoluted, we just issue an alert!

		if (sum < 18 && !isNaN(parseInt(sum, 10))) {
			// $(".hide_me").show();
			alert("This garden should only be considered for best boulevard or container garden, since they are not an EG!");
		} /*
			 * else { $(".hide_me").hide(); }
			 */

	} else {
		alert("Please enter a rating!");
	}
};
