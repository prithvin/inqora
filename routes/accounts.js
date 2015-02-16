var express = require('express');
var router = express.Router();

function isSess (req) {
    if (req.session.UserId == null)
        return false;
    else if(req.session.UserId.length > 2)
        return true;
    else
        return false;
}


router.get('/shareurlandwhoshared', function (req, res) {
	if (isSess(req)) {
		users.findOne({_id: req.session.UserId}, function (err, user) {
			
		});
	}
	else {
		res.send("Error. Not in session");
	}
});

router.post('/updateuser', function (req,res) {
	if (isSess(req)) {
		users.findOne({_id: req.session.UserId}, function(err, user) {
			if (user == null)
				res.send("Error, session not available");
			else if (user.Password == req.body.OldPassword) {
				var data = {};
				data['Password'] = req.body.EditPassword;
				users.findOne({Email: req.body.NewEmail.trim().toLowerCase()}, function (err, matchmail) {
					if (matchmail != null && matchmail.Username != user.Username)
						res.send("Email already registered");
					else {
						data['Email'] = req.body.NewEmail;
						data['Name'] = req.body.NewName;
						if (req.body.Picture.length > 5) {
							data['Picture'] = req.body.Picture;
							data['Thumbnail'] = req.body.Thumbnail;
						}
						users.update({'Email': user.Email.trim().toLowerCase()}, {$set: data}, function (err, up) { res.send("Success");});
					}
				});
			}
			else
				res.send("Re-enter your old password and try again");
		});
	}
});

router.get('/issess', function (req, res) {
	if (isSess(req)) {
		if (req.session.UserId == "54d4e26fa110200c00c9953c")
			res.send("demo");
		else 
			res.send("true");
	}
	else
		res.send("false");
});



router.get('/getsess', function(req,res) {
	if (isSess(req)) {
		users.findOne({_id: req.session.UserId},"Name Email Username Thumbnail Picture" ,function(err, user) {
			if (user != null)
				user.Password = "";
			res.send(user);
		});
	}
	else
		res.send("Invalid session");
});

router.get('/getuser', function (req, res) {
	var username = req.query.Username;
	users.findOne({Username: username}, "Name Username Points Picture", function (err, data) {
		if (data == null)
			res.send("User is not valid");
		else 
			res.send(data);
	});
});

router.get('/isverified', function (req, res) {
	users.findOne({_id : req.session.UserId}, "Verified", function (err, data) {
		if (data == null)
			res.send("User is not valid");
		else 
			if (data.Verified == true || data.Verified == "true")
				res.send("T");
			else
				res.send("N");
	});
});

router.get('/getuserprofile', function (req, res) {
	var username = req.query.Username;
	users.findOne({Username: username}, "Name Username Points Picture Followers", function (err, data) {
		if (data == null)
			res.send("User is not valid");
		else  {
			var newdata = JSON.parse(JSON.stringify(data));
			newdata.NumFollowers = data.Followers.length;
			users.findOne({_id: req.session.UserId}, function (err, data2) {
				if (data2 == null)
					res.send("Error. Not in session");
				else if(data2.FollowingAccs.Users != null && data2.FollowingAccs.Users.indexOf(username) != -1 ) {
					newdata.Subscribed = true;
					res.send(newdata);
				}
				else  {
					newdata.Subscribed = false;
					res.send(newdata);
				}
			});
		}
	});
});


module.exports = router;
