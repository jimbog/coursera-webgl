'use strict';

var gl;
var program;
var points = [];
var numDivisions = 4;

var originalTriangle = [
  vec2(-1, -1),
  vec2(0, 1),
  vec2(1, -1)
];

var resetPoints = function() {
  points = [];
};

var addTriangle = function(bottomLeft, topMiddle, bottomRight) {
  points.push(bottomLeft, topMiddle, bottomRight);
};

var calculateMidPoint = function(vec2PointA, vec2PointB) {
  return mix(vec2PointA, vec2PointB, 0.5);
};

var divideTriangle = function(a, b, c, count) {
  var ab,
    ac,
    bc;

  // check for end of recursion
  if (count === 0) {
      addTriangle(a, b, c);
  } else {
    // bisect
    ab = calculateMidPoint(a, b);
    ac = calculateMidPoint(a, c);
    bc = calculateMidPoint(b, c);

    // generate new triangles
    divideTriangle(a, ab, ac, count-1);
    divideTriangle(c, ac, bc, count-1);
    divideTriangle(b, bc, ab, count-1);

    // TODO fill in middle triangle also
  }
};

var render = function() {
  gl.clear( gl.COLOR_BUFFER_BIT );
  gl.drawArrays( gl.TRIANGLES, 0, points.length );
};

var loadBuffer = function(data) {
  // load data onto gpu
  var bufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(data), gl.STATIC_DRAW );

  // associate shader variables with data buffer
  var vPosition = gl.getAttribLocation( program, 'vPosition' );
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );
};

var calculateRotation = function(vec2Point, theta) {
  var originalX = vec2Point[0];
  var originalY = vec2Point[1];
  var newX = (originalX * Math.cos(theta)) - (originalY * Math.sin(theta));
  var newY = (originalX * Math.sin(theta)) + (originalY * Math.cos(theta));
  return vec2(newX, newY);
};

var doRotate = function(evt) {
  evt.preventDefault();
  var input = document.getElementById('theta');

  if (input.checkValidity()) {
    var theta = input.valueAsNumber;
    var radians = (Math.PI / 180) * theta;

    var rotatedPoints = points.map(function(vertex) {
      return calculateRotation(vertex, radians);
    });

    loadBuffer(rotatedPoints);
    render();
  }
};

var doDivide = function(evt) {
  evt.preventDefault();
  var input = document.getElementById('numDivisions');

  if (input.checkValidity()) {
    var numDivisions = input.valueAsNumber;
    resetPoints();
    divideTriangle(originalTriangle[0], originalTriangle[1], originalTriangle[2], numDivisions);
    loadBuffer(points);
    render();
  }
};

var doReset = function(evt) {
  evt.preventDefault();
  resetPoints();
  divideTriangle(originalTriangle[0], originalTriangle[1], originalTriangle[2], numDivisions);
  loadBuffer(points);
  render();
  document.getElementById('theta').value = 0;
  document.getElementById('numDivisions').value = 4;
};

window.onload = function init() {

  // register event handlers
  document.getElementById('theta').addEventListener('change', doRotate);
  document.getElementById('numDivisions').addEventListener('change', doDivide);
  document.getElementById('reset').addEventListener('click', doReset);

  // init
  var canvas = document.getElementById( 'gl-canvas' );
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( 'WebGL isn\'t available' ); }

  // configure display
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 0, 0, 0, 1.0 );

  // load shaders
  program = initShaders( gl, 'vertex-shader', 'fragment-shader' );
  gl.useProgram( program );

  // Generate tasselated triangle data (modifies global points array)
  divideTriangle(originalTriangle[0], originalTriangle[1], originalTriangle[2], numDivisions);

  // load the data into the GPU
  var bufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

  // associate shader variables with data buffer
  var vPosition = gl.getAttribLocation( program, 'vPosition' );
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  render();
};
