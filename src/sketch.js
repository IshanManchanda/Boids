function display() {
	textSize(12);
	fill(0, 255, 179);
	text("Number of Boids:" + boids.length, 6, height - 10);

	cohesion ? fill(0, 255, 0) : fill(255, 0, 0);
	text((cohesion) ? "Cohesion: ON" : "Cohesion: OFF", 6, height - 54);

	separation ? fill(0, 255, 0) : fill(255, 0, 0);
	text((separation) ? "Separation: ON" : "Separation: OFF", 6, height - 25);

	alignment ? fill(0, 255, 0) : fill(255, 0, 0);
	text((alignment) ? "Alignment: ON" : "Alignment: OFF", 6, height - 40);
}


function interaction() {
	let b;
	for (b = boids.length - 1; b >= 0; --b) {
		for (let p in predators) {
			if (!boids[b]) continue;
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
			createVector(
				Math.floor(Math.random() * boidSpeed),
				Math.floor(Math.random() * boidSpeed)
			),
			Math.random() * 255,
			Math.random() * 255,
			Math.random() * 255
		))
	}
	for (let i = 0; i < predatorInitial; i++) {
		predators.push(new Predator(
			createVector(
				Math.floor(Math.random() * width),
				Math.floor(Math.random() * height)
			),
			createVector(
				Math.floor(Math.random() * predatorSpeed),
				Math.floor(Math.random() * predatorSpeed)
			)
		))
	}
}


function draw() {
	background(0);
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
			createVector(
				Math.floor(Math.random() * boidSpeed),
				Math.floor(Math.random() * boidSpeed)
			),
			Math.random() * 255,
			Math.random() * 255,
			Math.random() * 255
		));
	}
	if (keyIsDown(80)) {
		predators.push(new Predator(
			createVector(mouseX, mouseY),
			createVector(
				Math.floor(Math.random() * predatorSpeed),
				Math.floor(Math.random() * predatorSpeed)
			)
		));
	}
	if (keyIsDown(79)) {
		// TODO: Drop obstacle
	}
}
