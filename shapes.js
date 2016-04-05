var shapes = (function () {
	var defaults = {
		x: 0,
		y: 0,
		width: 10,
		height: 10,
		radius: 10,
		strokeWidth: 2,
		strokeColor: '#000000',
		fillColor: '#000000',
	};

	function rotateAroundCenter(context, options) {
		// Rotate the entity around it's center
		var centerx = options.x + (options.width / 2);
		var centery = options.y + (options.height / 2);
		context.translate(centerx, centery);
		context.rotate(degreeToRadians(options.rotateCenter));
	}

	function circle(context, options) {
		options = options || defaults;
		context.save();
		context.fillStyle = options.fillColor;
		context.beginPath();
		context.arc(options.x, options.y, options.radius, 0, Math.PI * 2);
		context.fill();
		context.closePath();
		context.restore();
	}

	function triangle(context, options) {
		options = options || defaults;
		context.save();

		if ('rotate' in options) {
			context.rotate(options.rotate)
		}

		context.strokeWidth = options.strokeWidth;
		context.strokeStyle = options.strokeColor;
		context.fillStyle = options.fillColor;

		context.beginPath();
		context.moveTo(options.x + (options.width / 2), options.y); // Tip
		context.lineTo(options.x, options.y + options.height);
		context.lineTo(options.x + options.width, options.y + options.height);
		context.lineTo(options.x + (options.width / 2), options.y);
		context.closePath();

		context.stroke();
		context.fill();

		context.restore();
	}

	function randomgon(context, options) {
		var width = options.width;
		var height = options.height;

		var x = options.position.x;
		var y = options.position.y;

			// var polySize = 50;
			// var posx = (Math.random() * (width - polySize)).toFixed();
			// var posy = (Math.random() * (height - polySize)).toFixed();

		context.fillStyle = '#f00';
		context.beginPath();
		context.moveTo(options.position.x, options.position.y);
		context.lineTo(x + 100, y + 50);
		context.lineTo(x + 50, y + 100);
		context.lineTo(x + 0, y + 90);
		context.closePath();
		context.fill();
	}


	return {
		circle: circle,
		triangle: triangle,
		randomgon: randomgon
	};
})();
