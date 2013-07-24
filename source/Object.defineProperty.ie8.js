// Object.defineProperty
(function () {
	var defineProperty = Object.defineProperty;

	Object.defineProperty = function (object, property, descriptor) {
		delete descriptor.configurable;
		delete descriptor.enumerable;
		delete descriptor.writable;

		defineProperty(object, property, descriptor);
	};
})();