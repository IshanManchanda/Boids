class Predator extends Creature {
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

		// DEBUG: Draw Vicinity and Sight Regions
		// fill(255, 0, 0, 30);
		// ellipse(0, 0, predatorSight, predatorSight);
		// ellipse(0, 0, predatorVicinity, predatorVicinity);

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
		// DEBUG: Non-optimized, non-spatial-divided force calculation
		/*for (let p in predators) {
			let distance = this.position.dist(predators[p].position);
			if (distance === 0 || distance > predatorSight) continue;
			this.separation(distance, predators[p].position);
		}*/

		let x1 = Math.max(0, this.col - 1);
		let x2 = Math.min(horizontalCells, this.col + 1);
		let y1 = Math.max(0, this.row - 1);
		let y2 = Math.min(verticalCells, this.row + 1);

		for (let x = x1; x <= x2; x++) {
			for (let y = y1; y <= y2; y++) {

				// DEBUG: Draw surrounding squares
				// fill(150, 150, 150);
				// square(x * gridResolution, y * gridResolution, gridResolution);

				for (let z = 0; z < gridPredators[x][y].length; z++) {
					let p = gridPredators[x][y][z];
					if (!predators[p]) continue;

					let distance = this.position.dist(predators[p].position);
					if (distance === 0 || distance > boidSight) continue;
					this.separation(distance, predators[p].position);
				}
			}
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
