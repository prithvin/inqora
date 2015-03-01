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

router.get('/whoinvited', function (req, res){ 

});
router.get('/notifications', function(req, res) {
	users.findOne({_id: req.session.UserId}, function (err, data) {
		if (data == null) {
			res.send("Error. Not in session");
		}
		else {
			var arr = JSON.parse(JSON.stringify(data.Notifications));
			arr.NewMessages = [];
			var messaging = data.MessagingSystem;
			for (var key in messaging) {
				console.log(messaging[key].isNew);
				if (messaging[key].isNew == true) {
					arr.NewMessages.push(key)
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
			NumPoints: 5,
        	BonusPoints: 0,
        	NumPointsRedeemed: 0
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
		var url = req.headers.host;
		if (req.headers.host.indexOf("http://") == -1)
			url = "http://" + url;
		var link = "<a href='" + url + "/users/verify/" + newuser._id + "' style='display: inline-block;-webkit-box-sizing: content-box;-moz-box-sizing: content-box;box-sizing: content-box;cursor: pointer;  padding: 4px 26px;  border: 1px solid #018dc4;  -webkit-border-radius: 25px / 19px;  border-radius: 25px / 19px;  font: normal 16px/normal , Helvetica, sans-serif;  color: rgba(255,255,255,0.9);  -o-text-overflow: clip;  text-overflow: clip;  background: #0199d9;  -webkit-box-shadow: 0 0 11px 0 rgba(0,0,0,0.2) ;  box-shadow: 0 0 11px 0 rgba(0,0,0,0.2) ;  text-shadow: -1px -1px 0 rgba(0,97,255,0.66) ;  -webkit-transition: all 300ms cubic-bezier(0.42, 0, 0.58, 1);  -moz-transition: all 300ms cubic-bezier(0.42, 0, 0.58, 1);  -o-transition: all 300ms cubic-bezier(0.42, 0, 0.58, 1);  transition: all 300ms cubic-bezier(0.42, 0, 0.58, 1);'>Verify Email</a>";
		var relelink = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'> <html xmlns='http://www.w3.org/1999/xhtml'> <head> <meta http-equiv='Content-Type' content='text/html; charset=utf-8' /> <title>[SUBJECT]</title> <style type='text/css'> body { padding-top: 0 !important; padding-bottom: 0 !important; padding-top: 0 !important; padding-bottom: 0 !important; margin:0 !important; width: 100% !important; -webkit-text-size-adjust: 100% !important; -ms-text-size-adjust: 100% !important; -webkit-font-smoothing: antialiased !important; } .tableContent img { border: 0 !important; display: block !important; outline: none !important; } a{ color:#382F2E; } p, h1{ color:#382F2E; margin:0; } p{ text-align:left; color:#999999; font-size:14px; font-weight:normal; line-height:19px; } a.link1{ color:#382F2E; } a.link2{ font-size:16px; text-decoration:none; color:#ffffff; } h2{ text-align:left; color:#222222; font-size:19px; font-weight:normal; } div,p,ul,h1{ margin:0; } .bgBody{ background: #ffffff; } .bgItem{ background: #ffffff; } </style> <script type='colorScheme' class='swatch active'> { 'name':'Default', 'bgBody':'ffffff', 'link':'382F2E', 'color':'999999', 'bgItem':'ffffff', 'title':'222222' } </script> </head> <body paddingwidth='0' paddingheight='0' style='padding-top: 0; padding-bottom: 0; padding-top: 0; padding-bottom: 0; background-repeat: repeat; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased;' offset='0' toppadding='0' leftpadding='0'> <table width='100%' border='0' cellspacing='0' cellpadding='0' class='tableContent bgBody' align='center' style='font-family:Helvetica, Arial,serif;'> <tr><td height='35'></td></tr> <tr> <td> <table width='600' border='0' cellspacing='0' cellpadding='0' align='center' class='bgItem'> <tr> <td width='40'></td> <td width='520'> <table width='520' border='0' cellspacing='0' cellpadding='0' align='center'> <!-- =============================== Header ====================================== --> <tr><td height='75'></td></tr> <!-- =============================== Body ====================================== --> <tr> <td class='movableContentContainer ' valign='top'> <div class='movableContent'> <table width='520' border='0' cellspacing='0' cellpadding='0' align='center'> <tr> <td valign='top' align='center'> <div class='contentEditableContainer contentTextEditable'> <div class='contentEditable'> <p style='text-align:center;margin:0;font-family:Georgia,Time,sans-serif;font-size:26px;color:#222222;'>Welcome to Inqora</p> </div> </div> </td> </tr> </table> </div> <div class='movableContent'> <table width='520' border='0' cellspacing='0' cellpadding='0' align='center'> <tr> <td valign='top' align='center'> <div class='contentEditableContainer contentImageEditable'> <div class='contentEditable'> <img src='http://www.inqora.com/line.png' width='251' height='43' alt='' data-default='placeholder' data-max-width='560'> </div> </div> </td> </tr> </table> </div> <div class='movableContent'> <table width='520' border='0' cellspacing='0' cellpadding='0' align='center'> <tr><td height='55'></td></tr> <tr> <td align='left'> <div class='contentEditableContainer contentTextEditable'> <div class='contentEditable' align='center'> <h2 >Thanks for joining, " + req.body.Name + "! I cannot wait to hear your opinions on Inqora!</h2> </div> </div> </td> </tr> <tr><td height='15'> </td></tr> <tr> <td align='left'> <div class='contentEditableContainer contentTextEditable'> <div class='contentEditable' align='center'> <p > We are hard at work, developing new features and making your experience on Inqora better. <br><br> Whether you like to talk about the latest investment trends or about that 'hot' new industry, Inqora is definitely the right place for you! <br><br>Even if you are still learning about investment, the discussions and guidance from Inqora will help you on your investment journey!<br><br> So hop on now, and discuss your favorite companies, including everything from <a href='http://www.inqora.com/companypage.html?id=AAPL'>@AAPL (Apple)</a> or <a href='http://www.inqora.com/company.html?id=ZTS'>@ZTS (Zoetis)</a>, Inqora has got you covered!<br><br> I look forward to discussing your favorite investment topics on Inqora. And if you plan on beating your peers in our online stock-trading game, may the odds be ever in your favor ;).<br><br> Regards, <br><br> Prithvi Narasimhan - Co-Founder/CTO<br><br> <a href='http://www.inqora.com'>http://www.inqora.com</a> </p> </div> </div> </td> </tr> <tr><td height='55'></td></tr> <tr> <td align='center'> <table> <tr> <td align='center' bgcolor='#1A54BA' style='background:#1A54BA; padding:15px 18px;-webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px;'> <div class='contentEditableContainer contentTextEditable'> <div class='contentEditable' align='center'> " + link + " </div> </div> </td> </tr> </table> </td> </tr> <tr><td height='20'></td></tr> </table> </div> </td> </tr> <!-- =============================== footer ====================================== --> </table> </td> <td width='40'></td> </tr> </table> </td> </tr> <tr><td height='88'></td></tr> </table> </body> </html>";
		emailsend("", relelink, req.body.Name, req.body.Email);
		res.send("Account successfully created. Please check your email for verification");
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
					if (up == 1);
					//	return res.send("Account successfully created");
					else if (up == 0);
						//return res.send("Account successfully created. The user who invited you does not exist.");
				});
			}
			else  {
				//return res.send("Account successfully created");
			}
		}
	});
	
	


	
	
});

router.post('/resendverification', function( req, res) {
	users.findOne({_id: req.session.UserId}, function (err, data) {
		if (data == null)
			res.send("User does not exist");
		else {
			var attachment = "<h1>Welcome to Inqora&nbsp;</h1><p>Hi " + data.Username + ",</p><p>Please verify your email at "; 
			attachment += "<a href='" + req.headers.host + "/users/verify/" + req.session.UserId + "'> Here</a>";
			attachment += " or go to " + req.headers.host + "/users/verify/" + req.session.UserId + "! </p>";
			attachment +=  "<p>-Inqora Team</p><p>Contact Prithvi at this email for bug reports!</p><p>";
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
router.get('/getuser', function (req, res) {
	users.findOne({_id: req.session.UserId}, function (err, data) {
		if (data == null)
			res.send("Error. Not in session");
		else {
			res.send(data.Username);
		}
	});
});
module.exports = router;
