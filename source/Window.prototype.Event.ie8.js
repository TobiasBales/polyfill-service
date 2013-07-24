// Window.prototype.Event
(function () {
	Window.prototype.Event = function Event(type, eventInitDict) {
		if (!type) {
			throw new Error('Not enough arguments');
		}

		var event = document.createEventObject();

		event.type = type;
		event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
		event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : true;

		return event;
	};

	Window.prototype.CustomEvent = function CustomEvent(type, eventInitDict) {
		if (!type) {
			throw new Error('Not enough arguments');
		}

		var event = document.createEventObject();

		event.type = type;
		event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
		event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : true;
		event.detail = eventInitDict && eventInitDict.detail || {};

		return event;
	};

	Element.prototype.addEventListener = function addEventListener(type, listener) {
		var element = this;

		if (!element._events) {
			element._events = {};
		}

		if (!element._events[type]) {
			element._events[type] = function (event) {
				var list = element._events[event.type].list, events = Array.prototype.concat.call([], list);

				event.preventDefault = function preventDefault() {
					if (event.cancelable) {
						event.returnValue = false;
					}
				};

				event.stopPropagation = function stopPropagation() {
					event.cancelBubble = true;
				};

				event.stopImmediatePropagation = function stopImmediatePropagation() {
					event.cancelBubble = true;
					event.cancelImmediate = true;
				};

				event.currentTarget = element;
				event.relatedTarget = event.fromElement || null;
				event.target = event.srcElement || element;
				event.timeStamp = new Date().getTime();

				if (event.clientX) {
					event.pageX = event.clientX + document.documentElement.scrollLeft;
					event.pageY = event.clientY + document.documentElement.scrollTop;
				}

				for (var index = 0, length = events.length; index < length && !event.cancelImmediate; ++index) {
					if (list.indexOf(events[index]) > -1) {
						events[index].call(element, event);
					}
				}
			};
			element._events[type].list = [];

			element.attachEvent('on' + type, element._events[type]);
		}

		element._events[type].list.push(listener);
	};

	Element.prototype.removeEventListener = function removeEventListener(type, listener) {
		var element = this;

		if (element._events && element._events[type] && element._events[type].list) {
			var index = element._events[type].list.indexOf(listener);

			if (index > -1) {
				element._events[type].list.splice(index, 1);

				if (!element._events[type].list.length) {
					element.detachEvent('on' + type, element._events[type]);
				}
			}
		}
	};

	Element.prototype.dispatchEvent = function dispatchEvent(event) {
		if (!arguments.length) {
			throw new Error('Not enough arguments');
		}

		if (!event || typeof event.type !== 'string') {
			throw new Error('DOM Events Exception 0');
		}

		var element = this, type = event.type;

		try {
			if (!event.bubbles) {
				event.cancelBubble = true;

				var cancelBubbleEvent = function (event) {
					event.cancelBubble = true;

					(element || window).detachEvent('on' + type, cancelBubbleEvent);
				};

				this.attachEvent('on' + type, cancelBubbleEvent);
			}

			this.fireEvent('on' + type, event);
		} catch (error) {
			do {
				if (element._events && element._events[type]) {
					element._events[type].call(element, event);
				}

				element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
			} while (element && !event.cancelBubble);
		}
	};

	window.addEventListener = Window.prototype.addEventListener = HTMLDocument.prototype.addEventListener = Element.prototype.addEventListener;
	window.removeEventListener = Window.prototype.removeEventListener = ntListener = HTMLDocument.prototype.removeEventListener = Element.prototype.removeEventListener;
	window.dispatchEvent = Window.prototype.dispatchEvent = HTMLDocument.prototype.dispatchEvent = Element.prototype.dispatchEvent;

	window.Event = Window.prototype.Event;
	window.CustomEvent = Window.prototype.CustomEvent;
})();