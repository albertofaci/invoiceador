
//SETUP
var express = require("express");
var ejs = require('ejs');
var app = express();
var dao  = (require('./lib/invoiceDao.js'))('mongodb://localhost/test');
var rest = require('./lib/invoiceRest.js');
var params =  require('./lib/invoiceParams.js');
var page = require('./lib/invoicePage.js');
var cookies = require('./lib/invoiceCookie.js');
var errors = require('./lib/invoiceErrorHandling.js');


app.locals.nameIf = function(obj) {
		if(typeof obj !== "undefined") {
			return 'id="'+obj+'" name="'+obj+'"';
		}
		return "";
};

function safeNavigate(obj, list) {
	if(typeof obj === 'undefined') {
		return "";
	}
	var ptr = obj;
	for(var i = 0; i < list.length; i++) {
		if(typeof(ptr) !== 'undefined' && ptr != null) {
			ptr = ptr[list[i]];
		}
		else {
			return null;
		}
	}
	return ptr;
}

app.locals.valueIf = function(obj, list) {
	var value = safeNavigate(obj, list);
	if(value) {
		return 'value="'+value+'"';
	}
	return "";
};

app.locals.dataValueIf = function(obj, list) {
	var value = safeNavigate(obj, list);
	if(value) {
		return 'data-value="'+value+'" value="'+value+'"';
	}
	return ""
};

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
    app.use(app.router);
    //app.use(express.favicon(__dirname + '/public/images/favicon.ico')); 
    app.use(express.logger());
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
app.post('/inv', params.new_hash, params.invoice_payload, dao.save, page.redirect_edit) // SAVE NEW
app.get('/inv/:hash', dao.findByPrivateHash, page.render_view); //VIEW AS HTML
app.put('/inv/:hash',  params.invoice_payload, dao.findByPrivateHash, dao.update, page.redirect_edit); //UPDATE
app.get('/inv/:hash/edit', dao.findByPrivateHash, page.render_edit); //EDIT 
app.get('/:hash', dao.findByPublicHash, page.render_view);  //VIEW PUBLIC

//ROUTING - COOKIE-SAVED VALUES
app.get('/saved-details/:cookieName', cookies.get);
app.post('/saved-details/:cookieName', cookies.post)


//ROUTING - REST
app.post('/api/v1/invoices', params.new_hash, params.invoice, dao.save, rest.hash);
app.put('/api/v1/invoices/:hash', params.invoice, dao.findByPrivateHash, dao.update, rest.hash);
app.get('/api/v1/invoices/:hash.:ext?', dao.findByPublicHash, rest.invoice);

//RUN
app.listen(3000);	

