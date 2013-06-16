var mongoose = require('mongoose');
var invoiceSchema = require('./invoice-schema.js');

module.exports =  function(db_url) {

	mongoose.connect(db_url);
	var InvoiceCatalog = invoiceSchema.register(mongoose);

	mongoose.connection.on("open", function(ref) {
	  return console.log("Connected to mongo server!");
	});

	mongoose.connection.on("error", function(err) {
	  console.log("Could not connect to mongo server!");
	  return console.log(err.message);
	});

	function createSuccessAlert() {
		var alert = {};
		alert.class = "alert-success";
		alert.text = "Invoice saved successfully"
		return alert;
	}

	function _findByPrivateHash(req, res, next) {
		InvoiceCatalog.findOne({ 'private_data.hash': req.hash }, function(err, invoiceObject){
			var error = new Error();
			if(err) {
				error.status = 500;
				error.entity = 'invoice'
				error.message = 'Error fetching invoice'
				next(error);
			} else if(!invoiceObject){
				error.status = 404;
				error.entity = 'invoice'
				error.message = 'Invoice not found'
				next(error);
			}
			else {
	
				//console.log(JSON.stringify(invoiceObject))
				res.invoiceObject = invoiceObject
				res.invoice = invoiceObject.invoice;
				next();
			}
		});
	}

	function _findByPublicHash(req, res, next) {
		console.log('trying to find hash with '+req.hash)
		InvoiceCatalog.findOne({ public_hash: req.hash }, function(err, invoiceObject) {
			var error = new Error();
			if(err) {
				error.status = 500;
				error.entity = 'invoice'
				error.message = 'Error fetching invoice'
				next(error);
			} else if(!invoiceObject){
				error.status = 404;
				error.entity = 'invoice'
				error.message = 'Invoice not found'
				next(error);
			}
			else {
				invoiceObject.private_data = null; //protect private data
				res.invoiceObject = invoiceObject
				res.invoice = invoiceObject.invoice;
				next();
			}
		});
	}

	function _save(req, res, next) {
			
		InvoiceCatalog.create({
			public_hash: req.public_hash,
			private_hash: req.hash,
			private_data : {
				hash: req.hash,
				revision: 0,
				created_date_time : new Date(),
			},
			invoice: req.invoice,
		}, function(err){
			if(err) {
				var error = new Error();
				error.status = 500;
				error.entity = 'invoice'
				error.message = 'Error saving invoice'
				next(error);
			}
			else {
				//req.flash(createSuccessAlert());
				next();
			}
		});
	}

	function _update(req, res, next){
		var invoiceObject = res.invoiceObject;
		invoiceObject.invoice = req.invoice; //body
	  	invoiceObject.private_data.revision++;
	  	invoiceObject.private_data.updated_date_time = new Date();
	  	invoiceObject.save(function(err){
	  		if(err) {
	  			var error = new Error();
				error.status = 500;
				error.entity = 'invoice'
				error.message = 'Error updating invoice '+JSON.stringify(err);
				next(error);
	  		}
	  		else {
	  			res.invoiceObject = invoiceObject;
	  			res.invoice2 = invoiceObject.invoice;
		  		res.invoice = invoiceObject.invoice;
		  		//req.flash(createSuccessAlert());
		  		next();
	  		}
	  	});
	}

	function _delete(req, res, next) {
		var invoiceObject = res.invoiceObject;
		if(!invoiceObject) {
			error.status = 404;
			error.entity = 'invoice'
			error.message = 'Invoice not found'
			next(error);
		}
		else {
			invoiceObject.remove();
			next();
		}
	}


	return {
		"save" : _save,  //(req.hash) -> 
		"update" : _update, // (res.invoiceObject, req.invoice) -> (res.invoiceObject, res.invoice) 
		"delete": _delete, 
		"findByPrivateHash" : _findByPrivateHash, //req.hash -> (res.invoice, res.invoiceObjet)
		"findByPublicHash" : _findByPublicHash,
	}
}