
//SETUP
var port = process.env.PORT || 3000;
var mongoUrl = process.env.MONGOLAB_URI ||  process.env.MONGOHQ_URL || 'mongodb://localhost/test'; 

var express = require("express");
var app = express()
var ejs = require('ejs');
var http = require('http')
var dao  = (require('./lib/invoiceDao.js'))(mongoUrl);
var rest = require('./lib/invoiceRest.js');
var params =  require('./lib/invoiceParams.js');
var page = require('./lib/invoicePage.js');
var alerts = require('./lib/invoiceAlerts.js');
var pdfExport = require('./lib/pdfExport.js');
//var cookies = require('./lib/invoiceCookie.js');
var errors = require('./lib/invoiceErrorHandling.js');
var exp_extensions = require('./lib/expressExtensions.js');
var flashify = require('flashify');

exp_extensions.apply(app);

app.configure(function() {

	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser("potato"));
	app.use(express.session());
	app.use(flashify);
    app.use(app.router);
    //app.use(express.favicon(__dirname + '/public/images/favicon.ico')); 
    //app.use(express.logger());
    app.set('view engine', 'ejs');
    app.set('view options', { layout: false });

   	app.use(function(err, req, res, next) {
	  console.log(err);
	  next();
	});
	app.use(errors);
		

});

app.use("/assets", express.static(__dirname + '/public'));
app.use("/external", express.static(__dirname + '/external'));
app.get('/favicon.ico', function(req, res) { res.status(499); });  //FAVICON


//PARAMS
app.param("hash", params.hash);
app.param("cookieName", params.cookieName)

//ROUTING - PAGE
app.get('/', page.index); // EDIT UNSAVED
app.post('/inv', params.new_hash, params.invoice_payload, dao.save, alerts.saved, page.redirect_edit) // SAVE NEW
app.get('/inv/:hash', dao.findByPrivateHash, page.render_view); //VIEW AS HTML
app.put('/inv/:hash',  params.invoice_payload, dao.findByPrivateHash, dao.update, alerts.updated, page.redirect_edit); //UPDATE
app.get('/inv/:hash/edit', params.base_url, dao.findByPrivateHash, page.render_edit); //EDIT 
app.get('/inv/:hash/preview', params.base_url, dao.findByPrivateHash, page.render_preview); //EDIT 

app.get('/:hash.pdf', params.pdf, dao.findByPublicHash, pdfExport.render);  //VIEW PUBLIC IN PDF
app.get('/:hash.json',  dao.findByPublicHash, rest.invoice);  //VIEW PUBLIC
app.get('/:hash.:ext?', dao.findByPublicHash, page.render_view);  //VIEW PUBLIC

//ROUTING - COOKIE-SAVED VALUES
//app.get('/saved-details/:cookieName', cookies.authorised_cookies, cookies.get);
//app.post('/saved-details/:cookieName', cookies.authorised_cookies, cookies.post);

//ROUTING - REST
//app.post('/api/v1/invoices', params.new_hash, params.invoice, dao.save, rest.hash);
//app.put('/api/v1/invoices/:hash', params.invoice, dao.findByPrivateHash, dao.update, rest.hash);
//app.get('/api/v1/invoices/:hash.:ext', dao.findByPublicHash, rest.invoice);

//RUN
http.createServer(app).listen(port, function(){
  console.log("Express server listening on port "+port);
});


