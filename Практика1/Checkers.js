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
