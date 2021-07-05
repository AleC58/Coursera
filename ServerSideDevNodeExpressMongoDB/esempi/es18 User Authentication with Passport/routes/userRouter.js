var express = require('express');
var User = require('../models/user');
var passport = require("passport");

var userRouter = express.Router();

const statusOK = 200;
const statusCreated = 201;
const statusUnauthorized = 401;
const statusForbidden = 403;
const statusNotFound = 404;
const statusNotAllowed = 405;
const statusInternalServerError = 500;
const statusNotImplemented = 501;

userRouter.use(express.json()); //Used to parse JSON bodies

userRouter.post('/signup', (req, res, next) => {
/*
	Per funzionare, il POST si deve inviare con
	- Authoriztion: type: none
	- Body: {"username": "[nomeUtente]", "password": "[password]"}
*/
	console.log("post on signup");
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
		if (err) {
			// vengono messi entrambi nel body della risposta;
			// comunque lo statusCode restituito è 200 (?)
			err.statusCode = statusInternalServerError;
			err.status = statusInternalServerError;
			res.setHeader('Content-Type', 'application/json');
			res.json({err: err});
		} else {
			passport.authenticate("local") (req, res, () => {
				res.statusCode = statusOK;
				res.setHeader('Content-Type', 'application/json');
				res.json({success: true, status: 'Registration successful!'});			
			});
		}
	})
});

// passport.authenticate("local") gestisce automaticamente gli errori, e nle caso
// invia una risposta al client; in caso di successo viene eseguita la
// callback (3° parametro del .post)
userRouter.post('/login', passport.authenticate("local"), (req, res) => {
/*
	Per funzionare, il POST si deve inviare con
	- Authoriztion: Type: none (se ha Basic auth viene impostato il campo Set-Cookie nell'header dela risposta); 
	- Body: Username: [nomeUtente]; Password: [password]
*/
	console.log("post on login");
	res.statusCode = statusOK;
	res.setHeader('Content-Type', 'application/json');
	res.json({success: true, status: 'Login successful!'});			
});

userRouter.get('/logout', (req, res) => {
	if (req.session) {
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