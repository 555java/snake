const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const start = document.getElementById("start");
const restart = document.getElementById("restart");
const info = document.getElementById("info");
const infoMessage = document.getElementById("info-message");
const scoreEL = document.getElementById("score");
const levelEl = document.getElementById("level");
const sizeEl = document.getElementById("size");

const squareInfo = {
  w: 50,
  h: 50,
  padding: 10,
  offsetX: 10,
  offsetY: 10,
  visible: true,
};

let fieldInfo = {
  rows: 10,
  columns: 10,
};

let speed = 500;

canvas.width =
  fieldInfo.columns * squareInfo.w +
  (fieldInfo.columns - 1) * squareInfo.padding +
  squareInfo.offsetX * 2;

canvas.height =
  fieldInfo.rows * squareInfo.h +
  (fieldInfo.rows - 1) * squareInfo.padding +
  squareInfo.offsetY * 2;

let snake = [
  [5, 4],
  [5, 5],
];

const directions = ["right", "left", "up", "down"];

let snakeDir = directions[Math.floor(Math.random() * 4)];

let aim = [0, 0];

let snakeTail = [];

let score = 0;

let interval;

//Creating field
const field = [];
for (let i = 0; i < fieldInfo.rows; i++) {
  field[i] = [];
  for (let j = 0; j < fieldInfo.columns; j++) {
    const x = i * (squareInfo.w + squareInfo.padding) + squareInfo.offsetX;
    const y = j * (squareInfo.h + squareInfo.padding) + squareInfo.offsetY;
    const row = j;
    const column = i;
    const visible = false;
    field[i][j] = { x, y, row, column, visible };
  }
}

//draw field
function drawField() {
  field.forEach((column) => {
    column.forEach((square) => {
      ctx.beginPath();
      ctx.rect(square.x, square.y, squareInfo.w, squareInfo.h);
      ctx.fillStyle = square.visible ? "#333" : "#ddd";
      ctx.fill();
      ctx.closePath();
    });
  });
}

//Draw snake
function drawSnakeOnFIeld() {
  snake.forEach((part) => {
    console.log(JSON.stringify(part));
    field[part[0]][part[1]].visible = true;
  });
}

//Get random aim
function getAim() {
  aim = [
    Math.floor(Math.random() * fieldInfo.columns),
    Math.floor(Math.random() * fieldInfo.rows),
  ];
  snake.forEach((item) => {
    if (JSON.stringify(item) === JSON.stringify(aim)) {
      getAim();
    }
  });
}

//Draw aim on field
function drawAim() {
  field[aim[0]][aim[1]].visible = true;
}

//updating snake
function updateSnake(afterUpdate) {
  field.forEach((column) => {
    column.forEach((square) => {
      square.visible = false;
    });
  });
  //Mooving snake
  snakeTail = snake[snake.length - 1];

  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = [snake[i - 1][0], snake[i - 1][1]];
  }
  switch (snakeDir) {
    case "up":
      snake[0] = [snake[1][0], snake[1][1] - 1];
      break;
    case "right":
      snake[0] = [snake[1][0] + 1, snake[1][1]];
      break;
    case "down":
      snake[0] = [snake[1][0], snake[1][1] + 1];
      break;
    case "left":
      snake[0] = [snake[1][0] - 1, snake[1][1]];
      break;
  }
  //Collision with body of snake
  for (let i = 0; i < snake.length; i++) {
    for (let j = 0; j < snake.length; j++) {
      if (j == i) {
        continue;
      } else {
        if (snake[i][0] === snake[j][0] && snake[i][1] === snake[j][1]) {
          gameOver();
        } else {
          continue;
        }
      }
    }
  }
  //collision with walls
  if (snake[0].includes(-1) || snake[0].includes(fieldInfo.rows)) {
    gameOver();
    return;
  }
  //Eating the aim
  if (snake[0][0] === aim[0] && snake[0][1] === aim[1]) {
    snake.push(snakeTail);
    getAim();
  }
  score = snake.length - 2;
  scoreEL.innerHTML = `Score:${score}`;
  afterUpdate();
}

//draw everything
function draw() {
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnakeOnFIeld();
  drawAim();
  drawField();
}

//update Canvas drawing and animation
function update() {
  updateSnake(draw);
}

//Start game
function startGame() {
  info.classList.remove("show");
  snake = [
    [5, 4],
    [5, 5],
  ];
  score = 0;
  setSizeSpeed();
  interval = setInterval(update, speed);
  getAim();
  draw();
}

//setting start options
function setSizeSpeed() {
  //set speed
  if (levelEl.value === "easy") {
    speed = 1000;
  } else if (levelEl.value === "medium") {
    speed = 500;
  } else {
    speed = 300;
  }

  // //set size
  // fieldInfo.rows = +sizeEl.value;
  // fieldInfo.columns = +sizeEl.value;
  // console.log(speed, fieldInfo.rows);
}
function restartAll() {
  document.location.reload();
}

function gameOver() {
  clearInterval(interval);
  info.classList.add("show");
  infoMessage.innerHTML = `<p>Game over!</p><p>Your score is:${score}</p><p>If you want to start new game - press button.</p>`;
  drawField();
}

drawField();

//Event listeners
start.addEventListener("click", startGame);

restart.addEventListener("click", restartAll);
document.addEventListener("keydown", keyDown);

//Changing directions by keys
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    snakeDir = "right";
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    snakeDir = "left";
  } else if (e.key === "Up" || e.key === "ArrowUp") {
    snakeDir = "up";
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    snakeDir = "down";
  }
}
