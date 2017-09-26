"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var walkers;
var curves;
var time = Math.random() * 100;
p5.disableFriendlyErrors = true;

var Walker = function () {
  function Walker() {
    _classCallCheck(this, Walker);

    this.t = time + Math.random();
    this.r = noise(this.t);
  }

  _createClass(Walker, [{
    key: "step",
    value: function step() {
      this.t += 0.03;
      this.r = noise(this.t);
    }
  }]);

  return Walker;
}();

var setup = function setup() {
  createCanvas(800, 540);
  frameRate(30);
  noFill();
  colorMode(HSB, 100);
  walkers = new Array(12).fill().map(function (x) {
    return new Walker();
  });
  curves = [];
};

var draw = function draw() {
  clear();
  strokeWeight(0.5);
  stroke(color(100, 0, 0));
  fill(100, 0, 0);
  ellipse(width / 2, height / 2, 540, 540);
  noFill();
  strokeWeight(1.5);
  var newCurve = [];
  for (var i = 0; i < walkers.length; i++) {
    var angle = i / walkers.length * Math.PI * 2;
    var radius = 30 + walkers[i].r * 255;
    var x = width / 2 + Math.cos(angle) * radius;
    var y = height / 2 + Math.sin(angle) * radius;
    newCurve.push(createVector(x, y));
    walkers[i].step();
  }
  curves.push(newCurve);
  curves = curves.slice(-25);
  for (var i = 0; i < curves.length; i++) {
    var currentCurve = curves[i];
    stroke(color(100 / curves.length * i, 100, 100, 100 - 100 / curves.length * i));
    for (var j = 0; j < currentCurve.length; j++) {
      curve(currentCurve[j].x, currentCurve[j].y, currentCurve[(j + 1) % currentCurve.length].x, currentCurve[(j + 1) % currentCurve.length].y, currentCurve[(j + 2) % currentCurve.length].x, currentCurve[(j + 2) % currentCurve.length].y, currentCurve[(j + 3) % currentCurve.length].x, currentCurve[(j + 3) % currentCurve.length].y);
    }
  }
};