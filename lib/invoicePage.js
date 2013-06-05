pdfs = require('./invoicePdf')
phantom = require('phantom')
fs = require('fs')

module.exports = {

	index :  function(req, res, next) {
		res.render('index', {display_type: 'EDIT'});
	},
	redirect_edit : function(req, res, next) {
		res.redirect('/inv/'+req.hash+'/edit');	
	},
	render_edit : function(req, res) {
		res.render('edit-invoice', {
		    hash : req.hash,
		    display_type: 'EDIT',
		    invoice : res.invoice,
		    invoiceObject: res.invoiceObject 
		});
	},
	render_view : function(req, res) {
		var format = req.params.ext;
		if(format == 'pdf') {
			pdfs.render(req, res)
		}
		else {
			res.render('view-invoice', {
			    hash : req.hash,
			    display_type: 'VIEW',
			    plain: req.query.plain == 'true',
			    invoice : res.invoice,
			    invoiceObject: res.invoiceObject 
			});
		}

	}

}