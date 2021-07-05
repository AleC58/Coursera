var express = require('express');
var userRouter = express.Router();

var User = require('../models/user');

const statusOK = 200;
const statusCreated = 201;
const statusUnauthorized = 401;
const statusForbidden = 403;
const statusNotFound = 404;
const statusNotAllowed = 405;
const statusNotImplemented = 501;

userRouter.use(express.json()); //Used to parse JSON bodies

userRouter.post('/signup', (req, res, next) => {
/*
	Per funzionare, il POST si deve inviare con
	- Authoriztion: type: none
	- Body: {"username": "[nomeUtente]", "password": "[password]"}
*/
	console.log("post on signup");
	User.findOne({username: req.body.username})
	.then((user) => {
		if (user != null) {
			var err = new Error('User ' + req.body.username + ' already exists!');
			err.statusCode = statusForbidden;
			return next(err);
		} else {
			console.log("User.create");
			return User.create({
				username: req.body.username,
				password: req.body.password
			});
		}
	})
	.then((user) => {
		res.statusCode = statusOK;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			status: 'Registration Successful!',
			user: user //NO BUONO! rimanda in chiaro tutti i dati, password compresa!
		});
	}, (err) => next(err))
	.catch((err) => next(err));
});

userRouter.post('/login', (req, res, next) => {
/*
	Per funzionare, il POST si deve inviare con
	- Authoriztion: Type: Basic auth; Username: [nomeUtente]; Password: [password]
*/
	console.log("post on login");
	var err = new Error('You are not authenticated!');
	err.status = statusUnauthorized;
	if (!req.session.user) {
		console.log("*************** req.session.user is null");
		var authHeader = req.headers.authorization;
		if (!authHeader) {
			console.log("*************** authHeader is null");
			res.setHeader('WWW-Authenticate', 'Basic');
			return next(err);
		};
		// recupera username e passwor dal campo authorization dell'header
		var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
		var username = auth[0];
		var password = auth[1];
		console.log("*************** authHeader - username: " + username + "; password: " + password);
		User.findOne({username: username})
		.then((user) => {
			if (user === null) {
				err.message = "User " + username + " does not exist.";
				err.statusCode = statusForbidden;
				return next(err);
			};
			if (user.password !== password) {
				err.message = "Password of user " + username + " is incorrect.";
				err.statusCode = statusForbidden;
				return next(err);
			} else { // userName / pwd corretti
				req.session.user = 'authenticated';
				res.statusCode = statusOK;
				res.setHeader('Content-Type', 'text/plain');
				res.end('You are authenticated!')
			};
		})
		.catch((err) => next(err));
	} else {
		res.statusCode = statusOK;
		res.setHeader('Content-Type', 'text/plain');
		res.end('You are already authenticated!');
	}
});

userRouter.get('/logout', (req, res) => {
	if (req.session) {
/*
		req.session.destroy();
		res.clearCookie('session-id');
		res.redirect('/logout.html');
*/
		req.session.destroy((err) => {
			if (err) {
				next(err);
			} else {
				// 'session-id' = sessionOptions.name
				res.clearCookie('session-id');
				res.redirect('/logout.html');
				console.log("You are correctly logged out");
			}
		});
	} else {
		console.log("You are not logged in");
		var err = new Error('You are not logged in!');
		err.status = statusForbidden;
		next(err);
	}
});

module.exports = userRouter;