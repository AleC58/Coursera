const express = require('express');
const promoRouter = express.Router();
const morgan = require('morgan');
const statusOK = 200;
const statusCreated = 201;
const statusNotAllowed = 405;
const statusNotImplemented = 501;

promoRouter.use(express.json()); //Used to parse JSON bodies
promoRouter.use(morgan('dev'));

promoRouter.route('/')
	.all((req, res, next) => {
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	// GET (Read) localhost:8080/promotions
	.get((req, res, next) => {
		res.statusCode = statusOK;
		res.end('Will send all the promotions to you!');
	})
	// POST (Create) localhost:8080/promotions
	// con (in Postman) Body (raw/json): {"name": "name value", "description": "description value"}
	.post((req, res, next) => {
		res.statusCode = statusCreated;
		res.end('Will add the promotion; name: "' + req.body.name + '", description: "' + req.body.description + '"');
	})
	// PUT (Update) localhost:8080/promotions
	.put((req, res, next) => {
		res.statusCode = statusNotAllowed;
		res.end('PUT operation not allowed on /promotions');
	})
	// DELETE (Delete) localhost:8080/promotions
	.delete((req, res, next) => {
		res.statusCode = statusOK;
		res.end('Deleting all promotions')
	})
	// all other NOT implemmented methods
	.all((req, res, next) => {
		res.statusCode = statusNotImplemented;
		res.end('Method ' + req.method + ' not implemented on ' + req.originalUrl)
	});

promoRouter.route('/:promotionId')
	.all((req, res, next) => {
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	// GET (Read) localhost:8080/promotions/123
	.get((req, res, next) => {
		res.statusCode = statusOK;
		res.end('Will send details of the promotion ' + req.params.promotionId + ' to you!');
	})
	// POST (Create) localhost:8080/promotions/123
	.post((req, res, next) => {
		res.statusCode = statusNotAllowed;
		res.end('POST operation not allowed on /promotions/' + req.params.promotionId);
	})
	// PUT (Update) localhost:8080/promotions/123
	// con (in Postman) Body (raw/json): {"name": "new name", "description": "new desc"}
	.put((req, res, next) => {
		res.statusCode = statusOK;
		res.end('Updating promotion ' + req.params.promotionId + ' with (new) values; name: "' + req.body.name + '", description: "' + req.body.description + '"');
	})
	// DELETE (Delete) localhost:8080/promotions/123
	.delete((req, res, next) => {
		res.statusCode = statusOK;
		res.end('Deleting  promotion ' + req.params.promotionId);
	})
	// all other NOT implemmented methods
	.all((req, res, next) => {
		res.statusCode = statusNotImplemented;
		res.end('Method ' + req.method + ' not implemented on ' + req.originalUrl)
	});

module.exports = promoRouter;