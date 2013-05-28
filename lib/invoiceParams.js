var shortid = require('shortid');

module.exports =  {

	hash : function(req, res, next, hash) {
		req.hash = hash;
		next();
	},
	new_hash : function(req, res, next) {
		req.hash = shortid.generate();
		req.public_hash = shortid.generate();
		next();
	},
	invoice : function(req, res, next) {
		req.invoice = req.body; 
		next();
	},
};