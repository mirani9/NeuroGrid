# 🧩 NeuroGrid — Light Flip Puzzle

**NeuroGrid** is a browser-based "Lights Out" style logic puzzle, where a single tap flips a tile *and* its neighbors — and the goal is to turn every light off. Under the hood, it uses a recursive backtracking algorithm to instantly generate solvable puzzles and reveal the optimal next move on demand.

🔗 **Live demo:** [mirani9.github.io/NeuroGrid](https://mirani9.github.io/NeuroGrid/)

---

## 🎮 How to Play

1. You're shown a 3×3 grid of lights, some on, some off.
2. Tap any tile — it flips **itself and its up/down/left/right neighbors**.
3. Keep flipping until **every light is off**.
4. Stuck? Hit **Hint** to get a mathematically verified next move.
5. Hit **Restart** any time for a fresh, guaranteed-solvable puzzle.

## ✨ Features

- **Cross-flip mechanic** - clicking a tile toggles it plus its 4 orthogonal neighbors (classic Lights Out rules).
- **Guaranteed-solvable generation** — puzzles are built by applying random flips to a solved grid, so a solution always exists.
- **Backtracking solver** - a recursive search explores flip/no-flip decisions per tile to find a sequence that clears the board, powering the Hint button.
- **Move counter** — tracks how efficiently you solve each puzzle.
- **Minimal, responsive UI** with animated lightbulb tiles (Font Awesome icons).
- **Zero dependencies** — pure HTML, CSS, and vanilla JavaScript.

## 🛠️ Tech Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Structure  | HTML5                         |
| Styling    | CSS3                          |
| Logic      | Vanilla JavaScript            |
| Icons      | Font Awesome (via CDN)        |
| Hosting    | GitHub Pages                  |

No frameworks, no build step - open `index.html` and play.

## 🧠 The Algorithm

The trickiest part of NeuroGrid isn't the UI - it's proving a puzzle *can* be solved and finding how:

- **Generation:** Start from an all-off grid and apply a small number of random flips. Since every flip is its own inverse, the puzzle generated this way is always solvable.
- **Solving (Hint):** A recursive backtracking function walks through each tile in order, trying "flip" or "don't flip," undoing choices that lead to dead ends, until it finds a combination that leaves the whole grid off.

This turns a simple UI toy into a small demonstration of **state-space search and backtracking**, the same family of techniques used in Sudoku solvers and constraint-satisfaction problems.

## 🚀 Running Locally

```bash
git clone https://github.com/mirani9/NeuroGrid.git
cd NeuroGrid
open index.html   # or just double-click it
```

No installation, no dependencies, no server required.

## 🗺️ Possible Next Steps

- Adjustable grid sizes (4×4, 5×5)
- Difficulty levels (control number of scrambling moves)
- Move-history/undo
- Persistent best-score tracking

## 👤 Author

Built by [Mamta Mirani](https://github.com/mirani9).

## 📄 License

This project is licensed under the **MIT License**. 


If you enjoyed this project, consider giving it a ⭐ on GitHub!
