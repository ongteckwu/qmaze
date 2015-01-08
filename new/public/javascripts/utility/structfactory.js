//structfactory
var StructFactory = function(names) {
	var names = names.split(' ');
	var n = names.length;
	var constructor = function() {
		for (var i=0; i<n; i++) {
			this[names[i]] = arguments[i];
		}
	}

	// constructor.prototype.add = function(another) {
	// 	var newstruct = new constructor();
	// 	for (var i=0; i<n; i++) {
	// 		newstruct[names[i]] = this[names[i]] + another[names[i]];
	// 	}
	// 	return newstruct;
	// }

	// constructor.prototype.compare = function(another) {
	// 	for (var i=0; i<n; i++) {
	// 		if (this[names[i]] != another[names[i]]) return false;
	// 	}

	// 	return true;
	// }
	return constructor;
}

define(function() {
	return StructFactory;
});
// if (require.main === module) {
// 	var testx = new module.exports("A B C");
// 	var test1 = new testx(1, 2, 3);
// 	var test2 = new testx(2, 3, 4);
// 	assert(test1 != test2, "Tests should not be the same");
// 	var test3 = new testx(3, 5, 7);
// 	assert(test1.add(test2).compare(test3), "add and compare are wrong");

// }