var express = require('express');
var router = express.Router();
var xss = require('xss');




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
			var arr = JSON.parse(JSON.stringify(data.Notifications));
			arr.NewMessages = [];
			for (var x = 0; x < data.Messaging.length; x++) {
				console.log(data.Messaging[x].New);
				if (data.Messaging[x].New == true) {
					arr.NewMessages.push(data.Messaging[x].PartnerId)
				}
			}
			var temp  = arr.PostUserCommentedOrPosted;
			var newarr = [];
			var parallelarray = [];
			for (var x =0; x < temp.length; x++) {
				if (parallelarray.indexOf(temp[x].PostId) == -1) {
					var obj = {
						TitleOfPost: xss(temp[x].TitleOfPost),
						PostId: temp[x].PostId,
						LastComment: temp[x].NumCommentsLast,
						CurrentLen: 0,
						LastCreator: ""
					};
					newarr.push(obj);
					parallelarray.push(temp[x].PostId);
				}
				else {
					if (newarr[parallelarray.indexOf(temp[x].PostId)].LastComment < temp[x].NumCommentsLast) {
						newarr[parallelarray.indexOf(temp[x].PostId)].LastComment  = temp[x].NumCommentsLast;
					}
				}
			}
			getPostLength(newarr, arr, 0, res,[]);
		}
	});
});

function getPostLength (newarr, arr, x, res, finarr) {
	if (x >= newarr.length) {
		arr.PostUserCommentedOrPosted = finarr;
		res.send(arr);
	}
	else {
		posts.findOne({_id : newarr[x].PostId}, "Comments", function (err, data) {
			if (data == null)
				getPostLength(newarr,arr, x+1, res, finarr);
			else {
				newarr[x].CurrentLen = data.Comments.length;
				console.log(data.Comments[data.Comments.length - 1]);
				if (data.Comments[data.Comments.length - 1] != null)
				newarr[x].LastCreator = data.Comments[data.Comments.length - 1].CreatorUsername;
				finarr.push(newarr[x]);
				getPostLength(newarr,arr, x+1, res, finarr);
			}
		});
	}
}

//TitleOfPost: xss(req.body.Title),
//PostId:newpost._id,
//NumCommentsLast: data.Comments.length + 1,
//wasComment: true

// get list of posts and username and update to last comment seen along with postid
	// just return postid to update



function unwrapStringOrNumber(obj) {
    return (obj instanceof Number || obj instanceof String 
            ? obj.valueOf() 
            : obj);
}
function areEquivalent(a, b) {
    a = unwrapStringOrNumber(a);
    b = unwrapStringOrNumber(b);
    if (a === b) return true; //e.g. a and b both null
    if (a === null || b === null || typeof (a) !== typeof (b)) return false;
    if (a instanceof Date) 
        return b instanceof Date && a.valueOf() === b.valueOf();
    if (typeof (a) !== "object") 
        return a == b; //for boolean, number, string, xml

    var newA = (a.areEquivalent_Eq_91_2_34 === undefined),
        newB = (b.areEquivalent_Eq_91_2_34 === undefined);
    try {
        if (newA) a.areEquivalent_Eq_91_2_34 = [];
        else if (a.areEquivalent_Eq_91_2_34.some(
            function (other) { return other === b; })) return true;
        if (newB) b.areEquivalent_Eq_91_2_34 = [];
        else if (b.areEquivalent_Eq_91_2_34.some(
            function (other) { return other === a; })) return true;
        a.areEquivalent_Eq_91_2_34.push(b);
        b.areEquivalent_Eq_91_2_34.push(a);

        var tmp = {};
        for (var prop in a) 
            if(prop != "areEquivalent_Eq_91_2_34") 
                tmp[prop] = null;
        for (var prop in b) 
            if (prop != "areEquivalent_Eq_91_2_34") 
                tmp[prop] = null;

        for (var prop in tmp) 
            if (!areEquivalent(a[prop], b[prop]))
                return false;
        return true;
    } finally {
        if (newA) delete a.areEquivalent_Eq_91_2_34;
        if (newB) delete b.areEquivalent_Eq_91_2_34;
    }
}
function isJSONSame (a,b) {
	var newdata = (JSON.stringify(a));
	var dataremove = (JSON.stringify(b));
	return areEquivalent(dataremove, newdata);
}

router.get('/removenotif', function (req, res) {
	users.findOne({_id: req.session.UserId}, function (err, data) {
		if (data == null)
			res.send("Error. Not in session");
		else {
			var dataremove = req.query.notifdata;
			var notiftype = req.query.notiftype;
			if (notiftype == "WhoJoined") {
				dataremove = JSON.parse(dataremove);
				var bigdata = JSON.parse(JSON.stringify(data.Notifications.WhoJoined));
				for (var x = 0; x < bigdata.length; x++) {
					if (isJSONSame (bigdata[x],dataremove)) 
						bigdata[x].isNew = false;
				}
				users.update({_id: req.session.UserId}, {$set: {'Notifications.WhoJoined' : bigdata}}, function (err,up) {res.send("DONE");});
			}
			else if (notiftype == "NewFollowers") {
				dataremove = JSON.parse(dataremove);
				var bigdata = JSON.parse(JSON.stringify(data.Notifications.NewFollowers));
				for (var x = 0; x < bigdata.length; x++) {
					if (isJSONSame (bigdata[x],dataremove)) 
						bigdata[x].isNew = false;
				}
				users.update({_id: req.session.UserId}, {$set: {'Notifications.NewFollowers' : bigdata}}, function (err,up) {res.send("DONE");});
			}
			else if (notiftype == "PostUserCommentedOrPosted") {
				posts.findOne({_id : dataremove}, "Comments" , function (err, data2) {
					if (data == null)
						res.send("Error. Post does not exist");
					else {
						var bigdata = JSON.parse(JSON.stringify(data.Notifications.PostUserCommentedOrPosted));
						for (var x = 0; x < bigdata.length; x++) {
							if (bigdata[x].PostId == dataremove) {
								console.log("HEYHEYHEY");
								bigdata[x].NumCommentsLast = data2.Comments.length;
							}
						}
						users.update({_id: req.session.UserId}, {$set: {'Notifications.PostUserCommentedOrPosted' : bigdata}}, function (err,up) {res.send("DONE");});
					}
				});
			}
			else if (notiftype == "TaggedInPost") {
				dataremove = JSON.parse(dataremove);
				var bigdata = data.Notifications.TaggedInPost;
				for (var x = 0; x < bigdata.length; x++) {
					if (isJSONSame (bigdata[x],dataremove)) {
						bigdata[x].isNew = false;
					}
				}
				users.update({_id: req.session.UserId}, {$set: {'Notifications.TaggedInPost' : bigdata}}, function (err,up) {res.send("DONE");});
			}
			else if (notiftype == "TaggedInComment") {
				dataremove = JSON.parse(dataremove);
				var bigdata = JSON.parse(JSON.stringify(data.Notifications.TaggedInComment));
				for (var x = 0; x < bigdata.length; x++) {
					if (isJSONSame (bigdata[x],dataremove)) 
						bigdata[x].isNew = false;
				}
				users.update({_id: req.session.UserId}, {$set: {'Notifications.TaggedInComment' : bigdata}}, function (err,up) {res.send("DONE");});
			}
			
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
		else {
			
			req.session.UserId = results._id;

			req.session.save(function () {
				res.send("Successfully authenticated");
			}); 
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
					res.send("<script>alert('Account verified. Login to continue!');</script>")
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
	attachment += "<a href='" + req.headers.host + "/users/verify/" + newuser._id + "'> Here</a></p><p>-Inqora Team</p><p>Contact Prithvi at this email for bug reports!</p><p>";
	attachment += "<img src='http://www.inqora.com/logo.png' style='height:108px; width:200px' /></p>";

	emailsend("", attachment, req.body.Name, req.body.Email);
	
});

router.post('/resendverification', function( req, res) {
	users.findOne({_id: req.session.UserId}, function (err, data) {
		if (data == null)
			res.send("User does not exist");
		else {
			var attachment = "<h1>Welcome to Inqora&nbsp;</h1><p>Hi " + data.Username + ",</p><p>Please verify your email at "; 
			attachment += "<a href='http://localhost:7888/users/verify/" + req.session.UserId + "'> Here</a></p><p>-Inqora Team</p><p>Contact Prithvi at this email for bug reports!</p><p>";
			attachment += "<img src='http://www.inqora.com/logo.png' style='height:108px; width:200px' /></p>";
			emailsend("", attachment, data.Name, data.Email);
			res.send("Success");
		}
	});
	
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
