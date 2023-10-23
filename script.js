function GameBoard() {
  const board = [];

  // Fills the board with cells (3x3)
  for (let i = 0; i < 9; i++) {
    board.push(Cell());
  }

  // Gets variable board
  const getBoard = () => board;

  // Marks chosen cell
  const markCell = (position, player) => {
    // Check if there are cells available
    if (board[position].getValue() !== 0) return false;
    else {
      board[position].addMark(player);
      return true;
    }
  };

  // Prints the board
  const printBoard = () => {
    console.log(
      board[0].getValue() +
        " " +
        board[1].getValue() +
        " " +
        board[2].getValue()
    );
    console.log(
      board[3].getValue() +
        " " +
        board[4].getValue() +
        " " +
        board[5].getValue()
    );
    console.log(
      board[6].getValue() +
        " " +
        board[7].getValue() +
        " " +
        board[8].getValue()
    );
  };

  return { getBoard, markCell, printBoard };
}

function Cell() {
  let value = 0;
  let name = "Player";

  const addMark = (player) => {
    value = player.mark;
    name = player.name;
  };

  const getValue = () => value;

  const getName = () => name;

  return { addMark, getValue, getName };
}

function GameController() {
  // Instantiates a GameBoard
  const board = GameBoard();
  // Creates the players
  const players = [
    {
      name: "Player 1",
      mark: "X",
    },
    {
      name: "Player 2",
      mark: "O",
    },
  ];
  let currentPlayer = players[0];
  const setPlayersNames = (playerOne, playerTwo) => {
    players[0].name = playerOne;
    players[1].name = playerTwo;
  };
  const getCurrentPlayer = () => currentPlayer;
  const switchPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };
  const printRound = () => {
    board.printBoard();
    console.log(`${currentPlayer.name} turn.`);
  };
  const checkForEndGame = () => {
    let currentBoard = board.getBoard();
    let winner = 0;

    // Check rows
    for (let i = 0; i < currentBoard.length - 1; i += 3) {
      if (
        currentBoard[i].getValue() === currentBoard[i + 1].getValue() &&
        currentBoard[i].getValue() === currentBoard[i + 2].getValue()
      ) {
        winner = currentBoard[i].getValue();
        if (winner !== 0) return currentBoard[i];
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        currentBoard[i].getValue() === currentBoard[i + 3].getValue() &&
        currentBoard[i].getValue() === currentBoard[i + 6].getValue()
      ) {
        winner = currentBoard[i].getValue();
        if (winner !== 0) return currentBoard[i];
      }
    }

    // Check diagonals
    if (
      currentBoard[0].getValue() === currentBoard[4].getValue() &&
      currentBoard[0].getValue() === currentBoard[8].getValue()
    ) {
      winner = currentBoard[0].getValue();
      if (winner !== 0) return currentBoard[0];
    }
    if (
      currentBoard[2].getValue() === currentBoard[4].getValue() &&
      currentBoard[2].getValue() === currentBoard[6].getValue()
    ) {
      winner = currentBoard[2].getValue();
      if (winner !== 0) return currentBoard[2];
    }

    // Check tie
    if (currentBoard.every((cell) => cell.getValue() !== 0)) {
      return "tie";
    }

    return false;
  };
  const playRound = (position) => {
    console.log(players);
    if (board.markCell(position, currentPlayer)) {
      switchPlayer();
      //printRound();
    }
    return checkForEndGame();
  };
  const restartBoard = () => {
    board = GameBoard();
  };
  // We trigger the initial Round
  printRound();

  return {
    playRound,
    setPlayersNames,
    getCurrentPlayer,
    getBoard: board.getBoard,
    restartBoard,
    printRound,
  };
}

function ScreenController() {
  // HTML elements
  let game = GameController();
  const boardDiv = document.querySelector(".board");
  const playerPrompt = document.querySelector(".player-prompt");
  const startGameScreen = document.querySelector(".start-game");
  const playerOneInput = document.querySelector("#player-one");
  const playerTwoInput = document.querySelector("#player-two");
  const startGameButton = document.querySelector("#start-game-btn");
  const restartButton = document.querySelector("#restart-btn");

  let gameEnd = false;
  let playerOneName = "";
  let playerTwoName = "";

  startGameButton.addEventListener("click", () => {
    playerOneName = playerOneInput.value;
    playerTwoName = playerTwoInput.value;
    game.setPlayersNames(playerOneName, playerTwoName);
    startGameScreen.classList.add("closed");
    updateScreen();
  });

  const updateScreen = () => {
    // Clean board
    boardDiv.textContent = "";

    // Get latest version of the board and player turn
    const board = game.getBoard();
    // console.log(game.printRound());
    const activePlayer = game.getCurrentPlayer();

    // Render cells
    board.forEach((cell, index) => {
      console.log(board[index].getValue());
      // We create a div for each cell
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("game-cell");
      cellDiv.dataset.cell = index;
      cellDiv.innerHTML = `${
        board[index].getValue() !== 0 ? board[index].getValue() : ""
      }`;
      boardDiv.appendChild(cellDiv);
      // We add the current player to the prompt
      playerPrompt.innerHTML = `${activePlayer.name}'s turn`;
    });
  };

  function clickHandlerBoard(e) {
    const selectedCell = e.target.dataset.cell;
    if (!selectedCell) return;
    let winner = game.playRound(selectedCell);
    updateScreen();

    if (winner !== false) {
      boardDiv.removeEventListener("click", clickHandlerBoard);
      console.log(winner);

      if (winner === "tie") playerPrompt.innerHTML = `Tie!`;
      else playerPrompt.innerHTML = `${winner.getName()} wins!`;

      gameEnd = true;
    }
  }

  boardDiv.addEventListener("click", clickHandlerBoard);
  restartButton.addEventListener("click", () => {
    console.log("restarting");
    // Set players names
    game = GameController();
    game.setPlayersNames(playerOneName, playerTwoName);
    updateScreen();
    boardDiv.addEventListener("click", clickHandlerBoard);
  });

  // Initial render
  updateScreen();
}

ScreenController();
