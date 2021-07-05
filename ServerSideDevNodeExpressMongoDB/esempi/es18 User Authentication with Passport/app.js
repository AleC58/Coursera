var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const mongoose = require('mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require("passport");
var authenticate = require("./authenticate");

var userRouter = require('./routes/userRouter');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const protocol = "mongodb://";
const host = "localhost";
const port = "27017";
const dbName = "conFusion";
const url = protocol + host + ":" + port + "/" + dbName;

const statusOK = 200;
const statusCreated = 201;
const statusUnauthorized = 401;
const statusForbidden = 403;
const statusNotFound = 404;
const statusNotAllowed = 405;
const statusNotImplemented = 501;

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
const connect = mongoose.connect(url);
connect.then(() => {
	console.log('Connected correctly to server');
}, (err) => {
	console.log(err);
});

var app = express();

// 'XX-lsn.1958' è la chiave privata usata dal server per crittare i dati
// (viene usata la crittografia a chiave pubblica/privata)
var sessionOptions = {
	name: 'session-id',
	secret: 'XX-lsn.1958',
	saveUninitialized: false,
	resave: false,
	store: new FileStore({logFn: function(){}}) // evita il log degli errori/warning sullo store
};
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

// questi path sono sempre accessibili, anche senza autenticazione
app.use('/users', userRouter);
//app.use('/', indexRouter);
app.use(express.static(path.join(__dirname, 'public')));

// NB: il nome authenticate NON funziona!!!
function auth (req, res, next) {
	console.log("function auth");
	if (!req.user) {
		var err = new Error('You are not authenticated!');
		err.status = statusUnauthorized;
		return next(err);
	} else {
		return next();
	}
}

app.use(auth);
//da questo punto in poi non viene eseguito nulla a meno che l'utente non sia autenticato
//---------------------------------------------------------------------------------------

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	console.log("catch 404")
	next(createError(statusNotFound));
});

// error handler
app.use(function (err, req, res, next) {
	console.log("+*+* --> ERROR HANDLER - cod: " + err.status + " msg: " + err.message)
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
