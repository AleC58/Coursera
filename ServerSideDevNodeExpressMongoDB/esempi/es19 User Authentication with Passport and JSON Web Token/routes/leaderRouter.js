var cost = require("../costanti");
const express = require('express');
const leaderRouter = express.Router();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Leaders = require("../models/leaders");
var authenticate = require('../authenticate');

leaderRouter.use(express.json()); //Used to parse JSON bodies
leaderRouter.use(morgan('dev'));

leaderRouter.route('/')
	.all((req, res, next) => {
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	// GET (Read) localhost:8080/leaders
	// return all leaders
	.get((req, res, next) => {
		Leaders.find({})
			.then((leaders) => {
				res.statusCode = cost.statusOK;
				res.setHeader('Content-Type', 'application/json');
				res.json(leaders);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// POST (Create) localhost:8080/leaders
	// con (in Postman) Body (raw/json): {"name": "name value", "description": "description value"}
	.post(authenticate.verifyUser, (req, res, next) => {
		Leaders.create(req.body)
			.then((leader) => {
				console.log("leader created: " + leader);
				res.statusCode = cost.statusCreated;
				res.setHeader('Content-Type', 'application/json');
				res.json(leader);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// PUT (Update) localhost:8080/leaders
	.put(authenticate.verifyUser, (req, res, next) => {
		res.statusCode = cost.statusNotAllowed;
		res.end('PUT operation not allowed on /leaders');
	})
	// DELETE (Delete) localhost:8080/leaders
	// delete all leaders
	.delete(authenticate.verifyUser, (req, res, next) => {
		Leaders.deleteMany({})
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

leaderRouter.route('/:leaderId')
	.all((req, res, next) => {
			res.setHeader('Content-Type', 'text/plain');
			next();
		})
		// GET (Read) localhost:8080/leaders/:leaderId
		// read leader/:leaderId
		// se leaderId non è un valore di tipo _id valido restituisce cast error (cod. 500)
		// se leaderId è valido ma non esiste nel db restituisce "null" (e cod. 200)
		.get((req, res, next) => {
			Leaders.findById(req.params.leaderId)
				.then((leader) => {
					res.statusCode = cost.statusOK;
					res.setHeader('Content-Type', 'application/json');
					res.json(leader);
				}, (err) => next(err))
				.catch((err) => next(err));
		})
		// POST (Create) localhost:8080/leaders/:leaderId
		.post(authenticate.verifyUser, (req, res, next) => {
			res.statusCode = cost.statusNotAllowed;
			res.end('POST operation not allowed on /leaders/' + req.params.leaderId);
		})
		// PUT (Update) localhost:8080/leaders/:leaderId
		// con (in Postman) Body (raw/json): {"name": "new name", "description": "new desc"}
		.put(authenticate.verifyUser, (req, res, next) => {
			Leaders.findByIdAndUpdate(req.params.leaderId, {
					$set: req.body,
				}, {
					new: true
				})
				.then((leader) => {
					res.statusCode = cost.statusOK;
					res.setHeader('Content-Type', 'application/json');
					res.json(leader);
				}, (err) => next(err))
				.catch((err) => next(err));
		})
		// DELETE (Delete) localhost:8080/leaders/:leaderId
		.delete(authenticate.verifyUser, (req, res, next) => {
			Leaders.findByIdAndRemove(req.params.leaderId)
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

module.exports = leaderRouter;