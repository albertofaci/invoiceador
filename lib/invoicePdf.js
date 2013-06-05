phantom = require('phantom');
fs = require('fs');
path = require('path');

// function createPdf(hash, filePath) {
// 	console.log("createPdf")
// 	phantom.create(function(ph){
// 	  console.log("called create on PhantomJs")	
// 	  ph.createPage(function(page) {
// 	  	var url = "http://localhost:3000/"+hash
// 	  	console.log("opening page: "+url)
// 	    page.open(url, function(status) {
// 	    	console.log("STATUS "+status)
// 	      	page.render(filePath, function(){
// 		        console.log('Page Rendered in '+filePath);
// 		        ph.exit();
// 	      	});
// 	    });
// 	  });
// 	});
// }

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
