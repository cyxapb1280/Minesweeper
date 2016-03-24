/**
 * Created by Ruslan on 24-Mar-16.
 */
'use strict';

class Page {
  constructor(options) {
    this._el = options.element;

    this._controlPanel = new ControlPanel({
      element: this._el.querySelector('[data-component="control-panel"]')
    });

    this._game = new Minesweeper({
      height: 16,
      width: 30,
      mines: 99
    });

    this._drawer = new CanvasDrawer({
      game: this._game,
      element: this._el.querySelector('[data-component="canvas"]')
    });

    this._timer = new Timer({
      element: this._el.querySelector('[data-component="timer"]')
    });

    this._mineCounter = new MineCounter({
      element: this._el.querySelector('[data-component="mines-count"]')
    });

    this._controlPanel.on('start', this._onControlPanelStart.bind(this));
    this._drawer.on('leftClick', this._onCanvasLeftClick.bind(this));
    this._drawer.on('rightClick', this._onCanvasRightClick.bind(this));

    this._drawer.drawMap();
  }

  _onControlPanelStart(event) {
    let data = event.detail;

    switch (data.value) {
      case 'easy':
        data.height = 9;
        data.width = 9;
        data.mines = 10;
        break;
      case 'normal':
        data.height = 16;
        data.width = 16;
        data.mines = 40;
        break;
      case 'hard':
        data.height = 16;
        data.width = 30;
        data.mines = 99;
        break;
    }
    

    this._game = new Minesweeper({
      height: data.height,
      width: data.width,
      mines: data.mines
    });

    this._drawer = new CanvasDrawer({
      element: this._drawer.getElement(),
      game: this._game
    });

    this._drawer.drawMap();

    this._timer.stop();
    this._timer.reset();
  }

  _onCanvasLeftClick(event) {
    let map = this._game.getMap();
    let x = event.detail.x;
    let y = event.detail.y;

    if (this._game.getFirstClick()) {
      this._game.setMines(x, y);
      this._game.setValues();
      this._game.setFirstClick(false);
      this._timer.start();
    }

    if (map[y][x].open) {
      return;
    }

    if (map[y][x].mine) {
      this._game.gameOver();
      this._timer.stop();
    }

    if (map[y][x].value === 0 && !map[y][x].mine) {
      this._game.waveFlip(y, x);
    } else {
      map[y][x].flip();
    }

    this._game.checkForWin();

    if (this._game.getWin()) {
      stopTimer();
    }

    this._drawer.drawMap();
    this._showMinesCount();
    console.log('Clicked [' + x + ' ' + y + ']');
  }

  _onCanvasRightClick(event) {
    let map = this._game.getMap();
    let x = event.detail.x;
    let y = event.detail.y;

    if (map[y][x].open) {
      return;
    }

    map[y][x].mark();


    this._game.checkForWin();

    if (this._game.getWin()) {
      this._timer.stop();
    }

    this._drawer.drawMap();
    this._showMinesCount();
    console.log('Clicked [' + x + ' ' + y + ']');
  }

  _showMinesCount() {
    this._mineCounter.show(this._game.getFlagsLeft());
  }
}