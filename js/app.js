
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
/*----- app's state (variables) -----*/ 
const state = {
    phase: 'setup',
    shipPrimed: null,
    orientation: 'horizontal',
    turn: 1
}

const pastAiChoice = [];

//the ship coordinate represents the coordinate the front of the ship is at on the game board.
class Ship {
    constructor(health, imageURL) {
        this.health = health;
        this.orientation = 'horizontal';
        this.coordinate = [null, null];
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

const enemyShipState = {
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
const resetEl = document.getElementById('reset');
const readyEl = document.getElementById('ready')

/*----- event listeners -----*/ 
playerBoardEl.addEventListener('click', handleSetupBoardClick);
opponentBoardEl.addEventListener('click', handleAttackBoardClick);
document.getElementById('player-side').addEventListener('contextmenu', handleRightClick);
portEl.addEventListener('click', handleShipSelect);
resetEl.addEventListener('click', init);
readyEl.addEventListener('click', handleReadyButton);

/*----- functions -----*/
//Create GameBoard Pieces
//5, 4, 3, 3, 2 : carrier, battleship, cruiser, submarine, destroyer
//Step 1: I get click on a ship and which should have a classname. It will store the classname to shipPrimed which will adjust the counter of the ship objects. 
//Step 2: I will click on a square which will change the element and neighboring elements to have a class of active, orientation, ship type, 




//Create GameBoard Function

function handleShipSelect(event) {
    // If the stage isn't in setUp, do nothing.
    if(state.phase !== 'setup') {
        return;
    }

    //if a ship wasn't clicked on:
    if (event.target.tagName !== 'IMG') {
     
        //the primeShip function will unprime the current state.shipPrimed if there is already a primed ship, otherwise, it will just do nothing.
        //primeShip takes two optional arguments: the new ship to be primed and the old ship to be unprimed. Unpriming is used only if a ship is also sent back to port.
        //If either argument is empty or null, it will do nothing in regards to the argument that is empty/null
        primeShip(null, state.shipPrimed);
        return;
    }

    //Get the type of ship that was clicked on. (at this point, event.target is definitely a ship)
    let shipType = findShipType(event.target);
  
    //Assuming that a ship was clicked on, if the ship clicked on doesn't have anymore left in port (Note: if there is no more left in port, that means the ship was already placed on the board)unprime the currently primed if one exists or else do nothing. OR if the ship clicked on is the same as the ship that is currently primed, just unprime the currently primed ship.
    if ((shipState[shipType].counter === 0) || shipType === state.shipPrimed) {
       
        primeShip(null, state.shipPrimed);
        return;
    }

    //Assuming that a ship was clicked on that has ships in port and not the same as the currently primed ship, use the primeShip function. The primeShip function will unprime the current primed ship first; if there is no currently primed ship, it will just do nothing for it. Then, it will prime the ship that was clicked on.
    primeShip(shipType, state.shipPrimed);
 
    return;
}


function handleSetupBoardClick(event) {
    //The only purpose of this event handler is to handle the setUp stage on the player's side of the board, so do nothing if it's not even in the set up stage.
    if (state.phase !== 'setup' || event.target.tagName !== 'DIV') {
  
        return;
    }
    
    let index = [parseInt(event.target.id[3]), parseInt(event.target.id[5])];

    //If there is no ship selected, and we click on a ship on the board that has already been placed, remove it and set it as shipPrimed.
    if (!state.shipPrimed) {
   
        if (event.target.classList.contains('active')) {
 
            let shipType = findShipType(event.target);
            removeShip(shipState, shipType);
            primeShip(shipType);
            //We only need to render here because if a ship is removed and all the ships are used is the only case when the ready button's state should be set to unclickable again. If a ship was just merely replaced with another ship, it should have never been ready to begin with.
            render();
            return;
        }
        else {
            return;
        }
    } 

    //Assuming the ship is primed, if the player clicks on a square in which the ship would overlap the edges of the game board, return and end function.
    //NOTE: I don't replace any ships that are already on the coordinate here, because if it does replace, it would be placed on a square that overlap the edges of the gameboard.  I am making it so that the currently primed ship overlapping the edges has a higher priority than if there is already a ship there that needs to be replaced to make room for the primed ship.
    
    if (((state.orientation === 'horizontal') && (index[1] + shipState[state.shipPrimed].health.length - 1) > 9) ||
        ((state.orientation === 'vertical') && (index[0] + shipState[state.shipPrimed].health.length - 1) > 9)) {

        return;
    }
    

    //Assuming the ship is Primed and doesn't overlap, If the elements that the ship would have taken up are already taken by another ship, then replace that ship with the currently primed ship and set the ship that was previously there to shipPrimed. HOWEVER, if multiple ships exist on the squares it would take up, have it do nothing. If there are no ships there, just add the ship.
    // let neighborIndexes = getNeighborIndexes(index[0], index[1]);
    let neighboringShips = [];

    //This will loop through each neighboring element and push each unique ship type that exists in the neighboring elements into the neighboringShips Array.
    loopEachShipSquare(shipState, state.shipPrimed, (element) => {
        let shipType = findShipType(element);
        if (shipType) {
            if (neighboringShips.length === 0) {
                neighboringShips.push(shipType)
            } else if (neighboringShips.length > 0 && !neighboringShips.includes(shipType)) {
                neighboringShips.push(shipType);
            }
        };
    }, index[0], index[1]);

    //If there are multiple ships already on the square that the ship would take up, do nothing.
    if (neighboringShips.length > 1) {
        return;
    //If there are no ships on the neighboring squares, just add the ship.
    } else if (neighboringShips.length === 0 ) {
        addShip(shipState, state.shipPrimed, index[0], index[1]);
        //we only need to render here because, if the game is ready, the last ship should only be placed and not replaced.
        render();
    //If there is only 1 ship on the neighboring squares, replace the ship.
    } else if (neighboringShips.length === 1) {
        removeShip(shipState, neighboringShips[0]);
        addShip(shipState, state.shipPrimed, index[0], index[1]);
        primeShip(neighboringShips[0]);
    } 

    
}


//This will be a function that will be like the forEach method except it will loop through every element that a ship that has already been placed occupies and runs a given callback function. It accepts the shipState object and shiptype name as a parameter and a callback function. The row and col values by default will be based on the ship's starting coordinate on the board, however, it can be specified such as if we are checking the rows and col for a ship not yet placed but rather, pending placement.
function loopEachShipSquare(playerState, shipType, callback, row = playerState[shipType].coordinate[0], col = playerState[shipType].coordinate[1]) {
    // let row = shipState[shipType].coordinate[0];
    // let col = shipState[shipType].coordinate[1];
    let boardEl = (playerState === shipState ? playerCoordinateEl : opponentCoordinateEl);
    let shipLength = playerState[shipType].health.length;
    if (playerState[shipType].orientation === 'horizontal') {
        for (i = 0; i < shipLength; i++) {
            callback(boardEl[row][col + i]);
        }
    } else {
        for (i = 0; i < shipLength; i++) {
            callback(boardEl[row + i][col]);
        }
    }
}

//This function accepts the shipState object (stored in playerState), ship type, and the row, col of the index of the element where the ship is to be added. 
function addShip(playerState, shipType, row, col) {
    playerState[shipType].counter = 0;
    playerState[shipType].coordinate = [row, col];
    //These changes in stylings and state only apply during the setup phase.
    if (state.phase === 'setup') {
        //Based on the other code, the shipState.type.orientation should already be the same as state.orientation, but this is just a safety check.
        playerState[shipType].orientation = state.orientation;
        state.shipPrimed = null;
        root.style.setProperty('--ship-image', 'transparent');
        root.style.setProperty('--ship-orientation', 'none');
    }
    loopEachShipSquare(playerState, shipType, function(element) {
        element.classList.add(shipType, 'active');
    })
}

//This function will remove a ship from the board for the given shipState object stored in playerState
function removeShip(playerState, shipType) {
    loopEachShipSquare(playerState, shipType, function(element) {
        element.classList.remove(shipType, 'active');
    });
    playerState[shipType].counter = 1;
    playerState[shipType].coordinate = [null, null];
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




//This is a function that will prime newShipType and unprime oldShipType. They are optional arguments. Only unprime the oldShipType if you have to send the oldShipType back to the port and reset it to the default orientation.
function primeShip(newShipType, oldShipType) {
    if (oldShipType) {
        shipState[oldShipType].orientation = 'horizontal';
        //We dont change ship counter when unpriming since it may be placed on the board (counter = 0) or someone simply selected another ship in the port (counter stays = 1).
        //render the changes if the function is JUST unpriming and not priming.
        if (!newShipType) {
            state.shipPrimed = null;
            root.style.setProperty('--ship-image', 'transparent');
            root.style.setProperty('--ship-orientation', 'none');
            return;
        }
    }

    if (newShipType) {
        //Change the ship counter since it is in prime, it means it hasn't been placed yet.
        shipState[newShipType].counter = 1;
        state.shipPrimed = newShipType;
        //the state.orientation will have the same current orientation of the ship clicked on. If the ship is in port, it should be horizontal, if it is on the board already, it should be the orientation of how it is placed on the board.
        state.orientation = shipState[newShipType].orientation;
        //below is the rerendering, have to decide if it will be done in a render function or not.
        root.style.setProperty('--ship-image', 'blue');
        root.style.setProperty('--ship-orientation', (state.orientation === 'horizontal' ? 'none' : 'rotate(90deg)'));
    }
    //I could have a render function here.
    // render() 
}

//The Ready button: It will only be active if all the ships have been placed. It will be rendered differently if it is clickable or not.
function handleReadyButton(event) {
    //If the game is already past set up, the ready button does nothing
    if (state.phase !== 'setup') {
        return;
    }
    let unplacedShips = 0;
    for (let ship in shipState) {
        unplacedShips += shipState[ship].counter
    }
    if (unplacedShips !== 0) {
        return;
    } else {
        state.phase = 'pending';
        setUpEnemyBoard();
        state.phase = 'playing';
        event.target.textContent = 'PLAYING!'
        render();
    }
}

//Function so that right click will change the orientation of the ship before being placed.
function handleRightClick(event) {
    event.preventDefault();
    if (state.phase !== 'setup') {
        return;
    }
    if (state.shipPrimed) {
        if (state.orientation === 'horizontal') {
            state.orientation = 'vertical';
        } else if (state.orientation === 'vertical') {
            state.orientation = 'horizontal';
        }
        shipState[state.shipPrimed].orientation = state.orientation;
    }
}

//Function that just creates the grid game boards.
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


//This will place the enemy's board on the ship.
function setUpEnemyBoard() {
    let boardIndex = [];
    for (i=0; i < 10; i++) {
        boardIndex.push([])
        for (j=0; j < 10; j++) {
            boardIndex[i][j] = j;
        }
    }
    for (let ship in enemyShipState) {
        let row = null;
        let col = null;
        let squareAvailable = false;

        //This will decide if a random place on the board to place a ship is available to be placed.
        while (squareAvailable === false) {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            enemyShipState[ship].orientation = Math.floor(Math.random() * 2) ? 'horizontal' : 'vertical';

            //squareAvailable will start off as true and then the code below will set it to false if it fails the checks.
            squareAvailable = true;

            //Basically the randomly chosen squares are free if the ship 1) does not go over an edge and 2) a ship is not already there.
            if (((enemyShipState[ship].orientation === 'horizontal') && (col + enemyShipState[ship].health.length - 1) > 9) ||
            ((enemyShipState[ship].orientation === 'vertical') && (row + enemyShipState[ship].health.length - 1) > 9)) {
                //if the ship goes over the edge, squareAvailable is false.
                squareAvailable = false;
            } else {
                //If a ship is on one of the neighboring squares, set the squareAvailable to false.
                loopEachShipSquare(enemyShipState, ship, (element) => {
                    let shipType = findShipType(element);
                    if (shipType) {
                        squareAvailable = false;
                    };
                }
                , row, col);
            }
        }
        //finally, add the ship to the board.
        addShip(enemyShipState, ship, row, col);
    }
}

function handleAttack(row, col) {
    let squareEl, playerState;
    //Determine which board and state we are messing with based on whose turn it was.
    if (state.turn === 1) {
        squareEl = opponentCoordinateEl[row][col];
        playerState = shipState;

    } else {
        squareEl = playerCoordinateEl[row][col];
        playerState = enemyShipState;
    }
    let shipType = findShipType(squareEl);
    let healthIndex = null;
    //If there is a ship on the square, mark the square as hit and update the ship's state's health.
    if (shipType) {
        squareEl.classList.add('hit');
        healthIndex = (playerState[shipType].orientation === 'horizontal') 
            ? (col - playerState[shipType].coordinate[1]) 
            : (healthIndex = row - playerState[shipType].coordinate[0]);
        playerState[shipType].health[healthIndex] = 1;
        checkShipSunk(playerState, shipType);
    } else {
        squareEl.classList.add('missed');
    }
    //change the turn.
    state.turn *= -1;
    render();
}

function checkShipSunk(playerState, shipType) {
    if (!playerState[shipType].health.includes(0)) {
        loopEachShipSquare(playerState, shipType, (element) => {
            
        })
    }
}

function handleAttackBoardClick(event) {
   //If it is not the playing stage or not even a square, do nothing. If the square has already been clicked on before, do nothing.
   if (state.phase !== 'playing' 
        || event.target.tagName !== 'DIV' 
        || state.turn !== 1
        || event.target.classList.contains('hit')
        || event.target.classList.contains('missed')) {
        return;
    }
    let index = [parseInt(event.target.id[3]), parseInt(event.target.id[5])];
    handleAttack(index[0], index[1]);
    // triggerAi();
}

function triggerAi() {
    //If the game is over, do nothing.
    if (state.phase !== 'playing') {
        return;
    }
    if (pastAiChoice.length === 0) {

    }
}

function init() {
    state.phase = 'setup';
    state.shipPrimed = null;
    for (row=0; row < 10; row++) {
        for(col=0; col < 10; col++) {
            playerCoordinateEl[row][col].className = '';
            opponentCoordinateEl[row][col].className = '';
        }
    }
    for (let ship in shipState) {
        shipState[ship].orientation = 'horizontal';
        shipState[ship].health.fill(0);
        shipState[ship].coordinate = [null, null];
        shipState[ship].counter = 1;
    }
    for (let ship in enemyShipState) {
        enemyShipState[ship].orientation = 'horizontal';
        enemyShipState[ship].health.fill(0);
        enemyShipState[ship].coordinate = [null, null];
        enemyShipState[ship].counter = 1;
    }
}

function render () {
    //Render ready button.
    if (state.phase !== 'setup') {
        readyEl.className = '';
    } else if (state.phase === 'setup') {
        let unplacedShips = 0;
        for (let ship in shipState) {
            unplacedShips += shipState[ship].counter
        }
        if (unplacedShips === 0) {
            readyEl.className = 'active';
        } else {
            readyEl.className = '';
        }

    }
    
    //check if any ships sunk.
    if (state.phase === 'playing') {
        let playerDeadCount = 0;
        let computerDeadCount = 0;
        for (let ship in shipState) {
            if (!shipState[ship].health.includes(0)) {
                playerDeadCount += 1;
            }
        }
        for (let ship in enemyShipState) {
            if (!enemyShipState[ship].health.includes(0)) {
                computerDeadCount += 1;
            }
        }

    //Render if Winner
    if (state.phase === 'playing') {
        let playerDeadCount = 0;
        let computerDeadCount = 0;
        for (let ship in shipState) {
            if (!shipState[ship].health.includes(0)) {
                playerDeadCount += 1;
            }
        }
        for (let ship in enemyShipState) {
            if (!enemyShipState[ship].health.includes(0)) {
                computerDeadCount += 1;
            }
        }
        if (playerDeadCount === 0) {
            state.phase === 'Over';
            console.log('You Won!');
        } else if (computerDeadCount === 0) {
            state.phase === 'Over';
            console.log('Skynet Won!');
        }
    }
}

createGameBoards();
init();