// Element.prototype.classList
Object.defineProperty(Element.prototype, 'classList', {
	get: function () {
		var
		indexOf = Array.prototype.indexOf,
		concat = Array.prototype.concat,
		join = Array.prototype.join,
		push = Array.prototype.push,
		splice = Array.prototype.splice,
		element = this,
		list = {
			contains: function (value) {
				return indexOf.call(list, value) > -1;
			},
			add: function (value) {
				var index = indexOf.call(list, value);

				if (index < 0) {
					push.call(list, value);
				}

				element.setAttribute('class', join.call(list, ' '));
			},
			remove: function (value) {
				var index = indexOf.call(list, value);

				if (index >= 0) {
					splice.call(list, index, 1);
				}

				element.setAttribute('class', join.call(list, ' '));
			},
			toggle: function (value) {
				var index = indexOf.call(list, value);

				if (index < 0) {
					push.call(list, value);
				} else {
					splice.call(list, index, 1);
				}

				element.setAttribute('class', join.call(list, ' '));
			},
			toString: function () {
				return join.call(list, ' ');
			}
		};

		Object.defineProperty(element, 'className', {
			configurable: true,
			get: function () {
				return join.call(list, ' ');
			},
			set: function (value) {
				if (value) {
					splice.apply(list, concat.apply([0, list.length], String(value).trim().split(/\s+/)));
				} else {
					splice.call(list, 0, list.length);
				}

				element.setAttribute('class', join.call(list, ' '));
			}
		});

		element.className = element.getAttribute('class');

		return list;
	}
});