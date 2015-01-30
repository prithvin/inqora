var express = require('express');
var router = express.Router();
router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:7888');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
function isSess (req) {
    if (req.session.UserId == null)
        return false;
    else if(req.session.UserId.length > 2)
        return true;
    else
        return false;
}

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
		if (req.session.UserId == "5446aefaf9d5d20200d592b8")
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


module.exports = router;
