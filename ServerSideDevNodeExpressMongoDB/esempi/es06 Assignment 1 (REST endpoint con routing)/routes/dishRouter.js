const express = require('express');
const dishRouter = express.Router();
const morgan = require('morgan');
const statusOK = 200;
const statusCreated = 201;
const statusNotAllowed = 405;
const statusNotImplemented = 501;

dishRouter.use(express.json()); //Used to parse JSON bodies
dishRouter.use(morgan('dev'));

dishRouter.route('/')
	.all((req, res, next) => {
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	// GET (Read) localhost:8080/dishes
	.get((req, res, next) => {
		res.statusCode = statusOK;
		res.end('Will send all the dishes to you!');
	})
	// POST (Create) localhost:8080/dishes
	// con (in Postman) Body (raw/json): {"name": "name value", "description": "description value"}
	.post((req, res, next) => {
		res.statusCode = statusCreated;
		res.end('Will add the dish; name: "' + req.body.name + '", description: "' + req.body.description + '"');
	})
	// PUT (Update) localhost:8080/dishes
	.put((req, res, next) => {
		res.statusCode = statusNotAllowed;
		res.end('PUT operation not allowed on /dishes');
	})
	// DELETE (Delete) localhost:8080/dishes
	.delete((req, res, next) => {
		res.statusCode = statusOK;
		res.end('Deleting all dishes')
	})
	// all other NOT implemmented methods
	.all((req, res, next) => {
		res.statusCode = statusNotImplemented;
		res.end('Method ' + req.method + ' not implemented on ' + req.originalUrl)
	});

dishRouter.route('/:dishId')
	.all((req, res, next) => {
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	// GET (Read) localhost:8080/dishes/123
	.get((req, res, next) => {
		res.statusCode = statusOK;
		res.end('Will send details of the dish ' + req.params.dishId + ' to you!');
	})
	// POST (Create) localhost:8080/dishes/123
	.post((req, res, next) => {
		res.statusCode = statusNotAllowed;
		res.end('POST operation not allowed on /dishes/' + req.params.dishId);
	})
	// PUT (Update) localhost:8080/dishes/123
	// con (in Postman) Body (raw/json): {"name": "new name", "description": "new desc"}
	.put((req, res, next) => {
		res.statusCode = statusOK;
		res.end('Updating dish ' + req.params.dishId + ' with (new) values; name: "' + req.body.name + '", description: "' + req.body.description + '"');
	})
	// DELETE (Delete) localhost:8080/dishes/123
	.delete((req, res, next) => {
		res.statusCode = statusOK;
		res.end('Deleting  dish ' + req.params.dishId);
	})
	// all other NOT implemmented methods
	.all((req, res, next) => {
		res.statusCode = statusNotImplemented;
		res.end('Method ' + req.method + ' not implemented on ' + req.originalUrl)
	});

module.exports = dishRouter;