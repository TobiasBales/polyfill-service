Array.is = function is(array) {
	return array && Object.prototype.toString.call(array) === '[Object Array]';
};