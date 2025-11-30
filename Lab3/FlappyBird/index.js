var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var bird = new Image();
var background = new Image();
var foreground = new Image();
var pipeUp = new Image();
var pipeDown = new Image();

var birdUp = new Image();
var birdMid = new Image();
var birdDown = new Image();

const digitImages = [];
for (let i = 0; i <= 9; i++) {
    const img = new Image();
    img.src = `assets/UI/Numbers/${i}.png`;
    digitImages.push(img);
}

birdUp.src = "assets/Flappy Bird/yellowbird-upflap.png";
birdMid.src = "assets/Flappy Bird/yellowbird-midflap.png";
birdDown.src = "assets/Flappy Bird/yellowbird-downflap.png";

var birdState = birdMid; // początkowy stan ptaka

bird.src = "assets/Flappy Bird/yellowbird-midflap.png";
background.src = "assets/Flappy Bird/background-day.png";
foreground.src = "assets/Flappy Bird/base.png";
pipeUp.src = "assets/Flappy Bird/pipe-green-up.png";
pipeDown.src = "assets/Flappy Bird/pipe-green-down.png";

var gap = 90;
var birdX = 10;
var birdY = 150;
var constant;
var velocity = 0;
var gravity = 0.15;
var lift = -3;
var maxVelocity = 5;

var score = 0;

var fly_sound = new Audio("assets/Sound Efects/wing.wav");
var score_sound = new Audio("assets/Sound Efects/point.wav");

document.addEventListener("keydown", moveUp);


function startMenu(){

}

function moveUp() {
    velocity = lift;
    fly_sound.play();
}

var pipe = [];
pipe[0] = {
    x: canvas.width,
    y: -100
};

// Funkcja główna
function draw() {
    context.drawImage(background, 0, 0);
    if (velocity < -1) {
    birdState = birdUp;      // lecimy w górę
    } else if (velocity > 1) {
        birdState = birdDown;    // lecimy w dół
    } else {
        birdState = birdMid;     // lecimy prosto
    }

    for (var i = 0; i < pipe.length; i++) {
        constant = pipeUp.height + gap;

        // rury
        context.drawImage(pipeDown, pipe[i].x, pipe[i].y);
        context.drawImage(pipeUp, pipe[i].x, pipe[i].y + constant);

        pipe[i].x--;

        // dodanie nowej rury
        if (pipe[i].x === 100) {
            pipe.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeDown.height) - pipeDown.height
            });
        }

        // hitboxy
        var pipeLeft = pipe[i].x;
        var pipeRight = pipe[i].x + pipeDown.width;
        var birdRight = birdX + bird.width;
        var birdBottom = birdY + bird.height;

        // kolizja
        if (
            (birdRight >= pipeLeft && birdX <= pipeRight &&
             (birdY <= pipe[i].y + pipeDown.height ||
              birdBottom >= pipe[i].y + constant)) ||
            birdBottom >= canvas.height - foreground.height ||
            birdY <= 0
        ) {
            location.reload();
        }

        // punktacja
        if (!pipe[i].scored && birdX > pipeRight) {
            score++;
            score_sound.play();
            pipe[i].scored = true;
        }
    }

    context.drawImage(foreground, 0, canvas.height - foreground.height);
    var angle = velocity * 0.15;

    context.save();
    context.translate(birdX + birdState.width/2, birdY + birdState.height/2);
    context.rotate(angle);
    context.drawImage(
        birdState,
        -birdState.width/2,
        -birdState.height/2
    );
    context.restore();

    // fizyka ptaka
    velocity += gravity;
    if (velocity > maxVelocity) velocity = maxVelocity;
    birdY += velocity;

    context.fillStyle = "#000";
    context.font = "20px Verdana";
    drawScore(score, 10, 10); // np. lewy górny róg canvasu

    requestAnimationFrame(draw);
}

function drawScore(number, x, y) {
    const digits = number.toString().split(""); // np. 123 -> ["1","2","3"]
    let offsetX = x;

    digits.forEach(digit => {
        const img = digitImages[parseInt(digit)];
        context.drawImage(img, offsetX, y);
        offsetX += img.width + 2; // przesunięcie o szerokość cyfry + odstęp
    });
}


var assetsLoaded = 0;
[bird, background, foreground, pipeDown, pipeUp].forEach(img => {
    img.onload = () => {
        assetsLoaded++;
        if (assetsLoaded === 5) draw();
    };
});
