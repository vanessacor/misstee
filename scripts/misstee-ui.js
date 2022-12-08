"use strict";

class MissteeUI {
  constructor() {
    this.splash = document.querySelector(".splash");
    this.gameScreen = document.querySelector(".game");
    this.playButton = document.getElementById("play-button");
    this.gameOver = document.querySelector(".game-over");
    this.finalScoreDisplay = document.getElementById("final-score");
    this.gameWrapper = document.getElementById("canvas-wrapper");
    this.toogleSound = document.getElementById("sound");
    this.soundOn = document.getElementById("sound-on");
    this.soundOff = document.getElementById("sound-off");
    this.restartButton = document.getElementById("restart-button");
    this.finalScoreDisplay = document.getElementById("final-score");
    this.bestScoreDisplay = document.getElementById("best-score");
    this.showGameInfo = document.getElementById("show-info");
    this.instructions = document.getElementById("instructions");

    this.getBestScore();
    this.sound = "off";
    this.orientationEventListener = null;
    this._bindEventListeners();
  }

  _bindEventListeners() {
    this.toogleSound.addEventListener("click", () => this.turnMusicOnAndOff());
    this.showGameInfo.addEventListener("click", () => this.toggleInfo());
    this.playButton.addEventListener("click", () => this.startGame());
    this.restartButton.addEventListener("click", () => this.restartGame());
  }

  toggleInfo() {
    if (this.instructions.style.display !== "block") {
      this.instructions.style.display = "block";
      this.showGameInfo.removeAttribute("info-closed");
      this.showGameInfo.setAttribute("class", "info-open");
    } else {
      this.instructions.style.display = "none";
      this.showGameInfo.removeAttribute("info-open");
      this.showGameInfo.setAttribute("class", "info-closed");
    }
  }
  getBestScore() {
    const score =
      localStorage.getItem("bestScore") ?? localStorage.setItem("bestScore", 0);
    this.bestScoreDisplay.innerHTML = score;
    return score;
  }

  updateBestScore(score) {
    if (this.getBestScore() < score) {
      localStorage.setItem("bestScore", score);
    } else return;
  }

  turnMusicOnAndOff() {
    if (this.sound === "off") {
      this.sound = "on";
      this.soundOn.style.display = "none";
      this.soundOff.style.display = "block";
    } else {
      this.sound = "off";
      this.soundOff.style.display = "none";
      this.soundOn.style.display = "block";
    }
  }

  checkOrientation() {
    clearTimeout(this.resumeGameDelayTimeoutId);
    this.resumeGameDelayTimeoutId = setTimeout(() => {
      const rotatemsg = document.getElementById("rotate-screen");
      if (window.innerWidth < window.innerHeight) {
        rotatemsg.style.display = "block";
        this.game.pause();
      } else {
        const width = this.gameWrapper.clientWidth;
        const height = this.gameWrapper.clientHeight;
        this.game.updateSize(width, height);
        rotatemsg.style.display = "none";
        this.game.resume();
      }
    }, 0);
  }

  startGame() {
    this.splash.style.display = "none";
    this.gameScreen.style.display = "grid";
    this.game = new Game("paused", this.sound);
    this.game.gameOverCallBack(() => this.showGameOver(this.game.score));
    this.checkOrientation();
    this.game.start();

    this.orientationEventListener = () => {
      this.checkOrientation();
    };

    window.addEventListener("orientationchange", this.orientationEventListener);
    window.addEventListener("resize", this.orientationEventListener);
  }

  showGameOver(score) {
    removeEventListener("orientationchange", this.orientationEventListener);
    this.gameScreen.style.display = "none";
    this.gameOver.style.display = "block";
    this.updateBestScore(score);
    this.finalScoreDisplay.innerText = score;
  }

  createLive() {
    const lives = document.getElementById("lives");
    const live = document.createElement("li");
    lives.appendChild(live);
    const heart = document.createElement("i");
    heart.setAttribute("class", "fas fa-heart");
    live.appendChild(heart);
  }

  restartGame() {
    const score = document.getElementById("score");
    score.innerText = "Score: ";
    this.gameOver.style.display = "none";

    for (let i = 0; i < 3; i++) {
      this.createLive();
    }
    this.startGame();
  }
}
