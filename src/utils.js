/*
const height = 600;
const width = 1200;
const area = width * height;

const boidInitial = 100;
const predatorInitial = 3;

const boidSize = area / 1e5;
const predatorSize = boidSize * 1.5;

const boidSight = Math.max(area / 6000, boidSize * 2);
const predatorSight = Math.max(area / 4200, predatorSize * 2);

const boidSpeed = 8;
const predatorSpeed = boidSpeed * 1.2;

const boidAlignmentWeight = 2e1;
const boidCohesionWeight = 1e0;
const boidSeparationWeight = 5e3;
const boidFleeWeight = 1e3;
const predatorSeparationWeight = 5e4;
const predatorPursueWeight = 2e2;

let boids = [];
let predators = [];

let cohesion = true;
let alignment = true;
let separation = true;


class Brain {
	constructor() {
		this.alignment_weight = 2e1;
		this.cohesion_weight = 1e0;
		this.separation_weight = 5e3;
	}

	mutate(probability) {
		if (Math.random() < probability) {
			// TODO: Replace magic number with constant
			this.alignment_weight = (Math.random() + 0.0001) * 10;
		}
	}
}


class Boid {
	constructor(position, velocity, r, g, b) {
		velocity.normalize();
		velocity.mult(boidSpeed);
		this.alive = true;
		this.position = position;
		this.velocity = velocity;
		this.acceleration = createVector(0, 0);

		this.r = r;
		this.g = g;
		this.b = b;

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
		// fill(this.r, this.g, this.b);

		// TODO: Use a p5.Image to draw
		beginShape();
		vertex(0, -boidSize * 2);
		vertex(-boidSize, boidSize * 2);
		vertex(boidSize, boidSize * 2);
		endShape(CLOSE);

		// fill(255, 0, 0, 30);
		// ellipse(0, 0, boidSight, boidSight);
		// ellipse(0, 0, boidSize * 5, boidSize * 5);

		rotate(-this.theta);
		translate(-this.position.x, -this.position.y);
	};

	update() {
		this.apply_forces();

		this.velocity.add(this.acceleration);
		this.velocity.limit(boidSpeed);
		this.position.add(this.velocity);
		resetMatrix();

		// TODO: 'Check bounds' common util in Creature class
		if (this.position.x < 0) this.position.x += width;
		else if (this.position.x > width) this.position.x -= width;

		if (this.position.y < 0) this.position.y += height;
		else if (this.position.y > height) this.position.y -= height;

		this.acceleration.mult(0);
	};

	apply_forces() {
		if (!alignment && !cohesion && !separation) return;

		for (let b in boids) {
			let distance = this.position.dist(boids[b].position);
			if (distance === 0 || distance > boidSight) continue;

			alignment && this.alignment(distance, boids[b].velocity);
			cohesion && this.cohesion(distance, boids[b].position);

			if (!separation || distance > (boidSize * 6)) continue;
			let angle = this.velocity.angleBetween(boids[b].velocity);
			if (angle >= Math.PI) continue;

			this.separation(distance, boids[b].position);
		}

		this.force_cohesion.normalize();

		// REVIEW: Divide by counts?
		// TODO: Create a utility function
		//  to avoid code duplication
		this.force_alignment.mult(boidAlignmentWeight);
		this.force_cohesion.mult(boidCohesionWeight);
		this.force_separation.mult(boidSeparationWeight);
		this.force_flee.mult(boidFleeWeight);

		this.acceleration.add(this.force_alignment);
		this.acceleration.add(this.force_cohesion);
		this.acceleration.add(this.force_separation);
		this.acceleration.add(this.force_flee);

		this.force_alignment.mult(0);
		this.force_cohesion.mult(0);
		this.force_separation.mult(0);
		this.force_flee.mult(0);
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


class Predator {
	constructor(position, velocity) {
		velocity.normalize();
		velocity.mult(predatorSpeed);
		this.position = position;
		this.velocity = velocity;
		this.acceleration = createVector(0, 0);

		this.force_separation = createVector(0, 0);
		this.force_pursue = createVector(0, 0);
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

		// fill(255, 0, 0, 30);
		// ellipse(0, 0, predatorSight, predatorSight);
		// ellipse(0, 0, boidSize * 5, boidSize * 5);

		rotate(-this.theta);
		translate(-this.position.x, -this.position.y);
	};

	update() {
		this.apply_forces();

		this.velocity.add(this.acceleration);
		this.velocity.limit(predatorSpeed);
		this.position.add(this.velocity);
		resetMatrix();

		if (this.position.x < 0) this.position.x += width;
		else if (this.position.x > width) this.position.x -= width;

		if (this.position.y < 0) this.position.y += height;
		else if (this.position.y > height) this.position.y -= height;

		this.acceleration.mult(0);
	};

	apply_forces() {
		for (let p in predators) {
			let distance = this.position.dist(predators[p].position);
			if (distance === 0 || distance > predatorSight) continue;
			this.separation(distance, predators[p].position);
		}

		this.force_separation.mult(predatorSeparationWeight);
		this.force_pursue.mult(predatorPursueWeight);

		this.acceleration.add(this.force_separation);
		this.acceleration.add(this.force_pursue);

		this.force_separation.mult(0);
		this.force_pursue.mult(0);
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

	// noinspection JSMethodCanBeStatic
	eat(b) {
		// TODO: Manage hunger.
		boids.splice(b, 1);
	};
}
*/
