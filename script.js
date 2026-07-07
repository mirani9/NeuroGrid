const N = 3;
let grid = [];
let moves = 0;
let _firstGame = true; // skip counting the auto-start on page load

function createEmptyGrid() {
  grid = Array.from({ length: N }, () => Array(N).fill(0));
}

function createMoveMasks() {
  const masks = [];

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      let mask = 0;
      const dx = [0, -1, 1, 0, 0];
      const dy = [0, 0, 0, -1, 1];

      for (let d = 0; d < 5; d++) {
        const nx = i + dx[d];
        const ny = j + dy[d];

        if (nx >= 0 && ny >= 0 && nx < N && ny < N) {
          mask |= 1 << (nx * N + ny);
        }
      }

      masks.push(mask);
    }
  }

  return masks;
}

const moveMasks = createMoveMasks();

function buildSolutionDistances() {
  const distances = new Map();
  const queue = [0];

  distances.set(0, 0);

  while (queue.length > 0) {
    const state = queue.shift();
    const distance = distances.get(state);

    for (let i = 0; i < moveMasks.length; i++) {
      const nextState = state ^ moveMasks[i];

      if (!distances.has(nextState)) {
        distances.set(nextState, distance + 1);
        queue.push(nextState);
      }
    }
  }

  return distances;
}

const solutionDistances = buildSolutionDistances();

function getStateFromGrid(g) {
  let state = 0;

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (g[i][j] === 1) state |= 1 << (i * N + j);
    }
  }

  return state;
}

function getShortestSolutionLength(state) {
  return solutionDistances.get(state) ?? -1;
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
  while (true) {
    const tempGrid = Array.from({ length: N }, () => Array(N).fill(0));
    const randomMoves = Math.floor(Math.random() * 5) + 8;

    for (let k = 0; k < randomMoves; k++) {
      const x = Math.floor(Math.random() * N);
      const y = Math.floor(Math.random() * N);
      flip(x, y, tempGrid);
    }

    const state = getStateFromGrid(tempGrid);

    if (getShortestSolutionLength(state) >= 6) {
      grid = tempGrid;
      return;
    }
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

  if (win) setTimeout(() => showWinBanner(), 120);
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
  if (!_firstGame) trackGame();
  _firstGame = false;
}

// ─── Win banner ──────────────────────────────────────────────────────────────
function showWinBanner() {
  const existing = document.getElementById("win-banner");
  if (existing) existing.remove();

  const banner = document.createElement("div");
  banner.id = "win-banner";
  banner.innerHTML = `
    <div class="win-inner">
      <div class="win-emoji">🎉</div>
      <div class="win-title">Puzzle Solved!</div>
      <div class="win-sub">in <strong>${moves}</strong> move${moves !== 1 ? "s" : ""}</div>
      <button class="win-btn" onclick="document.getElementById('win-banner').remove(); newGame();">Play Again</button>
    </div>`;
  document.querySelector(".game-shell").appendChild(banner);
}

// ─── Abacus stats (free, no-auth counter API) ────────────────────────────────
const NS = "neurogrid-mirani9";

function formatCount(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}

async function refreshStats() {
  try {
    const [vRes, gRes] = await Promise.all([
      fetch(`https://abacus.jasoncameron.dev/get/${NS}/visitors`),
      fetch(`https://abacus.jasoncameron.dev/get/${NS}/games`),
    ]);
    const vData = await vRes.json();
    const gData = await gRes.json();
    if (vData.value != null) document.getElementById("stat-visitors").textContent = formatCount(vData.value);
    if (gData.value != null) document.getElementById("stat-games").textContent   = formatCount(gData.value);
  } catch (_) { /* silently ignore network errors */ }
}

async function trackVisitor() {
  if (sessionStorage.getItem("ng_visited")) { refreshStats(); return; }
  sessionStorage.setItem("ng_visited", "1");
  try {
    const res = await fetch(`https://abacus.jasoncameron.dev/hit/${NS}/visitors`);
    const data = await res.json();
    if (data.value != null) document.getElementById("stat-visitors").textContent = formatCount(data.value);
  } catch (_) {}
  refreshStats();
}

async function trackGame() {
  try {
    const res = await fetch(`https://abacus.jasoncameron.dev/hit/${NS}/games`);
    const data = await res.json();
    if (data.value != null) document.getElementById("stat-games").textContent = formatCount(data.value);
  } catch (_) {}
}

// ─── App entry point ─────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  trackVisitor();
  newGame();
});
