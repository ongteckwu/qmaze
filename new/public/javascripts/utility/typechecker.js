//type checker
var Typechecker = {};

Typechecker.typechecker = function(val) {return Object.prototype.toString.call(val)};

Typechecker.typecomparer = function() {
	// determines whether the objects are of the same type
	if (arguments.length <= 1) throw "Not enough arguments";

	var test = undefined;

	//converts arguments into a for-loopable array
	var args = Array.prototype.slice.call(arguments);
	try {
		args.forEach(function(val, index) {
			if (index == 0)
				test = Typechecker.typechecker(val);
			else if (test != Typechecker.typechecker(val)) 
				throw new Error();
		})
	}
	catch(err) {
		return false;
	}

	return true;
};

define(function() {
	return Typechecker;
});
