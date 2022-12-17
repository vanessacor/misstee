"use strict";

class MissteeUI {
  constructor() {
    this.splash = document.querySelector(".splash");
    this.gameScreen = document.querySelector(".game");
    this.playButton = document.getElementById("play-button");
    this.gameOverScreen = document.querySelector(".game-over");
    this.finalScoreDisplay = document.getElementById("final-score");
    this.gameWrapper = document.getElementById("canvas-wrapper");
    this.toogleSoundButton = document.getElementById("sound");
    this.soundOnButton = document.getElementById("sound-on");
    this.soundOffButton = document.getElementById("sound-off");
    this.restartButton = document.getElementById("restart-button");
    this.finalScoreDisplay = document.getElementById("final-score");
    this.bestScoreDisplay = document.getElementById("best-score");
    this.showGameInfoButton = document.getElementById("show-info");
    this.instructionsPanel = document.getElementById("instructions");

    this.showBestScore();
    this.sound = "off";
    this.orientationEventListener = null;
    this._bindEventListeners();
  }

  _bindEventListeners() {
    this.toogleSoundButton.addEventListener("click", () =>
      this.toggleMusicOn()
    );
    this.showGameInfoButton.addEventListener("click", () =>
      this.toggleShowInfo()
    );
    this.playButton.addEventListener("click", () => this.startGame());
    this.restartButton.addEventListener("click", () => this.restartGame());
  }

  toggleShowInfo() {
    if (this.instructionsPanel.style.display !== "block") {
      this.instructionsPanel.style.display = "block";
      this.showGameInfoButton.removeAttribute("info-closed");
      this.showGameInfoButton.setAttribute("class", "info-open");
    } else {
      this.instructionsPanel.style.display = "none";
      this.showGameInfoButton.removeAttribute("info-open");
      this.showGameInfoButton.setAttribute("class", "info-closed");
    }
  }

  showBestScore() {
    const score =
      localStorage.getItem("bestScore") ?? localStorage.setItem("bestScore", 0);
    this.bestScoreDisplay.innerHTML = score;
    return score;
  }

  updateBestScore(score) {
    if (this.showBestScore() < score) {
      localStorage.setItem("bestScore", score);
    } else return;
  }

  toggleMusicOn() {
    if (this.sound === "off") {
      this.sound = "on";
      this.soundOnButton.style.display = "none";
      this.soundOffButton.style.display = "block";
    } else {
      this.sound = "off";
      this.soundOffButton.style.display = "none";
      this.soundOnButton.style.display = "block";
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
    this.gameOverScreen.style.display = "block";
    this.updateBestScore(score);
    this.finalScoreDisplay.innerText = score;
  }

  createLive() {
    const lives = document.getElementById("lives");
    const life = document.createElement("li");
    lives.appendChild(life);
    const heart = document.createElement("i");
    heart.setAttribute("class", "fas fa-heart");
    life.appendChild(heart);
  }

  restartGame() {
    const score = document.getElementById("score");
    score.innerText = "Score: ";
    this.gameOverScreen.style.display = "none";
    const maximumNumberOfLives = 3;

    for (let i = 0; i < maximumNumberOfLives; i++) {
      this.createLive();
    }
    this.startGame();
  }
}
