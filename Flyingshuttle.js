
//board
let board;
let boardWidth = 960;
let boardHeight = 600;
let context;

//bird
let birdWidth = 64; 
let birdHeight = 100;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 90; 
let pipeHeight = 602;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -6; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.3;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); 
    birdImg = new Image();
    birdImg.src = "./Flyingshuttle.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 2000);

    // Add a touch event listener to the canvas
    // board.addEventListener("touchstart", () => {
    //     velocityY = -6;

    //     if (gameOver) {
    //         bird.y = birdY;
    //         pipeArray = [];
    //         score = 0;
    //         gameOver = false;
    //     }
    // });
    // document.addEventListener("keydown", moveBird);

    // Allow tap or click anywhere on screen (mobile + desktop)
document.addEventListener("touchstart", handleJump);
document.addEventListener("mousedown", handleJump); // for desktop clicks
document.addEventListener("keydown", moveBird); // still keep for keyboard

function handleJump() {
    velocityY = -6;

    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}


    
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

   
    velocityY += gravity;

    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; 
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); 
    }

    //score
    context.fillStyle = "white";
    context.font="45px fantasy";
    context.fillText(score, 5, 45);


    if (gameOver) {
        context.fillText("GAME OVER {UP ARROW TO RE-START}", 5, 90);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    
    let randomPipeY = pipeY - pipeHeight/3 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/3;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = -6;

      
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}
