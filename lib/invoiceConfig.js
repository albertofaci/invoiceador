


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





module.exports = function(app) {


	app.locals.nameIf = function(obj) {
			if(typeof obj !== "undefined") {
				return 'id="'+obj+'" name="'+obj+'"';
			}
			return "";
	};
	app.locals.dataValueIf = function(obj, list, defaultValue) {
		var value = safeNavigate(obj, list);
		if(!value && defaultValue) {
			value = defaultValue;
		}
		if(value) {
			return 'data-value="'+value+'" value="'+value+'"';
		}
		return ""
	};
	app.locals.valueIf = function(obj, list) {
		var value = safeNavigate(obj, list);
		if(value) {
			return 'value="'+value+'"';
		}
		return "";
	};
	app.locals.stringIf = function(obj, list) {
		var value = safeNavigate(obj, list);
		return value;
	};



}