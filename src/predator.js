class Predator extends Creature{
	constructor(position, velocity) {
		super(position, velocity);

		this.velocity.mult(predatorSpeed);
		this.force_separation = createVector(0, 0);
		this.force_pursue = createVector(0, 0);
		this.hunger = 0;
	}

	draw() {
		this.theta = this.velocity.heading() + Math.PI / 2;
		fill(255, 0, 255);
		translate(this.position.x, this.position.y);
		rotate(this.theta);

		beginShape();
		vertex(0, -predatorSize * 2);
		vertex(-predatorSize, predatorSize * 2);
		vertex(predatorSize, predatorSize * 2);
		endShape(CLOSE);

		// Draw Sight Region
		// fill(255, 0, 0, 30);
		// ellipse(0, 0, predatorSight, predatorSight);

		rotate(-this.theta);
		translate(-this.position.x, -this.position.y);
	};

	update() {
		this.hunger++;
		if (this.hunger >= predatorHungerLimit) {
			this.alive = false;
			return;
		}
		this.apply_forces();

		this.velocity.add(this.acceleration);
		this.velocity.limit(predatorSpeed);
		this.position.add(this.velocity);
		resetMatrix();

		this.check_bounds();
		this.acceleration.mult(0);
	};

	apply_forces() {
		for (let p in predators) {
			let distance = this.position.dist(predators[p].position);
			if (distance === 0 || distance > predatorSight) continue;
			this.separation(distance, predators[p].position);
		}

		this.apply_force(this.force_separation, predatorSeparationWeight);
		this.apply_force(this.force_pursue, predatorPursueWeight);
	}

	separation(distance, position) {
		let target = position.copy();
		target.mult(-1);
		target.add(this.position);
		target.normalize();
		target.div(distance * distance);
		this.force_separation.add(target);
	};

	pursue(distance, position, velocity) {
		let target = position.copy();
		target.sub(this.position);
		target.add(velocity);
		target.normalize();
		target.div(distance);
		this.force_pursue.add(target);
	};

	eat(b) {
		this.hunger = 0;
		boids.splice(b, 1);
	};
}
