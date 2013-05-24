var mongoose = require('mongoose');
var invoiceSchema = require('./invoiceSchema.js');

module.exports =  function(db_url) {

	mongoose.connect(db_url);
	var InvoiceCatalog = invoiceSchema.register(mongoose);

	return {
		save : function(invoiceJson, hash, handler){	
			InvoiceCatalog.create({
				hash: hash,
				revision: 0,
				created_date_time : new Date(),
				invoice: invoiceJson,
			}, handler);
		},
		update : function(invoiceJson, hash, handler) {
			InvoiceCatalog.findOne({ hash: hash }, function (err, invoiceObject){
			  	invoiceObject.invoice = invoiceJson
			  	invoiceObject.revision.$inc();
			  	invoiceObject.updated_date_time = new Date();
			  	invoiceObject.save(handler);
			});
		},
		findByHash : function(hash, handler) {
			console.log("finding "+hash);
			InvoiceCatalog.findOne({ hash: hash }, function(err, invoiceObject) {
				if(!err) {
					handler(invoiceObject.invoice);
				}
			});
		}
	}
}