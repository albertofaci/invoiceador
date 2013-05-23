module.exports.register = function(app, dirname) {

	var express = require("express");

	console.log(dirname + '/public')

	app.use("/assets", express.static(dirname + '/public'));
    app.use("/external", express.static(dirname + '/external'));

}