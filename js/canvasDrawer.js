/**
 * Created by Ruslan on 14-Mar-16.
 */
"use strict";

function CanvasDrawer(game) {
    this._canvas = null;
    this._ctx = null;
    this._map = game.getMap();
    this._height = this._map.length;
    this._width = this._map[0].length;

    this._initializeCanvas();
}

CanvasDrawer.prototype._CLOSED_CELL_COLOR = "#45759e";
CanvasDrawer.prototype._OPEN_CELL_COLOR = "#d9eaf2";
CanvasDrawer.prototype._BORDER_COLOR = "#b7d7eb";
CanvasDrawer.prototype._MINE_COLOR = "#d66684";
CanvasDrawer.prototype._FONT_STYLE = "26px Arial";
CanvasDrawer.prototype._CELL_SIZE = 32;

CanvasDrawer.prototype.drawMap = function () {
    var currX = 0, currY = 0;

    this._ctx.fillStyle = this._CLOSED_CELL_COLOR;
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this._ctx.fillStyle = this._OPEN_CELL_COLOR;
    this._ctx.font = this._FONT_STYLE;
    this._ctx.textAlign = "center";

    for (var i = 0; i < this._height; i++) {
        currX = 0;
        for (var j = 0; j < this._width; j++) {
            this._ctx.strokeStyle = this._BORDER_COLOR;
            this._ctx.lineWidth = 1;
            this._ctx.strokeRect(currX, currY, CELL_SIZE, CELL_SIZE);

            if (this._map[i][j].open) {
                this._drawOpenCell(currX, currY);
            }

            if (this._map[i][j].value > 0 && !this._map[i][j].mine) {
                this._drawCellValue(currX, currY, this._map[i][j].value);

            }

            if (this._map[i][j].marker != "none") {
                this._drawMarkedCell(currX, currY, this._map[i][j].marker);
            }

            if (this._map[i][j].mine && this._map[i][j].open) {
                this._drawMine(currX, currY);
            }

            currX += this._CELL_SIZE;
        }
        currY += this._CELL_SIZE;
    }

    if (game.getGOver()) {
        var drawGameOver = this._drawGameOver.bind(this);
        setTimeout(drawGameOver , 500);
    }

    if (game.getWin()) {
        var drawWin = this._drawWin.bind(this);
        setTimeout(drawWin, 500);
    }
};

CanvasDrawer.prototype.GetCanvas = function () {
    return this._canvas;
};

CanvasDrawer.prototype._initializeCanvas = function () {
    this._canvas = document.getElementById("canvas");
    this._ctx = this._canvas.getContext("2d");

    this._canvas.height = this._height * this._CELL_SIZE;
    this._canvas.width = this._width * this._CELL_SIZE;

    this._canvas.onclick = canvasOnClick;

    this._canvas.oncontextmenu = canvasOnContextMenu;
};

CanvasDrawer.prototype._drawOpenCell = function (x, y) {
    this._ctx.fillStyle = this._OPEN_CELL_COLOR;
    this._ctx.font = this._FONT_STYLE;
    this._ctx.textAlign = "center";
    this._ctx.fillRect(x, y, this._CELL_SIZE, this._CELL_SIZE);
};

CanvasDrawer.prototype._drawMarkedCell = function (x, y, marker) {
    this._ctx.fillStyle = this._OPEN_CELL_COLOR;
    this._ctx.font = this._FONT_STYLE;
    this._ctx.textAlign = "center";

    switch (marker) {
        case "flag":
            this._drawFlag(x, y);
            break;
        case "quest":
            this._ctx.fillText("?", x + this._CELL_SIZE / 2, y + this._CELL_SIZE * 0.8);
    }

};

CanvasDrawer.prototype._drawCellValue = function (x, y, value) {
    this._ctx.fillStyle = this._CLOSED_CELL_COLOR;
    this._ctx.font = this._FONT_STYLE;
    this._ctx.textAlign = "center";
    this._ctx.fillText(value, x + this._CELL_SIZE / 2, y + this._CELL_SIZE * 0.8);
};

CanvasDrawer.prototype._drawMine = function (x, y) {
    var centerX = x + this._CELL_SIZE / 2;
    var centerY = y + this._CELL_SIZE / 2;
    var radius = this._CELL_SIZE * 0.4;
    this._ctx.beginPath();
    this._ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    this._ctx.fillStyle = this._MINE_COLOR;
    this._ctx.fill();
};

CanvasDrawer.prototype._drawFlag = function (x, y) {
    var startX = x + this._CELL_SIZE * 0.6;
    var startY = y + this._CELL_SIZE * 0.9;

    this._ctx.beginPath();
    this._ctx.moveTo(startX - 1, startY - 22);
    this._ctx.lineTo(startX - 11, startY - 14);
    this._ctx.lineTo(startX - 1, startY - 8);
    this._ctx.lineJoin = 'round';
    this._ctx.lineWidth = 1;
    this._ctx.strokeStyle = this._MINE_COLOR;
    this._ctx.stroke();

    this._ctx.fillStyle = this._MINE_COLOR;
    this._ctx.fill();

    this._ctx.beginPath();
    this._ctx.moveTo(startX, startY);
    this._ctx.lineTo(startX, startY - 22);
    this._ctx.lineWidth = 2;
    this._ctx.strokeStyle = this._OPEN_CELL_COLOR;
    this._ctx.stroke();


};

CanvasDrawer.prototype._drawGameOver = function () {
    var blurWidth = this._width * this._CELL_SIZE;
    var blurHeight = this._height * this._CELL_SIZE;

    stackBlurCanvasRGBA("canvas", 0, 0, blurWidth, blurHeight, 5);
    this._ctx.fillStyle = this._CLOSED_CELL_COLOR;
    this._ctx.font = 0.1 * this._canvas.height + "px Arial";
    this._ctx.textAlign = "center";
    this._ctx.fillText("GAME OVER", this._width * this._CELL_SIZE / 2, this._height * this._CELL_SIZE / 2);
};

CanvasDrawer.prototype._drawWin = function () {
    var blurWidth = this._width * this._CELL_SIZE;
    var blurHeight = this._height * this._CELL_SIZE;

    stackBlurCanvasRGBA("canvas", 0, 0, blurWidth, blurHeight, 5);
    this._ctx.fillStyle = this._CLOSED_CELL_COLOR;
    this._ctx.font = 0.1 * this._canvas.height + "px Arial";
    this._ctx.textAlign = "center";
    this._ctx.fillText("YOU WIN", this._width * this._CELL_SIZE / 2, this._height * this._CELL_SIZE / 2);
};
