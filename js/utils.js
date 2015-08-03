'use strict';

function toBoard(x, y) {
  return {
    x: options.board.offX + x * options.board.gridSize,
    y: options.board.offY + y * options.board.gridSize
  }
}

function getTarget(robot, direction) {
  var operations = [{x: 0, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}];
  var currentPos = {x: robot.x, y: robot.y};
  while (currentPos.x < options.board.count - 1 &&
         currentPos.y < options.board.count - 1) {
    if (board[currentPos.x][currentPos.y].direction[direction]) {
      if (board[currentPos.x + operations[direction].x]
               [currentPos.y + operations[direction].y].available) {
        currentPos.x += operations[direction].x;
        currentPos.y += operations[direction].y;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return currentPos;
}