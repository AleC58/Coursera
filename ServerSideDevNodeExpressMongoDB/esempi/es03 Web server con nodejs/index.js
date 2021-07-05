const http = require('http');
const fs = require('fs');
const path = require('path');
const hostName = "localhost";
const port = "3000";
const statusOK = 200;
const statusNotFound = 404;
const statusInternalError = 500;
const statusNotImplemented = 501;
const bodyTemplate = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head></head><body><h1>${msg}</h1></body></html>';
var msg;

const httpServer = http.createServer((req, res) => {
	console.log("Request for " + req.url + " by method " + req.method);
	if (req.method == "GET") {
		var fileURL = req.url;
		if (fileURL == "/") {
			fileURL = "/index.html";
		}
		var filePath = path.resolve("./public" + fileURL);
		var fileExt = path.extname(fileURL);
		if (fileExt == ".html") {
			fs.access(filePath, fs.constants.F_OK, (err) => {
				if (err) {
					res.statusCode = statusNotFound;
					res.setHeader("Content-type", "text/html");
					msg = "Error " + res.statusCode + " - file " + fileURL + " not found";
					res.end(bodyTemplate.replace("${msg}", msg));
					return;		
				}
				//OK: file di tipo html e trovato: lo restituisco
				res.statusCode = statusOK;
				res.setHeader("content--type", "text/html");
				fs.createReadStream(filePath).pipe(res);
			})
		} else { //file non html
			res.statusCode = statusNotImplemented;
			res.setHeader("Content-type", "text/html");
			msg = "Error " + res.statusCode + " - file " + fileURL + ": file type not supported";
			res.end(bodyTemplate.replace("${msg}", msg));
			return;		
		}
	} else {  // metodo http non gestito
			res.statusCode = statusNotImplemented;
			res.setHeader("Content-type", "text/html");
			msg = "Error " + res.statusCode + " - HTTP method " + req.method + " not supported";
			res.end(bodyTemplate.replace("${msg}", msg));
			return;		
	}
});

httpServer.listen(port, hostName, () => {
	console.log(`Server running at http://${hostName}:${port}`)
});
