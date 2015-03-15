var express = require('express');
var router = express.Router();
var xss = require('xss');


function isSess (req) {
    if (req.session.UserId == null)
        return false;
    else if(req.session.UserId.length > 2)
        return true;
    else
        return false;
}


router.get('/deletepost', function (req, res) {
	var badcomment = "S Rathinam Manohar is eating TKGL for lunch.";
	var postid = req.query.id;
	posts.findOne({_id: postid}, function (err, data) {
		if (data == null)
			res.send("Post doesnt exist..");
		else {
			posts.update({_id: postid}, {$set: {Title: badcomment}}, function (err, update) {
				res.send("Deleted post with title " + data.Title);
			})
		}
	});
});


router.get('/getpost', function (req, res) {
	if(isSess (req)) {
		var postid = req.query.PostId;
		posts.findOne({_id: postid}, function (err, data) {
			if (data == null)
				res.send("Post does not exist");
			else {
				var post = {
					Title: xss(data.Title),
					Content: xss(data.Content),
					Tags: data.Tags,
					NetVotes: data.Votes.WhoUpvoted.length - data.Votes.WhoDownvoted.length,
					NumComments: data.Comments.length,
					PosterUsername: data.PosterUsername,
					PosterName: data.PosterName,
					TimePosted: data.Time,
					VoteStatus: 0,
					Thumbnail: ""
				};
				users.findOne({_id: req.session.UserId}, function (err, data2) {
					if (data.Votes.WhoDownvoted.indexOf(data2.Username) != -1)
						post.VoteStatus = -1;
					else if (data.Votes.WhoUpvoted.indexOf(data2.Username) != -1)
						post.VoteStatus = 1;
					users.findOne({Username: data.PosterUsername}, "Thumbnail", function (err, data3) {
						post.Thumbnail = data3.Thumbnail;
						res.send(post);
					});
					
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
							Content:  xss(data.Comments[x].Content),
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
	if ( words.match(/@[\w]+(?=\s|$)/g) == null)
		return [];
	else {
		var arr = words.match(/@[\w]+(?=\s|$)/g);
		for (var x =0; x < arr.length; x++) {
			arr[x] = arr[x].substring(1);
		}
		return arr;
	}
}
router.get('/newcomment', function (req, res) {
	if(isSess (req)) {
		posts.findOne({_id: req.query.PostId}, "Title Comments" , function (err, data) {
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
						Content:  xss(req.query.Comment),
						TagsDetected: arr
					};
					var objsend = {
						PosterName : obj.CreatorName,
						PosterUsername: obj.CreatorUsername,
						NetVotes: 0,
						Time:  obj.Time,
						Content:  xss(obj.Content),
						Status: 0
					};
					var notifobj = {
			        	TitleOfPost: xss(data.Title),
						PostId:req.query.PostId,
						NumCommentsLast: data.Comments.length + 1,
						wasComment: true,
						CurrentLen: data.Comments.length + 1,
						LastCreator: ""
			        };

			       users.update({_id: req.session.UserId}, {$push: {'Notifications.PostUserCommentedOrPosted' : notifobj}}, function (err, up) {
			       		if (data.Comments == null)
							var comments = 0;
						else
							comments = data.Comments.length;
						
						var objnotif = {
							CommentNum: xss(comments),
							isNew: true,
							TitleOfPost: xss(data.Title),
							PostId: data._id,
							WhoTagged: data2.Username
						};
						for (var x = 0; x < arr.length; x++) {
				        	if (arr[x] != data2.Username) {
				        		users.update({Username: arr[x]}, {$push: {'Notifications.TaggedInComment' : objnotif}}, function (err, up) {});
				        	}
				        }
						
						posts.update({_id: req.query.PostId}, {$push: {Comments: obj}}, function (err, up) {
							users.update({"Notifications.PostUserCommentedOrPosted.PostId" : req.query.PostId}, {$set : {"Notifications.PostUserCommentedOrPosted.$.CurrentLen" : data.Comments.length + 1,  "Notifications.TaggedInComment.$.LastCreator" : data2.Username}} , function (err, up) {
								console.log(up);
								console.log("YOLO SAY NO NO ");
								res.send(objsend);
							});
							users.find({"Notifications.PostUserCommentedOrPosted.PostId" : req.query.PostId}, "Username",  function (err, same) {
								console.log("HEHEYSdfasfasdfadfasdfadfasdfadf");
								var str = "";
								for (var x = 0; x < same.length;x++) { 
									str+= same[x].Username + " ";
								}
								console.log(str);
							});
						});


			       });

					
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
		if (data ==null)
			res.send("Error. Not in session");
		else {
	        var d = new Date();
	        var temp = getTags(req.body.Content);
	        if (temp == null)
	        	temp = [];
	        var temp2 = req.body.Tags;
	        if (temp2 == null)
	        	temp2 = [];
	        var arr = temp.concat(temp2);
	        if (arr == null)
	            arr = [];
	       // console.log(arr);
	        arr.push(data.Username);
	       // console.log(data.Username);
	       // console.log(arr);
	        var newpost = new posts ({
	            Title: xss(req.body.Title),
	            Content: xss(req.body.Content),
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
			        	PostTitle: xss(req.body.Title),
			        	PostId: newpost._id,
			        	isNew: true
			        };
			        var notifobj = {
			        	TitleOfPost: xss(req.body.Title),
						PostId:newpost._id + '',
						NumCommentsLast: 0,
						wasComment: false,
						CurrentLen: 0,
						LastCreator: ""
			        };
			        users.update({_id: req.session.UserId}, {$push: {'Notifications.PostUserCommentedOrPosted' : notifobj}}, function (err, up) {
			        	 for (var x = 0; x < arr.length; x++) {
				        	if (arr[x] != data.Username) {
				        		users.update({Username: arr[x]}, {$push: {'Notifications.TaggedInPost' : obj}}, function (err, up) {});
				        	}
				        }
						return res.send(newpost._id)
			        });
			       
	           	}
	        });
	     }
    });
});
 
module.exports = router;
