$(document).ready(function () {

	$('#saveCompany').click(function() {
		saveCompanyToCookie();
	});
	$('#loadCompany').click(function() {
		loadCompanyFromCookie();
	});

	function saveCompanyToCookie() {
		var payload = collectCompanyPayload();
		
		var request = $.ajax({
	        url: "/saved-details/company",
	        type: "post",
	        data: {payload: JSON.stringify(payload)},
	        dataType: "json"
	    });

	     request.done(function (response, textStatus, jqXHR){
        	console.log("Hooray, it worked!");
    	});

	    request.fail(function (jqXHR, textStatus, errorThrown){
        	console.error("The following error occured: "+textStatus, errorThrown);
    	});
	}

	function loadCompanyFromCookie() {

		var jqxhr = $.getJSON( "/saved-details/company", function() {
		  console.log( "success" );
		})
		.done(function(data) {
		 	var payload = JSON.parse(data);

		 	 $('#company_name').val(payload.company_name);
		 	 $('#company_vat_registration').val(payload["company_vat_registration"]);
		 	 $('#company_registration_number').val(payload["company_registration_number"]);
		})
		.fail(function() { console.error("error loading company from cookie....")})


	}

    function collectCompanyPayload() {

	    var sender = {
	        "company_name": $('#company_name').val(),
	        "company_registration_number": $('#company_registration_number').val(),
	    }
	    if($('#company_vat_registration').val()) {
	        sender["company_vat_registration"] = $('#company_vat_registration').val()
	    }

	    var payload = JSON.stringify(sender);
	    return payload;
	}
})