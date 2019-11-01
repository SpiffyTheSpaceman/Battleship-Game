/* Pseudo Code
let state.stage = to either Set Up, Playing, Winner, or Loser since there are two main parts to the game: the player's set up stage and the playing stage.
let state.shipPrimed = false. This will be the state for whether or not a player clicked on a ship during the set up stage. This will let me know that they have selected a ship and the next click on the playerBoard should be to place the ship there.
let state.ready = true or false, it will check to see if the player's ship have all been placed and the game is ready to play, it will allow the play button to be clickable.
let state.playerScore = 0;
let state.enemyScore = 0;

addEventListener to playerBoard, attackBoard, Play Button, and Reset Button.

init {
    set up GameBoard {
        inject DOMElements into the grid containers.
        set all states back to default.
        Place the computer's ships randomly on the board. {
            use Math.Rand to determine if a ship will b placed vertically or horizontally. 
            Based on if it is vertical or horizontal, Math.Rand again based on where the computer can place the ships.
        }
    }
}

in playerBoardHandleClick {
    if state.stage = Playing || Winner || Loser = false {
        return since setting up ships should be not allowed at these states.
    }


    let index = [parseInt(evt.target.id[1]) + parseInt(evt.target.id[3])]
    let neighborIndexes = checkNeighborElements(r, c):
    this will be a function that will check the elements in the grid container to see what divs the ship will take up and return an array of those indexes.

    let shipExists = shipPresent(neighborIndexes);
    this will be a function that will check the neighboring indexes if there is a ship. it will return true if there is a ship already on those indexes. 

    if state.shipPrimed = false {
        if shipExists = true {
            remove the ship from the div and set state to ship primed.
        }
        else {
            return; basically do nothing if there is no ship primed and no element with a ship was clicked.
        }
    }

    if (evt.target has an edge nearby that the ship will overlap)
        return so that the play cant place a ship over an edge.
    if (evt.target has a ship on it already), it will replace the ship with the one currently primed. And the ship that was there will be the one primed. Then, it will return to end the handler.

    Otherwise {
        set the corresponding divs based on the type of ship, orientation of ship, and the index of the clicked element. Change the class of the DOMObject to have a className of 'active' and the ship type and orientation. 
    }

    checkAllShipsPlayed()
    function that will check if all the ships were placed, if yes, set state ship to true.
}

in playerHandleRightClick {
    set the state of the ship to rotated
    set the styling of the pseudoclass :hover to show the image rotated.
}

in playButtonHandleClick {
    if ships not all placed, return. 
    set stage to playing.
}

in resetButtonBlick {
    run init();
}

in attackBoardClick {
    if stage === SetUp || Winner || Loser || evt.target.className = active{
        return;
    } Make sure attackboard is unclickable when game is still being set up or if it's over. Also if it was already clicked before, do nothing.
    enemyShipExists = checkEnemeyShip() function that will check if the clicked element has a enemy ship on it and returns true or false.

    if enemyShipExists {
        then it will mark the element as div and set the counter of state.hitScore += 1
        add class name of enemyShipHit.
        checkShipSunk();
        function that will check if ship was sunk
    }
    add className to active to make sure it can't be clicked again.

    runEnemyAi();
}

runEnemyAi();
stuff I will figure out.

*/
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
        playerCoordinateEl.push([]);
        opponentCoordinateEl.push([]);
        for(j=0; j < 10; j++) {
            playerCoordinateEl[i][j] = document.createElement('div');
            opponentCoordinateEl[i][j] = document.createElement('div');
            playerCoordinateEl[i][j].id = `player-r${i}c${j}`;
            opponentCoordinateEl[i][j].id = `opponent-r${i}c${j}`;
            playerBoardEl.appendChild(playerCoordinateEl[i][j]);
            opponentBoardEl.appendChild(opponentCoordinateEl[i][j]);
        }
    }
}

function init() {
    state.turnPhase = 'setup';

}

createGameBoards();
init();