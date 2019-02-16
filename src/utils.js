function empty_grid() {
	let a = [];
	for (let i = 0; i < grid_width + 1; i++) {
		a.push([]);
		for (let j = 0; j < grid_height + 1; j++) {
			// fill(200, 50, 200);
			// ellipse(i * grid_resolution, j * grid_resolution, 5, 5);
			a[i].push([]);
		}
	}
	return a
}

function display() {
	textSize(12);
	fill(0, 255, 179);
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
	/*for (let x = 0; x < grid_width; x++) {
		for (let y = 0; y < grid_height; y++) {
			for (let z = grid[x][y].length - 1; z >= 0; z--) {
				b = grid[x][y][z];

				for (
					let x1 = Math.max(0, x - 1);
					x1 < Math.min(grid_width, x + 1);
					x1++
				) {
					for (
						let y1 = Math.max(0, y - 1);
						y1 < Math.min(grid_height, y + 1);
						y1++
					) {

					}
				}
			}
		}
	}*/

	for (let b = boids.length - 1; b >= 0; --b) {
		if (!boids[b]) continue;

		let x1 = Math.max(0, boids[b].row - 2);
		let x2 = Math.min(grid_width, boids[b].row + 2);
		let y1 = Math.max(0, boids[b].col - 2);
		let y2 = Math.min(grid_height, boids[b].col + 2);

		for (let x = x1; x <= x2; x++) {
			for (let y = y1; y <= y2; y++) {
				for (let z = 0; z < grid_predators[x][y].length; z++) {
					let p = grid_predators[x][y][z];
					if (!predators[p]) continue;
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


		/*for (let p in predators) {
			if (!boids[b]) continue;

			let distance = boids[b].position.dist(predators[p].position);

			if (distance > predatorSight) continue;
			predators[p].pursue(distance, boids[b].position);

			if (distance > boidSight) continue;
			boids[b].flee(distance, predators[p].position);

			if (distance > (predatorSize + boidSize) * 2.4) continue;
			predators[p].eat(b);
		}*/
	}
}

function populate_grid() {
	grid_boids = empty_grid();
	grid_predators = empty_grid();

	for (let b in boids) {
		let x = int(boids[b].position.x / grid_resolution);
		let y = int(boids[b].position.y / grid_resolution);
		grid_boids[x][y].push(b);
		boids[b].row = x;
		boids[b].col = y;
	}

	for (let p in predators) {
		let x = int(predators[p].position.x / grid_resolution);
		let y = int(predators[p].position.y / grid_resolution);
		grid_predators[x][y].push(p);
		predators[p].row = x;
		predators[p].col = y;
	}
}
