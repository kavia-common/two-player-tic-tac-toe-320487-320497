# Tic Tac Toe — Feature Document

## Overview

This application is a simple, local, two-player Tic Tac Toe game intended to be played by two people on the same device. It renders a 3x3 board, enforces alternating turns between X and O, detects wins and draws, prevents invalid moves, and supports restarting the game at any time. All game logic is implemented on the client side, and no backend services or external APIs are required.

## Core gameplay features

### 3x3 interactive game board

The game presents a 3x3 grid of squares. Each square is a clickable button that can hold a single mark. The board is implemented as nine squares mapped from an in-memory array of nine values.

A square is clickable only when the game is still in progress and the square is currently empty. Once clicked, the square displays the current player’s mark.

### Two-player, turn-based play (local)

The game always starts with player X. Each valid move places the current player’s mark on the selected square and then switches the turn to the other player (X to O, or O to X). The current turn is displayed in the status area as plain text.

Internally, the next player is tracked with a `nextPlayer` state value that alternates between `"X"` and `"O"` after each valid move.

### Win detection (8 standard lines)

After each move, the game checks for a winner using the standard 8 Tic Tac Toe win lines:

- Three horizontal rows
- Three vertical columns
- Two diagonals

When a winning line is found, the game displays the winner in the status area as `Winner: X` or `Winner: O`. The board becomes non-interactive after a win so no additional moves can be made.

In addition to ending the game, the three squares that make up the winning line are visually highlighted.

### Draw detection

If all nine squares have been played and no winning line exists, the game ends in a draw. The status area displays `Draw`, and the board becomes non-interactive.

Draw detection is based on the board being full (all squares non-null) while no winner is present.

### Preventing invalid moves

The application prevents two classes of invalid moves:

- Clicking a square that is already filled does nothing.
- Clicking any square after the game is over (either a win or a draw) does nothing.

From a UI perspective, these invalid moves are prevented by disabling squares when appropriate, which also provides clearer feedback to the user.

### Restarting the game

A prominent `Restart` button is always available below the board. Clicking it resets the game to its initial state:

- The board is cleared (all squares become empty).
- The next player resets to X.
- The game status returns to `Turn: X`.
- The board becomes interactive again.

Restarting works regardless of whether the previous game ended in progress, in a win, or in a draw.

## Status and guidance features

### Status display and “current player” indicator

The game includes a status area that displays one of the following states:

- `Turn: X`
- `Turn: O`
- `Winner: X`
- `Winner: O`
- `Draw`

While the game is in progress, a small “current player” pill is shown beside the status text. After the game ends (win or draw), this pill is intentionally hidden so the UI does not imply further play is expected.

### Player legend and usage tip

Below the board, the UI includes:

- A small legend showing which styles correspond to X and O.
- A tip reminding users they cannot overwrite a filled square.

These elements are purely informational and do not affect game logic.

## Accessibility and interaction semantics

The UI includes explicit semantic and accessibility affordances:

- The status area is a live region (`role="status"` and `aria-live="polite"`) so changes such as “Winner: X” or “Draw” can be announced by assistive technologies.
- The board is exposed as a grid (`role="grid"`), and each square uses `role="gridcell"` and is implemented as an actual `<button>` for keyboard accessibility.
- Each square has an `aria-label` of the form:
  - `Square N` when empty
  - `Square N, X` or `Square N, O` when filled

This provides screen reader clarity and also enables reliable UI testing.

## Visual and layout features

The game uses a modern, light theme with a centered layout:

- The screen is structured as a centered single-column card layout so the header, status, board, and footer controls align.
- The theme uses a light background and accent colors: blue for X and cyan for O.
- The board and squares scale responsively using CSS `clamp()` so they remain usable on small devices while not becoming overly large on desktop.

## Out of scope / not implemented

This project intentionally focuses on local play and does not include:

- Single-player mode (no AI opponent).
- Online multiplayer or networking.
- Player names, scoring across multiple rounds, or match history persistence.
- Backend integration or API calls for gameplay.

These capabilities are not present in the current codebase and are not described as features of this app.
