/**
*
* Flappy Bird Game
* 
* Use spacebar or click to jump and avoid walls
*
*/

/* ===================================================== 
 * Setup Matter Engine
 * ================================================== */

// Aliases
let World = Matter.World;
let Engine = Matter.Engine;
let Render = Matter.Render;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Events = Matter.Events;

let engine;
let render;
let element;
let pixelRatio;
let width;
let height;

function setupMatter() {
  element = document.getElementById('main');
  pixelRatio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;

  engine = Engine.create();

  // set the gravity to zero before the game starts
  engine.world.gravity.y = 0;

  // create the renderer with options
  render = Render.create({
    element: element,
    engine: engine,
    options: {
      width: width,
      height: height,
      pixelRatio: pixelRatio,
      background: 'orange',
      hasBounds: false,
      enabled: false,
      wireframes: false,
      showSleeping: false,
      showDebug: false,
      showBroadphase: false,
      showBounds: false,
      showVelocity: false,
      showCollisions: false,
      showSeparations: false,
      showAxes: false,
      showPositions: false,
      showAngleIndicator: false,
      showIds: false,
      showShadows: false,
      showVertexNumbers: false,
      showConvexHulls: false,
      showInternalEdges: false,
      showMousePosition: false
    }
  });
}

/* ===================================================== 
 * Event Listener and Handlers
 * ================================================== */

function addEventListeners() {
  window.addEventListener('click', handleClick, false);
  window.addEventListener('touchstart', handleTouchstart, false);
  window.addEventListener('keydown', handleKeydown, false);
  window.addEventListener('resize', handleResize, false);
}

function handleResize() {
  window.location.reload()
}

function handleKeydown(event) {
  // spacebar
  if (event.keyCode === 32) {
    // bumpBird();
  }
  if (event.keyCode === 37) {
    goLeft();
  }
  if (event.keyCode === 39) {
    goRight();
  }
}

function handleTouchstart(event) {
  if (event.touches[0].clientX <= width/2) {
    goLeft();
  }
  if (event.touches[0].clientX > width/2) {
    goRight();
  }
  // bumpBird();
}

function handleClick(event) {
  event.preventDefault();
  // bumpBird();
}

/* ===================================================== 
 * The Bird Class
 * ================================================== */

let Bird = function () {
  this.x = 200;
  this.y = 200;
  this.r = 20;
  this.static = true;
  this.body = Bodies.circle(this.x, this.y, this.r, this.static);
  this.body.restitution = 0.5;
  this.body.render.fillStyle = 'white';
  this.body.render.strokeStyle = 'white';
};

Bird.prototype.addBird = function () {
  World.add(engine.world, this.body);
};

Bird.prototype.removeBird = function () {
  World.remove(engine.world, this.body);
};

Bird.prototype.setHit = function () {
  this.body.render.fillStyle = 'tomato';
  this.body.render.strokeStyle = 'red';
}

/* ===================================================== 
 * The Walls
 * ================================================== */

function createWall() {
  let h = 10;
  let w = width - 150;
  let x5 = getRandomIntInclusive(120, width - 200)

  let wall = [
  // Bodies.rectangle(x2, 2 * height/5, w, h, { isStatic: true }),
  // Bodies.rectangle(x3, 3 * height/5, w, h, { isStatic: true }),
  // Bodies.rectangle(x4, 4 * height/5, w, h, { isStatic: true }),
  Bodies.rectangle(x5, height, w, h, { isStatic: true, chamfer: {radius: 5} })]
  // };
  // add body to walls array so the wall's position will be updated on each loop
  walls = [...walls, ...wall]

  World.add(engine.world, [...walls, ...wall]);
}

function createNewWall() {
  let h = 10;
  let w = width - 150;
  let x5 = getRandomIntInclusive(0, width)

  let wall = Bodies.rectangle(x5, height, w, h, { isStatic: true, chamfer:  {radius: 5} })
  // };
  // add body to walls array so the wall's position will be updated on each loop
  walls.push(wall)

  World.add(engine.world, [...walls]);
}

function removeWall() {
  World.remove(engine.world, [...walls]);
  walls.shift();
}

const moveWalls = () => {

  let posY = 1
  if (score === 5) {
    render.options.background = 'skyblue'
    posY += .1
  }
  if (score === 10) {
    render.options.background = 'grey'
    posY += .1
  }
  if (score === 15) {
    render.options.background = 'lightgrey'
    posY += .1
  }
  if (score === 20) {
    render.options.background = 'pink'
    posY += .1
  }
  if (score === 25) {
    render.options.background = 'purple'
    posY += .1
  }
  if (score === 30) {
    render.options.background = 'red'
    posY += .1
  }
  
  if (collision || !start) return;
  
  walls.forEach((wall, i) => {
    // point to translate the wall 
    let t = { x: 0, y: -posY };
    Body.translate(wall, t);
    // remove the wall when it's out of view

    if (walls[walls.length -1].position.y < 4 * height / 5) {
      createNewWall();
      increaseScore(1);
    }

    if (walls[walls.length -1].position.y < 0) {
      removeWall()
    }

  });

}



/* ===================================================== 
 * The Game Bodies
 * ================================================== */

let bird;
let walls = [];
let score = 0;
let start = false;
let collision = false;

function createBird() {
  // Adds the bird to the world
  bird = new Bird();
  bird.addBird();
}

function createGround() {

  let left = Bodies.rectangle(0, height/2, 20, height, { isStatic: true });
  let right = Bodies.rectangle(width, height/2, 20, height, { isStatic: true });

  World.add(engine.world, [left, right]);
}
let wallTop, wallBottom
const createTopWall = () => {
  wallTop = Bodies.rectangle(width/2, 0, width, 20, { isStatic: true, label: 'dead' });
  wallBottom = Bodies.rectangle(width/2, height, width, 20, { isStatic: true, label: 'dead' });

  World.add(engine.world, [wallTop, wallBottom]);

}


function bumpBird() {
  // Applies an upward force to the bird
  // TODO: need to limit the height, check if   
  // the body is on screen before bumping again
  // or alternatively have a ceiling that you hit
  if (collision || !start) return;

  // Body to apply force to
  let b = bird.body;

  // Position to apply Force is at  
  // the birds current position
  let p = bird.body.position;

  // Force vector to be applied
  let f = {
    x: 0,
    y: -0.03
  };

  Body.applyForce(b, p, f);
}

function goLeft() {
  // Applies an upward force to the bird
  // TODO: need to limit the height, check if   
  // the body is on screen before bumping again
  // or alternatively have a ceiling that you hit
  if (collision || !start) return;

  // Body to apply force to
  let b = bird.body;

  // Position to apply Force is at  
  // the birds current position
  let p = bird.body.position;

  // Force vector to be applied
  let f = {
    x: -0.01,
    y: 0
  };

  Body.applyForce(b, p, f);
}

function goRight() {
  // Applies an upward force to the bird
  // TODO: need to limit the height, check if   
  // the body is on screen before bumping again
  // or alternatively have a ceiling that you hit
  if (collision || !start) return;

  // Body to apply force to
  let b = bird.body;

  // Position to apply Force is at  
  // the birds current position
  let p = bird.body.position;

  // Force vector to be applied
  let f = {
    x: 0.01,
    y: 0
  };

  Body.applyForce(b, p, f);
}

/* ===================================================== 
 * The Game
 * ================================================== */

function runMatter() {
  // init the engine and renderer
  Engine.run(engine);
  Render.run(render);

  // Listeners for the game

  // Update the walls when the engine updates
  Events.on(engine, 'tick', moveWalls);
  Events.on(engine, 'tick', ifCollide);

}
// Collision Event ends the game :-(
  const ifCollide = () => {
    const collisioning = Matter.SAT.collides(bird.body, wallBottom);
    if (collisioning.collided) {
        endGame()
        // do something
    }
    const collisioing = Matter.SAT.collides(bird.body, wallTop);
    if (collisioing.collided) {
        endGame()
        // do something
    }
}

function startGame() {
  start = true;
  engine.world.gravity.y = 0.6;
  // set the bird to static at first
  startButton.style.display = 'none';
}

function endGame() {
  collision = false;
  Events.off(engine, 'tick', moveWalls);
  bird.setHit();

  fail.style.display = 'block';
}

function resetGame() {
  window.location.reload()
}


/* ===================================================== 
 * The GUI
 * ================================================== */

let scoreDisplay;
let gui;
let startButton;
let resetButton;
let fail;

function setupGUI() {
  scoreDisplay = document.getElementById('score');
  scoreDisplay.innerText = score;

  gui = document.getElementById('gui');

  startButton = document.getElementById('start');
  resetButton = document.getElementById('reset');
  fail = document.getElementById('fail');
  fail.style.display = 'none';

  // Button listeners
  startButton.addEventListener('click', startGame, false);
  resetButton.addEventListener('click', resetGame, false);
}

function resetScore() {
  score = 0;
  scoreDisplay.innerText = score;
}

function increaseScore(points) {
  score += points;
  scoreDisplay.innerText = score;
}

/* ===================================================== 
 * Utilities
 * ================================================== */

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ===================================================== 
 * Kickoff
 * ================================================== */

// Initializes the game
function init() {

  // Setup the Matter engine and renderer
  setupMatter();

  // Add event listeners
  addEventListeners();

  // Add the necessary Matter bodies to the world
  createBird();
  createWall();
  createGround();
  createTopWall();

  // GUI 
  setupGUI();

  // Runs the engine and renderer
  runMatter();
}

init()

