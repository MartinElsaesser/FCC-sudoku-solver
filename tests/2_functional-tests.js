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
		test('check puzzle', function (done) {
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
			let error = { "error": "Invalid coordinate" };
			let [puzzle, solution] = puzzlesAndSolutions[0];
			let data = {
				puzzle,
				coordinate: "$$",
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


	})
});

