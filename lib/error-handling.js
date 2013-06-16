module.exports = function(err, req, res, next) {
	res.status(err.status);
  	res.render('error', { error: err });
}