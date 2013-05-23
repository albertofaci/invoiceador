var express = require("express");
var invoiceRest = require('./lib/invoiceRest.js');
var invoiceStatic = require('./lib/invoiceStatic.js');
var invoicePage = require('./lib/invoicePage.js');

var app = express();

app.configure(function() {
    app.use(express.bodyParser());
    app.use(app.router);
    app.set('dburl', 'mongodb://localhost/test'); 
});

invoiceRest.register(app);
invoiceStatic.register(app, __dirname);
invoicePage.register(app);

app.listen(3000);	

