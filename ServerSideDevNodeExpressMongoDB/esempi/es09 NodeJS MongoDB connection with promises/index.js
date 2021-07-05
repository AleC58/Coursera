const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./dbOp');

const protocol = "mongodb://";
const host = "localhost";
const port = "27017";
const url = protocol + host + ":" + port + "/";
const dbname = 'conFusion';

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
	.then((client) => {
		console.log('Connected correctly to server');
		const db = client.db(dbname);
		const collection = db.collection("dishes");
		dboper.insertDocument(db, { name: "Vadonut", description: "Test" }, "dishes")
			.then((result) => {
				console.log("Insert Document:\n", result.ops);
				return dboper.findDocuments(db, "dishes")
			})
			.then((docs) => {
				console.log("Found Documents:\n", docs);
				return dboper.updateDocument(db, { name: "Vadonut" }, { description: "Updated Test" }, "dishes")
			})
			.then ((result) => {
				console.log("Updated Document:\n", result.result);
				return dboper.findDocuments(db, "dishes")
			})
			.then ((docs) => {
				console.log("Found Updated Documents:\n", docs);
				return db.dropCollection("dishes")
			})
			.then ((result) => {
				console.log("Dropped Collection: ", result);
				client.close();
			})
			.catch((err) => console.log(err));
		})
	.catch((err) => console.log(err));
