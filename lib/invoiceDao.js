var mongoose = require('mongoose');
var invoiceSchema = require('./invoiceSchema.js');

module.exports =  function(db_url) {

	mongoose.connect(db_url);
	var InvoiceCatalog = invoiceSchema.register(mongoose);

	return {

		save : function(req, res, next){	
			InvoiceCatalog.create({
				hash: req.hash,
				revision: 0,
				created_date_time : new Date(),
				invoice: req.invoice,
			}, next);
		},

		update : function(req, res, next) {
			InvoiceCatalog.findOne({ hash: req.hash }, function (err, invoiceObject){
			  	invoiceObject.invoice = req.invoice;
			  	invoiceObject.revision++;
			  	invoiceObject.updated_date_time = new Date();
			  	invoiceObject.save(next);
			});
		},

		findByHash : function(req, res, next) {
			InvoiceCatalog.findOne({ hash: req.hash }, function(err, invoiceObject) {
				if(err) {
					res.send(500);
				} else if(invoiceObject){
					res.invoice = invoiceObject.invoice;
					next();
				}
			});
		}
	}
}