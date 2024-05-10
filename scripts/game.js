//import { PointLight } from "./three.module.min";

// set the scene size
var WIDTH = 640;
var HEIGHT = 360;

// create a WebGL renderer, camera and a scene
var renderer = new THREE.WebGLRenderer();

// start the renderer
renderer.setSize(WIDTH, HEIGHT);

// attach the render-supplied DOM element (the gameCanvas)
var c = document.getElementById("gameCanvas");
c.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(
    45, // VIEW_ANGLE
    WIDTH / HEIGHT, // ASPECT
    0.1, // NEAR
    10000 // FAR
);

var scene = new THREE.Scene();

// set a default position for the camera
camera.position.z = 500;

// sphere
var radius = 5,
    segments = 6,
    rings = 6;

var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xD43001,
    wireframe: false
});

var ball = new THREE.Mesh(
    new THREE.SphereGeometry(radius, segments, rings),
    sphereMaterial
);

scene.add(ball);

// POINT OF LIGHT
var pointLight = new THREE.PointLight(0xF8D898);

pointLight.position.x = -1000;
pointLight.position.y = 0;
pointLight.position.z = 1000;
pointLight.intensity = 2.9;
pointLight.distance = 10000;

scene.add(pointLight);

// PLANE
var planeWidth = 640,
    planeHeight = 360,
    planeQuality = 15;

var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0x4BD121,
    wireframe: true
});

var plane = new THREE.Mesh(
    new THREE.PlaneGeometry(
        planeWidth * 0.95,
        planeHeight,
        planeQuality,
        planeQuality
    ),
    planeMaterial
);

scene.add(plane);

// PADDLES
var paddleWidth = 20,
    paddleHeight = 60,
    paddleDepth = 10,
    paddleQuality = 1;

var paddle1Material = new THREE.MeshLambertMaterial({
    color: 0xD43001,
    wireframe: false
});

var paddle2Material = new THREE.MeshLambertMaterial({
    color: 0x33A0FF,
    wireframe: false
});

var paddle1 = new THREE.Mesh(
    new THREE.CubeGeometry(
        paddleWidth,
        paddleHeight,
        paddleDepth,
        paddleQuality,
        paddleQuality,
        paddleQuality
    ),
    paddle1Material
);

scene.add(paddle1);

var paddle2 = new THREE.Mesh(
    new THREE.CubeGeometry(
        paddleWidth,
        paddleHeight,
        paddleDepth,
        paddleQuality,
        paddleQuality,
        paddleQuality
    ),
    paddle2Material
);

scene.add(paddle2);

// PADDLES POSITION
paddle1.position.x = -planeWidth / 2 + paddleWidth;
paddle2.position.x = planeWidth / 2 - paddleWidth;

paddle1.position.z = paddleDepth / 2;
paddle2.position.z = paddleDepth / 2;

function setup() {
    draw();
}

function draw() {
    // draw THREE.JS scene
    renderer.render(scene, camera);

    // loop the draw() function
    requestAnimationFrame(draw);
    camera.position.x = paddle1.position.x - 100;
    camera.position.z = paddle1.position.z + 100;
    camera.rotation.z = -90 * Math.PI/180;
    camera.rotation.y = -60 * Math.PI/180;

    // process game logic
}