p5.disableFriendlyErrors = true;


function checkWindowSize() {
	// Allow up to 16.5% less than 1024 x 768
	if (Math.max(windowWidth, windowHeight) < 855 ||
		Math.min(windowWidth, windowHeight) < 642) {
		screen = -1;  // Screen too small
	}

	// Screen ratio
	const r = windowWidth / windowHeight;
	if (r < 1) {
		screen = -2;  // Incorrect orientation
	}

	if (Math.abs(r - (16 / 9)) < 0.01) {
		ratio = 16;
	} else if (Math.abs(r - (8 / 5)) < 0.01) {
		ratio = 8;
	} else if (Math.abs(r - (4 / 3)) < 0.01) {
		ratio = 4;
	} else {
		screen = -3;  // Unsupported aspect ratio
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	noStroke();
	frameRate(30);
	checkWindowSize();
	setGlobals();

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

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	checkWindowSize();
	setGlobals();
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
