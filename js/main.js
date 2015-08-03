'use strict';

var gameStage;
var board = [];
var robots = {
  'red': null,
  'yellow': null,
  'blue': null,
  'green': null
};

var currentRobot = null;

function init() {
  gameStage = new createjs.Stage("main");
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener('tick', gameStage);
  initBoard(gameStage);
}

function initBoard() {
  for (var i = 0; i < options.board.count; i++) {
    board[i] = [];
    for (var j = 0; j < options.board.count; j++) {
      board[i][j] = new Grid(i, j);
      gameStage.addChild(board[i][j].shape);
    }
  }
  initDirection();
  initTarget();
  initRobots();
  initKeyboardListener();
  gameStage.update();
}

function initDirection() {
  _.forEach(options.walls.x, function(wall) {
    board[wall[1]][wall[0]].setDirection(false, 1);
    board[wall[1] + 1][wall[0]].setDirection(false, 3);
  });

  _.forEach(options.walls.y, function(wall) {
    board[wall[1]][wall[0]].setDirection(false, 2);
    board[wall[1]][wall[0] + 1].setDirection(false, 0);
  });
}
function initTarget() {
  _.forEach(options.sprits, function(singleSprit) {
    board[singleSprit[0]][singleSprit[1]].setSprit(singleSprit[2], singleSprit[3]);
  });
}
function initRobots() {
  function generateRobotPosition() {
    var x = _.random(0, options.board.count - 1);
    var y = _.random(0, options.board.count - 1);
    if (x > 6 && x < 9 && y > 6) {
      generateRobotPosition();
    }
  }

  _.forEach(robots, function(v, k) {
    var x = _.random(0, options.board.count - 1);
    var y = _.random(0, options.board.count - 1);
    robots[k] = new Robot(k, x, y);
    board[x][y].available = false;
    gameStage.addChild(robots[k].shape);
  });
}

function initKeyboardListener() {
  var keys = {
    b: 'blue',
    r: 'red',
    y: 'yellow',
    g: 'green'
  };
  var arrowKeys = ['up', 'right', 'down', 'left'];
  key('b, r, y, g', function(e, handler) {
    var color = keys[handler.key];
    if (currentRobot && currentRobot.color !== color) {
      robots[currentRobot.color].choose();
    }
    currentRobot = robots[color].choose();
  });
  key('up, right, down, left', function(e, handler) {
    e.preventDefault();
    var target = null;
    if (currentRobot) {
      target = getTarget(currentRobot, _.indexOf(arrowKeys, handler.key));
      currentRobot.moveTo(target.x, target.y);
    }
    console.log(handler.key);
  })
}

