/*----- constants -----*/
const colors = {
    shipPrimeHover: '#E718A4',
    error: 'red'
}

/*----- app's state (variables) -----*/ 
const state = {
    phase: 'setup',
    shipPrimed: null,
    orientation: null,
    turn: 1
}

const pastAiChoice = [];
let aiDelay;
//the ship coordinate represents the coordinate the front of the ship is at on the game board.
class Ship {
    constructor(health, image) {
        this.health = health;
        this.orientation = 'horizontal';
        this.coordinate = [null, null];
        this.counter = 1;
        this.attachedImage = document.createElement('img');
        this.attachedImage.src = image;
        //pointerEvents will make it so that I can still click on the square the image of the ship is placed on instead of covering it.
        this.attachedImage.style.pointerEvents = 'none';
        this.attachedImage.style.width = `calc(${this.health.length} * var(--square-size)`;
        this.attachedImage.style.height = 'var(--square-size)'
        this.attachedImage.style.objectFit = 'contain';
        this.attachedImage.style.placeSelf = 'center';
        this.attachedImage.style.zIndex = 15;
    }
}

const playerShipState = {
    typeCarrier: new Ship ([0, 0, 0, 0, 0], '/src/assets/Carrier.gif'),
    typeBattleship: new Ship ([0, 0, 0, 0], '/src/assets/Battleship.gif'),
    typeCruiser: new Ship ([0, 0, 0], '/src/assets/Cruiser.png'),
    typeSubmarine: new Ship ([0, 0, 0], '/src/assets/Submarine.png'),
    typeDestroyer: new Ship ([0, 0], '/src/assets/Destroyer.png')
}

const enemyShipState = {
    typeCarrier: new Ship ([0, 0, 0, 0, 0], '/src/assets/Carrier.gif'),
    typeBattleship: new Ship ([0, 0, 0, 0], '/src/assets/Battleship.gif'),
    typeCruiser: new Ship ([0, 0, 0], '/src/assets/Cruiser.png'),
    typeSubmarine: new Ship ([0, 0, 0], '/src/assets/Submarine.png'),
    typeDestroyer: new Ship ([0, 0], '/src/assets/Destroyer.png')
}


/*----- cached element references -----*/ 
const playerBoardContainerEl = document.getElementById('player-side');
const opponentBoardContainerEl = document.getElementById('opponent-side');

const playerBoardEl = document.getElementById('player-grid-container');
const opponentBoardEl = document.getElementById('opponent-grid-container');

const playerCoordinateEl = [], opponentCoordinateEl = [];

const portEl = document.getElementById('battleships-container');

const root = document.documentElement;

const resetEl = document.getElementById('reset');
const readyEl = document.getElementById('ready');

const winMessageEl = document.getElementById('win-message');
const sinkMessageEl = document.getElementById('sunk-message');

const shipHoverEl = document.getElementById('ship-primed-hover');
/*----- event listeners -----*/ 
playerBoardEl.addEventListener('click', handleSetupBoardClick);
opponentBoardEl.addEventListener('click', handleAttackBoardClick);
document.addEventListener('contextmenu', handleRightClick);
portEl.addEventListener('click', handleShipSelect);
resetEl.addEventListener('click', init);
readyEl.addEventListener('click', handleReadyButton);

document.addEventListener('mousemove', changeShipHoverPos); 

playerBoardEl.addEventListener('mouseover', handlePlayerBoardMouseOver);
playerBoardEl.addEventListener('mouseout', handlePlayerBoardMouseOut);

/*----- functions -----*/

//Function to handle selecting ships from the portEl.
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
        render();
        return;
    }

    //Get the type of ship that was clicked on. (at this point, event.target is definitely a ship)
    let shipType = findShipType(event.target);
  
    //Assuming that a ship was clicked on, if the ship clicked on doesn't have anymore left in port (Note: if there is no more left in port, that means the ship was already placed on the board)unprime the currently primed if one exists or else do nothing. OR if the ship clicked on is the same as the ship that is currently primed, just unprime the currently primed ship.
    if ((playerShipState[shipType].counter === 0) || shipType === state.shipPrimed) {
       
        primeShip(null, state.shipPrimed);
        render();
        return;
    }

    //Assuming that a ship was clicked on that has ships in port and not the same as the currently primed ship, use the primeShip function. The primeShip function will unprime the current primed ship first; if there is no currently primed ship, it will just do nothing for it. Then, it will prime the ship that was clicked on.
    primeShip(shipType, state.shipPrimed);
    render();
    return;
}

//Function to handle placing ships on the board.
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
            //Re render the mouse over effects on the grid since when you click on a square, it doesn't move out of the square so it won't derender the squares that were activated before. Make it manually rerender.
            handlePlayerBoardMouseOut(event);
            removeShip(playerShipState, shipType);
            primeShip(shipType);
            handlePlayerBoardMouseOver(event);
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
    
    if (((state.orientation === 'horizontal') && (index[1] + playerShipState[state.shipPrimed].health.length - 1) > 9) ||
        ((state.orientation === 'vertical') && (index[0] + playerShipState[state.shipPrimed].health.length - 1) > 9)) {

        return;
    }
    

    //Assuming the ship is Primed and doesn't overlap, If the elements that the ship would have taken up are already taken by another ship, then replace that ship with the currently primed ship and set the ship that was previously there to shipPrimed. HOWEVER, if multiple ships exist on the squares it would take up, have it do nothing. If there are no ships there, just add the ship.
    // let neighborIndexes = getNeighborIndexes(index[0], index[1]);
    let neighboringShips = [];

    //This will loop through each neighboring element and push each unique ship type that exists in the neighboring elements into the neighboringShips Array.
    loopEachShipSquare(playerShipState, state.shipPrimed, (element) => {
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
        addShip(playerShipState, state.shipPrimed, index[0], index[1]);
        //NOTE: We do not need to rerender mouse over effects because in this case, If a ship is added on an empty square, the squares that are animated are still the same even after placement. And it will be deanimated as long as we mouse out.
        //we only need to render here because, if the game is ready, the last ship should only be placed and not replaced.
        render();
    //If there is only 1 ship on the neighboring squares, replace the ship.
    } else if (neighboringShips.length === 1) {
        //Re render the mouse over effects.
        handlePlayerBoardMouseOut(event);
        removeShip(playerShipState, neighboringShips[0]);
        addShip(playerShipState, state.shipPrimed, index[0], index[1]);
        primeShip(neighboringShips[0]);
        handlePlayerBoardMouseOver(event);
        render();
    } 

    
}


//Function so that right click will change the orientation of the ship before being placed.
function handleRightClick(event) {
    if (state.phase !== 'setup') {
        return;
    }
    if (state.shipPrimed) {
        event.preventDefault();
        //This is so if there is a mouse over styling done on the board at the moment, it will be rendered out first, the state will be changed, and then re rendered at the end.
        if (event.target.parentNode.id === 'player-grid-container') {
            handlePlayerBoardMouseOut(event);
        }

        if (state.orientation === 'horizontal') {
            state.orientation = 'vertical';
        } else if (state.orientation === 'vertical') {
            state.orientation = 'horizontal';
        }
        playerShipState[state.shipPrimed].orientation = state.orientation;
        
        //Rerender the mouse over function to rerender since the position has now changed.
        if (event.target.parentNode.id === 'player-grid-container') {
            handlePlayerBoardMouseOver(event);
        }
        render();
    }

}


//The Ready button: It will only be active if all the ships have been placed. It will be rendered differently if it is clickable or not.
function handleReadyButton(event) {
    //If the game is already past set up, the ready button does nothing
    if (state.phase !== 'setup') {
        return;
    }
    let unplacedShips = 0;
    for (let ship in playerShipState) {
        unplacedShips += playerShipState[ship].counter
    }
    if (unplacedShips !== 0) {
        return;
    } else {
        state.phase = 'pending';
        setUpEnemyBoard();
        state.phase = 'playing';
        event.target.textContent = 'PLAYING!';
        sinkMessageEl.textContent = ``;
        sinkMessageEl.style.backgroundColor = 'transparent';
        render();
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
    triggerAi();
}

function triggerAi() {
    //If the game is over, do nothing.
    if (state.phase !== 'playing') {
        return;
    }
    winMessageEl.textContent = 'Skynet is thinking';
    aiDelay = setTimeout(() => {
        let row = null;
        let col = null;
        let squareAvailable = false;

        //This is to test the Ai's win conditions.
        // row = playerShipState.typeDestroyer.coordinate[0];
        // col = playerShipState.typeDestroyer.coordinate[1];
        // if (playerCoordinateEl[row][col].classList.contains('hit') 
        // || playerCoordinateEl[row][col].classList.contains('missed') ) {
        //     if (playerShipState.typeDestroyer.orientation === 'horizontal') {
        //         col += 1;
        //     } else {
        //         row += 1;
        //     }
        // }
    
        //This will decide if a random place on the board to place a ship is available to be placed.
        while (squareAvailable === false) {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            if (!playerCoordinateEl[row][col].classList.contains('hit')
            && !playerCoordinateEl[row][col].classList.contains('missed')) {
                squareAvailable = true;
            }
        }

        //Can use the above code for a simple random Ai.

        //Hard Ai is below.
        


        handleAttack(row, col);
    }, 5000);
}




/* *********************************************************************************
************ Animation Event Handlers *********************************************/

//Function for the mouse move event. Basically, it will make the ship hover image position match the cursor position.
function changeShipHoverPos(event) {
    if (state.phase !== 'setup') {
        return;
    }
    shipHoverEl.style.left = `calc(${event.pageX}px - 2vw)`;
    shipHoverEl.style.top = `calc(${event.pageY}px - 2vw)`;
}


//This event handler is ment to animate the squares a ship would be placed in or animate the squares a ship is currently on during set up. It will also animate if a ship cannot be placed somewhere.
function handlePlayerBoardMouseOver(event) {
    if (state.phase !== 'setup' || event.target.tagName !== 'DIV') {
        return;
    }
    let index = [parseInt(event.target.id[3]), parseInt(event.target.id[5])];

    //Basically, if there is a ship primed:
    if (state.shipPrimed) {


        //If the ship primed goes over the edge, make the ship hover image have a background color of colors.error to indicate a problem.
        if (((state.orientation === 'horizontal') && (index[1] + playerShipState[state.shipPrimed].health.length - 1) > 9) ||
        ((state.orientation === 'vertical') && (index[0] + playerShipState[state.shipPrimed].health.length - 1) > 9)) {
            shipHoverEl.style.backgroundColor =  colors.error;
            return;
        } else {
            //if the squares do not go over the edge:
            let neighboringShips = [];
            //This will loop through each neighboring element and push each unique ship type that exists in the neighboring elements into the neighboringShips Array.
            loopEachShipSquare(playerShipState, state.shipPrimed, (element) => {
                let shipType = findShipType(element);
                if (shipType) {
                    if (neighboringShips.length === 0) {
                        neighboringShips.push(shipType)
                    } else if (neighboringShips.length > 0 && !neighboringShips.includes(shipType)) {
                        neighboringShips.push(shipType);
                    }
                };
            }, index[0], index[1]);
            //If the primed ship overlaps more than 1 ship, also make the ship image hover colors.error.
            if (neighboringShips.length > 1) {
                shipHoverEl.style.backgroundColor =  colors.error;
                return;
            } else {
                //Else, the ship is good to go. Animate the squares it would take.
                loopEachShipSquare(playerShipState, state.shipPrimed, function(element) {
                    element.style.transform = 'scale(1.1)';
                    element.style.backgroundColor = colors.shipPrimeHover;
                }, index[0], index[1]);
                return;
            }
        }
    //If ship is not primed:
    } else if (!state.shipPrimed) {
        let shipType = findShipType(event.target);
        //If a ship exists on the hovered square, animate the squares that the ship takes.
        if (shipType) {
            loopEachShipSquare(playerShipState, shipType, function(element) {
                element.style.transform = 'scale(1.1)';
                element.style.backgroundColor = colors.shipPrimeHover;
            });
            return;
        //Otherwise, just animate the single square.
        } else {
            event.target.style.transform = 'scale(1.1)';
            return;
        }
    }
}

//This Mouse out event is just to set the stylings back to default.
function handlePlayerBoardMouseOut(event) {
    if (state.phase !== 'setup' || event.target.tagName !== 'DIV') {
        return;
    }
    let index = [parseInt(event.target.id[3]), parseInt(event.target.id[5])];

    //Basically, if there is a ship primed:
    if (state.shipPrimed) {
        
        //Get rid of the background color, if any, over the shipHoverEl.
        shipHoverEl.style.backgroundColor = 'transparent';
        //If the ship primed goes over the edge, do nothing. We already removed the background color.
        if (((state.orientation === 'horizontal') && (index[1] + playerShipState[state.shipPrimed].health.length - 1) > 9) ||
        ((state.orientation === 'vertical') && (index[0] + playerShipState[state.shipPrimed].health.length - 1) > 9)) {
            return;
        } else {
            //Else, remove the styling from the neighboring squares.
            loopEachShipSquare(playerShipState, state.shipPrimed, function(element) {
                element.style.transform = 'scale(1.0)';
                element.style.backgroundColor = '';
            }, index[0], index[1]);
            return;
            
        }
    //If ship is not primed:
    } else if (!state.shipPrimed) {
        let shipType = findShipType(event.target);
        //If a ship exists on the hovered square, remove the hover animation on the ship's squares.
        if (shipType) {
            loopEachShipSquare(playerShipState, shipType, function(element) {
                element.style.transform = 'scale(1.0)';
                element.style.backgroundColor = '';
            });
            return;
        //Otherwise, just animate the single square.
        } else {
            event.target.style.transform = 'scale(1.0)';
            return;
        }
    }
}


/* ************************************************************************
********************* Functions ***************************************** */


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

//This will be a function that will be like the forEach method except it will loop through every element that a ship that has already been placed occupies and runs a given callback function. It accepts the playerShipState object and shiptype name as a parameter and a callback function. The row and col values by default will be based on the ship's starting coordinate on the board, however, it can be specified such as if we are checking the rows and col for a ship not yet placed but rather, pending placement.
function loopEachShipSquare(shipState, shipType, callback, row = shipState[shipType].coordinate[0], col = shipState[shipType].coordinate[1]) {

    let boardEl = (shipState === playerShipState ? playerCoordinateEl : opponentCoordinateEl);
    let shipLength = shipState[shipType].health.length;
    if (shipState[shipType].orientation === 'horizontal') {
        for (i = 0; i < shipLength; i++) {
            callback(boardEl[row][col + i]);
        }
    } else {
        for (i = 0; i < shipLength; i++) {
            callback(boardEl[row + i][col]);
        }
    }
}

//This is a function that will prime newShipType and unprime oldShipType. They are optional arguments. Only unprime the oldShipType if you have to send the oldShipType back to the port and reset it to the default orientation.
function primeShip(newShipType, oldShipType) {
    if (oldShipType) {
        playerShipState[oldShipType].orientation = 'horizontal';
        //We dont change ship counter when unpriming since it may be placed on the board (counter = 0) or someone simply selected another ship in the port (counter stays = 1).
        //render the changes if the function is JUST unpriming and not priming.
        if (!newShipType) {
            state.shipPrimed = null;
            return;
        }
    }

    if (newShipType) {
        //Change the ship counter since it is in prime, it means it hasn't been placed yet.
        playerShipState[newShipType].counter = 1;
        state.shipPrimed = newShipType;
        //the state.orientation will have the same current orientation of the ship clicked on. If the ship is in port, it should be horizontal, if it is on the board already, it should be the orientation of how it is placed on the board.
        state.orientation = playerShipState[newShipType].orientation;

    }

}

//This function accepts the playerShipState object (stored in shipState), ship type, and the row, col of the index of the element where the ship is to be added. 
function addShip(shipState, shipType, row, col) {
    //Update the ship's state when it is added to a board.
    shipState[shipType].counter = 0;
    shipState[shipType].coordinate = [row, col];

    //These changes in stylings and state only apply during the setup phase.
    if (state.phase === 'setup') {
        //Based on the other code, the playerShipState.type.orientation should already be the same as state.orientation, but this is just a safety check.
        shipState[shipType].orientation = state.orientation;
        state.shipPrimed = null;
        state.orientation = null;
        //
        portEl.querySelector(`.${shipType}`).classList.add('unavailable');

        //
        //During the set up stage, we want the image of the ship to show up when we place it on the square.
        //This will, based on the coordinate of the ship's coordinate, place an image of the ship spanning the length in the grid that the ship would take up.
        addShipImage(shipState, shipType);

    }
    loopEachShipSquare(shipState, shipType, function(element) {
        element.classList.add(shipType, 'active');
    })
}

//This function will just add the ship image to the board as well.
function addShipImage(shipState, shipType) {
    let boardContainerEl = (shipState === playerShipState) ? playerBoardContainerEl : opponentBoardContainerEl;
    let row = shipState[shipType].coordinate[0];
    let col = shipState[shipType].coordinate[1];
    if (shipState[shipType].orientation === 'horizontal') {
        shipState[shipType].attachedImage.style.gridColumn = `${col + 2} / ${col + 2 + shipState[shipType].health.length}`;
        shipState[shipType].attachedImage.style.gridRow = `${row + 2} / ${row + 3}`;
        shipState[shipType].attachedImage.style.transform = '';
    } else if (shipState[shipType].orientation === 'vertical') {
        shipState[shipType].attachedImage.style.gridRow = `${row + 2} / ${row + 2 + shipState[shipType].health.length}`;
        shipState[shipType].attachedImage.style.gridColumn = `${col + 2} / ${col + 3}`
        shipState[shipType].attachedImage.style.transform = 'rotate(90deg)';
    }
    boardContainerEl.appendChild(shipState[shipType].attachedImage);
}



//This function will remove a ship from the board for the given playerShipState object stored in shipState
function removeShip(shipState, shipType) {
    loopEachShipSquare(shipState, shipType, function(element) {
        element.classList.remove(shipType, 'active');
    });
    shipState[shipType].counter = 1;
    shipState[shipType].coordinate = [null, null];
    //Remove the ship image.
    shipState[shipType].attachedImage.parentNode.removeChild(shipState[shipType].attachedImage);
    //Remove the unavailable class from the ship in port so that it loses it's unavailable styling.
    portEl.querySelector(`.${shipType}`).classList.remove('unavailable');
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
    //If phase is not in playing, do nothing.
    if (state.phase !== 'playing') {
        return;
    }
    let squareEl, shipState;
    //Determine which board and state we are messing with based on whose turn it was.
    if (state.turn === 1) {
        squareEl = opponentCoordinateEl[row][col];
        shipState = enemyShipState;

    } else {
        squareEl = playerCoordinateEl[row][col];
        shipState = playerShipState;
    }
    let shipType = findShipType(squareEl);
    let healthIndex = null;
    //If there is a ship on the square, mark the square as hit and update the ship's state's health.
    if (shipType) {
        squareEl.classList.add('hit');
        //This will determine which index in the ship's health array it needs to update.
        healthIndex = (shipState[shipType].orientation === 'horizontal') 
            ? (col - shipState[shipType].coordinate[1]) 
            : (row - shipState[shipType].coordinate[0]);

        shipState[shipType].health[healthIndex] = 1;
        // if (state.turn === -1) {
        //     pastAiChoice.push
        // }
        checkShipSunk(shipState, shipType);
    } else {
        squareEl.classList.add('missed');
    }
    //change the turn.
    state.turn *= -1;
    render();
}


//This is a function that will check if a ship has been sunk after each hit.
function checkShipSunk(shipState, shipType) {
    if (!shipState[shipType].health.includes(0)) {
        loopEachShipSquare(shipState, shipType, (element) => {
            element.classList.add('sunk');
        })
        let shipName = shipType.substr(4);
        let attacker = (state.turn === 1) ? 'You' : 'Skynet';
        sinkMessageEl.textContent = `${attacker} sunk ${state.turn === 1 ? "Skynet's" : "your"} ${shipName}!`;
        sinkMessageEl.style.backgroundColor = (state.turn === 1) ? '#12E9ED' : '#ED1612';
        //If an enemy ship was sunk, reveal it.
        if (state.turn === 1) {
            addShipImage(shipState, shipType);
        }
    }
}





/* *********************************************************************
************************* Initial Functions ***************************/

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

function init() {
    //If we pressed the rest button mid Ai thinking, stop it.
    clearTimeout(aiDelay);
    state.phase = 'setup';
    state.shipPrimed = null;
    state.orientation = null;
    state.turn = 1;
    for (row=0; row < 10; row++) {
        for(col=0; col < 10; col++) {
            playerCoordinateEl[row][col].className = '';
            opponentCoordinateEl[row][col].className = '';
        }
    }
    for (let ship in playerShipState) {
        playerShipState[ship].orientation = 'horizontal';
        playerShipState[ship].health.fill(0);
        playerShipState[ship].coordinate = [null, null];
        playerShipState[ship].counter = 1;
        if (playerBoardContainerEl.contains(playerShipState[ship].attachedImage)) {
            playerShipState[ship].attachedImage.parentNode.removeChild(playerShipState[ship].attachedImage);
        }
    }
    for (let ship in enemyShipState) {
        enemyShipState[ship].orientation = 'horizontal';
        enemyShipState[ship].health.fill(0);
        enemyShipState[ship].coordinate = [null, null];
        enemyShipState[ship].counter = 1;
        if (opponentBoardContainerEl.contains(enemyShipState[ship].attachedImage)) {
            enemyShipState[ship].attachedImage.parentNode.removeChild(enemyShipState[ship].attachedImage);
        }
    }
    readyEl.textContent = 'Ready?';
    //Reset the styling for the ships at port.
    portEl.querySelectorAll('img').forEach((element) => {
        element.classList.remove('unavailable');
    })
    render();
}

function render () {

    //Render ready button.
    if (state.phase !== 'setup') {
        readyEl.className = '';
        readyEl.textContent = 'PLAYING!';
    } else if (state.phase === 'setup') {
        let unplacedShips = 0;
        for (let ship in playerShipState) {
            unplacedShips += playerShipState[ship].counter;
        }
        if (unplacedShips === 0) {
            readyEl.className = 'clickable';
        } else {
            readyEl.className = '';
        }
        winMessageEl.textContent = 'Set up your Ships!';
        winMessageEl.style.backgroundColor = 'transparent';
        sinkMessageEl.innerHTML = `Left Click to Select and Place the Ships<br>Right Click to Rotate the Ship`;
        sinkMessageEl.style.backgroundColor = 'transparent';
        //Render the Primed ship.
        renderShipPrimed();

    }



    if (state.phase === 'playing') {
        //Counters to see how many ships currently sunk.
        let playerDeadCount = 0;
        let computerDeadCount = 0;
        for (let ship in playerShipState) {
            if (!playerShipState[ship].health.includes(0)) {
                //If i want I can also have the ship image rendered here instead of the check if ships sunk function.
                playerDeadCount += 1;

            }
        }
        for (let ship in enemyShipState) {
            if (!enemyShipState[ship].health.includes(0)) {
                //Same here, if i want I can have the ship image rendered here instead of the check if ships sunk function.
                computerDeadCount += 1;
            }
        }//Render if Winner
        if (playerDeadCount === 5) {
            state.phase === 'Over';
            winMessageEl.textContent = 'You Destroyed Skynet!';
            winMessageEl.style.backgroundColor = '#18E75B';
            sinkMessageEl.textContent = '';
            sinkMessageEl.style.backgroundColor = 'transparent'
        } else if (computerDeadCount === 5) {
            state.phase === 'Over';
            winMessageEl.textContent = 'Skynet Annihilated You!';
            winMessageEl.style.backgroundColor = '#A51414'
            sinkMessageEl.textContent = '';
            sinkMessageEl.style.backgroundColor = 'transparent'
        }
         //Render whose turn it is
         if (state.turn === 1) {
             winMessageEl.textContent = 'It is your turn, ATTACK!';
             winMessageEl.style.backgroundColor = 'transparent';
         }
    }
    
}

//This goes along with the changeShipHoverPos event listener. Any time a ship is primed/unprimed, the appearance of the ship hover image will change to match the currently primed ship and its orientation.
function renderShipPrimed() {
    if (state.shipPrimed) {
        //Basically, the display on init is none so make it visible, load the image, and adjust the size to the ship.
        shipHoverEl.style.display = 'inline-block';
        shipHoverEl.src = playerShipState[state.shipPrimed].attachedImage.src;
        shipHoverEl.style.width = `calc(${playerShipState[state.shipPrimed].health.length} * var(--square-size)`;
        //Based on the orientation, determine the orientation of the image via rotate and adjust the transform origin so that it's not the top left corner that the cursor is on.
        if (state.orientation === 'vertical') {
            shipHoverEl.style.transform = 'rotate(90deg)';
            shipHoverEl.style.transformOrigin = 'calc(var(--square-size) * 0.5) calc(var(--square-size) * 0.5)';
        } else {
            shipHoverEl.style.transform = '';
        } 
        //ReRender the hover effects.
    //if the ship isn't primed, make it disappear.
    } else if (!state.shipPrimed) {
        shipHoverEl.style.display = 'none';
        shipHoverEl.src = '';
    }
}

createGameBoards();
init();

