class SudokuSolver {

	validate(puzzleString) {
		let okLength = puzzleString.length === 81;
		let onlyOkChars = !!puzzleString.match(/^[.\d]*$/);
		if (!okLength) return { error: "Expected puzzle to be 81 characters long" }
		if (!onlyOkChars) return { error: "Invalid characters in puzzle" }
		return true
	}

	parse(puzzleString) {
		return Array.from({ length: 9 }, (_, i) =>
			puzzleString
				.slice(i * 9, (i + 1) * 9)
				.split("")
		);
	}

	stringify(board) {
		return board.flat(1).join("");
	}


	checkRowPlacement(puzzleString, row, value) {
		let rows = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9 }
		row = rows[row];
		let board = this.parse(puzzleString);
		for (var i = 0; i < 9; i++) {
			if (board[row - 1][i] == value) return false;
		}
		return true;
	}

	checkColPlacement(puzzleString, column, value) {
		let board = this.parse(puzzleString);
		for (var i = 0; i < 9; i++) {
			if (board[i][column - 1] == value) return false;
		}
		return true;
	}

	checkRegionPlacement(puzzleString, row, column, value) {
		let rows = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9 }
		row = rows[row];
		let board = this.parse(puzzleString);
		let xOffset = (Math.ceil(column / 3) - 1) * 3;
		let yOffset = (Math.ceil(row / 3) - 1) * 3;
		for (var i = 0; i < 9; i++) {
			let x = xOffset + i % 3;
			let y = yOffset + Math.floor(i / 3);
			if (board[y][x] == value) return false;
		}
		return true;
	}
	isValid(puzzleString, row, column, value) {
		let rows = { 1: "a", 2: "b", 3: "c", 4: "d", 5: "e", 6: "f", 7: "g", 8: "h", 9: "i" };
		let okRegion = this.checkRegionPlacement(puzzleString, rows[row + 1], column + 1, value);
		let okColumn = this.checkColPlacement(puzzleString, column + 1, value);
		let okRow = this.checkRowPlacement(puzzleString, rows[row + 1], value);
		return okRegion && okColumn && okRow;
	}

	solve(puzzleString) {
		let validate = this.validate(puzzleString);
		if (validate.error) return validate;
		let board = this.parse(puzzleString);

		let recursion = function (data) {
			for (let i = 0; i < 9; i++) {
				for (let j = 0; j < 9; j++) {
					if (data[i][j] === ".") {
						for (let k = 1; k <= 9; k++) {

							if (this.isValid(this.stringify(data), i, j, k)) {
								data[i][j] = `${k}`;
								if (recursion(data)) {
									return true;
								} else {
									data[i][j] = '.';
								}
							}
						}
						return false;
					}
				}
			}
			return true;
		}.bind(this);

		if (!recursion(board)) return { error: 'Puzzle cannot be solved' };
		return { solution: this.stringify(board) };
	}
}

module.exports = SudokuSolver;
