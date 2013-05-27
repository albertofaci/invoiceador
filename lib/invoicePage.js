module.exports = {

	index :  function(req, res, next) {
		res.render('index')
	},
	edit : function(req, res, next) {
		res.render('edit-invoice', {
		    hash : req.hash 
		})
	},
	view : function(req, res) {
		res.render('view-invoice', {
		    hash : req.hash,
		    invoice : res.invoice 
		});
	}
}