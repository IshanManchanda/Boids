function emptyGrid() {
	let a = [];

	// DEBUG: Settings for drawing cell markers
	// fill(200, 50, 200);
	// stroke(200, 50, 200);

	// Create empty array of arrays
	for (let i = 0; i < horizontalCells + 1; ++i) {
		a.push([]);
		for (let j = 0; j < verticalCells + 1; ++j) {

			// DEBUG: Draw cell markers
			// line(0, j * gridResolution, windowWidth, j * gridResolution);
			// line(i * gridResolution, 0, i * gridResolution, windowHeight);
			// ellipse(i * gridResolution, j * gridResolution, 5, 5);

			a[i].push([]);
		}
	}
	// DEBUG: Reset settings for drawing cell markers
	// noStroke();

	return a
}

function int(n) {
	// ORing a number with 0 returns its integral value.
	// We use this because it is much faster than Math / parseInt functions.
	return n | 0;
}

function displayData() {
	// Display simulation data on the screen
	textSize(12);
	fill(0, 255, 255);
	textAlign(LEFT);

	text('FPS: ' + Math.round(frameRate()), 6, height - 85);
	text("Number of Boids: " + boids.length, 6, height - 25);
	text("Number of Predators: " + predators.length, 6, height - 10);

	cohesion ? fill(0, 255, 0) : fill(255, 0, 0);
	text("Cohesion: " + (cohesion ? "ON" : "OFF"), 6, height - 70);

	alignment ? fill(0, 255, 0) : fill(255, 0, 0);
	text("Alignment: " + (alignment ? "ON" : "OFF"), 6, height - 55);

	separation ? fill(0, 255, 0) : fill(255, 0, 0);
	text("Separation: " + (separation ? "ON" : "OFF"), 6, height - 40);

	if (paused) {
		textSize(20);
		fill(255, 255, 255);
		stroke(0);
		text("Toggle Cohesion, Alignment, Separation using C, A, S keys.", 6, height - 140);
		text("Drop Boids/Predator by holding down B/P and clicking.", 6, height - 110);
	}
}

function interaction() {
	// Function that handles Boid-Predator interactions
	// This is more efficient than an OOP-approach as each pair
	// is evaluated only once
	for (let b = boids.length - 1; b >= 0; --b) {
		if (!boids[b]) continue;

		// Compute the cells that need to be checked for this Boid
		let x1 = Math.max(0, boids[b].col - 2);
		let x2 = Math.min(horizontalCells, boids[b].col + 2);
		let y1 = Math.max(0, boids[b].row - 2);
		let y2 = Math.min(verticalCells, boids[b].row + 2);

		// Iterate over selected cells
		for (let x = x1; x <= x2; ++x) {
			for (let y = y1; y <= y2; ++y) {
				// Iterate over the predators in this cell
				for (let z = gridPredators[x][y].length; z >= 0; --z) {
					let p = gridPredators[x][y][z];
					if (!predators[p]) continue;
					if (!predators[p].alive) {
						predators.splice(p, 1);
						continue;
					}

					if (!boids[b] || !predators[p]) continue;
					let distance = boids[b].position.dist(predators[p].position);

					// If Boid visible to Predator, pursue
					if (distance > predatorSight) continue;
					predators[p].pursue(distance, boids[b].position);

					// If Predator visible to Boid, flee
					if (distance > boidSight) continue;
					boids[b].flee(distance, predators[p].position);

					// If distance sufficiently small, eat Boid
					if (distance > eatDistance) continue;
					predators[p].eat(b);
				}
			}
		}
	}
}

function populateGrid() {
	gridBoids = emptyGrid();
	gridPredators = emptyGrid();

	for (let b in boids) {
		if (!boids[b]) continue;
		let x = int(boids[b].position.x / gridResolution);
		let y = int(boids[b].position.y / gridResolution);
		// x = Math.min(x, horizontalCells);
		// y = Math.min(y, verticalCells);

		// DEBUG: Log position and cell indices
		console.log('position: ' + boids[b].position);
		console.log('x: ' + x + ' y: ' + y);

		gridBoids[x][y].push(b);
		boids[b].row = y;
		boids[b].col = x;
	}

	for (let p in predators) {
		if (!predators[p]) continue;
		let x = int(predators[p].position.x / gridResolution);
		let y = int(predators[p].position.y / gridResolution);
		// x = Math.min(x, horizontalCells);
		// y = Math.min(x, verticalCells);

		gridPredators[x][y].push(p);
		predators[p].row = y;
		predators[p].col = x;
	}
}
