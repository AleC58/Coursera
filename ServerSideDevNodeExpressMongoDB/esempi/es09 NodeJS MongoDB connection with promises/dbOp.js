/* I metodi del driver mongodb per NodeJS sono asincroni;
se non si usa il parametro callback  (come qui) restituiscono delle promises.
Questo permette di semplificare il codice evitando anche il fenomeno 
delle callback nidificate ("callback hell"): la struttura di index.js adesso
è molto più semplice dell'es. precedente
*/
const assert = require('assert');

exports.insertDocument = (db, document, collection, callback) => {
	const coll = db.collection(collection);
	return coll.insertOne(document);
};

exports.findDocuments = (db, collection, callback) => {
	const coll = db.collection(collection);
	return coll.find({}).toArray();
};

exports.updateDocument = (db, document, update, collection, callback) => {
	const coll = db.collection(collection);
	return coll.updateOne(document, {$set: update}, null);
};

exports.removeDocument = (db, document, collection, callback) => {
	const coll = db.collection(collection);
	return coll.deleteOne(document);
};