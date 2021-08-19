const player = (sign) => {
    // 
}

const gameBoard = (() => {
    // create the board logic in the game
    let board = {}
    for (let i = 0; i < 9; i++) {
        board[i] = "_"
    }

    let getLegalMoves = () => {
        let legalCells = []
        for (cell in board) {
            if (board[cell] === "_") {
                legalCells.push(parseInt(cell))
            }
        }
        return legalCells
    }

    let setMove = (cell, sign) => {
        board[cell] = sign
    }

    return {
        // board should be removed later
        board,
        getLegalMoves,
        setMove
    }

})();

const displayControl = (() => {
    const _container = document.querySelector("#container")

    const createBoard = () => {
        for (let i = 0; i < 9; i++) {
            const box = document.createElement("div")
            box.classList.add("box")
            box.id = `cell${i}`
            _container.appendChild(box)
        }
    }
    createBoard()

    const displayMove = () => {
        // once you get a move from the gameControl -> 
        // gameBoard -> display
        // display it 
    }
    return {};
})();


const gameControl = (() => {
    let playerCounter = 0

    const turnControl = () => {
        playerCounter ++
        if (playerCounter ===1){
            return "O"
        } else if (playerCounter === 2){
            playerCounter = 0
            return "X"
        }
    };

    const checkLegalMove = function (cellNumber) {
        return (gameBoard.getLegalMoves().includes(cellNumber) ? true : false) 
    };


    const registerMove = function () {
        const cellNumber = parseInt(this.id.slice(4))
        if (checkLegalMove(cellNumber)) {
            const sign = turnControl()
            gameBoard.setMove(cellNumber, sign)
        }
    }

    const registerClick = () => {
        const boxes = document.querySelectorAll(".box")
        for (box of boxes) {
            box.addEventListener('click', registerMove)
        }
    }

    registerClick()

})();


