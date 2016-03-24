/**
 * Created by Ruslan on 24-Mar-16.
 */
'use strict';

class ControlPanel extends Component {
  constructor(options) {
    super(options);

    this._diffRadioSet = this._el.querySelectorAll('[data-selector="diff-radio"]');
    this._heightInput = this._el.querySelector('[data-selector="height-input"]');
    this._widthInput = this._el.querySelector('[data-selector="width-input"]');
    this._minesInput = this._el.querySelector('[data-selector="mines-input"]');

    this.on('click', this._onStartButtonClick.bind(this));
    this.on('click', this._onRadioSetClick.bind(this));
  }

  _onStartButtonClick(event) {
    let data;
    let startButton = event.target.closest('[data-selector="start-button"]');

    if (!startButton) {
      return;
    }

    let diff = ControlPanel._getCheckedRadioButton(this._diffRadioSet);

    if (diff === 'custom') {
      data = {
        value: diff,
        height: +this._heightInput.value,
        width: +this._widthInput.value,
        mines: +this._minesInput.value
      }
    } else {
      data = {
        value: diff
      }
    }

    this._trigger('start', data);
  }

  _onRadioSetClick(event) {
    let radioSet = event.target.closest('[data-selector="diff-radio"]');

    if (!radioSet) {
      return;
    }

    if (ControlPanel._getCheckedRadioButton(this._diffRadioSet) === 'custom') {
      this._heightInput.disabled = false;
      this._widthInput.disabled = false;
      this._minesInput.disabled = false;
    } else {
      this._heightInput.disabled = true;
      this._widthInput.disabled = true;
      this._minesInput.disabled = true;
    }


  }


  static _getCheckedRadioButton(radioSet) {
    for (let i = 0; i < radioSet.length; i++)
      if (radioSet[i].checked) {
        return radioSet[i].value;
      }
  }

}