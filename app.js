
//SETUP
var express = require("express");
var app = express();
var dao  = (require('./lib/invoiceDao.js'))('mongodb://localhost/test');
var rest = require('./lib/invoiceRest.js');
var params =  require('./lib/invoiceParams.js');
var page = require('./lib/invoicePage.js');
var errors = require('./lib/invoiceErrorHandling.js');

app.configure(function() {
    app.use(express.bodyParser());
    app.use(app.router);
  //  app.use(express.logger());
    app.set('view engine', 'ejs');
    app.set('view options', { layout: false });
});

app.use("/assets", express.static(__dirname + '/public'));
app.use("/external", express.static(__dirname + '/external'));
app.use(errors);

//PARAMS
app.param("hash", params.hash);

//ROUTING
app.post('/invoices', params.new_hash, params.invoice, dao.save, rest.hash);
app.put('/invoices/:hash', params.invoice, dao.findByPrivateHash, dao.update, rest.hash);
app.get('/invoices/:hash', dao.findByPrivateHash, rest.invoice);

app.get('/', page.index);
app.get('/edit/:hash', dao.existsPrivateHash, page.edit);
app.get('/view/:hash', dao.findByPublicHash, page.view);

//RUN
app.listen(3000);	

