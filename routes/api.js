'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

	let solver = new SudokuSolver();

	app.route('/api/check')
		.post((req, res) => {
			let { puzzle } = req.body;
			if (!puzzle) res.json({ error: 'Required field missing' });
			res.json(solver.solve(puzzle));
		});

	app.route('/api/solve')
		.post((req, res) => {
			let { puzzle } = req.body;
			if (!puzzle) res.json({ error: 'Required field missing' });
			res.json(solver.solve(puzzle));
		});
};
