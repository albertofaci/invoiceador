json = require('./invoiceRest')
schema = require('./invoiceSchema')


module.exports = {

	index :  function(req, res, next) {
		var blank = schema.blank;
		res.render('index', {
			display_type: 'EDIT',
			invoiceObject: blank,
			invoice: blank.invoice,
		});
	},
	redirect_index : function(req, res, next) {
		console.log('redirect_index ^^^^^')
		res.redirect('/');
	},
	redirect_edit : function(req, res, next) {
		console.log('redirect_edit ^^^^^')
		res.redirect('/inv/'+req.hash+'/edit');	
	},
	render_edit : function(req, res) {
		res.render('edit-invoice', {
		    hash : req.hash,
		    display_type: 'EDIT',
		    invoiceObject: res.invoiceObject,
		    invoice : res.invoice,
		    baseUrl: req.baseUrl,
		    // alert: req.session.messages.alert
		});
	},
	render_preview : function(req, res) {
		res.render('preview-invoice', {
		    hash : req.hash,
		    display_type: 'VIEW',
		    plain: false,
		    print: false,
		    invoiceObject: res.invoiceObject,
		    invoice : res.invoice,
		    baseUrl: req.baseUrl
		});
	},
	render_view : function(req, res) {
		res.render('view-invoice', {
		    hash : req.hash,
		    display_type: 'VIEW',
		    plain: req.query.plain == 'y',
		    print: req.query.print == 'y',
		    invoiceObject: res.invoiceObject, 
		    invoice : res.invoice
		});
	}

}