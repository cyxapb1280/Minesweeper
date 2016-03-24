/**
 * Created by Ruslan on 14-Mar-16.
 */
'use strict';

function Cell() {
  this.marker = 'none';
  this.value = 0;
  this.mine = false;
  this.open = false;
}

Cell.prototype.mark = function () {
  switch (this.marker) {
    case 'none':
      this.marker = 'flag';
      break;
    case 'flag':
      this.marker = 'quest';
      break;
    case 'quest':
      this.marker = 'none';
      break;
  }
};

Cell.prototype.flip = function () {
  this.open = true;
  this.marker = 'none';
};