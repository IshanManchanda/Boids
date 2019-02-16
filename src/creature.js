class Creature {
	constructor(position, velocity) {
		velocity.normalize();
		this.position = position;
		this.velocity = velocity;
		this.acceleration = createVector(0, 0);
		this.alive = true;
		this.row = 0;
		this.col = 0;
	}

	check_bounds() {
		if (this.position.x < 0) this.position.x += width;
		else if (this.position.x > width) this.position.x -= width;

		if (this.position.y < 0) this.position.y += height;
		else if (this.position.y > height) this.position.y -= height;
	}

	apply_force(force, weight) {
		force.mult(weight);
		this.acceleration.add(force);
		force.mult(0);
	}
}
