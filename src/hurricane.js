'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

p5.disableFriendlyErrors = true;

var ParticleSystem = function () {
  function ParticleSystem(p, w, h) {
    var _this = this;

    _classCallCheck(this, ParticleSystem);

    this.p = p;
    this.mouseX = p.mouseX;
    this.mouseY = p.mouseY;
    this.outerRadius = Math.sqrt(w * w + h * h) / 2;
    this.innerRadius = 40;
    this.speed = 1;
    this.multiplier = 1;
    this.speed_off = 0;
    this.t = 0;
    this.mode = 0, this.seed = Math.random();
    this.particles = new Array(3600).fill().map(function (x) {
      return new Particle(p, _this);
    });
    this.getMouseVectors = [function (x, y) {
      return p.createVector(0, 0);
    }, function (x, y) {
      var polar = _this.cartesianToPolar(x - _this.mouseX, y - _this.mouseY);
      var a = polar.a;
      var r = polar.r * polar.r / _this.outerRadius;
      var a_offset = Math.max((r - _this.innerRadius) / (_this.outerRadius - _this.innerRadius), 0) * Math.PI / 3 + Math.PI / 18;
      var vector_a = a + Math.PI / 2 + a_offset;
      var vector_r = (0.25 + (_this.outerRadius - r) / (_this.outerRadius - _this.innerRadius) * .75) * _this.speed / 1.5;
      var cartVector = _this.polarToCartesian(vector_a, vector_r);
      return p.createVector(cartVector.x, cartVector.y);
    }, function (x, y) {
      var polar = _this.cartesianToPolar(x - _this.mouseX, y - _this.mouseY);
      var a = -polar.a;
      var r = polar.r * polar.r / _this.outerRadius;
      var a_offset = Math.max((r - _this.innerRadius) / (_this.outerRadius - _this.innerRadius), 0) * Math.PI / 3 + Math.PI / 18;
      var vector_a = a + Math.PI / 2 + a_offset;
      var vector_r = (0.25 + (_this.outerRadius - r) / (_this.outerRadius - _this.innerRadius) * .75) * _this.speed / 1.5;
      var cartVector = _this.polarToCartesian(vector_a, vector_r);
      return p.createVector(cartVector.x, cartVector.y);
    }, function (x, y) {
      var polar = _this.cartesianToPolar(x - _this.mouseX, y - _this.mouseY);
      var a = polar.a;
      var r = polar.r * polar.r;
      var a_offset = Math.max((r - _this.innerRadius) / (_this.outerRadius - _this.innerRadius), 0) * Math.PI / 3 + Math.PI / 18;
      var vector_a = a + Math.PI / 2 + a_offset;
      var vector_r = (0.25 + (_this.outerRadius - r) / (_this.outerRadius - _this.innerRadius) * .75) * _this.speed / 50;
      var cartVector = _this.polarToCartesian(vector_a, vector_r);
      return p.createVector(cartVector.x, cartVector.y);
    }, function (x, y) {
      var polar = _this.cartesianToPolar(x - _this.mouseX, y - _this.mouseY);
      var a = polar.a;
      var r = polar.r * polar.r;
      var a_offset = Math.max((r - _this.innerRadius) / (_this.outerRadius - _this.innerRadius), 0) * Math.PI / 3 + Math.PI / 18;
      var vector_a = a + Math.PI / 2 + a_offset;
      var vector_r = (0.25 + (_this.outerRadius - r) / (_this.outerRadius - _this.innerRadius) * .75) * _this.speed / 200;
      var cartVector = _this.polarToCartesian(vector_a, vector_r);
      return p.createVector(cartVector.x, cartVector.y);
    }, function (x, y) {
      var polar = _this.cartesianToPolar(x - _this.mouseX, y - _this.mouseY);
      var a = polar.a;
      var r = Math.sqrt(polar.r) * _this.outerRadius * 0.6;
      var a_offset = Math.max((r - _this.innerRadius) / (_this.outerRadius - _this.innerRadius), 0) * Math.PI / 3 + Math.PI / 18;
      var vector_a = a + Math.PI / 2 + a_offset;
      var vector_r = (0.25 + (_this.outerRadius - r) / (_this.outerRadius - _this.innerRadius) * .75) * _this.speed / 2;
      var cartVector = _this.polarToCartesian(vector_a, vector_r);
      return p.createVector(cartVector.x, cartVector.y);
    }];
    this.getMouseVector = this.getMouseVectors[0];
  }

  _createClass(ParticleSystem, [{
    key: 'next',
    value: function next() {
      this.mouseX = this.p.mouseX;
      this.mouseY = this.p.mouseY;
      this.speed_off = this.p.noise(this.seed) * 4 - 2;
      this.speed = Math.min(4, this.t) + 3 + this.speed_off;
      this.speed *= this.multiplier;
      this.seed += 0.015;
      this.t += 0.015;
      for (var i = 0, l = this.particles.length; i < l; i++) {
        this.particles[i].next();
      }
    }
  }, {
    key: 'setMode',
    value: function setMode(mode) {
      this.mode = mode;
      this.getMouseVector = this.getMouseVectors[this.mode];
      for (var i = 0, l = this.particles.length; i < l; i++) {
        this.particles[i].reset();
      }
    }
  }, {
    key: 'getRadius',
    value: function getRadius(x, y) {
      return Math.sqrt(x * x + y * y);
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
  }]);

  return ParticleSystem;
}();

var Particle = function () {
  function Particle(p, ps) {
    _classCallCheck(this, Particle);

    this.p = p;
    this.ps = ps;
    this.lastPosition = this.getNewPosition();
    this.position = p.createVector(this.lastPosition.x, this.lastPosition.y);
    this.velocity = p.createVector(0, 0);
    this.radius = this.ps.getRadius(this.position.x, this.position.y);
  }

  _createClass(Particle, [{
    key: 'next',
    value: function next() {
      this.step();
      this.render();
    }
  }, {
    key: 'step',
    value: function step() {
      this.velocity = this.getPrimaryVector(this.position.x, this.position.y);
      if (this.mode !== 0) this.velocity.add(this.ps.getMouseVector(this.position.x, this.position.y));
      this.lastPosition = this.p.createVector(this.position.x, this.position.y);
      this.position.add(this.velocity);
      var newRadius = this.ps.getRadius(this.position.x, this.position.y);
      if (Math.abs(this.radius - newRadius) < 0.02 || newRadius < this.ps.innerRadius * (0.5 + this.ps.multiplier / 2) || newRadius > this.ps.outerRadius) this.reset();else this.radius = newRadius;
    }
  }, {
    key: 'render',
    value: function render() {
      this.p.line(this.lastPosition.x, this.lastPosition.y, this.position.x, this.position.y);
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.lastPosition = this.getNewPosition();
      this.position = this.p.createVector(this.lastPosition.x, this.lastPosition.y);
      this.velocity.mult(0);
      this.radius = this.ps.getRadius(this.position.x, this.position.y);
    }
  }, {
    key: 'getNewPosition',
    value: function getNewPosition() {
      var a = Math.random() * 2 * Math.PI;
      var r = Math.random() * (this.ps.outerRadius - 3 * this.ps.innerRadius) + 3 * this.ps.innerRadius;
      var c = this.ps.polarToCartesian(a, r);
      return this.p.createVector(c.x, c.y, 0);
    }
  }, {
    key: 'getPrimaryVector',
    value: function getPrimaryVector(x, y) {
      var polar = this.ps.cartesianToPolar(x, y);
      var a = polar.a;
      var r = polar.r;
      if (r < this.ps.innerRadius) return this.p.createVector(0, 0);
      var a_offset = Math.max((r - this.ps.innerRadius) / (this.ps.outerRadius - this.ps.innerRadius), 0) * Math.PI / 3 + Math.PI / 18;
      var vector_a = a + Math.PI / 2 + a_offset;
      var vector_r = (0.25 + (this.ps.outerRadius - r) / (this.ps.outerRadius - this.ps.innerRadius) * .75) * this.ps.speed;
      var cartVector = this.ps.polarToCartesian(vector_a, vector_r);
      return this.p.createVector(cartVector.x, cartVector.y);
    }
  }]);

  return Particle;
}();

var hurricane = function hurricane(p) {
  p.disableFriendlyErrors = true;
  var ps;
  var backgroundColor;
  var w = p.windowWidth,
      h = p.windowHeight;

  p.setup = function () {
    backgroundColor = p.color(0, 20, 65, 20);
    p.createCanvas(w, h);
    p.frameRate(30);
    p.translate(w / 2, h / 2);
    p.noStroke();
    p.fill(p.color(255));
    p.rect(-w / 2, -h / 2, w, h);
    p.fill(backgroundColor);
    for (var i = 0; i < 100; i++) {
      p.rect(-w / 2, -h / 2, w, h);
    }ps = new ParticleSystem(p, w, h);
  };

  p.draw = function () {
    p.noStroke();
    p.fill(backgroundColor);
    p.translate(w / 2, h / 2);

    p.rect(-w / 2, -h / 2, w, h);
    p.stroke(p.color(255, 255, 255, 50));
    ps.next();
  };
  p.keyPressed = function () {
    console.log(p.keyCode);
    if (p.keyCode == p.RIGHT_ARROW) ps.setMode(Math.min(ps.getMouseVectors.length - 1, ps.mode + 1));else if (p.keyCode == p.LEFT_ARROW) ps.setMode(Math.max(0, ps.mode - 1));else if (p.keyCode == p.UP_ARROW) ps.multiplier = Math.min(3, ps.multiplier + 0.1);else if (p.keyCode == p.DOWN_ARROW) ps.multiplier = Math.max(0.3, ps.multiplier - 0.1);
    return false;
  };

  var polarToCartesian = function polarToCartesian(a, r) {
    return { x: Math.cos(a) * r, y: Math.sin(a) * r };
  };
  var cartesianToPolar = function cartesianToPolar(x, y) {
    return { a: x < 0 ? Math.atan(y / x) + Math.PI : Math.atan(y / x), r: Math.sqrt(x * x + y * y) };
  };
};

var hurricane_sketch = new p5(hurricane, 'hurricane');