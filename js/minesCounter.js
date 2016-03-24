/**
 * Created by Ruslan on 24-Mar-16.
 */
'use strict';

class MineCounter {
  constructor(options) {
    this._el = options.element;
  }

  show(mines) {
    this._el.innerHTML = mines;
  }
}