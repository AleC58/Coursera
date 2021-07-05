var cost = require("../costanti");
const express = require('express');
const promoRouter = express.Router();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promotions = require("../models/promotions");
var authenticate = require('../authenticate');

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
				res.statusCode = cost.statusOK;
				res.setHeader('Content-Type', 'application/json');
				res.json(promotions);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// POST (Create) localhost:8080/promotions
	// con (in Postman) Body (raw/json): {"name": "name value", "description": "description value"}
	.post(authenticate.verifyUser, (req, res, next) => {
		Promotions.create(req.body)
			.then((promotion) => {
				console.log("Promotion created: " + promotion);
				res.statusCode = cost.statusCreated;
				res.setHeader('Content-Type', 'application/json');
				res.json(promotion);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// PUT (Update) localhost:8080/promotions
	.put(authenticate.verifyUser, (req, res, next) => {
		res.statusCode = cost.statusNotAllowed;
		res.end('PUT operation not allowed on /promotions');
	})
	// DELETE (Delete) localhost:8080/promotions
	// delete all promotions
	.delete(authenticate.verifyUser, (req, res, next) => {
		Promotions.deleteMany({})
			.then((resp) => {
				res.statusCode = cost.statusOK;
				res.setHeader('Content-Type', 'application/json');
				res.json(resp);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// all other NOT implemmented methods
	.all((req, res, next) => {
		res.statusCode = cost.statusNotImplemented;
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
				res.statusCode = cost.statusOK;
				res.setHeader('Content-Type', 'application/json');
				res.json(promotion);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// POST (Create) localhost:8080/promotions/:promotionId
	.post(authenticate.verifyUser, (req, res, next) => {
		res.statusCode = cost.statusNotAllowed;
		res.end('POST operation not allowed on /promotions/' + req.params.promotionId);
	})
	// PUT (Update) localhost:8080/promotions/:promotionId
	// con (in Postman) Body (raw/json): {"name": "new name", "description": "new desc"}
	.put(authenticate.verifyUser, (req, res, next) => {
		Promotions.findByIdAndUpdate(req.params.promotionId, {
				$set: req.body,
			}, {
				new: true
			})
			.then((promotion) => {
				res.statusCode = cost.statusOK;
				res.setHeader('Content-Type', 'application/json');
				res.json(promotion);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// DELETE (Delete) localhost:8080/promotions/:promotionId
	.delete(authenticate.verifyUser, (req, res, next) => {
		Promotions.findByIdAndRemove(req.params.promotionId)
			.then((resp) => {
				res.statusCode = cost.statusOK;
				res.setHeader('Content-Type', 'application/json');
				res.json(resp);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// all other NOT implemmented methods
	.all((req, res, next) => {
		res.statusCode = cost.statusNotImplemented;
		res.end('Method ' + req.method + ' not implemented on ' + req.originalUrl)
	});

module.exports = promoRouter;