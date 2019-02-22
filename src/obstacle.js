class Obstacle {
	constructor(position, radius, lifespan) {
		this.position = position;
		this.radius = radius;
		this.lifespan = 10000;
		this.active = true;
	}

	draw() {
		fill(255, 0, 0);
		ellipse(this.position.x, this.position.y, this.radius, this.radius);
	}

	update() {
		this.lifespan--;
	}
}
