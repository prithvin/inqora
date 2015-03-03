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

router.post('/newpost/', function (req, res) {
	var usernameofposter = req.body.UsernameOfPoster;
	var timeposted = req.body.TimeString;
	var title = req.body.Title;
	var content = req.body.Content;
	var whoupvoted = req.body.WhoUpVoted;
	var whodownvoted = req.body.WhoDownVoted;
	var tags = req.body.Tags;

	users.findOne({'Username' : usernameofposter}, function(err, data) {
		if (data ==null)
			res.send("Error. Not in session");
		else {
	        var temp = getTags(content);
	        if (temp == null)
	        	temp = [];
	        var temp2 = tags;
	        if (temp2 == null)
	        	temp2 = [];
	        var arr = temp.concat(temp2);
	        if (arr == null)
	            arr = [];
	        arr.push(data.Username);
	        var newpost = new posts ({
	            Title: xss(title),
	            Content: xss(content),
	            PosterId: data._id,
	            PosterName: data.Name,
	            PosterUsername: data.Username,
	            Votes: {
	            	WhoDownvoted:whoupvoted,
	            	WhoUpvoted:whodownvoted
	            },
	            Time: timeposted,
	            Tags: arr
	        });
	        newpost.save(function (err, product) {
	            if (err)
	                return res.send(err.message);
	            else {
	            	var obj = {
			        	WhoTagged: data.Username,
			        	PostTitle: xss(title),
			        	PostId: newpost._id,
			        	isNew: true
			        };
			        var notifobj = {
			        	TitleOfPost: xss(title),
						PostId:newpost._id,
						NumCommentsLast: 0,
						wasComment: false
			        };
			        users.update({'Username' : usernameofposter}, {$push: {'Notifications.PostUserCommentedOrPosted' : notifobj}}, function (err, up) {});
			        for (var x = 0; x < arr.length; x++) {
			        	if (arr[x] != data.Username) {
			        		users.update({Username: arr[x]}, {$push: {'Notifications.TaggedInPost' : obj}}, function (err, up) {});
			        	}
			        }
					return res.send(newpost._id)
	           	}
	        });
	     }
    });
});

router.get('/newcomment/', function (req, res) {
	var usernameofposter = req.query.UsernameOfPoster;
	var postid = req.query.PostId;
	var comment = req.query.Comment;
	var whoupvoted = req.query.WhoUpVoted;
	var whodownvoted = req.query.WhoDownVoted;
	var timeposted = req.query.TimeString;

	posts.findOne({_id: postid}, "Title Comments" , function (err, data) {
		if (data == null)
			res.send("This post does not exist");
		else {
			users.findOne({'Username' : usernameofposter}, "Name Username _id" ,function (err, data2) {
				var arr = getTags(comment);
                if (arr == null)
                    arr = [];
                arr.push(data2.Username);
				var obj = {
					Creator: data2._id,
					CreatorName : data2.Name,
					CreatorUsername:  data2.Username,
					Votes: {
				        WhoUpvoted: whoupvoted,
				        WhoDownvoted: whodownvoted
				    },
					Time:  timeposted,
					Content:  xss(comment),
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
					PostId:postid,
					NumCommentsLast: data.Comments.length + 1,
					wasComment: true
		        };

		       users.update({'Username' : usernameofposter}, {$push: {'Notifications.PostUserCommentedOrPosted' : notifobj}}, function (err, up) {});

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
				res.send(objsend);
				posts.update({_id: postid}, {$push: {Comments: obj}}, function (err, up) {});
			});
		}
	});
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

var extractor = require('unfluff');
var request = require('request');
var SummaryTool = require('node-summary');


router.get('/getdataplustitle', function (req, res) {
	posts.findOne({_id: "54e79f22ceb45e397ad4896d"} , function (err, data) {
		if (data == null)
			res.send("Database error");
		else if (data.Votes.WhoUpvoted.indexOf(req.query.URL.trim()) != -1)
			res.send("Error. URL already used");
		else {
			request({
				uri: req.query.URL,
			}, function(error, response, body) {
				data = extractor(body);
			
				var obj = {
					Title: data.title
				};
				request({'url':'http://www.tools4noobs.com/?action=ajax_summarize&theshold=70&min_sentence_length=50&min_word_length=4&url=' + req.query.URL,
				'proxy':'http://www.tools4noobs.com'}, function (error, response, body) {
					posts.update({_id: "54e79f22ceb45e397ad4896d"}, {$push: {'Votes.WhoUpvoted' : req.query.URL.trim()}}, function (err, up) {console.log(up);});
					if (!error && response.statusCode == 200) {
						obj.Summary = cleanIt(body);
						res.send(obj);
					}
				});
			});
		}
	});
});

router.get('/shorturl', function (req, res) {
	request({'url':'http://po.st/api/shorten?apiKey=B34EBF5C-8A4E-4CA1-B272-8C5DB6F50307&longUrl=' + req.query.URL,
	'proxy':'http://po.st'}, function (error, response, body) {
		res.send(JSON.parse(body).short_url);
	});
});


function cleanIt (string) {
var result = "";
while (string.indexOf("<li>") != -1) {
result += string.substring(string.indexOf("<li>") + 4, string.indexOf("</li>")) +  " ";
string = string.substring(string.indexOf("</li>") + 5);
}
return result.toString().replace(new RegExp("&amp;quot;", 'g') , "'");
}

router.get('/getindustry', function (req, res) {
	companies.findOne({UserId: req.query.Name}, function (err, data) {
		if (data == null)
			res.send("Error. Company does not exist");
		else {
			res.send(data.Industry.toUpperCase().replace(new RegExp(" ", 'g') , "_").replace(new RegExp("&amp;", 'g') , "and"));
		}
	});
});



module.exports = router;