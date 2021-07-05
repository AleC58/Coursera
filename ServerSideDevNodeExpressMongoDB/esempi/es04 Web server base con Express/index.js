/* Web server base in nodejs con Express.
   Serve le pagine statiche contenute in [rootProgetto]/public
	Se la pagina richiesta non esiste restituisce errore (cod. 404 + messaggio)
*/
const express = require('express');
const http = require('http');
const morgan = require('morgan');

const hostName = "localhost";
const port = "3000";
const statusOK = 200;
const statusNotFound = 404;
const htmlBodyTemplate = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head></head><body><h1>${msg}</h1></body></html>';
var msg;

const app = express();
//logga automaticamente info sulla console (in modalità 'dev'elopment)
app.use(morgan('dev'));
//serve automaticamente pagine statiche dalla dir. public sotto la root del progetto (__dirname)
//se la pagina richiesta non esiste serve per default la "pagina" di risposta
//definita dentro app.use((req, res, next))
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
	res.statusCode = statusNotFound;
	res.setHeader('Content-Type', 'text/html');
	msg = "This is an Express Server<br />";
	msg += "Error " + res.statusCode + " - file " + req.url + " not found";
	res.end(htmlBodyTemplate.replace("${msg}", msg));
});

const server = http.createServer(app);
server.listen(port, hostName, () => {
	console.log(`Server running at http://${hostName}:${port}/`);
});

