// board
let board;
let boardwidth = 600;
let boardheight = 640;
let context;

// bird
let birdwidth = 40;
let birdheight = 30;
let birdx = boardwidth/8;
let birdy = boardheight/2;
let birdimgs = [];
let birdimgsindex = 0;
let bird = {
    x : birdx,
    y : birdy,
    width : birdwidth,
    height : birdheight
}

//pipe
let pipeArray = [];
let pipewidth = 64;
let pipeheight = 512;
let pipex = boardwidth;
let pipey = 0;
let toppipe;
let bottompipe;

let velocityx = -2;
let velocityy = 0;
let gravity = 0.4;

let gameover = false;

let score = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d"); //function for canvas element 

    // load images
    // birdimg = new Image();
    // birdimg.src = "flappybird.png";
    // birdimg.onload = function(){
    //     context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
    // }

    for(let i = 0;i < 4;i++){
        let birdimg = new Image();
        birdimg.src = `flappybird${i}.png`;
        birdimgs.push(birdimg);
    }

    // pipe
    toppipe = new Image();
    toppipe.src = "toppipe.png";

    bottompipe = new Image();
    bottompipe.src = "bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placepiepe, 1500);
    setInterval(animatebird, 200);

    document.addEventListener("keydown", movebird);
    board.addEventListener("touchstart", movebirdTouch, { passive: false }); 
}

function update(){
    requestAnimationFrame(update);
    if(gameover){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityy += gravity;
    // bird.y += velocityy;
    bird.y = Math.max(bird.y + velocityy, 0);
    // context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
    context.drawImage(birdimgs[birdimgsindex], bird.x, bird.y, bird.width, bird.height);
    // birdimgsindex++;
    // birdimgsindex %= birdimgs.length;

    if(bird.y > board.height){
        gameover = true;
    }

    // pipes
    for(let i=0;i<pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x += velocityx;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }

        if(detect(bird, pipe)){
            gameover = true;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipewidth) {
        pipeArray.shift(); //removes first element from the array
    }

    context.fillStyle = "black";
    context.font="60px sans-serif";
    context.fillText(score, 5, 45);

    if (gameover) {
        context.fillText("GAME OVER", 180, 320);
    }

}

function animatebird(){
    birdimgsindex++;
    birdimgsindex %= birdimgs.length;
}

function placepiepe(){
    if(gameover){
        return;
    }
    // toppipe
    let randompipey = pipey - pipeheight/4 - Math.random() * (pipeheight/2);

    let topppipe = {
        img : toppipe,
        x: pipex,
        y : randompipey,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }

    pipeArray.push(topppipe);

    // bottompipe
    let openingspace = board.height/4;

    let bottomppipe = {
        img : bottompipe,
        x: pipex,
        y : randompipey + pipeheight + openingspace,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }

    pipeArray.push(bottomppipe);
}

function movebird(e){
    if(e.code == "Space" || e.code == "ArrowUp"|| e.code == "KeyX"){
        velocityy = -6;
    }

    if (gameover) {
        resetGame();
    }
}

function movebirdTouch(e){
    // Touch event: Perform the same action as spacebar
    e.preventDefault(); 
    velocityy = -6;

    if (gameover) {
        resetGame();
    }
}

function detect(a,b){
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
    a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function resetGame() {
    bird.y = birdy; // Reset bird's position
    pipeArray = []; // Clear pipes
    score = 0; // Reset score
    gameover = false; // Restart the game
}
