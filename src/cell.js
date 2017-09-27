'use strict';

// class Walker  {
//   constructor(time) {
//     this.t = time+Math.random();
//     this.r = noise(this.t);
//   }
//   step() {
//     this.t+=0.03;
//     this.r = noise(this.t)
//   }
// }

var sketch = function sketch(p) {
  //p.disableFriendlyErrors = true;
  var walkers;
  var curves;
  var maxRadius;
  var time = Math.random() * 100;
  var w = p.windowWidth,
      h = p.windowHeight;
  function Walker() {
    this.t = time + Math.random();
    this.r = p.noise(this.t);
  }
  Walker.prototype.step = function () {
    this.t += 0.03;
    this.r = p.noise(this.t);
  };
  p.setup = function () {
    p.createCanvas(w, h);
    p.frameRate(30);
    p.noFill();
    p.colorMode(p.HSB, 100);
    maxRadius = Math.min(Math.min(w, h) * 0.4, 300);
    walkers = new Array(12).fill().map(function (x) {
      return new Walker();
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

var myp5 = new p5(sketch, 'cell');