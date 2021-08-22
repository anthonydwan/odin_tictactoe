//  implement more getter functions

const player = (playerIndex) => {
    this.playerIndex = playerIndex

    let movesMade = []

    const registerPlayerMove = (cell) => {
        movesMade.push(cell)
    };

    return {
        get playerIndex() {
            return playerIndex
        },
        get movesMade() {
            return movesMade
        },
        registerPlayerMove
    }
}

const humanPlayer = (playerIndex) => {
    const mode = "human"
    return Object.assign(
        {
            mode
        },
        player(playerIndex)
    )
};

const aiPlayer = (playerIndex) => {

    const mode = "ai"

    const makeRandomMove = () => {
        const moves = gameBoard.getLegalMoves()
        const nextMove = moves[Math.round(Math.random() * (moves.length - 1))]
        return nextMove
    }

    const predictLegalMoves = (predictBoard) => {
        let legalCells = []
        for (cell in predictBoard) {
            if (predictBoard[cell] === "_") {
                legalCells.push(parseInt(cell))
            }
        }
        return legalCells
    }

    const gameScore = (player, move, predictBoard, depth) => {
        if (player === "ai" && predictWin(move)) {
            return 150 - depth
        }
        else if (player === "human" && predictWin(move)) {
            return -100 + depth
        }
        else if (predictDraw(predictBoard)) {
            return 0
        }
    }

    const predictWin = (move) => {
        for (let i = 0; i < gameControl.winningSets.length; i++) {
            const winCondition = gameControl.winningSets[i]
            if (winCondition.every(v => move.includes(v))) {
                return true
            }
        } return false
    }

    const predictDraw = (predictBoard) => {
        if (Object.keys(predictBoard).every((k) => predictBoard[k] != "_")) {
            return true
        }
        return false
    }

    // makeBestmove (ai) -> find bestscore of nextmove -> makeBestmove(human)
    const minimax = (player, predictBoard, predictSelfMoves, predictOppMoves, depth) => {
        if (player === "ai") {
            result = gameScore(player, predictSelfMoves, predictBoard, depth)
        } else if (player === "human") {
            result = gameScore(player, predictOppMoves, predictBoard, depth)
        }
        // recursion ends when the move leads to an end
        if (result != null) {
            return result
        } else {
            // recursion on minimax 
            const moves = predictLegalMoves(predictBoard)
            if (player === "ai") {
                let bestScore = -Infinity;
                for (let i = 0; i < moves.length; i++) {
                    const move = moves[i]
                    // maximise score for ai 
                    predictSelfMoves.push(move)
                    predictBoard[move] = playerIndex
                    // find the score of the board assuming we made the move
                    let score = minimax("human", predictBoard, predictSelfMoves, predictOppMoves, depth + 1)
                    // reverse it so we don't fill up the board before next turn 
                    predictBoard[move] = "_";
                    predictSelfMoves.pop();
                    bestScore = Math.max(score, bestScore);
                }
                return bestScore
            } else if (player === "human") {
                let bestScore = Infinity;
                for (let i = 0; i < moves.length; i++) {
                    const move = moves[i]
                    // minimise score for ai 
                    predictOppMoves.push(move)
                    predictBoard[move] = gameControl.getHumanPlayer().playerIndex
                    // find the score of the board assuming we made the move
                    let score = minimax("ai", predictBoard, predictSelfMoves, predictOppMoves, depth + 1)
                    // reverse it so we don't fill up the board before next turn 
                    predictBoard[move] = "_";
                    predictOppMoves.pop();
                    bestScore = Math.min(score, bestScore);
                }
                return bestScore
            }
        }
    }

    const makeBestMove = () => {
        let predictBoard = { ...gameBoard.board }
        let predictOppMoves = [...gameControl.getHumanPlayer().movesMade]
        let predictSelfMoves = [...gameControl.getAiPlayer().movesMade]
        let bestScore = -Infinity;
        let bestMove;
        const moves = predictLegalMoves(predictBoard)
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i]
            // maximise score for ai 
            predictSelfMoves.push(move)
            predictBoard[move] = playerIndex
            // find the score of the board assuming we made the move
            let score = minimax("human", predictBoard, predictSelfMoves, predictOppMoves, 0)
            // reverse move made so we don't fill up the board before next prediction
            predictBoard[move] = "_";
            predictSelfMoves.pop()
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        return bestMove
    }

    return Object.assign(
        {
            mode,
            makeRandomMove,
            makeBestMove
        },
        player(playerIndex)
    )
};

const gameBoard = (() => {

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

    const resetBoard = () => {
        board = createBoard()
    }

    return {
        get board() {
            return board
        },
        resetBoard,
        getLegalMoves,
        setMove
    }
})();

const displayControl = (() => {
    const _container = document.querySelector("#container")
    const p1 = document.querySelector("#p1")
    const p2 = document.querySelector("#p2")

    const displaySymbol = (playerIndex)=>{
        const symbol = document.createElement("p")
        if (playerIndex === 0){
            return "X"
        } else{
            return "O"
        }
    }

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
        div.textContent = displaySymbol(playerIndex)
    };

    const resetBoard = () => {
        for (let i = 0; i < 9; i++) {
            const div = getCellDiv(i)
            div.classList.remove("player0", "player1")
            div.textContent = ""
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

    const toggleGameEndText = (mode="show") =>{
        const prompt = document.querySelector("#prompt")
        if (mode==="show"){
            prompt.classList.remove("hidden")
        } else if (mode ==="hide")
            prompt.classList.add("hidden")
    }

    createBoard()
    p1.addEventListener('click', changeModeDisplay)
    p2.addEventListener('click', changeModeDisplay)

    return {
        toggleGameEndText,
        displayMove,
        resetBoard
    };

})();

const gameControl = (() => {
    const p1 = document.querySelector("#p1")
    const p2 = document.querySelector("#p2")

    let player0 = humanPlayer(0);
    let player1 = humanPlayer(1);
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
        const board = gameBoard.board
        return (gameBoard.getLegalMoves(board).includes(cellNumber) ? true : false)
    };

    const gameFlow = (playerIndex, cellNumber) => {
        const board = gameBoard.board
        gameBoard.setMove(cellNumber, playerIndex)
        logMoves(playerIndex, cellNumber)
        displayControl.displayMove(playerIndex, cellNumber)
        checkWin(playerIndex)
        checkDraw()
        checkGameEnd(playerIndex)
    }

    const aiGameFlow = (opponent) => {
        const board = gameBoard.board
        const playerIndex = turnControl()
        const nextCell = opponent.makeBestMove()
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

    const getHumanPlayer = () => {
        if (player0.mode === "human") {
            return player0
        }
        else if (player1.mode === "human") {
            return player1
        }
    }

    const registerClick = () => {
        const boxes = document.querySelectorAll(".box")
        for (box of boxes) {
            box.addEventListener('click', registerPlayerMove)
        };
    };

    const createPlayer = (playerObject, playerIndex) => {
        if (playerObject.className === "playerMode") {
            return humanPlayer(playerIndex)
        } else {
            return aiPlayer(playerIndex)
        }
    }

    const reset = function () {
        playerCounter = 0
        gameBoard.resetBoard()
        displayControl.resetBoard()
        gameEnded = false;
        displayControl.toggleGameEndText(mode="hide")
        player0 = createPlayer(p1, 0)
        player1 = createPlayer(p2, 1)
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
        for (let i = 0; i < gameControl.winningSets.length; i++) {
            const winCondition = gameControl.winningSets[i]
            const prompt = document.querySelector("#prompt")
            if (winCondition.every(v => player.movesMade.includes(v))) {
                prompt.textContent = `P${playerIndex + 1} WIN!`
                displayControl.toggleGameEndText()
                return true
            }
        } return false
    }


    const checkDraw = () => {
        const legalMoves = gameBoard.getLegalMoves()
        if (legalMoves.length === 0) {
            prompt.textContent = "DRAW!"
            displayControl.toggleGameEndText()
            return true
        }
        return false
    }

    const checkGameEnd = (playerIndex) => {
        if (checkWin(playerIndex) || checkDraw()) {
            gameEnded = true;
        }
    }

    registerClick()
    restartButton()
    changeMode()

    return {
        getAiPlayer,
        getHumanPlayer,
        winningSets
    }
})();