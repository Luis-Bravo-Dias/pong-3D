// set the scene size
var WIDTH = 640;
var HEIGHT = 360;

// modes
var is3D = false;
var multiPlay = true;

// 0 - easiest, 1 - hardest
var difficulty = 0.2;

// Scores
var score1 = 0,
    score2 = 0;

// create a WebGL renderer, camera and a scene
var renderer = new THREE.WebGLRenderer();

// start the renderer
renderer.setSize(WIDTH, HEIGHT);

// attach the render-supplied DOM element (the gameCanvas)
var c = document.getElementById("gameCanvas");
c.appendChild(renderer.domElement);

var camera1 = new THREE.PerspectiveCamera(
    45, // VIEW_ANGLE
    WIDTH / HEIGHT, // ASPECT
    0.1, // NEAR
    10000 // FAR
);

var camera2 = new THREE.PerspectiveCamera(
    45, // VIEW_ANGLE
    WIDTH / HEIGHT, // ASPECT
    0.1, // NEAR
    10000 // FAR
);

var scene = new THREE.Scene();

// set a default position for the cameras
camera1.position.z = 500;
camera2.position.z = 500;

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
    new THREE.BoxGeometry(
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
    new THREE.BoxGeometry(
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

var keyPressed = false;
var multiPressed = false;

function switchMode() {
    if (Key.isDown(Key.SPACE) && !keyPressed) {
        is3D = !is3D;
        keyPressed = true;
    } else if (!Key.isDown(Key.SPACE)) {
        keyPressed = false;
    }

    if (Key.isDown(Key.M) && !multiPressed) {
        multiPlay = !multiPlay;
        multiPressed = true;
    } else if (!Key.isDown(Key.M)) {
        multiPressed = false;
    }
}

function draw() {
    switchMode();
    renderer.setClearColor(0x000000, 1); // Define o fundo preto

    if (is3D && multiPlay) {
        // render for player 1
        renderer.setViewport(0, 0, WIDTH / 2, HEIGHT);
        renderer.render(scene, camera1);

        // render for player 2
        renderer.setViewport(WIDTH / 2, 0, WIDTH / 2, HEIGHT);
        renderer.render(scene, camera2);
    } else {
        renderer.setViewport(0, 0, WIDTH, HEIGHT);
        renderer.render(scene, camera1);
    }

    // loop the draw() function
    requestAnimationFrame(draw);

    ballPhysics();
    paddlePlay1();
    if (multiPlay)
        paddlePlay2();
    else
        botPlay();

    if (is3D) {
        cameraWork3D();
    } else {
        cameraWork2D();
    }

    paddlesColision();
}

function ballPhysics() {
    // BALL BOUNCING
    if (ball.position.y <= -planeHeight / 2) // Top side of table
        ballDirY = -ballDirY;
    if (ball.position.y >= planeHeight / 2) // bottom side of table
        ballDirY = -ballDirY;

    // Player 2 scores
    if (ball.position.x <= -planeWidth / 2) {
        // Player 2 scores a point
        score2++;
        // update scoreboard
        document.getElementById("scores").innerHTML = score1 + "-" + score2;
        // reset ball
        resetBall(1);
        // check if match is over
    }
    // Player 1 scores
    if (ball.position.x >= planeWidth / 2) {
        // Player 1 scores a point
        score1++;
        // update scoreboard
        document.getElementById("scores").innerHTML = score1 + "-" + score2;
        // reset ball
        resetBall(2);
        // check if match is over
    }
    ball.position.x += ballDirX * ballSpeed;
    ball.position.y += ballDirY * ballSpeed;

    // BALL LIMITS
    if (ballDirY > ballSpeed * 2)
        ballDirY = ballSpeed * 2;
    else if (ballDirY < -ballSpeed * 2)
        ballDirY = -ballSpeed * 2;
}

function cameraWork3D() {
    camera1.position.x = paddle1.position.x - 100;
    camera1.position.z = paddle1.position.z + 100;
    camera1.rotation.z = -90 * Math.PI / 180;
    camera1.rotation.y = -60 * Math.PI / 180;

    camera2.position.x = paddle2.position.x + 100;
    camera2.position.z = paddle2.position.z + 100;
    camera2.rotation.z = 90 * Math.PI / 180;
    camera2.rotation.y = 60 * Math.PI / 180;
}

function cameraWork2D() {
    camera1.position.x = 0;
    camera1.position.z = 500;
    camera1.rotation.z = 0;
    camera1.rotation.y = 0;
}

function paddlePlay1() {
    // left
    if (Key.isDown(Key.A)) {
        if (paddle1.position.y < planeHeight * 0.45) // not touching the side of the table
            paddle1DirY = paddleSpeed * 0.5;
        else {
            paddle1DirY = 0;
            paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
        }
    }
    // right
    else if (Key.isDown(Key.D)) {
        if (paddle1.position.y > -planeHeight * 0.45)
            paddle1DirY = -paddleSpeed * 0.5;
        else {
            paddle1DirY = 0;
            paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
        }
    } else
        paddle1DirY = 0;

    paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;
    paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;
    paddle1.position.y += paddle1DirY;
}

function paddlePlay2() {
    // left
    if (Key.isDown(Key.LEFT)) {
        if (paddle2.position.y < planeHeight * 0.45) // not touching the side of the table
            paddle2DirY = paddleSpeed * 0.5;
        else {
            paddle2DirY = 0;
            paddle2.scale.z += (10 - paddle2.scale.z) * 0.2;
        }
    }
    // right
    else if (Key.isDown(Key.RIGHT)) {
        if (paddle2.position.y > -planeHeight * 0.45)
            paddle2DirY = -paddleSpeed * 0.5;
        else {
            paddle2DirY = 0;
            paddle2.scale.z += (10 - paddle2.scale.z) * 0.2;
        }
    } else
        paddle2DirY = 0;

    paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;
    paddle2.scale.z += (1 - paddle2.scale.z) * 0.2;
    paddle2.position.y += paddle2DirY;
}

function botPlay() {
    paddle2DirY = (ball.position.y - paddle2.position.y) * difficulty;
    // speed limit
    if (Math.abs(paddle2DirY) <= paddleSpeed)
        paddle2.position.y += paddle2DirY;
    else {
        if (paddle2DirY > paddleSpeed)
            paddle2.position.y += paddleSpeed;
        else if (paddle2DirY < -paddleSpeed)
            paddle2.position.y -= paddleSpeed;
    }
    // stretch paddle when hits the end of the table
    paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;
}

function resetBall(loser) {
    // ball in center
    ball.position.x = 0;
    ball.position.y = 0;

    // player 1 lost point, ball goes to 2
    if (loser == 1)
        ballDirX = -1;
    else // player 2 lost point, ball goes to 1
        ballDirX = 1;

    ballDirY = 1;
}

function paddlesColision() {
    // verification if the ball collides with the dimensions of paddle1
    if (ball.position.x <= paddle1.position.x + paddleWidth &&
        ball.position.x >= paddle1.position.x) {
        if (ball.position.y <= paddle1.position.y + paddleHeight / 2 &&
            ball.position.y >= paddle1.position.y - paddleHeight / 2) {
            if (ballDirX < 0) {
                // stretch paddle when hits
                paddle1.scale.y = 15;
                // bounce the ball
                ballDirX = -ballDirX;
                // adding angle to the bouncing
                ballDirY -= paddle1DirY * 0.7;
            }
        }
    }
    // verification if the ball collides with the dimensions of paddle2
    if (ball.position.x <= paddle2.position.x + paddleWidth &&
        ball.position.x >= paddle2.position.x) {
        if (ball.position.y <= paddle2.position.y + paddleHeight / 2 &&
            ball.position.y >= paddle2.position.y - paddleHeight / 2) {
            if (ballDirX > 0) {
                // stretch paddle when hits
                paddle2.scale.y = 15;
                // bounce the ball
                ballDirX = -ballDirX;
                // adding angle to the bouncing
                ballDirY -= paddle2DirY * 0.7;
            }
        }
    }
}

setup();
