"use strict";

class Food {
  constructor(ctx, x, y, dx) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.active = true;
    this.width = 10;
    this.height = 10;
    this.color = "pink";
    this.image = document.getElementById("food");
  }

  deactivate() {
    this.active = false;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y);
  }

  update() {
    this.draw();
    this.x += -this.dx;
  }
}
