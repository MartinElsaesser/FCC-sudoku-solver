const chai = require("chai");
const chaiHttp = require('chai-http');
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings");
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
	suite("POST /api/solve", () => {
		test('valid puzzle', function (done) {
			let [puzzle, solution] = puzzlesAndSolutions[0];
			chai.request(server)
				.post("/api/solve")
				.type("form")
				.send({ puzzle })
				.end((err, res) => {
					assert.property(res.body, "solution", "Has property solution")
					assert.equal(res.body.solution, solution, "solved correctly")
					done();
				})
		});
		test('missing puzzle property', function (done) {
			let error = { error: 'Required field missing' }
			chai.request(server)
				.post("/api/solve")
				.type("form")
				.send({})
				.end((err, res) => {
					assert.deepEqual(res.body, error, "missing puzzle string")
					done();
				})
		});
		test('invalid characters', function (done) {
			let puzzle = '1..63.12.7.2..12.s4f5..+..9..1....8.w+2.3674.3.a7.2..9.47...8s..1..16....9264.37.';
			let error = { error: "Invalid characters in puzzle" };
			chai.request(server)
				.post("/api/solve")
				.type("form")
				.send({ puzzle })
				.end((err, res) => {
					assert.deepEqual(res.body, error, "invalid characters")
					done();
				})
		});
		test('invalid length', function (done) {
			let puzzle = '1..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....9264.37.';
			let error = { error: "Expected puzzle to be 81 characters long" };
			chai.request(server)
				.post("/api/solve")
				.type("form")
				.send({ puzzle })
				.end((err, res) => {
					assert.deepEqual(res.body, error, "incorrect length")
					done();
				})
		});
		test('unsolvable puzzle', function (done) {
			let puzzle = '155..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
			let error = { error: "Puzzle cannot be solved" };
			chai.request(server)
				.post("/api/solve")
				.type("form")
				.send({ puzzle })
				.end((err, res) => {
					assert.deepEqual(res.body, error, "unsolvable puzzle")
					done();
				})
		});
	})
	suite("POST /api/check", () => {
		test('check puzzle placement with all fields', function (done) {
			let [puzzle, solution] = puzzlesAndSolutions[0];
			let data = {
				puzzle,
				coordinate: "A9",
				value: 4
			}
			chai.request(server)
				.post("/api/check")
				.type("form")
				.send(data)
				.end((err, res) => {
					assert.deepEqual(res.body, { valid: true })
					done();
				})
		});
		test('check puzzle placement with single placement conflict', function (done) {
			let [puzzle, solution] = puzzlesAndSolutions[0];
			let data = {
				puzzle,
				coordinate: "A2",
				value: 4
			};
			let error = { "valid": false, "conflict": ["row"] };
			chai.request(server)
				.post("/api/check")
				.type("form")
				.send(data)
				.end((err, res) => {
					assert.deepEqual(res.body, error);
					done();
				})
		});
		test('check puzzle placement with multiple placement conflicts', function (done) {
			let [puzzle, solution] = puzzlesAndSolutions[0];
			let data = {
				puzzle,
				coordinate: "E2",
				value: 3
			};
			let error = { "valid": false, "conflict": ["region", "row"] };
			chai.request(server)
				.post("/api/check")
				.type("form")
				.send(data)
				.end((err, res) => {
					assert.deepEqual(res.body, error);
					done();
				})
		});
		test('check puzzle placement with all placement conflicts', function (done) {
			let [puzzle, solution] = puzzlesAndSolutions[0];
			let data = {
				puzzle,
				coordinate: "B2",
				value: 2
			};
			let error = { "valid": false, "conflict": ["region", "row", "column"] };
			chai.request(server)
				.post("/api/check")
				.type("form")
				.send(data)
				.end((err, res) => {
					assert.deepEqual(res.body, error);
					done();
				})
		});

		test('check puzzle missing fields', function (done) {
			let error = { error: "Required field(s) missing" };
			chai.request(server)
				.post("/api/check")
				.type("form")
				.send({})
				.end((err, res) => {
					assert.deepEqual(res.body, error);
					done();
				})
		});

		test('check puzzle invalid characters', function (done) {
			let puzzle = '1..63.12.7.2..12.s4f5..+..9..1....8.w+2.3674.3.a7.2..9.47...8s..1..16....9264.37.';
			let error = { error: "Invalid characters in puzzle" };
			let data = {
				puzzle,
				coordinate: "A2",
				value: 4
			};
			chai.request(server)
				.post("/api/check")
				.type("form")
				.send(data)
				.end((err, res) => {
					assert.deepEqual(res.body, error);
					done();
				})
		});
		test('check puzzle invalid length', function (done) {
			let puzzle = '1..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....9264.37.';
			let error = { error: "Expected puzzle to be 81 characters long" };
			let data = {
				puzzle,
				coordinate: "A2",
				value: 4
			};
			chai.request(server)
				.post("/api/check")
				.type("form")
				.send(data)
				.end((err, res) => {
					assert.deepEqual(res.body, error);
					done();
				})
		});



		test('invalid coordinate', function (done) {
			let error = { "error": "Invalid coordinate" };
			let [puzzle, solution] = puzzlesAndSolutions[0];
			let data = {
				puzzle,
				coordinate: "A20",
				value: 3
			}
			chai.request(server)
				.post("/api/check")
				.type("form")
				.send(data)
				.end((err, res) => {
					assert.deepEqual(res.body, error);
					done();
				})
		});
		test('invalid coordinate', function (done) {
			let error = { "error": "Invalid value" };
			let [puzzle, solution] = puzzlesAndSolutions[0];
			let data = {
				puzzle,
				coordinate: "A2",
				value: 32
			}
			chai.request(server)
				.post("/api/check")
				.type("form")
				.send(data)
				.end((err, res) => {
					assert.deepEqual(res.body, error);
					done();
				})
		});

	})
});

