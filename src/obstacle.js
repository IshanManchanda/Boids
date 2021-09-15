class Obstacle {
	constructor(position, radius, lifespan=10000) {
		this.position = position;
		this.radius = radius;
		this.lifespan = lifespan;
		this.active = true;
	}

	draw() {
		fill(255, 0, 0);
		ellipse(this.position.x, this.position.y, this.radius, this.radius);
	}

	update() {
		this.lifespan--;
		if (this.lifespan <= 0) {
			this.active = false;
		}
	}
}
