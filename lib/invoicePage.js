pdfs = require('./invoicePdf')
json = require('./invoiceRest')
schema = require('./invoiceSchema')
phantom = require('phantom')
fs = require('fs')


module.exports = {

	index :  function(req, res, next) {
		var blank = schema.blank;
		res.render('index', {
			display_type: 'EDIT',
			invoiceObject: blank,
			invoice: blank.invoice,
		});
	},
	redirect_edit : function(req, res, next) {
		res.redirect('/inv/'+req.hash+'/edit');	
	},
	render_edit : function(req, res) {
		res.render('edit-invoice', {
		    hash : req.hash,
		    display_type: 'EDIT',
		    invoiceObject: res.invoiceObject,
		    invoice : res.invoice,
		});
	},
	render_view : function(req, res) {
		var format = req.params.ext;
		if(format == 'pdf') {
			pdfs.render(req, res);
		}
		else if(format == 'json') {
			json.invoice(req, res);
		}
		else {
			res.render('view-invoice', {
			    hash : req.hash,
			    display_type: 'VIEW',
			    plain: req.query.plain == 'y',
			    print: req.query.print == 'y',
			    invoiceObject: res.invoiceObject, 
			    invoice : res.invoice,
			});
		}

	}

}