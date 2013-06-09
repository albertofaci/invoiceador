var shortid = require('shortid');
var url = require('url');

function extractBaseUrl(req) {
	return req.baseUrl = req.protocol + "://" + req.get('host');
}

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
	cookieName : function(req, res, next, cookieName) {
		req.cookieName = cookieName;
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
	referrer_base_url: function(req, res, next) {
		var urlObj = url.parse(req.headers['referer']); 
		if(urlObj) {
			req.baseUrl  = urlObj.protocol+"://"+urlObj.host;	
			console.log()
		}
		next();
	},
	base_url: function(req, res, next) {
		req.baseUrl = extractBaseUrl(req)
		next();
	},
	pdf: function(req, res, next) {
		req.pdf = {};
   		req.pdf.sourceUrl = extractBaseUrl(req)+"/"+req.hash+"?plain=y";
		req.pdf.id = req.hash;
		req.pdf.viewPortSize = {width:1700,height:1700*1.6}
	    req.pdf.relativePath = "generated/";
	    console.log("PDF parameters: "+JSON.stringify(req.pdf))
	    next();
	}
};