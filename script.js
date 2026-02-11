const winningCombination = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
function playerFactory(name, mark) {
  let score = 0;
  const addPoint = () => {
    score++;
  };
  const getScore = () => {
    return score;
  };
  function getInfo() {
    return `${name} plays ${mark}`;
  }

  return { name, mark, getInfo, addPoint, getScore };
}

function gameBoard() {
  let board = ["", "", "", "", "", "", "", "", ""];
  const setCell = (index, mark) => {
    if (index < 0 || index > 8) return false;
    if (board[index] !== "") return false;
    board[index] = mark;
    return true;
  };
  const getBoard = () => {
    return [...board];
  };
  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };
  return { setCell, getBoard, reset };
}

function gameController(player1, player2) {
  let currentPlayer = player1;
  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };
  const getCurrentPlayer = () => currentPlayer;
  const setCurrentPlayer = (player) => {
    currentPlayer = player;
  };

  return { switchPlayer, getCurrentPlayer, setCurrentPlayer };
}

function setupPlayers() {
  let player1Name = prompt("Введите имя первого игрока") || "Игрок 1";
  let player1Mark = (prompt("Введите знак первого игрока ('X' или 'O')") || "X")
    .trim()
    .toUpperCase();

  if (player1Mark !== "X" && player1Mark !== "O") {
    alert("Можно вводить лишь 'X' или 'O'");
    return null;
  }

  let player2Name = prompt("Введите имя второго игрока") || "Игрок 2";
  let player2Mark = player1Mark === "X" ? "O" : "X";

  const p1 = playerFactory(player1Name, player1Mark);
  const p2 = playerFactory(player2Name, player2Mark);

  return { p1, p2 };
}

function askIndex(currentPlayer) {
  const input = prompt(
    `${currentPlayer.name} (${currentPlayer.mark}), выбери клетку (1–9)`,
  );
  const index = Number(input) - 1;

  if (Number.isNaN(index) || index < 0 || index > 8) {
    alert("Введи число от 1 до 9");
    return null;
  }

  return index;
}

function checkWin(board, mark) {
  return winningCombination.some((combo) =>
    combo.every((index) => board[index] === mark),
  );
}

function checkDraw(board) {
  return board.every((cell) => cell !== "");
}

function printBoard(boardArr) {
  const c = boardArr.map((elem) => (elem === "" ? " " : elem));
  console.log(
    `
     ${c[0]} | ${c[1]} | ${c[2]} 
    ---+---+---
     ${c[3]} | ${c[4]} | ${c[5]} 
    ---+---+---
     ${c[6]} | ${c[7]} | ${c[8]} 
    `,
  );
}

function game() {
  const players = setupPlayers();
  if (!players) return;

  const { p1, p2 } = players;

  const board = gameBoard();
  const controller = gameController(p1, p2);

  console.log(p1.getInfo());
  console.log(p2.getInfo());
  console.log("Start player:", controller.getCurrentPlayer().name);

  function playTurn(index) {
    let currentPlayer = controller.getCurrentPlayer();
    let mark = currentPlayer.mark;

    let valid = board.setCell(index, mark);
    if (!valid) {
      alert("Клетка занята или индекс неверный. Пробуй ещё раз.");
      return "continue";
    }
    let boardArr = board.getBoard();
    printBoard(boardArr);

    if (checkWin(boardArr, mark)) {
      currentPlayer.addPoint();
      alert(
        `${currentPlayer.name} победил, счет сейчас ${p1.getScore()} : ${p2.getScore()}`,
      );
      board.reset();
      return "roundOver";
    }

    if (checkDraw(boardArr, mark)) {
      alert(`Ничья! Счет также ${p1.getScore()} : ${p2.getScore()}`);
      board.reset();
      return "roundOver";
    }
    controller.switchPlayer();
    return "continue";
  }
  let playMore = true;
  while (playMore) {
    // старт раунда
    board.reset();
    controller.setCurrentPlayer(p1);
    console.log("Новый раунд. Начинает:", controller.getCurrentPlayer().name);
    printBoard(board.getBoard());

    // внутренний цикл раунда
    let roundRunning = true;
    while (roundRunning) {
      const player = controller.getCurrentPlayer();
      const index = askIndex(player);
      if (index === null) continue;

      const result = playTurn(index);
      if (result === "roundOver") roundRunning = false;
    }

    playMore = confirm("Сыграть ещё раунд?");
  }
}
game();
