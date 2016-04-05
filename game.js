// require('tools.js');
// require('shapes.js');
// require('stars.js');
// require('entities.js');


// NOTE: maybe separate interfaces into mixins
var HUD;

HUD = function (id) {
	this.el = document.createElement('div');
	this.el.id = 'HUD';
};

HUD.prototype.display = function () {
	document.body.appendChild(this.el);
};

HUD.prototype.update = function (game) {
	this.el.innerHTML = '' +
		'x: ' + Math.floor(game.ship.position.x) + '<br>' +
		'y: ' + Math.floor(game.ship.position.y) + '<br>' +
		'vx: ' + Math.floor(game.ship.velocity.x) + '<br>' +
		'vy: ' + Math.floor(game.ship.velocity.y) + '<br>' +
		'rotation: ' + game.ship.rotation;
};


var game = {
	initialize: function () {
		this.isPaused = false;
		this.background = generateStarField();
		this.map = new Layer('game');
		this.hud = new HUD();

		this.background.display();
		this.map.display();
		this.hud.display();



		document.addEventListener('keydown', function (event) {
			game.keys.add(event.which);
		});

		document.addEventListener('keyup', function (event) {
			game.keys.remove(event.which);

			if (event.which === game.keys.P) {
				game.pause();
			}
		});

		this.ship = new Ship({
			height: 100,
			width: 50,
			position: this.map.center(),
			speed: 1,
			speedLimit: 10,
			image: document.getElementById('spaceship'),
		});

		// game.entities.add(new Asteroid({
		// 	position: game.map.randomPoint()
		// }));

		this.start();
	},
	pause: function () {
		if (game.isPaused) {
			console.log('starting...');
			game.isPaused = false;
			game.start();
		} else {
			console.log('paused...');
			game.isPaused = true;
		}
	},
	start: function () {
		requestAnimationFrame(this.loop.bind(game));
	},
	loop: function loop() {
		if (game.isPaused) {
			return;
		}
		requestAnimationFrame(this.loop.bind(game));
		this.map.clear();
		this.keys.handle();
		this.entities.update();
		this.ship.update(this);
		this.hud.update(this);
	},
	entities: {
		visible: [],
		add: function (entity) {
			if (this.visible.indexOf(entity) === -1) {
				this.visible.push(entity);
			}
		},
		remove: function (entity) {
			this.visible = this.visible.filter(function (e) {
				return e !== entity;
			});
		},
		update: function () {
			this.visible.forEach(function (entity) {
				entity.update(game);
			});
		}
	},
	keys: {
		LEFT:  37,
		UP:    38,
		RIGHT: 39,
		DOWN:  40,
		SPACE: 32,
		P: 80,

		// This array holds the key codes that are currently depressed.
		// This is so that we can process this array and perform more than one
		// movement per tick.
		pressed: [],
		handlers: {},
		add: function (key) {
			if (this.pressed.indexOf(key) === -1) {
				this.pressed.push(key);
			}
		},
		remove: function (key) {
			this.pressed = this.pressed.filter(function (k) {
				return k !== key;
			});
		},
		on: function (key, handler) {
			if (this.handlers[key] === undefined) {
				this.handlers[key] = [];
			}
			this.handlers[key].push(handler);
		},
		handle: function () {
			var i, j, key, handlers;
			for (i = 0; i < this.pressed.length; i++) {
				key = this.pressed[i];
				handlers = this.handlers[key];
				if (!handlers) {
					break;
				}
				for (j = 0; j < handlers.length; j++) {
					if (handlers[j]) {
						handlers[j](game);
					}
				}
			}
		}
	}
};

game.keys.on(game.keys.LEFT, function (game) {
	game.ship.rotation -= 3;
	if (game.ship.rotation < 0) {
		game.ship.rotation = 360 - 3;
	}
});

game.keys.on(game.keys.RIGHT, function (game) {
	game.ship.rotation += 3;
	if (game.ship.rotation === 360) {
		game.ship.rotation = 0;
	}
});

game.keys.on(game.keys.UP, function (game) {
	game.ship.forward(game);
});

game.keys.on(game.keys.DOWN, function (game) {
	game.ship.backward(game);
});

game.keys.on(game.keys.SPACE, function (game) {
	game.ship.fire(game);
});


game.initialize();
