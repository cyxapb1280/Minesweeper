/**
 * Created by Ruslan on 16-Mar-16.
 */
var ms = new Minesweeper({
  height: 5,
  width: 5,
  mines: 3
});

var height = ms._map.length;
var width = ms._map[0].length;
var map = ms._map;
var noMines = true;
var noValues = true;
var minesAfterSetting = 0;
var noMinesInClearZone = true;
var value1, value2, value3;

emptyMapTest();
setMinesTest();
setValuesTest();

function emptyMapTest() {
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      if (map[i][j].mine || map[i][j].value > 0) {
        noMines = false;
        noValues = false;
      }
    }
  }
}

function setMinesTest() {
  ms.setMines(2, 2);

  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      if (map[i][j].mine) {
        minesAfterSetting++;
      }
    }
  }

  if (map[2][1].mine || map[1][1].mine ||
    map[1][2].mine || map[1][3].mine ||
    map[2][3].mine || map[3][3].mine ||
    map[3][2].mine || map[3][1].mine) {
    noMinesInClearZone = false;
  }
}

function setValuesTest() {
  ms._createEmptyMap();
  map[0][0].mine = true;
  ms.setValues();
  value1 = map[1][1].value;


  ms._createEmptyMap();
  map[0][1].mine = true;
  map[0][0].mine = true;
  ms.setValues();
  value2 = map[1][1].value;


  ms._createEmptyMap();
  map[0][2].mine = true;
  map[0][1].mine = true;
  map[0][0].mine = true;
  ms.setValues();
  value3 = map[1][1].value;
}





