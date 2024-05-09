//import { PointLight } from "./three.module.min";

//set the scene size
var WIDTH = 640;
HEIGHT = 360;

// create a WebGL renderer, camera and a scene
var renderer = new THREE.WebGLRenderer();

//start the renderer
renderer.setSize(WIDTH, HEIGHT);

//attach the render-supplied DOM element (the gameCanvas)
var c = document.getElementById("gameCanvas");
c.appendChild(renderer.domElement);

camera = new THREE.PerspectiveCamera(
    //VIEW_ANGLE,
    //ASPECT,
   // NEAR,
    //FAR
);

scene = new THREE.Scene();

//add the camera to the scene
scene.add(camera);

//set a default position for the camera
camera.position.z = 320;

//sphere
var radius = 5,
segments = 6,
rings = 6;

var sphereMaterial =
new THREE.MeshLambertMaterial(
    {
        color: 0xD43001
    }
);

var ball = new THREE.Mesh(
    new THREE.SphereGeometry(radius, segments, rings),
    sphereMaterial);

scene.add(ball);

//POINT OF LIGHT
var pointLight = new THREE.PointLight(0xF8D898);

pointLight.position.x = -1000;
pointLight.position.y = 0;
pointLight.position.z = 1000;
pointLight.intensity = 2.9;
pointLight.distance = 10000;

scene.add(pointLight);

//PLANE
var planeMaterial =
new THREE.MeshLambertMaterial(
   { color: 0x4BD121}
);

//ERROR HERE
var plane = new THREE.Mesh(

	  new THREE.PlaneGeometry(
		planeWidth * 0.95,
		planeHeight,
		planeQuality,
		planeQuality),

	  planeMaterial);

scene.add(plane);

function setup()
{
    draw();
}

function draw()
{
    //draw THREE.JS scene
    renderer.render(scene, camera);

    //loop the draw() function
    requestAnimationFrame(draw);

    //process game logic
}