'use strict';

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