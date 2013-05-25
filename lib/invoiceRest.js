
module.exports = {

	hash : function(req, res, next) {
		if(!req.hash) 	res.send(res.err);
		else 			res.json(req.hash);
	},

	invoice : function(req, res, next) {
		if(!res.invoice) 	res.send(res.err);
		else 				res.json(res.invoice);
	}

}