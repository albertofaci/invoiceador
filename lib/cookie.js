var authorised = ['company', 'pepe', 'client'];

module.exports =  {

	get : function(req, res, next) {
		console.log("called get")
		console.log(req.cookieName);
		console.log(req.cookies[req.cookieName]);
		res.send(req.cookies[req.cookieName]);
	},
	post : function(req, res, next) {
		console.log("Saving... "+req.body.company_name)
		res.cookie(req.cookieName, req.body.payload);
		res.send("OK");
	},
	authorised_cookies : function(req, res, next) {
		if(authorised.indexOf(req.cookieName) > -1){
			next();
		}
		else {
			//res.send(403);
			var error = new Error();		
			error.status = 403;
			error.entity = 'saved-data'
			error.message = 'Forbidden to save such data'
			next(error);
		}
	}

}