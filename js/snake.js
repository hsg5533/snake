export class Snake {
  constructor(mapSize, speed, snakeLength) {
    this.boxSize = 25;
    this.boxCount = mapSize;
    this.boxGap = 1.2;
    this.boxColor = "#FFFFFF";

    this.boardSize =
      this.boxSize * this.boxCount + (this.boxCount + 1) * this.boxGap;
    this.boardColor = "#707070";
    this.foodColor = "#ac2020";

    this.gameArray = [];

    this.snake = [];
    this.snakeColor = "#000000";
    this.snakeLength = snakeLength;

    // 0 : 매우느림 : 0.4초
    // 1 : 느림 : 0.2초
    // 2 : 보통 : 0.09초
    // 3 : 빠름 : 0.07초
    // 4 : 매우빠름 : 0.05초

    if (speed === 0) {
      this.speed = 0.4;
    } else if (speed === 1) {
      this.speed = 0.2;
    } else if (speed === 2) {
      this.speed = 0.09;
    } else if (speed === 3) {
      this.speed = 0.07;
    } else if (speed === 4) {
      this.speed = 0.05;
    }

    this.vx = 0;
    this.vy = 0;

    this.start = false;

    this.init();
  }

  init() {
    const headX = Math.floor(Math.random() * (this.boxCount - 2) + 1);
    const headY = Math.floor(Math.random() * (this.boxCount - 2) + 1);

    this.vx = headX < this.boxCount / 2 ? 1 : -1;
    this.vy = headY < this.boxCount / 2 ? 1 : -1;

    this.vx =
      Math.abs(headX - this.boxCount / 2) > Math.abs(headY - this.boxCount / 2)
        ? this.vx
        : 0;
    this.vy =
      Math.abs(headX - this.boxCount / 2) <= Math.abs(headY - this.boxCount / 2)
        ? this.vy
        : 0;

    for (let i = 0; i < this.boxCount; i++) {
      const line = [];
      for (let j = 0; j < this.boxCount; j++) {
        line.push(0);
      }
      this.gameArray.push(line);
    }

    for (let i = 0; i < this.snakeLength; i++) {
      const x = headX;
      const y = headY;
      this.snake.push({ x, y });
      this.gameArray[y][x] = 1;
    }

    this.makeFood();
    this.playGame();
  }

  playGame() {
    this.interval = setInterval(() => {
      if (this.start) {
        let prev = {
          x: this.snake[0].x,
          y: this.snake[0].y,
        };
        for (let i = 0; i < this.snakeLength; i++) {
          this.gameArray[this.snake[i].y][this.snake[i].x] = 0;

          if (i === 0) {
            this.snake[i].x += this.vx;
            this.snake[i].y += this.vy;
          } else {
            let temp = {
              x: this.snake[i].x,
              y: this.snake[i].y,
            };
            this.snake[i].x = prev.x;
            this.snake[i].y = prev.y;
            prev.x = temp.x;
            prev.y = temp.y;
          }
        }
        for (let i = 0; i < this.snakeLength; i++) {
          if (i === 0) {
            if (this.isConflict()) {
              this.gameOver();
            } else {
              this.gameArray[this.snake[i].y][this.snake[i].x] = 1;
            }
          } else {
            this.gameArray[this.snake[i].y][this.snake[i].x] = 1;
          }
        }

        if (
          this.food.x === this.snake[0].x &&
          this.food.y === this.snake[0].y
        ) {
          this.snake.push({
            x: prev.x,
            y: prev.y,
          });
          this.snakeLength += 1;
          this.makeFood();
        }
      }
    }, this.speed * 1000);
  }

  makeFood() {
    const head = this.snake[0];
    const tail = this.snake[this.snakeLength - 1];

    while (true) {
      const x = Math.floor(Math.random() * (this.boxCount - 2)) + 1;
      const y = Math.floor(Math.random() * (this.boxCount - 2)) + 1;

      const dx = x - head.x;
      const dy = y - head.y;

      const dist = Math.sqrt(dx ** 2 + dy ** 2);

      if (dist >= this.boxCount / 2) {
        let pass = true;
        for (let i = 0; i < this.snake.length; i++) {
          if (this.snake[i].x === x && this.snake[i].y === y) {
            pass = false;
          }
        }
        if (pass) {
          this.food = { x, y };
          break;
        }
      }
    }

    this.gameArray[this.food.y][this.food.x] = 2;
  }

  isConflict() {
    const head = this.snake[0];

    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= this.boxCount ||
      head.y >= this.boxCount
    ) {
      return true;
    }

    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        return true;
      }
    }

    return false;
  }

  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    this.centerX = (this.stageWidth - this.boardSize) / 2;
    this.centerY = (this.stageHeight - this.boardSize) / 2;
  }

  keyDown(key) {
    if (key === "ArrowRight") {
      if (this.vx !== -1 && this.vy !== 0) {
        this.vx = 1;
        this.vy = 0;
      }
    } else if (key === "ArrowLeft") {
      if (this.vx !== 1 && this.vy !== 0) {
        this.vx = -1;
        this.vy = 0;
      }
    } else if (key === "ArrowUp") {
      if (this.vx !== 0 && this.vy !== 1) {
        this.vx = 0;
        this.vy = -1;
      }
    } else if (key === "ArrowDown") {
      if (this.vx !== 0 && this.vy !== -1) {
        this.vx = 0;
        this.vy = 1;
      }
    } else if (key === "Escape") {
      this.gameOver();
    }
  }

  gameOver() {
    const endBox = document.querySelector(".endBox");
    const score = document.querySelector(".score");

    clearInterval(this.interval);

    score.innerText = this.snake.length;
    endBox.classList.add("flex");
  }

  draw(ctx) {
    // 보드 그리는 곳
    ctx.fillStyle = this.boardColor;
    ctx.fillRect(this.centerX, this.centerY, this.boardSize, this.boardSize);

    // 박스 그리는 곳

    for (let i = 0; i < this.gameArray.length; i++) {
      const line = this.gameArray[i];
      const posY =
        this.centerY + this.boxGap + (this.boxSize + this.boxGap) * i;

      for (let j = 0; j < line.length; j++) {
        const box = line[j];
        const posX =
          this.centerX + this.boxGap + (this.boxSize + this.boxGap) * j;

        if (box === 0) {
          ctx.fillStyle = this.boxColor;
        } else if (box === 1) {
          ctx.fillStyle = this.snakeColor;
        } else if (box === 2) {
          ctx.fillStyle = this.foodColor;
        }

        ctx.fillRect(posX, posY, this.boxSize, this.boxSize);
      }
    }
  }
}
