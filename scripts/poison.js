'use strict';

class Poison {
  constructor (ctx, x, y, dx) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.active = true;
    this.height = 10;
    this.width = 10;
    this.colors = ['red', 'brown', 'green'];
    this.color = 'black';
    this.image = document.getElementById('poison');
  }

  deactivate () {
    this.active = false;
  }

  draw () {
    this.ctx.drawImage(this.image, this.x, this.y);
  }

  update () {
    this.draw();
    this.x += -this.dx;
  }
}
