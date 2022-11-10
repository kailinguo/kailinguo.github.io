(function(global) {
	var Vector = function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	};

	Vector.prototype.add = function(vector) {
		this.x += vector.x;
		this.y += vector.y;
	};

	Vector.prototype.getMagnitude = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};

	Vector.prototype.getAngle = function() {
		return Math.atan2(this.y, this.x);
	};

	Vector.fromAngle = function(angle, magnitude) {
		return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
	};

	var Particle = function(point, velocity, acceleration) {
		this.position = point || new Vector(0, 0);
		this.velocity = velocity || new Vector(0, 0);
		this.acceleration = acceleration || new Vector(0, 0);
		this.color = 'rgb(' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ')';
	};

	Particle.prototype.move = function() {
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
	};

	Particle.prototype.submitToFields = function(fields) {
		var totalAccelerationX = 0;
		var totalAccelerationY = 0;

		for (var i = 0; i < fields.length; i++) {
			var field = fields[i];

			var vectorX = field.position.x - this.position.x;
			var vectorY = field.position.y - this.position.y;

			var force = field.mass / Math.pow(vectorX * vectorX + vectorY * vectorY, 1.5);

			totalAccelerationX += vectorX * force;
			totalAccelerationY += vectorY * force;
		}

		this.acceleration = new Vector(totalAccelerationX, totalAccelerationY);
	};

	var Emitter = function(point, velocity, spread) {
		this.position = point;
		this.velocity = velocity;
		this.spread = spread || Math.PI / 32;
		this.drawColor = "#999";
	};

	Emitter.prototype.emitParticle = function() {
		var angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);
		var magnitude = this.velocity.getMagnitude();
		var position = new Vector(this.position.x, this.position.y);
		var velocity = Vector.fromAngle(angle, magnitude);

		return new Particle(position, velocity);
	};

	var Field = function(point, mass) {
		this.position = point;
		this.setMass(mass);
	};

	Field.prototype.setMass = function(mass) {
		this.mass = mass || 100;
		this.drawColor = mass < 0 ? "#f00" : "#0f0";
	};

	var Sandbox = new(Sandbox = function() {
		var $this = this,
			$fieldSize = 5,
			$particleSize = 1,
			$maxParticles = 1000,
			$emissionRate = 4;

		$this.Emitters = [];
		$this.Fields = [];
		$this.Particles = [];
		$this.proportion = 3/2;

		$this.Canvas = document.getElementById('fountainCanvas');
		$this.Context = $this.Canvas.getContext('2d');

		$this.Factory = {
			Circle: function(object) {
				$this.Context.fillStyle = object.drawColor;
				$this.Context.beginPath();
				$this.Context.arc(object.position.x, object.position.y, $fieldSize, 0, Math.PI * 2);
				$this.Context.closePath();
				$this.Context.fill();
			},

			Emitters: function() {
				if ($this.Particles.length > $maxParticles) {
					return;
				}

				for (var i = 0; i < $this.Emitters.length; i++) {
					for (var j = 0; j < $emissionRate; j++) {
						$this.Particles.push($this.Emitters[i].emitParticle());
					}
				}

				return $this.Factory;
			},

			Particles: function() {
				var particles = [];

				for (var i = 0; i < $this.Particles.length; i++) {
					var particle = $this.Particles[i];
					var pos = particle.position;

					if (pos.x < 0 || pos.x > $this.Canvas.width || pos.y < 0 || pos.y > $this.Canvas.height) {
						continue;
					}

					particle.submitToFields($this.Fields);

					particle.move();

					particles.push(particle);
				}

				$this.Particles = particles;

				return $this.Factory;
			}
		};

		$this.Render = function() {
			$this.Factory.Emitters();

			$this.Context.clearRect(0, 0, $this.Canvas.width, $this.Canvas.height);

			$this.Factory.Particles();

			for (var i = 0; i < $this.Particles.length; i++) {
				var position = $this.Particles[i].position;

				$this.Context.fillStyle = $this.Particles[i].color;
				$this.Context.fillRect(position.x, position.y, $particleSize, $particleSize);
			}

			$this.Fields.forEach($this.Factory.Circle);
			$this.Emitters.forEach($this.Factory.Circle);

			window.requestAnimationFrame($this.Render);

			return $this;
		};

		$this.Resize = function() {
			//$this.Canvas.width = window.innerWidth;
			//$this.Canvas.height = window.innerHeight;

			$this.Canvas.width = 800;
			$this.Canvas.height = 400;

			return $this;
		};

		window.addEventListener('resize', $this.Resize);

		$this.Resize().Render();

		$this.Emitters = [
			new Emitter(new Vector(($this.Canvas.width / $this.proportion) - 150, ($this.Canvas.height / 2)), Vector.fromAngle(6, 2))
		];

		$this.Fields = [
			new Field(new Vector(($this.Canvas.width / $this.proportion) - 100, ($this.Canvas.height / 2) + 20), 150),
			new Field(new Vector(($this.Canvas.width / $this.proportion) - 300, ($this.Canvas.height / 2) + 20), 100),
			new Field(new Vector(($this.Canvas.width / $this.proportion) - 200, ($this.Canvas.height / 2) + 20), -20),
		];

		return $this;
	});
})(window);
