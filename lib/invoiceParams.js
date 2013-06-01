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
	invoice_payload : function(req, res, next) {
		req.invoice = JSON.parse(req.body.payload); 
		next();
	},
};