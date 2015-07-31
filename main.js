'use strict';
var options = {
  board: {
    gridSize: 40,
    size: 640,
    offX: 80,
    offY: 20,
    count: 16
  },
  walls: {
    x: [
        [0, 4], [0, 10], [1, 6], [1, 8], [2, 0], [2, 14], [4, 10], [5, 6], [6, 2], [6, 11], [7, 6], [7, 8],
        [8, 6], [8, 8], [9, 3], [10, 5], [10, 8], [11, 12], [12, 7], [13, 1], [13, 8], [14, 3], [14, 14], [15, 4], [15, 11]
    ],
    y: [
        [1, 1], [1, 6], [1, 9], [1, 14], [4, 6], [4, 10], [4, 15], [5, 0], [5, 12], [6, 3], [6, 7], [6, 8],
        [8, 7], [8, 8], [9, 4], [9, 6], [9, 15], [10, 0], [10, 8], [10, 13], [11, 7], [12, 1], [13, 9], [13, 14], [14, 3]
    ]
  },
  sprits: [
    [6, 1, 6, 'yellow'],
    [14, 2, 9, 'yellow'],
    [4, 9, 3, 'yellow'],
    [8, 10, 4, 'yellow'],
    [9, 1, 6, 'green'],
    [1, 2, 3, 'green'],
    [9, 13, 9, 'green'],
    [3, 14, 4, 'green'],
    [6, 5, 4, 'blue'],
    [12, 6, 3, 'blue'],
    [6, 10, 9, 'blue'],
    [13, 11, 6, 'blue'],
    [10, 4, 4, 'red'],
    [3, 6, 9, 'red'],
    [1, 13, 6, 'red'],
    [14, 14, 3, 'red']
  ]
};

var gameStage;
var board = [];
var robots = {
  'red': null,
  'yellow': null,
  'blue': null,
  'green': null
};

var currentRobots = null;

function init() {
  gameStage = new createjs.Stage("main");
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener('tick', gameStage);
  initBoard(gameStage);
}

function initBoard() {
  function initDirection() {
    _.forEach(options.walls.x, function(wall) {
      board[wall[1]][wall[0]].setDirection(true, 1);
      board[wall[1] + 1][wall[0]].setDirection(true, 3);
    });

    _.forEach(options.walls.y, function(wall) {
      board[wall[1]][wall[0]].setDirection(true, 2);
      board[wall[1]][wall[0] + 1].setDirection(true, 0);
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
      if (x > 6 && x < 9 && y > 6 ) {
        generateRobotPosition();
      }
    }
    _.forEach(robots, function(v, k) {
      var x = _.random(0, options.board.count - 1);
      var y = _.random(0, options.board.count - 1);
      robots[k] = new Robot(k, x, y);
      gameStage.addChild(robots[k].shape);
    });
  }

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
  gameStage.update();
}


function Robot(color, x, y) {
  this.color = color;
  this.shape = new createjs.Shape();
  this.x = x;
  this.y = y;

  this._updateShape = function() {
    var gridSize = options.board.gridSize;
    var center = gridSize / 2;
    var r = gridSize - 10;
    var startPosition = toBoard(this.x, this.y);
    this.shape.x = startPosition.x;
    this.shape.y = startPosition.y;
    this.shape.graphics.beginStroke('deepgrey').beginFill(this.color).drawPolyStar(center, center, r/2, 8);
  };

  this._updateShape();

  this.moveTo = function(x, y) {
    createjs.Tween.get(this.shape, {loop: false}).to(toBoard(x, y), 1200, createjs.Ease.getPowInOut(2));
  };

  this.chosen = function() {
    this.shape.shadow = new createjs.Shadow("#000000", 3, 3, 5);
  }
}

function Grid(x, y) {
  var gridSize = options.board.gridSize;
  this._updateShape = function() {
    this.shape = new createjs.Shape();
    var boardPos = toBoard(this.x, this.y);
    this.shape.x = boardPos.x;
    this.shape.y = boardPos.y;
    this.shape.graphics.setStrokeStyle(1)
        .beginStroke('grey')
        .drawRect(0, 0, gridSize, gridSize);
  };

  this.special = false;
  this.kind = null;
  this.color = null;
  this.x = x;
  this.y = y;
  this.direction = [true, true, true, true];
  this._updateShape();

  this.setDirection = function(direction, index) {
    this.direction[index] = direction;
    if (index === 0) {
      this.shape.graphics.beginFill('black').drawRect(0, -2, options.board.gridSize, 4);
    } else if (index === 3){
      this.shape.graphics.beginFill('black').drawRect(-2, 0, 4, options.board.gridSize);
    }
  };

  this.setSprit = function(kind, color) {
    this.kind = kind;
    this.color = color;
    var r = gridSize - 10;
    var center = gridSize / 2;
    if (this.kind === 4) {
      this.shape.graphics.beginFill(this.color).drawRect((gridSize - r)/2, (gridSize - r)/2, r, r);
    } else if (this.kind === 9){
      this.shape.graphics.beginFill(this.color).drawCircle(center, center, r/2);
    } else {
      this.shape.graphics.beginFill(this.color).drawPolyStar(center, center, r/2, this.kind);
    }
  }
}

function toBoard(x, y) {
  return {
    x: options.board.offX + x * options.board.gridSize,
    y: options.board.offY + y * options.board.gridSize
  }
}
