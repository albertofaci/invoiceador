module.exports = {

	index :  function(req, res, next) {
		res.render('index');
	},
	redirect_edit : function(req, res, next) {
		res.redirect('/inv/'+req.hash+'/edit');	
	},
	render_edit : function(req, res) {
		res.render('edit-invoice', {
		    hash : req.hash,
		    invoice : res.invoice,
		    invoiceObject: res.invoiceObject 
		});
	},
	render_view : function(req, res) {
		res.render('view-invoice', {
		    hash : req.hash,
		    invoice : res.invoice,
		    invoiceObject: res.invoiceObject 
		});

	}

}