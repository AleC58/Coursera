const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const protocol = "mongodb://";
const host = "localhost";
const port = "27017";
const dbName = "conFusion";
const url = protocol + host + ":" + port + "/" + dbName;

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
const connect = mongoose.connect(url);

connect.then(() => {
	console.log('Connected correctly to server');
	var newDish = Dishes({
		name: 'nome del piatto',
		description: 'test'
	});

	newDish.save()
		.then((dish) => {
			console.log(dish);
			return Dishes.find({});
		})
		.then((dishes) => {
			console.log(dishes);
			return Dishes.deleteMany({});
		})
		.then(() => {
			return mongoose.connection.close();
		})
		.then(() => {
			console.log("End");
		})
		.catch((err) => {
			console.log(err);
		});
});