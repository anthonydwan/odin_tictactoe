const player = () => {

    let movesMade = []

    const registerPlayerMove = (cell) => {
        movesMade.push(cell)
    };

    const getMovesMade = ()=> {
        return movesMade
    }

    return {
        getMovesMade,
        registerPlayerMove
    }
}

const humanPlayer = () => {
    const mode = "human"
    return Object.assign(
        {
            mode
        },
        player()
    )
}

const aiPlayer = (() => {

    const mode = "ai"

    const makeRandomMove = () => {
        const moves = gameBoard.getLegalMoves()
        const nextMove = moves[Math.round(Math.random() * (moves.length - 1))]
        return nextMove
    }

    return Object.assign(
        {
            mode,
            makeRandomMove
        },
        player()
    )
})

const gameBoard = (() => {
    // create the board logic in the game

    const createBoard = () => {
        let board = {}
        for (let i = 0; i < 9; i++) {
            board[i] = "_"
        }
        return board
    }

    let board = createBoard()

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

    const showBoardStatus = () => {
        console.log(board)
    }

    const resetBoard = ()=>{
        board = createBoard()
    }

    const getBoard = () =>{
        return board
    }

    return {
        getBoard,
        resetBoard,
        showBoardStatus,
        getLegalMoves,
        setMove
    }
})();

const displayControl = (() => {
    const _container = document.querySelector("#container")
    const p1 = document.querySelector("#p1")
    const p2 = document.querySelector("#p2")

    const createBoard = () => {
        for (let i = 0; i < 9; i++) {
            const box = document.createElement("div")
            box.classList.add("box")
            box.id = `cell${i}`
            _container.appendChild(box)
        };
    };

    const getCellDiv = (cellNumber) => {
        return document.querySelector(`#cell${cellNumber}`)
    };

    const displayMove = (playerIndex, cellNumber) => {
        const div = getCellDiv(cellNumber)
        div.classList.add(`player${playerIndex}`)
    };

    const resetBoard = () => {
        for (let i = 0; i < 9; i++) {
            const div = getCellDiv(i)
            div.classList.remove("player0", "player1")
        };
    };

    const toggleModes = (object) => {
        object.classList.toggle("playerMode")
        object.classList.toggle("aiMode")
    };

    const changeModeDisplay = function () {
        if ((p1.className === "aiMode" || p2.className === "aiMode") &&
            this.className === "playerMode") {
            toggleModes(p1)
            toggleModes(p2)
        } else {
            toggleModes(this)
        };
    };

    createBoard()
    p1.addEventListener('click', changeModeDisplay)
    p2.addEventListener('click', changeModeDisplay)

    return {
        displayMove,
        resetBoard
    };

})();

const gameControl = (() => {
    const p1 = document.querySelector("#p1")
    const p2 = document.querySelector("#p2")

    let turn = 0;
    let player0 = humanPlayer();
    let player1 = humanPlayer();
    let playerCounter = 0;
    let gameEnded = false;

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
    ];

    const getPlayer = (playerIndex) => {
        return (playerIndex === 0 ? player0 : player1)
    };

    const logMoves = (playerIndex, cell) => {
        return getPlayer(playerIndex).registerPlayerMove(cell)
    };

    const checkLegalMove = (cellNumber) => {
        const board = gameBoard.getBoard()
        return (gameBoard.getLegalMoves(board).includes(cellNumber) ? true : false)
    };

    const gameFlow = (playerIndex, cellNumber) => {
        const board = gameBoard.getBoard()
        gameBoard.setMove(cellNumber, playerIndex)
        logMoves(playerIndex, cellNumber)
        displayControl.displayMove(playerIndex, cellNumber)
        checkWin(playerIndex)
        checkDraw(turn)
        turn++
    }

    const aiGameFlow = (opponent) => {
        const board = gameBoard.getBoard()
        const playerIndex = turnControl()
        const nextCell = opponent.makeRandomMove(board)
        gameFlow(playerIndex, nextCell)
    }

    const registerPlayerMove = function () {
        const cellNumber = parseInt(this.id.slice(4))
        if (checkLegalMove(cellNumber) && !gameEnded) {
            const playerIndex = turnControl()
            gameFlow(playerIndex, cellNumber)
            const aiPlayer = getAiPlayer()
            if (!(aiPlayer === false) && !gameEnded) {
                aiGameFlow(aiPlayer)
            };
        };
    };

    const getAiPlayer = () => {
        if (player0.mode === "ai") {
            return player0
        }
        else if (player1.mode === "ai") {
            return player1
        } else {
            return false
        };
    };

    const registerClick = () => {
        const boxes = document.querySelectorAll(".box")
        for (box of boxes) {
            box.addEventListener('click', registerPlayerMove)
        };
    };

    const createPlayer = (playerObject) => {
        if (playerObject.className === "playerMode") {
            return humanPlayer()
        } else {
            return aiPlayer()
        }
    }

    const reset = function () {
        turn = 0
        playerCounter = 0
        gameBoard.resetBoard()
        displayControl.resetBoard()
        gameEnded = false;
        player0 = createPlayer(p1)
        player1 = createPlayer(p2)
        if (player0.mode === "ai") {
            aiGameFlow(player0)
        }
    }

    const restartButton = () => {
        const _restart = document.querySelector("#restart")
        _restart.addEventListener('click', reset)
    }

    const changeMode = () => {
        p1.addEventListener('click', reset)
        p2.addEventListener('click', reset)
    }

    const checkWin = (playerIndex) => {
        const player = getPlayer(playerIndex)
        for (let i = 0; i < winningSets.length; i++) {
            const winCondition = winningSets[i]
            console.log(player.getMovesMade)
            if (winCondition.every(v => player.getMovesMade().includes(v))) {
                console.log(`Player ${playerIndex +1} WIN!!!!`)
                gameEnded = true
                return true
            }
        }
        return false
    }

    const checkDraw = (turn) => {
        if (turn === 8 && !gameEnded){
            gameEnded = true;
            console.log("DRAW!")
            return true
        }
        return false
    }


    registerClick()
    restartButton()
    changeMode()

    return {
        winningSets
    }
})();


