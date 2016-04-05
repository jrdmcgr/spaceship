var Entity, Bullet, Ship, Asteroid;

Entity = function (config) {
	this.height = config.height || 1;
	this.width = config.width || 1;
	this.rotation = config.rotation || 0;

	this.position = config.position || new Vector(0, 0);
	this.velocity = config.velocity || new Vector(0, 0);
	this.acceleration = config.acceleration || new Vector(0, 0);

	this.speed = config.speed || 0;
	this.speedLimit = config.speedLimit || 0;
	this.direction = null;
};

Entity.prototype.update = function (game) {
	this.draw(game.map.context);
};

Entity.prototype.computeVelocity = function () {
	this.direction = this.rotation;
	// Get the complementary angle.
	var theta = degreeToRadians(90 - this.direction);

	this.velocity.x = this.speed * Math.cos(theta);
	// The canvas is flipped along the x axis, so multiply y by negative 1.
	this.velocity.y = this.speed * Math.sin(theta) * -1;
};

// XXX: Remove use of canvas global
Entity.prototype.isOutOfBounds = function () {
	return this.position.x < 0 ||
			this.position.y < 0 ||
			this.position.x > game.map.width ||
			this.position.y > game.map.height;
};

Entity.prototype.decellerate = function () {
	if (this.idle && this.speed > 0) {
		this.speed -= 0.1;
	} else if (this.idle && this.speed < 0) {
		this.speed = 0;
	}
};

Entity.prototype.teleport = function (game) {
	// Teleport at map edges
	if (this.position.x < this.width * -1) {
		this.position.x = game.map.width + this.width;
	} else if (this.position.x > game.map.width + this.width) {
		this.position.x = this.width * -1;
	}

	if (this.position.y < this.width * -1) {
		this.position.y = game.map.height + this.width;
	} else if (this.position.y > game.map.height + this.width) {
		this.position.y = this.width * -1;
	}
};

/*============================================================================*/


Bullet = function (config) {
	Entity.call(this, config || {});
	this.height = 1;
	this.width = 1;
	this.speed = config.speed || 0;
	this.acceleration = 0.7;
	this.velocity = {x: 0, y: 0};
};

Bullet.prototype = Object.create(Entity.prototype);

// XXX: Remove use of entities global
Bullet.prototype.update = function () {
	this.speed += this.acceleration;
	this.computeVelocity();
	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;

	// Destroy the bullet if it is out of bounds.
	if (this.isOutOfBounds()) {
		game.entities.remove(this);
	}

	this.draw();
};

Bullet.prototype.draw = function () {
	shapes.circle(game.map.context, {
		x: this.position.x,
		y: this.position.y,
		radius: this.width,
		fillColor: 'red'
	});
};


/*============================================================================*/


Ship = function (config) {
	Entity.call(this, config || {});
	this.idle = false;
	// The direction that dude is turning around to when we press DOWN.
	this.turningTo = null;
	this.isThrusting = false;
	this.newSpeed = 0;
	this.image = config.image;
};

Ship.prototype = Object.create(Entity.prototype);

Ship.prototype.draw = function (context) {
	context.save();
	var oldx = this.position.x;
	var oldy = this.position.y;

	// Rotate the entity around it's center
	var centerx = this.position.x + (this.width / 2);
	var centery = this.position.y + (this.height / 2);
	this.position.x -= centerx;
	this.position.y -= centery;
	context.translate(centerx, centery);
	context.rotate(degreeToRadians(this.rotation));
	context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

	// // Draw a triangle.
	// shapes.triangle(context, {
	// 	x: this.position.x,
	// 	y: this.position.y,
	// 	height: this.height,
	// 	width: this.width,
	// 	strokeColor: '#FFFFFF',
	// 	fillColor: '#333333',
	// 	strokeWidth: 10, // XXX: this doesn't work
	// });

	// // Draw the fire when thrusting
	// if (this.isThrusting) {
	// 	shapes.triangle(context, {
	// 		x: this.position.x + 2,
	// 		y: this.position.y - this.height - 2,
	// 		width: this.width - 3,
	// 		height: this.height,
	// 		fillColor: 'red',
	// 		rotate: degreeToRadians(180),
	// 	});
	// }
	// // XXX: This should be done in keys...
	// this.isThrusting = false;

	this.position.x = oldx;
	this.position.y = oldy;
	context.restore();
};

Ship.prototype.update = function (game) {
	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;

	this.teleport(game);
	this.draw(game.map.context);
};

Ship.prototype.forward = function (game) {
	this.isThrusting = true;

	var angle = degreeToRadians(this.rotation);
	var newVelocity = new Vector(
		this.speed * Math.sin(angle),
		this.speed * Math.cos(angle)
	);

	this.velocity.x += newVelocity.x;
	// Use subtraction here, because the y axis is flipped on the canvas.
	this.velocity.y -= newVelocity.y;

	this.velocity.clamp(10);
};

Ship.prototype.backward = function (game) {
	// // Rotate around to the opposite direction.
	// if (this.turningTo === null) {
	// 	this.turningTo = this.rotation + 180;
	// 	if (this.turningTo > 360) {
	// 		this.turningTo -= 360;
	// 	}
	// }

	// if (this.rotation < this.turningTo) {
	// 	this.rotation += 10;
	// } else if (this.rotation > this.turningTo) {
	// 	this.rotation -= 10;
	// }
	var oppositeDirection = this.direction + 180 - this.rotation;
	console.log(oppositeDirection);
	if (this.rotation < this.oppositeDirection) {
		this.rotation += 10;
	} else if (this.rotation > this.oppositeDirection) {
		this.rotation -= 10;
	}
};

Ship.prototype.fire = function (game) {
	var centerx = this.position.x + (this.width / 2);
	var centery = this.position.y + (this.height / 2);
	game.entities.add(new Bullet({
		position: { x: centerx, y: centery },
		rotation: this.rotation,
		speed: this.speed + 5
	}));
};

/*============================================================================*/

Asteroid = function (config) {
	Entity.call(this, config || {});
	this.height = 50;
	this.width = 50;
	this.speed = config.speed || 0;
	this.velocity = {x: 0, y: 0};
};

Asteroid.prototype = Object.create(Entity.prototype);

Asteroid.prototype.draw = function (context) {
	shapes.randomgon(context, {
		height: this.height,
		width: this.width,
		position: this.position
	});
}
