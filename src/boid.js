class Boid extends Creature {
	constructor(position, velocity) {
		// Initialize position and velocity
		super(position, velocity);
		this.velocity.mult(boidSpeed);

		// Initialize accumulator variables for various forces
		this.forceCohesion = createVector(0, 0);
		this.forceSeparation = createVector(0, 0);
		this.forceAlignment = createVector(0, 0);
		this.forceFlee = createVector(0, 0);
	}

	draw() {
		// Calculate heading angle and translate + rotate frame
		this.theta = this.velocity.heading() + Math.PI / 2;
		translate(this.position.x, this.position.y);
		rotate(this.theta);

		// Set fill color
		fill(0, 255, 0);

		// TODO: Use a p5.Image to draw
		beginShape();
		vertex(0, -boidSize * 2);
		vertex(-boidSize, boidSize * 2);
		vertex(boidSize, boidSize * 2);
		endShape(CLOSE);

		// DEBUG: Draw Vicinity and Sight Regions
		// fill(255, 0, 0, 30);
		// ellipse(0, 0, boidSight, boidSight);
		// ellipse(0, 0, boidVicinity, boidVicinity);

		// Undo the translation and rotation
		// REVIEW: Why are we not using push and pop matrix operations?
		rotate(-this.theta);
		translate(-this.position.x, -this.position.y);
	};

	update() {
		// Update the acceleration variable for this iteration
		// by applying all enabled forces
		this.applyForces();

		// Perform acceleration, clamp velocity, and update position
		this.velocity.add(this.acceleration);
		this.velocity.limit(boidSpeed);
		this.position.add(this.velocity);

		// Perform simulation boundary wrap-around
		this.checkBounds();

		// Reset acceleration variable for next iteration
		this.acceleration.mult(0);
	};

	applyForces() {
		// If all 3 Boid-Boid interaction rules are turned off,
		// we don't need to perform the spatial division computation
		if (!alignment && !cohesion && !separation) {
			this.applyForce(this.forceFlee, boidFleeWeight);
			return;
		}

		// DEBUG: Non-optimized, non-spatial-divided force calculation
		/*for (let b in boids) {
			let distance = this.position.dist(boids[b].position);
			if (distance === 0 || distance > boidSight) continue;

			alignment && this.alignment(distance, boids[b].velocity);
			cohesion && this.cohesion(distance, boids[b].position);

			if (!separation || distance > (boidVicinity)) continue;
			let angle = this.velocity.angleBetween(boids[b].velocity);
			if (angle >= Math.PI) continue;

			this.separation(distance, boids[b].position);
		}*/

		// Compute the cells in which interactions are possible
		// We check the cell in which the Boid is present and
		// one neighboring cell in each direction
		let x1 = Math.max(0, this.col - 1);
		let x2 = Math.min(horizontalCells, this.col + 1);
		let y1 = Math.max(0, this.row - 1);
		let y2 = Math.min(verticalCells, this.row + 1);

		// Iterate over the selected cells
		for (let x = x1; x <= x2; x++) {
			for (let y = y1; y <= y2; y++) {

				// DEBUG: Draw surrounding squares
				// fill(150, 150, 150);
				// square(x * gridResolution, y * gridResolution, gridResolution);

				// Iterate over all Boids present in the cell
				for (let z = 0; z < gridBoids[x][y].length; z++) {
					let b = gridBoids[x][y][z];
					if (!boids[b]) continue;

					// Compute distance and ignore if outside sight range
					let distance = this.position.dist(boids[b].position);
					if (distance === 0 || distance > boidSight) continue;

					// Compute alignment and cohesion forces if enabled
					alignment && this.alignment(distance, boids[b].velocity);
					cohesion && this.cohesion(distance, boids[b].position);

					// Check if within 'personal space' for separation force
					if (!separation || distance > (boidVicinity)) continue;
					// Compute the difference in the heading angles -
					// we skip the force if the Boids are already moving away
					let angle = this.velocity.angleBetween(boids[b].velocity);
					if (angle >= Math.PI) continue;

					this.separation(distance, boids[b].position);
				}
			}
		}

		// Apply computed forces
		this.forceCohesion.normalize();
		this.applyForce(this.forceAlignment, boidAlignmentWeight);
		this.applyForce(this.forceCohesion, boidCohesionWeight);
		this.applyForce(this.forceSeparation, boidSeparationWeight);
		this.applyForce(this.forceFlee, boidFleeWeight);
	};

	alignment(distance, velocity) {
		// Apply alignment force along the velocity of the target
		// The force diminishes linearly with the distance
		let target = velocity.copy();
		target.normalize();
		target.div(distance);
		this.forceAlignment.add(target);
	};

	cohesion(distance, position) {
		// Apply cohesion force towards the position of a target
		// The force diminishes linearly with the distance
		let target = position.copy();
		target.sub(this.position);
		target.normalize();
		target.div(distance);
		this.forceCohesion.add(target);
	};

	separation(distance, position) {
		// Apply separation force away from the position of a target
		// The force diminishes quadratically with the distance
		let target = position.copy();
		target.sub(this.position);
		target.normalize();
		target.div(-distance * distance);
		this.forceSeparation.add(target);
	};

	flee(distance, position) {
		// Flee from the position of a target
		// Force diminishes linearly with the distance
		let target = position.copy();
		target.sub(this.position);
		target.normalize();
		target.div(-distance);
		this.forceFlee.add(target);
	};
}
