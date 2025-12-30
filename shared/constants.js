
export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;

export const COLORS = {
    'I': 'cyan',
    'J': 'blue',
    'T': 'purple',
    'O': 'yellow',
    'L': 'orange',
    'Z': 'red',
    'S': 'green'
};

export const tetrominos = {
  'I': [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
  'J': [[1,0,0], [1,1,1], [0,0,0]],
  'L': [[0,0,1], [1,1,1], [0,0,0]],
  'O': [[1,1], [1,1]],
  'S': [[0,1,1], [1,1,0], [0,0,0]],
  'Z': [[1,1,0], [0,1,1], [0,0,0]],
  'T': [[0,1,0], [1,1,1], [0,0,0]]
};

