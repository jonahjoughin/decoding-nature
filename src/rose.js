'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

p5.disableFriendlyErrors = true;

var Rose = function () {
  function Rose(p, w, h) {
    _classCallCheck(this, Rose);

    this.w = w;
    this.h = h;
    this.p = p;
    this.paused = false;
    this.speed = 0.5;
    this.lifespan = 10;
    this._xs = [0.5, 1.5, 2, 2.4, 2.5, 3, 3.5, 4, 5, 6];
    this._sides = [2, 7 / 3, 2.5, 8 / 3, 3, 3, 3, 10 / 3, 11 / 3, 3.5, 4, 5, 4.5, 5, 5, 6];
    this.reset();
  }

  _createClass(Rose, [{
    key: 'getRandomColor',
    value: function getRandomColor() {
      var h = Math.ceil(Math.random() * 256);
      var s = Math.ceil(Math.random() * 128 + 128);
      var b = Math.ceil(Math.random() * 192 + 32);
      return this.p.color(h, s, b);
    }
  }, {
    key: 'getShapeRadius',
    value: function getShapeRadius(a, n, o) {
      return Math.cos(Math.PI / n) / Math.cos(this.mod(a + o, Math.PI * 2 / n) - Math.PI / n);
    }
  }, {
    key: 'step',
    value: function step() {
      if (!this.fade) {
        for (var i = 0; i < this.l; i++) {
          var a = i / this.l * Math.PI * 2 + this.t / this.x + this.a_offset;
          if (!this.direction) a = -a;
          var r = this.getShapeRadius(i / this.l * Math.PI * 2, this.sides, this.offset) * this.maxRadius / 2 * (1 + Math.sin(i / this.l * Math.PI * 2 + this.t));
          this._points[i] = this.polarToCartesian(a, r);
        }
        this.t += this.speed * 0.15;
        this.frames++;
        if (this.frames > this.lifespan * 60) {
          this.startFade();
        }
      } else if (this.fade) {
        this.frames++;
        if (this.frames > 60) this.reset();
      }
    }
  }, {
    key: 'startFade',
    value: function startFade() {
      this.fade = true;
      this.frames = 0;
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.fade) {
        this.p.strokeWeight(0.1);
        this.p.stroke(this.color1);
        this.p.fill(this.color2);
        for (var i = 0; i < this.l; i++) {
          this.p.curve(this._points[this.mod(i - 1, this.l)].x, this._points[this.mod(i - 1, this.l)].y, this._points[i].x, this._points[i].y, this._points[this.mod(i + 1, this.l)].x, this._points[this.mod(i + 1, this.l)].y, this._points[this.mod(i + 2, this.l)].x, this._points[this.mod(i + 2, this.l)].y);
        }
      } else {
        if (this.frames % 2 == 0) this.p.background(255, 0, 255, 50);
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.t = 0;
      this.frames = 0;
      this.l = 500;
      this._points = Array(this.l).fill().map(function (x) {
        return { x: 0, y: 0 };
      });
      this.sides = this._sides[Math.floor(Math.random() * this._sides.length)];
      this.offset = 0;
      this.a_offset = Math.random() * Math.PI * 2;
      this.maxRadius = (Math.random() * 0.3 + 0.7) * Math.min(this.w, this.h) * 0.45;
      this.x = this._xs[Math.floor(Math.random() * this._xs.length)];
      this.color1 = this.getRandomColor();
      this.color2 = this.getRandomColor();
      this.fade = false;
      this.direction = Math.floor(Math.random() * 2);
      this.p.background(255, 0, 255);
    }
  }, {
    key: 'polarToCartesian',
    value: function polarToCartesian(a, r) {
      return { x: Math.cos(a) * r, y: Math.sin(a) * r };
    }
  }, {
    key: 'cartesianToPolar',
    value: function cartesianToPolar(x, y) {
      return { a: x < 0 ? Math.atan(y / x) + Math.PI : Math.atan(y / x), r: Math.sqrt(x * x + y * y) };
    }
  }, {
    key: 'mod',
    value: function mod(n, m) {
      return (n % m + m) % m;
    }
  }]);

  return Rose;
}();

var rose = function rose(p) {
  p.disableFriendlyErrors = true;
  var rose;
  var w = p.windowWidth,
      h = p.windowHeight;
  p.setup = function () {
    p.createCanvas(w, h);
    p.colorMode(p.HSB, 255);
    p.frameRate(60);
    rose = new Rose(p, w, h);
  };
  p.draw = function () {
    p.translate(w / 2, h / 2);
    if (!rose.paused) {
      rose.step();
      rose.render();
    }
  };
  p.keyPressed = function () {
    if (p.keyCode == 32) rose.paused = !rose.paused;else if (p.keyCode == p.LEFT_ARROW) rose.speed = Math.max(0.1, rose.speed - 0.1);else if (p.keyCode == p.RIGHT_ARROW) rose.speed = Math.min(2, rose.speed + 0.1);else if (p.keyCode == p.UP_ARROW) rose.lifespan = rose.lifespan + 1;else if (p.keyCode == p.DOWN_ARROW) rose.lifespan = Math.max(5, rose.lifespan - 1);else rose.reset();
  };
};

var rose_sketch = new p5(rose, 'rose');