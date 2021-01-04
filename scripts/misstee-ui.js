'use strict';

class MissteeUI {
  constructor () {
    this.splash = document.querySelector('.splash');
    this.gameScreen = document.querySelector('.game');
    this.playButton = document.getElementById('play-button');
    this.gameOver = document.querySelector('.game-over');
    this.finalScoreDisplay = document.getElementById('final-score');
    this.gameWrapper = document.getElementById('canvas-wrapper');
    this.soundOn = document.getElementById('sound');
    this.restartButton = document.getElementById('restart-button');
    this.sound = 'off';
    this.orientationEventListener = null;
    this._bindEventListeners();
  }

  _bindEventListeners () {
    this.soundOn.addEventListener('click', () => this.turnMusicOnAndOff());
    this.playButton.addEventListener('click', () => this.startGame());
    this.restartButton.addEventListener('click', () => this.restartGame());
  }

  turnMusicOnAndOff () {
    if (this.sound === 'off') {
      this.sound = 'on';
      this.soundOn.innerHTML = 'Sound <br>On';
      this.soundOn.classList.add('sound-on');
    } else {
      this.sound = 'off';
      this.soundOn.innerHTML = 'Sound <br>Off';
      this.soundOn.classList.remove('sound-on');
    }
  }

  checkOrientation () {
    clearTimeout(this.resumeGameDelayTimeoutId);
    this.resumeGameDelayTimeoutId = setTimeout(() => {
      const rotatemsg = document.getElementById('rotate-screen');
      if (window.innerWidth < window.innerHeight) {
        rotatemsg.style.display = 'block';
        this.game.pause();
      } else {
        const width = this.gameWrapper.clientWidth;
        const height = this.gameWrapper.clientHeight;
        this.game.updateSize(width, height);
        rotatemsg.style.display = 'none';
        this.game.resume();
      }
    }, 0);
  }

  startGame () {
    this.splash.style.display = 'none';
    this.gameScreen.style.display = 'grid';
    this.game = new Game('paused', this.sound);
    this.game.gameOverCallBack(() => this.showGameOver(this.game.score));
    this.checkOrientation();
    this.game.start();

    this.orientationEventListener = () => {
      this.checkOrientation();
    };

    window.addEventListener('orientationchange', this.orientationEventListener);
    window.addEventListener('resize', this.orientationEventListener);
  }

  showGameOver (score) {
    removeEventListener('orientationchange', this.orientationEventListener);
    this.gameScreen.style.display = 'none';
    this.gameOver.style.display = 'block';
    this.finalScoreDisplay.innerText = 'Your score: ' + score;
  }

  createLive () {
    const lives = document.getElementById('lives');
    const live = document.createElement('li');
    lives.appendChild(live);
    const heart = document.createElement('i');
    heart.setAttribute('class', 'fas fa-heart');
    live.appendChild(heart);
  }

  restartGame () {
    const score = document.getElementById('score');
    score.innerText = 'Score: ';
    this.gameOver.style.display = 'none';

    for (let i = 0; i < 3; i++) {
      this.createLive();
    }
    this.startGame();
  }
}
