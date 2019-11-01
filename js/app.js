/*----- constants -----*/
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
/*----- app's state (variables) -----*/ 
const state = {
    turnPhase: 'setup',
    shipPrimed: null,
}
/*----- cached element references -----*/ 
const playerBoardEl = document.getElementById('player-grid-container');
const opponentBoardEl = document.getElementById('opponent-grid-container');
const playerCoordinateEl = [], opponentCoordinateEl = [];
const bodyEl = document.querySelector('body');

/*----- event listeners -----*/ 
playerBoardEl.addEventListener('click', handleSetupBoardClick);
// opponentBoardEl.addEventListener('click', handleAttackBoardClick);
// bodyEl.addEventListener('contextmenu', handleRightClick);

/*----- functions -----*/
//Create GameBoard Pieces
//1 x 4, 2 x 3, 3 x 2, 1 x 4


//Create GameBoard Function
function handleSetupBoardClick(event) {
    //The only purpose of this event handler is to handle the setUp stage on the player's side of the board, so do nothing if it's not even in the set up stage.
    if (state.turnPhase !== 'setup' || event.target.tagName !== 'DIV') {
        break;
    }
    if (state.shipPrimed !== null && !event.target.classList.includes('boat')) {
        
    }


}

function createGameBoards() {
    for(i=0; i < 10; i++) {
        for(j=0; j < 10; j++) {
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