'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

p5.disableFriendlyErrors = true;

var Walker = function () {
  function Walker(p, t) {
    _classCallCheck(this, Walker);

    this.p = p;
    this.t = t + Math.random();
    this.r = p.noise(this.t);
  }

  _createClass(Walker, [{
    key: 'step',
    value: function step() {
      this.t += 0.03;
      this.r = this.p.noise(this.t);
    }
  }]);

  return Walker;
}();

var cell = function cell(p) {
  p.disableFriendlyErrors = true;
  var walkers;
  var curves;
  var maxRadius;
  var time = Math.random() * 100;
  var w = p.windowWidth,
      h = p.windowHeight;
  p.setup = function () {
    p.createCanvas(w, h);
    p.frameRate(30);
    p.noFill();
    p.colorMode(p.HSB, 100);
    maxRadius = Math.min(Math.min(w, h) * 0.4, 300);
    walkers = new Array(12).fill().map(function (x) {
      return new Walker(p, time);
    });
    curves = [];
  };
  p.draw = function () {
    p.clear();
    p.stroke(p.color(100, 0, 0));
    p.fill(p.color(100, 0, 0));
    p.ellipse(w / 2, h / 2, maxRadius * 2, maxRadius * 2);
    p.noFill();
    p.strokeWeight(1);
    var newCurve = [];
    for (var i = 0; i < walkers.length; i++) {
      var angle = i / walkers.length * Math.PI * 2;
      var radius = maxRadius * 0.1 + walkers[i].r * (maxRadius * 0.9);
      var x = w / 2 + Math.cos(angle) * radius;
      var y = h / 2 + Math.sin(angle) * radius;
      newCurve.push(p.createVector(x, y));
      walkers[i].step();
    }
    curves.push(newCurve);
    curves = curves.slice(-25);
    for (var i = 0; i < curves.length; i++) {
      var currentCurve = curves[i];
      p.stroke(p.color(100 / curves.length * i, 100, 100, 100 - 100 / curves.length * i));
      for (var j = 0; j < currentCurve.length; j++) {
        p.curve(currentCurve[j].x, currentCurve[j].y, currentCurve[(j + 1) % currentCurve.length].x, currentCurve[(j + 1) % currentCurve.length].y, currentCurve[(j + 2) % currentCurve.length].x, currentCurve[(j + 2) % currentCurve.length].y, currentCurve[(j + 3) % currentCurve.length].x, currentCurve[(j + 3) % currentCurve.length].y);
      }
    }
  };
};

var cell_sketch = new p5(cell, 'cell');