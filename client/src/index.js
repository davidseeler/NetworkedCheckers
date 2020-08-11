const connection = new WebSocket('ws://127.0.0.1:4444');

connection.onopen = function () {
    console.log('Connected!');
    connection.send("_{}*getid");
    connection.send("_{}*getturn")
};

let playerId = null;
let turn = null;

// Log messages from the server
connection.onmessage = function (e) {
    if (e.data == "_{}*id1"){
        playerId = 1;
    }
    else if (e.data == "_{}*id2"){
        playerId = 2;
    }
    else if (e.data == "_{}*turn1"){
        turn = true;
    }
    else if (e.data == "_{}*turn2"){
        turn = false;
    }
    else if (e.data.includes("_{}*update")){
        updateBoard(e.data.substring(11, e.data.length));
    }
    else{
        let msg = (getTime() + e.data + "\n");
        document.getElementById("chatLog").value += msg;
    }
};

function updateBoard(str){
    let newBoard = new Array(64);
    let count = 0;
    let number = "";

    for (i = 0; i < str.length; i++){
        if (str.charAt(i) == '_'){
            if (number != ""){
                number = number.trim();
                newBoard[count] = number;
                count++;
                number = "";
            }
            newBoard[count] = null;
            count++;
        }
        else{
            number += str.charAt(i);
        }
    }
    newBoard[count] = number;

    for (i = 0; i < newBoard.length; i++){
        if (newBoard[i] != null && newBoard[i].includes(" ")){
            let num1 = newBoard[i].substring(0, newBoard[i].indexOf(" ")).trim();
            let num2 = newBoard[i].substring(newBoard[i].indexOf(" "), newBoard[i].length).trim();
            newBoard[i] = num1;
            newBoard.splice(i + 1, 0, num2);
        }
    }
    newBoard[63] = null;

     for (i = 0; i < 64; i++){
        board[i] = newBoard[i];
        if (board[i] != null){
            if (board[i] < 12){
                document.getElementById("tile" + i).innerHTML =
                 `<p class="red-piece" id="${board[i]}"></p?>`;
            }
            else{
                document.getElementById("tile" + i).innerHTML =
                 `<p class="black-piece" id="${board[i]}"></p?>`;
            }
        }
        else{
            document.getElementById("tile" + i).innerHTML = null;
        }
     }


    if (turn){

    }
    else{

    }
}

function send(){
    if (document.getElementById("textField").value != null){
        connection.send(document.getElementById("textField").value);
        document.getElementById("textField").value = "";
    }
}

function getTime(){
    let date = new Date();
    let hours = "";
    let minutes = "";
    let symbol = "";
    if (date.getHours() >= 12){
        hours = date.getHours() - 12;
        symbol = "PM";
    }
    else{
        hours = date.getHours();
        symbol = "AM";
    }
    if (date.getMinutes() < 10){
        return "(" + hours + ":0" + date.getMinutes() + " " + symbol + ") ";
    }
    else{
        return "(" + hours + ":" + date.getMinutes() + " " + symbol + ") ";
    }
}
const tiles = [
    "tile0", "tile1", "tile2", "tile3", "tile4", "tile5", "tile6",
    "tile7", "tile8", "tile9", "tile10", "tile11", "tile12", "tile13",
    "tile14", "tile15", "tile16", "tile17", "tile18", "tile19", "tile20",
    "tile21", "tile22", "tile23", "tile24", "tile25", "tile26", "tile27",
    "tile28", "tile29", "tile30", "tile31", "tile32", "tile33", "tile34",
    "tile35", "tile36", "tile37", "tile38", "tile39", "tile40", "tile41",
    "tile42", "tile43", "tile44", "tile45", "tile46", "tile47", "tile48",
    "tile49", "tile50", "tile51", "tile52", "tile53", "tile54", "tile55",
    "tile56", "tile57", "tile58", "tile59", "tile60", "tile61", "tile62",
    "tile63"
];

const board = [
    null, 0, null, 1, null, 2, null, 3,
    4, null, 5, null, 6, null, 7, null,
    null, 8, null, 9, null, 10, null, 11,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    12, null, 13, null, 14, null, 15, null,
    null, 16, null, 17, null, 18, null, 19,
    20, null, 21, null, 22, null, 23, null
];

let p1pieces = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
let p2pieces = ["12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

let p1move1 = null;
let p1move2 = null;

let selectedPiece = {
    piece: null,
    tile: null,
    isKing: false,
    topLeft: false,
    topLeftHop: false,
    topRight: false,
    topRightHop: false,
    bottomLeft: false,
    bottmLeftHop: false,
    bottomRight: false,
    bottomRightHop: false
};

function p1Enable(){
    if (playerId == 1 && turn){
       for (i = 0; i < p1pieces.length; i++){
            document.getElementById(p1pieces[i]).addEventListener("click", selectPiece);
        }
    }
}

function selectPiece(){
    if (selectedPiece.piece != null){
        selectedPiece.piece.style.border = "1px solid white";
    }
    selectedPiece.piece = this;
    this.style.border = "2px solid #34FF01";
    findMoves(this);
    highlightTiles(selectedPiece);
    if (selectedPiece.bottomLeft){
        document.getElementById("tile" + (selectedPiece.tile + 7)).addEventListener("click", bottomLeftEnable);
    }
    if (selectedPiece.bottomRight){
        document.getElementById("tile" + (selectedPiece.tile + 9)).addEventListener("click", bottomRightEnable);
    }
    if (selectedPiece.topLeft){
        document.getElementById("tile" + (selectedPiece.tile - 9)).addEventListener("click", topLeftEnable);
    }
    if (selectedPiece.topRight){
        document.getElementById("tile" + (selectedPiece.tile - 7)).addEventListener("click", topRightEnable);
    }
}

function stopListening(){
    if (turn){
        for (i = 0; i < p1pieces.length; i++){
            document.getElementById(p1pieces[i]).removeEventListener("click", selectPiece);
        }
    }
    else{
        for (i = 0; i < p2pieces.length; i++){
            document.getElementById(p2pieces[i]).removeEventListener("click", selectPiece);
        }
    }
    if (selectedPiece.bottomLeft){
        document.getElementById("tile" + (selectedPiece.tile + 7)).removeEventListener("click", bottomLeftEnable);
    }
    if (selectedPiece.bottomRight){
        document.getElementById("tile" + (selectedPiece.tile + 9)).removeEventListener("click", bottomRightEnable);
    }
    if (selectedPiece.topLeft){
        document.getElementById("tile" + (selectedPiece.tile - 9)).removeEventListener("click", topLeftEnable);
    }
    if (selectedPiece.topRight){
        document.getElementById("tile" + (selectedPiece.tile - 7)).removeEventListener("click", topRightEnable);
    }
    resetSelectedPiece();
}

function resetSelectedPiece(){
    selectedPiece.piece = null;
    selectedPiece.tile = null;
    selectedPiece.isKing = false;
    selectedPiece.topLeft = false;
    selectedPiece.topLeftHop = false;
    selectedPiece.topRight = false;
    selectedPiece.topRightHop = false;
    selectedPiece.bottomLeft = false;
    selectedPiece.bottmLeftHop = false;
    selectedPiece.bottomRight = false;
    selectedPiece.bottomRightHop = false;
}


function p2Enable(){
    if (playerId == 2 && !turn){
        for (i = 0; i < p2pieces.length; i++){
            document.getElementById(p2pieces[i]).addEventListener("click", selectPiece);
        }
    }
}


function findMoves(piece){
    selectedPiece.tile = getIndex(piece.id);
    // top tiles
    if (selectedPiece.tile >= 1 && selectedPiece.tile <= 5){
        if (board[selectedPiece.tile + 7] == null) {
            if (!turn && selectedPiece.isKing){
                selectedPiece.bottomLeft = true;
            }
            else if (turn){
                selectedPiece.bottomLeft = true;
            }
        }
        else{
            // if it can hop over a piece
        }
        if (board[selectedPiece.tile + 9] == null) {
            if (!turn && selectedPiece.isKing){
                selectedPiece.bottomRight = true;
            }
            else if (turn){
                selectedPiece.bottomRight = true;
            }
        }
        else{

        }
    }
    // top right corner
    else if (selectedPiece.tile == 7){
        if (board[selectedPiece.tile + 7] == null){
            if (!turn && selectedPiece.isKing){
                selectedPiece.bottomLeft = true;
            }
            else if (turn){
                selectedPiece.bottomLeft = true;
            }
        }
        else{

        }
    }

    // right tiles
    else if ((selectedPiece.tile - 7) % 16 == 0){
        if (board[selectedPiece.tile - 9] == null){
            if (turn && selectedPiece.isKing){
                selectedPiece.topLeft = true;
            }
            else if (!turn){
                selectedPiece.topLeft = true;
            }
        }
        else{

        }
        if (board[selectedPiece.tile + 7] == null){
            if (!turn && selectedPiece.isKing){
                selectedPiece.bottomLeft = true;
            }
            else if (turn){
                selectedPiece.bottomLeft = true;
            }
        }
        else{

        }
    }
    // bottom left corner
    else if (selectedPiece.tile == 56){
        if (board[selectedPiece.tile - 7] == null){
            if (turn && selectedPiece.isKing){
                selectedPiece.topRight = true;
            }
            else if (!turn){
                selectedPiece.topRight = true;
            }
        }
        else{

        }
    }
    // left tiles
    else if (selectedPiece.tile == 8 || (selectedPiece.tile - 8) % 16 == 0){
        if (board[selectedPiece.tile - 7] == null){
            if (turn && selectedPiece.isKing){
                selectedPiece.topRight = true;
            }
            else if (!turn){
                selectedPiece.topRight = true;
            }
        }
        else{

        }
        if (board[selectedPiece.tile + 9] == null){
            if (!turn && selectedPiece.isKing){
                selectedPiece.bottomRight = true;
            }
            else if (turn){
                selectedPiece.bottomRight = true;
            }
        }
        else{

        }

    }
    // bottom tiles
    else if (selectedPiece.tile >= 58 && selectedPiece.tile <= 62){
        if (board[selectedPiece.tile - 9] == null){
            if (turn && selectedPiece.isKing){
                selectedPiece.topLeft = true;
            }
            else if (!turn){
                selectedPiece.topLeft = true;
            }
        }
        else{

        }
        if (board[selectedPiece.tile - 7] == null){
            if (turn && selectedPiece.isKing){
                selectedPiece.topRight = true;
            }
            else if (!turn){
                selectedPiece.topRight = true;
            }
        }
        else{

        }
    }
    // middle tiles
    else{
        if (board[selectedPiece.tile + 7] == null) {
            if (!turn && selectedPiece.isKing){
                selectedPiece.bottomLeft = true;
            }
            else if (turn){
                selectedPiece.bottomLeft = true;
            }
        }
        else{

        }
        if (board[selectedPiece.tile + 9] == null) {
            if (!turn && selectedPiece.isKing){
                selectedPiece.bottomRight = true;
            }
            else if (turn){
                selectedPiece.bottomRight = true;
            }
        }
        else{

        }
        if (board[selectedPiece.tile - 9] == null){
            if (turn && selectedPiece.isKing){
                selectedPiece.topLeft = true;
            }
            else if (!turn){
                selectedPiece.topLeft = true;
            }
        }
        else{

        }
        if (board[selectedPiece.tile - 7] == null){
            if (turn && selectedPiece.isKing){
                selectedPiece.topRight = true;
            }
            else if (!turn){
                selectedPiece.topRight = true;
            }
        }
        else{

        }
    }
}

function highlightTiles(piece){
    if (piece.bottomLeft){
        document.getElementById("tile" + (selectedPiece.tile + 7)).style.animation = "glowing 5000ms infinite";
    }
    if (piece.bottomRight){
        document.getElementById("tile" + (selectedPiece.tile + 9)).style.animation = "glowing 5000ms infinite";
    }
    if (piece.topLeft){
        document.getElementById("tile" + (selectedPiece.tile - 9)).style.animation = "glowing 5000ms infinite";
    }
    if (piece.topRight){
        document.getElementById("tile" + (selectedPiece.tile - 7)).style.animation = "glowing 5000ms infinite";
    }
}

function bottomLeftEnable(){
    board[selectedPiece.tile] = null;
    board[selectedPiece.tile + 7] = selectedPiece.piece.id;
    document.getElementById("tile" + selectedPiece.tile).innerHTML = null;
    if (turn){
    document.getElementById("tile" + (selectedPiece.tile + 7)).innerHTML =
     `<p class="red-piece" id="${selectedPiece.piece.id}"></p?>`;
    }
    else{
        document.getElementById("tile" + (selectedPiece.tile + 7)).innerHTML =
     `<p class="black-piece" id="${selectedPiece.piece.id}"></p?>`;
    }
     turnOffHighlights();
     stopListening();
     if (turn){
        updateP2();
        setTimeout(p2Enable, 500);
     }
     else{
         updateP1();
         p1Enable();
     }
}

function bottomRightEnable(){
    board[selectedPiece.tile] = null;
    board[selectedPiece.tile + 9] = selectedPiece.piece.id;
    document.getElementById("tile" + selectedPiece.tile).innerHTML = null;
    if (turn){
        document.getElementById("tile" + (selectedPiece.tile + 9)).innerHTML =
         `<p class="red-piece" id="${selectedPiece.piece.id}"></p?>`;
        }
    else{
       document.getElementById("tile" + (selectedPiece.tile + 9)).innerHTML =
         `<p class="black-piece" id="${selectedPiece.piece.id}"></p?>`;
    }
     turnOffHighlights();
     stopListening();
     if (turn){
        updateP2();
        setTimeout(p2Enable, 500);
     }
     else{
         updateP1();
         p1Enable();
     }
}

function topLeftEnable(){
    board[selectedPiece.tile] = null;
    board[selectedPiece.tile - 9] = selectedPiece.piece.id;
    document.getElementById("tile" + selectedPiece.tile).innerHTML = null;
    if (turn){
        document.getElementById("tile" + (selectedPiece.tile - 9)).innerHTML =
         `<p class="red-piece" id="${selectedPiece.piece.id}"></p?>`;
        }
        else{
            document.getElementById("tile" + (selectedPiece.tile - 9)).innerHTML =
         `<p class="black-piece" id="${selectedPiece.piece.id}"></p?>`;
        }
     turnOffHighlights();
     stopListening();
     if (turn){
        updateP2();
        p2Enable();
     }
     else{
         updateP1();
         p1Enable();
     }
}

function topRightEnable(){
    board[selectedPiece.tile] = null;
    board[selectedPiece.tile - 7] = selectedPiece.piece.id;
    document.getElementById("tile" + selectedPiece.tile).innerHTML = null;
    if (turn){
        document.getElementById("tile" + (selectedPiece.tile - 7)).innerHTML =
         `<p class="red-piece" id="${selectedPiece.piece.id}"></p?>`;
        }
        else{
            document.getElementById("tile" + (selectedPiece.tile - 7)).innerHTML =
         `<p class="black-piece" id="${selectedPiece.piece.id}"></p?>`;
        }
     turnOffHighlights();
     stopListening();
     if (turn){
        updateP2();
        p2Enable();
     }
     else{
         updateP1();
         p1Enable();
     }
}

function getIndex(pieceId){
    for (i = 0; i < board.length; i++){
        if (board[i] == pieceId){
            return i;
        }
    }
    return 0;
}

function turnOffHighlights(){
    for (i = 0; i < tiles.length; i++){
        document.getElementById("tile" + i).style.animation = "";
    }
}

function updateP1(){
    connection.send("_{}*update " + board.join());
}

function updateP2(){
    connection.send("_{}*update " + board.join());
}

let gameOver = false;

function start(){
    if (turn){
        p1Enable();
    }
    else{
        p2Enable();
    }
}

setTimeout(p1Enable, 300);
setInterval(start, 3000);
