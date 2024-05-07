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