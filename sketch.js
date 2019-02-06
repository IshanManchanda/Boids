const height = 600;
const width = 1200;
const boidInitial = 30;
const predatorInitial = 1;

const boidSize = width * height / 100000;
const boidSight = width * height / 4000;

const predatorSize = boidSize * 1.2;
const predatorSight = width * height / 2400;

let boids = [];
let predators = [];

let cohesion = true;
let alignment = true;
let separation = true;


class Boid {
	constructor(position, velocity, speed) {
		velocity.normalize();
		velocity.mult(speed);
		this.position = position;
		this.speed = speed;
		this.velocity = velocity;
		this.acceleration = createVector(0, 0);
	}

	draw() {
		this.theta = this.velocity.heading() + PI / 2;
		fill(0, 255, 50);
		noStroke();
		translate(this.position.x, this.position.y);
		rotate(this.theta);

		beginShape();
		vertex(0, -boidSize * 2);
		vertex(-boidSize, boidSize * 2);
		vertex(boidSize, boidSize * 2);
		endShape(CLOSE);

		rotate(-this.theta);
		translate(-this.position.x, -this.position.y);
	};

	update() {
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.speed);
		this.position.add(this.velocity);
		resetMatrix();

		if (this.position.x < 0) {
			this.position.x += width;
		}
		else if (this.position.x > width) {
			this.position.x -= width;
		}
		if (this.position.y < 0) {
			this.position.y += height;
		}
		else if (this.position.y > height) {
			this.position.y -= height;
		}

		this.acceleration.mult(0);
	};

	seek(target) {
		target.sub(this.position);
		target.normalize();
		target.mult(this.speed);
		this.acceleration.add(target);
	};

	flee() {
		let count = 0;
		let target = createVector(0, 0);
		for (let p in predators) {
			let distance = dist(this.position.x, this.position.y, predators[p].position.x, predators[p].position.y);
			if (distance < boidSight) {
				target.add(predators[p].position);
				// target.add(predators[p].velocity);
				count++;
			}
		}
		if (count > 0) {
			target.div(count);
			target.sub(this.position);
			target.normalize();
			target.mult(-this.speed);
			this.acceleration.add(target);
		}
	};

	align() {
		let count = 0;
		let target = createVector(0, 0);
		for (let b in boids) {
			let distance = dist(this.position.x, this.position.y, boids[b].position.x, boids[b].position.y);
			if (distance < boidSight) {
				target.add(boids[b].velocity);
				count++;
			}
		}
		if (count > 0) {
			target.div(count);
			target.normalize();
			target.mult(this.speed);
			this.acceleration.add(target);
		}
	};

	cohesion() {
		let count = 0;
		let target = createVector(0, 0);
		for (let b in boids) {
			let distance = dist(this.position.x, this.position.y, boids[b].position.x, boids[b].position.y);
			if (distance < boidSight) {
				target.add(boids[b].position);
				count++;
			}
		}
		if (count > 0) {
			target.div(count);
			this.seek(target);
		}
	};

	space() {
		let count = 0;
		let target = createVector(0, 0);
		for (let b in boids) {
			let distance = dist(this.position.x, this.position.y, boids[b].position.x, boids[b].position.y);
			let angle = this.velocity.angleBetween(boids[b].velocity);

			if ((distance < (boidSight / 4)) && (angle < PI)) {
				target.sub(boids[b].position);
				count++;
			}
		}

		if (count > 0) {
			target.div(count);
			target.add(this.position);
			target.normalize();
			target.mult(this.speed * 2);
			this.acceleration.add(target);
		}
	};
}


class Predator {
	constructor(position, velocity, speed) {
		velocity.normalize();
		velocity.mult(speed);
		this.position = position;
		this.speed = speed;
		this.velocity = velocity;
		this.acceleration = createVector(0, 0);
	}

	draw() {
		this.theta = this.velocity.heading() + PI / 2;
		fill(255, 0, 255);
		noStroke();
		translate(this.position.x, this.position.y);
		rotate(this.theta);

		beginShape();
		vertex(0, -predatorSize * 2);
		vertex(-predatorSize, predatorSize * 2);
		vertex(predatorSize, predatorSize * 2);
		endShape(CLOSE);

		rotate(-this.theta);
		translate(-this.position.x, -this.position.y);
	};

	update() {
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.speed);
		this.position.add(this.velocity);
		resetMatrix();

		if (this.position.x < 0) {
			this.position.x += width;
		}
		else if (this.position.x > width) {
			this.position.x -= width;
		}
		if (this.position.y < 0) {
			this.position.y += height;
		}
		else if (this.position.y > height) {
			this.position.y -= height;
		}

		this.acceleration.mult(0);
	};

	pursue() {
		let count = 0;
		let target = createVector(0, 0);
		for (let b in boids) {
			let distance = dist(this.position.x, this.position.y, boids[b].position.x, boids[b].position.y);
			if (distance < predatorSight) {
				target.add(p5.Vector.div(p5.Vector.sub(
					p5.Vector.add(boids[b].position, boids[b].velocity),
					this.position
				), distance));
				// target.add(boids[b].position.mult(predatorSight / distance));
				// target.add(boids[b].velocity.mult(predatorSight / distance));
				count++;
			}
		}
		if (count > 0) {
			console.log(target.x, target.y);
			fill(255, 0, 0);
			ellipse(target.x - 5, target.y - 5, 10, 10);
			target.div(count);
			// target.sub(this.position);
			target.normalize();
			target.mult(this.speed);
			this.acceleration.add(target);
		}
	};

	space() {
		let count = 0;
		let target = createVector(0, 0);
		for (let p in predators) {
			let distance = dist(this.position.x, this.position.y, predators[p].position.x, predators[p].position.y);
			let angle = this.velocity.angleBetween(predators[p].velocity);

			if ((distance < (predatorSight / 4)) && (angle < PI)) {
				target.sub(predators[p].position);
				count++;
			}
		}

		if (count > 0) {
			target.div(count);
			target.add(this.position);
			target.normalize();
			target.mult(this.speed * 2);
			this.acceleration.add(target);
		}
	};

	eat() {
		let b;
		for (b = boids.length - 1; b > -1; --b) {
			let distance = dist(this.position.x, this.position.y, boids[b].position.x, boids[b].position.y);
			if (distance <= (predatorSize + boidSize) * 2.4) {
				boids.splice(b, 1);
			}
		}
	};
}


function display() {
	textSize(12);
	fill(0, 255, 179);

	text("Number of Boids:" + boids.length, 6, height - 10);

	// if (cohesion) { fill(0, 255, 0); } else { fill(255, 0, 0); }
	cohesion ? fill(0, 255, 0) : fill(255, 0, 0);
	text("Cohesion: " + cohesion, 6, height-54);

	// if (separation) { fill(0, 255, 0);
	// }
	// else {
	// 	fill(255, 0, 0);
	// }
	separation ? fill(0, 255, 0) : fill(255, 0, 0);
	text("Separation: " + separation, 6, height-25);

	/*if (alignment) {
		fill(0, 255, 0);
	}
	else {
		fill(255, 0, 0);
	}*/
	alignment ? fill(0, 255, 0) : fill(255, 0, 0);
	text("Alignment: " + alignment, 6, height-40);

}


function setup() {
	createCanvas(width, height);
	frameRate(30);

	for (let i = 0; i < boidInitial; i++) {
		boids.push(new Boid(
			createVector(Math.floor(Math.random() * width), Math.floor(Math.random() * height)),
			createVector(Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)),
			8
		))
	}
	for (let i = 0; i < predatorInitial; i++) {
		predators.push(new Predator(
			createVector(Math.floor(Math.random() * width), Math.floor(Math.random() * height)),
			createVector(Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)),
			10
		))
	}
}


function draw() {
	background(0);

	for (let b in boids) {
		for (let p in predators) {
			boids[b].flee(predators[p]);
			predators[p].pursue(boids[b]);
		}

		boids[b].align();
		boids[b].space();
		boids[b].cohesion();
		boids[b].update();
		boids[b].draw();
	}

	for (let p in predators) {
		predators[p].space();
		predators[p].eat();
		predators[p].update();
		predators[p].draw();
	}

	display();
}
