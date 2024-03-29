"use strict";

const NUMBER_OF_POISONS_TO_GENERATE = 1;
const NUMBER_OF_FOODS_TO_GENERATE = 1.5;
const GENERATE_MORE_TIMER = 300;
const MAX_SPEED = 1.2;

class Game {
  constructor(state, soundState) {
    this.canvas = document.getElementById("my-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.document = document;
    this.cat = new Cat(100, 100, this.ctx);
    this.levelOfDifficulty = 1;
    this.foods = [];
    this.poisons = [];
    this.lives = 3;
    this.score = 0;
    this.ui = new GameUI(this.score);
    this.timer = GENERATE_MORE_TIMER - 1;
    this.gameState = state;
    this.soundState = soundState;
    this.catEatsound = document.getElementById("cat-eat");
    this.catMeowSound = document.getElementById("cat-meow");
    this.onGameOver = this.gameOverCallBack();
  }

  _bindEventListeners() {
    this.document.addEventListener("touchstart", (ev) =>
      this.cat.setDirection("up")
    );
    this.document.addEventListener("touchend", (ev) =>
      this.cat.setDirection("down")
    );
    this.document.addEventListener("keydown", (ev) => this.keyDownHandler(ev));
    this.document.addEventListener("keydown", (ev) => this.keyUpHandler(ev));
    this.document.addEventListener("mousedown", (ev) =>
      this.cat.setDirection("up")
    );
    this.document.addEventListener("mouseup", (ev) =>
      this.cat.setDirection("down")
    );
  }

  gameOverCallBack(onGameOver) {
    this.onGameOver = () => {
      onGameOver();
    };
  }

  keyUpHandler(e) {
    if (e.key === "Up" || e.key === "ArrowUp") {
      this.cat.setDirection("up");
    }
  }

  keyDownHandler(e) {
    if (e.key === "Down" || e.key === "ArrowDown") {
      this.cat.setDirection("down");
    }
  }

  purgeItems() {
    for (let i = this.foods.length - 1; i >= 0; i--) {
      const food = this.foods[i];
      if (!food.active) {
        this.foods.splice(i, 1);
      }
    }
    for (let i = this.poisons.length - 1; i >= 0; i--) {
      const poison = this.poisons[i];
      if (!poison.active) {
        this.poisons.splice(i, 1);
      }
    }
  }

  detectCollission() {
    for (let i = 0; i < this.foods.length; i++) {
      const food = this.foods[i];
      if (Utils.detectCollission(this.cat, food)) {
        if (this.soundState === "on") {
          this.catEatsound.play();
        }
        this.score++;
        food.deactivate();
        this.ui.updateScore(this.score);
      }
    }
    for (let i = 0; i < this.poisons.length; i++) {
      const poison = this.poisons[i];
      if (Utils.detectCollission(this.cat, poison)) {
        if (this.soundState === "on") {
          this.catMeowSound.play();
        }
        this.lives--;
        poison.deactivate();
        this.ui.removeLife();
      }
    }
  }

  isGameOver() {
    if (this.lives === 0) {
      this.gameState = "off";
      this.onGameOver();
    }
  }

  deactivateItems() {
    for (let i = this.foods.length - 1; i > 0; i--) {
      const food = this.foods[i];
      if (food.x < 0) {
        food.deactivate();
      }
    }
    for (let i = this.poisons.length - 1; i > 0; i--) {
      const poison = this.poisons[i];
      if (poison.x < 0) {
        poison.deactivate();
      }
    }
  }

  playMusic() {
    const music = document.getElementById("game-music");
    if (this.soundState === "on") {
      music.play();
    }
  }

  generateItems() {
    const x = this.canvasWidth;
    const elementHeight = 10;
    this.generateFoods(elementHeight, x);
    this.generatePoisons(elementHeight, x);
  }

  getNumberOfItemsToGenerate(isPoison) {
    const numberOfElementsToGenerate = isPoison
      ? NUMBER_OF_POISONS_TO_GENERATE
      : NUMBER_OF_FOODS_TO_GENERATE;

    return Math.floor(numberOfElementsToGenerate * this.levelOfDifficulty);
  }

  generateGameItems(element) {
    const isPoison = element.type === "poison";

    const numberOfElements = this.getNumberOfItemsToGenerate(isPoison);

    for (let i = 0; i < numberOfElements; i++) {
      const elementY = Utils.randomIntFromRange(
        0,
        this.canvasHeight - element.height
      );
      const elementDx = Utils.randomIntFromRange(1, MAX_SPEED);
      const newElement = isPoison
        ? new Poison(this.ctx, element.positionX, elementY, elementDx)
        : new Food(this.ctx, element.positionX, elementY, elementDx);

      element.array.push(newElement);
    }
  }
  generatePoisons(elementHeight, x) {
    const element = {
      array: this.poisons,
      height: elementHeight,
      positionX: x,
      type: "poison",
    };

    this.generateGameItems(element);
  }

  generateFoods(elementHeight, x) {
    const element = {
      array: this.foods,
      height: elementHeight,
      positionX: x,
      type: "food",
    };
    this.generateGameItems(element);
  }

  updateLevelOfDifficulty() {
    this.levelOfDifficulty += 0.1;
    if (this.score > 10) this.levelOfDifficulty = Math.random() * (5 - 1) + 1;
  }

  generateMoreItems() {
    const timeToGenerateMore = GENERATE_MORE_TIMER / this.levelOfDifficulty;

    if (this.timer > timeToGenerateMore) {
      this.updateLevelOfDifficulty();

      this.generateItems();
      this.timer = 0;
    }
  }

  updateAll() {
    for (let i = 0; i < this.foods.length; i++) {
      this.foods[i].update();
    }
    for (let i = 0; i < this.poisons.length; i++) {
      this.poisons[i].update();
    }

    this.cat.update(this.canvasHeight);
  }

  drawAll() {
    for (let i = 0; i < this.foods.length; i++) {
      const food = this.foods[i];
      if (food.active) {
        this.foods[i].draw();
      }
    }
    for (let i = 0; i < this.poisons.length; i++) {
      const poison = this.poisons[i];
      if (poison.active) {
        poison.draw();
      }
    }
    this.cat.draw();
  }

  // -- public

  start() {
    this.playMusic();
    this._bindEventListeners();
  }

  updateSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  pause() {
    this.gameState = "paused";
  }

  resume() {
    if (this.gameState !== "on") {
      this.gameState = "on";
      this.loop();
    }
  }

  loop() {
    if (this.gameState === "off" || this.gameState === "paused") {
      return;
    }

    requestAnimationFrame(() => this.loop());
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.timer++;
    this.purgeItems();
    this.deactivateItems();
    this.detectCollission();
    this.generateMoreItems();
    this.updateAll();
    this.isGameOver();
    this.drawAll();
  }
}
