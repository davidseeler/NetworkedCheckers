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
        setKing();
    }
    else if (e.data.includes("_{}*hopped1")){
        updateP2Pieces(e.data.substring(12, e.data.length));
    }
    else if (e.data.includes("_{}*hopped2")){
        updateP1Pieces(e.data.substring(12, e.data.length));
    }
    else if (e.data.includes("_{}*hpUpdt")){
        updateBoard(e.data.substring(11, e.data.length));
        setKing();
    }
    else if (e.data.includes("_{}*kings1")){
        p1kings[p1kings.length] = e.data.substring(11, e.data.length);
    }
    else if (e.data.includes("_{}*kings2")){
        p2kings[p2kings.length] = e.data.substring(11, e.data.length);
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
}

function updateP1Pieces(str){
    let newP1Pieces = new Array();
    let count = 0;
    let number = "";
    for (i = 0; i < str.length; i++){
        if (str.charAt(i) == ','){
            newP1Pieces[count] = number;
            count++;
            number = "";
        }
        else{
            number += str.charAt(i);
        }
    }
    newP1Pieces[count] = number;
    p1pieces = newP1Pieces;
}

function updateP2Pieces(str){
    let newP2Pieces = new Array();
    let count = 0;
    let number = "";
    for (i = 0; i < str.length; i++){
        if (str.charAt(i) == ','){
            newP2Pieces[count] = number;
            count++;
            number = "";
        }
        else{
            number += str.charAt(i);
        }
    }
    newP2Pieces[count] = number;
    p2pieces = newP2Pieces;
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

let p1kings = new Array();
let p2kings = new Array();

let selectedPiece = {
    piece: null,
    tile: null,
    isKing: false,
    topLeft: false,
    topLeftHop: false,
    topRight: false,
    topRightHop: false,
    bottomLeft: false,
    bottomLeftHop: false,
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
        selectedPiece.isKing ? selectedPiece.piece.style.border = "1px solid orange" : selectedPiece.piece.style.border = "1px solid white";
        stopListening();
        turnOffHighlights();
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
    if (selectedPiece.bottomLeftHop){
        document.getElementById("tile" + (selectedPiece.tile + 14)).addEventListener("click", bottomLeftHopEnable);
    }
    if (selectedPiece.bottomRightHop){
        document.getElementById("tile" + (selectedPiece.tile + 18)).addEventListener("click", bottomRightHopEnable);
    }
    if (selectedPiece.topRightHop){
        document.getElementById("tile" + (selectedPiece.tile - 14)).addEventListener("click", topRightHopEnable);
    }
    if (selectedPiece.topLeftHop){
        document.getElementById("tile" + (selectedPiece.tile - 18)).addEventListener("click", topLeftHopEnable);
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
    if (selectedPiece.bottomLeftHop){
        document.getElementById("tile" + (selectedPiece.tile + 14)).removeEventListener("click", bottomLeftHopEnable);
    }
    if (selectedPiece.bottomRightHop){
        document.getElementById("tile" + (selectedPiece.tile + 18)).removeEventListener("click", bottomRightHopEnable);
    }
    if (selectedPiece.topRightHop){
        document.getElementById("tile" + (selectedPiece.tile - 14)).removeEventListener("click", topRightHopEnable);
    }
    if (selectedPiece.topLeftHop){
        document.getElementById("tile" + (selectedPiece.tile - 18)).removeEventListener("click", topLeftHopEnable);
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
    selectedPiece.bottomLeftHop = false;
    selectedPiece.bottomRight = false;
    selectedPiece.bottomRightHop = false;

    for (i = 0; i < p1kings.length; i++){
        document.getElementById(p1kings[i]).style.border = "1px solid orange";
    }
    for (i = 0; i < p2kings.length; i++){
        document.getElementById(p2kings[i]).style.border = "1px solid orange";
    }
}

function p2Enable(){
    if (playerId == 2 && !turn){
        for (i = 0; i < p2pieces.length; i++){
            document.getElementById(p2pieces[i]).addEventListener("click", selectPiece);
        }
    }
}

function checkKing(val){
    if (p1pieces.indexOf(board[selectedPiece.tile + val]) != -1 &&
    p1kings.indexOf(board[selectedPiece.tile + val]) != -1){
        if (selectedPiece.tile + val >= 56 && selectedPiece.tile + val < 63){
            p1kings[p1kings.length] = board[selectedPiece.tile + val];
            selectedPiece.isKing = true;
            selectedPiece.piece.style.backgroundImage = "url('redCrown.png')";
            selectedPiece.piece.style.border = "1px solid orange";
            connection.send("_{}*kings1 " + board[selectedPiece.tile + val]);
        }
    }
    else if (p2pieces.indexOf(board[selectedPiece.tile + val]) != -1 &&
    p2kings.indexOf(board[selectedPiece.tile + val]) != -1){
        if (selectedPiece.tile + val > 0 && selectedPiece.tile + val <= 7){
            p2kings[p2kings.length] = board[selectedPiece.tile + val];
            selectedPiece.isKing = true;
             selectedPiece.piece.style.backgroundImage = "url('blackCrown.png')";
             selectedPiece.piece.style.border = "1px solid orange";
             connection.send("_{}*kings2 " + board[selectedPiece.tile + val]);
        }
    }
}

function setKing(){
    for (i = 0; i < p1kings.length; i++){
        document.getElementById(p1kings[i]).style.backgroundImage = "url('redCrown.png')";
        document.getElementById(p1kings[i]).style.border = "1px solid orange";
    }
    for (i = 0; i < p2kings.length; i++){
        document.getElementById(p2kings[i]).style.backgroundImage = "url('blackCrown.png')";
        document.getElementById(p2kings[i]).style.border = "1px solid orange";
    }
    if (p1kings.indexOf(board[selectedPiece.tile]) != -1 || p2kings.indexOf(board[selectedPiece.tile]) != -1){
        selectedPiece.isKing = true;
        selectedPiece.piece.style.border = "2px solid #34FF01";
    }
}

function findMoves(piece){
    if (!hopped){
        selectedPiece.tile = getIndex(piece.id);
    }
    setKing();
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
        else if (bottomLeftHopCheck(selectedPiece.tile)){
            if (turn && p2pieces.includes(board[selectedPiece.tile + 7])){
                // if there is an open spot behind the black piece
                if (board[selectedPiece.tile + 14] == null){
                        selectedPiece.bottomLeftHop = true;
                }
            }
            else if (!turn && p1pieces.includes(board[selectedPiece.tile + 7]) && selectedPiece.isKing){
                if (board[selectedPiece.tile + 14] == null){
                    selectedPiece.bottomLeftHop = true;
                }
            }
        }
        if (board[selectedPiece.tile + 9] == null) {
            if (!turn && selectedPiece.isKing){
                selectedPiece.bottomRight = true;
            }
            else if (turn){
                selectedPiece.bottomRight = true;
            }
        }
        else if (bottomRightHopCheck(selectedPiece.tile)){
            if (turn && p2pieces.includes(board[selectedPiece.tile + 9])){
                // if there is an open spot behind the black piece
                if (board[selectedPiece.tile + 18] == null){
                        selectedPiece.bottomRightHop = true;
                }
            }
            else if (!turn && p1pieces.includes(board[selectedPiece.tile + 9]) && selectedPiece.isKing){
                if (board[selectedPiece.tile + 18] == null){
                    selectedPiece.bottomRightHop = true;
                }
            }
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
        else if (bottomLeftHopCheck(selectedPiece.tile)){
            if (turn && p2pieces.includes(board[selectedPiece.tile + 7])){
                // if there is an open spot behind the black piece
                if (board[selectedPiece.tile + 14] == null){
                        selectedPiece.bottomLeftHop = true;
                }
            }
            else if (!turn && p1pieces.includes(board[selectedPiece.tile + 7]) && selectedPiece.isKing){
                if (board[selectedPiece.tile + 14] == null){
                    selectedPiece.bottomLeftHop = true;
                }
            }
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
        else if (topLeftHopCheck(selectedPiece.tile)){
            if (!turn && p1pieces.includes(board[selectedPiece.tile - 9])){
                // if there is an open spot behind the black piece
                if (board[selectedPiece.tile - 18] == null){
                        selectedPiece.topLeftHop = true;
                }
            }
            else if (turn && p2pieces.includes(board[selectedPiece.tile - 9]) && selectedPiece.isKing){
                if (board[selectedPiece.tile - 18] == null){
                    selectedPiece.topLeftHop = true;
                }
            }
        }
        if (board[selectedPiece.tile + 7] == null){
            if (!turn && selectedPiece.isKing){
                selectedPiece.bottomLeft = true;
            }
            else if (turn){
                selectedPiece.bottomLeft = true;
            }
        }
        else if (bottomLeftHopCheck(selectedPiece.tile)){
            if (turn && p2pieces.includes(board[selectedPiece.tile + 7])){
                // if there is an open spot behind the black piece
                if (board[selectedPiece.tile + 14] == null){
                        selectedPiece.bottomLeftHop = true;
                }
            }
            else if (!turn && p1pieces.includes(board[selectedPiece.tile + 7]) && selectedPiece.isKing){
                if (board[selectedPiece.tile + 14] == null){
                    selectedPiece.bottomLeftHop = true;
                }
            }
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
        else if (topRightHopCheck(selectedPiece.tile)){
            if (!turn && p1pieces.includes(board[selectedPiece.tile - 7])){
                // if there is an open spot behind the black piece
                if (board[selectedPiece.tile - 14] == null){
                        selectedPiece.topRightHop = true;
                }
            }
            else if (turn && p2pieces.includes(board[selectedPiece.tile - 7]) && selectedPiece.isKing){
                if (board[selectedPiece.tile - 14] == null){
                    selectedPiece.topRightHop = true;
                }
            }
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
        else if (topRightHopCheck(selectedPiece.tile)){
            if (!turn && p1pieces.includes(board[selectedPiece.tile - 7])){
                // if there is an open spot behind the black piece
                if (board[selectedPiece.tile - 14] == null){
                        selectedPiece.topRightHop = true;
                }
            }
            else if (turn && p2pieces.includes(board[selectedPiece.tile - 7]) && selectedPiece.isKing){
                if (board[selectedPiece.tile - 14] == null){
                    selectedPiece.topRightHop = true;
                }
            }
        }
        if (board[selectedPiece.tile + 9] == null){
            if (!turn && selectedPiece.isKing){
                selectedPiece.bottomRight = true;
            }
            else if (turn){
                selectedPiece.bottomRight = true;
            }
        }
        else if (bottomRightHopCheck(selectedPiece.tile)){
            if (turn && p2pieces.includes(board[selectedPiece.tile + 9])){
                // if there is an open spot behind the black piece
                if (board[selectedPiece.tile + 18] == null){
                        selectedPiece.bottomRightHop = true;
                }
            }
            else if (!turn && p1pieces.includes(board[selectedPiece.tile + 9]) && selectedPiece.isKing){
                if (board[selectedPiece.tile + 18] == null){
                    selectedPiece.bottomRightHop = true;
                }
            }
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
        else if (topLeftHopCheck(selectedPiece.tile)){
            if (!turn && p1pieces.includes(board[selectedPiece.tile - 9])){
                // if there is an open spot behind the black piece
                if (board[selectedPiece.tile - 18] == null){
                        selectedPiece.topLeftHop = true;
                }
            }
            else if (turn && p2pieces.includes(board[selectedPiece.tile - 9]) && selectedPiece.isKing){
                if (board[selectedPiece.tile - 18] == null){
                    selectedPiece.topLeftHop = true;
                }
            }
        }
        if (board[selectedPiece.tile - 7] == null){
            if (turn && selectedPiece.isKing){
                selectedPiece.topRight = true;
            }
            else if (!turn){
                selectedPiece.topRight = true;
            }
        }
        else if (topRightHopCheck(selectedPiece.tile)){
            if (!turn && p1pieces.includes(board[selectedPiece.tile - 7])){
                // if there is an open spot behind the black piece
                if (board[selectedPiece.tile - 14] == null){
                        selectedPiece.topRightHop = true;
                }
            }
            else if (turn && p2pieces.includes(board[selectedPiece.tile - 7]) && selectedPiece.isKing){
                if (board[selectedPiece.tile - 14] == null){
                    selectedPiece.topRightHop = true;
                }
            }
        }
    }
    // middle tiles
    else{
        // if spot is open
        if (board[selectedPiece.tile + 7] == null) {
            if (!turn && selectedPiece.isKing){ // black king can move to it
                selectedPiece.bottomLeft = true;
            }
            else if (turn){ // red piece can move to it
                selectedPiece.bottomLeft = true;
            }
        }
        // if spot is not open
        else if (bottomLeftHopCheck(selectedPiece.tile)){
            // if its reds turn and the spot has a black piece
            if (turn && p2pieces.includes(board[selectedPiece.tile + 7])){
                // if there is an open spot behind the black piece
                if (board[selectedPiece.tile + 14] == null){
                        selectedPiece.bottomLeftHop = true;
                }
            }
            else if (!turn && p1pieces.includes(board[selectedPiece.tile + 7]) && selectedPiece.isKing){
                if (board[selectedPiece.tile + 14] == null){
                    selectedPiece.bottomLeftHop = true;
                }
            }
        }
        if (board[selectedPiece.tile + 9] == null) {
            if (!turn && selectedPiece.isKing){
                selectedPiece.bottomRight = true;
            }
            else if (turn){
                selectedPiece.bottomRight = true;
            }
        }
        else if (bottomRightHopCheck(selectedPiece.tile)){
            if (turn && p2pieces.includes(board[selectedPiece.tile + 9])){
                // if there is an open spot behind the black piece
                if (board[selectedPiece.tile + 18] == null){
                        selectedPiece.bottomRightHop = true;
                }
            }
            else if (!turn && p1pieces.includes(board[selectedPiece.tile + 9]) && selectedPiece.isKing){
                if (board[selectedPiece.tile + 18] == null){
                    selectedPiece.bottomRightHop = true;
                }
            }
        }
        if (board[selectedPiece.tile - 9] == null){
            if (turn && selectedPiece.isKing){
                selectedPiece.topLeft = true;
            }
            else if (!turn){
                selectedPiece.topLeft = true;
            }
        }
        else if (topLeftHopCheck(selectedPiece.tile)){
            if (!turn && p1pieces.includes(board[selectedPiece.tile - 9])){
                // if there is an open spot behind the black piece
                if (board[selectedPiece.tile - 18] == null){
                        selectedPiece.topLeftHop = true;
                }
            }
            else if (turn && p2pieces.includes(board[selectedPiece.tile - 9]) && selectedPiece.isKing){
                if (board[selectedPiece.tile - 18] == null){
                    selectedPiece.topLeftHop = true;
                }
            }
        }
        if (board[selectedPiece.tile - 7] == null){
            if (turn && selectedPiece.isKing){
                selectedPiece.topRight = true;
            }
            else if (!turn){
                selectedPiece.topRight = true;
            }
        }
        else if (topRightHopCheck(selectedPiece.tile)){
            if (!turn && p1pieces.includes(board[selectedPiece.tile - 7])){
                // if there is an open spot behind the black piece
                if (board[selectedPiece.tile - 14] == null){
                        selectedPiece.topRightHop = true;
                }
            }
            else if (turn && p2pieces.includes(board[selectedPiece.tile - 7]) && selectedPiece.isKing){
                if (board[selectedPiece.tile - 14] == null){
                    selectedPiece.topRightHop = true;
                }
            }
        }
    }
}

function bottomLeftHopCheck(tile){
    if ((tile >= 2 && tile <= 7) || (tile >= 10 && tile <= 15) || (tile >= 18 && tile <= 23) ||
    (tile >= 26 && tile <= 31) || (tile >= 34 && tile <= 39) || (tile >= 42 && tile <= 47)){
        return true;
    }
    return false;
}

function bottomRightHopCheck(tile){
    if ((tile >= 0 && tile <= 5) || (tile >= 8 && tile <= 13) || (tile >= 16 && tile <= 21) ||
    (tile >= 24 && tile <= 29) || (tile >= 32 && tile <= 37) || (tile >= 40 && tile <= 45)){
        return true;
    }
    return false;
}

function topLeftHopCheck(tile){
    if ((tile >= 18 && tile <= 23) || (tile >= 26 && tile <= 31) || (tile >= 34 && tile <= 39) ||
    (tile >= 42 && tile <= 47) || (tile >= 50 && tile <= 55) || (tile >= 58 && tile <= 63)){
        return true;
    }
    return false;
}

function topRightHopCheck(tile){
    if ((tile >= 16 && tile <= 21) || (tile >= 24 && tile <= 29) || (tile >= 32 && tile <= 37) ||
    (tile >= 40 && tile <= 45) || (tile >= 48 && tile <= 53) || (tile >= 56 && tile <= 61)){
        return true;
    }
    return false;
}

function highlightTiles(piece){
    if (selectedPiece.bottomLeft && !hopped){
        document.getElementById("tile" + (selectedPiece.tile + 7)).style.animation = "glowing 5000ms infinite";
    }
    if (selectedPiece.bottomRight && !hopped){
        document.getElementById("tile" + (selectedPiece.tile + 9)).style.animation = "glowing 5000ms infinite";
    }
    if (selectedPiece.topLeft && !hopped){
        document.getElementById("tile" + (selectedPiece.tile - 9)).style.animation = "glowing 5000ms infinite";
    }
    if (selectedPiece.topRight && !hopped){
        document.getElementById("tile" + (selectedPiece.tile - 7)).style.animation = "glowing 5000ms infinite";
    }
    if (selectedPiece.bottomLeftHop){
        document.getElementById("tile" + (selectedPiece.tile + 14)).style.animation = "glowing 5000ms infinite";
    }
    if (selectedPiece.bottomRightHop){
        document.getElementById("tile" + (selectedPiece.tile + 18)).style.animation = "glowing 5000ms infinite";
    }
    if (selectedPiece.topLeftHop){
        document.getElementById("tile" + (selectedPiece.tile - 18)).style.animation = "glowing 5000ms infinite";
    }
    if (selectedPiece.topRightHop){
        document.getElementById("tile" + (selectedPiece.tile - 14)).style.animation = "glowing 5000ms infinite";
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

     checkKing(7);
     setKing();
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

    checkKing(9);
    setKing();
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

        checkKing(-9);
        setKing();
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

        checkKing(-7);
        setKing();
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

let hopped = false;

function bottomLeftHopEnable(){
    board[selectedPiece.tile] = null;
    board[selectedPiece.tile + 14] = selectedPiece.piece.id;
    let piece = board[selectedPiece.tile + 14];
    let tile = selectedPiece.tile + 14;
    document.getElementById("tile" + selectedPiece.tile).innerHTML = null;
    document.getElementById("tile" + (selectedPiece.tile + 7)).innerHTML = null;
    if (turn){
        p2pieces.splice(p2pieces.indexOf(board[selectedPiece.tile + 7]), 1);
        document.getElementById("tile" + (selectedPiece.tile + 14)).innerHTML =
         `<p class="red-piece" id="${selectedPiece.piece.id}"></p?>`;
        }
        else{
            p1pieces.splice(p1pieces.indexOf(board[selectedPiece.tile + 7]), 1);
            document.getElementById("tile" + (selectedPiece.tile + 14)).innerHTML =
         `<p class="black-piece" id="${selectedPiece.piece.id}"></p?>`;
        }
    board[selectedPiece.tile + 7] = null;
    hopped = true;

    checkKing(14);
     turnOffHighlights();
     stopListening();
     refresh();

     selectedPiece.piece = document.getElementById(piece);
     selectedPiece.tile = tile;
     setKing();
     findMoves(selectedPiece.piece);

     if (turn){
         if (checkForHops()){
             updateP2(true);
             p1HopEnable();
         }
         else{
            updateP2(false);
            p2Enable();
         }
     }
     else{
         if (checkForHops()){
             updateP1(true);
            p2HopEnable();
         }
         else{
            updateP1(false);
            p1Enable();
         }
     }
}

function bottomRightHopEnable(){
    board[selectedPiece.tile] = null;
    board[selectedPiece.tile + 18] = selectedPiece.piece.id;
    let piece = board[selectedPiece.tile + 18];
    let tile = selectedPiece.tile + 18;
    document.getElementById("tile" + selectedPiece.tile).innerHTML = null;
    document.getElementById("tile" + (selectedPiece.tile + 9)).innerHTML = null;
    if (turn){
        p2pieces.splice(p2pieces.indexOf(board[selectedPiece.tile + 9]), 1);
        document.getElementById("tile" + (selectedPiece.tile + 18)).innerHTML =
         `<p class="red-piece" id="${selectedPiece.piece.id}"></p?>`;

        }
        else{
            p1pieces.splice(p1pieces.indexOf(board[selectedPiece.tile + 9]), 1);
            document.getElementById("tile" + (selectedPiece.tile + 18)).innerHTML =
         `<p class="black-piece" id="${selectedPiece.piece.id}"></p?>`;
        }
    board[selectedPiece.tile + 9] = null;
    hopped = true;

    checkKing(18);
     turnOffHighlights();
     stopListening();
     refresh();

     selectedPiece.piece = document.getElementById(piece);
     selectedPiece.tile = tile;
     setKing();
     findMoves(selectedPiece.piece);

     if (turn){
         if (checkForHops()){
             updateP2(true);
             p1HopEnable();
         }
         else{
            updateP2(false);
            p2Enable();
         }
     }
     else{
         if (checkForHops()){
             updateP1(true);
            p2HopEnable();
         }
         else{
            updateP1(false);
            p1Enable();
         }
     }
}

function topLeftHopEnable(){
    board[selectedPiece.tile] = null;
    board[selectedPiece.tile - 18] = selectedPiece.piece.id;
    let piece = board[selectedPiece.tile - 18];
    let tile = selectedPiece.tile - 18;
    document.getElementById("tile" + selectedPiece.tile).innerHTML = null;
    document.getElementById("tile" + (selectedPiece.tile - 9)).innerHTML = null;
    if (turn){
        p2pieces.splice(p2pieces.indexOf(board[selectedPiece.tile - 9]), 1);
        document.getElementById("tile" + (selectedPiece.tile - 18)).innerHTML =
         `<p class="red-piece" id="${selectedPiece.piece.id}"></p?>`;

        }
        else{
            p1pieces.splice(p1pieces.indexOf(board[selectedPiece.tile - 9]), 1);
            document.getElementById("tile" + (selectedPiece.tile - 18)).innerHTML =
         `<p class="black-piece" id="${selectedPiece.piece.id}"></p?>`;
        }
    board[selectedPiece.tile - 9] = null;
    hopped = true;

    checkKing(-18);
     turnOffHighlights();
     stopListening();
     refresh();

     selectedPiece.piece = document.getElementById(piece);
     selectedPiece.tile = tile;
     setKing();
     findMoves(selectedPiece.piece);

     if (turn){
         if (checkForHops()){
             updateP2(true);
             p1HopEnable();
         }
         else{
            updateP2(false);
            p2Enable();
         }
     }
     else{
         if (checkForHops()){
             updateP1(true);
            p2HopEnable();
         }
         else{
            updateP1(false);
            p1Enable();
         }
     }
}

function topRightHopEnable(){
    board[selectedPiece.tile] = null;
    board[selectedPiece.tile - 14] = selectedPiece.piece.id;
    let piece = board[selectedPiece.tile - 14];
    let tile = selectedPiece.tile - 14;
    document.getElementById("tile" + selectedPiece.tile).innerHTML = null;
    document.getElementById("tile" + (selectedPiece.tile - 7)).innerHTML = null;
    if (turn){
        p2pieces.splice(p2pieces.indexOf(board[selectedPiece.tile - 7]), 1);
        document.getElementById("tile" + (selectedPiece.tile - 14)).innerHTML =
         `<p class="red-piece" id="${selectedPiece.piece.id}"></p?>`;

        }
        else{
            p1pieces.splice(p1pieces.indexOf(board[selectedPiece.tile - 7]), 1);
            document.getElementById("tile" + (selectedPiece.tile - 14)).innerHTML =
         `<p class="black-piece" id="${selectedPiece.piece.id}"></p?>`;
        }

    board[selectedPiece.tile - 7] = null;
    hopped = true;

    checkKing(-14);
     turnOffHighlights();
     stopListening();
     refresh();

     selectedPiece.piece = document.getElementById(piece);
     selectedPiece.tile = tile;
     setKing();
     findMoves(selectedPiece.piece);

     if (turn){
         if (checkForHops()){
             updateP2(true);
             p1HopEnable();
         }
         else{
            updateP2(false);
            p2Enable();
         }
     }
     else{
         if (checkForHops()){
             updateP1(true);
            p2HopEnable();
         }
         else{
            updateP1(false);
            p1Enable();
         }
     }
}

function printSelectedPiece(){
    console.log("piece:" + selectedPiece.piece);
    console.log("tile: " + selectedPiece.tile);
    console.log("isKing: " + selectedPiece.isKing);
    console.log("topLeft: " + selectedPiece.topLeft);
    console.log("topLeftHop: " + selectedPiece.topLeftHop);
    console.log("topRight: " + selectedPiece.topRight);
    console.log("topRightHop: " + selectedPiece.topRightHop);
    console.log("bottomLeft: " + selectedPiece.bottomLeft);
    console.log("bottomLeftHop: " + selectedPiece.bottomLeftHop);
    console.log("bottomRight: " + selectedPiece.bottomRight);
    console.log("bottomRightHop: " + selectedPiece.bottomRightHop);
}

function refresh(){
    connection.send("_{}*hopped1 " + p2pieces.join());
    connection.send("_{}*hopped2 " + p1pieces.join());
    connection.send("_{}*hpUpdt " + board.join());
}

function checkForHops(){
    if (selectedPiece.topLeftHop || selectedPiece.topRightHop || selectedPiece.bottomLeftHop || selectedPiece.bottomRightHop){
        return true;
    }
    return false;
}

function p1HopEnable(){
    selectedPiece.piece.style.border = "2px solid #34FF01";
    highlightTiles();
    if (selectedPiece.bottomLeftHop){
        document.getElementById("tile" + (selectedPiece.tile + 14)).addEventListener("click", bottomLeftHopEnable);
    }
    if (selectedPiece.bottomRightHop){
        document.getElementById("tile" + (selectedPiece.tile + 18)).addEventListener("click", bottomRightHopEnable);
    }
    if (selectedPiece.topRightHop){
        document.getElementById("tile" + (selectedPiece.tile - 14)).addEventListener("click", topRightHopEnable);
    }
    if (selectedPiece.topLeftHop){
        document.getElementById("tile" + (selectedPiece.tile - 18)).addEventListener("click", topLeftHopEnable);
    }
}

function p2HopEnable(){
    selectedPiece.piece.style.border = "2px solid #34FF01";
    highlightTiles();
    if (selectedPiece.bottomLeftHop){
        document.getElementById("tile" + (selectedPiece.tile + 14)).addEventListener("click", bottomLeftHopEnable);
    }
    if (selectedPiece.bottomRightHop){
        document.getElementById("tile" + (selectedPiece.tile + 18)).addEventListener("click", bottomRightHopEnable);
    }
    if (selectedPiece.topRightHop){
        document.getElementById("tile" + (selectedPiece.tile - 14)).addEventListener("click", topRightHopEnable);
    }
    if (selectedPiece.topLeftHop){
        document.getElementById("tile" + (selectedPiece.tile - 18)).addEventListener("click", topLeftHopEnable);
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

function updateP1(anotherHop){
    if (hopped){
        connection.send("_{}*hopped2 " + p1pieces.join());
        if (anotherHop){
            connection.send("_{}*hpUpdt " + board.join());
        }
        else{
            hopped = false;
            resetSelectedPiece();
            connection.send("_{}*update " + board.join());
        }
    }
    else{
        connection.send("_{}*update " + board.join());
    }
}

function updateP2(anotherHop){
    if (hopped){
        connection.send("_{}*hopped1 " + p2pieces.join());
        if (anotherHop){
            connection.send("_{}*hpUpdt " + board.join());
        }
        else{
            hopped = false;
            resetSelectedPiece();
            connection.send("_{}*update " + board.join());
        }
    }
    else{
        connection.send("_{}*update " + board.join());
    }
}

let gameOver = false;

function start(){
    if (turn){
        if (!hopped){
            p1Enable();
        }
    }
    else{
        if (!hopped){
            p2Enable();
        }
    }
}

setTimeout(p1Enable, 300);
setInterval(start, 300);
