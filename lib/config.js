

function safe(obj, defaultValue) {
	if(typeof obj === "undefined") {
		if(typeof defaultValue !== "undefined") {
			return defaultValue;
		}
		else {
			return ""
		}
	}
	return obj;
}

module.exports = function(app) {


	app.locals.dataValueIf = function(obj, defaultValue) {
		var value = safe(obj, defaultValue);
		if(value) {
			return 'data-value="'+value+'" value="'+value+'"';
		}
		return "";
	};
	app.locals.valueIf = function(obj) {
		var value = safe(obj);
		if(value) {
			return 'value="'+value+'"';
		}
		return "";
	};
	app.locals.stringIf = function(obj) {	
		return safe(obj);
	};



}