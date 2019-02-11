class Boid extends Creature {
	constructor(position, velocity) {
		super(position, velocity);

		this.velocity.mult(boidSpeed);
		this.force_cohesion = createVector(0, 0);
		this.force_separation = createVector(0, 0);
		this.force_alignment = createVector(0, 0);
		this.force_flee = createVector(0, 0);
	}

	draw() {
		this.theta = this.velocity.heading() + Math.PI / 2;
		translate(this.position.x, this.position.y);
		rotate(this.theta);
		fill(0, 255, 0);

		// TODO: Use a p5.Image to draw
		beginShape();
		vertex(0, -boidSize * 2);
		vertex(-boidSize, boidSize * 2);
		vertex(boidSize, boidSize * 2);
		endShape(CLOSE);

		// Draw Vicinity and Sight Region
		// fill(255, 0, 0, 30);
		// ellipse(0, 0, boidSight, boidSight);
		// ellipse(0, 0, boidVicinity, boidVicinity);

		rotate(-this.theta);
		translate(-this.position.x, -this.position.y);
	};

	update() {
		this.apply_forces();

		this.velocity.add(this.acceleration);
		this.velocity.limit(boidSpeed);
		this.position.add(this.velocity);
		resetMatrix();

		this.check_bounds();
		this.acceleration.mult(0);
	};

	apply_forces() {
		if (!alignment && !cohesion && !separation) return;

		for (let b in boids) {
			let distance = this.position.dist(boids[b].position);
			if (distance === 0 || distance > boidSight) continue;

			alignment && this.alignment(distance, boids[b].velocity);
			cohesion && this.cohesion(distance, boids[b].position);

			if (!separation || distance > (boidVicinity)) continue;
			let angle = this.velocity.angleBetween(boids[b].velocity);
			if (angle >= Math.PI) continue;

			this.separation(distance, boids[b].position);
		}

		this.force_cohesion.normalize();

		// REVIEW: Divide by counts?
		this.apply_force(this.force_alignment, boidAlignmentWeight);
		this.apply_force(this.force_cohesion, boidCohesionWeight);
		this.apply_force(this.force_separation, boidSeparationWeight);
		this.apply_force(this.force_flee, boidFleeWeight);
	};

	alignment(distance, velocity) {
		let target = velocity.copy();
		target.normalize();
		target.div(distance);
		this.force_alignment.add(target);
	};

	cohesion(distance, position) {
		let target = position.copy();
		target.sub(this.position);
		target.normalize();
		target.div(distance);
		this.force_cohesion.add(target);
	};

	separation(distance, position) {
		let target = position.copy();
		target.sub(this.position);
		target.normalize();
		target.div(-distance * distance);
		this.force_separation.add(target);
	};

	flee(distance, position) {
		let target = position.copy();
		target.sub(this.position);
		target.normalize();
		target.div(-distance);
		this.force_flee.add(target);
	};


	fitness() {
		// TODO: Calculate fitness
		return 0;
	}
}
