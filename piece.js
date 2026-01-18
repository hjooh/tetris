// PIECE CLASS
class Piece {
    constructor(context, pid) {
        this.ctx = context;
        this.pid = pid;
        this.shape = SHAPES[this.pid];
        this.x = 3;
        this.y = 0;
    }

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

    move(dx, dy) {
        this.x = this.x + dx;
        this.y = this.y + dy;
    }

    // @see https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript
    rotateCW() {
        this.shape = this.shape[0].map((val, index) => this.shape.map(row => row[index]).reverse())
    }

    // again, see link above
    rotateCCW() {
        this.shape = this.shape[0].map((val, index) => this.shape.map(row => row[row.length-1-index]));
    }

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

    place(board) {
        this.shape.forEach((row, y) =>{
            row.forEach((cell, x) => {
                if (cell != 0) {
                    board[this.y + y][this.x + x] = cell;
                }
            })
        })
    }

}