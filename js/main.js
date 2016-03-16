/**
 * Created by Ruslan on 14-Mar-16.
 */
"use strict";

var CELL_SIZE = 32;

var startHeight = 16;
var startWidth = 30;
var startMines = 99;
var timerId;

var game = new Minesweeper(startHeight, startWidth, startMines);
var drawer = new CanvasDrawer(game);
drawer.drawMap();

function canvasOnClick(e) {
    var map = game.getMap();
    var canvas = drawer.GetCanvas();
    var x = (e.pageX - canvas.offsetLeft) / CELL_SIZE | 0;
    var y = (e.pageY - canvas.offsetTop) / CELL_SIZE | 0;

    if (game.getFirstClick()) {
        game.setMines(x, y);
        game.setValues();
        game.setFirstClick(false);
        startTimer();
    }

    if (map[y][x].open) {
        return;
    }

    if (map[y][x].mine) {
        game.gameOver();
        stopTimer();
    }

    if (map[y][x].value === 0 && !map[y][x].mine) {
        game.waveFlip(y, x);
    } else {
        map[y][x].flip();
    }

    game.checkForWin();

    if (game.getWin()) {
        stopTimer();
    }

    drawer.drawMap();
    showMinesCount();
    console.log("Clicked [" + x + " " + y + "]");
}

function canvasOnContextMenu(e) {
    var map = game.getMap();
    var canvas = drawer.GetCanvas();

    var x = (e.pageX - canvas.offsetLeft) / CELL_SIZE | 0;
    var y = (e.pageY - canvas.offsetTop) / CELL_SIZE | 0;

    e.preventDefault();

    if (map[y][x].open) {
        return;
    }

    map[y][x].mark();


    game.checkForWin();

    if (game.getWin()) {
        stopTimer();
    }

    drawer.drawMap();
    showMinesCount();
    console.log("Clicked [" + x + " " + y + "]");
}

function startButtonClick() {
    setDifficulty();
    game = new Minesweeper(startHeight, startWidth, startMines);
    drawer = new CanvasDrawer(game);
    document.getElementById("timer").innerHTML = "0:00";
    drawer.drawMap();
    showMinesCount();
}

function startTimer() {
    clearInterval(timerId);
    timerId = setInterval(nextSecond, 1000);
}

function stopTimer() {
    clearInterval(timerId);
}

function nextSecond() {
    var timer = document.getElementById("timer");
    var time = timer.innerHTML.split(":");
    var minutes = +time[0];
    var seconds = +time[1];

    seconds++;

    if (seconds === 60) {
        minutes++;
        seconds = 0;
    }

    seconds = (seconds < 10) ? "0" + seconds : seconds;
    timer.innerHTML = minutes + ":" + seconds;

}

function showMinesCount() {
    var mines = document.getElementById("minesCount");
    mines.innerHTML = game.getFlagsLeft();
}

function getCheckedRadioButton(name) {
    var elements = document.getElementsByName(name);

    for (var i = 0; i < elements.length; i++)
        if (elements[i].checked) {
            return elements[i].value;
        }
}

function changeParamsInputs() {
    var heightInput = document.getElementById("heightInput");
    var widthInput = document.getElementById("widthInput");
    var minesInput = document.getElementById("minesInput");


    if (document.getElementById("customRadio").checked) {
        heightInput.disabled = false;
        widthInput.disabled = false;
        minesInput.disabled = false;
    } else {
        heightInput.disabled = true;
        widthInput.disabled = true;
        minesInput.disabled = true;
    }
}

function setDifficulty() {
    switch (getCheckedRadioButton("diff")) {
        case "easy":
            startHeight = 9;
            startWidth = 9;
            startMines = 10;
            break;
        case "normal":
            startHeight = 16;
            startWidth = 16;
            startMines = 40;
            break;
        case "hard":
            startHeight = 16;
            startWidth = 30;
            startMines = 99;
            break;
        case "custom":
            startHeight = document.getElementById("heightInput").value;
            startWidth = document.getElementById("widthInput").value;
            startMines = document.getElementById("minesInput").value;
            break;
    }
}
