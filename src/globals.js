let paused = true;
let width, height, area, ratio;
let gridResolution, horizontalCells, verticalCells;

const boidInitial = 20;
const predatorInitial = 0;

let boidSize, boidVicinity, boidSight;
let predatorSize, predatorVicinity, predatorSight;
let boidSpeed, predatorSpeed, eatDistance;

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

const STATE_SMALL_SCREEN = -1;
const STATE_INCORRECT_ORIENTATION = -2;
const STATE_UNSUPPORTED_RATIO = -3;
const STATE_INIT = 1;
const STATE_SIMULATION = 2;

const KEY_A = 65;
const KEY_B = 66;
const KEY_C = 67;
const KEY_P = 80;
const KEY_S = 83;

let state = STATE_INIT;
// let state = STATE_SIMULATION;

function setGlobals() {
	width = windowWidth;
	height = windowHeight;
	area = windowWidth * windowHeight;

	boidSize = Math.sqrt(area) / 1.5e2;
	boidVicinity = boidSize * 6;
	boidSight = boidSize * 22;

	predatorSize = boidSize * 1.3;
	predatorVicinity = predatorSize * 6;
	predatorSight = predatorSize * 22;

	boidSpeed = area / 1.2e5;
	predatorSpeed = boidSpeed * 1.1;
	eatDistance = (predatorSize + boidSize) * 1.8;

	gridResolution = predatorSight / 2;
	horizontalCells = Math.ceil(width / gridResolution);
	verticalCells = Math.ceil(height / gridResolution);

	// DEBUG: Log globals
	// console.log('width ' + width); // 1536
	// console.log('height ' + height); // 722
	// console.log('area ' + area); // 1108992
	// console.log('bsize ' + boidSize); // 7.0205
	// console.log('bvic ' + boidVicinity); // 42.1234
	// console.log('bsight ' + boidSight); // 154.4527
	// console.log('psize ' + predatorSize); // 9.8288
	// console.log('pvic ' + predatorVicinity); // 58.9728
	// console.log('psight ' + predatorSight); // 216.2338
	// console.log('bspeed ' + boidSpeed); // 11.0899
	// console.log('pspeed ' + predatorSpeed); // 12.1989
	// console.log('res ' + gridResolution); // 108.1169
	// console.log('hcells ' + horizontalCells); // 15
	// console.log('vcells ' + verticalCells); // 7
}
