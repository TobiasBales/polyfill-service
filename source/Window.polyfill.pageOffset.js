// Window.polyfill.pageOffset
Window.polyfill.push(function () {
	var
	window = this,
	document = window.document,
	documentElement = document.documentElement;

	function onResize() {
		var body = document.body || document.createElement('body');

		// <window>.pageXOffset
		window.pageXOffset = Math.max((documentElement.scrollLeft || body.scrollLeft || 0) - (documentElement.clientLeft || body.clientLeft || 0), 0);

		// <window>.pageYOffset
		window.pageYOffset = Math.max((documentElement.scrollTop || body.scrollTop || 0) - (documentElement.clientTop || body.clientTop || 0), 0);

		// <window>.innerWidth
		window.innerWidth = documentElement.clientWidth;

		// <window>.innerHeight
		window.innerHeight = documentElement.clientHeight;
	}

	window.attachEvent('onresize', onResize);
	window.attachEvent('onscroll', onResize);

	onResize();
});