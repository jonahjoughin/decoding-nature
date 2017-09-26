"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var w = window.innerWidth,
    h = window.innerHeight,
    maxRadius = Math.sqrt(w * w + h * h) / 2,
    eyeRadius = 40,
    reversed = false;
var speed = 1,
    multiplier = 1,
    speed_off = 0,
    t = 0,
    _mouseX = 0,
    _mouseY = 0,
    mode = 0,
    seed = Math.random();
var particles;
var getMouseVector;
p5.disableFriendlyErrors = true;

var setup = function setup() {
  createCanvas(w, h);
  frameRate(30);
  translate(w / 2, h / 2);
  noStroke();
  fill(color(255));
  rect(-w / 2, -h / 2, w, h);
  fill(color(0, 20, 65, 20));
  for (var i = 0; i < 100; i++) {
    rect(-w / 2, -h / 2, w, h);
  }particles = new Array(3600).fill().map(function (x) {
    return new Particle();
  });
};
var draw = function draw() {
  _mouseX = mouseX - w / 2, _mouseY = mouseY - h / 2;
  getMouseVector = getMouseVectors[mode];
  speed_off = noise(seed) * 4 - 2;
  speed = Math.min(4, t) + 3 + speed_off;
  speed *= multiplier;
  seed += 0.015;
  t += 0.015;
  translate(w / 2, h / 2);
  fill(color(0, 20, 65, 20));
  rect(-w / 2, -h / 2, w, h);
  stroke(color(255, 255, 255, 50));
  for (var i = 0, length = particles.length; i < length; i++) {
    particles[i].step();
    particles[i].render();
  }
  noStroke();
};
var keyPressed = function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    mode = Math.min(getMouseVectors.length - 1, mode + 1);
    for (var i = 0, length = particles.length; i < length; i++) {
      particles[i].reset();
    }
  } else if (keyCode == LEFT_ARROW) {
    mode = Math.max(0, mode - 1);
    for (var i = 0, length = particles.length; i < length; i++) {
      particles[i].reset();
    }
  } else if (keyCode == UP_ARROW) {
    multiplier = Math.min(3, multiplier + 0.1);
  } else if (keyCode == DOWN_ARROW) {
    multiplier = Math.max(0.3, multiplier - 0.1);
  }
  return false;
};

var Particle = function () {
  function Particle() {
    _classCallCheck(this, Particle);

    this.lastPosition = getInitialPosition();
    this.position = createVector(this.lastPosition.x, this.lastPosition.y);
    this.velocity = createVector(0, 0);
    this.radius = getRadius(this.position.x, this.position.y);
  }

  _createClass(Particle, [{
    key: "step",
    value: function step() {
      this.velocity = getPrimaryVector(this.position.x, this.position.y);
      if (mode !== 0) this.velocity.add(getMouseVector(this.position.x, this.position.y));
      this.lastPosition = createVector(this.position.x, this.position.y);
      this.position.add(this.velocity);
      var newRadius = getRadius(this.position.x, this.position.y);
      if (Math.abs(this.radius - newRadius) < 0.02 || newRadius < eyeRadius * (0.5 + multiplier / 2) || newRadius > maxRadius) this.reset();else this.radius = newRadius;
    }
  }, {
    key: "render",
    value: function render() {
      line(this.lastPosition.x, this.lastPosition.y, this.position.x, this.position.y);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.lastPosition = getInitialPosition();
      this.position = createVector(this.lastPosition.x, this.lastPosition.y);
      this.velocity.mult(0);
      this.radius = getRadius(this.position.x, this.position.y);
    }
  }]);

  return Particle;
}();

var getInitialPosition = function getInitialPosition() {
  var a = Math.random() * 2 * Math.PI;
  var r = Math.random() * (maxRadius - 3 * eyeRadius) + 3 * eyeRadius;
  var c = polarToCartesian(a, r);
  return createVector(c.x, c.y, 0);
};

var getPrimaryVector = function getPrimaryVector(x, y) {
  var polar = cartesianToPolar(x, y);
  var a = polar.a;
  var r = polar.r;
  if (r < eyeRadius) return createVector(0, 0);
  var a_offset = Math.max((r - eyeRadius) / (maxRadius - eyeRadius), 0) * Math.PI / 3 + Math.PI / 18;
  var vector_a = a + Math.PI / 2 + a_offset;
  if (reversed) vector_a -= Math.PI;
  var vector_r = (0.25 + (maxRadius - r) / (maxRadius - eyeRadius) * .75) * speed;
  var cartVector = polarToCartesian(vector_a, vector_r);
  return createVector(cartVector.x, cartVector.y);
};
var getMouseVectors = [null, function (x, y) {
  var polar = cartesianToPolar(x - _mouseX, y - _mouseY);
  var a = polar.a;
  var r = polar.r * polar.r / maxRadius;
  var a_offset = Math.max((r - eyeRadius) / (maxRadius - eyeRadius), 0) * Math.PI / 3 + Math.PI / 18;
  var vector_a = a + Math.PI / 2 + a_offset;
  if (reversed) vector_a -= Math.PI;
  var vector_r = (0.25 + (maxRadius - r) / (maxRadius - eyeRadius) * .75) * speed / 1.5;
  var cartVector = polarToCartesian(vector_a, vector_r);
  return createVector(cartVector.x, cartVector.y);
}, function (x, y) {
  var polar = cartesianToPolar(x - _mouseX, y - _mouseY);
  var a = -polar.a;
  var r = polar.r * polar.r / maxRadius;
  var a_offset = Math.max((r - eyeRadius) / (maxRadius - eyeRadius), 0) * Math.PI / 3 + Math.PI / 18;
  var vector_a = a + Math.PI / 2 + a_offset;
  if (reversed) vector_a -= Math.PI;
  var vector_r = (0.25 + (maxRadius - r) / (maxRadius - eyeRadius) * .75) * speed / 1.5;
  var cartVector = polarToCartesian(vector_a, vector_r);
  return createVector(cartVector.x, cartVector.y);
}, function (x, y) {
  var polar = cartesianToPolar(x - _mouseX, y - _mouseY);
  var a = polar.a;
  var r = polar.r * polar.r;
  var a_offset = Math.max((r - eyeRadius) / (maxRadius - eyeRadius), 0) * Math.PI / 3 + Math.PI / 18;
  var vector_a = a + Math.PI / 2 + a_offset;
  if (reversed) vector_a -= Math.PI;
  var vector_r = (0.25 + (maxRadius - r) / (maxRadius - eyeRadius) * .75) * speed / 50;
  var cartVector = polarToCartesian(vector_a, vector_r);
  return createVector(cartVector.x, cartVector.y);
}, function (x, y) {
  var polar = cartesianToPolar(x - _mouseX, y - _mouseY);
  var a = polar.a;
  var r = polar.r * polar.r;
  var a_offset = Math.max((r - eyeRadius) / (maxRadius - eyeRadius), 0) * Math.PI / 3 + Math.PI / 18;
  var vector_a = a + Math.PI / 2 + a_offset;
  if (reversed) vector_a -= Math.PI;
  var vector_r = (0.25 + (maxRadius - r) / (maxRadius - eyeRadius) * .75) * speed / 200;
  var cartVector = polarToCartesian(vector_a, vector_r);
  return createVector(cartVector.x, cartVector.y);
}, function (x, y) {
  var polar = cartesianToPolar(x - _mouseX, y - _mouseY);
  var a = polar.a;
  var r = Math.sqrt(polar.r) * maxRadius * 0.6;
  var a_offset = Math.max((r - eyeRadius) / (maxRadius - eyeRadius), 0) * Math.PI / 3 + Math.PI / 18;
  var vector_a = a + Math.PI / 2 + a_offset;
  if (reversed) vector_a -= Math.PI;
  var vector_r = (0.25 + (maxRadius - r) / (maxRadius - eyeRadius) * .75) * speed / 2;
  var cartVector = polarToCartesian(vector_a, vector_r);
  return createVector(cartVector.x, cartVector.y);
}];

var polarToCartesian = function polarToCartesian(a, r) {
  return { x: Math.cos(a) * r, y: Math.sin(a) * r };
};
var cartesianToPolar = function cartesianToPolar(x, y) {
  return { a: x < 0 ? Math.atan(y / x) + Math.PI : Math.atan(y / x), r: Math.sqrt(x * x + y * y) };
};
var getRadius = function getRadius(x, y) {
  return Math.sqrt(x * x + y * y);
};