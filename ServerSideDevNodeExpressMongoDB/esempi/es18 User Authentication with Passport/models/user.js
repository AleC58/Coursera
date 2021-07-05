var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLM = require("passport-local-mongoose");

var User = new Schema({
	// username e password sono date da passport
	
	admin: {
		type: Boolean,
		default: false
	}
});

// il plugin fornisce i campi username e password per User;
// inoltre fornisce la memorizzazione crittata (hashed) della password
// e altri metodi che semplificano l'autenticazione
User.plugin(passportLM);

module.exports = mongoose.model('User', User);