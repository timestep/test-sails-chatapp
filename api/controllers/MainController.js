var MainController = {
	index: function (req,res){
		res.view();	
	},
	signup: function(req,res){
		var username = req.param("username");
		var password = req.param("password");
		//console.log(username,password);	
		Users.findOneByUsername(username).done(function(err,usr){
			if(err){
				console.log(err);
				console.log('problem officer');
				res.set('error','DB error');
				res.send(500, { error: "DB Error" });
			} else if (usr) {
				console.log(usr);
				res.set('error','Username already Taken');
				res.send(400, { error: "Username already Taken" });
			} else {
				var hasher = require("password-hash");
				password = hasher.generate(password);

				Users.create({username: username, password: password})
				    .done(function(error,user){
					    if(error){
						res.set('error','DB Error');
						res.send(500, {error: "DB Error"});
					    } else {
						    req.session.user = user;
						    req.send(user);
					    }
				});
			}
		});	
	},
	login: function(req,res){
		var username = req.param("username");
		var password = req.param("password");

		Users.findOneByUsername(username).done(function(err,usr){
			if(err){
				res.send(500, { error: "DB Error" });
			} else {
				if (usr) {
					var hasher = require("password-hash");
					//if (hasher.verify(password, usr.password)){
					if (password === usr.password){
						req.session.user = usr;
						res.send(usr);
					} else {
						res.send(400, { error: "Wrong Password" });
					}
				} else {
					res.send(404, { error: "User not Found"});
				}
			}
		});	
	},
	chat: function(req,res){
		if(req.session.user){
			res.view({username:req.session.user.username});
		} else {
			res.redirect('/');
		}
	}
};
module.exports = MainController;
