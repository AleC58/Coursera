const express = require('express');
const dishRouter = express.Router();
const morgan = require('morgan');
//const mongoose = require('mongoose');
const Dishes = require("../models/dishes");

const statusOK = 200;
const statusCreated = 201;
const statusNotFound = 404;
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
	// GET (Read) localhost:8080/dishes/:dishId
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
	// POST (Create) localhost:8080/dishes/:dishId
	.post((req, res, next) => {
		res.statusCode = statusNotAllowed;
		res.end('POST operation not allowed on /dishes/' + req.params.dishId);
	})
	// PUT (Update) localhost:8080/dishes/:dishId
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
	// DELETE (Delete) localhost:8080/dishes/:dishId
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

dishRouter.route('/:dishId/comments')
	.all((req, res, next) => {
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	// GET (Read) localhost:8080/dishes/:dishId/comments
	// return all comments of dishId
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then((dish) => {
				if(dish != null) {
					res.statusCode = statusOK;
					res.setHeader('Content-Type', 'application/json');
					res.json(dish.comments);
				} else {
					err = new Error("Dish " + req.params.dishId + " not found");
					err.status = statusNotFound;
					return next(err); // chiama l'error handler globale alla fine di app.js
				}
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// POST (Create) localhost:8080/dishes:dishId/comments
	// con (in Postman) Body (raw/json): {"name": "name value", "description": "description value"}
	.post((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then((dish) => {
				if (dish != null) {
					dish.comments.push(req.body);
					dish.save()
					.then((dish) => {
						res.statusCode = statusOK;
						res.setHeader('Content-Type', 'application/json');
						res.json(dish);
					}, (err) => next(err))
				} else {
					err = new Error("Dish " + req.params.dishId + " not found");
					err.status = statusNotFound;
					return next(err); // chiama l'error handler globale alla fine di app.js
				}
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// PUT (Update) localhost:8080/dishes/:dishId/comments
	.put((req, res, next) => {
		res.statusCode = statusNotAllowed;
		res.end('PUT operation not allowed on /dishes/' + req.params.dishId + '/comments');
	})
	// DELETE (Delete) localhost:8080/dishes/:dishId/comments
	// delete all dishes
	.delete((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then((dish) => {
				if (dish != null) {
					for (var j = (dish.comments.length - 1); j >= 0; j--) {
						dish.comments.id(dish.comments[j]._id).remove();
					}
					dish.save()
						.then((dish) => {
							res.statusCode = statusOK;
							res.setHeader('Content-Type', 'application/json');
							res.json(dish);
						}, (err) => next(err))
				} else {
					err = new Error("Dish " + req.params.dishId + " not found");
					err.status = statusNotFound;
					return next(err); // chiama l'error handler globale alla fine di app.js
				}
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// all other NOT implemmented methods
	.all((req, res, next) => {
		res.statusCode = statusNotImplemented;
		res.end('Method ' + req.method + ' not implemented on ' + req.originalUrl)
	});

dishRouter.route('/:dishId/comments/:commentId')
	.all((req, res, next) => {
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	// GET (Read) localhost:8080/dishes/:dishId/comments/:commentId
	// get :commentId of dish :dishId
	// se dishId non è un valore di tipo _id valido restituisce cast error (cod. 500)
	// se dishId è valido ma non esiste nel db restituisce "null" (e cod. 200)
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then((dish) => {
				if ((dish != null) && (dish.comments.id(req.params.commentId) != null)) {
					res.statusCode = statusOK;
					res.setHeader('Content-Type', 'application/json');
					res.json(dish.comments.id(req.params.commentId));
				} else if (dish == null) {
					err = new Error("Dish " + req.params.dishId + " not found");
					err.status = statusNotFound;
					return next(err); // chiama l'error handler globale alla fine di app.js
				} else {
					err = new Error("Comment " + req.params.commentId + " not found");
					err.status = statusNotFound;
					return next(err); // chiama l'error handler globale alla fine di app.js
				}
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// POST (Create) localhost:8080/dishes/:dishId/comments/:commentId
	.post((req, res, next) => {
		res.statusCode = statusNotAllowed;
		res.end('POST operation not allowed on /dishes/' + req.params.dishId + 
			"/comments/" + req.params.commentId);
	})
	// PUT (Update) localhost:8080/dishes/:dishId/comments/:commentId
	// Update fields rating, comment of :commentId of dish :dishId
	// con (in Postman) Body (raw/json): {"name": "new name", "description": "new desc"}
	.put((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then((dish) => {
				if ((dish != null) && (dish.comments.id(req.params.commentId) != null)) {
					//voglio aggiornare solo i campi rating o comment
					if (req.body.rating) {
						dish.comments.id(req.params.commentId).rating = req.body.rating;
					}
					if (req.body.comment) {
						dish.comments.id(req.params.commentId).comment = req.body.comment;
					}
					dish.save()
						.then((dish) => {
							res.statusCode = statusOK;
							res.setHeader('Content-Type', 'application/json');
							res.json(dish);
						}, (err) => next(err))
				} else if (dish == null) {
					err = new Error("Dish " + req.params.dishId + " not found");
					err.status = statusNotFound;
					return next(err); // chiama l'error handler globale alla fine di app.js
				} else {
					err = new Error("Comment " + req.params.commentId + " not found");
					err.status = statusNotFound;
					return next(err); // chiama l'error handler globale alla fine di app.js
				}
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// DELETE (Delete) localhost:8080/dishes/:dishId/comments/:commentId
	// Delete :commentId of dish :dishId
	.delete((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then((dish) => {
				if ((dish != null) && (dish.comments.id(req.params.commentId) != null)) {
					dish.comments.id(req.params.commentId).remove();
					dish.save()
						.then((dish) => {
							res.statusCode = statusOK;
							res.setHeader('Content-Type', 'application/json');
							res.json(dish);
						}, (err) => next(err))
				} else if (dish == null) {
					err = new Error("Dish " + req.params.dishId + " not found");
					err.status = statusNotFound;
					return next(err); // chiama l'error handler globale alla fine di app.js
				} else {
					err = new Error("Comment " + req.params.commentId + " not found");
					err.status = statusNotFound;
					return next(err); // chiama l'error handler globale alla fine di app.js
				}
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	// all other NOT implemmented methods
	.all((req, res, next) => {
		res.statusCode = statusNotImplemented;
		res.end('Method ' + req.method + ' not implemented on ' + req.originalUrl)
	});


module.exports = dishRouter;