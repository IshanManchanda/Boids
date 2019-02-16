function setup() {
	createCanvas(width, height);
	noStroke();
	frameRate(30);

	for (let i = 0; i < boidInitial; i++) {
		boids.push(new Boid(
			createVector(
				Math.floor(Math.random() * width),
				Math.floor(Math.random() * height)
			),
			createVector(Math.random(), Math.random())
		))
	}
	for (let i = 0; i < predatorInitial; i++) {
		predators.push(new Predator(
			createVector(
				Math.floor(Math.random() * width),
				Math.floor(Math.random() * height)
			),
			createVector(Math.random(), Math.random())
		))
	}
}


function draw() {
	background(0);
	populate_grid();
	interaction();

	for (let b in boids) {
		boids[b].update();
		boids[b].draw();
	}

	for (let p in predators) {
		predators[p].update();
		predators[p].draw();
	}

	display();
}


function keyPressed() {
	switch (keyCode) {
		case 65:
			alignment = !alignment;
			break;

		case 67:
			cohesion = !cohesion;
			break;

		case 83:
			separation = !separation;
			break;
	}
}


function mouseClicked() {
	if (!keyIsPressed) return;
	if (keyIsDown(66)) {
		boids.push(new Boid(
			createVector(mouseX, mouseY),
			createVector(Math.random(), Math.random())
		));
	}
	if (keyIsDown(80)) {
		predators.push(new Predator(
			createVector(mouseX, mouseY),
			createVector(Math.random(), Math.random())
		));
	}
	if (keyIsDown(79)) {
		// TODO: Drop obstacle
	}
}
