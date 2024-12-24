let error = 0;
let cardlist = [    
    "darkness",
    "double",
    "fairy",
    "fighting",
    "fire",
    "grass",
    "lightning",
    "metal",
    "psychic",
    "water"
]

let cardset;
let board = [];
let row = 4;
let columnn = 5;

let card1Selected;
let card2Selected;


window.onload = function(){
    shufflecard();
    startgame();
    document.getElementById("btn").addEventListener("click", restartGame);
}

function shufflecard() {
    cardset = cardlist.concat(cardlist);

    for(let i=0;i<cardset.length;i++){
        let j = Math.floor(Math.random() * cardset.length);

        let temp = cardset[i];
        cardset[i] = cardset[j];
        cardset[j] = temp;
    }
    console.log(cardset);
}

function startgame(){
    for(let r=0;r<row;r++){
        let row = [];
        for(let c=0;c<columnn;c++){
            let cardimg = cardset.pop();
            row.push(cardimg);

            let card = document.createElement("img");
            card.id = r.toString() + "-" + c.toString();
            card.src = cardimg + ".jpg";
            card.classList.add("card");
            card.addEventListener("click", selectCard);
            document.getElementById("board").append(card);
        }
        board.push(row);
    }
    setTimeout(hideCards, 1000);
}

function hideCards() {
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < columnn; c++) {
            let card = document.getElementById(r.toString() + "-" + c.toString());
            card.src = "back.jpg";
        }
    }
}



function selectCard() {
    if(this.src.includes("back")){
        if(!card1Selected){
            card1Selected = this;
            let coord = card1Selected.id.split("-");
            let r = parseInt(coord[0]);
            let c = parseInt(coord[1]);

            card1Selected.src = board[r][c] + ".jpg";
        }else if (!card2Selected && this != card1Selected) {
            card2Selected = this;

            let coords = card2Selected.id.split("-"); //"0-1" -> ["0", "1"]
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);

            card2Selected.src = board[r][c] + ".jpg";
            setTimeout(update, 500);
        }
    }
}

function update() {
    //if cards aren't the same, flip both back
    if (card1Selected.src != card2Selected.src) {
        card1Selected.src = "back.jpg";
        card2Selected.src = "back.jpg";
    }
    else{
        error += 1;
        document.getElementById("error").innerText = error;
    }
    card1Selected = null;
    card2Selected = null;
}

function restartGame() {
    // Reset global variables
    error = 0;
    card1Selected = null;
    card2Selected = null;
    board = [];

    // Reset the errors display
    document.getElementById("error").innerText = error;

    // Clear the game board in the DOM
    document.getElementById("board").innerHTML = "";

    // Shuffle cards again and restart the game
    shufflecard();
    startgame();
}


