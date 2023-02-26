// двумерный массив, отображающий текущее положение фигур на доске
let boardArray = [
    [ null, 0, null, 1, null, 2, null, 3 ],
    [ 4, null, 5, null, 6, null, 7, null ],
    [ null, 8, null, 9, null, 10, null, 11 ],
    [ null, null, null, null, null, null, null, null ], 
    [ null, null, null, null, null, null, null, null ], 
    [ 12, null, 13, null, 14, null, 15, null ],
    [ null, 16, null, 17, null, 18, null, 19 ],
    [ 20, null, 21, null, 22, null, 23, null ]
]; 
let piecesCounter = 0; 

// html для клетки доски в зависимости от ее положения на доске
function getCell(row, cell) 
{
    let cellColor = (row + cell) % 2 == 0 ? "white" : "black";
    let checker = row < 4 && cellColor == "black" ? `<div class="checker black-piece" id="${piecesCounter++}"></div>` : 
                 (row > 5 && cellColor == "black" ? `<div class="checker white-piece" id="${piecesCounter++}"></div>` : "");
    return `<div id="cell-${row}-${cell}" class="cell ${cellColor}">${checker}</div>`
} 

// заполнение игральной доски клетками и шашками (добавление дочерних элементов board)
function buildBoard() {
    let result = "";
    for (let i = 1; i < boardArray.length + 1; i++) {
        result += `<div id="row-${i}" class="row">`;
        for (let j = 1; j < boardArray[0].length + 1; j++)
            result += getCell(i, j) + "\n";
        result += `</div>`;
    }
    return result;
}

// ссылки на элементы DOM
let boardCells = document.getElementsByClassName("cell");
let whitePieces = document.getElementsByClassName("white-piece");
let blackPieces = document.getElementsByClassName("black-piece");

let turn = "white";
let whiteScore = 12; 
let blackScore = 12;
let playerPieces = whitePieces; // доступные для взаимодействия шашки на текущем ходу

// класс, описывающий конкретную шашку
class Piece {
  constructor(id, index, king, moves, jump) {
    this.pieceId = id;
    this.indexOfBoardPiece = index;
    this.isKing = king;
    this.possibleMoves = moves;
    this.hasJumps = jump;
  }
}

// класс, описывающий варианты смещения шашки согласно ее цвету
class Move {
  constructor(turn, move) {
    this.turn = turn;
    this.move = move;
  }
}

let selectedPiece = new Piece(-1, "", false, [], false);
let piecesMoves = []; // доступные ходы для всех шашек текущего хода
let disableNormalMoves = false; // true, если среди доступных ходов есть те, которые бьют шашку (обязательное взятие шашек - правило)

// проверка выхода очередного хода за пределы доски
function isInBorders(row, cell) {
    return row > -1 && row < 8 && cell > -1 && cell < 8;
}

// доступные для шашки ходы (без взятий шашек)
function getPossibleMoves(piece) {
    let row = parseInt(piece.indexOfBoardPiece[5]) - 1, cell = parseInt(piece.indexOfBoardPiece[7]) - 1;
    let moves = [ new Move("white", [-1, -1]), new Move("white", [-1, 1]), new Move("black", [1, -1]), new Move("black", [1, 1]) ];
    for (let i = 0; i < moves.length; i++)
        if((moves[i].turn == turn) || (piece.isKing)) {
            let newRow = row + moves[i].move[0];
            let newCell = cell + moves[i].move[1];
            if((isInBorders(newRow, newCell)) && (boardArray[newRow][newCell] == null)) 
                piece.possibleMoves.push(`cell-${newRow + 1}-${newCell + 1}`);
        }
    getPossibleJumps(piece); 
}

// доступные для шашки взятия
function getPossibleJumps(piece) {
    let row = parseInt(piece.indexOfBoardPiece[5]) - 1, cell = parseInt(piece.indexOfBoardPiece[7]) - 1;
    let moves = [ new Move("white", [-2, -2]), new Move("white", [-2, 2]), new Move("black", [2, -2]), new Move("black", [2, 2]) ];
    let result = [];
    for (let i = 0; i < moves.length; i++)
        if((moves[i].turn == turn) || (piece.isKing)) {
            let newRow = row + moves[i].move[0], newCell = cell + moves[i].move[1];
            let eatenRow = row + moves[i].move[0] / 2, eatenCell = cell + moves[i].move[1] / 2;
            if((isInBorders(newRow, newCell)) && (boardArray[newRow][newCell] == null) && (boardArray[eatenRow][eatenCell] != null)) {
                if(!document.getElementById(boardArray[eatenRow][eatenCell]).classList.contains(turn + "-piece"))
                   result.push(`cell-${newRow + 1}-${newCell + 1}`);
            }
        }
    // при наличии у шашки доступных взятий стандартные ходы недоступны
    if(result.length > 0) {
        piece.hasJumps = true; 
        piece.possibleMoves = result;
    }
}

// добавление шашкам event listener'ов для взаимодействия с ними игрока
function giveOnClicks(pieces) {
    disableNormalMoves = false;
    // вычисление доступных ходов для всех шашек текущего хода
    for (let i = 0; i < pieces.length; i++) {
        let cell = document.getElementById(pieces[i].id).parentElement.id;
        let isKing = document.getElementById(pieces[i].id).classList.contains("king") ? true : false;
        let moves = [];
        let piece = new Piece(pieces[i].id, cell, isKing, moves, false);
        getPossibleMoves(piece);
        if(piece.hasJumps) disableNormalMoves = true;
        piecesMoves.push(piece);
    }
    // если есть возможность взятия, взаимодействие будет возможно только с теми шашками, у которых есть эта возможность
    if (disableNormalMoves) {
        for (let i = 0; i < piecesMoves.length; i++)
            if(piecesMoves[i].hasJumps)
                document.getElementById(piecesMoves[i].pieceId).addEventListener("click", getPlayerPieces);
    }
    // иначе взаимодействовать можно с любой шашкой текущего хода
    else for (let i = 0; i < pieces.length; i++)
        pieces[i].addEventListener("click", getPlayerPieces);
}

// начало серии функций, вызываемых при нажатии на доступную шашку, определение шашек текушего хода
function getPlayerPieces() {
    playerPieces = (turn == "white") ? whitePieces : blackPieces;
    removeCellOnClicks();
    resetBorders();
}

// удаление атрибутов onclick с клеток доски (которые были добавлены на предыдущем ходу для совершения хода на них)
function removeCellOnClicks() {
    for (let i = 0; i < boardCells.length; i++) {
        boardCells[i].removeAttribute("onclick");
    }
}

// удаление с поля точек, обозначающих доступные ходы
function removeDots() {
    let dotChildren = document.getElementsByClassName("dot");
    for (let i = 0; i < dotChildren.length; i++)
        dotChildren[i].remove();
}

// удаление подсвечивания выбранной шашки
function resetBorders() {
    for (let i = 0; i < playerPieces.length; i++)
        if(playerPieces[i].style.outline != 0) {
            playerPieces[i].style.outline = 0;
        }
    removeDots();
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

// получение информации о выбранной шашке
function getSelectedPiece() {
    let id = parseInt(event.target.id);
    let cell = "";
    selectedPiece.pieceId = id;
    selectedPiece.indexOfBoardPiece = document.getElementById(selectedPiece.pieceId).parentElement.id;
    selectedPiece.isKing = document.getElementById(selectedPiece.pieceId).classList.contains("king") ? true : false;
    for (let i = 0; i < piecesMoves.length; i++)
        if(piecesMoves[i].pieceId == selectedPiece.pieceId) {
            selectedPiece.possibleMoves = piecesMoves[i].possibleMoves;
            selectedPiece.hasJumps = piecesMoves[i].hasJumps;
            break;
        }
    enableCells();
}

// добавление атрибутов onclick клеткам, доступным для хода, для совершения хода на них
function enableCells() {
    document.getElementById(selectedPiece.pieceId).style.outline = "3px solid yellow";
    for (let i = 0; i < selectedPiece.possibleMoves.length; i++) {
        let row = parseInt(selectedPiece.possibleMoves[i][5]) - 1, cell = parseInt(selectedPiece.possibleMoves[i][7]) - 1;
        boardCells[row * 8 + cell].innerHTML = `<div class="dot"></div>`;
        boardCells[row * 8 + cell].setAttribute("onclick", `makeMove('cell-${row + 1}-${cell + 1}')`);
    }
}

// ход (перемещение выбранной шашки и удаление съеденной)
function makeMove(cellChosen) {
    document.getElementById(selectedPiece.pieceId).remove();
    let row = parseInt(selectedPiece.indexOfBoardPiece[5]) - 1, cell = parseInt(selectedPiece.indexOfBoardPiece[7]) - 1;
    boardCells[row * 8 + cell].innerHTML = "";
    let checkerData = `<div class="checker ${turn}-piece` + (selectedPiece.isKing ? " king\"" : "\"") + ` id="${selectedPiece.pieceId}"></div>`;
    let rowTo = parseInt(cellChosen[5]) - 1, cellTo = parseInt(cellChosen[7]) - 1;
    boardCells[rowTo * 8 + cellTo].innerHTML = checkerData;
    
    let checkerEaten = null;
    if((Math.abs(row - rowTo) == 2) || (Math.abs(cell - cellTo) == 2)) {
        checkerEaten = rowTo - row > 0 ? (cellTo - cell > 0 ? `cell-${rowTo}-${cellTo}` : `cell-${rowTo}-${cellTo + 2}`)
                                       : (cellTo - cell > 0 ? `cell-${rowTo + 2}-${cellTo}` : `cell-${rowTo + 2}-${cellTo + 2}`);
    }
    modifyBoard(selectedPiece.indexOfBoardPiece, cellChosen, checkerEaten);
}

// модификация boardArray, присуждение очков и назначение шашки в дамки, если после модификации доски она оказалась в крайнем ряду
function modifyBoard(selectedCell, nextCell, checkerEaten) {
    let row = parseInt(selectedCell[5]) - 1, cell = parseInt(selectedCell[7]) - 1;
    let rowTo = parseInt(nextCell[5]) - 1, cellTo = parseInt(nextCell[7]) - 1;
    boardArray[row][cell] = null;
    boardArray[rowTo][cellTo] = parseInt(selectedPiece.pieceId);
    if ((turn == "black" && selectedPiece.pieceId < 12 && rowTo == 7) || (turn == "white" && selectedPiece.pieceId >11 && rowTo == 0))
        document.getElementById(selectedPiece.pieceId).classList.add("king");
    if (checkerEaten != null) {
        let eatenRow = parseInt(checkerEaten[5]) - 1, eatenCell = parseInt(checkerEaten[7]) - 1;
        boardArray[eatenRow][eatenCell] = null;
        boardCells[eatenRow * 8 + eatenCell].innerHTML = "";
        if (turn == "black" && selectedPiece.pieceId < 12)
            whiteScore--;
        if (turn == "white" && selectedPiece.pieceId > 11)
            blackScore--
    }
    if(!selectedPiece.hasJumps) resetSelectedPieceProperties();
    removeDots();
    removeCellOnClicks();
    removePiecesOnClicks();
}

// удаление event listener'ов с шашек текущего хода
function removePiecesOnClicks() {
    if (turn == "white")
        for (let i = 0; i < whitePieces.length; i++)
            whitePieces[i].removeEventListener("click", getPlayerPieces);
    else for (let i = 0; i < blackPieces.length; i++)
            blackPieces[i].removeEventListener("click", getPlayerPieces);
    changePlayer();
}

// функция, позволяющая шашке совершить еще одно взятие, если шашки стоят в ряд
function settleJumpSeries() {
    selectedPiece.possibleMoves = [];
    selectedPiece.hasJumps = false;
    selectedPiece.indexOfBoardPiece = document.getElementById(selectedPiece.pieceId).parentElement.id;
    getPossibleJumps(selectedPiece);
    if(selectedPiece.hasJumps) {
        for (let i = 0; i < playerPieces.length; i++)
            if(playerPieces[i].id == selectedPiece.pieceId)
                playerPieces[i].addEventListener("click", getPlayerPieces);
        enableCells();
    }
}

// смена игрока 
function changePlayer() {
    // проигрыш одной из сторон при потере всех шашек
    if((whiteScore == 0) || (blackScore == 0)) {
        document.getElementById("move").innerHTML = "Победа" + (whiteScore == 0 ? " черных" : " белых");
        return;
    }
    let noJumpSeries = false;
    if(selectedPiece.hasJumps) 
        settleJumpSeries();
    if(!selectedPiece.hasJumps) {
        if(turn == "white")
            turn = "black";
        else turn = "white";
            document.getElementById("move").innerHTML = "Ход" + (turn == "black" ? " черных" : " белых");
        piecesMoves = [];
        turn == "white" ? giveOnClicks(whitePieces) : giveOnClicks(blackPieces);
    } 
}
