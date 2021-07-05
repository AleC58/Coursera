const protocol = "mongodb://";
const host = "localhost";
const port = "27017";
const dbName = "conFusion";
const mongoURL = protocol + host + ":" + port + "/" + dbName;

module.exports = {
	"secretKey": '12345-67890-09876-54321',
	"mongoURL": mongoURL
}