var cost = require("../costanti");
var express = require('express');
var User = require('../models/user');
var passport = require("passport");
var authenticate = require('../authenticate');

var userRouter = express.Router();

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
			err.statusCode = cost.statusInternalServerError;
			err.status = cost.statusInternalServerError;
			res.setHeader('Content-Type', 'application/json');
			res.json({err: err});
		} else {
			passport.authenticate("local") (req, res, () => {
				res.statusCode = cost.statusOK;
				res.setHeader('Content-Type', 'application/json');
				res.json({success: true, status: 'Registration successful!'});			
			});
		}
	})
});

// passport.authenticate("local") gestisce automaticamente gli errori, e nel caso
// invia una risposta al client; in caso di successo viene eseguita la
// callback (3° parametro del .post)
userRouter.post('/login', passport.authenticate("local"), (req, res) => {
/*
	Per funzionare, il POST si deve inviare con
	- Authoriztion: Type: none (se ha Basic auth viene impostato il campo Set-Cookie nell'header dela risposta); 
	- Body: Username: [nomeUtente]; Password: [password]
	Nella risposta, tra le altre cose, restituisce un token:
	bisogna copiare il valore del token, che ci serve per tutte le successive richieste
	che richiedono autenticazione	(è possibile vedere il valore "decrittato sul sito jwt.io").
	Ogni richiesta che richiede autenticazione si deve fare aggiungendo nell'header
	la chiave "Authorization" con valore "bearer [il valore del token]"
	(perché in authenticate.js abbiamo messo l'opzione fromAuthHeaderAsBearerToken)
*/
	console.log("post on login");
	var token = authenticate.getToken({_id: req.user._id});
	res.statusCode = cost.statusOK;
	res.setHeader('Content-Type', 'application/json');
	res.json({
		success: true,
		token: token,
		status: 'You are successfully logged in!'
	});
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
	}
});

module.exports = userRouter;