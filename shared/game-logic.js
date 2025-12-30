// Jstris    HTML5 Canvas. It prioritizes extreme minimalism and low latency over graphics.    
// Pure JavaScript. It is lightweight enough to run on a toaster. 
// It uses binary data for networking to keep multiplayer updates fast, but the logic itself is standard JS.

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); 
  // The maximum is exclusive and the minimum is inclusive
}

// Fisher-Yates shuffle (Durstenfeld Shuffle implementation)
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle(array) { 
    for (let i = array.length - 1; i > 0; i--) {
        const j = getRandomInt(0, i + 1)
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Generate the next sequence of pieces
// 7-bag system
function pieceSequenceGen() {
    const PIECES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    let bag = []; // currently queued pieces
    if (bag.length === 0) {
        bag = [...PIECES];
        shuffle(bag);
    }
    return bag.shift();
}

function rotateCW(matrix) {
    return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse());
}

function rotateCCW(matrix) {
    return matrix[0].map((val, index) => matrix.map(row => row[row.length-1-index]));
}

// SRS offset tables: https://harddrop.com/wiki/SRS
const JLSTZ_OFFSET_TABLE = {
  0: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
  1: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  2: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
  3: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
};
const I_OFFSET_TABLE = {
  0: [[0, 0], [-1, 0], [2, 0], [-1, 0], [2, 0]],
  1: [[-1, 0], [0, 0], [0, 0], [0, 1], [0, -2]],
  2: [[-1, 1], [1, 1], [-2, 1], [1, 0], [-2, 0]],
  3: [[0, 1], [0, 1], [0, 1], [0, -1], [0, 2]],
};

function wallKicks(pieceType, rotationIndex, rotationDirection) { // 1: CW, -1: CCW
    if (pieceType === 'O') return; // O pieces do not rotate
    const nextRotationIndex = (rotationDirection === 1) ? (rotationIndex + 1) % 4 : (rotationIndex + 3) % 4;
    const table = (pieceType === 'I') ? I_OFFSET_TABLE : JLSTZ_OFFSET_TABLE;
    const currOffset = table[rotationIndex];
    const nextOffset = table[nextRotationIndex];
    const kicks = []; // 5 possible "kicks" from end to start
    for (let i = 0; i < 5; i++) {
        const x = currOffset[i][0] - nextOffset[i][0];
        const t = currOffset[0][1] - nextOffset[0][1];
        kicks.push({x, y});
    }
    return kicks;
}

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
        dropInterval = 50; // Fast drop
    }
});

document.addEventListener('keyup', event => {
    if (event.key === 'ArrowDown') {
        dropInterval = 1000; // Restore slow speed
    }
});

let dropCounter = 0;
let dropInterval = 1000; // 1s per drop @ start?
let lastTime = 0;

function update(deltaTime) {
    dropCounter += deltaTime;

    if (dropCounter > dropInterval) {
        // time is up, time to force drop piece
        dropPiece();
        dropCounter = 0;
    }
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function gameLoop(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    update(deltaTime);
    draw();
    requestAnimationFrame(gameLoop);

}

reset();
gameLoop();
