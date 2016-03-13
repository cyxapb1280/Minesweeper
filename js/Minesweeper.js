/**
 * Created by Ruslan on 12-Mar-16.
 */
var CELL_SIZE = 32;
var CLOSED_CELL_COLOR = "#45759e";
var OPEN_CELL_COLOR = "#d9eaf2";
var BORDER_COLOR = "#b7d7eb";
var MINE_COLOR = "#d66684"
var FONT_STYLE = "26px Arial";

function Cell(){
    this.marker = "none";
    this.value = 0;
    this.mine = false;
    this.open = false;

    this.mark = function() {
        switch (this.marker){
            case "none":
                this.marker = "flag";
                break;
            case "flag":
                this.marker = "quest";
                break;
            case "quest":
                this.marker = "none"
                break;
        }
    }

    this.flip = function() {
        this.open = true;
        this.marker = "none";
    }
}

function Minesweeper(height, width, mines) {
    var self = this;
    var CELL_SIZE = 32;
    var map = [];
    var canvas, ctx;
    var win = false;
    var gOver = false;
    var flagsLeft = mines;
    var minesLeft = mines;
    var firstClick = true;

    createEmptyMap();

    this.initializeCanvas = function () {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");

        canvas.height = height * CELL_SIZE;
        canvas.width = width * CELL_SIZE;

        canvas.onclick = canvasOnClick;

        canvas.oncontextmenu = canvasOnContextMenu;
    }

    this.drawMap = function() {
        var currX = 0, currY = 0;

        ctx.fillStyle = CLOSED_CELL_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = OPEN_CELL_COLOR;
        ctx.font = FONT_STYLE;
        ctx.textAlign = "center";

        for (var i = 0; i < height; i++) {
            currX = 0;
            for (var j = 0; j < width; j++) {
                ctx.strokeStyle = BORDER_COLOR;
                ctx.lineWidth = 1;
                ctx.strokeRect(currX, currY, CELL_SIZE, CELL_SIZE)

                if (map[i][j].open){
                    drawOpenCell(currX, currY);
                }

                if(map[i][j].value > 0 && !map[i][j].mine){
                    drawCellValue(currX, currY, map[i][j].value);

                }

                if (map[i][j].marker != "none"){
                    drawMarkedCell(currX, currY, map[i][j].marker);
                }

                if (map[i][j].mine && map[i][j].open){
                    drawMine(currX, currY);
                }

                currX += CELL_SIZE;
            }
            currY += CELL_SIZE;
        }

        if(gOver){
            setTimeout(drawGameOver, 500);
        }

        if(win){
            setTimeout(drawWin, 500);
        }
    }

    function createEmptyMap() {
        for(var i = 0; i < height; i++){
            map[i] = [];
            for(var j = 0; j < width; j++){
                map[i][j] = new Cell();
            }
        }
    }

    function gameOver() {
        for(var i = 0; i < height; i++){
            for(var j = 0; j < width; j++){
                map[i][j].flip();
                map[i][j].value = 0;
                map[i][j].marker = "none";
            }
        }
        gOver = true;
    }

    function drawOpenCell (x, y) {
        ctx.fillStyle = OPEN_CELL_COLOR;
        ctx.font = FONT_STYLE;
        ctx.textAlign = "center";
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
    }

    function drawMarkedCell (x, y, marker){
        ctx.fillStyle = OPEN_CELL_COLOR;
        ctx.font = FONT_STYLE;
        ctx.textAlign = "center";

        switch (marker) {
            case "flag":
                drawFlag(x, y);
                //ctx.fillText("F", x + CELL_SIZE / 2, y + CELL_SIZE * 0.8);
                break
            case "quest":
                ctx.fillText("?", x + CELL_SIZE / 2, y + CELL_SIZE * 0.8);
        }

    }

    function drawCellValue (x, y, value) {
        ctx.fillStyle = CLOSED_CELL_COLOR;
        ctx.font = FONT_STYLE;
        ctx.textAlign = "center";
        ctx.fillText(value, x + CELL_SIZE / 2, y + CELL_SIZE * 0.8);
    }

    function drawMine (x, y) {
        var centerX = x + CELL_SIZE / 2;
        var centerY = y + CELL_SIZE / 2;
        var radius = CELL_SIZE * 0.4;
        ctx.beginPath();
        ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = MINE_COLOR;
        ctx.fill();
    }

    function drawFlag (x, y) {
        var startX = x + CELL_SIZE * 0.6;
        var startY = y + CELL_SIZE * 0.9;

        ctx.beginPath();
        ctx.moveTo(startX - 1, startY - 22);
        ctx.lineTo(startX - 11, startY - 14);
        ctx.lineTo(startX - 1, startY - 8);
        ctx.lineJoin = 'round';
        ctx.lineWidth = 1;
        ctx.strokeStyle = MINE_COLOR;
        ctx.stroke();

        ctx.fillStyle = MINE_COLOR;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX, startY - 22);
        ctx.lineWidth = 2;
        ctx.strokeStyle = OPEN_CELL_COLOR;
        ctx.stroke();


    }

    function drawGameOver () {
        stackBlurCanvasRGBA("canvas", 0, 0, width*CELL_SIZE, height*CELL_SIZE, 5);
        ctx.fillStyle = CLOSED_CELL_COLOR;
        ctx.font = 0.1 * canvas.height + "px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", width * CELL_SIZE / 2, height * CELL_SIZE / 2);
    }

    function drawWin() {
        stackBlurCanvasRGBA("canvas", 0, 0, width*CELL_SIZE, height*CELL_SIZE, 4);
        ctx.fillStyle = CLOSED_CELL_COLOR;
        ctx.font = 0.1 * canvas.height + "px Arial";
        ctx.textAlign = "center";
        ctx.fillText("YOU WIN", width * CELL_SIZE / 2, height * CELL_SIZE / 2);
    }

    function setMines (firstX, firstY) {
        var randX, randY;
        var clearDist = 2;
        for(var i = 0; i < mines; i++){
            randX = Math.floor(Math.random() * width);
            randY = Math.floor(Math.random() * height);

            if((randX >= firstX - clearDist && randX <= firstX + clearDist) &&
                (randY >= firstY - clearDist && randY <= firstY + clearDist)) {
                i--;
                continue;
            }

            map[randY][randX].mine = true;
        }
    }

    function setValues () {
        for(var i = 0; i < height; i++){
            for(var j = 0; j < width; j++){
                if(map[i][j].mine){
                    incrementMates(i, j);
                }
            }
        }
    }

    function incrementMates (i, j) {
        var mates = getMates(i, j);

        for(var k = 0; k < mates.length; k++){
            map[mates[k][0]][mates[k][1]].value++;
        }
    }

    function waveFlip (i, j) {
        var mates = getClosedMates(i, j);
        var matesOfMate;
        var mateOfMate;
        var mate;

        map[i][j].flip();

        while(mates.length > 0){
            mate = mates.pop();
            map[mate[0]][mate[1]].flip();

            if( map[mate[0]][mate[1]].value > 0)
                continue;

            matesOfMate = getClosedMates(mate[0], mate[1]);

            while(matesOfMate.length > 0){
                mateOfMate = matesOfMate.pop();
                map[mateOfMate[0]][mateOfMate[1]].flip();

                if(!containCoordinates(mates, mateOfMate)){
                    mates.unshift(mateOfMate);
                }
            }
        }
        self.drawMap();
    }

    function getMates (i, j) {
        var mates = [];
        if(map[i][j - 1]){
            mates.push([i, j - 1]);
        } // left

        if(map[i - 1] && map[i - 1][j - 1]){
            mates.push([i - 1, j - 1])
        } // left top

        if(map[i - 1]){
            mates.push([i - 1, j]);
        } // top

        if(map[i - 1] && map[i - 1][j + 1]){
            mates.push([i - 1, j + 1]);
        } // right top

        if(map[i][j + 1]){
            mates.push([i, j + 1]);
        } // right

        if(map[i + 1] &&  map[i + 1][j + 1]){
            mates.push([i + 1, j + 1]);
        }// right bottom

        if(map[i + 1]){
            mates.push([i + 1, j]);
        }// bottom

        if(map[i + 1] && map[i + 1][j - 1]){
            mates.push([i + 1, j - 1]);
        }//left bottom

        return mates;
    }

    function getClosedMates (i, j) {
        var mates = getMates(i, j);
        var closedMates = [];

        for(var k = 0; k < mates.length; k++){
            if(map[mates[k][0]][mates[k][1]].open === false){
                closedMates.push([mates[k][0], mates[k][1]]);
            }
        }
        return closedMates;
    }

    function containCoordinates (arrayOfCoordinates, coordinates) {
        for(var i = 0; i < arrayOfCoordinates.length; i++){
            if(arrayOfCoordinates[i][0] === coordinates[0] &&
               arrayOfCoordinates[i][1] === coordinates[1]){
                return true;
            }
        }
        return false;
    }

    function canvasOnClick (e) {
        var x = (e.pageX - canvas.offsetLeft) / CELL_SIZE | 0;
        var y = (e.pageY - canvas.offsetTop) / CELL_SIZE | 0;

        if(firstClick){
            setMines(x, y);
            setValues();
            firstClick = false;
        }

        if(map[y][x].open){
            return;
        }

        if(map[y][x].mine){
            gameOver();
        }

        if(map[y][x].value === 0 && !map[y][x].mine){
            waveFlip(y, x);
        } else {
            map[y][x].flip();
        }

        console.log("Clicked [" + x + " " + y + "]");

        checkForWin();
        self.drawMap();

    };

    function canvasOnContextMenu(e) {
        e.preventDefault();
        var x = (e.pageX - canvas.offsetLeft) / CELL_SIZE | 0;
        var y = (e.pageY - canvas.offsetTop) / CELL_SIZE | 0;

        if(map[y][x].open){
            return;
        }

        map[y][x].mark();

        console.log("Clicked [" + x + " " + y + "]");

        checkForWin();
        self.drawMap();
    }

    function checkForWin(){
        flagsLeft = mines;
        minesLeft = mines;
        for(var i = 0; i < height; i++){
            for(var j = 0; j < width; j++){
                if(map[i][j].marker === "flag"){
                    flagsLeft--;
                }
                if(map[i][j].marker === "flag" && map[i][j].mine){
                    minesLeft--;
                }
            }
        }
        if(minesLeft === 0){
            win = true;
        }
    }
}

var game = new Minesweeper(9, 9, 5);
game.initializeCanvas();
game.drawMap();