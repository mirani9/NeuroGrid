const N = 3;
let grid = [];
let moves = 0;

function createEmptyGrid() {
  grid = Array.from({ length: N }, () => Array(N).fill(0));
}

function flip(x, y, g = grid) {
  const dx = [0, -1, 1, 0, 0];
  const dy = [0, 0, 0, -1, 1];

  for (let d = 0; d < 5; d++) {
    const nx = x + dx[d];
    const ny = y + dy[d];

    if (nx >= 0 && ny >= 0 && nx < N && ny < N) {
      g[nx][ny] ^= 1;
    }
  }
}

function generatePuzzle() {
  createEmptyGrid();

  const randomMoves = Math.floor(Math.random() * 6) + 3;
  for (let k = 0; k < randomMoves; k++) {
    const x = Math.floor(Math.random() * N);
    const y = Math.floor(Math.random() * N);
    flip(x, y);
  }
}

function updateMovesDisplay() {
  document.getElementById("moves").textContent = moves;
}

function render() {
  const container = document.getElementById("grid");
  container.innerHTML = "";

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const btn = document.createElement("button");
      btn.className = grid[i][j] === 1 ? "tile on" : "tile off";
      btn.setAttribute("aria-label", `Tile ${i + 1}-${j + 1}`);
      btn.innerHTML = '<span class="bulb-icon"><i class="fa-regular fa-lightbulb"></i></span>';
      btn.onclick = () => {
        flip(i, j);
        moves += 1;
        updateMovesDisplay();
        render();
      };
      container.appendChild(btn);
    }
  }

  updateMovesDisplay();
  checkWin();
}

function checkWin() {
  let win = true;

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (grid[i][j] === 1) win = false;
    }
  }

  if (win) setTimeout(() => alert("Puzzle solved!"), 100);
}

function isAllOff(g) {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (g[i][j] === 1) return false;
    }
  }
  return true;
}

function solve(g, index, movesList) {
  if (index === N * N) return isAllOff(g);

  const x = Math.floor(index / N);
  const y = index % N;

  flip(x, y, g);
  movesList.push([x, y]);

  if (solve(g, index + 1, movesList)) return true;

  flip(x, y, g);
  movesList.pop();

  return solve(g, index + 1, movesList);
}

function getHint() {
  const temp = grid.map((row) => [...row]);
  const movesList = [];

  if (solve(temp, 0, movesList) && movesList.length > 0) {
    const [x, y] = movesList[0];
    alert(`Hint: try (${x}, ${y})`);
  } else {
    alert("No solution found!");
  }
}

function newGame() {
  moves = 0;
  generatePuzzle();
  render();
}

window.addEventListener("DOMContentLoaded", () => {
  newGame();
});
