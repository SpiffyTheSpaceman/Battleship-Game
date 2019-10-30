/*----- constants -----*/
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
/*----- app's state (variables) -----*/ 
const state = {
    turnPhase: 'setup',

}
/*----- cached element references -----*/ 
const playerBoardEl = document.getElementById('player-grid-container');
const opponentBoardEl = document.getElementById('opponent-grid-container');
const playerCoordinateEl = [], opponentCoordinateEl = [];

/*----- event listeners -----*/ 
/*----- functions -----*/
//Create GameBoard Pieces
//1 x 4, 2 x 3, 3 x 2, 1 x 4


//Create GameBoard Function
function createGameBoards() {
    for(i=0; i < 10; i++) {
        for(j=0; j < 10; j++) {
            let coordinate = i*10 + j;
            playerCoordinateEl[coordinate] = document.createElement('div');
            opponentCoordinateEl[coordinate] = document.createElement('div');
            playerCoordinateEl[coordinate].id = `player-r${i}c${j}`;
            opponentCoordinateEl[coordinate].id = `opponent-r${i}c${j}`;
            playerBoardEl.appendChild(playerCoordinateEl[coordinate]);
            opponentBoardEl.appendChild(opponentCoordinateEl[coordinate]);
        }
    }
}

function init() {
    state.turnPhase = 'setup';

}

createGameBoards();
init();