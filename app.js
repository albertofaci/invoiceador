
//SETUP
var express = require("express");
var app = express();
var dao  = (require('./lib/invoiceDao.js'))('mongodb://localhost/test');
var rest = require('./lib/invoiceRest.js');
var set =  require('./lib/invoiceParams.js');
var page = require('./lib/invoicePage.js');

app.configure(function() {
    app.use(express.bodyParser());
    app.use(app.router);
  //  app.use(express.logger());
    app.set('view engine', 'ejs');
    app.set('view options', { layout: false });
});

app.use("/assets", express.static(__dirname + '/public'));
app.use("/external", express.static(__dirname + '/external'));

//ROUTING
app.post('/invoices', set.new_hash, set.invoice, dao.save, rest.hash);
app.put('/invoices/:hash', set.hash, set.invoice, dao.update, rest.hash);
app.get('/invoices/:hash', set.hash, dao.findByHash, rest.invoice);

app.get('/', page.index);
app.get('/edit/:hash', set.hash, page.edit);
app.get('/view/:hash', set.hash, dao.findByHash, page.view);

//RUN
app.listen(3000);	

