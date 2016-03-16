/**
 * Created by Ruslan on 16-Mar-16.
 */
"use strict"

describe("Class Minesweeper.", function () {

    describe("function _createEmptyMap()", function () {

        it("Creates map of size 5 x 5.", function () {
            assert.equal(height, 5);
            assert.equal(width, 5);
        });

        it("No mines on map.", function () {
            assert.isOk(noMines, "Mines are on field.");
        });

        it("No values on map.", function () {
            assert.isOk(noValues, "Values are on field.");
        });
    });

    describe("function setMines(i, j)", function () {

        it("Creates 3/3 mines on map.", function () {
            assert.equal(minesAfterSetting, 3);
        })

        it("No mines in clear zone.", function () {
            assert.isOk(noMinesInClearZone, "Its mine in clear zone");
        })
    });

    describe("function setValues()", function () {

        it("Increments neighbor cells (1 mine).", function () {
            assert.equal(value1, 1);
        })

        it("Increments neighbor cells (2 mines).", function () {
            assert.equal(value2, 2);
        })

        it("Increments neighbor cells (3 mines).", function () {
            assert.equal(value3, 3);
        })
    })

});