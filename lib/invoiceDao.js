var mongoose = require('mongoose');
var invoiceSchema = require('./invoiceSchema.js');

module.exports =  function(db_url) {

	mongoose.connect(db_url);
	var InvoiceCatalog = invoiceSchema.register(mongoose);

	return {
		save : function(invoiceJson, handler){
			var invoice = new InvoiceCatalog(invoiceJson);
			invoice.save(handler);
		},
		findByHash : function(hash, handler) {
			InvoiceCatalog.findOne({ hash: hash }, handler)
		}
	}
}