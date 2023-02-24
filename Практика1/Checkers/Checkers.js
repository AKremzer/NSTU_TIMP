var piecesCounter = 0
var jumpPossible = false

var boardArray = [
    [ null, 0, null, 1, null, 2, null, 3 ],
    [ 4, null, 5, null, 6, null, 7, null ],
    [ null, 8, null, 9, null, 10, null, 11 ],
    [ null, null, null, null, null, null, null, null ], 
    [ null, null, null, null, null, null, null, null ], 
    [ 12, null, 13, null, 14, null, 15, null ],
    [ null, 16, null, 17, null, 18, null, 19 ],
    [ 20, null, 21, null, 22, null, 23, null ]
]

function getCell(row, cell) {
    let cellColor = (row + cell) % 2 == 0 ? "white" : "black";
    let checker = row < 4 && cellColor == "black" ? `<div class="checker black-piece" id="${piecesCounter}"></div>` : 
                 (row > 5 && cellColor == "black" ? `<div class="checker white-piece" id="${piecesCounter}"></div>` : "");
    if(checker != "") piecesCounter++;
    return `<div id="cell-${row}-${cell}" class="cell ${cellColor}">${checker}</div>`
}

function buildBoard() {
    let result = "";
    for (let i = 1; i < 9; i++) {
        result += `<div id="row-${i}" class="row">`;
        for (let j = 1; j < 9; j++)
            result += getCell(i, j) + "\n";
        result += `</div>`;
    }
    return result;
}

var boardCells = document.getElementsByClassName("cell");
let whitePieces = document.getElementsByClassName("white-piece");
let blackPieces = document.getElementsByClassName("black-piece");

let turn = "white";
let whiteScore = 12; // добавить условие выигрыша
let blackScore = 12;
let playerPieces = whitePieces;

class Piece {
  constructor(id, index, king, moves, jump) {
    this.pieceId = id;
    this.indexOfBoardPiece = index;
    this.isKing = king;
    this.possibleMoves = moves;
    this.hasJumps = jump;
  }
}
    
var selectedPiece = new Piece(-1, "", false, [], false);
var piecesMoves = [];
var disableNormalMoves = false;

function isInBorders(row, cell) {
    return row > -1 && row < 8 && cell > -1 && cell < 8;
}

function getPossibleMoves(piece) {
    let row = parseInt(piece.indexOfBoardPiece[5]) - 1;
    let cell = parseInt(piece.indexOfBoardPiece[7]) - 1;
    if((piece.pieceId < 12) || ((piece.pieceId > 11) && (piece.isKing == true))){
        if((isInBorders(row + 1, cell - 1)) && (boardArray[row + 1][cell - 1] == null))
            piece.possibleMoves.push(`cell-${row + 2}-${cell}`);
        if((isInBorders(row + 1, cell + 1)) && (boardArray[row + 1][cell + 1] == null))
            piece.possibleMoves.push(`cell-${row + 2}-${cell + 2}`);
    }
    if((piece.pieceId > 11) || ((piece.pieceId < 12) && (piece.isKing == true))){
        if((isInBorders(row - 1, cell - 1)) && (boardArray[row - 1][cell - 1] == null))
            piece.possibleMoves.push(`cell-${row}-${cell}`);
        if((isInBorders(row - 1, cell + 1)) && (boardArray[row - 1][cell + 1] == null))
            piece.possibleMoves.push(`cell-${row}-${cell + 2}`);
    }
    getPossibleJumps(piece); 
}

function getPossibleJumps(piece) {
    jumpPossible = false;
    let row = parseInt(piece.indexOfBoardPiece[5]) - 1;
    let cell = parseInt(piece.indexOfBoardPiece[7]) - 1;
    let result = [];
    if (piece.pieceId < 12) {
        if((isInBorders(row + 2, cell + 2)) && (boardArray[row + 2][cell + 2] == null) && (boardArray[row + 1][cell + 1] != null))
            if (boardArray[row + 1][cell + 1] > 11)
                result.push(`cell-${row + 3}-${cell + 3}`);
        if((isInBorders(row + 2, cell - 2)) && (boardArray[row + 2][cell - 2] == null) && (boardArray[row + 1][cell - 1] != null))
            if (boardArray[row + 1][cell - 1] > 11)
                result.push(`cell-${row + 3}-${cell - 1}`);
        if(selectedPiece.isKing) {
            if((isInBorders(row - 2, cell + 2)) && (boardArray[row - 2][cell + 2] == null) && (boardArray[row - 1][cell + 1] != null))
                if (boardArray[row - 1][cell + 1] > 11)
                    result.push(`cell-${row - 1}-${cell + 3}`);
            if((isInBorders(row - 2, cell - 2)) && (boardArray[row - 2][cell - 2] == null) && (boardArray[row - 1][cell - 1] != null))
                if (boardArray[row - 1][cell - 1] > 11)
                    result.push(`cell-${row - 1}-${cell - 1}`);
        }
    }
    if (piece.pieceId > 11) {
        if((isInBorders(row - 2, cell + 2)) && (boardArray[row - 2][cell + 2] == null) && (boardArray[row - 1][cell + 1] != null))
            if (boardArray[row - 1][cell + 1] < 12)
                result.push(`cell-${row - 1}-${cell + 3}`);
        if((isInBorders(row - 2, cell - 2)) && (boardArray[row - 2][cell - 2] == null) && (boardArray[row - 1][cell - 1] != null))
            if (boardArray[row - 1][cell - 1] < 12)
                result.push(`cell-${row - 1}-${cell - 1}`);
        if(selectedPiece.isKing) {
            if((isInBorders(row + 2, cell + 2)) && (boardArray[row + 2][cell + 2] == null) && (boardArray[row + 1][cell + 1] != null))
                if (boardArray[row + 1][cell + 1] < 12)
                    result.push(`cell-${row + 3}-${cell + 3}`);
            if((isInBorders(row + 2, cell - 2)) && (boardArray[row + 2][cell - 2] == null) && (boardArray[row + 1][cell - 1] != null))
                if (boardArray[row + 1][cell - 1] < 12)
                    result.push(`cell-${row + 3}-${cell - 1}`);
        }
    }
    if(result.length > 0) {
        jumpPossible = true;
        piece.hasJumps = true;
        piece.possibleMoves = result;
    }
}

function giveOnClicks(pieces) {
    disableNormalMoves = false;
    for (let i = 0; i < pieces.length; i++) {
        let cell = document.getElementById(pieces[i].id).parentElement.id;
        let isKing = document.getElementById(pieces[i].id).classList.contains("king") ? true : false;
        let moves = [];
        let piece = new Piece(pieces[i].id, cell, isKing, moves, false);
        getPossibleMoves(piece);
        if(piece.hasJumps) disableNormalMoves = true;
        piecesMoves.push(piece);
    }
    if (disableNormalMoves) {
        for (let i = 0; i < piecesMoves.length; i++)
            if(piecesMoves[i].hasJumps)
                document.getElementById(piecesMoves[i].pieceId).addEventListener("click", getPlayerPieces);
    }
    else for (let i = 0; i < pieces.length; i++)
        pieces[i].addEventListener("click", getPlayerPieces);
}

function getPlayerPieces() {
    playerPieces = (turn == "white") ? whitePieces : blackPieces;
    removeCellOnClicks();
    resetBorders();
}

function removeCellOnClicks() {
    for (let i = 0; i < boardCells.length; i++) {
        boardCells[i].removeAttribute("onclick");
    }
}

function resetBorders() {
    for (let i = 0; i < playerPieces.length; i++) {
        playerPieces[i].style.outline = 0;
    }
    let dotChildren = Array.from(document.getElementsByClassName("dot"));
    dotChildren.forEach(child => {
    child.remove();
    });
    resetSelectedPieceProperties();
    getSelectedPiece();
}

function resetSelectedPieceProperties() {
    selectedPiece.pieceId = -1;
    selectedPiece.indexOfBoardPiece = "",
    selectedPiece.isKing = false,
    selectedPiece.possibleMoves = []
    selectedPiece.hasJumps = false;
}

function getSelectedPiece() {
    
    let id = parseInt(event.target.id);
    let cell = "";
    selectedPiece.pieceId = id;
    for (let i = 0; i < 8; i++)
        for (let j = 0; j < 8; j++) {
            if (boardArray[i][j] == id) {
                cell = `cell-${i + 1}-${j + 1}`;
                break;
            }
        }
    selectedPiece.indexOfBoardPiece = cell;
    selectedPiece.isKing = document.getElementById(selectedPiece.pieceId).classList.contains("king") ? true : false;
    for (let i = 0; i < piecesMoves.length; i++)
        if(piecesMoves[i].pieceId == selectedPiece.pieceId) {
            selectedPiece.possibleMoves = piecesMoves[i].possibleMoves;
            selectedPiece.hasJumps = piecesMoves[i].hasJumps;
            break;
        }
    enableCells()
}

function enableCells() {
    document.getElementById(selectedPiece.pieceId).style.outline = "3px solid yellow";
    for (let i = 0; i < selectedPiece.possibleMoves.length; i++) {
        let row = parseInt(selectedPiece.possibleMoves[i][5]) - 1;
        let cell = parseInt(selectedPiece.possibleMoves[i][7]) - 1;
        boardCells[row * 8 + cell].innerHTML = `<div class="dot"></div>`;
        boardCells[row * 8 + cell].setAttribute("onclick", `makeMove('cell-${row + 1}-${cell + 1}')`);
    }
}

function makeMove(cellChosen) {
    document.getElementById(selectedPiece.pieceId).remove();
    let row = parseInt(selectedPiece.indexOfBoardPiece[5]) - 1;
    let cell = parseInt(selectedPiece.indexOfBoardPiece[7]) - 1;
    boardCells[row * 8 + cell].innerHTML = "";
    let checkerData = selectedPiece.pieceId < 12 ? (selectedPiece.isKing ? `<div class="checker black-piece king" id="${selectedPiece.pieceId}"></div>` : 
                                                                           `<div class="checker black-piece" id="${selectedPiece.pieceId}"></div>`)
                                                 : (selectedPiece.isKing ? `<div class="checker white-piece king" id="${selectedPiece.pieceId}"></div>` : 
                                                                           `<div class="checker white-piece" id="${selectedPiece.pieceId}"></div>`);
    let rowTo = parseInt(cellChosen[5]) - 1;
    let cellTo = parseInt(cellChosen[7]) - 1;
    boardCells[rowTo * 8 + cellTo].innerHTML = checkerData;
    
    let checkerEaten = null;
    if((Math.abs(row - rowTo) == 2) || (Math.abs(cell - cellTo) == 2)) {
        checkerEaten = rowTo - row > 0 ? (cellTo - cell > 0 ? `cell-${rowTo}-${cellTo}` : `cell-${rowTo}-${cellTo + 2}`)
                                       : (cellTo - cell > 0 ? `cell-${rowTo + 2}-${cellTo}` : `cell-${rowTo + 2}-${cellTo + 2}`);
    }
    modifyBoard(selectedPiece.indexOfBoardPiece, cellChosen, checkerEaten);
}

function modifyBoard(selectedCell, nextCell, checkerEaten) {
    let row = parseInt(selectedCell[5]) - 1;
    let cell = parseInt(selectedCell[7]) - 1;
    let rowTo = parseInt(nextCell[5]) - 1;
    let cellTo = parseInt(nextCell[7]) - 1;
    
    boardArray[row][cell] = null;
    boardArray[rowTo][cellTo] = parseInt(selectedPiece.pieceId);
    
    if (turn == "black" && selectedPiece.pieceId < 12 && rowTo == 7) {
        document.getElementById(selectedPiece.pieceId).classList.add("king")
    }
    if (turn == "white" && selectedPiece.pieceId >11 && rowTo == 0) {
        document.getElementById(selectedPiece.pieceId).classList.add("king");
    }
    if (checkerEaten != null) {
        let eatenRow = parseInt(checkerEaten[5]) - 1;
        let eatenCell = parseInt(checkerEaten[7]) - 1;
        boardArray[eatenRow][eatenCell] = null;
        boardCells[eatenRow * 8 + eatenCell].innerHTML = "";
        if (turn == "black" && selectedPiece.pieceId < 12)
            whiteScore--;
        if (turn == "white" && selectedPiece.pieceId > 11)
            blackScore--
    }
    let dotChildren = Array.from(document.getElementsByClassName("dot"));
    dotChildren.forEach(child => {
    child.remove();
    });
    if(!selectedPiece.hasJumps) resetSelectedPieceProperties();
    removeCellOnClicks();
    removePiecesOnClicks();
}

function removePiecesOnClicks() {
    if (turn == "white")
        for (let i = 0; i < whitePieces.length; i++)
            whitePieces[i].removeEventListener("click", getPlayerPieces);
    else for (let i = 0; i < blackPieces.length; i++)
            blackPieces[i].removeEventListener("click", getPlayerPieces);
    changePlayer();
}

function changePlayer() {
    if(selectedPiece.hasJumps) {
        selectedPiece.possibleMoves = [];
        selectedPiece.hasJumps = false;
        selectedPiece.indexOfBoardPiece = document.getElementById(selectedPiece.pieceId).parentElement.id;
        getPossibleJumps(selectedPiece);
    }
    if(selectedPiece.hasJumps) {
        if (turn == "white")
        for (let i = 0; i < whitePieces.length; i++)
            if(whitePieces[i].id == selectedPiece.pieceId)
                whitePieces[i].addEventListener("click", getPlayerPieces);
        else for (let i = 0; i < blackPieces.length; i++)
            if(blackPieces[i].id == selectedPiece.pieceId)
                blackPieces[i].addEventListener("click", getPlayerPieces);
        enableCells();
    }
    else if(!selectedPiece.hasJumps) {
        if(turn == "white") {
            turn = "black";
            document.getElementById("move").innerHTML = "Ход черных";
        }
        else {
            turn = "white";
            document.getElementById("move").innerHTML = "Ход белых";
        }
        piecesMoves = [];
        turn == "white" ? giveOnClicks(whitePieces) : giveOnClicks(blackPieces);
    } 
}
