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

var ballDirX = 1,
ballDirY = 1,
ballSpeed = 2;

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

var paddle1DirY = 0,
paddle2DirY = 0,
paddleSpeed = 3;

function setup() {
    draw();
}

function draw() {
    // draw THREE.JS scene
    renderer.render(scene, camera);

    // loop the draw() function
    requestAnimationFrame(draw);

   ballPhysics();
    paddlePlay1();
    cameraWork();
}

function ballPhysics()
{
    //BALL BOUNCING
    if (ball.position.y <= planeHeight/2) //Top side of table
        ballDirY = -ballDirY;
    if (ball.position.y >= planeHeight/2) //bottom side of table
        ballDirY = -ballDirY;

    ball.position.x += ballDirX * ballSpeed;
    ball.position.y += ballDirY * ballSpeed;

    //BALL LIMITS
    if (ballDirY > ballSpeed * 2)
    ballDirY = ballSpeed * 2;
    else if (ballDirY < -ballSpeed * 2)
    ballDirY = -ballSpeed * 2;
}

function cameraWork()
{
    camera.position.x = paddle1.position.x - 100;
    camera.position.z = paddle1.position.z + 100;
    camera.rotation.z = -90 * Math.PI/180;
    camera.rotation.y = -60 * Math.PI/180;
}

function paddlePlay1()
{
    //left
    if (Key.isDown(Key.A))
    {
        if (paddle1.position.y < planeHeight * 0.45)//not touching the side of the table
            paddle1DirY = paddleSpeed * 0.5;
        else
        {
            paddle1DirY = 0;
            paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
        }
    }
    //right
    else if (Key.isDown(Key.D))
    {
        if(paddle1.position.y > -planeHeight * 0.45)
            paddle1DirY = -paddleSpeed * 0.5;
        else
        {
            paddle1DirY = 0;
            paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
        }
    }
    else
        paddle1DirY = 0;

    paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;
    paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;
    paddle1.position.y += paddle1DirY;
}