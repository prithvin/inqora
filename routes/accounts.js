var express = require('express');
var router = express.Router();

var yahooFinance = require('yahoo-finance');


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

/*
	Invite other users		20 points
“Buy” Companies		0 - 10 based on S&P ranking beat (total average and average of S&P based on time periods whne it is bought)
Get followed by another user		3 points
Get likes on a post		1 points		
Get comments on your post	2 points per comment


Get likes on the comments	1 points per like

*/

router.get('/pointval' , function (req, res) {
	users.findOne({_id: req.session.UserId}, function (err, data) {
		if (data == null)
			res.send("Error. User not in session");
		else {
			var obj = {
				Invites: 0,
				StockFollowing: 0,
				FollowedBy: 0,
				NumPosts: 0,
				LikesOnPost: 0,
				CommentsOnPost: 0,
				NumCommentMade: 0,
				LikesOnMyComments:0
			};

			//How many invites
			obj.Invites =  data.Notifications.WhoJoined.length;

			//How many followers
			obj.FollowedBy = data.Followers.length;

			//How many likes and comments
			posts.find({PosterUsername: data.Username},function (err, data2) {
				if (data == null)
					console.log("Sorry, you made no posts");
				else {
					obj.NumPosts = data2.length;
					var commentcounter = 0;
					var likecounter = 0;
					for (var x= 0; x < data2.length; x++) {
						likecounter += data2[x].Votes.WhoUpvoted.length - data2[x].Votes.WhoDownvoted.length;
						commentcounter += data2[x].Comments.length;
					}
					obj.LikesOnPost= likecounter;
					obj.CommentsOnPost = commentcounter;

					var stuff = data.Notifications.PostUserCommentedOrPosted;
					var ids = [];
					for (var x =0;x  < stuff.length;x++) {
						if (stuff[x].wasComment == true)
							ids.push(stuff[x].PostId);
					}
					obj.NumCommentMade = ids.length;
					recursiveCheck(ids,obj, 0, 0, data, res);
					
				}
			});	
		}
	});
});


function recursiveCheck(ids, obj, x, numlikes, data, res) {
	if (x == ids.length) {
		console.log(numlikes);
		obj.LikesOnMyComments = numlikes;
		res.send(obj);
	}
	else {
		posts.findOne({_id: ids[x]}, function (err, data2) {
			if (data2 == null) {
				recursiveCheck(ids, obj, (x+1), numlikes, data, res);
			}
			else {
				for (var i =0; i < data2.Comments.length; i++) {
					if (data2.Comments[i].Creator == data._id) {
						numlikes += data2.Comments[i].Votes.WhoUpvoted.length -  data2.Comments[i].Votes.WhoDownvoted.length;
					}
				}
				recursiveCheck(ids, obj, (x+1), numlikes, data, res);
			}
		});
	}
}


module.exports = router;
