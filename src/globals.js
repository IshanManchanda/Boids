const height = 600;
const width = 1200;
const area = width * height;


const boidInitial = 100;
const predatorInitial = 3;

const boidSize = area / 1e5;
const boidVicinity = boidSize * 6;
const predatorSize = boidSize * 1.5;

const boidSight = Math.max(area / 6000, boidSize * 2);
const predatorSight = Math.max(area / 4200, predatorSize * 2);

const boidSpeed = 8;
const predatorSpeed = boidSpeed * 1.2;


const boidAlignmentWeight = 2e1;
const boidCohesionWeight = 1e0;
const boidSeparationWeight = 5e3;
const boidFleeWeight = 1e3;

const predatorSeparationWeight = 5e4;
const predatorPursueWeight = 2e2;


let boids = [];
let predators = [];

let cohesion = true;
let alignment = true;
let separation = true;
