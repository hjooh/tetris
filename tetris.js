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
let requestId = null;
let score = 0;


// HELPER FUNCTIONS

// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

// uses the Fisher-Yates shuffle
// @see https://en.wikipedia.org/wiki/Fisher–Yates_shuffle
function shuffle(array) {
    for (let i = array.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getNextPiece() {
    if (bag.length === 0) {
        bag = [1,2,3,4,5,6,7]
        shuffle(bag);
    }
    return bag.pop();
}

function showNext() {
    // clear the canvas
    nextCtx.clearRect(0, 0, nextPanel.width, nextPanel.height);
    
    nextPieces.forEach((pid, index) => {
    // draw (same logic as main)
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

function resetGame() {
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
    const firstPiece = nextPieces.shift();
    nextPieces.push(getNextPiece());
    currentPiece = new Piece(ctx, firstPiece);
    showNext();
    game();
}

function clearLines() {
    let needsToBeCleared = 0;

    board.forEach((row, y) => {
        if (row.every(value => value != 0)) {
            needsToBeCleared++;
            board.splice(y, 1); // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
            temp = new Array(COLS).fill(0);
            board.unshift(temp); // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
        }
    })

    if (needsToBeCleared > 0) {
        // TODO: update score
    }
}

// GAME LOOP - gravity
function game(t=0) {
    time.elapsed = t - time.start;
    if (time.elapsed > time.level) {
        currentPiece.move(0, 1);

        if (!currentPiece.valid(board)) {
            currentPiece.move(0, -1);
            currentPiece.place(board);
            clearLines();
            popNextPiece();
            
        }

        time.start = t;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showBoard();
    currentPiece.draw();
    requestId = requestAnimationFrame(game);
}

function popNextPiece() {
    const nextPiece = nextPieces.shift();
    currentPiece = new Piece(ctx, nextPiece);
    nextPieces.push(getNextPiece());
    showNext();
}

// KEYBOARD INPUT HANDLING

// @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
// @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
document.addEventListener('keydown', (event) => {

    if(["ArrowUp","ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) {
        event.preventDefault();
    }
    switch(event.code) {
        case "ArrowUp":     // 90 cw
            currentPiece.rotateCW();
            if (!currentPiece.valid(board)) {
                currentPiece.rotateCCW();
            }
            break;
        case "ArrowDown":
            currentPiece.move(0, 1);
            if (!currentPiece.valid(board)) {
                currentPiece.move(0, -1);
                currentPiece.place(board);
                clearLines();
                popNextPiece();
            }
            currentPiece.move(0, 1);
            break;
        case "Space":
            // hard drop
            while (currentPiece.valid(board)) {
                currentPiece.move(0, 1);
            }
            currentPiece.move(0, -1);
            currentPiece.place(board);
            clearLines();
            popNextPiece();
            break;
        case "ArrowLeft":
            currentPiece.move(-1, 0);
            if (!currentPiece.valid(board)) currentPiece.move(1, 0);
            break;
        case "ArrowRight":
            currentPiece.move(1, 0);
            if (!currentPiece.valid(board)) currentPiece.move(-1, 0);
            break;
        case "KeyA":        // 180  
            //
            break;
        case "KeyZ":        // 90 ccw
            //
            break;
        case "KeyC":        // hold
            currentPiece.hold();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showBoard();
    currentPiece.draw();
})

const startButton = document.querySelector('#start-game');
if (startButton) {
    startButton.addEventListener('click', () =>{
        resetGame();
        startButton.blur();
    }) 
} 

