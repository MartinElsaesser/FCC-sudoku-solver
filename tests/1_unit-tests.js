const chai = require('chai');
const assert = chai.assert;

const { puzzlesAndSolutions } = require("../controllers/puzzle-strings")
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
	test('valid puzzle', function () {
		puzzlesAndSolutions.forEach(([puzzle, soulution]) => {
			assert.equal(solver.validate(puzzle), true, "valid puzzle")
		});
	});
	test('invalid characters', function () {
		let invalidPuzzle = '1..63.12.7.2..12.s4f5..+..9..1....8.w+2.3674.3.a7.2..9.47...8s..1..16....9264.37.';
		let error = { error: "Invalid characters in puzzle" };
		assert.deepEqual(solver.validate(invalidPuzzle), error, "invalid puzzle")
	});
	test('invalid length', function () {
		let invalidPuzzle = '1..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....9264.37.';
		let error = { error: "Expected puzzle to be 81 characters long" }
		assert.deepEqual(solver.validate(invalidPuzzle), error, "invalid puzzle")
	});
	test('valid row placement', function () {
		let validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
		let check = solver.checkRowPlacement.bind(solver, validPuzzle);
		assert.equal(check("d", 3), true, "fourth row does not contain 3");
		assert.equal(check("h", 5), true, "eighth row does not contain 5 ");
	});
	test('invalid row placement', function () {
		let validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
		let check = solver.checkRowPlacement.bind(solver, validPuzzle);
		assert.equal(check("a", 2), false, "first row contains 2");
		assert.equal(check("e", 2), false, "fifth row contains 2");
	});
	test('valid column placement', function () {
		let validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
		let check = solver.checkColPlacement.bind(solver, validPuzzle);
		assert.equal(check(2, 1), true, "second column does not contain 2");
	});
	test('invalid column placement', function () {
		let validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
		let check = solver.checkColPlacement.bind(solver, validPuzzle);
		assert.equal(check(1, 2), false, "first column contains 2");
		assert.equal(check(8, 8), false, "eighth column contains 8");
	});

	test('valid 3x3 region', function () {
		let validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
		let check = solver.checkRegionPlacement.bind(solver, validPuzzle);
		assert.equal(check("b", 3, 4), true, "top left region does not contain 4");
		assert.equal(check("h", 7, 5), true, "bottom right region does not contain 5");
	});
	test('invalid 3x3 region', function () {
		let validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
		let check = solver.checkRegionPlacement.bind(solver, validPuzzle);
		assert.equal(check("a", 1, 2), false, "top left region contains 2");
		assert.equal(check("e", 5, 2), false, "middle region contains 2");
	});
	test('valid puzzle strings pass', function () {
		puzzlesAndSolutions.forEach(([puzzle, solution]) => {
			assert.equal(solver.solve(puzzle), solution, "valid puzzle")
		});
	});
	test('invalid puzzle strings fail', function () {
		let invalidPuzzles =
			[
				[
					'1..63.12.7.2..12.s4f5..+..9..1....8.w+2.3674.3.a7.2..9.47...8s..1..16....9264.37.',
					{ error: "Invalid characters in puzzle" }
				],
				[
					'1..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....9264.37.',
					{ error: "Expected puzzle to be 81 characters long" }
				]
			];
		invalidPuzzles.forEach(([puzzle, error]) => {
			assert.deepEqual(solver.solve(puzzle), error, "invalid puzzle")
		});
	});
	test('valid puzzle return expected solution', function () {
		puzzlesAndSolutions.forEach(([puzzle, solution]) => {
			assert.equal(solver.solve(puzzle), solution, "valid puzzle")
		});
	});
});
