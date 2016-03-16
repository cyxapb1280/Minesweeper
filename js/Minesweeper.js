/**
 * Created by Ruslan on 12-Mar-16.
 */
"use strict";

function Minesweeper(height, width, mines) {
    this._map = [];
    this._win = false;
    this._gOver = false;
    this._mines = mines;
    this._flagsLeft = mines;
    this._minesLeft = mines;
    this._height = height;
    this._width = width;
    this._firstClick = true;

    this._createEmptyMap();
}

Minesweeper.prototype.setMines = function (firstX, firstY) {
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

Minesweeper.prototype.setValues = function () {
    for (var i = 0; i < this._height; i++) {
        for (var j = 0; j < this._width; j++) {
            if (this._map[i][j].mine) {
                this._incrementMates(i, j);
            }
        }
    }
};

Minesweeper.prototype.checkForWin = function () {
    this._flagsLeft = this._mines;
    this._minesLeft = this._mines;

    for (var i = 0; i < this._height; i++) {
        for (var j = 0; j < this._width; j++) {

            if (this._map[i][j].marker === "flag") {
                this._flagsLeft--;
            }

            if (this._map[i][j].marker === "flag" && this._map[i][j].mine) {
                this._minesLeft--;
            }
        }
    }

    if (this._minesLeft === 0) {
        this._win = true;
    }
};

Minesweeper.prototype.waveFlip = function (i, j) {
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

            if (!this._containCoordinates(mates, mateOfMate)) {
                mates.unshift(mateOfMate);
            }
        }
    }
};

Minesweeper.prototype.gameOver = function () {
    for (var i = 0; i < this._height; i++) {
        for (var j = 0; j < this._width; j++) {
            this._map[i][j].flip();
            this._map[i][j].value = 0;
            this._map[i][j].marker = "none";
        }
    }
    this._gOver = true;
};

Minesweeper.prototype.getGOver = function () {
    return this._gOver;
};

Minesweeper.prototype.getWin = function () {
    return this._win;
};

Minesweeper.prototype.getFlagsLeft = function () {
    return this._flagsLeft;
};

Minesweeper.prototype.getFirstClick = function () {
    return this._firstClick;
};

Minesweeper.prototype.getMap = function () {
    return this._map;
};

Minesweeper.prototype.setFirstClick = function (value) {
    this._firstClick = value;
};

Minesweeper.prototype._incrementMates = function (i, j) {
    var mates = this._getMates(i, j);

    for (var k = 0; k < mates.length; k++) {
        this._map[mates[k][0]][mates[k][1]].value++;
    }
};

Minesweeper.prototype._getMates = function (i, j) {
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

Minesweeper.prototype._getClosedMates = function (i, j) {
    var mates = this._getMates(i, j);
    var closedMates = [];

    for (var k = 0; k < mates.length; k++) {
        if (this._map[mates[k][0]][mates[k][1]].open === false) {
            closedMates.push([mates[k][0], mates[k][1]]);
        }
    }
    return closedMates;
};

Minesweeper.prototype._containCoordinates = function (arrayOfCoordinates, coordinates) {
    for (var i = 0; i < arrayOfCoordinates.length; i++) {
        if (arrayOfCoordinates[i][0] === coordinates[0] &&
            arrayOfCoordinates[i][1] === coordinates[1]) {
            return true;
        }
    }
    return false;
};

Minesweeper.prototype._createEmptyMap = function () {
    for (var i = 0; i < this._height; i++) {
        this._map[i] = [];
        for (var j = 0; j < this._width; j++) {
            this._map[i][j] = new Cell();
        }
    }
};
