import React from 'react';
import ReactDOM from 'react-dom';

function Square(props) {
  return (
    <button className="square" style={props.style} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, causedWin) {
    let style = (causedWin && causedWin.indexOf(i) < 0) ?
      {backgroundColor: "#424242"} :
      {};
    return <Square key={i} style={style} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }
  render() {
    let rows = [];
    const causedWin = calculateCausedWin(this.props.squares);
    for (let i = 0; i < 3; i++) {
      let cols = [];
      for (let j = 0; j < 3; j++) {
        cols.push(this.renderSquare((i * 3) + j, causedWin));
      }
      rows.push(<div key={i} className="board-row">{cols}</div>);
    }

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        pos: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      isDesc: false,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        pos: i,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }
  inverse() {
    this.setState({
      isDesc: !this.state.isDesc,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move + " (" + (move % 2 ? "X" : "O") + ": " + ((step.pos % 3) + 1) + ", " + (Math.floor(step.pos / 3) + 1) +")":
        'Game start';
      return (
        <li key={move}>
          <a href="#" style={step == current ? {fontWeight: "bold"} : {}} onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });
    this.state.isDesc && moves.reverse();

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.inverse()}>{this.state.isDesc ? "desc" : "asc"}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculateCausedWin(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
