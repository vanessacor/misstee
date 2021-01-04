
class Cat {
  constructor (x, y, ctx) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.dy = 1;
    this.width = 40;
    this.height = 30;
    this.color = '#9e7c65';
    this.speed = 1;
    this.image = document.getElementById('cat');
  };

  draw () {
    this.ctx.drawImage(this.image, this.x, this.y);
  }

  setDirection (direction) {
    if (direction === 'up') {
      this.dy = -this.speed;
    } else if (direction === 'down') {
      this.dy = this.speed;
    } else {
      this.stop();
    }
  }

  stop () {
    this.dy = 0;
  }

  update (canvasHeight) {
    this.draw();

    this.y += this.dy;
    if (this.y + this.height > canvasHeight) {
      this.y = canvasHeight - this.height;
    }
    if (this.y < 0) {
      this.y = 0;
    }
  }
}
