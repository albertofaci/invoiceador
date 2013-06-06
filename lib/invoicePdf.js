phantom = require('phantom');
fs = require('fs');
path = require('path');

function createPdf(req, res) {

phantom.create(function(ph){
  ph.createPage(function(page) {
  	page.set('viewportSize', {width:1700,height:1700*1.6})
    page.open("http://localhost:3000/"+req.hash+"?plain=true", function(status) {
      var file = "generated/"+req.hash+'.pdf'
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
