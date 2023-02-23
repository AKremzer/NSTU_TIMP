var piecesCounter = 0

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

var selectedPiece = {
    pieceId: -1,
    indexOfBoardPiece: "",
    isKing: false,
    possibleMoves: []
}

function giveOnClicks() {
    if (turn == "white")
        for (let i = 0; i < whitePieces.length; i++)
            whitePieces[i].addEventListener("click", getPlayerPieces);
    else for (let i = 0; i < blackPieces.length; i++)
            blackPieces[i].addEventListener("click", getPlayerPieces);
}

function getPlayerPieces() {
    if (turn == "white")
        playerPieces = whitePieces;
    else playerPieces = blackPieces;
}

function resetSelectedPieceProperties() {
    selectedPiece.pieceId = -1;
    selectedPiece.indexOfBoardPiece = "",
    selectedPiece.isKing = false,
    selectedPiece.possibleMoves = []
}

function getSelectedPiece() {
    let id = parseInt(event.target.id);
    let cell = "";
    selectedPiece.pieceId = id;
    for (let i = 0; i < 8; i++)
        for (let j = 0; j < 8; j++) {
            if (boardArray[i][j] == id)
                cell = `cell-${i + 1}-${j + 1}`;
        }
    selectedPiece.indexOfBoardPiece = cell;
    selectedPiece.isKing = document.getElementById(selectedPiece.pieceId).classList.contains("king") ? true : false;
    getPossibleMoves();
}

//TODO: getPossibleMoves();
