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

function authenticate(req, res, next) {
	console.log(req.headers);
	var authHeader = req.headers.authorization;
	if (!authHeader) {
		var err = new Error('You are not authenticated!');
		res.setHeader('WWW-Authenticate', 'Basic');
		err.status = statusUnauthorized;
		return next(err);
	}
	// recupera username e passwor dal campo authorization dell'header
	var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
	var user = auth[0];
	var pass = auth[1];
	if (user == 'admin' && pass == 'password') { //ad es.
		next(); // authorized
	} else {
		var err = new Error('You are not authenticated!');
		res.setHeader('WWW-Authenticate', 'Basic');
		err.status = statusUnauthorized;
		return next(err);
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
