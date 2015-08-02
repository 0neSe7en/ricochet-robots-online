'use strict';

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