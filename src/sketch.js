p5.disableFriendlyErrors = true;
let pauseButton;

function checkWindowSize() {
	// Allow up to 16.5% less than 1024 x 768
	if (Math.max(windowWidth, windowHeight) < 855 ||
		Math.min(windowWidth, windowHeight) < 642) {
		state = STATE_SMALL_SCREEN;  // Screen too small
	}

	// Screen ratio
	const r = windowWidth / windowHeight;
	if (r < 1) {
		state = STATE_INCORRECT_ORIENTATION;  // Incorrect orientation
	}

	// TODO: Fix screen ratio checks with browser-related height reduction
	if (Math.abs(r - (16 / 9)) < 0.01) {
		ratio = 16;
	} else if (Math.abs(r - (8 / 5)) < 0.01) {
		ratio = 8;
	} else if (Math.abs(r - (4 / 3)) < 0.01) {
		ratio = 4;
	} else {
		state = STATE_UNSUPPORTED_RATIO;  // Unsupported aspect ratio
	}
}

function initGrid() {
	// Initialize boids and predators with random positions and velocities
	for (let i = 0; i < boidInitial; i++) {
		boids.push(new Boid(
			createVector(
				Math.floor(Math.random() * width),
				Math.floor(Math.random() * height)
			),
			createVector(Math.random() - 0.5, Math.random() - 0.5)
		))
	}
	for (let i = 0; i < predatorInitial; i++) {
		predators.push(new Predator(
			createVector(
				Math.floor(Math.random() * width),
				Math.floor(Math.random() * height)
			),
			createVector(Math.random() - 0.5, Math.random() - 0.5)
		))
	}
}

function setButtonState() {
	// Resize, reposition, and change text of button as needed
	pauseButton.resize(windowHeight * 0.14, windowHeight * 0.06);
	if (state === STATE_SIMULATION) {
		pauseButton.locate(windowWidth * 0.9, windowHeight * 0.02);
		pauseButton.text = paused ? "Resume" : "Pause";
	}
	else if (state === STATE_INIT) {
		pauseButton.locate(windowWidth * 0.45, windowHeight * 0.4);
		pauseButton.text = "Start Simulation";
	}
}

function initButtons() {
	// Initialize button and set state
	pauseButton = new Clickable();
	setButtonState();

	pauseButton.onPress = function() {
		// For initial press
		state = STATE_SIMULATION;

		// Toggle paused and update state
		paused = !paused;
		setButtonState();
	};
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	noStroke();
	frameRate(60);
	// checkWindowSize();

	setGlobals();
	initButtons();
	initGrid();
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	// checkWindowSize();

	setGlobals();
	setButtonState();
	// TODO: Update boid and predator positions
	// REVIEW: Does the spatial grid need to be updated?
}

function simulate() {
	// Micro optimization: Check flag only once instead of for each creature
	if (paused) {
		for (let b in boids) {
			boids[b].draw();
		}
		for (let p in predators) {
			predators[p].draw();
		}
	} else {
		for (let b in boids) {
			boids[b].update();
			boids[b].draw();
		}

		for (let p in predators) {
			predators[p].update();
			predators[p].draw();
		}
	}
}

function handleState() {
	// Run screen corresponding to current state
	switch (state) {
		case STATE_INIT:
			initScreen();
			break;
		case STATE_SMALL_SCREEN:
			sizeErrorScreen();
			break;
		case STATE_INCORRECT_ORIENTATION:
			orientationErrorScreen();
			break;
		case STATE_UNSUPPORTED_RATIO:
			ratioErrorScreen();
			break;
		case STATE_SIMULATION:
			simulationScreen();
			break;
	}
}

function initScreen() {
	pauseButton.draw();
	// TODO: Add some method to set initial simulation variables; sliders?
}


function simulationScreen() {
	populateGrid();
	interaction();

	simulate();
	pauseButton.draw();
	displayData();
}

function sizeErrorScreen() {
	// TODO: Show "Screen too small" message
}

function orientationErrorScreen() {
	// TODO: Show "Incorrect screen orientation" message
}

function ratioErrorScreen() {
	// TODO: Show "Unsupported screen ratio" message
}

function draw() {
	background(0);
	handleState();
}

function keyPressed() {
	switch (keyCode) {
		case KEY_A:
			alignment = !alignment;
			break;

		case KEY_C:
			cohesion = !cohesion;
			break;

		case KEY_S:
			separation = !separation;
			break;
	}
}


function mouseClicked() {
	if (!keyIsPressed) return;
	if (keyIsDown(KEY_B)) {
		boids.push(new Boid(
			createVector(mouseX, mouseY),
			createVector(Math.random() - 0.5, Math.random() - 0.5)
		));
	}
	if (keyIsDown(KEY_P)) {
		predators.push(new Predator(
			createVector(mouseX, mouseY),
			createVector(Math.random() - 0.5, Math.random() - 0.5)
		));
	}
	if (keyIsDown(79)) {
		// TODO: Drop obstacle
	}
}
