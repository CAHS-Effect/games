let canvas = document.getElementById("mainCanvas");
let ctx = canvas.getContext("2d");
// 5x5 grid with letters
// null represents black square
const grid = [
	["E", "M", "M", null, null],
	["J", "U", "I", "C", "E"],
	["E", "S", "S", "A", "Y"],
	["C", "H", "O", "S", "E"],
	["T", "Y", null, null, null]
];

// positions for each clue; starts at 0; "[row],[column]"
const clueNumbers = [
	[1, 2, 3, null, null],
	[4, null, null, 5, 6],
	[7, null, null, null, null],
	[8, null, null, null, null],
	[9, null, null, null, null]
];

const cellSize = canvas.width / 5;

// determines direction of cell selection
// true = row; false = column
let isRow = true;
let currentRow = 0;
let currentCol = 0;

let answers = [
	[null, null, null, null, null],
	[null, null, null, null, null],
	[null, null, null, null, null],
	[null, null, null, null, null],
	[null, null, null, null, null]
]

let isErrorCheck = true;

// temporary fix for arrow keys not working
//canvas.setAttribute("tabindex", "0");
//canvas.focus();

// draws the 5x5 grid
function drawGrid() {
	let canvas = document.getElementById("gridCanvas");
	let ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			const x = col * cellSize;
			const y = row * cellSize;
			
			ctx.textBaseline = "alphabetic";
			ctx.textAlign = "start";
			ctx.font = "12px Arial";

			if (grid[row][col] !== null) {
				ctx.strokeStyle = "black";
				ctx.strokeRect(x, y, cellSize, cellSize);

				// Draw clue number if exists
				if (clueNumbers[row][col]) {
					ctx.fillStyle = "black";
					ctx.font = "10px Arial";
					ctx.fillText(clueNumbers[row][col], x + 2, y + 12);
				}
			} else {
				ctx.fillStyle = "black";
				ctx.fillRect(x, y, cellSize, cellSize);
			}
			
			if (answers[row][col] !== null) {
				if (answers[row][col] !== grid[row][col] && isErrorCheck) {
					ctx.fillStyle = "red";
				} else {
					ctx.fillStyle = "black";
				}
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.font = "48px Arial";
				ctx.fillText(answers[row][col], x + cellSize/2, y + cellSize/2 + 10);
			}
		}
	}
	highlightSelection();
	check
}

// makes selected row/column blue; makes current cell yellow
function highlightSelection() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const x = currentCol * cellSize;
	const y = currentRow * cellSize;
	ctx.fillStyle = "lightblue";
	if (isRow) {
		ctx.fillRect(0, y, canvas.width, cellSize);
	} else {
		ctx.fillRect(x, 0, cellSize, canvas.height);
	}

	ctx.fillStyle = "#FFF866";
	ctx.fillRect(x, y, cellSize, cellSize);
}

// navigation of cells using arrow keys
canvas.addEventListener("keydown", (e) => {
	switch (e.key) {
		case "ArrowUp":
			if (isRow) {
				// changes from row to column
				isRow = !isRow;
			} else {
				// moves the current cell to upward; wraps around past index 0
				currentRow = (currentRow - 1 + 5) % 5;
				// skips the black cells
				while (grid[currentRow][currentCol] === null) {
					currentRow = (currentRow - 1 + 5) % 5;
				}
			}
			break;
		case "ArrowDown":
			if (isRow) {
				// changes from row to column
				isRow = !isRow;
			} else {
				// moves the current cell to upward; wraps around past index 0
				currentRow = (currentRow + 1 + 5) % 5;
				// skips the black cells
				while (grid[currentRow][currentCol] === null) {
					currentRow = (currentRow + 1 + 5) % 5;
				}
			}
			break;
		case "ArrowLeft":
			if (isRow) {
				// moves the current cell to the left; wraps around past index 0
				currentCol = (currentCol - 1 + 5) % 5;
				// skips the black cells
				while (grid[currentRow][currentCol] === null) {
					currentCol = (currentCol - 1 + 5) % 5;
				}
			} else {
				// changes from column to row
				isRow = !isRow;
			}
			break;
		case "ArrowRight":
			if (isRow) {
				// moves the current cell to the left; wraps around past index 0
				currentCol = (currentCol + 1 + 5) % 5;
				// skips the black cells
				while (grid[currentRow][currentCol] === null) {
					currentCol = (currentCol + 1 + 5) % 5;
				}
			} else {
				// changes from column to row
				isRow = !isRow;
			}
			break;
		case "Backspace":
			answers[currentRow][currentCol] = null;
			if (isRow && currentCol > 0) {
				--currentCol;
			} else if (!isRow && currentRow > 0) {
				--currentRow;
			}
			break;
		case "Space":
			isRow = !isRow;
			break;
		default:
			if (/^[a-zA-Z]$/.test(e.key)) {
				answers[currentRow][currentCol] = e.key.toUpperCase();
			}
			
			if (isRow) {
				do {
					if (currentCol === 4) {
						if (currentRow === 4)
							isRow = !isRow;
						currentRow = (currentRow + 1 + 5) % 5;
					}
					// moves the current cell downward; wraps around past index 4
					currentCol = (currentCol + 1 + 5) % 5;
					// skips the black cells
				} while (grid[currentRow][currentCol] === null || answers[currentRow][currentCol] !== null);
			} else {
				do {
					// moves the current cell downward; wraps around past index 4
					currentRow = (currentRow + 1 + 5) % 5;
					if (currentRow === 4) {
						if (currentCol === 4)
							isRow = !isRow;
						currentCol = (currentCol + 1 + 5) % 5;
					}
					// skips the black cells
				} while (grid[currentRow][currentCol] === null || answers[currentRow][currentCol] !== null);
			}
			break;
	}
	// rehighlights selected cells
	drawGrid();
});

// initial drawing of grid
drawGrid();
