import { Snake } from "./snake.js";

class App {
  constructor(mapSize, speed, snakeLength) {
    const canvasBox = document.querySelector(".canvasBox");
    const counter = document.createElement("div");
    counter.className = "counter";
    document.body.appendChild(counter);

    canvasBox.classList.add("show");
    canvasBox.style.opacity = 0.3;

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    canvasBox.appendChild(this.canvas);

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    this.snake = new Snake(mapSize, speed, snakeLength);

    this.resize();
    window.addEventListener("resize", this.resize.bind(this), false);
    window.addEventListener("keydown", this.keyDown.bind(this), false);

    requestAnimationFrame(this.animate.bind(this));

    this.count = 3;
    counter.innerText = this.count;
    const interval = setInterval(() => {
      this.count -= 1;
      counter.innerText = this.count;
      if (this.count === 0) {
        this.snake.start = true;
        document.body.removeChild(counter);
        canvasBox.style.opacity = 1;
        clearInterval(interval);
      }
    }, 700);
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;

    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    this.snake.resize(this.stageWidth, this.stageHeight);
  }

  animate(t) {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.snake.draw(this.ctx);
    requestAnimationFrame(this.animate.bind(this));
  }

  keyDown(event) {
    const { key } = event;
    this.snake.keyDown(key);
  }
}

window.onload = () => {
  const startMenu = document.querySelector(".startMenu");
  const gameMenu = document.querySelector(".gameMenu");
  const settingBox = document.querySelector(".settingBox");
  const startBox = document.querySelector(".startBox");
  const startBtn = document.querySelector(".startBtn");
  const settingBtn = document.querySelector(".settingBtn");
  const normalBtn = document.querySelector(".normalBtn");
  const rankBtn = document.querySelector(".rankBtn");
  const initBtn = document.querySelector(".initBtn");

  const backStart = document.querySelector(".backStart");
  const backGameMenu = document.querySelector(".backGameMenu");

  const mapSizeLabel = document.querySelector(".mapSizeLabel");
  const speedLabel = document.querySelector(".speedLabel");
  const tailLabel = document.querySelector(".tailLabel");

  let mapSize = 18;
  let speed = 2;
  let tail = 3;

  settingBtn.addEventListener("click", () => {
    gameMenu.classList.remove("flex");
    settingBox.classList.add("flex");
  });

  backGameMenu.addEventListener("click", () => {
    settingBox.classList.remove("flex");
    gameMenu.classList.add("flex");
  });

  backStart.addEventListener("click", () => {
    gameMenu.classList.remove("flex");
    startMenu.classList.add("flex");
  });

  startBtn.addEventListener("click", () => {
    startMenu.classList.remove("flex");
    gameMenu.classList.add("flex");
  });

  normalBtn.addEventListener("click", () => {
    startBox.classList.remove("flex");
    new App(mapSize, speed, tail);
  });

  rankBtn.addEventListener("click", () => {
    startBox.classList.remove("flex");
    new App(14, 3, 3);
  });

  initBtn.addEventListener("click", () => {
    location.reload();
  });

  mapSizeLabel.querySelector(".prevBtn").addEventListener("click", () => {
    if (mapSize !== 14) {
      mapSize -= 4;
    }
    handleMapSize();
  });

  mapSizeLabel.querySelector(".nextBtn").addEventListener("click", () => {
    if (mapSize !== 22) {
      mapSize += 4;
    }
    handleMapSize();
  });

  speedLabel.querySelector(".prevBtn").addEventListener("click", () => {
    if (speed !== 0) {
      speed--;
    }
    handleSpeed();
  });

  speedLabel.querySelector(".nextBtn").addEventListener("click", () => {
    if (speed !== 4) {
      speed++;
    }
    handleSpeed();
  });

  tailLabel.querySelector(".prevBtn").addEventListener("click", () => {
    if (tail !== 2) {
      tail--;
    }
    tailLabel.querySelector(".num").innerText = tail;
  });

  tailLabel.querySelector(".nextBtn").addEventListener("click", () => {
    if (tail !== 10) {
      tail++;
    }
    tailLabel.querySelector(".num").innerText = tail;
  });

  const handleMapSize = () => {
    let text = "";
    if (mapSize === 14) {
      text = "작음";
    } else if (mapSize === 18) {
      text = "보통";
    } else if (mapSize === 22) {
      text = "큼";
    }
    mapSizeLabel.querySelector(".num").innerText = text;
  };

  const handleSpeed = () => {
    let text = "";

    if (speed === 0) {
      text = "매우 느림";
    } else if (speed === 1) {
      text = "느림";
    } else if (speed === 2) {
      text = "보통";
    } else if (speed === 3) {
      text = "빠름";
    } else if (speed === 4) {
      text = "매우 빠름";
    }

    speedLabel.querySelector(".num").innerText = text;
  };
};
