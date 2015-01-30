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

router.get('/getpost', function (req, res) {
	if(isSess (req)) {
		var postid = req.query.PostId;
		posts.findOne({_id: postid}, function (err, data) {
			if (data == null)
				res.send("Post does not exist");
			else {
				var post = {
					Title: data.Title,
					Content: data.Content,
					Tags: data.Tags,
					NetVotes: data.Votes.WhoUpvoted.length - data.Votes.WhoDownvoted.length,
					NumComments: data.Comments.length,
					PosterUsername: data.PosterUsername,
					PosterName: data.PosterName,
					TimePosted: data.Time,
					VoteStatus: 0
				};
				users.findOne({_id: req.session.UserId}, function (err, data2) {
					if (data.Votes.WhoDownvoted.indexOf(data2.Username) != -1)
						post.VoteStatus = -1;
					else if (data.Votes.WhoUpvoted.indexOf(data2.Username) != -1)
						post.VoteStatus = 1;

					res.send(post);
				});
			}
		});
	}
	else
		res.send("Error. Not in session");
});

router.get('/getcomments', function (req, res) {
	if(isSess (req)) {
		posts.findOne({_id: req.query.PostId}, "Comments" , function (err, data) {
			if (data == null)
				res.send("This post does not exist");
			else {
				var newarr = [];
				users.findOne({_id: req.session.UserId}, function (err, data2) {
					for (var x = 0; x < data.Comments.length; x++) {
						var obj = {
							PosterName : data.Comments[x].CreatorName,
							PosterUsername:  data.Comments[x].CreatorUsername,
							NetVotes: ( data.Comments[x].Votes.WhoUpvoted.length -  data.Comments[x].Votes.WhoDownvoted.length),
							Time:  data.Comments[x].Time,
							Content:  data.Comments[x].Content,
							Status: 0
						};
						if ( data.Comments[x].Votes.WhoUpvoted.indexOf(data2.Username) != -1)
							obj.Status =1;
						else if (data.Comments[x].Votes.WhoDownvoted.indexOf(data2.Username) != -1)
							obj.Status = -1;
						newarr.push(obj);
					}
					res.send(newarr);
				});
			}
		});
	}
	else
		res.send("Error. Not in session");
});

function getTags (words) {
    var tmplist = words.split(' ');
    var hashlist = [];
    var nonhashlist = [];
    for(var w in tmplist){
        if(tmplist[ w ].indexOf('@') == 0)
            hashlist.push(tmplist[ w ].substring(1));
        else
            nonhashlist.push(tmplist[ w ]);
    }
    return hashlist;
}
router.get('/newcomment', function (req, res) {
	if(isSess (req)) {
		posts.findOne({_id: req.query.PostId}, "Title" , function (err, data) {
			if (data == null)
				res.send("This post does not exist");
			else {
				users.findOne({_id: req.session.UserId}, "Name Username _id" ,function (err, data2) {
					var arr = getTags(req.query.Comment);
	                if (arr == null)
	                    arr = [];
	                arr.push(data2.Username);
					var obj = {
						Creator: data2._id,
						CreatorName : data2.Name,
						CreatorUsername:  data2.Username,
						Votes: {
					        WhoUpvoted: [],
					        WhoDownvoted: []
					    },
						Time:  (new Date()).getTime(),
						Content:  req.query.Comment,
						TagsDetected: arr
					};
					var objsend = {
						PosterName : obj.CreatorName,
						PosterUsername: obj.CreatorUsername,
						NetVotes: 0,
						Time:  obj.Time,
						Content:  obj.Content,
						Status: 0
					};
					if (data.Comments == null)
						var comments = 0;
					else
						comments = data.Comments.length;
					var objnotif = {
						CommentNum: comments,
						isNew: true,
						TitleOfPost: data.Title,
						PostId: data._id,
						WhoTagged: data2.Username
					};
					for (var x = 0; x < arr.length; x++) {
			        	if (arr[x] != data2.Username) {
			        		users.update({Username: arr[x]}, {$push: {'Notifications.TaggedInComment' : objnotif}}, function (err, up) {});
			        	}
			        }
					res.send(objsend);
					posts.update({_id: req.query.PostId}, {$push: {Comments: obj}}, function (err, up) {});
				});
			}
		});
	}
	else
		res.send("Error. Not in session");
});



router.get('/like', function (req, res) {
	if (isSess(req)) {
		posts.findOne({_id: req.query.PostId}, "Votes" , function (err, data) {
			if (data == null)
				res.send("Error. This post does not exist");
			else {
				users.findOne({_id: req.session.UserId}, "Username" , function (err, data2) {
					var username = data2.Username;
					if (data.Votes.WhoDownvoted.indexOf(username) != -1) {
						res.send("Changed downvote to upvote");
						posts.update({_id:req.query.PostId}, {$pull: {'Votes.WhoDownvoted' : data2.Username}}, function (err, up) {});
						posts.update({_id:req.query.PostId}, {$push: {'Votes.WhoUpvoted' : data2.Username}}, function (err, up) {});
					}
					else if (data.Votes.WhoUpvoted.indexOf(username) != -1) {
						res.send("Unupvoted post");
						posts.update({_id:req.query.PostId}, {$pull: {'Votes.WhoUpvoted' : data2.Username}}, function (err, up) {});
					}
					else {
						res.send("Upvoted");
						posts.update({_id:req.query.PostId}, {$push: {'Votes.WhoUpvoted' : data2.Username}}, function (err, up) {});
					}
				});
			}
		});
	}
	else {
		res.send("Error. Not in session");
	}
});

router.get('/dislike', function (req, res) {
	if (isSess(req)) {
		posts.findOne({_id: req.query.PostId}, "Votes" , function (err, data) {
			if (data == null)
				res.send("Error. This post does not exist");
			else {
				users.findOne({_id: req.session.UserId}, "Username" , function (err, data2) {
					var username = data2.Username;
					if (data.Votes.WhoUpvoted.indexOf(username) != -1) {
						res.send("Changed upvote to downvote");
						posts.update({_id:req.query.PostId}, {$pull: {'Votes.WhoUpvoted' : data2.Username}}, function (err, up) {});
						posts.update({_id:req.query.PostId}, {$push: {'Votes.WhoDownvoted' : data2.Username}}, function (err, up) {});
					}
					else if (data.Votes.WhoDownvoted.indexOf(username) != -1) {
						res.send("Un-Downvoted post");
						posts.update({_id:req.query.PostId}, {$pull: {'Votes.WhoDownvoted' : data2.Username}}, function (err, up) {});
					}
					else {
						res.send("Downvoted");
						posts.update({_id:req.query.PostId}, {$push: {'Votes.WhoDownvoted' : data2.Username}}, function (err, up) {});
					}
				});
			}
		});
	}
	else {
		res.send("Error. Not in session");
	}
});

router.get('/comment/like/:number', function(req,res){ 
	posts.findOne({_id :req.query.PostId}, "Comments" , function (err, data) {
		if (data == null)
			res.send("Post does not exist");
		else {
			users.findOne({_id: req.session.UserId}, "Username" , function (err, data2) {
				if (data2 == null) {
					res.send("Error. Not in session");
				}
				else {
					var username = data2.Username;
					if ((data.Comments.length-1) < req.params.number)
						res.send("Invalid comment");
					else {
						var commentarr = JSON.parse(JSON.stringify(data.Comments));
						var num = req.params.number;
						if (commentarr[num].Votes.WhoDownvoted.indexOf(username) != -1) {
							res.send("Changed downvote to upvote");
							commentarr[num].Votes.WhoDownvoted.splice(commentarr[num].Votes.WhoDownvoted.indexOf(username), 1);
							commentarr[num].Votes.WhoUpvoted.push(username);
						}
						else if (commentarr[num].Votes.WhoUpvoted.indexOf(username) != -1){
							res.send("Un-upvoted post");
							commentarr[num].Votes.WhoUpvoted.splice(commentarr[num].Votes.WhoUpvoted.indexOf(username), 1);
						}
						else {
							res.send("Upvoted");
							commentarr[num].Votes.WhoUpvoted.push(username);
						}
						posts.update({_id: req.query.PostId}, {$set: { Comments: commentarr }}, function (err, up) {});
					}
				}
			});
		}
	});
});

router.get('/comment/dislike/:number', function(req,res){ 
	posts.findOne({_id :req.query.PostId}, "Comments" , function (err, data) {
		if (data == null)
			res.send("Post does not exist");
		else {
			users.findOne({_id: req.session.UserId}, "Username" , function (err, data2) {
				if (data2 == null) {
					res.send("Error. Not in session");
				}
				else {
					var username = data2.Username;
					if ((data.Comments.length-1) < req.params.number)
						res.send("Invalid comment");
					else {
						var commentarr = JSON.parse(JSON.stringify(data.Comments));
						var num = req.params.number;
						if (commentarr[num].Votes.WhoUpvoted.indexOf(username) != -1) {
							res.send("Changed upvote to downvote");
							commentarr[num].Votes.WhoUpvoted.splice(commentarr[num].Votes.WhoUpvoted.indexOf(username), 1);
							commentarr[num].Votes.WhoDownvoted.push(username);
						}
						else if (commentarr[num].Votes.WhoDownvoted.indexOf(username) != -1){
							res.send("Un-downvoted post");
							commentarr[num].Votes.WhoDownvoted.splice(commentarr[num].Votes.WhoDownvoted.indexOf(username), 1);
						}
						else {
							res.send("Downvoted");
							commentarr[num].Votes.WhoDownvoted.push(username);
						}
						posts.update({_id: req.query.PostId}, {$set: { Comments: commentarr }}, function (err, up) {});
					}
				}
			});
		}
	});
});


router.post('/create/new', function (req, res) {
	users.findOne({_id: req.session.UserId}, function(err, data) {
        var d = new Date();
        var arr = getTags(req.body.Content).concat(req.body.Tags);
        if (arr == null)
            arr = [];
        arr.push(data.Username);
        var newpost = new posts ({
            Title: req.body.Title,
            Content: req.body.Content,
            PosterId: req.session.UserId,
            PosterName: data.Name,
            PosterUsername: data.Username,
            Votes: {
            	WhoDownvoted:[],
            	WhoUpvoted:[]
            },
            Time: d.getTime(),
            Tags: arr
        });
        newpost.save(function (err, product) {
            if (err)
                return res.send(error.message);
            else {
            	var obj = {
		        	WhoTagged: data.Username,
		        	PostTitle: req.body.Title,
		        	PostId: newpost._id,
		        	isNew: true
		        };
		        for (var x = 0; x < arr.length; x++) {
		        	if (arr[x] != data.Username) {
		        		users.update({Username: arr[x]}, {$push: {'Notifications.TaggedInPost' : obj}}, function (err, up) {});
		        	}
		        }
				return res.send(newpost._id)
           	}
        });
    });
});
 
module.exports = router;
