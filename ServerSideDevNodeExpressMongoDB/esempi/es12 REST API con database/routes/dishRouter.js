const express = require('express');
const dishRouter = express.Router();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Dishes = require("../models/dishes");

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
	// return all dishes
	.get((req, res, next) => {
		Dishes.find({})
		.then((dishes) => {
			res.statusCode = statusOK;
			res.setHeader('Content-Type', 'application/json');
			res.json(dishes);
		}, (err) => next(err))
		.catch((err) => next(err));
})
	// POST (Create) localhost:8080/dishes
	// con (in Postman) Body (raw/json): {"name": "name value", "description": "description value"}
	.post((req, res, next) => {
		Dishes.create(req.body)
		.then((dish) => {
			console.log("Dish created: " + dish);
			res.statusCode = statusCreated;
			res.setHeader('Content-Type', 'application/json');
			res.json(dish);
		}, (err) => next(err))
		.catch((err) => next(err));
	})
	// PUT (Update) localhost:8080/dishes
	.put((req, res, next) => {
		res.statusCode = statusNotAllowed;
		res.end('PUT operation not allowed on /dishes');
	})
	// DELETE (Delete) localhost:8080/dishes
	// delete all dishes
	.delete((req, res, next) => {
		Dishes.deleteMany({})
		.then((resp) => {
			res.statusCode = statusOK;
			res.setHeader('Content-Type', 'application/json');
			res.json(resp);
		}, (err) => next(err))
		.catch((err) => next(err));
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
	// read dish:dishId
	// se dishId non è un valore di tipo _id valido restituisce cast error (cod. 500)
	// se dishId è valido ma non esiste nel db restituisce "null" (e cod. 200)
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
		.then((dish) => {
			res.statusCode = statusOK;
			res.setHeader('Content-Type', 'application/json');
			res.json(dish);
		}, (err) => next(err))
		.catch((err) => next(err));
	})
	// POST (Create) localhost:8080/dishes/123
	.post((req, res, next) => {
		res.statusCode = statusNotAllowed;
		res.end('POST operation not allowed on /dishes/' + req.params.dishId);
	})
	// PUT (Update) localhost:8080/dishes/123
	// con (in Postman) Body (raw/json): {"name": "new name", "description": "new desc"}
	.put((req, res, next) => {
		Dishes.findByIdAndUpdate(req.params.dishId, {
			$set: req.body,
		}, {new: true})
		.then((dish) => {
			res.statusCode = statusOK;
			res.setHeader('Content-Type', 'application/json');
			res.json(dish);
		}, (err) => next(err))
		.catch((err) => next(err));
})
	// DELETE (Delete) localhost:8080/dishes/123
	.delete((req, res, next) => {
		Dishes.findByIdAndRemove(req.params.dishId)
		.then((resp) => {
			res.statusCode = statusOK;
			res.setHeader('Content-Type', 'application/json');
			res.json(resp);
		}, (err) => next(err))
		.catch((err) => next(err));
	})
	// all other NOT implemmented methods
	.all((req, res, next) => {
		res.statusCode = statusNotImplemented;
		res.end('Method ' + req.method + ' not implemented on ' + req.originalUrl)
	});

module.exports = dishRouter;