'use strict';
class Utils {
  static generateColor (colors) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    return color;
  }

  static randomIntFromRange (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static detectCollission (a, b) {
    const collissionRight = (a.x + a.width) >= b.x;
    const collissionLeft = a.x <= (b.x + b.width);
    const collissionTop = (a.y + a.height) >= b.y;
    const collissionBottom = a.y <= (b.y + b.height);
    return (collissionRight && collissionLeft && collissionTop && collissionBottom);
  }
}
