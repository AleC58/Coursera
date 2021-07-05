var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const mongoose = require('mongoose');
//const Dishes = require('./models/dishes');
const protocol = "mongodb://";
const host = "localhost";
const port = "27017";
const dbName = "conFusion";
const url = protocol + host + ":" + port + "/" + dbName;

const statusUnauthorized = 401;

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
app.use(cookieParser('XX-lsn.1958'));

function authenticate(req, res, next) {
/* 
-  return esce dalla function, ma lascia la richiesta pendente se non viene
	preceduto da un "next"
-	next(...);
	return;
	e
	return next(...);
	sono equivalenti
-  next() passa al middleware successivo
-  nwxt(err) passa al middleware di gestione degl ierrori
*/
	console.log(req.headers);
	var err = new Error('You are not authenticated!');
	err.status = statusUnauthorized;
	
	if (!req.signedCookies.user) {
		var authHeader = req.headers.authorization;
		if (!authHeader) {
			res.setHeader('WWW-Authenticate', 'Basic');
			return next(err);
		}
		// recupera username e passwor dal campo authorization dell'header
		var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
		var username = auth[0];
		var password = auth[1];
		if (username == 'admin' && password == 'password') { //es. di utente già presente
			res.cookie('user', username, {signed: true});
			next(); // authorized
		} else {
			err.message = "Bad username/password";
			res.setHeader('WWW-Authenticate', 'Basic');
			return next(err);
		}
	} else { // esiste req.signedCookies.user
		if (req.signedCookies.user === 'admin') {
			next();
		} else {
			err.message = "username does not exist";
			return next(err);
		}
	}
}

app.use(authenticate);
//da questo punto in poi non viene eseguito nulla a meno che l'utente non sia autenticato
//---------------------------------------------------------------------------------------

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
