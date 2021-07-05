const express = require('express');
const leaderRouter = express.Router();
const morgan = require('morgan');
const statusOK = 200;
const statusCreated = 201;
const statusNotAllowed = 405;
const statusNotImplemented = 501;

leaderRouter.use(express.json()); //Used to parse JSON bodies
leaderRouter.use(morgan('dev'));

leaderRouter.route('/')
	.all((req, res, next) => {
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	// GET (Read) localhost:8080/leaders
	.get((req, res, next) => {
		res.statusCode = statusOK;
		res.end('Will send all the leaders to you!');
	})
	// POST (Create) localhost:8080/leaders
	// con (in Postman) Body (raw/json): {"name": "name value", "description": "description value"}
	.post((req, res, next) => {
		res.statusCode = statusCreated;
		res.end('Will add the leader; name: "' + req.body.name + '", description: "' + req.body.description + '"');
	})
	// PUT (Update) localhost:8080/leaders
	.put((req, res, next) => {
		res.statusCode = statusNotAllowed;
		res.end('PUT operation not allowed on /leaders');
	})
	// DELETE (Delete) localhost:8080/leaders
	.delete((req, res, next) => {
		res.statusCode = statusOK;
		res.end('Deleting all leaders')
	})
	// all other NOT implemmented methods
	.all((req, res, next) => {
		res.statusCode = statusNotImplemented;
		res.end('Method ' + req.method + ' not implemented on ' + req.originalUrl)
	});

leaderRouter.route('/:leaderId')
	.all((req, res, next) => {
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	// GET (Read) localhost:8080/leaders/123
	.get((req, res, next) => {
		res.statusCode = statusOK;
		res.end('Will send details of the leader ' + req.params.leaderId + ' to you!');
	})
	// POST (Create) localhost:8080/leaders/123
	.post((req, res, next) => {
		res.statusCode = statusNotAllowed;
		res.end('POST operation not allowed on /leaders/' + req.params.leaderId);
	})
	// PUT (Update) localhost:8080/leaders/123
	// con (in Postman) Body (raw/json): {"name": "new name", "description": "new desc"}
	.put((req, res, next) => {
		res.statusCode = statusOK;
		res.end('Updating leader ' + req.params.leaderId + ' with (new) values; name: "' + req.body.name + '", description: "' + req.body.description + '"');
	})
	// DELETE (Delete) localhost:8080/leaders/123
	.delete((req, res, next) => {
		res.statusCode = statusOK;
		res.end('Deleting  leader ' + req.params.leaderId);
	})
	// all other NOT implemmented methods
	.all((req, res, next) => {
		res.statusCode = statusNotImplemented;
		res.end('Method ' + req.method + ' not implemented on ' + req.originalUrl)
	});

module.exports = leaderRouter;