// GAME
// defines how the Tetris games run via a game loop, handling user input, and tracking the state of the board
// constants referenced in the code are stored in ./constants.js


// GLOBAL VARIABLES
let board = [];
let bag = [];
let currentPiece = null;
let nextPieces = [];
let time = {
    start: 0,
    elapsed: 0,
    level: 1000     // TODO: configure drop speed
};
let requestId = null;       // stores the ID of the current animation frame 
// let score = 0;
let heldPiece = null;
let canHold = true;
let gameOver = false;

// statistics
// let numPlaced = 0;
// let finesse = 0.0;
// let pps = 0.0;
// let kpp = 0.0;


// HELPER FUNCTIONS

// gets a random integer value between [min, max)
// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

// uses the Fisher-Yates shuffle to mix up the provided array of pieces
// @see https://en.wikipedia.org/wiki/Fisher–Yates_shuffle
function shuffle(array) {
    for (let i = array.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// draws pieces from the shuffled bag to generate the next set of pieces
// rather than using RNG, which could result in going several turns without a specific piece
// when the bag is empty, it is refilled with a fresh set of pieces and shuffled again
function getNextPiece() {
    if (bag.length === 0) {
        bag = [1,2,3,4,5,6,7]
        shuffle(bag);
    }
    return bag.pop();
}

// TODO: add statistics
// function showStatistics() {
//     statCtx.clearRect(0, 0, statCtx.canvas.width, statCtx.canvas.height);

// }

// renders the canvas that shows the upcoming pieces
function showNext() {
    // clear the canvas
    nextCtx.clearRect(0, 0, nextPanel.width, nextPanel.height);  
    
    nextPieces.forEach((pid, index) => {
    // draw (same logic as main, expect multiple)
        const shape=SHAPES[pid];
        
        // center
        const offX = 1;
        const offY = (index *3)+1;

        nextCtx.fillStyle = COLORS[pid];

        shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell != 0) {
                    nextCtx.fillRect(
                        (offX + x) * BLOCK_SIZE, 
                        (offY + y) * BLOCK_SIZE, 
                        BLOCK_SIZE, 
                        BLOCK_SIZE
                    );
    }
})
})
    })
}

// renders the held piece 
function showHold() {
    // clear canvas
    holdCtx.clearRect(0, 0, holdCtx.canvas.width, holdCtx.canvas.height);

    // if there is a held piece
    if (heldPiece) {
        const shape=SHAPES[heldPiece];
        // center
        const offX = 1;
        const offY = 1;

        holdCtx.fillStyle = COLORS[heldPiece];

        shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell != 0) {
                    holdCtx.fillRect(
                        (offX + x) * BLOCK_SIZE, 
                        (offY + y) * BLOCK_SIZE, 
                        BLOCK_SIZE, 
                        BLOCK_SIZE
                    );
    }
})
})
    }
}

// renders the actual board the game is played on by looping through the 2D board array
function showBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] > 0) {
                ctx.fillStyle = COLORS[board[row][col]];
                ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
            }
        }
    }
}

// resets the game to its starting state
function resetGame() {
    // cancel the update the frame (communicating with browser), killing the current game
    // makes sure only one version of the game exists at a time
    if (requestId) {
        cancelAnimationFrame(requestId);
        requestId = null;
    }
    
    // reset all global/state variables
    gameOver = false;
    board = new Array(ROWS);
    for (let i = 0; i < board.length; i++) {
        board[i] = new Array(COLS).fill(0);
    }
    score = 0;
    bag = [];
    nextPieces = [];
    for (let i =0; i < 5; i++) {
        nextPieces.push(getNextPiece());
    }

    // set the current active piece
    const firstPiece = nextPieces.shift();
    nextPieces.push(getNextPiece());
    currentPiece = new Piece(ctx, firstPiece);

    canHold = true;
    heldPiece = null;
    showHold();
    showNext();

    // reset and start timers
    time.start = performance.now();
    time.elapsed = 0;
    time.level = 1000;

    game();
}

// checks if a row has been filled and thus needs to be cleared,
// then clears the lines and updates the board as needed
function clearLines() {
    let needsToBeCleared = 0;

    board.forEach((row, y) => {
        if (row.every(value => value != 0)) {
            needsToBeCleared++;

            // remove the row from the array using splice
            board.splice(y, 1); // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
            
            temp = new Array(COLS).fill(0);
            
            // replace the row with an empty row, making the stack of pieces "fall"
            board.unshift(temp); // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
        }
    })

    if (needsToBeCleared > 0) {
        // TODO: update score
    }
}

// GAME LOOP
// how the game actually runs
function game(t=0) {
    // change in time
    time.elapsed = t - time.start;

    // gravity check: if conditions are met, the piece should move down
    if (time.elapsed > time.level) {
        currentPiece.move(0, 1);

        // collision check: did the piece hit the floor?
        if (!currentPiece.valid(board)) {
            currentPiece.move(0, -1);   // undo collision
            currentPiece.place(board);  // lock the piece in place
            clearLines();
            canHold = true;
            popNextPiece();
            
        }

        time.start = t;     // reset the timer
    }

    // check if the most recently placed piece ended the game
    if (gameOver) {
        return;
    }

    // update the board
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showBoard();
    currentPiece.draw();
    requestId = requestAnimationFrame(game);
}

// handles the queue of upcoming pieces, updating the next piece when necessary
function popNextPiece() {
    // FIFO queue system
    const nextPiece = nextPieces.shift();
    currentPiece = new Piece(ctx, nextPiece);   // instantiate new active piece using the popped ID
    nextPieces.push(getNextPiece());
    showNext();

    // checks if the newly spawned piece ends the game
    if (!currentPiece.valid(board)) {
        // show game over screen
        gameOver = true;
        cancelAnimationFrame(requestId);    // stop the animation loop to end the game
        requestId= null;
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);   
    }
}



// KEYBOARD INPUT HANDLING

// handles keyboard inputs, allowing the user to manipulate/interact with the board
// @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
// @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
document.addEventListener('keydown', (event) => {

    if (gameOver) {
        return;
    }

    // prevents keyboard inputs from scrolling or affecting the browser window
    if(["ArrowUp","ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) {
        event.preventDefault();
    }
    
    // input cases
    switch(event.code) {

        case "ArrowUp":     // 90 cw
            currentPiece.rotateCW();
            if (!currentPiece.valid(board)) {
                currentPiece.rotateCCW();
            }
            break;

        case "ArrowDown":   // moves piece down
            currentPiece.move(0, 1);
            if (!currentPiece.valid(board)) {
                currentPiece.move(0, -1);
                currentPiece.place(board);
                clearLines();
                canHold = true;
                popNextPiece();
            }
            break;

        case "Space":
            // hard drop
            while (currentPiece.valid(board)) {
                currentPiece.move(0, 1);
            }
            currentPiece.move(0, -1);
            currentPiece.place(board);
            clearLines();
            canHold = true;
            popNextPiece();         
            break;

        case "ArrowLeft":   // moves piece to the left
            currentPiece.move(-1, 0);
            if (!currentPiece.valid(board)) currentPiece.move(1, 0);
            break;

        case "ArrowRight":  // moves piece to the right
            currentPiece.move(1, 0);
            if (!currentPiece.valid(board)) currentPiece.move(-1, 0);
            break;

        case "KeyA":        // 180  
            const notAllowed = [0,3,4,5];   // can't flip these pieces (Z, S, I, O)
            if (notAllowed.includes(currentPiece.pid)) {
                break;
            }
            currentPiece.rotateCW();
            currentPiece.rotateCW();
            if (!currentPiece.valid(board)) {
                currentPiece.rotateCCW();
                currentPiece.rotateCCW();
            }
            break;

        case "KeyZ":        // 90 ccw
            currentPiece.rotateCCW();
            if (!currentPiece.valid(board)) {
                currentPiece.rotateCW();
            }
            break;

        case "KeyC":        // hold
            if (!canHold) return;   // you can only swap once per turn, see https://harddrop.com/wiki/Hold_piece
            const currentpid = currentPiece.pid;
            if (heldPiece === null) { // put the current piece in hold, get a new piece
                heldPiece = currentpid;
                popNextPiece();
            } else {    // swap the current piece with the held one
                const temp = heldPiece;
                heldPiece = currentpid;
                currentPiece = new Piece (ctx, temp);
            }
            canHold = false;
            showHold();
            break;
    }

    if (gameOver) {
        return;
    }

    // update the board
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showBoard();
    currentPiece.draw();
})

// allows the user to begin the game
const startButton = document.querySelector('#start-game');
if (startButton) {
    startButton.addEventListener('click', () =>{
        resetGame();    // initialize game state
        startButton.blur();     // remove focus from button
    }) 
} 

