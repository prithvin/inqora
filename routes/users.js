var express = require('express');
var router = express.Router();
router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:7888');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});



email = require('emailjs');
server  = email.server.connect({
    user: "prithvi@inqora.com",
    password:"earth2412",
   host:    "mail.inqora.com",
   port:26
});

function emailsend (messagebody, messageattachment, toname, toemail) {
	
	var message = {
   		text: messagebody,
   		from: "Prithvi Narasimhan <prithvi@inqora.com>",
   		to: toname + " <" + toemail +  ">",
   		subject: "Thank You for joining Inqora",
   		attachment: [{data:messageattachment, alternative: true}]
	};
	server.send(message, function(err, message) { console.log(err); console.log(message);  });
}


router.get('/notifications', function(req, res) {
	users.findOne({_id: req.session.UserId}, function (err, data) {
		if (data == null) {
			res.send("Error. Not in session");
		}
		else {
			res.send(data.Notifications);
		}
	});
});

router.post('/authenticate', function(req,res) {
	var password = req.body.Password;
	var user = req.body.User.trim().toLowerCase();
	var regex = new RegExp(["^",user,"$"].join(""),"i");
	var str = "Username";
	if (user.indexOf("@") != -1) 
		str = 'Email';
	users.findOne({$or: [{"Username":regex, 'Password' : password},{"Email":regex, 'Password' : password}]}, function(err, results) {
		if (results == null) 
			res.send("Username/email or password invalid.");
		else if (results.Verified == false) 
			res.send("Please verify your email address.");
		else {
			res.send("Successfully authenticated");
			req.session.UserId = results._id;
			req.session.save(); 
		}
	});
}); 

router.get('/verify/:userid', function(req, res){ 
	users.findOne({_id: req.params.userid}, function (err, data) {
		if (data == null)
			res.send("Error, account does not exist");
		else {
			users.update({_id: req.params.userid}, {$set: {Verified : true}}, function (err, up) {
				if (up == 0)
					res.send("Sorry, error occured. Please try again later");
				else
					res.send("Account verified. Login to continue!")
			});
		}
	});
});

router.post('/create', function(req, res) {
	var picture = req.body.URL;
	var arrfollow = ["inqora"];
	if (req.body.InvitedBy != null)
		arrfollow.push(req.body.InvitedBy);
	if (req.body.URL == null || req.body.URL.length < 10)
		picture = "default.png";

	var newuser = new users ({
		Type: "User",
		Name: req.body.Name.trim(),
		Username: req.body.Username.trim().toLowerCase(),
		Email: req.body.Email.trim().toLowerCase(),
		Password: req.body.Password,
		Verified: false,
		FollowingAccs: {
			Users: arrfollow,
			Companies: [],
			Groups: []
		},
		Points: {
			LastCalculated: 0, 
			NumPoints: 5
		},
		InvitesUsed:  0,
		StockFollowing: [],
		Thumbnail: req.body.Thumbnail,
		Picture: req.body.URL,
		Followers: [],
		Notifications: {
			WhoJoined: [],
			NewFollowers: [],
			TaggedInPostOrComment: [],
			ActivePosts: []
		},
		Messaging: []
	});
	newuser.pre("save", function(next) {
		users.findOne({$or: [{Email: req.body.Email}, {Username: req.body.Username}]}, function (err,results) {
			if (results == null)
				next();
			else  {
				if (req.body.Email == results.Email)
					res.send("Email already in use");
				else if( req.body.Useranem == results.Username) 
					res.send("Username already in use");
			}
		});
	});
	newuser.save(function (err) {
		console.log("IM HERE");
		if (err)
			return res.send(error.message);
		else {
			if(arrfollow.length > 1) {
				var inviteduser = {
					Username: newuser.Username,
					Name: newuser.Name,
					isNew: true,
					TimeAdded: new Date().getTime()
				};
				users.update({_id: req.body.InvitedBy}, {$push : {'Notifications.WhoJoined' : inviteduser}}, function (err, up) {
					if (up == 1)
						return res.send("Account successfully created");
					else if (up == 0)
						return res.send("Account successfully created. The user who invited you does not exist.");
				});
			}
			else 
				return res.send("Account successfully created")
		}
	});
	
	var body = "Dear " + req.body.Name + ",\nThank you for joining Inqora!<br>Inqora is the premier investment social";
	body = body + "network, and our amazing collaborative platform will help you invest better.\nYour username is "
	body = body +  req.body.Username+"\nYour password is " + req.body.Password + "\n Thank you!";

	var attachment = "<h1>Welcome to Inqora&nbsp;</h1><p>Hi " + req.body.Name + ",</p><p>We are pleased that";
	attachment += " you have agreed to act as a Beta Test Site for Inqora.</p><p>Here&rsquo;s a quick snippet";
	attachment += " of what Inqora is and what we represent:</p><p>Inqora is a user contributed collaborative network";
	attachment += "&nbsp;aimed at helping investors connect with relevant &nbsp;information through our state of the";
	attachment += " art personalization system. We view investing as a knowledge centric activity, in which &nbsp;the";
	attachment += " investor can make the best decision by having access to diverse perspectives. Our goal is to personify"; 
	attachment += " our motto of &ldquo;Invest wisely. Invest together.&rdquo; by helping our users, investors, aggregate";
	attachment += " the entire spectrum of investment topics into a central hub.</p><p>Upon completion of the Beta Test, ";
	attachment += "we believe that Inqora will provide exciting new capabilities that will further enhance the value of your";
	attachment += " online investing experience</p><p>. &nbsp;Test results indicate that the product is ready for actual Beta Test";
	attachment += " in a customer environment where we can gather data on how the product operates at full traffic load and identify";
	attachment += " and undiscovered problems.</p><p>Normally, the test requires 1 week of Beta Testing at the customer&rsquo;s";
	attachment += " site. &nbsp;During the trial, Inqora will coordinate and provide assistance to your distributor to insure the";
	attachment += " best possible service while accomplishing the goals of the test. We hope Inqora&nbsp;can be something of value to";
	attachment += " your daily investing experience.<br>On a second note, please verify your email at "; 
	attachment += "<a href='http://localhost:7888/verify/" + newuser._id + "'> Here</a></p><p>-Inqora Team</p><p>Contact Prithvi at this email for bug reports!</p><p>";
	attachment += "<img src='http://www.inqora.com/logo.png' style='height:108px; width:200px' /></p>";

	emailsend(body, attachment, req.body.Name, req.body.Email);
	
});

router.post('/forget', function(req,res) {
	var email = req.body.Email;
	users.findOne({Email: email}, function (err, results) {
		if (results == null)
			res.send("Email does not match any accounts");
		else {
			res.send("Good");
			var password = randomstring(8);
			users.update({'Email': req.body.Email.trim().toLowerCase()}, {$set: {'Password': password}}, function (err, up) { });
			var message = {
		   		text:    "Your new password is: " + password,
		   		from:    "Prithvi Narasimhan <prithvi@inqora.com>", 
		   		to:      results.Name + " <" + req.body.Email +  ">",
		   		subject: "Password Reset",
		   		attachment: [{data:"Your new password is: " + password + "<br> Please login in to your account and change your password.", alternative: true}]
			};
			server.send(message, function(err, message) { console.log(err); console.log(message);  });
		}
	});
});

function randomstring(L){
    var s= '';
    var randomchar=function(){
    	var n= Math.floor(Math.random()*62);
    	if(n<10) return n; //1-10
    	if(n<36) return String.fromCharCode(n+55); //A-Z
    	return String.fromCharCode(n+61); //a-z
    }
    while(s.length< L) s+= randomchar();
    return s;
}


module.exports = router;
