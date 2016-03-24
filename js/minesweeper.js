/**
 * Created by Ruslan on 12-Mar-16.
 */
'use strict';

class Minesweeper {
  constructor(options) {
    this._map = [];
    this._win = false;
    this._gOver = false;
    this._mines = options.mines;
    this._flagsLeft = options.mines;
    this._minesLeft = options.mines;
    this._height = options.height;
    this._width = options.width;
    this._firstClick = true;

    this._createEmptyMap();
  }


  getGOver() {
    return this._gOver;
  };

  getWin() {
    return this._win;
  };

  getFlagsLeft() {
    return this._flagsLeft;
  };

  getFirstClick() {
    return this._firstClick;
  };

  getMap() {
    return this._map;
  };

  setFirstClick(value) {
    this._firstClick = value;
  };

  setMines(firstX, firstY) {
    var randX, randY;
    var clearDist = 1;
    for (var i = 0; i < this._mines; i++) {
      randX = Math.floor(Math.random() * this._width);
      randY = Math.floor(Math.random() * this._height);

      if ((randX >= firstX - clearDist && randX <= firstX + clearDist) &&
        (randY >= firstY - clearDist && randY <= firstY + clearDist) ||
        this._map[randY][randX].mine) {

        i--;
        continue;
      }

      this._map[randY][randX].mine = true;
    }
  };

  setValues() {
    for (var i = 0; i < this._height; i++) {
      for (var j = 0; j < this._width; j++) {
        if (this._map[i][j].mine) {
          this._incrementMates(i, j);
        }
      }
    }
  };

  checkForWin() {
    this._flagsLeft = this._mines;
    this._minesLeft = this._mines;

    for (var i = 0; i < this._height; i++) {
      for (var j = 0; j < this._width; j++) {

        if (this._map[i][j].marker === 'flag') {
          this._flagsLeft--;
        }

        if (this._map[i][j].marker === 'flag' && this._map[i][j].mine) {
          this._minesLeft--;
        }
      }
    }

    if (this._minesLeft === 0) {
      this._win = true;
    }
  };

  waveFlip(i, j) {
    var mates = this._getClosedMates(i, j);
    var matesOfMate;
    var mateOfMate;
    var mate;

    this._map[i][j].flip();

    while (mates.length > 0) {
      mate = mates.pop();
      this._map[mate[0]][mate[1]].flip();

      if (this._map[mate[0]][mate[1]].value > 0)
        continue;

      matesOfMate = this._getClosedMates(mate[0], mate[1]);

      while (matesOfMate.length > 0) {
        mateOfMate = matesOfMate.pop();
        this._map[mateOfMate[0]][mateOfMate[1]].flip();

        if (!Minesweeper._containCoordinates(mates, mateOfMate)) {
          mates.unshift(mateOfMate);
        }
      }
    }
  };

  gameOver() {
    for (var i = 0; i < this._height; i++) {
      for (var j = 0; j < this._width; j++) {
        this._map[i][j].flip();
        this._map[i][j].value = 0;
        this._map[i][j].marker = 'none';
      }
    }
    this._gOver = true;
  };

  _incrementMates(i, j) {
    var mates = this._getMates(i, j);

    for (var k = 0; k < mates.length; k++) {
      this._map[mates[k][0]][mates[k][1]].value++;
    }
  };

  _getMates(i, j) {
    var map = this._map;
    var mates = [];
    if (map[i][j - 1]) {
      mates.push([i, j - 1]);
    } // left

    if (map[i - 1] && map[i - 1][j - 1]) {
      mates.push([i - 1, j - 1])
    } // left top

    if (map[i - 1]) {
      mates.push([i - 1, j]);
    } // top

    if (map[i - 1] && map[i - 1][j + 1]) {
      mates.push([i - 1, j + 1]);
    } // right top

    if (map[i][j + 1]) {
      mates.push([i, j + 1]);
    } // right

    if (map[i + 1] && map[i + 1][j + 1]) {
      mates.push([i + 1, j + 1]);
    }// right bottom

    if (map[i + 1]) {
      mates.push([i + 1, j]);
    }// bottom

    if (map[i + 1] && map[i + 1][j - 1]) {
      mates.push([i + 1, j - 1]);
    }//left bottom

    return mates;
  };

  _getClosedMates(i, j) {
    var mates = this._getMates(i, j);
    var closedMates = [];

    for (var k = 0; k < mates.length; k++) {
      if (this._map[mates[k][0]][mates[k][1]].open === false) {
        closedMates.push([mates[k][0], mates[k][1]]);
      }
    }
    return closedMates;
  };

  _createEmptyMap() {
    for (var i = 0; i < this._height; i++) {
      this._map[i] = [];
      for (var j = 0; j < this._width; j++) {
        this._map[i][j] = new Cell();
      }
    }
  };

  static _containCoordinates(arrayOfCoordinates, coordinates) {
    for (var i = 0; i < arrayOfCoordinates.length; i++) {
      if (arrayOfCoordinates[i][0] === coordinates[0] &&
        arrayOfCoordinates[i][1] === coordinates[1]) {
        return true;
      }
    }
    return false;
  };
}



