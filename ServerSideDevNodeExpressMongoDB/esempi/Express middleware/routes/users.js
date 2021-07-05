var cost = require('../costanti');
var express = require('express');
var userRouter = express.Router();

// prefisso: host:port/users
userRouter.route('/')
	.all((req, res, next) => {
		//res.setHeader('Content-Type', 'application/json');
		next();
	})
	.get((req, res, next) => {
		console.log("\n------------\nuserRouter.get start");
		console.log("req.headers:\n" + JSON.stringify(req.headers));
		for (const [key, value] of Object.entries(req.headers)) {
			console.log("- ", key, ": ", value);
		}
		console.log("req.header('User-Agent'): " + JSON.stringify(req.header('User-Agent')));
		console.log("req.header('User-Agent'): " + req.header('User-Agent'));
		var headerItems = [];
		for (const [key, value] of Object.entries(req.headers)) {
			var headerItem = {[key]: value};
			headerItems.push(headerItem);
		}
		res.write('qazwsx');
		res.send('ciclo req/res terminato');
		console.log("userRouter.get end\n");
	})
	.post((req, res, next) => {
		console.log("\n------------\nuserRouter.post start");
		res.send('ciclo req/res terminato');
		console.log("userRouter.post end\n");
	})
	.put((req, res, next) => {
		console.log("\n------------\nuserRouter.put start");
		res.send('ciclo req/res terminato');
		console.log("userRouter.put end\n");
	})
	.all((req, res, next) => {
		console.log("userRouter.all (finale) start");
		res.statusCode = cost.statusNotImplemented;
		res.end('Method ' + req.method + ' not implemented on ' + req.originalUrl)
});

module.exports = userRouter;
