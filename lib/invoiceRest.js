var shortid = require('shortid');
var invoicePersistence = require('./invoiceDao.js');

module.exports.register = function(app) {

	var dao = invoicePersistence(app.get('dburl'));
	
	app.post('/invoices', function(req, res){
		var invoice = req.body;
		var hash = shortid.generate();
		invoice['hash'] = hash;
		dao.save(invoice, function(e,data){
			if(e) 	res.json(e);
			else	res.json(hash);	
		});
	});

	app.put('/invoices/:hash', function(req, res){
		var invoiceJson = req.body;
		var hash = req.params.hash ;
		dao.save(invoiceJson, function(e,data){
			if(e) 	res.json(e);
			else	res.json(hash);	
		});
	});

	app.get('/invoices/:hash', function(req, res) {
		dao.findByHash(hash, function(e,invoice){
			if(e) 	res.json(e);
			else if(invoice == null)
					res.json('Invoice not found');
			else	res.json(invoice);	
		});
	});

}