var cost = require("./costanti");
var config = require('./config');
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

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
const connect = mongoose.connect(config.mongoURL);
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
	next(createError(cost.statusNotFound));
});

// error handler
app.use(function (err, req, res, next) {
	console.log("+*+* --> ERROR HANDLER - cod: " + err.status + " msg: " + err.message)
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || cost.statusInternalServerError);
	res.render('error');
});

module.exports = app;
