let screen = -1;
let width, height, area, ratio;
let gridResolution, horizontalCells, verticalCells;

const boidInitial = 0;
const predatorInitial = 0;

let boidSize, boidVicinity, boidSight;
let predatorSize, predatorVicinity, predatorSight;
let boidSpeed, predatorSpeed;

const boidAlignmentWeight = 2e1;
const boidCohesionWeight = 1e0;
const boidSeparationWeight = 1e4;
const boidFleeWeight = 1e5;

const predatorSeparationWeight = 1e5;
const predatorPursueWeight = 5e2;
const predatorHungerLimit = 450;

let boids = [];
let predators = [];
let gridBoids = [];
let gridPredators = [];

let cohesion = true;
let alignment = true;
let separation = true;


function setGlobals() {
	width = windowWidth;
	height = windowHeight;
	area = windowWidth * windowHeight;

	boidSize = Math.sqrt(area) / 1.5e2;
	boidVicinity = boidSize * 6;
	boidSight = Math.max(area / 6000, boidSize * 10);

	predatorSize = boidSize * 1.5;
	predatorVicinity = predatorSize * 2;
	predatorSight = Math.max(area / 4200, predatorSize * 4);

	boidSpeed = area / 1e5;
	predatorSpeed = boidSpeed * 1.1;

	gridResolution = predatorSight / 2;
	horizontalCells = int(width / gridResolution);
	verticalCells = int(height / gridResolution);

	console.log('width ' + width);
	console.log('height ' + height);
	console.log('area ' + area);
	console.log('bsize ' + boidSize);
	console.log('bvic ' + boidVicinity);
	console.log('bsight ' + boidSight);
	console.log('psize ' + predatorSize);
	console.log('pvic ' + predatorVicinity);
	console.log('psight ' + predatorSight);
	console.log('bspeed ' + boidSpeed);
	console.log('pspeed ' + predatorSpeed);
	console.log('res ' + gridResolution);
	console.log('hcells ' + horizontalCells);
	console.log('vcells ' + verticalCells);

}
