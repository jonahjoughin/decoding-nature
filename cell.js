var walkers;
var curves;
var time = Math.random()*100
//p5.disableFriendlyErrors = true;

function setup() {
  createCanvas(800,540);
  frameRate(60);
  noFill();
  colorMode(HSB, 100);
  walkers = new Array(12).fill().map(function(x){ return new Walker()})
  curves = [];
}

function Walker() {
  this.t = time+(Math.random()-0.5)*5;
  this.r = noise(this.t);

  this.step = function() {
    this.t+=0.03;
    this.r = noise(this.t)
  }
}

function draw() {
  clear();
  strokeWeight(1);
  stroke(color(100,0,0))
  fill(100,0,0);
  ellipse(width/2,height/2,540,540)
  noFill();
  strokeWeight(1.5);
  var newCurve = [];
  for (var i=0;i<walkers.length;i++) {
    var angle = i/walkers.length * Math.PI * 2;
    var radius = 30+walkers[i].r*255;
    var x = width/2 + Math.cos(angle)*radius
    var y = height/2 + Math.sin(angle)*radius
    newCurve.push(createVector(x,y));
    walkers[i].step();
  }
  curves.push(newCurve)
  curves = curves.slice(-25);
  for (var i=0;i<curves.length;i++) {
    var currentCurve = curves[i];
    stroke(color(100/curves.length*i,100,100,100-100/curves.length*i))
    for (var j=0;j<currentCurve.length;j++){
      curve(currentCurve[j].x,currentCurve[j].y,
            currentCurve[(j+1)%currentCurve.length].x,currentCurve[(j+1)%currentCurve.length].y,
            currentCurve[(j+2)%currentCurve.length].x,currentCurve[(j+2)%currentCurve.length].y,
            currentCurve[(j+3)%currentCurve.length].x,currentCurve[(j+3)%currentCurve.length].y)
    }
  }
}
