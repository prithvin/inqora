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

/*
	Create posts			10 points
	Get likes on a post		3 points	
	Get comments on your post		5 points per comment

Comment on other posts 	1 ppoint
	Get likes on the comments THAT YOU MAKE (Notrandom user commenting on your psot)	5 points per like
Like other posts		1 point
Invite other users		100 points
Get followed by another user		15 points

“Buy” Companies		0 - 100 based on S&P ranking beat (total average and average of S&P based on time periods whne it is bought)


*/

router.get('/pointval' , function (req, res) {
	users.findOne({_id: req.session.UserId}, function (err, data) {
		pointstable = {
			PostCreatedByGivenUser: [], // In frotned, just link to user profile
			/*{
				PostId: 
				PostTitle: 
				NumComments:
				NetLikes: 
			}*/
			CommentOnOtherPosts: {}, // In frontend, just link to user "commented"
			/*
			PostId IS KEY
			PostTitle
			NumLikesOnComments
			*/
		};
		if (data == null)
			res.send("Error. User not in session");
		else {
			var posts = data.Notifications.PostUserCommentedOrPosted;
			var postsusermade = [];
			var postsusercommented = [];
			for (var x= 0; x < posts.length; x++) {
				if (posts[x].wasComment == false)
					postsusermade.push(posts[x].PostId);
				else 
					postsusercommented.push(posts[x].PostId);
			}
			getPostLikesAndCommentsLOL(postsusermade, 0, function (pointstable) {
				getWhoInteractedWithMyComments(postsusercommented, 0, pointstable, req.session.UserId,  function (){ 

				});
			}, pointstable); // gets recursively posts lieks and comments
		}
	});
});

function getWhoInteractedWithMyComments(arr, x, pointstable, sessionid, callback) {
	if (arr.length == x)
		callback(pointstable);
	else {
		posts.findOne({_id: arr[x]}, function (err, data) {
			if (pointstable.CommentOnOtherPosts[arr[x]] == null) {
				var obj = {
					PostId: arr[x],
					PostTitle: data.Title,
					NumLikesOnComments: 0
				};
				for (var i = 0; i < data.Comments.length; i++) {
					if (data.Comments[i].Creator == sessionid) {
						obj.NumLikesOnComments += (data.Comments[i].Votes.WhoUpvoted - data.Comments[i].Votes.WhoDownvoted);
					}
				}
			}
		});
	}
}

function getPostLikesAndCommentsLOL(arr, x, callback, pointstable) {
	if (arr.length == x)
		callback(pointstable);
	else {
		posts.findOne({_id: arr[x]}, function (err, data) {
			var obj = {
				PostId: arr[x],
				PostTitle: data.Title,
				NumComments: data.Comments.length,
				NetLikes: data.Votes.WhoUpvoted - data.Votes.WhoDownvoted
			};
			pointstable.push(obj);
			getPostLikesAndCommentsLOL(arr, x+1, callback, pointstable);
		});
	}
}



module.exports = router;
