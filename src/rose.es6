p5.disableFriendlyErrors = true;

const polarToCartesian = (a,r) => ({ x: Math.cos(a)*r, y: Math.sin(a)*r})
const cartesianToPolar = (x,y) => ({ a: (x < 0) ? Math.atan(y/x)+Math.PI : Math.atan(y/x), r: Math.sqrt(x*x+y*y)})
const mod = (n, m) => (((n % m) + m) % m)

const w = window.innerWidth,
      h = window.innerHeight,
      _xs = [0.5,1.5,2,2.4,2.5,3,3.5,4,5,6],
      _sides = [2,7/3,2.5,8/3,3,3,3,10/3,11/3,3.5,4,5,4.5,5,5,6];
var paused = false;
var speed = 0.5;
var lifespan = 10;
var rose;

class Rose {
  constructor() {
    background(255,0,255);
    this.t = 0;
    this.frames = 0;
    this.l = 500;
    this._points = Array(this.l).fill().map(x => ({x:0,y:0}));
    this.sides = _sides[Math.floor(Math.random()*_sides.length)]
    this.offset = 0;
    this.a_offset = Math.random()*Math.PI*2;
    this.maxRadius = (Math.random()*0.3+0.7)*Math.min(w,h)*0.45;
    this.x = _xs[Math.floor(Math.random()*_xs.length)]
    this.color1 = this.getRandomColor();
    this.color2 = this.getRandomColor();
    this.fade = false;
    this.direction = Math.floor(Math.random()*2);
    console.log(this.x,this.sides);
  }
  getRandomColor() {
    const h = Math.ceil(Math.random()*256);
    const s = Math.ceil(Math.random()*128+128);
    const b = Math.ceil(Math.random()*192+32);
    return color(h,s,b);
  }
  getShapeRadius(a,n,o) {
    return (Math.cos(Math.PI/n))/(Math.cos(mod((a+o),(Math.PI*2/n))-(Math.PI/n)))
  }
  step() {
    if (!this.fade) {
      for (var i=0;i<this.l;i++) {
        var a = i/this.l*Math.PI*2+this.t/this.x+this.a_offset;
        if (!this.direction) a = -a;
        const r = this.getShapeRadius(i/this.l*Math.PI*2,this.sides,this.offset)*this.maxRadius/2*(1+Math.sin(i/this.l*Math.PI*2+this.t))
        this._points[i] = polarToCartesian(a,r);
      }
      this.t+=speed*0.15;
      this.frames++;
      if (this.frames > lifespan*60) {
        this.startFade();
      }
    }
    else if (this.fade) {
      this.frames++;
      if (this.frames > 60) this.constructor();
    }
  }
  startFade() {
    this.fade = true;
    this.frames = 0;
  }
  render() {
    if (!this.fade) {
      strokeWeight(0.1);
      stroke(this.color1);
      fill(this.color2);
      for (var i=0;i<this.l;i++) {
        curve(
          this._points[mod(i-1,this.l)].x,
          this._points[mod(i-1,this.l)].y,
          this._points[i].x,
          this._points[i].y,
          this._points[mod(i+1,this.l)].x,
          this._points[mod(i+1,this.l)].y,
          this._points[mod(i+2,this.l)].x,
          this._points[mod(i+2,this.l)].y,
        )
      }
    }
    else {
      if (this.frames % 2 == 0) background(255,0,255,50);
    }
  }
}

const setup = () => {
  createCanvas(w,h);
  colorMode(HSB,255);
  frameRate(60);
  rose = new Rose();
}
const draw = () => {
  //background(255,0,255);
  translate(w/2,h/2);
  if (!paused) {
    rose.step();
    rose.render();
  }
}
const keyPressed = () => {
  if (keyCode == 32) paused = !paused;
  else if (keyCode == LEFT_ARROW) speed = Math.max(0.1,speed-0.1);
  else if (keyCode == RIGHT_ARROW) speed = Math.min(2,speed+0.1);
  else if (keyCode == UP_ARROW) lifespan = lifespan+1;
  else if (keyCode == DOWN_ARROW) lifespan = Math.max(5,lifespan-1);
  else rose.constructor();
}
