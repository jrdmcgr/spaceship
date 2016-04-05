function template(string, data) {
	for (var key in data) {
		string = string.replace('{{' + key + '}}', data[key]);
	}
	return string;
}

function degreeToRadians(degree) {
	return degree * Math.PI / 180;
}

function randomInt(min, max) {
	if (min === undefined) {
		min = 0;
		max = Number.MAX_SAFE_INTEGER;
	}
	if (max === undefined) {
		max = min;
		min = 0;
	}
	return Math.floor(Math.random() * max) + min;
}

function randomVector(width, height) {
	return {
		x: randomInt(0, width),
		y: randomInt(0, height)
	};
}


function Vector(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Vector.prototype.add = function (other) {
	return new Vector(this.x + other.x, this.y + other.y);
};

Vector.prototype.clamp = function (limit) {
	if (this.x > limit) {
		this.x = limit;
	}
	if (this.y > limit) {
		this.y = limit;
	}
	if (this.x < -limit) {
		this.x = -limit;
	}

	if (this.y < -limit) {
		this.y = -limit;
	}
};


/**
 * A canvas layer
 * @param {String} id     The id attribute of the canvas element
 * @param {Number} height
 * @param {Number} width
 */
function Layer(id, height, width) {
	this.height = height || window.innerHeight;
	this.width = width || window.innerWidth;
	this.id = id;
	this.canvas = this._buildCanvas(this.id, this.height, this.width);
	this.context = this.canvas.getContext('2d');
}

Layer.prototype._buildCanvas = function (id, height, width) {
	var canvas = document.createElement('canvas');
	canvas.id = id;
	canvas.height = height;
	canvas.width = width;
	return canvas;
};

Layer.prototype.center = function () {
	return new Vector(this.width / 2, this.height / 2);
};

Layer.prototype.randomPoint = function () {
	return randomVector(this.width, this.height);
}

Layer.prototype.display = function () {
	document.body.appendChild(this.canvas);
};

Layer.prototype.clear = function () {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};
