import React from "react";
import ReactDOM from "react-dom";

const Default = require('../constants/defaults.js')


let bingoCard = React.createClass({
  getInitialState () {
    let url = window.location.href.split('?')[1];
    const options = Default;

    return {
      bingoSquares: [],
      squareCount: this.getSquareCount(),
      bingoOptions: this.shuffleCheck(options),
      bingoValues: this.setCheck(),
      isBingo: false,
    };
  },

  getSquareCount () {
    let squareCount = JSON.parse(localStorage.getItem('squareCount'));
    if (squareCount == null) {
      squareCount = 0;
    } else {
      squareCount = parseInt(squareCount);
    }
    return squareCount;
  },

  setCheck(val) {
    let checkVals = JSON.parse(localStorage.getItem('checkedVals'));
    if (checkVals == null) {
      checkVals = this.setMultipleFalse(false);
    };
    return checkVals;
  },

  shuffleCheck(options) {
    let setSquares = JSON.parse(localStorage.getItem('setSquares'));
    if (setSquares == null) {
      setSquares = this.shuffle(options);
    }
    return setSquares;
  },

  shuffle(arr) {
    for (let idx = arr.length; idx; idx--) {
      let rand = Math.floor(Math.random() * idx);
      [arr[idx - 1], arr[rand]] = [arr[rand], arr[idx - 1]];
    }
    localStorage.setItem('setSquares', JSON.stringify(arr));
    return arr;
  },

  shuffleAgain(options) {
    let arr = this.shuffleCheck(options);

    this.shuffle(arr);
    let vals = this.setMultipleFalse(false);
    this.setState({
      bingoOptions: arr, bingoValues: vals, squareCount: 0
    });
    localStorage.setItem('squareCount', 0);
    return arr;
  },

  setMultipleFalse(val) {
    let array = [];
    for (let times = 0; times < 25; times++) {
      array.push(val);
    }
    localStorage.setItem('checkedVals', JSON.stringify(array));
    return array;
  },

  squareClicked(idx) {
    let valChange = this.state.bingoValues;
    valChange[idx] = !valChange[idx];
    if (valChange[idx]) {
      this.setState({
        squareCount: this.state.squareCount += 1
      });
    } else {
      this.setState({
        squareCount: this.state.squareCount -= 1
      });
    }
    localStorage.setItem('squareCount', this.state.squareCount);
    if (this.state.squareCount >= 5) {
      this.setState({
        isBingo: this.bingoCheck()
      });
    };
    localStorage.setItem('checkedVals', JSON.stringify(valChange));
    this.setState({
      bingoValues: valChange
    });
  },

  bingoCheck () {
    let isBingo = false;

    isBingo = this.rowChecker(isBingo, 0, 5, 1, 4);
    // isBingo = this.rowChecker(isBingo, 0, 5, 5, 4);
    // isBingo = this.rowChecker(isBingo, 0, 5, 6, 4);
    // isBingo = this.rowChecker(isBingo, 4, 5, 4, 4);

    return isBingo;
  },

  rowChecker(isBingo, idx, range, increment, rep) {
    let sqVal = this.state.bingoValues;
    let trueCount = 0;
    while (rep >= 0) {
      for (let i = idx; i < range; i += increment) {
        if (sqVal[i] === true) {
          trueCount += 1;
        }
      }
      rep -= 1;
    }

    if (trueCount === 5) {
      isBingo = true;
    }

    return isBingo;
  },

// row check: idx: i * 5, range of 4, all true
// col check: idx: i, range of 4, increment by 5
// diag checks: idx: 0, range of 4, increment by 6
//              idx: 20, range of 4, decrement by 4
// 386584309
// ABCDEFGHI
// AGEHBDIFC
// 338085946
// 323795846
// 004,270,100


  render: function() {
    const bingoSquares = [[]];
    const bingoValues = this.state.bingoValues;
    const bingoOptions = this.state.bingoOptions;

    return (
      <div className="bingo">
          <div className="bingocard">
            <div className="header-grid">
              <div
                className="shuffle"
                onClick={this.shuffleAgain.bind(this, Default)}
                >Shuffle
              </div>
              <div className="title">AI-isms Bingo</div>
          </div>
          <div className="squares-grid">
            { bingoOptions.map(function (square, idx){
              return <p
                key={"square-" + idx}
                className={bingoValues[idx] === true ? "bingocard-selected" : "bingocard-square"}
                onClick={this.squareClicked.bind(this, idx)}
                >{square}
                </p>
              }.bind(this))
            }
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  React.createElement(bingoCard),
  document.querySelector("#container")
);
