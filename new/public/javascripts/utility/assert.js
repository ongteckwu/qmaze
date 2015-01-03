//asserter
var assert = function(condition, message) {
	if (!condition) {
		message = message || "Assertion Failed";
		if (typeof Error !== "undefined") {
			throw new Error(message);
		}
		//fallback
		throw message;
	}
	return "success";
}

define(function() {
	return assert;
});