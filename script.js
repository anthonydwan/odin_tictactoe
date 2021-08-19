const player = () => {
    let movesMade = []

    const registerMove = (cell) =>{
        movesMade.push(cell)
    }

    return {
        movesMade,
        registerMove
    }
}

const gameBoard = (() => {
    // create the board logic in the game

    const createBoard = () => {
        let board = {}
        for (let i = 0; i < 9; i++) {
            board[i] = "_"
        }
        return board
    }

    const getLegalMoves = () => {
        let legalCells = []
        for (cell in board) {
            if (board[cell] === "_") {
                legalCells.push(parseInt(cell))
            }
        }
        return legalCells
    }

    const setMove = (cell, sign) => {
        board[cell] = sign
    }

    let board = createBoard()

    return {
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

    const getCellDiv = (cellNumber) =>{
        return document.querySelector(`#cell${cellNumber}`)
    }

    const displayMove = (playerIndex, cellNumber) => {
        const div = getCellDiv(cellNumber)
        div.classList.add(`player${playerIndex}`)
    }

    const resetBoard = () =>{
        for (let i = 0; i < 9; i++) {
            const div = getCellDiv(i)
            div.classList.remove("player0", "player1")
        }
    }

    createBoard()

    return {
        displayMove,
        resetBoard};

})();

const gameControl = (() => {
    const player0 = player()
    const player1 = player()
    let playerCounter = 0

    const turnControl = () => {
        if (playerCounter === 0) {
            playerCounter++
            return 0
        } else if (playerCounter === 1) {
            playerCounter--
            return 1
        }
    };

    const winningSets = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    const getPlayer = (playerIndex) => {
        return (playerIndex === 0 ? player0: player1)
    }

    const logMoves = (playerIndex, cell) =>{
        return getPlayer(playerIndex).registerMove(cell)
    }

    const checkLegalMove = (cellNumber) => {
        return (gameBoard.getLegalMoves().includes(cellNumber) ? true : false)
    };

    const registerMove = function () {
        const cellNumber = parseInt(this.id.slice(4))
        if (checkLegalMove(cellNumber)) {
            const playerIndex = turnControl()
            gameBoard.setMove(cellNumber, playerIndex)
            logMoves(playerIndex, cellNumber)
            displayControl.displayMove(playerIndex, cellNumber)
            checkWin(playerIndex)
        }
    }

    const registerClick = () => {
        const boxes = document.querySelectorAll(".box")
        for (box of boxes) {
            box.addEventListener('click', registerMove)
        }
    }

    const gameEnd = () => {
    }

    const checkWin = (playerIndex) => {
        const player = getPlayer(playerIndex)
        for (let i = 0; i < winningSets.length; i++){
            const winCondition = winningSets[i]
            if (winCondition.every(v => player.movesMade.includes(v))){
                console.log("WIN!!!!")
                return true
            }
        }
        return false 
    }

    registerClick()
})();


