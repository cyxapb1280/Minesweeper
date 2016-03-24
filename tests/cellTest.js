/**
 * Created by Ruslan on 16-Mar-16.
 */
"use strict";

describe("Class Cell.", function () {

  var cell = new Cell();

  describe("function flip()", function () {

    it("Flipping the cell.", function () {
      cell.flip();
      assert.equal(cell.open, true);
    });
  });

  describe("function mark()", function () {

    it("Changing marker from 'none' to 'flag'.", function () {
      cell.mark();
      assert.equal(cell.marker, "flag");
    });

    it("Changing marker from 'flag to 'quest'.", function () {
      cell.mark();
      assert.equal(cell.marker, "quest");
    });

    it("Changing marker from 'quest to 'none'.", function () {
      cell.mark();
      assert.equal(cell.marker, "none");
    });
  });
});