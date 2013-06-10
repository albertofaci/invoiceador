
var alert_messages = {
	save : {
		success : "Your invoice has been created successfully",
		error : "There was an error creating your invoice"
	},
	update : {
		success: "Your invoice has been updated",
		error : "There was an error updating your invoice"
	},
	fork : {
		success: "Your invoice has been forked. Note the new URL",
		error : "There was an error forking your invoice"
	}
}

module.exports = {

	saved : function(req, res, next) {
		var err = null;
		var op = (req.body.fork == 'y' ? 'fork': 'save');
		var type = (err ? 'error' : 'success');
		console.log("op="+op+" type="+type);
		req.flash({"class": type, "text": alert_messages[op][type]})
		next()
	},
	updated : function(req, res, next) {
		var err = null;
		var type = (err ? 'error' : 'success');
		req.flash({"class": type, "text": alert_messages.update[type]})
		next()
	},


}