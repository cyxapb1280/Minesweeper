/**
 * Created by Ruslan on 14-Mar-16.
 */
'use strict';

class CanvasDrawer extends Component {
  constructor(options) {
    super(options);
    this._game = options.game;
    this._ctx = null;
    this._map = options.game.getMap();
    this._height = this._map.length;
    this._width = this._map[0].length;

    this._initializeCanvas();
  }

  static get CLOSED_CELL_COLOR() {
    return '#45759e';
  }

  static get OPEN_CELL_COLOR() {
    return '#d9eaf2';
  }

  static get BORDER_COLOR() {
    return '#b7d7eb';
  }

  static get MINE_COLOR() {
    return '#d66684';
  }

  static get FONT_STYLE() {
    return '26px Arial';
  }

  static get CELL_SIZE() {
    return 32;
  }

  drawMap() {
    let currX = 0, currY = 0;

    this._ctx.fillStyle = CanvasDrawer.CLOSED_CELL_COLOR;
    this._ctx.fillRect(0, 0, this._el.width, this._el.height);

    this._ctx.fillStyle = CanvasDrawer.OPEN_CELL_COLOR;
    this._ctx.font = CanvasDrawer.FONT_STYLE;
    this._ctx.textAlign = 'center';

    for (let i = 0; i < this._height; i++) {
      currX = 0;
      for (let j = 0; j < this._width; j++) {
        this._ctx.strokeStyle = CanvasDrawer.BORDER_COLOR;
        this._ctx.lineWidth = 1;
        this._ctx.strokeRect(currX, currY, CanvasDrawer.CELL_SIZE, CanvasDrawer.CELL_SIZE);

        if (this._map[i][j].open) {
          this._drawOpenCell(currX, currY);
        }

        if (this._map[i][j].value > 0 && !this._map[i][j].mine) {
          this._drawCellValue(currX, currY, this._map[i][j].value);

        }

        if (this._map[i][j].marker != 'none') {
          this._drawMarkedCell(currX, currY, this._map[i][j].marker);
        }

        if (this._map[i][j].mine && this._map[i][j].open) {
          this._drawMine(currX, currY);
        }

        currX += CanvasDrawer.CELL_SIZE;
      }
      currY += CanvasDrawer.CELL_SIZE;
    }

    if (this._game.getGOver()) {
      let drawGameOver = this._drawGameOver.bind(this);
      setTimeout(drawGameOver, 500);
    }

    if (this._game.getWin()) {
      let drawWin = this._drawWin.bind(this);
      setTimeout(drawWin, 500);
    }
  }

  getCanvas() {
    return this._el;
  }


  _canvasOnContextMenu(event) {
    let clickX = (event.pageX - this._el.offsetLeft) / CanvasDrawer.CELL_SIZE | 0;
    let clickY = (event.pageY - this._el.offsetTop) / CanvasDrawer.CELL_SIZE | 0;

    event.preventDefault();

    this._trigger('rightClick', {x: clickX, y: clickY});
  }

  _canvasOnClick(event) {
    let clickX = (event.pageX - this._el.offsetLeft) / CanvasDrawer.CELL_SIZE | 0;
    let clickY = (event.pageY - this._el.offsetTop) / CanvasDrawer.CELL_SIZE | 0;

    this._trigger('leftClick', {x: clickX, y: clickY});
  }

  _initializeCanvas() {
    this._ctx = this._el.getContext('2d');

    this._el.height = this._height * CanvasDrawer.CELL_SIZE;
    this._el.width = this._width * CanvasDrawer.CELL_SIZE;

    this._el.oncontextmenu = this._canvasOnContextMenu.bind(this);
    this._el.onclick = this._canvasOnClick.bind(this);
  }

  _drawOpenCell(x, y) {
    this._ctx.fillStyle = CanvasDrawer.OPEN_CELL_COLOR;
    this._ctx.font = CanvasDrawer.FONT_STYLE;
    this._ctx.textAlign = 'center';
    this._ctx.fillRect(x, y, CanvasDrawer.CELL_SIZE, CanvasDrawer.CELL_SIZE);
  }

  _drawMarkedCell(x, y, marker) {
    this._ctx.fillStyle = CanvasDrawer.OPEN_CELL_COLOR;
    this._ctx.font = CanvasDrawer.FONT_STYLE;
    this._ctx.textAlign = 'center';

    switch (marker) {
      case 'flag':
        this._drawFlag(x, y);
        break;
      case 'quest':
        this._ctx.fillText('?', x + CanvasDrawer.CELL_SIZE / 2, y + CanvasDrawer.CELL_SIZE * 0.8);
    }

  }

  _drawCellValue(x, y, value) {
    this._ctx.fillStyle = CanvasDrawer.CLOSED_CELL_COLOR;
    this._ctx.font = CanvasDrawer.FONT_STYLE;
    this._ctx.textAlign = 'center';
    this._ctx.fillText(value, x + CanvasDrawer.CELL_SIZE / 2, y + CanvasDrawer.CELL_SIZE * 0.8);
  }

  _drawMine(x, y) {
    let centerX = x + CanvasDrawer.CELL_SIZE / 2;
    let centerY = y + CanvasDrawer.CELL_SIZE / 2;
    let radius = CanvasDrawer.CELL_SIZE * 0.4;
    this._ctx.beginPath();
    this._ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    this._ctx.fillStyle = CanvasDrawer.MINE_COLOR;
    this._ctx.fill();
  }

  _drawFlag(x, y) {
    let startX = x + CanvasDrawer.CELL_SIZE * 0.6;
    let startY = y + CanvasDrawer.CELL_SIZE * 0.9;

    this._ctx.beginPath();
    this._ctx.moveTo(startX - 1, startY - 22);
    this._ctx.lineTo(startX - 11, startY - 14);
    this._ctx.lineTo(startX - 1, startY - 8);
    this._ctx.lineJoin = 'round';
    this._ctx.lineWidth = 1;
    this._ctx.strokeStyle = CanvasDrawer.MINE_COLOR;
    this._ctx.stroke();

    this._ctx.fillStyle = CanvasDrawer.MINE_COLOR;
    this._ctx.fill();

    this._ctx.beginPath();
    this._ctx.moveTo(startX, startY);
    this._ctx.lineTo(startX, startY - 22);
    this._ctx.lineWidth = 2;
    this._ctx.strokeStyle = CanvasDrawer.OPEN_CELL_COLOR;
    this._ctx.stroke();


  }

  _drawGameOver() {
    let blurWidth = this._width * CanvasDrawer.CELL_SIZE;
    let blurHeight = this._height * CanvasDrawer.CELL_SIZE;

    stackBlurCanvasRGBA('canvas', 0, 0, blurWidth, blurHeight, 5);
    this._ctx.fillStyle = CanvasDrawer.CLOSED_CELL_COLOR;
    this._ctx.font = 0.1 * this._el.height + 'px Arial';
    this._ctx.textAlign = 'center';
    this._ctx.fillText('GAME OVER', this._width * CanvasDrawer.CELL_SIZE / 2, this._height * CanvasDrawer.CELL_SIZE / 2);
  }

  _drawWin() {
    let blurWidth = this._width * CanvasDrawer.CELL_SIZE;
    let blurHeight = this._height * CanvasDrawer.CELL_SIZE;

    stackBlurCanvasRGBA('canvas', 0, 0, blurWidth, blurHeight, 5);
    this._ctx.fillStyle = CanvasDrawer.CLOSED_CELL_COLOR;
    this._ctx.font = 0.1 * this._el.height + 'px Arial';
    this._ctx.textAlign = 'center';
    this._ctx.fillText('YOU WIN', this._width * CanvasDrawer.CELL_SIZE / 2, this._height * CanvasDrawer.CELL_SIZE / 2);
  }
}



