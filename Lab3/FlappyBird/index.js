var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var isFalling = false;
var gameState = "start";   // start | playing | die

var birdUp = new Image();
var birdMid = new Image();
var birdDown = new Image();
var background = new Image();
var foreground = new Image();
var pipeUp = new Image();
var pipeDown = new Image();

var startMessage = new Image();
var dieMessage = new Image();

birdUp.src = "assets/Flappy Bird/yellowbird-upflap.png";
birdMid.src = "assets/Flappy Bird/yellowbird-midflap.png";
birdDown.src = "assets/Flappy Bird/yellowbird-downflap.png";

background.src = "assets/Flappy Bird/background-day.png";
foreground.src = "assets/Flappy Bird/base.png";
pipeUp.src = "assets/Flappy Bird/pipe-green-up.png";
pipeDown.src = "assets/Flappy Bird/pipe-green-down.png";

startMessage.src = "assets/UI/message.png"; 
dieMessage.src = "assets/UI/gameover.png";

var birdState = birdMid;

const digitImages = [];
for (let i = 0; i <= 9; i++) {
    const img = new Image();
    img.src = `assets/UI/Numbers/${i}.png`;
    digitImages.push(img);
}

var gap = 90;
var birdX = 10;
var birdY = 150;
var velocity = 0;
var gravity = 0.15;
var lift = -3;
var maxVelocity = 5;

var score = 0;
var pipe = [];

var fly_sound = new Audio("assets/Sound Efects/wing.wav");
var score_sound = new Audio("assets/Sound Efects/point.wav");
var die_sound = new Audio("assets/Sound Efects/die.wav")

document.addEventListener("keydown", keyHandler);

function keyHandler(e) {
    if (e.code === "Space") {

        if (gameState === "start" || gameState === "die") {
            startGame();
        }

        else if (gameState === "playing") {
            moveUp();
        }
    }
}

function startGame() {
    gameState = "playing";

    pipe = [{ 
        x: canvas.width, 
        y: -100 }];
    score = 0;
    birdY = 150;
    velocity = 0;
}

function moveUp() {
    velocity = lift;
    fly_sound.play();
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(background, 0, 0);

    if (gameState === "start") {
        drawStartScreen();
        requestAnimationFrame(draw);
        return;
    }

    if (gameState === "die") {
        drawDieScreen();
        requestAnimationFrame(draw);
        return;
    }

    // state: playing
    birdState =
        velocity < -1 ? birdUp :
        velocity > 1 ? birdDown : birdMid;

    // wstawianie rur
    for (let i = 0; i < pipe.length; i++) {
        let constant = pipeUp.height + gap;

        context.drawImage(pipeDown, pipe[i].x, pipe[i].y);
        context.drawImage(pipeUp, pipe[i].x, pipe[i].y + constant);

        pipe[i].x--;

        if (pipe[i].x === 100) {
            pipe.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeDown.height) - pipeDown.height
            });
        }

        let pipeLeft = pipe[i].x;
        let pipeRight = pipe[i].x + pipeDown.width;
        let birdRight = birdX + birdMid.width;
        let birdBottom = birdY + birdMid.height;

        // kolizja
        if (
            (birdRight >= pipeLeft && birdX <= pipeRight &&
            (birdY <= pipe[i].y + pipeDown.height ||
            birdBottom >= pipe[i].y + constant)) ||
            birdBottom >= canvas.height - foreground.height ||
            birdY <= 0
        ) {
            die_sound.play();
            gameState = "die";
            saveScore();
        }

        // punktacja
        if (!pipe[i].scored && birdX > pipeRight) {
            score++;
            score_sound.play();
            pipe[i].scored = true;
        }
    }

    // ziemia
    context.drawImage(foreground, 0, canvas.height - foreground.height);

    // animacja ptaka
    let angle = velocity * 0.15;
    context.save();
    context.translate(birdX + birdState.width/2, birdY + birdState.height/2);
    context.rotate(angle);
    context.drawImage(birdState, -birdState.width/2, -birdState.height/2);
    context.restore();

    // fizyka ptaka
    velocity += gravity;
    if (velocity > maxVelocity) velocity = maxVelocity;
    birdY += velocity;

    drawScore(score, 10, 10);

    requestAnimationFrame(draw);
}

function drawStartScreen() {
    context.drawImage(startMessage, canvas.width/2-92, canvas.height/2-150);
}

function drawDieScreen() {
    context.drawImage(dieMessage, canvas.width/2-92, canvas.height/2 - 200);
    drawScore(score, 140, 130);

    let scores = JSON.parse(localStorage.getItem("scores") || "[]");

    context.fillStyle = "rgba(255, 196, 0, 1)";
    context.font = "30px flappyFont";
    context.fillText("Best scores:", canvas.width / 2 - 100, canvas.height / 2 - 50);

    for (let i = 0; i < scores.length; i++) {
        drawScore(i + 1, canvas.width/2 - 25, canvas.height/2 + (i-1)*40 +3);
        context.fillStyle = "rgba(0, 0, 0, 1)";
        context.font = "60px flappyFont";
        context.fillText(".", canvas.width/2, canvas.height/2 + i*40 - 3);
        drawScore(
            scores[scores.length - 1 - i],
            canvas.width/2 + 20,
            canvas.height/2 - i*40 + 125
        );
    }

    context.fillStyle = "rgba(255, 196, 0, 1)";
    context.font = "30px FlappyFont";
    context.fillText("Press SPACE to try again", canvas.width/2-125, canvas.height/2 + 210);
}

function saveScore() {
    let scores = JSON.parse(localStorage.getItem("scores") || "[]");
    scores.push(score);
    scores.sort((a, b) => b - a);
    scores = scores.slice(0, 5);
    localStorage.setItem("scores", JSON.stringify(scores));
}

function drawScore(number, x, y) {
    const digits = number.toString().split("");
    let offsetX = x;

    digits.forEach(digit => {
        const img = digitImages[digit];
        context.drawImage(img, offsetX, y);
        offsetX += img.width + 2;
    });
}

var assetsLoaded = 0;
[birdUp, birdMid, birdDown, background, foreground, pipeDown, pipeUp].forEach(img => {
    img.onload = () => {
        assetsLoaded++;
        if (assetsLoaded === 7) draw();
    };
});
