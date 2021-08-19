const gameBoard = (function(){
    const board = Array(9)


    // reveal public pointers to 
    // private functions and properties

})();

const displayControl = (function(){
    const container = document.querySelector("#container")
    function createBoard(){
        for(let i =0;i< 9; i++){
            const box = document.createElement("div")
            box.classList.add("#box")
            container.appendChild(box)
        }
    }
    return createBoard
})();


// const gameControl



// const player = (sign) => {
//     sign
//     const playMove
//     return {}
// }

const createDisplay = displayControl();
