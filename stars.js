// require('tools.js');

function Star(position, magnitude, color) {
	this.position = position;
	this.magnitude = magnitude;
	this.color = color;
}

Star.prototype.draw = function (ctx) {
	shapes.circle(ctx, {
		x: this.position.x,
		y: this.position.y,
		radius: this.magnitude,
		fillColor: this.color,
	});
};

function generateStarField() {
	var layer = new Layer('background');

	// Paint the background of the cosmos.
	layer.context.fillStyle = '#000000';
	layer.context.fillRect(0, 0, layer.width, layer.height);

	// Draw 1000 random stars.
	var star,
		starCount = 1000,
		colors = ['#aaffaa', '#ffccaa', '#aaaaff', '#ffffff'];

	while (starCount--) {
		star = new Star(
			randomVector(layer.width, layer.height),
			randomInt(1, 2) * Math.random(),
			colors[randomInt(0, colors.length)]
		);
		star.draw(layer.context);
	}

	return layer;
}
