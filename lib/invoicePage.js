module.exports.register = function(app) {

	var express = require("express");

    app.set('view engine', 'ejs');
    app.set('view options', {
	    layout: false
	});

	app.get('/', function(req, res) {
		var ts = '?b='+String(Math.round(new Date().getTime() / 1000));
		res.render('index', {
		    bust : ts,
		    hash : null,
		    invoice : { sender: {}, recipient: { address: {} }, invoice_data : {} }
		});
	});

	app.get('/:hash', function(req, res) {
		var ts = '?b='+String(Math.round(new Date().getTime() / 1000));
		res.render('index', {
		    bust : ts,
		    hash : req.params.hash 
		});
	});

}