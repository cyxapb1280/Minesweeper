/**
 * Created by Ruslan on 24-Mar-16.
 */
'use strict';

class Timer {
  constructor(options) {
    this._el = options.element;
    this._id = null;
  }

  start() {
    clearInterval(this._id);
    this._id = setInterval(this._nextSecond.bind(this), 1000);
  }

  stop() {
    clearInterval(this._id);
  }

  reset() {
    this._el.innerHTML = '0:00';
  }

  _nextSecond() {
    let time = this._el.innerHTML.split(':');
    let minutes = +time[0];
    let seconds = +time[1];

    seconds++;

    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }

    seconds = (seconds < 10) ? '0' + seconds : seconds;
    this._el.innerHTML = minutes + ':' + seconds;
  }
}