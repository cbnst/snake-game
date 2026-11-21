const canvas = document.querySelector("#game-board");
const context = canvas.getContext("2d");
const scoreElement = document.querySelector("#score");
const bestElement = document.querySelector("#best");
const messageElement = document.querySelector("#game-message");
const startButton = document.querySelector("#start-button");
const pauseButton = document.querySelector("#pause-button");

const gridSize = 20;
const cellSize = canvas.width / gridSize;
const directions = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
};
const keyDirections = {
  ArrowUp: "up",
  w: "up",
  W: "up",
  ArrowRight: "right",
  d: "right",
  D: "right",
  ArrowDown: "down",
  s: "down",
  S: "down",
  ArrowLeft: "left",
  a: "left",
  A: "left"
};
const savedBest = Number(localStorage.getItem("snake-best")) || 0;

let snake;
let direction;
let nextDirection;
let food;
let score;
let best = savedBest;
let state = "ready";
let timer;

bestElement.textContent = String(best).padStart(2, "0");

function resetGame() {
  snake = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
  direction = directions.right;
  nextDirection = directions.right;
  score = 0;
  scoreElement.textContent = "00";
  food = placeFood();
  draw();
}

function placeFood() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  } while (snake.some((segment) => segment.x === position.x && segment.y === position.y));
  return position;
}

function draw() {
  context.fillStyle = "#0c140e";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "#18241a";
  context.lineWidth = 1;
  for (let line = 1; line < gridSize; line += 1) {
    const position = line * cellSize;
    context.beginPath();
    context.moveTo(position, 0);
    context.lineTo(position, canvas.height);
    context.moveTo(0, position);
    context.lineTo(canvas.width, position);
    context.stroke();
  }

  context.fillStyle = "#f3a75c";
  context.beginPath();
  context.arc(
    (food.x + 0.5) * cellSize,
    (food.y + 0.5) * cellSize,
    cellSize * 0.25,
    0,
    Math.PI * 2
  );
  context.fill();

  snake.forEach((segment, index) => {
    context.fillStyle = index === 0 ? "#d0ff8f" : "#8bc85c";
    context.beginPath();
    context.roundRect(
      segment.x * cellSize + 2,
      segment.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4,
      4
    );
    context.fill();
  });
}

function setState(nextState, message) {
  state = nextState;
  messageElement.textContent = message;
  pauseButton.disabled = state !== "running" && state !== "paused";
  pauseButton.innerHTML = state === "paused" ? 'Resume <span aria-hidden="true">▶</span>' : 'Pause <span aria-hidden="true">Ⅱ</span>';
  startButton.innerHTML = state === "running" ? 'Restart game <span aria-hidden="true">↻</span>' : 'Start game <span aria-hidden="true">↗</span>';
}

function startGame() {
  window.clearInterval(timer);
  resetGame();
  setState("running", "Use your arrow keys or WASD to move.");
  timer = window.setInterval(moveSnake, 125);
}

function endGame(message = "Game over. Press start to try again.") {
  window.clearInterval(timer);
  setState("over", message);
}

function moveSnake() {
  direction = nextDirection;
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };
  const eating = head.x === food.x && head.y === food.y;
  const bodyToCheck = eating ? snake : snake.slice(0, -1);
  const hitWall = head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize;
  const hitSnake = bodyToCheck.some((segment) => segment.x === head.x && segment.y === head.y);

  if (hitWall || hitSnake) {
    endGame();
    return;
  }

  snake.unshift(head);
  if (eating) {
    score += 1;
    scoreElement.textContent = String(score).padStart(2, "0");
    if (score > best) {
      best = score;
      bestElement.textContent = String(best).padStart(2, "0");
      localStorage.setItem("snake-best", String(best));
    }
    if (snake.length === gridSize * gridSize) {
      draw();
      endGame("You filled the board. Incredible!");
      return;
    }
    food = placeFood();
  } else {
    snake.pop();
  }
  draw();
}

function changeDirection(name) {
  if (state !== "running") return;
  const candidate = directions[name];
  if (!candidate) return;
  if (candidate.x + direction.x === 0 && candidate.y + direction.y === 0) return;
  nextDirection = candidate;
}

function togglePause() {
  if (state === "running") {
    window.clearInterval(timer);
    setState("paused", "Paused. Take your time.");
  } else if (state === "paused") {
    setState("running", "Use your arrow keys or WASD to move.");
    timer = window.setInterval(moveSnake, 125);
  }
}

document.addEventListener("keydown", (event) => {
  const name = keyDirections[event.key];
  if (name) {
    event.preventDefault();
    changeDirection(name);
  } else if (event.key === " " && (state === "running" || state === "paused")) {
    event.preventDefault();
    togglePause();
  }
});

document.querySelectorAll("[data-direction]").forEach((button) => {
  button.addEventListener("click", () => changeDirection(button.dataset.direction));
});

startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", togglePause);

resetGame();
setState("ready", "Press start when you're ready.");
