const express = require('express');
const promoRouter = express.Router();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promotions = require("../models/promotions");

const statusOK = 200;
const statusCreated = 201;
const statusNotFound = 404;
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
	// return all promotions
	.get((req, res, next) => {
		Promotions.find({})
			.then((promotions) => {
				res.statusCode = statusOK;
				res.setHeader('Content-Type', 'application/json');
				res.json(promotions);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// POST (Create) localhost:8080/promotions
	// con (in Postman) Body (raw/json): {"name": "name value", "description": "description value"}
	.post((req, res, next) => {
		Promotions.create(req.body)
			.then((promotion) => {
				console.log("Promotion created: " + promotion);
				res.statusCode = statusCreated;
				res.setHeader('Content-Type', 'application/json');
				res.json(promotion);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// PUT (Update) localhost:8080/promotions
	.put((req, res, next) => {
		res.statusCode = statusNotAllowed;
		res.end('PUT operation not allowed on /promotions');
	})
	// DELETE (Delete) localhost:8080/promotions
	// delete all promotions
	.delete((req, res, next) => {
		Promotions.deleteMany({})
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

promoRouter.route('/:promotionId')
	.all((req, res, next) => {
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	// GET (Read) localhost:8080/promotions/:promotionId
	// read dish:promotionId
	// se promotionId non è un valore di tipo _id valido restituisce cast error (cod. 500)
	// se promotionId è valido ma non esiste nel db restituisce "null" (e cod. 200)
	.get((req, res, next) => {
		Promotions.findById(req.params.promotionId)
			.then((promotion) => {
				res.statusCode = statusOK;
				res.setHeader('Content-Type', 'application/json');
				res.json(promotion);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// POST (Create) localhost:8080/promotions/:promotionId
	.post((req, res, next) => {
		res.statusCode = statusNotAllowed;
		res.end('POST operation not allowed on /promotions/' + req.params.promotionId);
	})
	// PUT (Update) localhost:8080/promotions/:promotionId
	// con (in Postman) Body (raw/json): {"name": "new name", "description": "new desc"}
	.put((req, res, next) => {
		Promotions.findByIdAndUpdate(req.params.promotionId, {
				$set: req.body,
			}, {
				new: true
			})
			.then((promotion) => {
				res.statusCode = statusOK;
				res.setHeader('Content-Type', 'application/json');
				res.json(promotion);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// DELETE (Delete) localhost:8080/promotions/:promotionId
	.delete((req, res, next) => {
		Promotions.findByIdAndRemove(req.params.promotionId)
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

module.exports = promoRouter;