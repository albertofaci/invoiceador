module.exports =  {

	get : function(req, res, next) {
		console.log("called get")
		console.log(req.cookieName);
		console.log(req.cookies[req.cookieName]);
		res.send(req.cookies[req.cookieName]);
	},
	post : function(req, res, next) {
		req.body = {hola: "pepe"};
		console.log("Saving...")
		res.cookie(req.cookieName, JSON.stringify(req.body));
		res.send("OK");
	}

}