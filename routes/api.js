'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

	let solver = new SudokuSolver();

	app.route('/api/check')
		.post((req, res) => {
			let { puzzle, coordinate, value } = req.body;
			if (!puzzle || !coordinate || !value) {
				return res.json({ error: 'Required field(s) missing' });
			}
			res.json(solver.check(puzzle, coordinate, value));
		});

	app.route('/api/solve')
		.post((req, res) => {
			let { puzzle } = req.body;
			if (!puzzle) return res.json({ error: 'Required field missing' });
			res.json(solver.solve(puzzle));
		});
};
