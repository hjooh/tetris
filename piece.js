// PIECE CLASS
// handles a tetromino's (https://en.wikipedia.org/wiki/Tetromino) appearance, 
// movement, rotation, and placement on the game board
class Piece {
    
    constructor(context, pid) {
        this.ctx = context;     // HTML Canvas context - used to visualize the piece
        this.pid = pid;         // piece ID (which shape)
        this.shape = SHAPES[this.pid];      // 2D array that represents the shape (matrix)
        this.x = 3;     // starting x position (centered)
        this.y = 0;     // starting y position (top of board)
    }

    // renders the piece on the Canvas by looping through each individual cell in the matrix and 
    // converting the grid coordinates to pixels on the board using the block size
    draw() {
        this.ctx.fillStyle = COLORS[this.pid];
        this.shape.forEach((row, y)=> {
            row.forEach((color, x) =>{
                if (color > 0) {
                    this.ctx.fillRect((this.x + x) * BLOCK_SIZE, (this.y + y)* BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            })
        })
    }

    // moves the piece by given amounts dx and dy
    move(dx, dy) {
        this.x = this.x + dx;
        this.y = this.y + dy;
    }

    // transposes and reverses the rows to rotate the matrix 90 degrees clockwise, a fun trick used
    // to rotate matrices
    // @see https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript
    rotateCW() {
        this.shape = this.shape[0].map((val, index) => this.shape.map(row => row[index]).reverse())
    }

    // uses the same trick to rotate the matrix 90 degrees counterclockwise
    // again, see the link above for credit
    rotateCCW() {
        this.shape = this.shape[0].map((val, index) => this.shape.map(row => row[row.length-1-index]));
    }

    // checks if the piece can be put in a specific position, returning true if the position is "allowed"
    // or false if it will collide with the edges of the board (walls) or another piece
    valid(board) {
        return this.shape.every((row, dy) => {
            return row.every((cell, dx) => {
                let x = this.x + dx;
                let y = this.y + dy;
                return (
                    cell === 0 || // "empty" part of the matrix, so it doesn't matter where it goes
                    ((x < COLS && x >= 0) &&
                    (y < ROWS) &&
                    (y < 0 || board[y][x] === 0))
                );
            })
        })
    }

    // copies the piece onto the board permanently, which occurs
    // when the piece lands on the "floor" and can no longer move downwards
    place(board) {
        this.shape.forEach((row, y) =>{
            row.forEach((cell, x) => {
                if (cell != 0) {
                    board[this.y + y][this.x + x] = cell;   // updates the global board array
                }
            })
        })
    }

}