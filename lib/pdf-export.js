phantom = require('phantom');
fs = require('fs');

function createPdf(req, res) {

  phantom.create(function(ph){
    ph.createPage(function(page) {
    	page.set('viewportSize', req.pdf.viewPortSize )
      console.log("requesting "+req.pdf.sourceUrl)
      page.open(req.pdf.sourceUrl, function(status) {
        var file = req.pdf.relativePath+req.pdf.id+'.pdf'
        console.log("saving to file "+file)
        page.render(file, function(){
          ph.exit();
          stream = fs.createReadStream(file);
  		    stream.pipe(res);
        });
      });
    });
  });
}

module.exports = {
	render : function(req, res) {
		createPdf(req, res);
	}
}
