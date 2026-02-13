import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

/**
 * Helpers
 */
function getStatus() {
  // App uses: <div className="ttt__status" role="status" aria-live="polite">
  return screen.getByRole("status");
}

function getStatusText() {
  // Status text is rendered in a <span className="ttt__statusLabel">{game.statusText}</span>
  return within(getStatus()).getByText(/turn:|winner:|draw/i);
}

function getSquares() {
  // Each square is a <button role="gridcell" aria-label="Square N[, X|O]">
  return screen.getAllByRole("gridcell");
}

function expectEmptyBoard() {
  const squares = getSquares();
  expect(squares).toHaveLength(9);
  for (let i = 0; i < squares.length; i += 1) {
    // When empty, aria-label is exactly "Square {idx+1}"
    expect(squares[i]).toHaveAttribute("aria-label", `Square ${i + 1}`);
    // Visible mark is rendered in an aria-hidden span; button textContent should be empty/whitespace.
    expect(squares[i]).toHaveTextContent(/^$/);
    expect(squares[i]).toBeEnabled();
  }
}

test("initial state: shows Turn: X, current player pill, and an empty enabled 3x3 board", () => {
  render(<App />);

  // Title present (sanity)
  expect(screen.getByRole("heading", { name: /tic tac toe/i })).toBeInTheDocument();

  // Status indicates X starts
  expect(getStatusText()).toHaveTextContent(/turn:\s*x/i);

  // "Current player" pill is visible before game over
  expect(screen.getByLabelText(/current player/i)).toBeInTheDocument();

  // Board is empty and enabled
  expectEmptyBoard();
});

test("alternating turns: clicking squares places marks and updates turn indicator", async () => {
  const user = userEvent.setup();
  render(<App />);

  const squares = getSquares();

  // X plays square 1
  await user.click(squares[0]);
  expect(squares[0]).toHaveAttribute("aria-label", "Square 1, X");
  expect(squares[0]).toHaveTextContent("X");
  expect(getStatusText()).toHaveTextContent(/turn:\s*o/i);

  // O plays square 2
  await user.click(squares[1]);
  expect(squares[1]).toHaveAttribute("aria-label", "Square 2, O");
  expect(squares[1]).toHaveTextContent("O");
  expect(getStatusText()).toHaveTextContent(/turn:\s*x/i);
});

test("win detection: shows Winner: X and disables further moves", async () => {
  const user = userEvent.setup();
  render(<App />);

  const squares = getSquares();

  // X: 1, O: 4, X: 2, O: 5, X: 3 -> X wins top row
  await user.click(squares[0]); // X
  await user.click(squares[3]); // O
  await user.click(squares[1]); // X
  await user.click(squares[4]); // O
  await user.click(squares[2]); // X wins

  expect(getStatusText()).toHaveTextContent(/winner:\s*x/i);

  // Current player pill should disappear when game is over
  expect(screen.queryByLabelText(/current player/i)).not.toBeInTheDocument();

  // All squares should now be disabled (App disables when game.isOver or filled)
  for (const sq of squares) {
    expect(sq).toBeDisabled();
  }
});

test("draw detection: shows Draw and disables the board", async () => {
  const user = userEvent.setup();
  render(<App />);

  const squares = getSquares();

  /**
   * Fill the board with no winner. One known draw sequence:
   * X O X
   * X X O
   * O X O
   *
   * Indices:
   * 0 1 2
   * 3 4 5
   * 6 7 8
   *
   * Moves (alternating starting with X):
   * 0(X),1(O),2(X),3(O?) -> careful to match pattern above.
   *
   * Use this move order to produce the desired final board:
   * 0 X
   * 1 O
   * 2 X
   * 5 O
   * 3 X
   * 6 O
   * 4 X
   * 8 O
   * 7 X
   */
  const moveOrder = [0, 1, 2, 5, 3, 6, 4, 8, 7];
  for (const idx of moveOrder) {
    await user.click(squares[idx]);
  }

  expect(getStatusText()).toHaveTextContent(/^draw$/i);
  expect(screen.queryByLabelText(/current player/i)).not.toBeInTheDocument();

  for (const sq of squares) {
    expect(sq).toBeDisabled();
  }
});

test("restart: clears the board, resets status to Turn: X, and re-enables play", async () => {
  const user = userEvent.setup();
  render(<App />);

  const squares = getSquares();

  // Play a couple moves
  await user.click(squares[0]); // X
  await user.click(squares[1]); // O
  expect(getStatusText()).toHaveTextContent(/turn:\s*x/i);
  expect(squares[0]).toHaveAttribute("aria-label", "Square 1, X");
  expect(squares[1]).toHaveAttribute("aria-label", "Square 2, O");

  // Restart
  await user.click(screen.getByRole("button", { name: /restart/i }));

  // Back to initial state
  expect(getStatusText()).toHaveTextContent(/turn:\s*x/i);
  expect(screen.getByLabelText(/current player/i)).toBeInTheDocument();
  expectEmptyBoard();
});
