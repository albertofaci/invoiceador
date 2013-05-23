$(document).ready(function () {

	function loadInvoiceData(hash, callback) {
		$.ajax({
	        type: "GET",
	        url: "/invoices/"+sheet.shortid,
	        data: null,
	        contentType: "application/json; charset=utf-8",
	        dataType: "json",
	        success: function(data){
	            callback.call(data)
	        },
	        failure: function(errMsg) {
	            alert("The invoice could not be recorded due to an error. Try again later");
	        }
	    });
	}

	function setInvoiceData(json) {
		
	}

 	
});