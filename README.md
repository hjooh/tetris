# tetris
hi! I love Tetris, and so I decided to get even more familiar with the game by programming my own version of it. I used to play a lot of ranked Tetris on [Tetrio](https://tetr.io/), which I highly recommend checking out if you have some spare time.

## how to play
open `index.html` in your browser of choice, or navigate to this [link](https://hjooh.github.io/tetris/)!

## to-do list
- **scoring system**
- **wall kicks:** allow pieces to rotate and "kick back" even if they are against a wall
  - see for more info: [Tetris SRS](https://tetris.wiki/Super_Rotation_System)
- **ghost piece:** add a "ghost" of where the piece would land
- **input handling:** currently using `keydown` events making the movement speed dependent on the user's OS, to be udpated to a polling(?) input system to eliminate this factor
- **multiplayer mode:** a  version where players can team up with each other so that my friends are willing to play with me (a 4v1 should be more fair, right..?)

## acknowledgements & citations
while I built this project from scratch, I did reference the following resources to get me started and for some specific algorithms:
- matrix rotation: [StackOverflow](https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript)
- fisher-yates shuffle: [Wikipedia](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle)
- MDN web docs: [Mozilla Web Docs](https://developer.mozilla.org/en-US/)
- reference implementation (a functional, classless implementation I referenced to help understand the game logic): [Basic Tetris HTML and JS game](https://gist.github.com/straker/3c98304f8a6a9174efd8292800891ea1)