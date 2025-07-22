const cells = document.querySelectorAll("[data-cell]");
const status = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const backBtn = document.getElementById("backBtn");
const drawModal = document.getElementById("drawModal");
const winModal = document.getElementById("winModal");
const winMessage = document.getElementById("winMessage");

let currentPlayer = "x";
let gameActive = true;

const modeModal = document.getElementById("modeModal");
const playFriendBtn = document.getElementById("playFriend");
const playComputerBtn = document.getElementById("playComputer");
const gameContainer = document.getElementById("gameContainer");
let gameMode = "friend";

const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Mode selection
playFriendBtn.addEventListener("click", () => {
  gameMode = "friend";
  modeModal.style.display = "none";
  gameContainer.classList.remove("hidden");
  resetGame();
});

playComputerBtn.addEventListener("click", () => {
  gameMode = "computer";
  modeModal.style.display = "none";
  gameContainer.classList.remove("hidden");
  resetGame();
});

backBtn.addEventListener("click", () => {
  gameContainer.classList.add("hidden");
  modeModal.style.display = "flex";
  resetGame();
});

function handleClick(e) {
  const cell = e.target;
  if (gameMode === "computer" && currentPlayer !== "x") return;
  if (cell.textContent || !gameActive) return;

  cell.textContent = currentPlayer.toUpperCase();
  cell.classList.add(currentPlayer);

  if (checkWin()) return handleGameEnd();
  if (checkDraw()) return handleDraw();

  currentPlayer = currentPlayer === "x" ? "o" : "x";
  status.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;

  if (gameMode === "computer" && currentPlayer === "o") {
    setTimeout(computerMove, 400);
  }
}

function computerMove() {
  if (!gameActive) return;

  const board = [...cells].map((cell) => cell.textContent.toLowerCase());
  const bestMove = minimax(board, "o").index;
  const cell = cells[bestMove];

  cell.textContent = "O";
  cell.classList.add("o");

  if (checkWin()) return handleGameEnd();
  if (checkDraw()) return handleDraw();

  currentPlayer = "x";
  status.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
}

function minimax(board, player) {
  const huPlayer = "x";
  const aiPlayer = "o";
  const availSpots = board
    .map((v, i) => (v === "" ? i : null))
    .filter((v) => v !== null);

  if (isWinning(board, huPlayer)) return { score: -10 };
  if (isWinning(board, aiPlayer)) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    board[availSpots[i]] = player;

    if (player === aiPlayer) {
      const result = minimax(board, huPlayer);
      move.score = result.score;
    } else {
      const result = minimax(board, aiPlayer);
      move.score = result.score;
    }

    board[availSpots[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function isWinning(board, player) {
  return winCombinations.some((comb) => comb.every((i) => board[i] === player));
}

function checkWin() {
  return winCombinations.some((combination) =>
    combination.every(
      (index) => cells[index].textContent.toLowerCase() === currentPlayer
    )
  );
}

function checkDraw() {
  return [...cells].every((cell) => cell.textContent !== "");
}

function resetGame() {
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("x", "o");
  });
  currentPlayer = "x";
  gameActive = true;
  status.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
}

function handleGameEnd() {
  gameActive = false;
  status.textContent = `Player ${currentPlayer.toUpperCase()} wins!`;
  winMessage.textContent = status.textContent + " Restarting...";
  winModal.style.display = "flex";
  setTimeout(() => {
    winModal.style.display = "none";
    resetGame();
  }, 2000);
}

function handleDraw() {
  gameActive = false;
  status.textContent = "Game is a draw!";
  drawModal.style.display = "flex";
  setTimeout(() => {
    drawModal.style.display = "none";
    resetGame();
  }, 2000);
}

cells.forEach((cell) => cell.addEventListener("click", handleClick));
resetBtn.addEventListener("click", resetGame);

// Prevent zoom & scroll issues
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && ["+", "-", "0"].includes(e.key)) e.preventDefault();
});
document.addEventListener(
  "wheel",
  (e) => {
    if (e.ctrlKey) e.preventDefault();
  },
  { passive: false }
);
document.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length > 1) e.preventDefault();
  },
  { passive: false }
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((reg) => console.log("✅ Service Worker registered:", reg.scope))
      .catch((err) => console.error("❌ Service Worker failed:", err));
  });
}
