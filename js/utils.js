'use strict';

function toBoard(x, y) {
  return {
    x: options.board.offX + x * options.board.gridSize,
    y: options.board.offY + y * options.board.gridSize
  }
}
