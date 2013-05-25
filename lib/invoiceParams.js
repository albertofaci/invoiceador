var shortid = require('shortid');

module.exports =  {

	hash : function(req, res, next) {
		req.hash = req.params.hash;
		console.log(next.toString())
		next();
	},
	new_hash : function(req, res, next) {
		req.hash = shortid.generate();
		next();
	},
	invoice : function(req, res, next) {
		req.invoice = req.body; 
		next();
	},
};