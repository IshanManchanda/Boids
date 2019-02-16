const height = 600;
const width = 1200;
const area = width * height;


const boidInitial = 500;
const predatorInitial = 2;

const boidSize = Math.sqrt(area) / 1.5e2;
const boidVicinity = boidSize * 6;
const predatorSize = boidSize * 1.5;

const boidSight = Math.max(area / 6000, boidSize * 2);
const predatorSight = Math.max(area / 4200, predatorSize * 2);

const boidSpeed = area / 1e5;
const predatorSpeed = boidSpeed * 1.1;


const boidAlignmentWeight = 2e1;
const boidCohesionWeight = 1e0;
const boidSeparationWeight = 1e4;
const boidFleeWeight = 1e5;

const predatorSeparationWeight = 1e5;
const predatorPursueWeight = 5e2;


let boids = [];
let grid_boids = [];
let grid_predators = [];
let predators = [];

const grid_resolution = predatorSight / 2;
const grid_width = (width / grid_resolution);
const grid_height = (height / grid_resolution);

let cohesion = true;
let alignment = true;
let separation = true;
