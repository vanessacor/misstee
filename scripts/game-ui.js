'use strict';

class GameUI {
  constructor () {
    this.scoredisplay = document.getElementById('score');
    this.livesdisplay = document.getElementById('lives');
  }

  updateScore (score) {
    this.scoredisplay.innerText = 'Score: ' + score;
  }

  removeHeart () {
    if (this.livesdisplay.children.length) {
      this.livesdisplay.children[0].remove();
    }
  }
}
