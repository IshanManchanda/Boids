function empty_grid() {
	let a = [];
	for (let i = 0; i < horizontalCells + 1; i++) {
		a.push([]);
		for (let j = 0; j < verticalCells + 1; j++) {
			fill(200, 50, 200);
			ellipse(i * gridResolution, j * gridResolution, 5, 5);
			a[i].push([]);
		}
	}
	return a
}

function int(n) {
	// ORing a number with 0 returns it's integral value.
	// We use this because it is much faster than Math / parseInt functions.
	return n | 0;
}

function display() {
	textSize(12);
	fill(0, 255, 179);
	text('FPS: ' + Math.round(frameRate()), 6, height - 85);
	text("Number of Boids: " + boids.length, 6, height - 25);
	text("Number of Predators: " + predators.length, 6, height - 10);

	cohesion ? fill(0, 255, 0) : fill(255, 0, 0);
	text((cohesion) ? "Cohesion: ON" : "Cohesion: OFF", 6, height - 70);

	alignment ? fill(0, 255, 0) : fill(255, 0, 0);
	text((alignment) ? "Alignment: ON" : "Alignment: OFF", 6, height - 55);

	separation ? fill(0, 255, 0) : fill(255, 0, 0);
	text((separation) ? "Separation: ON" : "Separation: OFF", 6, height - 40);
}

function interaction() {
	for (let b = boids.length - 1; b >= 0; --b) {
		if (!boids[b]) continue;

		let x1 = Math.max(0, boids[b].row - 2);
		let x2 = Math.min(horizontalCells, boids[b].row + 2);
		let y1 = Math.max(0, boids[b].col - 2);
		let y2 = Math.min(verticalCells, boids[b].col + 2);

		for (let x = x1; x <= x2; x++) {
			for (let y = y1; y <= y2; y++) {
				for (let z = gridPredators[x][y].length; z >= 0; z--) {
					let p = gridPredators[x][y][z];
					if (!predators[p]) continue;
					if (!predators[p].alive) {
						predators.splice(p, 1);
						continue;
					}

					let distance = boids[b].position.dist(predators[p].position);
					if (distance > predatorSight) continue;
					predators[p].pursue(distance, boids[b].position);

					if (distance > boidSight) continue;
					boids[b].flee(distance, predators[p].position);

					if (distance > (predatorSize + boidSize) * 2.4) continue;
					predators[p].eat(b);
				}
			}
		}
	}
}

function populate_grid() {
	gridBoids = empty_grid();
	gridPredators = empty_grid();

	for (let b in boids) {
		let x = int(boids[b].position.x / gridResolution);
		let y = int(boids[b].position.y / gridResolution);
		console.log('xpos: ' + boids[b].position.x);
		console.log('x: ' + y + ' y: ' + y);
		// x = Math.min(x, horizontalCells);
		// y = Math.min(y, verticalCells);
		// console.log('xmin: ' + y + ' ymin: ' + y);

		gridBoids[x][y].push(b);
		boids[b].row = y;
		boids[b].col = x;
	}

	for (let p in predators) {
		let x = int(predators[p].position.x / gridResolution);
		let y = int(predators[p].position.y / gridResolution);
		x = Math.min(x, horizontalCells);
		y = Math.min(x, verticalCells);

		gridPredators[x][y].push(p);
		predators[p].row = x;
		predators[p].col = y;
	}
}
