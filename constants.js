const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const canvas = document.querySelector('#board');
const ctx = canvas.getContext('2d'); 

const score = NULL;
const start = NULL;

// piece color palette to do "paint by colors"
const COLORS = [
    'black',  // 0  empty space
    'cyan',   // 1  I
    'blue',   // 2  J
    'orange', // 3  L
    'yellow', // 4  O
    'green',  // 5  S
    'purple', // 6  T
    'red'     // 7  Z
]

// piece definitions (numbers aligned to the COLORS)
const PIECES = [
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // I
    [[2, 0, 0], [2, 2, 2], [0, 0, 0]],                        // J
    [[0, 0, 3], [3, 3, 3], [0, 0, 0]],                        // L
    [[4, 4], [4, 4]],                                         // O
    [[0, 5, 5], [5, 5, 0], [0, 0, 0]],                        // S
    [[0, 6, 0], [6, 6, 6], [0, 0, 0]],                        // T
    [[7, 7, 0], [0, 7, 7], [0, 0, 0]]                         // Z
]
