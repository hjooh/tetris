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

function rotateClockwise(matrix) {
    return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse());
}

function rotateCounterClockwise(matrix) {
    return matrix[0].map((val, index) => matrix.map(row => row[row.length-1-index]).reverse());
}
