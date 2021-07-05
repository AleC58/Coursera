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
mongoose.set('useFindAndModify', false);
const connect = mongoose.connect(url);

connect.then(() => {
	console.log('Connected correctly to server');
	var newDish = Dishes({
		name: 'nome del piatto',
		description: 'test'
	});

	Dishes.create(newDish)
		.then((dish) => {
			console.log("------\nDish created:\n" + dish);
			return Dishes.findByIdAndUpdate(dish._id, {
					$set: {
						description: 'Updated test'
					}
				}, {
					new: true
				})
				.exec();
		})
		.then((dish) => {
			console.log("------\nDish updated:\n" + dish);
			dish.comments.push({
				rating: 5,
				comment: 'I\'m getting a sinking feeling!',
				author: 'Leonardo di Carpaccio'
			});
			return dish.save();
		})
		.then((dish) => {
			console.log("------\nDish updated with comments:\n" + dish);
			return Dishes.deleteMany({});
		})
		.then(() => {
			console.log("------\nDishes collection empty\n");
			return mongoose.connection.close();
		})
		.then(() => {
			console.log("End");
		})
		.catch((err) => {
			console.log(err);
		});
	});