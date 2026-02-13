import React, { useMemo, useState } from "react";
import "./App.css";

const PLAYERS = {
  X: "X",
  O: "O",
};

const WIN_LINES = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // cols
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonals
  [0, 4, 8],
  [2, 4, 6],
];

// PUBLIC_INTERFACE
function App() {
  /** Top-level Tic Tac Toe app: manages local two-player game state and renders UI. */
  const [squares, setSquares] = useState(() => Array(9).fill(null));
  const [nextPlayer, setNextPlayer] = useState(PLAYERS.X);

  const game = useMemo(() => {
    /**
     * Compute derived game state from squares.
     * We keep this derived to avoid accidentally desynchronizing state.
     */
    let winner = null;
    let winningLine = null;

    for (const [a, b, c] of WIN_LINES) {
      const v = squares[a];
      if (v && v === squares[b] && v === squares[c]) {
        winner = v;
        winningLine = [a, b, c];
        break;
      }
    }

    const isDraw = !winner && squares.every((s) => s !== null);

    let statusText = `Turn: ${nextPlayer}`;
    if (winner) statusText = `Winner: ${winner}`;
    if (isDraw) statusText = "Draw";

    return {
      winner,
      winningLine,
      isDraw,
      statusText,
      isOver: Boolean(winner || isDraw),
    };
  }, [squares, nextPlayer]);

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    /**
     * Place the current player's mark if the move is valid.
     * Ignores clicks after game end or on occupied squares.
     */
    if (game.isOver) return;
    if (squares[index] !== null) return;

    setSquares((prev) => {
      const copy = prev.slice();
      copy[index] = nextPlayer;
      return copy;
    });
    setNextPlayer((prev) => (prev === PLAYERS.X ? PLAYERS.O : PLAYERS.X));
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    /** Reset board and current player to start a new game. */
    setSquares(Array(9).fill(null));
    setNextPlayer(PLAYERS.X);
  }

  return (
    <div className="App">
      <main className="ttt">
        <header className="ttt__header">
          <div className="ttt__titleWrap">
            <h1 className="ttt__title">Tic Tac Toe</h1>
            <p className="ttt__subtitle">Two players. One device. First to 3 in a row wins.</p>
          </div>

          <div className="ttt__status" role="status" aria-live="polite">
            <span className="ttt__statusLabel">{game.statusText}</span>
            {!game.isOver && (
              <span className="ttt__pill" aria-label="Current player">
                <span
                  className={`ttt__mark ttt__mark--${nextPlayer === PLAYERS.X ? "x" : "o"}`}
                  aria-hidden="true"
                >
                  {nextPlayer}
                </span>
              </span>
            )}
          </div>
        </header>

        <section className="ttt__boardSection" aria-label="Tic Tac Toe board">
          <div className="board" role="grid" aria-label="3 by 3 Tic Tac Toe grid">
            {squares.map((value, idx) => {
              const isWinning = game.winningLine ? game.winningLine.includes(idx) : false;
              const isFilled = value !== null;

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    "square",
                    isWinning ? "square--win" : "",
                    isFilled ? "square--filled" : "",
                    value === PLAYERS.X ? "square--x" : "",
                    value === PLAYERS.O ? "square--o" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleSquareClick(idx)}
                  disabled={game.isOver || isFilled}
                  role="gridcell"
                  aria-label={`Square ${idx + 1}${value ? `, ${value}` : ""}`}
                >
                  <span className="square__value" aria-hidden="true">
                    {value}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ttt__footer">
            <button type="button" className="btn" onClick={restartGame}>
              Restart
            </button>

            <div className="ttt__help">
              <div className="ttt__legend" aria-label="Player legend">
                <span className="ttt__legendItem">
                  <span className="ttt__legendDot ttt__legendDot--x" aria-hidden="true" />X
                </span>
                <span className="ttt__legendItem">
                  <span className="ttt__legendDot ttt__legendDot--o" aria-hidden="true" />O
                </span>
              </div>
              <span className="ttt__note">Tip: You can’t overwrite a filled square.</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
