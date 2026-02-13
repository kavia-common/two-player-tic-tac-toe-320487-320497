# Two-Player Tic Tac Toe (React) — Project Documentation

## Overview

This repository contains a simple, local two-player Tic Tac Toe game intended to be played by two people on the same device. The application renders a 3x3 grid, enforces turn-based play, detects wins and draws, and allows restarting the game. All game logic is implemented on the client side.

The implementation lives in a single React frontend container, with no backend services and no external APIs required for gameplay.

## Features

The application supports the following core behaviors:

## Turn-based local play

The game starts with player X. Each valid click places the current player’s mark in an empty square and advances the turn to the other player.

## Win detection

After each move, the application checks the standard 8 winning lines (3 rows, 3 columns, 2 diagonals). When a line is complete, the UI displays the winner and the board becomes non-interactive.

## Draw detection

If all 9 squares are filled without a winner, the application displays “Draw” and disables further moves.

## Restarting

The “Restart” button clears the board and resets the next player to X.

## Tech stack

## Frontend

The `tic_tac_toe_frontend` container is a Create React App project.

It uses:

- React (via `react` and `react-dom`)
- `react-scripts` for dev server, build, and test tooling
- React Testing Library and `user-event` for UI interaction tests

Styling is implemented using plain CSS (no UI framework). The theme is a modern light palette with blue and cyan accents.

## Repository layout

The key paths in this repo are:

- `two-player-tic-tac-toe-320487-320497/`
  - `README.md`: Minimal top-level placeholder readme
  - `PROJECT_DOCUMENTATION.md`: This document
  - `tic_tac_toe_frontend/`: React frontend container
    - `package.json`: Dependencies and scripts
    - `public/`: CRA HTML template and manifest
    - `src/`: App implementation, styles, and tests
      - `App.js`: Main game component and game logic
      - `App.css`: App styling (board layout, controls, theming)
      - `App.test.js`: Interaction-based tests for core behaviors
      - `index.js`: React entry point
      - `index.css`: Global baseline styles

## How the game works (implementation notes)

The entire gameplay state is held locally within the `App` component.

## State

- `squares`: an array of 9 entries initialized to `null`. Each entry becomes `"X"` or `"O"` when played.
- `nextPlayer`: the current player mark (`"X"` or `"O"`).

## Derived game information

A derived `game` object is computed using `useMemo` based on `squares` and `nextPlayer`. It includes:

- `winner`: `"X"` or `"O"` when a winning line is found; otherwise `null`
- `winningLine`: the indexes of the winning line when present; otherwise `null`
- `isDraw`: `true` if the board is full and there is no winner
- `statusText`: one of `Turn: X`, `Turn: O`, `Winner: X`, `Winner: O`, or `Draw`
- `isOver`: `true` when either a win or a draw has occurred

## User interactions

- Clicking a square triggers `handleSquareClick(index)`.
  - The click is ignored if the game is over or if the square is already filled.
  - Otherwise, the mark is placed and `nextPlayer` toggles to the other player.
- Clicking “Restart” triggers `restartGame()`.
  - Resets `squares` to all `null`
  - Resets `nextPlayer` to `"X"`

## Accessibility and UI semantics

The board is rendered as a grid using ARIA roles:

- The board uses `role="grid"`.
- Each square is a `button` with `role="gridcell"`.
- The status area uses `role="status"` with `aria-live="polite"` so status changes are announced by assistive technologies.
- The “current player” pill is not shown after the game is over.

Each square button also includes an `aria-label` in the format:

- `Square N` when empty
- `Square N, X` or `Square N, O` when filled

This labeling is used by the test suite as well.

## Local development

All commands below are run from the frontend container directory:

```bash
cd two-player-tic-tac-toe-320487-320497/tic_tac_toe_frontend
```

## Install dependencies

```bash
npm install
```

## Run the app (development server)

```bash
npm start
```

Create React App will start a dev server (typically on port 3000) and open the app in a browser.

## Run tests

By default CRA starts tests in watch mode. In CI environments you may prefer non-interactive mode:

```bash
CI=true npm test
```

## Production build

```bash
npm run build
```

The build output will be produced in `tic_tac_toe_frontend/build`.

## Environment variables

This project does not require external APIs for gameplay. However, the container environment indicates the following variables may be present in a `.env` file for the container:

- `REACT_APP_API_BASE`
- `REACT_APP_BACKEND_URL`
- `REACT_APP_FRONTEND_URL`
- `REACT_APP_WS_URL`
- `REACT_APP_NODE_ENV`
- `REACT_APP_NEXT_TELEMETRY_DISABLED`
- `REACT_APP_ENABLE_SOURCE_MAPS`
- `REACT_APP_PORT`
- `REACT_APP_TRUST_PROXY`
- `REACT_APP_LOG_LEVEL`
- `REACT_APP_HEALTHCHECK_PATH`
- `REACT_APP_FEATURE_FLAGS`
- `REACT_APP_EXPERIMENTS_ENABLED`

In Create React App, only variables prefixed with `REACT_APP_` are exposed to the browser at build time. As of the current code, the frontend does not reference these variables directly.

## Testing coverage (high-level)

The test suite in `src/App.test.js` exercises the primary user flows:

- Initial render shows Turn: X and an empty enabled board
- Alternating turns after clicks places X and O and updates status text
- Win detection ends the game and disables the board
- Draw detection ends the game and disables the board
- Restart clears the board and resets to Turn: X

These tests validate the game logic via UI interactions rather than directly inspecting internal state.
