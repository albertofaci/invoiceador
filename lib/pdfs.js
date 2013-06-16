// phantom = require('phantom');
// fs = require('fs');
// path = require('path');
// url = require('url');

// function createPdf(req, res) {
//   phantom.create(function(ph){
//     ph.createPage(function(page) {
//     	page.set('viewportSize', {width:1700,height:1700*1.6})
//       var baseUrl = extractBaseUrl(req);
//       var plainUrl = baseUrl+"/"+req.hash+"?plain=y"
//       console.log("Plain URL!!!! "+plainUrl)
//       page.open(plainUrl, function(status) {
//         var file = "generated/"+req.hash+'.pdf'
//         page.render(file, function(){
//           ph.exit();
//           stream = fs.createReadStream(file);
//   		stream.pipe(res);
//         });
//       });
//     });
//   });
// }

// function extractBaseUrl(req) {
//   var urlObj = url.parse(req.headers['referer']); 
//   return urlObj.protocol+"://"+urlObj.host
// }

// module.exports = {


// 	render : function(req, res) {
// 		createPdf(req, res);
// 	}
// }
