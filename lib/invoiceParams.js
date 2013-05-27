var shortid = require('shortid');

module.exports =  {

	// hash : function(req, res, next) {
	// 	req.hash = req.params.hash;
	// 	next();
	// },
	hash : function(req, res, next, hash) {
		req.hash = hash;
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