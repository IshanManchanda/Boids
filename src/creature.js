class Creature {
	constructor(position, velocity) {
		// Initialize common members
		velocity.normalize();
		this.position = position;
		this.velocity = velocity;
		this.acceleration = createVector(0, 0);
		this.alive = true;

		// Initialize members for Bin-Lattice Spatial Subdivision
		this.row = 0;
		this.col = 0;
	}

	checkBounds() {
		// Implement wrap-around if the creature has moved outside
		// the simulation area
		if (this.position.x < 0) this.position.x += width;
		else if (this.position.x >= width) this.position.x -= width;

		if (this.position.y < 0) this.position.y += height;
		else if (this.position.y >= height) this.position.y -= height;
	}

	applyForce(force, weight) {
		// Multiply a force by its weight and accumulate
		force.mult(weight);
		this.acceleration.add(force);
		force.mult(0);
	}
}
