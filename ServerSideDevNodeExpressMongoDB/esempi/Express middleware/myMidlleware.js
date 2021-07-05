function mid1(req, res, next) {
	console.log("mid1 start");
	req.myMewProperty = "Alex";
	next();
	console.log("mid1 end");
}
	console.log("mid2 start");
function mid2(req, res, next) {
	req.myMewProperty += " bis";
	next();
	console.log("mid2 end");
}
