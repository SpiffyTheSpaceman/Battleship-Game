let carrierShip = [0,0,0,0,0];
let battleShip = [0,0,0,0];
let cruiserShip = [0,0,0];
let subMShip = [0,0,0];
let destroyerShip = [0,0];


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
    */

    /*
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
// remainingShips = 
// if(turn === AI && remainingShip > 0) {
//     placeShip()
// } 


/*----- constants -----*/
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
/*----- app's state (variables) -----*/ 
const state = {
    turnPhase: 'setup',
    shipPrimed: null,
    shipOrientation: 'horizontal',
}
//the ship coordinate represents the coordinate the front of the ship is at on the game board.
class Ship {
    constructor(health, imageURL) {
        this.health = health;
        this.orientation = 'horizontal';
        this.coordinate = [];
        this.counter = 1;
        this.image = imageURL;
    }
}

const shipState = {
    typeCarrier: new Ship ([0, 0, 0, 0, 0]),
    typeBattleship: new Ship ([0, 0, 0, 0]),
    typeCruiser: new Ship ([0, 0, 0]),
    typeSubmarine: new Ship ([0, 0, 0]),
    typeDestroyer: new Ship ([0, 0])
}


/*----- cached element references -----*/ 
const playerBoardEl = document.getElementById('player-grid-container');
const opponentBoardEl = document.getElementById('opponent-grid-container');
const playerCoordinateEl = [], opponentCoordinateEl = [];
const portEl = document.getElementById('battleships-container');
const root = document.documentElement;

/*----- event listeners -----*/ 
playerBoardEl.addEventListener('click', handleSetupBoardClick);
// opponentBoardEl.addEventListener('click', handleAttackBoardClick);
// playerBoardEl.addEventListener('contextmenu', handleRightClick);
portEl.addEventListener('click', handleShipSelect);

/*----- functions -----*/
//Create GameBoard Pieces
//5, 4, 3, 3, 2 : carrier, battleship, cruiser, submarine, destroyer
//Step 1: I get click on a ship and which should have a classname. It will store the classname to shipPrimed which will adjust the counter of the ship objects. 
//Step 2: I will click on a square which will change the element and neighboring elements to have a class of active, orientation, ship type, 




//Create GameBoard Function

function handleShipSelect(event) {
    // If the stage isn't in setUp, do nothing.
    if(state.turnPhase !== 'setup') {
        return;
    }

    //if a ship wasn't clicked on:
    if (event.target.tagName !== 'IMG') {
        //the primeShip function will unprime the current state.shipPrimed if there is already a primed ship, if there is no primed ship, it will just do nothing.
        primeShip(null, state.shipPrimed);
        return;
    }

    //Get the type of ship that was clicked on.
    let shipType = findShipType(event.target);

    //Assuming that a ship was clicked on, if the ship clicked on doesn't have anymore left in port (Note: if there is no more left in port, that means the ship was already placed on the board)unprime the currently primed if one exists or else do nothing. OR if the ship clicked on is the same as the ship that is currently primed, just unprime the currently primed ship.
    if ((shipState[shipType].counter === 0) || shipType === state.shipPrimed) {
        primeShip(null, state.shipPrimed);
        return;
    }

    //Assuming that a ship was clicked on that has ships in port and not the same as the currently primed ship, use the primeShip function. The primeShip function will unprime the current primed ship first; if there is no currently primed ship, it will just do nothing. Then, prime the ship that was clicked on.
    primeShip(shipType, state.shipPrimed);
    return;
}


function handleSetupBoardClick(event) {
    //The only purpose of this event handler is to handle the setUp stage on the player's side of the board, so do nothing if it's not even in the set up stage.
    if (state.turnPhase !== 'setup' || event.target.tagName !== 'DIV') {
        return;
    }
    let index = [parseInt(evt.target.id[3]), parseInt(evt.target.id[5])];

    //If there is no ship selected, and we click on a ship on the board that has already been placed, remove it and set it as shipPrimed.
    if (!state.shipPrimed) {
        if (event.target.classList.contains('active')) {
            let shipType = findShipType(event.target);
            removeShip(shipType);
            return;
        }
        else {
            return;
        }
    } 

    //Assuming the ship is primed, if the player clicks on a square in which the ship would overlap the edges of the game board, return and end function.
    //NOTE: I don't replace any ships that are already on the coordinate here, because if it does replace, it would be placed on a square that overlap the edges of the gameboard.  I am making it so that the currently primed ship overlapping the edges has a higher priority than if there is already a ship there that needs to be replaced to make room for the primed ship.
    
    if (state.shipOrientation === 'horizontal' && (index[0] + shipState[state.shipPrimed].health.length - 1) > 9 ||
        (state.shipOrientation === 'vertical' && (index[1] + shipState[state.shipPrimed].health.length - 1) > 9)) {
        return;
    }
    
    //Assuming the ship is Primed and doesn't overlap, If the elements that the ship would have taken up are already taken by another ship, then replace that ship with the currently primed ship and set the ship that was already active to shipPrimed. HOWEVER, if multiple ships exist on the squares it would take up, have it do nothing.
    // let neighborIndexes = getNeighborIndexes(index[0], index[1]);
    let neighboringShips = [];


    //This will loop through each neighboring element and push each unique ship type that exists in the neighboring elements into the neighboringShips Array.
    loopEachShipSquare(state.shipPrimed, (element) => {
        let shipType = findShipType(element);
        if (shipType) {
            if (neighboringShips.length === 0) {
                neighboringShips.push(shipType);
            } else if (neighboringShips.length > 0 && !neighboringShips.includes(type)) {
                neighboringShips.push(shipType);
            }
        };
    }
    , index[0], index[1])
    //If there are multiple ships already on the square that the ship would take up, do nothing.
    if (neighboringShips.length > 1) {
        return;
    }
    if (neighboringShips.length === 1) {
        addShip();
    } 
    let shipExists = checkNeighbors(neighborIndexes[0], neighbordIndexes[1]);
     if (shipExists);
}


//This will be a function that will be like the forEach method except it will loop through every element that a ship that has already been placed occupies and runs a given callback function. It accepts the shiptype name as a parameter and a callback function. The row and col values by default will be based on the ship's starting coordinate on the board, however, it can be specified such as if we are checking the rows and col for a ship not yet placed but rather, pending placement.
function loopEachShipSquare(shipType, callback, row = shipState[shipType].coordinate[0], col = shipState[shipType].coordinate[1]) {
    // let row = shipState[shipType].coordinate[0];
    // let col = shipState[shipType].coordinate[1];
    let shipLength = shipState[shipType].health.length;
    if (shipState[shipType].orientation === 'horizontal') {
        for (i = 0; i < shipLength; i++) {
            callback(playerCoordinateEl[row + i][col]);
        }
    } else {
        for (i = 0; i < shipLength; i++) {
            callback(playerCoordinateEl[row][col + i]);
        }
    }
}




//This function will remove a ship from the player's board and set that ship to be primed instead.
function removeShip(shipType) {
    loopEachShipSquare(shipType, function(element) {
        element.classList.remove(shipType, 'active');
    })
    primeShip(shipType);
}



//This will be a function that will go through the classNames of a DOM Element and see if there is a class of ship type. If so, it will return the name of that ship type, otherwise it will return an empty string.
function findShipType(element) {
    let shipType;
    element.classList.forEach( classItem => {
        if (classItem.includes('type')) {
            shipType = classItem;
        } else {
            return;
        };
    })
    return shipType;
}




//This is a function that will prime newShipType and unprime oldShipType. They are optional arguments.
function primeShip(newShipType, oldShipType) {
    if (oldShipType) {
        shipState[oldShipType].counter = 1;
        shipState[oldShipType].orientation = 'horizontal';
        //render the changes if the function is JUST unpriming and not priming.
        if (!newShipType) {
            state.shipPrimed = null;
            root.style.setProperty('--ship-image', 'transparent');
            root.style.setProperty('--ship-orientation', 'horizontal');
            return;
        }
    }

    if (newShipType) {
        //Change the ship counter since it is in prime, it means it hasn't been placed yet.
        shipState[newShipType].counter = 1;
        state.shipPrimed = newShipType;
        state.shipOrientation = shipState[newShipType].orientation;
        //below is the rerendering, have to decide if it will be done in a render function or not.
        root.style.setProperty('--ship-image', 'blue');
        root.style.setProperty('--ship-orientation', state.shipOrientation);
    }
    //I could have a render function here.
    // render() 
}



function createGameBoards() {
    for (i=0; i < 10; i++) {
        playerCoordinateEl.push([]);
        opponentCoordinateEl.push([]);
        for (j=0; j < 10; j++) {
            playerCoordinateEl[i][j] = document.createElement('div');
            opponentCoordinateEl[i][j] = document.createElement('div');
            playerCoordinateEl[i][j].id = `p-r${i}c${j}`;
            opponentCoordinateEl[i][j].id = `o-r${i}c${j}`;
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