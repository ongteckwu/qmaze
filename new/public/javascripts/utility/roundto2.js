define(function() {
	var roundTo2 = function(number) {
		return +(Math.round(number * 100)/100);
	};

	return roundTo2;
})