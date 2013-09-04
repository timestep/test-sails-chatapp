module.exports = function(res,req,next){
	console.log(req.session);
	setBreakpoint(), sb();
	//console.log(req);
	if (req.session.user){
		var action = req.target.action;
		if (action == "create"){
			req.body.userId = req.session.user.id;
			req.body.username = req.session.user.username;
		}
		next();
	} else {
		res.send("You Must be logged In", 403);
	}
};
